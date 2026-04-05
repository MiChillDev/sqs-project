package com.chucknorris.jokes.controller;

import com.chucknorris.common.controller.BaseController;
import com.chucknorris.jokes.models.CreateJokeDto;
import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.jokes.service.JokeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class JokeController extends BaseController {

    private final JokeService jokeService;

    public JokeController(JokeService jokeService) {
        this.jokeService = jokeService;
    }

    @GetMapping("/jokes")
    public ResponseEntity<?> getRandomJoke() {
        return handleEither(jokeService.getRandomJoke());
    }

    @PostMapping("/jokes")
    public ResponseEntity<?> createJoke(@RequestBody CreateJokeDto input) {
        return handleEither(jokeService.createJoke(input));
    }

    @GetMapping("/source-joke")
    public ResponseEntity<?> getRandomSourceJoke() {
        return handleEither(jokeService.getRandomSourceJoke());
    }
}
