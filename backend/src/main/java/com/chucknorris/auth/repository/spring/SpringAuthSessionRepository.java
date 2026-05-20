package com.chucknorris.auth.repository.spring;

import com.chucknorris.auth.models.entity.AuthSessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface SpringAuthSessionRepository extends JpaRepository<AuthSessionEntity, UUID> {
    Optional<AuthSessionEntity> findByToken(String token);
}
