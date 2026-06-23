package com.chucknorris.common.controller;

import com.chucknorris.auth.service.AuthService;
import com.chucknorris.auth.service.AuthServiceImpl;
import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Optional;
import java.util.UUID;
import java.util.function.Supplier;

public class BaseController {

    protected final AuthService authService;

    protected BaseController(AuthService authService) {
        this.authService = authService;
    }

    protected <T> ResponseEntity<T> executeUnauthenticated(Supplier<Either<ErrorResultStatus, T>> action) {
        return handleEither(action.get());
    }

    protected <T> ResponseEntity<T> executeAuthenticated(Supplier<Either<ErrorResultStatus, T>> action) {
        Optional<ServletRequestAttributes> attributes = Optional.ofNullable((ServletRequestAttributes) RequestContextHolder.getRequestAttributes());
        Optional<String> token = attributes.flatMap(att -> Optional.ofNullable(att.getRequest().getHeader("Authorization")));
        return handleEither(
                Either.fromOptional(token, new ErrorResultStatus(401, UUID.randomUUID().toString()))
                        .flatMap(authService::checkTokenIsValid)
                        .validate(isValid -> isValid, new ErrorResultStatus(401, "Invalid token"))
                        .flatMap(r -> action.get()));
    }

    @SuppressWarnings("unchecked")
    private <T> ResponseEntity<T> handleEither(Either<ErrorResultStatus, T> result) {
        return switch (result) {
            case Either.Right<ErrorResultStatus, T> r -> ResponseEntity.ok(r.value());
            case Either.Left<ErrorResultStatus, T> l ->
                    (ResponseEntity<T>) ResponseEntity.status(l.value().code()).body(l.value());
        };
    }
}
