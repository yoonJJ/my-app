package app.jjyoon.dev.user.service;

import app.jjyoon.dev.auth.JwtTokenProvider;
import app.jjyoon.dev.user.dto.LoginRequest;
import app.jjyoon.dev.user.dto.LoginResponse;
import app.jjyoon.dev.user.dto.SignupRequest;
import app.jjyoon.dev.user.dto.SignupResponse;
import app.jjyoon.dev.user.dto.UserInfoResponse;
import app.jjyoon.dev.user.entity.User;
import app.jjyoon.dev.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    
    @Value("${jwt.expiration}")
    private long jwtExpiration;
    
    public SignupResponse signup(SignupRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("이미 사용 중인 사용자명입니다");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다");
        }
        
        User user = new User(
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                User.Role.USER
        );
        
        User savedUser = userRepository.save(user);
        
        return new SignupResponse(
                "회원가입이 완료되었습니다",
                UserInfoResponse.from(savedUser)
        );
    }
    
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);
        
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        return new LoginResponse(
                accessToken,
                refreshToken,
                "Bearer",
                jwtExpiration / 1000,
                UserInfoResponse.from(user)
        );
    }
    
    @Transactional(readOnly = true)
    public UserInfoResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        
        return UserInfoResponse.from(user);
    }
}
