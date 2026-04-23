package com.chucknorris.jokes.repository;

import com.chucknorris.jokes.models.api.ChuckNorrisResponse;
import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.jokes.models.dto.SourceJokeDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ChuckNorrisJokeRepositoryTest {

    private ChuckNorrisJokeRepository repository;

    @Mock
    private RestTemplate mockRestTemplate;

    @BeforeEach
    void setUp() {
        repository = new ChuckNorrisJokeRepository(mockRestTemplate);
    }

    @Test
    void getRandomSourceJoke_shouldReturnSourceJokeDtoOnSuccess() {
        String jokeId = "joke-123";
        String jokeText = "Chuck Norris can divide by zero";
        ChuckNorrisResponse mockResponse = new ChuckNorrisResponse(jokeId, jokeText);
        ResponseEntity<ChuckNorrisResponse> mockEntity =
                ResponseEntity.ok(mockResponse);

        when(mockRestTemplate.getForEntity(
                eq("https://api.chucknorris.io/jokes/random"),
                eq(ChuckNorrisResponse.class)))
                .thenReturn(mockEntity);

        Either<ErrorResultStatus, SourceJokeDto> result = repository.getRandomSourceJoke();

        assertThat(result).isNotNull();
        assertThat(result).isInstanceOf(Either.Right.class);

        if (result instanceof Either.Right<ErrorResultStatus, SourceJokeDto>(SourceJokeDto value)) {
            assertThat(value).isNotNull();
            assertThat(value.externalId()).isEqualTo(jokeId);
            assertThat(value.content()).isEqualTo(jokeText);
        } else {
            throw new AssertionError("Expected Either.Right but got: " + result);
        }

        verify(mockRestTemplate).getForEntity(
                "https://api.chucknorris.io/jokes/random",
                ChuckNorrisResponse.class);
    }

    @Test
    void getRandomSourceJoke_shouldReturnLeftWithErrorOnApiFailure() {
        RestClientException apiException = new RestClientException("Connection timeout");
        when(mockRestTemplate.getForEntity(
                eq("https://api.chucknorris.io/jokes/random"),
                eq(ChuckNorrisResponse.class)))
                .thenThrow(apiException);

        Either<ErrorResultStatus, SourceJokeDto> result = repository.getRandomSourceJoke();

        assertThat(result).isNotNull();
        assertThat(result).isInstanceOf(Either.Left.class);

        if (result instanceof Either.Left<ErrorResultStatus, SourceJokeDto>(ErrorResultStatus value)) {
            assertThat(value).isNotNull();
            assertThat(value.code()).isEqualTo(500);
            assertThat(value.message())
                    .contains("Error communicating with external API")
                    .contains("Connection timeout");
        } else {
            throw new AssertionError("Expected Either.Left but got: " + result);
        }

        verify(mockRestTemplate).getForEntity(
                "https://api.chucknorris.io/jokes/random",
                ChuckNorrisResponse.class);
    }

    @Test
    void getRandomSourceJoke_shouldReturnLeftWithErrorOnNonSuccessStatus() {
        ResponseEntity<ChuckNorrisResponse> mockEntity =
                ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();

        when(mockRestTemplate.getForEntity(
                eq("https://api.chucknorris.io/jokes/random"),
                eq(ChuckNorrisResponse.class)))
                .thenReturn(mockEntity);
        Either<ErrorResultStatus, SourceJokeDto> result = repository.getRandomSourceJoke();

        assertThat(result).isNotNull();
        assertThat(result).isInstanceOf(Either.Left.class);

        if (result instanceof Either.Left<ErrorResultStatus, SourceJokeDto>(ErrorResultStatus value)) {
            assertThat(value).isNotNull();
            assertThat(value.code()).isEqualTo(500);
            assertThat(value.message())
                    .contains("API request failed")
                    .contains("503");
        } else {
            throw new AssertionError("Expected Either.Left but got: " + result);
        }

        verify(mockRestTemplate).getForEntity(
                "https://api.chucknorris.io/jokes/random",
                ChuckNorrisResponse.class);
    }

    @Test
    void getRandomSourceJoke_shouldReturnLeftWithErrorOnNullBody() {
        ResponseEntity<ChuckNorrisResponse> mockEntity =
                ResponseEntity.ok().build();

        when(mockRestTemplate.getForEntity(
                eq("https://api.chucknorris.io/jokes/random"),
                eq(ChuckNorrisResponse.class)))
                .thenReturn(mockEntity);

        Either<ErrorResultStatus, SourceJokeDto> result = repository.getRandomSourceJoke();

        assertThat(result).isNotNull();
        assertThat(result).isInstanceOf(Either.Left.class);

        if (result instanceof Either.Left<ErrorResultStatus, SourceJokeDto>(ErrorResultStatus value)) {
            assertThat(value).isNotNull();
            assertThat(value.code()).isEqualTo(500);
            assertThat(value.message())
                    .contains("API request failed or returned empty body");
        } else {
            throw new AssertionError("Expected Either.Left but got: " + result);
        }

        verify(mockRestTemplate).getForEntity(
                "https://api.chucknorris.io/jokes/random",
                ChuckNorrisResponse.class);
    }

    @Test
    void getRandomSourceJoke_shouldMapResponseCorrectly() {
        String expectedId = "abc-def-123";
        String expectedText = "Chuck Norris doesn't read books. He stares them down until he gets the information he wants.";
        ChuckNorrisResponse mockResponse = new ChuckNorrisResponse(expectedId, expectedText);
        ResponseEntity<ChuckNorrisResponse> mockEntity =
                ResponseEntity.ok(mockResponse);

        when(mockRestTemplate.getForEntity(
                any(String.class),
                any(Class.class)))
                .thenReturn(mockEntity);

        Either<ErrorResultStatus, SourceJokeDto> result = repository.getRandomSourceJoke();

        assertThat(result).isInstanceOf(Either.Right.class);
        if (result instanceof Either.Right<ErrorResultStatus, SourceJokeDto>(SourceJokeDto dto)) {
            assertThat(dto.externalId()).isEqualTo(expectedId);
            assertThat(dto.content()).isEqualTo(expectedText);
        }
    }

    @Test
    void getRandomSourceJoke_shouldCallCorrectApiUrl() {
        ChuckNorrisResponse mockResponse = new ChuckNorrisResponse("id", "joke");
        ResponseEntity<ChuckNorrisResponse> mockEntity =
                ResponseEntity.ok(mockResponse);

        when(mockRestTemplate.getForEntity(
                any(String.class),
                any(Class.class)))
                .thenReturn(mockEntity);

        repository.getRandomSourceJoke();

        verify(mockRestTemplate).getForEntity(
                "https://api.chucknorris.io/jokes/random",
                ChuckNorrisResponse.class);
    }
}
