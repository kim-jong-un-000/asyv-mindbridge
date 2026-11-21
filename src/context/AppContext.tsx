import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  subscribeActiveLandingImage,
  subscribeCustomization,
  subscribeLandingMediaStatus,
  saveCustomization,
  resetLandingImage,
  type ActiveLandingImage,
  type LandingMediaStatus
} from '../lib/landingMedia';
import {
  User,
  Grade,
  UserRole,
  ChatMessage,
  EmergencyAlert,
  Assignment,
  AssignmentQuestion,
  AssignmentSubmission,
  JournalEntry,
  MoodLog,
  DailyQuestion,
  DailyQuestionAnswer,
  TodoTask,
  TimetableSession,
  WellnessLesson,
  ChampionDiscussionPost,
  VillageContactInfo,
  Announcement,
  WellnessTip,
  AuditLogEntry,
  AuditActionType,
  AppLanguage,
  AppTheme,
  AppCustomization,
  KudosPost,
  AsyvColorKey
} from '../types';
import {
  PERMANENT_SOCIAL_WORKERS,
  INITIAL_DEVELOPER,
  INITIAL_STUDENTS,
  INITIAL_DAILY_QUESTIONS,
  INITIAL_ASSIGNMENTS,
  INITIAL_TODOS,
  INITIAL_TIMETABLES,
  INITIAL_LESSONS,
  INITIAL_CHATS,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_MOOD_LOGS,
  DEFAULT_VILLAGE_CONTACT_INFO,
  DEFAULT_APP_CUSTOMIZATION,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_TIPS,
  INITIAL_AUDIT_LOGS,
  INITIAL_KUDOS_POSTS,
  INITIAL_DAILY_ANSWERS,
  INITIAL_DISCUSSIONS
} from '../data/initialData';
import {
  fetchCentralState,
  mutateCentralState,
  initWebSocketSync,
  NetworkSyncStatus,
  RemoteSyncMessage
} from '../utils/apiSync';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  activePage: string;
  pageHistory: string[];
  showHelpBanner: boolean;
  showGoodbyeModal: boolean;
  goodbyeMessage: string;
  rememberedLogin: { email: string; role: UserRole } | null;
  unreadCount: number;
  activeSosAlerts: EmergencyAlert[];
  contactInfo: VillageContactInfo;
  announcements: Announcement[];
  
  // Real-time network synchronization
  networkSyncStatus: NetworkSyncStatus;
  refreshFromCentralDb: () => Promise<void>;

  // Navigation
  setActivePage: (page: string) => void;
  goBack: () => void;
  goToHome: () => void;
  dismissHelpBanner: () => void;
  closeGoodbyeModal: () => void;

  // Theme & Language
  theme: AppTheme;
  toggleTheme: () => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;

  // Audit Logs
  auditLogs: AuditLogEntry[];
  addAuditLog: (action: AuditActionType, details: string, severity?: AuditLogEntry['severity'], userOverride?: Partial<User>) => void;
  clearAuditLogs: () => void;

  // Social Worker Profile Management
  updateSocialWorkerProfile: (data: { name: string; phone?: string; whatsappNumber?: string; officeLocation?: string; bio?: string }) => void;

  // Contact Info & Admin Controls
  updateContactInfo: (info: Partial<VillageContactInfo>) => void;
  appCustomization: AppCustomization;
  updateAppCustomization: (custom: Partial<AppCustomization>) => void;
  resetAppCustomization: () => void;
  landingImage: ActiveLandingImage | null;
  landingMediaStatus: LandingMediaStatus;
  deleteAllNonAdminUsers: () => void;
  addAnnouncement: (title: string, content: string, category: Announcement['category'], targetGrades: Grade[] | 'all') => void;
  deleteAnnouncement: (id: string) => void;
  toggleAnnouncementActive: (id: string) => void;
  createSocialWorkerByAdmin: (data: { name: string; email: string; grade: Grade; password: string; avatar?: string }) => { success: boolean; error?: string };
  assignSocialWorkerToGrade: (workerId: string, grade: Grade) => void;
  createStudentByAdmin: (data: { name: string; familyName: string; email: string; grade: Grade; schoolClass: string; password?: string }) => { success: boolean; error?: string };
  createStudentBySocialWorker: (data: { name: string; familyName: string; email: string; grade: Grade; schoolClass: string; password?: string }) => { success: boolean; error?: string };
  exportDatabaseJson: () => string;
  importDatabaseJson: (jsonStr: string) => { success: boolean; error?: string };
  resetToCleanState: () => void;
  clearSampleDataToCleanState: () => void;
  restoreSampleData: () => void;

  // Real Data Tips Management
  wellnessTips: WellnessTip[];
  addWellnessTip: (tip: Omit<WellnessTip, 'id' | 'createdAt'>) => void;
  updateWellnessTip: (id: string, updates: Partial<WellnessTip>) => void;
  deleteWellnessTip: (id: string) => void;

  // Admin Impersonation / View-As Mode
  impersonateUser: (user: User) => void;
  stopImpersonation: () => void;
  isImpersonating: boolean;
  realAdminUser: User | null;

  // Auth
  login: (email: string, password?: string, devCode?: string, role?: UserRole) => { success: boolean; error?: string };
  registerStudent: (data: {
    name: string;
    familyName: string;
    email: string;
    grade: Grade;
    schoolClass: string;
    password: string;
    avatar?: string;
  }) => { success: boolean; error?: string };
  registerSocialWorker: (data: {
    name: string;
    email: string;
    grade: Grade;
    password: string;
    avatar?: string;
  }) => { success: boolean; error?: string };
  logout: () => void;
  rememberUserCredentials: (email: string, role: UserRole, remember: boolean) => void;
  resetUserPassword: (userId: string, newPassword: string) => { success: boolean; error?: string };

  // User queries & updates
  getSocialWorkerForGrade: (grade: Grade) => User | undefined;
  getStudentsByGrade: (grade: Grade) => User[];
  getMentalChampions: () => User[];
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;

  // Messaging & Emergency
  messages: ChatMessage[];
  sendMessage: (receiverId: string, content: string) => void;
  markMessagesRead: (partnerId: string) => void;
  emergencyAlerts: EmergencyAlert[];
  sendEmergencyAlert: (message: string, urgency: 'high' | 'critical') => void;
  acknowledgeEmergency: (alertId: string, responseNote?: string) => void;

  // Assignments & Form Questions
  assignments: Assignment[];
  createAssignment: (data: {
    title: string;
    instructions: string;
    grade: Grade;
    dueDate: string;
    questions: AssignmentQuestion[];
  }) => void;
  submitAssignment: (assignmentId: string, answers: { questionId: string; answerText?: string; selectedOption?: number }[]) => void;

  // Daily Questions
  dailyQuestions: DailyQuestion[];
  dailyAnswers: DailyQuestionAnswer[];
  setDailyQuestion: (grade: Grade, question: string, contextNote: string) => void;
  answerDailyQuestion: (dailyQuestionId: string, answerText: string) => void;

  // Journal
  journalEntries: JournalEntry[];
  addJournalEntry: (title: string, content: string, moodReaction: string) => void;
  deleteJournalEntry: (id: string) => void;

  // Mood Tracker
  moodLogs: MoodLog[];
  logMood: (mood: MoodLog['mood'], moodEmoji: string, intensity: number, note: string) => void;

  // To-Do list
  todos: TodoTask[];
  addTodo: (title: string, priority: 'low' | 'medium' | 'high', dueDate?: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;

  // Alert Management (Stop, Snooze, and Return on Approaching Deadline)
  snoozedAlerts: Record<string, number>;
  snoozeAlert: (taskId: string, durationMinutes?: number) => void;
  stopAlert: (taskId: string) => void;
  unsnoozeAlert: (taskId: string) => void;
  isAlertActive: (task: TodoTask) => boolean;

  // Mental Champion Management
  applyForMentalChampion: (idea?: string) => void;
  approveMentalChampion: (studentId: string) => void;
  rejectMentalChampion: (studentId: string) => void;
  
  // Timetables & Wellness Lessons
  timetables: TimetableSession[];
  createTimetableSession: (session: Omit<TimetableSession, 'id' | 'createdAt' | 'createdByWorkerId'>) => void;
  wellnessLessons: WellnessLesson[];
  createWellnessLesson: (lesson: Omit<WellnessLesson, 'id' | 'createdAt' | 'workerId' | 'workerName'>) => void;

  // Champion discussion
  discussionPosts: ChampionDiscussionPost[];
  addDiscussionPost: (content: string) => void;

  // Peer Encouragement & Kudos Board
  kudosPosts: KudosPost[];
  addKudosPost: (post: Omit<KudosPost, 'id' | 'createdAt' | 'likesCount' | 'likedBy'>) => void;
  likeKudosPost: (kudosId: string) => void;
  deleteKudosPost: (kudosId: string) => void;

  // ASYV Colors & Theme
  setAsyvPalette: (paletteKey: AsyvColorKey) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'mindbridge_users_v2',
  CURRENT_USER: 'mindbridge_current_user_v2',
  REMEMBERED: 'mindbridge_remembered_v2',
  MESSAGES: 'mindbridge_messages_v2',
  EMERGENCIES: 'mindbridge_emergencies_v2',
  ASSIGNMENTS: 'mindbridge_assignments_v2',
  DAILY_QUESTIONS: 'mindbridge_daily_questions_v2',
  DAILY_ANSWERS: 'mindbridge_daily_answers_v2',
  JOURNAL: 'mindbridge_journal_v2',
  MOODS: 'mindbridge_moods_v2',
  TODOS: 'mindbridge_todos_v2',
  TIMETABLES: 'mindbridge_timetables_v2',
  LESSONS: 'mindbridge_lessons_v2',
  DISCUSSIONS: 'mindbridge_discussions_v2',
  CONTACT_INFO: 'mindbridge_contact_info_v3',
  ANNOUNCEMENTS: 'mindbridge_announcements_v3',
  TIPS: 'mindbridge_tips_v3',
  AUDIT_LOGS: 'mindbridge_audit_logs_v1',
  LANGUAGE: 'mindbridge_language_v1',
  THEME: 'mindbridge_theme_v1',
  CUSTOMIZATION: 'mindbridge_customization_v1',
  KUDOS: 'mindbridge_kudos_v1',
  SNOOZED_ALERTS: 'mindbridge_snoozed_alerts_v2'
};

function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Storage save error for ${key}:`, err);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Network real-time sync status
  const [networkSyncStatus, setNetworkSyncStatus] = useState<NetworkSyncStatus>('syncing');

  // Light Mode and Dark Mode support
  const [theme, setThemeState] = useState<AppTheme>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.THEME);
      if (stored === 'dark' || stored === 'light') return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const toggleTheme = () => {
    setThemeState(prev => {
      const nextTheme = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(STORAGE_KEYS.THEME, nextTheme);
      } catch {}
      return nextTheme;
    });
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Language state
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANGUAGE) as AppLanguage) || 'en';
  });

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  };

  // Base state initialized from cache or defaults
  const [users, setUsers] = useState<User[]>(() => {
    const initialUsers: User[] = [
      INITIAL_DEVELOPER,
      ...PERMANENT_SOCIAL_WORKERS,
      ...INITIAL_STUDENTS
    ];
    const stored = getFromStorage<User[]>(STORAGE_KEYS.USERS, initialUsers);
    if (!stored || stored.length === 0) return initialUsers;
    // Ensure Super Admin is always present
    if (!stored.some(u => u.id === INITIAL_DEVELOPER.id || u.email === INITIAL_DEVELOPER.email)) {
      stored.unshift(INITIAL_DEVELOPER);
    }
    return stored;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  });

  const [activePage, setActivePageRaw] = useState<string>('dashboard');
  const [pageHistory, setPageHistory] = useState<string[]>(['dashboard']);
  const [showHelpBanner, setShowHelpBanner] = useState<boolean>(false);
  const [showGoodbyeModal, setShowGoodbyeModal] = useState<boolean>(false);
  const [goodbyeMessage, setGoodbyeMessage] = useState<string>(
    'Take care of yourself! Mind Bridge and your ASYV support team are always here for you.'
  );

  const [rememberedLogin, setRememberedLogin] = useState<{ email: string; role: UserRole } | null>(() => {
    return getFromStorage(STORAGE_KEYS.REMEMBERED, null);
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const raw = getFromStorage<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    const seenIds = new Set<string>();
    return raw.filter(l => {
      if (!l?.id || seenIds.has(l.id)) return false;
      seenIds.add(l.id);
      return true;
    });
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    getFromStorage<ChatMessage[]>(STORAGE_KEYS.MESSAGES, INITIAL_CHATS)
  );

  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>(() =>
    getFromStorage<EmergencyAlert[]>(STORAGE_KEYS.EMERGENCIES, [])
  );

  const [assignments, setAssignments] = useState<Assignment[]>(() =>
    getFromStorage<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS)
  );

  const [dailyQuestions, setDailyQuestions] = useState<DailyQuestion[]>(() =>
    getFromStorage<DailyQuestion[]>(STORAGE_KEYS.DAILY_QUESTIONS, INITIAL_DAILY_QUESTIONS)
  );

  const [dailyAnswers, setDailyAnswers] = useState<DailyQuestionAnswer[]>(() =>
    getFromStorage<DailyQuestionAnswer[]>(STORAGE_KEYS.DAILY_ANSWERS, INITIAL_DAILY_ANSWERS)
  );

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() =>
    getFromStorage<JournalEntry[]>(STORAGE_KEYS.JOURNAL, INITIAL_JOURNAL_ENTRIES)
  );

  const [moodLogs, setMoodLogs] = useState<MoodLog[]>(() =>
    getFromStorage<MoodLog[]>(STORAGE_KEYS.MOODS, INITIAL_MOOD_LOGS)
  );

  const [todos, setTodos] = useState<TodoTask[]>(() =>
    getFromStorage<TodoTask[]>(STORAGE_KEYS.TODOS, INITIAL_TODOS)
  );

  const [snoozedAlerts, setSnoozedAlerts] = useState<Record<string, number>>(() =>
    getFromStorage<Record<string, number>>(STORAGE_KEYS.SNOOZED_ALERTS, {})
  );

  const [timetables, setTimetables] = useState<TimetableSession[]>(() =>
    getFromStorage<TimetableSession[]>(STORAGE_KEYS.TIMETABLES, INITIAL_TIMETABLES)
  );

  const [wellnessLessons, setWellnessLessons] = useState<WellnessLesson[]>(() =>
    getFromStorage<WellnessLesson[]>(STORAGE_KEYS.LESSONS, INITIAL_LESSONS)
  );

  const [discussionPosts, setDiscussionPosts] = useState<ChampionDiscussionPost[]>(() =>
    getFromStorage<ChampionDiscussionPost[]>(STORAGE_KEYS.DISCUSSIONS, INITIAL_DISCUSSIONS)
  );

  const [contactInfo, setContactInfo] = useState<VillageContactInfo>(() =>
    getFromStorage<VillageContactInfo>(STORAGE_KEYS.CONTACT_INFO, DEFAULT_VILLAGE_CONTACT_INFO)
  );

  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    getFromStorage<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS)
  );

  const [wellnessTips, setWellnessTips] = useState<WellnessTip[]>(() =>
    getFromStorage<WellnessTip[]>(STORAGE_KEYS.TIPS, INITIAL_TIPS)
  );

  const [kudosPosts, setKudosPosts] = useState<KudosPost[]>(() =>
    getFromStorage<KudosPost[]>(STORAGE_KEYS.KUDOS, INITIAL_KUDOS_POSTS)
  );

  const [appCustomization, setAppCustomization] = useState<AppCustomization>(() =>
    getFromStorage<AppCustomization>(STORAGE_KEYS.CUSTOMIZATION, DEFAULT_APP_CUSTOMIZATION)
  );

  const [realAdminUser, setRealAdminUser] = useState<User | null>(null);

  // Sync to local storage for instant offline resilience
  useEffect(() => saveToStorage(STORAGE_KEYS.USERS, users), [users]);
  useEffect(() => saveToStorage(STORAGE_KEYS.CURRENT_USER, currentUser), [currentUser]);
  useEffect(() => saveToStorage(STORAGE_KEYS.MESSAGES, messages), [messages]);
  useEffect(() => saveToStorage(STORAGE_KEYS.EMERGENCIES, emergencyAlerts), [emergencyAlerts]);
  useEffect(() => saveToStorage(STORAGE_KEYS.ASSIGNMENTS, assignments), [assignments]);
  useEffect(() => saveToStorage(STORAGE_KEYS.DAILY_QUESTIONS, dailyQuestions), [dailyQuestions]);
  useEffect(() => saveToStorage(STORAGE_KEYS.DAILY_ANSWERS, dailyAnswers), [dailyAnswers]);
  useEffect(() => saveToStorage(STORAGE_KEYS.JOURNAL, journalEntries), [journalEntries]);
  useEffect(() => saveToStorage(STORAGE_KEYS.MOODS, moodLogs), [moodLogs]);
  useEffect(() => saveToStorage(STORAGE_KEYS.TODOS, todos), [todos]);
  useEffect(() => saveToStorage(STORAGE_KEYS.TIMETABLES, timetables), [timetables]);
  useEffect(() => saveToStorage(STORAGE_KEYS.LESSONS, wellnessLessons), [wellnessLessons]);
  useEffect(() => saveToStorage(STORAGE_KEYS.DISCUSSIONS, discussionPosts), [discussionPosts]);
  useEffect(() => saveToStorage(STORAGE_KEYS.CONTACT_INFO, contactInfo), [contactInfo]);
  useEffect(() => saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, announcements), [announcements]);
  useEffect(() => saveToStorage(STORAGE_KEYS.TIPS, wellnessTips), [wellnessTips]);
  useEffect(() => saveToStorage(STORAGE_KEYS.KUDOS, kudosPosts), [kudosPosts]);
  useEffect(() => saveToStorage(STORAGE_KEYS.AUDIT_LOGS, auditLogs), [auditLogs]);
  useEffect(() => saveToStorage(STORAGE_KEYS.CUSTOMIZATION, appCustomization), [appCustomization]);

  // Firestore is the permanent, globally synchronized source of truth for admin customization & landing media
  const firestoreCustomizationRef = useRef<Partial<AppCustomization> | null>(null);
  const [landingImage, setLandingImage] = useState<ActiveLandingImage | null>(null);
  const [landingMediaStatus, setLandingMediaStatus] = useState<LandingMediaStatus>('connecting');
  useEffect(() => {
    const unsubs = [
      subscribeLandingMediaStatus(setLandingMediaStatus),
      subscribeActiveLandingImage(setLandingImage),
      subscribeCustomization(custom => {
        firestoreCustomizationRef.current = custom;
        setAppCustomization(prev => ({ ...prev, ...custom }));
      })
    ];
    return () => unsubs.forEach(unsub => unsub());
  }, []);
  useEffect(() => saveToStorage(STORAGE_KEYS.SNOOZED_ALERTS, snoozedAlerts), [snoozedAlerts]);

  // Merge full central database state received from server
  const applyCentralDatabase = useCallback((data: any) => {
    if (!data) return;
    if (Array.isArray(data.users) && data.users.length > 0) {
      setUsers(prev => {
        const merged = [...data.users];
        for (const localUser of prev) {
          if (!merged.some(u => u.id === localUser.id || (u.email && localUser.email && u.email.toLowerCase() === localUser.email.toLowerCase()))) {
            merged.push(localUser);
          }
        }
        return merged;
      });
    }
    if (data.contactInfo) setContactInfo(data.contactInfo);
    if (data.appCustomization) {
      setAppCustomization(prev => ({ ...prev, ...data.appCustomization, ...(firestoreCustomizationRef.current || {}) }));
    }
    if (Array.isArray(data.assignments)) setAssignments(data.assignments);
    if (Array.isArray(data.dailyQuestions)) setDailyQuestions(data.dailyQuestions);
    if (Array.isArray(data.dailyAnswers)) setDailyAnswers(data.dailyAnswers);
    if (Array.isArray(data.messages)) setMessages(data.messages);
    if (Array.isArray(data.emergencyAlerts)) setEmergencyAlerts(data.emergencyAlerts);
    if (Array.isArray(data.todos)) setTodos(data.todos);
    if (data.stoppedAlerts && typeof data.stoppedAlerts === 'object') {
      setSnoozedAlerts(prev => {
        const next = { ...prev };
        for (const [taskId, isStopped] of Object.entries(data.stoppedAlerts)) {
          if (isStopped) next[taskId] = -1;
        }
        return next;
      });
    }
    if (Array.isArray(data.timetables)) setTimetables(data.timetables);
    if (Array.isArray(data.wellnessLessons)) setWellnessLessons(data.wellnessLessons);
    if (Array.isArray(data.discussionPosts)) setDiscussionPosts(data.discussionPosts);
    if (Array.isArray(data.announcements)) setAnnouncements(data.announcements);
    if (Array.isArray(data.auditLogs)) {
      const seenIds = new Set<string>();
      const uniqueLogs = data.auditLogs.filter((l: any) => {
        if (!l?.id || seenIds.has(l.id)) return false;
        seenIds.add(l.id);
        return true;
      });
      setAuditLogs(uniqueLogs);
    }
    if (Array.isArray(data.kudosPosts)) setKudosPosts(data.kudosPosts);
    if (Array.isArray(data.journalEntries)) setJournalEntries(data.journalEntries);
    if (Array.isArray(data.moodLogs)) setMoodLogs(data.moodLogs);

    // Sync current user details if changed on server (e.g. phone number updated)
    setCurrentUser(curr => {
      if (!curr) return null;
      const found = (data.users || []).find((u: User) => u.id === curr.id);
      return found ? { ...curr, ...found } : curr;
    });
  }, []);

  // Handle incoming real-time WebSocket events from other users & devices
  const handleRemoteMessage = useCallback((msg: RemoteSyncMessage) => {
    if (msg.type === 'INIT_STATE') {
      applyCentralDatabase(msg.payload);
      setNetworkSyncStatus('connected');
    } else if (msg.type === 'REMOTE_ACTION' && msg.action) {
      const { action, payload } = msg;
      switch (action) {
        case 'UPDATE_CONTACT_INFO':
          setContactInfo(prev => ({ ...prev, ...payload }));
          break;
        case 'UPDATE_APP_CUSTOMIZATION':
          setAppCustomization(prev => ({ ...prev, ...payload }));
          break;
        case 'UPSERT_USER':
          setUsers(prev => {
            const idx = prev.findIndex(u => u.id === payload.id);
            return idx !== -1 ? prev.map(u => (u.id === payload.id ? { ...u, ...payload } : u)) : [...prev, payload];
          });
          break;
        case 'SAVE_PROFILE': {
          const { userId, ...updates } = payload;
          setUsers(prev => prev.map(u => (u.id === userId ? { ...u, ...updates } : u)));
          setCurrentUser(curr => (curr && curr.id === userId ? { ...curr, ...updates } : curr));
          break;
        }
        case 'DELETE_USER':
          setUsers(prev => prev.filter(u => u.id !== payload.userId));
          break;
        case 'DELETE_ALL_NON_ADMIN_USERS':
          setUsers(prev => prev.filter(u => u.role === 'developer'));
          break;
        case 'SEND_MESSAGE':
          setMessages(prev => (prev.some(m => m.id === payload.id) ? prev : [...prev, payload]));
          break;
        case 'MARK_MESSAGES_READ':
          setMessages(prev =>
            prev.map(m =>
              m.receiverId === payload.currentUserId && m.senderId === payload.partnerId
                ? { ...m, isRead: true }
                : m
            )
          );
          break;
        case 'SEND_EMERGENCY_ALERT':
          setEmergencyAlerts(prev => (prev.some(a => a.id === payload.id) ? prev : [payload, ...prev]));
          break;
        case 'ACKNOWLEDGE_EMERGENCY':
          setEmergencyAlerts(prev =>
            prev.map(a =>
              a.id === payload.alertId
                ? { ...a, status: 'acknowledged', workerResponse: payload.responseNote || a.workerResponse }
                : a
            )
          );
          break;
        case 'CREATE_ASSIGNMENT':
          setAssignments(prev => (prev.some(a => a.id === payload.id) ? prev : [payload, ...prev]));
          break;
        case 'SUBMIT_ASSIGNMENT':
          setAssignments(prev =>
            prev.map(a => {
              if (a.id === payload.assignmentId) {
                const filtered = a.submissions.filter(s => s.studentId !== payload.submission.studentId);
                return { ...a, submissions: [...filtered, payload.submission] };
              }
              return a;
            })
          );
          break;
        case 'SET_DAILY_QUESTION':
          setDailyQuestions(prev => {
            const idx = prev.findIndex(q => q.grade === payload.grade);
            return idx !== -1 ? prev.map((q, i) => (i === idx ? payload : q)) : [payload, ...prev];
          });
          break;
        case 'ANSWER_DAILY_QUESTION':
          setDailyAnswers(prev => (prev.some(a => a.id === payload.id) ? prev : [payload, ...prev]));
          break;
        case 'ADD_TODO':
          setTodos(prev => (prev.some(t => t.id === payload.id) ? prev : [payload, ...prev]));
          break;
        case 'TOGGLE_TODO':
          setTodos(prev => prev.map(t => (t.id === payload.todoId ? { ...t, isCompleted: !t.isCompleted } : t)));
          break;
        case 'STOP_ALERT':
          setSnoozedAlerts(prev => ({ ...prev, [payload.taskId]: -1 }));
          break;
        case 'UNSNOOZE_ALERT':
          setSnoozedAlerts(prev => {
            const next = { ...prev };
            delete next[payload.taskId];
            return next;
          });
          break;
        case 'DELETE_TODO':
          setTodos(prev => prev.filter(t => t.id !== payload.todoId));
          break;
        case 'ADD_ANNOUNCEMENT':
          setAnnouncements(prev => (prev.some(a => a.id === payload.id) ? prev : [payload, ...prev]));
          break;
        case 'DELETE_ANNOUNCEMENT':
          setAnnouncements(prev => prev.filter(a => a.id !== payload.announcementId));
          break;
        case 'ADD_WELLNESS_TIP':
          setWellnessTips(prev => (prev.some(t => t.id === payload.id) ? prev : [payload, ...prev]));
          break;
        case 'UPDATE_WELLNESS_TIP':
          setWellnessTips(prev => prev.map(t => (t.id === payload.id ? { ...t, ...payload.updates } : t)));
          break;
        case 'DELETE_WELLNESS_TIP':
          setWellnessTips(prev => prev.filter(t => t.id !== payload.id));
          break;
        case 'ADD_KUDOS':
          setKudosPosts(prev => (prev.some(k => k.id === payload.id) ? prev : [payload, ...prev]));
          break;
        case 'LIKE_KUDOS':
          setKudosPosts(prev =>
            prev.map(k => {
              if (k.id === payload.kudosId) {
                const hasLiked = k.likedBy.includes(payload.userId);
                const likedBy = hasLiked ? k.likedBy.filter(id => id !== payload.userId) : [...k.likedBy, payload.userId];
                return { ...k, likedBy, likesCount: likedBy.length };
              }
              return k;
            })
          );
          break;
        case 'ADD_JOURNAL_ENTRY':
          setJournalEntries(prev => (prev.some(j => j.id === payload.id) ? prev : [payload, ...prev]));
          break;
        case 'DELETE_JOURNAL_ENTRY':
          setJournalEntries(prev => prev.filter(j => j.id !== payload.id));
          break;
        case 'ADD_MOOD_LOG':
          setMoodLogs(prev => (prev.some(m => m.id === payload.id) ? prev : [payload, ...prev]));
          break;
        case 'ADD_AUDIT_LOG':
          setAuditLogs(prev => (prev.some(a => a.id === payload.id) ? prev : [payload, ...prev]));
          break;
        case 'CREATE_TIMETABLE_SESSION':
          setTimetables(prev => (prev.some(s => s.id === payload.id) ? prev : [payload, ...prev]));
          break;
        case 'CREATE_WELLNESS_LESSON':
          setWellnessLessons(prev => (prev.some(l => l.id === payload.id) ? prev : [payload, ...prev]));
          break;
        case 'ADD_DISCUSSION_POST':
          setDiscussionPosts(prev => (prev.some(p => p.id === payload.id) ? prev : [payload, ...prev]));
          break;
        case 'RESET_DATABASE':
          refreshFromCentralDb();
          break;
        default:
          break;
      }
    }
  }, [applyCentralDatabase]);

  // Refresh from central DB helper
  const refreshFromCentralDb = useCallback(async () => {
    setNetworkSyncStatus('syncing');
    const state = await fetchCentralState();
    if (state) {
      applyCentralDatabase(state);
      setNetworkSyncStatus('connected');
    } else {
      setNetworkSyncStatus('offline');
    }
  }, [applyCentralDatabase]);

  // Bootstrapping: Fetch central DB on mount & listen to real-time WebSockets
  useEffect(() => {
    // 1. Initial REST fetch
    refreshFromCentralDb();

    // 2. Setup persistent WebSocket sync
    const cleanupWs = initWebSocketSync(handleRemoteMessage, setNetworkSyncStatus);

    return () => {
      cleanupWs();
    };
  }, [refreshFromCentralDb, handleRemoteMessage]);

  // Audit Log Helper
  const addAuditLog = (
    action: AuditActionType,
    details: string,
    severity: AuditLogEntry['severity'] = 'info',
    userOverride?: Partial<User>
  ) => {
    const actor = userOverride || currentUser;
    const newEntry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      userId: actor?.id || 'system',
      userName: actor?.name || 'System Operator',
      userRole: actor?.role || 'developer',
      grade: actor?.grade || 'Ingabe',
      action,
      details,
      severity,
      ipOrDevice: navigator.userAgent.slice(0, 30)
    };
    setAuditLogs(prev => {
      if (prev.some(a => a.id === newEntry.id)) return prev;
      return [newEntry, ...prev];
    });
    mutateCentralState('ADD_AUDIT_LOG', newEntry);
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
  };

  // Profile Management for Social Worker
  const updateSocialWorkerProfile = (data: {
    name: string;
    phone?: string;
    whatsappNumber?: string;
    officeLocation?: string;
    bio?: string;
  }) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      name: data.name.trim() || currentUser.name,
      phone: data.phone?.trim(),
      whatsappNumber: data.whatsappNumber?.trim(),
      officeLocation: data.officeLocation?.trim(),
      bio: data.bio?.trim()
    };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updated : u)));
    mutateCentralState('SAVE_PROFILE', { userId: currentUser.id, ...data });
    addAuditLog('PROFILE_UPDATED', `Grade leader profile updated: ${updated.name} (${currentUser.grade} Grade Leader), Phone: ${data.phone || 'N/A'}`, 'info', updated);
  };

  // Global App Customization
  const updateAppCustomization = (custom: Partial<AppCustomization>) => {
    setAppCustomization(prev => {
      const next = { ...prev, ...custom };
      mutateCentralState('UPDATE_APP_CUSTOMIZATION', next);
      firestoreCustomizationRef.current = next;
      saveCustomization(next).catch(err => console.warn('Firestore customization save failed:', err));
      addAuditLog('APP_CUSTOMIZED', `Admin updated global ASYV styling & customization`, 'info');
      return next;
    });
  };

  const resetAppCustomization = () => {
    setAppCustomization(DEFAULT_APP_CUSTOMIZATION);
    mutateCentralState('UPDATE_APP_CUSTOMIZATION', DEFAULT_APP_CUSTOMIZATION);
    firestoreCustomizationRef.current = DEFAULT_APP_CUSTOMIZATION;
    saveCustomization(DEFAULT_APP_CUSTOMIZATION).catch(err => console.warn('Firestore customization save failed:', err));
    resetLandingImage(currentUser?.email || 'admin').catch(err => console.warn('Welcome image reset failed:', err));
    addAuditLog('APP_CUSTOMIZED', 'Admin restored official portal styling presets', 'info');
  };

  const setAsyvPalette = (paletteKey: AsyvColorKey) => {
    updateAppCustomization({ activeAsyvPalette: paletteKey });
  };

  const deleteAllNonAdminUsers = () => {
    const adminOnly = users.filter(u => u.role === 'developer');
    const finalUsers = adminOnly.length > 0 ? adminOnly : [INITIAL_DEVELOPER];
    setUsers(finalUsers);
    setMessages([]);
    setEmergencyAlerts([]);
    setDailyAnswers([]);
    setJournalEntries([]);
    setMoodLogs([]);
    setTodos([]);
    mutateCentralState('DELETE_ALL_NON_ADMIN_USERS', {});
    addAuditLog('USERS_PURGED', 'Admin purged all student and staff accounts. Only Master Administrator account retained in system.', 'security');
  };

  // Page Navigation
  const setActivePage = (page: string) => {
    setActivePageRaw(page);
    setPageHistory(prev => [...prev, page]);
  };

  const goBack = () => {
    if (pageHistory.length > 1) {
      const nextHistory = [...pageHistory];
      nextHistory.pop();
      const prevPage = nextHistory[nextHistory.length - 1];
      setPageHistory(nextHistory);
      setActivePageRaw(prevPage);
    } else {
      setActivePageRaw('dashboard');
    }
  };

  const goToHome = () => {
    setActivePageRaw('dashboard');
    setPageHistory(['dashboard']);
  };

  const dismissHelpBanner = () => {
    setShowHelpBanner(false);
  };

  const closeGoodbyeModal = () => {
    setShowGoodbyeModal(false);
  };

  // Auth Operations
  const rememberUserCredentials = (_email: string, _role: UserRole, _remember: boolean) => {
    setRememberedLogin(null);
    localStorage.removeItem(STORAGE_KEYS.REMEMBERED);
  };

  const login = (email: string, password?: string, devCode?: string, role?: UserRole): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();

    // Master Administrator check
    if (
      (cleanEmail === 'admin@alva' || cleanEmail === 'admin@alva.org' || cleanEmail === 'dev@asyv.org' || devCode === 'king@asyv2028' || devCode === 'ASYV-DEV-2026-ROOT') &&
      (password === 'king@asyv2028' || devCode === 'king@asyv2028' || devCode === 'ASYV-DEV-2026-ROOT' || password === 'ASYV-DEV-2026-ROOT')
    ) {
      let dev = users.find(u => u.role === 'developer');
      if (!dev) {
        dev = INITIAL_DEVELOPER;
        setUsers(prev => [dev!, ...prev]);
        mutateCentralState('UPSERT_USER', dev);
      }
      setCurrentUser(dev);
      setActivePageRaw('dashboard');
      setPageHistory(['dashboard']);
      setShowHelpBanner(false);
      addAuditLog('LOGIN', 'Master Administrator authenticated via secure console', 'security', dev);
      return { success: true };
    }

    const found = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      addAuditLog('LOGIN', `Failed login attempt for unregistered email: ${cleanEmail}`, 'warning');
      const isRegOpen = (role === 'student' && appCustomization?.allowPublicStudentRegistration !== false) ||
                        (role === 'social_worker' && appCustomization?.allowPublicWorkerRegistration !== false);
      return {
        success: false,
        error: isRegOpen
          ? 'No account found with this email address. Please register.'
          : 'No account found with this email address. Self-registration is restricted. Please contact the Master Administrator or your assigned Grade Social Worker to receive your official login credentials.'
      };
    }

    if (password && found.password && found.password !== password) {
      addAuditLog('LOGIN', `Failed login attempt (invalid password) for user ${found.email}`, 'warning', found);
      return { success: false, error: 'Incorrect password. Please verify your credentials or ask System Admin to view/recover it.' };
    }

    if (role && found.role !== role && !(role === 'mental_champion' && found.isMentalChampion)) {
      return { success: false, error: `This account is registered as a ${found.role.replace('_', ' ')}. Please select the matching role tab.` };
    }

    setCurrentUser(found);
    setActivePageRaw('dashboard');
    setPageHistory(['dashboard']);

    if (found.role === 'student') {
      setShowHelpBanner(true);
    } else {
      setShowHelpBanner(false);
    }

    addAuditLog('LOGIN', `User ${found.name} (${found.role.replace('_', ' ')}) logged in successfully`, 'info', found);
    return { success: true };
  };

  const registerStudent = (data: {
    name: string;
    familyName: string;
    email: string;
    grade: Grade;
    schoolClass: string;
    password: string;
    avatar?: string;
  }): { success: boolean; error?: string } => {
    if (appCustomization?.allowPublicStudentRegistration === false) {
      return {
        success: false,
        error: 'Public self-registration is closed by the Village Administration. Student accounts are created and issued directly by the Master Administrator or your assigned Grade Social Worker.'
      };
    }

    const cleanEmail = data.email.trim().toLowerCase();
    if (users.some(u => u.email.trim().toLowerCase() === cleanEmail)) {
      return {
        success: false,
        error: 'This email is already in use and cannot be used more than once. Each email can only be registered once in ASYV Mind Bridge.'
      };
    }

    const newStudent: User = {
      id: `student-${Date.now()}`,
      name: data.name.trim(),
      familyName: data.familyName.trim(),
      email: cleanEmail,
      role: 'student',
      grade: data.grade,
      schoolClass: data.schoolClass.trim(),
      password: data.password || 'password123',
      avatar: data.avatar || '/asyv_emblem.svg',
      registeredAt: new Date().toISOString(),
      isMentalChampion: false,
      championStatus: 'none'
    };

    setUsers(prev => [...prev, newStudent]);
    setCurrentUser(newStudent);
    setActivePageRaw('dashboard');
    setPageHistory(['dashboard']);
    setShowHelpBanner(true);

    mutateCentralState('UPSERT_USER', newStudent);
    addAuditLog('STUDENT_REGISTERED', `Student registered: ${newStudent.name} ${newStudent.familyName} (${newStudent.grade} Grade · ${newStudent.schoolClass})`, 'info', newStudent);
    return { success: true };
  };

  const registerSocialWorker = (data: {
    name: string;
    email: string;
    grade: Grade;
    password: string;
    avatar?: string;
  }): { success: boolean; error?: string } => {
    if (appCustomization?.allowPublicWorkerRegistration === false) {
      return {
        success: false,
        error: 'Public self-registration is closed by the Village Administration. Staff accounts are provisioned exclusively by the Master Administrator.'
      };
    }

    const cleanEmail = data.email.trim().toLowerCase();
    if (users.some(u => u.email.trim().toLowerCase() === cleanEmail)) {
      return {
        success: false,
        error: 'This email is already in use and cannot be used more than once. Each email can only be registered once in ASYV Mind Bridge.'
      };
    }

    const newWorker: User = {
      id: `worker-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      role: 'social_worker',
      grade: data.grade,
      password: data.password || 'worker@asyv26',
      avatar: data.avatar || '/asyv_emblem.svg',
      registeredAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newWorker]);
    setCurrentUser(newWorker);
    setActivePageRaw('dashboard');
    setPageHistory(['dashboard']);
    setShowHelpBanner(false);

    mutateCentralState('UPSERT_USER', newWorker);
    addAuditLog('WORKER_REGISTERED', `Psychosocial worker registered: ${newWorker.name} (${newWorker.grade} Grade Leader)`, 'info', newWorker);
    return { success: true };
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog('LOGOUT', `User ${currentUser.name} signed out`, 'info');
    }
    setGoodbyeMessage(
      currentUser
        ? `Goodbye ${currentUser.name}! Take care of yourself. Mind Bridge and the ASYV psychosocial team are always here for you.`
        : 'Take care of yourself! Mind Bridge and your ASYV support team are always here for you.'
    );
    setShowGoodbyeModal(true);
    setCurrentUser(null);
    setActivePageRaw('dashboard');
    setPageHistory(['dashboard']);
    setShowHelpBanner(false);
    setRememberedLogin(null);
    localStorage.removeItem(STORAGE_KEYS.REMEMBERED);
  };

  const resetUserPassword = (userId: string, newPassword: string): { success: boolean; error?: string } => {
    const target = users.find(u => u.id === userId);
    if (!target) return { success: false, error: 'User not found in village roster' };
    if (!newPassword || newPassword.trim().length < 3) {
      return { success: false, error: 'Password must be at least 3 characters long' };
    }
    const cleanPsd = newPassword.trim();
    updateUser(userId, { password: cleanPsd });
    addAuditLog('PASSWORD_RECOVERED', `Password recovered/reset for ${target.name} (${target.email}) by administrator`, 'warning', target);
    return { success: true };
  };

  // Queries
  const getSocialWorkerForGrade = (grade: Grade): User | undefined => {
    return users.find(u => u.role === 'social_worker' && u.grade === grade);
  };

  const getStudentsByGrade = (grade: Grade): User[] => {
    return users.filter(u => u.role === 'student' && u.grade === grade);
  };

  const getMentalChampions = (): User[] => {
    return users.filter(u => u.isMentalChampion === true || u.championStatus === 'approved');
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const updated = { ...u, ...updates };
          if (currentUser && currentUser.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
    mutateCentralState('UPSERT_USER', { id: userId, ...updates });
  };

  const deleteUser = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    setUsers(prev => prev.filter(u => u.id !== userId));
    setMessages(prev => prev.filter(m => m.senderId !== userId && m.receiverId !== userId));
    setAssignments(prev =>
      prev.map(a => ({
        ...a,
        submissions: a.submissions.filter(s => s.studentId !== userId)
      }))
    );
    setDailyAnswers(prev => prev.filter(da => da.studentId !== userId));
    setJournalEntries(prev => prev.filter(j => j.studentId !== userId));
    setMoodLogs(prev => prev.filter(m => m.studentId !== userId));
    setTodos(prev => prev.filter(t => t.workerId !== userId));
    setEmergencyAlerts(prev => prev.filter(e => e.studentId !== userId));

    mutateCentralState('DELETE_USER', { userId });

    addAuditLog(
      'USER_DELETED',
      `Master Admin completely deleted and purged account: ${targetUser.name} ${targetUser.familyName || ''} (${targetUser.email}, Role: ${targetUser.role}, Grade: ${targetUser.grade})`,
      'security'
    );

    if (currentUser?.id === userId) {
      logout();
    }
  };

  // Messaging
  const sendMessage = (receiverId: string, content: string) => {
    if (!currentUser || !content.trim()) return;
    const receiver = users.find(u => u.id === receiverId);
    if (!receiver) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      receiverId: receiver.id,
      receiverName: receiver.name,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
      grade: currentUser.role === 'student' ? currentUser.grade : receiver.grade
    };

    setMessages(prev => [...prev, newMsg]);
    mutateCentralState('SEND_MESSAGE', newMsg);
  };

  const markMessagesRead = (partnerId: string) => {
    if (!currentUser) return;
    setMessages(prev =>
      prev.map(m =>
        m.senderId === partnerId && m.receiverId === currentUser.id
          ? { ...m, isRead: true }
          : m
      )
    );
    mutateCentralState('MARK_MESSAGES_READ', { currentUserId: currentUser.id, partnerId });
  };

  // Emergency SOS
  const sendEmergencyAlert = (message: string, urgency: 'high' | 'critical') => {
    if (!currentUser || currentUser.role !== 'student') return;

    const newAlert: EmergencyAlert = {
      id: `sos-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentFamilyName: currentUser.familyName || '',
      studentClass: currentUser.schoolClass || 'Unassigned',
      studentEmail: currentUser.email,
      grade: currentUser.grade,
      urgency,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      status: 'active'
    };

    setEmergencyAlerts(prev => [newAlert, ...prev]);
    mutateCentralState('SEND_EMERGENCY_ALERT', newAlert);

    const worker = getSocialWorkerForGrade(currentUser.grade);
    if (worker) {
      const emergencyChat: ChatMessage = {
        id: `sos-chat-${Date.now()}`,
        senderId: currentUser.id,
        senderName: `${currentUser.name} (EMERGENCY SOS)`,
        senderRole: 'student',
        receiverId: worker.id,
        receiverName: worker.name,
        content: `🚨 [EMERGENCY ALERT] ${message.trim()}`,
        timestamp: new Date().toISOString(),
        isRead: false,
        grade: currentUser.grade
      };
      setMessages(prev => [...prev, emergencyChat]);
      mutateCentralState('SEND_MESSAGE', emergencyChat);
    }
  };

  const acknowledgeEmergency = (alertId: string, responseNote?: string) => {
    setEmergencyAlerts(prev =>
      prev.map(a =>
        a.id === alertId
          ? {
              ...a,
              status: 'acknowledged',
              workerResponse: responseNote || 'Social worker has acknowledged and is reaching out to you.'
            }
          : a
      )
    );
    mutateCentralState('ACKNOWLEDGE_EMERGENCY', { alertId, responseNote });
  };

  // Assignments
  const createAssignment = (data: {
    title: string;
    instructions: string;
    grade: Grade;
    dueDate: string;
    questions: AssignmentQuestion[];
  }) => {
    if (!currentUser) return;
    const newAssign: Assignment = {
      id: `assign-${Date.now()}`,
      title: data.title,
      instructions: data.instructions,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      grade: data.grade,
      dueDate: data.dueDate,
      createdAt: new Date().toISOString(),
      questions: data.questions,
      submissions: []
    };
    setAssignments(prev => [newAssign, ...prev]);
    mutateCentralState('CREATE_ASSIGNMENT', newAssign);
  };

  const submitAssignment = (
    assignmentId: string,
    answers: { questionId: string; answerText?: string; selectedOption?: number }[]
  ) => {
    if (!currentUser) return;
    const submission: AssignmentSubmission = {
      id: `sub-${Date.now()}`,
      assignmentId,
      studentId: currentUser.id,
      studentName: `${currentUser.name} ${currentUser.familyName || ''}`.trim(),
      submittedAt: new Date().toISOString(),
      answers
    };

    setAssignments(prev =>
      prev.map(a => {
        if (a.id === assignmentId) {
          const filtered = a.submissions.filter(s => s.studentId !== currentUser.id);
          return { ...a, submissions: [...filtered, submission] };
        }
        return a;
      })
    );
    mutateCentralState('SUBMIT_ASSIGNMENT', { assignmentId, submission });
  };

  // Daily Questions
  const setDailyQuestion = (grade: Grade, question: string, contextNote: string) => {
    if (!currentUser) return;
    const existingIndex = dailyQuestions.findIndex(q => q.grade === grade);
    const updatedQ: DailyQuestion = {
      id: existingIndex >= 0 ? dailyQuestions[existingIndex].id : `dq-${Date.now()}`,
      grade,
      socialWorkerId: currentUser.id,
      socialWorkerName: currentUser.name,
      question: question.trim(),
      contextNote: contextNote.trim(),
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      setDailyQuestions(prev => prev.map((q, idx) => (idx === existingIndex ? updatedQ : q)));
    } else {
      setDailyQuestions(prev => [...prev, updatedQ]);
    }
    mutateCentralState('SET_DAILY_QUESTION', updatedQ);
  };

  const answerDailyQuestion = (dailyQuestionId: string, answerText: string) => {
    if (!currentUser || currentUser.role !== 'student') return;
    const newAnswer: DailyQuestionAnswer = {
      id: `ans-${Date.now()}`,
      dailyQuestionId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      grade: currentUser.grade,
      answer: answerText.trim(),
      answeredAt: new Date().toISOString()
    };
    setDailyAnswers(prev => [newAnswer, ...prev]);
    mutateCentralState('ANSWER_DAILY_QUESTION', newAnswer);
  };

  // Journal
  const addJournalEntry = (title: string, content: string, moodReaction: string) => {
    if (!currentUser) return;
    const entry: JournalEntry = {
      id: `j-${Date.now()}`,
      studentId: currentUser.id,
      title: title.trim(),
      content: content.trim(),
      moodReaction,
      createdAt: new Date().toISOString()
    };
    setJournalEntries(prev => [entry, ...prev]);
    mutateCentralState('ADD_JOURNAL_ENTRY', entry);
  };

  const deleteJournalEntry = (id: string) => {
    setJournalEntries(prev => prev.filter(j => j.id !== id));
    mutateCentralState('DELETE_JOURNAL_ENTRY', { id });
  };

  // Mood Tracker
  const logMood = (mood: MoodLog['mood'], moodEmoji: string, intensity: number, note: string) => {
    if (!currentUser) return;
    const log: MoodLog = {
      id: `m-${Date.now()}`,
      studentId: currentUser.id,
      mood,
      moodEmoji,
      intensity,
      note: note.trim(),
      timestamp: new Date().toISOString()
    };
    setMoodLogs(prev => [log, ...prev]);
    mutateCentralState('ADD_MOOD_LOG', log);
  };

  // To-Do list
  const addTodo = (title: string, priority: 'low' | 'medium' | 'high', dueDate?: string) => {
    if (!currentUser) return;
    const newTask: TodoTask = {
      id: `todo-${Date.now()}`,
      workerId: currentUser.id,
      title: title.trim(),
      priority,
      dueDate,
      isCompleted: false,
      createdAt: new Date().toISOString()
    };
    setTodos(prev => [newTask, ...prev]);
    mutateCentralState('ADD_TODO', newTask);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    );
    // Mark alert as dismissed permanently when completed
    setSnoozedAlerts(prev => {
      const next = { ...prev, [id]: -1 };
      try {
        localStorage.setItem(STORAGE_KEYS.SNOOZED_ALERTS, JSON.stringify(next));
      } catch {}
      return next;
    });
    mutateCentralState('TOGGLE_TODO', { todoId: id });
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
    setSnoozedAlerts(prev => {
      const next = { ...prev };
      delete next[id];
      try {
        localStorage.setItem(STORAGE_KEYS.SNOOZED_ALERTS, JSON.stringify(next));
      } catch {}
      return next;
    });
    mutateCentralState('DELETE_TODO', { todoId: id });
  };

  // Alert Management (Stop, Snooze, and Return on Approaching Deadline)
  const snoozeAlert = useCallback((taskId: string, durationMinutes: number = 60) => {
    setSnoozedAlerts(prev => {
      const next = { ...prev, [taskId]: Date.now() + durationMinutes * 60 * 1000 };
      try {
        localStorage.setItem(STORAGE_KEYS.SNOOZED_ALERTS, JSON.stringify(next));
      } catch {}
      return next;
    });
    mutateCentralState('STOP_ALERT', { taskId, snoozeUntil: Date.now() + durationMinutes * 60 * 1000 });
  }, []);

  const stopAlert = useCallback((taskId: string) => {
    // Dismisses and stops the alert permanently for the admin; disappears immediately and leaves empty space
    setSnoozedAlerts(prev => {
      const next = { ...prev, [taskId]: -1 };
      try {
        localStorage.setItem(STORAGE_KEYS.SNOOZED_ALERTS, JSON.stringify(next));
      } catch {}
      return next;
    });
    mutateCentralState('STOP_ALERT', { taskId });
  }, []);

  const unsnoozeAlert = useCallback((taskId: string) => {
    setSnoozedAlerts(prev => {
      const next = { ...prev };
      delete next[taskId];
      try {
        localStorage.setItem(STORAGE_KEYS.SNOOZED_ALERTS, JSON.stringify(next));
      } catch {}
      return next;
    });
    mutateCentralState('UNSNOOZE_ALERT', { taskId });
  }, []);

  const isAlertActive = useCallback((task: TodoTask): boolean => {
    // 1. If user clicked Done or task is completed, it is NEVER active
    if (task.isCompleted) return false;

    // 2. Check if stopped by admin (-1 = permanently stopped/dismissed)
    const snoozedUntil = snoozedAlerts[task.id];
    if (snoozedUntil === -1) {
      return false;
    }
    // If snoozed with active future timestamp
    if (typeof snoozedUntil === 'number' && snoozedUntil > 0 && Date.now() < snoozedUntil) {
      return false;
    }

    // 3. Check if task priority is high or approaching deadline
    let isUrgent = task.priority === 'high';

    if (task.dueDate) {
      const taskTime = new Date(task.dueDate).getTime();
      const now = Date.now();
      const hoursRemaining = (taskTime - now) / (1000 * 60 * 60);

      // Approaching if due within 3 days (72 hours) or overdue
      if (hoursRemaining <= 72) {
        isUrgent = true;
      }
    }

    return isUrgent;
  }, [snoozedAlerts]);

  // Mental Champion Management
  const applyForMentalChampion = (idea?: string) => {
    if (!currentUser || currentUser.role !== 'student') return;
    updateUser(currentUser.id, {
      championStatus: 'pending',
      championIdea: idea || ''
    });
  };

  const approveMentalChampion = (studentId: string) => {
    updateUser(studentId, {
      isMentalChampion: true,
      championStatus: 'approved'
    });
  };

  const rejectMentalChampion = (studentId: string) => {
    updateUser(studentId, {
      isMentalChampion: false,
      championStatus: 'rejected'
    });
  };

  // Timetables
  const createTimetableSession = (session: Omit<TimetableSession, 'id' | 'createdAt' | 'createdByWorkerId'>) => {
    if (!currentUser) return;
    const newSession: TimetableSession = {
      ...session,
      id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      createdByWorkerId: currentUser.id
    };
    setTimetables(prev => (prev.some(s => s.id === newSession.id) ? prev : [newSession, ...prev]));
    mutateCentralState('CREATE_TIMETABLE_SESSION', newSession);
    addAuditLog('TIMETABLE_CREATED' as any, `Created champion facilitation session: "${newSession.topic}"`, 'info');
  };

  // Lessons
  const createWellnessLesson = (lesson: Omit<WellnessLesson, 'id' | 'createdAt' | 'workerId' | 'workerName'>) => {
    if (!currentUser) return;
    const newLesson: WellnessLesson = {
      ...lesson,
      id: `lesson-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      workerId: currentUser.id,
      workerName: currentUser.name,
      createdAt: new Date().toISOString()
    };
    setWellnessLessons(prev => (prev.some(l => l.id === newLesson.id) ? prev : [newLesson, ...prev]));
    mutateCentralState('CREATE_WELLNESS_LESSON', newLesson);
    addAuditLog('LESSON_CREATED' as any, `Published wellness lesson: "${newLesson.title}"`, 'info');
  };

  // Discussions
  const addDiscussionPost = (content: string) => {
    if (!currentUser) return;
    const newPost: ChampionDiscussionPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      grade: currentUser.grade,
      content: content.trim(),
      timestamp: new Date().toISOString()
    };
    setDiscussionPosts(prev => (prev.some(p => p.id === newPost.id) ? prev : [newPost, ...prev]));
    mutateCentralState('ADD_DISCUSSION_POST', newPost);
  };

  // Contact Info
  const updateContactInfo = (info: Partial<VillageContactInfo>) => {
    const nextInfo: VillageContactInfo = {
      ...contactInfo,
      ...info,
      updatedAt: new Date().toISOString()
    };
    setContactInfo(nextInfo);
    mutateCentralState('UPDATE_CONTACT_INFO', nextInfo);
    addAuditLog('CONTACT_INFO_UPDATED', 'Village psychosocial emergency contacts updated centrally on server', 'info');
  };

  // Announcements
  const addAnnouncement = (
    title: string,
    content: string,
    category: Announcement['category'],
    targetGrades: Grade[] | 'all'
  ) => {
    if (!currentUser) return;
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      category,
      targetGrades,
      authorName: currentUser.name,
      createdAt: new Date().toISOString(),
      active: true
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    mutateCentralState('ADD_ANNOUNCEMENT', newAnn);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    mutateCentralState('DELETE_ANNOUNCEMENT', { announcementId: id });
  };

  const toggleAnnouncementActive = (id: string) => {
    setAnnouncements(prev =>
      prev.map(a => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const createSocialWorkerByAdmin = (data: {
    name: string;
    email: string;
    grade: Grade;
    password: string;
    avatar?: string;
  }): { success: boolean; error?: string } => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'This email is already in use and cannot be used more than once. Each email can only be registered once in ASYV Mind Bridge.' };
    }
    const newWorker: User = {
      id: `worker-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      role: 'social_worker',
      grade: data.grade,
      password: data.password || 'password123',
      avatar: data.avatar || '/asyv_emblem.svg',
      registeredAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newWorker]);
    mutateCentralState('UPSERT_USER', newWorker);
    return { success: true };
  };

  const assignSocialWorkerToGrade = (workerId: string, grade: Grade) => {
    updateUser(workerId, { grade });
  };

  const exportDatabaseJson = () => {
    const fullBackup = {
      version: 4,
      exportedAt: new Date().toISOString(),
      users,
      contactInfo,
      announcements,
      messages,
      emergencyAlerts,
      assignments,
      dailyQuestions,
      dailyAnswers,
      journalEntries,
      moodLogs,
      todos,
      timetables,
      wellnessLessons,
      discussionPosts,
      wellnessTips,
      kudosPosts,
      appCustomization
    };
    return JSON.stringify(fullBackup, null, 2);
  };

  const importDatabaseJson = (jsonStr: string): { success: boolean; error?: string } => {
    try {
      const data = JSON.parse(jsonStr);
      if (!data || !Array.isArray(data.users)) {
        return { success: false, error: 'Invalid database backup structure. "users" array missing.' };
      }
      applyCentralDatabase(data);
      mutateCentralState('IMPORT_DATABASE', data);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: `JSON Parse error: ${err.message}` };
    }
  };

  const createStudentByAdmin = (data: {
    name: string;
    familyName: string;
    email: string;
    grade: Grade;
    schoolClass: string;
    password?: string;
  }): { success: boolean; error?: string } => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'This email is already in use and cannot be used more than once. Each email can only be registered once in ASYV Mind Bridge.' };
    }

    const newStudent: User = {
      id: `student-${Date.now()}`,
      name: data.name.trim(),
      familyName: data.familyName.trim(),
      email: cleanEmail,
      role: 'student',
      grade: data.grade,
      schoolClass: data.schoolClass.trim(),
      password: data.password || 'asyv2028',
      avatar: '/asyv_emblem.svg',
      registeredAt: new Date().toISOString(),
      isMentalChampion: false,
      championStatus: 'none'
    };

    setUsers(prev => [...prev, newStudent]);
    mutateCentralState('UPSERT_USER', newStudent);
    addAuditLog('STUDENT_CREATED_BY_ADMIN', `Administrator registered student: ${newStudent.name} ${newStudent.familyName} (${newStudent.grade} Grade · ${newStudent.schoolClass})`, 'info', newStudent);
    return { success: true };
  };

  const createStudentBySocialWorker = (data: {
    name: string;
    familyName: string;
    email: string;
    grade: Grade;
    schoolClass: string;
    password?: string;
  }): { success: boolean; error?: string } => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'This email is already in use and cannot be used more than once. Each email can only be registered once in ASYV Mind Bridge.' };
    }

    const newStudent: User = {
      id: `student-${Date.now()}`,
      name: data.name.trim(),
      familyName: data.familyName.trim(),
      email: cleanEmail,
      role: 'student',
      grade: data.grade,
      schoolClass: data.schoolClass.trim(),
      password: data.password || 'asyv2028',
      avatar: '/asyv_emblem.svg',
      registeredAt: new Date().toISOString(),
      isMentalChampion: false,
      championStatus: 'none'
    };

    setUsers(prev => [...prev, newStudent]);
    mutateCentralState('UPSERT_USER', newStudent);
    addAuditLog('STUDENT_ENROLLED_BY_WORKER', `Social Worker ${currentUser?.name || 'Staff'} registered student: ${newStudent.name} ${newStudent.familyName} (${newStudent.grade} Grade · ${newStudent.schoolClass})`, 'info', newStudent);
    return { success: true };
  };

  // Real Data Tips Management
  const addWellnessTip = (tip: Omit<WellnessTip, 'id' | 'createdAt'>) => {
    const newTip: WellnessTip = {
      ...tip,
      id: `tip-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setWellnessTips(prev => [newTip, ...prev]);
    mutateCentralState('ADD_WELLNESS_TIP', newTip);
  };

  const updateWellnessTip = (id: string, updates: Partial<WellnessTip>) => {
    setWellnessTips(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
    mutateCentralState('UPDATE_WELLNESS_TIP', { id, updates });
  };

  const deleteWellnessTip = (id: string) => {
    setWellnessTips(prev => prev.filter(t => t.id !== id));
    mutateCentralState('DELETE_WELLNESS_TIP', { id });
  };

  // Peer Encouragement & Kudos
  const addKudosPost = (post: Omit<KudosPost, 'id' | 'createdAt' | 'likesCount' | 'likedBy'>) => {
    const newPost: KudosPost = {
      ...post,
      id: `kudos-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      likedBy: []
    };
    setKudosPosts(prev => [newPost, ...prev]);
    mutateCentralState('ADD_KUDOS', newPost);
  };

  const likeKudosPost = (kudosId: string) => {
    if (!currentUser) return;
    const userId = currentUser.id;
    setKudosPosts(prev =>
      prev.map(k => {
        if (k.id === kudosId) {
          const hasLiked = k.likedBy.includes(userId);
          const likedBy = hasLiked ? k.likedBy.filter(id => id !== userId) : [...k.likedBy, userId];
          return { ...k, likedBy, likesCount: likedBy.length };
        }
        return k;
      })
    );
    mutateCentralState('LIKE_KUDOS', { kudosId, userId });
  };

  const deleteKudosPost = (kudosId: string) => {
    setKudosPosts(prev => prev.filter(k => k.id !== kudosId));
  };

  // Admin View-As
  const impersonateUser = (user: User) => {
    if (currentUser?.role === 'developer' && !realAdminUser) {
      setRealAdminUser(currentUser);
    }
    setCurrentUser(user);
    setActivePageRaw('dashboard');
    setPageHistory(['dashboard']);
  };

  const stopImpersonation = () => {
    if (realAdminUser) {
      setCurrentUser(realAdminUser);
      setRealAdminUser(null);
      setActivePageRaw('dashboard');
      setPageHistory(['dashboard']);
    }
  };

  const resetToCleanState = () => {
    localStorage.clear();
    setUsers([INITIAL_DEVELOPER]);
    setContactInfo(DEFAULT_VILLAGE_CONTACT_INFO);
    setAnnouncements([]);
    setMessages([]);
    setEmergencyAlerts([]);
    setAssignments([]);
    setDailyQuestions([]);
    setDailyAnswers([]);
    setJournalEntries([]);
    setMoodLogs([]);
    setTodos([]);
    setTimetables([]);
    setWellnessLessons([]);
    setWellnessTips([]);
    setDiscussionPosts([]);
    setKudosPosts([]);
    setAuditLogs([]);
    setCurrentUser(INITIAL_DEVELOPER);
    mutateCentralState('RESET_DATABASE', {});
  };

  const clearSampleDataToCleanState = () => {
    resetToCleanState();
  };

  const restoreSampleData = () => {
    refreshFromCentralDb();
  };

  // Helper counts
  const unreadCount = currentUser
    ? messages.filter(m => m.receiverId === currentUser.id && !m.isRead).length
    : 0;

  const activeSosAlerts = currentUser?.role === 'social_worker'
    ? emergencyAlerts.filter(a => a.grade === currentUser.grade && a.status === 'active')
    : [];

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        activePage,
        pageHistory,
        showHelpBanner,
        showGoodbyeModal,
        goodbyeMessage,
        rememberedLogin,
        unreadCount,
        activeSosAlerts,
        contactInfo,
        announcements,

        networkSyncStatus,
        refreshFromCentralDb,

        theme,
        toggleTheme,
        language,
        setLanguage,

        auditLogs,
        addAuditLog,
        clearAuditLogs,
        updateSocialWorkerProfile,

        setActivePage,
        goBack,
        goToHome,
        dismissHelpBanner,
        closeGoodbyeModal,

        updateContactInfo,
        appCustomization,
        updateAppCustomization,
        resetAppCustomization,
        landingImage,
        landingMediaStatus,
        deleteAllNonAdminUsers,
        addAnnouncement,
        deleteAnnouncement,
        toggleAnnouncementActive,
        createSocialWorkerByAdmin,
        assignSocialWorkerToGrade,
        createStudentByAdmin,
        createStudentBySocialWorker,
        exportDatabaseJson,
        importDatabaseJson,
        resetToCleanState,
        clearSampleDataToCleanState,
        restoreSampleData,

        wellnessTips,
        addWellnessTip,
        updateWellnessTip,
        deleteWellnessTip,

        impersonateUser,
        stopImpersonation,
        isImpersonating: Boolean(realAdminUser),
        realAdminUser,

        login,
        registerStudent,
        registerSocialWorker,
        logout,
        rememberUserCredentials,
        resetUserPassword,

        getSocialWorkerForGrade,
        getStudentsByGrade,
        getMentalChampions,
        updateUser,
        deleteUser,

        messages,
        sendMessage,
        markMessagesRead,
        emergencyAlerts,
        sendEmergencyAlert,
        acknowledgeEmergency,

        assignments,
        createAssignment,
        submitAssignment,

        dailyQuestions,
        dailyAnswers,
        setDailyQuestion,
        answerDailyQuestion,

        journalEntries,
        addJournalEntry,
        deleteJournalEntry,

        moodLogs,
        logMood,

        todos,
        addTodo,
        toggleTodo,
        deleteTodo,

        snoozedAlerts,
        snoozeAlert,
        stopAlert,
        unsnoozeAlert,
        isAlertActive,

        applyForMentalChampion,
        approveMentalChampion,
        rejectMentalChampion,

        timetables,
        createTimetableSession,
        wellnessLessons,
        createWellnessLesson,

        discussionPosts,
        addDiscussionPost,

        kudosPosts,
        addKudosPost,
        likeKudosPost,
        deleteKudosPost,

        setAsyvPalette
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
