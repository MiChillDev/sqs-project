package com.chucknorris.users.service;

import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.users.models.entity.UserEntity;
import com.chucknorris.users.repository.UserRepository;
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
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Nested
    @DisplayName("findByUsername")
    class FindByUsername {
        @Test
        @DisplayName("findByUsername returns user when repository returns present")
        void returnsUser() {
            UserServiceImpl svc = new UserServiceImpl(userRepository);
            UserEntity u = new UserEntity();
            u.setUsername("bob");
            when(userRepository.findByUsername("bob")).thenReturn(Either.right(Optional.of(u)));

            Either<ErrorResultStatus, Optional<UserEntity>> res = svc.findByUsername("bob");
            assertThat(res).isInstanceOf(Either.Right.class);
            assertThat(((Either.Right<ErrorResultStatus, Optional<UserEntity>>) res).value()).isPresent();
        }

        @Test
        @DisplayName("findByUsername propagates repository error")
        void propagatesLeft() {
            UserServiceImpl svc = new UserServiceImpl(userRepository);
            when(userRepository.findByUsername("bob")).thenReturn(Either.left(new ErrorResultStatus(503, "db")));

            Either<ErrorResultStatus, Optional<UserEntity>> res = svc.findByUsername("bob");
            assertThat(res).isInstanceOf(Either.Left.class);
            assertThat(((Either.Left<ErrorResultStatus, Optional<UserEntity>>) res).value().code()).isEqualTo(503);
        }
    }
}


