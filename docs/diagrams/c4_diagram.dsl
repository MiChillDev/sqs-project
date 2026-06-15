# https://playground.structurizr.com/

workspace "Chuck Norris Jokes" "C4-Diagramme für das SQS-Projekt" {

    model {
        user1 = person "Einfacher Benutzer" "Kann sich Chuck-Norris-Witze anzeigen lassen." {
            tags "UserSimple"
        }

        user2 = person "Administrator" "Kann sich anmelden und neue Witze erstellen/importieren." {
            tags "UserAdmin"
        }

        chuckApi = softwareSystem "api.chucknorris.io" {
            description "Öffentliche API für Chuck-Norris-Witze."
            tags "PublicApi"
        }

        chuckNorrisSystem = softwareSystem "SQS-Projekt 'Chuck Norris Jokes'" {
            description "Anwendung zum Abrufen, Speichern, Erstellen und Anzeigen von Chuck-Norris-Witzen."
            tags "ChuckNorrisSystem"

            frontend = container "Frontend" "Single Page Application für Benutzer und Administratoren." "TypeScript, Vite" {
                tags "Frontend"
            }

            backendApi = container "Backend API" "REST API für Witze, Authentifizierung, Benutzerabfragen und Healthchecks." "Java, Spring Boot" {
                tags "Backend"

                group "Jokes" {
                    jokeController = component "JokeController" "REST API für das Frontend: Witze abrufen und neue Witze erstellen." "Spring REST Controller" {
                        tags "Controller"
                    }

                    jokeService = component "JokeService" "Fachlogik für Witze; koordiniert Repository-Zugriffe und Import von api.chucknorris.io." "Spring Service" {
                        tags "Service"
                    }

                    jokeRepository = component "JokeRepository" "Persistenzzugriff für gespeicherte Witze." "Spring Data JPA Repository" {
                        tags "Repository"
                    }
                }

                group "Authentication" {
                    authController = component "AuthController" "REST API für Login und Tokenprüfung." "Spring REST Controller" {
                        tags "Controller"
                    }

                    authService = component "AuthService" "Führt Login durch und prüft, ob Tokens gültig sind." "Spring Service" {
                        tags "Service"
                    }

                    authRepository = component "AuthRepository" "Persistenzzugriff für AuthSessionEntity." "Spring Data JPA Repository" {
                        tags "Repository"
                    }
                }

                group "Users" {
                    userService = component "UserService" "Sucht Benutzer; erstellt oder verändert keine Benutzer." "Spring Service" {
                        tags "Service"
                    }

                    userRepository = component "UserRepository" "Persistenzzugriff für UserEntity." "Spring Data JPA Repository" {
                        tags "Repository"
                    }
                }

                group "Health" {
                    healthController = component "HealthController" "Stellt Health-Endpunkte für Betriebs-/Verfügbarkeitsprüfungen bereit." "Spring REST Controller" {
                        tags "Controller"
                    }
                }
            }

            database = container "PostgreSQL Datenbank" "Speichert Witze, Benutzer und Auth-Sessions." "PostgreSQL" {
                tags "Database"
            }
        }

        // Kontext
        user1 -> chuckNorrisSystem "Lässt sich Witze anzeigen"
        user2 -> chuckNorrisSystem "Meldet sich an und erstellt/importiert neue Witze"
        chuckNorrisSystem -> chuckApi "Ruft neue Witze ab" "HTTPS/JSON" {
            tags "External"
        }

        // Container
        user1 -> frontend "Verwendet die Weboberfläche" "HTTPS"
        user2 -> frontend "Verwendet die Admin-Funktionen" "HTTPS"

        frontend -> backendApi "Fragt Witze ab, erstellt neue Witze und führt Login/Tokenprüfung aus" "HTTPS/JSON"
        backendApi -> database "Liest und schreibt Witze, Benutzer und Auth-Sessions" "JDBC/JPA"
        backendApi -> chuckApi "Ruft neue Witze ab" "HTTPS/JSON" {
            tags "External"
        }

        // Komponenten: Frontend -> Backend API
        frontend -> jokeController "GET /jokes, POST /jokes" "HTTPS/JSON"
        frontend -> authController "POST /auth/login, Tokenprüfung" "HTTPS/JSON"
        frontend -> healthController "GET /health" "HTTPS/JSON"

        // Komponenten: Jokes
        jokeController -> jokeService "Delegiert Joke-Anfragen"
        jokeController -> authService "Prüft Token/Berechtigung für Create Joke"
        jokeService -> jokeRepository "Liest und speichert JokeEntity"
        jokeService -> chuckApi "Importiert SourceJokeDto von der öffentlichen API" "HTTPS/JSON" {
            tags "External"
        }
        jokeRepository -> database "Liest und schreibt JokeEntity" "JPA"

        // Komponenten: Authentication
        authController -> authService "Login und Tokenprüfung"
        authService -> authRepository "Liest/schreibt AuthSessionEntity"
        authService -> userService "Sucht Benutzer für Login"
        authRepository -> database "Liest und schreibt AuthSessionEntity" "JPA"

        // Komponenten: Users
        userService -> userRepository "Sucht UserEntity"
        userRepository -> database "Liest UserEntity" "JPA"

        // Komponenten: Health
        healthController -> database "Prüft Datenbankverfügbarkeit"
    }

    views {

        properties {
            "plantuml.url" "https://plantuml.com/plantuml"
            "plantuml.format" "svg"
        }

        systemContext chuckNorrisSystem "C1_SystemContext" {
            title "C1 - Systemkontext"
            include *
            autoLayout lr
        }

        container chuckNorrisSystem "C2_Containers" {
            title "C2 - Container"
            include *
            autoLayout lr
        }

        component backendApi "C3_BackendComponents" {
            title "C3 - Komponenten des Backends"
            include *
            autoLayout lr
        }

        image backendApi "C4_BackendCode" {
            title "C4 - Code-Sicht Backend"
            description "PlantUML-Klassendiagramm als Image View, da Structurizr Code-Level-Diagramme nicht nativ modelliert."
            plantuml docs/diagrams/backend-code.puml
        }

        theme default

        styles {
            element "Person" {
                shape Person
                color #111111
                stroke #8A6D00
            }

            element "UserSimple" {
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

            element "Repository" {
                background #E3F2FD
                color #0B2E4A
                stroke #1E88E5
                shape Component
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
        }
    }
}