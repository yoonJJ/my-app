package app.jjyoon.dev.user.service;

import app.jjyoon.dev.auth.JwtTokenProvider;
import app.jjyoon.dev.user.dto.LoginRequest;
import app.jjyoon.dev.user.dto.LoginResponse;
import app.jjyoon.dev.user.dto.SignupRequest;
import app.jjyoon.dev.user.dto.SignupResponse;
import app.jjyoon.dev.user.entity.User;
import app.jjyoon.dev.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public SignupResponse signup(SignupRequest request) {
        if (userRepository.existsByLoginId(request.getLoginId())) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        User user = User.builder()
                .loginId(request.getLoginId())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .role("ROLE_USER")
                .build();

        User saved = userRepository.save(user);

        return new SignupResponse(
                saved.getId(),
                saved.getLoginId(),
                saved.getEmail(),
                saved.getNickname(),
                saved.getRole()
        );
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        // loginId로 사용자 조회
        User user = userRepository.findByLoginId(request.getLoginId())
                .orElseThrow(() -> new IllegalArgumentException("아이디 또는 비밀번호가 일치하지 않습니다."));

        // 비밀번호 검증
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        // JWT 토큰 생성
        String token = jwtTokenProvider.createToken(
                String.valueOf(user.getId()),
                user.getRole()
        );

        return new LoginResponse(
                token,
                "Bearer",
                user.getId(),
                user.getLoginId(),
                user.getNickname(),
                user.getRole()
        );
    }
}
