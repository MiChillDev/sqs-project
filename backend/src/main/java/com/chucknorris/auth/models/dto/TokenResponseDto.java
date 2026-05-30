package com.chucknorris.auth.models.dto;

import java.time.LocalDateTime;

public record TokenResponseDto(String token, LocalDateTime expiresAt) {}