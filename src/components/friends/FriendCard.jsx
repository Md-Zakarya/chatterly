import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

/**
 * Reusable FriendCard component
 * Displays friend/user information with avatar, name, and action buttons
 * @param {Object} user - User object with id, displayName, username, isOnline
 * @param {Function} onAction - Callback for primary action
 * @param {Function} onSecondaryAction - Callback for secondary action (optional)
 * @param {string} actionLabel - Label for primary action button
 * @param {string} secondaryActionLabel - Label for secondary action button (optional)
 * @param {boolean} loading - Loading state for buttons
 * @param {string} actionVariant - Button variant for primary action (default: 'primary')
 */
const FriendCard = ({
  user,
  onAction,
  onSecondaryAction,
  actionLabel,
  secondaryActionLabel,
  loading = false,
  actionVariant = 'primary',
  disabled = false,
}) => {
  if (!user) return null;

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
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onSecondaryAction && secondaryActionLabel && (
          <Button
            variant="secondary"
            onClick={() => onSecondaryAction(user)}
            disabled={loading || disabled}
            className="text-xs px-3 py-1.5"
          >
            {secondaryActionLabel}
          </Button>
        )}
        {actionLabel && (
          <Button
            variant={actionVariant}
            onClick={onAction ? () => onAction(user) : undefined}
            disabled={loading || disabled || !onAction}
            className="text-xs px-3 py-1.5"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FriendCard;
