import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getFriends,
  getFriendRequests,
  getSentFriendRequests,
  removeFriend,
  respondToFriendRequest,
  searchUsers,
  sendFriendRequest,
  cancelFriendRequest,
} from '../services/friendService';

/**
 * useFriendsViewModel - MVVM ViewModel for Friends Page
 * Manages all business logic, state, and data operations for the Friends feature
 */
export const useFriendsViewModel = () => {
  const { user } = useAuth();

  // UI State
  const [activeTab, setActiveTab] = useState('friends');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // Track which action is loading

  // Data State
  const [friends, setFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load friends list
  const loadFriends = useCallback(async () => {
    if (!user?._id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getFriends(user._id);
      setFriends(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  // Load incoming requests
  const loadIncomingRequests = useCallback(async () => {
    if (!user?._id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getFriendRequests(user._id);
      // Transform data: map 'from' to 'fromUser' for consistency
      const transformed = (data || []).map(request => ({
        ...request,
        fromUser: request.from
      }));
      setIncomingRequests(transformed);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  // Load outgoing requests
  const loadOutgoingRequests = useCallback(async () => {
    if (!user?._id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getSentFriendRequests(user._id);
      // Transform data: map 'to' to 'toUser' for consistency
      const transformed = (data || []).map(request => ({
        ...request,
        toUser: request.to
      }));
      setOutgoingRequests(transformed);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  // Search users
  const handleSearch = useCallback(async (query) => {
    if (!user?._id) return;
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await searchUsers(query, user._id);
      setSearchResults(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  // Handle remove friend
  const handleRemoveFriend = useCallback(async (friend) => {
    if (!user?._id || !friend._id) return;

    if (!window.confirm(`Remove ${friend.displayName} from your friends?`)) {
      return;
    }

    setActionLoading(friend._id);
    try {
      await removeFriend(user._id, friend._id);
      await loadFriends();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  }, [user?._id, loadFriends]);

  // Handle accept friend request
  const handleAcceptRequest = useCallback(async (request) => {
    setActionLoading(request._id);
    try {
      await respondToFriendRequest(request._id, 'accept');
      await Promise.all([loadIncomingRequests(), loadFriends()]);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  }, [loadIncomingRequests, loadFriends]);

  // Handle reject friend request
  const handleRejectRequest = useCallback(async (request) => {
    setActionLoading(request._id);
    try {
      await respondToFriendRequest(request._id, 'reject');
      await loadIncomingRequests();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  }, [loadIncomingRequests]);

  // Handle cancel outgoing request
  const handleCancelRequest = useCallback(async (request) => {
    setActionLoading(request._id);
    try {
      await cancelFriendRequest(request._id);
      await loadOutgoingRequests();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  }, [loadOutgoingRequests]);

  // Handle send friend request
  const handleSendRequest = useCallback(async (targetUser) => {
    if (!user?._id || !targetUser._id) return;

    setActionLoading(targetUser._id);
    try {
      await sendFriendRequest(user._id, targetUser._id);
      setError(null);
      
      // Update the search results to reflect the new status
      setSearchResults(prev =>
        prev.map(u =>
          u._id === targetUser._id
            ? { ...u, friendshipStatus: 'pending' }
            : u
        )
      );
      
      // Optionally refresh the search to get updated status
      if (searchQuery) {
        setTimeout(() => handleSearch(searchQuery), 500);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  }, [user?._id, searchQuery, handleSearch]);

  // Load data based on active tab
  useEffect(() => {
    switch (activeTab) {
      case 'friends':
        loadFriends();
        break;
      case 'incoming':
        loadIncomingRequests();
        break;
      case 'outgoing':
        loadOutgoingRequests();
        break;
      default:
        break;
    }
  }, [activeTab, loadFriends, loadIncomingRequests, loadOutgoingRequests]);

  // Clear error after some time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    // State
    activeTab,
    loading,
    error,
    actionLoading,
    friends,
    incomingRequests,
    outgoingRequests,
    searchResults,
    searchQuery,
    
    // Actions
    setActiveTab,
    handleSearch,
    handleRemoveFriend,
    handleAcceptRequest,
    handleRejectRequest,
    handleCancelRequest,
    handleSendRequest,
    
    // Utilities
    isActionLoading: (id) => actionLoading === id,
  };
};
