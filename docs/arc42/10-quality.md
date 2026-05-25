# 10. Quality Requirements

## Quality Tree

### 1. Testability

- **Frontend test coverage >= 90%** across lines, functions, and statements (enforced in CI)
- **Backend test coverage >= 80%** at service, controller, and repository layers using JUnit 5 + Mockito + MockMvcTester
- **k6 load tests** validating response times under baseline, stress, and spike scenarios (thresholds defined in the test suite)

### 2. Security

- **PBKDF2** password hashing with appropriate iteration count and key length
- **Constant-time comparison** to prevent timing attacks
- **Server-side opaque tokens** (not stateless JWTs), making token revocation straightforward
- **No username enumeration** — identical error messages whether the user exists or the password is wrong
- **No information leakage** in authentication error responses

### 3. Maintainability

- **Feature-based package structure** keeps related code together and reduces cognitive load
- **Hexagonal ports & adapters** enable isolated unit testing of domain logic
- **Biome** linting with strict rules (e.g., `noConsole=error`, consistent formatting)
- **SonarQube** for continuous static analysis and code quality tracking

### 4. Usability

- **Internationalization** — English and German with automatic browser language detection
- **Dark/light theme** with FOUC prevention via inline critical CSS injection
- **Accessibility** — ARIA attributes, skip-to-content link, keyboard navigation support
- **Responsive design** — adapts to desktop and mobile viewports

### 5. Performance

- **API response time** validated under load via k6 benchmarks
- **Manual refetch pattern** — no unnecessary polling or background refresh
- **React Query caching** to avoid redundant network requests

## Quality Scenarios

### Usage Scenarios

| ID   | Scenario                                                          | Expected Outcome                                    |
| ---- | ----------------------------------------------------------------- | --------------------------------------------------- |
| QS-1 | User fetches a random joke                                        | Response within 1 second                            |
| QS-2 | Multiple users fetch jokes simultaneously                         | Data remains consistent, no errors                  |
| QS-3 | Unauthenticated user attempts to access an authenticated endpoint | 401 Unauthorized response                           |
| QS-4 | User toggles language between English and German                  | All UI text updates immediately without page reload |
| QS-5 | User toggles theme between light and dark                         | Theme persists across page reloads via localStorage |

### Change Scenarios

| ID   | Scenario                                      | Expected Outcome                                          |
| ---- | --------------------------------------------- | --------------------------------------------------------- |
| CS-1 | Developer extends API with a new endpoint     | No breaking changes to existing endpoints                 |
| CS-2 | External Chuck Norris API becomes unavailable | System degrades gracefully; local jokes remain accessible |
