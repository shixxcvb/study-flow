import React from 'react';
import { Menu, Sun, Moon, Plus, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const {
    activeTab,
    settings,
    toggleTheme,
    openCreateTaskModal,
    setIsMobileMenuOpen,
  } = useApp();

  const getSectionTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Academic Overview';
      case 'tasks':
        return 'Coursework & Task Management';
      case 'calendar':
        return 'Academic Calendar & Deadlines';
      case 'focus':
        return 'Pomodoro Focus Timer';
      case 'analytics':
        return 'Study Analytics & Performance';
      case 'settings':
        return 'Preferences & Portfolio Settings';
      default:
        return 'StudyFlow';
    }
  };

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-[#12111E]/80 backdrop-blur-md border-b border-purple-100/80 dark:border-purple-900/40 px-4 sm:px-8 flex items-center justify-between gap-4 transition-colors">
      {/* Left Zone: Mobile Menu & Breadcrumb context */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-purple-100/60 dark:hover:bg-purple-900/40 rounded-xl transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
            <span>StudyFlow</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
          </div>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
            {getSectionTitle()}
          </h1>
        </div>
      </div>

      {/* Center Zone: Today's Date with academic indicator */}
      <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
        <span>{todayFormatted}</span>
        <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
        <span className="text-purple-600 dark:text-purple-400 font-semibold">1st Semester AY 2026-2027</span>
      </div>

      {/* Right Zone: Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Add Task */}
        <button
          type="button"
          onClick={() => openCreateTaskModal()}
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-xs font-semibold shadow-xs shadow-purple-500/20 transition-all whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Task</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-purple-100/60 dark:hover:bg-purple-900/40 transition-colors"
          aria-label={`Switch to ${settings.theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${settings.theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {settings.theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-purple-600" />
          )}
        </button>

        {/* Profile Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-200 dark:border-purple-700 shrink-0 bg-purple-100 dark:bg-purple-900">
          <img
            src="/src/assets/images/avatar_charlene_1792808239387.jpg"
            alt="Charlene Calamba profile"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
};
