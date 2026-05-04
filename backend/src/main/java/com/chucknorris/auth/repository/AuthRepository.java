package com.chucknorris.auth.repository;

import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;

import java.util.Optional;
import java.util.UUID;

public interface AuthRepository {
    Either<ErrorResultStatus, Void> saveToken(UUID userId, String token);

    Either<ErrorResultStatus, Optional<UUID>> getUserIdByToken(String token);
}