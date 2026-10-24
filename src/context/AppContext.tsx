import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { AcademicTask, FocusSession, UserSettings, ViewTab, ToastMessage } from '../types';
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  loadSessionsFromStorage,
  saveSessionsToStorage,
  loadSettingsFromStorage,
  saveSettingsToStorage,
  getInitialDemoTasks,
  getInitialDemoSessions,
  clearAllAppData,
  DEFAULT_SETTINGS,
} from '../utils/storage';
import { soundEffects } from '../utils/sound';

interface AppContextType {
  tasks: AcademicTask[];
  sessions: FocusSession[];
  settings: UserSettings;
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  // Modal states
  isTaskModalOpen: boolean;
  editingTask: AcademicTask | null;
  presetDueDate?: string;
  openCreateTaskModal: (presetDueDate?: string) => void;
  openEditTaskModal: (task: AcademicTask) => void;
  closeTaskModal: () => void;
  // Task operations
  saveTask: (taskData: Omit<AcademicTask, 'id' | 'createdAt'>, idToUpdate?: string) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  updateTaskStatus: (id: string, status: AcademicTask['status']) => void;
  // Focus sessions
  logFocusSession: (session: Omit<FocusSession, 'id' | 'completedAt'>) => void;
  // Settings & storage
  updateSettings: (newSettings: Partial<UserSettings>, silent?: boolean) => void;
  toggleTheme: () => void;
  loadDemoData: () => void;
  resetAllData: () => void;
  // Toast notifications
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  // Layout states
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<AcademicTask[]>(() => loadTasksFromStorage());
  const [sessions, setSessions] = useState<FocusSession[]>(() => loadSessionsFromStorage());
  const [settings, setSettings] = useState<UserSettings>(() => loadSettingsFromStorage());
  const [activeTab, setActiveTab] = useState<ViewTab>('dashboard');

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<AcademicTask | null>(null);
  const [presetDueDate, setPresetDueDate] = useState<string | undefined>(undefined);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync dark class on documentElement & body
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [settings.theme]);

  // Persist tasks
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Persist sessions
  useEffect(() => {
    saveSessionsToStorage(sessions);
  }, [sessions]);

  // Persist settings
  useEffect(() => {
    saveSettingsToStorage(settings);
  }, [settings]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#A78BFA', '#C4B5FD', '#F9A8D4', '#EDE9FE', '#8B5CF6'],
      });
    } catch {
      // ignore
    }
  }, []);

  const openCreateTaskModal = useCallback((datePreset?: string) => {
    setEditingTask(null);
    setPresetDueDate(datePreset);
    setIsTaskModalOpen(true);
  }, []);

  const openEditTaskModal = useCallback((task: AcademicTask) => {
    setEditingTask(task);
    setPresetDueDate(undefined);
    setIsTaskModalOpen(true);
  }, []);

  const closeTaskModal = useCallback(() => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    setPresetDueDate(undefined);
  }, []);

  const saveTask = useCallback(
    (taskData: Omit<AcademicTask, 'id' | 'createdAt'>, idToUpdate?: string) => {
      if (idToUpdate) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === idToUpdate
              ? {
                  ...t,
                  ...taskData,
                  completedAt:
                    taskData.status === 'completed'
                      ? t.completedAt || new Date().toISOString()
                      : undefined,
                }
              : t
          )
        );
        addToast({
          type: 'success',
          title: 'Task Updated',
          description: `"${taskData.title}" has been saved.`,
        });
      } else {
        const newTask: AcademicTask = {
          ...taskData,
          id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          createdAt: new Date().toISOString(),
          completedAt: taskData.status === 'completed' ? new Date().toISOString() : undefined,
        };
        setTasks((prev) => [newTask, ...prev]);
        addToast({
          type: 'success',
          title: 'Task Created',
          description: `"${taskData.title}" added to your academic schedule.`,
        });
      }
      closeTaskModal();
    },
    [addToast, closeTaskModal]
  );

  const deleteTask = useCallback(
    (id: string) => {
      const taskToDelete = tasks.find((t) => t.id === id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      addToast({
        type: 'info',
        title: 'Task Deleted',
        description: taskToDelete ? `"${taskToDelete.title}" was removed.` : 'Task removed.',
      });
    },
    [tasks, addToast]
  );

  const toggleTaskComplete = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            const willBeCompleted = t.status !== 'completed';
            if (willBeCompleted) {
              if (settings.soundEnabled) soundEffects.playTaskComplete();
              triggerConfetti();
              addToast({
                type: 'success',
                title: 'Task Completed! ✨',
                description: `Great job finishing "${t.title}"`,
              });
              return {
                ...t,
                status: 'completed',
                completedAt: new Date().toISOString(),
              };
            } else {
              addToast({
                type: 'info',
                title: 'Task Reopened',
                description: `"${t.title}" is back in your active tasks.`,
              });
              return {
                ...t,
                status: 'todo',
                completedAt: undefined,
              };
            }
          }
          return t;
        })
      );
    },
    [settings.soundEnabled, triggerConfetti, addToast]
  );

  const updateTaskStatus = useCallback(
    (id: string, newStatus: AcademicTask['status']) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            const isNowCompleted = newStatus === 'completed';
            if (isNowCompleted && t.status !== 'completed') {
              if (settings.soundEnabled) soundEffects.playTaskComplete();
              triggerConfetti();
            }
            return {
              ...t,
              status: newStatus,
              completedAt: isNowCompleted ? t.completedAt || new Date().toISOString() : undefined,
            };
          }
          return t;
        })
      );
    },
    [settings.soundEnabled, triggerConfetti]
  );

  const logFocusSession = useCallback(
    (sessionData: Omit<FocusSession, 'id' | 'completedAt'>) => {
      const newSession: FocusSession = {
        ...sessionData,
        id: `session-${Date.now()}`,
        completedAt: new Date().toISOString(),
      };
      setSessions((prev) => [newSession, ...prev]);

      if (sessionData.mode === 'focus') {
        if (settings.soundEnabled) soundEffects.playTimerComplete();
        triggerConfetti();
        addToast({
          type: 'success',
          title: 'Focus Session Finished! 🎯',
          description: `Logged ${sessionData.durationMinutes} minutes of focused study.`,
        });
      } else {
        addToast({
          type: 'info',
          title: 'Break Finished',
          description: 'Ready to dive back into your next study session?',
        });
      }
    },
    [settings.soundEnabled, triggerConfetti, addToast]
  );

  const updateSettings = useCallback(
    (newSettings: Partial<UserSettings>, silent = false) => {
      setSettings((prev) => {
        const updated = { ...prev, ...newSettings };
        return updated;
      });
      if (!silent) {
        addToast({
          type: 'success',
          title: 'Settings Saved',
          description: 'Your preferences have been updated.',
        });
      }
    },
    [addToast]
  );

  const toggleTheme = useCallback(() => {
    setSettings((prev) => {
      const nextTheme = prev.theme === 'dark' ? 'light' : 'dark';
      return { ...prev, theme: nextTheme };
    });
  }, []);

  const loadDemoData = useCallback(() => {
    const demoTasks = getInitialDemoTasks();
    const demoSessions = getInitialDemoSessions();
    setTasks(demoTasks);
    setSessions(demoSessions);
    saveTasksToStorage(demoTasks);
    saveSessionsToStorage(demoSessions);
    addToast({
      type: 'info',
      title: 'Demo Data Loaded',
      description: 'Loaded sample IT coursework tasks and focus history.',
    });
  }, [addToast]);

  const resetAllData = useCallback(() => {
    clearAllAppData();
    setTasks([]);
    setSessions([]);
    setSettings(DEFAULT_SETTINGS);
    addToast({
      type: 'warning',
      title: 'Data Reset',
      description: 'All tasks, history, and preferences have been cleared.',
    });
  }, [addToast]);

  return (
    <AppContext.Provider
      value={{
        tasks,
        sessions,
        settings,
        activeTab,
        setActiveTab,
        isTaskModalOpen,
        editingTask,
        presetDueDate,
        openCreateTaskModal,
        openEditTaskModal,
        closeTaskModal,
        saveTask,
        deleteTask,
        toggleTaskComplete,
        updateTaskStatus,
        logFocusSession,
        updateSettings,
        toggleTheme,
        loadDemoData,
        resetAllData,
        toasts,
        addToast,
        removeToast,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
