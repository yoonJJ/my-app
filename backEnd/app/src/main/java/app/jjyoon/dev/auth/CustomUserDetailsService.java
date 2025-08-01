package app.jjyoon.dev.auth;

import app.jjyoon.dev.user.entity.User;
import app.jjyoon.dev.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    // userId (loginId 아님!) 기준으로 사용자 정보 조회
    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        User user = userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + userId));

        return org.springframework.security.core.userdetails.User.builder()
                .username(String.valueOf(user.getId())) // Spring Security는 username 타입이 String이야
                .password(user.getPassword())           // 비밀번호
                .roles(user.getRole().replace("ROLE_", "")) // ROLE_USER → USER
                .build();
    }
}
