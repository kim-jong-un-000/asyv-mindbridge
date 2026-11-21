import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Heart,
  Users,
  Smile,
  PhoneCall,
  BookOpen,
  Calendar,
  Globe,
  Sun,
  Moon,
  CheckCircle2,
  Lock,
  Award,
  ChevronRight,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { AnimatedAsyvBackground } from './AnimatedAsyvBackground';
import { PWAInstallButton } from './PWAInstallButton';
import { VillageContactView } from './VillageContactView';

interface WelcomeLandingPageProps {
  onEnterPortal: (tab: 'login' | 'register') => void;
}

export const WelcomeLandingPage: React.FC<WelcomeLandingPageProps> = ({ onEnterPortal }) => {
  const {
    appCustomization,
    language,
    setLanguage,
    theme,
    toggleTheme,
    contactInfo
  } = useApp();

  const [showContactsModal, setShowContactsModal] = useState(false);

  // Community Translations
  const t = {
    en: {
      badge: 'Official Psychosocial Care & Wellbeing Network',
      villageName: 'The Agahozo-Shalom Youth Village',
      mottoKinyarwanda: '“Urebeye kure ugera kure”',
      mottoEnglish: '“If you see far, you will go far”',
      welcomeTitle: 'Welcome to Mind Bridge',
      welcomeSubtitle: 'Where Every ASYV Youth Heals, Grows, and Becomes a Leader',
      heroDescription:
        'A dedicated psychosocial space connecting students, Grade Social Workers, and Peer Mental Champions across Senior 4 Ingabe, Senior 5 Ingabo, and Senior 6 Ijabo. Confidential care, daily mood tracking, peer support circles, and 24/7 village protection.',
      signInBtn: 'Sign In to Portal',
      registerBtn: 'Register / Get Started',
      contactsBtn: '24/7 Village Hotline',
      strategicPlanTag: 'ASYV Strategic Vision',
      strategicPlanTitle: 'Fostering Healing, Self-Sufficiency, and Sustainability',
      pillarsTitle: 'Four Pillars of Village Care',
      pillarsSubtitle: 'Built exclusively for our ASYV student community, staff, and family houses.',
      pillar1Title: 'Confidential Social Workers',
      pillar1Desc: 'Direct, safe communication with your dedicated Grade Social Worker for academic, emotional, and personal guidance.',
      pillar2Title: 'Daily Mood & Wellbeing Reflection',
      pillar2Desc: 'Express daily reflections, log emotional intensity, and receive uplifting wellness recommendations.',
      pillar3Title: 'Peer Mental Champions',
      pillar3Desc: 'Student-led mutual care circles and peer mentorship active in every village family house.',
      pillar4Title: '24/7 Campus Health Watch',
      pillar4Desc: 'Instant emergency SOS response and direct linkage to the Village Clinic and Security Watch desk.',
      creedTitle: 'The ASYV Student Creed',
      creedMotto: 'LEARN, ADAPT AND LEAD',
      gradesCovered: 'Supporting All Village Grades',
      footerQuote: '“If you see far, you will go far. Every child deserves a place to heal, grow, and become a leader.” — Anne Heyman, ASYV Founder'
    },
    rw: {
      badge: 'Urubuga rw\'Ubufasha n\'Ubuzima bwo mu Mutwe',
      villageName: 'Umudugudu w\'Urubyiruko wa Agahozo-Shalom',
      mottoKinyarwanda: '“Urebeye kure ugera kure”',
      mottoEnglish: '“If you see far, you will go far”',
      welcomeTitle: 'Murakaza Neza kuri Mind Bridge',
      welcomeSubtitle: 'Aho Buri Munyeshuri Akirira, Agakura, Akaba Umuyobozi',
      heroDescription:
        'Urubuga rwahariwe guhuza abanyeshuri, abajyanama b\'ibyiciro, n\'intangarugero z\'ubuzima bwo mu mutwe mu Ngabe, Ingabo, n\'Ijabo. Ubufasha bw\'ibanga, kugenzura imimerere yawe buri munsi, n\'umutekano w\'umudugudu wa 24/7.',
      signInBtn: 'Kwinjira muri Porotari',
      registerBtn: 'Kwiyandikisha / Gutangira',
      contactsBtn: 'Numero z\'Ubutabazi 24/7',
      strategicPlanTag: 'Icyerekezo cya ASYV',
      strategicPlanTitle: 'Gukira Ibikomere, Kwigira, no Guhoraho',
      pillarsTitle: 'Inkingi Enye z\'Ubufasha mu Mudugudu',
      pillarsSubtitle: 'Byakorewe umuryango w\'abanyeshuri bacu, abakozi, n\'amazu y\'imiryango ya ASYV.',
      pillar1Title: 'Abajyanama b\'Ibanga b\'Ibyiciro',
      pillar1Desc: 'Ubufatanye bwizewe n\'umujyanama wawe ku bijyanye n\'amasomo, amarangamutima, n\'imibereho.',
      pillar2Title: 'Kugenzura Imyumvire n\'Imimerere',
      pillar2Desc: 'Sangiza ibitekerezo byawe bya buri munsi kandi ubashe gukurikirana iterambere ry\'ubuzima bwawe bwo mu mutwe.',
      pillar3Title: 'Intangarugero z\'Ubuzima bwo mu Mutwe',
      pillar3Desc: 'Itsinda ry\'abanyeshuri bafashanya mu mazu y\'imiryango mu kuzamura ubumuntu n\'ubuvandimwe.',
      pillar4Title: 'Ubutabazi bw\'Ivuriro n\'Umutekano 24/7',
      pillar4Desc: 'Ubutabazi bwihuse bwa SOS bufite aho buhurira n\'Ivuriro ry\'Umudugudu n\'Abarinda umudugudu.',
      creedTitle: 'Indangagaciro y\'Umunyeshuri wa ASYV',
      creedMotto: 'KWIGA, KUBIMENYERA NO KUYOBORA',
      gradesCovered: 'Ibyiciro Byose bya ASYV',
      footerQuote: '“Urebeye kure ugera kure. Buri mwana akwiye ahantu ho gukirira, gukurira, no kuba umuyobozi.” — Anne Heyman'
    },
    fr: {
      badge: 'Réseau Officiel de Soutien Psychosocial et Bien-être',
      villageName: 'Village de la Jeunesse Agahozo-Shalom',
      mottoKinyarwanda: '“Urebeye kure ugera kure”',
      mottoEnglish: '“Si vous voyez loin, vous irez loin”',
      welcomeTitle: 'Bienvenue sur Mind Bridge',
      welcomeSubtitle: 'Où Chaque Jeune d\'ASYV Guérit, Grandit et Devient un Leader',
      heroDescription:
        'Un espace psychosocial dédié reliant les élèves, les travailleurs sociaux et les champions de la santé mentale à travers Ingabe, Ingabo et Ijabo. Accompagnement confidentiel, suivi quotidien de l\'humeur et permanence 24h/24.',
      signInBtn: 'Se Connecter au Portail',
      registerBtn: 'S\'inscrire / Commencer',
      contactsBtn: 'Ligne d\'Urgence 24h/24',
      strategicPlanTag: 'Vision Stratégique ASYV',
      strategicPlanTitle: 'Favoriser la Guérison, l\'Autonomie et la Durabilité',
      pillarsTitle: 'Les Quatre Piliers d\'Accompagnement',
      pillarsSubtitle: 'Créé pour notre communauté d\'élèves, de personnel et de maisons familiales d\'ASYV.',
      pillar1Title: 'Travailleurs Sociaux Dédiés',
      pillar1Desc: 'Échange confidentiel avec votre travailleur social pour votre orientation scolaire, émotionnelle et personnelle.',
      pillar2Title: 'Suivi Quotidien du Bien-être',
      pillar2Desc: 'Exprimez vos réflexions quotidiennes, suivez votre humeur et recevez des conseils bienveillants.',
      pillar3Title: 'Champions Pairs de Santé Mentale',
      pillar3Desc: 'Cercles d\'écoute mutuelle menés par les élèves dans chaque maison familiale du village.',
      pillar4Title: 'Sécurité et Santé du Campus 24h/24',
      pillar4Desc: 'Alerte d\'urgence SOS instantanée et coordination directe avec la Clinique de Santé du Village.',
      creedTitle: 'Le Credo de l\'Élève d\'ASYV',
      creedMotto: 'APPRENDRE, S\'ADAPTER ET DIRIGER',
      gradesCovered: 'Toutes les Promotions d\'ASYV',
      footerQuote: '“Si vous voyez loin, vous irez loin. Chaque enfant mérite un lieu pour guérir, grandir et devenir un leader.” — Anne Heyman'
    }
  }[language] || {
    badge: 'Official Psychosocial Care & Wellbeing Network',
    villageName: 'The Agahozo-Shalom Youth Village',
    mottoKinyarwanda: '“Urebeye kure ugera kure”',
    mottoEnglish: '“If you see far, you will go far”',
    welcomeTitle: 'Welcome to Mind Bridge',
    welcomeSubtitle: 'Where Every ASYV Youth Heals, Grows, and Becomes a Leader',
    heroDescription:
      'A dedicated psychosocial space connecting students, Grade Social Workers, and Peer Mental Champions across Senior 4 Ingabe, Senior 5 Ingabo, and Senior 6 Ijabo. Confidential care, daily mood tracking, peer support circles, and 24/7 village protection.',
    signInBtn: 'Sign In to Portal',
    registerBtn: 'Register / Get Started',
    contactsBtn: '24/7 Village Hotline',
    strategicPlanTag: 'ASYV Strategic Vision',
    strategicPlanTitle: 'Fostering Healing, Self-Sufficiency, and Sustainability',
    pillarsTitle: 'Four Pillars of Village Care',
    pillarsSubtitle: 'Built exclusively for our ASYV student community, staff, and family houses.',
    pillar1Title: 'Confidential Social Workers',
    pillar1Desc: 'Direct, safe communication with your dedicated Grade Social Worker for academic, emotional, and personal guidance.',
    pillar2Title: 'Daily Mood & Wellbeing Reflection',
    pillar2Desc: 'Express daily reflections, log emotional intensity, and receive uplifting wellness recommendations.',
    pillar3Title: 'Peer Mental Champions',
    pillar3Desc: 'Student-led mutual care circles and peer mentorship active in every village family house.',
    pillar4Title: '24/7 Campus Health Watch',
    pillar4Desc: 'Instant emergency SOS response and direct linkage to the Village Clinic and Security Watch desk.',
    creedTitle: 'The ASYV Student Creed',
    creedMotto: 'LEARN, ADAPT AND LEAD',
    gradesCovered: 'Supporting All Village Grades',
    footerQuote: '“If you see far, you will go far. Every child deserves a place to heal, grow, and become a leader.” — Anne Heyman, ASYV Founder'
  };

  // Derived Admin Customizations with Multilingual fallbacks
  const displayPortalTitle = appCustomization?.portalTitle || 'Mind Bridge';
  const displayPortalSubtitle = appCustomization?.portalSubtitle || 'The Agahozo Shalom Youth Village Psychosocial Platform';
  const displaySchoolMotto = appCustomization?.schoolMotto || 'LEARN, ADAPT AND LEAD';
  const displaySchoolSubMotto = appCustomization?.schoolSubMotto || 'Ingabe · Ingabo · Ijabo';
  const displayHeroTitle = appCustomization?.welcomeHeroTitle || t.welcomeTitle;
  const displayHeroSubtitle = appCustomization?.welcomeHeroSubtitle || t.welcomeSubtitle;
  const displayHeroDesc = appCustomization?.welcomeHeroDescription || t.heroDescription;
  const displayStratTag = appCustomization?.strategicPlanTag || t.strategicPlanTag;
  const displayStratTitle = appCustomization?.strategicPlanTitle || t.strategicPlanTitle;
  const displayStratDesc = appCustomization?.strategicPlanDescription || 'Celebrating youth empowerment, healing hearts, and building bright futures across Rwanda.';
  const isStudentRegAllowed = appCustomization?.allowPublicStudentRegistration ?? false;
  const displayFooterQuote = appCustomization?.customInspirationalQuote
    ? `“${appCustomization.customInspirationalQuote}” — ${appCustomization.customQuoteAuthor || 'Anne Heyman, ASYV Founder'}`
    : t.footerQuote;

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 relative overflow-x-hidden selection:bg-[#245934] selection:text-white">
      {/* Crisp Atmospheric ASYV Background (Zero Blur) */}
      <AnimatedAsyvBackground variant="auth" />

      {/* TOP INSTITUTIONAL NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#081810]/95 backdrop-blur-md border-b border-[#245934]/60 text-white shadow-lg transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand with authentic ASYV Circular Emblem */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white p-1 border-2 border-[#eec149] shadow-md shrink-0 flex items-center justify-center">
              <img
                src={appCustomization?.portalLogoImageUrl || '/assets/aistudio/download_9de94bb3.png'}
                alt="Agahozo-Shalom Youth Village Official Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-display font-extrabold text-lg sm:text-xl text-[#eec149] leading-tight flex items-center gap-2">
                <span>{displayPortalTitle}</span>
                <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-[#245934] text-white text-[10px] font-black tracking-wider uppercase border border-emerald-400/30">
                  Official ASYV
                </span>
              </div>
              <div className="text-[11px] font-bold text-emerald-200/90 leading-tight">
                {displayPortalSubtitle}
              </div>
            </div>
          </div>

          {/* Action Utilities & Auth Trigger Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="relative flex items-center gap-1.5 bg-[#0e2718] border border-[#245934] rounded-xl px-2.5 py-1.5 text-xs font-bold text-white shadow-xs">
              <Globe className="w-3.5 h-3.5 text-[#eec149] shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent text-white cursor-pointer outline-hidden pr-1 font-bold text-xs"
                title="Select Interface Language"
              >
                <option value="en" className="bg-[#081810] text-white">🇬🇧 English</option>
                <option value="rw" className="bg-[#081810] text-white">🇷🇼 Ikinyarwanda</option>
                <option value="fr" className="bg-[#081810] text-white">🇫🇷 Français</option>
              </select>
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-[#0e2718] hover:bg-[#153822] border border-[#245934] text-[#eec149] cursor-pointer transition-all shadow-xs"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle theme mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-emerald-300" />}
            </button>

            {/* Install PWA App Button */}
            <PWAInstallButton variant="nav" />

            {/* If Student Registration is enabled by Admin, show quick Register link in header */}
            {isStudentRegAllowed && (
              <button
                type="button"
                onClick={() => onEnterPortal('register')}
                className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-[#143d22] hover:bg-[#1a4e2c] border border-emerald-400/40 text-emerald-200 cursor-pointer transition-all"
              >
                <Users className="w-3.5 h-3.5 text-[#eec149]" />
                <span>{t.registerBtn}</span>
              </button>
            )}

            {/* Primary Sign In Button */}
            <button
              type="button"
              onClick={() => onEnterPortal('login')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-[#eec149] hover:bg-[#dfb136] text-slate-950 shadow-md cursor-pointer transition-all transform hover:scale-105"
            >
              <Lock className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]" />
              <span>{t.signInBtn}</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION: Authentic Village Spirit, Graduation Celebration Photo & Welcoming Card */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#081810] via-[#13331d] to-[#081810] border-2 border-[#245934] shadow-2xl p-6 sm:p-10 text-white">
          {/* Subtle architectural background pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="welcome-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#eec149" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#welcome-grid)" />
            </svg>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Official Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b4327] border border-[#eec149]/50 text-[#eec149] text-xs font-black uppercase tracking-wider shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-[#eec149]" />
                <span>{t.badge}</span>
              </div>

              {/* Main Headline - Set by Admin or Default */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white leading-tight">
                  {displayHeroTitle}
                </h1>
                <p className="text-base sm:text-lg text-[#eec149] font-bold mt-2 font-display">
                  {displayHeroSubtitle}
                </p>
              </div>

              {/* Village Motto Callout - Set by Admin or Default */}
              <div className="p-4 bg-black/40 rounded-2xl border border-[#245934] shadow-inner space-y-1">
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-emerald-300">
                  <span>Village Motto & Creed</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#eec149] font-display">
                  “{displaySchoolMotto}”
                </div>
                <div className="text-xs sm:text-sm text-emerald-100/90 italic font-medium">
                  {displaySchoolSubMotto}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
                {displayHeroDesc}
              </p>

              {/* Action Buttons: Sign In / Register / Hotline */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onEnterPortal('login')}
                  className="px-6 py-3.5 rounded-2xl bg-[#eec149] hover:bg-[#dfb136] text-slate-950 font-black text-sm flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Lock className="w-4 h-4 text-slate-950 stroke-[3]" />
                  <span>{t.signInBtn}</span>
                  <ArrowRight className="w-4 h-4 text-slate-950 stroke-[3]" />
                </button>

                {/* If Admin allowed registration: Show Register button. If stopped: Show status and hide link */}
                {isStudentRegAllowed ? (
                  <button
                    type="button"
                    onClick={() => onEnterPortal('register')}
                    className="px-5 py-3.5 rounded-2xl bg-[#245934] hover:bg-emerald-700 text-white font-bold text-sm flex items-center gap-2 border border-emerald-400/40 shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
                  >
                    <Users className="w-4 h-4 text-[#eec149]" />
                    <span>{t.registerBtn}</span>
                  </button>
                ) : (
                  <div className="px-4 py-3 rounded-2xl bg-black/50 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2 shadow-inner">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Registration Closed by Administrator</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowContactsModal(true)}
                  className="px-4 py-3.5 rounded-2xl bg-black/40 hover:bg-black/60 text-emerald-200 font-bold text-xs flex items-center gap-2 border border-[#245934] shadow-xs transition-all cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-[#eec149]" />
                  <span>{t.contactsBtn}</span>
                </button>
              </div>

              {/* Grades Supported Chips */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-semibold">{t.gradesCovered}:</span>
                <span className="px-3 py-1 rounded-xl bg-[#0e2718] border border-emerald-500/40 text-emerald-200 font-bold">
                  Senior 4 Ingabe
                </span>
                <span className="px-3 py-1 rounded-xl bg-[#0e2718] border border-amber-500/40 text-amber-200 font-bold">
                  Senior 5 Ingabo
                </span>
                <span className="px-3 py-1 rounded-xl bg-[#0e2718] border border-orange-500/40 text-orange-200 font-bold">
                  Senior 6 Ijabo
                </span>
              </div>
            </div>

            {/* Right Column: Featured Inspiring ASYV Graduation Photo */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-md group">
                {/* Glowing aesthetic border frame */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-[#eec149] via-[#245934] to-[#d95f18] rounded-3xl blur-xs opacity-60 group-hover:opacity-100 transition-opacity" />

                <div className="relative rounded-3xl overflow-hidden bg-black border-2 border-[#eec149]/80 shadow-2xl">
                  {/* The featured graduation celebration photo - uploaded and customized by Admin */}
                  <img
                    src={appCustomization?.strategicPlanImageUrl || '/assets/aistudio/download_954a9c9b.jpg'}
                    alt={displayStratTitle}
                    className="w-full h-auto object-cover max-h-[480px] transform group-hover:scale-102 transition-transform duration-500"
                  />

                  {/* Photo Overlay Caption */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/85 to-transparent p-5 text-white space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-[#d95f18] text-white text-[10px] font-black uppercase tracking-wider">
                        {displayStratTag}
                      </span>
                      <span className="text-[11px] text-[#eec149] font-bold">
                        ASYV Strategic Vision
                      </span>
                    </div>
                    <div className="font-display font-extrabold text-sm sm:text-base text-white leading-snug">
                      {displayStratTitle}
                    </div>
                    <p className="text-[11px] text-emerald-200/90 font-medium">
                      {displayStratDesc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Village Emblem Watermark Seal */}
              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-200/80 font-semibold">
                <img
                  src={appCustomization?.portalLogoImageUrl || '/assets/aistudio/download_9de94bb3.png'}
                  alt="Official ASYV Emblem"
                  className="w-5 h-5 object-contain"
                />
                <span>Agahozo-Shalom Youth Village · Official Care Network</span>
              </div>
            </div>
          </div>
        </section>

        {/* FOUR CORE PILLARS OF VILLAGE CARE */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#245934]/15 dark:bg-emerald-950/60 text-[#1b4327] dark:text-[#eec149] text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#245934] dark:text-[#eec149]" />
              <span>Dedicated Psychosocial Support</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
              {t.pillarsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {t.pillarsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 shadow-md hover:border-[#245934] dark:hover:border-emerald-600 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-[#245934] dark:text-emerald-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                {t.pillar1Title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.pillar1Desc}
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 shadow-md hover:border-[#245934] dark:hover:border-emerald-600 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Smile className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                {t.pillar2Title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.pillar2Desc}
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 shadow-md hover:border-[#245934] dark:hover:border-emerald-600 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/80 text-[#d95f18] dark:text-orange-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                {t.pillar3Title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.pillar3Desc}
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 shadow-md hover:border-[#245934] dark:hover:border-emerald-600 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                {t.pillar4Title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.pillar4Desc}
              </p>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION BANNER: Ready to Start / Sign In */}
        <section className="rounded-3xl bg-[#091b11] text-white p-6 sm:p-8 border-2 border-[#245934] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="text-xs font-bold text-[#eec149] uppercase tracking-wider">
              {t.creedTitle} · {displaySchoolSubMotto}
            </div>
            <div className="text-xl sm:text-2xl font-black font-display text-white">
              “{displaySchoolMotto}”
            </div>
            <p className="text-xs text-emerald-100/90 max-w-xl">
              Log in to your account with your assigned student or counselor credentials to access confidential messaging, questionnaire assessments, wellness schedules, and village announcements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onEnterPortal('login')}
              className="px-6 py-3 rounded-2xl bg-[#eec149] hover:bg-[#dfb136] text-slate-950 font-black text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer transform hover:scale-105"
            >
              <Lock className="w-4 h-4 stroke-[3]" />
              <span>{t.signInBtn}</span>
            </button>

            {isStudentRegAllowed ? (
              <button
                type="button"
                onClick={() => onEnterPortal('register')}
                className="px-5 py-3 rounded-2xl bg-transparent hover:bg-white/10 text-white font-bold text-sm flex items-center gap-2 border border-white/30 transition-all cursor-pointer"
              >
                <Users className="w-4 h-4 text-[#eec149]" />
                <span>{t.registerBtn}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowContactsModal(true)}
                className="px-4 py-3 rounded-2xl bg-[#143d22] hover:bg-[#1a4e2c] text-emerald-200 font-bold text-xs flex items-center gap-2 border border-emerald-500/40 transition-all cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#eec149]" />
                <span>{t.contactsBtn}</span>
              </button>
            )}
          </div>
        </section>

        {/* FOUNDER'S TRIBUTE FOOTER CARD */}
        <footer className="text-center py-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic max-w-2xl mx-auto leading-relaxed">
            {displayFooterQuote}
          </p>
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#245934] dark:text-[#eec149]">
            <img
              src={appCustomization?.portalLogoImageUrl || '/assets/aistudio/download_9de94bb3.png'}
              alt="ASYV"
              className="w-4 h-4 object-contain inline"
            />
            <span>{displayPortalTitle} · {displayPortalSubtitle}</span>
          </div>
        </footer>
      </main>

      {/* VILLAGE EMERGENCY CONTACTS MODAL */}
      {showContactsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border-2 border-[#245934] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-display font-bold text-lg">
                <PhoneCall className="w-5 h-5" />
                <span>24/7 Village Crisis & Psychosocial Contacts</span>
              </div>
              <button
                type="button"
                onClick={() => setShowContactsModal(false)}
                className="p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <VillageContactView />

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowContactsModal(false)}
                className="px-5 py-2 rounded-xl bg-[#245934] hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
