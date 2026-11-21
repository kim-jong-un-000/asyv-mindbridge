import React from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, X, HeartHandshake } from 'lucide-react';

export const HelpWelcomeBanner: React.FC = () => {
  const {
    currentUser,
    showHelpBanner,
    dismissHelpBanner,
    getSocialWorkerForGrade,
    setActivePage,
    appCustomization
  } = useApp();

  if (!currentUser || currentUser.role !== 'student' || !showHelpBanner) {
    return null;
  }

  const worker = getSocialWorkerForGrade(currentUser.grade);
  const workerName = worker ? worker.name : 'your psychosocial worker';

  const handleStartChat = () => {
    dismissHelpBanner();
    setActivePage('chat');
  };

  return (
    <div className="mb-6 bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-teal-600/40 relative overflow-hidden animate-fadeIn">
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-radial from-white to-transparent pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0 border border-white/20">
            <span className="text-2xl" role="img" aria-label="counselor">💁‍♂️</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                ASYV Support Welcome Check-In
              </span>
            </div>
            {/* Dynamic required prompt format */}
            <h2 className="text-lg sm:text-xl font-bold mt-1 text-white font-display">
              {appCustomization?.welcomeBannerTitle
                ? appCustomization.welcomeBannerTitle.replace('{workerName}', workerName)
                : `Do you need any help from ${workerName}, 💁‍♂️?`}
            </h2>
            <p className="text-xs sm:text-sm text-teal-100/90 mt-1 max-w-xl">
              {appCustomization?.welcomeBannerSubtitle ||
                `Your ${currentUser.grade} Grade social worker is available right now for confidential listening, academic support, or just a quiet conversation.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <button
            onClick={handleStartChat}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-teal-900 hover:bg-teal-50 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <MessageSquare className="w-4 h-4 text-teal-700" />
            <span>Chat with {workerName.split(' ')[0]} Now</span>
          </button>
          <button
            onClick={dismissHelpBanner}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            title="I'm doing well today"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
