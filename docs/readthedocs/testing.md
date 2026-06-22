# Testing

This page documents how the project's test suites are organized and how they are executed locally and in CI.

The architectural testing decision is documented in [ADR-07](arc42/adrs/adr-07-testing-strategy.md).

## Architecture Tests

Backend architecture tests (ArchUnit) run as part of the Maven build:

```bash
cd backend
./mvnw clean verify
```

Frontend architecture tests (fallow) run independently:

```bash
cd frontend
pnpm run graph:audit
```

## CI Pipeline

Tests run in three staged gates via `.github/workflows/ci.yaml`:

- **Stage 1 (fast gates)**: Lint, API type check, spell-check, architecture audit.
- **Stage 2 (unit + build)**: Frontend tests, backend tests (incl. ArchUnit), bash tests, frontend build.
  Frontend jobs depend on Stage 1 lint. Backend and bash jobs are independent of Stage 1.
- **Stage 3 (integration + SonarQube)**: E2E, load, and SonarQube analysis.
  Runs when prior stages succeed or were skipped (`!cancelled() && !failure()`).

Path-based change detection skips jobs when no relevant files changed:
load tests only on `backend/` or `test/load/` changes, E2E only on `frontend/`, `backend/`,
`api/`, or `test/e2e/` changes, etc. See `ci.yaml` for the exact path filter rules.

## Backend Tests

Run backend unit and integration tests from the backend directory:

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

## Bash Tests

Run shell script credential validation tests with Bats from the project root:

```bash
bats test/bash/
```

## Integration / Auth-Security Test

Run the 11-stage authentication and penetration test against the backend stack:

```bash
./test/integration/test-auth-security-flow.sh
```

This starts its own backend stack with `--reset --backend-only` and tears down on exit.

## E2E Tests

Run Playwright end-to-end tests from the `test/e2e/` directory:

```bash
cd test/e2e
pnpm install
pnpm exec playwright install chromium
pnpm test:ci
```

This seeds 5 jokes via the REST API before the first test runs and uses the `mock-external-api` Spring profile to isolate from the external Chuck Norris API.

## Load Tests

Load tests are executed with k6 against the Docker Compose backend stack.

Start the backend-only stack first:

```bash
./start-application.sh --backend-only --yes
```

Then run the desired k6 scenario:

```bash
./test/load/run-loadtest.sh tests/baseline-test.js
```

Additional scenarios:

```bash
./test/load/run-loadtest.sh tests/stress-test.js
./test/load/run-loadtest.sh tests/spike-test.js
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
