import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Brain, Shield, Users, HeartHandshake, CheckCircle, Sparkles, BookOpen } from 'lucide-react';

export const TipsExplorerView: React.FC = () => {
  const { wellnessTips } = useApp();
  const [activeCategory, setActiveCategory] = useState<'study' | 'stress' | 'social' | 'living'>('study');

  const categories = [
    { id: 'study', label: 'Study Tips & Academic Focus', icon: Brain, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
    { id: 'stress', label: 'Stress Management & Calming', icon: Shield, color: 'text-rose-700 bg-rose-50 border-rose-200' },
    { id: 'social', label: 'Social Wellness & Friendship', icon: Users, color: 'text-[#245934] bg-emerald-50 border-emerald-200' },
    { id: 'living', label: 'Living Well in Village Society', icon: HeartHandshake, color: 'text-[#d95f18] bg-amber-50 border-amber-200' },
  ] as const;

  const currentTips = wellnessTips.filter(t => t.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1b4327] to-[#245934] text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1">
            <Sparkles className="w-4 h-4 text-[#eec149]" />
            <span>ASYV Psychosocial Guidance Library</span>
            <span>·</span>
            <span>Real Support for Daily Life</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
            Life, Study & Emotional Wellness Guidance
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
            Actionable strategies prepared by ASYV social workers and counseling leads to help you thrive academically, cultivate peace of mind, and build lifelong village bonds.
          </p>
        </div>
      </div>

      {/* Segmented Category Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          const categoryCount = wellnessTips.filter(t => t.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? `${cat.color} ring-2 ring-[#245934] shadow-xs scale-102 font-bold`
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <Icon className="w-6 h-6" />
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {categoryCount}
                </span>
              </div>
              <div className="text-xs sm:text-sm font-bold leading-snug">
                {cat.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Tips Cards Grid */}
      {currentTips.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 shadow-xs space-y-2">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No Guidance Articles in this Category Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Your social workers and administration will input real guidance notes here shortly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {currentTips.map((tip, idx) => (
            <div
              key={tip.id || idx}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-[#245934] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[#245934] mb-2">
                  <div className="flex items-center gap-1.5">
                    <span>0{idx + 1}</span>
                    <span className="text-slate-300">·</span>
                    <span className="uppercase tracking-wider">Protocol</span>
                  </div>
                  {tip.authorName && (
                    <span className="text-[10px] text-slate-400 font-sans truncate max-w-[140px]">
                      {tip.authorName}
                    </span>
                  )}
                </div>
                <h2 className="text-base font-bold text-slate-900 font-display mb-2">
                  {tip.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {tip.summary}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 bg-emerald-50/40 -mx-6 -mb-6 p-5 rounded-b-3xl">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#245934] mb-1 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#245934]" />
                  <span>Try this today</span>
                </div>
                <p className="text-xs text-slate-800 font-medium leading-relaxed">
                  {tip.actionable}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
