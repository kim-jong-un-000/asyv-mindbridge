import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface StudentPasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMandatoryPrompt?: boolean;
}

export const StudentPasswordChangeModal: React.FC<StudentPasswordChangeModalProps> = ({
  isOpen,
  onClose,
  isMandatoryPrompt = false
}) => {
  const { currentUser, updateUser, addAuditLog } = useApp();

  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!newPassword.trim()) {
      setErrorMsg('Please enter your new password.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('For your account security, your new password must have at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('The new passwords do not match. Please re-enter them carefully.');
      return;
    }

    // Verify current password if user has an existing password and isn't empty
    if (currentUser.password && currentPasswordInput.trim() && currentPasswordInput.trim() !== currentUser.password) {
      setErrorMsg('The current password entered does not match your existing account password.');
      return;
    }

    setIsSubmitting(true);
    try {
      updateUser(currentUser.id, {
        password: newPassword.trim(),
        hasCustomPassword: true,
        mustChangePassword: false,
        passwordChangedAt: new Date().toISOString()
      });

      addAuditLog(
        'PROFILE_UPDATED',
        `Student ${currentUser.name} (${currentUser.grade}) updated their personal login password`,
        'info'
      );

      setSuccessMsg('Your password has been changed successfully! Next time you sign in, use this new password.');
      
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
        setNewPassword('');
        setConfirmPassword('');
        setCurrentPasswordInput('');
      }, 2200);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to update password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-none animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl w-full max-w-lg shadow-2xl border-2 border-emerald-900/30 dark:border-emerald-500/30 overflow-hidden relative">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#1b4327] to-[#245934] text-white p-6 relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 border border-white/25">
                <KeyRound className="w-6 h-6 text-[#eec149]" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-[#eec149]">
                  ASYV Account Security
                </div>
                <h2 className="text-xl font-black font-display text-white">
                  Change Your Student Password
                </h2>
              </div>
            </div>

            {!isMandatoryPrompt && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <p className="text-xs text-emerald-100/90 mt-3 leading-relaxed relative z-10">
            Welcome, <strong>{currentUser.name}</strong>! Set a private personal password for your Mind Bridge account. Next time you log in, you will use this new password.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-2xl text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {/* Current Password (optional if default) */}
            {currentUser.password && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Current Password (Optional if first time)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPasswordInput}
                    onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    placeholder="Enter current password or leave blank"
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:border-[#245934] dark:focus:border-emerald-400 outline-hidden font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                New Personal Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4 text-[#245934] dark:text-emerald-400" />
                </div>
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new private password (min 6 chars)"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:border-[#245934] dark:focus:border-emerald-400 outline-hidden font-mono font-bold"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                Choose a password you will remember next time you sign into Mind Bridge.
              </span>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Confirm New Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4 text-[#245934] dark:text-emerald-400" />
                </div>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password to confirm"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:border-[#245934] dark:focus:border-emerald-400 outline-hidden font-mono font-bold"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Helper Guidance */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                Once saved, your login credentials are automatically updated across all devices. Keep your password confidential.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              {!isMandatoryPrompt ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  I'll Do This Later
                </button>
              ) : (
                <span className="text-[11px] text-slate-400 italic">Required for security</span>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-auto px-6 py-2.5 bg-[#245934] hover:bg-[#1b4327] text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>Save New Password</span>
                <ArrowRight className="w-4 h-4 text-[#eec149]" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
