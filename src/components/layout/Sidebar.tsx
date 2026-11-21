import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  LayoutDashboard,
  MessageSquare,
  AlertOctagon,
  BookOpen,
  Smile,
  FileCheck2,
  Sparkles,
  Award,
  Users,
  CalendarDays,
  ListTodo,
  FileText,
  UserCheck,
  ShieldCheck,
  LogOut,
  HelpCircle,
  PhoneCall,
  Settings,
  Sun,
  Moon,
  X
} from 'lucide-react';
import { ASSETS } from '../../utils/assets';
import { TRANSLATIONS } from '../../utils/i18n';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    activePage,
    setActivePage,
    goBack,
    goToHome,
    logout,
    unreadCount,
    activeSosAlerts,
    getSocialWorkerForGrade,
    appCustomization,
    theme,
    toggleTheme,
    language
  } = useApp();

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  if (!currentUser) return null;

  const handleNavClick = (pageId: string) => {
    setActivePage(pageId);
    onClose();
  };

  const handleLogoClick = () => {
    goToHome();
    onClose();
  };

  const handleBackClick = () => {
    goBack();
    onClose();
  };

  const worker = currentUser.role === 'student' ? getSocialWorkerForGrade(currentUser.grade) : undefined;
  const isAdmin = currentUser.role === 'developer';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 ${
          isAdmin
            ? 'bg-white dark:bg-[#081810] border-r border-[#245934]/30 dark:border-[#245934]/70 text-slate-900 dark:text-slate-100'
            : 'bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800'
        } flex flex-col transition-all duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header with ASYV Emblem */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-3 text-left group cursor-pointer focus-visible:outline-hidden"
            title="Click Mind Bridge icon to return to account home"
          >
            <div className="w-11 h-11 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center p-0.5 border border-[#245934]/30 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <img
                src={ASSETS.emblem}
                alt="ASYV Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-display text-lg font-bold text-[#1b4327] dark:text-[#eec149] group-hover:text-[#245934] transition-colors leading-tight">
                {appCustomization?.portalTitle || 'Mind Bridge'}
              </div>
              <div className="text-[11px] font-bold text-[#d95f18] leading-tight">
                {appCustomization?.portalSubtitle || 'ASYV Village Support'}
              </div>
            </div>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg lg:hidden"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Back Button Area */}
        <div className="px-4 py-2 border-b border-slate-100/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#245934] dark:hover:text-emerald-400 hover:bg-slate-100/90 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer w-full"
            title="Return to the former page"
          >
            <ArrowLeft className="w-4 h-4 text-[#245934] dark:text-emerald-400" />
            <span>Go Back to Former Page</span>
          </button>
        </div>

        {/* Role & Grade Banner */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-emerald-50/30 dark:bg-emerald-950/20">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#245934] dark:text-emerald-400">
            {currentUser.role === 'developer' ? 'Super Admin' : `${currentUser.grade} Grade`}
          </div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
            {currentUser.name} {currentUser.familyName ? currentUser.familyName : ''}
          </div>
          {currentUser.schoolClass && (
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Class: {currentUser.schoolClass}
            </div>
          )}
        </div>

        {/* School Motto Badge */}
        <div className="mx-3 my-2 p-2.5 rounded-2xl bg-gradient-to-r from-[#1b4327] to-[#245934] text-white text-center shadow-xs">
          <div className="text-[9px] font-black uppercase tracking-widest text-[#eec149]">
            VILLAGE THEME
          </div>
          <div className="text-xs font-black uppercase tracking-wider text-white mt-0.5">
            {(appCustomization?.schoolMotto || 'LEARN, ADAPT AND LEAD').toUpperCase()}
          </div>
          <div className="text-[9px] text-emerald-200 uppercase tracking-widest mt-0.5">
            {appCustomization?.schoolSubMotto || 'Ingabe · Ingabo · Ijabo'}
          </div>
        </div>

        {/* Navigation Items (Role Specific) */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {/* STUDENT NAVIGATION */}
          {currentUser.role === 'student' && (
            <>
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activePage === 'dashboard'
                    ? 'bg-emerald-50 text-[#1b4327] font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-[#245934]" />
                <span>{t.navOverview}</span>
              </button>

              <button
                onClick={() => handleNavClick('chat')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activePage === 'chat'
                    ? 'bg-emerald-50 text-[#1b4327] font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <MessageSquare className="w-4 h-4 text-[#245934]" />
                  <span className="truncate">{t.navChat}</span>
                </div>
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-[#d95f18] text-white rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('emergency')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activePage === 'emergency'
                    ? 'bg-rose-50 text-rose-800 font-bold border border-rose-200'
                    : 'text-rose-600 hover:bg-rose-50/80 hover:text-rose-700'
                }`}
              >
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <span>{t.navSosAlerts}</span>
              </button>

              <button
                onClick={() => handleNavClick('contact-info')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activePage === 'contact-info'
                    ? 'bg-emerald-50 text-[#1b4327] font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <PhoneCall className="w-4 h-4 text-[#245934]" />
                <span>{t.navContacts}</span>
              </button>

              <button
                onClick={() => handleNavClick('daily-question')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activePage === 'daily-question'
                    ? 'bg-emerald-50 text-[#1b4327] font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-[#245934]" />
                <span>{t.navDailyReflection}</span>
              </button>

              <button
                onClick={() => handleNavClick('journal')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activePage === 'journal'
                    ? 'bg-emerald-50 text-[#1b4327] font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4 text-[#245934]" />
                <span>{t.navJournal}</span>
              </button>

              <button
                onClick={() => handleNavClick('mood-tracker')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activePage === 'mood-tracker'
                    ? 'bg-emerald-50 text-[#1b4327] font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Smile className="w-4 h-4 text-[#245934]" />
                <span>{t.navMoodTracker}</span>
              </button>

              <button
                onClick={() => handleNavClick('assessments')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activePage === 'assessments'
                    ? 'bg-emerald-50 text-[#1b4327] font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <FileCheck2 className="w-4 h-4 text-[#245934]" />
                <span>{t.navAssessments}</span>
              </button>

              <button
                onClick={() => handleNavClick('tips')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activePage === 'tips'
                    ? 'bg-emerald-50 text-[#1b4327] font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#245934]" />
                <span>{t.navTips}</span>
              </button>

              <button
                onClick={() => handleNavClick('wellbeing-hub')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activePage === 'wellbeing-hub'
                    ? 'bg-emerald-50 text-[#1b4327] font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#d95f18]" />
                <span>{t.navColorsWellbeing}</span>
              </button>

              {/* Mental Champion Section */}
              <div className="pt-2 mt-2 border-t border-slate-100">
                {currentUser.isMentalChampion || currentUser.championStatus === 'approved' ? (
                  <button
                    onClick={() => handleNavClick('champion-portal')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                      activePage === 'champion-portal'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100/80'
                    }`}
                  >
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>{t.navChampions}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleNavClick('champion-apply')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                      activePage === 'champion-apply'
                        ? 'bg-emerald-50 text-[#1b4327] font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Award className="w-4 h-4 text-slate-500" />
                    <span>{t.navJoinChampions}</span>
                  </button>
                )}
              </div>
            </>
          )}

          {/* SOCIAL WORKER NAVIGATION */}
          {currentUser.role === 'social_worker' && (
            <>
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activePage === 'dashboard'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#1b4327] dark:text-emerald-300 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-[#245934] dark:text-emerald-400" />
                <span>{t.navOverview}</span>
              </button>

              <button
                onClick={() => handleNavClick('monitor-my-worker')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activePage === 'monitor-my-worker'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#1b4327] dark:text-emerald-300 font-bold ring-1 ring-emerald-500/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileCheck2 className="w-4 h-4 text-[#245934] dark:text-emerald-400" />
                  <span className="font-semibold">{t.navMonitorWorker}</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-[#d95f18] text-white rounded-full">
                  Tasks
                </span>
              </button>

              <button
                onClick={() => handleNavClick('students')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activePage === 'students'
                    ? 'bg-emerald-50 text-[#1b4327] font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4 text-[#245934]" />
                <span>{currentUser.grade} {t.navStudents}</span>
              </button>

              <button
                onClick={() => handleNavClick('chat')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activePage === 'chat'
                    ? 'bg-emerald-50 text-[#1b4327] font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-[#245934]" />
                  <span>{t.navChat}</span>
                </div>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-[#d95f18] text-white rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('sos-alerts')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activePage === 'sos-alerts'
                    ? 'bg-rose-50 text-rose-800 font-bold border border-rose-200'
                    : 'text-rose-600 hover:bg-rose-50 hover:text-rose-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <AlertOctagon className="w-4 h-4 text-rose-600" />
                  <span>{t.navSosAlerts}</span>
                </div>
                {activeSosAlerts.length > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-rose-600 text-white rounded-full animate-pulse">
                    {activeSosAlerts.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('contact-info')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activePage === 'contact-info'
                    ? 'bg-emerald-50 text-[#1b4327] font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <PhoneCall className="w-4 h-4 text-[#245934]" />
                <span>{t.navContacts}</span>
              </button>

              <button
                onClick={() => handleNavClick('assignments')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activePage === 'assignments'
                    ? 'bg-emerald-50 text-[#1b4327] font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <FileCheck2 className="w-4 h-4 text-[#245934]" />
                <span>{t.navAssignments}</span>
              </button>

              <button
                onClick={() => handleNavClick('daily-question')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activePage === 'daily-question'
                    ? 'bg-emerald-50 text-[#1b4327] font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-[#245934]" />
                <span>{t.navDailyPromptSetter}</span>
              </button>

              <button
                onClick={() => handleNavClick('todo')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activePage === 'todo'
                    ? 'bg-emerald-50 text-[#1b4327] font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <ListTodo className="w-4 h-4 text-[#245934]" />
                <span>{t.navTodoPlanner}</span>
              </button>

              <button
                onClick={() => handleNavClick('wellbeing-hub')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activePage === 'wellbeing-hub'
                    ? 'bg-emerald-50 text-[#1b4327] font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#d95f18]" />
                <span>{t.navColorsWellbeing}</span>
              </button>

              <div className="pt-2 mt-2 border-t border-slate-100">
                <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {t.championsCardTitle}
                </div>

                <button
                  onClick={() => handleNavClick('timetable')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    activePage === 'timetable'
                      ? 'bg-emerald-50 text-[#1b4327] font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <CalendarDays className="w-4 h-4 text-[#245934]" />
                  <span>{t.navTimetable}</span>
                </button>

                <button
                  onClick={() => handleNavClick('lessons')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    activePage === 'lessons'
                      ? 'bg-emerald-50 text-[#1b4327] font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-4 h-4 text-[#245934]" />
                  <span>{t.navLessonPrep}</span>
                </button>

                <button
                  onClick={() => handleNavClick('champion-apps')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    activePage === 'champion-apps'
                      ? 'bg-emerald-50 text-[#1b4327] font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-[#245934]" />
                  <span>{t.navChampionApps}</span>
                </button>
              </div>
            </>
          )}

          {/* MASTER ADMIN / DEVELOPER NAVIGATION */}
          {isAdmin && (
            <>
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  activePage === 'dashboard'
                    ? 'bg-[#153822] text-[#eec149] font-bold border border-[#eec149]/50 shadow-xs'
                    : 'text-slate-700 dark:text-emerald-100/80 hover:bg-emerald-50 dark:hover:bg-white/10 hover:text-[#1b4327] dark:hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-[#b8860b] dark:text-[#eec149]" />
                <span>{t.navDevConsole}</span>
              </button>

              <button
                onClick={() => handleNavClick('wellbeing-hub')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  activePage === 'wellbeing-hub'
                    ? 'bg-[#153822] text-[#eec149] font-bold border border-[#eec149]/50 shadow-xs'
                    : 'text-slate-700 dark:text-emerald-100/80 hover:bg-emerald-50 dark:hover:bg-white/10 hover:text-[#1b4327] dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#f59e0b]" />
                <span>{t.navColorsWellbeing}</span>
              </button>

              <button
                onClick={() => handleNavClick('admin-settings')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  activePage === 'admin-settings'
                    ? 'bg-[#153822] text-[#eec149] font-bold border border-[#eec149]/50 shadow-xs'
                    : 'text-slate-700 dark:text-emerald-100/80 hover:bg-emerald-50 dark:hover:bg-white/10 hover:text-[#1b4327] dark:hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4 text-[#245934] dark:text-emerald-300" />
                <span>{t.navContacts}</span>
              </button>

              <button
                onClick={() => handleNavClick('users')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  activePage === 'users'
                    ? 'bg-[#153822] text-[#eec149] font-bold border border-[#eec149]/50 shadow-xs'
                    : 'text-slate-700 dark:text-emerald-100/80 hover:bg-emerald-50 dark:hover:bg-white/10 hover:text-[#1b4327] dark:hover:text-white'
                }`}
              >
                <Users className="w-4 h-4 text-[#245934] dark:text-emerald-300" />
                <span>{t.navUserManagement}</span>
              </button>

              <button
                onClick={() => handleNavClick('champion-apps')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  activePage === 'champion-apps'
                    ? 'bg-[#153822] text-[#eec149] font-bold border border-[#eec149]/50 shadow-xs'
                    : 'text-slate-700 dark:text-emerald-100/80 hover:bg-emerald-50 dark:hover:bg-white/10 hover:text-[#1b4327] dark:hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#b8860b] dark:text-[#eec149]" />
                <span>{t.navChampionApps}</span>
              </button>

              <button
                onClick={() => handleNavClick('contact-info')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  activePage === 'contact-info'
                    ? 'bg-[#153822] text-[#eec149] font-bold border border-[#eec149]/50 shadow-xs'
                    : 'text-slate-700 dark:text-emerald-100/80 hover:bg-emerald-50 dark:hover:bg-white/10 hover:text-[#1b4327] dark:hover:text-white'
                }`}
              >
                <PhoneCall className="w-4 h-4 text-[#245934] dark:text-emerald-300" />
                <span>{t.navContacts}</span>
              </button>
            </>
          )}
        </nav>

        {/* PWA App Install Action */}
        <div className="px-3 pb-2 pt-1">
          <PWAInstallButton variant="sidebar" />
        </div>

        {/* Bottom Profile and Logout Section */}
        <div className={`p-4 border-t ${isAdmin ? 'border-[#245934]/30 bg-emerald-50/70 dark:border-[#245934]/60 dark:bg-[#06120b]' : 'border-slate-200/80 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/80'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 p-0.5 border border-[#245934]/30 shadow-xs flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src={currentUser.avatar?.endsWith('.svg') || currentUser.avatar?.startsWith('data:') ? currentUser.avatar : '/asyv_emblem.svg'}
                  alt={currentUser.name}
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/asyv_emblem.svg'; }}
                />
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {currentUser.name} {currentUser.familyName ? currentUser.familyName : ''}
                </div>
                <div className="text-[11px] text-[#245934] dark:text-emerald-400 font-mono truncate">
                  {currentUser.email}
                </div>
              </div>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-amber-300 hover:scale-105 transition-all cursor-pointer shrink-0"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle color theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 rounded-xl transition-colors cursor-pointer"
            title="Log out from your account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out from Mind Bridge</span>
          </button>
        </div>
      </aside>
    </>
  );
};
