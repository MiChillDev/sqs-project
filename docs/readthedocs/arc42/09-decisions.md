# 9. Architecture Decisions

## Architecture Decision Records

Open the linked pages for more detailed descriptions. These contain the full decision records with context, rationale, alternatives, and consequences.

| ADR                                                 | Title                                            | Status   |
| --------------------------------------------------- | ------------------------------------------------ |----------|
| [ADR-01](adrs/adr-01-feature-packages.md)           | Layered Architecture with Feature-Based Packages | Accepted |
| [ADR-02](adrs/adr-02-technology-stack.md)           | Technology Stack Selection                       | Accepted |
| [ADR-03](adrs/adr-03-authentication.md)             | Token-Based Authentication (no Spring Security)  | Accepted |
| [ADR-04](adrs/adr-04-database-and-orm.md)           | PostgreSQL with JPA and Flyway migrations        | Accepted |
| [ADR-05](adrs/adr-05-monorepo-organization.md)      | Monorepo Organization                            | Accepted |
| [ADR-06](adrs/adr-06-functional-error-handling.md)  | Functional Error Handling via Either Monad       | Accepted |
| [ADR-07](adrs/adr-07-testing-strategy.md)           | Multi-Layer Testing Strategy                     | Accepted |
| [ADR-08](adrs/adr-08-shared-api-contract.md)        | Shared API contract at project root (`/api`)     | Accepted |
| [ADR-09](adrs/adr-09-initial-user.md)               | Initial Admin User Generation                    | Accepted |
| [ADR-10](adrs/adr-10-secrets-management.md)         | Docker Compose Secrets Over .env for Credentials | Accepted |