import { useState, useEffect } from 'react';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import TaskForm from './TaskForm';
import { formatDueDate } from '../../utils/dateHelpers';
import { PRIORITY_CONFIG } from '../../utils/priorityHelpers';
import { Play, Pause, Clock } from 'lucide-react';

export default function TaskCard({ task, onEdit, onDelete, onStartTimer, onStopTimer, style }) {
  const [showEdit, setShowEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const due = formatDueDate(task.dueDate);
  const pri = PRIORITY_CONFIG[task.priority];
  const isDone = task.status === 'done';

  // Update current time display for running timer
  useEffect(() => {
    let interval;

    if (task.isTimerRunning && task.timerStartedAt) {
      const updateLiveTime = () => {
        const elapsed = Math.floor(
          (Date.now() - new Date(task.timerStartedAt).getTime()) / 1000
        );

        setCurrentTime((task.timeSpent || 0) + elapsed);
      };

      updateLiveTime();
      interval = setInterval(updateLiveTime, 1000);
    } else {
      setCurrentTime(task.timeSpent || 0);
    }

    return () => clearInterval(interval);
  }, [task.isTimerRunning, task.timerStartedAt, task.timeSpent]);

  const formatTime = (seconds = 0) => {
    const safeSeconds = Math.max(0, Math.floor(seconds));
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const remainingSeconds = safeSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }

    return `${remainingSeconds}s`;
  };

  const handleStatusToggle = async () => {
    const next = isDone ? 'pending' : 'done';
    await onEdit(task._id, { status: next });
  };

  const handleTimerToggle = async () => {
    if (task.isTimerRunning) {
      await onStopTimer(task._id);
    } else {
      await onStartTimer(task._id);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return;

    setDeleting(true);

    try {
      await onDelete(task._id);
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async (data) => {
    setSaving(true);

    try {
      await onEdit(task._id, data);
      setShowEdit(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div
        className={`flex items-center gap-3 px-5 py-4 transition-colors duration-100 group cursor-default animate-rise ${isDone ? 'opacity-40' : ''}`}
        style={style}
      >
        {/* Checkbox */}
        <button
          onClick={handleStatusToggle}
          className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
            isDone
              ? 'bg-[var(--accent)] border-[var(--accent)]'
              : task.priority === 'high'   ? 'border-[var(--high)] hover:border-[var(--accent)]'
              : task.priority === 'medium' ? 'border-[var(--med)] hover:border-[var(--accent)]'
              : 'border-[var(--low)] hover:border-[var(--accent)]'
          }`}
        >
          {isDone && (
            <svg viewBox="0 0 12 10" fill="none" className="w-3 h-3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 5l3.5 3.5L11 1"/>
            </svg>
          )}
        </button>

        {/* Body */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold text-[var(--text)] truncate mb-1 ${isDone ? 'line-through' : ''}`}>
            {task.title}
          </p>

          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant={due.cls || 'default'}>{due.label}</Badge>
            <Badge variant={task.priority}>{pri.label}</Badge>

            {task.category && task.category !== 'General' && (
              <Badge variant="accent">{task.category}</Badge>
            )}

            {currentTime > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(currentTime)}
              </Badge>
            )}
          </div>
        </div>

        {/* Timer Button */}
        {!isDone && (
          <button
            onClick={handleTimerToggle}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              task.isTimerRunning
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
            title={task.isTimerRunning ? 'Stop Timer' : 'Start Timer'}
          >
            {task.isTimerRunning ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Actions — visible on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setShowEdit(true)}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--accent-2)] text-[var(--text-3)] hover:text-[var(--accent)] transition-colors"
            title="Edit"
          >
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-3.5 h-3.5">
              <path d="M9.5 2.5l2 2M2 10l.5 1.5L4 11l7-7-2-2-7 7z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--high-bg)] text-[var(--text-3)] hover:text-[var(--high)] transition-colors"
            title="Delete"
          >
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-3.5 h-3.5">
              <path d="M2 3.5h10M5.5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M5.5 6v4.5M8.5 6v4.5M3 3.5l.7 8a.5.5 0 00.5.5h5.6a.5.5 0 00.5-.5l.7-8"/>
            </svg>
          </button>
        </div>
      </div>

      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Edit Task">
        <TaskForm initial={task} onSubmit={handleSave} onCancel={() => setShowEdit(false)} loading={saving} />
      </Modal>
    </>
  );
}