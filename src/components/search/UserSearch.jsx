import { useRef, useEffect } from 'react';
import SearchInput from '../ui/SearchInput';
import SearchResults from '../ui/SearchResults';
import { useSearchViewModel } from '../../viewModels/useSearchViewModel';

const UserSearch = ({ className = '', placeholder = "Search users to add as friends…" }) => {
  const searchRef = useRef(null);
  const {
    searchQuery,
    searchResults,
    isSearching,
    showResults,
    error,
    handleSearchChange,
    handleSendFriendRequest,
    handleSearchFocus,
    closeSearchResults,
  } = useSearchViewModel();

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        closeSearchResults();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeSearchResults]);

  const handleInputChange = (e) => {
    handleSearchChange(e.target.value);
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <SearchInput
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleInputChange}
        onFocus={handleSearchFocus}
        ariaLabel="Search users"
      />
      
      {showResults && (
        <SearchResults
          results={searchResults}
          isLoading={isSearching}
          query={searchQuery}
          onSendFriendRequest={handleSendFriendRequest}
          className="absolute top-full left-0 right-0 mt-1 z-50"
        />
      )}
      
      {error && (
        <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm z-50">
          {error}
        </div>
      )}
    </div>
  );
};

export default UserSearch;