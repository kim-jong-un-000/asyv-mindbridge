import express from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
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
} from './src/data/initialData';
import {
  User,
  Assignment,
  DailyQuestion,
  DailyQuestionAnswer,
  ChatMessage,
  EmergencyAlert,
  TodoTask,
  TimetableSession,
  WellnessLesson,
  ChampionDiscussionPost,
  VillageContactInfo,
  Announcement,
  WellnessTip,
  AuditLogEntry,
  AppCustomization,
  KudosPost,
  JournalEntry,
  MoodLog
} from './src/types';
import {
  fetchFullPostgresState,
  upsertUserInPostgres,
  deleteUserInPostgres,
  insertAuditLogInPostgres,
  saveAppSettingInPostgres
} from './src/db/repo.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Central Database Schema definition
export interface CentralDatabase {
  version: number;
  lastUpdated: string;
  users: User[];
  assignments: Assignment[];
  dailyQuestions: DailyQuestion[];
  dailyAnswers: DailyQuestionAnswer[];
  messages: ChatMessage[];
  emergencyAlerts: EmergencyAlert[];
  todos: TodoTask[];
  timetables: TimetableSession[];
  wellnessLessons: WellnessLesson[];
  discussionPosts: ChampionDiscussionPost[];
  contactInfo: VillageContactInfo;
  announcements: Announcement[];
  wellnessTips: WellnessTip[];
  auditLogs: AuditLogEntry[];
  appCustomization: AppCustomization;
  kudosPosts: KudosPost[];
  journalEntries: JournalEntry[];
  moodLogs: MoodLog[];
  stoppedAlerts?: Record<string, boolean>;
}

// Database directory & persistent file path
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'central_database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize Default State
function createDefaultDatabase(): CentralDatabase {
  const initialUsers: User[] = [
    INITIAL_DEVELOPER,
    ...PERMANENT_SOCIAL_WORKERS,
    ...INITIAL_STUDENTS
  ];

  return {
    version: 1,
    lastUpdated: new Date().toISOString(),
    users: initialUsers,
    assignments: INITIAL_ASSIGNMENTS,
    dailyQuestions: INITIAL_DAILY_QUESTIONS,
    dailyAnswers: INITIAL_DAILY_ANSWERS,
    messages: INITIAL_CHATS,
    emergencyAlerts: [],
    todos: INITIAL_TODOS,
    timetables: INITIAL_TIMETABLES,
    wellnessLessons: INITIAL_LESSONS,
    discussionPosts: INITIAL_DISCUSSIONS,
    contactInfo: DEFAULT_VILLAGE_CONTACT_INFO,
    announcements: INITIAL_ANNOUNCEMENTS,
    wellnessTips: INITIAL_TIPS,
    auditLogs: INITIAL_AUDIT_LOGS,
    appCustomization: DEFAULT_APP_CUSTOMIZATION,
    kudosPosts: INITIAL_KUDOS_POSTS,
    journalEntries: INITIAL_JOURNAL_ENTRIES,
    moodLogs: INITIAL_MOOD_LOGS,
    stoppedAlerts: {}
  };
}

// Load database from disk or initialize fresh
function loadDatabase(): CentralDatabase {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      // Ensure essential fields exist
      if (parsed && Array.isArray(parsed.users) && parsed.contactInfo) {
        // Ensure Master Administrator account is always present
        if (!parsed.users.some((u: User) => u.id === INITIAL_DEVELOPER.id || u.email === INITIAL_DEVELOPER.email)) {
          parsed.users.unshift(INITIAL_DEVELOPER);
        }

        // Ensure array fields exist
        if (!Array.isArray(parsed.discussionPosts)) parsed.discussionPosts = [];
        if (!Array.isArray(parsed.dailyAnswers)) parsed.dailyAnswers = [];
        if (!Array.isArray(parsed.timetables)) parsed.timetables = [];
        if (!Array.isArray(parsed.wellnessLessons)) parsed.wellnessLessons = [];
        if (!Array.isArray(parsed.assignments)) parsed.assignments = [];
        if (!Array.isArray(parsed.dailyQuestions)) parsed.dailyQuestions = [];
        if (!Array.isArray(parsed.messages)) parsed.messages = [];
        if (!Array.isArray(parsed.emergencyAlerts)) parsed.emergencyAlerts = [];
        if (!Array.isArray(parsed.todos)) parsed.todos = [];
        if (!Array.isArray(parsed.announcements)) parsed.announcements = [];
        if (!Array.isArray(parsed.wellnessTips)) parsed.wellnessTips = [];
        if (!Array.isArray(parsed.kudosPosts)) parsed.kudosPosts = [];
        if (!Array.isArray(parsed.journalEntries)) parsed.journalEntries = [];
        if (!Array.isArray(parsed.moodLogs)) parsed.moodLogs = [];
        if (!parsed.stoppedAlerts || typeof parsed.stoppedAlerts !== 'object') parsed.stoppedAlerts = {};

        // Deduplicate auditLogs in database
        if (Array.isArray(parsed.auditLogs)) {
          const seenIds = new Set<string>();
          parsed.auditLogs = parsed.auditLogs.filter((l: any) => {
            if (!l?.id || seenIds.has(l.id)) return false;
            seenIds.add(l.id);
            return true;
          });
        }

        saveDatabase(parsed);
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load existing central database, re-initializing:', err);
  }

  const def = createDefaultDatabase();
  saveDatabase(def);
  return def;
}

// Persist database to disk atomically
function saveDatabase(db: CentralDatabase): void {
  try {
    db.version = (db.version || 0) + 1;
    db.lastUpdated = new Date().toISOString();
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error saving central database to disk:', err);
  }
}

// Global in-memory authoritative state
const db: CentralDatabase = loadDatabase();

// Asynchronous background hydration from Cloud SQL PostgreSQL database
async function syncFromPostgresIfAvailable() {
  if (process.env.SQL_HOST && process.env.SQL_USER) {
    try {
      const pgState = await fetchFullPostgresState();
      if (pgState.users && pgState.users.length > 0) {
        db.users = pgState.users;
      }
      if (pgState.contactInfo) db.contactInfo = pgState.contactInfo;
      if (pgState.appCustomization) db.appCustomization = pgState.appCustomization;
      if (pgState.announcements && pgState.announcements.length > 0) db.announcements = pgState.announcements as any;
      if (pgState.assignments && pgState.assignments.length > 0) db.assignments = pgState.assignments as any;
      if (pgState.dailyQuestions && pgState.dailyQuestions.length > 0) db.dailyQuestions = pgState.dailyQuestions as any;
      if (pgState.dailyAnswers && pgState.dailyAnswers.length > 0) db.dailyAnswers = pgState.dailyAnswers as any;
      if (pgState.messages && pgState.messages.length > 0) db.messages = pgState.messages as any;
      if (pgState.emergencyAlerts && pgState.emergencyAlerts.length > 0) db.emergencyAlerts = pgState.emergencyAlerts as any;
      if (pgState.moodLogs && pgState.moodLogs.length > 0) db.moodLogs = pgState.moodLogs as any;
      if (pgState.journalEntries && pgState.journalEntries.length > 0) db.journalEntries = pgState.journalEntries as any;
      if (pgState.todos && pgState.todos.length > 0) db.todos = pgState.todos as any;
      if (pgState.wellnessLessons && pgState.wellnessLessons.length > 0) db.wellnessLessons = pgState.wellnessLessons as any;
      if (pgState.timetables && pgState.timetables.length > 0) db.timetables = pgState.timetables as any;
      if (pgState.wellnessTips && pgState.wellnessTips.length > 0) db.wellnessTips = pgState.wellnessTips as any;
      if (pgState.discussionPosts && pgState.discussionPosts.length > 0) db.discussionPosts = pgState.discussionPosts as any;
      if (pgState.kudosPosts && pgState.kudosPosts.length > 0) db.kudosPosts = pgState.kudosPosts as any;
      if (pgState.auditLogs && pgState.auditLogs.length > 0) db.auditLogs = pgState.auditLogs as any;
      if (pgState.stoppedAlerts) db.stoppedAlerts = { ...db.stoppedAlerts, ...pgState.stoppedAlerts };
      console.log(`✓ Synchronized authoritative state from Cloud SQL PostgreSQL (${db.users.length} users).`);
    } catch (err) {
      console.warn('Initial PostgreSQL synchronization deferred:', err);
    }
  }
}
syncFromPostgresIfAvailable();

// Setup Express and HTTP Server
const app = express();
app.set('trust proxy', 1);

// Enable CORS for worldwide multi-domain and multi-device access
app.use(cors({
  origin: true, // Allow request origin (enables published custom domains, Cloud Run, mobile web apps)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded assets directly
const uploadsDirectory = path.resolve(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDirectory)) {
  try { fs.mkdirSync(uploadsDirectory, { recursive: true }); } catch (e) {}
}
app.use('/uploads', express.static(uploadsDirectory));

const server = http.createServer(app);

// WebSocket Server for Real-Time Sync across multiple devices
const wss = new WebSocketServer({ server, path: '/ws' });

// Broadcast helper function
function broadcast(data: object, senderWs?: WebSocket) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client !== senderWs && client.readyState === WebSocket.OPEN) {
      try {
        client.send(message);
      } catch (e) {
        console.error('WebSocket send error:', e);
      }
    }
  });
}

// Handle WebSocket connections
wss.on('connection', (ws: WebSocket, req) => {
  const clientIp = req.socket.remoteAddress || 'unknown';
  // Send full authoritative state on initial handshake
  ws.send(JSON.stringify({
    type: 'INIT_STATE',
    payload: db,
    version: db.version,
    timestamp: new Date().toISOString()
  }));

  // Handle incoming messages/actions from clients
  ws.on('message', (data: string) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.type === 'PING') {
        ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
        return;
      }

      if (msg.type === 'MUTATE') {
        handleStateMutation(msg.action, msg.payload, ws, clientIp);
      }
    } catch (err) {
      console.error('Failed to handle WebSocket message:', err);
    }
  });

  ws.on('error', (err) => {
    console.error('WebSocket client error:', err);
  });
});

// Helper for applying state mutations
function handleStateMutation(
  action: string,
  payload: any,
  senderWs?: WebSocket,
  sourceIp: string = 'remote'
): { success: boolean; error?: string } {
  try {
    switch (action) {
      case 'UPDATE_CONTACT_INFO': {
        db.contactInfo = {
          ...db.contactInfo,
          ...payload,
          updatedAt: new Date().toISOString()
        };
        saveAppSettingInPostgres('village_contacts', db.contactInfo).catch(err => console.error('PG save contacts error:', err));
        // Add audit log
        addServerAuditLog(
          'CONTACT_INFO_UPDATED',
          `Village hotline contacts updated centrally`,
          'info',
          sourceIp
        );
        break;
      }

      case 'UPDATE_APP_CUSTOMIZATION': {
        db.appCustomization = {
          ...db.appCustomization,
          ...payload
        };
        saveAppSettingInPostgres('app_customization', db.appCustomization).catch(err => console.error('PG save customization error:', err));
        addServerAuditLog(
          'APP_CUSTOMIZED',
          `Global ASYV customization settings saved centrally`,
          'info',
          sourceIp
        );
        break;
      }

      case 'SAVE_PROFILE': {
        const { userId, ...updates } = payload;
        const idx = db.users.findIndex(u => u.id === userId);
        if (idx !== -1) {
          db.users[idx] = { ...db.users[idx], ...updates };
          upsertUserInPostgres(db.users[idx]).catch(err => console.error('PG save profile error:', err));
        }
        break;
      }

      case 'UPSERT_USER': {
        const existingIdx = db.users.findIndex(u => u.id === payload.id || u.email.toLowerCase() === payload.email?.toLowerCase());
        if (existingIdx !== -1) {
          db.users[existingIdx] = { ...db.users[existingIdx], ...payload };
        } else {
          db.users.push(payload);
        }
        upsertUserInPostgres(payload).catch(err => console.error('PG upsert user error:', err));
        break;
      }

      case 'DELETE_USER': {
        const { userId } = payload;
        db.users = db.users.filter(u => u.id !== userId);
        deleteUserInPostgres(userId).catch(err => console.error('PG delete user error:', err));
        break;
      }

      case 'DELETE_ALL_NON_ADMIN_USERS': {
        const masterDev = db.users.find(u => u.role === 'developer') || INITIAL_DEVELOPER;
        db.users = [masterDev, ...PERMANENT_SOCIAL_WORKERS];
        break;
      }

      case 'SEND_MESSAGE': {
        // Guard against duplicate message
        if (!db.messages.some(m => m.id === payload.id)) {
          db.messages.push(payload);
        }
        break;
      }

      case 'MARK_MESSAGES_READ': {
        const { currentUserId, partnerId } = payload;
        db.messages = db.messages.map(m => {
          if (m.receiverId === currentUserId && m.senderId === partnerId) {
            return { ...m, isRead: true };
          }
          return m;
        });
        break;
      }

      case 'SEND_EMERGENCY_ALERT': {
        if (!db.emergencyAlerts.some(a => a.id === payload.id)) {
          db.emergencyAlerts.unshift(payload);
          addServerAuditLog(
            'EMERGENCY_ALERT_SENT',
            `Emergency SOS alert sent by ${payload.studentName} (${payload.grade} Grade)`,
            'security',
            sourceIp
          );
        }
        break;
      }

      case 'ACKNOWLEDGE_EMERGENCY': {
        const { alertId, responseNote } = payload;
        db.emergencyAlerts = db.emergencyAlerts.map(a => {
          if (a.id === alertId) {
            return {
              ...a,
              status: 'acknowledged',
              workerResponse: responseNote || a.workerResponse
            };
          }
          return a;
        });
        break;
      }

      case 'CREATE_ASSIGNMENT': {
        if (!db.assignments.some(a => a.id === payload.id)) {
          db.assignments.unshift(payload);
          addServerAuditLog(
            'ASSIGNMENT_CREATED',
            `Created questionnaire / task "${payload.title}" for ${payload.grade} Grade`,
            'info',
            sourceIp
          );
        }
        break;
      }

      case 'SUBMIT_ASSIGNMENT': {
        const { assignmentId, submission } = payload;
        const assignment = db.assignments.find(a => a.id === assignmentId);
        if (assignment) {
          const subIdx = assignment.submissions.findIndex(s => s.id === submission.id || s.studentId === submission.studentId);
          if (subIdx !== -1) {
            assignment.submissions[subIdx] = submission;
          } else {
            assignment.submissions.push(submission);
          }
          addServerAuditLog(
            'ASSIGNMENT_SUBMITTED',
            `Student ${submission.studentName} submitted responses for "${assignment.title}"`,
            'info',
            sourceIp
          );
        }
        break;
      }

      case 'SET_DAILY_QUESTION': {
        const existingIdx = db.dailyQuestions.findIndex(q => q.grade === payload.grade);
        if (existingIdx !== -1) {
          db.dailyQuestions[existingIdx] = payload;
        } else {
          db.dailyQuestions.unshift(payload);
        }
        break;
      }

      case 'ANSWER_DAILY_QUESTION': {
        if (!db.dailyAnswers.some(a => a.id === payload.id)) {
          db.dailyAnswers.unshift(payload);
        }
        break;
      }

      case 'ADD_TODO': {
        if (!db.todos.some(t => t.id === payload.id)) {
          db.todos.unshift(payload);
        }
        saveAppSettingInPostgres('todos', db.todos).catch(err => console.error('PG save todos error:', err));
        break;
      }

      case 'TOGGLE_TODO': {
        const { todoId } = payload;
        db.todos = db.todos.map(t => t.id === todoId ? { ...t, isCompleted: !t.isCompleted } : t);
        if (!db.stoppedAlerts) db.stoppedAlerts = {};
        const targetTodo = db.todos.find(t => t.id === todoId);
        if (targetTodo?.isCompleted) {
          db.stoppedAlerts[todoId] = true;
        }
        saveAppSettingInPostgres('todos', db.todos).catch(err => console.error('PG save todos error:', err));
        saveAppSettingInPostgres('stopped_alerts', db.stoppedAlerts).catch(err => console.error('PG save stopped alerts error:', err));
        break;
      }

      case 'STOP_ALERT': {
        const { taskId } = payload;
        if (!db.stoppedAlerts) db.stoppedAlerts = {};
        db.stoppedAlerts[taskId] = true;
        saveAppSettingInPostgres('stopped_alerts', db.stoppedAlerts).catch(err => console.error('PG save stopped alerts error:', err));
        break;
      }

      case 'UNSNOOZE_ALERT': {
        const { taskId } = payload;
        if (db.stoppedAlerts && db.stoppedAlerts[taskId]) {
          delete db.stoppedAlerts[taskId];
        }
        saveAppSettingInPostgres('stopped_alerts', db.stoppedAlerts).catch(err => console.error('PG save stopped alerts error:', err));
        break;
      }

      case 'DELETE_TODO': {
        const { todoId } = payload;
        db.todos = db.todos.filter(t => t.id !== todoId);
        if (db.stoppedAlerts && db.stoppedAlerts[todoId]) {
          delete db.stoppedAlerts[todoId];
        }
        saveAppSettingInPostgres('todos', db.todos).catch(err => console.error('PG save todos error:', err));
        saveAppSettingInPostgres('stopped_alerts', db.stoppedAlerts).catch(err => console.error('PG save stopped alerts error:', err));
        break;
      }

      case 'ADD_ANNOUNCEMENT': {
        if (!db.announcements.some(a => a.id === payload.id)) {
          db.announcements.unshift(payload);
        }
        break;
      }

      case 'DELETE_ANNOUNCEMENT': {
        const { announcementId } = payload;
        db.announcements = db.announcements.filter(a => a.id !== announcementId);
        break;
      }

      case 'ADD_WELLNESS_TIP': {
        if (!db.wellnessTips.some(t => t.id === payload.id)) {
          db.wellnessTips.unshift(payload);
        }
        break;
      }

      case 'UPDATE_WELLNESS_TIP': {
        const { id, updates } = payload;
        db.wellnessTips = db.wellnessTips.map(t => t.id === id ? { ...t, ...updates } : t);
        break;
      }

      case 'DELETE_WELLNESS_TIP': {
        const { id } = payload;
        db.wellnessTips = db.wellnessTips.filter(t => t.id !== id);
        break;
      }

      case 'ADD_KUDOS': {
        if (!db.kudosPosts.some(k => k.id === payload.id)) {
          db.kudosPosts.unshift(payload);
        }
        break;
      }

      case 'LIKE_KUDOS': {
        const { kudosId, userId } = payload;
        db.kudosPosts = db.kudosPosts.map(k => {
          if (k.id === kudosId) {
            const hasLiked = k.likedBy.includes(userId);
            const likedBy = hasLiked ? k.likedBy.filter(id => id !== userId) : [...k.likedBy, userId];
            return {
              ...k,
              likedBy,
              likesCount: likedBy.length
            };
          }
          return k;
        });
        break;
      }

      case 'ADD_JOURNAL_ENTRY': {
        if (!db.journalEntries.some(j => j.id === payload.id)) {
          db.journalEntries.unshift(payload);
        }
        break;
      }

      case 'DELETE_JOURNAL_ENTRY': {
        const { id } = payload;
        db.journalEntries = db.journalEntries.filter(j => j.id !== id);
        break;
      }

      case 'ADD_MOOD_LOG': {
        if (!db.moodLogs.some(m => m.id === payload.id)) {
          db.moodLogs.unshift(payload);
        }
        break;
      }

      case 'RESET_DATABASE': {
        const fresh = createDefaultDatabase();
        Object.assign(db, fresh);
        break;
      }

      case 'IMPORT_DATABASE': {
        if (payload && Array.isArray(payload.users)) {
          Object.assign(db, payload);
          db.version = (db.version || 0) + 1;
        }
        break;
      }

      case 'ADD_AUDIT_LOG': {
        if (!db.auditLogs.some(a => a.id === payload.id)) {
          db.auditLogs.unshift(payload);
          if (db.auditLogs.length > 500) {
            db.auditLogs = db.auditLogs.slice(0, 500);
          }
        }
        break;
      }

      case 'CREATE_TIMETABLE_SESSION': {
        if (!db.timetables.some(s => s.id === payload.id)) {
          db.timetables.unshift(payload);
        }
        break;
      }

      case 'CREATE_WELLNESS_LESSON': {
        if (!db.wellnessLessons.some(l => l.id === payload.id)) {
          db.wellnessLessons.unshift(payload);
        }
        break;
      }

      case 'ADD_DISCUSSION_POST': {
        if (!db.discussionPosts.some(p => p.id === payload.id)) {
          db.discussionPosts.unshift(payload);
        }
        break;
      }

      default:
        console.warn('Unknown state mutation action:', action);
        return { success: false, error: `Unknown action: ${action}` };
    }

    // Persist changes to disk
    saveDatabase(db);

    // Broadcast mutation to all connected clients
    broadcast({
      type: 'REMOTE_ACTION',
      action,
      payload,
      version: db.version,
      timestamp: new Date().toISOString()
    }, senderWs);

    return { success: true };
  } catch (err: any) {
    console.error(`Mutation error for ${action}:`, err);
    return { success: false, error: err.message };
  }
}

function addServerAuditLog(
  action: any,
  details: string,
  severity: 'info' | 'warning' | 'security' | 'success' = 'info',
  ip: string = 'server'
) {
  const entry: AuditLogEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    timestamp: new Date().toISOString(),
    userId: 'system-server',
    userName: 'ASYV Central Backend',
    userRole: 'developer',
    grade: 'Ingabe',
    action,
    details,
    severity,
    ipOrDevice: ip
  };
  db.auditLogs.unshift(entry);
  if (db.auditLogs.length > 500) {
    db.auditLogs = db.auditLogs.slice(0, 500);
  }
  insertAuditLogInPostgres(entry).catch(err => console.error('PG save audit log error:', err));
}

// REST API Endpoints

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: db.version,
    lastUpdated: db.lastUpdated,
    connectedClients: wss.clients.size,
    totalUsers: db.users.length,
    environment: isProd ? 'production' : 'development'
  });
});

// Full state retrieval for bootstrapping client on any device/location
app.get('/api/state', (req, res) => {
  res.json({
    success: true,
    version: db.version,
    lastUpdated: db.lastUpdated,
    data: db
  });
});

// Generic mutation endpoint
app.post('/api/mutate', (req, res) => {
  const { action, payload } = req.body;
  if (!action) {
    return res.status(400).json({ success: false, error: 'Missing action parameter' });
  }

  const clientIp = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || 'unknown';
  const result = handleStateMutation(action, payload, undefined, clientIp);

  if (result.success) {
    return res.json({
      success: true,
      version: db.version,
      lastUpdated: db.lastUpdated
    });
  } else {
    return res.status(500).json({ success: false, error: result.error });
  }
});

// Dedicated endpoints for convenient RPC
app.post('/api/contacts', (req, res) => {
  const clientIp = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || 'unknown';
  const result = handleStateMutation('UPDATE_CONTACT_INFO', req.body, undefined, clientIp);
  res.json({ success: result.success, contactInfo: db.contactInfo });
});

app.post('/api/customization', (req, res) => {
  const clientIp = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || 'unknown';
  const result = handleStateMutation('UPDATE_APP_CUSTOMIZATION', req.body, undefined, clientIp);
  res.json({ success: result.success, appCustomization: db.appCustomization });
});

// Dedicated endpoint to upload and automatically change the welcoming front page photo
app.post('/api/upload-hero-image', (req, res) => {
  try {
    const { imageBase64, filename } = req.body;
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ success: false, error: 'No image provided' });
    }

    let targetUrl = imageBase64;

    // If it is a base64 data URL, write binary buffer to public/uploads/ for permanent HTTP serving
    if (imageBase64.startsWith('data:image/')) {
      try {
        const matches = imageBase64.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        if (matches) {
          const rawExt = matches[1].toLowerCase();
          const ext = rawExt.includes('jpeg') ? 'jpg' : rawExt.includes('svg') ? 'svg' : rawExt.includes('png') ? 'png' : 'webp';
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, 'base64');
          const uploadsDir = path.resolve(__dirname, 'public', 'uploads');
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
          const savedFileName = `welcome_hero_${Date.now()}.${ext}`;
          const filePath = path.join(uploadsDir, savedFileName);
          fs.writeFileSync(filePath, buffer);
          targetUrl = `/uploads/${savedFileName}`;
        }
      } catch (fileErr) {
        console.warn('Could not save image file to disk, retaining data URL:', fileErr);
      }
    }

    // Persist to central in-memory and disk database
    db.appCustomization = {
      ...db.appCustomization,
      strategicPlanImageUrl: targetUrl
    };

    saveDatabase(db);
    saveAppSettingInPostgres('app_customization', db.appCustomization).catch(e => console.error('PG save err:', e));

    const clientIp = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || 'unknown';
    addServerAuditLog(
      'APP_CUSTOMIZED',
      `Admin uploaded and automatically updated the front page welcome photo permanently (${targetUrl})`,
      'info',
      clientIp
    );

    // Broadcast immediately over WebSocket to all open tabs and devices worldwide
    broadcast({
      type: 'REMOTE_ACTION',
      action: 'UPDATE_APP_CUSTOMIZATION',
      payload: db.appCustomization,
      version: db.version,
      timestamp: new Date().toISOString()
    });

    return res.json({
      success: true,
      imageUrl: targetUrl,
      appCustomization: db.appCustomization
    });
  } catch (err: any) {
    console.error('Error handling hero image upload:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/users', (req, res) => {
  const clientIp = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || 'unknown';
  const result = handleStateMutation('UPSERT_USER', req.body, undefined, clientIp);
  res.json({ success: result.success, usersCount: db.users.length });
});

app.post('/api/messages', (req, res) => {
  const clientIp = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || 'unknown';
  const result = handleStateMutation('SEND_MESSAGE', req.body, undefined, clientIp);
  res.json({ success: result.success });
});

app.post('/api/alerts', (req, res) => {
  const clientIp = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || 'unknown';
  const result = handleStateMutation('SEND_EMERGENCY_ALERT', req.body, undefined, clientIp);
  res.json({ success: result.success });
});

app.post('/api/assignments/:id/submit', (req, res) => {
  const clientIp = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || 'unknown';
  const result = handleStateMutation('SUBMIT_ASSIGNMENT', {
    assignmentId: req.params.id,
    submission: req.body
  }, undefined, clientIp);
  res.json({ success: result.success });
});

// Export Database JSON
app.get('/api/admin/export', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="asyv_central_database.json"');
  res.send(JSON.stringify(db, null, 2));
});

// Import Database JSON
app.post('/api/admin/import', (req, res) => {
  const clientIp = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || 'unknown';
  const result = handleStateMutation('IMPORT_DATABASE', req.body, undefined, clientIp);
  res.json({ success: result.success });
});

// Reset Database to Fresh State
app.post('/api/admin/reset', (req, res) => {
  const clientIp = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || 'unknown';
  const result = handleStateMutation('RESET_DATABASE', {}, undefined, clientIp);
  res.json({ success: result.success });
});

// Vite middleware in dev or static files in production
async function setupFrontend() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted in development mode');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log('Serving production build from /dist');
  }
}

// Start server listening on all network interfaces (0.0.0.0)
setupFrontend().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🚀 ASYV Mind Bridge Central Server Running`);
    console.log(`📍 Port: ${PORT} (0.0.0.0 - Accessible from all devices)`);
    console.log(`💾 Persistent DB: ${DB_FILE}`);
    console.log(`📡 WebSocket Path: /ws (Real-time synchronization)`);
    console.log(`🌐 Mode: ${isProd ? 'Production' : 'Development'}`);
    console.log(`=======================================================`);
  });
});
