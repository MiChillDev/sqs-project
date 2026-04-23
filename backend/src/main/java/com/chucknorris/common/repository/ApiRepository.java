package com.chucknorris.common.repository;

import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

public abstract class ApiRepository {

    protected final RestTemplate restTemplate;

    public ApiRepository() {
        this.restTemplate = new RestTemplate();
    }

    public ApiRepository(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    protected <T> Either<ErrorResultStatus, T> get(String url, Class<T> responseType) {
        try {
            ResponseEntity<T> response = restTemplate.getForEntity(url, responseType);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return Either.right(response.getBody());
            } else {
                return Either.left(new ErrorResultStatus(500, "API request failed or returned empty body with status: " + response.getStatusCode()));
            }
        } catch (Exception e) {
            return Either.left(new ErrorResultStatus(500, "Error communicating with external API: " + e.getMessage()));
        }
    }
}
