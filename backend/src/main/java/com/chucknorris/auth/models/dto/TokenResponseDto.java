package com.chucknorris.auth.models.dto;

public record TokenResponseDto(String token, long expiresInMillis) {}