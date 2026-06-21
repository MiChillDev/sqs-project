package com.chucknorris.users.repository;

import com.chucknorris.users.models.entity.UserEntity;
import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.users.repository.spring.SpringUserRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UserRepositoryImpl implements UserRepository {

    private final SpringUserRepository repository;

    public UserRepositoryImpl(SpringUserRepository repository) {
        this.repository = repository;
    }

    @Override
    public Either<ErrorResultStatus, Optional<UserEntity>> findByUsername(String username) {
        try {
            return new Either.Right<>(repository.findByUsername(username));
        } catch (Exception e) {
            return new Either.Left<>(new ErrorResultStatus(500, "Failed to find user"));
        }
    }

    @Override
    public Either<ErrorResultStatus, UserEntity> save(UserEntity user) {
        try {
            return new Either.Right<>(repository.save(user));
        } catch (Exception e) {
            return new Either.Left<>(new ErrorResultStatus(500, "Failed to save user"));
        }
    }
}