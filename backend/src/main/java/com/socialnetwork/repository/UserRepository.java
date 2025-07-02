package com.socialnetwork.repository;

import com.socialnetwork.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    boolean existsByUsername(String username);
    
    @Query("SELECT u FROM User u WHERE u.username LIKE %:searchTerm% AND u.id != :currentUserId")
    List<User> findByUsernameContainingAndIdNot(@Param("searchTerm") String searchTerm, @Param("currentUserId") Long currentUserId);
    
    @Query("SELECT u FROM User u WHERE u.username LIKE %:searchTerm%")
    List<User> findByUsernameContaining(@Param("searchTerm") String searchTerm);
} 