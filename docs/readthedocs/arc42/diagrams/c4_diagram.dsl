# https://playground.structurizr.com/

workspace "Chuck Norris Joke Page" "C4 diagrams for the sqs-project Chuck Norris Joke Page" {

    model {
        properties {
            "structurizr.groupSeparator" "/"
        }

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

                group "Routes" {
                    rootRoute = component "RootRoute" "Application shell with layout, header, language/theme/user controls and route outlet." "TanStack Router root route" {
                        tags "FrontendRoute"
                    }

                    indexPage = component "IndexPage" "Landing page with navigation to the joke page." "React route component" {
                        tags "FrontendPage"
                    }

                    jokePage = component "JokePage" "Public joke page at /jokes." "React route component" {
                        tags "FrontendPage"
                    }

                    loginPage = component "LoginPage" "Login page at /login." "React route component" {
                        tags "FrontendPage"
                    }

                    adminPage = component "AdminPage" "Protected administrator page for importing and creating jokes." "React route component" {
                        tags "FrontendPage"
                    }
                }

                group "Admin Feature" {
                    sourceJokeSection = component "SourceJokeSection" "Loads a source joke from the backend." "React component" {
                        tags "AppComponent"
                    }

                    jokeCreationSection = component "JokeCreationSection" "Creates a custom joke through the backend API." "React form component" {
                        tags "AppComponent"
                    }
                }

                group "API Layer" {
                    apiHooks = component "API Hooks" "useRandomJoke, useHealthCheck, useCreateJoke, useLogin and useSourceJoke." "TanStack React Query hooks" {
                        tags "FrontendApi"
                    }

                    fetchApi = component "fetchApi" "Shared HTTP client for backend API calls, timeout handling, auth headers and response parsing." "TypeScript HTTP client" {
                        tags "FrontendApi"
                    }

                    generatedTypes = component "Generated API Types" "Types generated from openapi.yaml." "OpenAPI generated TypeScript types" {
                        tags "FrontendApi"
                    }

                    apiErrors = component "ApiError / NetworkError" "Client-side error types for HTTP and network failures." "TypeScript error classes" {
                        tags "FrontendLibrary"
                    }
                }

                group "Authentication" {
                    authStorage = component "authStorage" "Stores and retrieves the current auth token in the browser." "TypeScript utility" {
                        tags "FrontendLibrary"
                    }

                    requireAuth = component "requireAuth" "Route guard that redirects unauthenticated users to /login." "TanStack Router guard" {
                        tags "FrontendGuard"
                    }

                    userMenu = component "UserMenu" "Shows login/logout related user actions." "React component" {
                        tags "AppComponent"
                    }
                }

                group "Shared Components" {
                    group "UI Library" {
                        button = component "Button" "Reusable button component." "React UI component" {
                            tags "UiComponent"
                        }

                        card = component "Card" "Reusable card component." "React UI component" {
                            tags "UiComponent"
                        }

                        field = component "Field" "Reusable form field component." "React UI component" {
                            tags "UiComponent"
                        }

                        input = component "Input" "Reusable input component." "React UI component" {
                            tags "UiComponent"
                        }

                        label = component "Label" "Reusable label component." "React UI component" {
                            tags "UiComponent"
                        }

                        separator = component "Separator" "Reusable separator component." "React UI component" {
                            tags "UiComponent"
                        }

                        dropdownMenu = component "DropdownMenu" "Reusable dropdown menu component." "React UI component" {
                            tags "UiComponent"
                        }

                        sheet = component "Sheet" "Reusable sheet/drawer component." "React UI component" {
                            tags "UiComponent"
                        }

                        textarea = component "Textarea" "Reusable textarea component." "React UI component" {
                            tags "UiComponent"
                        }
                    }

                    group "App Shell" {
                        themeToggle = component "ThemeToggle" "Allows switching the UI theme." "React component" {
                            tags "AppComponent"
                        }

                        languageToggle = component "LanguageToggle" "Allows switching the application language." "React component" {
                            tags "AppComponent"
                        }

                        toaster = component "Toaster" "Displays toast notifications." "React component" {
                            tags "AppComponent"
                        }

                        confetti = component "Confetti" "Displays visual feedback effects." "React component" {
                            tags "AppComponent"
                        }

                        errorAlert = component "ErrorAlert" "Displays user-facing error messages." "React component" {
                            tags "AppComponent"
                        }

                        i18nWatcher = component "I18nWatcher" "Keeps the UI language state in sync with i18next." "React component" {
                            tags "AppComponent"
                        }
                    }
                }

                group "Hooks" {
                    useTheme = component "useTheme" "Custom hook for theme state." "React hook" {
                        tags "FrontendHook"
                    }

                    useJokeCounter = component "useJokeCounter" "Counts fetched jokes and triggers confetti." "React hook" {
                        tags "FrontendHook"
                    }

                    useZodForm = component "useZodForm" "Custom hook for Zod-based forms." "React hook" {
                        tags "FrontendHook"
                    }

                    useZodResolver = component "useZodResolver" "Custom hook for localized Zod validation." "React hook" {
                        tags "FrontendHook"
                    }
                }

                group "Libraries" {
                    utils = component "utils" "Shared utility functions including cn()." "TypeScript utility" {
                        tags "FrontendLibrary"
                    }

                    i18n = component "i18n" "Internationalization setup using i18next." "i18next" {
                        tags "FrontendLibrary"
                    }

                    errorMessages = component "error-messages" "Maps technical errors to user-facing messages." "TypeScript utility" {
                        tags "FrontendLibrary"
                    }

                    debugLogger = component "debug-logger" "Frontend debug logging utility." "TypeScript utility" {
                        tags "FrontendLibrary"
                    }

                    zodLocales = component "zod-locales" "Localized validation messages for Zod." "Zod utility" {
                        tags "FrontendLibrary"
                    }

                    loginSchema = component "login-schema" "Zod schema for login validation." "Zod schema" {
                        tags "FrontendLibrary"
                    }

                    jokeCounterLib = component "joke-counter" "Counter helpers for joke milestones and confetti reset." "TypeScript utility" {
                        tags "FrontendLibrary"
                    }
                }
            }

            apiBackend = container "API Backend" "Spring Boot REST API for jokes, authentication, users and health checks. Docker Compose service: app." "Java 21, Spring Boot 4" {
                tags "Backend"
                properties {
                    "docker.compose.service" "app"
                    "port" "${BACKEND_PORT:-8080}:8080"
                    "base.path" "/api/v1"
                    "datasource.url" "jdbc:postgresql://postgres:5432/${POSTGRES_DB:-sqs_db}"
                }

                group "API Layer" {
                    jokesApi = component "Jokes API" "REST API for retrieving, creating and importing jokes." "Spring REST Controllers" {
                        tags "Controller"
                    }

                    authApi = component "Authentication API" "REST API for login and token-based authentication." "Spring REST Controller" {
                        tags "Controller"
                    }

                    healthApi = component "Health API" "Health endpoint for the backend service." "Spring REST Controller" {
                        tags "Controller"
                    }
                }

                group "Application Layer" {
                    jokesApplication = component "Jokes Application Logic" "Coordinates joke use cases, persistence and source joke imports." "Spring Services" {
                        tags "Service"
                    }

                    authApplication = component "Authentication Logic" "Handles login, token creation and token validation." "Spring Services" {
                        tags "Service"
                    }

                    usersApplication = component "Users and Seed Admin Logic" "Looks up users and manages the configured seed administrator." "Spring Services" {
                        tags "Service"
                    }
                }

                group "Persistence Layer" {
                    jokesPersistence = component "Jokes Persistence" "Reads and writes persisted jokes." "Repository adapters, Spring Data JPA" {
                        tags "RepositoryImpl"
                    }

                    authPersistence = component "Authentication Persistence" "Reads and writes authentication sessions." "Repository adapters, Spring Data JPA" {
                        tags "RepositoryImpl"
                    }

                    usersPersistence = component "Users Persistence" "Reads and writes users." "Repository adapters, Spring Data JPA" {
                        tags "RepositoryImpl"
                    }
                }

                group "Integration Layer" {
                    sourceJokeClient = component "Chuck Norris API Client" "Fetches source jokes from api.chucknorris.io." "RestTemplate client" {
                        tags "ExternalApiClient"
                    }
                }

                group "Shared Infrastructure" {
                    backendCommon = component "Shared Backend Infrastructure" "Common response handling, result/error handling, token support and password hashing." "BaseController, Either, ErrorResultStatus, PasswordHasher, ApiRepository" {
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

        webApp -> apiBackend "Calls REST API" "HTTPS/JSON"
        apiBackend -> database "Reads/writes data" "JDBC/JPA"
        apiBackend -> chuckApi "Fetches source jokes" "HTTPS/JSON" {
            tags "External"
        }
        k6Runner -> apiBackend "Runs load tests" "HTTP" {
            tags "Test"
        }

        // Frontend routing and feature flow
        rootRoute -> indexPage "Routes"
        rootRoute -> jokePage "Routes"
        rootRoute -> loginPage "Routes"
        rootRoute -> adminPage "Routes"
        rootRoute -> languageToggle "Renders"
        rootRoute -> themeToggle "Renders"
        rootRoute -> userMenu "Renders"
        rootRoute -> i18nWatcher "Renders"
        rootRoute -> toaster "Renders"

        adminPage -> requireAuth "Protected by"
        adminPage -> sourceJokeSection "Renders"
        adminPage -> jokeCreationSection "Renders"
        loginPage -> apiHooks "Uses login hook"
        loginPage -> authStorage "Stores token"
        loginPage -> loginSchema "Validates form"
        jokePage -> apiHooks "Uses joke hook"
        jokePage -> useJokeCounter "Counts jokes"
        jokePage -> card "Displays joke"
        jokePage -> button "Fetch action"
        jokePage -> confetti "Shows milestone"
        sourceJokeSection -> apiHooks "Uses source hook"
        jokeCreationSection -> apiHooks "Uses create hook"
        jokeCreationSection -> useZodForm "Validates form"
        jokeCreationSection -> textarea "Inputs content"
        jokeCreationSection -> button "Submit action"
        userMenu -> authStorage "Reads token"
        requireAuth -> authStorage "Checks token"

        apiHooks -> fetchApi "Calls"
        apiHooks -> generatedTypes "Uses types"
        fetchApi -> authStorage "Adds token"
        fetchApi -> apiErrors "Throws errors"
        fetchApi -> apiBackend "Calls REST API" "HTTPS/JSON"

        themeToggle -> useTheme "Uses"
        languageToggle -> i18n "Changes language"
        i18nWatcher -> i18n "Syncs language"
        toaster -> errorMessages "Shows messages"
        errorAlert -> errorMessages "Shows messages"
        useZodForm -> useZodResolver "Uses"
        useZodResolver -> zodLocales "Uses locales"
        useTheme -> debugLogger "Logs storage errors"
        useJokeCounter -> jokeCounterLib "Uses"

        button -> utils "Uses cn()"
        card -> utils "Uses cn()"
        field -> utils "Uses cn()"
        input -> utils "Uses cn()"
        label -> utils "Uses cn()"
        separator -> utils "Uses cn()"
        dropdownMenu -> utils "Uses cn()"
        sheet -> utils "Uses cn()"
        textarea -> utils "Uses cn()"

        // Backend C3 entry points
        webApp -> jokesApi "Joke requests" "HTTPS/JSON"
        webApp -> authApi "Login request" "HTTPS/JSON"
        webApp -> healthApi "Health check" "HTTPS/JSON"

        // Backend C3 layers
        jokesApi -> jokesApplication "Delegates"
        authApi -> authApplication "Delegates"
        healthApi -> backendCommon "Returns status"

        jokesApplication -> jokesPersistence "Reads/writes jokes"
        jokesApplication -> sourceJokeClient "Imports source jokes"

        authApplication -> authPersistence "Manages sessions"
        authApplication -> usersApplication "Finds users"
        authApplication -> backendCommon "Token/password support"

        usersApplication -> usersPersistence "Reads/writes users"
        usersApplication -> backendCommon "Password hashing"

        jokesPersistence -> database "jokes" "JPA"
        authPersistence -> database "auth_sessions" "JPA"
        usersPersistence -> database "users" "JPA"

        sourceJokeClient -> chuckApi "GET /jokes/random" "HTTPS/JSON" {
            tags "External"
        }

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

        component apiBackend "C3_Backend_Overview" {
            title "C3 - Backend Components"
            include webApp
            include jokesApi authApi healthApi
            include jokesApplication authApplication usersApplication
            include jokesPersistence authPersistence usersPersistence
            include sourceJokeClient backendCommon
            include database chuckApi
            autoLayout tb 180 180
        }

        component webApp "C3_Frontend_Overview" {
            title "C3 - Frontend Components - Overview"
            include rootRoute indexPage jokePage loginPage adminPage
            include requireAuth authStorage userMenu languageToggle themeToggle toaster
            include apiHooks fetchApi generatedTypes apiErrors
            include apiBackend
            autoLayout tb 180 180
        }

        component webApp "C3_Frontend_Jokes_Admin" {
            title "C3 - Frontend Components - Jokes and Admin"
            include jokePage adminPage sourceJokeSection jokeCreationSection
            include apiHooks fetchApi authStorage
            include useJokeCounter useZodForm
            include card button textarea confetti
            include apiBackend
            autoLayout tb 180 180
        }

        component webApp "C3_Frontend_Authentication" {
            title "C3 - Frontend Components - Authentication"
            include loginPage requireAuth userMenu authStorage
            include apiHooks fetchApi loginSchema apiErrors
            include apiBackend
            autoLayout tb 180 180
        }

        deployment * "Docker Compose" "D1_DockerCompose" {
            title "Deployment - Docker Compose"
            include *
            autoLayout lr
        }

        image apiBackend "C4_BackendCode_Overview" {
            title "C4 - Backend Code Overview"
            description "Compact PlantUML class overview without DTO and entity details."
            image backend-code-overview.svg
        }

        image apiBackend "C4_BackendCode_Jokes" {
            title "C4 - Backend Code - Jokes Package"
            description "Detailed PlantUML class diagram for the jokes package."
            image backend-code-jokes.svg
        }

        image apiBackend "C4_BackendCode_Auth" {
            title "C4 - Backend Code - Authentication Package"
            description "Detailed PlantUML class diagram for the authentication package."
            image backend-code-auth.svg
        }

        image apiBackend "C4_BackendCode_Users" {
            title "C4 - Backend Code - Users Package"
            description "Detailed PlantUML class diagram for users and seed admin setup."
            image backend-code-users.svg
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
                width 360
                height 150
                fontSize 22
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
                width 520
                height 180
                fontSize 22
            }

            element "PublicApi" {
                background #72B9FF
                color #0B2E4A
                stroke #2D7DB8
                shape Hexagon
                width 420
                height 160
                fontSize 21
                icon https://api.chucknorris.io/img/chucknorris_logo_coloured_small%402x.png
            }

            element "Frontend" {
                background #F0E7FF
                color #20124D
                stroke #7E57C2
                shape WebBrowser
                width 440
                height 170
                fontSize 21
                icon https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg
            }

            element "Backend" {
                background #E7F4E4
                color #123D12
                stroke #6DB33F
                shape RoundedBox
                width 440
                height 170
                fontSize 21
                icon https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg
            }

            element "Database" {
                background #DCEAF7
                color #0B2E4A
                stroke #336791
                shape Cylinder
                width 380
                height 170
                fontSize 21
                icon https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg
            }

            element "LoadTest" {
                background #F5F5F5
                color #222222
                stroke #777777
                shape RoundedBox
                width 380
                height 150
                fontSize 20
            }

            element "Controller" {
                background #FFF3E0
                color #4A2A00
                stroke #F39C12
                shape Component
                width 390
                height 130
                fontSize 20
            }

            element "Service" {
                background #E8F5E9
                color #123D12
                stroke #43A047
                shape Component
                width 400
                height 130
                fontSize 20
            }

            element "RepositoryInterface" {
                background #E3F2FD
                color #0B2E4A
                stroke #1E88E5
                shape Component
                width 390
                height 130
                fontSize 20
            }

            element "RepositoryImpl" {
                background #E8EAF6
                color #1A237E
                stroke #3F51B5
                shape Component
                width 420
                height 130
                fontSize 20
            }

            element "JpaRepository" {
                background #DCEAF7
                color #0B2E4A
                stroke #336791
                shape Component
                width 400
                height 130
                fontSize 20
            }

            element "ExternalApiClient" {
                background #E1F5FE
                color #01579B
                stroke #0288D1
                shape Component
                width 420
                height 130
                fontSize 20
            }

            element "CommonInfra" {
                background #EEEEEE
                color #222222
                stroke #777777
                shape Component
                width 430
                height 140
                fontSize 20
            }

            element "FrontendRoute" {
                background #EDE7F6
                color #20124D
                stroke #7E57C2
                shape Component
                width 390
                height 130
                fontSize 20
            }

            element "FrontendPage" {
                background #EDE7F6
                color #20124D
                stroke #7E57C2
                shape Component
                width 390
                height 130
                fontSize 20
            }

            element "FrontendApi" {
                background #E0F2F1
                color #003D33
                stroke #00897B
                shape Component
                width 410
                height 130
                fontSize 20
            }

            element "FrontendGuard" {
                background #FFF3E0
                color #4A2A00
                stroke #F39C12
                shape Component
                width 390
                height 130
                fontSize 20
            }

            element "UiComponent" {
                background #F3E5F5
                color #4A148C
                stroke #8E24AA
                shape Component
                width 360
                height 120
                fontSize 20
            }

            element "AppComponent" {
                background #FFF8E1
                color #4A2A00
                stroke #F9A825
                shape Component
                width 380
                height 125
                fontSize 20
            }

            element "FrontendHook" {
                background #E8F5E9
                color #123D12
                stroke #43A047
                shape Component
                width 380
                height 125
                fontSize 20
            }

            element "FrontendLibrary" {
                background #EEEEEE
                color #222222
                stroke #777777
                shape Component
                width 390
                height 125
                fontSize 20
            }

            element "DockerService" {
                background #E3F2FD
                color #0B2E4A
                stroke #1E88E5
                width 390
                height 140
                fontSize 20
            }

            relationship "Relationship" {
                color #555555
                thickness 3
                routing Orthogonal
                fontSize 18
            }

            relationship "External" {
                color #2D7DB8
                style dashed
                thickness 3
                routing Orthogonal
                fontSize 18
            }

            relationship "Inheritance" {
                color #777777
                style dashed
                thickness 3
                routing Direct
                fontSize 17
            }

            relationship "Implementation" {
                color #777777
                style dashed
                thickness 3
                routing Direct
                fontSize 17
            }

            relationship "Test" {
                color #777777
                style dashed
                thickness 3
                routing Orthogonal
                fontSize 18
            }

            relationship "Note" {
                color #BBBBBB
                style dotted
                thickness 2
                fontSize 16
            }
        }
    }
}