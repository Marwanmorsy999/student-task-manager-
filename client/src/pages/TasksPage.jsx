import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import FilterBar from '../components/tasks/FilterBar';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';

export default function TasksPage() {
  const [filters, setFilters] = useState({ status: 'all', priority: 'all', category: 'all', search: '' });
  const [showAdd, setShowAdd] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  // Build query params — omit 'all' values and blank search
  const query = {};
  if (filters.status   && filters.status   !== 'all') query.status   = filters.status;
  if (filters.priority && filters.priority !== 'all') query.priority = filters.priority;
  if (filters.category && filters.category !== 'all') query.category = filters.category;
  if (filters.search?.trim()) query.search = filters.search.trim();

  const { tasks, loading, error, addTask, editTask, removeTask, startTaskTimer, stopTaskTimer } = useTasks(query);

  const handleAdd = async (data) => {
    setAddLoading(true);
    try {
      await addTask(data);
      setShowAdd(false);
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text)] tracking-tight">My Tasks</h1>
          <p className="text-sm text-[var(--text-2)] mt-0.5">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="w-4 h-4">
            <path d="M7 1v12M1 7h12"/>
          </svg>
          Add Task
        </Button>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      {/* Task list */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-[var(--text-3)] font-medium">Loading tasks…</div>
        ) : error ? (
          <div className="py-16 text-center">
            <span className="text-3xl block mb-2">⚠️</span>
            <p className="text-sm font-semibold text-[var(--text-2)]">{error}</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-16 text-center">
            <span className="text-4xl block mb-3">🗒️</span>
            <p className="text-sm font-semibold text-[var(--text-2)]">No tasks found</p>
            <p className="text-xs text-[var(--text-3)] mt-1">
              {Object.values(query).some(Boolean) ? 'Try different filters' : 'Add a task to get started'}
            </p>
          </div>
        ) : (
          tasks.map((task, i) => (
            <div key={task._id} className={i > 0 ? 'border-t border-[var(--border)]' : ''}>
              <TaskCard
                task={task}
                onEdit={editTask}
                onDelete={removeTask}
                onStartTimer={startTaskTimer}
                onStopTimer={stopTaskTimer}
                style={{ animationDelay: `${i * 22}ms` }}
              />
            </div>
          ))
        )}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New Task">
        <TaskForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} loading={addLoading} />
      </Modal>
    </div>
  );
}
