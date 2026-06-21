# Local Development

This page documents the local Docker Compose setup, startup scripts, generated credentials, and reset behavior.

For the architectural decisions behind initial user generation and secret handling, see [ADR-09](arc42/adrs/adr-09-initial-user.md) and [ADR-10](arc42/adrs/adr-10-secrets-management.md).

## Configuration Files

Local configuration is split into non-secret configuration and secrets.

| Location       | Purpose                                                   | Committed |
| -------------- | --------------------------------------------------------- | --------- |
| `.env.example` | Template for non-secret Docker Compose configuration      | Yes       |
| `.env`         | Local non-secret configuration copied from `.env.example` | No        |
| `.secrets/`    | Local generated credentials and passwords                 | No        |

The `.env` file contains values such as ports, database name, database user, and frontend API configuration. It must not contain passwords, tokens, or API keys.

The `.secrets/` directory contains generated local credentials. It is excluded from version control.

## Starting the Application

Start the default development stack with:

```bash
./start-application.sh
```

This starts:

* PostgreSQL
* Spring Boot backend
* Vite frontend development server

The frontend is available at:

```text
http://localhost:5173
```

The backend API is available at:

```text
http://localhost:8080
```

If `.env` does not exist, the script creates it from `.env.example`.

If required secret files do not exist, the script creates them during startup.

## Generated Credentials

The startup script manages three local secrets:

| File                               | Purpose                             |
| ---------------------------------- | ----------------------------------- |
| `.secrets/postgres_password`       | PostgreSQL database password        |
| `.secrets/app_seed_admin_username` | Initial backend seed admin username |
| `.secrets/app_seed_admin_password` | Initial backend seed admin password |

The PostgreSQL password is generated automatically.

In interactive mode, the script prompts for the seed admin username and password.

For the seed admin username, pressing Enter uses the default value:

```text
admin
```

For the seed admin password, pressing Enter generates a secure password automatically.

In CI or when using `--yes`, credentials are generated automatically without interactive prompts.

## Credential Validation Rules

The seed admin username must follow these rules:

* 3–64 characters
* allowed characters: letters, numbers, `.`, `_`, `-`
* empty interactive input uses `admin`

The seed admin password must follow these rules:

* 20–128 characters
* at least one lowercase letter
* at least one uppercase letter
* at least one digit
* at least one special character from `@ _ % + = : , . ! ? -`
* no whitespace

The password policy is enforced by both the startup script and backend startup validation.

The script validates credentials before starting containers where possible. Backend validation protects manual Docker Compose usage as well, for example when the stack is started directly with `docker compose up`.

## Startup Options

Show all available options:

```bash
./start-application.sh --help
```

Start the development stack:

```bash
./start-application.sh --dev
```

`--dev` is the default mode.

Start the production-like frontend profile with nginx:

```bash
./start-application.sh --prod
```

Start only PostgreSQL and the backend:

```bash
./start-application.sh --backend-only --yes
```

This is mainly used by CI and load tests.

Reset local runtime state before starting:

```bash
./start-application.sh --reset
```

Show generated local credentials after startup:

```bash
./start-application.sh --show-credentials
```

Use this only in a trusted local terminal.

Show full Docker Compose output:

```bash
./start-application.sh --verbose
```

## Stopping the Application

Stop the stack while keeping volumes and local configuration:

```bash
./stop-application.sh
```

Stop the stack manually:

```bash
docker compose down
```

Show all stop options:

```bash
./stop-application.sh --help
```

Remove Docker volumes as well:

```bash
./stop-application.sh --volumes
```

Remove local `.env` and `.secrets/` files:

```bash
./stop-application.sh --local-config
```

Clean up both Docker volumes and local configuration:

```bash
./stop-application.sh --reset --yes
```

This is used in CI cleanup and for a clean local reset.

## Manual Docker Compose Usage

After `.env` and `.secrets/` have been created once, the stack can also be started manually:

```bash
docker compose up
```

The scripts are still recommended because they validate required files, generate missing credentials, and provide safer reset behavior.
