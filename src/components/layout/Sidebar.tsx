import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  Timer,
  BarChart3,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ViewTab } from '../../types';

interface NavItem {
  id: ViewTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    tasks,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    openCreateTaskModal,
    settings,
  } = useApp();

  const activeTaskCount = tasks.filter((t) => t.status !== 'completed').length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare, badge: activeTaskCount },
    { id: 'calendar', label: 'Academic Calendar', icon: CalendarDays },
    { id: 'focus', label: 'Focus Timer', icon: Timer },
    { id: 'analytics', label: 'Study Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tab: ViewTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          role="presentation"
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white/95 dark:bg-[#161526]/95 backdrop-blur-md border-r border-purple-100 dark:border-purple-900/40 transition-all duration-300 ease-in-out flex flex-col ${
          // Mobile state
          isMobileMenuOpen
            ? 'translate-x-0 w-72'
            : '-translate-x-full lg:translate-x-0 ' +
              (isSidebarCollapsed ? 'w-20' : 'w-64')
        }`}
      >
        {/* Brand & Student Profile Header */}
        <div className="p-5 border-b border-purple-50 dark:border-purple-900/30 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-purple-500 via-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            {(!isSidebarCollapsed || isMobileMenuOpen) && (
              <div className="min-w-0">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white block truncate">
                  StudyFlow
                </span>
                <span className="text-[11px] font-medium text-purple-600 dark:text-purple-400 block truncate">
                  Academic Planner
                </span>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            className="hidden lg:flex p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-xl transition-colors"
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Quick Add Task Button */}
        <div className="p-3">
          <button
            type="button"
            onClick={() => openCreateTaskModal()}
            className={`w-full py-2.5 px-3 rounded-2xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:from-purple-700 active:to-indigo-700 text-white font-semibold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-2 ${
              isSidebarCollapsed && !isMobileMenuOpen ? 'px-0' : ''
            }`}
            title="Create New Task"
          >
            <Plus className="w-4 h-4 shrink-0" />
            {(!isSidebarCollapsed || isMobileMenuOpen) && (
              <span className="truncate">New Academic Task</span>
            )}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-purple-100/90 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-purple-50/60 dark:hover:bg-purple-950/30 hover:text-slate-900 dark:hover:text-slate-200'
                } ${isSidebarCollapsed && !isMobileMenuOpen ? 'justify-center px-0' : ''}`}
                title={item.label}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                    isActive
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-slate-400 dark:text-slate-500 group-hover:text-purple-500'
                  }`}
                />
                {(!isSidebarCollapsed || isMobileMenuOpen) && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {(!isSidebarCollapsed || isMobileMenuOpen) && item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-purple-200 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 font-tabular">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Student Portfolio / Author Card at Bottom */}
        <div className="p-3 border-t border-purple-50 dark:border-purple-900/30">
          <div
            onClick={() => handleNavClick('settings')}
            className={`cursor-pointer p-2.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 hover:bg-purple-100/60 dark:hover:bg-purple-900/40 transition-colors flex items-center gap-3 ${
              isSidebarCollapsed && !isMobileMenuOpen ? 'justify-center p-2' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-purple-200 dark:bg-purple-800 shrink-0 border border-purple-300 dark:border-purple-700">
              <img
                src="/src/assets/images/avatar_charlene_1792808239387.jpg"
                alt="Charlene Calamba portrait"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback avatar icon
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            {(!isSidebarCollapsed || isMobileMenuOpen) && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {settings.studentName}
                </p>
                <p className="text-[10px] text-purple-600 dark:text-purple-400 truncate flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 shrink-0" />
                  {settings.courseTitle}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
