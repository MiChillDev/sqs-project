package com.chucknorris.auth.repository;

import com.chucknorris.auth.models.entity.AuthSessionEntity;
import com.chucknorris.auth.repository.spring.SpringAuthSessionRepository;
import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthRepositoryImplTest {

    @Mock
    private SpringAuthSessionRepository springAuthSessionRepository;

    @Nested
    @DisplayName("saveToken")
    class SaveToken {
        @Test
        @DisplayName("should save token and return created session")
        void shouldSaveTokenAndReturnCreatedSession() {
            AuthRepositoryImpl repository = new AuthRepositoryImpl(springAuthSessionRepository);

            UUID userId = UUID.randomUUID();

            ArgumentCaptor<AuthSessionEntity> sessionCaptor = ArgumentCaptor.forClass(AuthSessionEntity.class);

            when(springAuthSessionRepository.save(sessionCaptor.capture()))
                    .thenAnswer(invocation -> invocation.getArgument(0));

            var result = repository.saveToken(userId, "token-123", 3600);

            assertThat(result).isInstanceOf(Either.Right.class);

            @SuppressWarnings("unchecked")
            var right = (Either.Right<ErrorResultStatus, AuthSessionEntity>) result;

            AuthSessionEntity session = right.value();

            assertThat(session.getUserId()).isEqualTo(userId);
            assertThat(session.getToken()).isEqualTo("token-123");
            assertThat(session.getExpiresAt()).isAfter(LocalDateTime.now(ZoneId.of("UTC")));

            assertThat(sessionCaptor.getValue()).isSameAs(session);
        }

        @Test
        @DisplayName("should return error when saving token fails")
        void shouldReturnErrorWhenSavingTokenFails() {
            AuthRepositoryImpl repository = new AuthRepositoryImpl(springAuthSessionRepository);

            when(springAuthSessionRepository.save(org.mockito.ArgumentMatchers.any(AuthSessionEntity.class)))
                    .thenThrow(new RuntimeException("db down"));

            var result = repository.saveToken(UUID.randomUUID(), "token-123", 3600);

            assertThat(result).isInstanceOf(Either.Left.class);

            @SuppressWarnings("unchecked")
            var left = (Either.Left<ErrorResultStatus, AuthSessionEntity>) result;

            assertThat(left.value().code()).isEqualTo(500);
            assertThat(left.value().message()).isEqualTo("Failed to save token");
        }
    }

    @Nested
    @DisplayName("getUserIdByToken")
    class GetUserIdByToken {
        @Test
        @DisplayName("should return user id when token exists and is not expired")
        void shouldReturnUserIdWhenTokenExistsAndIsNotExpired() {
            AuthRepositoryImpl repository = new AuthRepositoryImpl(springAuthSessionRepository);

            UUID userId = UUID.randomUUID();

            AuthSessionEntity session = new AuthSessionEntity();
            session.setUserId(userId);
            session.setToken("token-123");
            session.setExpiresAt(LocalDateTime.now(ZoneId.of("UTC")).plusMinutes(5));

            when(springAuthSessionRepository.findByToken("token-123")).thenReturn(Optional.of(session));

            var result = repository.getUserIdByToken("token-123");

            assertThat(result).isInstanceOf(Either.Right.class);

            @SuppressWarnings("unchecked")
            var right = (Either.Right<ErrorResultStatus, Optional<UUID>>) result;

            assertThat(right.value()).contains(userId);
        }

        @Test
        @DisplayName("should return empty optional when token does not exist")
        void shouldReturnEmptyOptionalWhenTokenDoesNotExist() {
            AuthRepositoryImpl repository = new AuthRepositoryImpl(springAuthSessionRepository);

            when(springAuthSessionRepository.findByToken("missing")).thenReturn(Optional.empty());

            var result = repository.getUserIdByToken("missing");

            assertThat(result).isInstanceOf(Either.Right.class);

            @SuppressWarnings("unchecked")
            var right = (Either.Right<ErrorResultStatus, Optional<UUID>>) result;

            assertThat(right.value()).isEmpty();
        }

        @Test
        @DisplayName("should return empty optional when token is expired")
        void shouldReturnEmptyOptionalWhenTokenIsExpired() {
            AuthRepositoryImpl repository = new AuthRepositoryImpl(springAuthSessionRepository);

            AuthSessionEntity session = new AuthSessionEntity();
            session.setUserId(UUID.randomUUID());
            session.setToken("expired-token");
            session.setExpiresAt(LocalDateTime.now(ZoneId.of("UTC")).minusMinutes(5));

            when(springAuthSessionRepository.findByToken("expired-token")).thenReturn(Optional.of(session));

            var result = repository.getUserIdByToken("expired-token");

            assertThat(result).isInstanceOf(Either.Right.class);

            @SuppressWarnings("unchecked")
            var right = (Either.Right<ErrorResultStatus, Optional<UUID>>) result;

            assertThat(right.value()).isEmpty();
        }

        @Test
        @DisplayName("should return error when retrieving token fails")
        void shouldReturnErrorWhenRetrievingTokenFails() {
            AuthRepositoryImpl repository = new AuthRepositoryImpl(springAuthSessionRepository);

            when(springAuthSessionRepository.findByToken("token-123"))
                    .thenThrow(new RuntimeException("db down"));

            var result = repository.getUserIdByToken("token-123");

            assertThat(result).isInstanceOf(Either.Left.class);

            @SuppressWarnings("unchecked")
            var left = (Either.Left<ErrorResultStatus, Optional<UUID>>) result;

            assertThat(left.value().code()).isEqualTo(404);
            assertThat(left.value().message()).isEqualTo("Failed to retrieve token");
        }
    }
}