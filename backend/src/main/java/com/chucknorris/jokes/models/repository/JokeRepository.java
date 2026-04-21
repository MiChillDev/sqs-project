package com.chucknorris.jokes.models.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface JokeRepository extends JpaRepository<JokeEntity, UUID> {
}