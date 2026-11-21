import React from 'react';
import { Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { appCustomization } = useApp();

  return (
    <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-4 text-center">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 font-medium">
          <span>{appCustomization?.portalTitle || 'Mind Bridge'} Psychosocial Platform</span>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <span>{appCustomization?.schoolSubMotto || 'Ingabe · Ingabo · Ijabo'}</span>
        </div>
        
        {/* Required tagline */}
        <div className="font-semibold text-teal-800 dark:text-teal-400 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>{appCustomization?.footerTagline || 'made to support the ASYV social workers support!'}</span>
        </div>

        <div className="text-[11px] text-slate-400 dark:text-slate-500">
          Agahozo-Shalom Youth Village · Village Healing & Community Care
        </div>
      </div>
    </footer>
  );
};
