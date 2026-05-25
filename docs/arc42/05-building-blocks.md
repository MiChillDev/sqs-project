# 5. Building Block View

## Level 1: System Context

The system context diagram is available as [C4 Level 1 — System Context](mermaid/c1-context.mmd).

## Level 2: Containers

| Container        | Technology         | Responsibility                                                                       |
| ---------------- | ------------------ | ------------------------------------------------------------------------------------ |
| **Web Frontend** | React with Vite    | Single-page application providing the user interface for browsing and managing jokes |
| **API Backend**  | Spring Boot (Java) | REST API handling joke operations, authentication, and external API integration      |
| **Database**     | PostgreSQL         | Persistent storage for jokes, users, and authentication sessions                     |

## Level 3: Backend Modules

The backend is organized into feature packages, each containing its own controller, service, and repository layers:

| Package    | Responsibility                                                                    |
| ---------- | --------------------------------------------------------------------------------- |
| **jokes**  | Fetching jokes from the database, creating new jokes, importing from external API |
| **auth**   | User login, token generation and validation, session management                   |
| **users**  | User lookup and management                                                        |
| **health** | System health check endpoint                                                      |
| **common** | Shared infrastructure: error handling, base controller, password hashing          |
