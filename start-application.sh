#!/bin/bash

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

MODE="dev"
RESET=false
SHOW_CREDENTIALS=false
ASSUME_YES=false

SECRETS_DIR=".secrets"
ENV_FILE=".env"
ENV_TEMPLATE=".env.example"

POSTGRES_PASSWORD_SECRET="$SECRETS_DIR/postgres_password"
ADMIN_USERNAME_SECRET="$SECRETS_DIR/app_seed_admin_username"
ADMIN_PASSWORD_SECRET="$SECRETS_DIR/app_seed_admin_password"

usage() {
  cat <<'EOF'
Usage:
  ./start-application.sh [--dev|--prod] [options]

Modes:
  --dev                 Start development mode. Default.
                        Uses Vite dev server with hot reload.

  --prod                Start production mode.
                        Uses nginx serving the optimized frontend build.

Options:
  --reset               Stop containers, remove Docker volumes, delete local
                        .env and .secrets/, then recreate configuration.

  -y, --yes             Do not ask interactive questions.
                        Useful for CI/CD.
                        Missing credentials are generated automatically.

  --show-credentials    Print the local seed admin credentials and exit.
                        Use with care. Do not run this in CI logs.

  -h, --help            Show this help message.

Examples:
  ./start-application.sh
  ./start-application.sh --dev
  ./start-application.sh --prod
  ./start-application.sh --reset --dev
  ./start-application.sh --reset --prod --yes
  ./start-application.sh --show-credentials

Notes:
  The script creates local configuration automatically:
    .env
    .secrets/postgres_password
    .secrets/app_seed_admin_username
    .secrets/app_seed_admin_password

  Secrets are not printed during normal startup and must not be committed.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dev)
      MODE="dev"
      shift
      ;;
    --prod)
      MODE="prod"
      shift
      ;;
    --reset)
      RESET=true
      shift
      ;;
    -y|--yes)
      ASSUME_YES=true
      shift
      ;;
    --show-credentials)
      SHOW_CREDENTIALS=true
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo ""
      usage
      exit 1
      ;;
  esac
done

require_command() {
  local command_name="$1"

  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Error: Required command '$command_name' is not installed or not available in PATH."
    exit 1
  fi
}

is_interactive() {
  [[ -t 0 && -t 1 && "${CI:-}" != "true" && "$ASSUME_YES" != "true" ]]
}

read_env_value() {
  local key="$1"

  if [[ ! -f "$ENV_FILE" ]]; then
    return 0
  fi

  grep -E "^${key}=" "$ENV_FILE" 2>/dev/null | tail -n1 | cut -d '=' -f2-
}

read_secret() {
  local file="$1"

  if [[ ! -f "$file" ]]; then
    return 1
  fi

  tr -d '\r\n' < "$file"
}

write_secret() {
  local file="$1"
  local value="$2"

  printf "%s" "$value" > "$file"
  chmod 600 "$file" 2>/dev/null || true
}

random_chars() {
  local chars="$1"
  local length="$2"

  LC_ALL=C tr -dc "$chars" < /dev/urandom | head -c "$length"
}

generate_password() {
  local lower
  local upper
  local digit
  local special
  local rest

  lower="$(random_chars 'a-z' 6)"
  upper="$(random_chars 'A-Z' 6)"
  digit="$(random_chars '0-9' 6)"
  special="$(random_chars '@_%+=:,.!?-' 4)"
  rest="$(random_chars 'A-Za-z0-9@_%+=:,.!?-' 10)"

  printf "%s%s%s%s%s" "$lower" "$upper" "$digit" "$special" "$rest"
}

validate_username() {
  local username="$1"

  if [[ ! "$username" =~ ^[A-Za-z0-9._-]{3,64}$ ]]; then
    echo "Username must be 3-64 characters long and may only contain letters, numbers, dot, underscore, and hyphen."
    return 1
  fi

  return 0
}

validate_password() {
  local password="$1"

  if [[ ${#password} -lt 20 ]]; then
    echo "Password must be at least 20 characters long."
    return 1
  fi

  if [[ ${#password} -gt 128 ]]; then
    echo "Password must not be longer than 128 characters."
    return 1
  fi

  if [[ "$password" =~ [[:space:]] ]]; then
    echo "Password must not contain whitespace."
    return 1
  fi

  if [[ ! "$password" =~ ^[A-Za-z0-9@_%+=:,.!?-]+$ ]]; then
    echo "Password contains unsupported characters."
    echo "Allowed special characters: @ _ % + = : , . ! ? -"
    return 1
  fi

  if [[ ! "$password" =~ [a-z] ]]; then
    echo "Password must contain at least one lowercase letter."
    return 1
  fi

  if [[ ! "$password" =~ [A-Z] ]]; then
    echo "Password must contain at least one uppercase letter."
    return 1
  fi

  if [[ ! "$password" =~ [0-9] ]]; then
    echo "Password must contain at least one number."
    return 1
  fi

  if [[ ! "$password" =~ [@_%+=:,.!?-] ]]; then
    echo "Password must contain at least one special character."
    echo "Allowed special characters: @ _ % + = : , . ! ? -"
    return 1
  fi

  return 0
}

generate_valid_password() {
  local password

  for _ in {1..20}; do
    password="$(generate_password)"

    if validate_password "$password" >/dev/null 2>&1; then
      printf "%s" "$password"
      return 0
    fi
  done

  echo "Error: Could not generate a valid password." >&2
  echo "This indicates an internal script error." >&2
  exit 1
}

validate_existing_secret_or_exit() {
  local file="$1"
  local type="$2"
  local value

  if [[ ! -f "$file" ]]; then
    echo "Error: Missing secret file: $file"
    echo "Run './start-application.sh --reset' to recreate local configuration."
    exit 1
  fi

  value="$(read_secret "$file")"

  case "$type" in
    username)
      if ! validate_username "$value"; then
        echo "Invalid secret file: $file"
        echo "Fix this file manually or run './start-application.sh --reset'."
        exit 1
      fi
      ;;
    password)
      if ! validate_password "$value"; then
        echo "Invalid secret file: $file"
        echo "Fix this file manually or run './start-application.sh --reset'."
        exit 1
      fi
      ;;
    *)
      echo "Internal error: unknown secret validation type '$type'."
      exit 1
      ;;
  esac
}

prompt_admin_username() {
  local username

  while true; do
    read -r -p "Seed admin username [admin]: " username
    username="${username:-admin}"

    if validate_username "$username"; then
      printf "%s" "$username"
      return 0
    fi

    echo ""
  done
}

prompt_admin_password() {
  local password
  local confirmation
  local validation_error

  cat <<'EOF'

Seed admin password:
  Press Enter to generate a secure password automatically,
  or enter your own password.

Rules:
  - 20-128 characters
  - no whitespace
  - at least one lowercase letter
  - at least one uppercase letter
  - at least one number
  - at least one special character from: @ _ % + = : , . ! ? -

EOF

  while true; do
    read -r -s -p "Seed admin password [generate automatically]: " password
    echo ""

    if [[ -z "$password" ]]; then
      password="$(generate_valid_password)"
      printf "%s" "$password"
      return 0
    fi

    read -r -s -p "Confirm seed admin password: " confirmation
    echo ""

    if [[ "$password" != "$confirmation" ]]; then
      echo "Passwords do not match. Please try again."
      echo ""
      continue
    fi

    validation_error="$(validate_password "$password" 2>&1)" || {
      echo "$validation_error"
      echo "Please try again."
      echo ""
      continue
    }

    printf "%s" "$password"
    return 0
  done
}

ensure_env_file() {
  if [[ -f "$ENV_FILE" ]]; then
    return
  fi

  if [[ ! -f "$ENV_TEMPLATE" ]]; then
    echo "Error: $ENV_TEMPLATE is missing."
    exit 1
  fi

  cp "$ENV_TEMPLATE" "$ENV_FILE"
  chmod 600 "$ENV_FILE" 2>/dev/null || true
  echo "Created local $ENV_FILE from $ENV_TEMPLATE."
}

ensure_secrets() {
  mkdir -p "$SECRETS_DIR"
  chmod 700 "$SECRETS_DIR" 2>/dev/null || true

  if [[ ! -f "$POSTGRES_PASSWORD_SECRET" ]]; then
    write_secret "$POSTGRES_PASSWORD_SECRET" "$(generate_valid_password)"
  fi

  if [[ ! -f "$ADMIN_USERNAME_SECRET" || ! -f "$ADMIN_PASSWORD_SECRET" ]]; then
    if is_interactive; then
      echo "Creating local seed admin credentials..."
      write_secret "$ADMIN_USERNAME_SECRET" "$(prompt_admin_username)"
      write_secret "$ADMIN_PASSWORD_SECRET" "$(prompt_admin_password)"
      echo "Seed admin credentials stored locally in $SECRETS_DIR/."
    else
      write_secret "$ADMIN_USERNAME_SECRET" "admin"
      write_secret "$ADMIN_PASSWORD_SECRET" "$(generate_valid_password)"
      echo "Created local seed admin credentials automatically."
    fi
  fi

  validate_existing_secret_or_exit "$POSTGRES_PASSWORD_SECRET" password
  validate_existing_secret_or_exit "$ADMIN_USERNAME_SECRET" username
  validate_existing_secret_or_exit "$ADMIN_PASSWORD_SECRET" password
}

show_credentials() {
  ensure_env_file
  ensure_secrets

  local admin_username
  local admin_password

  admin_username="$(read_secret "$ADMIN_USERNAME_SECRET")"
  admin_password="$(read_secret "$ADMIN_PASSWORD_SECRET")"

  echo "Local seed admin credentials:"
  echo "  Username: $admin_username"
  echo "  Password: $admin_password"
  echo ""
  echo "Warning: Do not paste this output into logs, tickets, screenshots, or commits."
}

confirm_reset() {
  if [[ "$ASSUME_YES" == "true" || "${CI:-}" == "true" ]]; then
    return
  fi

  echo "Reset will remove:"
  echo "  - Docker Compose containers"
  echo "  - Docker Compose volumes, including the PostgreSQL data volume"
  echo "  - local $ENV_FILE"
  echo "  - local $SECRETS_DIR/"
  echo ""
  read -r -p "Continue? [y/N] " answer

  case "$answer" in
    y|Y|yes|YES)
      ;;
    *)
      echo "Reset cancelled."
      exit 0
      ;;
  esac
}

reset_environment() {
  confirm_reset

  echo "Stopping and removing containers, networks, and volumes..."
  docker compose --profile prod --profile loadtest down -v --remove-orphans 2>/dev/null || true
  docker compose down -v --remove-orphans 2>/dev/null || true

  echo "Removing local configuration..."
  rm -rf "$SECRETS_DIR"
  rm -f "$ENV_FILE"

  echo "Reset completed."
}

stop_existing_containers() {
  if docker compose ps -q 2>/dev/null | grep -q .; then
    echo "Stopping existing containers..."
    docker compose --profile prod --profile loadtest down --remove-orphans 2>/dev/null || true
    docker compose down --remove-orphans 2>/dev/null || true
  fi
}

print_summary() {
  local frontend_port
  local backend_port
  local postgres_port
  local admin_username

  frontend_port="$(read_env_value FRONTEND_PORT)"
  backend_port="$(read_env_value BACKEND_PORT)"
  postgres_port="$(read_env_value POSTGRES_PORT)"

  frontend_port="${frontend_port:-5173}"
  backend_port="${backend_port:-8080}"
  postgres_port="${postgres_port:-5432}"

  admin_username="$(read_secret "$ADMIN_USERNAME_SECRET")"

  echo ""
  echo "✓ Services started successfully! ($MODE mode)"
  echo ""
  echo "Frontend:     http://localhost:${frontend_port}"
  echo "Backend API:  http://localhost:${backend_port}"
  echo "PostgreSQL:   localhost:${postgres_port}"
  echo ""
  echo "Seed admin:"
  echo "  Username: $admin_username"
  echo "  Password: stored locally in $ADMIN_PASSWORD_SECRET"
  echo "  Show credentials explicitly: ./start-application.sh --show-credentials"
  echo ""
  echo "To view logs:"
  echo "  docker compose logs -f"

  if [[ "$MODE" == "prod" ]]; then
    echo "  docker compose logs -f frontend      # production frontend (nginx)"
  else
    echo "  docker compose logs -f frontend-dev  # development frontend (Vite HMR)"
  fi

  echo "  docker compose logs -f app           # backend only"
  echo ""
  echo "To stop services:"
  echo "  docker compose down"
  echo "  ./stop-application.sh"
}

require_command docker

if [[ "$SHOW_CREDENTIALS" == "true" ]]; then
  show_credentials
  exit 0
fi

if [[ "$RESET" == "true" ]]; then
  reset_environment
fi

ensure_env_file
ensure_secrets
stop_existing_containers

echo "Pulling base images..."
docker compose pull postgres >/dev/null

echo "Building Docker images ($MODE mode)..."
if [[ "$MODE" == "prod" ]]; then
  docker compose --profile prod build frontend app
else
  docker compose build frontend-dev app
fi

echo "Starting Docker Compose ($MODE mode)..."
if [[ "$MODE" == "prod" ]]; then
  docker compose --profile prod up -d --wait postgres app frontend
else
  docker compose up -d --wait postgres app frontend-dev
fi

print_summary