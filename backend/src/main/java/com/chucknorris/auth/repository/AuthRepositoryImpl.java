package com.chucknorris.auth.repository;

import com.chucknorris.auth.models.entity.AuthSessionEntity;
import com.chucknorris.auth.repository.spring.SpringAuthSessionRepository;
import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;
import java.util.UUID;

@Repository
public class AuthRepositoryImpl implements AuthRepository {

    private final ZoneId utcZoneId = ZoneId.of("UTC");

    private final SpringAuthSessionRepository repository;

    public AuthRepositoryImpl(SpringAuthSessionRepository repository) {
        this.repository = repository;
    }

    @Override
    public Either<ErrorResultStatus, AuthSessionEntity> saveToken(UUID userId, String token, long expirationTimeSeconds) {
        try {
            AuthSessionEntity entity = new AuthSessionEntity();
            entity.setUserId(userId);
            entity.setToken(token);
            entity.setExpiresAt(LocalDateTime.now(utcZoneId).plusSeconds(expirationTimeSeconds));
            repository.save(entity);
            return new Either.Right<>(entity);
        } catch (Exception e) {
            return new Either.Left<>(new ErrorResultStatus(500, "Failed to save token"));
        }
    }

    @Override
    public Either<ErrorResultStatus, Optional<UUID>> getUserIdByToken(String token) {
        try {
            Optional<AuthSessionEntity> session = repository.findByToken(token);
            session = session.filter(s -> s.getExpiresAt().isAfter(LocalDateTime.now(utcZoneId)));
            return new Either.Right<>(session.map(AuthSessionEntity::getUserId));
        } catch (Exception e) {
            return new Either.Left<>(new ErrorResultStatus(404, "Failed to retrieve token"));
        }
    }
}
