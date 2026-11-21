import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VillageContactItem } from '../../types';
import { TRANSLATIONS } from '../../utils/i18n';
import {
  PhoneCall,
  MessageCircle,
  Building2,
  Clock,
  Mail,
  Shield,
  HeartHandshake,
  UserCheck,
  Plus,
  Trash2,
  Edit3,
  Check,
  Copy,
  ExternalLink,
  Info,
  Sparkles,
  PhoneForwarded,
  Stethoscope,
  ShieldAlert
} from 'lucide-react';

export const VillageContactView: React.FC = () => {
  const { currentUser, contactInfo, updateContactInfo, language } = useApp();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states for editable fields (Social Worker & Admin)
  const [hotlinePhone, setHotlinePhone] = useState(contactInfo.hotlinePhone || '');
  const [whatsappPhone, setWhatsappPhone] = useState(contactInfo.whatsappPhone || '');
  const [clinicExt, setClinicExt] = useState(contactInfo.clinicExtension || '');
  const [emergencyEmail, setEmergencyEmail] = useState(contactInfo.emergencyEmail || '');
  const [officeLocation, setOfficeLocation] = useState(contactInfo.officeLocation || '');
  const [officeHours, setOfficeHours] = useState(contactInfo.officeHours || '');
  const [counselorLead, setCounselorLead] = useState(contactInfo.counselorLead || '');
  const [additionalNotice, setAdditionalNotice] = useState(contactInfo.additionalNotice || '');

  // Custom contacts manager
  const [customContacts, setCustomContacts] = useState<VillageContactItem[]>(
    contactInfo.customContacts || []
  );
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCategory, setNewCategory] = useState<VillageContactItem['category']>('mental_health');

  const canEdit = currentUser?.role === 'social_worker' || currentUser?.role === 'developer';

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleAddCustomContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const contact: VillageContactItem = {
      id: `contact-${Date.now()}`,
      name: newName.trim(),
      role: newRole.trim() || 'Village Support Staff',
      phone: newPhone.trim(),
      category: newCategory
    };

    const updated = [...customContacts, contact];
    setCustomContacts(updated);
    setNewName('');
    setNewRole('');
    setNewPhone('');
  };

  const handleRemoveCustomContact = (id: string) => {
    setCustomContacts(prev => prev.filter(c => c.id !== id));
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactInfo({
      hotlinePhone,
      whatsappPhone,
      clinicExtension: clinicExt,
      emergencyEmail,
      officeLocation,
      officeHours,
      counselorLead,
      additionalNotice,
      customContacts,
      updatedAt: new Date().toISOString()
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const getCategoryBadge = (cat: VillageContactItem['category']) => {
    switch (cat) {
      case 'mental_health':
        return {
          label: 'Mental Health & Wellbeing',
          bg: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
        };
      case 'clinic':
        return {
          label: 'Health Center & Clinic',
          bg: 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800'
        };
      case 'security':
        return {
          label: 'Village Security & Safety',
          bg: 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800'
        };
      case 'counseling':
        return {
          label: 'School Guidance & Counseling',
          bg: 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
        };
      default:
        return {
          label: 'Village Support',
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1b4327] via-[#245934] to-[#1e4a2c] rounded-3xl p-6 sm:p-8 text-white shadow-sm border border-emerald-700/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-bold border border-emerald-400/30">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-300" />
              <span>Official ASYV Care Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
              {t.contactsPageTitle}
            </h1>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              {t.contactsPageSubtitle}
            </p>
          </div>

          {canEdit && (
            <div className="shrink-0 flex items-center gap-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#eec149] hover:bg-[#dfb33e] text-slate-950 shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>{isEditing ? t.close : t.updateContactsBtn}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center gap-3 text-sm font-semibold animate-in fade-in">
          <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Village support contacts and hotline numbers updated successfully across all student accounts!</span>
        </div>
      )}

      {/* Editor Panel for Social Workers & Developers */}
      {isEditing && canEdit && (
        <form onSubmit={handleSaveAll} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-[#245934] shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#245934] dark:text-emerald-400" />
                <span>Modify Village Hotlines & Official Contacts</span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Changes saved here take immediate effect for all students in Ingabe, Ingabo, and Ijabo grades.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold">
              Admin & Social Worker Access
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                24/7 Village Crisis Hotline Number
              </label>
              <input
                type="text"
                value={hotlinePhone}
                onChange={e => setHotlinePhone(e.target.value)}
                placeholder="+250 788 312 400"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-[#245934]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Confidential WhatsApp Support Line
              </label>
              <input
                type="text"
                value={whatsappPhone}
                onChange={e => setWhatsappPhone(e.target.value)}
                placeholder="+250 788 312 401"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-[#245934]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Village Health Clinic Extension
              </label>
              <input
                type="text"
                value={clinicExt}
                onChange={e => setClinicExt(e.target.value)}
                placeholder="Village Health Center · Ext 104"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#245934]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Psychosocial Care Email
              </label>
              <input
                type="email"
                value={emergencyEmail}
                onChange={e => setEmergencyEmail(e.target.value)}
                placeholder="wellbeing@asyv.org"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#245934]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Office / Support Room Location
              </label>
              <input
                type="text"
                value={officeLocation}
                onChange={e => setOfficeLocation(e.target.value)}
                placeholder="ASYV Psychosocial Support Center · Main Campus"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#245934]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Office Working Hours & Coverage
              </label>
              <input
                type="text"
                value={officeHours}
                onChange={e => setOfficeHours(e.target.value)}
                placeholder="Monday – Friday: 7:30 AM – 5:30 PM (24/7 on-call)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#245934]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Psychosocial Desk Lead / Contact Officer
            </label>
            <input
              type="text"
              value={counselorLead}
              onChange={e => setCounselorLead(e.target.value)}
              placeholder="Village Psychosocial Coordination Desk"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#245934]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Important Guidance Notice for Students
            </label>
            <textarea
              rows={2}
              value={additionalNotice}
              onChange={e => setAdditionalNotice(e.target.value)}
              placeholder="Confidential, trauma-informed school care dedicated to ASYV youth wellness."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#245934]"
            />
          </div>

          {/* Manage Custom Contacts in Form */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#245934] dark:text-emerald-400" />
              <span>Add Specific Village Contacts (Mental Health, Security, Clinic Staff)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <input
                type="text"
                placeholder="Person / Role Name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
              />
              <input
                type="text"
                placeholder="Role / Title"
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={newPhone}
                onChange={e => setNewPhone(e.target.value)}
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono"
              />
              <div className="flex gap-2">
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                >
                  <option value="mental_health">Mental Health</option>
                  <option value="clinic">Clinic</option>
                  <option value="security">Security</option>
                  <option value="counseling">Counseling</option>
                  <option value="general">General</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddCustomContact}
                  className="px-3 py-2 bg-[#245934] text-white rounded-lg text-xs font-bold hover:bg-[#1b4327] cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {customContacts.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  Current Custom Contacts ({customContacts.length}):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {customContacts.map(c => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">{c.name}</div>
                        <div className="text-slate-500 dark:text-slate-400">{c.role} · <span className="font-mono">{c.phone}</span></div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomContact(c.id)}
                        className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
                        title="Remove contact"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#245934] hover:bg-[#1b4327] text-white shadow-md cursor-pointer transition-all"
            >
              {t.saveAllNumbersBtn}
            </button>
          </div>
        </form>
      )}

      {/* Main Grid: Primary Emergency Hotlines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 24/7 Hotline Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="w-2.5 bg-rose-500 absolute left-0 top-0 bottom-0" />
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300">
                <ShieldAlert className="w-3.5 h-3.5" />
                24/7 On-Call Support
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 pt-1">
                {t.crisisHotlineCardTitle}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {t.crisisHotlineCardDesc}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/50 flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                {t.emergencyHotlineLabel}
              </div>
              <div className="text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-slate-100">
                {contactInfo.hotlinePhone || '+250 788 312 400'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(contactInfo.hotlinePhone || '+250 788 312 400', 'hotline')}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-rose-200 dark:border-rose-800/40 cursor-pointer shadow-xs transition-colors"
                title={t.copy}
              >
                {copiedKey === 'hotline' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <a
                href={`tel:${(contactInfo.hotlinePhone || '+250788312400').replace(/\s+/g, '')}`}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <PhoneForwarded className="w-4 h-4" />
                <span>{t.callNow}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Confidential WhatsApp Helpline Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="w-2.5 bg-emerald-500 absolute left-0 top-0 bottom-0" />
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
                <MessageCircle className="w-3.5 h-3.5" />
                Confidential Messaging
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 pt-1">
                {t.whatsappDeskCardTitle}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {t.whatsappDeskCardDesc}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50 flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                {t.whatsappCrisisLabel}
              </div>
              <div className="text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-slate-100">
                {contactInfo.whatsappPhone || '+250 788 312 401'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(contactInfo.whatsappPhone || '+250 788 312 401', 'whatsapp')}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-emerald-200 dark:border-emerald-800/40 cursor-pointer shadow-xs transition-colors"
                title={t.copy}
              >
                {copiedKey === 'whatsapp' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <a
                href={`https://wa.me/${(contactInfo.whatsappPhone || '+250788312401').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Chat</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Facilities & Location Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Clinic Extension */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t.healthClinicLabel}
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {t.medicalClinicCardTitle}
              </div>
            </div>
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            {contactInfo.clinicExtension || 'Village Health Center · Extension 104'}
          </div>
        </div>

        {/* Office Location */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t.officeLocationCardTitle}
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Main Campus
              </div>
            </div>
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 truncate" title={contactInfo.officeLocation}>
            {contactInfo.officeLocation || 'ASYV Psychosocial Support Center · Rubona'}
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t.workingHoursCardTitle}
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Daily Coverage
              </div>
            </div>
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            {contactInfo.officeHours || 'Mon – Fri: 7:30 AM – 5:30 PM'}
          </div>
        </div>

        {/* Support Email */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t.villageEmailCardTitle}
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Official Inquiries
              </div>
            </div>
          </div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 truncate">
            {contactInfo.emergencyEmail || 'wellbeing@asyv.org'}
          </div>
        </div>
      </div>

      {/* Verified Support Contacts Roster (Mental Health, Guidance, Village Personnel) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
              <HeartHandshake className="w-5 h-5 text-[#245934] dark:text-emerald-400" />
              <span>{t.villageMentorsTitle}</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {t.villageMentorsSubtitle}
            </p>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Desk Lead: <span className="font-bold text-slate-800 dark:text-slate-200">{contactInfo.counselorLead || 'Village Psychosocial Desk'}</span>
          </div>
        </div>

        {/* Contacts Roster */}
        {contactInfo.customContacts && contactInfo.customContacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contactInfo.customContacts.map((contact, idx) => {
              const badge = getCategoryBadge(contact.category);
              return (
                <div
                  key={contact.id || idx}
                  className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between space-y-4 hover:border-[#245934] dark:hover:border-emerald-500 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                        {badge.label}
                      </span>
                      <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                        {contact.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {contact.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 dark:border-slate-700/60">
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      {contact.phone}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => copyToClipboard(contact.phone, `contact-${idx}`)}
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 cursor-pointer"
                        title={t.copy}
                      >
                        {copiedKey === `contact-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <a
                        href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                        className="px-3 py-1.5 rounded-lg bg-[#245934] hover:bg-[#1b4327] text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{t.callNow}</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700">
            <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No Additional Support Staff Listed
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
              The primary 24/7 Village Crisis Hotline and WhatsApp Psychosocial Desk above are fully staffed and operational around the clock.
            </p>
          </div>
        )}

        {/* Administration Notice Callout */}
        {contactInfo.additionalNotice && (
          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
              <span className="font-bold">Village Psychosocial Notice: </span>
              {contactInfo.additionalNotice}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
