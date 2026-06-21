# 4. Solution Strategy

## Key Architectural Decisions

### 1. Feature-Based Package Structure with Layered Architecture

The backend organizes code by **feature/domain** (jokes, auth, users, health) rather than by technical layer. 
Within each feature, a classic layered pattern (Controller → Service → Repository) is applied. 
The repository layer uses interface/implementation separation to isolate infrastructure:

- **Repository interfaces**: Domain-facing interfaces (e.g., `JokeRepository`, `AuthRepository`) define repository contracts
- **Implementations**: Infrastructure classes in `spring/` (Spring Data JPA) and `api/` (external API calls) implement the repository interfaces
- **Benefit**: Spring Data JPA and external API details are isolated behind interfaces, enabling independent testing of service logic. This also allows adding further external joke or translation APIs by introducing additional repository implementations without changing controller logic.

### 2. Functional Error Handling via Either Monad

[ADR-06](adrs/adr-06-functional-error-handling.md)

All backend operations, from repository to controller, return a result type that makes failure paths explicit and compiler-enforced. See ADR-06 for the full decision, rationale, and trade-offs.

### 3. OpenAPI-First Type Contract

[ADR-08](adrs/adr-08-shared-api-contract.md)
The API contract is defined in OpenAPI 3.1.0 YAML. 
The /api package auto-generates TypeScript types from this spec using `openapi-typescript`. 
This provides:

- Single source of truth for API shapes
- Compile-time type safety on the frontend
- No shared package needed between frontend and backend

### 4. Custom Token-Based Authentication

Authentication is implemented without Spring Security. Opaque bearer tokens are stored server-side, making session revocation a single row deletion. Security hardening: identical error messages for wrong password / missing user (prevents username enumeration); obfuscated error messages for missing tokens. See [ADR-03](adrs/adr-03-authentication.md) for the full design.

### 5. Dynamic Credential Bootstrap and Docker Compose Secrets

[ADR-09](adrs/adr-09-initial-admin-user-generation.md), [ADR-10](adrs/adr-10-docker-compose-secrets-over-env-for-credentials.md)

The local development and CI setup avoids hardcoded credentials. `start-application.sh` creates non-secret configuration from `.env.example` and creates required local secret files under `.secrets/`. PostgreSQL, the backend, and k6 receive credentials through Docker Compose secrets.

The initial admin user is not created by a hardcoded Flyway migration. Instead, the backend validates the configured seed admin credentials at startup and creates or updates the seed admin user based on the mounted secrets. This keeps database migrations schema-focused and allows fresh local and CI environments to bootstrap without repository secrets.

### 6. Modern React Stack with Manual API Client

The frontend uses React 19 with TanStack Router and React Query:

- File-based routing with type-safe navigation
- Server state managed via React Query (no global client state store)
- Custom `fetchApi<T>()` wrapper around native `fetch` (not a generated client)
- Hooks pattern: `useRandomJoke()`, `useHealthCheck()`, etc.

### 7. Component Library via shadcn/ui

UI components are built on shadcn/ui (new-york style) with Radix UI primitives:

- Copy-pasted components (not a dependency), fully customizable
- CVA (class-variance-authority) for variant-based styling
- TailwindCSS 4 for utility-first CSS with design tokens

## Technology Selection Summary

| Layer            | Technology                                                                                       | Rationale                                    |
| ---------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| Frontend         | React 19 + Vite 8 + TypeScript 6                                                                 | Modern, type-safe, fast DX                   |
| UI Components    | shadcn/ui + Radix UI + TailwindCSS 4                                                             | Accessible, customizable, modern             |
| Routing          | TanStack Router                                                                                  | Type-safe file-based routing                 |
| Server State     | TanStack React Query                                                                             | Caching, deduplication, error handling       |
| Forms            | react-hook-form + Zod                                                                            | Performant validation with i18n              |
| Backend          | Spring Boot 4 + Java 21                                                                          | Enterprise-grade, mature ecosystem           |
| Architecture     | Layered (Controller→Service→Repository) with feature packages and interface/implementation repos | Simple, testable, familiar                   |
| Database         | PostgreSQL 16                                                                                    | Reliable, ACID-compliant relational DB       |
| Migrations       | Flyway                                                                                           | Version-controlled schema evolution          |
| Auth             | Custom token-based (UUID + PBKDF2)                                                               | Lightweight, suitable for scope              |
| Error Handling   | Either monad                                                                                     | Functional, explicit, no hidden control flow |
| API Contract     | OpenAPI 3.1.0                                                                                    | Type generation, documentation               |
| Containerization | Docker + Docker Compose + Compose Secrets                                                        | Reproducible local/CI environments           |
| CI/CD            | GitHub Actions                                                                                   | Automated testing and quality gates          |
| Code Quality     | Biome + SonarQube                                                                                | Linting, static analysis, coverage           |
| Load Testing     | k6 (Grafana)                                                                                     | Baseline, stress, and spike scenarios        |
| i18n             | i18next                                                                                          | EN/DE support from day one                   |
