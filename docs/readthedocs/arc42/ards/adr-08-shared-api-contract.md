# ADR-008: Shared API Contract at Project Root

**Status:** Accepted

## Context

The OpenAPI specification originally lived inside `frontend/` because the frontend was its only consumer. The new E2E testing infrastructure — seed script and Playwright tests — also needs TypeScript types derived from this specification. Two approaches were evaluated:

1. **Keep the specification inside `frontend/`** and have the seed script import from the frontend source tree.
2. **Extract to a shared `api/` directory at project root** where both consumers access it independently.

## Decision

**Extract the OpenAPI specification to `api/` at project root. Generated TypeScript types are committed alongside the specification.**

```
api/
├── openapi.yaml              # Canonical OpenAPI 3.1.0 specification
└── generated/
    └── api-types.ts          # Generated TypeScript types, version-controlled
```

- **Frontend** imports via `@api/generated/api-types` (path alias `@api/*` → `api/*`).
- **Seed script** imports via relative path (NodeNext module resolution).
- **CI verification**: `openapi-typescript --check` ensures committed types match the specification.

Types are regenerated manually when the specification changes and committed. The frontend Docker build no longer needs the specification at build time.

## Rationale

- **Single source of truth**: The specification documents the backend's interface — both frontend and seed script are clients of that interface. Placing it at the project root reflects this accurately.
- **Decouples consumers**: The seed script does not depend on the frontend. Importing from `frontend/src/` would create a false dependency and break on frontend restructuring.
- **Build-time independence**: Committed types eliminate the need for `openapi-typescript` in the Docker build. The `prebuild` hook was removed.

## Alternatives Considered

| Alternative | Reason for Rejection |
|-------------|---------------------|
| Keep specification in `frontend/` | Layering violation — test infrastructure depends on frontend source tree |
| Generate types at Docker build time | Adds build dependency; requires wider Docker build context |
| Separate `shared-types/` npm package | Over-engineered for two consumers |

## Consequences

- `api/` joins `frontend/`, `backend/`, `docs/`, and `test/` as a project root module.
- Developers must regenerate and commit types when the specification changes. CI catches drift.
- Dev mode mounts `./api:/api` as a Docker volume. Frontend CI workflows trigger on `api/**` changes.
