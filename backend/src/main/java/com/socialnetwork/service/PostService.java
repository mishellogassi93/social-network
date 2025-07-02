package com.socialnetwork.service;

import com.socialnetwork.dto.PostDto;
import com.socialnetwork.entity.Post;
import com.socialnetwork.entity.User;
import com.socialnetwork.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private UserService userService;
    
    public Post createPost(Long userId, String content) {
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Post post = new Post(user, content);
        return postRepository.save(post);
    }
    
    public List<PostDto> getUserFeed(Long userId) {
        List<Post> posts = postRepository.findPostsByFollowedUsers(userId, PageRequest.of(0, 20));
        return posts.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<PostDto> getUserPosts(Long userId) {
        List<Post> posts = postRepository.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, 20));
        return posts.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public PostDto convertToDto(Post post) {
        return new PostDto(
                post.getId(),
                userService.convertToDto(post.getUser()),
                post.getContent(),
                post.getCreatedAt()
        );
    }
} 