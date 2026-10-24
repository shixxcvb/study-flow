import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Trash2,
  Edit3,
  Calendar,
  Clock,
  LayoutList,
  Kanban,
  X,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AcademicTask, Priority, TaskStatus } from '../../types';
import { SUBJECT_CATEGORIES, formatLocalDate } from '../../utils/storage';
import { ConfirmModal } from '../common/ConfirmModal';

type SortOption = 'dueDateAsc' | 'dueDateDesc' | 'priority' | 'title';
type ViewMode = 'list' | 'board';

export const TasksView: React.FC = () => {
  const {
    tasks,
    openCreateTaskModal,
    openEditTaskModal,
    deleteTask,
    toggleTaskComplete,
    updateTaskStatus,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');
  const [sortBy, setSortBy] = useState<SortOption>('dueDateAsc');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Delete modal state
  const [taskToDelete, setTaskToDelete] = useState<AcademicTask | null>(null);

  const priorityWeight: Record<Priority, number> = {
    high: 3,
    medium: 2,
    low: 1,
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = task.title.toLowerCase().includes(q);
          const matchesDesc = task.description?.toLowerCase().includes(q);
          const matchesCategory = task.category.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc && !matchesCategory) return false;
        }

        // Status filter
        if (statusFilter !== 'all' && task.status !== statusFilter) return false;

        // Category filter
        if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;

        // Priority filter
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDateAsc') {
          return a.dueDate.localeCompare(b.dueDate);
        }
        if (sortBy === 'dueDateDesc') {
          return b.dueDate.localeCompare(a.dueDate);
        }
        if (sortBy === 'priority') {
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [tasks, searchQuery, statusFilter, categoryFilter, priorityFilter, sortBy]);

  const activeCount = tasks.filter((t) => t.status !== 'completed').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Academic Tasks & Assignments
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your IT degree milestones, lab submissions, and study schedule.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View mode toggle */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-purple-950/40 rounded-xl border border-slate-200/80 dark:border-purple-900/40">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-purple-900 text-purple-700 dark:text-purple-200 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="List View"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'board'
                  ? 'bg-white dark:bg-purple-900 text-purple-700 dark:text-purple-200 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Kanban Board View"
            >
              <Kanban className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => openCreateTaskModal()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:from-purple-700 active:to-indigo-700 rounded-xl shadow-md shadow-purple-500/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1C1A2E] border border-purple-100 dark:border-purple-900/40 shadow-xs space-y-4">
        {/* Search Bar + Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, or course..."
              className="w-full pl-10 pr-9 py-2 rounded-xl text-xs sm:text-sm bg-purple-50/40 dark:bg-[#151424] border border-purple-100 dark:border-purple-900/40 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-400/20 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="py-2 px-3 rounded-xl text-xs font-medium bg-purple-50/40 dark:bg-[#151424] border border-purple-100 dark:border-purple-900/40 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-purple-500 transition-colors"
            >
              <option value="dueDateAsc">Due Date (Earliest)</option>
              <option value="dueDateDesc">Due Date (Latest)</option>
              <option value="priority">Priority (High to Low)</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Filters Row: Status Segmented Tabs + Dropdowns */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-purple-50 dark:border-purple-900/30">
          {/* Status Tabs (Segmented controls) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-purple-950/40 rounded-xl">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-purple-900 text-purple-900 dark:text-purple-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('todo')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                statusFilter === 'todo'
                  ? 'bg-white dark:bg-purple-900 text-purple-900 dark:text-purple-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              To Do ({tasks.filter((t) => t.status === 'todo').length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('in_progress')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                statusFilter === 'in_progress'
                  ? 'bg-white dark:bg-purple-900 text-purple-900 dark:text-purple-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              In Progress ({tasks.filter((t) => t.status === 'in_progress').length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                statusFilter === 'completed'
                  ? 'bg-white dark:bg-purple-900 text-purple-900 dark:text-purple-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>

          {/* Secondary Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-1.5 px-3 rounded-xl text-xs font-medium bg-purple-50/40 dark:bg-[#151424] border border-purple-100 dark:border-purple-900/40 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-purple-500"
            >
              <option value="all">All Subjects</option>
              {SUBJECT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as 'all' | Priority)}
              className="py-1.5 px-3 rounded-xl text-xs font-medium bg-purple-50/40 dark:bg-[#151424] border border-purple-100 dark:border-purple-900/40 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-purple-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Task List or Kanban Board */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-[#1C1A2E] border border-dashed border-purple-200 dark:border-purple-800/40 shadow-xs">
          <BookOpen className="w-12 h-12 text-purple-300 dark:text-purple-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No tasks found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all'
              ? 'Try clearing some of your search filters to see all coursework tasks.'
              : 'Start organizing your semester by adding your first academic assignment or project.'}
          </p>
          <div className="mt-5 flex justify-center gap-3">
            {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                  setPriorityFilter('all');
                }}
                className="px-4 py-2 text-xs font-semibold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 rounded-xl hover:bg-purple-100 transition-colors"
              >
                Clear Filters
              </button>
            )}
            <button
              type="button"
              onClick={() => openCreateTaskModal()}
              className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Task
            </button>
          </div>
        </div>
      ) : viewMode === 'list' ? (
        /* List View */
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  task.status === 'completed'
                    ? 'bg-slate-50/50 dark:bg-[#151424]/40 border-slate-200/50 dark:border-purple-900/20 opacity-75'
                    : 'bg-white dark:bg-[#1C1A2E] border-purple-100 dark:border-purple-900/40 hover:border-purple-300 dark:hover:border-purple-700/60 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Status Checkbox Button */}
                  <button
                    type="button"
                    onClick={() => toggleTaskComplete(task.id)}
                    className={`mt-1 w-6 h-6 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                      task.status === 'completed'
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : 'border-slate-300 dark:border-purple-800/70 hover:border-purple-500 bg-white dark:bg-[#151424]'
                    }`}
                    aria-label={
                      task.status === 'completed' ? 'Reopen task' : 'Mark task as complete'
                    }
                  >
                    {task.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                      <h3
                        onClick={() => openEditTaskModal(task)}
                        className={`text-sm sm:text-base font-bold tracking-tight cursor-pointer hover:text-purple-600 dark:hover:text-purple-300 transition-colors ${
                          task.status === 'completed'
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {task.title}
                      </h3>

                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-tabular shrink-0">
                        Due: {task.dueDate} {task.dueTime ? `· ${task.dueTime}` : ''}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    {/* Clean unboxed metadata with · separators */}
                    <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                      <span className="font-semibold text-purple-700 dark:text-purple-300">
                        {task.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={`font-semibold capitalize ${
                          task.priority === 'high'
                            ? 'text-rose-600 dark:text-rose-400'
                            : task.priority === 'medium'
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {task.priority} Priority
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{task.status.replace('_', ' ')}</span>
                      {task.estimatedMinutes && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-tabular">{task.estimatedMinutes} mins est.</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      type="button"
                      onClick={() => openEditTaskModal(task)}
                      className="p-2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-xl transition-colors"
                      title="Edit task"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setTaskToDelete(task)}
                      className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['todo', 'in_progress', 'completed'] as TaskStatus[]).map((columnStatus) => {
            const columnTasks = filteredTasks.filter((t) => t.status === columnStatus);
            const columnTitles: Record<TaskStatus, string> = {
              todo: 'To Do',
              in_progress: 'In Progress',
              completed: 'Completed',
            };
            return (
              <div
                key={columnStatus}
                className="p-4 rounded-3xl bg-slate-50/70 dark:bg-[#161526] border border-purple-100 dark:border-purple-900/30 flex flex-col min-h-[400px]"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-purple-100 dark:border-purple-900/30">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {columnTitles[columnStatus]}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-tabular">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 rounded-2xl bg-white dark:bg-[#1C1A2E] border border-purple-100 dark:border-purple-900/40 shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
                          <span className="font-semibold text-purple-700 dark:text-purple-300 truncate max-w-[140px]">
                            {task.category}
                          </span>
                          <span
                            className={`font-semibold capitalize ${
                              task.priority === 'high'
                                ? 'text-rose-600'
                                : task.priority === 'medium'
                                ? 'text-amber-600'
                                : 'text-emerald-600'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                        <h5
                          onClick={() => openEditTaskModal(task)}
                          className="text-xs font-bold text-slate-900 dark:text-white cursor-pointer hover:text-purple-600 line-clamp-2"
                        >
                          {task.title}
                        </h5>
                        {task.description && (
                          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-purple-50 dark:border-purple-900/30 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-tabular">{task.dueDate}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditTaskModal(task)}
                            className="p-1 hover:text-purple-600 transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setTaskToDelete(task)}
                            className="p-1 hover:text-rose-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {columnTasks.length === 0 && (
                    <div className="text-center py-8 text-xs text-slate-400 italic">
                      No tasks in this column
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      <ConfirmModal
        isOpen={taskToDelete !== null}
        title="Delete Academic Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Task"
        cancelLabel="Keep Task"
        isDestructive={true}
        onConfirm={() => {
          if (taskToDelete) {
            deleteTask(taskToDelete.id);
            setTaskToDelete(null);
          }
        }}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
};
