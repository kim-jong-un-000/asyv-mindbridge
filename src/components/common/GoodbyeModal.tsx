import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, Sparkles, X, RefreshCw, Quote, ArrowRight } from 'lucide-react';
import { INSPIRING_EMOTIONAL_QUOTES } from '../../data/initialData';

const MODAL_I18N = {
  en: {
    heading: 'Until Next Time! 🌟',
    badge: 'Inspiring Court of Encouragement',
    refreshQuote: 'Another Inspiring Quote',
    returnBtn: 'Return to Portal Sign-In',
    footerReminder: 'Remember: Healing is a continuous journey in community. You are valued, capable, and never alone at ASYV.'
  },
  rw: {
    heading: 'Mubeho Neza! 🌟',
    badge: 'Icyumba cy\'Amagambo Yubaka n\'Inama',
    refreshQuote: 'Rondora Ayandi Magambo Yubaka',
    returnBtn: 'Subira Ahandikirwa Kwinjira',
    footerReminder: 'Ibuka: Gukira ibikomere ni urugendo dukorana mu muryango. Ufite agaciro, urashoboye, kandi ntiwigunze muri ASYV.'
  },
  fr: {
    heading: 'À la Prochaine ! 🌟',
    badge: 'Cour d\'Inspiration et de Soutien Émotionnel',
    refreshQuote: 'Autre Citation Inspirante',
    returnBtn: 'Retourner à la Page de Connexion',
    footerReminder: 'Rappelez-vous : La guérison est un voyage continu au sein de la communauté. Vous avez une grande valeur et vous n\'êtes jamais seul à ASYV.'
  }
};

export const GoodbyeModal: React.FC = () => {
  const { showGoodbyeModal, closeGoodbyeModal, goodbyeMessage, language, appCustomization } = useApp();
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  if (!showGoodbyeModal) return null;

  const t = MODAL_I18N[language] || MODAL_I18N.en;

  const currentQuote = INSPIRING_EMOTIONAL_QUOTES[quoteIndex % INSPIRING_EMOTIONAL_QUOTES.length];

  const handleNextQuote = () => {
    setQuoteIndex(prev => (prev + 1) % INSPIRING_EMOTIONAL_QUOTES.length);
  };

  const displayQuoteText = appCustomization?.customInspirationalQuote && quoteIndex === 0
    ? appCustomization.customInspirationalQuote
    : currentQuote.quote[language] || currentQuote.quote.en;

  const displayAuthor = appCustomization?.customQuoteAuthor && quoteIndex === 0
    ? appCustomization.customQuoteAuthor
    : `${currentQuote.author} · ${currentQuote.sourceOrRole}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 text-center shadow-2xl border border-slate-200 relative overflow-hidden">
        {/* Top Decorative Header Strip */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#245934] via-[#d95f18] to-[#eec149]" />

        <button
          onClick={closeGoodbyeModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 bg-emerald-50 text-[#245934] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs ring-4 ring-emerald-50/50">
          <Heart className="w-8 h-8 fill-[#245934] text-[#245934]" />
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display mb-1.5">
          {t.heading}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
          {goodbyeMessage}
        </p>

        {/* INSPIRATIONAL & EMOTIONAL SUPPORT COURT CARD */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1b4327] via-[#245934] to-[#122e1b] text-white text-left relative overflow-hidden shadow-inner mb-4 group">
          <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
            <Quote className="w-32 h-32" />
          </div>

          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#eec149] bg-black/20 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#eec149]" />
              <span>{t.badge}</span>
            </span>

            <button
              type="button"
              onClick={handleNextQuote}
              className="text-[11px] font-bold text-emerald-100 hover:text-white flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              title={t.refreshQuote}
            >
              <RefreshCw className="w-3 h-3" />
              <span>{t.refreshQuote}</span>
            </button>
          </div>

          <p className="text-sm sm:text-base font-semibold leading-relaxed text-amber-50 italic mb-3">
            "{displayQuoteText}"
          </p>

          <div className="text-[11px] text-emerald-200/90 font-medium flex items-center justify-between border-t border-white/10 pt-2">
            <span>— {displayAuthor}</span>
            <span className="text-[10px] uppercase font-bold text-[#eec149]">ASYV Sanctuary</span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] text-slate-600 mb-5 leading-relaxed text-left flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-[#d95f18] shrink-0 mt-0.5" />
          <span>{t.footerReminder}</span>
        </div>

        <button
          onClick={closeGoodbyeModal}
          className="w-full py-3 px-4 bg-[#245934] hover:bg-[#1b4327] text-white font-bold rounded-2xl text-xs sm:text-sm transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
        >
          <span>{t.returnBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
