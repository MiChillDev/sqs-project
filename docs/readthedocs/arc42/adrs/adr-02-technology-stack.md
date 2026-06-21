# ADR-02: Technology Stack Selection

[Back to ADR overview](../09-decisions.md)

**Status:** Accepted

## Context

The Chuck Norris Joke Page requires a full-stack web application with a RESTful backend, dynamic single-page frontend, and relational database. The application has moderate complexity: CRUD operations for jokes, token-based authentication, external API integration, and a responsive UI.

The development team consists of three students with mixed experience in JavaScript, Java, and database technologies. The course curriculum emphasizes allows development in Java, C#, Python and Typescript.

## Decision

| Layer                     | Technology                |
| ------------------------- | ------------------------- |
| **Frontend Framework**    | React (TypeScript)        |
| **Build Tool (Frontend)** | Vite                      |
| **CSS**                   | TailwindCSS               |
| **Backend Framework**     | Spring Boot (Java, Maven) |
| **Database**              | PostgreSQL                |
| **ORM / Data Access**     | Spring Data JPA           |
| **Schema Migrations**     | Flyway                    |
| **Containerization**      | Docker                    |

## Rationale

### Frontend: React + TypeScript + Vite + TailwindCSS

- **React**: All three team members have prior React experience. Largest ecosystem and community support. Component model maps well to the application's UI structure.
- **TypeScript**: Type safety across the full stack reduces runtime errors and improves IDE support.
- **Vite**: Fast development server with hot module replacement. Minimal configuration compared to older bundlers.
- **TailwindCSS**: Utility-first approach enables rapid prototyping. Consistent design system through configuration. Built-in dark mode and responsive design support.

### Backend: Spring Boot + Java

- **Spring Boot**: Course requirement and learning objective. Industry-standard JVM framework with mature ecosystem, convention-over-configuration, and extensive testing support.
- **Java**: Modern language features reduce boilerplate and improve readability. LTS release with virtual thread support.

### Database: PostgreSQL + Spring Data JPA + Flyway

- **PostgreSQL**: ACID-compliant, mature, well-supported in Docker. JSONB support available if needed for semi-structured data.
- **Spring Data JPA**: Declarative repository interfaces generate CRUD implementations at runtime. Derived query methods eliminate boilerplate SQL for standard operations.
- **Flyway**: Version-controlled SQL schema migration files. Deterministic database state across environments. Integrated into Spring Boot auto-configuration.

## Alternatives Considered

| Alternative        | Reason for Rejection                                 |
| ------------------ | ---------------------------------------------------- |
| Vue / Nuxt         | Less team experience with Vue ecosystem              |
| Node.js / Fastify  | Course curriculum requires Java                      |
| MySQL              | Fewer features than PostgreSQL; no JSONB support     |
| jOOQ               | More boilerplate for simple CRUD operations          |
| H2 in-memory (dev) | Different database engines mask compatibility issues |

## Consequences

- Team is productive immediately with familiar technologies
- Type safety spans both frontend (TypeScript) and backend (Java)
- All components run in Docker Compose with minimal configuration
- Large dependency surface increases vulnerability scanning needs
- Two separate build systems (Maven for backend, Vite/npm for frontend) require coordination in CI/CD
