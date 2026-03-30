package com.chucknorris.jokes.models;

public record CreateJokeDto(
        String content,
        String externalId
) {}
