import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatLocalDate } from '../../utils/storage';
import { AcademicTask } from '../../types';

export const CalendarView: React.FC = () => {
  const { tasks, openCreateTaskModal, openEditTaskModal, toggleTaskComplete } = useApp();

  const todayStr = useMemo(() => formatLocalDate(new Date()), []);

  // Calendar navigation state (year and month index 0-11)
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDateStr(todayStr);
  };

  // Month title: "October 2026"
  const monthTitle = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(currentDate);

  // Calendar grid calculations
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun

    // Prev month days to fill starting row
    const prevMonthDaysCount = new Date(year, month, 0).getDate();
    const leadingDays: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDaysCount - i;
      const prevDate = new Date(year, month - 1, d);
      leadingDays.push({
        day: d,
        dateStr: formatLocalDate(prevDate),
        isCurrentMonth: false,
      });
    }

    // Current month days
    const currentMonthDays: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const thisDate = new Date(year, month, d);
      currentMonthDays.push({
        day: d,
        dateStr: formatLocalDate(thisDate),
        isCurrentMonth: true,
      });
    }

    // Trailing days from next month to complete 35 or 42 grid cells
    const totalSlots = leadingDays.length + currentMonthDays.length;
    const requiredRows = Math.ceil(totalSlots / 7);
    const trailingCount = requiredRows * 7 - totalSlots;

    const trailingDays: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];
    for (let d = 1; d <= trailingCount; d++) {
      const nextDate = new Date(year, month + 1, d);
      trailingDays.push({
        day: d,
        dateStr: formatLocalDate(nextDate),
        isCurrentMonth: false,
      });
    }

    return [...leadingDays, ...currentMonthDays, ...trailingDays];
  }, [year, month]);

  // Tasks grouped by date string for O(1) lookup
  const tasksByDate = useMemo(() => {
    const map = new Map<string, AcademicTask[]>();
    tasks.forEach((task) => {
      const existing = map.get(task.dueDate) || [];
      existing.push(task);
      map.set(task.dueDate, existing);
    });
    return map;
  }, [tasks]);

  // Tasks for currently selected day
  const selectedDayTasks = useMemo(() => {
    return tasksByDate.get(selectedDateStr) || [];
  }, [tasksByDate, selectedDateStr]);

  const selectedDateFormatted = useMemo(() => {
    try {
      const [y, m, d] = selectedDateStr.split('-').map(Number);
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(y, m - 1, d));
    } catch {
      return selectedDateStr;
    }
  }, [selectedDateStr]);

  // Upcoming deadlines in the next 14 days
  const upcomingDeadlines = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks
      .filter((t) => {
        if (t.status === 'completed') return false;
        const taskDate = new Date(t.dueDate + 'T00:00:00');
        return taskDate >= today;
      })
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 5);
  }, [tasks]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Calendar Header with Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Academic Schedule & Calendar
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track assignment deadlines, exam dates, and semester project milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToday}
            className="px-3.5 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-100/70 dark:bg-purple-950/60 hover:bg-purple-200/70 rounded-xl transition-colors"
          >
            Today
          </button>
          <div className="flex items-center rounded-xl border border-purple-100 dark:border-purple-900/40 bg-white dark:bg-[#1C1A2E] p-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-lg transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-800 dark:text-slate-200 min-w-[130px] text-center">
              {monthTitle}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-lg transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => openCreateTaskModal(selectedDateStr)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add to Date</span>
          </button>
        </div>
      </div>

      {/* Main Layout: 2 Columns (Calendar 7 cols on left + Day Details on right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Month Calendar Grid (2 cols) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1C1A2E] border border-purple-100 dark:border-purple-900/40 shadow-xs">
          {/* Day Names Header */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 dark:text-slate-500 pb-3 border-b border-purple-50 dark:border-purple-900/30">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Month Grid Cells */}
          <div className="grid grid-cols-7 gap-2 mt-3">
            {calendarDays.map((cell) => {
              const isToday = cell.dateStr === todayStr;
              const isSelected = cell.dateStr === selectedDateStr;
              const dayTasks = tasksByDate.get(cell.dateStr) || [];
              const hasHighPriority = dayTasks.some((t) => t.priority === 'high' && t.status !== 'completed');

              return (
                <div
                  key={cell.dateStr}
                  onClick={() => setSelectedDateStr(cell.dateStr)}
                  className={`min-h-[74px] sm:min-h-[88px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-purple-600 dark:border-purple-500 bg-purple-50/60 dark:bg-purple-950/40 shadow-xs'
                      : isToday
                      ? 'border-purple-300 dark:border-purple-700 bg-purple-50/20 dark:bg-purple-950/20'
                      : cell.isCurrentMonth
                      ? 'border-slate-100 dark:border-purple-900/30 hover:border-purple-200 dark:hover:border-purple-800 bg-white dark:bg-[#151424]'
                      : 'border-transparent bg-slate-50/40 dark:bg-slate-900/20 opacity-40 hover:opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-tabular font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday
                          ? 'bg-purple-600 text-white shadow-xs'
                          : isSelected
                          ? 'text-purple-700 dark:text-purple-300'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {cell.day}
                    </span>

                    {hasHighPriority && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title="High Priority Deadline" />
                    )}
                  </div>

                  {/* Task Indicators inside cell */}
                  <div className="mt-1 space-y-1 overflow-hidden">
                    {dayTasks.slice(0, 2).map((t) => (
                      <div
                        key={t.id}
                        className={`text-[10px] truncate px-1.5 py-0.5 rounded-md font-medium ${
                          t.status === 'completed'
                            ? 'line-through text-slate-400 bg-slate-100 dark:bg-slate-800'
                            : t.priority === 'high'
                            ? 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50'
                            : 'text-purple-700 dark:text-purple-300 bg-purple-100/70 dark:bg-purple-900/40'
                        }`}
                        title={t.title}
                      >
                        {t.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <span className="text-[10px] font-semibold text-slate-400 pl-1 block">
                        +{dayTasks.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Detail Panel & Upcoming Deadlines (1 col) */}
        <div className="space-y-6">
          {/* Selected Date Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1A2E] border border-purple-100 dark:border-purple-900/40 shadow-xs">
            <div className="flex items-start justify-between gap-2 pb-3 mb-3 border-b border-purple-50 dark:border-purple-900/30">
              <div>
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                  Schedule Details
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedDateFormatted}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => openCreateTaskModal(selectedDateStr)}
                className="p-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded-xl transition-colors"
                title="Add task for this date"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {selectedDayTasks.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="w-8 h-8 text-purple-300 dark:text-purple-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  No tasks on this date
                </p>
                <button
                  type="button"
                  onClick={() => openCreateTaskModal(selectedDateStr)}
                  className="mt-3 px-3 py-1.5 text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 rounded-xl transition-colors"
                >
                  Schedule task for this day
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {selectedDayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 flex items-start gap-3"
                  >
                    <button
                      type="button"
                      onClick={() => toggleTaskComplete(task.id)}
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                        task.status === 'completed'
                          ? 'bg-purple-600 border-purple-600 text-white'
                          : 'border-slate-300 dark:border-purple-800 hover:border-purple-500 bg-white dark:bg-[#1C1A2E]'
                      }`}
                    >
                      {task.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>

                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => openEditTaskModal(task)}
                    >
                      <h4
                        className={`text-xs font-bold truncate ${
                          task.status === 'completed'
                            ? 'line-through text-slate-400'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {task.title}
                      </h4>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="font-medium text-purple-700 dark:text-purple-300 truncate max-w-[120px]">
                          {task.category}
                        </span>
                        {task.dueTime && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-tabular">{task.dueTime}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Academic Deadlines list */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1A2E] border border-purple-100 dark:border-purple-900/40 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Upcoming Deadlines
            </h3>
            {upcomingDeadlines.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No upcoming deadlines.</p>
            ) : (
              <div className="space-y-2.5">
                {upcomingDeadlines.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedDateStr(t.dueDate);
                      openEditTaskModal(t);
                    }}
                    className="p-3 rounded-2xl hover:bg-purple-50/50 dark:hover:bg-purple-950/30 border border-slate-100 dark:border-purple-900/30 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                      <span className="font-semibold text-purple-700 dark:text-purple-300 truncate max-w-[140px]">
                        {t.category}
                      </span>
                      <span className="font-tabular font-medium text-amber-600 dark:text-amber-400">
                        {t.dueDate}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                      {t.title}
                    </p>
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
