package com.chucknorris.config;

import com.chucknorris.users.service.SeedAdminServiceImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

/// MOSTLY AI GENERATED CLASS
@Component
public class SeedAdminInitializer implements ApplicationRunner {

    private static final Pattern USERNAME_PATTERN = Pattern.compile("^[A-Za-z0-9._-]{3,64}$");
    private static final Pattern PASSWORD_ALLOWED_CHARS_PATTERN = Pattern.compile("^[A-Za-z0-9@_%+=:,.!?-]+$");

    private final SeedAdminServiceImpl seedAdminService;
    private final String seedAdminUsername;
    private final String seedAdminPassword;

    public SeedAdminInitializer(
            SeedAdminServiceImpl seedAdminService,
            @Value("${app.seed.admin.username:}") String seedAdminUsername,
            @Value("${app.seed.admin.password:}") String seedAdminPassword) {
        this.seedAdminService = seedAdminService;
        this.seedAdminUsername = normalizeSecret(seedAdminUsername);
        this.seedAdminPassword = normalizeSecret(seedAdminPassword);
    }

    @Override
    public void run(ApplicationArguments args) {
        validateSeedAdminConfiguration();
        seedAdminService.createOrUpdateSeedAdmin(seedAdminUsername, seedAdminPassword);
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