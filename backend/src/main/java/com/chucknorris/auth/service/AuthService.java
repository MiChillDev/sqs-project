package com.chucknorris.auth.service;

import com.chucknorris.auth.models.dto.LoginRequestDto;
import com.chucknorris.auth.models.dto.TokenResponseDto;
import com.chucknorris.auth.repository.TokenRepository;
import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.Optional;

@Service
public class AuthService { //TODO: refactor

    private final TokenRepository tokenRepository;
    private static final long EXPIRATION_TIME_MILLIS = 30 * 60 * 1000; // 30 minutes

    public AuthService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    public Either<ErrorResultStatus, TokenResponseDto> login(LoginRequestDto request) {
        //TODO: implement
        String token = UUID.randomUUID().toString();
        long expirationTime = System.currentTimeMillis() + EXPIRATION_TIME_MILLIS;
        tokenRepository.saveToken(request.username(), token);
        return new Either.Right<>(new TokenResponseDto(token, expirationTime));
    }

    public Either<ErrorResultStatus, Boolean> checkTokenIsValid(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return new Either.Left<>(new ErrorResultStatus(400, "Missing or invalid token"));
        }
        String actualToken = token.replaceFirst("Bearer ", "");
        return tokenRepository.getUsernameByToken(actualToken).map(Optional::isPresent);
    }
}