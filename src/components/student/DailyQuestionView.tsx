import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HelpCircle,
  CheckCircle2,
  Send,
  Calendar,
  Clock,
  Sparkles,
  Heart,
  MessageCircle,
  Check
} from 'lucide-react';
import { TRANSLATIONS } from '../../utils/i18n';

export const DailyQuestionView: React.FC = () => {
  const {
    currentUser,
    dailyQuestions,
    dailyAnswers,
    answerDailyQuestion,
    getSocialWorkerForGrade,
    language
  } = useApp();

  const [answerInput, setAnswerInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  if (!currentUser || currentUser.role !== 'student') return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const worker = getSocialWorkerForGrade(currentUser.grade);
  const currentDailyQ = dailyQuestions.find(q => q.grade === currentUser.grade);
  const myAnswer = currentDailyQ
    ? dailyAnswers.find(a => a.dailyQuestionId === currentDailyQ.id && a.studentId === currentUser.id)
    : null;

  const myPastAnswers = dailyAnswers.filter(a => a.studentId === currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDailyQ || !answerInput.trim()) return;

    setIsSubmitting(true);
    try {
      answerDailyQuestion(currentDailyQ.id, answerInput.trim());
      setAnswerInput('');
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#245934] dark:text-emerald-400 mb-1">
          <span>{currentUser.grade} {t.grade}</span>
          <span>·</span>
          <span>{t.navDailyReflection}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
          {t.dailyQuestionTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
          {t.dailyQuestionSubtitle}
        </p>
      </div>

      {/* Celebratory Success Toast / Banner when submitted */}
      {showCelebration && (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#1b4327] to-[#245934] text-white rounded-3xl shadow-xl flex items-center justify-between gap-4 border border-emerald-400/40 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/25 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-[#eec149] animate-bounce" />
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                <span>Reflection Submitted Beautifully!</span>
                <span className="text-[#eec149]">✨</span>
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                Your Grade Counselor ({worker?.name || 'Social Worker'}) has received your response. Thank you for sharing your heart today!
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCelebration(false)}
            className="text-xs text-white/80 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Today's Question Card */}
      {currentDailyQ ? (
        <div className="bg-gradient-to-br from-amber-50/70 via-white to-emerald-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 rounded-3xl p-6 sm:p-8 border border-amber-200/80 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
          <div className="flex items-center justify-between">
            <span className="px-3.5 py-1 bg-[#eec149]/20 text-amber-900 dark:text-amber-300 rounded-full text-xs font-bold border border-[#eec149]/40 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{t.dailyPromptCardTitle}</span>
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-semibold">
              Asked by {currentDailyQ.socialWorkerName || worker?.name || 'Social Worker'}
            </span>
          </div>

          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-display leading-snug">
            "{currentDailyQ.question}"
          </div>

          {currentDailyQ.contextNote && (
            <div className="p-4 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-amber-100 dark:border-slate-700 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
              💡 {currentDailyQ.contextNote}
            </div>
          )}

          {myAnswer ? (
            <div className="p-6 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <span className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span>{t.alreadyAnswered}</span>
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-mono text-xs">
                  {new Date(myAnswer.answeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(myAnswer.answeredAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed pl-8 font-medium">
                “{myAnswer.answer}”
              </p>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 pl-8 pt-1 flex items-center gap-1 font-semibold">
                <Heart className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                <span>Delivered directly to {worker?.name || 'your Social Worker'}'s confidential desk</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.yourReflectionLabel}
                </label>
                <textarea
                  required
                  rows={4}
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  placeholder="Take a deep breath and share your authentic answer with your counselor..."
                  className="w-full p-4 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-2xl focus:border-[#245934] dark:focus:border-emerald-500 focus:ring-1 focus:ring-[#245934] outline-hidden leading-relaxed shadow-inner"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-[#d95f18]" />
                  <span>Confidential to your ASYV grade counseling desk</span>
                </div>

                <button
                  type="submit"
                  disabled={!answerInput.trim() || isSubmitting}
                  className="px-6 py-2.5 bg-[#245934] hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 shadow-sm hover:shadow-md active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting...' : t.submitReflectionBtn}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm space-y-2">
          <MessageCircle className="w-8 h-8 mx-auto text-slate-400 mb-2" />
          <div className="font-bold text-slate-800 dark:text-slate-200">
            No daily question set yet for {currentUser.grade} Grade today
          </div>
          <p className="text-xs max-w-sm mx-auto">
            Your grade counselor ({worker?.name || 'Social Worker'}) updates questions daily. Check back during evening circle or morning meeting!
          </p>
        </div>
      )}

      {/* History of Past Answers */}
      {myPastAnswers.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Your Previous Village Reflections ({myPastAnswers.length})</span>
          </div>
          <div className="space-y-3">
            {myPastAnswers.map((ans, idx) => (
              <div
                key={`${ans.id}-${idx}`}
                className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm shadow-2xs space-y-1.5"
              >
                <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 text-xs font-mono">
                  <span>{new Date(ans.answeredAt).toLocaleDateString()}</span>
                  <span>{new Date(ans.answeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {ans.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
