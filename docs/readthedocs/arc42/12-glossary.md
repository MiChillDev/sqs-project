# 12. Glossary

| Term                          | Definition                                                                                                               |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **`.env` File**               | Local Docker Compose variable file used only for non-secret configuration such as ports, database name, and frontend API base URL |
| **`.secrets/` Directory**     | Project-local, gitignored directory containing generated secret files for local development |
| **Bearer Token**              | Authentication token sent in `Authorization` header as `Bearer <uuid>`                                                   |
| **Chuck Norris API**          | External REST API at `api.chucknorris.io` providing random Chuck Norris jokes                                            |
| **Config Tree**               | Spring Boot mechanism that imports files from a directory as configuration properties; used to read Docker secrets from `/run/secrets/` |
| **Docker Compose Secret**     | Sensitive value made available only to explicitly configured Compose services, mounted in the container as a file under `/run/secrets/ |
| **Either Monad**              | Custom sealed interface (`Either<L,R>`) for functional error handling; `Left` = error, `Right` = success                 |
| **Feature Package**           | Backend package organization by domain (`jokes`, `auth`, `users`, `health`) rather than by layer                         |
| **Flyway**                    | Database migration tool; manages versioned SQL scripts for schema evolution                                              |
| **FOUC**                      | Flash of Unstyled Content; prevented by injecting critical CSS inline into `index.html`                                  |
| **k6**                        | Load testing tool used for baseline, stress, and spike tests against the backend API |
| **OpenAPI**                   | API specification format (3.1.0); defines endpoints, schemas, and security schemes                                       |
| **PBKDF2**                    | Password-Based Key Derivation Function 2; used for password hashing                                                      |
| **Repository Implementation** | An infrastructure class that implements a repository interface (e.g., `JokeRepositoryImpl` wraps `SpringJokeRepository`) |
| **Repository Interface**      | A domain-facing interface defining data access contracts (e.g., `JokeRepository`, `UserRepository`)                      |
| **Seed Admin User**           | Initial local administrator account created or updated during backend startup from generated or user-provided secrets |
| **sqs-project**               | Internal project name; the Chuck Norris Joke Page application                                                            |