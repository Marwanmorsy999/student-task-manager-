import { useState, useEffect, useRef } from 'react';
import { useTasks } from '../hooks/useTasks';
import { Play, Pause, RotateCcw, Timer, Target, CheckCircle, Clock } from 'lucide-react';

const MODES = {
  focus: { name: 'Focus Session', duration: 25 * 60, color: 'bg-blue-500' },
  shortBreak: { name: 'Short Break', duration: 5 * 60, color: 'bg-green-500' },
  longBreak: { name: 'Long Break', duration: 15 * 60, color: 'bg-purple-500' },
};

export default function PomodoroPage() {
  const { tasks } = useTasks();
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const intervalRef = useRef(null);

  const currentMode = MODES[mode];
  const progress = ((currentMode.duration - timeLeft) / currentMode.duration) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const todayTasks = tasks.filter(task => {
    const today = new Date().toDateString();
    return new Date(task.dueDate).toDateString() === today;
  });

  const selectedTask = tasks.find(t => t._id === selectedTaskId);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (mode === 'focus') {
      setCompletedSessions(prev => prev + 1);
      if ((completedSessions + 1) % 4 === 0) {
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
  };

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(currentMode.duration);
  };

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODES[newMode].duration);
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
                {mode === 'focus' ? 'Time to focus on your task!' : 'Take a well-deserved break'}
              </p>
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
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="input-base w-full"
            >
              <option value="">Select a task to focus on</option>
              {todayTasks.map(task => (
                <option key={task._id} value={task._id}>
                  {task.title}
                </option>
              ))}
            </select>
            {selectedTask && (
              <div className="mt-4 p-3 bg-[var(--surface-2)] rounded-lg">
                <p className="text-sm font-medium text-[var(--text)]">
                  {selectedTask.title}
                </p>
                <p className="text-xs text-[var(--text-3)] mt-1">
                  Priority: {selectedTask.priority}
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
                <span className="text-sm text-[var(--text-2)]">Today's Tasks</span>
                <span className="font-bold text-[var(--text)]">{todayTasks.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[var(--text-2)]">Completed Tasks</span>
                <span className="font-bold text-[var(--text)]">
                  {todayTasks.filter(t => t.status === 'done').length}
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
              <li>• Work for 25 minutes straight</li>
              <li>• Take a 5-minute break</li>
              <li>• After 4 sessions, take a 15-minute break</li>
              <li>• Stay focused and avoid distractions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}