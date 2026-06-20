# 11. Risks and Technical Debt

## Risks

| ID  | Risk                                                     | Impact | Likelihood | Mitigation                                                               |
| --- | -------------------------------------------------------- | ------ | ---------- | ------------------------------------------------------------------------ |
| R-1 | External Chuck Norris API unavailability                 | Medium | Medium     | Local joke database as fallback; API errors return 502                   |
| R-2 | Token lifecycle not fully enforced                       | High   | High       | Add cleanup job for expired sessions                                     |
| R-3 | No CORS configuration                                    | Medium | Low        | Add Spring CORS configuration before production deployment               |
| R-4 | No HTTPS enforcement                                     | High   | Medium     | Enforce HTTPS in production via reverse proxy or Spring configuration    |
| R-5 | Simplified role model (only two roles)                   | Medium | Low        | Current scope is small; add granular RBAC if user management is expanded |
| R-6 | Frontend runs dev server in Docker (no production build) | Medium | Medium     | Implement multi-stage Dockerfile with production build                   |

## Technical Debt

| ID   | Area            | Description                                         | Remediation                                |
| ---- | --------------- | --------------------------------------------------- | ------------------------------------------ |
| TD-1 | Security        | No CORS or HTTPS configuration                      | Add before production                      |
| TD-2 | Frontend Docker | Dev server in container, no production build        | Multi-stage build                          |
| TD-3 | OpenAPI Spec    | Security scheme not yet aligned with implementation | Update spec to match implementation        |
| TD-4 | Auth            | No token cleanup mechanism                          | Add scheduled cleanup for expired sessions |
| TD-5 | PasswordHasher  | Consider stronger password hashing algorithm        | Evaluate Argon2 migration                  |
