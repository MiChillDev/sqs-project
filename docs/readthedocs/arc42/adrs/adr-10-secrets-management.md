# ADR-10: Docker Compose Secrets Over .env for Credentials

[Back to ADR overview](../09-decisions.md)

**Status:** Accepted

## Context

The application needs three secrets for local development: PostgreSQL password, seed admin username, and seed admin password.

`start-application.sh` prompts for or generates these values on first run. They must survive container restarts but never be committed. Two patterns were evaluated:

1. **`.env` file**: Store all configuration including secrets in a single `.env` file. Docker Compose reads `.env` automatically for variable substitution.
2. **`.secrets/` directory with Docker Compose secrets**: Store each local secret in its own gitignored file under `.secrets/`, mounted as Docker Compose secrets.

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

**Load tests** use these secrets:

| Docker secret                | Source                                    | Target in k6 container                 | Consumer |
| ---------------------------- | ----------------------------------------- | -------------------------------------- | -------- |
| `k6_app_seed_admin_username` | `K6_APP_SEED_ADMIN_USERNAME` host env var | `/run/secrets/app.seed.admin.username` | k6       |
| `k6_app_seed_admin_password` | `K6_APP_SEED_ADMIN_PASSWORD` host env var | `/run/secrets/app.seed.admin.password` | k6       |

The k6 container runs as non-root, while local secret files are host-owned with `chmod 600`. File-backed Compose secrets cannot reliably remap uid/gid/mode, so the non-root k6 process cannot read those files without weakening host permissions, running k6 as root, or coupling the container user to the host UID: all rejected. Instead, environment-backed Compose secrets are used: the load test reads the local secret files, exports their values only for the Compose invocation, and Compose creates k6-specific secret files with correct uid/gid/mode. Credentials reach k6 as files under `/run/secrets/...`, not as environment variables.

## Rationale

- **No secrets in Docker image layers**: Build args (`args`) may leak into image metadata or build history; runtime env vars (`environment`) are exposed through container inspection, process environments, debug output, or logs. Docker Compose secrets are mounted at runtime as files under `/run/secrets/...` and are never in image layers.
- **Secret isolation**: Each secret is its own `chmod 600` file. Compromising one does not expose others.
- **No quoting/escaping issues**: `.env` requires careful quoting of values with `$`, `#`, spaces. Raw files bypass this.
- **`docker compose config` safety**: File-backed secrets show only the definition and path, not the value. Environment variables may render resolved values.
- **Config tree integration**: Spring Boot's `optional:configtree:/run/secrets/` reads files as property values natively, avoiding manual `Environment` parsing.
- **Least exposure**: `.env.example` is committed as documentation. `.env` (copied from it) holds only non-sensitive defaults. Secrets never coexist with documented config.
- **Load test flexibility**: Compose secrets support both `file` and `environment` sources, letting k6 receive credentials from host env vars while the backend gets them from files.

## Consequences

- **Positive**: Clear separation between config (`.env`, committed template) and secrets (`.secrets/`, uncommitted, isolated). No hardcoded credentials in source or images. Each consumer (PostgreSQL, Spring, k6) receives credentials through its native mechanism. CI workflows `::add-mask::` generated values as defense-in-depth; scripts avoid printing values.
- **Negative**: More files to manage (3 secret files + 1 `.env` vs. 1 `.env`). `start-application.sh` must prompt, generate, and validate each secret. Compose secret syntax adds ~20 lines to `docker-compose.yml`. Teams unfamiliar with Docker Compose secrets may find the indirection surprising.
