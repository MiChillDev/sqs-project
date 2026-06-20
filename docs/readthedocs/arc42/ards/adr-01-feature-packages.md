# ADR-001: Layered Architecture with Feature-Based Packages

[Back to ADR overview](../09-decisions.md)

**Status:** Accepted

## Context

The backend needs a package organization strategy. The application consists of several cohesive domains — jokes, authentication, users, health monitoring, shared infrastructure — developed in parallel by three developers. Package organization directly impacts code discoverability, parallel development efficiency, and long-term maintainability.

Two options were evaluated:

1. **Technical layer packages** — Organize by architectural layer (`controllers/`, `services/`, `repositories/`, `models/`). Standard Spring Boot convention where all controllers reside in one package regardless of domain.
2. **Feature-based packages** — Organize by business domain (`jokes/`, `auth/`, `users/`, `health/`, `common/`). Each package contains its own controller, service, repository, and model classes. The `common/` package provides shared infrastructure.

## Decision

**Use a classic layered architecture (Controller → Service → Repository) organized by feature packages.**

The top-level package structure is:

```
com.chucknorris/
├── jokes/         # Joke CRUD, external API integration, joke-specific logic
├── auth/          # Authentication, token management, password hashing
├── users/         # User management, profile operations
├── health/        # Health check endpoints
├── common/        # Shared infrastructure: error handling, base classes
└── Application.java
```

Within each feature package, the layered pattern is applied consistently — each feature contains its own controller, service, repository, and model classes. The common package provides cross-cutting concerns (error handling, shared base classes) used by all features.

## Rationale

- **Straightforward for a small team**: The layered pattern is well-understood and requires minimal onboarding. All three developers can immediately contribute without learning novel architectural styles.
- **Feature colocation reduces cross-package coupling**: Everything related to jokes lives in one package. Adding a joke endpoint or modifying joke persistence does not require touching files scattered across the codebase.
- **Parallel development**: Developers can work on separate feature packages with minimal merge conflicts.
- **Clear mental model**: Open the `jokes/` package and see the full vertical slice — controller, service, repository, and models. No tracing logic across layer-oriented directories.

## Consequences

- Simple, predictable structure with low cognitive overhead for new contributors
- Each feature package is self-contained; extracting a feature into a separate module or service in the future requires minimal restructuring
- Refactoring to other architectural patterns (e.g., moving to microservices) remains possible because domain boundaries are already reflected in the package layout
- Cross-cutting changes that span all features require touching each feature package, but this is manageable at the current scope
