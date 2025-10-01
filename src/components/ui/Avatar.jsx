const SIZES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
};

function initialsFromName(name = '') {
  const parts = String(name).trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p[0]?.toUpperCase() || '').join('');
}

/**
 * Reusable Avatar
 * - Shows image or initials
 * - Optional status dot: 'online' | 'offline' | undefined
 */
const Avatar = ({ src, name, size = 'md', status }) => {
  const sizeCls = SIZES[size] || SIZES.md;
  const initials = initialsFromName(name);

  return (
    <div className="relative inline-flex">
      <div
        className={`flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] ${sizeCls}`}
        title={name}
        aria-label={name}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <span className="font-mono text-[var(--subtle)]">{initials}</span>
        )}
      </div>

      {status && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[var(--card)] ${
            status === 'online' ? 'bg-emerald-400' : 'bg-zinc-500'
          }`}
          aria-label={status}
          title={status}
        />
      )}
    </div>
  );
};

export default Avatar;