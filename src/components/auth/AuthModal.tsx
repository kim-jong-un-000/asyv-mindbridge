import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Grade, UserRole, AppLanguage } from '../../types';
import {
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  Globe,
  Heart,
  Sparkles,
  Quote,
  RefreshCw,
  AlertOctagon,
  X,
  Phone,
  Info,
  Upload,
  Camera,
  Sun,
  Moon
} from 'lucide-react';
import { INSPIRING_EMOTIONAL_QUOTES } from '../../data/initialData';
import { ASSETS } from '../../utils/assets';
import { AnimatedAsyvBackground } from '../common/AnimatedAsyvBackground';

const GRADES: Grade[] = ['Ingabe', 'Ingabo', 'Ijabo'];

const AVATAR_PRESETS = [
  '/assets/aistudio/ASYV_Logo_-_Clear_Background_copy_22df10b9.webp',
  '/asyv_emblem.svg',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23245934" stroke="%23ffffff" stroke-width="4"/><text x="50" y="58" font-family="sans-serif" font-size="20" font-weight="900" fill="%23eec149" text-anchor="middle">INGABE</text></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23d95f18" stroke="%23ffffff" stroke-width="4"/><text x="50" y="58" font-family="sans-serif" font-size="20" font-weight="900" fill="%23ffffff" text-anchor="middle">INGABO</text></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23eec149" stroke="%23ffffff" stroke-width="4"/><text x="50" y="58" font-family="sans-serif" font-size="22" font-weight="900" fill="%23245934" text-anchor="middle">IJABO</text></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%231b4327" stroke="%23eec149" stroke-width="4"/><circle cx="50" cy="50" r="34" fill="%23245934"/><path d="M50 25 L56 40 L72 40 L59 50 L64 65 L50 55 L36 65 L41 50 L28 40 L44 40 Z" fill="%23eec149"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%23694e3b" stroke="%23ffffff" stroke-width="4"/><circle cx="50" cy="50" r="34" fill="%238c6b51"/><path d="M50 32 C40 20, 20 28, 20 46 C20 62, 45 76, 50 80 C55 76, 80 62, 80 46 C80 28, 60 20, 50 32 Z" fill="%23d95f18" stroke="%23ffffff" stroke-width="2"/></svg>'
];

const AUTH_I18N = {
  en: {
    selectRole: 'Select Your Role',
    student: 'Student',
    socialWorker: 'Social Worker',
    systemAdmin: 'System Admin',
    signInExisting: 'Sign In to Existing Account',
    registerNewStudent: 'Register New Student',
    registerNewWorker: 'Register New Social Worker',
    adminBanner: 'Restricted Administrative Portal · Confidential authentication required',
    adminUsername: 'Administrator Username',
    adminUsernamePlaceholder: 'Enter your username',
    adminPassword: 'Administrator Password',
    adminPasswordPlaceholder: 'Enter master password',
    launchAdmin: 'Launch Master Administrator Console',
    emailLabel: 'Email Address',
    studentEmailPlaceholder: 'name.family@asyv.edu.rw',
    workerEmailPlaceholder: 'worker.name@asyv.org',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter account password',
    rememberMe: 'Remember my login email',
    signInAs: (r: string) => `Sign In as ${r}`,
    firstName: 'First Name',
    firstNamePlaceholder: 'Enter first name',
    familyName: 'Family Name',
    familyNamePlaceholder: 'Enter family name',
    gradeLed: 'Grade Assigned (Select Grade)',
    studentGrade: 'Village Grade',
    classCombo: 'Combination / Class',
    chooseAvatar: 'Select Profile Avatar or Upload Picture',
    uploadCustomAvatar: 'Upload from folder',
    completeStudentReg: 'Create Registered Student Account',
    completeWorkerReg: 'Create Registered Social Worker Account',
    languageSelect: 'Language',
    lightMode: 'Light Mode',
    darkMode: 'Night Mode',
    forgotPassword: 'Forgot password? (Recovered by System Admin)',
    emailUsedOnce: 'Each email can only be registered once (single-use only)',
    emailTakenWarning: 'This email is already in use and cannot be used more than once.',
    passwordRecoveryTitle: 'Official ASYV Password Recovery',
    passwordRecoveryNotice: 'User passwords in ASYV Mind Bridge are recovered directly by your Master System Administrator.'
  },
  rw: {
    selectRole: 'Hitamo Uruhare Rwawe',
    student: 'Umunyeshuri',
    socialWorker: 'Umujyanama',
    systemAdmin: 'Umuyobozi wa Sisitemu',
    signInExisting: 'Injira muri Konte Isanzwe',
    registerNewStudent: 'Iyandikishe nk\'Umunyeshuri Mushya',
    registerNewWorker: 'Iyandikishe nk\'Umujyanama Mushya',
    adminBanner: 'Ibiro Byihariye by\'Ubuyobozi Bukuru · Bisaba kwinjira mu ibanga',
    adminUsername: 'Izina ry\'Umuyobozi',
    adminUsernamePlaceholder: 'Andika izina ryawe',
    adminPassword: 'Ijambobanga ry\'Umuyobozi',
    adminPasswordPlaceholder: 'Andika ijambobanga ry\'ubuyobozi',
    launchAdmin: 'Fungura Ibiro Bikuru bya Sisitemu',
    emailLabel: 'Aderesi ya Email',
    studentEmailPlaceholder: 'izina.umuryango@asyv.edu.rw',
    workerEmailPlaceholder: 'umujyanama@asyv.org',
    passwordLabel: 'Ijambobanga',
    passwordPlaceholder: 'Andika ijambobanga ryawe',
    rememberMe: 'Ibuka email yanjye',
    signInAs: (r: string) => `Injira nka ${r}`,
    firstName: 'Izina',
    firstNamePlaceholder: 'Andika izina',
    familyName: 'Izina ry\'Umuryango',
    familyNamePlaceholder: 'Andika iry\'umuryango',
    gradeLed: 'Icyiciro Uyobora (Hitamo Icyiciro)',
    studentGrade: 'Icyiciro cy\'Umudugudu',
    classCombo: 'Ishami / Icyiciro',
    chooseAvatar: 'Hitamo Ifoto y\'Umwirondoro cyangwa shyiraho ifoto yawe',
    uploadCustomAvatar: 'Shyiraho ifoto yawe',
    completeStudentReg: 'Uzuza Kwiyandikisha nk\'Umunyeshuri',
    completeWorkerReg: 'Uzuza Kwiyandikisha nk\'Umujyanama',
    languageSelect: 'Ururimi',
    lightMode: 'Ibara Ryera',
    darkMode: 'Ibara Ryijimye',
    forgotPassword: 'Wibagiwe ijambobanga? (Rigaruzwa n\'Umuyobozi wa Sisitemu)',
    emailUsedOnce: 'Buri email yemerewe gukoreshwa rimwe gusa',
    emailTakenWarning: 'Iyi email yamaze gukoreshwa. Ntiyemerewe kongera gukoreshwa indi nshuro.',
    passwordRecoveryTitle: 'Kugarura Ijambobanga muri ASYV',
    passwordRecoveryNotice: 'Amajambobanga muri ASYV Mind Bridge agaruzwa mu buryo butaziguye n\'Umuyobozi Mukuru wa Sisitemu.'
  },
  fr: {
    selectRole: 'Sélectionnez Votre Rôle',
    student: 'Élève',
    socialWorker: 'Travailleur Social',
    systemAdmin: 'Administrateur',
    signInExisting: 'Se Connecter au Compte',
    registerNewStudent: 'Inscrire un Nouvel Élève',
    registerNewWorker: 'Inscrire un Nouveau Travailleur',
    adminBanner: 'Portail d\'Administration Restreint · Authentification requise',
    adminUsername: 'Nom d\'utilisateur Administrateur',
    adminUsernamePlaceholder: 'Entrez votre nom d\'utilisateur',
    adminPassword: 'Mot de Passe Administrateur',
    adminPasswordPlaceholder: 'Entrez le mot de passe maître',
    launchAdmin: 'Lancer la Console Administrateur',
    emailLabel: 'Adresse E-mail',
    studentEmailPlaceholder: 'prenom.nom@asyv.edu.rw',
    workerEmailPlaceholder: 'prenom.nom@asyv.org',
    passwordLabel: 'Mot de Passe',
    passwordPlaceholder: 'Entrez votre mot de passe',
    rememberMe: 'Se souvenir de mon e-mail',
    signInAs: (r: string) => `Se Connecter comme ${r}`,
    firstName: 'Prénom',
    firstNamePlaceholder: 'Entrez le prénom',
    familyName: 'Nom de Famille',
    familyNamePlaceholder: 'Entrez le nom de famille',
    gradeLed: 'Promotion Assignée (Sélectionnez)',
    studentGrade: 'Promotion du Village',
    classCombo: 'Section / Classe',
    chooseAvatar: 'Choisir un Avatar',
    completeStudentReg: 'Créer le Compte Élève',
    completeWorkerReg: 'Créer le Compte Travailleur Social',
    languageSelect: 'Langue',
    lightMode: 'Mode Clair',
    darkMode: 'Mode Sombre',
    forgotPassword: 'Mot de passe oublié ? (Récupéré par l\'Administrateur)',
    emailUsedOnce: 'Chaque e-mail ne peut être utilisé qu\'une seule fois',
    emailTakenWarning: 'Cette adresse e-mail est déjà utilisée et ne peut pas être enregistrée à nouveau.',
    passwordRecoveryTitle: 'Récupération Officielle du Mot de Passe ASYV',
    passwordRecoveryNotice: 'Les mots de passe dans ASYV Mind Bridge sont récupérés directement par votre Administrateur Système.'
  }
};

export interface AuthModalProps {
  initialTab?: 'login' | 'register';
  onBackToWelcome?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ initialTab = 'login', onBackToWelcome }) => {
  const {
    login,
    registerStudent,
    registerSocialWorker,
    users,
    currentUser,
    appCustomization,
    language,
    setLanguage,
    theme,
    toggleTheme
  } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setAuthMode(initialTab);
    }
  }, [initialTab]);
  const [role, setRole] = useState<UserRole>('student');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [showRecoveryModal, setShowRecoveryModal] = useState<boolean>(false);

  // Form states - ALWAYS start empty so email space is completely clean and empty after sign out or login
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [familyName, setFamilyName] = useState<string>('');
  const [grade, setGrade] = useState<Grade>('Ingabe');
  const [schoolClass, setSchoolClass] = useState<string>('Senior 4 MEG');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(AVATAR_PRESETS[0]);
  const [devCode, setDevCode] = useState<string>('');

  const handleCustomAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setSelectedAvatar(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const t = AUTH_I18N[language] || AUTH_I18N.en;

  // Check if public self-registration is allowed for the active role
  const isRegistrationAllowedForRole =
    (role === 'student' && appCustomization?.allowPublicStudentRegistration === true) ||
    (role === 'social_worker' && appCustomization?.allowPublicWorkerRegistration === true);

  // Single-use email constraint check
  const isEmailTaken =
    authMode === 'register' &&
    email.trim() !== '' &&
    users.some(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());

  // Strictly clear inputs upon logout, role switch, or mode change to keep email space completely empty
  useEffect(() => {
    setEmail('');
    setPassword('');
    setErrorMessage('');
  }, [authMode, role, currentUser]);

  // When public self-registration is closed, forcefully revert to login mode
  useEffect(() => {
    if (!isRegistrationAllowedForRole && authMode === 'register') {
      setAuthMode('login');
    }
  }, [isRegistrationAllowedForRole, authMode]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (role === 'developer') {
      if (!email.trim() || !password) {
        setErrorMessage(
          language === 'rw'
            ? 'Nyamuneka andika izina ry\'umuyobozi n\'ijambobanga'
            : language === 'fr'
            ? 'Veuillez saisir votre nom d\'utilisateur et mot de passe'
            : 'Please enter your administrator username and password'
        );
        return;
      }
      const res = login(email.trim(), password, devCode, 'developer');
      if (!res.success) {
        setErrorMessage(res.error || 'Failed to authenticate administrator');
      }
      return;
    }

    if (!email.trim()) {
      setErrorMessage(
        language === 'rw'
          ? 'Nyamuneka andika email yawe'
          : language === 'fr'
          ? 'Veuillez entrer votre adresse e-mail'
          : 'Please enter your email or username'
      );
      return;
    }

    const res = login(email.trim(), password, undefined, role);
    if (!res.success) {
      setErrorMessage(res.error || 'Login failed');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isRegistrationAllowedForRole) {
      setErrorMessage(
        role === 'student'
          ? (language === 'rw'
              ? 'Kwiyandikisha ubwawe gufunzwe. Konti z\'abanyeshuri zifungurwa gusa n\'Umuyobozi Mukuru cyangwa Umujyanama w\'icyiciro cyawe.'
              : language === 'fr'
              ? 'L\'auto-inscription publique des élèves est désactivée. Les comptes sont délivrés exclusivement par l\'Administrateur Général ou votre travailleur social.'
              : 'Public student self-registration is closed. Accounts are provisioned exclusively by the Master Administrator or your assigned Grade Social Worker.')
          : (language === 'rw'
              ? 'Kwiyandikisha gufunzwe. Konti z\'abakozi zifungurwa gusa n\'Umuyobozi Mukuru.'
              : language === 'fr'
              ? 'L\'auto-inscription du personnel est désactivée. Les comptes sont délivrés exclusivement par l\'Administrateur Général.'
              : 'Staff self-registration is closed. Staff accounts are provisioned exclusively by the Master Administrator.')
      );
      return;
    }

    if (!name.trim()) {
      setErrorMessage(
        language === 'rw'
          ? 'Nyamuneka andika izina ryawe'
          : language === 'fr'
          ? 'Veuillez indiquer votre prénom'
          : 'Please provide your first name'
      );
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage(
        language === 'rw'
          ? 'Nyamuneka andika email nyayo'
          : language === 'fr'
          ? 'Veuillez fournir une adresse e-mail valide'
          : 'Please provide a valid email address'
      );
      return;
    }

    if (isEmailTaken) {
      setErrorMessage(t.emailTakenWarning);
      return;
    }

    if (role === 'student') {
      if (!familyName.trim()) {
        setErrorMessage(
          language === 'rw'
            ? 'Abanyeshuri bagomba kwandika izina ry\'umuryango'
            : language === 'fr'
            ? 'Les élèves doivent fournir leur nom de famille'
            : 'Students must provide a family name'
        );
        return;
      }

      const res = registerStudent({
        name,
        familyName,
        email,
        grade,
        schoolClass,
        password: password || 'password123',
        avatar: selectedAvatar
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Registration failed');
      }
    } else if (role === 'social_worker') {
      const res = registerSocialWorker({
        name,
        email,
        grade,
        password: password || 'worker@asyv26',
        avatar: selectedAvatar
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Registration failed');
      }
    }
  };

  const getRoleDisplayName = (r: UserRole) => {
    if (r === 'student') return t.student;
    if (r === 'social_worker') return t.socialWorker;
    return t.systemAdmin;
  };

  return (
    <div className="min-h-screen bg-black/10 dark:bg-black/40 flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 relative overflow-y-auto py-8 transition-colors">
      {/* Crisp Well-Seen Background with Official ASYV Colors, Rolling Hills, and Moving Official ASYV Badges (No Blur) */}
      <AnimatedAsyvBackground variant="auth" />

      {/* Main Roomy Auth & Wisdom Showcase Card */}
      <div className="relative z-10 w-full max-w-5xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl shadow-2xl border-2 border-emerald-900/20 dark:border-emerald-500/25 overflow-hidden my-auto grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT / SANCTUARY COLUMN: Village Brand, Timeless Motto, and Featured Daily Inspiration Quote */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#122e1b] via-[#1b4327] to-[#102416] text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-white/15">
          <div className="relative z-10 space-y-6">
            {/* Brand Header */}
            <div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/95 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white/30 p-1.5 shrink-0">
                  <img
                    src="/assets/aistudio/ASYV_Logo_-_Clear_Background_copy_22df10b9.webp"
                    alt="The Agahozo Shalom Youth Village"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
                    {appCustomization?.portalTitle || 'Mind Bridge'}
                  </h1>
                  <p className="text-xs font-bold text-[#eec149] uppercase tracking-wider mt-0.5">
                    Agahozo-Shalom Youth Village
                  </p>
                  <p className="text-[11px] text-emerald-200/90 font-medium">
                    Psychosocial Support Platform
                  </p>
                </div>
              </div>

              {/* Prominent Official Village Motto */}
              <div className="mt-4 p-3.5 bg-black/25 rounded-2xl border border-white/10 shadow-inner">
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#eec149] mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#eec149]" />
                  <span>Village Motto & Creed</span>
                </div>
                <p className="text-sm font-black text-amber-200 tracking-wide font-display">
                  “{appCustomization?.schoolMotto || 'LEARN, ADAPT AND LEAD'}”
                </p>
                <p className="text-xs text-emerald-100 font-medium mt-0.5">
                  {appCustomization?.schoolSubMotto || 'Ingabe · Ingabo · Ijabo'}
                </p>
              </div>
            </div>

            {/* COURT OF DAILY INSPIRATION & EMOTIONAL SUPPORT QUOTE CARD - Always fully visible, never abstracted! */}
            {(() => {
              const currentQuote = INSPIRING_EMOTIONAL_QUOTES[quoteIndex % INSPIRING_EMOTIONAL_QUOTES.length];
              const quoteText = appCustomization?.customInspirationalQuote && quoteIndex === 0
                ? appCustomization.customInspirationalQuote
                : currentQuote?.quote[language] || currentQuote?.quote.en;
              const authorText = appCustomization?.customQuoteAuthor && quoteIndex === 0
                ? appCustomization.customQuoteAuthor
                : `${currentQuote?.author} · ${currentQuote?.sourceOrRole}`;

              return (
                <div className="p-4 sm:p-5 rounded-2xl bg-black/25 border border-white/15 shadow-md relative overflow-hidden group">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#eec149]">
                      <Heart className="w-3.5 h-3.5 text-[#d95f18] fill-[#d95f18] shrink-0" />
                      <span>
                        {language === 'rw'
                          ? "Icyumba cy'Amagambo Yubaka"
                          : language === 'fr'
                          ? "Cour de Soutien Émotionnel"
                          : 'Court of Daily Inspiration'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setQuoteIndex(prev => (prev + 1) % INSPIRING_EMOTIONAL_QUOTES.length)}
                      className="text-[11px] font-bold text-emerald-100 hover:text-white flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg border border-white/15 shadow-xs transition-colors cursor-pointer shrink-0"
                      title="Next inspiring quote"
                    >
                      <RefreshCw className="w-3 h-3 shrink-0" />
                      <span>{language === 'rw' ? 'Ayandi' : language === 'fr' ? 'Suivant' : 'Inspire'}</span>
                    </button>
                  </div>

                  {/* Complete quote words, high contrast, readable sizing */}
                  <p className="text-sm sm:text-base font-medium italic leading-relaxed text-amber-50 break-words my-2">
                    "{quoteText}"
                  </p>

                  <div className="text-xs text-emerald-200/90 font-bold mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
                    <span>— {authorText}</span>
                    <span className="text-[10px] uppercase font-bold text-[#eec149] bg-white/10 px-2 py-0.5 rounded">
                      {currentQuote?.theme || 'Wisdom'}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Village Values Footer */}
          <div className="relative z-10 pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-200/80 font-medium">
            <span>Ingabe · Ingabo · Ijabo</span>
            <span className="text-[#eec149] font-bold uppercase tracking-wider text-[10px]">Living with Purpose</span>
          </div>
        </div>

        {/* RIGHT / FORM COLUMN: Roomy ("Somehow Big") Authentication Area */}
        <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
          <div>
            {/* Back to Welcome Landing Page button if accessed from Welcome page */}
            {onBackToWelcome && (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={onBackToWelcome}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-2xs group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#245934] dark:text-[#eec149] group-hover:-translate-x-0.5 transition-transform" />
                  <span>{language === 'rw' ? 'Subira ku Rupapuro rw\'Ibanze' : language === 'fr' ? 'Retour à la Page d\'Accueil' : 'Back to Welcome Page'}</span>
                </button>
              </div>
            )}

            {/* Top Control Bar: Language & Dark/Light Mode */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-700 dark:text-slate-300">
                <Globe className="w-4 h-4 text-[#245934] dark:text-emerald-400" />
                <span>{t.languageSelect}:</span>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700 ml-1">
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-2 py-1 rounded-md text-xs font-bold cursor-pointer transition-all ${
                      language === 'en'
                        ? 'bg-[#245934] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    🇬🇧 EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('rw')}
                    className={`px-2 py-1 rounded-md text-xs font-bold cursor-pointer transition-all ${
                      language === 'rw'
                        ? 'bg-[#245934] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    🇷🇼 RW
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('fr')}
                    className={`px-2 py-1 rounded-md text-xs font-bold cursor-pointer transition-all ${
                      language === 'fr'
                        ? 'bg-[#245934] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    🇫🇷 FR
                  </button>
                </div>
              </div>

              {/* Theme Switcher Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer transition-all text-xs font-bold shadow-2xs"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-[#eec149]" />
                    <span>{t.lightMode}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-emerald-700" />
                    <span>{t.darkMode}</span>
                  </>
                )}
              </button>
            </div>

            {/* Role Segmented Selector */}
            <div className="mb-5">
              <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                {t.selectRole}
              </div>
              <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setRole('student');
                    setErrorMessage('');
                  }}
                  className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                    role === 'student'
                      ? 'bg-white dark:bg-slate-700 text-[#245934] dark:text-emerald-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t.student}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole('social_worker');
                    setErrorMessage('');
                  }}
                  className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                    role === 'social_worker'
                      ? 'bg-white dark:bg-slate-700 text-[#245934] dark:text-emerald-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t.socialWorker}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole('developer');
                    setErrorMessage('');
                  }}
                  className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                    role === 'developer'
                      ? 'bg-white dark:bg-slate-700 text-[#245934] dark:text-emerald-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t.systemAdmin}
                </button>
              </div>
            </div>

            {/* Auth Mode Toggle or Restricted Provisioning Notice */}
            {role !== 'developer' && isRegistrationAllowedForRole ? (
              <div className="flex justify-center gap-8 border-b border-slate-100 dark:border-slate-800 text-xs sm:text-sm font-semibold mb-5 pb-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMessage('');
                  }}
                  className={`pb-2 transition-colors cursor-pointer ${
                    authMode === 'login'
                      ? 'text-[#245934] dark:text-emerald-400 border-b-2 border-[#245934] dark:border-emerald-400 font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {t.signInExisting}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMessage('');
                  }}
                  className={`pb-2 transition-colors cursor-pointer ${
                    authMode === 'register'
                      ? 'text-[#245934] dark:text-emerald-400 border-b-2 border-[#245934] dark:border-emerald-400 font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {role === 'student' ? t.registerNewStudent : t.registerNewWorker}
                </button>
              </div>
            ) : role !== 'developer' && (
              <div className="mb-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                    <Lock className="w-4 h-4 text-[#245934] dark:text-emerald-400" />
                    <span>{t.signInExisting}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px] font-bold">
                    {language === 'rw' ? 'Kwandikisha Birinzwe' : language === 'fr' ? 'Accès Provisionné' : 'Provisioned Access Only'}
                  </span>
                </div>

                <div className="p-3 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="font-bold block text-amber-950 dark:text-amber-100 mb-0.5">
                      {language === 'rw'
                        ? 'Kwiyandikisha Birinzwe n\'Ubuyobozi'
                        : language === 'fr'
                        ? 'Auto-inscription Publique Fermée'
                        : 'Official Village Provisioning Active'}
                    </span>
                    {role === 'student' ? (
                      language === 'rw'
                        ? 'Kwiyandikisha ubwawe gufunzwe n\'Ubuyobozi. Konti z\'abanyeshuri zifungurwa gusa n\'Umuyobozi Mukuru cyangwa Umujyanama (Social Worker) w\'icyiciro cyawe.'
                        : language === 'fr'
                        ? 'L\'auto-inscription publique des élèves est fermée. Les comptes sont délivrés exclusivement par l\'Administrateur Général ou votre travailleur social assigné.'
                        : 'Public student self-registration is closed by the Village Administration. Student accounts are issued exclusively by the Master Administrator or your assigned Grade Social Worker.'
                    ) : (
                      language === 'rw'
                        ? 'Kwiyandikisha kw\'abajyanama gufunzwe. Konti z\'abakozi zifungurwa gusa n\'Umuyobozi Mukuru.'
                        : language === 'fr'
                        ? 'L\'auto-inscription du personnel est désactivée. Les comptes sont délivrés exclusivement par l\'Administrateur Général.'
                        : 'Staff self-registration is closed. Staff accounts are provisioned exclusively by the Master Administrator.'
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Error Alert */}
            {errorMessage && (
              <div className="p-3 mb-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* DEVELOPER / MASTER ADMIN MODE */}
            {role === 'developer' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-3 text-xs sm:text-sm text-[#1b4327] dark:text-emerald-200 leading-relaxed flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{t.adminBanner}</span>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t.adminUsername}
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.adminUsernamePlaceholder}
                      className="w-full pl-11 pr-4 py-2.5 sm:py-3 text-sm border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-[#245934] focus:ring-2 focus:ring-[#245934]/20 outline-hidden font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t.adminPassword}
                  </label>
                  <div className="relative">
                    <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.adminPasswordPlaceholder}
                      className="w-full pl-11 pr-11 py-2.5 sm:py-3 text-sm border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-[#245934] focus:ring-2 focus:ring-[#245934]/20 outline-hidden font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-5 bg-[#245934] hover:bg-[#1b4327] text-white font-bold rounded-xl text-sm sm:text-base transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md mt-2"
                >
                  <span>{t.launchAdmin}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            ) : authMode === 'login' ? (
              /* LOGIN FORM - Roomy, comfortable, and dignified */
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t.emailLabel}
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={
                        role === 'student'
                          ? t.studentEmailPlaceholder
                          : t.workerEmailPlaceholder
                      }
                      className="w-full pl-11 pr-4 py-2.5 sm:py-3 text-sm border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-[#245934] focus:ring-2 focus:ring-[#245934]/20 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t.passwordLabel}
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.passwordPlaceholder}
                      className="w-full pl-11 pr-11 py-2.5 sm:py-3 text-sm border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-[#245934] focus:ring-2 focus:ring-[#245934]/20 outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {language === 'rw'
                      ? 'Email isukurwa nyuma yo gusohoka'
                      : language === 'fr'
                      ? 'E-mail effacé après déconnexion'
                      : 'Email cleared upon sign out'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowRecoveryModal(true)}
                    className="font-bold text-[#245934] dark:text-emerald-400 hover:text-[#d95f18] dark:hover:text-orange-400 transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-[#d95f18]" />
                    <span>{t.forgotPassword}</span>
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-5 bg-[#245934] hover:bg-[#1b4327] text-white font-bold rounded-xl text-sm sm:text-base transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md mt-2"
                >
                  <span>{t.signInAs(getRoleDisplayName(role))}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            ) : (
              /* REGISTER FORM - Roomy, comfortable, and well-spaced */
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {t.firstName}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.firstNamePlaceholder}
                      className="w-full px-4 py-2.5 text-sm border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-[#245934] focus:ring-2 focus:ring-[#245934]/20 outline-hidden"
                    />
                  </div>

                  {role === 'student' ? (
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {t.familyName}
                      </label>
                      <input
                        type="text"
                        required
                        value={familyName}
                        onChange={(e) => setFamilyName(e.target.value)}
                        placeholder={t.familyNamePlaceholder}
                        className="w-full px-4 py-2.5 text-sm border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-[#245934] focus:ring-2 focus:ring-[#245934]/20 outline-hidden"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {t.gradeLed}
                      </label>
                      <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value as Grade)}
                        className="w-full px-4 py-2.5 text-sm border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-[#245934] focus:ring-2 focus:ring-[#245934]/20 outline-hidden"
                      >
                        {GRADES.map((g) => (
                          <option key={g} value={g}>
                            {g} Grade
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                      {t.emailLabel}
                    </label>
                    <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                      {t.emailUsedOnce}
                    </span>
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      role === 'student'
                        ? t.studentEmailPlaceholder
                        : t.workerEmailPlaceholder
                    }
                    className={`w-full px-4 py-2.5 text-sm border rounded-xl outline-hidden transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ${
                      isEmailTaken
                        ? 'border-rose-400 bg-rose-50/50 text-rose-900 dark:text-rose-200 focus:ring-2 focus:ring-rose-300/40'
                        : 'border-slate-300 dark:border-slate-700 focus:border-[#245934] focus:ring-2 focus:ring-[#245934]/20'
                    }`}
                  />
                  {isEmailTaken && (
                    <div className="mt-1.5 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2 shadow-2xs">
                      <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">{t.emailTakenWarning}</div>
                        <div className="text-[11px] text-rose-600 dark:text-rose-400 mt-0.5">
                          {t.emailUsedOnce}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {role === 'student' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {t.studentGrade}
                      </label>
                      <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value as Grade)}
                        className="w-full px-4 py-2.5 text-sm border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-[#245934] focus:ring-2 focus:ring-[#245934]/20 outline-hidden"
                      >
                        {GRADES.map((g) => (
                          <option key={g} value={g}>
                            {g} Grade
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {t.classCombo}
                      </label>
                      <input
                        type="text"
                        required
                        value={schoolClass}
                        onChange={(e) => setSchoolClass(e.target.value)}
                        placeholder="e.g. Senior 4 MEG"
                        className="w-full px-4 py-2.5 text-sm border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-[#245934] focus:ring-2 focus:ring-[#245934]/20 outline-hidden"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t.passwordLabel}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.passwordPlaceholder}
                      className="w-full px-4 pr-11 py-2.5 text-sm border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-[#245934] focus:ring-2 focus:ring-[#245934]/20 outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                      {t.chooseAvatar}
                    </label>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Presets or upload</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {AVATAR_PRESETS.map((av, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setSelectedAvatar(av)}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                          selectedAvatar === av
                            ? 'border-[#245934] ring-2 ring-emerald-300 scale-105'
                            : 'border-transparent opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img src={av} alt="avatar" className="w-full h-full object-cover" />
                      </button>
                    ))}

                    <label
                      htmlFor="custom-avatar-file-upload"
                      className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 border border-emerald-300 dark:border-slate-600 text-[#1b4327] dark:text-emerald-300 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-2xs"
                      title="Upload avatar or picture from your folder or files"
                    >
                      <Upload className="w-4 h-4 text-[#245934] dark:text-emerald-400" />
                      <span>Upload photo</span>
                      <input
                        id="custom-avatar-file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleCustomAvatarUpload}
                        className="hidden"
                      />
                    </label>

                    {!AVATAR_PRESETS.includes(selectedAvatar) && (
                      <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-slate-800 border border-emerald-300 dark:border-slate-600 px-2.5 py-1 rounded-xl">
                        <div className="w-7 h-7 rounded-full overflow-hidden border border-[#245934] ring-1 ring-emerald-300 shrink-0">
                          <img src={selectedAvatar} alt="Custom upload" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Custom pic</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-5 bg-[#245934] hover:bg-[#1b4327] text-white font-bold rounded-xl text-sm sm:text-base transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md mt-2"
                >
                  <span>{role === 'student' ? t.completeStudentReg : t.completeWorkerReg}</span>
                  <CheckCircle className="w-5 h-5" />
                </button>
              </form>
            )}
          </div>

          {/* Footer Notice */}
          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {appCustomization?.loginNotice || 'Restricted Official Village Care Network · Authorized access only'}
            </p>
          </div>
        </div>
      </div>

      {/* PASSWORD RECOVERY DIALOG (RECOVERED BY SYSTEM ADMIN) */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative space-y-4">
            <button
              type="button"
              onClick={() => setShowRecoveryModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 text-[#d95f18] flex items-center justify-center shrink-0 border border-amber-200">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#d95f18]">
                  ASYV Official Security Policy
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  {t.passwordRecoveryTitle}
                </h3>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-emerald-900 text-xs leading-relaxed space-y-2">
              <p className="font-bold">
                {t.passwordRecoveryNotice}
              </p>
              <p className="text-emerald-800 text-[11px]">
                In accordance with village care protocols, student and staff credentials are confidential and securely managed by the Master System Administrator. The admin has a direct tool in the Admin Console to view your registered password (PSD) or issue an immediate secure reset.
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-[#245934] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">Master Administrator Console:</span>
                  <p className="text-[11px] text-slate-500">Contact admin at <span className="font-mono text-[#245934] font-semibold">admin@alva</span> or visit the IT Desk.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <Phone className="w-4 h-4 text-[#d95f18] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">Psychosocial Coordination Desk:</span>
                  <p className="text-[11px] text-slate-500">Rubona Main Campus · Office of Social Work & Wellness · Ext 104</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowRecoveryModal(false)}
                className="w-full py-2.5 px-4 bg-[#245934] hover:bg-[#1b4327] text-white font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
              >
                Understood · Return to Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
