package app.jjyoon.dev.user.controller;

import app.jjyoon.dev.auth.UserDetailsImpl;
import app.jjyoon.dev.user.dto.*;
import app.jjyoon.dev.user.entity.User;
import app.jjyoon.dev.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signup(@Valid @RequestBody SignupRequest request) {
        SignupResponse response = userService.signup(request);
        return ResponseEntity.ok(response);
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserInfoResponse> getMyInfo(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userDetails.getUser(); // 실제 User 객체를 꺼냄

        UserInfoResponse response = new UserInfoResponse(
                user.getId(),
                user.getLoginId(),
                user.getNickname(),
                user.getEmail()
        );

        return ResponseEntity.ok(response);
    }

}
