package com.chucknorris.users.repository;

import com.chucknorris.users.models.entity.UserEntity;
import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;

import java.util.Optional;

public interface UserRepository {
    Either<ErrorResultStatus, Optional<UserEntity>> findByUsername(String username);

    Either<ErrorResultStatus, UserEntity> save(UserEntity user);
}