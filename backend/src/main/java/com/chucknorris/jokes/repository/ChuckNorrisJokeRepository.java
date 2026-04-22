package com.chucknorris.jokes.repository;

import com.chucknorris.common.domain.models.ChuckNorrisResponse;
import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.common.repository.ApiRepository;
import com.chucknorris.jokes.models.SourceJokeDto;
import org.springframework.stereotype.Repository;

@Repository
public class ChuckNorrisJokeRepository extends ApiRepository {

    public Either<ErrorResultStatus, SourceJokeDto> getRandomSourceJoke() {
        return get("https://api.chucknorris.io/jokes/random", ChuckNorrisResponse.class)
                .map(body -> new SourceJokeDto(body.id(), body.value()));
    }
}
