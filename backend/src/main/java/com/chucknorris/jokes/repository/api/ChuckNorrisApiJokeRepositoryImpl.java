package com.chucknorris.jokes.repository.api;

import com.chucknorris.jokes.models.api.ChuckNorrisResponse;
import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.common.repository.ApiRepository;
import com.chucknorris.jokes.models.dto.SourceJokeDto;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

@Repository
@Profile("!mock-external-api")
public class ChuckNorrisApiJokeRepositoryImpl extends ApiRepository implements ApiJokeRepository {

    private static final String API_BASE_URL = "https://api.chucknorris.io";

    public ChuckNorrisApiJokeRepositoryImpl() {
        super();
    }

    public ChuckNorrisApiJokeRepositoryImpl(RestTemplate restTemplate) {
        super(restTemplate);
    }

    public Either<ErrorResultStatus, SourceJokeDto> getRandomSourceJoke() {
        return get(API_BASE_URL + "/jokes/random", ChuckNorrisResponse.class)
                .map(body -> new SourceJokeDto(body.id(), body.value()));
    }
}
