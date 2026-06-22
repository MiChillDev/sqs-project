# Getting Started

## Prerequisites
- Node.js >= 22.0.0
- pnpm (package manager)
- Java 21
- Docker with Docker Compose

### Starting the application
1. Clone the repository 
```bash
git clone https://github.com/MiChillDev/sqs-project.git
```
2. Navigate to the project folder
```bash
cd sqs-project
```
3. Execute the interactive script 
```bash
./start-application.sh
```
4. Follow the setup instructions to create an initial user that can later be used to log in to the application
5. The frontend will be available at `http://localhost:5173`<br>
   The backend API will be available at `http://localhost:8080`

Use the script parameters `-h` or `--help` to get an overview of the various options like `--reset`, `--verbose` and `--show-credentials`.
For detailed startup options, credential generation, validation rules, and reset behavior, see [Local Development](local-development.md).


### Stopping the application
To stop the running application you can use the provided script. The script also supports `-h` and `--help` for displaying a help message.
```bash
./stop-application.sh
```
... or stop it manually with 
```bash
docker compose down
```
For details about reset behavior and local configuration cleanup, see [Local Development](local-development.md).

### Possible Errors
- *bash: ./start-application.sh: Permission denied* -> make sure to have execution rights:
```bash
chmod +x start-application.sh
```
- *bash: ./start-application.sh: cannot execute: required file not found* -> change the file's "End of Line Sequence" from CRLF to LF

## Project Structure
```
sqs-project/
├── .env.example            # Environment variable template
├── .github/
│   └── workflows/          # CI/CD pipelines (lint, test, build, e2e, SonarCloud)
├── api/                    # Shared OpenAPI specification and generated TypeScript types
├── backend/                # Spring Boot REST API
├── frontend/               # React/Vite SPA
├── docs/                   # Project-related documents
│   ├── presentation/       # Final project presentation
│   ├── readthedocs/        # Architecture documentation (ADRs, arc42, C4)
│   └── retro/              # Team retrospective
├── test/                   # All non-unit test suites
│   ├── bash/               # Shell function unit tests (Bats)
│   ├── e2e/                # End-to-end tests (Playwright + Page Object Model)
│   ├── integration/        # Cross-service integration tests
│   └── load/               # Load/performance tests (k6)
├── docker-compose.yml
├── start-application.sh    # Interactive script for starting the application
├── stop-application.sh     # Script for stopping the application
└── README.md
```

## Documentation
- [Architecture Documentation (arc42)](arc42/index.md)
- [Architecture Decision Records](arc42/09-decisions.md)
- [Local Development](local-development.md)
- [Testing](testing.md)
