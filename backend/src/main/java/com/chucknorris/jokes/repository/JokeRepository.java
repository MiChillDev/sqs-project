package com.chucknorris.jokes.repository;

import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.jokes.models.entity.JokeEntity;

import java.util.Optional;

public interface JokeRepository {
    Either<ErrorResultStatus, JokeEntity> saveJoke(JokeEntity joke);

    Either<ErrorResultStatus, Optional<JokeEntity>> getRandomJoke();

    Either<ErrorResultStatus, Optional<JokeEntity>> getJokeByExternalId(String externalId);
}