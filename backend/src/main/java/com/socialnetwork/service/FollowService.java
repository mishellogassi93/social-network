package com.socialnetwork.service;

import com.socialnetwork.dto.UserDto;
import com.socialnetwork.entity.Follow;
import com.socialnetwork.entity.User;
import com.socialnetwork.repository.FollowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FollowService {
    
    @Autowired
    private FollowRepository followRepository;
    
    @Autowired
    private UserService userService;
    
    public Follow followUser(Long followerId, Long followingId) {
        System.out.println("DEBUG: FollowService.followUser called with followerId: " + followerId + ", followingId: " + followingId);
        
        if (followerId.equals(followingId)) {
            System.out.println("DEBUG: User trying to follow themselves");
            throw new RuntimeException("Cannot follow yourself");
        }
        
        if (followRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            System.out.println("DEBUG: User already following target user");
            throw new RuntimeException("Already following this user");
        }
        
        User follower = userService.findById(followerId)
                .orElseThrow(() -> {
                    System.out.println("DEBUG: Follower not found with ID: " + followerId);
                    return new RuntimeException("Follower not found");
                });
        
        User following = userService.findById(followingId)
                .orElseThrow(() -> {
                    System.out.println("DEBUG: User to follow not found with ID: " + followingId);
                    return new RuntimeException("User to follow not found");
                });
        
        System.out.println("DEBUG: Creating follow relationship between " + follower.getUsername() + " and " + following.getUsername());
        Follow follow = new Follow(follower, following);
        return followRepository.save(follow);
    }
    
    public void unfollowUser(Long followerId, Long followingId) {
        followRepository.deleteByFollowerIdAndFollowingId(followerId, followingId);
    }
    
    public List<UserDto> getFollowingList(Long userId) {
        System.out.println("DEBUG: FollowService.getFollowingList called with userId: " + userId);
        
        List<Follow> follows = followRepository.findByFollowerId(userId);
        System.out.println("DEBUG: Found " + follows.size() + " follow relationships in database for user " + userId);
        
        List<UserDto> result = follows.stream()
                .map(follow -> {
                    UserDto dto = userService.convertToDto(follow.getFollowing());
                    System.out.println("DEBUG: Converting follow to DTO - Following user: " + dto.getUsername() + " (ID: " + dto.getId() + ")");
                    return dto;
                })
                .collect(Collectors.toList());
        
        System.out.println("DEBUG: Returning " + result.size() + " UserDto objects");
        return result;
    }
    
    public boolean isFollowing(Long followerId, Long followingId) {
        return followRepository.existsByFollowerIdAndFollowingId(followerId, followingId);
    }
} 