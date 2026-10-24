import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Flame,
  Award,
  BookOpen,
  PieChart,
  Calendar,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatLocalDate, addDaysToDate } from '../../utils/storage';

export const AnalyticsView: React.FC = () => {
  const { tasks, sessions, setActiveTab, openCreateTaskModal } = useApp();

  const [activeTooltipDay, setActiveTooltipDay] = useState<string | null>(null);

  // 1. Overall Metrics from real data
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const focusSessions = sessions.filter((s) => s.mode === 'focus');
  const totalFocusSessions = focusSessions.length;
  const totalFocusMinutes = focusSessions.reduce((sum, s) => sum + s.durationMinutes, 0);

  // 2. Past 7 Days Activity (Daily tasks completed + Focus minutes)
  const past7DaysData = useMemo(() => {
    const today = new Date();
    const days: {
      dateStr: string;
      dayLabel: string;
      fullDateFormatted: string;
      tasksCompleted: number;
      focusMinutes: number;
    }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = addDaysToDate(today, -i);
      const dateStr = formatLocalDate(d);
      const dayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(d);
      const fullDateFormatted = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(d);

      // Count tasks completed on this date
      const tasksOnDate = tasks.filter((t) => {
        if (!t.completedAt) return false;
        return formatLocalDate(new Date(t.completedAt)) === dateStr;
      }).length;

      // Sum focus minutes on this date
      const minutesOnDate = sessions
        .filter((s) => s.mode === 'focus' && formatLocalDate(new Date(s.completedAt)) === dateStr)
        .reduce((sum, s) => sum + s.durationMinutes, 0);

      days.push({
        dateStr,
        dayLabel,
        fullDateFormatted,
        tasksCompleted: tasksOnDate,
        focusMinutes: minutesOnDate,
      });
    }

    return days;
  }, [tasks, sessions]);

  // Max value for 7-day chart scaling
  const maxTasksInDay = Math.max(1, ...past7DaysData.map((d) => d.tasksCompleted));
  const maxMinutesInDay = Math.max(30, ...past7DaysData.map((d) => d.focusMinutes));

  // 3. Tasks Breakdown by Course / Category
  const categoryStats = useMemo(() => {
    const map = new Map<string, { total: number; completed: number }>();

    tasks.forEach((t) => {
      const current = map.get(t.category) || { total: 0, completed: 0 };
      current.total += 1;
      if (t.status === 'completed') {
        current.completed += 1;
      }
      map.set(t.category, current);
    });

    return Array.from(map.entries())
      .map(([name, stat]) => ({
        name,
        total: stat.total,
        completed: stat.completed,
        rate: stat.total > 0 ? Math.round((stat.completed / stat.total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [tasks]);

  // 4. Study streak calculation based on activity dates
  const studyStreak = useMemo(() => {
    if (completedTasks === 0 && focusSessions.length === 0) return 0;
    // Check consecutive days with completion
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const dStr = formatLocalDate(addDaysToDate(today, -i));
      const hasTask = tasks.some(
        (t) => t.completedAt && formatLocalDate(new Date(t.completedAt)) === dStr
      );
      const hasSession = sessions.some(
        (s) => s.mode === 'focus' && formatLocalDate(new Date(s.completedAt)) === dStr
      );
      if (hasTask || hasSession) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return Math.max(streak, completedTasks > 0 ? 1 : 0);
  }, [tasks, sessions, completedTasks, focusSessions]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Study Analytics & Academic Progress
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Real metrics derived strictly from your stored coursework tasks and completed focus
          sessions.
        </p>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Completion Rate */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1C1A2E] border border-purple-100 dark:border-purple-900/40 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Completion Rate</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-tabular">
              {completionRate}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {completedTasks} of {totalTasks} finished
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-linear-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Focus Study Time */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1C1A2E] border border-purple-100 dark:border-purple-900/40 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Focus Time</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-tabular">
              {totalFocusMinutes}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">total minutes logged</span>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Across{' '}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400 font-tabular">
              {totalFocusSessions}
            </span>{' '}
            completed Pomodoros
          </p>
        </div>

        {/* Tasks Solved */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1C1A2E] border border-purple-100 dark:border-purple-900/40 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Completed Tasks</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-tabular">
              {completedTasks}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {pendingTasks} remaining
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 truncate">
            Assignments, labs & projects
          </p>
        </div>

        {/* Current Active Streak */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#1C1A2E] border border-purple-100 dark:border-purple-900/40 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Study Streak</span>
            <div className="w-8 h-8 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-tabular">
              {studyStreak}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">day active streak</span>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 truncate">
            Based on completed daily logs
          </p>
        </div>
      </div>

      {/* Main Charts Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Past 7-Day Activity Chart (2 cols) */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1C1A2E] border border-purple-100 dark:border-purple-900/40 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Activity Over Past 7 Days
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Daily completed tasks and recorded study focus minutes
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <span className="w-3 h-3 rounded-md bg-purple-600 inline-block" />
                  <span>Tasks Completed</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <span className="w-3 h-3 rounded-md bg-pink-400 inline-block" />
                  <span>Focus Minutes</span>
                </span>
              </div>
            </div>

            {/* Custom Interactive SVG / HTML Bar Chart */}
            <div className="relative pt-6 pb-2">
              <div className="grid grid-cols-7 gap-3 sm:gap-6 h-56 items-end">
                {past7DaysData.map((d) => {
                  const taskBarHeightPercent = Math.min(
                    100,
                    Math.round((d.tasksCompleted / maxTasksInDay) * 100)
                  );
                  const minutesBarHeightPercent = Math.min(
                    100,
                    Math.round((d.focusMinutes / maxMinutesInDay) * 100)
                  );

                  const isHovered = activeTooltipDay === d.dateStr;

                  return (
                    <div
                      key={d.dateStr}
                      onMouseEnter={() => setActiveTooltipDay(d.dateStr)}
                      onMouseLeave={() => setActiveTooltipDay(null)}
                      className="flex flex-col items-center h-full justify-end group cursor-pointer relative"
                    >
                      {/* Tooltip */}
                      {isHovered && (
                        <div className="absolute -top-12 z-20 px-2.5 py-1.5 bg-slate-900 text-white text-[11px] font-medium rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
                          <p className="font-bold">{d.fullDateFormatted}</p>
                          <p className="text-purple-300">{d.tasksCompleted} tasks done</p>
                          <p className="text-pink-300">{d.focusMinutes} mins focus</p>
                        </div>
                      )}

                      {/* Bar Pair */}
                      <div className="w-full flex items-end justify-center gap-1.5 sm:gap-2 h-44">
                        {/* Tasks Bar */}
                        <div
                          className="w-1/2 max-w-[20px] bg-purple-600 hover:bg-purple-500 rounded-t-lg transition-all duration-300"
                          style={{
                            height: `${Math.max(6, taskBarHeightPercent)}%`,
                          }}
                        />

                        {/* Focus Minutes Bar */}
                        <div
                          className="w-1/2 max-w-[20px] bg-pink-400 hover:bg-pink-300 rounded-t-lg transition-all duration-300"
                          style={{
                            height: `${Math.max(6, minutesBarHeightPercent)}%`,
                          }}
                        />
                      </div>

                      {/* Day Label */}
                      <div className="mt-3 text-center">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                          {d.dayLabel}
                        </span>
                        <span className="text-[10px] text-slate-400 font-tabular block">
                          {d.fullDateFormatted.split(' ')[1]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-purple-50 dark:border-purple-900/30 flex items-center justify-between text-xs text-slate-500">
            <span>Aggregated from persistent browser local storage</span>
            <span className="font-tabular font-medium text-purple-600 dark:text-purple-400">
              {past7DaysData.reduce((acc, d) => acc + d.tasksCompleted, 0)} total tasks this week
            </span>
          </div>
        </div>

        {/* Tasks by Course / Category Breakdown (1 col) */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1C1A2E] border border-purple-100 dark:border-purple-900/40 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight mb-1">
              Coursework Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Completion distribution by academic subject
            </p>

            {categoryStats.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400">
                No course tasks found.
              </div>
            ) : (
              <div className="space-y-4">
                {categoryStats.map((cat) => (
                  <div key={cat.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
                        {cat.name}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 font-tabular font-medium">
                        {cat.completed}/{cat.total} ({cat.rate}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-purple-950/60 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-purple-600 to-pink-500 transition-all duration-500"
                        style={{ width: `${cat.rate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => openCreateTaskModal()}
            className="mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 transition-colors text-center"
          >
            + Add Assignment to Course
          </button>
        </div>
      </div>
    </div>
  );
};
