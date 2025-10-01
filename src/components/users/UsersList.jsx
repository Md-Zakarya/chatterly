import { useMemo } from 'react';
import Avatar from '../ui/Avatar';

function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

const UsersList = ({
  users = [],
  query = '',
  onSelect,
  selectedUserId,
  emptyState = 'No users found',
  renderTrailing,
}) => {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      `${u.displayName} ${u.username}`.toLowerCase().includes(q)
    );
  }, [users, query]);

  return (
    <div className="space-y-2">
      {filtered.length === 0 ? (
        <div className="rounded-md border border-[var(--border)] bg-transparent p-4 text-sm text-[var(--muted)]">
          {emptyState}
        </div>
      ) : (
        <ul role="list" className="space-y-1">
          {filtered.map((u) => {
            const isSelected = selectedUserId === u.id;
            const Wrapper = onSelect ? 'button' : 'div';
            const wrapperProps = onSelect
              ? {
                  type: 'button',
                  onClick: () => onSelect(u),
                }
              : {};

            return (
              <li key={u.id}>
                <Wrapper
                  {...wrapperProps}
                  className={cx(
                    'group flex w-full items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-2 text-left transition hover:border-white/10 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20',
                    isSelected && 'border-white/20 bg-white/10'
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar
                      name={u.displayName}
                      status={u.isOnline ? 'online' : 'offline'}
                      size="md"
                    />
                    <div className="min-w-0 text-left">
                      <p className="truncate text-sm font-medium text-white">
                        {u.displayName}
                      </p>
                      <p className="truncate text-xs text-[var(--muted)]">
                        @{u.username}
                      </p>
                    </div>
                  </div>
                  {renderTrailing ? (
                    renderTrailing(u, { isSelected })
                  ) : (
                    <span
                      className={cx(
                        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs transition',
                        u.isOnline
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                          : 'border-zinc-500/40 bg-zinc-500/10 text-zinc-300'
                      )}
                      aria-label={u.isOnline ? 'online' : 'offline'}
                    >
                      {u.isOnline ? 'Online' : 'Offline'}
                    </span>
                  )}
                </Wrapper>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default UsersList;