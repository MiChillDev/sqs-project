package com.chucknorris.users.service;

import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import com.chucknorris.common.utils.PasswordHasher;
import com.chucknorris.users.models.entity.UserEntity;
import com.chucknorris.users.repository.spring.SpringUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/// MOSTLY AI GENERATED CLASS
@Service
public class SeedAdminService {

    private static final Logger logger = LoggerFactory.getLogger(SeedAdminService.class);

    private final SpringUserRepository userRepository;

    public SeedAdminService(SpringUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public void createOrUpdateSeedAdmin(String username, String password) {
        Optional<UserEntity> existingUser = userRepository.findByUsername(username);

        if (existingUser.isPresent()) {
            ensurePasswordMatchesConfiguredSecret(existingUser.get(), password);
            return;
        }

        createSeedAdminUser(username, password);
    }

    private void createSeedAdminUser(String username, String password) {
        UserEntity user = new UserEntity();
        user.setUsername(username);
        user.setPasswordHash(hashPasswordOrThrow(password));

        userRepository.save(user);

        logger.info("Seed admin user created.");
    }

    private void ensurePasswordMatchesConfiguredSecret(UserEntity user, String password) {
        if (passwordMatchesConfiguredSecret(password, user.getPasswordHash())) {
            logger.info("Seed admin user already exists.");
            return;
        }

        user.setPasswordHash(hashPasswordOrThrow(password));
        userRepository.save(user);

        logger.info("Seed admin user password hash updated from configured secret.");
    }

    private boolean passwordMatchesConfiguredSecret(String password, String storedHash) {
        Either<ErrorResultStatus, Boolean> result = PasswordHasher.verifyPassword(password, storedHash);

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
}