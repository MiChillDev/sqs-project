package com.chucknorris.config;

import com.chucknorris.users.service.SeedAdminServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

@ExtendWith(MockitoExtension.class)
class SeedAdminInitializerTest {

    private static final String VALID_USERNAME = "admin";
    private static final String VALID_PASSWORD = "ValidPassword123456!";

    @Mock
    private SeedAdminServiceImpl seedAdminService;

    @Nested
    @DisplayName("run")
    class Run {
        @Test
        @DisplayName("should create or update seed admin with valid configuration")
        void shouldCreateOrUpdateSeedAdminWithValidConfiguration() {
            SeedAdminInitializer initializer = new SeedAdminInitializer(
                    seedAdminService,
                    VALID_USERNAME,
                    VALID_PASSWORD
            );

            initializer.run(null);

            verify(seedAdminService).createOrUpdateSeedAdmin(VALID_USERNAME, VALID_PASSWORD);
        }

        @Test
        @DisplayName("should normalize CRLF characters from secrets before using them")
        void shouldNormalizeCrLfCharactersFromSecrets() {
            SeedAdminInitializer initializer = new SeedAdminInitializer(
                    seedAdminService,
                    "admin\r\n",
                    "ValidPassword123456!\r\n"
            );

            initializer.run(null);

            verify(seedAdminService).createOrUpdateSeedAdmin("admin", VALID_PASSWORD);
        }

        @Test
        @DisplayName("should fail when username is null")
        void shouldFailWhenUsernameIsNull() {
            SeedAdminInitializer initializer = new SeedAdminInitializer(
                    seedAdminService,
                    null,
                    VALID_PASSWORD
            );

            assertThatThrownBy(() -> initializer.run(null))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Missing required configuration: app.seed.admin.username");

            verifyNoInteractions(seedAdminService);
        }

        @Test
        @DisplayName("should fail when username is blank")
        void shouldFailWhenUsernameIsBlank() {
            SeedAdminInitializer initializer = new SeedAdminInitializer(
                    seedAdminService,
                    "   ",
                    VALID_PASSWORD
            );

            assertThatThrownBy(() -> initializer.run(null))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Missing required configuration: app.seed.admin.username");

            verifyNoInteractions(seedAdminService);
        }

        @Test
        @DisplayName("should fail when password is null")
        void shouldFailWhenPasswordIsNull() {
            SeedAdminInitializer initializer = new SeedAdminInitializer(
                    seedAdminService,
                    VALID_USERNAME,
                    null
            );

            assertThatThrownBy(() -> initializer.run(null))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Missing required configuration: app.seed.admin.password");

            verifyNoInteractions(seedAdminService);
        }

        @Test
        @DisplayName("should fail when password is blank")
        void shouldFailWhenPasswordIsBlank() {
            SeedAdminInitializer initializer = new SeedAdminInitializer(
                    seedAdminService,
                    VALID_USERNAME,
                    "   "
            );

            assertThatThrownBy(() -> initializer.run(null))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Missing required configuration: app.seed.admin.password");

            verifyNoInteractions(seedAdminService);
        }

        @Test
        @DisplayName("should fail when username is too short")
        void shouldFailWhenUsernameIsTooShort() {
            SeedAdminInitializer initializer = new SeedAdminInitializer(
                    seedAdminService,
                    "ad",
                    VALID_PASSWORD
            );

            assertThatThrownBy(() -> initializer.run(null))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Invalid seed admin username. Allowed: 3-64 characters, letters, numbers, dot, underscore, hyphen.");

            verifyNoInteractions(seedAdminService);
        }

        @Test
        @DisplayName("should fail when username is too long")
        void shouldFailWhenUsernameIsTooLong() {
            SeedAdminInitializer initializer = new SeedAdminInitializer(
                    seedAdminService,
                    "a".repeat(65),
                    VALID_PASSWORD
            );

            assertThatThrownBy(() -> initializer.run(null))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Invalid seed admin username. Allowed: 3-64 characters, letters, numbers, dot, underscore, hyphen.");

            verifyNoInteractions(seedAdminService);
        }

        @Test
        @DisplayName("should fail when username contains unsupported characters")
        void shouldFailWhenUsernameContainsUnsupportedCharacters() {
            SeedAdminInitializer initializer = new SeedAdminInitializer(
                    seedAdminService,
                    "admin!",
                    VALID_PASSWORD
            );

            assertThatThrownBy(() -> initializer.run(null))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Invalid seed admin username. Allowed: 3-64 characters, letters, numbers, dot, underscore, hyphen.");

            verifyNoInteractions(seedAdminService);
        }

        @Test
        @DisplayName("should fail when password is too short")
        void shouldFailWhenPasswordIsTooShort() {
            SeedAdminInitializer initializer = new SeedAdminInitializer(
                    seedAdminService,
                    VALID_USERNAME,
                    "ShortPassword1!"
            );

            assertThatThrownBy(() -> initializer.run(null))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Invalid seed admin password: must be at least 20 characters long.");

            verifyNoInteractions(seedAdminService);
        }

        @Test
        @DisplayName("should fail when password is too long")
        void shouldFailWhenPasswordIsTooLong() {
            SeedAdminInitializer initializer = new SeedAdminInitializer(
                    seedAdminService,
                    VALID_USERNAME,
                    "A".repeat(126) + "a1!"
            );

            assertThatThrownBy(() -> initializer.run(null))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Invalid seed admin password: must not be longer than 128 characters.");

            verifyNoInteractions(seedAdminService);
        }

        @Test
        @DisplayName("should fail when password contains whitespace")
        void shouldFailWhenPasswordContainsWhitespace() {
            SeedAdminInitializer initializer = new SeedAdminInitializer(
                    seedAdminService,
                    VALID_USERNAME,
                    "Valid Password123456!"
            );

            assertThatThrownBy(() -> initializer.run(null))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Invalid seed admin password: must not contain whitespace.");

            verifyNoInteractions(seedAdminService);
        }

        @Test
        @DisplayName("should fail when password contains unsupported characters")
        void shouldFailWhenPasswordContainsUnsupportedCharacters() {
            SeedAdminInitializer initializer = new SeedAdminInitializer(
                    seedAdminService,
                    VALID_USERNAME,
                    "ValidPassword123456#"
            );

            assertThatThrownBy(() -> initializer.run(null))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Invalid seed admin password: contains unsupported characters. Allowed special characters: @ _ % + = : , . ! ? -");

            verifyNoInteractions(seedAdminService);
        }

        @Test
        @DisplayName("should fail when password does not contain lowercase letter")
        void shouldFailWhenPasswordDoesNotContainLowercaseLetter() {
            SeedAdminInitializer initializer = new SeedAdminInitializer(
                    seedAdminService,
                    VALID_USERNAME,
                    "VALIDPASSWORD123456!"
            );

            assertThatThrownBy(() -> initializer.run(null))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Invalid seed admin password: must contain at least one lowercase letter.");

            verifyNoInteractions(seedAdminService);
        }

        @Test
        @DisplayName("should fail when password does not contain uppercase letter")
        void shouldFailWhenPasswordDoesNotContainUppercaseLetter() {
            SeedAdminInitializer initializer = new SeedAdminInitializer(
                    seedAdminService,
                    VALID_USERNAME,
                    "validpassword123456!"
            );

            assertThatThrownBy(() -> initializer.run(null))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Invalid seed admin password: must contain at least one uppercase letter.");

            verifyNoInteractions(seedAdminService);
        }

        @Test
        @DisplayName("should fail when password does not contain number")
        void shouldFailWhenPasswordDoesNotContainNumber() {
            SeedAdminInitializer initializer = new SeedAdminInitializer(
                    seedAdminService,
                    VALID_USERNAME,
                    "ValidPasswordabcdef!"
            );

            assertThatThrownBy(() -> initializer.run(null))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Invalid seed admin password: must contain at least one number.");

            verifyNoInteractions(seedAdminService);
        }

        @Test
        @DisplayName("should fail when password does not contain special character")
        void shouldFailWhenPasswordDoesNotContainSpecialCharacter() {
            SeedAdminInitializer initializer = new SeedAdminInitializer(
                    seedAdminService,
                    VALID_USERNAME,
                    "ValidPassword1234567"
            );

            assertThatThrownBy(() -> initializer.run(null))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessage("Invalid seed admin password: must contain at least one special character from: @ _ % + = : , . ! ? -");

            verifyNoInteractions(seedAdminService);
        }
    }
}