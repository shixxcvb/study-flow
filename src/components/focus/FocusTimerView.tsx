import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle2,
  Clock,
  Coffee,
  Sparkles,
  Bell,
  BellOff,
  History,
  Target,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TimerMode } from '../../types';
import {
  loadTimerStateFromStorage,
  saveTimerStateToStorage,
  SavedTimerState,
} from '../../utils/storage';

export const FocusTimerView: React.FC = () => {
  const { settings, sessions, logFocusSession, tasks } = useApp();

  const [mode, setMode] = useState<TimerMode>('focus');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');

  // Get duration for mode in seconds
  const getDurationForMode = useCallback(
    (m: TimerMode): number => {
      if (m === 'focus') return (settings.focusDuration || 25) * 60;
      if (m === 'short_break') return (settings.shortBreakDuration || 5) * 60;
      return (settings.longBreakDuration || 15) * 60;
    },
    [settings.focusDuration, settings.shortBreakDuration, settings.longBreakDuration]
  );

  const [timeLeft, setTimeLeft] = useState<number>(() => getDurationForMode('focus'));
  const [browserNotificationAllowed, setBrowserNotificationAllowed] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });

  // End timestamp for robust drift-free interval timing
  const endTimeRef = useRef<number | null>(null);

  // Initialize or restore saved timer state
  useEffect(() => {
    const saved = loadTimerStateFromStorage();
    if (saved) {
      setMode(saved.mode);
      if (saved.selectedTaskId) setSelectedTaskId(saved.selectedTaskId);

      if (saved.isRunning && saved.endTime) {
        const remaining = Math.max(0, Math.round((saved.endTime - Date.now()) / 1000));
        if (remaining > 0) {
          setTimeLeft(remaining);
          setIsRunning(true);
          endTimeRef.current = saved.endTime;
        } else {
          // Finished while page was unloaded
          setTimeLeft(0);
          setIsRunning(false);
          endTimeRef.current = null;
        }
      } else {
        setTimeLeft(saved.timeLeft);
        setIsRunning(false);
        endTimeRef.current = null;
      }
    }
  }, []);

  // Save timer state periodically when running or paused
  useEffect(() => {
    const state: SavedTimerState = {
      mode,
      isRunning,
      timeLeft,
      endTime: endTimeRef.current,
      selectedTaskId,
    };
    saveTimerStateToStorage(state);
  }, [mode, isRunning, timeLeft, selectedTaskId]);

  // Robust timer tick using wall-clock timestamps
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isRunning) {
      if (!endTimeRef.current) {
        endTimeRef.current = Date.now() + timeLeft * 1000;
      }

      intervalId = setInterval(() => {
        if (!endTimeRef.current) return;
        const remaining = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
        setTimeLeft(remaining);

        if (remaining <= 0) {
          // Timer finished!
          clearInterval(intervalId!);
          setIsRunning(false);
          endTimeRef.current = null;

          const durationMins = Math.round(getDurationForMode(mode) / 60);
          const taskObj = tasks.find((t) => t.id === selectedTaskId);

          logFocusSession({
            mode,
            durationMinutes: durationMins,
            taskId: selectedTaskId || undefined,
            taskTitle: taskObj ? taskObj.title : undefined,
          });

          // Show browser notification if permitted
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification(
                mode === 'focus' ? 'Focus Session Completed! 🎯' : 'Break Finished! ⏰',
                {
                  body:
                    mode === 'focus'
                      ? 'Awesome job! Time for a refreshing study break.'
                      : 'Break is over. Ready for your next focus session?',
                }
              );
            } catch {
              // Notification fallback handled by in-app sound and toast
            }
          }

          // Auto-switch mode
          if (mode === 'focus') {
            setMode('short_break');
            setTimeLeft(getDurationForMode('short_break'));
          } else {
            setMode('focus');
            setTimeLeft(getDurationForMode('focus'));
          }
        }
      }, 500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, mode, timeLeft, getDurationForMode, tasks, selectedTaskId, logFocusSession]);

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    endTimeRef.current = null;
    setMode(newMode);
    setTimeLeft(getDurationForMode(newMode));
  };

  const handleStartPause = () => {
    if (isRunning) {
      setIsRunning(false);
      endTimeRef.current = null;
    } else {
      endTimeRef.current = Date.now() + timeLeft * 1000;
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    endTimeRef.current = null;
    setTimeLeft(getDurationForMode(mode));
  };

  const handleSkip = () => {
    setIsRunning(false);
    endTimeRef.current = null;
    if (mode === 'focus') {
      setMode('short_break');
      setTimeLeft(getDurationForMode('short_break'));
    } else {
      setMode('focus');
      setTimeLeft(getDurationForMode('focus'));
    }
  };

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      setBrowserNotificationAllowed(permission === 'granted');
    }
  };

  // Formatting minutes and seconds
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalDuration = getDurationForMode(mode);
  const progressRatio = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
  const strokeDashoffset = 754 - 754 * progressRatio; // 2 * PI * 120 = 753.98

  // Uncompleted tasks to associate with focus session
  const activeTasks = tasks.filter((t) => t.status !== 'completed');

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Pomodoro Focus Studio
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Timestamp-synchronized countdown with audio feedback and study logging.
          </p>
        </div>

        {/* Browser notification toggle */}
        <button
          type="button"
          onClick={requestNotificationPermission}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
            browserNotificationAllowed
              ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300'
              : 'bg-white dark:bg-[#1C1A2E] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
          }`}
          title="Enable browser desktop notifications"
        >
          {browserNotificationAllowed ? (
            <>
              <Bell className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Notifications Active</span>
            </>
          ) : (
            <>
              <BellOff className="w-3.5 h-3.5" />
              <span>Enable Browser Alert</span>
            </>
          )}
        </button>
      </div>

      {/* Main Timer Bento Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Interactive Timer */}
        <div className="lg:col-span-2 p-8 rounded-3xl bg-white dark:bg-[#1C1A2E] border border-purple-100 dark:border-purple-900/40 shadow-xs flex flex-col items-center justify-center text-center">
          {/* Mode Selector Tabs (Segmented controls) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-purple-950/40 rounded-2xl mb-8">
            <button
              type="button"
              onClick={() => switchMode('focus')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'focus'
                  ? 'bg-white dark:bg-purple-900 text-purple-900 dark:text-purple-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Focus ({settings.focusDuration}m)
            </button>
            <button
              type="button"
              onClick={() => switchMode('short_break')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'short_break'
                  ? 'bg-white dark:bg-purple-900 text-purple-900 dark:text-purple-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Short Break ({settings.shortBreakDuration}m)
            </button>
            <button
              type="button"
              onClick={() => switchMode('long_break')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === 'long_break'
                  ? 'bg-white dark:bg-purple-900 text-purple-900 dark:text-purple-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Long Break ({settings.longBreakDuration}m)
            </button>
          </div>

          {/* Associate Task Dropdown */}
          <div className="w-full max-w-sm mb-6">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
              <Target className="w-3.5 h-3.5 text-purple-500" />
              <span>Link Focus Session to Task (Optional):</span>
            </div>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full py-2 px-3 text-xs font-medium rounded-xl border border-purple-100 dark:border-purple-900/40 bg-purple-50/40 dark:bg-[#151424] text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-purple-500 transition-colors"
            >
              <option value="">No specific task (General study session)</option>
              {activeTasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.category})
                </option>
              ))}
            </select>
          </div>

          {/* Circular Progress Ring with Digital Display */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-4 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 280 280">
              {/* Background circle */}
              <circle
                cx="140"
                cy="140"
                r="120"
                className="stroke-purple-100 dark:stroke-purple-950/60"
                strokeWidth="12"
                fill="none"
              />
              {/* Animated Progress circle */}
              <circle
                cx="140"
                cy="140"
                r="120"
                className="stroke-purple-600 dark:stroke-purple-400 transition-all duration-300"
                strokeWidth="12"
                strokeDasharray="754"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-tabular">
                {timeFormatted}
              </span>
              <span className="mt-2 text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                {mode === 'focus' ? 'Deep Work Session' : 'Rest & Recharge'}
              </span>
            </div>
          </div>

          {/* Controls: Start/Pause, Reset, Skip */}
          <div className="flex items-center gap-4 mt-6">
            <button
              type="button"
              onClick={handleReset}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              title="Reset timer"
              aria-label="Reset timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleStartPause}
              className={`py-3.5 px-8 rounded-2xl text-sm font-bold text-white shadow-lg transition-all flex items-center gap-2 ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                  : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/30'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-white" />
                  <span>Start Focus</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSkip}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              title="Skip to next session"
              aria-label="Skip to next session"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Column (1 span): Session Log & Focus Stats */}
        <div className="space-y-6">
          {/* Quick Stats Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1A2E] border border-purple-100 dark:border-purple-900/40 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Today&apos;s Focus Metrics</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                  Completed Focus
                </span>
                <span className="text-xl font-bold text-slate-900 dark:text-white font-tabular">
                  {sessions.filter((s) => s.mode === 'focus').length}
                </span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 block mt-0.5">
                  sessions logged
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                  Total Focus Time
                </span>
                <span className="text-xl font-bold text-slate-900 dark:text-white font-tabular">
                  {sessions
                    .filter((s) => s.mode === 'focus')
                    .reduce((sum, s) => sum + s.durationMinutes, 0)}
                </span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 block mt-0.5">
                  total minutes
                </span>
              </div>
            </div>
          </div>

          {/* Session History Log */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1A2E] border border-purple-100 dark:border-purple-900/40 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-purple-500" />
              <span>Recent Sessions History</span>
            </h3>

            {sessions.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">
                No focus sessions logged yet. Hit start to record your first session!
              </p>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {sessions.slice(0, 6).map((s) => (
                  <div
                    key={s.id}
                    className="p-3 rounded-2xl bg-slate-50/60 dark:bg-purple-950/20 border border-slate-100 dark:border-purple-900/30 flex items-center justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        {s.mode === 'focus' ? (
                          <Clock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        ) : (
                          <Coffee className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 capitalize">
                          {s.mode.replace('_', ' ')} · {s.durationMinutes}m
                        </span>
                      </div>
                      {s.taskTitle && (
                        <p className="text-[11px] text-purple-700 dark:text-purple-300 truncate mt-0.5">
                          {s.taskTitle}
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-tabular shrink-0 ml-2">
                      {new Date(s.completedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
