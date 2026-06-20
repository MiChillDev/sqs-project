# 8. Cross-cutting Concepts

This chapter provides an overview of cross-cutting concerns and references to where each is documented in detail.

| Concept              | Description                                                       | Documented In                                                                                        |
| -------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Authentication       | Custom token-based auth with PBKDF2 password hashing, two roles   | [ADR-003](ards/adr-03-authentication.md), [4. Solution Strategy](04-solution-strategy.md)            |
| Error Handling       | Functional Either monad for explicit error propagation            | [ADR-006](ards/adr-06-functional-error-handling.md), [4. Solution Strategy](04-solution-strategy.md) |
| Validation           | Zod schemas on the frontend, service-layer validation on backend  | [2. Constraints](02-constraints.md)                                                                  |
| Internationalization | English and German with dynamic language switching                | [10. Quality](10-quality.md)                                                                         |
| Theming              | Light and dark mode with FOUC prevention via inline CSS           | [10. Quality](10-quality.md)                                                                         |
| API Contract         | OpenAPI 3.1.0 specification with auto-generated frontend types    | [4. Solution Strategy](04-solution-strategy.md), [2. Constraints](02-constraints.md)                 |
| Testing              | Multi-layer: unit/integration, load, static analysis, penetration | [ADR-007](ards/adr-07-testing-strategy.md), [10. Quality](10-quality.md)                             |

<!-- TODO add ref to api adr for the 'api contract' concept-->