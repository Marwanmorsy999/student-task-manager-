import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, AlertTriangle, CalendarClock, Flame, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTasks } from '../../hooks/useTasks';

function NotificationBell() {
  const { tasks } = useTasks();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const tomorrow = useMemo(() => {
    const date = new Date(today);
    date.setDate(date.getDate() + 1);
    return date;
  }, [today]);

  const notifications = useMemo(() => {
    const items = [];

    tasks.forEach((task) => {
      if (task.status === 'done') return;

      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        items.push({
          id: `overdue-${task._id}`,
          taskId: task._id,
          type: 'overdue',
          title: 'Overdue task',
          message: task.title,
          icon: AlertTriangle,
          priority: 1,
        });
      } else if (dueDate >= today && dueDate < tomorrow) {
        items.push({
          id: `today-${task._id}`,
          taskId: task._id,
          type: 'today',
          title: 'Task due today',
          message: task.title,
          icon: CalendarClock,
          priority: 2,
        });
      }

      if (task.priority === 'high') {
        items.push({
          id: `high-${task._id}`,
          taskId: task._id,
          type: 'high',
          title: 'High priority task',
          message: task.title,
          icon: Flame,
          priority: 3,
        });
      }
    });

    return items.sort((a, b) => a.priority - b.priority).slice(0, 8);
  }, [tasks, today, tomorrow]);

  const unreadCount = notifications.length;

  const requestBrowserPermission = async () => {
    if (typeof Notification === 'undefined') {
      setPermission('unsupported');
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
  };

  useEffect(() => {
    if (typeof Notification === 'undefined') return;
    if (permission !== 'granted') return;
    if (notifications.length === 0) return;

    const todayKey = new Date().toISOString().slice(0, 10);
    const sentKey = `taskflow_browser_notifications_${todayKey}`;
    const sentIds = JSON.parse(localStorage.getItem(sentKey) || '[]');

    const newNotifications = notifications.filter(
      (item) => !sentIds.includes(item.id)
    );

    newNotifications.slice(0, 3).forEach((item) => {
      new Notification(`TaskFlow: ${item.title}`, {
        body: item.message,
        icon: '/vite.svg',
      });
    });

    if (newNotifications.length > 0) {
      localStorage.setItem(
        sentKey,
        JSON.stringify([...sentIds, ...newNotifications.map((item) => item.id)])
      );
    }
  }, [notifications, permission]);

  const handleNotificationClick = () => {
    setOpen(false);
    navigate('/tasks');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((current) => !current)}
        className="relative grid h-9 w-9 place-items-center rounded-xl text-[var(--text-2)] transition-colors hover:bg-[var(--accent-2)] hover:text-[var(--accent)]"
        aria-label="Open notifications"
      >
        <Bell className="h-5 w-5" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
            <div>
              <p className="text-sm font-black text-[var(--text)]">
                Notifications
              </p>
              <p className="text-xs text-[var(--text-3)]">
                {unreadCount} important update{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-[var(--text-3)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
              aria-label="Close notifications"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {permission !== 'granted' && permission !== 'unsupported' && (
            <div className="border-b border-[var(--border)] p-3">
              <button
                onClick={requestBrowserPermission}
                className="w-full rounded-xl bg-[var(--accent)] px-3 py-2 text-xs font-bold text-white transition hover:opacity-90"
              >
                Enable browser notifications
              </button>
            </div>
          )}

          {permission === 'unsupported' && (
            <div className="border-b border-[var(--border)] p-3">
              <p className="text-xs font-semibold text-[var(--text-3)]">
                Browser notifications are not supported in this browser.
              </p>
            </div>
          )}

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm font-bold text-[var(--text)]">
                  No urgent notifications
                </p>
                <p className="mt-1 text-xs text-[var(--text-3)]">
                  You are all caught up.
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={handleNotificationClick}
                    className="flex w-full gap-3 border-b border-[var(--border)] px-4 py-3 text-left transition hover:bg-[var(--surface-2)]"
                  >
                    <div
                      className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl ${
                        item.type === 'overdue'
                          ? 'bg-red-100 text-red-600'
                          : item.type === 'today'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-orange-100 text-orange-600'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[var(--text)]">
                        {item.title}
                      </p>
                      <p className="truncate text-xs text-[var(--text-3)]">
                        {item.message}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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

          {user && <NotificationBell />}

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