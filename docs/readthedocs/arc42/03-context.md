# 3. Context and Scope

## Business Context

The system context diagram is available at [Chapter 5 (Building Block View)](05-building-blocks.md).


### External Actors

| Actor            | Type            | Description                                                                                     |
| ---------------- | --------------- | ----------------------------------------------------------------------------------------------- |
| End User         | Human           | Browses Chuck Norris jokes without authentication on /jokes                                     |
| Administrator    | Human           | Authenticated user who imports jokes from the external API and creates new jokes on page /admin |
| Chuck Norris API | External System | Public REST API at `https://api.chucknorris.io/jokes/random` providing random jokes             |
| PostgreSQL       | Infrastructure  | Relational database for persisting jokes, users, and authentication sessions                    |

## System Scope

The system provides the following capabilities:

| Capability           | Description                                                   |
| -------------------- | ------------------------------------------------------------- |
| Random Joke Fetch    | Fetch a random joke from the local database (unauthenticated) |
| External Joke Fetch  | Fetch a random joke from the Chuck Norris API (authenticated) |
| Joke Creation        | Create new jokes in the database (authenticated)              |
| User Authentication  | Login with username/password, receive Bearer token            |
| Health Check         | System health status endpoint                                 |
| Internationalization | UI available in English and German                            |
| Theme Toggle         | Light and dark mode support                                   |

### Out of Scope

- User registration via separate endpoint (admin is created during first run of application); The system only needs an administrator account to populate the local joke database; reading jokes from the local database is public.
- Fine-grained role-based access control (only Administrator and Regular User roles exist)
- Multi-tenancy
- Real-time notifications
- Translation of joke content: The frontend UI *does* support English and German, but joke texts are stored as plain text in the database and are displayed as provided or entered.
- (Paginated) List endpoint to display all jokes from the database for admin(s) 
- File uploads or media storage
- Email delivery (no password reset or registration invite links)
