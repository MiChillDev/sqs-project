# ADR-06: Functional Error Handling

[Back to ADR overview](../09-decisions.md)

**Status:** Accepted

## Context

The backend needs a consistent error handling strategy across all layers: repository (database and external API), service (business logic), and controller (REST endpoints). Errors must propagate from their origin to the HTTP response without losing context, and the error handling pattern must be testable, composable, and type-safe.

Three options were evaluated:

1. **Traditional try-catch with exceptions**: Service methods throw exceptions. Controller advice maps exception types to HTTP status codes. This is the idiomatic Spring Boot approach, but control flow is hidden and the compiler does not enforce handling.
2. **Functional result type**: All operations return a result type where one branch represents failure (with status code and message) and the other represents success (with the computed value). Error paths are explicit in return types and the compiler enforces handling of both branches.
3. **Checked exceptions**: Methods declare thrown exceptions in their signatures. This enforces handling but creates boilerplate declarations that propagate through every layer.

## Decision

**Use functional error handling with a result type across the backend: every operation from repository to controller returns `Either<ErrorResultStatus, T>`, making failure paths explicit and compiler-enforced.**

## Rationale

- **Explicit error paths in type signatures**: A method returning the result type communicates that it may fail. Callers must handle both paths. This self-documents the error behavior.
- **Compiler-enforced handling**: The language's sealed type support ensures that switching on the result type requires covering both branches. Forgetting to handle failure is a compile error, not a runtime bug.
- **No hidden control flow**: Exceptions create invisible goto semantics: an exception thrown deep in the call stack may be caught at the controller boundary without any indication in intermediate method signatures. The result type makes error propagation visible at every step.
- **Composable**: `flatMap` chains linearize operations that would otherwise require nested if-else or try-catch blocks. If any step fails, the chain short-circuits to that error.

## Consequences

- Error propagation is visible and traceable through the entire call chain: developers can follow an error from repository to service to controller without IDE exception tracing
- Tests assert on return values, not on whether exceptions were thrown
- Non-standard for the Spring ecosystem, which overwhelmingly uses exceptions for error handling. Developers familiar with Spring conventions will need onboarding
- Verbose call chains: a sequence of five operations requires four `flatMap` calls plus a final `map`: more verbose than imperative code with early returns
- Spring transaction management, which relies on exceptions to trigger rollback, requires explicit handling when using result types instead of throwing
