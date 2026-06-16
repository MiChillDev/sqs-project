package com.chucknorris.common.utils;

import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.Base64;

/// MOSTLY AI GENERATED CLASS
public final class PasswordHasher {

    private static final SecureRandom secureRandom = new SecureRandom();

    private static final int ITERATIONS = 65536;
    private static final int KEY_LENGTH = 256;
    private static final String ALGORITHM = "PBKDF2WithHmacSHA256";

    // used to overwrite default public constructor
    private PasswordHasher() {
        throw new AssertionError("Utility class");
    }

    // Format: "iterations:salt:hash"
    public static Either<ErrorResultStatus, String> hashPassword(String password) {
        try {
            byte[] salt = new byte[16];
            secureRandom.nextBytes(salt);

            byte[] hash = pbkdf2(password.toCharArray(), salt, ITERATIONS, KEY_LENGTH);

            var result = ITERATIONS + ":" + Base64.getEncoder().encodeToString(salt) + ":" + Base64.getEncoder().encodeToString(hash);
            return Either.right(result);
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            return Either.left(new ErrorResultStatus(500, "Error hashing password"));
        }
    }

    public static Either<ErrorResultStatus, Boolean> verifyPassword(String password, String storedHash) {
        try {
            String[] parts = storedHash.split(":");
            if (parts.length != 3) {
                return Either.right(false);
            }
            int iterations = Integer.parseInt(parts[0]);
            byte[] salt = Base64.getDecoder().decode(parts[1]);
            byte[] hash = Base64.getDecoder().decode(parts[2]);

            byte[] testHash = pbkdf2(password.toCharArray(), salt, iterations, hash.length * 8);

            return Either.right(slowEquals(hash, testHash));
        } catch (NoSuchAlgorithmException | InvalidKeySpecException | IllegalArgumentException e) {
            return Either.left(new ErrorResultStatus(500, "Error verifying password"));
        }
    }

    // no need for Either since these are local util functions
    private static byte[] pbkdf2(char[] password, byte[] salt, int iterations, int bytes)
            throws NoSuchAlgorithmException, InvalidKeySpecException {
        PBEKeySpec spec = new PBEKeySpec(password, salt, iterations, bytes);
        SecretKeyFactory skf = SecretKeyFactory.getInstance(ALGORITHM);
        return skf.generateSecret(spec).getEncoded();
    }

    // no need for Either since these are local util functions
    private static boolean slowEquals(byte[] a, byte[] b) {
        int diff = a.length ^ b.length;
        for (int i = 0; i < a.length && i < b.length; i++) {
            diff |= a[i] ^ b[i];
        }
        return diff == 0;
    }
}
