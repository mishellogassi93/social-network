package com.socialnetwork.dto;

import java.time.LocalDateTime;

public class PostDto {
    
    private Long id;
    private UserDto user;
    private String content;
    private LocalDateTime createdAt;
    
    // Constructors
    public PostDto() {}
    
    public PostDto(Long id, UserDto user, String content, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.content = content;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public UserDto getUser() {
        return user;
    }
    
    public void setUser(UserDto user) {
        this.user = user;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
} 