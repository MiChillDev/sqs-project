# 2. Architecture Constraints

## Technical Constraints

| Constraint          | Details                                        |
| ------------------- | ---------------------------------------------- |
| Frontend Framework  | React 19 with TypeScript 6                     |
| Frontend Build Tool | Vite 8                                         |
| Frontend Styling    | TailwindCSS 4 with shadcn/ui component library |
| Backend Framework   | Spring Boot 4 with Java 21                     |
| Backend Build Tool  | Maven (via Maven Wrapper)                      |
| Database            | PostgreSQL 16                                  |
| ORM                 | Spring Data JPA                                |
| Database Migrations | Flyway 12                                      |
| API Contract        | OpenAPI 3.1.0 (YAML)                           |
| Type Generation     | openapi-typescript for frontend                |
| Containerization    | Docker with Docker Compose                     |
| Package Manager     | pnpm (frontend), Maven (backend)               |
| Node.js             | >= 22.0.0                                      |

## Organizational Constraints

| Constraint           | Details                                                             |
| -------------------- | ------------------------------------------------------------------- |
| Team Size            | 3 developers                                                        |
| Repository Structure | Monorepo with `frontend/`, `backend/`, `docs/`, `test/` directories |
| CI/CD                | GitHub Actions (7 workflows)                                        |
| Code Quality         | SonarQube Cloud + Biome linter                                      |
| Documentation        | MkDocs with arc42 template, deployed via ReadTheDocs                |
| Language             | Backend: Java 21 / Frontend: TypeScript 6 / Documentation: English  |
| Version Control      | Git (GitHub) with feature branch workflow                           |

## Conventions

| Convention            | Details                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------- |
| Backend Architecture  | Feature-based packages (jokes, auth, users, health, common) with layered Controller → Service → Repository; port/adapter separation in the repository layer |
| Frontend Architecture | Feature-based routes with shared components, hooks, and API layer                           |
| Error Handling        | Functional: custom `Either<L, R>` monad (backend), typed error classes (frontend)           |
| Form Validation       | Zod schemas + react-hook-form with i18n-aware error messages                                |
| Linting/Formatting    | Biome (frontend, replaces ESLint+Prettier)                                                  |
| Testing               | Vitest + Testing Library (frontend) / JUnit 5 + Mockito (backend) / k6 (load)               |
| Penetration Testing   | OWASP-based (TODO)                                                                          |
| i18n                  | i18next with English and German translations                                                |
