import { AcademicTask, FocusSession, UserSettings } from '../types';

const STORAGE_KEYS = {
  TASKS: 'studyflow_tasks_v1',
  SESSIONS: 'studyflow_sessions_v1',
  SETTINGS: 'studyflow_settings_v1',
  TIMER_STATE: 'studyflow_timer_state_v1',
};

// Format local date YYYY-MM-DD
export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDaysToDate(baseDate: Date, days: number): Date {
  const result = new Date(baseDate);
  result.setDate(result.getDate() + days);
  return result;
}

export const DEFAULT_SETTINGS: UserSettings = {
  studentName: 'Charlene Calamba',
  courseTitle: 'BS in Information Technology',
  theme: 'light',
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  soundEnabled: true,
  notificationEnabled: false,
  autoStartBreaks: false,
};

export const SUBJECT_CATEGORIES = [
  'IT 312: Cloud Architecture',
  'IT 315: Web Systems & Tech',
  'IT 320: Database Systems',
  'CS 204: Algorithms & Data Structures',
  'Capstone: Project Milestone',
  'General Education: Ethics',
  'Personal Study',
];

export function getInitialDemoTasks(): AcademicTask[] {
  const today = new Date();
  const todayStr = formatLocalDate(today);
  const tomorrowStr = formatLocalDate(addDaysToDate(today, 1));
  const in3DaysStr = formatLocalDate(addDaysToDate(today, 3));
  const in5DaysStr = formatLocalDate(addDaysToDate(today, 5));
  const yesterdayStr = formatLocalDate(addDaysToDate(today, -1));
  const twoDaysAgoStr = formatLocalDate(addDaysToDate(today, -2));

  return [
    {
      id: 'demo-task-1',
      title: 'Deploy Full-Stack REST API on Cloud Engine',
      description: 'Implement JWT authentication, configure Docker container, and setup continuous deployment pipeline.',
      dueDate: todayStr,
      dueTime: '18:00',
      priority: 'high',
      category: 'IT 312: Cloud Architecture',
      status: 'in_progress',
      estimatedMinutes: 60,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'demo-task-2',
      title: 'Review React 19 State Architecture & Hooks',
      description: 'Prepare presentation slides covering useTransition, Server Actions, and custom hooks for lab session.',
      dueDate: todayStr,
      dueTime: '21:00',
      priority: 'medium',
      category: 'IT 315: Web Systems & Tech',
      status: 'todo',
      estimatedMinutes: 45,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'demo-task-3',
      title: 'Database Query Optimization & Indexing Lab',
      description: 'Analyze PostgreSQL EXPLAIN query execution plans and benchmark B-Tree vs Hash index performance.',
      dueDate: tomorrowStr,
      dueTime: '16:00',
      priority: 'high',
      category: 'IT 320: Database Systems',
      status: 'todo',
      estimatedMinutes: 50,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'demo-task-4',
      title: 'Capstone System Architecture Documentation',
      description: 'Draft Entity-Relationship Diagram (ERD) and user story journey for Chapter 3 methodology.',
      dueDate: in3DaysStr,
      dueTime: '23:59',
      priority: 'medium',
      category: 'Capstone: Project Milestone',
      status: 'todo',
      estimatedMinutes: 90,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'demo-task-5',
      title: 'Graph Traversal & Dijkstra Implementation',
      description: 'Complete coding exercises in TypeScript for weighted shortest-path algorithms.',
      dueDate: in5DaysStr,
      dueTime: '20:00',
      priority: 'low',
      category: 'CS 204: Algorithms & Data Structures',
      status: 'todo',
      estimatedMinutes: 40,
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
      id: 'demo-task-6',
      title: 'Submit IT Professional Ethics Case Study',
      description: 'Written analysis on data privacy regulations and ethical AI development guidelines.',
      dueDate: yesterdayStr,
      dueTime: '17:00',
      priority: 'medium',
      category: 'General Education: Ethics',
      status: 'completed',
      estimatedMinutes: 30,
      completedAt: new Date(Date.now() - 86400000).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
      id: 'demo-task-7',
      title: 'Normalize SQL Relational Schema to 3NF',
      description: 'Applied Boyce-Codd normal form decomposition and validated functional dependencies.',
      dueDate: twoDaysAgoStr,
      dueTime: '15:00',
      priority: 'high',
      category: 'IT 320: Database Systems',
      status: 'completed',
      estimatedMinutes: 50,
      completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  ];
}

export function getInitialDemoSessions(): FocusSession[] {
  const now = Date.now();
  return [
    {
      id: 'demo-session-1',
      mode: 'focus',
      durationMinutes: 25,
      completedAt: new Date(now - 3600000 * 3).toISOString(),
      taskTitle: 'Deploy Full-Stack REST API on Cloud Engine',
    },
    {
      id: 'demo-session-2',
      mode: 'focus',
      durationMinutes: 25,
      completedAt: new Date(now - 3600000 * 5).toISOString(),
      taskTitle: 'Review React 19 State Architecture & Hooks',
    },
    {
      id: 'demo-session-3',
      mode: 'short_break',
      durationMinutes: 5,
      completedAt: new Date(now - 3600000 * 4.5).toISOString(),
    },
    {
      id: 'demo-session-4',
      mode: 'focus',
      durationMinutes: 25,
      completedAt: new Date(now - 86400000 - 3600000 * 2).toISOString(),
      taskTitle: 'Normalize SQL Relational Schema to 3NF',
    },
    {
      id: 'demo-session-5',
      mode: 'focus',
      durationMinutes: 25,
      completedAt: new Date(now - 86400000 * 2 - 3600000 * 3).toISOString(),
      taskTitle: 'Submit IT Professional Ethics Case Study',
    },
    {
      id: 'demo-session-6',
      mode: 'focus',
      durationMinutes: 25,
      completedAt: new Date(now - 86400000 * 3 - 3600000 * 4).toISOString(),
      taskTitle: 'Database Query Optimization & Indexing Lab',
    },
  ];
}

export function loadTasksFromStorage(): AcademicTask[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) {
      const initial = getInitialDemoTasks();
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return getInitialDemoTasks();
  }
}

export function saveTasksToStorage(tasks: AcademicTask[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to localStorage', err);
  }
}

export function loadSessionsFromStorage(): FocusSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) {
      const initial = getInitialDemoSessions();
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return getInitialDemoSessions();
  }
}

export function saveSessionsToStorage(sessions: FocusSession[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (err) {
    console.error('Failed to save sessions to localStorage', err);
  }
}

export function loadSettingsFromStorage(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettingsToStorage(settings: UserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings to localStorage', err);
  }
}

export interface SavedTimerState {
  mode: 'focus' | 'short_break' | 'long_break';
  isRunning: boolean;
  timeLeft: number; // seconds left
  endTime: number | null; // epoch timestamp ms when running
  selectedTaskId?: string;
  selectedTaskTitle?: string;
}

export function loadTimerStateFromStorage(): SavedTimerState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TIMER_STATE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveTimerStateToStorage(state: SavedTimerState | null): void {
  try {
    if (state === null) {
      localStorage.removeItem(STORAGE_KEYS.TIMER_STATE);
    } else {
      localStorage.setItem(STORAGE_KEYS.TIMER_STATE, JSON.stringify(state));
    }
  } catch (err) {
    console.error('Failed to save timer state to localStorage', err);
  }
}

export function clearAllAppData(): void {
  localStorage.removeItem(STORAGE_KEYS.TASKS);
  localStorage.removeItem(STORAGE_KEYS.SESSIONS);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.TIMER_STATE);
}
