# 8. Cross-cutting Concepts

This chapter provides an overview of cross-cutting concerns and references to where each is documented in detail.

| Concept                          | Description                                                       | Documented In                                                                                                                      |
| -------------------------------- | ----------------------------------------------------------------- | -----------------------------------------------------------------------------------------------------------------------------------|
| Authentication                   | Custom token-based auth with PBKDF2 password hashing, two roles   | [ADR-03](adrs/adr-03-authentication.md), [4. Solution Strategy](04-solution-strategy.md)                                           |
| Credential and Secret Management | Separation of non-secret config from dynamic local credentials    | [ADR-09](adrs/adr-09-initial-admin-user-generation.md), [ADR-10](adrs/adr-10-docker-compose-secrets-over-env-for-credentials.md), [7. Deployment View](07-deployment-view.md), [10. Quality](10-quality.md) |
| Error Handling                   | Functional Either monad for explicit error propagation            | [ADR-06](adrs/adr-06-functional-error-handling.md), [4. Solution Strategy](04-solution-strategy.md)                                |
| Validation                       | Zod schemas on the frontend, service-layer validation on backend  | [2. Constraints](02-constraints.md)                                                                                                |
| Internationalization             | English and German with dynamic language switching                | [10. Quality](10-quality.md)                                                                                                       |
| Theming                          | Light and dark mode with FOUC prevention via inline CSS           | [10. Quality](10-quality.md)                                                                                                       |
| API Contract                     | OpenAPI 3.1.0 specification with auto-generated frontend types    | [ADR-08](adrs/adr-08-shared-api-contract.md), [4. Solution Strategy](04-solution-strategy.md), [2. Constraints](02-constraints.md) |
| Testing                          | Multi-layer: unit/integration, load, static analysis, penetration | [ADR-07](adrs/adr-07-testing-strategy.md), [10. Quality](10-quality.md)                                                            |

