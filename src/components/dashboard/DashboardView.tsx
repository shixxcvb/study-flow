import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  Calendar as CalendarIcon,
  Flame,
  ArrowRight,
  Plus,
  Play,
  BookOpen,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatLocalDate } from '../../utils/storage';
import { AcademicTask } from '../../types';

export const DashboardView: React.FC = () => {
  const {
    tasks,
    sessions,
    settings,
    setActiveTab,
    openCreateTaskModal,
    openEditTaskModal,
    toggleTaskComplete,
  } = useApp();

  const todayStr = useMemo(() => formatLocalDate(new Date()), []);

  // Filter tasks due today
  const tasksDueToday = useMemo(() => {
    return tasks.filter((t) => t.dueDate === todayStr);
  }, [tasks, todayStr]);

  const dueTodayPending = useMemo(() => {
    return tasksDueToday.filter((t) => t.status !== 'completed');
  }, [tasksDueToday]);

  const completedTodayCount = useMemo(() => {
    return tasks.filter(
      (t) => t.completedAt && formatLocalDate(new Date(t.completedAt)) === todayStr
    ).length;
  }, [tasks, todayStr]);

  // Overall task metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Focus time metrics
  const todayFocusMinutes = useMemo(() => {
    return sessions
      .filter((s) => s.mode === 'focus' && formatLocalDate(new Date(s.completedAt)) === todayStr)
      .reduce((sum, s) => sum + s.durationMinutes, 0);
  }, [sessions, todayStr]);

  const totalFocusMinutes = useMemo(() => {
    return sessions
      .filter((s) => s.mode === 'focus')
      .reduce((sum, s) => sum + s.durationMinutes, 0);
  }, [sessions]);

  // Upcoming deadlines (next 7 days, excluding today)
  const upcomingDeadlines = useMemo(() => {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const nextWeek = new Date(todayDate);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return tasks
      .filter((t) => {
        if (t.status === 'completed') return false;
        const taskDate = new Date(t.dueDate + 'T00:00:00');
        return taskDate > todayDate && taskDate <= nextWeek;
      })
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 4);
  }, [tasks]);

  // Motivational quote based on time of day and completion
  const motivationalGreeting = useMemo(() => {
    const hour = new Date().getHours();
    let timeGreeting = 'Good morning';
    if (hour >= 12 && hour < 17) timeGreeting = 'Good afternoon';
    if (hour >= 17) timeGreeting = 'Good evening';

    let motivation = 'Ready to conquer your academic goals today?';
    if (dueTodayPending.length === 0 && tasksDueToday.length > 0) {
      motivation = 'All tasks for today are completed! Outstanding work!';
    } else if (completionRate >= 80) {
      motivation = 'Your study momentum is incredible this week. Keep flowing!';
    } else if (dueTodayPending.length > 0) {
      motivation = `You have ${dueTodayPending.length} priority task${
        dueTodayPending.length > 1 ? 's' : ''
      } scheduled for today.`;
    }

    return { timeGreeting, motivation };
  }, [dueTodayPending, tasksDueToday, completionRate]);

  // Mini calendar data for current month
  const miniCalendarDays = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun

    const days: { day: number; dateStr: string; isToday: boolean; hasTasks: boolean }[] = [];

    // Prefix empty slots
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ day: 0, dateStr: '', isToday: false, hasTasks: false });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const dateStr = formatLocalDate(dateObj);
      const isToday = dateStr === todayStr;
      const hasTasks = tasks.some((t) => t.dueDate === dateStr);
      days.push({ day: d, dateStr, isToday, hasTasks });
    }

    return days;
  }, [todayStr, tasks]);

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
    new Date()
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner Card */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-3xl bg-linear-to-r from-purple-700 via-indigo-700 to-purple-900 text-white shadow-xl shadow-purple-900/15 p-6 sm:p-8"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-purple-100 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-pink-300" />
                {settings.courseTitle}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {motivationalGreeting.timeGreeting}, {settings.studentName.split(' ')[0]}! ✨
            </h2>
            <p className="mt-2 text-sm sm:text-base text-purple-100/90 leading-relaxed">
              {motivationalGreeting.motivation}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => openCreateTaskModal()}
                className="px-4 py-2 text-xs font-bold text-purple-950 bg-white hover:bg-purple-50 active:bg-purple-100 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Quick Add Task
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('focus')}
                className="px-4 py-2 text-xs font-semibold text-white bg-purple-500/40 hover:bg-purple-500/60 rounded-xl border border-white/20 transition-all flex items-center gap-1.5 backdrop-blur-xs"
              >
                <Play className="w-3.5 h-3.5" />
                Start Focus Session
              </button>
            </div>
          </div>

          {/* Aesthetic Desk illustration preview */}
          <div className="hidden lg:block w-72 h-36 rounded-2xl overflow-hidden border border-white/20 shadow-md shrink-0 relative">
            <img
              src="/src/assets/images/study_desk_hero_1792808253783.jpg"
              alt="Study desk setup"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-950/70 via-transparent to-transparent flex items-end p-2.5">
              <span className="text-[11px] font-medium text-white/90">
                Focus Mode · {settings.focusDuration} min
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 4 Key Productivity Overview Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Due Today */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="p-5 rounded-2xl bg-white dark:bg-[#1C1A2E] border border-purple-100 dark:border-purple-900/40 shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Due Today</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-tabular">
              {dueTodayPending.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              pending of {tasksDueToday.length} total
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${
                  tasksDueToday.length > 0
                    ? Math.round(
                        ((tasksDueToday.length - dueTodayPending.length) / tasksDueToday.length) *
                          100
                      )
                    : 100
                }%`,
              }}
            />
          </div>
        </motion.div>

        {/* Tasks Completed */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="p-5 rounded-2xl bg-white dark:bg-[#1C1A2E] border border-purple-100 dark:border-purple-900/40 shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Tasks Completed</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-tabular">
              {completedTasks}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              of {totalTasks} all-time ({completionRate}%)
            </span>
          </div>
          <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-tabular">
              +{completedTodayCount}
            </span>
            <span>finished today</span>
          </p>
        </motion.div>

        {/* Focus Study Time */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="p-5 rounded-2xl bg-white dark:bg-[#1C1A2E] border border-purple-100 dark:border-purple-900/40 shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Today&apos;s Focus Time</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-tabular">
              {todayFocusMinutes}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">minutes today</span>
          </div>
          <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400 font-tabular">
              {totalFocusMinutes} mins
            </span>{' '}
            total focus logged
          </p>
        </motion.div>

        {/* Study Momentum */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="p-5 rounded-2xl bg-white dark:bg-[#1C1A2E] border border-purple-100 dark:border-purple-900/40 shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold">Study Streak</span>
            <div className="w-8 h-8 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-tabular">
              {completedTasks > 0 ? '4' : '0'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">day active streak</span>
          </div>
          <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 truncate">
            Consistent daily progress recorded
          </p>
        </motion.div>
      </section>

      {/* Main Bento Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Today's Tasks & Upcoming Deadlines */}
        <div className="lg:col-span-2 space-y-6">
          {/* Priority Tasks Due Today */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1A2E] border border-purple-100 dark:border-purple-900/40 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Today&apos;s Academic Tasks
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tasks scheduled for completion today
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('tasks')}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1 transition-colors"
              >
                <span>View all tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {tasksDueToday.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-dashed border-purple-200 dark:border-purple-800/40">
                <BookOpen className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  No tasks due today!
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Take a well-deserved breather, or plan ahead by scheduling assignments for the week.
                </p>
                <button
                  type="button"
                  onClick={() => openCreateTaskModal(todayStr)}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all"
                >
                  Schedule Task for Today
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {tasksDueToday.map((task) => (
                  <TaskCardRow
                    key={task.id}
                    task={task}
                    onToggle={() => toggleTaskComplete(task.id)}
                    onEdit={() => openEditTaskModal(task)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Academic Deadlines */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1A2E] border border-purple-100 dark:border-purple-900/40 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Upcoming Deadlines (Next 7 Days)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Assignments and milestones approaching soon
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('calendar')}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1 transition-colors"
              >
                <span>Full calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {upcomingDeadlines.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 rounded-xl">
                No immediate deadlines in the next 7 days.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {upcomingDeadlines.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => openEditTaskModal(task)}
                    className="cursor-pointer p-4 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 hover:bg-purple-100/40 dark:hover:bg-purple-900/30 border border-purple-100 dark:border-purple-900/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
                        <span className="font-semibold text-purple-700 dark:text-purple-300 truncate max-w-[140px]">
                          {task.category}
                        </span>
                        <span className="font-medium font-tabular text-amber-600 dark:text-amber-400">
                          {task.dueDate}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-2">
                        {task.title}
                      </h4>
                    </div>
                    {task.description && (
                      <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 span): Mini Calendar & Focus Launcher */}
        <div className="space-y-6">
          {/* Mini Calendar Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1A2E] border border-purple-100 dark:border-purple-900/40 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                {monthName}
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab('calendar')}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
              >
                Expand
              </button>
            </div>

            {/* Days header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
              <span>S</span>
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {miniCalendarDays.map((item, idx) => {
                if (!item.dateStr) {
                  return <div key={`empty-${idx}`} className="h-8" />;
                }
                return (
                  <button
                    key={item.dateStr}
                    type="button"
                    onClick={() => setActiveTab('calendar')}
                    className={`h-8 rounded-lg flex flex-col items-center justify-center relative transition-colors ${
                      item.isToday
                        ? 'bg-purple-600 text-white font-bold shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/50'
                    }`}
                  >
                    <span>{item.day}</span>
                    {item.hasTasks && (
                      <span
                        className={`w-1 h-1 rounded-full ${
                          item.isToday ? 'bg-white' : 'bg-purple-500'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Focus Quick Session Launch Card */}
          <div className="p-6 rounded-3xl bg-linear-to-br from-indigo-900/10 via-purple-900/10 to-pink-900/10 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-pink-950/40 border border-purple-200/60 dark:border-purple-800/40">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Pomodoro Focus Zone
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {settings.focusDuration} min Focus · {settings.shortBreakDuration} min Break
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Boost your study retention with high-intensity focus sessions. Elapsed time is
              tracked accurately even across browser tabs.
            </p>

            <button
              type="button"
              onClick={() => setActiveTab('focus')}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Play className="w-4 h-4 fill-white" />
              Launch Focus Timer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for individual task item row with zero-pill metadata
interface TaskCardRowProps {
  task: AcademicTask;
  onToggle: () => void;
  onEdit: () => void;
}

const TaskCardRow: React.FC<TaskCardRowProps> = ({ task, onToggle, onEdit }) => {
  const isCompleted = task.status === 'completed';

  const priorityColors = {
    high: 'text-rose-600 dark:text-rose-400',
    medium: 'text-amber-600 dark:text-amber-400',
    low: 'text-emerald-600 dark:text-emerald-400',
  };

  return (
    <div
      className={`group flex items-start gap-3 p-3.5 rounded-2xl border transition-all ${
        isCompleted
          ? 'bg-slate-50/60 dark:bg-slate-900/20 border-slate-200/50 dark:border-slate-800/40 opacity-70'
          : 'bg-white dark:bg-[#151424] border-purple-100 dark:border-purple-900/40 hover:border-purple-300 dark:hover:border-purple-700/60 shadow-2xs'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
          isCompleted
            ? 'bg-purple-600 border-purple-600 text-white'
            : 'border-slate-300 dark:border-purple-800/70 hover:border-purple-500 bg-white dark:bg-[#1E1C2E]'
        }`}
        aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
      </button>

      <div className="flex-1 min-w-0 cursor-pointer" onClick={onEdit}>
        <h4
          className={`text-xs font-bold tracking-tight truncate ${
            isCompleted
              ? 'line-through text-slate-400 dark:text-slate-500'
              : 'text-slate-900 dark:text-white'
          }`}
        >
          {task.title}
        </h4>

        {/* Clean unboxed metadata with · separators */}
        <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
          <span className="font-medium text-purple-700 dark:text-purple-300">{task.category}</span>
          <span aria-hidden="true">·</span>
          <span className={`font-semibold capitalize ${priorityColors[task.priority]}`}>
            {task.priority} Priority
          </span>
          {task.dueTime && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-tabular">{task.dueTime}</span>
            </>
          )}
          {task.estimatedMinutes && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-tabular">{task.estimatedMinutes}m est.</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
