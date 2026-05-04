package com.chucknorris.jokes.repository;

import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.jokes.models.entity.JokeEntity;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class JokeRepositoryImpl implements JokeRepository {

    @Override
    public Either<ErrorResultStatus, JokeEntity> saveJoke() {
        return null; //TODO
    }

    @Override
    public Either<ErrorResultStatus, Optional<JokeEntity>> getRandomJoke() {
        return null; //TODO
    }
}