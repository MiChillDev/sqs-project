package com.chucknorris.users.service;

import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.users.models.entity.UserEntity;

import java.util.Optional;

public interface UserService {

    Either<ErrorResultStatus, Optional<UserEntity>> findByUsername(String username);
}
