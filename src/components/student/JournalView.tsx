import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, Plus, Trash2, Calendar, Clock, Smile, Sparkles } from 'lucide-react';
import { TRANSLATIONS } from '../../utils/i18n';

const MOOD_REACTIONS = [
  '🌅 Peaceful',
  '🌿 Grateful',
  '⚡ Energetic',
  '💭 Thoughtful',
  '🛡️ Resilient',
  '🌧️ Challenging',
  '🎯 Focused',
  '✨ Inspired'
];

export const JournalView: React.FC = () => {
  const { currentUser, journalEntries, addJournalEntry, deleteJournalEntry, language } = useApp();

  const [isWriting, setIsWriting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reaction, setReaction] = useState(MOOD_REACTIONS[0]);

  if (!currentUser || currentUser.role !== 'student') return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const myEntries = journalEntries.filter(j => j.studentId === currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addJournalEntry(title, content, reaction);
    setTitle('');
    setContent('');
    setIsWriting(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-emerald-400 mb-1">
            <span>{t.student} {currentUser.grade}</span>
            <span>·</span>
            <span>{t.navJournal}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
            {t.journalTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {t.journalSubtitle}
          </p>
        </div>

        <button
          onClick={() => setIsWriting(!isWriting)}
          className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isWriting ? t.close : t.writeNewStory}</span>
        </button>
      </div>

      {/* Editor Modal / Card */}
      {isWriting && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-teal-200 dark:border-slate-800 shadow-md space-y-4 animate-fadeIn transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
              {t.writeNewStory}
            </h2>
            <div className="text-xs text-slate-400 dark:text-slate-500 font-mono">
              {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t.storyTitleLabel}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Conversation with my house mother after evening prep..."
              className="w-full px-4 py-2.5 text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl focus:border-teal-500 outline-hidden"
            />
          </div>

          {/* Reaction Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.selectStoryEmotion}
            </label>
            <div className="flex flex-wrap gap-2">
              {MOOD_REACTIONS.map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setReaction(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    reaction === r
                      ? 'bg-teal-700 dark:bg-emerald-600 text-white shadow-xs scale-105'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Story Content */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t.storyContentLabel}
            </label>
            <textarea
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What happened today? What did you feel? What gave you strength or made you pause? Write freely..."
              className="w-full p-4 text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl focus:border-teal-500 outline-hidden leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsWriting(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
            >
              {t.saveStoryBtn}
            </button>
          </div>
        </form>
      )}

      {/* Entries List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-2">
          <span>{t.mySavedStories} ({myEntries.length})</span>
          <span>Stored locally & confidential</span>
        </div>

        {myEntries.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400">
            <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="font-bold text-slate-800 dark:text-slate-200">{t.noStoriesYet}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myEntries.map((entry) => {
              const dateObj = new Date(entry.createdAt);
              const formattedDate = dateObj.toLocaleDateString(undefined, {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });
              const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div
                  key={entry.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-teal-300 dark:hover:border-emerald-600 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-1 bg-teal-50 dark:bg-emerald-950/60 border border-teal-100 dark:border-emerald-900 text-teal-800 dark:text-emerald-300 rounded-lg text-xs font-bold">
                        {entry.moodReaction}
                      </span>
                      <button
                        onClick={() => deleteJournalEntry(entry.id)}
                        className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded-lg transition-colors cursor-pointer"
                        title={t.delete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
                      {entry.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed whitespace-pre-wrap">
                      {entry.content}
                    </p>
                  </div>

                  {/* Date & Time Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      <span>{formattedTime}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
