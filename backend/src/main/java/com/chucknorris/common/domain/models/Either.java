package com.chucknorris.common.domain.models;

import java.util.function.Function;

/**
 * for Transparency: this interface has been AI GENERATED. Since Java does not have built-in support for Eithers we add a basic implementation ourselves.
 * This is similar to how Scala handles Eithers, where Left is typically used for errors and Right for successful results.
 * The map and flatMap methods allow us to work with the Right value in a functional style, while preserving the Left value in case of errors.
 * Usage of Either enables a more functional approach to error handling, avoiding the need for exceptions and allowing us to compose operations that may fail in a more elegant way.
 */
public sealed interface Either<L, R> permits Either.Left, Either.Right {
    record Left<L, R>(L value) implements Either<L, R> {
    }

    record Right<L, R>(R value) implements Either<L, R> {
    }

    static <L, R> Left<L, R> left(L value) {
        return new Left<>(value);
    }

    static <L, R> Right<L, R> right(R value) {
        return new Right<>(value);
    }

    // Monadic Map (Right-biased)
    default <T> Either<L, T> map(Function<? super R, ? extends T> mapper) {
        if (this instanceof Right<L, R>(R value)) {
            return right(mapper.apply(value));
        }
        return left(((Left<L, R>) this).value());
    }

    // Monadic FlatMap (Right-biased)
    default <T> Either<L, T> flatMap(Function<? super R, Either<L, T>> mapper) {
        if (this instanceof Right<L, R>(R value)) {
            return mapper.apply(value);
        }
        return left(((Left<L, R>) this).value());
    }
}
