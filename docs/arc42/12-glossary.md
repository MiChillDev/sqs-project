# 12. Glossary

| Term                 | Definition                                                                                               |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| **sqs-project**      | Internal project name; the Chuck Norris Joke Page application                                            |
| **Chuck Norris API** | External REST API at `api.chucknorris.io` providing random Chuck Norris jokes                            |
| **Either Monad**     | Custom sealed interface (`Either<L,R>`) for functional error handling; `Left` = error, `Right` = success |
| **Port**             | In hexagonal architecture: a domain-facing interface (e.g., `JokeRepository`)                            |
| **Adapter**          | In hexagonal architecture: an infrastructure implementation of a port (e.g., `SpringJokeRepository`)     |
| **Bearer Token**     | Authentication token sent in `Authorization` header as `Bearer <uuid>`                                   |
| **PBKDF2**           | Password-Based Key Derivation Function 2; used for password hashing                                      |
| **Flyway**           | Database migration tool; manages versioned SQL scripts for schema evolution                              |
| **OpenAPI**          | API specification format (3.1.0); defines endpoints, schemas, and security schemes                       |
| **FOUC**             | Flash of Unstyled Content; prevented by injecting critical CSS inline into `index.html`                  |
| **Feature Package**  | Backend package organization by domain (`jokes`, `auth`, `users`, `health`) rather than by layer         |
