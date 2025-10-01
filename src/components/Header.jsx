import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Button from './ui/Button';
import Avatar from './ui/Avatar';
import UserSearch from './search/UserSearch';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/home" className="flex items-center gap-2">
            <span
              aria-hidden
              className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-white/5 text-lg"
            >
              💬
            </span>
            <span className="font-display text-xl font-bold tracking-tight">
              Chatterly
            </span>
          </Link>

          {/* Search (desktop) */}
          {user && (
            <UserSearch 
              className="hidden w-full max-w-md md:block"
              placeholder="Search users to add as friends…"
            />
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button
                  variant="secondary"
                  onClick={() => navigate('/friends')}
                  aria-label="View friends and requests"
                >
                  Friends
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate('/home')}
                  aria-label="Start a new chat"
                >
                  New Chat
                </Button>
                <div className="flex items-center gap-3">
                  <Avatar
                    name={user.displayName || user.username}
                    size="md"
                    status="online"
                  />
                  <Button variant="ghost" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button as={Link} to="/login">
                  Sign in
                </Button>
                <Button as={Link} to="/register" variant="secondary">
                  Create account
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Search (mobile) */}
        {user && (
          <UserSearch 
            className="pb-3 md:hidden"
            placeholder="Search users to add as friends…"
          />
        )}
      </div>
    </header>
  );
};

export default Header;