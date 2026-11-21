import { boolean, integer, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  familyName: text('family_name'),
  role: text('role').notNull(),
  grade: text('grade').notNull(),
  schoolClass: text('school_class'),
  avatar: text('avatar'),
  password: text('password'),
  registeredAt: text('registered_at').notNull(),
  isPermanent: boolean('is_permanent').default(false),
  isRestricted: boolean('is_restricted').default(false),
  lastActive: text('last_active'),
  createdAt: timestamp('created_at').defaultNow()
});

export const announcements = pgTable('announcements', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: text('author_id').notNull(),
  authorName: text('author_name').notNull(),
  authorRole: text('author_role').notNull(),
  grade: text('grade').notNull(),
  category: text('category').notNull(),
  priority: text('priority').notNull(),
  createdAt: text('created_at').notNull(),
  expiresAt: text('expires_at')
});

export const assignments = pgTable('assignments', {
  id: text('id').primaryKey(),
  studentId: text('student_id').notNull(),
  studentName: text('student_name').notNull(),
  workerId: text('worker_id').notNull(),
  workerName: text('worker_name').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  dueDate: text('due_date').notNull(),
  completed: boolean('completed').default(false),
  score: integer('score'),
  feedback: text('feedback'),
  assignedAt: text('assigned_at').notNull()
});

export const dailyQuestions = pgTable('daily_questions', {
  id: text('id').primaryKey(),
  grade: text('grade').notNull(),
  questionText: text('question_text').notNull(),
  category: text('category').notNull(),
  date: text('date').notNull(),
  createdByWorkerId: text('created_by_worker_id').notNull(),
  createdByWorkerName: text('created_by_worker_name').notNull(),
  active: boolean('active').default(true)
});

export const dailyAnswers = pgTable('daily_answers', {
  id: text('id').primaryKey(),
  questionId: text('question_id').notNull(),
  studentId: text('student_id').notNull(),
  studentName: text('student_name').notNull(),
  grade: text('grade').notNull(),
  answerText: text('answer_text').notNull(),
  mood: text('mood'),
  reflection: text('reflection'),
  answeredAt: text('answered_at').notNull()
});

export const messages = pgTable('messages', {
  id: text('id').primaryKey(),
  senderId: text('sender_id').notNull(),
  senderName: text('sender_name').notNull(),
  senderRole: text('sender_role').notNull(),
  recipientId: text('recipient_id').notNull(),
  grade: text('grade').notNull(),
  text: text('text').notNull(),
  timestamp: text('timestamp').notNull(),
  isConfidential: boolean('is_confidential').default(true),
  isFlagged: boolean('is_flagged').default(false)
});

export const emergencyAlerts = pgTable('emergency_alerts', {
  id: text('id').primaryKey(),
  studentId: text('student_id').notNull(),
  studentName: text('student_name').notNull(),
  grade: text('grade').notNull(),
  alertType: text('alert_type').notNull(),
  note: text('note'),
  timestamp: text('timestamp').notNull(),
  status: text('status').notNull(),
  resolvedBy: text('resolved_by'),
  resolvedAt: text('resolved_at')
});

export const moodLogs = pgTable('mood_logs', {
  id: text('id').primaryKey(),
  studentId: text('student_id').notNull(),
  studentName: text('student_name').notNull(),
  grade: text('grade').notNull(),
  mood: text('mood').notNull(),
  energyLevel: integer('energy_level').default(3),
  note: text('note'),
  date: text('date').notNull(),
  timestamp: text('timestamp').notNull()
});

export const journalEntries = pgTable('journal_entries', {
  id: text('id').primaryKey(),
  studentId: text('student_id').notNull(),
  studentName: text('student_name').notNull(),
  grade: text('grade').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  emotionalTag: text('emotional_tag'),
  isPrivate: boolean('is_private').default(true),
  createdAt: text('created_at').notNull()
});

export const todos = pgTable('todos', {
  id: text('id').primaryKey(),
  workerId: text('worker_id').notNull(),
  title: text('title').notNull(),
  priority: text('priority').notNull(),
  dueDate: text('due_date'),
  completed: boolean('completed').default(false),
  category: text('category').notNull(),
  createdAt: text('created_at').notNull()
});

export const wellnessLessons = pgTable('wellness_lessons', {
  id: text('id').primaryKey(),
  workerId: text('worker_id').notNull(),
  title: text('title').notNull(),
  grade: text('grade').notNull(),
  targetDate: text('target_date').notNull(),
  objectives: text('objectives'),
  materials: text('materials'),
  durationMinutes: integer('duration_minutes').default(45),
  notes: text('notes'),
  status: text('status').default('planned'),
  createdAt: text('created_at').notNull()
});

export const timetableSessions = pgTable('timetable_sessions', {
  id: text('id').primaryKey(),
  workerId: text('worker_id').notNull(),
  dayOfWeek: text('day_of_week').notNull(),
  timeSlot: text('time_slot').notNull(),
  grade: text('grade').notNull(),
  topic: text('topic').notNull(),
  activityType: text('activity_type').notNull(),
  location: text('location').notNull(),
  notes: text('notes')
});

export const wellnessTips = pgTable('wellness_tips', {
  id: text('id').primaryKey(),
  workerId: text('worker_id').notNull(),
  workerName: text('worker_name').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  grade: text('grade').notNull(),
  actionItem: text('action_item'),
  createdAt: text('created_at').notNull()
});

export const discussionPosts = pgTable('discussion_posts', {
  id: text('id').primaryKey(),
  authorId: text('author_id').notNull(),
  authorName: text('author_name').notNull(),
  authorRole: text('author_role').notNull(),
  grade: text('grade').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: text('category').notNull(),
  likes: integer('likes').default(0),
  replies: jsonb('replies').default([]),
  createdAt: text('created_at').notNull()
});

export const kudosPosts = pgTable('kudos_posts', {
  id: text('id').primaryKey(),
  authorId: text('author_id').notNull(),
  authorName: text('author_name').notNull(),
  recipientId: text('recipient_id').notNull(),
  recipientName: text('recipient_name').notNull(),
  grade: text('grade').notNull(),
  message: text('message').notNull(),
  category: text('category').notNull(),
  createdAt: text('created_at').notNull()
});

export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  action: text('action').notNull(),
  details: text('details').notNull(),
  category: text('category').notNull(),
  timestamp: text('timestamp').notNull(),
  userId: text('user_id'),
  userName: text('user_name')
});

export const appSettings = pgTable('app_settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
  updatedAt: text('updated_at').notNull()
});
