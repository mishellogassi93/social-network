package com.socialnetwork.controller;

import com.socialnetwork.dto.UserDto;
import com.socialnetwork.entity.Follow;
import com.socialnetwork.entity.User;
import com.socialnetwork.service.FollowService;
import com.socialnetwork.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/follows")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3002"})
public class FollowController {
    
    @Autowired
    private FollowService followService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/{userId}")
    public ResponseEntity<?> followUser(@PathVariable Long userId) {
        System.out.println("DEBUG: FollowController.followUser called with userId: " + userId);
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            System.out.println("DEBUG: Authentication failed");
            Map<String, String> error = new HashMap<>();
            error.put("error", "Not authenticated");
            return ResponseEntity.status(401).body(error);
        }
        
        String username = authentication.getName();
        System.out.println("DEBUG: Authenticated username: " + username);
        
        User currentUser = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        System.out.println("DEBUG: Current user found - ID: " + currentUser.getId() + ", Username: " + currentUser.getUsername());
        System.out.println("DEBUG: Attempting to follow user. Current user: " + currentUser.getId() + ", Target user: " + userId);
        
        try {
            Follow result = followService.followUser(currentUser.getId(), userId);
            System.out.println("DEBUG: Follow relationship created successfully with ID: " + result.getId());
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "User followed successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // Add debug logging
            System.out.println("DEBUG: Error following user: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> unfollowUser(@PathVariable Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Not authenticated");
            return ResponseEntity.status(401).body(error);
        }
        
        String username = authentication.getName();
        User currentUser = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        try {
            followService.unfollowUser(currentUser.getId(), userId);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "User unfollowed successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/following")
    public ResponseEntity<?> getFollowingList() {
        System.out.println("DEBUG: FollowController.getFollowingList called");
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            System.out.println("DEBUG: Authentication failed in getFollowingList");
            Map<String, String> error = new HashMap<>();
            error.put("error", "Not authenticated");
            return ResponseEntity.status(401).body(error);
        }
        
        String username = authentication.getName();
        System.out.println("DEBUG: Authenticated username in getFollowingList: " + username);
        
        User currentUser = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        System.out.println("DEBUG: Current user in getFollowingList - ID: " + currentUser.getId() + ", Username: " + currentUser.getUsername());
        
        try {
            List<UserDto> following = followService.getFollowingList(currentUser.getId());
            System.out.println("DEBUG: Found " + following.size() + " following relationships for user " + currentUser.getId());
            return ResponseEntity.ok(following);
        } catch (RuntimeException e) {
            System.out.println("DEBUG: Error getting following list: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/{userId}/is-following")
    public ResponseEntity<?> isFollowing(@PathVariable Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Not authenticated");
            return ResponseEntity.status(401).body(error);
        }
        
        String username = authentication.getName();
        User currentUser = userService.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        boolean isFollowing = followService.isFollowing(currentUser.getId(), userId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isFollowing", isFollowing);
        
        return ResponseEntity.ok(response);
    }
} 