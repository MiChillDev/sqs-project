# ADR-10: Docker Compose Secrets Over .env for Credentials

[Back to ADR overview](../09-decisions.md)

**Status:** Accepted

## Context

The application requires three secrets for local development:
- PostgreSQL password
- Seed admin username
- Seed admin password

The `start-application.sh` script prompts for or generates these values on first run. They must survive container restarts but must never be committed to version control. Two patterns were evaluated:

1. **`.env` file** — Store all configuration including secrets in a single `.env` file. Docker Compose reads `.env` automatically for variable substitution.
2. **`.secrets/` directory with Docker Compose secrets** — Store each local secret in its own gitignored file under the project-local `.secrets/` directory. Mount them as Docker Compose secrets into containers.

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

| Docker secret | Source | Target in k6 container | Consumer |
| ------------- | ------ | ---------------------- | -------- |
| `k6_app_seed_admin_username` | `K6_APP_SEED_ADMIN_USERNAME` host environment variable | `/run/secrets/app.seed.admin.username` | k6 |
| `k6_app_seed_admin_password` | `K6_APP_SEED_ADMIN_PASSWORD` host environment variable | `/run/secrets/app.seed.admin.password` | k6 |

The k6 secrets intentionally use environment-backed Compose secrets instead of the same file-backed secrets used by the backend. The official k6 container runs as a non-root user, while the project-local secret files are created on the host with restrictive permissions (`chmod 600`) and are owned by the host user. For file-backed Compose secrets, Docker Compose mounts the host file into the container and cannot reliably remap `uid`, `gid`, or `mode`. As a result, the non-root k6 process cannot read those files without weakening host file permissions or running k6 as root. Environment-backed Compose secrets avoid this problem: `run-loadtest.sh` reads the already existing local secret files, exports their values only for the Compose invocation, and Compose creates k6-specific secret files with `uid`, `gid`, and `mode` set for the non-root k6 user. The credentials are therefore available to k6 as files under `/run/secrets/...`, but are not passed as normal k6 container environment variables.

## Rationale

- **No secrets in Docker image layers**: Build arguments (passed via `args`) may leak into image metadata or build history, while runtime environment variables (passed via `environment`) are easier to expose through container inspection, process environments, debug output, or logs. Secrets avoid both patterns for credentials. Docker Compose secrets are mounted into containers at runtime as files under `/run/secrets/...`. They are not copied into Docker image layers.
- **Secret isolation**: Each persistent local secret is stored as its own file (`chmod 600`). Compromising one file (e.g., via log output or directory listing) does not expose all others.
- **No quoting/escaping issues**: `.env` files require careful quoting of values containing special characters (`$`, `#`, spaces). Raw files bypass this entirely.
- **Docker Compose `config` safety**: For file-backed secrets, `docker compose config` shows the secret definition and file path, not the secret value. In contrast, normal environment variables may be rendered as resolved values.
- **Config tree integration**: Spring Boot's config tree import (`optional:configtree:/run/secrets/`) reads files as property values natively, avoiding manual `Environment` parsing.
- **Principle of least exposure**: `.env.example` is committed and serves as documentation. `.env` (copied from it) contains only non-sensitive defaults. Secrets never coexist with documented configuration.
- **Load test flexibility**: Docker Compose secrets support both `file` and `environment` sources, allowing the k6 container to receive credentials from the host environment (`K6_APP_SEED_ADMIN_*`) while the backend receives them from files.

## Consequences

- **Positive**: Clear separation between config (`.env`, committed as template) and secrets (`.secrets/`, uncommitted, isolated). No hardcoded credentials in source tree or Docker images. Each consumer (PostgreSQL, Spring backend, k6) receives credentials through its native mechanism. CI workflows register generated values as masked (`::add-mask::`) as a defense-in-depth measure, while the scripts avoid printing the values in the first place.
- **Negative**: More files to manage (3 secret files + 1 `.env` vs. 1 `.env`). `start-application.sh` must handle interactive prompting, generation, and validation for each secret. Docker Compose secret syntax adds ~20 lines to `docker-compose.yml`. Teams unfamiliar with Docker Compose secrets may find the indirection surprising.
