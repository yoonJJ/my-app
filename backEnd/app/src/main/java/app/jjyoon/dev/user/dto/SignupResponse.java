package app.jjyoon.dev.user.dto;

public class SignupResponse {
    private String message;
    private UserInfoResponse user;
    
    // 생성자
    public SignupResponse() {}
    
    public SignupResponse(String message, UserInfoResponse user) {
        this.message = message;
        this.user = user;
    }
    
    // Getters and Setters
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public UserInfoResponse getUser() {
        return user;
    }
    
    public void setUser(UserInfoResponse user) {
        this.user = user;
    }
}
