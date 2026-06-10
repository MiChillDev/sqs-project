package com.chucknorris.jokes.controller;

import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.jokes.models.dto.CreateJokeDto;
import com.chucknorris.jokes.models.dto.JokeDto;
import com.chucknorris.jokes.models.dto.SourceJokeDto;
import com.chucknorris.auth.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
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
        java.lang.reflect.Field f = controller.getClass().getSuperclass().getDeclaredField("authService"); //TODO: this can surely be done better
        f.setAccessible(true);
        f.set(controller, authService);

        mvc = MockMvcTester.of(controller);
    }

    @Nested
    @DisplayName("createJoke")
    class CreateJoke {
        @Nested
        @DisplayName("success scenarios")
        class Success {
            @Test
            @DisplayName("should successfully create joke with valid auth")
            void shouldReturn200WhenValidTokenProvided() {
                MockHttpServletRequest request = new MockHttpServletRequest();
                request.addHeader("Authorization", "Bearer token-123");
                RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));

                CreateJokeDto input = new CreateJokeDto("hello", "ext-10");
                JokeDto created = new JokeDto(java.util.UUID.randomUUID(), "ext-10", "hello");

                when(authService.checkTokenIsValid("Bearer token-123")).thenReturn(Either.right(true));
                when(jokeService.createJoke(any(CreateJokeDto.class))).thenReturn(Either.right(created));

                var resp = controller.createJoke(input);
                assertThat(resp.getStatusCode().value()).isEqualTo(200);
                assert resp.getBody() != null;
                assertThat(resp.getBody().externalId()).isEqualTo("ext-10");

                RequestContextHolder.resetRequestAttributes();
            }
        }

        @Nested
        @DisplayName("failure scenarios")
        class Failure {
            @Test
            @DisplayName("should fail with 401 Unauthorized when no token provided")
            void shouldFailWith401Unauthorized() {
                MockHttpServletRequest request = new MockHttpServletRequest();
                request.addHeader("Authorization", "bad-token");
                RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));

                when(authService.checkTokenIsValid("bad-token")).thenReturn(Either.left(new ErrorResultStatus(401, "Invalid token")));

                @SuppressWarnings({"rawtypes"})
                var resp = (ResponseEntity) controller.createJoke(new CreateJokeDto("hello", "ext-10"));
                assertThat(resp.getStatusCode().value()).isEqualTo(401);
                assertThat(resp.getBody()).isInstanceOf(ErrorResultStatus.class);
                assert resp.getBody() != null;
                assertThat(((ErrorResultStatus) resp.getBody()).message()).isEqualTo("Invalid token");

                RequestContextHolder.resetRequestAttributes();
            }
        }
    }

    @Nested
    @DisplayName("getRandomSourceJoke")
    class GetRandomSourceJoke {

        @Nested
        @DisplayName("success scenarios")
        class Success {
            @Test
            @DisplayName("should return 200 when valid token provided")
            void shouldReturn200WhenValidTokenProvided() {
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

        @Nested
        @DisplayName("failure scenarios")
        class Failure {
            @Test
            @DisplayName("should fail with 401 Unauthorized when no token provided")
            void shouldFailWith401Unauthorized() {
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
        }
    }

    @Nested
    @DisplayName("getRandomJoke")
    class GetRandomJoke {

        @Nested
        @DisplayName("success scenarios")
        class Success {
            @Test
            @DisplayName("should return 200 with joke when service returns joke")
            void shouldReturn200WhenServiceReturnsJoke() {
                JokeDto joke = new JokeDto(java.util.UUID.randomUUID(), "ext-5", "funny");
                when(jokeService.getRandomJoke()).thenReturn(Either.right(joke));

                assertThat(mvc.get().uri("/api/v1/jokes")).hasStatus(200)
                        .bodyJson()
                        .extractingPath("$.externalId").asString().isEqualTo("ext-5");
            }
        }

        @Nested
        @DisplayName("failure scenarios")
        class Failure {

        }
    }

}
