package app.jjyoon.dev.comment.dto;

import app.jjyoon.dev.comment.entity.Comment;

import java.time.LocalDateTime;

public class CommentResponse {
    private Long id;
    private String content;
    private String authorName;
    private Long postId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 생성자
    public CommentResponse() {}
    
    public CommentResponse(Long id, String content, String authorName, Long postId, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.content = content;
        this.authorName = authorName;
        this.postId = postId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    public static CommentResponse from(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getContent(),
                comment.getAuthor().getUsername(),
                comment.getPost().getId(),
                comment.getCreatedAt(),
                comment.getUpdatedAt()
        );
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public String getAuthorName() {
        return authorName;
    }
    
    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }
    
    public Long getPostId() {
        return postId;
    }
    
    public void setPostId(Long postId) {
        this.postId = postId;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
