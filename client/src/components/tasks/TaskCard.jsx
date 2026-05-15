import { useState, useEffect } from 'react';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import TaskForm from './TaskForm';
import { formatDueDate } from '../../utils/dateHelpers';
import { PRIORITY_CONFIG } from '../../utils/priorityHelpers';
import { Play, Pause, Clock, AlertTriangle } from 'lucide-react';

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStartTimer,
  onStopTimer,
  style,
}) {
  const [showEdit, setShowEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const due = formatDueDate(task.dueDate);
  const pri = PRIORITY_CONFIG[task.priority];
  const isDone = task.status === 'done';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(task.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  const isOverdue = !isDone && dueDate < today;

  // Update current time display for running timer
  useEffect(() => {
    let interval;

    if (task.isTimerRunning && task.timerStartedAt) {
      interval = setInterval(() => {
        const elapsed = Math.floor(
          (Date.now() - new Date(task.timerStartedAt).getTime()) / 1000
        );
        setCurrentTime(task.timeSpent + elapsed);
      }, 1000);
    } else {
      setCurrentTime(task.timeSpent);
    }

    return () => clearInterval(interval);
  }, [task.isTimerRunning, task.timerStartedAt, task.timeSpent]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
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
        className={`group flex cursor-default items-center gap-3 px-5 py-4 transition-colors duration-100 animate-rise ${
          isDone ? 'opacity-40' : ''
        } ${
          isOverdue
            ? 'border-l-4 border-red-500 bg-red-50/70 dark:bg-red-950/20'
            : ''
        }`}
        style={style}
      >
        {/* Checkbox */}
        <button
          onClick={handleStatusToggle}
          className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
            isDone
              ? 'border-[var(--accent)] bg-[var(--accent)]'
              : isOverdue
                ? 'border-red-500 hover:border-red-600'
                : task.priority === 'high'
                  ? 'border-[var(--high)] hover:border-[var(--accent)]'
                  : task.priority === 'medium'
                    ? 'border-[var(--med)] hover:border-[var(--accent)]'
                    : 'border-[var(--low)] hover:border-[var(--accent)]'
          }`}
          title={isDone ? 'Mark as pending' : 'Mark as completed'}
        >
          {isDone && (
            <svg
              viewBox="0 0 12 10"
              fill="none"
              className="h-3 w-3"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 5l3.5 3.5L11 1" />
            </svg>
          )}
        </button>

        {/* Body */}
        <div className="min-w-0 flex-1">
          <p
            className={`mb-1 truncate text-sm font-semibold ${
              isOverdue
                ? 'text-red-700 dark:text-red-300'
                : 'text-[var(--text)]'
            } ${isDone ? 'line-through' : ''}`}
          >
            {task.title}
          </p>

          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant={isOverdue ? 'high' : due.cls || 'default'}>
              {isOverdue ? (
                <span className="inline-flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Overdue
                </span>
              ) : (
                due.label
              )}
            </Badge>

            <Badge variant={task.priority}>{pri.label}</Badge>

            {task.category && task.category !== 'General' && (
              <Badge variant="accent">{task.category}</Badge>
            )}

            {currentTime > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(currentTime)}
              </Badge>
            )}
          </div>
        </div>

        {/* Timer Button */}
        {!isDone && (
          <button
            onClick={handleTimerToggle}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-white transition-all ${
              task.isTimerRunning
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            }`}
            title={task.isTimerRunning ? 'Stop Timer' : 'Start Timer'}
          >
            {task.isTimerRunning ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>
        )}

        {/* Actions — visible on hover */}
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => setShowEdit(true)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-3)] transition-colors hover:bg-[var(--accent-2)] hover:text-[var(--accent)]"
            title="Edit"
          >
            <svg
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-3.5 w-3.5"
            >
              <path
                d="M9.5 2.5l2 2M2 10l.5 1.5L4 11l7-7-2-2-7 7z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-3)] transition-colors hover:bg-[var(--high-bg)] hover:text-[var(--high)] disabled:opacity-60"
            title="Delete"
          >
            <svg
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              className="h-3.5 w-3.5"
            >
              <path d="M2 3.5h10M5.5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M5.5 6v4.5M8.5 6v4.5M3 3.5l.7 8a.5.5 0 00.5.5h5.6a.5.5 0 00.5-.5l.7-8" />
            </svg>
          </button>
        </div>
      </div>

      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Edit Task">
        <TaskForm
          initial={task}
          onSubmit={handleSave}
          onCancel={() => setShowEdit(false)}
          loading={saving}
        />
      </Modal>
    </>
  );
}