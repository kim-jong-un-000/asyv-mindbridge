import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, CheckCircle2, Clock, Send, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const ChampionApplyView: React.FC = () => {
  const {
    currentUser,
    applyForMentalChampion,
    getSocialWorkerForGrade,
    setActivePage
  } = useApp();

  const [ideaText, setIdeaText] = useState('');
  const [motivation, setMotivation] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!currentUser || currentUser.role !== 'student') return null;

  const worker = getSocialWorkerForGrade(currentUser.grade);
  const status = currentUser.championStatus || 'none';

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    applyForMentalChampion(ideaText);
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
              ASYV Peer Leadership Initiative
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-display">
              Join the Mental Champions Network
            </h1>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Mental Champions are dedicated village students trained to foster emotional empathy, facilitate peer wellness sessions, notice when classmates need support, and liaise with grade psychosocial staff.
        </p>
      </div>

      {/* Status Card */}
      {status === 'approved' || currentUser.isMentalChampion ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-4 animate-fadeIn">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 font-display">
            Application Approved! You are a Verified Mental Champion
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Your grade social worker ({worker ? worker.name : 'Social Worker'}) has verified and approved your application. You now have full access to the Mental Champions Hub.
          </p>

          <button
            onClick={() => setActivePage('champion-portal')}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl text-sm transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
          >
            <span>Enter Mental Champions Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : status === 'pending' || submitted ? (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-center space-y-4 animate-fadeIn">
          <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto ring-8 ring-amber-50">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 font-display">
            Application Pending Social Worker Review
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Your application has been delivered to <strong>{worker ? worker.name : 'your grade social worker'}</strong> for verification. Once approved, the button to enter the Mental Champions account will unlock here.
          </p>
          <div className="text-xs text-amber-800 bg-amber-100/60 p-3 rounded-xl max-w-sm mx-auto">
            Status: <span className="font-bold">Awaiting {currentUser.grade} Grade Social Worker verification</span>
          </div>
        </div>
      ) : (
        /* Application Form */
        <form onSubmit={handleApply} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-900">Application Checklist:</div>
            <div>• Registered Grade: <strong>{currentUser.grade}</strong></div>
            <div>• Student: <strong>{currentUser.name} {currentUser.familyName}</strong> ({currentUser.schoolClass})</div>
            <div>• Reviewing Worker: <strong>{worker ? worker.name : 'Social Worker'}</strong></div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Why do you want to become a Mental Champion in your grade?
            </label>
            <textarea
              required
              rows={3}
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              placeholder="Share how you hope to support your fellow students in your family house..."
              className="w-full p-3.5 text-sm border border-slate-300 rounded-2xl focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Initial Wellness Topic or Idea to Propose for Your First Session
            </label>
            <textarea
              required
              rows={3}
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              placeholder="e.g. Managing homesickness during the first term, or healthy conflict resolution in dormitory life..."
              className="w-full p-3.5 text-sm border border-slate-300 rounded-2xl focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-2xl text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
          >
            <Send className="w-4 h-4" />
            <span>Submit Application for {worker?.name.split(' ')[0]}'s Approval</span>
          </button>
        </form>
      )}
    </div>
  );
};
