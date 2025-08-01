package app.jjyoon.dev.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {

    private String token;        // JWT 토큰
    private String tokenType;    // 토큰 타입 (예: Bearer)
    private Long userId;         // 사용자 ID
    private String loginId;      // 로그인 아이디
    private String nickname;     // 닉네임
    private String role;         // 권한 (ex: ROLE_USER)
}
