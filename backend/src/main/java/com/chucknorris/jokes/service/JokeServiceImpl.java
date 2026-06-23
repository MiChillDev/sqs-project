package com.chucknorris.jokes.service;

import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.jokes.models.dto.CreateJokeDto;
import com.chucknorris.jokes.models.dto.JokeDto;
import com.chucknorris.jokes.models.dto.SourceJokeDto;
import com.chucknorris.jokes.models.entity.JokeEntity;
import com.chucknorris.jokes.repository.JokeRepository;
import com.chucknorris.jokes.repository.api.ApiJokeRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class JokeServiceImpl implements JokeService {

    private final ApiJokeRepository chuckNorrisJokeRepository;
    private final JokeRepository jokeRepository;

    public JokeServiceImpl(ApiJokeRepository chuckNorrisJokeRepository, JokeRepository jokeRepository) {
        this.chuckNorrisJokeRepository = chuckNorrisJokeRepository;
        this.jokeRepository = jokeRepository;
    }

    public Either<ErrorResultStatus, JokeDto> getRandomJoke() {
        return jokeRepository.getRandomJoke()
                .map(optionalJoke -> optionalJoke
                        .map(joke -> new JokeDto(
                                joke.getId(),
                                joke.getExternalId(),
                                joke.getContent()))
                        .orElse(JokeDto.empty()));
    }

    public Either<ErrorResultStatus, JokeDto> createJoke(CreateJokeDto input) {
        JokeEntity newJoke = new JokeEntity();
        newJoke.setContent(input.content());
        newJoke.setExternalId(input.externalId());

        Either<ErrorResultStatus, JokeEntity> jokeEither = Either.right(newJoke);

        return jokeEither
                .validate(joke -> !joke.getContent().isEmpty(), new ErrorResultStatus(400, "joke cannot be empty"))
                .validate(joke -> !joke.getExternalId().isEmpty(), new ErrorResultStatus(400, "externalId cannot be empty"))
                .flatMap(joke ->
                        jokeRepository.getJokeByExternalId(joke.getExternalId())
                                .validate(Optional::isEmpty, new ErrorResultStatus(409, "joke with the same external ID already exists"))
                                .map(existingJokeOpt -> joke))
                .flatMap(jokeRepository::saveJoke)
                .map(saved -> new JokeDto(saved.getId(), saved.getExternalId(), saved.getContent()));
    }

    public Either<ErrorResultStatus, SourceJokeDto> getRandomSourceJoke() {
        return chuckNorrisJokeRepository.getRandomSourceJoke();
    }
}
