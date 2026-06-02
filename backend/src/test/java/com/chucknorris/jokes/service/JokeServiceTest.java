package com.chucknorris.jokes.service;

import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.common.utils.PasswordHasher;
import com.chucknorris.jokes.models.dto.CreateJokeDto;
import com.chucknorris.jokes.models.dto.JokeDto;
import com.chucknorris.jokes.models.entity.JokeEntity;
import com.chucknorris.jokes.repository.JokeRepository;
import com.chucknorris.jokes.repository.api.ChuckNorrisApiJokeRepositoryImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JokeServiceTest {

    private JokeService jokeService;

    @Mock
    private ChuckNorrisApiJokeRepositoryImpl apiRepo;

    @Mock
    private JokeRepository jokeRepository;

    @BeforeEach
    void setUp() {
        jokeService = new JokeService(apiRepo, jokeRepository);
    }

    @Test
    void getRandomJoke_shouldReturnJokeDtoWhenPresent() {
        JokeEntity entity = new JokeEntity();
        entity.setId(java.util.UUID.randomUUID());
        entity.setExternalId("ext-1");
        entity.setContent("a funny joke");

        when(jokeRepository.getRandomJoke()).thenReturn(Either.right(Optional.of(entity)));

        Either<ErrorResultStatus, JokeDto> res = jokeService.getRandomJoke();

        assertThat(res).isInstanceOf(Either.Right.class);
        if (res instanceof Either.Right<ErrorResultStatus, JokeDto>(JokeDto dto)) {
            assertThat(dto.externalId()).isEqualTo("ext-1");
            assertThat(dto.content()).isEqualTo("a funny joke");
        }
    }

    @Test
    void getRandomJoke_shouldReturnLeftWhenEmpty() {
        when(jokeRepository.getRandomJoke()).thenReturn(Either.right(Optional.empty()));

        Either<ErrorResultStatus, JokeDto> res = jokeService.getRandomJoke();

        assertThat(res).isInstanceOf(Either.Left.class);
        if (res instanceof Either.Left<ErrorResultStatus, JokeDto>(ErrorResultStatus err)) {
            assertThat(err.code()).isEqualTo(204);
        }
    }

    @Test
    void createJoke_shouldSaveAndReturnDto() {
        CreateJokeDto input = new CreateJokeDto("hello", "ext-2");
        JokeEntity saved = new JokeEntity(java.util.UUID.randomUUID(), "ext-2", "hello");

        when(jokeRepository.saveJoke(any(JokeEntity.class))).thenReturn(Either.right(saved));

        Either<ErrorResultStatus, JokeDto> res = jokeService.createJoke(input);

        assertThat(res).isInstanceOf(Either.Right.class);
        if (res instanceof Either.Right<ErrorResultStatus, JokeDto>(JokeDto dto)) {
            assertThat(dto.externalId()).isEqualTo("ext-2");
            assertThat(dto.content()).isEqualTo("hello");
        }
    }

    @Test
    void createJoke_shouldPropagateRepositoryError() {
        CreateJokeDto input = new CreateJokeDto("hello", "ext-2");
        when(jokeRepository.saveJoke(any(JokeEntity.class))).thenReturn(Either.left(new ErrorResultStatus(500, "db error")));

        Either<ErrorResultStatus, JokeDto> res = jokeService.createJoke(input);

        assertThat(res).isInstanceOf(Either.Left.class);
        if (res instanceof Either.Left<ErrorResultStatus, JokeDto>(ErrorResultStatus value)) {
            assertThat(value.code()).isEqualTo(500);
        }
    }

    @Test
    void getRandomJoke_shouldPropagateRepositoryLeft() {
        when(jokeRepository.getRandomJoke()).thenReturn(Either.left(new ErrorResultStatus(503, "db down")));

        Either<ErrorResultStatus, JokeDto> res = jokeService.getRandomJoke();

        assertThat(res).isInstanceOf(Either.Left.class);
        if (res instanceof Either.Left<ErrorResultStatus, JokeDto>(ErrorResultStatus value)) {
            assertThat(value.code()).isEqualTo(503);
        }
    }
}
