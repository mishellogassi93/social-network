import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';

export const PostService = () => {
    const { getAuthHeaders } = useAuth();

    const createPost = async (content) => {
        try {
            const response = await fetch(API_ENDPOINTS.POSTS.CREATE, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ content })
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    };

    const getFeed = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.POSTS.FEED, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch feed');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching feed:', error);
            throw error;
        }
    };

    const getUserPosts = async (userId) => {
        try {
            const response = await fetch(API_ENDPOINTS.POSTS.USER_POSTS(userId), {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user posts');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching user posts:', error);
            throw error;
        }
    };

    return {
        createPost,
        getFeed,
        getUserPosts
    };
}; 