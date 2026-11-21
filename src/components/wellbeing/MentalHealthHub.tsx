import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  INSPIRING_EMOTIONAL_QUOTES,
  ASYV_COLOR_PALETTES,
  AsyvColorPalette
} from '../../data/initialData';
import { QuoteTheme, AsyvColorKey, AppLanguage } from '../../types';
import {
  Sparkles,
  Heart,
  Quote,
  RefreshCw,
  Copy,
  Check,
  Globe,
  Smile,
  Shield,
  BookOpen,
  Award,
  Sun,
  Flame,
  Activity,
  Layers,
  ArrowRight,
  PhoneCall,
  Volume2,
  Wind,
  CheckCircle2
} from 'lucide-react';

export const MentalHealthHub: React.FC = () => {
  const {
    currentUser,
    language,
    setLanguage,
    appCustomization,
    setAsyvPalette,
    contactInfo,
    setActivePage
  } = useApp();

  // Active section tab
  const [activeTab, setActiveTab] = useState<'quotes' | 'colors' | 'grounding' | 'pillars'>('quotes');

  // Inspiring Quotes States
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [randomQuoteIdx, setRandomQuoteIdx] = useState<number>(0);
  const [copiedQuoteId, setCopiedQuoteId] = useState<string | null>(null);
  const [quoteLang, setQuoteLang] = useState<AppLanguage>(language || 'en');

  // 5-4-3-2-1 Sensory Grounding States
  const [groundingStep, setGroundingStep] = useState<number>(0);

  // Breathing Pacer States (4-7-8 Method)
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathSecondsLeft, setBreathSecondsLeft] = useState<number>(4);
  const [breathCyclesCompleted, setBreathCyclesCompleted] = useState<number>(0);

  // Active ASYV Color Palette
  const activePaletteKey: AsyvColorKey = appCustomization?.activeAsyvPalette || 'forest';
  const activePaletteObj = ASYV_COLOR_PALETTES.find(p => p.id === activePaletteKey) || ASYV_COLOR_PALETTES[0];

  // Filtered Quotes
  const filteredQuotes = INSPIRING_EMOTIONAL_QUOTES.filter(
    q => selectedTheme === 'all' || q.theme === selectedTheme
  );

  const currentFeaturedQuote = filteredQuotes[randomQuoteIdx % Math.max(filteredQuotes.length, 1)] || INSPIRING_EMOTIONAL_QUOTES[0];

  const handleShuffleQuote = () => {
    setRandomQuoteIdx(prev => prev + 1);
  };

  const handleCopyQuote = (quoteText: string, author: string, id: string) => {
    const textToCopy = `"${quoteText}" — ${author} (Agahozo-Shalom Youth Village Mind Bridge)`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedQuoteId(id);
    setTimeout(() => setCopiedQuoteId(null), 2500);
  };

  // Breathing Pacer Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathSecondsLeft((prev) => {
          if (prev <= 1) {
            if (breathPhase === 'inhale') {
              setBreathPhase('hold');
              return 7;
            } else if (breathPhase === 'hold') {
              setBreathPhase('exhale');
              return 8;
            } else {
              setBreathPhase('inhale');
              setBreathCyclesCompleted(c => c + 1);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathPhase('inhale');
      setBreathSecondsLeft(4);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreathingActive, breathPhase]);

  // 5-4-3-2-1 Sensory Grounding steps definition
  const SENSORY_STEPS = [
    {
      count: 5,
      title: 'Notice 5 Things You Can SEE',
      kinyarwanda: 'Reba ibintu 5 ubona hafi yawe',
      description: 'Look around your room, the dining hall, or across the village hills. Notice details: the wood grain on the desk, the shape of the eucalyptus leaves, the sunlight on the window sill.',
      example: 'e.g. A book cover, shoes, sky horizon, a door handle, a friend\'s smile'
    },
    {
      count: 4,
      title: 'Feel 4 Things You Can TOUCH',
      kinyarwanda: 'Kora ku bintu 4 wumva ubukonje cyangwa ubushyuhe bwabyo',
      description: 'Bring your physical awareness into this exact moment. Feel the solid ground beneath your feet, the fabric of your school sweater, the cool surface of your notebook.',
      example: 'e.g. Ground under your feet, fabric of shirt, notebook cover, your own palms'
    },
    {
      count: 3,
      title: 'Hear 3 Things You Can HEAR',
      kinyarwanda: 'Tega amatwi wumve amajwi 3 atandukanye',
      description: 'Listen closely without judging. The rustle of wind through the acacia trees, birds chirping over Rubona, distant chatter, or your own slow breath.',
      example: 'e.g. Birds chirping, distant footsteps, the breeze, gentle murmurs'
    },
    {
      count: 2,
      title: 'Smell 2 Things You Can SMELL',
      kinyarwanda: 'Humurirwa n\'umwuka w\'ibintu 2 bihehereye',
      description: 'Take a soft, natural breath through your nose. Notice the clean morning air, rain on the soil (petrichor), tea from the dining hall, or fresh paper.',
      example: 'e.g. Fresh village air, grass after rain, soap on hands'
    },
    {
      count: 1,
      title: 'Name 1 Positive Truth About YOURSELF',
      kinyarwanda: 'Vuga ukuri 1 kwiza ku byerekeye ubushobozi bwawe',
      description: 'Say it in your heart or out loud: You survived every difficult day before this. You have a purpose in this village family. You are growing into a leader.',
      example: 'e.g. "I am resilient", "I am worthy of peace", "I am not alone in ASYV"'
    }
  ];

  // Cognitive Reframing Scenarios (CBT growth mindset)
  const COGNITIVE_REFRAMES = [
    {
      situation: 'Getting a difficult grade on a test or quiz',
      negativeThought: '"I failed this quiz, I am not smart enough to succeed here."',
      positiveReframe: '"This test score is feedback on my preparation strategy, not my intellectual capacity. I will review with my study group and visit my teacher for tutoring."',
      pillar: 'Academic Growth'
    },
    {
      situation: 'Feeling homesick or missing family during dorm evenings',
      negativeThought: '"I feel alone and overwhelmed, everyone else seems totally happy."',
      positiveReframe: '"Missing home is normal and shows how deeply I love my people. My ASYV family house mentors and peers care about me, and this feeling will pass."',
      pillar: 'Emotional Solidarity'
    },
    {
      situation: 'Feeling hesitant to speak to a grade social worker',
      negativeThought: '"If I go to counseling, people might think I am weak or broken."',
      positiveReframe: '"Speaking with Jean-Luc, Aline, or Emmanuel is what mature leaders do. Sharing my feelings early protects my peace and helps me flourish."',
      pillar: 'Courage & Dignity'
    },
    {
      situation: 'Comparing myself to high-achieving classmates',
      negativeThought: '"Look how effortlessly they speak or understand chemistry. I am far behind."',
      positiveReframe: '"Life is not a race against my brothers and sisters. We celebrate each other\'s gifts. My journey has unique strength and wisdom."',
      pillar: 'Self-Compassion'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Top Banner with ASYV Colors and Identity */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1b4327] via-[#245934] to-[#d95f18] text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold tracking-wide uppercase text-amber-200 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Agahozo-Shalom Youth Village · Psychosocial Care</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight">
              ASYV Colors, Inspiring Wisdom & Mental Wellbeing Hub
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-sans">
              Explore the rich color heritage of our village, draw strength from timeless Rwandan and global wisdom, and practice evidence-based grounding techniques for emotional peace.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('quotes')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'quotes'
                  ? 'bg-white text-[#245934] shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              Inspiring Quotes
            </button>
            <button
              onClick={() => setActiveTab('colors')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'colors'
                  ? 'bg-white text-[#245934] shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              ASYV Palette ({ASYV_COLOR_PALETTES.length})
            </button>
            <button
              onClick={() => setActiveTab('grounding')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'grounding'
                  ? 'bg-white text-[#245934] shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              Breathing & Grounding
            </button>
            <button
              onClick={() => setActiveTab('pillars')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'pillars'
                  ? 'bg-white text-[#245934] shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              Wellbeing Pillars
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: INSPIRING QUOTES & WISDOM LIBRARY                      */}
      {/* ============================================================== */}
      {activeTab === 'quotes' && (
        <div className="space-y-6">
          {/* Spotlight Quote Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-[#d95f18] flex items-center justify-center font-bold">
                  <Quote className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#d95f18]">
                    Daily Village Inspiration
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 font-display">
                    Words to Nourish Your Mind & Spirit
                  </h2>
                </div>
              </div>

              {/* Language Switcher for Quote */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setQuoteLang('rw')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    quoteLang === 'rw' ? 'bg-[#245934] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🇷🇼 Kinyarwanda
                </button>
                <button
                  onClick={() => setQuoteLang('en')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    quoteLang === 'en' ? 'bg-[#245934] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🇬🇧 English
                </button>
                <button
                  onClick={() => setQuoteLang('fr')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    quoteLang === 'fr' ? 'bg-[#245934] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🇫🇷 Français
                </button>
              </div>
            </div>

            {/* Quote Body */}
            <div className="my-6 pl-3 sm:pl-6 border-l-4 border-[#245934]">
              <p className="text-lg sm:text-xl md:text-2xl font-serif text-slate-800 leading-relaxed italic">
                "{currentFeaturedQuote.quote[quoteLang] || currentFeaturedQuote.quote.en}"
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-slate-900 text-sm">
                  {currentFeaturedQuote.author}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-[#d95f18] font-semibold">
                  {currentFeaturedQuote.sourceOrRole}
                </span>
                <span className="text-slate-400">·</span>
                <span className="capitalize font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  Theme: {currentFeaturedQuote.theme}
                </span>
              </div>
            </div>

            {/* Actions: Shuffle & Copy */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Displaying 1 of {filteredQuotes.length} quotes in this collection
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyQuote(
                    currentFeaturedQuote.quote[quoteLang] || currentFeaturedQuote.quote.en,
                    currentFeaturedQuote.author,
                    currentFeaturedQuote.id
                  )}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {copiedQuoteId === currentFeaturedQuote.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Quote</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleShuffleQuote}
                  className="px-4 py-2 bg-[#245934] hover:bg-[#1b4327] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Next Inspiring Quote</span>
                </button>
              </div>
            </div>
          </div>

          {/* Theme Filter Bar */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-xs font-bold text-slate-400 mr-1">Filter by Theme:</span>
            {['all', 'hope', 'healing', 'resilience', 'leadership', 'courage', 'wisdom', 'solidarity', 'mindfulness'].map(th => (
              <button
                key={th}
                onClick={() => setSelectedTheme(th)}
                className={`px-3 py-1.5 rounded-xl font-bold capitalize transition-all cursor-pointer ${
                  selectedTheme === th
                    ? 'bg-[#245934] text-white shadow-2xs'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                }`}
              >
                {th}
              </button>
            ))}
          </div>

          {/* Grid of All Quotes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuotes.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2.5">
                    <span className="font-bold text-[#d95f18] uppercase tracking-wider capitalize">
                      {q.theme}
                    </span>
                    <button
                      onClick={() => handleCopyQuote(
                        q.quote[quoteLang] || q.quote.en,
                        q.author,
                        q.id
                      )}
                      className="text-slate-400 hover:text-[#245934] p-1 cursor-pointer"
                      title="Copy quote"
                    >
                      {copiedQuoteId === q.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 italic leading-relaxed font-serif">
                    "{q.quote[quoteLang] || q.quote.en}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-900">{q.author}</div>
                  <div className="text-[11px] text-slate-500 truncate">{q.sourceOrRole}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: ASYV ATTRACTIVE COLORS COLLECTION                      */}
      {/* ============================================================== */}
      {activeTab === 'colors' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#245934]">
                  Visual Heritage & Harmony
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 font-display">
                  The Official Color Collection of ASYV
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Every hue in Agahozo-Shalom carries profound meaning: the green hills, the warm terracotta roofs, the sunrise over Lake Muhazi, and the royal purple jacaranda blossoms.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Active Palette:</span>
                <span className="px-3 py-1 bg-emerald-50 text-[#245934] border border-emerald-200 rounded-xl text-xs font-black">
                  {activePaletteObj.name}
                </span>
              </div>
            </div>

            {/* Colors Showcase Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
              {ASYV_COLOR_PALETTES.map((palette) => {
                const isActive = activePaletteKey === palette.id;
                return (
                  <div
                    key={palette.id}
                    className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                      isActive
                        ? 'border-[#245934] ring-2 ring-[#245934]/30 shadow-md bg-white'
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div>
                      {/* Color Preview Swatch */}
                      <div
                        className="h-20 rounded-xl w-full mb-4 shadow-inner relative flex items-end p-2.5"
                        style={{ backgroundColor: palette.hex }}
                      >
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-black/60 text-white">
                          {palette.hex}
                        </span>
                        {isActive && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-900 shadow-xs">
                            Active
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          {palette.name}
                        </h3>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {palette.id}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-[#d95f18] mt-0.5">
                        {palette.nameKinyarwanda}
                      </div>

                      <div className="mt-3 text-xs text-slate-600 leading-relaxed">
                        {palette.description}
                      </div>

                      <div className="mt-2.5 p-2 bg-slate-50 rounded-xl text-[11px] text-slate-500 border border-slate-100">
                        <strong className="text-slate-700">Symbolism:</strong> {palette.symbolism}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => setAsyvPalette(palette.id)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isActive
                            ? 'bg-[#245934] text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Currently Active Palette</span>
                          </>
                        ) : (
                          <span>Apply As Active ASYV Vibe</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: BREATHING & GROUNDING EXERCISES                        */}
      {/* ============================================================== */}
      {activeTab === 'grounding' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Box Breathing Tool (4-7-8) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                    <Wind className="w-5 h-5 text-teal-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 font-display">
                      4-7-8 Restorative Breathing Pacer
                    </h2>
                    <span className="text-[11px] text-teal-700 font-semibold">
                      Parasympathetic Reset for Exam Nervousness & Insomnia
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  Inhale through your nose for 4 seconds, hold gently for 7 seconds, then exhale completely through your mouth for 8 seconds. This biological rhythm signals your nervous system to relax.
                </p>

                {/* Animated Visual Pacer Circle */}
                <div className="my-8 flex flex-col items-center justify-center">
                  <div
                    className={`w-44 h-44 rounded-full flex flex-col items-center justify-center text-white transition-all duration-1000 shadow-lg ${
                      !isBreathingActive
                        ? 'bg-slate-300 scale-95'
                        : breathPhase === 'inhale'
                        ? 'bg-emerald-600 scale-110 shadow-emerald-200'
                        : breathPhase === 'hold'
                        ? 'bg-amber-600 scale-110 shadow-amber-200'
                        : 'bg-teal-700 scale-90 shadow-teal-200'
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-white/90">
                      {isBreathingActive ? breathPhase.toUpperCase() : 'READY'}
                    </span>
                    <span className="text-4xl font-extrabold font-display my-1 tabular-nums">
                      {isBreathingActive ? breathSecondsLeft : '4-7-8'}
                    </span>
                    <span className="text-[11px] text-white/80">
                      {isBreathingActive
                        ? breathPhase === 'inhale' ? 'Deep breath in' : breathPhase === 'hold' ? 'Hold peacefully' : 'Slow exhale out'
                        : 'Click Start Below'}
                    </span>
                  </div>

                  <div className="mt-4 text-xs font-bold text-slate-500">
                    Completed Cycles: <span className="text-[#245934] font-black">{breathCyclesCompleted}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setIsBreathingActive(!isBreathingActive)}
                  className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs ${
                    isBreathingActive
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-[#245934] hover:bg-[#1b4327] text-white'
                  }`}
                >
                  {isBreathingActive ? 'Pause Exercise' : 'Start 4-7-8 Breathing'}
                </button>
                <button
                  onClick={() => {
                    setIsBreathingActive(false);
                    setBreathCyclesCompleted(0);
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* 5-4-3-2-1 Sensory Grounding Tool */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#245934] flex items-center justify-center font-black">
                      5-4-3-2-1
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 font-display">
                        Sensory Grounding Protocol
                      </h2>
                      <span className="text-[11px] text-[#245934] font-semibold">
                        Stop Panic & Racing Thoughts Step-by-Step
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                    Step {groundingStep + 1} of 5
                  </span>
                </div>

                {/* Active Step Display */}
                <div className="my-6 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#245934] text-white flex items-center justify-center text-lg font-black shrink-0">
                      {SENSORY_STEPS[groundingStep].count}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        {SENSORY_STEPS[groundingStep].title}
                      </h3>
                      <div className="text-xs text-[#d95f18] font-bold">
                        {SENSORY_STEPS[groundingStep].kinyarwanda}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed pt-2">
                    {SENSORY_STEPS[groundingStep].description}
                  </p>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-600">
                    <strong className="text-slate-800">Prompt:</strong> {SENSORY_STEPS[groundingStep].example}
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="grid grid-cols-5 gap-2 my-4">
                  {SENSORY_STEPS.map((step, idx) => (
                    <button
                      key={step.count}
                      onClick={() => setGroundingStep(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        groundingStep === idx
                          ? 'bg-[#245934] scale-y-125'
                          : idx < groundingStep
                          ? 'bg-emerald-400'
                          : 'bg-slate-200'
                      }`}
                      title={`Go to step ${step.count}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  disabled={groundingStep === 0}
                  onClick={() => setGroundingStep(prev => Math.max(0, prev - 1))}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Previous
                </button>

                <button
                  onClick={() => setGroundingStep(prev => (prev + 1) % SENSORY_STEPS.length)}
                  className="px-5 py-2 bg-[#245934] hover:bg-[#1b4327] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <span>{groundingStep === 4 ? 'Restart 5-4-3-2-1' : 'Next Sensory Step'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Cognitive Reframing (Flip the Script) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#d95f18]">
                Cognitive Growth Mindset
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Flip the Script: Reframing Negative Thoughts
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Our thoughts shape our feelings. When self-doubt or anxiety arises, challenge unhelpful self-talk with compassionate truth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {COGNITIVE_REFRAMES.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">Situation: {item.situation}</span>
                    <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                      {item.pillar}
                    </span>
                  </div>

                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
                    <strong className="block text-[10px] uppercase font-bold text-rose-700 mb-0.5">
                      ✕ Automatic Anxious Thought:
                    </strong>
                    {item.negativeThought}
                  </div>

                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                    <strong className="block text-[10px] uppercase font-bold text-emerald-700 mb-0.5">
                      ✓ Empowering Village Reframe:
                    </strong>
                    {item.positiveReframe}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: WELLBEING PILLARS & SUPPORT CONTACTS                   */}
      {/* ============================================================== */}
      {activeTab === 'pillars' && (
        <div className="space-y-6">
          {/* The 5 Pillars of Village Whole-Person Health */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#245934]">
                Tikkun Olam & Tikkun Halev
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                The 5 Pillars of Whole-Person Health at ASYV
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Our founders taught us that healing begins in the heart so that youth can go forth and heal the world.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <h3 className="text-xs font-bold text-emerald-900">Emotional Safety</h3>
                <p className="text-[11px] text-emerald-800/90 leading-relaxed">
                  A sanctuary where tears are dried and every feeling is validated without judgment.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-orange-200 text-orange-800 flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <h3 className="text-xs font-bold text-orange-900">Village Solidarity</h3>
                <p className="text-[11px] text-orange-800/90 leading-relaxed">
                  Living as a family house, peer listeners, and caring mentors standing side by side.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <h3 className="text-xs font-bold text-amber-900">Intellectual Vigor</h3>
                <p className="text-[11px] text-amber-800/90 leading-relaxed">
                  Curiosity over perfection; viewing academic challenges as stepping stones to mastery.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-sky-200 text-sky-800 flex items-center justify-center font-bold text-xs">
                  04
                </div>
                <h3 className="text-xs font-bold text-sky-900">Restorative Sleep</h3>
                <p className="text-[11px] text-sky-800/90 leading-relaxed">
                  Quality sleep is biology, not laziness; turning off screens before dorm lights-out.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-purple-200 text-purple-800 flex items-center justify-center font-bold text-xs">
                  05
                </div>
                <h3 className="text-xs font-bold text-purple-900">Youth Leadership</h3>
                <p className="text-[11px] text-purple-800/90 leading-relaxed">
                  Becoming self-aware leaders who uplift their community and nation with empathy.
                </p>
              </div>
            </div>
          </div>

          {/* ASYV Village Support Desk */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#d95f18]">
                  Direct Village Reach
                </div>
                <h2 className="text-xl font-bold text-slate-900 font-display">
                  Confidential Counseling & Emergency Support
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {contactInfo.officeHours}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-[11px] text-slate-400 font-bold uppercase">Emergency 24/7 Hotline</div>
                <div className="text-base font-bold text-slate-900 font-mono mt-1">
                  {contactInfo.hotlinePhone}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">On-campus emergency assistance</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-[11px] text-slate-400 font-bold uppercase">WhatsApp Crisis Desk</div>
                <div className="text-base font-bold text-slate-900 font-mono mt-1">
                  {contactInfo.whatsappPhone}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Confidential text listening line</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-[11px] text-slate-400 font-bold uppercase">Health Center Clinic</div>
                <div className="text-base font-bold text-slate-900 font-mono mt-1">
                  {contactInfo.clinicExtension}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Medical & mental health liaison</div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-900">
              <div>
                <strong>Location:</strong> {contactInfo.officeLocation} · <strong>Counselor Lead:</strong> {contactInfo.counselorLead}
              </div>
              <button
                onClick={() => setActivePage('chat')}
                className="px-4 py-2 bg-[#245934] hover:bg-[#1b4327] text-white rounded-xl font-bold transition-colors cursor-pointer shrink-0"
              >
                Message Counselor Directly
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
