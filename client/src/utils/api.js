import axios from 'axios';
import { notifications } from '@mantine/notifications';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor to handle rate limiting
api.interceptors.response.use(
  (response) => {
    // Extract rate limit headers
    const limit = response.headers['x-ratelimit-limit'];
    const remaining = response.headers['x-ratelimit-remaining'];
    const reset = response.headers['x-ratelimit-reset'];

    // If we're running low on remaining requests, show a warning
    if (remaining && parseInt(remaining) < 5) {
      notifications.show({
        title: 'Rate Limit Warning',
        message: `You have ${remaining} requests remaining. Limit resets in ${Math.ceil((reset * 1000 - Date.now()) / 1000)} seconds.`,
        color: 'yellow',
      });
    }

    return response;
  },
  (error) => {
    if (error.response?.status === 429) {
      const retryAfter = error.response.data.retryAfter || 60;
      notifications.show({
        title: 'Rate Limit Exceeded',
        message: `Too many requests. Please try again in ${Math.ceil(retryAfter)} seconds.`,
        color: 'red',
      });
    }
    return Promise.reject(error);
  }
);

// Subscribe to a popup
export const subscribe = async (popupId, email) => {
  try {
    const response = await api.post(`/api/subscribe/${popupId}`, { email });
    return response.data;
  } catch (error) {
    console.error('Error subscribing:', error);
    throw error;
  }
};

// Get all popups for the current user
export const getPopups = async (token) => {
  try {
    const response = await api.get('/api/popups', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Get popups response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching popups:', error);
    throw new Error('Failed to fetch popups');
  }
};

// Create a new popup
export const createPopup = async (token, popupData) => {
  try {
    console.log('Creating popup:', popupData);
    const response = await api.post('/api/popups', popupData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Popup response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating popup:', error.response?.data || error.message);
    throw error;
  }
};

// Delete a popup
export const deletePopup = async (token, popupId) => {
  try {
    console.log('Deleting popup:', popupId);
    const response = await api.delete(`/api/popups/${popupId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log('Delete response:', response.data);
    
    if (!response.data || response.data.status === 'error') {
      throw new Error(response.data?.message || 'Failed to delete popup');
    }
    
    return response.data;
  } catch (error) {
    console.error('Delete popup error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (error.response?.status === 404) {
      throw new Error('Popup not found');
    }
    
    throw new Error(error.response?.data?.message || error.message || 'Failed to delete popup');
  }
};

// Update a popup
export const updatePopup = async (token, popupId, popupData) => {
  try {
    console.log('Making update request to:', `${API_URL}/api/popups/${popupId}`);
    console.log('Update data:', JSON.stringify(popupData, null, 2));
    
    const response = await api.put(`/api/popups/${popupId}`, popupData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    
    console.log('Server response:', response.data);
    
    if (!response.data || response.data.status === 'error') {
      throw new Error(response.data?.message || 'Failed to update popup');
    }
    
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Server error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      throw new Error(error.response.data?.message || `Server error: ${error.response.status}`);
    } else if (error.request) {
      console.error('No response received:', error.request);
      throw new Error('No response received from server');
    } else {
      console.error('Request setup error:', error.message);
      throw error;
    }
  }
};

// Get popup embed code
export const getPopupCode = async (token, popupId) => {
  try {
    const response = await api.get(`/api/popups/${popupId}/code`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting popup code:', error.response?.data || error.message);
    throw error;
  }
};

// Get subscribers for user's popups
export const getSubscribers = async (token) => {
  try {
    const response = await api.get('/api/subscribers/user/popups', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting subscribers:', error.response?.data || error.message);
    throw error;
  }
};

export default api;
