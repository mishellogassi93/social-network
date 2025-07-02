package com.socialnetwork.dto;

import jakarta.validation.constraints.NotBlank;

public class CreatePostDto {
    
    @NotBlank(message = "Post content is required")
    private String content;
    
    // Constructors
    public CreatePostDto() {}
    
    public CreatePostDto(String content) {
        this.content = content;
    }
    
    // Getters and Setters
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
} 