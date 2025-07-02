import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';

export const UserService = () => {
    const { getAuthHeaders } = useAuth();

    const searchUsers = async (searchTerm) => {
        try {
            const response = await fetch(API_ENDPOINTS.USERS.SEARCH(searchTerm), {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Failed to search users');
            }

            return await response.json();
        } catch (error) {
            console.error('Error searching users:', error);
            throw error;
        }
    };

    const followUser = async (userId) => {
        try {
            const response = await fetch(API_ENDPOINTS.USERS.FOLLOW(userId), {
                method: 'POST',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to follow user');
            }

            return await response.json();
        } catch (error) {
            console.error('Error following user:', error);
            throw error;
        }
    };

    const unfollowUser = async (userId) => {
        try {
            const response = await fetch(API_ENDPOINTS.USERS.UNFOLLOW(userId), {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to unfollow user');
            }

            return await response.json();
        } catch (error) {
            console.error('Error unfollowing user:', error);
            throw error;
        }
    };

    const updateProfilePicture = async (profilePictureUrl) => {
        try {
            const response = await fetch(API_ENDPOINTS.USERS.PROFILE_PICTURE, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ profilePictureUrl })
            });

            if (!response.ok) {
                throw new Error('Failed to update profile picture');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating profile picture:', error);
            throw error;
        }
    };

    return {
        searchUsers,
        followUser,
        unfollowUser,
        updateProfilePicture
    };
}; 