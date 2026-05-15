import { useMemo } from 'react';
import { useTasks } from '../hooks/useTasks';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import {
  subDays,
  subWeeks,
  format,
  isSameDay,
  isSameWeek,
  startOfWeek,
  eachDayOfInterval,
  isBefore,
} from 'date-fns';
import { BarChart3, Activity, Flame } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function StatsPage() {
  const { tasks, loading } = useTasks();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Tasks Completed vs Overdue per week (Last 4 Weeks)
  const taskStatsData = useMemo(() => {
    const weeks = [3, 2, 1, 0].map((w) => startOfWeek(subWeeks(today, w)));
    
    const labels = weeks.map((w) => `Week of ${format(w, 'MMM d')}`);
    const completed = [0, 0, 0, 0];
    const overdue = [0, 0, 0, 0];

    tasks.forEach((task) => {
      const taskDueDate = new Date(task.dueDate);
      const taskUpdatedAt = new Date(task.updatedAt || task.createdAt);

      weeks.forEach((weekStart, idx) => {
        // Check if completed in this week
        if (task.status === 'done' && isSameWeek(taskUpdatedAt, weekStart)) {
          completed[idx]++;
        }
        // Check if due in this week and overdue
        if (
          task.status !== 'done' &&
          isSameWeek(taskDueDate, weekStart) &&
          isBefore(taskDueDate, today)
        ) {
          overdue[idx]++;
        }
      });
    });

    return {
      labels,
      datasets: [
        {
          label: 'Completed Tasks',
          data: completed,
          backgroundColor: 'rgba(34, 197, 94, 0.7)', // Green
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 1,
        },
        {
          label: 'Overdue Tasks',
          data: overdue,
          backgroundColor: 'rgba(239, 68, 68, 0.7)', // Red
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 1,
        },
      ],
    };
  }, [tasks, today]);

  // 2. Pomodoro Focus Hours (Last 7 Days)
  const pomodoroData = useMemo(() => {
    const days = [6, 5, 4, 3, 2, 1, 0].map((d) => subDays(today, d));
    const labels = days.map((d) => format(d, 'EEE'));
    const focusHours = [0, 0, 0, 0, 0, 0, 0];

    tasks.forEach((task) => {
      if (task.timeEntries && task.timeEntries.length > 0) {
        task.timeEntries.forEach((entry) => {
          const entryDate = new Date(entry.startTime);
          days.forEach((day, idx) => {
            if (isSameDay(entryDate, day)) {
              focusHours[idx] += entry.duration / 3600; // Convert seconds to hours
            }
          });
        });
      }
    });

    return {
      labels,
      datasets: [
        {
          label: 'Focus Time (Hours)',
          data: focusHours.map((h) => Number(h.toFixed(1))),
          borderColor: 'rgb(147, 51, 234)', // Purple
          backgroundColor: 'rgba(147, 51, 234, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.3,
        },
      ],
    };
  }, [tasks, today]);

  // 3. Activity Heatmap (Last 90 Days)
  const heatmapData = useMemo(() => {
    const startDate = subDays(today, 89);
    const dateInterval = eachDayOfInterval({ start: startDate, end: today });
    
    const activityMap = new Map();
    
    // Initialize map
    dateInterval.forEach((date) => {
      activityMap.set(format(date, 'yyyy-MM-dd'), 0);
    });

    tasks.forEach((task) => {
      // Activity from completing tasks
      if (task.status === 'done') {
        const doneDate = format(new Date(task.updatedAt || task.createdAt), 'yyyy-MM-dd');
        if (activityMap.has(doneDate)) {
          activityMap.set(doneDate, activityMap.get(doneDate) + 1);
        }
      }

      // Activity from pomodoros
      if (task.timeEntries) {
        task.timeEntries.forEach((entry) => {
          const entryDate = format(new Date(entry.startTime), 'yyyy-MM-dd');
          if (activityMap.has(entryDate)) {
            activityMap.set(entryDate, activityMap.get(entryDate) + 1);
          }
        });
      }
    });

    return dateInterval.map((date) => {
      const count = activityMap.get(format(date, 'yyyy-MM-dd'));
      let colorClass = 'bg-[var(--surface-2)] dark:bg-gray-800 border-[var(--border)]'; // Level 0
      if (count >= 1 && count <= 2) colorClass = 'bg-green-200 dark:bg-green-900 border-green-300 dark:border-green-800'; // Level 1
      if (count >= 3 && count <= 5) colorClass = 'bg-green-400 dark:bg-green-700 border-green-500 dark:border-green-600'; // Level 2
      if (count >= 6) colorClass = 'bg-green-600 dark:bg-green-500 border-green-700 dark:border-green-400'; // Level 3

      return {
        date: format(date, 'MMM d, yyyy'),
        count,
        colorClass,
      };
    });
  }, [tasks, today]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'var(--text-2)',
          font: { family: 'inherit', weight: 'bold' }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'var(--border)' },
        ticks: { color: 'var(--text-3)' }
      },
      y: {
        grid: { color: 'var(--border)' },
        ticks: { color: 'var(--text-3)' }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text)] tracking-tight flex items-center gap-3">
          <Activity className="w-8 h-8 text-[var(--accent)]" />
          Productivity Analytics
        </h1>
        <p className="text-[var(--text-2)] mt-2">
          Visualize your progress and stay motivated.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Task Stats Bar Chart */}
        <div className="card p-6 h-96 flex flex-col">
          <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Tasks (Last 4 Weeks)
          </h2>
          <div className="flex-1 relative w-full h-full">
            <Bar data={taskStatsData} options={chartOptions} />
          </div>
        </div>

        {/* Pomodoro Stats Line Chart */}
        <div className="card p-6 h-96 flex flex-col">
          <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-purple-500" />
            Focus Time (Last 7 Days)
          </h2>
          <div className="flex-1 relative w-full h-full">
            <Line data={pomodoroData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-green-500" />
          Activity Heatmap (Last 90 Days)
        </h2>
        
        <div className="overflow-x-auto pb-4">
          <div className="min-w-max flex gap-1 items-end">
            {/* Split the 90 days into columns of 7 (weeks) roughly */}
            {Array.from({ length: Math.ceil(heatmapData.length / 7) }).map((_, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-1">
                {heatmapData.slice(colIdx * 7, (colIdx + 1) * 7).map((day, idx) => (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-sm border ${day.colorClass}`}
                    title={`${day.count} activities on ${day.date}`}
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-[var(--text-3)]">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-[var(--surface-2)] dark:bg-gray-800 border border-[var(--border)]"></div>
          <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900 border border-green-300 dark:border-green-800"></div>
          <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700 border border-green-500 dark:border-green-600"></div>
          <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500 border border-green-700 dark:border-green-400"></div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
