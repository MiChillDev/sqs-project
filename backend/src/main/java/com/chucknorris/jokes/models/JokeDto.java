package com.chucknorris.jokes.models;

import java.util.UUID;

public record JokeDto(UUID id, String externalId, String content) {
}
