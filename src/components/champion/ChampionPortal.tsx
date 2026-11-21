import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  Calendar,
  BookOpen,
  MessageSquare,
  Send,
  Users,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Clock,
  Sparkles
} from 'lucide-react';

export const ChampionPortal: React.FC = () => {
  const {
    currentUser,
    timetables,
    wellnessLessons,
    discussionPosts,
    addDiscussionPost,
    getSocialWorkerForGrade,
    getMentalChampions,
    sendMessage
  } = useApp();

  const [activeTab, setActiveTab] = useState<'sessions' | 'lessons' | 'idea-share' | 'peer-circle'>('sessions');
  const [ideaText, setIdeaText] = useState('');
  const [ideaSent, setIdeaSent] = useState(false);
  const [discussionInput, setDiscussionInput] = useState('');

  if (!currentUser) return null;

  const worker = getSocialWorkerForGrade(currentUser.grade);
  const champions = getMentalChampions();

  const handleSendIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaText.trim() || !worker) return;

    // Send as message to social worker
    sendMessage(worker.id, `💡 [MENTAL CHAMPION SESSION IDEA]: ${ideaText.trim()}`);
    setIdeaSent(true);
    setIdeaText('');
    setTimeout(() => setIdeaSent(false), 5000);
  };

  const handlePostDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussionInput.trim()) return;

    addDiscussionPost(discussionInput.trim());
    setDiscussionInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-amber-100 mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Verified Mental Champion Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
              Village Mental Health Champions Hub
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/90 mt-1 max-w-xl">
              Equipping peer ambassadors across Ingabe, Ingabo, and Ijabo with session timetables, wellness guides, and direct channels to psychosocial mentors.
            </p>
          </div>

          <div className="bg-white/15 rounded-2xl p-4 border border-white/20 text-center shrink-0">
            <div className="text-2xl font-extrabold font-display">{champions.length}</div>
            <div className="text-[11px] text-amber-100 font-medium">Active Village Champions</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'sessions'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Sessions Timetable</span>
        </button>

        <button
          onClick={() => setActiveTab('lessons')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'lessons'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Lessons & Courses</span>
        </button>

        <button
          onClick={() => setActiveTab('idea-share')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'idea-share'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Propose Idea to {worker ? worker.name.split(' ')[0] : 'Worker'}</span>
        </button>

        <button
          onClick={() => setActiveTab('peer-circle')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'peer-circle'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Peer Champions Live Room</span>
        </button>
      </div>

      {/* TAB CONTENT */}

      {/* 1. Timetable: Read-only for champions, shows leader First Name Only */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-2">
            <span>Upcoming Mental Champion Facilitation Schedule</span>
            <span className="text-teal-700">Displaying First Names only for privacy</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {timetables.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between"
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

                  <h2 className="text-lg font-bold text-slate-900 font-display mt-2">
                    {s.topic}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {s.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-500">
                    Facilitator: <strong className="text-slate-800">{s.leaderName}</strong> (First Name Only)
                  </div>
                  <span className="text-teal-700 font-semibold">
                    {Array.isArray(s.targetGrades) ? s.targetGrades.join(', ') : 'All Grades'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Wellness Lessons Prepared by Social Workers */}
      {activeTab === 'lessons' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500 font-semibold px-2">
            Wellness Curriculum & Teaching Materials Prepared by ASYV Social Workers
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wellnessLessons.map((l) => (
              <div
                key={l.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between"
              >
                {l.attachmentType === 'image' && l.attachmentUrl && (
                  <div className="h-48 w-full bg-slate-100 overflow-hidden relative">
                    <img
                      src={l.attachmentUrl}
                      alt={l.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/75 text-white rounded-md text-[11px] font-semibold">
                      Attached Resource
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 bg-teal-50 text-teal-800 rounded-md text-xs font-bold uppercase tracking-wider">
                      {l.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      By {l.workerName}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 font-display">
                    {l.title}
                  </h2>

                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    {l.description}
                  </p>

                  <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {l.content}
                  </div>

                  {l.attachmentType === 'document' && (
                    <div className="mt-3 p-3 bg-teal-50/70 border border-teal-200 rounded-xl flex items-center justify-between text-xs text-teal-900">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-teal-700" />
                        <span className="font-semibold">{l.attachmentName || 'Guide Protocol.pdf'}</span>
                      </div>
                      <span className="text-[11px] text-teal-700 underline font-medium">Attached Document</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Propose Session Ideas */}
      {activeTab === 'idea-share' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Propose Session Ideas to {worker ? worker.name : 'Your Social Worker'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Have an observation about what your peers in {currentUser.grade} are experiencing? Submit topics or concerns you would like to tackle in the next circle.
            </p>
          </div>

          {ideaSent && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Idea sent directly to {worker?.name}'s private dashboard!</span>
            </div>
          )}

          <form onSubmit={handleSendIdea} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Topic & Recommended Discussion Framework
              </label>
              <textarea
                required
                rows={5}
                value={ideaText}
                onChange={(e) => setIdeaText(e.target.value)}
                placeholder="Describe the issue, why it matters to your grade right now, and what kind of interactive exercise or conversation you think would help..."
                className="w-full p-4 text-sm border border-slate-300 rounded-2xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-hidden leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={!ideaText.trim()}
              className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-2xl text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch Idea to {worker?.name.split(' ')[0]}</span>
            </button>
          </form>
        </div>
      )}

      {/* 4. Peer Champions Live Discussion Room */}
      {activeTab === 'peer-circle' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-[520px]">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              <h2 className="text-sm font-bold text-slate-900 font-display">
                Village Mental Champions Peer Exchange
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              Real-time collaboration across all 4 grades
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-slate-50/40">
            {discussionPosts.map((post, idx) => (
              <div key={`${post.id}-${idx}`} className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span>{post.authorName}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-teal-700 font-semibold">{post.grade}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {post.content}
                </p>
              </div>
            ))}
          </div>

          <form onSubmit={handlePostDiscussion} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={discussionInput}
              onChange={(e) => setDiscussionInput(e.target.value)}
              placeholder="Share an insight or note with peer mental champions..."
              className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-amber-500 outline-hidden"
            />
            <button
              type="submit"
              disabled={!discussionInput.trim()}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 text-white font-bold rounded-2xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Post</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
