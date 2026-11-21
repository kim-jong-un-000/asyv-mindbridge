import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertOctagon, CheckCircle2, Clock, MessageSquare, ShieldCheck, PhoneCall } from 'lucide-react';

export const WorkerSosAlerts: React.FC = () => {
  const {
    currentUser,
    emergencyAlerts,
    acknowledgeEmergency,
    setActivePage
  } = useApp();

  const [responseNotes, setResponseNotes] = useState<{ [alertId: string]: string }>({});

  if (!currentUser || currentUser.role !== 'social_worker') return null;

  const gradeAlerts = emergencyAlerts.filter(a => a.grade === currentUser.grade);

  const handleAcknowledge = (alertId: string) => {
    const note = responseNotes[alertId] || 'Social worker is actively responding to support you.';
    acknowledgeEmergency(alertId, note);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-rose-600 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/25 flex items-center justify-center shrink-0">
            <AlertOctagon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-rose-200">
              Immediate Safety & Psychosocial Response
            </div>
            <h1 className="text-2xl font-extrabold font-display">
              {currentUser.grade} Grade Student SOS Notifications
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-rose-100 mt-2 max-w-xl">
          When students in your grade submit an urgent help request, it instantly surfaces here with their class details, email, and live distress notes.
        </p>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {gradeAlerts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 text-slate-400 text-sm">
            No active SOS emergency alerts recorded for {currentUser.grade} Grade.
          </div>
        ) : (
          gradeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-3xl p-6 border shadow-xs space-y-4 ${
                alert.status === 'active'
                  ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-200'
                  : 'bg-white border-slate-200/80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 text-xs font-extrabold rounded-lg ${
                    alert.urgency === 'critical' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                  }`}>
                    {alert.urgency.toUpperCase()} SOS
                  </span>

                  <div>
                    <h2 className="text-base font-bold text-slate-900 font-display">
                      {alert.studentName} {alert.studentFamilyName}
                    </h2>
                    <div className="text-xs text-slate-500 font-medium">
                      Class: <strong>{alert.studentClass}</strong> · Email: <span className="font-mono">{alert.studentEmail}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right text-xs text-slate-400 font-mono">
                  <div className="flex items-center sm:justify-end gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(alert.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-teal-700 capitalize">
                    Status: {alert.status}
                  </div>
                </div>
              </div>

              {/* Distress Message */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 text-sm text-slate-800 leading-relaxed font-medium">
                "{alert.message}"
              </div>

              {/* Action Response */}
              {alert.status === 'active' ? (
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={responseNotes[alert.id] || ''}
                    onChange={(e) => setResponseNotes(prev => ({ ...prev, [alert.id]: e.target.value }))}
                    placeholder="Add response note for student (e.g. 'I am walking to your dorm now')..."
                    className="flex-1 px-4 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:border-rose-500 outline-hidden"
                  />
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Acknowledge SOS
                    </button>
                    <button
                      onClick={() => setActivePage('chat')}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Acknowledged: {alert.workerResponse || 'Social worker intervened.'}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
