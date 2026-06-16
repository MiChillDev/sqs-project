package com.chucknorris.common.domain.models;

import java.util.Optional;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;

/**
 * for Transparency: this interface has been mostly AI GENERATED. Since Java does not have built-in support for Eithers we add a basic implementation ourselves.
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

    static <L, R> Either<L, R> fromOptional(Optional<R> optional, L leftValue) {
        if (optional.isPresent()) {
            return right(optional.get());
        } else {
            return left(leftValue);
        }
    }

    static <L, R> Either<L, R> tryCatch(Supplier<R> supplier, L onException) {
        try {
            return right(supplier.get());
        } catch (Exception e) {
            return left(onException);
        }
    }

    default Either<L, R> validate(Predicate<? super R> predicate, L errorValue) {
        if (this instanceof Right<L, R>(R value)) {
            if (predicate.test(value)) {
                return this;
            } else {
                return left(errorValue);
            }
        }
        return left(((Left<L, R>) this).value());
    }


    // Monadic Map (Right-biased)
    default <T> Either<L, T> map(Function<? super R, ? extends T> mapper) {
        if (this instanceof Right<L, R>(R value)) {
            try {
                return right(mapper.apply(value));
            } catch (Exception e) {
                return left(null); // intentional null value. This is only a fallback that should not occur. for mapping operations that can fail, use tryCatch operation in Either and flatMap
            }
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
