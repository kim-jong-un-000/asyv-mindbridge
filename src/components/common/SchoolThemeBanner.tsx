import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Compass, Shield, Award } from 'lucide-react';
import { TRANSLATIONS } from '../../utils/i18n';
import { ASSETS } from '../../utils/assets';

export const SchoolThemeBanner: React.FC = () => {
  const { language, appCustomization } = useApp();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const displayMotto = (appCustomization?.schoolMotto || t.motto).toUpperCase();
  const displaySubMotto = appCustomization?.schoolSubMotto || 'Ingabe · Ingabo · Ijabo';

  return (
    <div className="mb-6 relative group overflow-hidden rounded-3xl border border-amber-300/60 dark:border-amber-500/30 shadow-xs bg-gradient-to-r from-[#1b4327] via-[#245934] to-[#163821] text-white">
      <div className="relative px-5 py-4 sm:px-8 sm:py-5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Side: School Emblem & Big Motto */}
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 dark:bg-white/15 p-1.5 border border-white/25 flex items-center justify-center shrink-0 shadow-inner">
            <img
              src={ASSETS.emblem}
              alt="ASYV Emblem"
              className="w-full h-full object-contain filter drop-shadow-xs"
            />
          </div>

          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] sm:text-[11px] font-black tracking-widest uppercase text-[#eec149]">
              <Sparkles className="w-3.5 h-3.5 text-[#eec149]" />
              <span>Agahozo-Shalom Village Motto</span>
              <span className="text-white/40">·</span>
              <span className="text-emerald-200">{displaySubMotto}</span>
            </div>

            {/* BIG AND UPPERCASE MOTTO */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black font-display tracking-wider uppercase text-white drop-shadow-xs mt-0.5">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300">
                {displayMotto}
              </span>
            </h1>

            <div className="text-[11px] sm:text-xs font-semibold text-amber-200/90 tracking-wide mt-1">
              “Urebeye kure ugera kure · If you see far, you will go far”
            </div>
          </div>
        </div>

        {/* Right Side: Philosophy Badge & Grade Pillars */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-white/15 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#eec149]" />
            <span className="uppercase tracking-wider text-[11px]">Learn</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/15 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#f28e2b]" />
            <span className="uppercase tracking-wider text-[11px]">Adapt</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/15 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-300" />
            <span className="uppercase tracking-wider text-[11px]">Lead</span>
          </div>
        </div>
      </div>
    </div>
  );
};
