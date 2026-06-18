package com.chucknorris.config;

import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.common.utils.PasswordHasher;
import com.chucknorris.users.models.entity.UserEntity;
import com.chucknorris.users.repository.spring.SpringUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.regex.Pattern;

@Component
public class SeedAdminInitializer implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(SeedAdminInitializer.class);

    private static final Pattern USERNAME_PATTERN = Pattern.compile("^[A-Za-z0-9._-]{3,64}$");
    private static final Pattern PASSWORD_ALLOWED_CHARS_PATTERN = Pattern.compile("^[A-Za-z0-9@_%+=:,.!?-]+$");

    private final SpringUserRepository userRepository;
    private final String seedAdminUsername;
    private final String seedAdminPassword;

    public SeedAdminInitializer(
            SpringUserRepository userRepository,
            @Value("${app.seed.admin.username:}") String seedAdminUsername,
            @Value("${app.seed.admin.password:}") String seedAdminPassword) {
        this.userRepository = userRepository;
        this.seedAdminUsername = normalizeSecret(seedAdminUsername);
        this.seedAdminPassword = normalizeSecret(seedAdminPassword);
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        validateSeedAdminConfiguration();

        Optional<UserEntity> existingUser = userRepository.findByUsername(seedAdminUsername);

        if (existingUser.isPresent()) {
            ensurePasswordMatchesConfiguredSecret(existingUser.get());
            return;
        }

        createSeedAdminUser();
    }

    private void createSeedAdminUser() {
        UserEntity user = new UserEntity();
        user.setUsername(seedAdminUsername);
        user.setPasswordHash(hashPasswordOrThrow(seedAdminPassword));

        userRepository.save(user);

        logger.info("Seed admin user created.");
    }

    private void ensurePasswordMatchesConfiguredSecret(UserEntity user) {
        if (passwordMatchesConfiguredSecret(user.getPasswordHash())) {
            logger.info("Seed admin user already exists.");
            return;
        }

        user.setPasswordHash(hashPasswordOrThrow(seedAdminPassword));
        userRepository.save(user);

        logger.info("Seed admin user password hash updated from configured secret.");
    }

    private boolean passwordMatchesConfiguredSecret(String storedHash) {
        Either<ErrorResultStatus, Boolean> result = PasswordHasher.verifyPassword(seedAdminPassword, storedHash);

        if (result instanceof Either.Right<?, ?> right) {
            return Boolean.TRUE.equals(right.value());
        }

        return false;
    }

    private String hashPasswordOrThrow(String password) {
        Either<ErrorResultStatus, String> result = PasswordHasher.hashPassword(password);

        if (result instanceof Either.Left<?, ?> left) {
            Object value = left.value();

            if (value instanceof ErrorResultStatus error) {
                throw new IllegalStateException("Failed to hash seed admin password: " + error.message());
            }

            throw new IllegalStateException("Failed to hash seed admin password.");
        }

        return result.get();
    }

    private void validateSeedAdminConfiguration() {
        if (seedAdminUsername.isBlank()) {
            throw new IllegalStateException("Missing required configuration: app.seed.admin.username");
        }

        if (seedAdminPassword.isBlank()) {
            throw new IllegalStateException("Missing required configuration: app.seed.admin.password");
        }

        if (!USERNAME_PATTERN.matcher(seedAdminUsername).matches()) {
            throw new IllegalStateException(
                    "Invalid seed admin username. Allowed: 3-64 characters, letters, numbers, dot, underscore, hyphen.");
        }

        validatePassword(seedAdminPassword);
    }

    private void validatePassword(String password) {
        if (password.length() < 20) {
            throw new IllegalStateException("Invalid seed admin password: must be at least 20 characters long.");
        }

        if (password.length() > 128) {
            throw new IllegalStateException("Invalid seed admin password: must not be longer than 128 characters.");
        }

        if (password.chars().anyMatch(Character::isWhitespace)) {
            throw new IllegalStateException("Invalid seed admin password: must not contain whitespace.");
        }

        if (!PASSWORD_ALLOWED_CHARS_PATTERN.matcher(password).matches()) {
            throw new IllegalStateException(
                    "Invalid seed admin password: contains unsupported characters. " +
                            "Allowed special characters: @ _ % + = : , . ! ? -");
        }

        if (password.chars().noneMatch(Character::isLowerCase)) {
            throw new IllegalStateException("Invalid seed admin password: must contain at least one lowercase letter.");
        }

        if (password.chars().noneMatch(Character::isUpperCase)) {
            throw new IllegalStateException("Invalid seed admin password: must contain at least one uppercase letter.");
        }

        if (password.chars().noneMatch(Character::isDigit)) {
            throw new IllegalStateException("Invalid seed admin password: must contain at least one number.");
        }

        if (password.chars().noneMatch(ch -> "@_%+=:,.!?-".indexOf(ch) >= 0)) {
            throw new IllegalStateException(
                    "Invalid seed admin password: must contain at least one special character from: @ _ % + = : , . ! ? -");
        }
    }

    private static String normalizeSecret(String value) {
        if (value == null) {
            return "";
        }

        return value.replace("\r", "").replace("\n", "");
    }
}