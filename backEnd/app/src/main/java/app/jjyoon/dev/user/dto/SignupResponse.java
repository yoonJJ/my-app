package app.jjyoon.dev.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SignupResponse {

    private Long id;          // 가입된 사용자 고유 ID
    private String loginId;   // 로그인 아이디
    private String email;     // 이메일
    private String nickname;  // 닉네임
    private String role;      // 권한 (ex: ROLE_USER)
}
