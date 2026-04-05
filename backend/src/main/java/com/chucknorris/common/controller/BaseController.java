package com.chucknorris.common.controller;

import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import org.springframework.http.ResponseEntity;

public class BaseController {

    protected <T> ResponseEntity<?> handleEither(Either<ErrorResultStatus, T> result) {
        return switch (result) {
            case Either.Right<ErrorResultStatus, T> r -> ResponseEntity.ok(r.value());
            case Either.Left<ErrorResultStatus, T> l -> ResponseEntity.status(l.value().code()).body(l.value());
        };
    }
}
