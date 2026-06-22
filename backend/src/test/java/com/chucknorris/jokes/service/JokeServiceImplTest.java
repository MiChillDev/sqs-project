package com.chucknorris.jokes.service;

import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.jokes.models.dto.CreateJokeDto;
import com.chucknorris.jokes.models.dto.JokeDto;
import com.chucknorris.jokes.models.entity.JokeEntity;
import com.chucknorris.jokes.repository.JokeRepository;
import com.chucknorris.jokes.repository.api.ChuckNorrisApiJokeRepositoryImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JokeServiceImplTest {

    private JokeService jokeService;

    @Mock
    private ChuckNorrisApiJokeRepositoryImpl apiRepo;

    @Mock
    private JokeRepository jokeRepository;

    @BeforeEach
    void setUp() {
        jokeService = new JokeServiceImpl(apiRepo, jokeRepository);
    }

    @Nested
    @DisplayName("getRandomSourceJoke")
    class GetRandomSourceJoke {
        @Test
        @DisplayName("should return source joke when API repo returns Right")
        void shouldReturnSourceWhenPresent() {
            com.chucknorris.jokes.models.dto.SourceJokeDto src = new com.chucknorris.jokes.models.dto.SourceJokeDto("s1", "txt");
            when(apiRepo.getRandomSourceJoke()).thenReturn(Either.right(src));

            Either<ErrorResultStatus, com.chucknorris.jokes.models.dto.SourceJokeDto> res = jokeService.getRandomSourceJoke();
            assertThat(res).isInstanceOf(Either.Right.class);
            if (res instanceof Either.Right<ErrorResultStatus, com.chucknorris.jokes.models.dto.SourceJokeDto>(
                    com.chucknorris.jokes.models.dto.SourceJokeDto dto
            )) {
                assertThat(dto.externalId()).isEqualTo("s1");
            }
        }

        @Test
        @DisplayName("should propagate Left from API repo")
        void shouldPropagateLeft() {
            when(apiRepo.getRandomSourceJoke()).thenReturn(Either.left(new ErrorResultStatus(502, "api")));

            Either<ErrorResultStatus, com.chucknorris.jokes.models.dto.SourceJokeDto> res = jokeService.getRandomSourceJoke();
            assertThat(res).isInstanceOf(Either.Left.class);
            if (res instanceof Either.Left<ErrorResultStatus, com.chucknorris.jokes.models.dto.SourceJokeDto>(
                    ErrorResultStatus value
            )) {
                assertThat(value.code()).isEqualTo(502);
            }
        }
    }

    @Nested
    @DisplayName("createJoke")
    class CreateJoke {
        @Test
        @DisplayName("return 400 if joke is empty")
        void shouldFailIfJokeIsEmpty() {
            CreateJokeDto input = new CreateJokeDto("", "ext-123");

            Either<ErrorResultStatus, JokeDto> res = jokeService.createJoke(input);

            assertThat(res).isInstanceOf(Either.Left.class);
            if (res instanceof Either.Left<ErrorResultStatus, JokeDto>(ErrorResultStatus value)) {
                assertThat(value.code()).isEqualTo(400);
                assertThat(value.message()).isEqualTo("joke cannot be empty");
            }
        }

        @Test
        @DisplayName("return 400 if externalId is empty")
        void shouldFailIfExternalIdIsEmpty() {
            CreateJokeDto input = new CreateJokeDto("hello123", "");

            Either<ErrorResultStatus, JokeDto> res = jokeService.createJoke(input);

            assertThat(res).isInstanceOf(Either.Left.class);
            if (res instanceof Either.Left<ErrorResultStatus, JokeDto>(ErrorResultStatus value)) {
                assertThat(value.code()).isEqualTo(400);
                assertThat(value.message()).isEqualTo("externalId cannot be empty");
            }
        }

        @Test
        @DisplayName("should save and return JokeDto when repository saves successfully")
        void shouldSaveAndReturnDto() {
            CreateJokeDto input = new CreateJokeDto("hello", "ext-2");
            JokeEntity saved = new JokeEntity(java.util.UUID.randomUUID(), "ext-2", "hello");

            when(jokeRepository.saveJoke(any(JokeEntity.class))).thenReturn(Either.right(saved));
            when(jokeRepository.getJokeByExternalId(any(String.class))).thenReturn(Either.right(Optional.empty()));

            Either<ErrorResultStatus, JokeDto> res = jokeService.createJoke(input);

            assertThat(res).isInstanceOf(Either.Right.class);
            if (res instanceof Either.Right<ErrorResultStatus, JokeDto>(JokeDto dto)) {
                assertThat(dto.externalId()).isEqualTo("ext-2");
                assertThat(dto.content()).isEqualTo("hello");
            }
        }

        @Test
        @DisplayName("return 409 if externalId already exists")
        void shouldFailIfExternalIdAlreadyExists() {
            when(jokeRepository.getJokeByExternalId("ext-2"))
                    .thenReturn(Either.right(Optional.of(new JokeEntity())));

            Either<ErrorResultStatus, JokeDto> res = jokeService.createJoke(new CreateJokeDto("hello", "ext-2"));

            assertThat(res).isInstanceOf(Either.Left.class);
            if (res instanceof Either.Left<ErrorResultStatus, JokeDto>(ErrorResultStatus value)) {
                assertThat(value.code()).isEqualTo(409);
            }
        }

        @Test
        @DisplayName("should propagate repository error when repository returns Left")
        void shouldPropagateRepositoryError() {
            CreateJokeDto input = new CreateJokeDto("hello", "ext-2");
            when(jokeRepository.getJokeByExternalId(any(String.class)))
                    .thenReturn(Either.left(new ErrorResultStatus(500, "db error")));

            Either<ErrorResultStatus, JokeDto> res = jokeService.createJoke(input);

            assertThat(res).isInstanceOf(Either.Left.class);
            if (res instanceof Either.Left<ErrorResultStatus, JokeDto>(ErrorResultStatus value)) {
                assertThat(value.code()).isEqualTo(500);
            }
        }
    }

    @Nested
    @DisplayName("getRandomJoke")
    class GetRandomJoke {
        @Test
        @DisplayName("should return JokeDto when joke is present")
        void shouldReturnJokeDtoWhenPresent() {
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
        @DisplayName("should return empty JokeDto when no joke is present")
        void shouldReturnEmptyJokeWhenEmpty() {
            when(jokeRepository.getRandomJoke()).thenReturn(Either.right(Optional.empty()));

            Either<ErrorResultStatus, JokeDto> res = jokeService.getRandomJoke();

            assertThat(res).isInstanceOf(Either.Right.class);
            if (res instanceof Either.Right<ErrorResultStatus, JokeDto>(JokeDto joke)) {
                assertNull(joke.id());
                assertNull(joke.externalId());
                assertNull(joke.content());
            }
        }

        @Test
        @DisplayName("should propagate repository error when repository returns Left")
        void shouldPropagateRepositoryLeft() {
            when(jokeRepository.getRandomJoke()).thenReturn(Either.left(new ErrorResultStatus(503, "db down")));

            Either<ErrorResultStatus, JokeDto> res = jokeService.getRandomJoke();

            assertThat(res).isInstanceOf(Either.Left.class);
            if (res instanceof Either.Left<ErrorResultStatus, JokeDto>(ErrorResultStatus value)) {
                assertThat(value.code()).isEqualTo(503);
            }
        }
    }
}
