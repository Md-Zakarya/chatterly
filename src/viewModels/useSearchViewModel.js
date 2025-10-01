import { useState, useEffect, useCallback, useRef } from 'react';
import { searchUsers, sendFriendRequest } from '../services/friendService';
import { useAuth } from '../contexts/AuthContext';

export const useSearchViewModel = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);
  
  // Cache for search results
  const searchCache = useRef(new Map());
  const abortControllerRef = useRef(null);

  // Search users with debouncing and caching
  const performSearch = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      setError(null);
      return;
    }

    // Check cache first
    const cacheKey = `${query.toLowerCase()}-${user._id || user.id}`;
    if (searchCache.current.has(cacheKey)) {
      console.log('Using cached results for:', query);
      const cachedResults = searchCache.current.get(cacheKey);
      setSearchResults(cachedResults);
      setShowResults(true);
      return;
    }

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsSearching(true);
    setError(null);

    try {
      const users = await searchUsers(query, user._id || user.id);
      
      // Cache the results (max 50 entries)
      if (searchCache.current.size > 50) {
        const firstKey = searchCache.current.keys().next().value;
        searchCache.current.delete(firstKey);
      }
      searchCache.current.set(cacheKey, users);
      
      setSearchResults(users);
      setShowResults(true);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
        setSearchResults([]);
      }
    } finally {
      setIsSearching(false);
    }
  }, [user?._id, user?.id]);

  // Handle search input change
  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  // Send friend request
  const handleSendFriendRequest = useCallback(async (toUserId) => {
    try {
      await sendFriendRequest(user._id || user.id, toUserId);
      // Remove user from search results after sending request
      setSearchResults(prev => prev.filter(u => u._id !== toUserId));
      return { success: true, message: 'Friend request sent successfully!' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [user?._id, user?.id]);

  // Handle search focus
  const handleSearchFocus = useCallback(() => {
    if (searchResults.length > 0) {
      setShowResults(true);
    }
  }, [searchResults.length]);

  // Close search results
  const closeSearchResults = useCallback(() => {
    setShowResults(false);
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    setError(null);
  }, []);

  // Optimized debounced search effect
  useEffect(() => {
    if (!user?._id && !user?.id) {
      return;
    }
    
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 300); // Reduced debounce time for better UX

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchQuery, performSearch, user?._id, user?.id]);

  return {
    // State
    searchQuery,
    searchResults,
    isSearching,
    showResults,
    error,
    
    // Actions
    handleSearchChange,
    handleSendFriendRequest,
    handleSearchFocus,
    closeSearchResults,
    clearSearch,
  };
};