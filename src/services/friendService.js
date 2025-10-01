import axiosInstance from '../api/axiosInstance';
import { ENDPOINTS } from '../api/endpoints';

export const searchUsers = async (query, userId) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.FRIENDS.SEARCH, {
      params: { query, userId }
    });
    
    if (response.data.success) {
      return response.data.users;
    } else {
      throw new Error(response.data.message || 'Failed to search users');
    }
  } catch (error) {
    console.error('searchUsers error:', error);
    throw new Error(error.response?.data?.message || error.message || 'Network error occurred');
  }
};

export const sendFriendRequest = async (fromUserId, toUserId) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.FRIENDS.REQUEST, {
      fromUserId,
      toUserId,
    });

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to send friend request');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Network error occurred');
  }
};

export const getFriends = async (userId) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.FRIENDS.GET_FRIENDS(userId));

    if (response.data.success) {
      return response.data.friends;
    } else {
      throw new Error(response.data.message || 'Failed to get friends');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Network error occurred');
  }
};

export const getFriendRequests = async (userId) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.FRIENDS.GET_REQUESTS_RECEIVED(userId));

    if (response.data.success) {
      return response.data.requests;
    } else {
      throw new Error(response.data.message || 'Failed to get friend requests');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Network error occurred');
  }
};

export const getSentFriendRequests = async (userId) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.FRIENDS.GET_REQUESTS_SENT(userId));

    if (response.data.success) {
      return response.data.requests;
    } else {
      throw new Error(response.data.message || 'Failed to get sent friend requests');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Network error occurred');
  }
};

export const removeFriend = async (userId, friendId) => {
  try {
    const response = await axiosInstance.delete(ENDPOINTS.FRIENDS.REMOVE_FRIEND(userId, friendId));

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to remove friend');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Network error occurred');
  }
};

export const respondToFriendRequest = async (requestId, action) => {
  try {
    const response = await axiosInstance.post(ENDPOINTS.FRIENDS.RESPOND, {
      requestId,
      action,
    });

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to respond to friend request');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Network error occurred');
  }
};

export const getFriendshipStatus = async (userId, targetUserId) => {
  try {
    const response = await axiosInstance.get(ENDPOINTS.FRIENDS.GET_STATUS(userId, targetUserId));

    if (response.data.success) {
      return response.data.status;
    } else {
      throw new Error(response.data.message || 'Failed to get friendship status');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Network error occurred');
  }
};

export const cancelFriendRequest = async (requestId) => {
  try {
    const response = await axiosInstance.delete(ENDPOINTS.FRIENDS.CANCEL_REQUEST(requestId));

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to cancel friend request');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Network error occurred');
  }
};