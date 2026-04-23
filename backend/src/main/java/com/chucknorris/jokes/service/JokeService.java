package com.chucknorris.jokes.service;

import com.chucknorris.common.domain.service.BaseService;
import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.jokes.models.dto.CreateJokeDto;
import com.chucknorris.jokes.models.dto.JokeDto;
import com.chucknorris.jokes.models.dto.SourceJokeDto;
import com.chucknorris.jokes.repository.ChuckNorrisJokeRepository;
import org.springframework.stereotype.Service;

@Service
public class JokeService extends BaseService {

    private final ChuckNorrisJokeRepository chuckNorrisJokeRepository;

    public JokeService(ChuckNorrisJokeRepository chuckNorrisJokeRepository) {
        this.chuckNorrisJokeRepository = chuckNorrisJokeRepository;
    }

    public Either<ErrorResultStatus, JokeDto> getRandomJoke() {
        // TODO: Implement domain logic to retrieve a random joke from the database
        return Either.left(new ErrorResultStatus(501, "Not implemented yet"));
    }

    public Either<ErrorResultStatus, JokeDto> createJoke(CreateJokeDto input) {
        // TODO: Implement domain logic to create a new joke in the database
        return Either.left(new ErrorResultStatus(501, "Not implemented yet"));
    }

    public Either<ErrorResultStatus, SourceJokeDto> getRandomSourceJoke() {
        return chuckNorrisJokeRepository.getRandomSourceJoke();
    }
}
