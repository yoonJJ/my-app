package app.jjyoon.dev.post.service;

import app.jjyoon.dev.post.dto.PostCreateRequest;
import app.jjyoon.dev.post.dto.PostResponse;
import app.jjyoon.dev.post.dto.PostUpdateRequest;
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
public class PostService {
    
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    
    public PostResponse createPost(PostCreateRequest request) {
        User currentUser = getCurrentUser();
        
        Post post = new Post(
                request.getTitle(),
                request.getContent(),
                currentUser
        );
        
        Post savedPost = postRepository.save(post);
        return PostResponse.from(savedPost);
    }
    
    @Transactional(readOnly = true)
    public PostResponse getPost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다"));
        
        post.incrementViewCount();
        postRepository.save(post);
        
        return PostResponse.from(post);
    }
    
    @Transactional(readOnly = true)
    public Page<PostResponse> getAllPosts(Pageable pageable) {
        return postRepository.findAll(pageable)
                .map(PostResponse::from);
    }
    
    @Transactional(readOnly = true)
    public Page<PostResponse> searchPosts(String keyword, Pageable pageable) {
        return postRepository.findByTitleOrContentContaining(keyword, pageable)
                .map(PostResponse::from);
    }
    
    @PreAuthorize("hasRole('ADMIN') or @postService.isAuthor(#id, authentication.name)")
    public PostResponse updatePost(Long id, PostUpdateRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다"));
        
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        
        Post updatedPost = postRepository.save(post);
        return PostResponse.from(updatedPost);
    }
    
    @PreAuthorize("hasRole('ADMIN') or @postService.isAuthor(#id, authentication.name)")
    public void deletePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다"));
        
        postRepository.delete(post);
    }
    
    public boolean isAuthor(Long postId, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다"));
        return post.getAuthor().getUsername().equals(username);
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
    }
}
