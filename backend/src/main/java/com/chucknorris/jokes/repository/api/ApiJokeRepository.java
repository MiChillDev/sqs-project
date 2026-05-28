package com.chucknorris.jokes.repository.api;

import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.jokes.models.dto.SourceJokeDto;

public interface ApiJokeRepository {
    Either<ErrorResultStatus, SourceJokeDto> getRandomSourceJoke();
}
