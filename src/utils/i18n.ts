import { AppLanguage } from '../types';

export interface Translations {
  // Brand & Mottos
  motto: string;
  subMotto: string;
  villageName: string;
  portalSubtitle: string;

  // Common Controls & Actions
  themeToggleDark: string;
  themeToggleLight: string;
  languageSelect: string;
  searchPlaceholder: string;
  saveChanges: string;
  cancel: string;
  back: string;
  goBackFormerPage: string;
  logout: string;
  login: string;
  register: string;
  send: string;
  typeMessage: string;
  done: string;
  markDone: string;
  delete: string;
  viewAll: string;
  loading: string;
  close: string;
  edit: string;
  add: string;
  submit: string;
  completed: string;
  pending: string;
  approved: string;
  rejected: string;
  copy: string;
  copied: string;
  callNow: string;

  // Roles & Grades
  student: string;
  socialWorker: string;
  admin: string;
  grade: string;
  allGrades: string;
  classLabel: string;

  // Sidebar & Navigation
  navOverview: string;
  navMonitorWorker: string;
  navStudents: string;
  navChat: string;
  navSosAlerts: string;
  navContacts: string;
  navDailyReflection: string;
  navJournal: string;
  navMoodTracker: string;
  navAssessments: string;
  navTips: string;
  navColorsWellbeing: string;
  navChampions: string;
  navJoinChampions: string;
  navTodoPlanner: string;
  navAssignments: string;
  navDailyPromptSetter: string;
  navTimetable: string;
  navLessonPrep: string;
  navChampionApps: string;
  navUserManagement: string;
  navDevConsole: string;

  // Student Dashboard
  studentWelcomeTitle: string;
  studentWelcomeSubtitle: string;
  psychosocialWorkerTitle: string;
  privateMessageBtn: string;
  courtOfInspiration: string;
  inspireAnotherCourt: string;
  urgentHelpBannerTitle: string;
  urgentHelpBannerSubtitle: string;
  sendSosBtn: string;
  directWorkerChatTitle: string;
  directWorkerChatDesc: string;
  dailyPromptCardTitle: string;
  dailyPromptCardDesc: string;
  journalCardTitle: string;
  journalCardDesc: string;
  moodTrackerCardTitle: string;
  moodTrackerCardDesc: string;
  assignmentsCardTitle: string;
  assignmentsCardDesc: string;
  championsCardTitle: string;
  championsCardDesc: string;
  kudosTitle: string;
  colorsHubTitle: string;
  colorsHubDesc: string;
  openColorsHubBtn: string;
  tipsTeaserTitle: string;
  tipsTeaserDesc: string;
  exploreTipsBtn: string;
  villageSupportDesk: string;
  emergencyHotlineLabel: string;
  whatsappCrisisLabel: string;
  healthClinicLabel: string;

  // Social Worker & Monitor
  workerWelcomeTitle: string;
  workerWelcomeSubtitle: string;
  monitorWorkerBtn: string;
  myProfileBtn: string;
  hotlineNumbersBtn: string;
  todoPlannerBtn: string;
  activeSosWarning: string;
  studentsRosterTitle: string;
  totalTasksTitle: string;
  completionPercentageTitle: string;
  unansweredStudentsTitle: string;
  completedStudentsTitle: string;
  sendReminderAlert: string;
  inspectAnswers: string;

  // To-Do Planner & Approaching Deadlines
  todoPageTitle: string;
  todoPageSubtitle: string;
  urgentActionRequired: string;
  taskApproachingNotice: string;
  addNewTask: string;
  taskDescriptionLabel: string;
  deadlineLabel: string;
  priorityLabel: string;
  highPriority: string;
  mediumPriority: string;
  lowPriority: string;
  activePendingTasks: string;
  completedArchive: string;
  allCaughtUp: string;
  dueToday: string;
  overdue: string;

  // Village Contacts
  contactsPageTitle: string;
  contactsPageSubtitle: string;
  crisisHotlineCardTitle: string;
  crisisHotlineCardDesc: string;
  whatsappDeskCardTitle: string;
  whatsappDeskCardDesc: string;
  medicalClinicCardTitle: string;
  officeLocationCardTitle: string;
  workingHoursCardTitle: string;
  villageEmailCardTitle: string;
  villageMentorsTitle: string;
  villageMentorsSubtitle: string;
  updateContactsBtn: string;
  saveAllNumbersBtn: string;

  // Mood Tracker & Wellbeing
  moodTrackerTitle: string;
  moodTrackerSubtitle: string;
  howAreYouFeeling: string;
  recordMoodBtn: string;
  intensityLevel: string;
  personalNoteOptional: string;
  thirtyDayTrendTitle: string;
  thirtyDayWellbeingScore: string;
  dominantEmotion: string;
  checkInStreak: string;
  historicalLogsCount: string;
  recordedMoodHistory: string;
  noMoodLogsYet: string;

  // Mood Labels
  moodPeaceful: string;
  moodGrateful: string;
  moodEnergetic: string;
  moodNeutral: string;
  moodAnxious: string;
  moodStressed: string;
  moodLow: string;
  moodOverwhelmed: string;

  // Personal Journal
  journalTitle: string;
  journalSubtitle: string;
  writeNewStory: string;
  storyTitleLabel: string;
  storyContentLabel: string;
  selectStoryEmotion: string;
  saveStoryBtn: string;
  mySavedStories: string;
  noStoriesYet: string;

  // Daily Reflection
  dailyQuestionTitle: string;
  dailyQuestionSubtitle: string;
  yourReflectionLabel: string;
  submitReflectionBtn: string;
  alreadyAnswered: string;

  // Emergency Modal
  emergencyModalTitle: string;
  emergencyModalSubtitle: string;
  criticalNotice: string;
  describeSituationPlaceholder: string;
  confirmSendSosBtn: string;
  alertDispatched: string;

  // Goodbye & Greetings
  goodbyeTitle: string;
  goodbyeSubtitle: string;
  returnToLoginBtn: string;
  helpBannerGreeting: string;
  helpBannerQuestion: string;
}

export const TRANSLATIONS: Record<AppLanguage, Translations> = {
  en: {
    motto: 'LEARN, ADAPT AND LEAD',
    subMotto: 'Agahozo-Shalom Youth Village · Core Philosophy & Psychosocial Sanctuary',
    villageName: 'The Agahozo-Shalom Youth Village',
    portalSubtitle: 'Psychosocial Support Platform · Ingabe, Ingabo, Ijabo',

    themeToggleDark: 'Dark Mode',
    themeToggleLight: 'Light Mode',
    languageSelect: 'Language',
    searchPlaceholder: 'Search records, students, activities...',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    back: 'Back',
    goBackFormerPage: 'Go Back to Former Page',
    logout: 'Sign Out',
    login: 'Sign In',
    register: 'Create Account',
    send: 'Send',
    typeMessage: 'Type your confidential message...',
    done: 'Done',
    markDone: 'Mark as Done',
    delete: 'Delete',
    viewAll: 'View All',
    loading: 'Loading...',
    close: 'Close',
    edit: 'Edit',
    add: 'Add',
    submit: 'Submit',
    completed: 'Completed',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    copy: 'Copy',
    copied: 'Copied!',
    callNow: 'Call Now',

    student: 'Student',
    socialWorker: 'Social Worker',
    admin: 'Master Administrator',
    grade: 'Grade',
    allGrades: 'All Grades (Ingabe, Ingabo, Ijabo)',
    classLabel: 'Class',

    navOverview: 'Overview',
    navMonitorWorker: 'Monitor My Worker',
    navStudents: 'Grade Students',
    navChat: 'Confidential Chat',
    navSosAlerts: 'SOS Emergency Alerts',
    navContacts: 'Village Support & Contacts',
    navDailyReflection: 'Daily Reflection',
    navJournal: 'Personal Story Journal',
    navMoodTracker: 'Mood & Wellbeing Log',
    navAssessments: 'Assessments & Quizzes',
    navTips: 'Explore Life & Study Tips',
    navColorsWellbeing: 'ASYV Colors & Wellbeing',
    navChampions: 'Mental Champions Hub',
    navJoinChampions: 'Join Mental Champions',
    navTodoPlanner: 'Action Planner & To-Dos',
    navAssignments: 'Set Grade Assignments',
    navDailyPromptSetter: 'Daily Reflection Prompt',
    navTimetable: 'Weekly Wellness Schedule',
    navLessonPrep: 'Wellness Lesson Modules',
    navChampionApps: 'Review Champion Applications',
    navUserManagement: 'User Management',
    navDevConsole: 'Master Admin Console',

    studentWelcomeTitle: 'Muraho',
    studentWelcomeSubtitle: 'Welcome to your private psychosocial space. Everything here is safe, confidential, and tailored to support your wellbeing at the Agahozo-Shalom Youth Village.',
    psychosocialWorkerTitle: 'Your Psychosocial Worker',
    privateMessageBtn: 'Send private message',
    courtOfInspiration: 'Court of Inspiration & Emotional Support',
    inspireAnotherCourt: 'Inspire with Another Court',
    urgentHelpBannerTitle: 'Need Urgent Emotional or Safety Help?',
    urgentHelpBannerSubtitle: 'Reach out directly to your social worker. Your safety and dignity are our highest priority.',
    sendSosBtn: 'Send SOS Alert',
    directWorkerChatTitle: 'Direct Worker Chat',
    directWorkerChatDesc: 'Private 1-on-1 counseling chat with your assigned psychosocial worker.',
    dailyPromptCardTitle: 'Daily Grade Question',
    dailyPromptCardDesc: 'Reflect on today\'s village prompt prepared for your grade community.',
    journalCardTitle: 'Personal Journal',
    journalCardDesc: 'Keep your daily stories, thoughts, and memories safe with date & reaction tags.',
    moodTrackerCardTitle: 'Mood & 30-Day Trends',
    moodTrackerCardDesc: 'Track how your feelings evolve across days and terms with D3 analytics.',
    assignmentsCardTitle: 'Assignments & Reflections',
    assignmentsCardDesc: 'Online assessments set by your grade social worker.',
    championsCardTitle: 'Mental Champions Network',
    championsCardDesc: 'Peer wellness ambassadors supporting mental health and spreading compassion.',
    kudosTitle: 'Peer Kindness & Kudos Wall',
    colorsHubTitle: 'Explore ASYV Village Colors, Inspiring Quotes & Grounding Tools',
    colorsHubDesc: 'Discover the meaning of acacia green, terracotta, Lake Muhazi azure, and practice sensory breathing.',
    openColorsHubBtn: 'Open Wellbeing & Colors Hub',
    tipsTeaserTitle: 'Explore Life, Study & Stress Management Tips',
    tipsTeaserDesc: 'Curated tools for active recall, 4-7-8 breathing, healthy village boundaries, and restorative living.',
    exploreTipsBtn: 'Explore Tips & Guides',
    villageSupportDesk: 'Village Support & Emergency Desk',
    emergencyHotlineLabel: 'Emergency Hotline',
    whatsappCrisisLabel: 'WhatsApp Crisis Line',
    healthClinicLabel: 'Health Center Clinic',

    workerWelcomeTitle: 'Welcome',
    workerWelcomeSubtitle: 'You are directing psychosocial care, academic monitoring, and counseling circles. Track questionnaires and follow up on pending work.',
    monitorWorkerBtn: 'Monitor My Worker',
    myProfileBtn: 'My Profile & Numbers',
    hotlineNumbersBtn: 'Village Hotline & Numbers',
    todoPlannerBtn: 'To-Do Planner',
    activeSosWarning: 'Urgent Student SOS Alert Pending',
    studentsRosterTitle: 'Registered Grade Students',
    totalTasksTitle: 'Total Assignments Given',
    completionPercentageTitle: 'Completion Rate per Student',
    unansweredStudentsTitle: 'Students with Pending Assignments',
    completedStudentsTitle: 'Students Who Completed Work',
    sendReminderAlert: 'Send Gentle Reminder',
    inspectAnswers: 'Inspect Submitted Answers',

    todoPageTitle: 'Social Worker Daily To-Do Planner',
    todoPageSubtitle: 'Keep track of student check-ins, dorm visits, group counseling circles, and administrative requirements. Approaching deadline tasks trigger active overlay reminders until completed.',
    urgentActionRequired: 'URGENT ACTION REQUIRED',
    taskApproachingNotice: 'This persistent priority notification stays directly in front of your account until you explicitly mark the action item as Done.',
    addNewTask: 'Add New Action Item & Set Deadline',
    taskDescriptionLabel: 'Task Description',
    deadlineLabel: 'Deadline / Target Date',
    priorityLabel: 'Priority Level',
    highPriority: '🔥 High Priority (Pop-up)',
    mediumPriority: '⚡ Medium Priority',
    lowPriority: '🌱 Low Priority',
    activePendingTasks: 'Active Pending Tasks',
    completedArchive: 'Completed Archive',
    allCaughtUp: 'All caught up! No pending tasks remaining for today.',
    dueToday: 'Due Today',
    overdue: 'Overdue',

    contactsPageTitle: 'Village Hotlines & Support Contacts',
    contactsPageSubtitle: 'Direct access to verified 24/7 Agahozo-Shalom Youth Village crisis support, psychosocial counselors, medical clinic staff, and residential mentors. All calls and messages are strictly confidential.',
    crisisHotlineCardTitle: 'Village Crisis & Hotline',
    crisisHotlineCardDesc: 'For immediate emotional distress, trauma, or urgent safety support anytime.',
    whatsappDeskCardTitle: 'WhatsApp Psychosocial Desk',
    whatsappDeskCardDesc: 'Text confidentially with our village psychosocial coordination team.',
    medicalClinicCardTitle: 'Village Health Clinic',
    officeLocationCardTitle: 'Office Location',
    workingHoursCardTitle: 'Working Hours & Coverage',
    villageEmailCardTitle: 'Village Support Email',
    villageMentorsTitle: 'Village Support Personnel & Mentors',
    villageMentorsSubtitle: 'Key village personnel updated by the admin and grade leaders for specialized mental health, guidance, and counseling needs.',
    updateContactsBtn: 'Update Numbers & Contacts',
    saveAllNumbersBtn: 'Save All Village Numbers',

    moodTrackerTitle: 'Student Mood & Wellbeing Analytics',
    moodTrackerSubtitle: 'Continuously visualize your emotional patterns over the last 30 days. D3 analytics help you and your grade social worker celebrate calm days and intervene early during stress.',
    howAreYouFeeling: 'How are you feeling right now?',
    recordMoodBtn: 'Record Mood & Update D3 Analytics',
    intensityLevel: 'Intensity Level',
    personalNoteOptional: 'Personal Note or Trigger (Optional context for your social worker)',
    thirtyDayTrendTitle: '30-Day Mood Trend Curve (D3 Visualization)',
    thirtyDayWellbeingScore: '30-Day Wellbeing',
    dominantEmotion: 'Dominant Emotion',
    checkInStreak: 'Check-in Streak',
    historicalLogsCount: 'Historical Logs',
    recordedMoodHistory: 'Recorded Mood History',
    noMoodLogsYet: 'No mood logs recorded yet. Log your first mood above to start tracking your wellbeing timeline!',

    moodPeaceful: 'Peaceful',
    moodGrateful: 'Grateful',
    moodEnergetic: 'Energetic',
    moodNeutral: 'Neutral',
    moodAnxious: 'Anxious',
    moodStressed: 'Stressed',
    moodLow: 'Low Energy',
    moodOverwhelmed: 'Overwhelmed',

    journalTitle: 'Personal Story & Reflection Journal',
    journalSubtitle: 'A safe space to write down your experiences, memories, dreams, and healing journey at ASYV.',
    writeNewStory: 'Write a New Story or Reflection',
    storyTitleLabel: 'Title of your reflection',
    storyContentLabel: 'What is on your heart today?',
    selectStoryEmotion: 'Tag an emotional reaction to this story',
    saveStoryBtn: 'Save to My Private Journal',
    mySavedStories: 'My Saved Stories',
    noStoriesYet: 'Your journal is empty. Write your first reflection above!',

    dailyQuestionTitle: 'Daily Village Reflection Prompt',
    dailyQuestionSubtitle: 'Answer the question set by your grade social worker for today\'s reflection.',
    yourReflectionLabel: 'Your Thoughtful Answer',
    submitReflectionBtn: 'Submit Answer to Social Worker',
    alreadyAnswered: 'You have submitted your answer for today.',

    emergencyModalTitle: 'Urgent Crisis & SOS Alert',
    emergencyModalSubtitle: 'If you are experiencing severe emotional pain, danger, or trauma, alert your worker immediately.',
    criticalNotice: 'Your grade social worker and village emergency desk will be dispatched to your location.',
    describeSituationPlaceholder: 'Briefly describe what is happening so we can send the right help immediately...',
    confirmSendSosBtn: 'DISPATCH EMERGENCY SOS NOW',
    alertDispatched: 'Emergency alert sent. Help is on the way. Please stay calm and safe.',

    goodbyeTitle: 'Thank You for Taking Care of Yourself',
    goodbyeSubtitle: 'Mind Bridge and your ASYV support family are always here whenever you need guidance.',
    returnToLoginBtn: 'Return to Sign In',
    helpBannerGreeting: 'Welcome to Mind Bridge Village Care',
    helpBannerQuestion: 'How can we support your spirit and academic journey today?'
  },

  rw: {
    motto: 'IGA, MENYERA, UYOBORE',
    subMotto: 'Agahozo-Shalom Youth Village · Intego Rusange n\'Ubujyanama bwo mu Mutwe',
    villageName: 'Umudugudu w\'Urwaruka w\'Agahozo-Shalom',
    portalSubtitle: 'Urubuga rw\'Ubujyanama n\'Imibereho Myiza · Ingabe, Ingabo, Ijabo',

    themeToggleDark: 'Ibara Ryijimye',
    themeToggleLight: 'Ibara Ryera',
    languageSelect: 'Ururimi',
    searchPlaceholder: 'Shakisha abanyeshuri, inyandiko, ibikorwa...',
    saveChanges: 'Bika Impinduka',
    cancel: 'Hagarika',
    back: 'Subira Inyuma',
    goBackFormerPage: 'Subira ku Rupapuro Rwaherukaga',
    logout: 'Sohoka',
    login: 'Injira',
    register: 'Iyandikishe',
    send: 'Ohereza',
    typeMessage: 'Andika ubutumwa bw\'ibanga hano...',
    done: 'Byarangiye',
    markDone: 'Shyira mu Byarangiye',
    delete: 'Gusiba',
    viewAll: 'Reba Byose',
    loading: 'Birimo gupakira...',
    close: 'Funga',
    edit: 'Hindura',
    add: 'Ongeraho',
    submit: 'Ohereza',
    completed: 'Byarangiye',
    pending: 'Bitegereje',
    approved: 'Byemejwe',
    rejected: 'Byanzwe',
    copy: 'Koporora',
    copied: 'Byakoporowe!',
    callNow: 'Hamagara Ubu',

    student: 'Umunyeshuri',
    socialWorker: 'Umujyanama w\'Imibereho',
    admin: 'Umuyobozi Mukuru wa Sisitemu',
    grade: 'Icyiciro',
    allGrades: 'Ibyiciro Byose (Ingabe, Ingabo, Ijabo)',
    classLabel: 'Ishuri',

    navOverview: 'Incamake',
    navMonitorWorker: 'Kugenzura Ibikorwa byanjye',
    navStudents: 'Abanyeshuri b\'Icyiciro',
    navChat: 'Kuganira mu Ibanga',
    navSosAlerts: 'Ubutabazi bw\'Ihuse (SOS)',
    navContacts: 'Aderesi n\'Imihamagaro y\'Umudugudu',
    navDailyReflection: 'Isesengura ry\'Umunsi',
    navJournal: 'Ikinyamakuru cy\'Inkuru Zanjye',
    navMoodTracker: 'Kugenzura Umutima n\'Imbamutima',
    navAssessments: 'Imikoro n\'Ibibazo by\'Isuzuma',
    navTips: 'Inama z\'Ubuzima n\'Imyigire',
    navColorsWellbeing: 'Amabara y\'Agahozo n\'Ubuzima',
    navChampions: 'Intumwa z\'Ubuzima bwo mu Mutwe',
    navJoinChampions: 'Gusaba Kwinjira mu Ntumwa',
    navTodoPlanner: 'Gahunda y\'Ibyo Gukora',
    navAssignments: 'Gutanga Imikoro ku Banyeshuri',
    navDailyPromptSetter: 'Gushyiraho Isesengura ry\'Umunsi',
    navTimetable: 'Ingengabihe y\'Ubuzima',
    navLessonPrep: 'Amasomo yo Kwiyitaho',
    navChampionApps: 'Gusuzuma Abasaba kuba Intumwa',
    navUserManagement: 'Gucunga Abakoresha',
    navDevConsole: 'Ibiro Byihariye by\'Umuyobozi',

    studentWelcomeTitle: 'Muraho',
    studentWelcomeSubtitle: 'Urakaza neza mu cyumba cyawe bwite cy\'ubujyanama bwo mu mutwe. Ibintu byose hano birinzwe mu ibanga rikomeye kandi biteguriwe gufasha imibereho yawe myiza mu Agahozo-Shalom Youth Village.',
    psychosocialWorkerTitle: 'Umujyanama wawe w\'Imibereho',
    privateMessageBtn: 'Ohereza ubutumwa bw\'ibanga',
    courtOfInspiration: 'Uruhande rw\'Incamugongo n\'Ihagarara ry\'Umutima',
    inspireAnotherCourt: 'Hindura Ubutumwa Butera Imbaraga',
    urgentHelpBannerTitle: 'Ukeneye Ubufasha bw\'Ihuse cyangwa Umutekano?',
    urgentHelpBannerSubtitle: 'Vugana ako kanya n\'umujyanama wawe w\'imibereho. Umutekano wawe n\'agaciro kawe nicyo dushyize imbere.',
    sendSosBtn: 'Ohereza Ubutabazi bwa SOS',
    directWorkerChatTitle: 'Iganiriro n\'Umujyanama wawe',
    directWorkerChatDesc: 'Iganire mu ibanga rikomeye n\'umujyanama wagenewe icyiciro cyawe.',
    dailyPromptCardTitle: 'Ikibazo cy\'Isesengura ry\'Umunsi',
    dailyPromptCardDesc: 'Tanga ibitekerezo byawe ku kibazo cy\'umunsi cyateguriwe icyiciro cyawe.',
    journalCardTitle: 'Ikinyamakuru cyanjye bwite',
    journalCardDesc: 'Bika inkuru zawe za buri munsi, ibitekerezo n\'ibyo wibuka bibitse neza.',
    moodTrackerCardTitle: 'Uko Umerewe mu Minsi 30',
    moodTrackerCardDesc: 'Kurikirana ihindagurika ry\'imbamutima zawe hamwe n\'ibishushanyo bya D3.',
    assignmentsCardTitle: 'Imikoro n\'Ibibazo by\'Isuzuma',
    assignmentsCardDesc: 'Ibibazo n\'ibizamini wahawe n\'umujyanama w\'icyiciro cyawe.',
    championsCardTitle: 'Intumwa z\'Ubuzima bwo mu Mutwe',
    championsCardDesc: 'Urusobe rw\'abanyeshuri bagenzi bawe bafasha mu komora ibikomere no kunga ubumwe.',
    kudosTitle: 'Urukuta rw\'Amashimwe n\'Urukundo hagati y\'Abanyeshuri',
    colorsHubTitle: 'Sura Amabara y\'Umudugudu w\'Agahozo n\'Ubujyanama',
    colorsHubDesc: 'Menya ubusobanuro bw\'icyatsi cy\'inganzamarumbo, umutuku w\'itaka, ubururu bwa Muhazi n\'imyitozo yo guhumeka.',
    openColorsHubBtn: 'Fungura Urubuga rw\'Amabara',
    tipsTeaserTitle: 'Inama z\'Ubuzima, Imyigire no Kurwanya Umunaniro',
    tipsTeaserDesc: 'Uburyo bwo gufata mu mutwe, guhumeka neza kwa 4-7-8 no kubaka imibanire myiza.',
    exploreTipsBtn: 'Reba Inama zose',
    villageSupportDesk: 'Ibiro by\'Ubufasha n\'Ubutabazi bw\'Umudugudu',
    emergencyHotlineLabel: 'Nimero y\'Ubutabazi bwa Burundu',
    whatsappCrisisLabel: 'WhatsApp y\'Ubufasha bw\'Ibanga',
    healthClinicLabel: 'Ivuriro ry\'Umudugudu (Extension 104)',

    workerWelcomeTitle: 'Muraho neza',
    workerWelcomeSubtitle: 'Urikuyobora ubujyanama, kugenzura imitsindire n\'imibereho y\'icyiciro cyawe. Kurikirana ibisubizo by\'abanyeshuri kandi uhe ubufasha abatararangiza imikoro.',
    monitorWorkerBtn: 'Kugenzura Ibikorwa byanjye',
    myProfileBtn: 'Umwirondoro & Nimero zanjye',
    hotlineNumbersBtn: 'Nimero z\'Umudugudu',
    todoPlannerBtn: 'Gahunda y\'Ibyo Gukora',
    activeSosWarning: 'Hari Umunyeshuri Ukeneye Ubutabazi bw\'Ihuse!',
    studentsRosterTitle: 'Urutonde rw\'Abanyeshuri b\'Icyiciro',
    totalTasksTitle: 'Imikoro Yose Yatanzwe',
    completionPercentageTitle: 'Ijanisha ry\'Abarangije Imikoro',
    unansweredStudentsTitle: 'Abanyeshuri Batarasubiza Imikoro',
    completedStudentsTitle: 'Abanyeshuri Barangije Imikoro Yose',
    sendReminderAlert: 'Boherereze Ubutumwa Bubibutsa',
    inspectAnswers: 'Suzuma Ibisubizo by\'Abanyeshuri',

    todoPageTitle: 'Gahunda y\'Ibyo Gukora by\'Umujyanama',
    todoPageSubtitle: 'Kurikirana gusura abanyeshuri mu macumbi, ibiganiro by\'iminsi n\'inshingano z\'ubutegetsi. Ibyihutirwa bizakomeza kugaragara imbere muri konti yawe kugeza ubishyize mu byarangiye.',
    urgentActionRequired: 'IBIKORWA BYIHUTIRWA BIRASABWA',
    taskApproachingNotice: 'Ubu butumwa bukomeza kugaragara kugeza igihe ukanze "Shyira mu Byarangiye".',
    addNewTask: 'Ongeraho Igikorwa Gishya n\'Igihe Ntarengwa',
    taskDescriptionLabel: 'Ibisobanuro by\'Igikorwa',
    deadlineLabel: 'Itariki Ntarengwa',
    priorityLabel: 'Urugero rw\'Ubucucike / Ihuse',
    highPriority: '🔥 Byihutirwa Cyane (Pop-up)',
    mediumPriority: '⚡ Biringaniye',
    lowPriority: '🌱 Bisanzwe',
    activePendingTasks: 'Ibikorwa Bitararangira',
    completedArchive: 'Ibyarangiye Byabitswe',
    allCaughtUp: 'Ibikorwa byose byarangiye! Nta kintu gisigaye uyu munsi.',
    dueToday: 'Biteganyijwe Uyu Munsi',
    overdue: 'Byarengeje Igihe',

    contactsPageTitle: 'Nimero z\'Ubutabazi n\'Aderesi z\'Umudugudu',
    contactsPageSubtitle: 'Kugera ku buryo bwa vuba ku butabazi bw\'amasaha 24/7 mu Agahozo-Shalom, abaganga b\'ivuriro n\'abajyanama b\'imibereho. Guhamagara n\'ubutumwa byose birinzwe mu ibanga rikomeye.',
    crisisHotlineCardTitle: 'Ubutabazi bw\'Ihuse bw\'Umudugudu',
    crisisHotlineCardDesc: 'Ku bibazo byihutirwa by\'ihungabana, umutekano muke cyangwa uburwayi bwo mu mutwe.',
    whatsappDeskCardTitle: 'Ibiro bya WhatsApp by\'Ubujyanama',
    whatsappDeskCardDesc: 'Andika mu ibanga rikomeye ku bajyanama b\'umudugudu wawe.',
    medicalClinicCardTitle: 'Ivuriro ry\'Umudugudu',
    officeLocationCardTitle: 'Aho Ibiro Biherereye',
    workingHoursCardTitle: 'Amasaha y\'Akazi',
    villageEmailCardTitle: 'Imeli y\'Ubufasha',
    villageMentorsTitle: 'Abakozi n\'Abajyanama b\'Umudugudu',
    villageMentorsSubtitle: 'Abajyanama n\'abashinzwe umutekano n\'ubuzima bwashyizweho n\'ubuyobozi.',
    updateContactsBtn: 'Hindura Nimero z\'Umudugudu',
    saveAllNumbersBtn: 'Bika Nimero zose z\'Umudugudu',

    moodTrackerTitle: 'Isuzuma ry\'Uko Umutima n\'Imbamutima Biheze',
    moodTrackerSubtitle: 'Reba uko wumvaga umerewe mu minsi 30 ishize. Bishusho bya D3 bigufasha wowe n\'umujyanama wawe gusobanukirwa ibitera umutuzo n\'ibitera umunaniro.',
    howAreYouFeeling: 'Ubu wumva umeze ute mu mutima?',
    recordMoodBtn: 'Bika Imbamutima n\'Amakuru ya D3',
    intensityLevel: 'Urugero rw\'Ubukana bw\'Imbamutima',
    personalNoteOptional: 'Icyateye ibi byiyumvo (Ubusobanuro bw\'ibanga ku mujyanama)',
    thirtyDayTrendTitle: 'Icyerekezo cy\'Iminsi 30 (D3 Graph)',
    thirtyDayWellbeingScore: 'Ugereranyije mu Minsi 30',
    dominantEmotion: 'Imbamutima Yiganje',
    checkInStreak: 'Iminsi Wiyandikishije yikurikiranya',
    historicalLogsCount: 'Inshuro Wiyandikishije',
    recordedMoodHistory: 'Amateka y\'Imbamutima Zanditswe',
    noMoodLogsYet: 'Nta mbamutima zirandikwa. Andika bwa mbere hejuru kugira ngo utangire kubona amakuru yawe!',

    moodPeaceful: 'Umutuzo',
    moodGrateful: 'Gushimira',
    moodEnergetic: 'Ingufu',
    moodNeutral: 'Bisanzwe',
    moodAnxious: 'Guhangayika',
    moodStressed: 'Umunaniro',
    moodLow: 'Kunanirwa',
    moodOverwhelmed: 'Kurengerwa',

    journalTitle: 'Ikinyamakuru cy\'Inkuru n\'Ibitekerezo byanjye',
    journalSubtitle: 'Ahantu hizewe ho kwandika ibyakubayeho, ibyifuzo n\'inzira y\'ubugorozi mu mudugudu.',
    writeNewStory: 'Andika Inkuru cyangwa Igitekerezo Gishya',
    storyTitleLabel: 'Umutwe w\'inkuru yawe',
    storyContentLabel: 'Ni iki kiri ku mutima wawe uyu munsi?',
    selectStoryEmotion: 'Hitamo ikimenyetso kigaragaza iyi nkuru',
    saveStoryBtn: 'Bika mu Kinyamakuru cyanjye',
    mySavedStories: 'Inkuru Zanjye Nabitse',
    noStoriesYet: 'Ikinyamakuru cyawe kiracyarimo ubusa. Andika inkuru yawe ya mbere hejuru!',

    dailyQuestionTitle: 'Ikibazo cy\'Isesengura ry\'Umunsi',
    dailyQuestionSubtitle: 'Subiza ikibazo cyashyizweho n\'umujyanama w\'icyiciro cyawe.',
    yourReflectionLabel: 'Igisubizo cyawe cyitondewe',
    submitReflectionBtn: 'Ohereza Igisubizo ku Mujyanama',
    alreadyAnswered: 'Wamaze gutanga igisubizo cyawe cy\'uyu munsi.',

    emergencyModalTitle: 'Ubutabazi bw\'Ihuse bwa SOS',
    emergencyModalSubtitle: 'Niba uri mu kaga, ububabare bukabije bw\'umutima cyangwa ibikomere, menyesha umujyanama ako kanya.',
    criticalNotice: 'Umujyanama w\'icyiciro n\'abashinzwe umutekano w\'umudugudu barahita baza aho uri.',
    describeSituationPlaceholder: 'Sobanura muri make ikirimo kuba kugira ngo twohereze ubufasha bwihuse...',
    confirmSendSosBtn: 'OHEREZA UBUTABAZI BWA SOS NONAHA',
    alertDispatched: 'Ubutabazi bwoherejwe. Ubufasha buraje ako kanya. Tura utuze kandi ugume ahatekanye.',

    goodbyeTitle: 'Urakoze Kwiyitaho no Kwita ku Buzima',
    goodbyeSubtitle: 'Mind Bridge n\'umuryango w\'Agahozo bahora hafi yawe igihe cyose ukeneye ubuyobozi.',
    returnToLoginBtn: 'Subira Aho Binjirira',
    helpBannerGreeting: 'Murakaza neza muri Mind Bridge - Agahozo-Shalom Care',
    helpBannerQuestion: 'Ni gute twagufasha uyu munsi mu mibereho no mu myigire yawe?'
  },

  fr: {
    motto: 'APPRENDRE, S\'ADAPTER ET DIRIGER',
    subMotto: 'Agahozo-Shalom Youth Village · Philosophie Centrale et Sanctuaire Psychosocial',
    villageName: 'Le Village de Jeunesse Agahozo-Shalom',
    portalSubtitle: 'Plateforme de Soutien Psychosocial · Ingabe, Ingabo, Ijabo',

    themeToggleDark: 'Mode Sombre',
    themeToggleLight: 'Mode Clair',
    languageSelect: 'Langue',
    searchPlaceholder: 'Rechercher des élèves, activités, dossiers...',
    saveChanges: 'Enregistrer les Modifications',
    cancel: 'Annuler',
    back: 'Retour',
    goBackFormerPage: 'Retourner à la Page Précédente',
    logout: 'Déconnexion',
    login: 'Se Connecter',
    register: 'Créer un Compte',
    send: 'Envoyer',
    typeMessage: 'Écrivez votre message confidentiel ici...',
    done: 'Terminé',
    markDone: 'Marquer comme Terminé',
    delete: 'Supprimer',
    viewAll: 'Voir Tout',
    loading: 'Chargement en cours...',
    close: 'Fermer',
    edit: 'Modifier',
    add: 'Ajouter',
    submit: 'Soumettre',
    completed: 'Terminé',
    pending: 'En Attente',
    approved: 'Approuvé',
    rejected: 'Rejeté',
    copy: 'Copier',
    copied: 'Copié !',
    callNow: 'Appeler Maintenant',

    student: 'Élève',
    socialWorker: 'Travailleur Social',
    admin: 'Administrateur Principal',
    grade: 'Promotion',
    allGrades: 'Toutes les Promotions (Ingabe, Ingabo, Ijabo)',
    classLabel: 'Classe',

    navOverview: 'Vue d\'Ensemble',
    navMonitorWorker: 'Suivi de Mon Travailleur',
    navStudents: 'Élèves de Promotion',
    navChat: 'Chat Confidentiel',
    navSosAlerts: 'Alertes d\'Urgence SOS',
    navContacts: 'Contacts et Lignes du Village',
    navDailyReflection: 'Réflexion Quotidienne',
    navJournal: 'Journal Intime & Récits',
    navMoodTracker: 'Suivi de l\'Humeur & Bien-être',
    navAssessments: 'Évaluations et Devoirs',
    navTips: 'Conseils de Vie et d\'Étude',
    navColorsWellbeing: 'Couleurs ASYV & Bien-être',
    navChampions: 'Pôle des Champions Mentaux',
    navJoinChampions: 'Rejoindre les Champions',
    navTodoPlanner: 'Planificateur d\'Actions',
    navAssignments: 'Assigner des Devoirs',
    navDailyPromptSetter: 'Définir la Réflexion Quotidienne',
    navTimetable: 'Horaires du Bien-être',
    navLessonPrep: 'Modules de Bien-être',
    navChampionApps: 'Examiner les Candidatures',
    navUserManagement: 'Gestion des Utilisateurs',
    navDevConsole: 'Console Administrateur',

    studentWelcomeTitle: 'Bonjour',
    studentWelcomeSubtitle: 'Bienvenue dans votre espace psychosocial privé. Tout est sécurisé, confidentiel et adapté pour soutenir votre bien-être au Village Agahozo-Shalom.',
    psychosocialWorkerTitle: 'Votre Travailleur Psychosocial',
    privateMessageBtn: 'Envoyer un message privé',
    courtOfInspiration: 'Cour d\'Inspiration et de Soutien Émotionnel',
    inspireAnotherCourt: 'Inspirer avec une Autre Pensée',
    urgentHelpBannerTitle: 'Besoin d\'une Aide Émotionnelle ou de Sécurité Urgente ?',
    urgentHelpBannerSubtitle: 'Contactez directement votre travailleur social. Votre sécurité et votre dignité sont notre priorité absolue.',
    sendSosBtn: 'Lancer l\'Alerte SOS',
    directWorkerChatTitle: 'Chat Direct avec le Travailleur',
    directWorkerChatDesc: 'Consultation confidentielle individuelle avec votre conseiller psychosocial.',
    dailyPromptCardTitle: 'Question Quotidienne de Promotion',
    dailyPromptCardDesc: 'Réfléchissez à la question du jour préparée pour votre promotion.',
    journalCardTitle: 'Journal Personnel',
    journalCardDesc: 'Gardez vos récits quotidiens, pensées et souvenirs en toute sécurité.',
    moodTrackerCardTitle: 'Humeur & Tendances 30 Jours',
    moodTrackerCardDesc: 'Visualisez l\'évolution de vos sentiments au cours des jours grâce aux graphiques D3.',
    assignmentsCardTitle: 'Devoirs & Évaluations',
    assignmentsCardDesc: 'Évaluations en ligne préparées par votre travailleur social.',
    championsCardTitle: 'Réseau des Champions Mentaux',
    championsCardDesc: 'Pairs ambassadeurs soutenant la santé mentale et le réconfort communautaire.',
    kudosTitle: 'Mur de Bienveillance et d\'Encouragement',
    colorsHubTitle: 'Découvrez les Couleurs ASYV et Outils d\'Ancrage',
    colorsHubDesc: 'Découvrez la signification du vert acacia, de la terre cuite et pratiquez la respiration guidée.',
    openColorsHubBtn: 'Ouvrir le Hub Bien-être & Couleurs',
    tipsTeaserTitle: 'Conseils de Vie, d\'Étude et Gestion du Stress',
    tipsTeaserDesc: 'Outils sélectionnés pour la mémorisation active, la respiration 4-7-8 et l\'équilibre.',
    exploreTipsBtn: 'Explorer les Conseils',
    villageSupportDesk: 'Bureau de Soutien & Urgence du Village',
    emergencyHotlineLabel: 'Ligne d\'Urgence 24/7',
    whatsappCrisisLabel: 'Ligne d\'Assistance WhatsApp',
    healthClinicLabel: 'Centre de Santé & Clinique',

    workerWelcomeTitle: 'Bienvenue',
    workerWelcomeSubtitle: 'Vous dirigez les soins psychosociaux, le suivi académique et les cercles de soutien. Suivez les questionnaires soumis et relancez les élèves.',
    monitorWorkerBtn: 'Suivi de Mon Travailleur',
    myProfileBtn: 'Mon Profil & Numéros',
    hotlineNumbersBtn: 'Numéros d\'Urgence du Village',
    todoPlannerBtn: 'Planificateur de Tâches',
    activeSosWarning: 'Alerte d\'Urgence SOS Élève en Attente !',
    studentsRosterTitle: 'Élèves Inscrits de la Promotion',
    totalTasksTitle: 'Total des Devoirs Assignés',
    completionPercentageTitle: 'Taux d\'Achèvement par Élève',
    unansweredStudentsTitle: 'Élèves avec Devoirs en Attente',
    completedStudentsTitle: 'Élèves Ayant Terminé le Travail',
    sendReminderAlert: 'Envoyer un Rappel Bienveillant',
    inspectAnswers: 'Consulter les Réponses Soumises',

    todoPageTitle: 'Planificateur Quotidien du Travailleur Social',
    todoPageSubtitle: 'Suivez les visites en dortoir, les cercles de consultation et les impératifs administratifs. Les tâches avec échéance imminente affichent des alertes prioritaires jusqu\'à achèvement.',
    urgentActionRequired: 'ACTION URGENTE REQUISE',
    taskApproachingNotice: 'Cette alerte reste visible devant votre compte jusqu\'à ce que vous marquiez explicitement la tâche comme Terminée.',
    addNewTask: 'Ajouter une Action & Définir l\'Échéance',
    taskDescriptionLabel: 'Description de la Tâche',
    deadlineLabel: 'Échéance / Date Cible',
    priorityLabel: 'Niveau de Priorité',
    highPriority: '🔥 Priorité Haute (Pop-up)',
    mediumPriority: '⚡ Priorité Moyenne',
    lowPriority: '🌱 Priorité Basse',
    activePendingTasks: 'Tâches Actives en Attente',
    completedArchive: 'Archive des Tâches Terminées',
    allCaughtUp: 'Tout est à jour ! Aucune tâche en attente aujourd\'hui.',
    dueToday: 'Pour Aujourd\'hui',
    overdue: 'En Retard',

    contactsPageTitle: 'Lignes d\'Urgence & Contacts du Village',
    contactsPageSubtitle: 'Accès direct 24/7 aux services d\'urgence du Village de Jeunesse Agahozo-Shalom, aux conseillers et au personnel médical. Tous les appels et échanges sont strictement confidentiels.',
    crisisHotlineCardTitle: 'Ligne d\'Urgence & Crise 24/7',
    crisisHotlineCardDesc: 'Pour les détresses émotionnelles immédiates, les traumatismes ou les besoins de sécurité urgents.',
    whatsappDeskCardTitle: 'Bureau Psychosocial WhatsApp',
    whatsappDeskCardDesc: 'Échangez en toute confidentialité avec notre équipe psychosociale.',
    medicalClinicCardTitle: 'Clinique Médicale du Village',
    officeLocationCardTitle: 'Emplacement du Bureau',
    workingHoursCardTitle: 'Heures d\'Ouverture & Astreinte',
    villageEmailCardTitle: 'E-mail de Soutien du Village',
    villageMentorsTitle: 'Personnel de Soutien & Mentors du Village',
    villageMentorsSubtitle: 'Personnel clé mis à jour par l\'administration pour les besoins de santé mentale et d\'orientation.',
    updateContactsBtn: 'Mettre à Jour les Numéros',
    saveAllNumbersBtn: 'Enregistrer Tous les Numéros',

    moodTrackerTitle: 'Analyse de l\'Humeur & du Bien-être Élève',
    moodTrackerSubtitle: 'Visualisez vos schémas émotionnels sur les 30 derniers jours. L\'analyse D3 aide vous et votre travailleur social à célébrer les jours calmes et intervenir tôt en cas de stress.',
    howAreYouFeeling: 'Comment vous sentez-vous en ce moment ?',
    recordMoodBtn: 'Enregistrer l\'Humeur & Mettre à Jour D3',
    intensityLevel: 'Niveau d\'Intensité',
    personalNoteOptional: 'Note personnelle ou déclencheur (Contexte confidentiel)',
    thirtyDayTrendTitle: 'Courbe de Tendance sur 30 Jours (Graphique D3)',
    thirtyDayWellbeingScore: 'Bien-être sur 30 Jours',
    dominantEmotion: 'Émotion Dominante',
    checkInStreak: 'Série de Connexion',
    historicalLogsCount: 'Entrées Historiques',
    recordedMoodHistory: 'Historique des Humeurs Enregistrées',
    noMoodLogsYet: 'Aucune humeur enregistrée. Enregistrez votre premier état d\'esprit ci-dessus !',

    moodPeaceful: 'Paisible',
    moodGrateful: 'Reconnaissant',
    moodEnergetic: 'Énergique',
    moodNeutral: 'Neutre',
    moodAnxious: 'Anxieux',
    moodStressed: 'Stressé',
    moodLow: 'Fatigué',
    moodOverwhelmed: 'Submergé',

    journalTitle: 'Journal Intime & Récits Personnels',
    journalSubtitle: 'Un sanctuaire pour écrire vos expériences, souvenirs, rêves et parcours de guérison à l\'ASYV.',
    writeNewStory: 'Écrire un Nouveau Récit ou une Réflexion',
    storyTitleLabel: 'Titre de votre réflexion',
    storyContentLabel: 'Qu\'avez-vous sur le cœur aujourd\'hui ?',
    selectStoryEmotion: 'Associer une réaction émotionnelle',
    saveStoryBtn: 'Enregistrer dans Mon Journal',
    mySavedStories: 'Mes Récits Enregistrés',
    noStoriesYet: 'Votre journal est vide. Écrivez votre premier récit ci-dessus !',

    dailyQuestionTitle: 'Réflexion Quotidienne du Village',
    dailyQuestionSubtitle: 'Répondez à la question posée par votre travailleur social pour la réflexion du jour.',
    yourReflectionLabel: 'Votre Réponse Réfléchie',
    submitReflectionBtn: 'Soumettre la Réponse au Travailleur Social',
    alreadyAnswered: 'Vous avez déjà soumis votre réponse pour aujourd\'hui.',

    emergencyModalTitle: 'Alerte de Crise & Urgence SOS',
    emergencyModalSubtitle: 'En cas de souffrance émotionnelle intense, de danger ou de traumatisme, alertez immédiatement votre travailleur.',
    criticalNotice: 'Le travailleur social de votre promotion et l\'équipe d\'urgence seront dépêchés immédiatement.',
    describeSituationPlaceholder: 'Décrivez brièvement la situation pour que nous puissions envoyer l\'aide adéquate...',
    confirmSendSosBtn: 'DÉPÊCHER L\'URGENCE SOS MAINTENANT',
    alertDispatched: 'Alerte d\'urgence envoyée. L\'aide est en route. Restez en sécurité et calme.',

    goodbyeTitle: 'Merci de Prendre Soin de Vous',
    goodbyeSubtitle: 'Mind Bridge et toute la famille ASYV restent toujours à votre écoute quand vous en avez besoin.',
    returnToLoginBtn: 'Retour à la Connexion',
    helpBannerGreeting: 'Bienvenue sur Mind Bridge - Soins du Village',
    helpBannerQuestion: 'Comment pouvons-nous soutenir votre esprit et vos études aujourd\'hui ?'
  }
};
