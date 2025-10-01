import { useState } from 'react';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

/**
 * FriendRequestCard component
 * Displays incoming or outgoing friend request with appropriate actions
 * @param {Object} request - Request object with id, status, timestamp
 * @param {Object} user - User object (fromUser for incoming, toUser for outgoing)
 * @param {string} type - 'incoming' or 'outgoing'
 * @param {Function} onAccept - Callback for accepting request (incoming only)
 * @param {Function} onReject - Callback for rejecting request (incoming only)
 * @param {Function} onCancel - Callback for canceling request (outgoing only)
 */
const FriendRequestCard = ({
  request,
  user,
  type = 'incoming',
  onAccept,
  onReject,
  onCancel,
  loading: externalLoading = false,
}) => {
  const [internalLoading, setInternalLoading] = useState(false);
  const loading = externalLoading || internalLoading;

  if (!request || !user) return null;

  const handleAccept = async () => {
    setInternalLoading(true);
    try {
      await onAccept?.(request);
    } finally {
      setInternalLoading(false);
    }
  };

  const handleReject = async () => {
    setInternalLoading(true);
    try {
      await onReject?.(request);
    } finally {
      setInternalLoading(false);
    }
  };

  const handleCancel = async () => {
    setInternalLoading(true);
    try {
      await onCancel?.(request);
    } finally {
      setInternalLoading(false);
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 transition hover:border-white/20">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar
          src={user.avatar}
          name={user.displayName}
          size="md"
          status={user.isOnline ? 'online' : 'offline'}
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[var(--fg)] truncate">
            {user.displayName}
          </h3>
          <p className="text-xs text-[var(--muted)] truncate">
            @{user.username}
          </p>
          {request.timestamp && (
            <p className="text-xs text-[var(--muted)] mt-0.5">
              {formatTime(request.timestamp)}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {type === 'incoming' ? (
          <>
            <Button
              variant="secondary"
              onClick={handleReject}
              disabled={loading}
              className="text-xs px-3 py-1.5"
            >
              Decline
            </Button>
            <Button
              variant="primary"
              onClick={handleAccept}
              disabled={loading}
              className="text-xs px-3 py-1.5"
            >
              Accept
            </Button>
          </>
        ) : (
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={loading}
            className="text-xs px-3 py-1.5"
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default FriendRequestCard;
