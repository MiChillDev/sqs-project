package com.chucknorris.jokes.repository;

import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.jokes.models.entity.JokeEntity;
import com.chucknorris.jokes.repository.spring.SpringJokeRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class JokeRepositoryImpl implements JokeRepository {

    private final SpringJokeRepository repository;

    public JokeRepositoryImpl(SpringJokeRepository repository) {
        this.repository = repository;
    }

    @Override
    public Either<ErrorResultStatus, JokeEntity> saveJoke(JokeEntity joke) {
        try {
            JokeEntity saved = repository.save(joke);
            return new Either.Right<>(saved);
        } catch (Exception e) {
            return new Either.Left<>(new ErrorResultStatus(500, "Failed to save joke"));
        }
    }

    @Override
    public Either<ErrorResultStatus, Optional<JokeEntity>> getRandomJoke() {
        try {
            return new Either.Right<>(repository.findRandomJoke());
        } catch (Exception e) {
            return new Either.Left<>(new ErrorResultStatus(500, "Failed to fetch random joke"));
        }
    }

    @Override
    public Either<ErrorResultStatus, Optional<JokeEntity>> getJokeByExternalId(String externalId) {
        try {
            return new Either.Right<>(repository.findByExternalId(externalId));
        } catch (Exception e) {
            return new Either.Left<>(new ErrorResultStatus(500, "Failed to fetch joke by external ID"));
        }
    }
}