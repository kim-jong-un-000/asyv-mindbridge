import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HelpCircle, Send, CheckCircle2, MessageSquare, Clock, Users } from 'lucide-react';

export const DailyQuestionSetter: React.FC = () => {
  const {
    currentUser,
    dailyQuestions,
    dailyAnswers,
    setDailyQuestion
  } = useApp();

  if (!currentUser || currentUser.role !== 'social_worker') return null;

  const currentQ = dailyQuestions.find(q => q.grade === currentUser.grade);
  const [questionText, setQuestionText] = useState(currentQ?.question || '');
  const [contextNote, setContextNote] = useState(currentQ?.contextNote || '');
  const [saved, setSaved] = useState(false);

  // Student answers for this grade
  const gradeAnswers = dailyAnswers.filter(a => a.grade === currentUser.grade);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    setDailyQuestion(currentUser.grade, questionText.trim(), contextNote.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
          <span>Daily Village Check-in</span>
          <span>·</span>
          <span>{currentUser.grade} Grade Prompt</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-display">
          Set Daily Reflection Question
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
          Publish a daily question that appears directly on every {currentUser.grade} student's dashboard to foster self-reflection, gratitude, and emotional awareness.
        </p>
      </div>

      {/* Question Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        {saved && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Daily question updated and broadcasted to all {currentUser.grade} students!</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Daily Question Prompt for {currentUser.grade}
          </label>
          <textarea
            required
            rows={3}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="e.g. What is one personal victory or act of kindness you witnessed in your family house today?"
            className="w-full p-4 text-sm border border-slate-300 rounded-2xl focus:border-teal-500 outline-hidden leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Supportive Context / Encouragement Note
          </label>
          <input
            type="text"
            value={contextNote}
            onChange={(e) => setContextNote(e.target.value)}
            placeholder="e.g. Taking time to notice the positive strengthens resilience."
            className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-2xl focus:border-teal-500 outline-hidden"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-2xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span>Publish Question to {currentUser.grade} Students</span>
          </button>
        </div>
      </form>

      {/* Student Answers Received */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
          <span>Student Submissions Received ({gradeAnswers.length})</span>
          <span>Confidential to social worker</span>
        </div>

        {gradeAnswers.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/80 text-slate-400 text-sm">
            No student reflections submitted yet for today's prompt.
          </div>
        ) : (
          <div className="space-y-3">
            {gradeAnswers.map((ans, idx) => (
              <div key={`${ans.id}-${idx}`} className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="font-bold text-slate-800 flex items-center gap-2">
                    <span className="text-teal-700 font-display text-sm">{ans.studentName}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500">{ans.grade}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(ans.answeredAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  "{ans.answer}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
