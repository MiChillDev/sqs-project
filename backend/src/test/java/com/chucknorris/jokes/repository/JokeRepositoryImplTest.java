package com.chucknorris.jokes.repository;

import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.jokes.models.entity.JokeEntity;
import com.chucknorris.jokes.repository.spring.SpringJokeRepository;
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
class JokeRepositoryImplTest {

    @Mock
    private SpringJokeRepository springJokeRepository;

    @Nested
    @DisplayName("saveJoke")
    class SaveJoke {
        @Test
        @DisplayName("should return saved joke when Spring repository saves successfully")
        void shouldReturnSavedJokeWhenSpringRepositorySavesSuccessfully() {
            JokeRepositoryImpl repository = new JokeRepositoryImpl(springJokeRepository);

            JokeEntity joke = new JokeEntity();
            joke.setContent("funny");

            JokeEntity savedJoke = new JokeEntity();
            savedJoke.setContent("funny saved");

            when(springJokeRepository.save(joke)).thenReturn(savedJoke);

            var result = repository.saveJoke(joke);

            assertThat(result).isInstanceOf(Either.Right.class);

            @SuppressWarnings("unchecked")
            var right = (Either.Right<ErrorResultStatus, JokeEntity>) result;

            assertThat(right.value()).isSameAs(savedJoke);
            assertThat(right.value().getContent()).isEqualTo("funny saved");
        }

        @Test
        @DisplayName("should return error when Spring repository fails to save")
        void shouldReturnErrorWhenSpringRepositoryFailsToSave() {
            JokeRepositoryImpl repository = new JokeRepositoryImpl(springJokeRepository);

            JokeEntity joke = new JokeEntity();
            joke.setContent("funny");

            when(springJokeRepository.save(joke)).thenThrow(new RuntimeException("db down"));

            var result = repository.saveJoke(joke);

            assertThat(result).isInstanceOf(Either.Left.class);

            @SuppressWarnings("unchecked")
            var left = (Either.Left<ErrorResultStatus, JokeEntity>) result;

            assertThat(left.value().code()).isEqualTo(500);
            assertThat(left.value().message()).isEqualTo("Failed to save joke");
        }
    }

    @Nested
    @DisplayName("getRandomJoke")
    class GetRandomJoke {
        @Test
        @DisplayName("should return random joke when Spring repository returns joke")
        void shouldReturnRandomJokeWhenSpringRepositoryReturnsJoke() {
            JokeRepositoryImpl repository = new JokeRepositoryImpl(springJokeRepository);

            JokeEntity joke = new JokeEntity();
            joke.setContent("random");

            when(springJokeRepository.findRandomJoke()).thenReturn(Optional.of(joke));

            var result = repository.getRandomJoke();

            assertThat(result).isInstanceOf(Either.Right.class);

            @SuppressWarnings("unchecked")
            var right = (Either.Right<ErrorResultStatus, Optional<JokeEntity>>) result;

            assertThat(right.value()).isPresent();
            assertThat(right.value().get().getContent()).isEqualTo("random");
        }

        @Test
        @DisplayName("should return empty optional when no random joke exists")
        void shouldReturnEmptyOptionalWhenNoRandomJokeExists() {
            JokeRepositoryImpl repository = new JokeRepositoryImpl(springJokeRepository);

            when(springJokeRepository.findRandomJoke()).thenReturn(Optional.empty());

            var result = repository.getRandomJoke();

            assertThat(result).isInstanceOf(Either.Right.class);

            @SuppressWarnings("unchecked")
            var right = (Either.Right<ErrorResultStatus, Optional<JokeEntity>>) result;

            assertThat(right.value()).isEmpty();
        }

        @Test
        @DisplayName("should return error when Spring repository fails to fetch random joke")
        void shouldReturnErrorWhenSpringRepositoryFailsToFetchRandomJoke() {
            JokeRepositoryImpl repository = new JokeRepositoryImpl(springJokeRepository);

            when(springJokeRepository.findRandomJoke()).thenThrow(new RuntimeException("db down"));

            var result = repository.getRandomJoke();

            assertThat(result).isInstanceOf(Either.Left.class);

            @SuppressWarnings("unchecked")
            var left = (Either.Left<ErrorResultStatus, Optional<JokeEntity>>) result;

            assertThat(left.value().code()).isEqualTo(500);
            assertThat(left.value().message()).isEqualTo("Failed to fetch random joke");
        }
    }
}