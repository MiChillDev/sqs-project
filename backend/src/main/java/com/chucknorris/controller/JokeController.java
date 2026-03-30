package com.chucknorris.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class JokeController {

    @GetMapping("/jokes")
    public ResponseEntity<Map<String, Object>> getRandomJoke() {
        // TODO: Implement logic to retrieve a random joke from the database
        return null;
    }

    @PostMapping("/jokes")
    public ResponseEntity<Map<String, Object>> createJoke(@RequestBody Map<String, String> jokeInput) {
        // TODO: Implement logic to create a new joke in the database
        return null;
    }

    @GetMapping("/source-joke")
    public ResponseEntity<Map<String, Object>> getRandomSourceJoke() {
        // TODO: Implement logic to retrieve a random joke from the external API
        return null;
    }
}
