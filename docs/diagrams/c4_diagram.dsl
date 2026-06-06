# https://playground.structurizr.com/

workspace "Chuck Norris Jokes" "C4 Kontextdiagramm" {

    model {
        user1 = person "Einfacher Benutzer"
        user2 = person "Administrator"

        chuckNorrisSystem = softwareSystem "SQS-Projekt 'Chuck Norris Jokes'" {
            description "Anwendung zum Abrufen und Anzeigen von Chuck-Norris-Witzen."
        }

        chuckApi = softwareSystem "api.chucknorris.io" {
            description "Öffentliche API für Chuck-Norris-Witze."
        }

        user1 -> chuckNorrisSystem "Lässt sich Witze anzeigen"
        user2 -> chuckNorrisSystem "Erstellt / importiert neue Witze"
        
        chuckNorrisSystem -> chuckApi "Ruft neue Witze ab"
    }

    views {
        systemContext chuckNorrisSystem {
            include *
            autolayout lr
        }

        theme default
    }
}