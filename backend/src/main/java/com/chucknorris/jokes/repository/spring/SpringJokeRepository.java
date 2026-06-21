package com.chucknorris.jokes.repository.spring;

import com.chucknorris.jokes.models.entity.JokeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;
import java.util.UUID;

public interface SpringJokeRepository extends JpaRepository<JokeEntity, UUID> {
    
    @Query(value = "SELECT * FROM jokes ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
    Optional<JokeEntity> findRandomJoke();

    @Query(value = "SELECT * FROM jokes WHERE external_id = :externalId LIMIT 1", nativeQuery = true)
    Optional<JokeEntity> findByExternalId(String externalId);
}