package com.chucknorris.auth.service;

import com.chucknorris.auth.models.dto.LoginRequestDto;
import com.chucknorris.auth.models.dto.TokenResponseDto;
import com.chucknorris.auth.models.entity.AuthSessionEntity;
import com.chucknorris.users.models.entity.UserEntity;
import com.chucknorris.auth.repository.AuthRepository;
import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.users.service.UserService;
import com.chucknorris.common.utils.PasswordHasher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthRepository tokenRepository;

    @Mock
    private UserService userService;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(tokenRepository, userService);
    }

    @Nested
    @DisplayName("checkTokenIsValid")
    class CheckToken {
        @Nested
        @DisplayName("failure scenarios")
        class Failure {
            @Test
            @DisplayName("returns 400 when token is null or doesn't start with 'Bearer '")
            void returns400ForNullOrBadPrefix() {
                Either<ErrorResultStatus, Boolean> r1 = authService.checkTokenIsValid(null);
                assertThat(r1).isInstanceOf(Either.Left.class);
                assertThat(((Either.Left<ErrorResultStatus, Boolean>) r1).value().code()).isEqualTo(400);

                Either<ErrorResultStatus, Boolean> r2 = authService.checkTokenIsValid("Token abc");
                assertThat(r2).isInstanceOf(Either.Left.class);
                assertThat(((Either.Left<ErrorResultStatus, Boolean>) r2).value().code()).isEqualTo(400);
            }

            @Test
            @DisplayName("propagates repository Left when token lookup fails")
            void propagatesRepositoryLeft() {
                when(tokenRepository.getUserIdByToken(anyString())).thenReturn(Either.left(new ErrorResultStatus(503, "db")));

                Either<ErrorResultStatus, Boolean> r = authService.checkTokenIsValid("Bearer abc");
                assertThat(r).isInstanceOf(Either.Left.class);
                assertThat(((Either.Left<ErrorResultStatus, Boolean>) r).value().code()).isEqualTo(503);
            }
        }

        @Nested
        @DisplayName("success scenarios")
        class Success {
            @Test
            @DisplayName("returns true if user for token is found")
            void returnsTrueWhenRepositoryFindsUser() {
                when(tokenRepository.getUserIdByToken(anyString())).thenReturn(Either.right(Optional.of(UUID.randomUUID())));

                Either<ErrorResultStatus, Boolean> res = authService.checkTokenIsValid("Bearer abc");
                assertThat(res).isInstanceOf(Either.Right.class);
                assertThat(((Either.Right<ErrorResultStatus, Boolean>) res).value()).isTrue();
            }

            @Test
            @DisplayName("returns false when token not associated with a user")
            void returnsFalseWhenNoUserForToken() {
                when(tokenRepository.getUserIdByToken(anyString())).thenReturn(Either.right(Optional.empty()));

                Either<ErrorResultStatus, Boolean> res = authService.checkTokenIsValid("Bearer missing");
                assertThat(res).isInstanceOf(Either.Right.class);
                assertThat(((Either.Right<ErrorResultStatus, Boolean>) res).value()).isFalse();
            }
        }
    }

    @Nested
    @DisplayName("login")
    class Login {
        @Nested
        @DisplayName("success scenarios")
        class Success {
            @Test
            @DisplayName("returns token when credentials are valid")
            void returnsTokenWhenCredentialsValid() {
                UserEntity user = new UserEntity();
                user.setId(UUID.randomUUID());
                user.setUsername("bob");
                String hashed = PasswordHasher.hashPassword("secret");
                user.setPasswordHash(hashed);

                AuthSessionEntity session = new AuthSessionEntity();
                session.setUserId(user.getId());
                session.setToken("token-123");
                session.setExpiresAt(LocalDateTime.MAX);

                when(userService.findByUsername(anyString())).thenReturn(Either.right(Optional.of(user)));
                when(tokenRepository.saveToken(any(UUID.class), anyString(), anyLong())).thenReturn(Either.right(session));

                Either<ErrorResultStatus, TokenResponseDto> resp = authService.login(new LoginRequestDto("bob", "secret"));
                assertThat(resp).isInstanceOf(Either.Right.class);
                TokenResponseDto dto = ((Either.Right<ErrorResultStatus, TokenResponseDto>) resp).value();
                assertThat(dto.token()).isEqualTo("token-123");
            }
        }

        @Nested
        @DisplayName("failure scenarios")
        class Failure {
            @Test
            @DisplayName("returns 404 when user not found or password is wrong")
            void returns404WhenUserNotFoundOrWrongPassword() {
                when(userService.findByUsername(anyString())).thenReturn(Either.right(Optional.empty()));
                Either<ErrorResultStatus, TokenResponseDto> notFound = authService.login(new LoginRequestDto("bob", "wrong"));
                assertThat(notFound).isInstanceOf(Either.Left.class);
                assertThat(((Either.Left<ErrorResultStatus, TokenResponseDto>) notFound).value().code()).isEqualTo(404);
            }

            @Test
            @DisplayName("returns 404 when password is incorrect even if user exists")
            void returns404WhenPasswordIncorrect() {
                UserEntity user = new UserEntity();
                user.setId(UUID.randomUUID());
                user.setUsername("alice");
                String hashed = PasswordHasher.hashPassword("rightpw");
                user.setPasswordHash(hashed);

                when(userService.findByUsername(anyString())).thenReturn(Either.right(Optional.of(user)));

                Either<ErrorResultStatus, TokenResponseDto> res = authService.login(new LoginRequestDto("alice", "wrongpw"));
                assertThat(res).isInstanceOf(Either.Left.class);
                assertThat(((Either.Left<ErrorResultStatus, TokenResponseDto>) res).value().code()).isEqualTo(404);
            }

            @Test
            @DisplayName("propagates repository error when saving token fails")
            void propagatesSaveTokenError() {
                UserEntity user = new UserEntity();
                user.setId(UUID.randomUUID());
                user.setUsername("bob");
                String hashed = PasswordHasher.hashPassword("secret");
                user.setPasswordHash(hashed);

                when(userService.findByUsername(anyString())).thenReturn(Either.right(Optional.of(user)));
                when(tokenRepository.saveToken(any(UUID.class), anyString(), anyLong()))
                        .thenReturn(Either.left(new ErrorResultStatus(500, "db")));

                Either<ErrorResultStatus, TokenResponseDto> res = authService.login(new LoginRequestDto("bob", "secret"));
                assertThat(res).isInstanceOf(Either.Left.class);
                assertThat(((Either.Left<ErrorResultStatus, TokenResponseDto>) res).value().code()).isEqualTo(500);
            }
        }
    }
}


