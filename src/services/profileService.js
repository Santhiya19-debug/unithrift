/**
 * Profile Service
 * Handles all profile-related API calls
 * All functions are async and return promises
 */

const API_BASE_URL = '/api'; // Replace with actual API URL

/**
 * Get current user's profile data
 * @returns {Promise<Object>} User profile data
 */
export const getUserProfile = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication header
        // 'Authorization': `Bearer ${getAuthToken()}`
      },
      credentials: 'include' // Include cookies for session-based auth
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

/**
 * Get user's activity statistics
 * @returns {Promise<Object>} Activity stats
 */
export const getUserStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

/**
 * Get user's listings
 * @returns {Promise<Array>} Array of user's listings
 */
export const getUserListings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/listings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch listings');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching listings:', error);
    throw error;
  }
};

/**
 * Delete a user's listing
 * @param {string|number} listingId - ID of listing to delete
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteUserListing = async (listingId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/listings/${listingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to delete listing');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw error;
  }
};

/**
 * Update user profile information
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} Updated profile
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

/**
 * Logout user
 * @returns {Promise<Object>} Logout confirmation
 */
export const logoutUser = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to logout');
    }

    return await response.json();
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};