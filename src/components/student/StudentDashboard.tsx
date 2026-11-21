import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  AlertOctagon,
  BookOpen,
  Smile,
  FileCheck2,
  Sparkles,
  HelpCircle,
  Award,
  ArrowRight,
  Heart,
  LogOut,
  Calendar,
  CheckCircle2,
  RefreshCw,
  Quote,
  PhoneCall,
  KeyRound,
  Lock
} from 'lucide-react';
import { INSPIRING_EMOTIONAL_QUOTES } from '../../data/initialData';
import { KudosBoard } from './KudosBoard';
import { TRANSLATIONS } from '../../utils/i18n';
import { StudentPasswordChangeModal } from './StudentPasswordChangeModal';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    setActivePage,
    getSocialWorkerForGrade,
    assignments,
    messages,
    moodLogs,
    journalEntries,
    dailyQuestions,
    dailyAnswers,
    logout,
    announcements,
    contactInfo,
    language,
    appCustomization
  } = useApp();

  const [quoteIdx, setQuoteIdx] = useState<number>(0);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(() => {
    try {
      const dismissed = sessionStorage.getItem(`pwd_prompt_dismissed_${currentUser?.id}`);
      return !currentUser?.hasCustomPassword && !dismissed;
    } catch {
      return !currentUser?.hasCustomPassword;
    }
  });

  if (!currentUser || currentUser.role !== 'student') return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const currentQuote = INSPIRING_EMOTIONAL_QUOTES[quoteIdx % INSPIRING_EMOTIONAL_QUOTES.length];
  const displayQuote = appCustomization?.customInspirationalQuote && quoteIdx === 0
    ? appCustomization.customInspirationalQuote
    : currentQuote.quote[language] || currentQuote.quote.en;
  const displayAuthor = appCustomization?.customQuoteAuthor && quoteIdx === 0
    ? appCustomization.customQuoteAuthor
    : `${currentQuote.author} · ${currentQuote.sourceOrRole}`;

  const worker = getSocialWorkerForGrade(currentUser.grade);
  const myAssignments = assignments.filter(a => a.grade === currentUser.grade);
  const myCompletedAssignments = myAssignments.filter(a =>
    a.submissions.some(s => s.studentId === currentUser.id)
  );

  const activeAnnouncements = announcements.filter(
    a => a.active && (a.targetGrades === 'all' || (Array.isArray(a.targetGrades) && a.targetGrades.includes(currentUser.grade)))
  );

  const unreadFromWorker = messages.filter(
    m => m.receiverId === currentUser.id && m.senderRole === 'social_worker' && !m.isRead
  ).length;

  const todayMood = moodLogs.find(m => m.studentId === currentUser.id);
  const todayDailyQ = dailyQuestions.find(q => q.grade === currentUser.grade);
  const myDailyAnswer = todayDailyQ ? dailyAnswers.find(a => a.dailyQuestionId === todayDailyQ.id && a.studentId === currentUser.id) : null;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-emerald-400 mb-1">
            <span>{currentUser.grade} {t.grade}</span>
            <span>·</span>
            <span>{currentUser.schoolClass || 'ASYV Student'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
            {t.studentWelcomeTitle}, {currentUser.name}! 🌿
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
            {t.studentWelcomeSubtitle}
          </p>
        </div>

        {/* Assigned Social Worker Card or Psychosocial Desk fallback */}
        {worker ? (
          <div className="bg-teal-50/80 dark:bg-emerald-950/40 border border-teal-200/90 dark:border-emerald-800/60 rounded-2xl p-4 flex items-center gap-3.5 shrink-0 max-w-sm">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 p-1 border border-[#245934]/30 shadow-xs flex items-center justify-center shrink-0">
              <img
                src={worker.avatar?.endsWith('.svg') ? worker.avatar : '/asyv_emblem.svg'}
                alt={worker.name}
                className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).src = '/asyv_emblem.svg'; }}
              />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide text-teal-800 dark:text-emerald-300">
                {t.psychosocialWorkerTitle}
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {worker.name}
              </div>
              <button
                onClick={() => setActivePage('chat')}
                className="mt-1 text-xs text-teal-700 dark:text-emerald-400 hover:text-teal-900 dark:hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>{t.privateMessageBtn}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/60 rounded-2xl p-4 flex items-center gap-3.5 shrink-0 max-w-sm">
            <div className="w-11 h-11 rounded-xl bg-[#245934] text-white flex items-center justify-center font-bold shadow-xs">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide text-[#245934] dark:text-emerald-400">
                {t.villageSupportDesk}
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Main Support Center
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Hotline: {contactInfo.hotlinePhone}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* STUDENT PASSWORD CHANGE PROMPT BANNER */}
      <div className={`p-4 sm:p-5 rounded-3xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs ${
        !currentUser.hasCustomPassword
          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/80 text-amber-950 dark:text-amber-100'
          : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-200'
      }`}>
        <div className="flex items-start sm:items-center gap-3.5">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
            !currentUser.hasCustomPassword
              ? 'bg-amber-200/80 dark:bg-amber-900/70 text-amber-900 dark:text-amber-300'
              : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
          }`}>
            <KeyRound className="w-5 h-5 text-[#245934] dark:text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                !currentUser.hasCustomPassword
                  ? 'bg-amber-300 text-amber-950 font-black'
                  : 'bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100'
              }`}>
                {!currentUser.hasCustomPassword ? 'Password Action Needed' : 'Account Security'}
              </span>
              <span className="text-xs font-bold">
                {!currentUser.hasCustomPassword ? 'Update Your Initial Default Password' : 'Your Personal Password is Set'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {!currentUser.hasCustomPassword
                ? 'Welcome to Mind Bridge! Please set your new personal password so you can use it next time you sign in.'
                : 'You have updated your personal password. You can change your password anytime here.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowPasswordModal(true)}
          className="px-5 py-2.5 bg-[#245934] hover:bg-[#1b4327] text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Lock className="w-4 h-4 text-[#eec149]" />
          <span>Change Password</span>
        </button>
      </div>

      {/* MOTIVATING COURT & EMOTIONAL SUPPORT BANNER */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#1b4327] via-[#245934] to-[#122e1b] text-white shadow-sm relative overflow-hidden group">
        <div className="absolute right-2 -bottom-2 opacity-10 pointer-events-none">
          <Quote className="w-28 h-28" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#eec149] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-[#eec149] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#eec149]" />
              <span>{t.courtOfInspiration}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setQuoteIdx((prev) => (prev + 1) % INSPIRING_EMOTIONAL_QUOTES.length)}
            className="text-xs font-bold text-emerald-100 hover:text-white flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl cursor-pointer transition-colors w-fit border border-white/10"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t.inspireAnotherCourt}</span>
          </button>
        </div>

        <p className="text-sm sm:text-base font-medium italic leading-relaxed text-amber-50 mb-2">
          "{displayQuote}"
        </p>

        <div className="text-xs text-emerald-200 font-semibold flex items-center justify-between pt-1 border-t border-white/10">
          <span>— {displayAuthor}</span>
          <span className="text-[10px] uppercase font-bold text-[#eec149]">ASYV Sanctuary</span>
        </div>
      </div>

      {/* Official Village Announcements (Broadcasted by Admin / Worker) */}
      {activeAnnouncements.length > 0 && (
        <div className="space-y-3">
          {activeAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className={`p-4 rounded-2xl border flex items-start gap-3 shadow-xs ${
                ann.category === 'urgent'
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-[#1b4327] dark:text-emerald-200'
              }`}
            >
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shrink-0 shadow-2xs">
                <Sparkles className="w-4 h-4 text-[#d95f18]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {ann.category}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{ann.title}</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                  {ann.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Emergency Alert Quick Banner */}
      <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
            <AlertOctagon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-rose-900 dark:text-rose-200">
              {t.urgentHelpBannerTitle}
            </h2>
            <p className="text-xs text-rose-700 dark:text-rose-300">
              {t.urgentHelpBannerSubtitle}
            </p>
          </div>
        </div>
        <button
          onClick={() => setActivePage('emergency')}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-xs cursor-pointer"
        >
          {t.sendSosBtn}
        </button>
      </div>

      {/* Quick Action Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Chat Card */}
        <div
          onClick={() => setActivePage('chat')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-teal-500 dark:hover:border-emerald-500 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-emerald-950/60 text-teal-700 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            {unreadFromWorker > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-teal-600 text-white rounded-full">
                {unreadFromWorker} {t.pending}
              </span>
            )}
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
            {t.directWorkerChatTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {t.directWorkerChatDesc}
          </p>
        </div>

        {/* Daily Reflection */}
        <div
          onClick={() => setActivePage('daily-question')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-teal-500 dark:hover:border-emerald-500 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <HelpCircle className="w-5 h-5" />
            </div>
            {myDailyAnswer ? (
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {t.completed}
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                {t.pending}
              </span>
            )}
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
            {t.dailyPromptCardTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {t.dailyPromptCardDesc}
          </p>
        </div>

        {/* Journal Card */}
        <div
          onClick={() => setActivePage('journal')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-teal-500 dark:hover:border-emerald-500 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              {journalEntries.filter(j => j.studentId === currentUser.id).length} Stories
            </span>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
            {t.journalCardTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {t.journalCardDesc}
          </p>
        </div>

        {/* Mood Tracker */}
        <div
          onClick={() => setActivePage('mood-tracker')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-teal-500 dark:hover:border-emerald-500 hover:shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Smile className="w-5 h-5" />
            </div>
            {todayMood && (
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                {todayMood.moodEmoji} {todayMood.mood}
              </span>
            )}
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
            {t.moodTrackerCardTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {t.moodTrackerCardDesc}
          </p>
        </div>
      </div>

      {/* Secondary Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Assignments & Quizzes */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-display">
                {t.assignmentsCardTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.assignmentsCardDesc}
              </p>
            </div>
            <button
              onClick={() => setActivePage('assessments')}
              className="text-xs font-bold text-teal-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{t.viewAll}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {myAssignments.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
              <p className="font-semibold text-slate-700 dark:text-slate-200">{t.completed}</p>
              <p className="text-xs text-slate-400 mt-1">{t.assignmentsCardDesc}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myAssignments.slice(0, 2).map((a) => {
                const isDone = a.submissions.some(s => s.studentId === currentUser.id);
                return (
                  <div
                    key={a.id}
                    onClick={() => setActivePage('assessments')}
                    className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 hover:border-teal-400 dark:hover:border-emerald-500 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{a.title}</h3>
                        <span className="text-[11px] text-slate-400">·</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Due {a.dueDate}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {a.instructions}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {isDone ? (
                        <span className="px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 rounded-lg flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {t.completed}
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 text-xs font-bold text-teal-700 dark:text-emerald-400 bg-teal-50 dark:bg-emerald-950/40 border border-teal-200 dark:border-emerald-800 rounded-lg">
                          {t.submit}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Mental Champion Status */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-slate-900 dark:to-slate-900 rounded-3xl p-6 border border-amber-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-200 dark:bg-amber-950/70 text-amber-800 dark:text-amber-400 flex items-center justify-center mb-3">
              <Award className="w-5 h-5 text-amber-800 dark:text-amber-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-display">
              {t.championsCardTitle}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              {t.championsCardDesc}
            </p>

            <div className="mt-4 pt-4 border-t border-amber-200/60 dark:border-slate-800">
              {currentUser.isMentalChampion || currentUser.championStatus === 'approved' ? (
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Verified Mental Champion</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    You have verified champion access to wellness courses, timetables, and peer circles.
                  </p>
                  <button
                    onClick={() => setActivePage('champion-portal')}
                    className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    Open Champions Portal
                  </button>
                </div>
              ) : currentUser.championStatus === 'pending' ? (
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-lg text-xs font-bold">
                    <span>Application Pending Approval</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Your request was received and is currently being reviewed by your psychosocial worker ({worker ? worker.name : 'Worker'}).
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Interested in becoming a peer listener and leading wellness sessions in your grade?
                  </p>
                  <button
                    onClick={() => setActivePage('champion-apply')}
                    className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Apply to Join Champions
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 text-[11px] text-amber-900/70 dark:text-amber-400 font-medium">
            ASYV Healing & Peer Solidarity
          </div>
        </div>
      </div>

      {/* Anonymous Encouragement & Kudos Board */}
      <KudosBoard />

      {/* ASYV Village Colors, Inspiring Quotes & Mental Wellbeing Showcase */}
      <div className="bg-gradient-to-r from-emerald-50 via-amber-50/50 to-orange-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 rounded-3xl p-6 sm:p-7 border border-[#245934]/20 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-13 h-13 rounded-2xl bg-[#245934] text-white flex items-center justify-center shrink-0 shadow-md">
            <Sparkles className="w-7 h-7 text-[#eec149]" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#d95f18] dark:text-[#f28e2b]">
                ASYV Harmony & Healing Hub
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-[#245934]/10 dark:bg-emerald-950/60 text-[#245934] dark:text-emerald-300 rounded-full">
                7 Authentic Village Colors
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 font-display">
              {t.colorsHubTitle}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              {t.colorsHubDesc}
            </p>

            {/* Quick Palette Preview Dots */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 mr-1">Palette:</span>
              <span className="w-3.5 h-3.5 rounded-full bg-[#245934] shadow-xs" title="Acacia Forest Green" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#d95f18] shadow-xs" title="Terracotta Sunburst" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#f59e0b] shadow-xs" title="Liquidnet Solar Gold" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#0284c7] shadow-xs" title="Lake Muhazi Azure" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#7c3aed] shadow-xs" title="Jacaranda Royal Purple" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#0d9488] shadow-xs" title="Eucalyptus Mindful Sage" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#e11d48] shadow-xs" title="Agahozo Coral Rose" />
            </div>
          </div>
        </div>

        <button
          onClick={() => setActivePage('wellbeing-hub')}
          className="px-5 py-3 bg-[#245934] hover:bg-[#1b4327] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shrink-0 cursor-pointer shadow-xs hover:shadow-md flex items-center gap-2"
        >
          <span>{t.openColorsHubBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Tips Explorer Teaser */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-emerald-950/60 text-teal-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
              {t.tipsTeaserTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.tipsTeaserDesc}
            </p>
          </div>
        </div>
        <button
          onClick={() => setActivePage('tips')}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors shrink-0 cursor-pointer"
        >
          {t.exploreTipsBtn}
        </button>
      </div>

      {/* Official ASYV Village Support Contacts Banner (Links to dedicated Village Contact page) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#245934] dark:text-emerald-400">
          <span className="uppercase tracking-wider flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{t.villageSupportDesk}</span>
          </span>
          <button
            onClick={() => setActivePage('contact-info')}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">{t.emergencyHotlineLabel}</div>
            <div className="font-bold text-slate-900 dark:text-slate-100 font-mono mt-0.5">{contactInfo.hotlinePhone}</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">{t.whatsappCrisisLabel}</div>
            <div className="font-bold text-slate-900 dark:text-slate-100 font-mono mt-0.5">{contactInfo.whatsappPhone}</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">{t.healthClinicLabel}</div>
            <div className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">{contactInfo.clinicExtension}</div>
          </div>
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 flex items-center justify-between">
          <span>Office: {contactInfo.officeLocation}</span>
          <span>Lead: {contactInfo.counselorLead}</span>
        </div>
      </div>

      {/* Explicit Logout Button at the end of the dashboard page */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-center">
        <button
          onClick={logout}
          className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-900 text-slate-700 dark:text-slate-300 hover:text-rose-700 dark:hover:text-rose-400 font-bold rounded-2xl text-sm transition-all shadow-xs cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>{t.logout}</span>
        </button>
      </div>

      {/* Student Password Change Modal */}
      <StudentPasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          try {
            sessionStorage.setItem(`pwd_prompt_dismissed_${currentUser.id}`, '1');
          } catch {}
        }}
      />
    </div>
  );
};
