import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Moon,
  Sun,
  Clock,
  Volume2,
  VolumeX,
  Trash2,
  RefreshCw,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ConfirmModal } from '../common/ConfirmModal';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    loadDemoData,
    resetAllData,
  } = useApp();

  const [studentName, setStudentName] = useState(settings.studentName);
  const [courseTitle, setCourseTitle] = useState(settings.courseTitle);
  const [focusDuration, setFocusDuration] = useState(settings.focusDuration);
  const [shortBreakDuration, setShortBreakDuration] = useState(settings.shortBreakDuration);
  const [longBreakDuration, setLongBreakDuration] = useState(settings.longBreakDuration);

  // Modals
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isDemoConfirmOpen, setIsDemoConfirmOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      studentName: studentName.trim() || 'Charlene Calamba',
      courseTitle: courseTitle.trim() || 'BS in Information Technology',
      focusDuration: Number(focusDuration) || 25,
      shortBreakDuration: Number(shortBreakDuration) || 5,
      longBreakDuration: Number(longBreakDuration) || 15,
    });
  };

  const toggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled }, true);
  };

  const toggleTheme = (theme: 'light' | 'dark') => {
    updateSettings({ theme }, true);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Application Preferences & Profile
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Customize study durations, theme appearance, and academic portfolio profile.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Settings Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile & Course Settings */}
          <form
            onSubmit={handleSaveProfile}
            className="p-6 rounded-3xl bg-white dark:bg-[#1C1A2E] border border-purple-100 dark:border-purple-900/40 shadow-xs space-y-5"
          >
            <div className="flex items-center gap-2.5 pb-3 border-b border-purple-50 dark:border-purple-900/30">
              <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Student Profile Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="settings-student-name"
                  className="block text-xs font-semibold tracking-wide uppercase text-slate-600 dark:text-slate-300 mb-1.5"
                >
                  Student Display Name
                </label>
                <input
                  id="settings-student-name"
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-purple-900/60 text-sm bg-white dark:bg-[#151424] text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="settings-course-title"
                  className="block text-xs font-semibold tracking-wide uppercase text-slate-600 dark:text-slate-300 mb-1.5"
                >
                  Degree / Academic Program
                </label>
                <input
                  id="settings-course-title"
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-purple-900/60 text-sm bg-white dark:bg-[#151424] text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Pomodoro Timer Custom Durations */}
            <div className="pt-3 border-t border-purple-50 dark:border-purple-900/30">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-purple-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Focus Timer Durations (Minutes)
                </h4>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label
                    htmlFor="settings-focus-dur"
                    className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1"
                  >
                    Focus Session
                  </label>
                  <input
                    id="settings-focus-dur"
                    type="number"
                    min="5"
                    max="90"
                    value={focusDuration}
                    onChange={(e) => setFocusDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold font-tabular rounded-xl border border-slate-200 dark:border-purple-900/60 bg-white dark:bg-[#151424] text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="settings-short-break"
                    className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1"
                  >
                    Short Break
                  </label>
                  <input
                    id="settings-short-break"
                    type="number"
                    min="1"
                    max="30"
                    value={shortBreakDuration}
                    onChange={(e) => setShortBreakDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold font-tabular rounded-xl border border-slate-200 dark:border-purple-900/60 bg-white dark:bg-[#151424] text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="settings-long-break"
                    className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1"
                  >
                    Long Break
                  </label>
                  <input
                    id="settings-long-break"
                    type="number"
                    min="5"
                    max="60"
                    value={longBreakDuration}
                    onChange={(e) => setLongBreakDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold font-tabular rounded-xl border border-slate-200 dark:border-purple-900/60 bg-white dark:bg-[#151424] text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-xl shadow-xs transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </form>

          {/* Theme & Sound Controls */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1A2E] border border-purple-100 dark:border-purple-900/40 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-purple-50 dark:border-purple-900/30">
              Appearance & Audio Feedback
            </h3>

            {/* Theme Selector */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Interface Theme
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Select light mode or soft dark mode
                </p>
              </div>

              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-purple-950/60 rounded-xl">
                <button
                  type="button"
                  onClick={() => toggleTheme('light')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    settings.theme === 'light'
                      ? 'bg-white text-purple-900 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleTheme('dark')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    settings.theme === 'dark'
                      ? 'bg-purple-900 text-purple-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-purple-300" />
                  <span>Dark</span>
                </button>
              </div>
            </div>

            {/* Audio Toggle */}
            <div className="flex items-center justify-between pt-3 border-t border-purple-50 dark:border-purple-900/30">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Audio Chimes & Harmonics
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Synthesized Web Audio chimes on task completion and timer alert
                </p>
              </div>

              <button
                type="button"
                onClick={toggleSound}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                  settings.soundEnabled
                    ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 text-slate-400'
                }`}
              >
                {settings.soundEnabled ? (
                  <>
                    <Volume2 className="w-4 h-4 text-purple-600" />
                    <span>Sound Active</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Muted</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Data Management Section */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1A2E] border border-purple-100 dark:border-purple-900/40 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-purple-50 dark:border-purple-900/30">
              Data & Storage Management
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Sample Academic Demo Data
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Pre-load sample IT coursework tasks and focus history for presentation
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDemoConfirmOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 rounded-xl transition-colors shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Load Demo Data</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-purple-50 dark:border-purple-900/30">
              <div>
                <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  Reset All Application Data
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Clear all tasks, focus logs, and preferences from browser storage
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 rounded-xl transition-colors shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset All Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Study Guide & Privacy */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-linear-to-br from-purple-900/10 via-indigo-900/10 to-pink-900/10 dark:from-purple-950/40 dark:via-indigo-950/40 dark:to-pink-950/40 border border-purple-200/70 dark:border-purple-800/50 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                StudyFlow Productivity Guide
              </h4>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Get the most out of your academic routine with proven learning science principles:
            </p>

            <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300 border-t border-purple-100 dark:border-purple-900/40 pt-3.5">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">25-Minute Focus Blocks</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Maintain deep focus without cognitive burnout by resting during scheduled breaks.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">High-Priority Coursework</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Tackle challenging lab milestones and coding projects when your mental energy is highest.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Daily Study Momentum</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Consistent daily study logs strengthen long-term memory and retention over cramming.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#1C1A2E] border border-purple-100 dark:border-purple-900/40 text-xs text-slate-500 dark:text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Client-Side Privacy Guarantee</span>
            </div>
            <p className="leading-relaxed">
              All your tasks, courses, deadlines, and Pomodoro logs remain 100% private in your
              browser&apos;s local storage. No external servers or telemetry trackers are used.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={isDemoConfirmOpen}
        title="Load Academic Demo Data"
        message="This will populate your schedule with sample IT coursework tasks and focus logs. Any existing tasks will be replaced with the demo set."
        confirmLabel="Load Demo Data"
        isDestructive={false}
        onConfirm={() => {
          loadDemoData();
          setIsDemoConfirmOpen(false);
        }}
        onCancel={() => setIsDemoConfirmOpen(false)}
      />

      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Reset All Application Data"
        message="Are you sure you want to erase all tasks, course categories, focus history, and custom settings? This action cannot be reversed."
        confirmLabel="Erase Everything"
        isDestructive={true}
        onConfirm={() => {
          resetAllData();
          setIsResetConfirmOpen(false);
        }}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
};
