package com.chucknorris.auth.controller;

import com.chucknorris.auth.models.dto.LoginRequestDto;
import com.chucknorris.auth.models.dto.TokenResponseDto;
import com.chucknorris.auth.service.AuthService;
import com.chucknorris.common.domain.models.Either;
import com.chucknorris.common.domain.models.ErrorResultStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    private AuthController controller;

    @BeforeEach
    void setUp() {
        controller = new AuthController(authService);
    }

    @Nested
    @DisplayName("login")
    class Login {
        @Nested
        @DisplayName("success scenarios")
        class Success {
            @Test
            @DisplayName("returns 200 with token when credentials are valid")
            void returns200WithToken() {
                TokenResponseDto dto = new TokenResponseDto("tok-1", LocalDateTime.now().plusMinutes(30));
                when(authService.login(new LoginRequestDto("bob", "pw"))).thenReturn(Either.right(dto));

                ResponseEntity<TokenResponseDto> resp = controller.login(new LoginRequestDto("bob", "pw"));
                assertThat(resp.getStatusCode().value()).isEqualTo(200);
                assertThat(resp.getBody()).isNotNull();
                assertThat(resp.getBody().token()).isEqualTo("tok-1");
            }
        }

        @Nested
        @DisplayName("failure scenarios")
        class Failure {
            @Test
            @DisplayName("returns 401 with error message when credentials are invalid")
            void returnsMappedError() {
                when(authService.login(new LoginRequestDto("bob", "bad"))).thenReturn(Either.left(new ErrorResultStatus(401, "Invalid")));

                @SuppressWarnings({"rawtypes"})
                var resp = (ResponseEntity) controller.login(new LoginRequestDto("bob", "bad"));
                assertThat(resp.getStatusCode().value()).isEqualTo(401);
                assertThat(resp.getBody()).isInstanceOf(ErrorResultStatus.class);
                assert resp.getBody() != null;
                assertThat(((ErrorResultStatus) resp.getBody()).message()).isEqualTo("Invalid");
            }
        }
    }
}



