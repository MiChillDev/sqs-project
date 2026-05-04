package com.chucknorris.auth.repository;

import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public class SlickAuthRepository implements AuthRepository {

    @Override
    public Either<ErrorResultStatus, Void> saveToken(UUID userId, String token) {
        return null;
    }

    @Override
    public Either<ErrorResultStatus, Optional<UUID>> getUserIdByToken(String token) {
        return null;
    }
}
