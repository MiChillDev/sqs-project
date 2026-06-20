# 6. Runtime View

This chapter describes key runtime scenarios for the system.

## Sign-In Flow

The sign-in sequence is documented in the following sequence diagram. It shows alternative sequences for:
* entering a non-existing user name
* entering the wrong password and
* entering valid credentials

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

The sequence for fetching a random joke from the database is documented in the follwing sequence diagram. It shows two different scenarios:
* no joke found because database is empty (which is not an error technically, hence status code 204 instead of 404)
* return valid joke

```mermaid
sequenceDiagram
    participant Client
    participant JokeController as Joke Controller
    participant JokeService as Joke Service
    participant JokeRepo as Joke Repository
    participant Database

    Client->>JokeController: GET /api/v1/jokes
    JokeController->>JokeService: getRandomJoke()
    JokeService->>JokeRepo: getRandomJoke()
    JokeRepo->>Database: find random joke
    Database-->>JokeRepo: joke or null

    alt No jokes found
        JokeRepo-->>JokeService: empty
        JokeService-->>JokeController: no content
        JokeController-->>Client: 204 No Content
    else Joke found
        JokeRepo-->>JokeService: joke
        JokeService-->>JokeController: joke data
        JokeController-->>Client: 200 OK
    end
```

Users fetch a random joke from the local database. No authentication is required. The backend queries the database and returns the joke content.

## Import Joke from External API (Admin)

The sequence for fetching a joke from the public API ("source joke") is documented in following diagram. It shows different scenarios:
* invalid or missing token
* API failure and
* success

```mermaid
sequenceDiagram
    participant Client
    participant JokeController as Joke Controller
    participant AuthService as Auth Service
    participant JokeService as Joke Service
    participant ExternalAPI as External API Repository
    participant ChuckNorris as Chuck Norris API

    Client->>JokeController: GET /api/v1/source-joke (token)
    JokeController->>AuthService: validateToken(token)

    alt Invalid or missing token
        AuthService-->>JokeController: invalid
        JokeController-->>Client: 401 Unauthorized
    else Token valid
        AuthService-->>JokeController: valid
        JokeController->>JokeService: getRandomSourceJoke()
        JokeService->>ExternalAPI: fetch joke
        ExternalAPI->>ChuckNorris: GET /jokes/random
        ChuckNorris-->>ExternalAPI: joke response

        alt API failure
            ExternalAPI-->>JokeService: error
            JokeService-->>JokeController: error
            JokeController-->>Client: 502 Bad Gateway
        else Success
            ExternalAPI-->>JokeService: joke
            JokeService-->>JokeController: joke data
            JokeController-->>Client: 200 OK
        end
    end
```

Administrators import a joke from the external Chuck Norris API. The request includes an authorization token. The backend validates the token, fetches the joke from the external API, and maps the response.

## Create Joke (Admin)

The sequence for creatig a new joke is documented in the following sequence diagram. The two scenarios are:
* invalid or missing token and
* success

```mermaid
sequenceDiagram
    participant Client
    participant JokeController as Joke Controller
    participant AuthService as Auth Service
    participant JokeService as Joke Service
    participant JokeRepo as Joke Repository
    participant Database

    Client->>JokeController: POST /api/v1/jokes (token + joke content)
    JokeController->>AuthService: validateToken(token)

    alt Invalid or missing token
        AuthService-->>JokeController: invalid
        JokeController-->>Client: 401 Unauthorized
    else Token valid
        AuthService-->>JokeController: valid
        JokeController->>JokeService: createJoke(content)
        JokeService->>JokeRepo: saveJoke(joke)
        JokeRepo->>Database: save joke
        Database-->>JokeRepo: saved
        JokeRepo-->>JokeService: saved joke
        JokeService-->>JokeController: joke data
        JokeController-->>Client: 200 OK
    end
```

Administrators create a new joke directly. The request includes an authorization token and joke content. The backend validates the token and persists the joke to the database.
