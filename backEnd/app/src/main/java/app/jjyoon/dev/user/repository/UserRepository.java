package app.jjyoon.dev.user.repository;

import app.jjyoon.dev.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByLoginId(String loginId);   // 로그인 시 사용
    Optional<User> findByEmail(String email);       // 이메일 중복 체크 등
    boolean existsByLoginId(String loginId);        // 아이디 중복 체크
    boolean existsByEmail(String email);            // 이메일 중복 체크
}
