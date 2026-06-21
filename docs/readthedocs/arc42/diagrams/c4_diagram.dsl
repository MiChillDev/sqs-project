# https://playground.structurizr.com/

workspace "Chuck Norris Joke Page" "C4 diagrams for the sqs-project Chuck Norris Joke Page" {

    model {
        properties {
            "structurizr.groupSeparator" "/"
        }

        endUser = person "End User" "Browses Chuck Norris jokes." {
            tags "UserEnd"
        }

        admin = person "Administrator" "Logs in and creates or imports jokes." {
            tags "UserAdmin"
        }

        chuckApi = softwareSystem "Chuck Norris API" "Public API at api.chucknorris.io that provides Chuck Norris jokes." {
            tags "PublicApi"
            url "https://api.chucknorris.io"
        }

        chuckNorrisSystem = softwareSystem "sqs-project Chuck Norris Joke Page" "Application for browsing, fetching, creating, importing, storing and displaying Chuck Norris jokes." {
            tags "ChuckNorrisSystem"

            webApp = container "Web App" "Vite single-page application for end users and administrators." "React 19, TypeScript, Vite SPA" {
                tags "Frontend"
                properties {
                    "docker.compose.service.prod" "frontend"
                    "docker.compose.service.dev" "frontend-dev"
                    "prod.port" "${FRONTEND_PORT:-5173}:8080"
                    "dev.port" "${FRONTEND_PORT:-5173}:5173"
                }

                group "Application Shell" {
                    mainApp = component "main.tsx" "Initializes i18n and renders the React application." "React entry point" {
                        tags "AppShell"
                    }

                    queryClientProviderWrapper = component "QueryClientProviderWrapper" "Provides TanStack Query client and global API error handling." "React Provider" {
                        tags "AppShell"
                    }

                    routerComponent = component "router" "TanStack Router instance with root, index, joke, login and admin routes." "TanStack Router" {
                        tags "Route"
                    }

                    rootRoute = component "rootRoute" "Root layout with header, outlet, error boundary and not-found handling." "TanStack Root Route" {
                        tags "Route"
                    }
                }

                group "Pages / Routes" {
                    indexRoute = component "indexRoute" "Route object for /." "TanStack Route" {
                        tags "Route"
                    }

                    jokePageRoute = component "jokePageRoute" "Route object for /jokes." "TanStack Route" {
                        tags "Route"
                    }

                    loginRoute = component "loginRoute" "Route object for /login." "TanStack Route" {
                        tags "Route"
                    }

                    adminRoute = component "adminRoute" "Protected route object for /admin." "TanStack Route" {
                        tags "Route"
                    }

                    indexPage = component "IndexPage" "Landing page with animated welcome and navigation to jokes." "React Page" {
                        tags "FrontendPage"
                    }

                    jokePage = component "JokePage" "Public joke page that fetches and displays random jokes." "React Page" {
                        tags "FrontendPage"
                    }

                    loginPage = component "LoginPage" "Login form that authenticates administrators and stores tokens." "React Page" {
                        tags "FrontendPage"
                    }

                    adminPage = component "AdminPage" "Protected administration page with source-joke and create-joke tabs." "React Page" {
                        tags "FrontendPage"
                    }
                }

                group "Admin Sections" {
                    sourceJokeSection = component "SourceJokeSection" "Fetches a source joke and allows saving it to the local database." "React Component" {
                        tags "FrontendSection"
                    }

                    jokeCreationSection = component "JokeCreationSection" "Form for creating a new local joke." "React Component" {
                        tags "FrontendSection"
                    }
                }

                group "API Layer" {
                    fetchApi = component "fetchApi" "Typed HTTP client with timeout, auth header support and JSON/error handling." "TypeScript HTTP Client" {
                        tags "FrontendApi"
                    }

                    useRandomJoke = component "useRandomJoke" "React Query hook for GET /api/v1/jokes." "TanStack Query Hook" {
                        tags "FrontendApi"
                    }

                    useHealthCheck = component "useHealthCheck" "React Query hook for GET /api/v1/health." "TanStack Query Hook" {
                        tags "FrontendApi"
                    }

                    useCreateJoke = component "useCreateJoke" "React Query mutation for POST /api/v1/jokes." "TanStack Query Hook" {
                        tags "FrontendApi"
                    }

                    useLogin = component "useLogin" "React Query mutation for POST /api/v1/auth/login." "TanStack Query Hook" {
                        tags "FrontendApi"
                    }

                    useSourceJoke = component "useSourceJoke" "React Query hook for GET /api/v1/source-joke." "TanStack Query Hook" {
                        tags "FrontendApi"
                    }

                    generatedTypes = component "Generated API Types" "Types generated from api/openapi.yaml." "OpenAPI generated TypeScript types" {
                        tags "FrontendApi"
                    }

                    apiError = component "ApiError" "Typed HTTP error containing status, statusText and response body." "TypeScript Error" {
                        tags "FrontendError"
                    }

                    networkError = component "NetworkError" "Typed network failure error wrapping the original error." "TypeScript Error" {
                        tags "FrontendError"
                    }
                }

                group "Authentication / State" {
                    requireAuth = component "requireAuth" "Route guard that redirects unauthenticated users to /login." "TanStack Router Guard" {
                        tags "FrontendState"
                    }

                    authStorage = component "auth-storage" "Stores, reads and notifies about the current auth token." "Browser storage utility" {
                        tags "FrontendState"
                    }

                    loginHelpers = component "login-helpers" "Resolves safe redirects and maps login errors to translation keys." "TypeScript Library" {
                        tags "FrontendState"
                    }

                    useBanner = component "useBanner" "Local hook for login banner state." "React Hook" {
                        tags "FrontendState"
                    }

                    loginSchema = component "login-schema" "Zod schema for login form validation." "Zod Schema" {
                        tags "FrontendValidation"
                    }
                }

                group "Hooks" {
                    useTheme = component "useTheme" "Persists and toggles the light/dark theme." "React Hook" {
                        tags "FrontendHook"
                    }

                    useJokeCounter = component "useJokeCounter" "Counts displayed jokes and triggers confetti milestones." "React Hook" {
                        tags "FrontendHook"
                    }

                    useZodForm = component "useZodForm" "Wraps react-hook-form with localized Zod validation." "React Hook" {
                        tags "FrontendHook"
                    }

                    useZodResolver = component "useZodResolver" "Creates a localized Zod resolver." "React Hook" {
                        tags "FrontendHook"
                    }
                }

                group "Shared Components" {
                    group "Application Components" {
                        animatedWelcome = component "AnimatedWelcome" "Animated landing-page heading." "React Component" {
                            tags "AppComponent"
                        }

                        errorAlert = component "ErrorAlert" "Displays recoverable frontend errors with retry action." "React Component" {
                            tags "AppComponent"
                        }

                        i18nWatcher = component "I18nWatcher" "Keeps UI language state in sync with i18next." "React Component" {
                            tags "AppComponent"
                        }

                        languageToggle = component "LanguageToggle" "Allows switching the application language." "React Component" {
                            tags "AppComponent"
                        }

                        themeToggle = component "ThemeToggle" "Allows switching the UI theme." "React Component" {
                            tags "AppComponent"
                        }

                        toaster = component "Toaster" "Displays toast notifications." "React Component" {
                            tags "AppComponent"
                        }

                        userMenu = component "UserMenu" "Displays authentication-related user actions." "React Component" {
                            tags "AppComponent"
                        }

                        confetti = component "Confetti" "Displays visual feedback effects." "React Component" {
                            tags "AppComponent"
                        }
                    }

                    group "UI Library" {
                        button = component "Button" "Reusable button component." "React Component" {
                            tags "UiComponent"
                        }

                        card = component "Card" "Reusable card component." "React Component" {
                            tags "UiComponent"
                        }

                        field = component "Field" "Reusable form field composition." "React Component" {
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

                        sheet = component "Sheet" "Reusable sheet/drawer component." "React Component" {
                            tags "UiComponent"
                        }

                        textarea = component "Textarea" "Reusable textarea component." "React Component" {
                            tags "UiComponent"
                        }
                    }
                }

                group "Shared Libraries" {
                    utils = component "utils" "Utility functions, including cn()." "TypeScript Library" {
                        tags "FrontendLibrary"
                    }

                    i18n = component "i18n" "Internationalization setup using i18next." "i18next" {
                        tags "FrontendLibrary"
                    }

                    errorMessages = component "error-messages" "Maps technical errors to user-facing messages." "TypeScript Library" {
                        tags "FrontendError"
                    }

                    errorClassifier = component "error-classifier" "Maps caught errors to stable error keys." "TypeScript Library" {
                        tags "FrontendError"
                    }

                    handle401 = component "handle-401" "Handles unauthorized API responses and navigates to login." "TypeScript Library" {
                        tags "FrontendError"
                    }

                    debugLogger = component "debug-logger" "Frontend debug logging utility." "TypeScript Library" {
                        tags "FrontendLibrary"
                    }

                    zodLocales = component "zod-locales" "Localized validation messages for Zod." "Zod" {
                        tags "FrontendValidation"
                    }

                    jokeCounterLib = component "joke-counter" "Pure counter and confetti helper functions." "TypeScript Library" {
                        tags "FrontendLibrary"
                    }
                }
            }

            apiBackend = container "API Backend" "Spring Boot REST API for jokes, authentication, seed admin setup and health checks." "Java 21, Spring Boot 4" {
                tags "Backend"
                properties {
                    "docker.compose.service" "app"
                    "port" "${BACKEND_PORT:-8080}:8080"
                    "base.path" "/api/v1"
                    "datasource.url" "jdbc:postgresql://postgres:5432/${POSTGRES_DB:-sqs_db}"
                }

                group "Jokes Domain" {
                    jokeController = component "JokeController" "REST controller for random jokes, local joke creation and source jokes." "Spring REST Controller" {
                        tags "Controller"
                    }

                    jokeService = component "JokeService" "Joke use cases: get random, create local and get source joke." "Spring Service" {
                        tags "Service"
                    }

                    jokeRepository = component "JokeRepository" "Repository interface for persisted jokes." "Java Interface" {
                        tags "RepositoryInterface"
                    }

                    jokeRepositoryImpl = component "JokeRepositoryImpl" "Adapter around Spring Data joke persistence." "Spring Repository Adapter" {
                        tags "RepositoryImpl"
                    }

                    springJokeRepository = component "SpringJokeRepository" "Spring Data repository for JokeEntity." "Spring Data JpaRepository" {
                        tags "JpaRepository"
                    }

                    apiJokeRepository = component "ApiJokeRepository" "Repository interface for external source jokes." "Java Interface" {
                        tags "RepositoryInterface"
                    }

                    chuckNorrisApiJokeRepositoryImpl = component "ChuckNorrisApiJokeRepositoryImpl" "Production external API client for api.chucknorris.io." "Spring Repository, RestTemplate" {
                        tags "ExternalApiClient"
                    }

                }

                group "Authentication Domain" {
                    authController = component "AuthController" "REST controller for POST /api/v1/auth/login." "Spring REST Controller" {
                        tags "Controller"
                    }

                    authService = component "AuthService" "Performs login and bearer-token validation." "Spring Service" {
                        tags "Service"
                    }

                    authRepository = component "AuthRepository" "Repository interface for authentication sessions." "Java Interface" {
                        tags "RepositoryInterface"
                    }

                    authRepositoryImpl = component "AuthRepositoryImpl" "Adapter around Spring Data auth-session persistence." "Spring Repository Adapter" {
                        tags "RepositoryImpl"
                    }

                    springAuthSessionRepository = component "SpringAuthSessionRepository" "Spring Data repository for AuthSessionEntity." "Spring Data JpaRepository" {
                        tags "JpaRepository"
                    }
                }

                group "Users Domain" {
                    userService = component "UserService" "User lookup service used during login." "Spring Service" {
                        tags "Service"
                    }

                    seedAdminService = component "SeedAdminService" "Creates or updates the configured seed administrator." "Spring Service" {
                        tags "Service"
                    }

                    userRepository = component "UserRepository" "Repository interface for users." "Java Interface" {
                        tags "RepositoryInterface"
                    }

                    userRepositoryImpl = component "UserRepositoryImpl" "Adapter around Spring Data user persistence." "Spring Repository Adapter" {
                        tags "RepositoryImpl"
                    }

                    springUserRepository = component "SpringUserRepository" "Spring Data repository for UserEntity." "Spring Data JpaRepository" {
                        tags "JpaRepository"
                    }
                }

                group "Health" {
                    healthController = component "HealthController" "Provides GET /api/v1/health with a static UP response." "Spring REST Controller" {
                        tags "Controller"
                    }
                }

                group "Common Infrastructure" {
                    baseController = component "BaseController" "Common controller superclass for authenticated and unauthenticated execution." "Java superclass" {
                        tags "CommonInfra"
                    }

                    either = component "Either<L,R>" "Domain result type for success and error outcomes." "Java Domain Type" {
                        tags "CommonInfra"
                    }

                    errorResultStatus = component "ErrorResultStatus" "Domain error status with HTTP code and message." "Java Record" {
                        tags "CommonInfra"
                    }

                    passwordHasher = component "PasswordHasher" "Hashes and verifies passwords using PBKDF2." "PBKDF2 Utility" {
                        tags "CommonInfra"
                    }

                    apiRepository = component "ApiRepository" "Abstract base class for external API access using RestTemplate." "Abstract Class, RestTemplate" {
                        tags "CommonInfra"
                    }

                    seedAdminInitializer = component "SeedAdminInitializer" "Validates seed admin configuration and runs the seed admin service on startup." "Spring ApplicationRunner" {
                        tags "CommonInfra"
                    }
                }
            }

            database = container "Database" "Stores jokes, users and authentication sessions." "PostgreSQL 16" {
                tags "Database"
                properties {
                    "docker.compose.service" "postgres"
                    "image" "postgres:16-alpine"
                    "port" "${POSTGRES_PORT:-5432}:5432"
                    "database" "${POSTGRES_DB:-sqs_db}"
                    "volume" "postgres_data"
                }
            }

            k6Runner = container "k6 Load Test Runner" "Optional Docker Compose service for load testing the backend API." "Grafana k6" {
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
        admin -> chuckNorrisSystem "Administers jokes"
        chuckNorrisSystem -> chuckApi "Fetches source jokes" "HTTPS/JSON" {
            tags "External"
        }

        // C2 - Containers
        endUser -> webApp "Uses" "HTTPS"
        admin -> webApp "Uses admin UI" "HTTPS"
        webApp -> apiBackend "Calls REST API" "HTTPS/JSON"
        apiBackend -> database "Reads/writes data" "JDBC/JPA"
        apiBackend -> chuckApi "Fetches source jokes" "HTTPS/JSON" {
            tags "External"
        }
        k6Runner -> apiBackend "Runs load tests" "HTTP" {
            tags "Test"
        }

        // Frontend shell and routing
        mainApp -> i18n "Initializes"
        mainApp -> debugLogger "Logs init errors"
        mainApp -> queryClientProviderWrapper "Wraps app"
        queryClientProviderWrapper -> routerComponent "Provides app routes"
        queryClientProviderWrapper -> errorMessages "Maps API errors"
        queryClientProviderWrapper -> toaster "Shows toasts"

        routerComponent -> rootRoute "Uses root layout"
        routerComponent -> indexRoute "Registers"
        routerComponent -> jokePageRoute "Registers"
        routerComponent -> loginRoute "Registers"
        routerComponent -> adminRoute "Registers"

        rootRoute -> indexPage "Renders at /"
        rootRoute -> jokePage "Renders at /jokes"
        rootRoute -> loginPage "Renders at /login"
        rootRoute -> adminPage "Renders at /admin"
        rootRoute -> i18nWatcher "Uses"
        rootRoute -> languageToggle "Uses"
        rootRoute -> themeToggle "Uses"
        rootRoute -> userMenu "Uses"
        rootRoute -> toaster "Uses"
        rootRoute -> useTheme "Uses"
        rootRoute -> errorMessages "Shows safe errors"

        indexRoute -> indexPage "Renders"
        jokePageRoute -> jokePage "Renders"
        loginRoute -> loginPage "Renders"
        adminRoute -> requireAuth "Checks access"
        adminRoute -> adminPage "Renders"
        requireAuth -> authStorage "Reads token"
        requireAuth -> loginRoute "Redirects if missing"

        // Frontend page flows
        indexPage -> animatedWelcome "Uses"
        indexPage -> button "Uses"
        indexPage -> jokePageRoute "Links to"

        jokePage -> fetchApi "GET /jokes"
        jokePage -> useJokeCounter "Counts jokes"
        jokePage -> confetti "Shows milestones"
        jokePage -> card "Uses"
        jokePage -> button "Uses"
        useJokeCounter -> jokeCounterLib "Uses helpers"

        loginPage -> useLogin "Submits login"
        loginPage -> useZodForm "Validates form"
        loginPage -> loginSchema "Uses schema"
        loginPage -> useBanner "Shows errors"
        loginPage -> authStorage "Stores token"
        loginPage -> loginHelpers "Maps redirect/errors"
        loginPage -> card "Uses"
        loginPage -> field "Uses"
        loginPage -> input "Uses"
        loginPage -> button "Uses"
        loginHelpers -> apiError "Classifies"
        loginHelpers -> networkError "Classifies"

        adminPage -> sourceJokeSection "Tab: source"
        adminPage -> jokeCreationSection "Tab: create"
        sourceJokeSection -> useSourceJoke "Fetches source"
        sourceJokeSection -> useCreateJoke "Saves source"
        sourceJokeSection -> errorAlert "Shows errors"
        sourceJokeSection -> errorClassifier "Maps errors"
        sourceJokeSection -> handle401 "Handles 401"
        sourceJokeSection -> card "Uses"
        sourceJokeSection -> button "Uses"
        jokeCreationSection -> useCreateJoke "Creates joke"
        jokeCreationSection -> useZodForm "Validates form"
        jokeCreationSection -> errorAlert "Shows errors"
        jokeCreationSection -> errorClassifier "Maps errors"
        jokeCreationSection -> handle401 "Handles 401"
        jokeCreationSection -> card "Uses"
        jokeCreationSection -> field "Uses"
        jokeCreationSection -> input "Uses"
        jokeCreationSection -> textarea "Uses"
        jokeCreationSection -> button "Uses"
        handle401 -> authStorage "Clears/reads token"
        handle401 -> loginRoute "Navigates to login"

        // Frontend API layer
        useRandomJoke -> fetchApi "GET /jokes"
        useHealthCheck -> fetchApi "GET /health"
        useCreateJoke -> fetchApi "POST /jokes"
        useLogin -> fetchApi "POST /auth/login"
        useSourceJoke -> fetchApi "GET /source-joke"
        fetchApi -> authStorage "Adds bearer token"
        fetchApi -> apiBackend "Calls REST endpoints" "HTTPS/JSON"
        fetchApi -> apiError "Throws HTTP errors"
        fetchApi -> networkError "Throws network errors"
        fetchApi -> generatedTypes "Uses API types"
        fetchApi -> jokeController "Calls joke endpoints" "HTTPS/JSON"
        fetchApi -> authController "Calls login endpoint" "HTTPS/JSON"
        fetchApi -> healthController "Calls health endpoint" "HTTPS/JSON"

        // Frontend shared utilities
        useZodForm -> useZodResolver "Uses resolver"
        useZodResolver -> zodLocales "Uses locales"
        themeToggle -> useTheme "Toggles theme"
        languageToggle -> i18n "Changes language"
        i18nWatcher -> i18n "Syncs language"
        toaster -> errorMessages "Displays messages"
        errorAlert -> errorMessages "Displays messages"
        button -> utils "Uses cn()"
        card -> utils "Uses cn()"
        field -> utils "Uses cn()"
        input -> utils "Uses cn()"
        label -> utils "Uses cn()"
        separator -> utils "Uses cn()"
        dropdownMenu -> utils "Uses cn()"
        sheet -> utils "Uses cn()"
        textarea -> utils "Uses cn()"

        // Backend public entry points
        webApp -> jokeController "Joke endpoints" "HTTPS/JSON"
        webApp -> authController "Login endpoint" "HTTPS/JSON"
        webApp -> healthController "Health endpoint" "HTTPS/JSON"

        // Backend Jokes Domain
        jokeController -> jokeService "Delegates"
        jokeController -> baseController "Extends" {
            tags "Inheritance"
        }
        jokeService -> jokeRepository "Persists jokes"
        jokeService -> apiJokeRepository "Gets source joke"
        jokeRepositoryImpl -> jokeRepository "Implements" {
            tags "Implementation"
        }
        jokeRepositoryImpl -> springJokeRepository "Delegates"
        springJokeRepository -> database "jokes" "JPA"
        chuckNorrisApiJokeRepositoryImpl -> apiJokeRepository "Implements" {
            tags "Implementation"
        }
        chuckNorrisApiJokeRepositoryImpl -> apiRepository "Extends" {
            tags "Inheritance"
        }
        chuckNorrisApiJokeRepositoryImpl -> chuckApi "GET /jokes/random" "HTTPS/JSON" {
            tags "External"
        }

        // Backend Authentication Domain
        authController -> authService "Login"
        authController -> baseController "Extends" {
            tags "Inheritance"
        }
        authService -> authRepository "Stores sessions"
        authService -> userService "Finds user"
        authService -> passwordHasher "Verifies hash"
        authRepositoryImpl -> authRepository "Implements" {
            tags "Implementation"
        }
        authRepositoryImpl -> springAuthSessionRepository "Delegates"
        springAuthSessionRepository -> database "auth_sessions" "JPA"

        // Backend Users Domain
        userService -> userRepository "Finds users"
        seedAdminService -> userRepository "Creates/updates admin"
        seedAdminService -> passwordHasher "Hashes password"
        userRepositoryImpl -> userRepository "Implements" {
            tags "Implementation"
        }
        userRepositoryImpl -> springUserRepository "Delegates"
        springUserRepository -> database "users" "JPA"

        // Backend common infrastructure
        baseController -> authService "Validates token"
        baseController -> either "Handles results"
        baseController -> errorResultStatus "Maps errors"
        apiRepository -> either "Returns result"
        apiRepository -> errorResultStatus "Creates errors"
        seedAdminInitializer -> seedAdminService "Runs on startup"
    
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
            include endUser admin chuckNorrisSystem chuckApi
            autoLayout lr 500 650
        }

        container chuckNorrisSystem "C2_Containers" {
            title "C2 - Containers"
            include endUser admin webApp apiBackend database chuckApi
            autoLayout lr 550 750
        }

        container chuckNorrisSystem "C2_LoadTesting" {
            title "C2 - Load Testing"
            include k6Runner apiBackend database
            autoLayout lr 500 650
        }

        component webApp "C3_Frontend_Routing" {
            title "C3 - Frontend Routing and Application Shell"
            include mainApp queryClientProviderWrapper routerComponent rootRoute indexRoute jokePageRoute loginRoute adminRoute indexPage jokePage loginPage adminPage requireAuth authStorage i18n debugLogger
            autoLayout lr 650 850
        }

        component webApp "C3_Frontend_JokeBrowsing" {
            title "C3 - Frontend Joke Browsing Flow"
            include endUser jokePage fetchApi apiBackend useJokeCounter jokeCounterLib confetti card button apiError networkError
            autoLayout lr 700 850
        }

        component webApp "C3_Frontend_Authentication" {
            title "C3 - Frontend Authentication Flow"
            include admin loginPage useLogin fetchApi apiBackend authStorage loginHelpers useBanner useZodForm loginSchema apiError networkError card field input button
            autoLayout lr 700 850
        }

        component webApp "C3_Frontend_Admin" {
            title "C3 - Frontend Admin Flows"
            include admin adminPage sourceJokeSection jokeCreationSection useSourceJoke useCreateJoke fetchApi apiBackend useZodForm useZodResolver zodLocales handle401 errorClassifier errorAlert authStorage card field input textarea button
            autoLayout lr 700 900
        }

        component webApp "C3_Frontend_API_Layer" {
            title "C3 - Frontend API Layer"
            include fetchApi useRandomJoke useHealthCheck useCreateJoke useLogin useSourceJoke generatedTypes authStorage apiError networkError apiBackend
            autoLayout lr 700 850
        }

        component webApp "C3_Frontend_SharedFoundation" {
            title "C3 - Frontend Shared Foundation"
            include rootRoute i18nWatcher languageToggle themeToggle userMenu toaster useTheme i18n errorMessages errorAlert errorClassifier handle401 authStorage useZodForm useZodResolver zodLocales debugLogger utils
            autoLayout lr 650 850
        }

        component webApp "C3_Frontend_UIComponents" {
            title "C3 - Frontend UI Components"
            include indexPage jokePage loginPage adminPage sourceJokeSection jokeCreationSection animatedWelcome errorAlert confetti button card field input label separator dropdownMenu sheet textarea utils
            autoLayout tb 650 850
        }

        component apiBackend "C3_Backend_PublicEndpoints" {
            title "C3 - Backend Public API Endpoints"
            include webApp jokeController authController healthController jokeService authService baseController
            autoLayout lr 650 800
        }

        component apiBackend "C3_Backend_Jokes" {
            title "C3 - Backend Jokes Domain"
            include webApp jokeController jokeService jokeRepository jokeRepositoryImpl springJokeRepository apiJokeRepository chuckNorrisApiJokeRepositoryImpl apiRepository database chuckApi baseController
            autoLayout lr 700 900
        }

        component apiBackend "C3_Backend_Authentication" {
            title "C3 - Backend Authentication Domain"
            include webApp authController authService authRepository authRepositoryImpl springAuthSessionRepository userService userRepository passwordHasher baseController database
            autoLayout lr 700 900
        }

        component apiBackend "C3_Backend_Users" {
            title "C3 - Backend Users Domain"
            include userService seedAdminService userRepository userRepositoryImpl springUserRepository passwordHasher database
            autoLayout lr 650 850
        }

        component apiBackend "C3_Backend_SeedAdmin" {
            title "C3 - Backend Seed Admin Startup"
            include seedAdminInitializer seedAdminService userRepository userRepositoryImpl springUserRepository passwordHasher database
            autoLayout lr 650 850
        }

        component apiBackend "C3_Backend_Common" {
            title "C3 - Backend Common Infrastructure"
            include baseController authService either errorResultStatus apiRepository passwordHasher chuckNorrisApiJokeRepositoryImpl chuckApi
            autoLayout lr 650 850
        }

        component apiBackend "C3_Backend_Health" {
            title "C3 - Backend Health Endpoint"
            include webApp healthController
            autoLayout lr 500 650
        }

        deployment * "Docker Compose" "D1_DockerCompose" {
            title "Deployment - Docker Compose"
            include *
            autoLayout lr 550 750
        }

        image apiBackend "C4_BackendCode_Overview" {
            title "C4 - Backend Code Overview"
            description "Compact backend code overview without DTOs and entities."
            image backend-code-overview.svg
        }
        
        image apiBackend "C4_BackendCode_Jokes" {
            title "C4 - Backend Code - Jokes Package"
            description "Detailed code view for the jokes package."
            image backend-code-jokes.svg
        }

        image apiBackend "C4_BackendCode_Users" {
            title "C4 - Backend Code - Users Package"
            description "Detailed code view for the users package and seed admin flow."
            image backend-code-users.svg
        }
        
        image apiBackend "C4_BackendCode_Auth" {
            title "C4 - Backend Code - Authentication Package"
            description "Detailed code view for the authentication package."
            image backend-code-auth.svg
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
                stroke #9A6A00
                width 360
                height 170
                fontSize 26
            }

            element "UserEnd" {
                background #FFE7A3
                color #111111
            }

            element "UserAdmin" {
                background #FFD36E
                color #111111
            }

            element "ChuckNorrisSystem" {
                background #2F6FBA
                color #FFFFFF
                stroke #174B86
                shape RoundedBox
                width 520
                height 210
                fontSize 26
            }

            element "PublicApi" {
                background #B7D9FF
                color #0B2E4A
                stroke #4B8FD3
                shape Hexagon
                width 430
                height 190
                fontSize 24
            }

            element "Frontend" {
                background #F1E7FF
                color #24144D
                stroke #8E63CE
                shape WebBrowser
                width 470
                height 200
                fontSize 25
            }

            element "Backend" {
                background #E4F4E2
                color #123D12
                stroke #64A83F
                shape RoundedBox
                width 470
                height 200
                fontSize 25
            }

            element "Database" {
                background #DCECF8
                color #0B2E4A
                stroke #336791
                shape Cylinder
                width 430
                height 200
                fontSize 25
            }

            element "LoadTest" {
                background #F4F4F5
                color #202124
                stroke #71717A
                shape RoundedBox
                width 430
                height 180
                fontSize 24
            }

            element "Route" {
                background #EDE7F6
                color #21104B
                stroke #7E57C2
                shape Component
                width 470
                height 150
                fontSize 24
            }

            element "AppShell" {
                background #E8EAF6
                color #1A237E
                stroke #5C6BC0
                shape Component
                width 530
                height 155
                fontSize 24
            }

            element "FrontendPage" {
                background #F3E5F5
                color #4A148C
                stroke #9C27B0
                shape Component
                width 470
                height 150
                fontSize 24
            }

            element "FrontendSection" {
                background #FFF3E0
                color #4A2A00
                stroke #FB8C00
                shape Component
                width 520
                height 155
                fontSize 24
            }

            element "FrontendApi" {
                background #DFF5F1
                color #003D33
                stroke #00897B
                shape Component
                width 520
                height 155
                fontSize 24
            }

            element "FrontendState" {
                background #E3F2FD
                color #0B2E4A
                stroke #1E88E5
                shape Component
                width 500
                height 155
                fontSize 24
            }

            element "FrontendHook" {
                background #E8F5E9
                color #123D12
                stroke #43A047
                shape Component
                width 500
                height 155
                fontSize 24
            }

            element "FrontendLibrary" {
                background #F5F5F5
                color #222222
                stroke #8A8A8A
                shape Component
                width 470
                height 150
                fontSize 23
            }

            element "FrontendValidation" {
                background #FFFDE7
                color #4D3D00
                stroke #FBC02D
                shape Component
                width 500
                height 150
                fontSize 23
            }

            element "FrontendError" {
                background #FFEBEE
                color #5D1018
                stroke #E57373
                shape Component
                width 500
                height 150
                fontSize 23
            }

            element "UiComponent" {
                background #FCE4EC
                color #5A1431
                stroke #C2185B
                shape Component
                width 440
                height 145
                fontSize 23
            }

            element "AppComponent" {
                background #FFF8E1
                color #4A2A00
                stroke #F9A825
                shape Component
                width 470
                height 145
                fontSize 23
            }

            element "Controller" {
                background #FFF3E0
                color #4A2A00
                stroke #F39C12
                shape Component
                width 500
                height 155
                fontSize 24
            }

            element "Service" {
                background #E8F5E9
                color #123D12
                stroke #43A047
                shape Component
                width 520
                height 155
                fontSize 24
            }

            element "RepositoryInterface" {
                background #E3F2FD
                color #0B2E4A
                stroke #1E88E5
                shape Component
                width 560
                height 155
                fontSize 24
            }

            element "RepositoryImpl" {
                background #E8EAF6
                color #1A237E
                stroke #3F51B5
                shape Component
                width 600
                height 155
                fontSize 23
            }

            element "JpaRepository" {
                background #DCECF8
                color #0B2E4A
                stroke #336791
                shape Component
                width 600
                height 155
                fontSize 23
            }

            element "ExternalApiClient" {
                background #E1F5FE
                color #01579B
                stroke #0288D1
                shape Component
                width 760
                height 160
                fontSize 22
            }

            element "TestDouble" {
                background #F4F4F5
                color #202124
                stroke #71717A
                shape Component
                width 610
                height 155
                fontSize 22
            }

            element "CommonInfra" {
                background #EEEEEE
                color #222222
                stroke #777777
                shape Component
                width 530
                height 155
                fontSize 23
            }

            element "DockerService" {
                background #E3F2FD
                color #0B2E4A
                stroke #1E88E5
                width 420
                height 170
                fontSize 23
            }

            relationship "Relationship" {
                color #444444
                thickness 3
                routing Orthogonal
                fontSize 22
            }

            relationship "External" {
                color #2477B3
                style dashed
                thickness 3
                routing Orthogonal
                fontSize 22
            }

            relationship "Inheritance" {
                color #6B7280
                style dashed
                thickness 3
                routing Orthogonal
                fontSize 21
            }

            relationship "Implementation" {
                color #4B5563
                style dashed
                thickness 3
                routing Orthogonal
                fontSize 21
            }

            relationship "Test" {
                color #71717A
                style dashed
                thickness 3
                routing Orthogonal
                fontSize 21
            }
        }
    }
}