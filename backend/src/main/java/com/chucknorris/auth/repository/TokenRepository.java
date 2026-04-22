package com.chucknorris.auth.repository;

import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;

import java.util.Optional;

public interface TokenRepository {
    Either<ErrorResultStatus, Void> saveToken(String username, String token); //TODO: use UserId
    Either<ErrorResultStatus, Optional<String>> getUsernameByToken(String token);
}