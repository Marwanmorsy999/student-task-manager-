import { useState, useEffect, useRef } from 'react';
import { useTasks } from '../hooks/useTasks';
import { Play, Pause, RotateCcw, Timer, Target, CheckCircle, Clock } from 'lucide-react';

const STORAGE_KEY = 'taskflow_pomodoro_state';

const MODES = {
  focus: { name: 'Focus Session', duration: 25 * 60, color: 'bg-blue-500' },
  shortBreak: { name: 'Short Break', duration: 5 * 60, color: 'bg-green-500' },
  longBreak: { name: 'Long Break', duration: 15 * 60, color: 'bg-purple-500' },
};

const getInitialPomodoroState = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (!saved) {
      return {
        mode: 'focus',
        timeLeft: MODES.focus.duration,
        isRunning: false,
        completedSessions: 0,
        selectedTaskId: '',
        startedAt: null,
      };
    }

    let restoredTimeLeft = saved.timeLeft ?? MODES.focus.duration;

    if (saved.isRunning && saved.startedAt) {
      const elapsed = Math.floor((Date.now() - saved.startedAt) / 1000);
      restoredTimeLeft = Math.max(0, restoredTimeLeft - elapsed);
    }

    return {
      mode: saved.mode || 'focus',
      timeLeft: restoredTimeLeft,
      isRunning: Boolean(saved.isRunning && restoredTimeLeft > 0),
      completedSessions: saved.completedSessions || 0,
      selectedTaskId: saved.selectedTaskId || '',
      startedAt: saved.isRunning ? Date.now() : null,
    };
  } catch {
    return {
      mode: 'focus',
      timeLeft: MODES.focus.duration,
      isRunning: false,
      completedSessions: 0,
      selectedTaskId: '',
      startedAt: null,
    };
  }
};

export default function PomodoroPage() {
  const { tasks, startTaskTimer, stopTaskTimer } = useTasks();

  const initialState = getInitialPomodoroState();

  const [mode, setMode] = useState(initialState.mode);
  const [timeLeft, setTimeLeft] = useState(initialState.timeLeft);
  const [isRunning, setIsRunning] = useState(initialState.isRunning);
  const [completedSessions, setCompletedSessions] = useState(initialState.completedSessions);
  const [selectedTaskId, setSelectedTaskId] = useState(initialState.selectedTaskId);
  const [timerError, setTimerError] = useState('');

  const intervalRef = useRef(null);

  const currentMode = MODES[mode];
  const progress = ((currentMode.duration - timeLeft) / currentMode.duration) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const focusTasks = tasks.filter((task) => task.status !== 'done');
  const selectedTask = tasks.find((task) => task._id === selectedTaskId);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        mode,
        timeLeft,
        isRunning,
        completedSessions,
        selectedTaskId,
        startedAt: isRunning ? Date.now() : null,
      })
    );
  }, [mode, timeLeft, isRunning, completedSessions, selectedTaskId]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      handleTimerComplete();
    }
  }, [timeLeft, isRunning]);

  const stopSelectedTaskTimer = async () => {
    if (!selectedTaskId) return;

    const selected = tasks.find((task) => task._id === selectedTaskId);

    if (selected?.isTimerRunning) {
      await stopTaskTimer(selectedTaskId);
    }
  };

  const handleTimerComplete = async () => {
    setIsRunning(false);

    try {
      if (mode === 'focus') {
        await stopSelectedTaskTimer();

        const nextCompletedSessions = completedSessions + 1;
        setCompletedSessions(nextCompletedSessions);

        if (nextCompletedSessions % 4 === 0) {
          setMode('longBreak');
          setTimeLeft(MODES.longBreak.duration);
        } else {
          setMode('shortBreak');
          setTimeLeft(MODES.shortBreak.duration);
        }
      } else {
        setMode('focus');
        setTimeLeft(MODES.focus.duration);
      }
    } catch {
      setTimerError('Pomodoro finished, but task timer sync failed.');
    }
  };

  const startTimer = async () => {
    setTimerError('');

    try {
      if (mode === 'focus' && selectedTaskId && !selectedTask?.isTimerRunning) {
        await startTaskTimer(selectedTaskId);
      }

      setIsRunning(true);
    } catch {
      setTimerError('Could not start the selected task timer.');
    }
  };

  const pauseTimer = async () => {
    setTimerError('');

    try {
      if (mode === 'focus') {
        await stopSelectedTaskTimer();
      }

      setIsRunning(false);
    } catch {
      setTimerError('Could not pause the selected task timer.');
    }
  };

  const resetTimer = async () => {
    setTimerError('');

    try {
      if (mode === 'focus') {
        await stopSelectedTaskTimer();
      }

      setIsRunning(false);
      setTimeLeft(currentMode.duration);
    } catch {
      setTimerError('Could not reset the selected task timer.');
    }
  };

  const switchMode = async (newMode) => {
    setTimerError('');

    try {
      if (mode === 'focus') {
        await stopSelectedTaskTimer();
      }

      setIsRunning(false);
      setMode(newMode);
      setTimeLeft(MODES[newMode].duration);
    } catch {
      setTimerError('Could not switch Pomodoro mode safely.');
    }
  };

  const handleTaskChange = async (taskId) => {
    setTimerError('');

    try {
      if (isRunning && mode === 'focus') {
        await stopSelectedTaskTimer();

        if (taskId) {
          await startTaskTimer(taskId);
        }
      }

      setSelectedTaskId(taskId);
    } catch {
      setTimerError('Could not switch the focus task timer.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[var(--text)] tracking-tight flex items-center justify-center gap-3">
          <Timer className="w-8 h-8 text-[var(--accent)]" />
          Pomodoro Timer
        </h1>
        <p className="text-[var(--text-2)] mt-2">
          Boost your productivity with focused work sessions
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Timer Section */}
        <div className="lg:col-span-2">
          <div className="card p-8 text-center">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[var(--text)] mb-2">
                {currentMode.name}
              </h2>
              <p className="text-[var(--text-2)]">
                {mode === 'focus'
                  ? selectedTask
                    ? `Focus on: ${selectedTask.title}`
                    : 'Select a task or start a general focus session'
                  : 'Take a well-deserved break'}
              </p>

              {timerError && (
                <p className="mt-3 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
                  {timerError}
                </p>
              )}
            </div>

            {/* Circular Progress */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-[var(--border)]"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                  className={`${currentMode.color} transition-all duration-1000`}
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl font-bold text-[var(--text)]">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 mb-6">
              {!isRunning ? (
                <button
                  onClick={startTimer}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  <Play className="w-5 h-5" />
                  Start
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  <Pause className="w-5 h-5" />
                  Pause
                </button>
              )}

              <button
                onClick={resetTimer}
                className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="flex justify-center gap-2">
              {Object.entries(MODES).map(([key, m]) => (
                <button
                  key={key}
                  onClick={() => switchMode(key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    mode === key
                      ? `${m.color} text-white`
                      : 'bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--border)]'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Task Selection */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Focus Task
            </h3>

            <select
              value={selectedTaskId}
              onChange={(e) => handleTaskChange(e.target.value)}
              className="input-base w-full"
            >
              <option value="">General focus session</option>
              {focusTasks.map((task) => (
                <option key={task._id} value={task._id}>
                  {task.title} · {task.priority}
                </option>
              ))}
            </select>

            {focusTasks.length === 0 && (
              <p className="mt-3 text-sm text-[var(--text-3)]">
                No unfinished tasks available. Add a task first or reopen a completed task.
              </p>
            )}

            {selectedTask && (
              <div className="mt-4 p-3 bg-[var(--surface-2)] rounded-lg">
                <p className="text-sm font-medium text-[var(--text)]">
                  {selectedTask.title}
                </p>
                <p className="text-xs text-[var(--text-3)] mt-1">
                  Priority: {selectedTask.priority}
                </p>
                {selectedTask.category && (
                  <p className="text-xs text-[var(--text-3)] mt-1">
                    Category: {selectedTask.category}
                  </p>
                )}
                <p className="text-xs text-[var(--text-3)] mt-1">
                  Task timer: {selectedTask.isTimerRunning ? 'Running' : 'Stopped'}
                </p>
              </div>
            )}
          </div>

          {/* Progress Summary */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Today's Progress
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--text-2)]">Completed Sessions</span>
                <span className="font-bold text-[var(--text)]">{completedSessions}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--text-2)]">Available Focus Tasks</span>
                <span className="font-bold text-[var(--text)]">{focusTasks.length}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--text-2)]">Completed Tasks</span>
                <span className="font-bold text-[var(--text)]">
                  {tasks.filter((task) => task.status === 'done').length}
                </span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-[var(--text)] mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Pomodoro Tips
            </h3>

            <ul className="text-sm text-[var(--text-2)] space-y-2">
              <li>• Select a focus task before starting</li>
              <li>• Work for 25 minutes straight</li>
              <li>• Task timer syncs when Pomodoro starts or pauses</li>
              <li>• The timer continues when you leave and return</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}