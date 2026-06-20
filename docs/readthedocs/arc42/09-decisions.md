# 9. Architecture Decisions

## Decision Summary

| Decision                                                           | Status   | ADR     |
| ------------------------------------------------------------------ | -------- | ------- |
| Layered architecture with feature-based packages                   | Accepted | ADR-001 |
| Java 21 + Spring Boot 4 backend / React 19 + TypeScript 6 frontend | Accepted | ADR-002 |
| Token-based authentication (no Spring Security)                    | Accepted | ADR-003 |
| PostgreSQL with JPA and Flyway migrations                          | Accepted | ADR-004 |
| Monorepo Organization                                              | Accepted | ADR-005 |
| Functional error handling via Either monad                         | Accepted | ADR-006 |
| Multi-layer testing with k6 load tests                             | Accepted | ADR-007 |
| Shared API contract at project root (`/api`)                       | Accepted | ADR-008 |

Full decision records with context, rationale, alternatives, and consequences are available in the [ADRs directory](ards/index.md).


