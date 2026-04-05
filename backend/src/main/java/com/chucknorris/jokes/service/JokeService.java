package com.chucknorris.jokes.service;

import com.chucknorris.jokes.models.CreateJokeDto;
import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.jokes.models.JokeDto;
import com.chucknorris.jokes.models.SourceJokeDto;
import org.springframework.stereotype.Service;

@Service
public class JokeService {

    public Either<ErrorResultStatus, JokeDto> getRandomJoke() {
        // TODO: Implement domain logic to retrieve a random joke from the database
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public Either<ErrorResultStatus, JokeDto> createJoke(CreateJokeDto input) {
        // TODO: Implement domain logic to create a new joke in the database
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public Either<ErrorResultStatus, SourceJokeDto> getRandomSourceJoke() {
        // TODO: Implement domain logic to retrieve a random joke from the external API
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
