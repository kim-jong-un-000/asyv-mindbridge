import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KudosPost, KudosCategory, Grade } from '../../types';
import {
  Heart,
  Sparkles,
  Send,
  Plus,
  Smile,
  Shield,
  BookOpen,
  Award,
  Filter,
  CheckCircle2,
  X,
  MessageCircle,
  Quote
} from 'lucide-react';

const CATEGORY_CONFIG: Record<KudosCategory, { label: string; icon: any; color: string; bg: string }> = {
  kindness: { label: 'Kindness', icon: Heart, color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
  resilience: { label: 'Resilience', icon: Shield, color: 'text-emerald-800', bg: 'bg-emerald-50 border-emerald-200' },
  study: { label: 'Study Focus', icon: BookOpen, color: 'text-amber-800', bg: 'bg-amber-50 border-amber-200' },
  gratitude: { label: 'Gratitude', icon: Sparkles, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  community: { label: 'Village Family', icon: Smile, color: 'text-teal-800', bg: 'bg-teal-50 border-teal-200' },
  inspiration: { label: 'Inspiration', icon: Award, color: 'text-[#245934]', bg: 'bg-[#245934]/10 border-[#245934]/20' }
};

export const KudosBoard: React.FC = () => {
  const { currentUser, kudosPosts, addKudosPost, likeKudosPost } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeGradeFilter, setActiveGradeFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [targetGrade, setTargetGrade] = useState<Grade | 'all'>('all');
  const [recipientName, setRecipientName] = useState('');
  const [category, setCategory] = useState<KudosCategory>('kindness');
  const [message, setMessage] = useState('');
  const [identityOption, setIdentityOption] = useState<'anonymous' | 'grade'>('anonymous');
  const [successToast, setSuccessToast] = useState('');

  const filteredPosts = kudosPosts.filter(k => {
    const matchesCategory = activeCategory === 'all' || k.category === activeCategory;
    const matchesGrade =
      activeGradeFilter === 'all' ||
      k.recipientGrade === 'all' ||
      k.recipientGrade === activeGradeFilter;
    return matchesCategory && matchesGrade;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    addKudosPost({
      senderGrade: identityOption === 'grade' ? (currentUser?.grade || 'Ingabe') : 'village',
      recipientGrade: targetGrade,
      recipientName: recipientName.trim() || undefined,
      category,
      message: message.trim()
    });

    setMessage('');
    setRecipientName('');
    setShowModal(false);
    setSuccessToast('Your anonymous encouragement has been shared with your peers! 🌿');
    setTimeout(() => setSuccessToast(''), 4000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#245934]/10 text-[#245934] flex items-center justify-center shrink-0 border border-[#245934]/20">
            <Heart className="w-6 h-6 text-[#245934] fill-[#245934]/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#d95f18]">
                Peer Wellness & Support
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full">
                100% Anonymous
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Anonymous Encouragement & Kudos Wall
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Send uplifting words, secret shoutouts, or academic motivation to brighten a fellow student's day.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-[#245934] hover:bg-[#1b4327] text-white font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-xs hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Post Uplifting Kudos</span>
        </button>
      </div>

      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>

          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#245934] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Messages ({kudosPosts.length})
          </button>

          {(Object.keys(CATEGORY_CONFIG) as KudosCategory[]).map(catKey => {
            const config = CATEGORY_CONFIG[catKey];
            const Icon = config.icon;
            const count = kudosPosts.filter(k => k.category === catKey).length;
            return (
              <button
                key={catKey}
                onClick={() => setActiveCategory(catKey)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === catKey
                    ? 'bg-[#245934] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{config.label}</span>
                <span className="text-[10px] opacity-80">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400">Target Grade:</span>
          <select
            value={activeGradeFilter}
            onChange={(e) => setActiveGradeFilter(e.target.value)}
            className="text-xs font-bold px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-hidden cursor-pointer"
          >
            <option value="all">All Village Peers</option>
            <option value="Ingabe">Ingabe Grade</option>
            <option value="Ingabo">Ingabo Grade</option>
            <option value="Ijabo">Ijabo Grade</option>
          </select>
        </div>
      </div>

      {/* Kudos Cards Masonry / Grid */}
      {filteredPosts.length === 0 ? (
        <div className="py-12 text-center bg-slate-50/70 rounded-3xl border border-dashed border-slate-200 p-6 space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">No encouragement messages here yet</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Be the first to share an inspiring word for your peers in this category!
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#245934] text-white text-xs font-bold rounded-xl hover:bg-[#1b4327] cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Write First Message</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.map((post) => {
            const config = CATEGORY_CONFIG[post.category] || CATEGORY_CONFIG.kindness;
            const CategoryIcon = config.icon;
            const isLiked = currentUser ? post.likedBy?.includes(currentUser.id) : false;

            return (
              <div
                key={post.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative group overflow-hidden"
              >
                {/* Decorative top accent border */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                  post.category === 'kindness' ? 'bg-rose-400' :
                  post.category === 'resilience' ? 'bg-emerald-500' :
                  post.category === 'study' ? 'bg-amber-500' :
                  post.category === 'gratitude' ? 'bg-amber-400' :
                  post.category === 'community' ? 'bg-teal-500' : 'bg-[#245934]'
                }`} />

                <div>
                  {/* Category and Recipient Bar */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${config.bg} ${config.color}`}>
                      <CategoryIcon className="w-3 h-3" />
                      <span>{config.label}</span>
                    </span>

                    <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      {post.recipientGrade === 'all' ? 'All Village' : `${post.recipientGrade} Grade`}
                    </span>
                  </div>

                  {/* Recipient Shoutout */}
                  {post.recipientName && (
                    <div className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1">
                      <span className="text-[#d95f18]">💌</span>
                      <span className="line-clamp-1">{post.recipientName}</span>
                    </div>
                  )}

                  {/* Message body */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans italic relative">
                    <Quote className="w-4 h-4 text-slate-200 absolute -top-1 -left-1 -z-10" />
                    "{post.message}"
                  </p>
                </div>

                {/* Footer Bar: Likes & Sender */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>
                      {post.senderGrade && post.senderGrade !== 'village'
                        ? `From an anonymous ${post.senderGrade} peer`
                        : 'From a caring village peer'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => likeKudosPost(post.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                      isLiked
                        ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-2xs'
                        : 'bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600'
                    }`}
                    title={isLiked ? 'Unlike encouragement' : 'Send warmth & like'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{post.likesCount || 0}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* POST ANONYMOUS KUDOS MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 animate-fadeIn">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative space-y-4"
          >
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#245934]/10 text-[#245934] flex items-center justify-center shrink-0 border border-[#245934]/20">
                <Sparkles className="w-6 h-6 text-[#245934]" />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#d95f18]">
                  Village Uplift Initiative
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Post Anonymous Encouragement
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Your name is never displayed. Share genuine positivity, praise resilience, or motivate fellow students through tests and village life.
            </p>

            {/* Recipient Grade & Shoutout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recipient Audience
                </label>
                <select
                  value={targetGrade}
                  onChange={(e) => setTargetGrade(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden font-semibold"
                >
                  <option value="all">Entire Village (All Grades)</option>
                  <option value="Ingabe">Ingabe Grade (S4)</option>
                  <option value="Ingabo">Ingabo Grade (S5)</option>
                  <option value="Ijabo">Ijabo Grade (S6)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Specific Shoutout <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. To S4 MEG, To my room"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                />
              </div>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Encouragement Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(CATEGORY_CONFIG) as KudosCategory[]).map(catKey => {
                  const conf = CATEGORY_CONFIG[catKey];
                  const Icon = conf.icon;
                  const isSelected = category === catKey;
                  return (
                    <button
                      type="button"
                      key={catKey}
                      onClick={() => setCategory(catKey)}
                      className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#245934] bg-[#245934]/10 text-[#1b4327] ring-1 ring-[#245934]'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[11px]">{conf.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message Area */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Uplifting Message
                </label>
                <span className={`text-[10px] font-semibold ${message.length > 250 ? 'text-amber-600' : 'text-slate-400'}`}>
                  {message.length}/280
                </span>
              </div>
              <textarea
                required
                maxLength={280}
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write something kind, motivating, or supportive for your peers..."
                className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] focus:ring-1 focus:ring-[#245934] outline-hidden resize-none"
              />
            </div>

            {/* Sender Identity Preference */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sign message as:
              </label>
              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="radio"
                    name="identity"
                    checked={identityOption === 'anonymous'}
                    onChange={() => setIdentityOption('anonymous')}
                    className="text-[#245934] focus:ring-[#245934]"
                  />
                  <span>100% Anonymous ("A caring village peer")</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="radio"
                    name="identity"
                    checked={identityOption === 'grade'}
                    onChange={() => setIdentityOption('grade')}
                    className="text-[#245934] focus:ring-[#245934]"
                  />
                  <span>From my Grade ("An anonymous {currentUser?.grade || 'Ingabe'} peer")</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!message.trim()}
                className="px-5 py-2.5 bg-[#245934] hover:bg-[#1b4327] disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>Post Anonymously</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
