package com.chucknorris.auth.repository;

import com.chucknorris.auth.models.entity.AuthSessionEntity;
import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;

import java.util.Optional;
import java.util.UUID;

public interface AuthRepository {
    Either<ErrorResultStatus, AuthSessionEntity> saveToken(UUID userId, String token, long expirationTimeSeconds);

    Either<ErrorResultStatus, Optional<UUID>> getUserIdByToken(String token);
}