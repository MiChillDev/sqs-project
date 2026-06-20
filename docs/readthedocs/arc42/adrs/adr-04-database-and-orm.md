# ADR-04: PostgreSQL with JPA and Flyway

[Back to ADR overview](../09-decisions.md)

**Status:** Accepted

## Context

The application requires persistent storage for users, jokes, and authentication sessions. The data model includes entities with relationships (sessions reference users), requires schema version control, and must support both simple CRUD operations and queries requiring database-specific features (e.g., random row selection).

## Decision

**Use PostgreSQL with Spring Data JPA for data access and Flyway for version-controlled schema migrations.** (Spring Data JPA uses Hibernate as its default JPA provider under the hood. The team works exclusively through the JPA API and Spring Data repository interfaces — no Hibernate-specific APIs are used directly.)

Schema changes are managed exclusively through SQL migration scripts. The ORM validates entity mappings against the Flyway-managed schema at startup but is not permitted to create or modify the schema. Flyway migration files are the definitive definition of the database schema.

Key aspects of this decision:

- **Flyway owns schema creation and evolution.** Every schema change is a numbered SQL migration file. Migration history is tracked in a dedicated Flyway table, providing a reproducible database state from any point in history.
- **Spring Data JPA maps entities to tables.** Declarative repository interfaces provide CRUD operations without boilerplate SQL. Native queries are available for database-specific operations that JPQL cannot express.
- **Same database engine in all environments.** PostgreSQL runs in development, CI, and production via Docker. This eliminates "works on my machine" issues caused by different SQL dialects or locking behavior between database engines.

## Rationale

- **Spring Data JPA**: Declarative repository pattern eliminates boilerplate. Derived query methods generate queries from method names. Mature ecosystem with extensive documentation and tooling.
- **Flyway**: Schema changes are versioned, repeatable, and auditable. CI/CD pipeline can run migrations as part of deployment with no manual DBA intervention.
- **PostgreSQL**: ACID compliance for operations spanning multiple tables. JSONB support is available if the application later needs to store semi-structured data. Strong Docker support with official images.
- **Avoiding ORM-generated DDL**: Letting the ORM auto-generate the schema removes version history of changes and risks silent modifications to production tables. Flyway provides a single source of truth for the schema.

## Alternatives Considered

| Alternative                   | Reason for Rejection                                                                                                  |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| jOOQ                          | More boilerplate for simple CRUD. Code generation adds build complexity. Better suited for SQL-heavy applications.    |
| H2 in-memory (dev only)       | Different SQL dialect masks compatibility issues. Running PostgreSQL in Docker is trivial — no benefit to H2.         |
| Reactive database access      | Adds complexity without justification for this application's concurrency profile. No lazy loading support.            |
| Hibernate DDL auto-generation | No version history of schema changes. Schema is lost on restart with `create-drop` or silently altered with `update`. |

## Consequences

- **Positive**: Type-safe queries validated at startup against entity mappings. Clear migration history via Flyway. Deterministic deployments — every environment runs the same migration scripts.
- **Negative**: JPA learning curve (entity lifecycle, fetch strategies, cascade types). N+1 query risk with lazy-loaded associations. Database-specific features require native queries that bypass JPQL type checking. ORM abstraction adds indirection for simple queries that could be one line of SQL.
