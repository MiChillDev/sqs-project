package com.chucknorris.jokes.service;

import com.chucknorris.common.domain.service.BaseService;
import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.jokes.models.dto.CreateJokeDto;
import com.chucknorris.jokes.models.dto.JokeDto;
import com.chucknorris.jokes.models.dto.SourceJokeDto;
import com.chucknorris.jokes.models.entity.JokeEntity;
import com.chucknorris.jokes.repository.JokeRepository;
import com.chucknorris.jokes.repository.api.ChuckNorrisApiJokeRepositoryImpl;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class JokeService extends BaseService {

    private final ChuckNorrisApiJokeRepositoryImpl chuckNorrisJokeRepository;
    private final JokeRepository jokeRepository;

    public JokeService(ChuckNorrisApiJokeRepositoryImpl chuckNorrisJokeRepository, JokeRepository jokeRepository) {
        this.chuckNorrisJokeRepository = chuckNorrisJokeRepository;
        this.jokeRepository = jokeRepository;
    }

    public Either<ErrorResultStatus, JokeDto> getRandomJoke() {
        return jokeRepository.getRandomJoke()
                .validate(Optional::isPresent, new ErrorResultStatus(404, "No jokes found in the database"))
                .map(Optional::get)
                .map(joke -> new JokeDto(joke.getId(), joke.getExternalId(), joke.getContent()));
    }

    public Either<ErrorResultStatus, JokeDto> createJoke(CreateJokeDto input) {
        JokeEntity newJoke = new JokeEntity();
        newJoke.setContent(input.content());
        newJoke.setExternalId(input.externalId());

        return jokeRepository.saveJoke(newJoke)
                .map(saved -> new JokeDto(saved.getId(), saved.getExternalId(), saved.getContent()));
    }

    public Either<ErrorResultStatus, SourceJokeDto> getRandomSourceJoke() {
        return chuckNorrisJokeRepository.getRandomSourceJoke();
    }
}
