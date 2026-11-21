import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, CheckCircle2, XCircle, Users, Clock, Sparkles } from 'lucide-react';

export const ChampionApproval: React.FC = () => {
  const {
    currentUser,
    getStudentsByGrade,
    getMentalChampions,
    approveMentalChampion,
    rejectMentalChampion
  } = useApp();

  if (!currentUser || (currentUser.role !== 'social_worker' && currentUser.role !== 'developer')) return null;

  // For social worker, show their grade students; for developer, show all
  const students = currentUser.role === 'social_worker'
    ? getStudentsByGrade(currentUser.grade)
    : getStudentsByGrade('Ingabe').concat(getStudentsByGrade('Ingabo'), getStudentsByGrade('Ijabo'));

  const pendingApps = students.filter(s => s.championStatus === 'pending');
  const registeredChampions = getMentalChampions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
          <span>Peer Leadership Governance</span>
          <span>·</span>
          <span>{currentUser.grade || 'All'} Grade</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-display">
          Mental Champion Applications & Registry
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
          Review student requests to become Mental Health Champions. Approved students gain automatic access to the Champions Hub, session timetables, and peer circles.
        </p>
      </div>

      {/* Pending Applications Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
          <span>Pending Applications Awaiting Review ({pendingApps.length})</span>
          <span>One-click verification</span>
        </div>

        {pendingApps.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/80 text-slate-400 text-sm">
            No pending mental champion applications from {currentUser.grade} Grade at this time.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingApps.map((applicant) => (
              <div
                key={applicant.id}
                className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={applicant.avatar}
                    alt={applicant.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-amber-300"
                  />
                  <div>
                    <h2 className="text-base font-bold text-slate-900 font-display">
                      {applicant.name} {applicant.familyName || ''}
                    </h2>
                    <div className="text-xs text-slate-500">
                      Class: <strong>{applicant.schoolClass}</strong> · {applicant.grade} Grade
                    </div>
                  </div>
                </div>

                {applicant.championIdea && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-900">
                    <span className="font-bold">Proposed Session Idea:</span>
                    <p className="mt-1 italic">"{applicant.championIdea}"</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => approveMentalChampion(applicant.id)}
                    className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Champion</span>
                  </button>

                  <button
                    onClick={() => rejectMentalChampion(applicant.id)}
                    className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prompt Requirement: Show registered and their names and grade for mental health champions */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
          <span>Registered Mental Health Champions ({registeredChampions.length})</span>
          <span>Names & Grades</span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {registeredChampions.map((champ) => (
            <div key={champ.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={champ.avatar}
                  alt={champ.name}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-amber-300"
                />
                <div>
                  <div className="text-sm font-bold text-slate-900 font-display">
                    {champ.name} {champ.familyName || ''}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Class: {champ.schoolClass || 'Student'} · {champ.email}
                  </div>
                </div>
              </div>

              {/* Exact requirement: Show registered their names and grade */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold">
                  {champ.grade} Grade Champion
                </span>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
