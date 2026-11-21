export type Grade = 'Ingabe' | 'Ingabo' | 'Ijabo';

export type UserRole = 'student' | 'social_worker' | 'developer' | 'mental_champion';

export type AppLanguage = 'en' | 'rw' | 'fr';
export type AppTheme = 'light' | 'dark';

export interface User {
  id: string;
  name: string; // First / Display Name
  familyName?: string; // Only for students and mental champions
  email: string;
  role: UserRole;
  grade: Grade; // For student: their registered grade; for social worker: the grade they lead
  schoolClass?: string; // E.g., "Senior 4 MEG", "Senior 5 MCB" (students only)
  avatar: string;
  password?: string;
  registeredAt: string;
  isMentalChampion?: boolean;
  championStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  championIdea?: string;
  phone?: string; // Contact phone number (especially for social workers & grade leaders)
  whatsappNumber?: string; // WhatsApp number
  officeLocation?: string; // Office / campus location for grade leader
  bio?: string; // Counselor or student bio / focus area
  hasCustomPassword?: boolean; // True if student has personalized their password
  passwordChangedAt?: string; // Timestamp when password was last customized
  mustChangePassword?: boolean; // Flag to prompt password change on login
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  receiverName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  grade: Grade;
}

export interface EmergencyAlert {
  id: string;
  studentId: string;
  studentName: string;
  studentFamilyName: string;
  studentClass: string;
  studentEmail: string;
  grade: Grade;
  urgency: 'high' | 'critical';
  message: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  workerResponse?: string;
}

export type QuestionType = 'multiple_choice' | 'open_ended';

export interface AssignmentQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: string[]; // For multiple choice
  correctOptionIndex?: number;
}

export interface Assignment {
  id: string;
  title: string;
  instructions: string;
  creatorId: string;
  creatorName: string;
  grade: Grade;
  dueDate: string;
  createdAt: string;
  questions: AssignmentQuestion[];
  submissions: AssignmentSubmission[];
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  answers: {
    questionId: string;
    answerText?: string;
    selectedOption?: number;
  }[];
  gradeComment?: string;
}

export interface JournalEntry {
  id: string;
  studentId: string;
  title: string;
  content: string;
  moodReaction: string; // emoji or tag
  createdAt: string;
  updatedAt?: string;
}

export interface MoodLog {
  id: string;
  studentId: string;
  mood: 'peaceful' | 'grateful' | 'energetic' | 'neutral' | 'anxious' | 'stressed' | 'low' | 'overwhelmed';
  moodEmoji: string;
  intensity: number; // 1-5
  note: string;
  timestamp: string;
}

export interface DailyQuestion {
  id: string;
  grade: Grade;
  socialWorkerId: string;
  socialWorkerName: string;
  question: string;
  contextNote: string;
  updatedAt: string;
}

export interface DailyQuestionAnswer {
  id: string;
  dailyQuestionId: string;
  studentId: string;
  studentName: string;
  grade: Grade;
  answer: string;
  answeredAt: string;
}

export interface TodoTask {
  id: string;
  workerId: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface TimetableSession {
  id: string;
  topic: string;
  description: string;
  date: string;
  time: string;
  targetGrades: Grade[] | 'all';
  targetChampionIds?: string[]; // specific champions or empty for all
  leaderName: string; // First name only
  createdByWorkerId: string;
  createdAt: string;
}

export interface WellnessLesson {
  id: string;
  title: string;
  category: 'stress' | 'study' | 'social' | 'mindfulness' | 'resilience';
  description: string;
  content: string;
  workerId: string;
  workerName: string;
  targetGrades: Grade[] | 'all';
  attachmentType?: 'image' | 'document' | 'none';
  attachmentUrl?: string;
  attachmentName?: string;
  createdAt: string;
}

export interface ChampionDiscussionPost {
  id: string;
  authorId: string;
  authorName: string;
  grade: Grade;
  content: string;
  timestamp: string;
}

export interface VillageContactItem {
  id: string;
  name: string;
  role: string;
  phone: string;
  category: 'mental_health' | 'clinic' | 'security' | 'counseling' | 'general';
}

export interface VillageContactInfo {
  officeLocation: string;
  officeHours: string;
  hotlinePhone: string;
  whatsappPhone: string;
  emergencyEmail: string;
  clinicExtension: string;
  counselorLead: string;
  additionalNotice: string;
  customContacts?: VillageContactItem[];
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'urgent' | 'wellness' | 'workshop' | 'general';
  targetGrades: Grade[] | 'all';
  authorName: string;
  createdAt: string;
  active: boolean;
}

export interface WellnessTip {
  id: string;
  category: 'study' | 'stress' | 'social' | 'living';
  title: string;
  summary: string;
  actionable: string;
  authorName?: string;
  createdAt?: string;
}

export type QuoteTheme =
  | 'hope'
  | 'resilience'
  | 'healing'
  | 'leadership'
  | 'courage'
  | 'wisdom'
  | 'solidarity'
  | 'mindfulness';

export type AsyvColorKey =
  | 'forest'
  | 'terracotta'
  | 'gold'
  | 'muhazi'
  | 'jacaranda'
  | 'eucalyptus'
  | 'rose';

export interface EmotionalSupportQuote {
  id: string;
  quote: {
    en: string;
    rw: string;
    fr: string;
  };
  author: string;
  sourceOrRole: string;
  theme: QuoteTheme;
}

export interface AppCustomization {
  schoolMotto: string;
  schoolSubMotto: string;
  portalTitle: string;
  portalSubtitle: string;
  welcomeBannerTitle: string;
  welcomeBannerSubtitle: string;
  welcomeHeroTitle?: string;
  welcomeHeroSubtitle?: string;
  welcomeHeroDescription?: string;
  strategicPlanTag?: string;
  strategicPlanTitle?: string;
  strategicPlanDescription?: string;
  strategicPlanImageUrl?: string;
  portalLogoImageUrl?: string;
  loginNotice: string;
  primaryBrandColor: string;
  accentBrandColor: string;
  footerTagline: string;
  allowPublicStudentRegistration: boolean;
  allowPublicWorkerRegistration: boolean;
  customInspirationalQuote?: string;
  customQuoteAuthor?: string;
  activeAsyvPalette?: AsyvColorKey;
}

export type AuditActionType =
  | 'LOGIN'
  | 'LOGOUT'
  | 'STUDENT_REGISTERED'
  | 'WORKER_REGISTERED'
  | 'STUDENT_CREATED'
  | 'STUDENT_CREATED_BY_ADMIN'
  | 'STUDENT_ENROLLED_BY_WORKER'
  | 'USER_DELETED'
  | 'USERS_PURGED'
  | 'PROFILE_UPDATED'
  | 'CHAMPION_APPLIED'
  | 'CHAMPION_APPROVED'
  | 'CHAMPION_REJECTED'
  | 'EMERGENCY_ALERT_SENT'
  | 'EMERGENCY_ALERT_ACKNOWLEDGED'
  | 'MESSAGE_SENT'
  | 'ASSIGNMENT_CREATED'
  | 'ASSIGNMENT_SUBMITTED'
  | 'DAILY_QUESTION_SET'
  | 'DAILY_QUESTION_ANSWERED'
  | 'CONTACT_INFO_UPDATED'
  | 'ANNOUNCEMENT_POSTED'
  | 'ANNOUNCEMENT_DELETED'
  | 'TIP_CREATED'
  | 'TIP_DELETED'
  | 'APP_CUSTOMIZED'
  | 'DATABASE_EXPORTED'
  | 'DATABASE_IMPORTED'
  | 'DATABASE_RESET'
  | 'PASSWORD_RECOVERED'
  | 'PASSWORD_RESET'
  | 'SECURITY_CHECK';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  grade?: Grade;
  action: AuditActionType;
  details: string;
  severity: 'info' | 'warning' | 'security' | 'success';
  ipOrDevice: string;
}

export type KudosCategory = 'kindness' | 'resilience' | 'study' | 'gratitude' | 'community' | 'inspiration';

export interface KudosPost {
  id: string;
  senderGrade?: Grade | 'village'; // Sender can choose to identify by their grade or anonymous
  recipientGrade: Grade | 'all';
  recipientName?: string; // e.g. "To Keza in Senior 4 MEG", "To our Dining Hall family"
  category: KudosCategory;
  message: string;
  createdAt: string;
  likesCount: number;
  likedBy: string[]; // user IDs who liked
  bgTheme?: string; // decorative gradient / accent
}


