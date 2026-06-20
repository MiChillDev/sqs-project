package com.chucknorris.jokes.repository;

import com.chucknorris.jokes.models.dto.SourceJokeDto;
import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.jokes.repository.api.MockApiJokeRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class MockApiJokeRepositoryTest {

    private final MockApiJokeRepository repository = new MockApiJokeRepository();

    @Test
    @DisplayName("implements ApiJokeRepository")
    void implementsApiJokeRepository() {
        assertThat(repository).isNotNull();
    }

    @Nested
    @DisplayName("getRandomSourceJoke")
    class GetRandomSourceJoke {

        @Test
        @DisplayName("returns a Right with the canned source joke")
        void returnsCannedSourceJoke() {
            Either<ErrorResultStatus, SourceJokeDto> result = repository.getRandomSourceJoke();

            assertThat(result instanceof Either.Right).isTrue();
            SourceJokeDto joke = result.get();
            assertThat(joke.externalId()).isEqualTo("mock-1");
            assertThat(joke.content()).isEqualTo("Chuck Norris can divide by zero.");
        }

        @Test
        @DisplayName("returns the same canned joke on every call")
        void returnsConsistentResult() {
            SourceJokeDto first = repository.getRandomSourceJoke().get();
            SourceJokeDto second = repository.getRandomSourceJoke().get();

            assertThat(first.externalId()).isEqualTo(second.externalId());
            assertThat(first.content()).isEqualTo(second.content());
        }
    }
}
