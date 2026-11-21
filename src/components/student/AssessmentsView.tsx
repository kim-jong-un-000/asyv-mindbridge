import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Assignment } from '../../types';
import {
  FileCheck2,
  Calendar,
  CheckCircle2,
  Clock,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Heart,
  Check,
  Send,
  BookOpen,
  Award,
  X,
  LayoutDashboard,
  ShieldCheck
} from 'lucide-react';

export const AssessmentsView: React.FC = () => {
  const {
    currentUser,
    assignments,
    submitAssignment,
    getSocialWorkerForGrade,
    setActivePage
  } = useApp();

  const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [qId: string]: { text?: string; optionIndex?: number } }>({});
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showCompletionTopUp, setShowCompletionTopUp] = useState<boolean>(false);
  const [completedDetails, setCompletedDetails] = useState<{
    title: string;
    workerName: string;
    count: number;
    submittedAt: string;
  } | null>(null);

  if (!currentUser || currentUser.role !== 'student') return null;

  const worker = getSocialWorkerForGrade(currentUser.grade);
  const gradeAssignments = assignments.filter(a => a.grade === currentUser.grade);

  const activeAssignment = gradeAssignments.find(a => a.id === activeAssignmentId);

  const handleSelectAssignment = (assign: Assignment) => {
    setActiveAssignmentId(assign.id);
    setSubmitSuccess(false);

    // If already submitted, pre-fill answers
    const existingSub = assign.submissions.find(s => s.studentId === currentUser.id);
    if (existingSub) {
      const initAnswers: { [qId: string]: { text?: string; optionIndex?: number } } = {};
      existingSub.answers.forEach(ans => {
        initAnswers[ans.questionId] = {
          text: ans.answerText,
          optionIndex: ans.selectedOption
        };
      });
      setAnswers(initAnswers);
    } else {
      setAnswers({});
    }
  };

  const handleOptionChange = (qId: string, index: number) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: { ...prev[qId], optionIndex: index }
    }));
  };

  const handleTextChange = (qId: string, text: string) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: { ...prev[qId], text }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignment) return;

    setIsSubmitting(true);
    try {
      const formatted = activeAssignment.questions.map(q => ({
        questionId: q.id,
        answerText: answers[q.id]?.text || '',
        selectedOption: answers[q.id]?.optionIndex
      }));

      submitAssignment(activeAssignment.id, formatted);
      setSubmitSuccess(true);
      setCompletedDetails({
        title: activeAssignment.title,
        workerName: activeAssignment.creatorName || (worker ? worker.name : 'Social Worker'),
        count: activeAssignment.questions.length,
        submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setShowCompletionTopUp(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#245934] dark:text-emerald-400 mb-1">
          <span>{currentUser.grade} Grade Academics & Wellness</span>
          <span>·</span>
          <span>Psychosocial Questionnaires</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          Assessments & Reflective Quizzes
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
          Complete questionnaires and wellness check-ins prepared by your grade psychosocial worker ({worker ? worker.name : 'Social Worker'}).
        </p>
      </div>

      {/* Main Container */}
      {gradeAssignments.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 space-y-3">
          <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <FileCheck2 className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-display">
            There is no assignment or assessment currently
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Your {currentUser.grade} Grade social worker has not published any open assessments right now. When an assessment is given, it will be immediately updated and put here for you to complete.
          </p>
        </div>
      ) : activeAssignment ? (
        /* Active Assessment Taking View */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <button
                type="button"
                onClick={() => {
                  setActiveAssignmentId(null);
                  setSubmitSuccess(false);
                }}
                className="text-xs font-bold text-[#245934] dark:text-emerald-400 hover:underline flex items-center gap-1 mb-1.5 cursor-pointer"
              >
                ← Back to All Questionnaires
              </button>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                {activeAssignment.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Prepared by: <strong className="text-slate-700 dark:text-slate-300">{activeAssignment.creatorName}</strong> · Due Date: <span className="font-mono">{activeAssignment.dueDate}</span>
              </p>
            </div>
            {activeAssignment.submissions.some(s => s.studentId === currentUser.id) && (
              <span className="px-3.5 py-1.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto border border-emerald-300 dark:border-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Submitted</span>
              </span>
            )}
          </div>

          <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-4 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#eec149] shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Instructions:</strong> {activeAssignment.instructions}
            </div>
          </div>

          {/* Celebration Success Banner upon submission */}
          {submitSuccess && (
            <div className="p-6 bg-gradient-to-br from-[#1b4327] to-[#245934] text-white rounded-3xl shadow-xl space-y-3 border border-emerald-400/40 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/25 flex items-center justify-center shrink-0">
                  <Check className="w-7 h-7 stroke-[3] text-[#eec149]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black font-display text-white">
                    Questionnaire Submitted Successfully!
                  </h3>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    Your answers have been safely delivered to <strong>{activeAssignment.creatorName}</strong>. Thank you for your authentic responses!
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveAssignmentId(null)}
                  className="px-4 py-2 bg-white text-[#1b4327] rounded-xl text-xs font-bold hover:bg-emerald-50 shadow-md cursor-pointer transition-colors"
                >
                  Return to Questionnaires List
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {activeAssignment.questions.map((q, qIndex) => (
              <div
                key={q.id}
                className="p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3.5 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-xl bg-[#245934] dark:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs">
                    {qIndex + 1}
                  </span>
                  <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug pt-0.5">
                    {q.prompt}
                  </div>
                </div>

                {q.type === 'multiple_choice' && q.options && (
                  <div className="space-y-2.5 pl-0 sm:pl-10 pt-1">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = answers[q.id]?.optionIndex === optIndex;
                      return (
                        <label
                          key={optIndex}
                          className={`flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-semibold shadow-xs ring-1 ring-emerald-500'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${q.id}`}
                            checked={isSelected}
                            onChange={() => handleOptionChange(q.id, optIndex)}
                            className="accent-[#245934] dark:accent-emerald-400 w-4 h-4 cursor-pointer"
                          />
                          <span className="text-xs sm:text-sm leading-relaxed">{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {q.type === 'open_ended' && (
                  <div className="pl-0 sm:pl-10 pt-1">
                    <textarea
                      rows={4}
                      value={answers[q.id]?.text || ''}
                      onChange={(e) => handleTextChange(q.id, e.target.value)}
                      placeholder="Share your personal thoughts and reflections here..."
                      className="w-full p-4 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-2xl focus:border-[#245934] dark:focus:border-emerald-400 focus:ring-1 focus:ring-[#245934] outline-hidden leading-relaxed shadow-inner"
                    />
                  </div>
                )}
              </div>
            ))}

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setActiveAssignmentId(null);
                  setSubmitSuccess(false);
                }}
                className="px-5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Close Questionnaire
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-3 bg-[#245934] hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving...' : 'Submit Questionnaire Answers'}</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* List of active grade assignments */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gradeAssignments.map((a) => {
            const isDone = a.submissions.some(s => s.studentId === currentUser.id);

            return (
              <div
                key={a.id}
                onClick={() => handleSelectAssignment(a)}
                className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-[#245934] dark:hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between group hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold">
                      {a.questions.length} Question{a.questions.length > 1 ? 's' : ''}
                    </span>
                    {isDone ? (
                      <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-emerald-300 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Submitted
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 rounded-lg text-xs font-bold">
                        Pending Submission
                      </span>
                    )}
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#245934] dark:group-hover:text-emerald-400 transition-colors font-display">
                    {a.title}
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {a.instructions}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Due {a.dueDate}</span>
                  </div>
                  <span className="font-bold text-[#245934] dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>{isDone ? 'Review / Edit' : 'Open Questionnaire'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TOP-UP POPUP: ASSESSMENT COMPLETION CONFIRMATION MODAL */}
      {showCompletionTopUp && completedDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-none animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl w-full max-w-lg shadow-2xl border-2 border-emerald-600/40 dark:border-emerald-500/40 overflow-hidden relative animate-scaleUp">
            {/* Header Banner */}
            <div className="bg-gradient-to-br from-[#1b4327] via-[#245934] to-[#122e1b] text-white p-6 sm:p-7 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-radial from-[#eec149]/20 to-transparent pointer-events-none" />

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 border border-white/30 shadow-md">
                    <Check className="w-7 h-7 stroke-[3] text-[#eec149]" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#eec149] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#eec149]" />
                      <span>ASYV Psychosocial Submission Completed</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black font-display text-white">
                      Assessment Finished! 🎉
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCompletionTopUp(false)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Close popup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-emerald-100/95 mt-3 leading-relaxed relative z-10">
                You have finished answering all questions of the assessment prepared by your social worker <strong>{completedDetails.workerName}</strong>!
              </p>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 sm:p-7 space-y-5">
              {/* Summary Card */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/80 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">Assessment Title:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-display text-right max-w-[200px] truncate">
                    {completedDetails.title}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/80 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">Social Worker Assigned:</span>
                  <span className="font-bold text-[#245934] dark:text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#245934] dark:text-emerald-400" />
                    <span>{completedDetails.workerName}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/80 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">Questions Completed:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-[11px]">
                    {completedDetails.count} Questions Answered (100%)
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">Delivery Time:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">
                    {completedDetails.submittedAt} · Synchronized to Central DB
                  </span>
                </div>
              </div>

              {/* Village Encouragement Creed */}
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
                <Heart className="w-4 h-4 text-[#d95f18] shrink-0 mt-0.5 fill-[#d95f18]" />
                <p className="leading-relaxed">
                  Thank you for taking the time to reflect honestly. Your grade social worker will review your responses to support your personal growth and academic wellbeing.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCompletionTopUp(false);
                    setActiveAssignmentId(null);
                  }}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4 text-[#245934] dark:text-emerald-400" />
                  <span>All Questionnaires</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowCompletionTopUp(false);
                    setActivePage('dashboard');
                  }}
                  className="px-6 py-2.5 bg-[#245934] hover:bg-[#1b4327] text-white rounded-xl text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#eec149]" />
                  <span>Return to Student Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
