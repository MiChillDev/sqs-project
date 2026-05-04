package com.chucknorris.auth.service;

import com.chucknorris.auth.models.dto.LoginRequestDto;
import com.chucknorris.auth.models.dto.TokenResponseDto;
import com.chucknorris.auth.models.entity.AuthSessionEntity;
import com.chucknorris.users.models.entity.UserEntity;
import com.chucknorris.auth.repository.AuthRepository;
import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.users.service.UserService;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.Optional;

@Service
public class AuthService {

    private final AuthRepository tokenRepository;
    private final UserService userService;
    private static final long EXPIRATION_TIME_SECONDS = 30 * 60; // 30 minutes

    public AuthService(AuthRepository tokenRepository, UserService userService) {
        this.tokenRepository = tokenRepository;
        this.userService = userService;
    }

    //TODO: refactor
    public Either<ErrorResultStatus, TokenResponseDto> login(LoginRequestDto request) {
        Either<ErrorResultStatus, Optional<UserEntity>> userEither = userService.findByUsername(request.username());

        if (userEither instanceof Either.Left<ErrorResultStatus, Optional<UserEntity>>(ErrorResultStatus value1)) {
            return new Either.Left<>(value1);
        }

        Optional<UserEntity> optionalUser = ((Either.Right<ErrorResultStatus, Optional<UserEntity>>) userEither).value();

        // TODO: In a real application, you should hash request.password() and compare it.
        if (optionalUser.isEmpty() || !optionalUser.get().getPasswordHash().equals(request.password())) {
            return new Either.Left<>(new ErrorResultStatus(401, "Invalid credentials"));
        }

        UserEntity user = optionalUser.get();
        String token = UUID.randomUUID().toString();
        long expirationTimeSeconds = System.currentTimeMillis() + EXPIRATION_TIME_SECONDS;

        Either<ErrorResultStatus, AuthSessionEntity> saveResult = tokenRepository.saveToken(user.getId(), token, expirationTimeSeconds);
        if (saveResult instanceof Either.Left<ErrorResultStatus, AuthSessionEntity>(ErrorResultStatus value)) {
            return new Either.Left<>(value);
        }

        return new Either.Right<>(new TokenResponseDto(token, expirationTimeSeconds));
    }

    public Either<ErrorResultStatus, Boolean> checkTokenIsValid(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return new Either.Left<>(new ErrorResultStatus(400, "Missing or invalid token"));
        }
        String actualToken = token.replaceFirst("Bearer ", "");
        return tokenRepository.getUserIdByToken(actualToken).map(Optional::isPresent);
    }
}
