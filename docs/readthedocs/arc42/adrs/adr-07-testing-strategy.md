# ADR-07: Multi-Area Testing Strategy

[Back to ADR overview](../09-decisions.md)

**Status:** Accepted

## Overview

The project requires a comprehensive testing strategy that provides confidence in correctness, prevents regressions,
validates performance, and identifies security vulnerabilities. The application spans two codebases (Java backend,
TypeScript frontend) with different testing ecosystems and different failure modes.

The CI pipeline (`ci.yaml`) orchestrates all test areas in three staged gates:

- **Stage 1 (fast gates)**: lint, architecture checks, spell-check — must pass before Stage 2 starts.
- **Stage 2 (unit + build)**: frontend unit tests, backend unit tests (incl. ArchUnit), bash tests, frontend build.
- **Stage 3 (integration + SonarQube)**: E2E tests, load tests, SonarQube analysis.

## Decision

**Implement a multi-area testing strategy: unit/integration tests, E2E tests, shell script
tests, load/performance tests, static code analysis, penetration testing,
integration/security tests, and architecture testing.**

### Area 1: Unit and Integration Tests

Both frontend and backend have unit and integration test suites:

- **Backend**: Service logic, repository operations, controller endpoints, authentication flows, and shared
  infrastructure are tested. Repository dependencies are mocked for service tests. Controllers are tested against the
  HTTP layer.
- **Frontend**: Component rendering, user interaction simulation, custom hooks, and API client logic are tested.
  Test files mirror the `src/` directory structure under `tests/unit/`. A frontend TestPresence check
  (`test-presence.test.ts`) ensures every production source file has a matching test, excluding shadcn/ui
  components and barrel files.

### Area 2: E2E Tests

End-to-end tests validate complete user journeys through the full stack:

- Playwright with Page Object Model pattern (`pages/` directory with `BasePage`, `LoginPage`, `HomePage` classes).
- Selectors use `data-testid` attributes, decoupling tests from styling and DOM structure.
- Seed data strategy: 5 jokes created via REST API before the first e2e test runs.
- The `mock-external-api` Spring profile is activated by `./start-application.sh --e2e`, isolating tests from the external Chuck Norris API while still allowing for full e2e tests (eliminated playwright mocks of requests between backend and frontend).

### Area 3: Shell Script Tests

Credential validation and generation functions in `start-application.sh` are tested with Bats (Bash Automated Testing
System):

- Three test files: `test_validate_username.bats`, `test_validate_password.bats`, `test_generate_password.bats`.
- Tests validate username/password policy rules and verify generated passwords meet complexity requirements.
- CI: `.github/workflows/test-bash.yaml`, Stage 2. Credential generation design is documented in [ADR-09](adr-09-initial-user.md)
  and [ADR-10](adr-10-secrets-management.md).

### Area 4: Load and Performance Testing

Load tests validate system behavior under realistic traffic conditions:

| Scenario  | GET VUs | Source VUs | POST VUs | Duration | p95 Latency | Max Error Rate |
|-----------|---------|------------|----------|----------|-------------|----------------|
| Baseline  | 6       | 1          | 3        | 30s      | < 150ms     | < 1%           |
| Stress    | 5→20→0  | 2          | 2→8→0    | 2m       | < 600ms     | < 5%           |
| Spike     | 0→50→0  | 1          | 0→10→0   | 40s      | < 900ms     | < 10%          |

Load tests run against a deployed Docker Compose environment. Operational details are documented in
[Testing](../../testing.md). Thresholds and VU configuration are defined in `test/load/README.md`. Credential handling
for k6 is part of the secret-management decision in [ADR-10](adr-10-secrets-management.md).

### Area 5: Static Code Analysis

- Static analysis runs as a CI quality gate. Code style, bugs, and anti-patterns are flagged before merge.
- SonarQube Cloud analyzes both the Java backend and TypeScript frontend — a single platform for bugs, vulnerabilities, code smells, duplication, and coverage trends.

### Area 6: Penetration Testing

Penetration testing validates security controls beyond automated scanning:

- **Authentication bypass**: Attempts to access protected endpoints without valid tokens, with expired tokens, and with
  manipulated tokens. Token auth flow is detailed in [ADR-03](adr-03-authentication.md).
- **Injection attacks**: SQL injection via input fields and API parameters, command injection via external API response
  handling.
- **Token manipulation**: Tampering with bearer tokens, replay attacks, token forgery attempts.
- **Input validation bypass**: Sending malformed or oversized payloads to API endpoints.

The penetration testing scope is informed by OWASP Top 10 attack vectors relevant to the application's architecture (
injection, broken authentication, security misconfiguration).

### Area 7: Integration/Security Tests

`test/integration/test-auth-security-flow.sh` is a hybrid integration and security test executed as a shell script:

- 11 stages: prerequisites check → backend startup → health check → correct login → wrong password attempt → public
  endpoint access → four penetration stages (no token, malformed auth header, unknown token, valid token) → source-joke
  endpoint protection.
- Anti-enumeration is verified: wrong password returns the same HTTP 404 as wrong username
  (see [ADR-03](adr-03-authentication.md) for the design rationale).
- CI: runs in `.github/workflows/test-bash.yaml`, Stage 2, after backend unit tests pass.

<!-- TODO: split test-auth-security-flow.sh into separate integration test and security test files -->

### Area 8: Architecture Testing

Architecture tests ensure the codebase adheres to defined constraints and prevent structural erosion over time.

- **Backend (ArchUnit)**: `ArchitectureTest.java` enforces naming conventions (e.g. classes in `service` package must
  end with `Service`), layer access (Controller → Service → Repository, `consideringAllDependencies()`), and annotation
  requirements (@RestController, @Service, @Entity). `TestPresenceTest.java` ensures every controller, service,
  repository implementation, and utility class has a matching test class.
- **Frontend (fallow)**: Five zones defined in `.fallowrc.jsonc`: `routes-login`, `routes-admin`, `routes-shared`,
  `app-core`, and `shared`. Import boundary rules enforce that route zones may not import from each other.
  Forbidden API calls: `useQuery`, `useMutation`, and `fetch` are prohibited in route components (pages).

## Rationale

- **No single area catches everything**: Unit tests miss integration bugs. Integration tests miss performance
  bottlenecks. Automated scanning misses context-specific security flaws. The combination provides defense in depth.
- **Load tests validate production readiness**: The external Chuck Norris API could cascade slow responses into
  resource exhaustion under load. Load tests catch this before deployment.
- **Penetration testing validates security assumptions**: Automated scanners cannot verify that a custom authentication
  implementation resists targeted attacks.
- **Static analysis enforces consistency**: Automated code conventions reduce style debates in code review.

## Consequences

- High confidence that the application is correct, performant, and secure
- Test maintenance burden: test suites must be updated alongside feature changes
- CI runtime adds latency to the development feedback loop; path-based triggers can mitigate this
- Penetration testing requires security expertise on the team or scheduled external review
- Load tests require a running Docker Compose environment, adding complexity to local development setup
- Coverage thresholds, if applied too strictly before testing patterns are established, can incentivize low-quality
  tests that hit lines without validating behavior
