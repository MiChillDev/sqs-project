# SQS Project - Chuck Norris Joke Page
[![SonarQube Cloud](https://sonarcloud.io/images/project_badges/sonarcloud-light.svg)](https://sonarcloud.io/summary/new_code?id=MiChillDev_sqs-project)

A web application for fetching, displaying, and managing Chuck Norris jokes. Developed as a university project by three students for a software quality assurance course.

For further documentation: [Read the Docs](https://sqs-sose26-chuck-norris.readthedocs.io/en/latest/) 

---

### Prerequisites
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
5. The frontend will be available at `http://localhost:5173` <br>
The backend API will be available at `http://localhost:8080`

Use the script parameters `-h` or `--help` to get an overview of the various options like `--reset`, `--verbose` and `--show-credentials`.

### Stopping the application
To stop the running application you can use the provided script. The script also supports `-h` and `--help` for displaying a help message.
```bash
./stop-application
```
... or stop it manually with 
```bash
docker compose down
```

### Possible Errors
- *bash: ./start-application.sh: Permission denied* -> make sure to have execution rights:
```bash
chmod +x start-application.sh
```
- *bash: ./start-application.sh: cannot execute: required file not found* -> change the file's "End of Line Sequence" from CRLF to LF

## Project Structure
```
sqs-project/
├── backend/                # Spring Boot REST API
├── frontend/               # React/Vite SPA application
├── docs/                   
    ├── presentation/       # Final project presentation
    ├── readthedocs/        # Architecture documentation (arc42)
    └── retro/              # Team retrospective
├── test/                   # Load and E2E test suites
├── docker-compose.yml
├── start-application.sh    # Interactive script for starting the application
├── stop-application.sh     # Script for stopping the application
└── README.md
```
---

<br>
<br>

## SonarQube Analysis
| Code | Findings | Ratings |
|------|----------|---------|
| [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=MiChillDev_sqs-project&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=MiChillDev_sqs-project) | [![Bugs](https://sonarcloud.io/api/project_badges/measure?project=MiChillDev_sqs-project&metric=bugs)](https://sonarcloud.io/summary/new_code?id=MiChillDev_sqs-project) | [![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=MiChillDev_sqs-project&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=MiChillDev_sqs-project) |
| [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=MiChillDev_sqs-project&metric=coverage)](https://sonarcloud.io/summary/new_code?id=MiChillDev_sqs-project) | [![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=MiChillDev_sqs-project&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=MiChillDev_sqs-project) | [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=MiChillDev_sqs-project&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=MiChillDev_sqs-project) |
| [![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=MiChillDev_sqs-project&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=MiChillDev_sqs-project) | [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=MiChillDev_sqs-project&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=MiChillDev_sqs-project) | [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=MiChillDev_sqs-project&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=MiChillDev_sqs-project) |
