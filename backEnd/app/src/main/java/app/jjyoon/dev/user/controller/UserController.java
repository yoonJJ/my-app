package app.jjyoon.dev.user.controller;

import app.jjyoon.dev.user.dto.LoginRequest;
import app.jjyoon.dev.user.dto.LoginResponse;
import app.jjyoon.dev.user.dto.SignupRequest;
import app.jjyoon.dev.user.dto.SignupResponse;
import app.jjyoon.dev.user.dto.UserInfoResponse;
import app.jjyoon.dev.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signup(@Valid @RequestBody SignupRequest request) {
        SignupResponse response = userService.signup(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/me")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<UserInfoResponse> getCurrentUser() {
        UserInfoResponse response = userService.getCurrentUser();
        return ResponseEntity.ok(response);
    }
}