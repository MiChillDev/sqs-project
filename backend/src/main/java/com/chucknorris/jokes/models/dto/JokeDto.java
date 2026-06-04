package com.chucknorris.jokes.models.dto;

import java.util.UUID;

public record JokeDto(
                UUID id,
                String externalId,
                String content) {
        public static JokeDto empty() {
                return new JokeDto(null, null, null);
        }
}
