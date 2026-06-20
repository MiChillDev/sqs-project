# 7. Deployment View

This view describes the current development setup only. No production deployment is planned at this stage.

```mermaid
flowchart TB
    subgraph sqs-network["sqs-network (bridge)"]
        direction TB

        subgraph default-services["Default (no profile)"]
            postgres[("postgres :5432
            vol: postgres_data")]
            app["app :8080"]
            frontend-dev["frontend-dev :5173
            Vite dev + HMR
            bind: ./frontend:/app
            bind: ./api:/api
            vol: frontend_node_modules"]
        end

        subgraph profile-prod["--profile prod"]
            frontend["frontend :8080
            nginx"]
        end

        subgraph profile-load["--profile loadtest"]
            k6["k6
            no exposed port"]
        end
    end

    postgres -- "depends_on" --> app
    app -- "depends_on" --> frontend-dev
    app -- "depends_on" --> frontend
    app -- "depends_on" --> k6

    frontend-dev -- "/api proxy (Vite)" --> app
    frontend -- "/api proxy (nginx)" --> app
    k6 -- "HTTP" --> app
    app -- "SQL" --> postgres
```

## Infrastructure

All services run on a single Docker host, connected through a shared bridge network (`sqs-network`). Startup order is enforced via `depends_on: service_healthy`: PostgreSQL starts first, then the backend, then frontend and load-test services.

| Service        | Image / Build                      | Port (host:container)         | Profile    |
| -------------- | ---------------------------------- | ----------------------------- | ---------- |
| `postgres`     | `postgres:16-alpine`               | `${POSTGRES_PORT:-5432}:5432` | —          |
| `app`          | `backend/Dockerfile` (Spring Boot) | `${BACKEND_PORT:-8080}:8080`  | —          |
| `frontend-dev` | `frontend/Dockerfile` (Vite)       | `${FRONTEND_PORT:-5173}:5173` | —          |
| `frontend`     | `frontend/Dockerfile` (nginx)      | `${FRONTEND_PORT:-5173}:8080` | `prod`     |
| `k6`           | `grafana/k6`                       | —                             | `loadtest` |

`frontend-dev` starts by default (Vite dev server with hot reload). `frontend` replaces it under `--profile prod` (nginx serving pre-built static files). `k6` runs on-demand under `--profile loadtest`.

The only persistent volume is `postgres_data` for the database.

## Database

PostgreSQL 16 stores all persistent data. Schema changes are managed through Flyway migration scripts under version control, applied automatically on application startup.

## Environment Configuration

Configuration is managed through environment variables and Docker Compose. Sensitive values (database credentials, passwords) are injected via Docker secrets at `/run/secrets/` and excluded from version control.
