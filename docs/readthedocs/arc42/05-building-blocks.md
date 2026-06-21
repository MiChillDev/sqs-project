# 5. Building Block View

This is an interactive view of the C4 diagram created in Structurizr:

<iframe
  id="structurizr-c1"
  src="../../structurizr/index.html?iframe=structurizr-c1#C1_SystemContext"
  width="100%"
  height="700"
  frameborder="0"
  scrolling="no"
  allowfullscreen="true">
</iframe>

<script type="text/javascript" src="../../structurizr/js/structurizr-embed.js"></script>

## Level 1: System Context

The external actors are described in [Chapter 3 (Context and Scope)](03-context.md) 

## Level 2: Containers

The container diagram is available as [C4 Level 2: Containers](mermaid/c2-container.mmd).

| Container        | Technology         | Responsibility                                                                       |
| ---------------- | ------------------ | ------------------------------------------------------------------------------------ |
| **Web Frontend** | React with Vite    | Single-page application providing the user interface for browsing and managing jokes |
| **API Backend**  | Spring Boot (Java) | REST API handling joke operations, authentication, and external API integration      |
| **Database**     | PostgreSQL         | Persistent storage for jokes, users, and authentication sessions                     |

## Level 3: Components

The component diagrams are available as:
- [C4 Level 3: Backend Components](mermaid/c3-backend.mmd)
- [C4 Level 3: Frontend Components](mermaid/c3-frontend.mmd)

The backend is organized into feature packages, each containing its own controller, service, and repository layers:

| Package    | Responsibility                                                                    |
| ---------- | --------------------------------------------------------------------------------- |
| **jokes**  | Fetching jokes from the database, creating new jokes, importing from external API |
| **auth**   | User login, token generation and validation, session management                   |
| **users**  | User lookup and management                                                        |
| **health** | System health check endpoint                                                      |
| **common** | Shared infrastructure: error handling, base controller, password hashing          |

## Entity-Relationship Diagram

The database schema diagram is available as [ER Diagram](mermaid/er-diagram.mmd).

### Initial Admin Bootstrap

The initial admin bootstrap consists of two backend components:

| Component              | Package         | Responsibility                                                                                         |
| ---------------------- | --------------- | ------------------------------------------------------------------------------------------------------ |
| `SeedAdminInitializer` | `config`        | Reads seed credentials from Spring configuration, validates them, and triggers the seed-admin use case |
| `SeedAdminService`     | `users/service` | Creates or updates the configured seed admin user and stores only the password hash                    |

There is no persistence logic in `SeedAdminInitializer`. It validates configuration and delegates to `SeedAdminService`.
The database-related use case belongs to `SeedAdminService`. It checks whether the configured username already exists. If the user is missing, it creates the user with a hashed password. If the user exists but the configured password no longer matches the stored hash, it updates the password hash.

This preserves the layered architecture:

```text
Spring startup lifecycle
        |
        v
SeedAdminInitializer  (config / startup adapter)
        |
        v
 SeedAdminService     (service / use case)
        |
        v
  UserRepository      (repository / persistence)
        |
        v
    PostgreSQL
```

The config package may call the service layer for startup use cases, but it must not access repositories directly. This keeps persistence access inside the service layer and avoids turning startup configuration code into business or data-access logic.