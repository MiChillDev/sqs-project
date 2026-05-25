# 7. Deployment View

## Docker Compose Setup

The development environment uses Docker Compose with three services on a single host:

| Service      | Technology                           | Port |
| ------------ | ------------------------------------ | ---- |
| **Frontend** | React app served via Vite dev server | 5173 |
| **Backend**  | Spring Boot application (JVM)        | 8080 |
| **Database** | PostgreSQL 16                        | 5432 |

All services communicate over a shared Docker bridge network. The backend depends on the database being healthy before starting. The frontend proxies API requests to the backend.

## Database

PostgreSQL stores all persistent data. Schema changes are managed through version-controlled SQL migration scripts, applied automatically on application startup.

## Environment Configuration

Configuration is managed through environment variables and Docker Compose. Sensitive values (database credentials, passwords) are provided at deployment time and excluded from version control.
