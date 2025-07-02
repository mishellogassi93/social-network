package com.socialnetwork.repository;

import com.socialnetwork.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {
    
    Optional<Follow> findByFollowerIdAndFollowingId(Long followerId, Long followingId);
    
    boolean existsByFollowerIdAndFollowingId(Long followerId, Long followingId);
    
    @Query("SELECT f FROM Follow f WHERE f.follower.id = :followerId")
    List<Follow> findByFollowerId(@Param("followerId") Long followerId);
    
    @Query("SELECT f FROM Follow f WHERE f.following.id = :followingId")
    List<Follow> findByFollowingId(@Param("followingId") Long followingId);
    
    void deleteByFollowerIdAndFollowingId(Long followerId, Long followingId);
} 