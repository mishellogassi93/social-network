// API Configuration
const API_BASE_URL = '/api';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/auth/login`,
        REGISTER: `${API_BASE_URL}/auth/register`,
        CURRENT_USER: `${API_BASE_URL}/auth/current-user`,
    },
    POSTS: {
        CREATE: `${API_BASE_URL}/posts`,
        FEED: `${API_BASE_URL}/posts/feed`,
        USER_POSTS: (userId) => `${API_BASE_URL}/posts/user/${userId}`,
    },
    USERS: {
        SEARCH: (query) => `${API_BASE_URL}/users/search?q=${encodeURIComponent(query)}`,
        PROFILE_PICTURE: `${API_BASE_URL}/users/profile-picture`,
        FOLLOW: (userId) => `${API_BASE_URL}/follows/${userId}`,
        UNFOLLOW: (userId) => `${API_BASE_URL}/follows/${userId}`,
        FOLLOWING: `${API_BASE_URL}/follows/following`,
    },
};

export default API_BASE_URL; 