package com.chucknorris.auth.service;

import com.chucknorris.auth.models.dto.LoginRequestDto;
import com.chucknorris.auth.models.dto.TokenResponseDto;
import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;

public interface AuthService {

    Either<ErrorResultStatus, TokenResponseDto> login(LoginRequestDto request);

    Either<ErrorResultStatus, Boolean> checkTokenIsValid(String token);
}
