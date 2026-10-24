export type Priority = 'low' | 'medium' | 'high';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface AcademicTask {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: Priority;
  category: string; // e.g. "IT 312: Cloud Systems", "IT 315: Web Dev", "CS 204: Algorithms", "Capstone Project", "Personal"
  status: TaskStatus;
  estimatedMinutes?: number;
  completedAt?: string; // ISO date string
  createdAt: string; // ISO date string
}

export type TimerMode = 'focus' | 'short_break' | 'long_break';

export interface FocusSession {
  id: string;
  mode: TimerMode;
  durationMinutes: number;
  completedAt: string; // ISO string
  taskId?: string;
  taskTitle?: string;
}

export interface UserSettings {
  studentName: string;
  courseTitle: string;
  theme: 'light' | 'dark';
  focusDuration: number; // in minutes (default 25)
  shortBreakDuration: number; // in minutes (default 5)
  longBreakDuration: number; // in minutes (default 15)
  soundEnabled: boolean;
  notificationEnabled: boolean;
  autoStartBreaks: boolean;
}

export type ViewTab = 'dashboard' | 'tasks' | 'calendar' | 'focus' | 'analytics' | 'settings';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
}
