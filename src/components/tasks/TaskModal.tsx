import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Tag, Flag, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Priority, TaskStatus } from '../../types';
import { SUBJECT_CATEGORIES, formatLocalDate } from '../../utils/storage';

export const TaskModal: React.FC = () => {
  const { isTaskModalOpen, editingTask, presetDueDate, closeTaskModal, saveTask } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState(SUBJECT_CATEGORIES[0]);
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(30);
  const [errors, setErrors] = useState<{ title?: string; dueDate?: string }>({});

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setDueDate(editingTask.dueDate);
      setDueTime(editingTask.dueTime || '');
      setPriority(editingTask.priority);
      setCategory(editingTask.category);
      setStatus(editingTask.status);
      setEstimatedMinutes(editingTask.estimatedMinutes || 30);
      setErrors({});
    } else {
      setTitle('');
      setDescription('');
      setDueDate(presetDueDate || formatLocalDate(new Date()));
      setDueTime('18:00');
      setPriority('medium');
      setCategory(SUBJECT_CATEGORIES[0]);
      setStatus('todo');
      setEstimatedMinutes(30);
      setErrors({});
    }
  }, [editingTask, presetDueDate, isTaskModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTaskModalOpen) {
        closeTaskModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTaskModalOpen, closeTaskModal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { title?: string; dueDate?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Please enter a task title';
    }
    if (!dueDate) {
      newErrors.dueDate = 'Please select a valid due date';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    saveTask(
      {
        title: title.trim(),
        description: description.trim(),
        dueDate,
        dueTime: dueTime || undefined,
        priority,
        category,
        status,
        estimatedMinutes: Number(estimatedMinutes) || 30,
      },
      editingTask ? editingTask.id : undefined
    );
  };

  return (
    <AnimatePresence>
      {isTaskModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="task-modal-heading"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeTaskModal}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-xl my-8 bg-white dark:bg-[#1C1A2E] rounded-3xl border border-purple-200/80 dark:border-purple-800/40 shadow-2xl shadow-purple-900/20 overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-purple-100 dark:border-purple-900/40 bg-purple-50/50 dark:bg-purple-950/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h2
                    id="task-modal-heading"
                    className="text-lg font-bold text-slate-900 dark:text-white tracking-tight"
                  >
                    {editingTask ? 'Edit Academic Task' : 'New Academic Task'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {editingTask
                      ? 'Update deadline, course details, or priority'
                      : 'Schedule an assignment, lab activity, or project milestone'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeTaskModal}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-colors"
                aria-label="Close task modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Task Title */}
              <div>
                <label
                  htmlFor="task-title"
                  className="block text-xs font-semibold tracking-wide uppercase text-slate-600 dark:text-slate-300 mb-1.5"
                >
                  Task Title <span className="text-rose-500">*</span>
                </label>
                <input
                  id="task-title"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                  }}
                  placeholder="e.g. Dockerize Backend Microservice & Push to Cloud Run"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-[#151424] text-slate-900 dark:text-white transition-colors focus:outline-hidden focus:ring-2 ${
                    errors.title
                      ? 'border-rose-400 focus:ring-rose-400/40'
                      : 'border-slate-200 dark:border-purple-900/60 focus:border-purple-500 focus:ring-purple-400/30'
                  }`}
                  autoFocus
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{errors.title}</p>
                )}
              </div>

              {/* Course Category & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="task-category"
                    className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-slate-600 dark:text-slate-300 mb-1.5"
                  >
                    <Tag className="w-3.5 h-3.5 text-purple-500" />
                    Subject / Course
                  </label>
                  <select
                    id="task-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-purple-900/60 text-sm bg-white dark:bg-[#151424] text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-400/30 transition-colors"
                  >
                    {SUBJECT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-slate-600 dark:text-slate-300 mb-1.5">
                    <Flag className="w-3.5 h-3.5 text-purple-500" />
                    Priority Level
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['low', 'medium', 'high'] as Priority[]).map((p) => {
                      const isSelected = priority === p;
                      const colorMap = {
                        low: 'border-emerald-300 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40',
                        medium: 'border-amber-300 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40',
                        high: 'border-rose-300 text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40',
                      };
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`py-2 px-2 text-xs font-medium rounded-xl border capitalize transition-all text-center ${
                            isSelected
                              ? `${colorMap[p]} font-bold shadow-xs`
                              : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Due Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="task-due-date"
                    className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-slate-600 dark:text-slate-300 mb-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5 text-purple-500" />
                    Due Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="task-due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => {
                      setDueDate(e.target.value);
                      if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: undefined }));
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-[#151424] text-slate-900 dark:text-white transition-colors focus:outline-hidden focus:ring-2 ${
                      errors.dueDate
                        ? 'border-rose-400 focus:ring-rose-400/40'
                        : 'border-slate-200 dark:border-purple-900/60 focus:border-purple-500 focus:ring-purple-400/30'
                    }`}
                  />
                  {errors.dueDate && (
                    <p className="mt-1 text-xs text-rose-500 font-medium">{errors.dueDate}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="task-due-time"
                    className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-slate-600 dark:text-slate-300 mb-1.5"
                  >
                    <Clock className="w-3.5 h-3.5 text-purple-500" />
                    Due Time
                  </label>
                  <input
                    id="task-due-time"
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-purple-900/60 text-sm bg-white dark:bg-[#151424] text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-400/30 transition-colors"
                  />
                </div>
              </div>

              {/* Status & Estimated Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="task-status"
                    className="block text-xs font-semibold tracking-wide uppercase text-slate-600 dark:text-slate-300 mb-1.5"
                  >
                    Current Status
                  </label>
                  <select
                    id="task-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-purple-900/60 text-sm bg-white dark:bg-[#151424] text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-400/30 transition-colors"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="task-est-minutes"
                    className="block text-xs font-semibold tracking-wide uppercase text-slate-600 dark:text-slate-300 mb-1.5"
                  >
                    Estimated Study Time (min)
                  </label>
                  <input
                    id="task-est-minutes"
                    type="number"
                    min="5"
                    max="480"
                    step="5"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(Math.max(5, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-purple-900/60 text-sm font-tabular bg-white dark:bg-[#151424] text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-400/30 transition-colors"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="task-description"
                  className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-slate-600 dark:text-slate-300 mb-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-purple-500" />
                  Notes / Description (Optional)
                </label>
                <textarea
                  id="task-description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline key deliverables, reference links, textbook chapters, or submission guidelines..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-purple-900/60 text-sm bg-white dark:bg-[#151424] text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-400/30 transition-colors resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-purple-900/30">
                <button
                  type="button"
                  onClick={closeTaskModal}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:from-purple-700 active:to-indigo-700 rounded-xl shadow-md shadow-purple-500/25 transition-all"
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
