# Getting Started

## Prerequisites

- Node.js >= 22.0.0
- pnpm (package manager)
- Java 21
- Docker with Docker Compose

## Quick Start

1. Clone the repository `git clone https://github.com/MiChillDev/sqs-project.git`
2. Start all services with Docker Compose:

   ```bash
   docker compose up
   ```

3. The frontend will be available at `http://localhost:5173`
4. The backend API will be available at `http://localhost:8080`

## Project Structure

```
sqs-project/
├── frontend/    # React/Vite SPA application
├── backend/     # Spring Boot REST API
├── docs/        # Architecture documentation (arc42)
├── test/        # Load and performance test suites
├── docker-compose.yml
└── README.md
```

## Documentation

- [Architecture Documentation (arc42)](arc42/index.md)
- [Architecture Decision Records](arc42/09-decisions.md)
