package app.jjyoon.dev.comment.service;

import app.jjyoon.dev.comment.dto.CommentCreateRequest;
import app.jjyoon.dev.comment.dto.CommentResponse;
import app.jjyoon.dev.comment.dto.CommentUpdateRequest;
import app.jjyoon.dev.comment.entity.Comment;
import app.jjyoon.dev.comment.repository.CommentRepository;
import app.jjyoon.dev.post.entity.Post;
import app.jjyoon.dev.post.repository.PostRepository;
import app.jjyoon.dev.user.entity.User;
import app.jjyoon.dev.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CommentService {
    
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    
    public CommentResponse createComment(CommentCreateRequest request) {
        User currentUser = getCurrentUser();
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다"));
        
        Comment comment = new Comment(
                request.getContent(),
                post,
                currentUser
        );
        
        Comment savedComment = commentRepository.save(comment);
        return CommentResponse.from(savedComment);
    }
    
    @Transactional(readOnly = true)
    public Page<CommentResponse> getCommentsByPostId(Long postId, Pageable pageable) {
        return commentRepository.findByPostId(postId, pageable)
                .map(CommentResponse::from);
    }
    
    @PreAuthorize("hasRole('ADMIN') or @commentService.isAuthor(#id, authentication.name)")
    public CommentResponse updateComment(Long id, CommentUpdateRequest request) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다"));
        
        comment.setContent(request.getContent());
        
        Comment updatedComment = commentRepository.save(comment);
        return CommentResponse.from(updatedComment);
    }
    
    @PreAuthorize("hasRole('ADMIN') or @commentService.isAuthor(#id, authentication.name)")
    public void deleteComment(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다"));
        
        commentRepository.delete(comment);
    }
    
    public boolean isAuthor(Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다"));
        return comment.getAuthor().getUsername().equals(username);
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
    }
}
