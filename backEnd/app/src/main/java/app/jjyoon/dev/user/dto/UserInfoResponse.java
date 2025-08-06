package app.jjyoon.dev.user.dto;

public record UserInfoResponse(
        Long userId,
        String loginId,
        String nickname,
        String email
) {}
