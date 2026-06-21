package com.chucknorris.users.service;

import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.common.utils.PasswordHasher;
import com.chucknorris.users.models.entity.UserEntity;
import com.chucknorris.users.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SeedAdminServiceTest {

    private static final String USERNAME = "admin";
    private static final String PASSWORD = "ValidPassword123456!";
    private static final String NEW_PASSWORD = "AnotherValidPassword123!";

    @Mock
    private UserRepository userRepository;

    @Nested
    @DisplayName("createOrUpdateSeedAdmin")
    class CreateOrUpdateSeedAdmin {
        @Nested
        @DisplayName("success scenarios")
        class Success {
            @Test
            @DisplayName("should create seed admin when user does not exist")
            void shouldCreateSeedAdminWhenUserDoesNotExist() {
                SeedAdminService service = new SeedAdminService(userRepository);

                when(userRepository.findByUsername(USERNAME))
                        .thenReturn(new Either.Right<>(Optional.empty()));

                when(userRepository.save(any(UserEntity.class)))
                        .thenAnswer(invocation -> new Either.Right<>(invocation.getArgument(0)));

                service.createOrUpdateSeedAdmin(USERNAME, PASSWORD);

                ArgumentCaptor<UserEntity> userCaptor = ArgumentCaptor.forClass(UserEntity.class);
                verify(userRepository).save(userCaptor.capture());

                UserEntity savedUser = userCaptor.getValue();

                assertThat(savedUser.getUsername()).isEqualTo(USERNAME);
                assertThat(savedUser.getPasswordHash()).isNotBlank();
                assertThat(savedUser.getPasswordHash()).isNotEqualTo(PASSWORD);
                assertPasswordMatches(PASSWORD, savedUser.getPasswordHash());
            }

            @Test
            @DisplayName("should not update seed admin when existing password already matches configured secret")
            void shouldNotUpdateSeedAdminWhenPasswordAlreadyMatchesConfiguredSecret() {
                SeedAdminService service = new SeedAdminService(userRepository);

                UserEntity existingUser = new UserEntity();
                existingUser.setUsername(USERNAME);
                existingUser.setPasswordHash(hashPassword(PASSWORD));

                when(userRepository.findByUsername(USERNAME))
                        .thenReturn(new Either.Right<>(Optional.of(existingUser)));

                service.createOrUpdateSeedAdmin(USERNAME, PASSWORD);

                verify(userRepository, never()).save(any(UserEntity.class));
                assertPasswordMatches(PASSWORD, existingUser.getPasswordHash());
            }

            @Test
            @DisplayName("should update seed admin password when existing password does not match configured secret")
            void shouldUpdateSeedAdminPasswordWhenPasswordDoesNotMatchConfiguredSecret() {
                SeedAdminService service = new SeedAdminService(userRepository);

                String oldHash = hashPassword(PASSWORD);

                UserEntity existingUser = new UserEntity();
                existingUser.setUsername(USERNAME);
                existingUser.setPasswordHash(oldHash);

                when(userRepository.findByUsername(USERNAME))
                        .thenReturn(new Either.Right<>(Optional.of(existingUser)));

                when(userRepository.save(existingUser))
                        .thenReturn(new Either.Right<>(existingUser));

                service.createOrUpdateSeedAdmin(USERNAME, NEW_PASSWORD);

                verify(userRepository).save(existingUser);

                assertThat(existingUser.getPasswordHash()).isNotBlank();
                assertThat(existingUser.getPasswordHash()).isNotEqualTo(oldHash);
                assertPasswordMatches(NEW_PASSWORD, existingUser.getPasswordHash());
            }

            @Test
            @DisplayName("should update seed admin password when existing hash is invalid")
            void shouldUpdateSeedAdminPasswordWhenExistingHashIsInvalid() {
                SeedAdminService service = new SeedAdminService(userRepository);

                UserEntity existingUser = new UserEntity();
                existingUser.setUsername(USERNAME);
                existingUser.setPasswordHash("invalid-hash");

                when(userRepository.findByUsername(USERNAME))
                        .thenReturn(new Either.Right<>(Optional.of(existingUser)));

                when(userRepository.save(existingUser))
                        .thenReturn(new Either.Right<>(existingUser));

                service.createOrUpdateSeedAdmin(USERNAME, PASSWORD);

                verify(userRepository).save(existingUser);

                assertThat(existingUser.getPasswordHash()).isNotBlank();
                assertThat(existingUser.getPasswordHash()).isNotEqualTo("invalid-hash");
                assertPasswordMatches(PASSWORD, existingUser.getPasswordHash());
            }
        }
    }

    private static String hashPassword(String password) {
        Either<ErrorResultStatus, String> result = PasswordHasher.hashPassword(password);

        assertThat(result).isInstanceOf(Either.Right.class);

        @SuppressWarnings("unchecked")
        Either.Right<ErrorResultStatus, String> right = (Either.Right<ErrorResultStatus, String>) result;

        return right.value();
    }

    private static void assertPasswordMatches(String password, String storedHash) {
        Either<ErrorResultStatus, Boolean> result = PasswordHasher.verifyPassword(password, storedHash);

        assertThat(result).isInstanceOf(Either.Right.class);

        @SuppressWarnings("unchecked")
        Either.Right<ErrorResultStatus, Boolean> right = (Either.Right<ErrorResultStatus, Boolean>) result;

        assertThat(right.value()).isTrue();
    }
}