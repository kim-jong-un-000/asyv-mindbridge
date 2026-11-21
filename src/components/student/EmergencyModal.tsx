import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TRANSLATIONS } from '../../utils/i18n';
import { AlertOctagon, Send, ShieldCheck, Phone, CheckCircle2 } from 'lucide-react';

export const EmergencyModal: React.FC = () => {
  const {
    currentUser,
    getSocialWorkerForGrade,
    sendEmergencyAlert,
    setActivePage,
    contactInfo,
    language
  } = useApp();

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [message, setMessage] = useState('');
  const [urgency, setUrgency] = useState<'high' | 'critical'>('critical');
  const [isSent, setIsSent] = useState(false);

  if (!currentUser || currentUser.role !== 'student') return null;

  const worker = getSocialWorkerForGrade(currentUser.grade);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    sendEmergencyAlert(message.trim(), urgency);
    setIsSent(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
        {/* Banner */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <AlertOctagon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
              {t.urgentActionRequired}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
              {t.emergencyModalTitle}
            </h1>
          </div>
        </div>

        {isSent ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 text-center space-y-4 animate-fadeIn">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-950">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-display">
              {t.alertDispatched}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
              {t.emergencyModalSubtitle} ({worker ? worker.name : t.socialWorker}).
            </p>

            <div className="p-4 bg-white dark:bg-slate-900/90 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-slate-600 dark:text-slate-300 text-left max-w-md mx-auto space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{language === 'rw' ? 'Icyo ukora mu gihe utegereje:' : language === 'fr' ? 'À faire pendant que vous attendez :' : 'What to do while waiting:'}</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
                <li>{language === 'rw' ? 'Guma ahantu hizewe hamwe n’inshuti cyangwa umubyeyi w’inzu.' : language === 'fr' ? 'Restez en lieu sûr avec un pair de confiance ou votre mère de maison.' : 'Stay in a safe location with a trusted peer or house mother.'}</li>
                <li>{language === 'rw' ? 'Humeka buhoro ugarura ituze (humeka amasegonda 4, sohora 6).' : language === 'fr' ? 'Pratiquez des respirations lentes et profondes (inspirez 4s, expirez 6s).' : 'Practice slow, deep breaths (breathe in for 4s, out for 6s).'}</li>
                <li>{language === 'rw' ? 'Umukozi w’imibereho myiza aragusura cyangwa akwandikire ako kanya.' : language === 'fr' ? 'Votre travailleur social vous contactera directement ou par chat.' : 'Your social worker will reach out directly in person or via chat.'}</li>
              </ul>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setActivePage('chat')}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                {t.directWorkerChatTitle}
              </button>
              <button
                onClick={() => {
                  setIsSent(false);
                  setMessage('');
                }}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                {language === 'rw' ? 'Ohereza Ubundi Butumwa' : language === 'fr' ? 'Envoyer une autre note' : 'Send Another Note'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900 rounded-2xl p-4 text-xs text-rose-800 dark:text-rose-200 leading-relaxed">
              <strong>{t.criticalNotice}:</strong> {language === 'rw' ? 'Koresha iyi fomu niba wowe cyangwa mugenzi wawe mufite ikibazo gikomeye cy\'umutekano cyangwa ihungabana rikeneye ubutabazi bwihuse bw\'abashinzwe imibereho myiza.' : language === 'fr' ? 'Utilisez ce formulaire si vous ou un camarade ressentez une détresse émotionnelle sévère nécessitant une intervention urgente de l\'équipe psychosociale.' : 'Use this form if you or a friend are experiencing severe emotional distress, feeling unsafe, or needing urgent intervention from psychosocial staff.'}
            </div>

            {/* Recipient Details */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {worker && (
                  <img
                    src={worker.avatar}
                    alt={worker.name}
                    className="w-10 h-10 rounded-xl object-contain bg-white dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-700"
                  />
                )}
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.socialWorker}</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{worker?.name}</div>
                  <div className="text-[11px] text-[#245934] dark:text-emerald-400 font-semibold">{currentUser.grade} · {worker?.email}</div>
                </div>
              </div>
              <div className="text-right text-xs text-slate-500 dark:text-slate-400 font-medium">
                <div>{t.classLabel}: <span className="font-bold text-slate-800 dark:text-slate-200">{currentUser.schoolClass}</span></div>
                <div>ID: <span className="font-mono text-slate-600 dark:text-slate-300">{currentUser.name} {currentUser.familyName}</span></div>
              </div>
            </div>

            {/* Urgency Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                {language === 'rw' ? 'Urwego rw\'Ubwihutirwe' : language === 'fr' ? 'Niveau d\'urgence' : 'Level of Urgency'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUrgency('critical')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    urgency === 'critical'
                      ? 'border-rose-600 bg-rose-50/80 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 ring-2 ring-rose-200 dark:ring-rose-800 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                    {language === 'rw' ? 'SOS Yihutirwa Cyane (Ako kanya)' : language === 'fr' ? 'SOS Critique (Immédiat)' : 'Critical SOS (Immediate Need)'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {language === 'rw' ? 'Ihungabana rikomeye cyangwa ikibazo cy\'umutekano' : language === 'fr' ? 'Crise sévère ou souci de sécurité urgent' : 'Severe crisis, panic attack, or immediate safety concern'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setUrgency('high')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    urgency === 'high'
                      ? 'border-amber-600 bg-amber-50/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 ring-2 ring-amber-200 dark:ring-amber-800 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold text-amber-700 dark:text-amber-400">
                    {language === 'rw' ? 'Ibyihutirwa (Kubonana uyu munsi)' : language === 'fr' ? 'Priorité Haute (Entretien aujourd\'hui)' : 'High Priority (Same-Day Meeting)'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {language === 'rw' ? 'Umunaniro mwinshi, gushaka kubonana mbere y\'isaha y\'amasomo' : language === 'fr' ? 'Stress élevé, besoin d\'échange lors de l\'étude' : 'Heavy overwhelming stress, need to meet during prep'}
                  </div>
                </button>
              </div>
            </div>

            {/* Emergency Message Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'rw' ? 'Sobanura ibiri kuba (Biri mu ibanga)' : language === 'fr' ? 'Décrivez la situation (Confidentiel)' : 'Describe What Is Happening (Confidential)'}
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.describeSituationPlaceholder}
                className="w-full p-3.5 text-sm border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-2xl focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-hidden text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={!message.trim()}
              className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-bold rounded-2xl text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>{t.confirmSendSosBtn} ({worker?.name.split(' ')[0]})</span>
            </button>
          </form>
        )}
      </div>

      {/* Direct Village Crisis Contacts */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 transition-colors">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#245934] dark:text-emerald-400">
          <Phone className="w-4 h-4 text-[#245934] dark:text-emerald-400" />
          <span>{t.villageSupportDesk}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-900">
            <div className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">{t.emergencyHotlineLabel}</div>
            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">{contactInfo.hotlinePhone}</div>
          </div>
          <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-900">
            <div className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">{t.whatsappCrisisLabel}</div>
            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">{contactInfo.whatsappPhone}</div>
          </div>
          <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-900">
            <div className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">{t.healthClinicLabel}</div>
            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">{contactInfo.clinicExtension}</div>
          </div>
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
          <span>{t.officeLocationCardTitle}: <strong className="text-slate-700 dark:text-slate-200">{contactInfo.officeLocation}</strong></span>
          <span>Lead: <strong className="text-slate-700 dark:text-slate-200">{contactInfo.counselorLead}</strong></span>
        </div>
      </div>
    </div>
  );
};
