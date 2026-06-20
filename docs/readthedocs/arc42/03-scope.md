# 3. Scope

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

- User registration (admin user seeded via migration)
- Fine-grained role-based access control (only Administrator and Regular User roles exist)
- Multi-tenancy
- Real-time notifications
- File uploads or media storage
- Email delivery
