import { useState, useEffect, useCallback } from 'react';
import { fetchTasks, fetchStats, fetchTimeStats, createTask, updateTask, deleteTask, startTimer, stopTimer } from '../api/tasks';

export function useTasks(filters = {}) {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [timeStats, setTimeStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, statsData, timeStatsData] = await Promise.all([
        fetchTasks(filters),
        fetchStats(),
        fetchTimeStats(),
      ]);
      setTasks(tasksData);
      setStats(statsData);
      setTimeStats(timeStatsData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { load(); }, [load]);

  const addTask = async (data) => {
    const task = await createTask(data);
    setTasks((prev) => [task, ...prev]);
    setStats((s) => s ? { ...s, total: s.total + 1, pending: s.pending + 1 } : s);
    return task;
  };

  const editTask = async (id, data) => {
    const updated = await updateTask(id, data);
    setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    return updated;
  };

  const removeTask = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
    load(); // refresh stats
  };

  const startTaskTimer = async (id) => {
    const result = await startTimer(id);
    setTasks((prev) => prev.map((t) =>
      t._id === id ? { ...t, isTimerRunning: true, timerStartedAt: new Date() } : t
    ));
    return result;
  };

  const stopTaskTimer = async (id) => {
    const result = await stopTimer(id);
    setTasks((prev) => prev.map((t) =>
      t._id === id ? {
        ...result.task,
        isTimerRunning: false,
        timerStartedAt: null
      } : t
    ));
    // Refresh time stats
    const timeStatsData = await fetchTimeStats();
    setTimeStats(timeStatsData);
    return result;
  };

  return {
    tasks,
    stats,
    timeStats,
    loading,
    error,
    addTask,
    editTask,
    removeTask,
    startTaskTimer,
    stopTaskTimer,
    refetch: load
  };
}
