# ADR-003: Token-Based Authentication

[Back to ADR overview](../09-decisions.md)

**Status:** Accepted

## Context

The application requires user authentication for protected operations such as joke creation and external API access. There are two access levels: public joke browsing (unauthenticated) and administrative operations (authenticated). Two roles exist: Administrator (can import jokes from external API and create jokes) and Regular User (read-only access to jokes from the local database).

Three options were evaluated:

1. **Spring Security with JWT** — Industry standard for Spring Boot applications. Provides comprehensive security infrastructure (filters, CSRF protection, CORS, session management, role-based access). JWT tokens contain signed claims.
2. **Spring Security with server-side sessions** — Uses Spring Security's built-in session management with `JSESSIONID` cookies. Stateful server with session storage.
3. **Custom token-based authentication** — Manually implemented token generation, storage, and validation. Opaque bearer tokens stored server-side. No framework dependency.

## Decision

**Implement custom token-based authentication without Spring Security.**

The authentication flow works as follows:

1. **Registration**: Administrator accounts are provisioned during system setup. Passwords are hashed with PBKDF2 and stored with a random per-password salt.
2. **Roles**: Two roles exist — **Administrator** and **Regular User**. Administrators can import jokes from the external API and create jokes. Regular users access jokes from the local database without authentication.
3. **Login**: Client sends credentials to the login endpoint. On successful verification, a UUID token is generated and stored server-side with an expiration timestamp.
4. **Authenticated requests**: Protected endpoints extract the token from the `Authorization` header, validate it against the stored sessions, and resolve the associated user.
5. **Logout**: Token is deleted from server-side storage, immediately invalidating the session.

Security hardening measures include: constant-time comparison for password and token verification, identical error messages regardless of which credential is incorrect (anti-enumeration), and tokens transmitted exclusively via HTTP headers (never in URL query parameters).

## Rationale

- **Lightweight for small scope**: The entire authentication module is compact and auditable. No Spring Security filter chains, configuration classes, or `UserDetailsService` implementations needed.
- **No framework coupling**: Authentication logic is independent of Spring Security's lifecycle. Migrating frameworks would not require rewriting auth.
- **Server-side token invalidation**: Since tokens are stored in the database, invalidating a session is a single row deletion. JWT-based systems require blocklists or short expiry windows to achieve the same effect.
- **Educational value**: Building authentication from first principles teaches the team about hashing, session management, constant-time comparison, and bearer token patterns — aligning with the university project's learning objectives.

## Alternatives Considered

| Alternative                     | Reason for Rejection                                                                                                        |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Spring Security with JWT        | Disproportionate complexity for the authentication scope. Adds framework coupling and configuration overhead.               |
| Session-based auth (JSESSIONID) | Stateful sessions add server memory pressure and complicate horizontal scaling. Bearer tokens are simpler for a SPA client. |

## Consequences

- Authentication flow is fully visible in application code — no hidden framework behavior to debug
- Each component (password hashing, token generation, session storage) is independently testable
- No built-in CSRF or CORS protection — must be handled separately (SPA with bearer tokens in headers is generally not vulnerable to CSRF)
- No token refresh mechanism; users must re-authenticate after token expiration
- Non-standard approach means new developers familiar with Spring Security will need onboarding
- If application scope grows to require OAuth2 or complex role hierarchies, migration to Spring Security should be re-evaluated
