const SearchInput = ({ value, onChange, onFocus, placeholder = 'Search…', ariaLabel }) => {
  return (
    <div className="relative">
      <svg
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M21 21l-4.3-4.3M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <input
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        aria-label={ariaLabel || 'Search'}
        className="mono-input pl-9"
        placeholder={placeholder}
        type="search"
        autoComplete="off"
      />
    </div>
  );
};

export default SearchInput;