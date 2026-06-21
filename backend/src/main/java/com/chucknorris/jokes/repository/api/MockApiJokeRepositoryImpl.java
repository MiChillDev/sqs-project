package com.chucknorris.jokes.repository.api;

import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.jokes.models.dto.SourceJokeDto;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

@Repository
@Profile("mock-external-api")
public class MockApiJokeRepositoryImpl implements ApiJokeRepository {

    @Override
    public Either<ErrorResultStatus, SourceJokeDto> getRandomSourceJoke() {
        return Either.right(new SourceJokeDto(
            "mock-1",
            "Chuck Norris can divide by zero."
        ));
    }
}
