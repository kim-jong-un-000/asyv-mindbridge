import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle2, Share2, PlusSquare } from 'lucide-react';

export const PWAInstallButton: React.FC<{ variant?: 'nav' | 'banner' | 'sidebar' }> = ({ variant = 'nav' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running as an installed PWA on the phone or PC, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  // Show button for installable devices (Android / Desktop Chrome / Edge) or iOS devices
  if (!isInstallable && !isIOS) {
    // Ambient desktop/mobile fallback: provide install guidance
    return null;
  }

  if (variant === 'sidebar') {
    return (
      <>
        <button
          type="button"
          onClick={handleInstallClick}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold bg-[#1b4327] hover:bg-[#245934] text-[#eec149] border border-[#eec149]/40 shadow-xs cursor-pointer transition-all group"
          title="Install Mind Bridge as an official App on this device"
        >
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-[#eec149] group-hover:scale-110 transition-transform" />
            <span>Install Mind Bridge App</span>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#eec149] text-slate-950 font-black">
            APP
          </span>
        </button>

        {showIOSGuide && <IOSInstallModal onClose={() => setShowIOSGuide(false)} />}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#245934] hover:bg-emerald-800 text-white shadow-xs border border-emerald-400/40 cursor-pointer transition-all hover:scale-105"
        title="Install Mind Bridge App on your phone, tablet, or computer"
      >
        <Smartphone className="w-3.5 h-3.5 text-[#eec149]" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </button>

      {installSuccess && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1b4327] text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-emerald-400/40 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#eec149]" />
          <span>Mind Bridge installed to home screen!</span>
        </div>
      )}

      {showIOSGuide && <IOSInstallModal onClose={() => setShowIOSGuide(false)} />}
    </>
  );
};

const IOSInstallModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-[#091b11] text-white p-6 shadow-2xl border-2 border-[#245934] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-[#eec149]" />
            <h3 className="font-display font-bold text-base text-white">Install on iPhone / iPad</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Install ASYV Mind Bridge directly to your home screen for instant worldwide access, full offline capabilities, and fullscreen view without browser bars:
        </p>

        <div className="space-y-3 bg-[#050f09] p-4 rounded-2xl border border-[#245934]/60 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-[#245934] text-[#eec149] flex items-center justify-center font-bold text-xs shrink-0">
              1
            </div>
            <div>
              Tap the <strong className="text-[#eec149] inline-flex items-center gap-1">Share <Share2 className="w-3 h-3 inline" /></strong> button in Safari's bottom toolbar.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-[#245934] text-[#eec149] flex items-center justify-center font-bold text-xs shrink-0">
              2
            </div>
            <div>
              Scroll down and tap <strong className="text-[#eec149] inline-flex items-center gap-1">Add to Home Screen <PlusSquare className="w-3 h-3 inline" /></strong>.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-[#245934] text-[#eec149] flex items-center justify-center font-bold text-xs shrink-0">
              3
            </div>
            <div>
              Tap <strong className="text-emerald-300">Add</strong> at top right. Mind Bridge will appear on your phone alongside your apps!
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#245934] hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
