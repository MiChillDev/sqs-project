# 5. Building Block View

This chapter describes the static structure of the application using C4 views exported from Structurizr and PlantUML.

The interactive diagram below contains all Structurizr views. Use the view selector inside the frame or the keyboard to navigate between views:

* `↑` / `←`: move to the previous or higher-level view
* `↓` / `→`: move to the next or lower-level view

Light mode is recommended for the embedded Structurizr view, because the diagram colors are optimized for a light background.

Note that these views might be distorted. Prerendered images are provided for this reason.

[Open the full Structurizr view](../../structurizr/index.html#D1_DockerCompose)

<iframe
  id="structurizr-c1"
  src="../../structurizr/index.html?iframe=structurizr-c1#D1_DockerCompose"
  width="100%"
  height="950"
  frameborder="0"
  scrolling="no"
  allowfullscreen="true">
</iframe>

<script type="text/javascript" src="../../structurizr/js/structurizr-embed.js"></script>

The C4 model separates the system into several levels of detail. Level 1 shows the system in its environment, Level 2 shows the deployable containers, Level 3 shows the main application building blocks inside the frontend and backend, and Level 4 links to detailed PlantUML class diagrams for selected backend packages.

The interactive Structurizr view is the primary entry point for navigating these diagrams. The descriptions below explain what each view is intended to show and how the elements relate to each other.

## Deployment: Docker Compose

The [deployment view](diagrams/c4/D1_DockerCompose.png) shows how the application is run in the local Docker Compose setup.

The relevant runtime services are:

| Service          | Responsibility                                                     |
| ---------------- | ------------------------------------------------------------------ |
| **frontend**     | Production frontend container                                      |
| **frontend-dev** | Development frontend container                                     |
| **app**          | Spring Boot backend API container                                  |
| **postgres**     | PostgreSQL database container                                      |
| **k6**           | Optional load test container enabled through the load test profile |

The frontend containers communicate with the backend API. The backend API communicates with PostgreSQL and, when importing source jokes, with the external Chuck Norris API. The optional k6 container can call backend endpoints for load testing.

## Level 1: System Context

The [system context view](diagrams/c4/C1_SystemContext.png) shows the `sqs-project Chuck Norris Joke Page` as a single software system in its environment.
This view shows who uses the system and which external system it depends on.

The external actors are described in [Chapter 3 (Context and Scope)](03-context.md).

The main relationships are:

* The **End User** browses and views Chuck Norris jokes.
* The **Administrator** logs in and creates or imports new jokes.
* The application fetches source jokes from the external **Chuck Norris API**.

## Level 2: Containers

The [container view](diagrams/c4/C2_Containers.png) shows the main deployable/runtime parts of the system.
This view focuses on runtime responsibilities and technology choices.

| Container       | Technology         | Responsibility                                                                       |
| --------------- | ------------------ | ------------------------------------------------------------------------------------ |
| **Web App**     | React with Vite (TypeScript) | Single-page application providing the user interface for browsing and managing jokes |
| **API Backend** | Spring Boot (Java) | REST API handling joke operations, authentication, health checks, and API access     |
| **Database**    | PostgreSQL         | Persistent storage for jokes, users, and authentication sessions                     |

The **Web App** communicates with the **API Backend** through REST endpoints. The **API Backend** reads from and writes to the **Database** using JPA and accesses the external **Chuck Norris API** when a source joke is imported.

## Level 3: Components

The component views show the main internal building blocks of the frontend and backend.
The goal is to explain responsibilities and dependencies without showing every class and implementation details.

### C3 - Backend Components

The [backend component view](diagrams/c4/C3_Backend_Overview.png) groups backend functionality into architectural building blocks instead of individual classes.

The backend is organized into layers:

| Building Block                 | Responsibility                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------ |
| **Jokes API**                  | Exposes REST endpoints for retrieving, creating, and importing jokes                 |
| **Authentication API**         | Exposes the login endpoint and authentication entry points                           |
| **Health API**                 | Provides the health check endpoint                                                   |
| **Jokes Application Logic**    | Coordinates joke use cases, persistence, and external source joke imports            |
| **Authentication Logic**       | Handles login, token creation, and token validation                                  |
| **Users and Seed Admin Logic** | Looks up users and manages the configured seed administrator                         |
| **Jokes Persistence**          | Reads and writes persisted jokes                                                     |
| **Authentication Persistence** | Reads and writes authentication sessions                                             |
| **Users Persistence**          | Reads and writes users                                                               |
| **Chuck Norris API Client**    | Fetches source jokes from the external Chuck Norris API                              |
| **Common Classes**             | Shared response handling, result/error handling, token support, and password hashing |

The backend relationships follow the same high-level flow for most use cases:

```text
API Layer
   |
   v
Application Logic
   |
   v
Persistence / Integration
   |
   v
Database or external API
```

This keeps the C3 view focused on architectural responsibilities. Details such as `Controller`, `Service`, `RepositoryImpl`, `SpringRepository`, inheritance, and concrete method signatures are shown in the Level 4 PlantUML diagrams instead.

The backend is organized into feature packages:

| Package    | Responsibility                                                                    |
| ---------- | --------------------------------------------------------------------------------- |
| **jokes**  | Fetching jokes from the database, creating new jokes, importing from external API |
| **auth**   | User login, token generation and validation, session management                   |
| **users**  | User lookup and seed admin handling                                               |
| **health** | System health check endpoint                                                      |
| **common** | Shared result handling, error handling, base controller behavior, and utilities   |

### C3 - Frontend Components - Authentication

The [authentication component view](diagrams/c4/C3_Frontend_Authentication.png) shows the login and route protection flow in more detail.

The main flow is:

```text
LoginPage
   |
   v
API Hooks
   |
   v
fetchApi
   |
   v
Authentication API
```

The `LoginPage` validates login input using the login schema and calls the API layer. The API layer sends the request to the backend authentication API and stores the returned token using `authStorage`.

Protected routes use `requireAuth` to check whether an auth token exists. The `UserMenu` also reads authentication state from `authStorage` to show login/logout related behavior.

This view is more detailed than the frontend overview, but still less detailed than a class diagram. It focuses on how authentication-related frontend components collaborate.

### C3 - Frontend Components - Overview

The [frontend overview view](diagrams/c4/C3_Frontend_Overview.png) is intentionally abstract. It groups frontend details into larger building blocks.

The main frontend building blocks are:

| Building Block              | Responsibility                                                                                            |
| --------------------------- | --------------------------------------------------------------------------------------------------------- |
| **App Shell**               | Provides the overall application layout, route outlet, navigation, theme/language controls, and user menu |
| **Routes**                  | Represents the public, login, and protected administrator routes                                          |
| **Authentication Feature**  | Handles login, token storage, route protection, and user menu behavior                                    |
| **Jokes and Admin Feature** | Handles joke browsing, source joke import, and custom joke creation                                       |
| **Frontend API Layer**      | Contains React Query hooks, `fetchApi`, generated API types, and API error handling                       |
| **Frontend Hooks**          | Groups custom hooks for theme handling, joke counter behavior, and form validation                        |
| **UI Library**              | Contains reusable UI primitives used by routes and feature components                                     |
| **Frontend Libraries**      | Provides shared utilities for i18n, validation, error messages, logging, and counters                     |

The frontend communicates with the backend only through the **Frontend API Layer**. This keeps route components and feature components independent from low-level HTTP details.

## Level 4: Backend Code Views

The backend code views are PlantUML class diagrams exported as SVG files and embedded into the Structurizr static site as image views.

They provide the details that are intentionally omitted from the C3 backend component view.

### C4 - Backend Code Overview

The [backend code overview](diagrams/backend-code-overview.svg) shows the main backend class chains without DTOs and entity details.

It focuses on the high-level class flow:

```text
Controller
   |
   v
Service
   |
   v
Repository interface
   |
   v
Repository implementation
   |
   v
Spring Data repository
   |
   v
Database
```

This view is useful for understanding the recurring backend pattern across the feature packages.

### C4 - Backend Code - Jokes Package

The [jokes code view](diagrams/backend-code-jokes.svg) shows the concrete classes involved in the jokes package.

It covers:

* `JokeController`
* `JokeService`
* `JokeRepository`
* `JokeRepositoryImpl`
* `SpringJokeRepository`
* `ApiJokeRepository`- a base class for all external API implementations
* `ChuckNorrisApiJokeRepositoryImpl` - implementation of external Chuck Norris Joke API
* jokes DTOs and entities
* the external Chuck Norris API dependency

This view explains how persisted jokes and imported source jokes are handled at class level.

### C4 - Backend Code - Authentication Package

The [authentication code view](diagrams/backend-code-auth.svg) shows the concrete classes involved in login and token validation.

It covers:

* `AuthController`
* `AuthService`
* `AuthRepository`
* `AuthRepositoryImpl`
* `SpringAuthSessionRepository`
* authentication DTOs and entities
* dependencies to user lookup and password verification

This view explains how login requests are processed, how sessions are stored, and how authentication errors are represented.

### C4 - Backend Code - Users Package

The [users code view](diagrams/backend-code-users.svg) shows user lookup and seed admin handling.

It covers:

* `SeedAdminInitializer`
* `SeedAdminService`
* `UserService`
* `UserRepository`
* `UserRepositoryImpl`
* `SpringUserRepository`
* `UserEntity`
* password hashing support

This view explains how users are read from persistence and how the configured seed administrator is created or updated during application startup.

**Initial Admin Bootstrap**

The initial admin bootstrap consists of two backend components:

| Component              | Package         | Responsibility                                                                                         |
| ---------------------- | --------------- | ------------------------------------------------------------------------------------------------------ |
| `SeedAdminInitializer` | `config`        | Reads seed credentials from .secrets/, validates them, and triggers the seed admin use case |
| `SeedAdminService`     | `users/service` | Creates or updates the configured seed admin user and stores only the password hash                    |

This preserves the layered architecture:

```text
Spring startup lifecycle
        |
        v
SeedAdminInitializer  (startup adapter)
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

The startup adapter may call the service layer for startup use cases, but it must not access repositories directly. This keeps persistence access inside the service layer and avoids turning startup configuration code into business or data-access logic.

## Entity-Relationship Diagram

The database schema diagram shows the persistent data model of the application.

The database stores:

* jokes
* users
* authentication sessions

Authentication sessions reference users. Jokes are stored separately and can originate either from custom administrator input or from the external Chuck Norris API.
