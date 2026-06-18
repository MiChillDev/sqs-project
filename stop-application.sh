#!/bin/bash

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

REMOVE_VOLUMES=false
REMOVE_LOCAL_CONFIG=false
ASSUME_YES=false

SECRETS_DIR=".secrets"
ENV_FILE=".env"

usage() {
  cat <<'EOF'
Usage:
  ./stop-application.sh [options]

Options:
  --volumes             Stop services and remove Docker Compose volumes.
                        This deletes the local PostgreSQL data volume.

  --local-config        Remove local .env and .secrets/ after stopping services.
                        This deletes locally stored generated credentials.

  --reset               Equivalent to --volumes --local-config.
                        Stops services and removes all local runtime state.

  -y, --yes             Do not ask for confirmation when deleting volumes or
                        local configuration. Useful for CI/CD.

  -h, --help            Show this help message.

Examples:
  ./stop-application.sh
  ./stop-application.sh --volumes
  ./stop-application.sh --local-config
  ./stop-application.sh --reset
  ./stop-application.sh --reset --yes

Notes:
  Default behavior:
    - containers are stopped
    - Docker volumes are kept
    - .env is kept
    - .secrets/ is kept

  This means the generated seed admin password remains valid for the next start.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --volumes)
      REMOVE_VOLUMES=true
      shift
      ;;
    --local-config)
      REMOVE_LOCAL_CONFIG=true
      shift
      ;;
    --reset)
      REMOVE_VOLUMES=true
      REMOVE_LOCAL_CONFIG=true
      shift
      ;;
    -y|--yes)
      ASSUME_YES=true
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      echo "" >&2
      usage
      exit 1
      ;;
  esac
done

require_command() {
  local command_name="$1"

  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "Error: Required command '$command_name' is not installed or not available in PATH." >&2
    exit 2
  fi
}

confirm_destructive_action() {
  if [[ "$ASSUME_YES" == "true" || "${CI:-}" == "true" ]]; then
    return
  fi

  if [[ "$REMOVE_VOLUMES" != "true" && "$REMOVE_LOCAL_CONFIG" != "true" ]]; then
    return
  fi

  echo "This will stop Docker Compose services."

  if [[ "$REMOVE_VOLUMES" == "true" ]]; then
    echo "It will also remove Docker Compose volumes, including PostgreSQL data."
  fi

  if [[ "$REMOVE_LOCAL_CONFIG" == "true" ]]; then
    echo "It will also remove local configuration:"
    echo "  - $ENV_FILE"
    echo "  - $SECRETS_DIR/"
  fi

  echo ""
  read -r -p "Continue? [y/N] " answer

  case "$answer" in
    y|Y|yes|YES)
      ;;
    *)
      echo "Stop cancelled."
      exit 0
      ;;
  esac
}

stop_services() {
  echo "Stopping Docker Compose services..."

  if [[ "$REMOVE_VOLUMES" == "true" ]]; then
    docker compose --profile prod --profile loadtest down -v --remove-orphans 2>/dev/null || true
    docker compose down -v --remove-orphans 2>/dev/null || true
  else
    docker compose --profile prod --profile loadtest down --remove-orphans 2>/dev/null || true
    docker compose down --remove-orphans 2>/dev/null || true
  fi
}

remove_local_config() {
  if [[ "$REMOVE_LOCAL_CONFIG" != "true" ]]; then
    return
  fi

  echo "Removing local configuration..."
  rm -rf "$SECRETS_DIR"
  rm -f "$ENV_FILE"
}

print_summary() {
  echo ""
  echo "✓ Services stopped successfully!"

  if [[ "$REMOVE_VOLUMES" == "true" ]]; then
    echo "✓ Docker volumes removed."
  else
    echo "Docker volumes kept."
  fi

  if [[ "$REMOVE_LOCAL_CONFIG" == "true" ]]; then
    echo "✓ Local .env and .secrets/ removed."
  else
    echo "Local .env and .secrets/ kept."
  fi

  echo ""
  echo "To start again:"
  echo "  ./start-application.sh"
}

require_command docker
confirm_destructive_action
stop_services
remove_local_config
print_summary