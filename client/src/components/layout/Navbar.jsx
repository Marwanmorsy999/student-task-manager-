import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLink = (to, label) => {
    const active = pathname === to;
    return (
      <Link
        to={to}
        className={`text-sm font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 ${
          active
            ? 'bg-[var(--accent-2)] text-[var(--accent)]'
            : 'text-[var(--text-2)] hover:bg-[var(--accent-2)] hover:text-[var(--accent)]'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header
      className="sticky top-0 z-40 border-b border-[var(--border)]"
      style={{ background: 'var(--header-bg)', backdropFilter: 'blur(20px)' }}
    >
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-extrabold text-base tracking-tight text-[var(--text)]">
          <div className="w-7 h-7 rounded-lg bg-[var(--accent)] grid place-items-center text-white text-sm">✦</div>
          TaskFlow
        </Link>

        {/* Nav + controls */}
        <div className="flex items-center gap-2">
          {user && (
            <nav className="flex gap-1 mr-2">
              {navLink('/dashboard', 'Dashboard')}
              {navLink('/tasks', 'Tasks')}
              {navLink('/calendar', 'Calendar')}
              {navLink('/pomodoro', 'Pomodoro')}
            </nav>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="w-10 h-6 rounded-full relative transition-colors duration-300 flex-shrink-0"
            style={{ background: dark ? 'var(--accent)' : 'var(--border)' }}
            aria-label="Toggle dark mode"
          >
            <span
              className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-250"
              style={{ transform: dark ? 'translateX(16px)' : 'none' }}
            />
          </button>

          {user ? (
            <div className="flex items-center gap-2 ml-2">
              <span className="text-xs font-semibold text-[var(--text-2)] hidden sm:block">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-[var(--text-3)] hover:text-[var(--high)] transition-colors px-2 py-1"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2 ml-2">
              <Link to="/login" className="btn-ghost text-xs px-3 py-1.5">Login</Link>
              <Link to="/register" className="btn-primary text-xs px-3 py-1.5">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
