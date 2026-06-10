package com.chucknorris.common.domain.models;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class EitherTest {

    @Nested
    @DisplayName("fromOptional")
    class FromOptional {
        @Test
        void returnsRightWhenPresent() {
            Either<String, Integer> e = Either.fromOptional(Optional.of(5), "no");
            assertThat(e).isInstanceOf(Either.Right.class);
            assertThat(((Either.Right<String, Integer>) e).value()).isEqualTo(5);
        }

        @Test
        void returnsLeftWhenEmpty() {
            Either<String, Integer> e = Either.fromOptional(Optional.empty(), "left");
            assertThat(e).isInstanceOf(Either.Left.class);
            assertThat(((Either.Left<String, Integer>) e).value()).isEqualTo("left");
        }
    }

    @Nested
    @DisplayName("map and flatMap")
    class MapFlatMap {
        @Test
        void mapTransformsRight() {
            Either<String, Integer> e = Either.right(3);
            Either<String, String> mapped = e.map(i -> "v" + i);
            assertThat(mapped).isInstanceOf(Either.Right.class);
            assertThat(((Either.Right<String, String>) mapped).value()).isEqualTo("v3");
        }

        @Test
        void flatMapChainsRight() {
            Either<String, Integer> e = Either.right(2);
            Either<String, Integer> chained = e.flatMap(i -> Either.right(i * 5));
            assertThat(chained).isInstanceOf(Either.Right.class);
            assertThat(((Either.Right<String, Integer>) chained).value()).isEqualTo(10);
        }
    }

    @Nested
    @DisplayName("validate")
    class Validate {
        @Test
        void returnsRightWhenPredicateTrue() {
            Either<String, Integer> e = Either.right(4);
            Either<String, Integer> v = e.validate(i -> i % 2 == 0, "odd");
            assertThat(v).isInstanceOf(Either.Right.class);
        }

        @Test
        void returnsLeftWhenPredicateFalse() {
            Either<String, Integer> e = Either.right(3);
            Either<String, Integer> v = e.validate(i -> i % 2 == 0, "odd");
            assertThat(v).isInstanceOf(Either.Left.class);
            assertThat(((Either.Left<String, Integer>) v).value()).isEqualTo("odd");
        }
    }
}

