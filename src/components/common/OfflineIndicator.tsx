import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-2xl bg-white dark:bg-[#091b11] border-2 border-[#eec149] px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white shadow-2xl animate-fadeIn">
      <span className="w-2.5 h-2.5 rounded-full bg-[#eec149] animate-ping shrink-0" />
      <WifiOff className="w-4 h-4 text-[#9a6b00] dark:text-[#eec149] shrink-0" />
      <span>Offline Mode — Cached data is active. Changes will sync when reconnected.</span>
    </div>
  );
};
