package com.chucknorris.common.utils;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class PasswordHasherTest {

    @Nested
    @DisplayName("hash and verify")
    class HashVerify {
        @Test
        @DisplayName("hashing then verifying returns true")
        void hashThenVerify() {
            String pw = "s3cr3t";
            String hash = PasswordHasher.hashPassword(pw);
            assertThat(PasswordHasher.verifyPassword(pw, hash)).isTrue();
        }

        @Test
        @DisplayName("verify returns false for malformed stored hash")
        void verifyMalformedHash() {
            assertThat(PasswordHasher.verifyPassword("pw", "not-a-valid-hash")).isFalse();
        }
    }
}

