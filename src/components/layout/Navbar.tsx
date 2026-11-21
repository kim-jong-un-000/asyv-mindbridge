import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  Bell,
  Shield,
  LogOut,
  ArrowLeft,
  AlertTriangle,
  PhoneCall,
  Globe,
  Sparkles,
  Check,
  CheckCircle2,
  X,
  MessageSquare,
  FileCheck2,
  Clock,
  ExternalLink,
  Sun,
  Moon
} from 'lucide-react';
import { ASSETS } from '../../utils/assets';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface NotificationItem {
  id: string;
  type: 'message' | 'sos' | 'assignment' | 'todo';
  title: string;
  description: string;
  timestamp: string;
  targetPage: string;
  senderId?: string;
  isCritical?: boolean;
}

export const Navbar: React.FC = () => {
  const {
    currentUser,
    activePage,
    goBack,
    goToHome,
    logout,
    messages,
    markMessagesRead,
    activeSosAlerts,
    assignments,
    todos,
    setActivePage,
    language,
    setLanguage,
    appCustomization,
    theme,
    toggleTheme
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('mindbridge_dismissed_notifs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  // Build real notification items based on user role and state
  const rawNotifs: NotificationItem[] = [];

  // 1. Unread chat messages
  const unreadMessages = messages.filter(
    m => m.receiverId === currentUser.id && !m.isRead
  );
  unreadMessages.forEach(m => {
    rawNotifs.push({
      id: `notif-msg-${m.id}`,
      type: 'message',
      title: `Message from ${m.senderName}`,
      description: m.content,
      timestamp: m.timestamp,
      targetPage: 'chat',
      senderId: m.senderId
    });
  });

  // 2. Active SOS Alerts (Social Worker / Admin)
  if (currentUser.role === 'social_worker' || currentUser.role === 'developer') {
    const relevantSos = currentUser.role === 'social_worker'
      ? activeSosAlerts.filter(a => a.grade === currentUser.grade)
      : activeSosAlerts;

    relevantSos.forEach(sos => {
      rawNotifs.push({
        id: `notif-sos-${sos.id}`,
        type: 'sos',
        title: `🚨 SOS from ${sos.studentName} (${sos.studentClass})`,
        description: sos.message,
        timestamp: sos.timestamp,
        targetPage: 'sos-alerts',
        isCritical: true
      });
    });
  }

  // 3. Assignments Notifications
  if (currentUser.role === 'student') {
    const myGradeAssignments = assignments.filter(a => a.grade === currentUser.grade);
    const uncompleted = myGradeAssignments.filter(
      a => !a.submissions.some(s => s.studentId === currentUser.id)
    );

    uncompleted.forEach(a => {
      rawNotifs.push({
        id: `notif-assign-${a.id}`,
        type: 'assignment',
        title: `Assignment: ${a.title}`,
        description: `Due date: ${a.dueDate}. Complete questionnaire for your grade counselor.`,
        timestamp: a.createdAt,
        targetPage: 'assessments'
      });
    });
  } else if (currentUser.role === 'social_worker') {
    // Recent submissions for social worker's grade
    const myAssignments = assignments.filter(a => a.grade === currentUser.grade);
    myAssignments.forEach(a => {
      a.submissions.forEach(sub => {
        rawNotifs.push({
          id: `notif-sub-${sub.id}`,
          type: 'assignment',
          title: `Submission from ${sub.studentName}`,
          description: `Submitted answers for "${a.title}".`,
          timestamp: sub.submittedAt,
          targetPage: 'dashboard'
        });
      });
    });
  }

  // 4. Approaching Tasks / Planner (Social Worker)
  if (currentUser.role === 'social_worker') {
    const myApproachingTodos = todos.filter(t => {
      if (t.workerId !== currentUser.id || t.isCompleted) return false;
      if (t.priority === 'high') return true;
      if (!t.dueDate) return false;
      const diff = (new Date(t.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
      return diff <= 2;
    });

    myApproachingTodos.forEach(t => {
      rawNotifs.push({
        id: `notif-todo-${t.id}`,
        type: 'todo',
        title: `Approaching Task: ${t.title}`,
        description: `Priority: ${t.priority} · Due: ${t.dueDate || 'Today'}`,
        timestamp: t.createdAt,
        targetPage: 'todo'
      });
    });
  }

  // Filter out dismissed notifications
  const activeNotifs = rawNotifs.filter(n => !dismissedIds.includes(n.id));

  const handleDismissNotification = (notif: NotificationItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextDismissed = [...dismissedIds, notif.id];
    setDismissedIds(nextDismissed);
    try {
      localStorage.setItem('mindbridge_dismissed_notifs', JSON.stringify(nextDismissed));
    } catch {}

    if (notif.type === 'message' && notif.senderId) {
      markMessagesRead(notif.senderId);
    }
  };

  const handleClearAllNotifs = () => {
    const allIds = rawNotifs.map(n => n.id);
    const updated = Array.from(new Set([...dismissedIds, ...allIds]));
    setDismissedIds(updated);
    try {
      localStorage.setItem('mindbridge_dismissed_notifs', JSON.stringify(updated));
    } catch {}

    // Also mark all message senders read
    rawNotifs.forEach(n => {
      if (n.type === 'message' && n.senderId) {
        markMessagesRead(n.senderId);
      }
    });
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    handleDismissNotification(notif, { stopPropagation: () => {} } as any);
    setActivePage(notif.targetPage);
    setIsNotifOpen(false);
  };

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard': return 'Dashboard';
      case 'wellbeing-hub': return 'ASYV Colors & Wellbeing Hub';
      case 'chat': return 'Direct Psychosocial Chat';
      case 'emergency': return 'Emergency Support SOS';
      case 'contact-info': return 'Village Support & Contacts';
      case 'journal': return 'Personal Story & Journal';
      case 'mood-tracker': return 'Mood & Wellbeing Tracker';
      case 'assessments': return 'Assignments & Reflections';
      case 'daily-question': return 'Daily Grade Reflection';
      case 'tips': return 'Living & Wellbeing Resources';
      case 'champion-portal': return 'Mental Champions Hub';
      case 'champion-apply': return 'Champion Application';
      case 'students': return `${currentUser?.grade} Students Directory`;
      case 'todo': return 'Social Worker Action Planner';
      case 'timetable': return 'Champions Session Timetable';
      case 'lessons': return 'Wellness Lessons & Guides';
      case 'champion-apps': return 'Champion Applications';
      case 'users': return 'All Registered Users';
      case 'admin-settings': return 'System & Contact Settings';
      default: return 'Overview';
    }
  };

  const getRoleLabel = () => {
    if (!currentUser) return '';
    if (currentUser.role === 'developer') return 'Master Administrator · All Grades';
    if (currentUser.role === 'social_worker') return `Grade Leader · ${currentUser.grade}`;
    if (currentUser.isMentalChampion) return `Student & Mental Champion · ${currentUser.grade}`;
    return `Student · ${currentUser.grade}`;
  };

  const isAdmin = currentUser?.role === 'developer';

  return (
    <header className={`sticky top-0 z-40 ${isAdmin ? 'bg-[#081810] border-b border-[#245934]/70 text-slate-100' : 'bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800'} px-4 sm:px-6 py-2.5 transition-colors shadow-xs`}>
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Zone 1: ASYV Emblem + Brand wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={goToHome}
            className="flex items-center gap-2.5 text-left group focus-visible:outline-hidden cursor-pointer"
            title="Return to Dashboard Home"
          >
            <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center p-0.5 border border-[#245934]/30 shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <img
                src={ASSETS.emblem}
                alt="ASYV Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-[#1b4327] dark:text-[#eec149] group-hover:text-[#245934] transition-colors block leading-tight font-display">
                {appCustomization?.portalTitle || 'Mind Bridge'}
              </span>
              <span className="text-[11px] text-[#d95f18] font-bold hidden sm:block">
                {appCustomization?.portalSubtitle || 'The Agahozo Shalom Youth Village'}
              </span>
            </div>
          </button>

          {/* Quick Back Button if not on home dashboard */}
          {activePage !== 'dashboard' && (
            <button
              onClick={goBack}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer ml-2"
              title="Return to previous page"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
        </div>

        {/* Zone 2: Context breadcrumbs */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="text-slate-400 dark:text-slate-500">Village Hub</span>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="text-[#245934] dark:text-emerald-400 font-semibold">{currentUser?.grade || 'General'}</span>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">{getPageTitle()}</span>
        </div>

        {/* Zone 3: Active user profile & actions */}
        <div className="flex items-center gap-2">
          {currentUser && (
            <>
              {/* Emergency Alert indicator for social worker */}
              {currentUser.role === 'social_worker' && activeSosAlerts.length > 0 && (
                <button
                  onClick={() => setActivePage('sos-alerts')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100 rounded-lg text-xs font-bold animate-pulse cursor-pointer transition-colors"
                  title="Urgent Student SOS Alert"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>{activeSosAlerts.length} SOS</span>
                </button>
              )}


              {/* PWA In-App Install Button for Mobile & Desktop Worldwide Access */}
              <PWAInstallButton variant="nav" />

              {/* Language Selector */}
              <div className="relative flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 text-slate-700 dark:text-slate-200 shadow-xs">
                <Globe className="w-3.5 h-3.5 text-[#245934] dark:text-emerald-400 shrink-0" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="text-xs font-bold bg-transparent text-slate-700 dark:text-slate-200 cursor-pointer outline-hidden pr-1"
                  title="Select Interface Language"
                >
                  <option value="en" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">🇬🇧 English</option>
                  <option value="rw" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">🇷🇼 Ikinyarwanda</option>
                  <option value="fr" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">🇫🇷 Français</option>
                </select>
              </div>

              {/* Theme Mode Toggle (Light / Dark) */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-300 hover:scale-105 transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                aria-label="Toggle light or dark theme"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span className="hidden xl:inline text-xs font-bold text-slate-200">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-slate-600" />
                    <span className="hidden xl:inline text-xs font-bold text-slate-700">Dark</span>
                  </>
                )}
              </button>

              {/* ASYV Colors, Wisdom & Wellbeing Hub Quick Link */}
              <button
                onClick={() => setActivePage('wellbeing-hub')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activePage === 'wellbeing-hub'
                    ? 'bg-[#245934] dark:bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-[#1b4327] dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800'
                }`}
                title="Explore ASYV Village Colors, Inspiring Quotes & Wellbeing Tools"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#d95f18]" />
                <span className="hidden md:inline">ASYV Colors & Wellbeing</span>
              </button>

              {/* Village Contact & Help Quick Link */}
              <button
                onClick={() => setActivePage('contact-info')}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  activePage === 'contact-info'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#245934] dark:text-emerald-400'
                    : 'text-slate-500 hover:text-[#245934] dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="ASYV Psychosocial Office & Emergency Contacts"
              >
                <PhoneCall className="w-4.5 h-4.5" />
              </button>

              {/* INTERACTIVE NOTIFICATION BELL WITH DROPDOWN */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className={`relative p-2 rounded-xl transition-all cursor-pointer ${
                    isNotifOpen
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-[#1b4327] dark:text-emerald-300'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Notifications & Unseen Items"
                >
                  <Bell className="w-4.5 h-4.5" />
                  {activeNotifs.length > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#d95f18] text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-xs animate-bounce">
                      {activeNotifs.length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-fadeIn">
                    <div className="p-4 bg-gradient-to-r from-[#1b4327] to-[#245934] text-white flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#eec149]" />
                        <span className="font-extrabold text-sm">Notifications & Unseen Items</span>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                        {activeNotifs.length} new
                      </span>
                    </div>

                    {/* Actions bar */}
                    {activeNotifs.length > 0 && (
                      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Click item to view or click "Seen"</span>
                        <button
                          type="button"
                          onClick={handleClearAllNotifs}
                          className="font-bold text-[#245934] dark:text-emerald-400 hover:text-[#d95f18] transition-colors cursor-pointer"
                        >
                          Mark all as seen
                        </button>
                      </div>
                    )}

                    {/* Notification list */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                      {activeNotifs.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 dark:text-slate-500 space-y-2">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">All caught up!</p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">No unseen notifications or pending alerts.</p>
                        </div>
                      ) : (
                        activeNotifs.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer flex items-start justify-between gap-3 group"
                          >
                            <div className="flex items-start gap-2.5">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                                n.isCritical
                                  ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400'
                                  : n.type === 'message'
                                  ? 'bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300'
                                  : n.type === 'assignment'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                              }`}>
                                {n.type === 'message' && <MessageSquare className="w-4 h-4" />}
                                {n.type === 'sos' && <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
                                {n.type === 'assignment' && <FileCheck2 className="w-4 h-4" />}
                                {n.type === 'todo' && <Clock className="w-4 h-4" />}
                              </div>

                              <div className="space-y-0.5 pr-2">
                                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#245934] dark:group-hover:text-emerald-400 transition-colors leading-snug">
                                  {n.title}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                  {n.description}
                                </div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                                  {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => handleDismissNotification(n, e)}
                              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-slate-600 dark:text-slate-300 hover:text-[#1b4327] dark:hover:text-emerald-300 rounded-lg text-[10px] font-bold transition-colors cursor-pointer shrink-0 border border-slate-200 dark:border-slate-700"
                              title="Mark this item as seen"
                            >
                              Seen
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Identity Pill */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 p-0.5 border border-[#245934]/30 shadow-xs flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={currentUser.avatar?.endsWith('.svg') || currentUser.avatar?.startsWith('data:') ? currentUser.avatar : '/asyv_emblem.svg'}
                    alt={currentUser.name}
                    className="w-full h-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/asyv_emblem.svg'; }}
                  />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {currentUser.name} {currentUser.familyName ? currentUser.familyName : ''}
                  </p>
                  <p className="text-[11px] text-[#245934] dark:text-emerald-400 font-medium">
                    {getRoleLabel()}
                  </p>
                </div>
              </div>

              {/* Logout Button in Navbar */}
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                title="Log out of Mind Bridge"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
