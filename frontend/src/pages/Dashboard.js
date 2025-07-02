import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PostService } from '../services/PostService';
import { UserService } from '../services/UserService';
import { API_ENDPOINTS } from '../config/api';

const Dashboard = () => {
  const { user, logout, getAuthHeaders } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const postService = PostService();
  const userService = UserService();

  const loadFeed = async () => {
    try {
      const feedData = await postService.getFeed();
      setPosts(feedData);
    } catch (error) {
      console.error('Error loading feed:', error);
    }
  };

  const loadFollowing = async () => {
    try {
      console.log('Loading following list...');
      const response = await fetch(API_ENDPOINTS.USERS.FOLLOWING, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      console.log('Following response status:', response.status);
      if (response.ok) {
        const followingData = await response.json();
        console.log('Following data:', followingData);
        setFollowing(followingData);
      } else {
        console.error('Failed to load following:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('Error loading following:', error);
    }
  };

  const loadAllUsers = async () => {
    try {
      const response = await fetch('/api/users/search?q=', {
        method: 'GET',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const usersData = await response.json();
        setAllUsers(usersData);
      }
    } catch (error) {
      console.error('Error loading all users:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadFeed();
      loadFollowing();
      loadAllUsers();
      if (user?.profilePictureUrl) {
        setProfilePictureUrl(user.profilePictureUrl);
      }
    }
  }, [user]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setLoading(true);
    try {
      await postService.createPost(newPost);
      
      setNewPost('');
      setSuccess('Post created successfully!');
      loadFeed();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to create post');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const searchData = await userService.searchUsers(searchTerm);
      setSearchResults(searchData);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleFollow = async (userId) => {
    setFollowLoading(prev => ({ ...prev, [userId]: true }));
    try {
      await userService.followUser(userId);
      loadFollowing();
      loadAllUsers();
      handleSearch();
      setSuccess('User followed successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error following user:', error);
      setError('Failed to follow user');
      setTimeout(() => setError(''), 3000);
    } finally {
      setFollowLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleUnfollow = async (userId) => {
    setFollowLoading(prev => ({ ...prev, [userId]: true }));
    try {
      await userService.unfollowUser(userId);
      loadFollowing();
      loadAllUsers();
      handleSearch();
      setSuccess('User unfollowed successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error unfollowing user:', error);
      setError('Failed to unfollow user');
      setTimeout(() => setError(''), 3000);
    } finally {
      setFollowLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleUpdateProfilePicture = async () => {
    if (!profilePictureUrl.trim()) return;

    try {
      await userService.updateProfilePicture(profilePictureUrl);
      
      setSuccess('Profile picture updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update profile picture');
      setTimeout(() => setError(''), 3000);
    }
  };

  const isFollowingUser = (userId) => {
    return following.some(followedUser => followedUser.id === userId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Default placeholder image
  const getDefaultAvatar = (text = '?') => `https://placehold.co/100x100/667eea/FFFFFF?text=${text}`;

  return (
    <div className="dashboard">
      {/* Left Sidebar - Profile */}
      <div className="sidebar">
        <div className="profile-section">
          <img
            src={user?.profilePictureUrl || getDefaultAvatar()}
            alt="Profile"
            className="profile-picture"
            onError={(e) => {
              e.target.src = getDefaultAvatar();
            }}
          />
          <div className="username">{user?.username}</div>
          <input
            type="text"
            placeholder="Enter profile picture URL"
            value={profilePictureUrl}
            onChange={(e) => setProfilePictureUrl(e.target.value)}
            className="profile-picture-input"
          />
          <button
            onClick={handleUpdateProfilePicture}
            className="btn btn-primary"
            style={{ marginBottom: '20px' }}
          >
            Update Picture
          </button>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>

        <div className="following-section">
          <h3>Following ({following.length})</h3>
          <button 
            onClick={loadFollowing} 
            className="btn btn-secondary"
            style={{ marginBottom: '10px', fontSize: '12px', padding: '5px 10px' }}
          >
            Refresh Following
          </button>
          <div className="following-list">
            {following.map(followedUser => (
              <div key={followedUser.id} className="user-item">
                <img
                  src={followedUser.profilePictureUrl || getDefaultAvatar(followedUser.username.charAt(0).toUpperCase())}
                  alt={followedUser.username}
                  className="user-item-picture"
                  onError={(e) => {
                    e.target.src = getDefaultAvatar(followedUser.username.charAt(0).toUpperCase());
                  }}
                />
                <span className="user-item-username">{followedUser.username}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Posts */}
      <div className="main-content">
        <div className="post-form">
          <h3>Create a Post</h3>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <form onSubmit={handleCreatePost}>
            <textarea
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              maxLength="500"
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !newPost.trim()}
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </form>
        </div>

        <div className="feed">
          <h3>Your Feed</h3>
          {posts.length === 0 ? (
            <p>No posts to show. Follow some users to see their posts!</p>
          ) : (
            posts.map(post => (
              <div key={post.id} className="post">
                <div className="post-header">
                  <img
                    src={post.user.profilePictureUrl || getDefaultAvatar(post.user.username.charAt(0).toUpperCase())}
                    alt={post.user.username}
                    className="post-user-picture"
                    onError={(e) => {
                      e.target.src = getDefaultAvatar(post.user.username.charAt(0).toUpperCase());
                    }}
                  />
                  <span className="post-username">{post.user.username}</span>
                  <span className="post-timestamp">{formatDate(post.createdAt)}</span>
                </div>
                <div className="post-content">{post.content}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Sidebar - Search */}
      <div className="search-section">
        <h3>Search Users</h3>
        <div>
          <input
            type="text"
            placeholder="Search by username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="btn btn-primary">
            Search
          </button>
        </div>

        <div className="user-list">
          {searchResults.filter(searchUser => searchUser.id !== user?.id).map(searchUser => (
            <div key={searchUser.id} className="user-item">
              <img
                src={searchUser.profilePictureUrl || getDefaultAvatar(searchUser.username.charAt(0).toUpperCase())}
                alt={searchUser.username}
                className="user-item-picture"
                onError={(e) => {
                  e.target.src = getDefaultAvatar(searchUser.username.charAt(0).toUpperCase());
                }}
              />
              <span className="user-item-username">{searchUser.username}</span>
              <button
                onClick={() => isFollowingUser(searchUser.id) 
                  ? handleUnfollow(searchUser.id) 
                  : handleFollow(searchUser.id)
                }
                className={`follow-btn ${isFollowingUser(searchUser.id) ? 'unfollow' : 'follow'}`}
                disabled={followLoading[searchUser.id]}
              >
                {followLoading[searchUser.id] ? '...' : (isFollowingUser(searchUser.id) ? 'Unfollow' : 'Follow')}
              </button>
            </div>
          ))}
        </div>

        {/* All Users Section */}
        <div style={{ marginTop: '20px' }}>
          <h3>All Users</h3>
          <div className="user-list">
            {allUsers.filter(userItem => userItem.id !== user?.id).map(userItem => (
              <div key={userItem.id} className="user-item">
                <img
                  src={userItem.profilePictureUrl || getDefaultAvatar(userItem.username.charAt(0).toUpperCase())}
                  alt={userItem.username}
                  className="user-item-picture"
                  onError={(e) => {
                    e.target.src = getDefaultAvatar(userItem.username.charAt(0).toUpperCase());
                  }}
                />
                <span className="user-item-username">{userItem.username}</span>
                <button
                  onClick={() => isFollowingUser(userItem.id) 
                    ? handleUnfollow(userItem.id) 
                    : handleFollow(userItem.id)
                  }
                  className={`follow-btn ${isFollowingUser(userItem.id) ? 'unfollow' : 'follow'}`}
                  disabled={followLoading[userItem.id]}
                >
                  {followLoading[userItem.id] ? '...' : (isFollowingUser(userItem.id) ? 'Unfollow' : 'Follow')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;