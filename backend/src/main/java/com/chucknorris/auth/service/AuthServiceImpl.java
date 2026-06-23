package com.chucknorris.auth.service;

import com.chucknorris.auth.models.dto.LoginRequestDto;
import com.chucknorris.auth.models.dto.TokenResponseDto;
import com.chucknorris.auth.repository.AuthRepository;
import com.chucknorris.common.utils.PasswordHasher;
import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.users.service.UserService;
import com.chucknorris.users.service.UserServiceImpl;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthRepository tokenRepository;
    private final UserService userService;
    private static final long EXPIRATION_TIME_SECONDS = (long) 30 * 60; // 30 minutes

    public AuthServiceImpl(AuthRepository tokenRepository, UserService userService) {
        this.tokenRepository = tokenRepository;
        this.userService = userService;
    }

    public Either<ErrorResultStatus, TokenResponseDto> login(LoginRequestDto request) {
        return userService.findByUsername(request.username())
                .validate(Optional::isPresent, new ErrorResultStatus(404, "User Not Found"))
                .map(Optional::get)
                .flatMap(user ->
                        PasswordHasher.verifyPassword(request.password(), user.getPasswordHash())
                                // error when credentials are incorrect must be the same as when user is not found to prevent information leakage.
                                .validate(isValid -> isValid, new ErrorResultStatus(404, "User Not Found"))
                                .map(isValid -> user))
                .flatMap(user -> {
                    String token = UUID.randomUUID().toString();
                    return tokenRepository.saveToken(user.getId(), token, EXPIRATION_TIME_SECONDS);
                }).map(authSession -> new TokenResponseDto(authSession.getToken(), authSession.getExpiresAt()));
    }

    public Either<ErrorResultStatus, Boolean> checkTokenIsValid(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return new Either.Left<>(new ErrorResultStatus(400, "Missing or invalid token"));
        }
        String actualToken = token.replaceFirst("Bearer ", "");
        return tokenRepository.getUserIdByToken(actualToken).map(Optional::isPresent);
    }
}
