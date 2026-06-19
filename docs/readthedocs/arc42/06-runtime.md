# 6. Runtime View

This chapter describes key runtime scenarios for the system.

## Sign-In Flow

The sign-in sequence is documented in [sequence-signin.mmd](diagrams/mermaid/sequence-signin.mmd).

```mermaid
sequenceDiagram
    participant Client
    participant AuthController as Auth Controller
    participant AuthService as Auth Service
    participant UserRepo as User Repository
    participant DB as Database
    participant PasswordUtil as Password Hasher

    Client->>AuthController: POST /api/v1/auth/login
    AuthController->>AuthService: login(username, password)
    AuthService->>UserRepo: findByUsername(username)
    UserRepo->>DB: query user
    DB-->>UserRepo: user or null

    alt User not found
        AuthService-->>AuthController: Error
        AuthController-->>Client: 401 Unauthorized
    else User found
        AuthService->>PasswordUtil: verifyPassword(password, hash)
        PasswordUtil-->>AuthService: valid or invalid

        alt Invalid password
            AuthService-->>AuthController: Error
            AuthController-->>Client: 401 Unauthorized
        else Valid password
            Note over AuthService: generate token
            AuthService->>DB: store token with expiry
            AuthService-->>AuthController: token + expiry
            AuthController-->>Client: 200 OK
        end
    end
```

The user or administrator authenticates by submitting credentials. The system validates them against stored credentials using PBKDF2 password verification. On success, a token is generated and returned for use in subsequent requests.

## Fetch Random Joke (Public)

The fetch joke sequence is documented in ![Sequenzdiagramm: Joke abrufen](../generated/mermaid/sequence-fetch-joke.svg).

Users fetch a random joke from the local database. No authentication is required. The backend queries the database and returns the joke content.

## Import Joke from External API (Admin)

The source joke sequence is documented in [sequence-source-joke.mmd](mermaid/sequence-source-joke.mmd).

Administrators import a joke from the external Chuck Norris API. The request includes an authorization token. The backend validates the token, fetches the joke from the external API, and maps the response.

## Create Joke (Admin)

The create joke sequence is documented in [sequence-create-joke.mmd](mermaid/sequence-create-joke.mmd).

Administrators create a new joke directly. The request includes an authorization token and joke content. The backend validates the token and persists the joke to the database.
