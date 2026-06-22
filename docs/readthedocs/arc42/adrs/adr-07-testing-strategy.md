# ADR-07: Multi-Area Testing Strategy

[Back to ADR overview](../09-decisions.md)

**Status:** Accepted

## Overview

The project requires a comprehensive testing strategy that provides confidence in correctness, prevents regressions,
validates performance, and identifies security vulnerabilities. The application spans two codebases (Java backend,
TypeScript frontend) with different testing ecosystems and different failure modes.

The CI pipeline orchestrates tests in three staged gates:

- **Stage 1 (fast gates)**: Lint, API type checks, spell-check, architecture audit.
- **Stage 2 (unit + build)**: Frontend and backend unit tests (incl. ArchUnit), bash tests, frontend build.
  Frontend jobs depend on Stage 1 lint.
- **Stage 3 (integration + SonarQube)**: E2E, load, and SonarQube analysis. Runs when Stage 2 succeeds;
  skipped jobs do not block.

## Decision

**Implement a multi-area testing strategy: unit/integration tests, E2E tests, shell script
tests, load/performance tests, static code analysis, penetration testing,
integration/security tests, and architecture testing.**

### Area 1: Unit and Integration Tests

- **Backend**: Test service, repository, controller, auth, and infrastructure behavior. Mock
  repositories in service tests. Test controllers via HTTP layer. Enforce test file presence.
- **Frontend**: Test components, hooks, routing, and API client behavior. Mirror test
  files to source directory structure. Enforce test file presence.

### Area 2: E2E Tests

- Use Playwright with Page Object Model pattern and `data-testid` selectors to decouple tests from DOM structure.
- Create seed data via REST API before the first test runs.
- Use `mock-external-api` Spring profile to isolate from the external Chuck Norris API, eliminating
  frontend-level request mocking.

### Area 3: Shell Script Tests

- Test shell functions for credential validation and generation with Bats.
- Validate username and password policy rules.
- Verify generated passwords meet complexity and uniqueness requirements.
- See [ADR-09](adr-09-initial-user.md) and [ADR-10](adr-10-secrets-management.md).

### Area 4: Load and Performance Testing

| Scenario  | GET VUs | Source VUs | POST VUs | Duration | p95 Latency | Max Error Rate |
|-----------|---------|------------|----------|----------|-------------|----------------|
| Baseline  | 6       | 1          | 3        | 30s      | < 200ms     | < 1%           |
| Stress    | 5→20→0  | 2          | 2→8→0    | 2m       | < 600ms     | < 5%           |
| Spike     | 0→50→0  | 1          | 0→10→0   | 40s      | < 900ms     | < 10%          |

Test against deployed Docker Compose. Operational details in
[Testing](../../testing.md). Credential handling in [ADR-10](adr-10-secrets-management.md).

### Area 5: Static Code Analysis

- Run static analysis as a CI quality gate. Flag code style, bugs, and anti-patterns before merge.
- Use SonarQube Cloud to analyze both codebases for bugs, vulnerabilities, code smells, duplication, and coverage.

### Area 6: Penetration Testing

- **Authentication bypass**: Test without valid token, expired token, manipulated token (see [ADR-03](adr-03-authentication.md)).
- **Injection attacks**: Test SQL injection via inputs, command injection via external API responses.
- **Token manipulation**: Test bearer tampering, replay, forgery.
- **Input validation bypass**: Test with malformed or oversized payloads.
- Scope informed by OWASP Top 10 (injection, broken authentication, security misconfiguration).

### Area 7: Integration/Security Tests

- Run a hybrid integration and security shell script covering login, public access, and penetration vectors
  (missing token, malformed header, unknown token, source-joke protection).
- Verify anti-enumeration: wrong password must return HTTP 404 (see [ADR-03](adr-03-authentication.md)).
- Run details: [Testing](../../testing.md).

### Area 8: Architecture Testing

- **Backend (ArchUnit)**: Enforce naming conventions, layer access rules (Controller → Service → Repository),
  and annotation requirements. Check test file presence for all production classes.
- **Frontend (fallow)**: Enforce import boundary zones preventing cross-route imports. Restrict API calls
  to the shared layer. Check test file presence for all production source files.
  See [Testing](../../testing.md).

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
- CI runtime adds latency to the development feedback loop; path-based change detection mitigates this
- Penetration testing requires security expertise on the team or scheduled external review
- Load tests require a running Docker Compose environment, adding complexity to local development setup
- Coverage thresholds, if applied too strictly before testing patterns are established, can incentivize low-quality
  tests that hit lines without validating behavior

## Sources

- [Playwright POM](https://playwright.dev/docs/pom)
- [ArchUnit](https://www.archunit.org/userguide/html/000_Index.html)
- [Fallow](https://docs.fallow.tools/)
- [k6](https://grafana.com/docs/k6/latest/)
- [SonarQube Cloud](https://docs.sonarsource.com/sonarqube-cloud/)
