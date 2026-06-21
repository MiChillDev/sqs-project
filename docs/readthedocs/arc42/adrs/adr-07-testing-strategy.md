# ADR-07: Multi-Layer Testing Strategy

[Back to ADR overview](../09-decisions.md)

**Status:** Accepted

## Context

The project requires a comprehensive testing strategy that provides confidence in correctness, prevents regressions, validates performance, and identifies security vulnerabilities. The application spans two codebases (Java backend, TypeScript frontend) with different testing ecosystems and different failure modes.

## Decision

**Implement a multi-layer testing strategy covering four areas: unit/integration tests, load/performance tests, static code analysis, and penetration testing.**

### Layer 1: Unit and Integration Tests

Both frontend and backend have unit and integration test suites:

- **Backend**: Service logic, repository operations, controller endpoints, authentication flows, and shared infrastructure are tested. Repository dependencies are mocked for service tests. Controllers are tested against the HTTP layer.
- **Frontend**: Component rendering, user interaction simulation, custom hooks, and API client logic are tested. Frontend coverage targets are set at 90%.

### Layer 2: Load and Performance Testing

Load tests validate system behavior under realistic traffic conditions:

- **Baseline scenario**: Sustained normal load to verify response times and error rates under typical usage.
- **Stress scenario**: Ramping load to identify the breaking point and observe degradation characteristics.
- **Spike scenario**: Sudden traffic burst to validate that the system recovers gracefully.

Load tests run against a deployed Docker Compose environment. Performance thresholds are defined for each scenario (p95 latency, error rate) and tracked over time.
Operational details for running the load tests are documented in [Testing](../../testing.md). Credential handling for k6 is part of the secret-management decision in [ADR-10](adr-10-secrets-management.md).

### Layer 3: Static Code Analysis

Static analysis runs as a quality gate in the CI pipeline. Code style, potential bugs, and anti-patterns are flagged before code can be merged. This ensures consistent code quality without relying solely on manual code review.

### Layer 4: Penetration Testing

Penetration testing validates security controls beyond automated scanning:

- **Authentication bypass**: Attempts to access protected endpoints without valid tokens, with expired tokens, and with manipulated tokens.
- **Injection attacks**: SQL injection via input fields and API parameters, command injection via external API response handling.
- **Token manipulation**: Tampering with bearer tokens, replay attacks, token forgery attempts.
- **Input validation bypass**: Sending malformed or oversized payloads to API endpoints.

The penetration testing scope is informed by OWASP Top 10 attack vectors relevant to the application's architecture (injection, broken authentication, security misconfiguration).

## Rationale

- **No single layer catches everything**: Unit tests miss integration bugs. Integration tests miss performance bottlenecks. Automated scanning misses context-specific security flaws. The combination provides defense in depth.
- **Load tests validate production readiness**: The application depends on an external Chuck Norris API. Under load, slow external responses could cascade into resource exhaustion. Load tests catch this before deployment.
- **Penetration testing validates security assumptions**: Automated scanners cannot verify that a custom authentication implementation is resilient to targeted attacks. Manual penetration testing validates the security of hand-rolled auth, which is inherently higher-risk than using a framework like Spring Security.
- **Static analysis enforces consistency**: Three developers working in parallel benefit from automated enforcement of code conventions, reducing style debates in code review.

## Consequences

- High confidence that the application is correct, performant, and secure
- Test maintenance burden: test suites must be updated alongside feature changes
- CI runtime adds latency to the development feedback loop; path-based triggers can mitigate this
- Penetration testing requires security expertise on the team or scheduled external review
- Load tests require a running Docker Compose environment, adding complexity to local development setup
- Coverage thresholds, if applied too strictly before testing patterns are established, can incentivize low-quality tests that hit lines without validating behavior
