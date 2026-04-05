package com.chucknorris.jokes.controller;

import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.jokes.models.CreateJokeDto;
import com.chucknorris.jokes.service.JokeService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;

@SpringBootTest
class JokeControllerTest {

    private final JokeService jokeService = new JokeService();
    private final JokeController jokeController = new JokeController(jokeService);

    @Test
    void getRandomJoke_shouldFailWith501NotImplemented() {
        ResponseEntity<?> response = jokeController.getRandomJoke();

        assertEquals(HttpStatus.NOT_IMPLEMENTED, response.getStatusCode());

        Object body = response.getBody();
        assertInstanceOf(ErrorResultStatus.class, body);
        ErrorResultStatus error = (ErrorResultStatus) body;
        assertEquals(501, error.code());
        assertEquals("Not implemented yet", error.message());
    }

    @Test
    void createJoke_shouldFailWith501NotImplemented() {
        CreateJokeDto input = new CreateJokeDto("A funny joke", "external-123");

        ResponseEntity<?> response = jokeController.createJoke(input);

        assertEquals(HttpStatus.NOT_IMPLEMENTED, response.getStatusCode());

        Object body = response.getBody();
        assertInstanceOf(ErrorResultStatus.class, body);
        ErrorResultStatus error = (ErrorResultStatus) body;
        assertEquals(501, error.code());
        assertEquals("Not implemented yet", error.message());
    }

    @Test
    void getRandomSourceJoke_shouldFailWith501NotImplemented() {
        ResponseEntity<?> response = jokeController.getRandomSourceJoke();

        assertEquals(HttpStatus.NOT_IMPLEMENTED, response.getStatusCode());

        Object body = response.getBody();
        assertInstanceOf(ErrorResultStatus.class, body);
        ErrorResultStatus error = (ErrorResultStatus) body;
        assertEquals(501, error.code());
        assertEquals("Not implemented yet", error.message());
    }
}
