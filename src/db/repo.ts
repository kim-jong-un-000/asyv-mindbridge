import { eq, desc } from 'drizzle-orm';
import { db } from './index.ts';
import {
  users,
  announcements,
  assignments,
  dailyQuestions,
  dailyAnswers,
  messages,
  emergencyAlerts,
  moodLogs,
  journalEntries,
  todos,
  wellnessLessons,
  timetableSessions,
  wellnessTips,
  discussionPosts,
  kudosPosts,
  auditLogs,
  appSettings
} from './schema.ts';

/**
 * Robust Two-Layer Error Handling repository for ASYV Mind Bridge PostgreSQL database.
 */

export async function fetchFullPostgresState() {
  try {
    const [
      allUsers,
      allAnnouncements,
      allAssignments,
      allDailyQuestions,
      allDailyAnswers,
      allMessages,
      allEmergencyAlerts,
      allMoodLogs,
      allJournalEntries,
      allTodos,
      allWellnessLessons,
      allTimetables,
      allWellnessTips,
      allDiscussions,
      allKudos,
      allAuditLogs,
      allSettings
    ] = await Promise.all([
      db.select().from(users),
      db.select().from(announcements),
      db.select().from(assignments),
      db.select().from(dailyQuestions),
      db.select().from(dailyAnswers),
      db.select().from(messages),
      db.select().from(emergencyAlerts),
      db.select().from(moodLogs),
      db.select().from(journalEntries),
      db.select().from(todos),
      db.select().from(wellnessLessons),
      db.select().from(timetableSessions),
      db.select().from(wellnessTips),
      db.select().from(discussionPosts),
      db.select().from(kudosPosts),
      db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp)).limit(300),
      db.select().from(appSettings)
    ]);

    // Parse app settings
    let contactInfo: any = null;
    let appCustomization: any = null;
    let stoppedAlerts: any = null;
    let pgTodos: any = null;
    for (const setting of allSettings) {
      if (setting.key === 'village_contacts') contactInfo = setting.value;
      if (setting.key === 'app_customization') appCustomization = setting.value;
      if (setting.key === 'stopped_alerts') stoppedAlerts = setting.value;
      if (setting.key === 'todos' && Array.isArray(setting.value)) pgTodos = setting.value;
    }

    return {
      users: allUsers.map(u => ({
        id: u.uid || String(u.id),
        name: u.name,
        familyName: u.familyName || undefined,
        email: u.email,
        role: u.role as any,
        grade: u.grade as any,
        schoolClass: u.schoolClass || undefined,
        avatar: u.avatar || '/asyv_emblem.svg',
        password: u.password || undefined,
        registeredAt: u.registeredAt,
        isPermanent: u.isPermanent || false,
        isRestricted: u.isRestricted || false,
        lastActive: u.lastActive || undefined
      })),
      announcements: allAnnouncements,
      assignments: allAssignments,
      dailyQuestions: allDailyQuestions,
      dailyAnswers: allDailyAnswers,
      messages: allMessages,
      emergencyAlerts: allEmergencyAlerts,
      moodLogs: allMoodLogs,
      journalEntries: allJournalEntries,
      todos: pgTodos && pgTodos.length > 0 ? pgTodos : allTodos,
      wellnessLessons: allWellnessLessons,
      timetables: allTimetables,
      wellnessTips: allWellnessTips,
      discussionPosts: allDiscussions,
      kudosPosts: allKudos,
      auditLogs: allAuditLogs,
      contactInfo,
      appCustomization,
      stoppedAlerts
    };
  } catch (error) {
    console.error('PostgreSQL fetchFullPostgresState error:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function upsertUserInPostgres(userData: any) {
  try {
    const uid = userData.id || userData.uid || `user-${Date.now()}`;
    await db.insert(users)
      .values({
        uid,
        email: userData.email,
        name: userData.name,
        familyName: userData.familyName || null,
        role: userData.role,
        grade: userData.grade,
        schoolClass: userData.schoolClass || null,
        avatar: userData.avatar || null,
        password: userData.password || null,
        registeredAt: userData.registeredAt || new Date().toISOString(),
        isPermanent: userData.isPermanent || false,
        isRestricted: userData.isRestricted || false,
        lastActive: userData.lastActive || new Date().toISOString()
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          name: userData.name,
          familyName: userData.familyName || null,
          role: userData.role,
          grade: userData.grade,
          schoolClass: userData.schoolClass || null,
          avatar: userData.avatar || null,
          password: userData.password || null,
          isPermanent: userData.isPermanent || false,
          isRestricted: userData.isRestricted || false,
          lastActive: userData.lastActive || new Date().toISOString()
        }
      });
  } catch (error) {
    console.error('Failed to upsert user in PostgreSQL:', error);
    throw new Error('Failed to save user record.', { cause: error });
  }
}

export async function deleteUserInPostgres(userId: string) {
  try {
    await db.delete(users).where(eq(users.uid, userId));
  } catch (error) {
    console.error('Failed to delete user in PostgreSQL:', error);
    throw new Error('Failed to delete user record.', { cause: error });
  }
}

export async function insertAuditLogInPostgres(entry: any) {
  try {
    await db.insert(auditLogs).values({
      id: entry.id,
      action: entry.action,
      details: entry.details,
      category: entry.category,
      timestamp: entry.timestamp,
      userId: entry.userId || null,
      userName: entry.userName || null
    }).onConflictDoNothing();
  } catch (error) {
    console.error('Failed to insert audit log in PostgreSQL:', error);
  }
}

export async function saveAppSettingInPostgres(key: string, value: any) {
  try {
    await db.insert(appSettings).values({
      key,
      value,
      updatedAt: new Date().toISOString()
    }).onConflictDoUpdate({
      target: appSettings.key,
      set: {
        value,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error(`Failed to save setting ${key} in PostgreSQL:`, error);
  }
}
