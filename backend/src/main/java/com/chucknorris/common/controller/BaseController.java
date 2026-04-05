package com.chucknorris.common.controller;

import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import org.springframework.http.ResponseEntity;

public class BaseController {

    protected <T> ResponseEntity<T> executeUnauthenticated(Either<ErrorResultStatus, T> result) {
        return handleEither(result);
    }

    protected <T> ResponseEntity<T> executeAuthenticated(Either<ErrorResultStatus, T> result) {
        //TODO: auth
        return handleEither(result);
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
