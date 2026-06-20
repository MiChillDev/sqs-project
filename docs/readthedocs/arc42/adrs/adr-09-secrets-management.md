# ADR-09: Docker Compose Secrets Over .env for Credentials

**Status:** Accepted

## Context

The application requires three secrets for local development:
- PostgreSQL password
- Seed admin username
- Seed admin password

The `start-application.sh` script prompts for or generates these values on first run. They must survive container restarts but must never be committed to version control. Two patterns were evaluated:

1. **`.env` file** — Store all configuration including secrets in a single `.env` file. Docker Compose reads `.env` automatically for variable substitution.
2. **`.secrets/` directory with Docker Compose secrets** — Store each secret in its own file under `.secrets/`. Mount them as native Docker Compose secrets into containers.

## Decision

**Use `.secrets/` files with Docker Compose native secrets for credentials. Use `.env` exclusively for non-secret configuration.**

Secrets:

| Secret file                        | Docker secret target (mounted in container) | Consumer                                |
| ---------------------------------- | ------------------------------------------- | --------------------------------------- |
| `.secrets/postgres_password`       | `/run/secrets/postgres_password`            | PostgreSQL via `POSTGRES_PASSWORD_FILE` |
| `.secrets/app_seed_admin_username` | `/run/secrets/app.seed.admin.username`      | Spring configtree `@Value` injection    |
| `.secrets/app_seed_admin_password` | `/run/secrets/app.seed.admin.password`      | Spring configtree `@Value` injection    |

Non-secret `.env` (from template `.env.example`):

```
POSTGRES_USER=postgres
POSTGRES_DB=sqs_db
FRONTEND_PORT=5173
BACKEND_PORT=8080
POSTGRES_PORT=5432
VITE_API_BASE_URL=
```

## Rationale

- **No secrets in Docker image layers**: `.env` values passed via `environment:` or `args:` in docker-compose.yml can end up in image metadata. Docker Compose secrets are injected at container runtime via tmpfs and never touch image layers.
- **Secret isolation**: Each secret is its own file (`chmod 600`). Compromising one file (e.g., via log output or directory listing) does not expose all others.
- **No quoting/escaping issues**: `.env` files require careful quoting of values containing special characters (`$`, `#`, spaces). Raw files bypass this entirely.
- **Docker Compose `config` safety**: `docker compose config` prints resolved environment variables but hides secret values — preventing accidental exposure in issue reports or CI logs.
- **Config tree integration**: Spring Boot's config tree import (`optional:configtree:/run/secrets/`) reads files as property values natively, avoiding manual `Environment` parsing.
- **Principle of least exposure**: `.env.example` is committed and serves as documentation. `.env` (copied from it) contains only non-sensitive defaults. Secrets never coexist with documented configuration.
- **Load test flexibility**: Docker Compose secrets support both `file` and `environment` sources, allowing the k6 container to receive credentials from the host environment (`K6_APP_SEED_ADMIN_*`) while the backend receives them from files.

## Consequences

- **Positive**: Clear separation between config (`.env`, committed as template) and secrets (`.secrets/`, uncommitted, isolated). No hardcoded credentials in source tree or Docker images. Each consumer (PostgreSQL, Spring backend, k6) receives credentials through its native mechanism. CI workflows can mark secrets as masked (`::add-mask::`) individually.
- **Negative**: More files to manage (3 secret files + 1 `.env` vs. 1 `.env`). `start-application.sh` must handle interactive prompting, generation, and validation for each secret. Docker Compose secret syntax adds ~20 lines to `docker-compose.yml`. Teams unfamiliar with Docker Compose secrets may find the indirection surprising.
