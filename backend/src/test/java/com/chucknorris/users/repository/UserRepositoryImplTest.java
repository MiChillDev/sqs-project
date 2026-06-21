package com.chucknorris.users.repository;

import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.users.models.entity.UserEntity;
import com.chucknorris.users.repository.spring.SpringUserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserRepositoryImplTest {

    @Mock
    private SpringUserRepository springUserRepository;

    @Nested
    @DisplayName("findByUsername")
    class FindByUsername {
        @Test
        @DisplayName("should return user when Spring repository finds user")
        void shouldReturnUserWhenSpringRepositoryFindsUser() {
            UserRepositoryImpl repository = new UserRepositoryImpl(springUserRepository);

            UserEntity user = new UserEntity();
            user.setUsername("admin");

            when(springUserRepository.findByUsername("admin")).thenReturn(Optional.of(user));

            var result = repository.findByUsername("admin");

            assertThat(result).isInstanceOf(Either.Right.class);

            @SuppressWarnings("unchecked")
            var right = (Either.Right<ErrorResultStatus, Optional<UserEntity>>) result;

            assertThat(right.value()).isPresent();
            assertThat(right.value().get().getUsername()).isEqualTo("admin");
        }

        @Test
        @DisplayName("should return empty optional when Spring repository finds no user")
        void shouldReturnEmptyOptionalWhenSpringRepositoryFindsNoUser() {
            UserRepositoryImpl repository = new UserRepositoryImpl(springUserRepository);

            when(springUserRepository.findByUsername("missing")).thenReturn(Optional.empty());

            var result = repository.findByUsername("missing");

            assertThat(result).isInstanceOf(Either.Right.class);

            @SuppressWarnings("unchecked")
            var right = (Either.Right<ErrorResultStatus, Optional<UserEntity>>) result;

            assertThat(right.value()).isEmpty();
        }

        @Test
        @DisplayName("should return error when Spring repository throws exception")
        void shouldReturnErrorWhenSpringRepositoryThrowsException() {
            UserRepositoryImpl repository = new UserRepositoryImpl(springUserRepository);

            when(springUserRepository.findByUsername("admin")).thenThrow(new RuntimeException("db down"));

            var result = repository.findByUsername("admin");

            assertThat(result).isInstanceOf(Either.Left.class);

            @SuppressWarnings("unchecked")
            var left = (Either.Left<ErrorResultStatus, Optional<UserEntity>>) result;

            assertThat(left.value().code()).isEqualTo(500);
            assertThat(left.value().message()).isEqualTo("Failed to find user");
        }
    }
}