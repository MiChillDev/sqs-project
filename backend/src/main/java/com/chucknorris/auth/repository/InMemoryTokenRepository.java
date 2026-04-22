package com.chucknorris.auth.repository;

import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryTokenRepository implements TokenRepository { //TODO: database

    private record TokenData(String username, long expirationMillis) {
    }

    private final Map<String, TokenData> tokens = new ConcurrentHashMap<>();

    @Override
    public Either<ErrorResultStatus, Void> saveToken(String username, String token) {
        tokens.put(token, new TokenData(username, 0));
        return new Either.Right<>(null);
    }

    @Override
    public Either<ErrorResultStatus, Optional<String>> getUsernameByToken(String token) {
        TokenData data = tokens.get(token);
        if (data == null) {
            return new Either.Right<>(Optional.empty());
        }
        if (System.currentTimeMillis() > data.expirationMillis()) {
            tokens.remove(token);
            return new Either.Right<>(Optional.empty());
        }
        return new Either.Right<>(Optional.of(data.username()));
    }
}