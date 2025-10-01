import Button from './Button';
import Avatar from './Avatar';

const SearchResults = ({
  results,
  isLoading,
  query,
  onSendFriendRequest,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg ${className}`}>
        <div className="p-4 text-center text-[var(--muted-foreground)]">
          Searching...
        </div>
      </div>
    );
  }

  if (results.length === 0 && query.trim().length >= 2) {
    return (
      <div className={`bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg ${className}`}>
        <div className="p-4 text-center text-[var(--muted-foreground)]">
          No users found
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className={`bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg max-h-80 overflow-y-auto ${className}`}>
      {results.map((user) => (
        <SearchResultItem
          key={user._id}
          user={user}
          onSendFriendRequest={onSendFriendRequest}
        />
      ))}
    </div>
  );
};

const SearchResultItem = ({ user, onSendFriendRequest }) => {
  const handleSendRequest = async () => {
    const result = await onSendFriendRequest(user._id);
    if (result.success) {
      // Could use a toast notification instead of alert
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 hover:bg-[var(--accent)] border-b border-[var(--border)] last:border-b-0">
      <div className="flex items-center gap-3">
        <Avatar
          name={user.displayName || user.username}
          src={user.avatar}
          size="sm"
          status={user.isOnline ? "online" : "offline"}
        />
        <div>
          <div className="font-medium">
            {user.displayName || user.username}
          </div>
          <div className="text-sm text-[var(--muted-foreground)]">
            @{user.username}
          </div>
        </div>
      </div>
      <Button
        size="sm"
        onClick={handleSendRequest}
        className="shrink-0"
      >
        Add Friend
      </Button>
    </div>
  );
};

export default SearchResults;