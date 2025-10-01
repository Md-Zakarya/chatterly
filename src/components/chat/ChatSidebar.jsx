import SearchInput from '../ui/SearchInput';
import Button from '../ui/Button';
import UsersList from '../users/UsersList';

const ChatSidebar = ({
  users = [],
  query = '',
  onQueryChange = () => {},
  selectedUserId,
  onSelectUser = () => {},
  onStartNewChat,
}) => {
  return (
    <aside className="flex h-full w-full flex-col rounded-xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-sm">
      <div className="border-b border-[var(--border)] px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Conversations
            </h2>
            <p className="text-xs text-[var(--muted)]/80">
              {users.length} {users.length === 1 ? 'person' : 'people'} available
            </p>
          </div>
          {onStartNewChat && (
            <Button variant="secondary" onClick={onStartNewChat} aria-label="Start new chat">
              New chat
            </Button>
          )}
        </div>
        <div className="mt-4">
          <SearchInput
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search people or teams…"
            ariaLabel="Search conversations"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3">
        <UsersList
          users={users}
          query={query}
          onSelect={onSelectUser}
          selectedUserId={selectedUserId}
        />
      </div>
    </aside>
  );
};

export default ChatSidebar;
