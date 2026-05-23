package com.chucknorris.jokes.controller;

import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.jokes.models.dto.CreateJokeDto;
import com.chucknorris.jokes.models.dto.JokeDto;
import com.chucknorris.jokes.models.dto.SourceJokeDto;
import com.chucknorris.auth.service.AuthService;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
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

    @Mock
    private AuthService authService;

    private JokeController controller;

    @BeforeEach
    void setUp() throws Exception {
        controller = new JokeController(jokeService);
        java.lang.reflect.Field f = controller.getClass().getSuperclass().getDeclaredField("authService");
        f.setAccessible(true);
        f.set(controller, authService);

        mvc = MockMvcTester.of(controller);
    }

    @Test
    void createJoke_shouldFailWith401Unauthorized() {
        assertThat(mvc.post().uri("/api/v1/jokes")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"text\":\"A funny joke\",\"sourceId\":\"external-123\"}"))
                .hasStatus(401)
                .bodyJson()
                .extractingPath("$.code").asNumber().isEqualTo(401);

        assertThat(mvc.post().uri("/api/v1/jokes")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"text\":\"A funny joke\",\"sourceId\":\"external-123\"}"))
                .hasStatus(401)
                .bodyJson()
                .extractingPath("$.message").asString().isNotEmpty();

        assertThat(mvc.post().uri("/api/v1/jokes")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"text\":\"A funny joke\",\"sourceId\":\"external-123\"}"))
                .hasStatus(401)
                .bodyJson()
                .extractingPath("$.message").asString().matches("[0-9a-fA-F-]{36}");
    }

    @Test
    void getRandomSourceJoke_shouldFailWith401Unauthorized() {
        assertThat(mvc.get().uri("/api/v1/source-joke")).hasStatus(401)
                .bodyJson()
                .extractingPath("$.code").asNumber().isEqualTo(401);

        assertThat(mvc.get().uri("/api/v1/source-joke")).hasStatus(401)
                .bodyJson()
                .extractingPath("$.message").asString().isNotEmpty();

        assertThat(mvc.get().uri("/api/v1/source-joke")).hasStatus(401)
                .bodyJson()
                .extractingPath("$.message").asString().matches("[0-9a-fA-F-]{36}");
    }

    @Test
    void getRandomJoke_shouldReturn200WhenServiceReturnsJoke() {
        JokeDto joke = new JokeDto(java.util.UUID.randomUUID(), "ext-5", "funny");
        when(jokeService.getRandomJoke()).thenReturn(Either.right(joke));

        assertThat(mvc.get().uri("/api/v1/jokes")).hasStatus(200)
                .bodyJson()
                .extractingPath("$.externalId").asString().isEqualTo("ext-5");
    }

    @Test
    void createJoke_withValidToken_shouldReturn200() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer token-123");
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));

        CreateJokeDto input = new CreateJokeDto("hello","ext-10");
        JokeDto created = new JokeDto(java.util.UUID.randomUUID(), "ext-10", "hello");

        when(authService.checkTokenIsValid("Bearer token-123")).thenReturn(Either.right(true));
        when(jokeService.createJoke(any(CreateJokeDto.class))).thenReturn(Either.right(created));

        var resp = controller.createJoke(input);
        assertThat(resp.getStatusCode().value()).isEqualTo(200);
        assert resp.getBody() != null;
        assertThat(resp.getBody().externalId()).isEqualTo("ext-10");

        RequestContextHolder.resetRequestAttributes();
    }

    @Test
    void createJoke_withInvalidToken_shouldReturn401InvalidToken() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "bad-token");
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));

        when(authService.checkTokenIsValid("bad-token")).thenReturn(Either.left(new ErrorResultStatus(401, "Invalid token")));

        @SuppressWarnings({"rawtypes"})
        var resp = (ResponseEntity) controller.createJoke(new CreateJokeDto("hello","ext-10"));
        assertThat(resp.getStatusCode().value()).isEqualTo(401);
        assertThat(resp.getBody()).isInstanceOf(ErrorResultStatus.class);
        assert resp.getBody() != null;
        assertThat(((ErrorResultStatus)resp.getBody()).message()).isEqualTo("Invalid token");

        RequestContextHolder.resetRequestAttributes();
    }

    @Test
    void getRandomSourceJoke_withValidToken_shouldReturn200() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer tk");
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));

        when(authService.checkTokenIsValid("Bearer tk")).thenReturn(Either.right(true));

        SourceJokeDto source = new SourceJokeDto("s1", "text");
        when(jokeService.getRandomSourceJoke()).thenReturn(Either.right(source));

        var resp = controller.getRandomSourceJoke();
        assertThat(resp.getStatusCode().value()).isEqualTo(200);
        assert resp.getBody() != null;
        assertThat(resp.getBody().externalId()).isEqualTo("s1");

        RequestContextHolder.resetRequestAttributes();
    }
}
