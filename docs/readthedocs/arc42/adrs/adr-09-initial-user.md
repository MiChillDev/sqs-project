# ADR-09: Initial Admin User Generation

[Back to ADR overview](../09-decisions.md)

**Status:** Accepted

## Context

The application needs an initial user for local development, CI checks, end-to-end tests, and load tests. Earlier approaches caused several problems:

1. **Hardcoded credentials**: Fixed usernames and passwords are discoverable, spread into tests and docs, and unsafe even locally.
2. **Flyway-based seed user**: Versioned migrations make credentials effectively static and hard to change later.
3. **Manual-only user creation**: Requiring manual registration breaks automated CI, load tests, and reproducible local setup.
4. **GitHub Secrets-only setup**: CI secrets don't help local reviewers or developers cloning without repository-secret access.

The system needs a reproducible bootstrap mechanism that works locally and in CI without committing credentials.

## Decision

**Generate or prompt for initial admin credentials during application startup preparation and create the user at backend startup.**

The `start-application.sh` script creates and validates local secret files on first run:

| Secret              | Storage                            | Creation                                                         |
| ------------------- | ---------------------------------- | ---------------------------------------------------------------- |
| PostgreSQL password | `.secrets/postgres_password`       | Generated automatically                                          |
| Seed admin username | `.secrets/app_seed_admin_username` | Prompted interactively or generated/selected automatically in CI |
| Seed admin password | `.secrets/app_seed_admin_password` | Prompted interactively or generated automatically                |

The backend receives seed admin credentials via Docker Compose secrets and Spring Boot config tree import. On startup, it validates the credentials and ensures the configured user exists:

- If absent, the backend creates the user, storing only the password hash.
- If present, the backend verifies the stored hash matches the configured password. On mismatch, it updates the hash.

Operational details are in [7. Deployment View](../07-deployment.md).

### Implementation note

`SeedAdminInitializer` is a Spring startup component that reads, validates, and triggers seed-user creation from configuration. `SeedAdminService` contains the use case: checking user existence, creating if missing, or updating the hash on change.

`SeedAdminInitializer` lives in the `config` package as an application-bootstrap entry point. Like a controller, it calls the service layer but never accesses repositories directly.

## Rationale

* **No hardcoded credentials**: No default password or reusable hash is committed.
* **Reproducible local setup**: A fresh clone starts with `start-application.sh`, no manual DB changes.
* **CI compatibility**: Non-interactive runs auto-generate credentials for end-to-end and load tests without repository secrets.
* **Separation of responsibilities**: Startup script handles secrets; Docker Compose injects them; backend validates and applies seed-user state.
* **Migration safety**: Flyway migrations stay schema-focused, free of mutable credentials.
* **Password confidentiality**: The seed password is never logged; only its hash is stored.
* **Reset support**: Regenerate local credentials by resetting config and volumes via provided scripts.
* **Manual Docker compatibility**: Once `.env` and `.secrets/` exist, the stack starts with plain Docker Compose.

## Consequences

* **Positive**: No committed default credentials. Same bootstrap mechanism for dev, CI, e2e, and load tests. Credential rotation via local secret reset and stack recreation/update.
* **Positive**: Reviewers can run from a fresh clone without GitHub repository secrets.
* **Positive**: Flyway migrations remain deterministic and credential-independent.
* **Negative**: Startup is more complex: the script must generate, prompt, validate, and persist multiple secrets.
* **Negative**: Backend startup logic for seed-user management must be test-covered; incorrect behavior could lock users out or overwrite credentials.
* **Negative**: Operational behavior (default username, password policy, reset) must be documented separately from this ADR.


## Sources

- [Spring Boot](https://docs.spring.io/spring-boot/reference/features/external-config.html)
