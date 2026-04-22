package com.chucknorris.auth.controller;

import com.chucknorris.auth.models.dto.LoginRequestDto;
import com.chucknorris.auth.models.dto.TokenResponseDto;
import com.chucknorris.auth.service.AuthService;
import com.chucknorris.common.controller.BaseController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController extends BaseController {

    //TODO: update Spec

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDto> login(@RequestBody LoginRequestDto request) {
        return executeUnauthenticated(() -> authService.login(request));
    }
}