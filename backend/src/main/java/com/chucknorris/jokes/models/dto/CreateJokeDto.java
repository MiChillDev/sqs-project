package com.chucknorris.jokes.models.dto;

public record CreateJokeDto(
        String content,
        String externalId
) {}
