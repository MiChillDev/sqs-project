package com.chucknorris.jokes.models.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "jokes")
public class JokeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "external_id", nullable = false)
    private String externalId;
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    public JokeEntity() {}

    public JokeEntity(UUID id, String externalId, String content) {
        this.id = id;
        this.externalId = externalId;
        this.content = content;
    }

    public UUID getId() {
        return id;
    }

    public String getExternalId() {
        return externalId;
    }

    public String getContent() {
        return content;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof JokeEntity that)) {
            return false;
        }
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}