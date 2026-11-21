import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AssignmentQuestion, QuestionType } from '../../types';
import {
  FileCheck2,
  Plus,
  Trash2,
  Send,
  Calendar,
  CheckCircle2,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

export const SetAssignmentModal: React.FC = () => {
  const { currentUser, assignments, createAssignment, setActivePage } = useApp();

  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [questions, setQuestions] = useState<AssignmentQuestion[]>([
    {
      id: 'q-1',
      type: 'multiple_choice',
      prompt: 'How would you rate your emotional energy balance over the last week?',
      options: [
        'Energized and peaceful',
        'Moderate, handling challenges well',
        'Feeling low and seeking advice',
        'Overwhelmed, need 1-on-1 talk'
      ]
    },
    {
      id: 'q-2',
      type: 'open_ended',
      prompt: 'What is one coping strategy or habit that helped you stay calm during evening prep this week?'
    }
  ]);
  const [publishSuccess, setPublishSuccess] = useState(false);

  if (!currentUser || currentUser.role !== 'social_worker') return null;

  const myGradeAssignments = assignments.filter(a => a.grade === currentUser.grade);

  const handleAddQuestion = (type: QuestionType) => {
    const newQ: AssignmentQuestion = {
      id: `q-${Date.now()}`,
      type,
      prompt: '',
      options: type === 'multiple_choice' ? ['Option 1', 'Option 2', 'Option 3'] : undefined
    };
    setQuestions(prev => [...prev, newQ]);
  };

  const handleUpdatePrompt = (qId: string, text: string) => {
    setQuestions(prev => prev.map(q => q.id === qId ? { ...q, prompt: text } : q));
  };

  const handleUpdateOption = (qId: string, optIndex: number, text: string) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id === qId && q.options) {
          const nextOpts = [...q.options];
          nextOpts[optIndex] = text;
          return { ...q, options: nextOpts };
        }
        return q;
      })
    );
  };

  const handleAddOptionToQuestion = (qId: string) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id === qId && q.options) {
          return { ...q, options: [...q.options, `Option ${q.options.length + 1}`] };
        }
        return q;
      })
    );
  };

  const handleRemoveQuestion = (qId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== qId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || questions.length === 0) return;

    createAssignment({
      title: title.trim(),
      instructions: instructions.trim() || 'Please answer honestly and completely.',
      grade: currentUser.grade,
      dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      questions
    });

    setPublishSuccess(true);
    setTimeout(() => {
      setPublishSuccess(false);
      setIsCreating(false);
      setTitle('');
      setInstructions('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
            <span>Assignment Engine</span>
            <span>·</span>
            <span>{currentUser.grade} Grade Online Distribution</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display">
            Set Grade Assessments & Form Questions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Build assignments with both multiple choice questions and open-ended written explanations. Published assessments are instantly dispatched to all registered {currentUser.grade} students.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-2xl text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'Close Creator' : 'Create New Assignment'}</span>
        </button>
      </div>

      {/* Creator Form */}
      {isCreating && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-200 shadow-md space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Design New Assessment for {currentUser.grade} Students
            </h2>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
              Dispatched to All {currentUser.grade} Grade
            </span>
          </div>

          {publishSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Assignment published successfully to all students in {currentUser.grade}!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Assignment Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Term 1 Reflection & Stress Coping Assessment"
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-2xl focus:border-teal-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-2xl focus:border-teal-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Instructions for Students
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Provide clear guidance for your students..."
              className="w-full px-4 py-2 text-sm border border-slate-300 rounded-2xl focus:border-teal-500 outline-hidden"
            />
          </div>

          {/* Questions Builder */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                Assessment Questions ({questions.length})
              </h3>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleAddQuestion('multiple_choice')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  + Add Multiple Choice
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuestion('open_ended')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  + Add Written Explanation
                </button>
              </div>
            </div>

            {questions.map((q, idx) => (
              <div key={q.id} className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-teal-700 text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                      {q.type === 'multiple_choice' ? 'Multiple Choice' : 'Open Ended Written Explanation'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(q.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Remove question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    value={q.prompt}
                    onChange={(e) => handleUpdatePrompt(q.id, e.target.value)}
                    placeholder="Enter the question prompt..."
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:border-teal-500 outline-hidden"
                  />
                </div>

                {q.type === 'multiple_choice' && q.options && (
                  <div className="space-y-2 pl-4">
                    <div className="text-[11px] font-bold text-slate-500 uppercase">
                      Select Options / Choices:
                    </div>
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-mono">{optIdx + 1}.</span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleUpdateOption(q.id, optIdx, e.target.value)}
                          placeholder={`Option ${optIdx + 1}`}
                          className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:border-teal-500 outline-hidden"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddOptionToQuestion(q.id)}
                      className="text-xs text-teal-700 font-bold hover:underline cursor-pointer"
                    >
                      + Add another choice option
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Send Assignment to All {currentUser.grade} Students</span>
            </button>
          </div>
        </form>
      )}

      {/* Existing Assignments List */}
      <div className="space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
          Assignments Distributed to {currentUser.grade} Grade ({myGradeAssignments.length})
        </div>

        {myGradeAssignments.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 text-slate-400 text-sm">
            No assignments currently distributed. Click "Create New Assignment" above to dispatch your first check-in or quiz!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myGradeAssignments.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 bg-teal-50 text-teal-800 rounded-md text-[11px] font-bold">
                      {a.questions.length} Questions
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Due {a.dueDate}</span>
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-slate-900 font-display">
                    {a.title}
                  </h2>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {a.instructions}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Submissions received: <strong className="text-teal-800 font-mono tabular-nums">{a.submissions.length}</strong>
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {currentUser.grade} Grade
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
