import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Grade } from '../../types';
import {
  CalendarDays,
  Plus,
  Send,
  Users,
  Clock,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Paperclip,
  Upload
} from 'lucide-react';

const ALL_GRADES: Grade[] = ['Ingabe', 'Ingabo', 'Ijabo'];

export const TimetableModal: React.FC = () => {
  const {
    currentUser,
    timetables,
    createTimetableSession,
    getMentalChampions,
    users
  } = useApp();

  const [isCreating, setIsCreating] = useState(false);
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('16:30 - 17:45');
  const [leaderFirstName, setLeaderFirstName] = useState('');
  const [targetType, setTargetType] = useState<'all' | 'specific'>('all');
  const [selectedChampionIds, setSelectedChampionIds] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!currentUser || currentUser.role !== 'social_worker') return null;

  const allMentalChampions = getMentalChampions();

  const handleSelectAllChampions = () => {
    setSelectedChampionIds(allMentalChampions.map(c => c.id));
  };

  const handleToggleChampion = (id: string) => {
    setSelectedChampionIds(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !description.trim() || !date || !leaderFirstName.trim()) return;

    // First name only is stored as leaderName per prompt requirements!
    createTimetableSession({
      topic: topic.trim(),
      description: description.trim(),
      date,
      time,
      targetGrades: 'all',
      targetChampionIds: targetType === 'specific' ? selectedChampionIds : undefined,
      leaderName: leaderFirstName.trim().split(' ')[0] // First name only!
    });

    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setIsCreating(false);
      setTopic('');
      setDescription('');
      setDate('');
      setLeaderFirstName('');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
            <span>Mental Champions Coordination</span>
            <span>·</span>
            <span>Village Schedule</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display">
            Mental Champions Session Timetable
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Design upcoming peer support circles, designate youth facilitators (first names only), and dispatch schedules to all mental health champions across grades.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-2xl text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'Close Form' : 'Schedule New Session'}</span>
        </button>
      </div>

      {/* Session Creator Form */}
      {isCreating && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-200 shadow-md space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 font-display">
              New Mental Champions Facilitation Timetable
            </h2>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Read-Only for Champions
            </span>
          </div>

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Timetable session dispatched to all designated mental health champions!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Session Topic
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Navigating Mid-Term Stress & Peer Listening"
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-2xl focus:border-teal-500 outline-hidden"
              />
            </div>

            {/* Prompt requirement: Remove family name to someone's name and only stay with his or her name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Session Leader / Facilitator (First Name Only)
              </label>
              <input
                type="text"
                required
                value={leaderFirstName}
                onChange={(e) => setLeaderFirstName(e.target.value)}
                placeholder="e.g. Kevine or Aline (First name only)"
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-2xl focus:border-teal-500 outline-hidden"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                * Family names are removed on the champions timetable as required.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Session Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-2xl focus:border-teal-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Time Window
              </label>
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 16:30 - 17:45"
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-2xl focus:border-teal-500 outline-hidden"
              />
            </div>
          </div>

          {/* Description box for course details */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Course Details & Description Box
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline the course objectives, interactive discussion questions, opening icebreakers, and expected outcomes..."
              className="w-full p-4 text-sm border border-slate-300 rounded-2xl focus:border-teal-500 outline-hidden leading-relaxed"
            />
          </div>

          {/* Recipient Targeting Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select Recipients:
            </label>
            <div className="flex gap-4 mb-3">
              <button
                type="button"
                onClick={() => setTargetType('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  targetType === 'all'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Send Timetable to All Champions
              </button>

              <button
                type="button"
                onClick={() => setTargetType('specific')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  targetType === 'specific'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Select Specific Champions from List
              </button>
            </div>

            {targetType === 'specific' && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 max-h-48 overflow-y-auto">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
                  <span>Available Mental Champions across all grades:</span>
                  <button
                    type="button"
                    onClick={handleSelectAllChampions}
                    className="text-teal-700 hover:underline"
                  >
                    Select All
                  </button>
                </div>
                {allMentalChampions.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold cursor-pointer hover:bg-teal-50/50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedChampionIds.includes(c.id)}
                      onChange={() => handleToggleChampion(c.id)}
                      className="accent-teal-600 rounded"
                    />
                    <span>{c.name} ({c.grade} Grade)</span>
                  </label>
                ))}
              </div>
            )}
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
              <span>Publish & Send Timetable</span>
            </button>
          </div>
        </form>
      )}

      {/* Timetable Sessions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-2">
          <span>Current Active Facilitation Sessions ({timetables.length})</span>
          <span>Displayed to Mental Champions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {timetables.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-3 py-1 bg-amber-50 text-amber-800 rounded-lg text-xs font-bold border border-amber-200">
                    {s.date}
                  </span>
                  <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{s.time}</span>
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 font-display mt-1">
                  {s.topic}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <div>
                  Leader: <strong className="text-slate-800">{s.leaderName}</strong> (First Name Only)
                </div>
                <span className="text-teal-700 font-semibold">
                  {Array.isArray(s.targetGrades) ? s.targetGrades.join(', ') : 'All Grades'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
