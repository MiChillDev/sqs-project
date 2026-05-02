package com.chucknorris.jokes.controller;

import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.jokes.models.CreateJokeDto;
import com.chucknorris.jokes.service.JokeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class JokeControllerTest {

    private MockMvcTester mvc;

    @Mock
    private JokeService jokeService;

    @BeforeEach
    void setUp() {
        mvc = MockMvcTester.of(new JokeController(jokeService));
    }

    @Test
    void getRandomJoke_shouldFailWith501NotImplemented() {
        when(jokeService.getRandomJoke())
                .thenReturn(Either.left(new ErrorResultStatus(501, "Not implemented yet")));

        assertThat(mvc.get().uri("/api/v1/jokes")).hasStatus(501)
                .bodyJson()
                .extractingPath("$.code").asNumber().isEqualTo(501);

        assertThat(mvc.get().uri("/api/v1/jokes")).hasStatus(501)
                .bodyJson()
                .extractingPath("$.message").asString().isEqualTo("Not implemented yet");
    }

    @Test
    void createJoke_shouldFailWith501NotImplemented() {
        when(jokeService.createJoke(any(CreateJokeDto.class)))
                .thenReturn(Either.left(new ErrorResultStatus(501, "Not implemented yet")));

        assertThat(mvc.post().uri("/api/v1/jokes")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"text\":\"A funny joke\",\"sourceId\":\"external-123\"}"))
                .hasStatus(501)
                .bodyJson()
                .extractingPath("$.code").asNumber().isEqualTo(501);

        assertThat(mvc.post().uri("/api/v1/jokes")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"text\":\"A funny joke\",\"sourceId\":\"external-123\"}"))
                .hasStatus(501)
                .bodyJson()
                .extractingPath("$.message").asString().isEqualTo("Not implemented yet");
    }

    @Test
    void getRandomSourceJoke_shouldFailWith501NotImplemented() {
        when(jokeService.getRandomSourceJoke())
                .thenReturn(Either.left(new ErrorResultStatus(501, "Not implemented yet")));

        assertThat(mvc.get().uri("/api/v1/source-joke")).hasStatus(501)
                .bodyJson()
                .extractingPath("$.code").asNumber().isEqualTo(501);

        assertThat(mvc.get().uri("/api/v1/source-joke")).hasStatus(501)
                .bodyJson()
                .extractingPath("$.message").asString().isEqualTo("Not implemented yet");
    }
}
