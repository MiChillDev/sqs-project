package com.chucknorris.jokes.service;

import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.jokes.models.dto.CreateJokeDto;
import com.chucknorris.jokes.models.dto.JokeDto;
import com.chucknorris.jokes.models.dto.SourceJokeDto;

public interface JokeService {

    Either<ErrorResultStatus, JokeDto> getRandomJoke();

    Either<ErrorResultStatus, JokeDto> createJoke(CreateJokeDto input);

    Either<ErrorResultStatus, SourceJokeDto> getRandomSourceJoke();
}
