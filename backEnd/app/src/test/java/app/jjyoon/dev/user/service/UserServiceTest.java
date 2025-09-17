package app.jjyoon.dev.user.service;

import app.jjyoon.dev.user.dto.SignupRequest;
import app.jjyoon.dev.user.entity.User;
import app.jjyoon.dev.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @Mock
    private AuthenticationManager authenticationManager;
    
    @Mock
    private Authentication authentication;
    
    @InjectMocks
    private UserService userService;
    
    private SignupRequest signupRequest;
    
    @BeforeEach
    void setUp() {
        signupRequest = new SignupRequest();
        signupRequest.setUsername("testuser");
        signupRequest.setEmail("test@example.com");
        signupRequest.setPassword("password123");
    }
    
    @Test
    void signup_Success() {
        // Given
        when(userRepository.existsByUsername(any())).thenReturn(false);
        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");
        
        User savedUser = new User(
                1L,
                "testuser",
                "test@example.com",
                "encodedPassword",
                User.Role.USER
        );
        
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        
        // When
        var result = userService.signup(signupRequest);
        
        // Then
        assertNotNull(result);
        assertEquals("회원가입이 완료되었습니다", result.getMessage());
        assertEquals("testuser", result.getUser().getUsername());
        assertEquals("test@example.com", result.getUser().getEmail());
        
        verify(userRepository).existsByUsername("testuser");
        verify(userRepository).existsByEmail("test@example.com");
        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(any(User.class));
    }
    
    @Test
    void signup_DuplicateUsername() {
        // Given
        when(userRepository.existsByUsername(any())).thenReturn(true);
        
        // When & Then
        assertThrows(RuntimeException.class, () -> userService.signup(signupRequest));
        
        verify(userRepository).existsByUsername("testuser");
        verify(userRepository, never()).save(any(User.class));
    }
    
    @Test
    void signup_DuplicateEmail() {
        // Given
        when(userRepository.existsByUsername(any())).thenReturn(false);
        when(userRepository.existsByEmail(any())).thenReturn(true);
        
        // When & Then
        assertThrows(RuntimeException.class, () -> userService.signup(signupRequest));
        
        verify(userRepository).existsByUsername("testuser");
        verify(userRepository).existsByEmail("test@example.com");
        verify(userRepository, never()).save(any(User.class));
    }
}
