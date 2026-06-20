# https://playground.structurizr.com/

workspace "Chuck Norris Joke Page" "C4 diagrams for the sqs-project Chuck Norris Joke Page" {

    model {
        endUser = person "End User" "Can browse and view Chuck Norris jokes." {
            tags "UserEnd"
        }

        admin = person "Administrator" "Can log in and create/import new jokes." {
            tags "UserAdmin"
        }

        chuckApi = softwareSystem "Chuck Norris API" "Public API at api.chucknorris.io that provides Chuck Norris jokes." {
            tags "PublicApi"
            url "https://api.chucknorris.io"
        }

        chuckNorrisSystem = softwareSystem "sqs-project Chuck Norris Joke Page" "Application for browsing, fetching, creating, importing, storing and displaying Chuck Norris jokes." {
            tags "ChuckNorrisSystem"

            webApp = container "Web App" "Vite SPA for end users and administrators. Docker Compose services: frontend for production and frontend-dev for local development." "React 19, TypeScript, Vite SPA" {
                tags "Frontend"
                properties {
                    "docker.compose.service.prod" "frontend"
                    "docker.compose.service.dev" "frontend-dev"
                    "prod.port" "${FRONTEND_PORT:-5173}:8080"
                    "dev.port" "${FRONTEND_PORT:-5173}:5173"
                }

                group "Pages / Routes" {
                    indexPage = component "IndexPage" "Landing page." "React Page / Route" {
                        tags "FrontendPage"
                    }

                    jokePage = component "JokePage" "Joke page at /jokes." "React Page / Route" {
                        tags "FrontendPage"
                    }

                    demoApiPage = component "DemoApiPage" "API demo page at /demo/api." "React Page / Route" {
                        tags "FrontendPage"
                    }

                    componentDemoPage = component "ComponentDemoPage" "Component demo page at /demo." "React Page / Route" {
                        tags "FrontendPage"
                    }

                    referencePage = component "ReferencePage" "Reference page at /reference." "React Page / Route" {
                        tags "FrontendPage"
                    }
                }

                group "API Layer" {
                    fetchApi = component "fetchApi" "HTTP client used by the frontend to call the backend API." "TypeScript HTTP Client" {
                        tags "FrontendApi"
                    }

                    reactQueryHooks = component "React Query Hooks" "useRandomJoke, useHealthCheck, useCreateJoke and useSourceJoke." "TanStack React Query Hooks" {
                        tags "FrontendApi"
                    }

                    generatedTypes = component "Generated Types" "Types generated from openapi.yaml." "OpenAPI generated TypeScript types" {
                        tags "FrontendApi"
                    }
                }

                group "Shared Components" {
                    group "UI Library" {
                        button = component "Button" "Reusable button component." "React Component" {
                            tags "UiComponent"
                        }

                        card = component "Card" "Reusable card component." "React Component" {
                            tags "UiComponent"
                        }

                        field = component "Field" "Reusable form field component." "React Component" {
                            tags "UiComponent"
                        }

                        input = component "Input" "Reusable input component." "React Component" {
                            tags "UiComponent"
                        }

                        label = component "Label" "Reusable label component." "React Component" {
                            tags "UiComponent"
                        }

                        separator = component "Separator" "Reusable separator component." "React Component" {
                            tags "UiComponent"
                        }

                        dropdownMenu = component "DropdownMenu" "Reusable dropdown menu component." "React Component" {
                            tags "UiComponent"
                        }
                    }

                    group "App Components" {
                        themeToggle = component "ThemeToggle" "Allows switching the UI theme." "React Component" {
                            tags "AppComponent"
                        }

                        languageToggle = component "LanguageToggle" "Allows switching the application language." "React Component" {
                            tags "AppComponent"
                        }

                        toaster = component "Toaster" "Displays toast notifications." "React Component" {
                            tags "AppComponent"
                        }

                        confetti = component "Confetti" "Displays visual feedback effects." "React Component" {
                            tags "AppComponent"
                        }

                        configErrorBanner = component "ConfigErrorBanner" "Shows frontend configuration problems." "React Component" {
                            tags "AppComponent"
                        }

                        i18nWatcher = component "I18nWatcher" "Keeps the UI language state in sync with i18next." "React Component" {
                            tags "AppComponent"
                        }
                    }
                }

                group "Hooks" {
                    useTheme = component "useTheme" "Custom hook for theme state." "React Hook" {
                        tags "FrontendHook"
                    }

                    useZodForm = component "useZodForm" "Custom hook for Zod-based forms." "React Hook" {
                        tags "FrontendHook"
                    }

                    useZodResolver = component "useZodResolver" "Custom hook for Zod validation integration." "React Hook" {
                        tags "FrontendHook"
                    }
                }

                group "Libraries" {
                    utils = component "utils" "Utility functions, including cn()." "TypeScript Library" {
                        tags "FrontendLibrary"
                    }

                    i18n = component "i18n" "Internationalization setup using i18next." "i18next" {
                        tags "FrontendLibrary"
                    }

                    errorMessages = component "error-messages" "Maps technical errors to user-facing messages." "TypeScript Library" {
                        tags "FrontendLibrary"
                    }

                    debugLogger = component "debug-logger" "Frontend debug logging utility." "TypeScript Library" {
                        tags "FrontendLibrary"
                    }

                    zodLocales = component "zod-locales" "Localized validation messages for Zod." "Zod" {
                        tags "FrontendLibrary"
                    }
                }
            }

            apiBackend = container "API Backend" "Spring Boot REST API for jokes, authentication and health checks. Docker Compose service: app." "Java 21, Spring Boot 4" {
                tags "Backend"
                properties {
                    "docker.compose.service" "app"
                    "port" "${BACKEND_PORT:-8080}:8080"
                    "base.path" "/api/v1"
                    "datasource.url" "jdbc:postgresql://postgres:5432/${POSTGRES_DB:-sqs_db}"
                }

                group "Jokes Domain" {
                    jokeController = component "JokeController" "REST controller for retrieving jokes, creating jokes and retrieving source jokes." "Spring REST Controller" {
                        tags "Controller"
                    }

                    jokeService = component "JokeService" "Business logic for jokes; coordinates persistence access and imports from the Chuck Norris API." "Spring Service" {
                        tags "Service"
                    }

                    jokeRepository = component "JokeRepository" "Repository interface for persisted jokes." "Java Interface" {
                        tags "RepositoryInterface"
                    }

                    jokeRepositoryImpl = component "JokeRepositoryImpl" "Repository implementation that delegates persistence operations to Spring Data." "Spring Repository Adapter" {
                        tags "RepositoryImpl"
                    }

                    springJokeRepository = component "SpringJokeRepository" "Spring Data repository for JokeEntity." "Spring Data JpaRepository" {
                        tags "JpaRepository"
                    }

                    chuckNorrisApiJokeRepositoryImpl = component "ChuckNorrisApiJokeRepositoryImpl" "External API client for fetching source jokes from api.chucknorris.io; extends ApiRepository." "Spring Component, RestTemplate" {
                        tags "ExternalApiClient"
                    }
                }

                group "Authentication Domain" {
                    authController = component "AuthController" "REST controller for login at POST /api/v1/auth/login. Extends BaseController." "Spring REST Controller" {
                        tags "Controller"
                    }

                    authService = component "AuthService" "Performs login and token validation." "Spring Service" {
                        tags "Service"
                    }

                    authRepository = component "AuthRepository" "Repository interface for authentication sessions." "Java Interface" {
                        tags "RepositoryInterface"
                    }

                    authRepositoryImpl = component "AuthRepositoryImpl" "Repository implementation that delegates authentication session persistence to Spring Data." "Spring Repository Adapter" {
                        tags "RepositoryImpl"
                    }

                    springAuthSessionRepository = component "SpringAuthSessionRepository" "Spring Data repository for AuthSessionEntity." "Spring Data JpaRepository" {
                        tags "JpaRepository"
                    }
                }

                group "Users Domain" {
                    userService = component "UserService" "User lookup service; does not create or modify users." "Spring Service" {
                        tags "Service"
                    }

                    userRepository = component "UserRepository" "Repository interface for users." "Java Interface" {
                        tags "RepositoryInterface"
                    }

                    userRepositoryImpl = component "UserRepositoryImpl" "Repository implementation that delegates user persistence lookups to Spring Data." "Spring Repository Adapter" {
                        tags "RepositoryImpl"
                    }

                    springUserRepository = component "SpringUserRepository" "Spring Data repository for UserEntity." "Spring Data JpaRepository" {
                        tags "JpaRepository"
                    }
                }

                group "Health" {
                    healthController = component "HealthController" "Provides GET /api/v1/health and returns a static UP response. It does not extend BaseController and does not check the database." "Spring REST Controller" {
                        tags "Controller"
                    }
                }

                group "Common Infrastructure" {
                    baseController = component "BaseController" "Common superclass for authenticated and unauthenticated controller execution using executeAuthenticated(), executeUnauthenticated() and handleEither()." "Java superclass" {
                        tags "CommonInfra"
                    }

                    either = component "Either<L,R>" "Domain result type used to model success and error results." "Java Domain Type" {
                        tags "CommonInfra"
                    }

                    errorResultStatus = component "ErrorResultStatus" "Domain error status with HTTP status code and message/id." "Java Domain Type" {
                        tags "CommonInfra"
                    }

                    passwordHasher = component "PasswordHasher" "Hashes and verifies passwords using PBKDF2." "PBKDF2" {
                        tags "CommonInfra"
                    }

                    apiRepository = component "ApiRepository" "Abstract base class for external API access using RestTemplate." "Abstract Class, RestTemplate" {
                        tags "CommonInfra"
                    }
                }
            }

            database = container "Database" "Stores jokes, users and authentication sessions. Docker Compose service: postgres." "PostgreSQL 16" {
                tags "Database"
                properties {
                    "docker.compose.service" "postgres"
                    "image" "postgres:16-alpine"
                    "port" "${POSTGRES_PORT:-5432}:5432"
                    "database" "${POSTGRES_DB:-sqs_db}"
                    "volume" "postgres_data"
                }
            }

            k6Runner = container "k6 Load Test Runner" "Optional Docker Compose service for load testing the backend API. Enabled via the loadtest profile." "Grafana k6" {
                tags "LoadTest"
                properties {
                    "docker.compose.service" "k6"
                    "profile" "loadtest"
                    "base.url" "http://app:8080/api/v1"
                }
            }
        }

        // C1 - System Context
        endUser -> chuckNorrisSystem "Browses jokes"
        admin -> chuckNorrisSystem "Logs in and creates/imports new jokes"
        chuckNorrisSystem -> chuckApi "Fetches jokes" "HTTPS/JSON" {
            tags "External"
        }

        // C2 - Containers
        endUser -> webApp "Browses and uses the web application" "HTTPS"
        admin -> webApp "Uses administrator functions" "HTTPS"

        webApp -> apiBackend "Calls REST endpoints" "HTTPS/JSON"
        apiBackend -> database "Reads and writes jokes, users and authentication sessions" "JDBC/JPA"
        apiBackend -> chuckApi "Fetches source jokes" "HTTPS/JSON" {
            tags "External"
        }
        k6Runner -> apiBackend "Runs load tests against /api/v1 endpoints" "HTTP" {
            tags "Test"
        }

        // C3 - Frontend to backend component entry points
        fetchApi -> apiBackend "Sends HTTP requests to the backend API" "HTTPS/JSON"
        reactQueryHooks -> fetchApi "Uses for backend calls"
        reactQueryHooks -> generatedTypes "Uses OpenAPI generated request/response types"

        webApp -> jokeController "GET /api/v1/jokes, POST /api/v1/jokes, GET /api/v1/source-joke" "HTTPS/JSON"
        webApp -> authController "POST /api/v1/auth/login" "HTTPS/JSON"
        webApp -> healthController "GET /api/v1/health" "HTTPS/JSON"

        // C3 - Frontend internal relationships
        indexPage -> reactQueryHooks "Uses data hooks"
        jokePage -> reactQueryHooks "Loads, creates and imports jokes"
        demoApiPage -> fetchApi "Demonstrates direct API calls"
        referencePage -> generatedTypes "Documents generated API types"
        componentDemoPage -> button "Demonstrates UI components"
        componentDemoPage -> card "Demonstrates UI components"
        componentDemoPage -> field "Demonstrates UI components"
        componentDemoPage -> input "Demonstrates UI components"
        componentDemoPage -> dropdownMenu "Demonstrates UI components"

        button -> utils "Uses cn()"
        card -> utils "Uses cn()"
        field -> utils "Uses cn()"
        input -> utils "Uses cn()"
        label -> utils "Uses cn()"
        separator -> utils "Uses cn()"
        dropdownMenu -> utils "Uses cn()"

        themeToggle -> useTheme "Reads and changes theme state"
        languageToggle -> i18n "Changes active language"
        i18nWatcher -> i18n "Synchronizes language state"
        toaster -> errorMessages "Displays mapped error messages"
        configErrorBanner -> errorMessages "Displays configuration errors"
        useZodForm -> useZodResolver "Uses validation resolver"
        useZodResolver -> zodLocales "Uses localized validation messages"
        debugLogger -> utils "Uses shared utilities"

        // C3 - Backend Jokes Domain
        jokeController -> jokeService "Delegates joke requests"
        jokeController -> baseController "Inherits authenticated/unauthenticated execution helpers" {
            tags "Inheritance"
        }
        jokeService -> jokeRepository "Uses repository interface for persisted jokes"
        jokeService -> chuckNorrisApiJokeRepositoryImpl "Fetches source jokes"
        jokeRepository -> jokeRepositoryImpl "Implemented by" {
            tags "Implementation"
        }
        jokeRepositoryImpl -> springJokeRepository "Delegates persistence operations"
        springJokeRepository -> database "Reads and writes JokeEntity" "JPA"
        chuckNorrisApiJokeRepositoryImpl -> apiRepository "Extends common API repository" {
            tags "Inheritance"
        }
        chuckNorrisApiJokeRepositoryImpl -> chuckApi "GET /jokes/random" "HTTPS/JSON" {
            tags "External"
        }

        // C3 - Backend Authentication Domain
        authController -> authService "Performs login"
        authController -> baseController "Inherits unauthenticated execution helper" {
            tags "Inheritance"
        }
        authService -> authRepository "Uses session repository interface"
        authService -> userRepository "Looks up users for login"
        authService -> passwordHasher "Verifies PBKDF2 password hashes"
        authRepository -> authRepositoryImpl "Implemented by" {
            tags "Implementation"
        }
        authRepositoryImpl -> springAuthSessionRepository "Delegates persistence operations"
        springAuthSessionRepository -> database "Reads and writes AuthSessionEntity" "JPA"

        // C3 - Backend Users Domain
        userService -> userRepository "Looks up users"
        userRepository -> userRepositoryImpl "Implemented by" {
            tags "Implementation"
        }
        userRepositoryImpl -> springUserRepository "Delegates persistence operations"
        springUserRepository -> database "Reads UserEntity" "JPA"

        // C3 - Common Infrastructure
        baseController -> authService "Checks Authorization header token for authenticated actions"
        baseController -> either "Handles success/error results"
        baseController -> errorResultStatus "Maps errors to HTTP responses"
        apiRepository -> either "Returns success/error results"
        apiRepository -> errorResultStatus "Creates API error results"

        dockerCompose = deploymentEnvironment "Docker Compose" {
            deploymentNode "Docker Host" "Runs the local Docker Compose stack." "Docker Engine / Docker Compose" {
                deploymentNode "sqs-network" "Docker bridge network used by the application services." "Docker bridge network" {
                    deploymentNode "frontend service" "Production frontend service. Docker Compose service: frontend. Active with profile prod." "Docker container" {
                        containerInstance webApp {
                            tags "DockerService"
                            healthCheck "Frontend health" "http://127.0.0.1:8080" 5 3000
                        }
                    }

                    deploymentNode "frontend-dev service" "Development frontend service. Docker Compose service: frontend-dev." "Docker container" {
                        containerInstance webApp {
                            tags "DockerService"
                            healthCheck "Frontend dev health" "http://127.0.0.1:5173" 5 3000
                        }
                    }

                    deploymentNode "app service" "Backend API service. Docker Compose service: app." "Docker container" {
                        containerInstance apiBackend {
                            tags "DockerService"
                            healthCheck "Backend health" "http://localhost:8080/api/v1/health" 5 3000
                        }
                    }

                    deploymentNode "postgres service" "PostgreSQL database service. Docker Compose service: postgres." "Docker container" {
                        containerInstance database {
                            tags "DockerService"
                        }
                    }

                    deploymentNode "k6 service" "Optional load test service. Docker Compose service: k6. Active with profile loadtest." "Docker container" {
                        containerInstance k6Runner {
                            tags "DockerService"
                        }
                    }
                }
            }
        }
    }

    views {
        systemContext chuckNorrisSystem "C1_SystemContext" {
            title "C1 - System Context"
            include *
            autoLayout lr
        }

        container chuckNorrisSystem "C2_Containers" {
            title "C2 - Containers"
            include endUser admin webApp apiBackend database chuckApi
            autoLayout lr
        }

        component apiBackend "C3_BackendComponents" {
            title "C3 - Backend Components"
            include *
            autoLayout lr
        }

        component webApp "C3_FrontendComponents" {
            title "C3 - Frontend Components"
            include *
            autoLayout lr
        }

        deployment * "Docker Compose" "D1_DockerCompose" {
            title "Deployment - Docker Compose"
            include *
            autoLayout lr
        }

        image apiBackend "C4_BackendCode" {
            title "C4 - Backend Code View"
            description "PlantUML class diagram."
            image backend-code.svg
        }

        image database "ERD_DatabaseSchema" {
            title "Database Schema"
            description "Entity-relationship diagram."
            image database-schema.svg
        }

        theme default

        styles {
            element "Person" {
                shape Person
                color #111111
                stroke #8A6D00
            }

            element "UserEnd" {
                background #FFE082
                color #111111
            }

            element "UserAdmin" {
                background #FFCA28
                color #111111
            }

            element "ChuckNorrisSystem" {
                background #1168BD
                color #FFFFFF
                stroke #0B4F8A
                shape RoundedBox
            }

            element "PublicApi" {
                background #72B9FF
                color #0B2E4A
                stroke #2D7DB8
                shape Hexagon
                icon https://api.chucknorris.io/img/chucknorris_logo_coloured_small%402x.png
            }

            element "Frontend" {
                background #F0E7FF
                color #20124D
                stroke #7E57C2
                shape WebBrowser
                icon https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg
            }

            element "Backend" {
                background #E7F4E4
                color #123D12
                stroke #6DB33F
                shape RoundedBox
                icon https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg
            }

            element "Database" {
                background #DCEAF7
                color #0B2E4A
                stroke #336791
                shape Cylinder
                icon https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg
            }

            element "LoadTest" {
                background #F5F5F5
                color #222222
                stroke #777777
                shape RoundedBox
            }

            element "Controller" {
                background #FFF3E0
                color #4A2A00
                stroke #F39C12
                shape Component
            }

            element "Service" {
                background #E8F5E9
                color #123D12
                stroke #43A047
                shape Component
            }

            element "RepositoryInterface" {
                background #E3F2FD
                color #0B2E4A
                stroke #1E88E5
                shape Component
            }

            element "RepositoryImpl" {
                background #E8EAF6
                color #1A237E
                stroke #3F51B5
                shape Component
            }

            element "JpaRepository" {
                background #DCEAF7
                color #0B2E4A
                stroke #336791
                shape Component
            }

            element "ExternalApiClient" {
                background #E1F5FE
                color #01579B
                stroke #0288D1
                shape Component
            }

            element "CommonInfra" {
                background #EEEEEE
                color #222222
                stroke #777777
                shape Component
            }

            element "FrontendPage" {
                background #EDE7F6
                color #20124D
                stroke #7E57C2
                shape Component
            }

            element "FrontendApi" {
                background #E0F2F1
                color #003D33
                stroke #00897B
                shape Component
            }

            element "UiComponent" {
                background #F3E5F5
                color #4A148C
                stroke #8E24AA
                shape Component
            }

            element "AppComponent" {
                background #FFF8E1
                color #4A2A00
                stroke #F9A825
                shape Component
            }

            element "FrontendHook" {
                background #E8F5E9
                color #123D12
                stroke #43A047
                shape Component
            }

            element "FrontendLibrary" {
                background #EEEEEE
                color #222222
                stroke #777777
                shape Component
            }

            element "DockerService" {
                background #E3F2FD
                color #0B2E4A
                stroke #1E88E5
            }

            relationship "Relationship" {
                color #555555
                thickness 2
                routing Orthogonal
            }

            relationship "External" {
                color #2D7DB8
                style dashed
                thickness 2
            }

            relationship "Inheritance" {
                color #777777
                style dashed
                thickness 2
            }

            relationship "Implementation" {
                color #777777
                style dashed
                thickness 2
            }

            relationship "Test" {
                color #777777
                style dashed
                thickness 2
            }

            relationship "Note" {
                color #BBBBBB
                style dotted
                thickness 1
            }
        }
    }
}