# ADR-005: Monorepo Organization

**Status:** Accepted

## Context

The project consists of a frontend application, backend API, documentation, and load tests. These components could live in separate repositories or a single monorepo. The decision affects version control workflow, CI/CD configuration, and cross-component coordination.

## Decision

**Use a monorepo with four top-level directories:**

```
sqs-project/
├── api/                # Shared OpenAPI specification and generated TypeScript types
├── frontend/           # React/Vite SPA application
├── backend/            # Spring Boot REST API
├── docs/               # Project-related documents
   ├── diagrams/        # Architecture diagrams like C4
   ├── presentation/    # Final project presentation 
   ├── readthedocs/     # Architecture documentation, ADRs, arc42
   └── retro/           # Team retrospective
├── test/               # Load and performance test suites
├── docker-compose.yml
└── README.md
```

Each directory contains its own build configuration, Dockerfile, and dependency declarations. The frontend and backend are independently buildable and deployable artifacts that share the same repository but not the same build system.

## Rationale

- **Single repository simplifies version control**: For a team of three developers, a single repository eliminates the overhead of coordinating across multiple repos — no cross-repo pull requests, no version alignment between repos, no separate issue trackers.
- **Consistent CI/CD workflows**: One CI pipeline can orchestrate building, testing, and validating all components. Configuration changes to shared infrastructure (Docker Compose, environment files) are visible in a single place.
- **Colocation enables cross-cutting changes**: Updating the API contract affects both the backend implementation and the frontend client. With a monorepo, these changes land in a single commit, eliminating the risk of one side being deployed without the other.
- **No coordination overhead**: Three developers working across frontend and backend do not need to manage multiple repositories, branches, or release cycles.

## Consequences

- Single CI pipeline triggers tests for all components on every push — the full test suite runs even when only one component changed. This can be mitigated with path-based trigger filtering.
- Potential for merge conflicts in shared areas (Docker Compose configuration, environment files). This is manageable at the team size of three.
- Monorepo scales well for small-to-medium teams. If the team or codebase grows significantly, splitting into separate repositories for frontend and backend may become warranted.
- Shared dependency on Docker Compose at the root ties the development environment together. Changes to the Compose file must be coordinated between developers.
