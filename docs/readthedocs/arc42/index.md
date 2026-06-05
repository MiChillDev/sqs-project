# Architecture Documentation

## Chuck Norris Joke Page

Welcome to the architecture documentation for the Chuck Norris Joke Page, a web application for fetching, displaying, and managing Chuck Norris jokes. 
Developed as a university project by a team of three students for a software quality assurance course.

## Documentation Structure

This documentation follows the [arc42](https://arc42.org/) template (Version 8.2 EN) for software architecture documentation.

| Chapter                      | Title                    |
| ---------------------------- | ------------------------ |
| [1](01-introduction.md)      | Introduction and Goals   |
| [2](02-constraints.md)       | Architecture Constraints |
| [3](03-context.md)           | Context and Scope        |
| [4](04-solution-strategy.md) | Solution Strategy        |
| [5](05-building-blocks.md)   | Building Block View      |
| [6](06-runtime.md)           | Runtime View             |
| [7](07-deployment.md)        | Deployment View          |
| [8](08-crosscutting.md)      | Cross-cutting Concepts   |
| [9](09-decisions.md)         | Architecture Decisions   |
| [10](10-quality.md)          | Quality Requirements     |
| [11](11-risks.md)            | Risks and Technical Debt |
| [12](12-glossary.md)         | Glossary                 |

## Architecture Decision Records

| ADR                                                 | Title                                            |
| --------------------------------------------------- | ------------------------------------------------ |
| [ADR-001](ards/adr-01-feature-packages.md)          | Layered Architecture with Feature-Based Packages |
| [ADR-002](ards/adr-02-technology-stack.md)          | Technology Stack Selection                       |
| [ADR-003](ards/adr-03-authentication.md)            | Token-Based Authentication                       |
| [ADR-004](ards/adr-04-database-and-orm.md)          | PostgreSQL with JPA and Flyway                   |
| [ADR-005](ards/adr-05-monorepo-organization.md)     | Monorepo Organization                            |
| [ADR-006](ards/adr-06-functional-error-handling.md) | Functional Error Handling via Either Monad       |
| [ADR-007](ards/adr-07-testing-strategy.md)          | Multi-Layer Testing Strategy                     |


