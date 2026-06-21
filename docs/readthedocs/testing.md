# Testing

This page documents how the project's test suites are organized and how they are executed locally and in CI.

The architectural testing decision is documented in [ADR-07](arc42/adrs/adr-07-testing-strategy.md).

## Test Layers

The project uses a multi-layer testing strategy:

| Layer                              | Purpose                                                                               | Tools                           |
| ---------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------- |
| Backend unit and integration tests | Validate service, repository, controller, authentication, and infrastructure behavior | JUnit 5, Mockito, MockMvcTester |
| Frontend tests                     | Validate components, hooks, routing, and API client behavior                          | Vitest, Testing Library         |
| Architecture tests                 | Validate backend package and layer boundaries                                         | ArchUnit                        |
| Load tests                         | Validate latency, error rate, and behavior under traffic                              | k6                              |
| Static analysis                    | Enforce quality gates and detect code issues                                          | SonarQube, Biome                |
| Penetration testing                | Validate security controls against targeted abuse cases                               | Manual/security-focused tests   |

## Backend Tests

Run backend tests from the backend directory:

```bash
cd backend
./mvnw clean verify
```

The Maven wrapper is used so that Maven does not need to be installed globally.

## Frontend Tests

Run frontend tests from the frontend directory:

```bash
cd frontend
pnpm install
pnpm test
```

## Load Tests

Load tests are executed with k6 against the Docker Compose backend stack.

Start the backend-only stack first:

```bash
./start-application.sh --backend-only --yes
```

Then run the desired k6 scenario:

```bash
./run-loadtest.sh tests/baseline-test.js
```

Additional scenarios:

```bash
./run-loadtest.sh tests/stress-test.js
./run-loadtest.sh tests/spike-test.js
```

The load-test scripts live under:

```text
test/load/
```

## Load Test Secret Handling

The `k6` service runs only on demand through the Docker Compose `loadtest` profile and does not expose any host port.

k6 runs as a non-root container user. It receives credentials through k6-specific Docker Compose secrets.

The backend uses file-backed secrets from `.secrets/`. k6 uses environment-backed Compose secrets created by `run-loadtest.sh`.

This distinction is intentional. The persistent local secret files are owned by the host user and use restrictive permissions. The official k6 container runs as a non-root user, so it cannot reliably read those file-backed secrets without weakening permissions, running as root, or coupling the container user to the host UID/GID.

`run-loadtest.sh` reads the already existing local seed admin credentials, exports them only for the Docker Compose invocation, and Compose creates k6-specific secret files with ownership and permissions suitable for the non-root k6 user.

The credentials are mounted into the k6 container as files under:

```text
/run/secrets/
```

They are not passed as normal k6 container environment variables.

The related secret-management decision is documented in [ADR-10](arc42/adrs/adr-10-secrets-management.md).

## Cleanup

After local load testing, stop and clean up the stack if needed:

```bash
./stop-application.sh --reset --yes
```
