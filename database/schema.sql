-- Social Network Database Schema
-- Create database
CREATE DATABASE IF NOT EXISTS social_network;
USE social_network;

-- Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_picture_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Follows table (many-to-many relationship)
CREATE TABLE follows (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    follower_id BIGINT NOT NULL,
    following_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_follow (follower_id, following_id)
);

-- Indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);

-- Insert some sample data for testing
INSERT INTO users (username, password, profile_picture_url) VALUES
('john_doe', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'https://placehold.co/150x150/FF6B6B/FFFFFF?text=JD'),
('jane_smith', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'https://placehold.co/150x150/4ECDC4/FFFFFF?text=JS'),
('bob_wilson', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'https://placehold.co/150x150/45B7D1/FFFFFF?text=BW'),
('alice_johnson', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'https://placehold.co/150x150/96CEB4/FFFFFF?text=AJ');

-- Insert sample posts
INSERT INTO posts (user_id, content) VALUES
(1, 'Hello everyone! This is my first post on the social network.'),
(2, 'Excited to be part of this community!'),
(3, 'Just finished a great coding session.'),
(1, 'Working on some interesting projects today.'),
(4, 'Beautiful day for a walk in the park.'),
(2, 'Learning new technologies is always fun!'),
(3, 'Coffee and coding - perfect combination!'),
(1, 'Sharing some thoughts on software development.'),
(4, 'Weekend plans: reading and relaxing.'),
(2, 'Collaboration makes everything better!');

-- Insert sample follows
INSERT INTO follows (follower_id, following_id) VALUES
(1, 2),
(1, 3),
(2, 1),
(2, 4),
(3, 1),
(3, 2),
(4, 1),
(4, 3); 