import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import { requestNotificationPermission, setupTaskReminders, clearReminders } from '../utils/notifications';
import { Clock, Bell, TrendingUp } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

ChartJS.register(ArcElement, Tooltip, Legend);

function StatTile({ icon, num, label, color }) {
  return (
    <div className="card p-4 flex flex-col gap-2 hover:-translate-y-1 hover:shadow-card-lg transition-all duration-150 cursor-default">
      <div className={`w-9 h-9 rounded-xl grid place-items-center text-lg`} style={{ background: color + '22' }}>
        {icon}
      </div>
      <div className="text-3xl font-extrabold text-[var(--text)] leading-none tracking-tight">{num ?? '—'}</div>
      <div className="text-xs font-semibold text-[var(--text-2)]">{label}</div>
    </div>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="w-full h-2 bg-[var(--surface-2)] rounded-full overflow-hidden">
      <div
        className="h-full bg-[var(--accent)] rounded-full transition-all duration-700"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks, stats, timeStats, loading } = useTasks();
  const [notificationGranted, setNotificationGranted] = useState(false);
  const [reminderTimers, setReminderTimers] = useState([]);

  // Setup notifications on mount
  useEffect(() => {
    const setupNotifications = async () => {
      const granted = await requestNotificationPermission();
      setNotificationGranted(granted);

      if (granted && tasks.length > 0) {
        const timers = setupTaskReminders(tasks);
        setReminderTimers(timers);
      }
    };

    setupNotifications();

    // Cleanup timers on unmount
    return () => {
      clearReminders(reminderTimers);
    };
  }, [tasks]);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationGranted(granted);
    if (granted) {
      const timers = setupTaskReminders(tasks);
      setReminderTimers(timers);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const upcoming = tasks
    .filter((t) => t.status !== 'done')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[var(--text)] tracking-tight">
          Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-[var(--text-2)] mt-1">
          Here's what's on your plate today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatTile icon="📋" num={stats?.total}        label="All Tasks"   color="#7c6af7"/>
        <StatTile icon="✅" num={stats?.done}         label="Completed"   color="#34c759"/>
        <StatTile icon="⏳" num={stats?.pending}      label="Pending"     color="#ff9500"/>
        <StatTile icon="🔴" num={stats?.highPriority} label="Urgent"      color="#ff3b30"/>
      </div>

      {/* Completion rate */}
      {stats && (
        <div className="card p-5 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-[var(--text)]">Overall Progress</span>
            <span className="text-sm font-extrabold text-[var(--accent)]">{stats.completionRate}%</span>
          </div>
          <ProgressBar value={stats.completionRate} />
          <p className="text-xs text-[var(--text-3)] mt-2 font-medium">
            {stats.done} of {stats.total} tasks completed
            {stats.overdue > 0 && ` · ${stats.overdue} overdue`}
          </p>
        </div>
      )}

      {/* Task Status Chart */}
      {stats && stats.total > 0 && (
        <div className="card p-5 mb-6">
          <h3 className="text-sm font-bold text-[var(--text)] mb-4">Task Distribution</h3>
          <div className="w-full max-w-xs mx-auto">
            <Doughnut
              data={{
                labels: ['Done', 'Pending', 'In Progress'],
                datasets: [{
                  data: [stats.done, stats.pending, stats.inProgress || 0],
                  backgroundColor: ['#34c759', '#ff9500', '#007aff'],
                  borderWidth: 0,
                }],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      usePointStyle: true,
                      padding: 20,
                      font: { size: 12 },
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.label}: ${context.parsed}`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Time Analytics */}
      {timeStats && timeStats.totalTime > 0 && (
        <div className="card p-5 mb-6">
          <h3 className="text-sm font-bold text-[var(--text)] mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Time Analytics (This Week)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--text)]">{formatTime(timeStats.totalTime)}</div>
              <div className="text-xs text-[var(--text-3)]">Total Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--text)]">{timeStats.totalTasks}</div>
              <div className="text-xs text-[var(--text-3)]">Tasks Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--text)]">{formatTime(timeStats.averageSession)}</div>
              <div className="text-xs text-[var(--text-3)]">Avg Session</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--text)]">
                {timeStats.totalTasks > 0 ? Math.round(timeStats.totalTime / timeStats.totalTasks / 60) : 0}m
              </div>
              <div className="text-xs text-[var(--text-3)]">Per Task</div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Setup */}
      {!notificationGranted && (
        <div className="card p-5 mb-6 border-2 border-dashed border-[var(--accent)] bg-[var(--accent-2)]">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-[var(--accent)]" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-[var(--text)]">Enable Notifications</h3>
              <p className="text-xs text-[var(--text-2)] mt-1">
                Get reminded about upcoming tasks and stay on track with your productivity goals.
              </p>
            </div>
            <Button onClick={handleEnableNotifications} size="sm">
              Enable
            </Button>
          </div>
        </div>
      )}

      {/* Upcoming tasks */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-sm font-bold text-[var(--text)]">Upcoming Tasks</h2>
          <Link to="/tasks">
            <Button variant="ghost" size="sm">View all</Button>
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-[var(--text-3)] font-medium">Loading…</div>
        ) : upcoming.length === 0 ? (
          <div className="py-12 text-center">
            <span className="text-3xl block mb-2">🎉</span>
            <p className="text-sm font-semibold text-[var(--text-2)]">All caught up!</p>
            <Link to="/tasks" className="text-xs text-[var(--accent)] font-bold mt-1 block hover:underline">Add a task</Link>
          </div>
        ) : (
          upcoming.map((t, i) => {
            const due = new Date(t.dueDate);
            const isOverdue = due < new Date() && t.status !== 'done';
            return (
              <div
                key={t._id}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-[var(--surface-2)] transition-colors border-t border-[var(--border)] first:border-t-0 animate-rise"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  t.priority === 'high' ? 'bg-[var(--high)]' :
                  t.priority === 'medium' ? 'bg-[var(--med)]' : 'bg-[var(--low)]'
                }`}/>
                <span className="flex-1 text-sm font-semibold text-[var(--text)] truncate">{t.title}</span>
                <span className={`text-xs font-bold ${isOverdue ? 'text-[var(--high)]' : 'text-[var(--text-3)]'}`}>
                  {due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
