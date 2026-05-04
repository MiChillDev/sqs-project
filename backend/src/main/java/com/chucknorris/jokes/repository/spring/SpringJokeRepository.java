package com.chucknorris.jokes.repository.spring;

import com.chucknorris.jokes.models.entity.JokeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface SpringJokeRepository extends JpaRepository<JokeEntity, UUID> {
}