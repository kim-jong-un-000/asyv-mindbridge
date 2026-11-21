import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Grade, Announcement, WellnessTip, AssignmentQuestion, AsyvColorKey } from '../../types';
import { ASYV_COLOR_PALETTES } from '../../data/initialData';
import {
  ShieldCheck,
  Users,
  Edit,
  Trash2,
  CheckCircle2,
  Search,
  Save,
  X,
  LogOut,
  Calendar,
  Sparkles,
  Database,
  Phone,
  Bell,
  BookOpen,
  Plus,
  FileCheck2,
  HelpCircle,
  AlertOctagon,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
  KeyRound,
  Mail,
  MapPin,
  Clock,
  Send,
  UserPlus,
  FileSpreadsheet,
  Copy,
  Info,
  FileText,
  UserCheck,
  Check,
  Camera,
  Loader2
} from 'lucide-react';
import { AuditLogView } from './AuditLogView';

const GRADES: Grade[] = ['Ingabe', 'Ingabo', 'Ijabo'];

type AdminTab =
  | 'overview'
  | 'students'
  | 'customization'
  | 'audit'
  | 'contacts'
  | 'announcements'
  | 'tips'
  | 'assignments'
  | 'daily-questions'
  | 'sos';

export const DevConsole: React.FC = () => {
  const {
    currentUser,
    users,
    updateUser,
    deleteUser,
    createStudentByAdmin,
    approveMentalChampion,
    rejectMentalChampion,
    logout,
    contactInfo,
    updateContactInfo,
    announcements,
    addAnnouncement,
    deleteAnnouncement,
    toggleAnnouncementActive,
    wellnessTips,
    addWellnessTip,
    updateWellnessTip,
    deleteWellnessTip,
    assignments,
    createAssignment,
    dailyQuestions,
    dailyAnswers,
    setDailyQuestion,
    emergencyAlerts,
    acknowledgeEmergency,
    exportDatabaseJson,
    importDatabaseJson,
    clearSampleDataToCleanState,
    restoreSampleData,
    impersonateUser,
    auditLogs,
    addAuditLog,
    appCustomization,
    updateAppCustomization,
    resetAppCustomization,
    deleteAllNonAdminUsers,
    resetUserPassword,
    createSocialWorkerByAdmin,
    kudosPosts,
    deleteKudosPost,
    todos,
    toggleTodo,
    addTodo,
    stopAlert,
    isAlertActive
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Modals
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [showRestoreConfirmModal, setShowRestoreConfirmModal] = useState(false);
  const [showPurgeAllUsersModal, setShowPurgeAllUsersModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Admin Alert Task Form State
  const [showAdminQuickTask, setShowAdminQuickTask] = useState(false);
  const [adminTaskTitle, setAdminTaskTitle] = useState('');
  const [adminTaskPriority, setAdminTaskPriority] = useState<'low' | 'medium' | 'high'>('high');
  const [adminTaskDueDate, setAdminTaskDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });

  // Portal Customization Form States
  const [customMotto, setCustomMotto] = useState(appCustomization?.schoolMotto || 'LEARN, ADAPT AND LEAD');
  const [customSubMotto, setCustomSubMotto] = useState(appCustomization?.schoolSubMotto || 'Ingabe · Ingabo · Ijabo');
  const [customPortalTitle, setCustomPortalTitle] = useState(appCustomization?.portalTitle || 'Mind Bridge');
  const [customPortalSubtitle, setCustomPortalSubtitle] = useState(appCustomization?.portalSubtitle || 'The Agahozo Shalom Youth Village Psychosocial Platform');
  const [customWelcomeTitle, setCustomWelcomeTitle] = useState(appCustomization?.welcomeBannerTitle || 'Do you need any help from {workerName}, 💁‍♂️?');
  const [customWelcomeSubtitle, setCustomWelcomeSubtitle] = useState(appCustomization?.welcomeBannerSubtitle || 'Your Grade social worker is available right now for confidential listening, academic support, or personal guidance.');
  const [customLoginNotice, setCustomLoginNotice] = useState(appCustomization?.loginNotice || 'Restricted Official Village Care Network · Authorized access only');
  const [customFooterTagline, setCustomFooterTagline] = useState(appCustomization?.footerTagline || 'made to support the ASYV social workers support!');
  const [customAllowStudentReg, setCustomAllowStudentReg] = useState(appCustomization?.allowPublicStudentRegistration ?? false);
  const [customAllowWorkerReg, setCustomAllowWorkerReg] = useState(appCustomization?.allowPublicWorkerRegistration ?? false);
  const [customInspiringQuote, setCustomInspiringQuote] = useState(appCustomization?.customInspirationalQuote || 'If you see far, you will go far. Every child deserves a place to heal, grow, and become a leader.');
  const [customQuoteAuthor, setCustomQuoteAuthor] = useState(appCustomization?.customQuoteAuthor || 'Anne Heyman, ASYV Founder');
  const [customPalette, setCustomPalette] = useState<AsyvColorKey>(appCustomization?.activeAsyvPalette || 'forest');

  // Welcoming Front Page Customizer States
  const [customWelcomeHeroTitle, setCustomWelcomeHeroTitle] = useState(appCustomization?.welcomeHeroTitle || 'Welcome to Mind Bridge');
  const [customWelcomeHeroSubtitle, setCustomWelcomeHeroSubtitle] = useState(appCustomization?.welcomeHeroSubtitle || 'Where Every ASYV Youth Heals, Grows, and Becomes a Leader');
  const [customWelcomeHeroDescription, setCustomWelcomeHeroDescription] = useState(
    appCustomization?.welcomeHeroDescription ||
    'A dedicated psychosocial space connecting students, Grade Social Workers, and Peer Mental Champions across Senior 4 Ingabe, Senior 5 Ingabo, and Senior 6 Ijabo. Confidential care, daily mood tracking, peer support circles, and 24/7 village protection.'
  );
  const [customStrategicPlanTag, setCustomStrategicPlanTag] = useState(appCustomization?.strategicPlanTag || 'ASYV Strategic Vision');
  const [customStrategicPlanTitle, setCustomStrategicPlanTitle] = useState(appCustomization?.strategicPlanTitle || 'Fostering Healing, Self-Sufficiency, and Sustainability');
  const [customStrategicPlanDescription, setCustomStrategicPlanDescription] = useState(
    appCustomization?.strategicPlanDescription ||
    'Celebrating youth empowerment, healing hearts, and building bright futures across Rwanda.'
  );
  const [customStrategicPlanImage, setCustomStrategicPlanImage] = useState<string>(
    appCustomization?.strategicPlanImageUrl || '/assets/aistudio/download_954a9c9b.jpg'
  );
  const [customPortalLogoImage, setCustomPortalLogoImage] = useState<string>(
    appCustomization?.portalLogoImageUrl || '/assets/aistudio/download_9de94bb3.png'
  );

  // Keep local customizer form state synced when database appCustomization arrives
  React.useEffect(() => {
    if (appCustomization) {
      setCustomAllowStudentReg(appCustomization.allowPublicStudentRegistration ?? false);
      setCustomAllowWorkerReg(appCustomization.allowPublicWorkerRegistration ?? false);
      if (appCustomization.schoolMotto) setCustomMotto(appCustomization.schoolMotto);
      if (appCustomization.schoolSubMotto) setCustomSubMotto(appCustomization.schoolSubMotto);
      if (appCustomization.portalTitle) setCustomPortalTitle(appCustomization.portalTitle);
      if (appCustomization.portalSubtitle) setCustomPortalSubtitle(appCustomization.portalSubtitle);
      if (appCustomization.activeAsyvPalette) setCustomPalette(appCustomization.activeAsyvPalette);
      if (appCustomization.welcomeHeroTitle) setCustomWelcomeHeroTitle(appCustomization.welcomeHeroTitle);
      if (appCustomization.welcomeHeroSubtitle) setCustomWelcomeHeroSubtitle(appCustomization.welcomeHeroSubtitle);
      if (appCustomization.welcomeHeroDescription) setCustomWelcomeHeroDescription(appCustomization.welcomeHeroDescription);
      if (appCustomization.strategicPlanTag) setCustomStrategicPlanTag(appCustomization.strategicPlanTag);
      if (appCustomization.strategicPlanTitle) setCustomStrategicPlanTitle(appCustomization.strategicPlanTitle);
      if (appCustomization.strategicPlanDescription) setCustomStrategicPlanDescription(appCustomization.strategicPlanDescription);
      if (appCustomization.strategicPlanImageUrl) setCustomStrategicPlanImage(appCustomization.strategicPlanImageUrl);
      if (appCustomization.portalLogoImageUrl) setCustomPortalLogoImage(appCustomization.portalLogoImageUrl);
      if (appCustomization.customInspirationalQuote) setCustomInspiringQuote(appCustomization.customInspirationalQuote);
      if (appCustomization.customQuoteAuthor) setCustomQuoteAuthor(appCustomization.customQuoteAuthor);
    }
  }, [appCustomization]);

  // Automatic Real-Time Image Upload States and Handlers
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [heroDirectUrlInput, setHeroDirectUrlInput] = useState('');

  const handleAutoUploadFeaturedPhoto = async (file: File) => {
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      alert('Selected photo is too large. Please select an image under 15MB.');
      return;
    }
    setIsUploadingHero(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const dataUrl = evt.target?.result as string;
      if (!dataUrl) {
        setIsUploadingHero(false);
        return;
      }

      // 1. Instantly update local preview & AppContext so change shows immediately
      setCustomStrategicPlanImage(dataUrl);
      updateAppCustomization({ strategicPlanImageUrl: dataUrl });

      // 2. Persist to server /public/uploads/ & Cloud SQL, and broadcast over WebSocket
      try {
        const response = await fetch('/api/upload-hero-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: dataUrl, filename: file.name })
        });
        const res = await response.json();
        if (res.success && res.imageUrl) {
          setCustomStrategicPlanImage(res.imageUrl);
          updateAppCustomization({ strategicPlanImageUrl: res.imageUrl });
        }
        showToast('✓ Picture uploaded & automatically changed across the front welcoming page!');
      } catch (err) {
        console.warn('Network upload fallback:', err);
        showToast('✓ Picture updated live on front page!');
      } finally {
        setIsUploadingHero(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAutoResetFeaturedPhoto = async () => {
    const originalUrl = '/assets/aistudio/download_954a9c9b.jpg';
    setCustomStrategicPlanImage(originalUrl);
    setHeroDirectUrlInput('');
    updateAppCustomization({ strategicPlanImageUrl: originalUrl });
    try {
      await fetch('/api/customization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategicPlanImageUrl: originalUrl })
      });
    } catch (e) {}
    showToast('✓ Restored original graduation celebration photo automatically!');
  };

  const handleAutoApplyPhotoUrl = async (urlToApply: string) => {
    const trimmed = urlToApply.trim();
    if (!trimmed) return;
    setCustomStrategicPlanImage(trimmed);
    updateAppCustomization({ strategicPlanImageUrl: trimmed });
    try {
      await fetch('/api/customization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategicPlanImageUrl: trimmed })
      });
    } catch (e) {}
    showToast('✓ Front page picture updated live from URL automatically!');
  };

  // Editing User Form States
  const [editName, setEditName] = useState('');
  const [editFamilyName, setEditFamilyName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editGrade, setEditGrade] = useState<Grade>('Ingabe');
  const [editClass, setEditClass] = useState('');
  const [editPassword, setEditPassword] = useState('');

  // Add Student Form States
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentFamilyName, setNewStudentFamilyName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState<Grade>('Ingabe');
  const [newStudentClass, setNewStudentClass] = useState('Senior 4 MEG');
  const [newStudentPassword, setNewStudentPassword] = useState('asyv2028');

  // Password Recovery, Dossier & Staff Creation States
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [resettingUserPassword, setResettingUserPassword] = useState<User | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [selectedDossierUser, setSelectedDossierUser] = useState<User | null>(null);
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);

  // Add Worker Form States
  const [newWorkerName, setNewWorkerName] = useState('');
  const [newWorkerEmail, setNewWorkerEmail] = useState('');
  const [newWorkerGrade, setNewWorkerGrade] = useState<Grade>('Ingabe');
  const [newWorkerPassword, setNewWorkerPassword] = useState('worker@asyv26');
  const [newWorkerPhone, setNewWorkerPhone] = useState('+250 788 000 000');
  const [newWorkerBio, setNewWorkerBio] = useState('');

  // Village Contact Info Form States
  const [contactOffice, setContactOffice] = useState(contactInfo.officeLocation);
  const [contactHours, setContactHours] = useState(contactInfo.officeHours);
  const [contactHotline, setContactHotline] = useState(contactInfo.hotlinePhone);
  const [contactWhatsapp, setContactWhatsapp] = useState(contactInfo.whatsappPhone);
  const [contactEmail, setContactEmail] = useState(contactInfo.emergencyEmail);
  const [contactClinic, setContactClinic] = useState(contactInfo.clinicExtension);
  const [contactLead, setContactLead] = useState(contactInfo.counselorLead);
  const [contactNotice, setContactNotice] = useState(contactInfo.additionalNotice);

  // New Announcement Form States
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnCategory, setNewAnnCategory] = useState<Announcement['category']>('wellness');
  const [newAnnGrade, setNewAnnGrade] = useState<string>('all');

  // New Tip Form States
  const [newTipCategory, setNewTipCategory] = useState<WellnessTip['category']>('study');
  const [newTipTitle, setNewTipTitle] = useState('');
  const [newTipSummary, setNewTipSummary] = useState('');
  const [newTipActionable, setNewTipActionable] = useState('');
  const [newTipAuthor, setNewTipAuthor] = useState('ASYV Counseling Desk');

  // New Assignment Form States
  const [newAssignTitle, setNewAssignTitle] = useState('');
  const [newAssignInstructions, setNewAssignInstructions] = useState('');
  const [newAssignGrade, setNewAssignGrade] = useState<Grade>('Ingabe');
  const [newAssignDueDate, setNewAssignDueDate] = useState('2026-10-25');
  const [newAssignQuestions, setNewAssignQuestions] = useState<AssignmentQuestion[]>([
    {
      id: 'q1',
      type: 'multiple_choice',
      prompt: 'How often do you feel overwhelmed by your schoolwork or village responsibilities?',
      options: ['Rarely or never', 'Sometimes during test weeks', 'Frequently', 'Almost every day'],
      correctOptionIndex: 0
    },
    {
      id: 'q2',
      type: 'open_ended',
      prompt: 'What is one specific positive coping strategy you would like to develop this semester?'
    }
  ]);

  // Daily Question Form States
  const [selectedDqGrade, setSelectedDqGrade] = useState<Grade>('Ingabe');
  const currentDq = dailyQuestions.find(d => d.grade === selectedDqGrade);
  const [dqPrompt, setDqPrompt] = useState(currentDq?.question || '');
  const [dqNote, setDqNote] = useState(currentDq?.contextNote || '');

  // SOS Response
  const [respondingAlertId, setRespondingAlertId] = useState<string | null>(null);
  const [sosResponseNote, setSosResponseNote] = useState('');

  if (!currentUser || currentUser.role !== 'developer') return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const matchesSearch = `${u.name} ${u.familyName || ''} ${u.email} ${u.schoolClass || ''}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesGrade = gradeFilter === 'all' || u.grade === gradeFilter;
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesGrade && matchesRole;
  });

  const studentsCount = users.filter(u => u.role === 'student').length;
  const workersCount = users.filter(u => u.role === 'social_worker').length;
  const championsCount = users.filter(u => u.isMentalChampion || u.championStatus === 'approved').length;
  const pendingChampionsCount = users.filter(u => u.championStatus === 'pending').length;
  const activeSosCount = emergencyAlerts.filter(a => a.status === 'active').length;

  const handleStartEdit = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditFamilyName(user.familyName || '');
    setEditEmail(user.email);
    setEditGrade(user.grade);
    setEditClass(user.schoolClass || '');
    setEditPassword(user.password || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    updateUser(editingUser.id, {
      name: editName.trim(),
      familyName: editFamilyName.trim() || undefined,
      email: editEmail.trim(),
      grade: editGrade,
      schoolClass: editClass.trim() || undefined,
      password: editPassword.trim() || editingUser.password
    });

    setEditingUser(null);
    showToast(`Updated account for ${editName} successfully!`);
  };

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = createStudentByAdmin({
      name: newStudentName,
      familyName: newStudentFamilyName,
      email: newStudentEmail,
      grade: newStudentGrade,
      schoolClass: newStudentClass,
      password: newStudentPassword
    });

    if (res.success) {
      setShowAddStudentModal(false);
      setNewStudentName('');
      setNewStudentFamilyName('');
      setNewStudentEmail('');
      showToast(`Student ${newStudentName} registered directly in ${newStudentGrade} grade!`);
    } else {
      alert(res.error || 'Failed to create student');
    }
  };

  const toggleRevealPassword = (userId: string) => {
    setRevealedPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleQuickResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingUserPassword || !newPasswordInput.trim()) return;
    const res = resetUserPassword(resettingUserPassword.id, newPasswordInput.trim());
    if (res.success) {
      showToast(`Password successfully reset for ${resettingUserPassword.name}!`);
      setResettingUserPassword(null);
      setNewPasswordInput('');
    } else {
      alert(res.error || 'Failed to reset password');
    }
  };

  const handleAddWorkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = createSocialWorkerByAdmin({
      name: newWorkerName.trim(),
      email: newWorkerEmail.trim(),
      grade: newWorkerGrade,
      password: newWorkerPassword.trim()
    });

    if (res.success) {
      setShowAddWorkerModal(false);
      setNewWorkerName('');
      setNewWorkerEmail('');
      showToast(`Social Worker ${newWorkerName} registered as ${newWorkerGrade} Grade Leader!`);
    } else {
      alert(res.error || 'Failed to register social worker');
    }
  };

  const handleExportUsersCsv = () => {
    const headers = [
      'User ID',
      'Full Name',
      'Family Name',
      'Role',
      'Email Address',
      'Village Grade',
      'Class / Combination',
      'Password (PSD)',
      'Registration Date',
      'Mental Champion Status',
      'Champion Idea',
      'Phone Number',
      'WhatsApp Number',
      'Office / Dorm Location'
    ];

    const rows = users.map(u => [
      `"${u.id}"`,
      `"${(u.name || '').replace(/"/g, '""')}"`,
      `"${(u.familyName || '').replace(/"/g, '""')}"`,
      `"${u.role}"`,
      `"${u.email}"`,
      `"${u.grade}"`,
      `"${(u.schoolClass || '—').replace(/"/g, '""')}"`,
      `"${(u.password || 'password123').replace(/"/g, '""')}"`,
      `"${u.registeredAt}"`,
      `"${u.isMentalChampion ? 'Approved Champion' : u.championStatus || 'none'}"`,
      `"${(u.championIdea || '').replace(/"/g, '""')}"`,
      `"${(u.phone || '').replace(/"/g, '""')}"`,
      `"${(u.whatsappNumber || '').replace(/"/g, '""')}"`,
      `"${(u.officeLocation || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ASYV_Registered_Users_Directory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Compiled & exported ${users.length} registered accounts into CSV!`);
  };

  const handleSaveContactInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactInfo({
      officeLocation: contactOffice,
      officeHours: contactHours,
      hotlinePhone: contactHotline,
      whatsappPhone: contactWhatsapp,
      emergencyEmail: contactEmail,
      clinicExtension: contactClinic,
      counselorLead: contactLead,
      additionalNotice: contactNotice
    });
    showToast('Village Contact & Emergency details saved and published system-wide!');
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnContent.trim()) return;

    addAnnouncement(
      newAnnTitle.trim(),
      newAnnContent.trim(),
      newAnnCategory,
      newAnnGrade === 'all' ? 'all' : [newAnnGrade as Grade]
    );

    setNewAnnTitle('');
    setNewAnnContent('');
    showToast('Real Village Announcement broadcasted successfully!');
  };

  const handleAddTip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTipTitle.trim() || !newTipSummary.trim()) return;

    addWellnessTip({
      category: newTipCategory,
      title: newTipTitle.trim(),
      summary: newTipSummary.trim(),
      actionable: newTipActionable.trim() || 'Review this concept with your social worker or peer mentor.',
      authorName: newTipAuthor.trim() || 'ASYV Counseling Lead'
    });

    setNewTipTitle('');
    setNewTipSummary('');
    setNewTipActionable('');
    showToast('Guidance article added to the student resource library!');
  };

  const handleSaveDailyQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dqPrompt.trim()) return;

    setDailyQuestion(selectedDqGrade, dqPrompt.trim(), dqNote.trim());
    showToast(`Daily Reflection Question for ${selectedDqGrade} updated!`);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignTitle.trim()) return;

    createAssignment({
      title: newAssignTitle.trim(),
      instructions: newAssignInstructions.trim() || 'Answer all questions carefully for your social worker review.',
      grade: newAssignGrade,
      dueDate: newAssignDueDate,
      questions: newAssignQuestions
    });

    setNewAssignTitle('');
    setNewAssignInstructions('');
    showToast(`Real Assignment created for ${newAssignGrade} students!`);
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ASYV_MindBridge_Real_Database_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Database exported to JSON file!');
  };

  const handleUploadBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importDatabaseJson(content);
      if (res.success) {
        showToast('Database successfully restored from JSON!');
      } else {
        alert(res.error || 'Failed to import backup');
      }
    };
    reader.readAsText(file);
  };

  const handleExportAuditCsv = () => {
    const headers = ['Log ID', 'Timestamp', 'Actor Name', 'User Role', 'Grade', 'Action Type', 'Severity', 'Details', 'Device / IP Node'];
    const rows = auditLogs.map(l => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${(l.userName || '').replace(/"/g, '""')}"`,
      `"${l.userRole || ''}"`,
      `"${l.grade || 'N/A'}"`,
      `"${l.action}"`,
      `"${l.severity}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`,
      `"${(l.ipOrDevice || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `asyv-mindbridge-activity-audit-log-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported complete system activity and audit logs to CSV format!');
    addAuditLog('DATABASE_EXPORTED', 'Administrator exported system activity and user audit logs into CSV format for offline reporting', 'info');
  };

  const handleAcknowledgeSos = (alertId: string) => {
    acknowledgeEmergency(alertId, sosResponseNote.trim() || 'Master Admin acknowledges. Dispatching village health staff.');
    setRespondingAlertId(null);
    setSosResponseNote('');
    showToast('SOS Alert marked as responded and acknowledged!');
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1b4327] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-400/30 animate-fadeIn text-xs sm:text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 text-[#eec149]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner with ASYV Brand Colors & Campus Image */}
      <div className="relative overflow-hidden bg-[#091b11] text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#245934] border-t-4 border-t-[#eec149]">
        {/* Precision Architectural Grid in Header */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dev-hdr-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#eec149" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dev-hdr-grid)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#eec149] mb-2">
              <ShieldCheck className="w-4 h-4 text-[#eec149]" />
              <span>Agahozo-Shalom Youth Village</span>
              <span>·</span>
              <span>Master Administrator Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
              Mind Bridge Real System Administration
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl">
              Full administrative privileges across Ingabe, Ingabo, and Ijabo. You have total authority to input real student rosters, publish school contact numbers, set assignments, and broadcast official announcements.
            </p>
          </div>

          <div className="bg-[#050f09] rounded-2xl p-4 border border-[#245934] text-xs space-y-1.5 shrink-0 min-w-[240px] shadow-md">
            <div className="flex items-center justify-between text-emerald-300 text-[11px] font-bold uppercase">
              <span>Admin Account:</span>
              <span className="px-2.5 py-0.5 rounded bg-[#eec149] text-slate-950 text-[10px] font-black">SUPER ADMIN</span>
            </div>
            <div className="font-mono text-white font-bold text-sm">{currentUser.email}</div>
            <div className="text-[11px] text-emerald-200/90 flex items-center justify-between pt-1 border-t border-[#245934]/60">
              <span>Authority Scope:</span>
              <span className="font-bold text-[#eec149]">All 3 Village Grades (Ingabe, Ingabo, Ijabo)</span>
            </div>

            <button
              type="button"
              onClick={handleExportAuditCsv}
              className="mt-3 w-full py-2 px-3 bg-[#eec149] hover:bg-[#dfb136] text-slate-900 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Download full CSV report of system activity and user audit logs for offline reporting"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-900" />
              <span>Export System Activity & Logs (CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-[#091b11] rounded-2xl p-2 border-2 border-[#245934] shadow-lg flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#eec149] text-slate-950 font-black shadow-sm'
              : 'text-emerald-100/90 hover:text-white hover:bg-white/10'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Overview & Database</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'students'
              ? 'bg-[#eec149] text-slate-950 font-black shadow-sm'
              : 'text-emerald-100/90 hover:text-white hover:bg-white/10'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Directory ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('customization')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'customization'
              ? 'bg-[#eec149] text-slate-950 font-black shadow-sm'
              : 'text-emerald-100/90 hover:text-white hover:bg-white/10'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Portal Customizer & Theme</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-[#eec149] text-slate-950 font-black shadow-sm'
              : 'text-emerald-100/90 hover:text-white hover:bg-white/10'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Audit Log & Activity ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('contacts')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'contacts'
              ? 'bg-[#eec149] text-slate-950 font-black shadow-sm'
              : 'text-emerald-100/90 hover:text-white hover:bg-white/10'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Village Contacts & Hotline</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'announcements'
              ? 'bg-[#eec149] text-slate-950 font-black shadow-sm'
              : 'text-emerald-100/90 hover:text-white hover:bg-white/10'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Announcements ({announcements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tips')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'tips'
              ? 'bg-[#eec149] text-slate-950 font-black shadow-sm'
              : 'text-emerald-100/90 hover:text-white hover:bg-white/10'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Resource Library Tips ({wellnessTips.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'assignments'
              ? 'bg-[#eec149] text-slate-950 font-black shadow-sm'
              : 'text-emerald-100/90 hover:text-white hover:bg-white/10'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Grade Assignments ({assignments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('daily-questions')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'daily-questions'
              ? 'bg-[#eec149] text-slate-950 font-black shadow-sm'
              : 'text-emerald-100/90 hover:text-white hover:bg-white/10'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Daily Prompts ({dailyQuestions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sos')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'sos'
              ? 'bg-rose-700 text-white shadow-xs font-black'
              : 'text-rose-400 hover:bg-rose-950/40 hover:text-rose-300'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>SOS Alerts ({emergencyAlerts.length})</span>
          {activeSosCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
          )}
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: OVERVIEW & REAL DATABASE CONTROLS                       */}
      {/* ============================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* ADMINISTRATIVE APPROACHING DEADLINE ALERTS (Can be stopped, marked done, or new task added) */}
          {(() => {
            const activeAlertTasks = (todos || []).filter(isAlertActive);
            if (activeAlertTasks.length === 0) return null;

            return (
              <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border-2 border-rose-500 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                      <AlertOctagon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px] uppercase tracking-wider">
                          Admin Deadline Alert
                        </span>
                        <span className="text-xs font-bold text-rose-700">
                          {activeAlertTasks.length} Approaching or Overdue Deadline{activeAlertTasks.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Dismiss approaching deadline alerts, mark tasks done, or schedule new ones. When stopped or marked done, the notification leaves clean empty space.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAdminQuickTask(!showAdminQuickTask)}
                    className="px-3.5 py-2 bg-[#245934] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{showAdminQuickTask ? 'Cancel Add Task' : 'Add Other Task'}</span>
                  </button>
                </div>

                {/* Inline Quick Add Task for Administrator */}
                {showAdminQuickTask && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!adminTaskTitle.trim()) return;
                      addTodo(adminTaskTitle.trim(), adminTaskPriority, adminTaskDueDate);
                      showToast('New administrative task scheduled!');
                      setAdminTaskTitle('');
                      setShowAdminQuickTask(false);
                      if (activeAlertTasks[0]) {
                        stopAlert(activeAlertTasks[0].id);
                      }
                    }}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-fadeIn"
                  >
                    <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Schedule New Task & Dismiss Current Alert
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Enter task title (e.g., Audit student psychosocial questionnaires)..."
                      value={adminTaskTitle}
                      onChange={(e) => setAdminTaskTitle(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-hidden focus:border-[#245934]"
                    />
                    <div className="flex items-center gap-3">
                      <select
                        value={adminTaskPriority}
                        onChange={(e) => setAdminTaskPriority(e.target.value as any)}
                        className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                      >
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                      </select>
                      <input
                        type="date"
                        value={adminTaskDueDate}
                        onChange={(e) => setAdminTaskDueDate(e.target.value)}
                        className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl"
                      />
                      <button
                        type="submit"
                        className="ml-auto px-4 py-1.5 bg-[#245934] text-white font-bold rounded-xl text-xs hover:bg-emerald-700 shadow-xs cursor-pointer"
                      >
                        Create Task & Dismiss Alert
                      </button>
                    </div>
                  </form>
                )}

                {/* Tasks List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeAlertTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-900 text-xs truncate">
                          {task.title}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                          <span className="font-semibold text-rose-700 capitalize">
                            {task.priority} Priority
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-2.5 h-2.5 text-rose-500" />
                            {task.dueDate || 'Due Today'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => {
                            stopAlert(task.id);
                            showToast(`Alert stopped for "${task.title}". Notification dismissed.`);
                          }}
                          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-[11px] transition-all cursor-pointer shadow-xs"
                          title="Stop this alert"
                        >
                          Stop Alert
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            toggleTodo(task.id);
                            stopAlert(task.id);
                            showToast(`Task "${task.title}" marked as done!`);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[11px] transition-all shadow-xs cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Done</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Key Metrics - Executive Command Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#091b11] p-5 rounded-3xl border border-[#245934] shadow-md text-white">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-300/80">Total Registered Users</div>
              <div className="text-3xl font-black text-[#eec149] font-display tabular-nums mt-1">
                {users.length}
              </div>
              <div className="text-[11px] text-emerald-200/70 mt-1 font-mono">Ingabe, Ingabo, Ijabo</div>
            </div>

            <div className="bg-[#091b11] p-5 rounded-3xl border border-[#245934] shadow-md text-white">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-300/80">Students Enrolled</div>
              <div className="text-3xl font-black text-white font-display tabular-nums mt-1">
                {studentsCount}
              </div>
              <div className="text-[11px] text-emerald-200/70 mt-1 font-mono">Village youth accounts</div>
            </div>

            <div className="bg-[#091b11] p-5 rounded-3xl border border-[#245934] shadow-md text-white">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-300/80">Grade Social Workers</div>
              <div className="text-3xl font-black text-[#f59e0b] font-display tabular-nums mt-1">
                {workersCount}
              </div>
              <div className="text-[11px] text-emerald-200/70 mt-1 font-mono">Permanent grade leads</div>
            </div>

            <div className="bg-[#091b11] p-5 rounded-3xl border border-[#245934] shadow-md text-white">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-300/80">Mental Champions</div>
              <div className="text-3xl font-black text-emerald-300 font-display tabular-nums mt-1">
                {championsCount}
              </div>
              <div className="text-[11px] text-amber-300 font-semibold mt-1 font-mono">
                {pendingChampionsCount} pending approval
              </div>
            </div>
          </div>

          {/* MASTER DYNAMIC REGISTRATION ACCESS CONTROLS (One-Click Dynamic Enable/Disable & Hide) */}
          <div className="bg-[#091b11] rounded-3xl p-6 sm:p-7 border-2 border-[#245934] shadow-xl text-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#245934]/60">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#1b4327] border border-[#eec149]/40 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-[#eec149]" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-[#eec149]">
                    ASYV Public Access Gates
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white font-display">
                    Dynamic Self-Registration Controls
                  </h2>
                </div>
              </div>

              <div className="text-xs text-emerald-200/80 font-mono">
                Real-Time Synchronized to Login Screen
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. STUDENT REGISTRATION CONTROL */}
              <div className={`p-5 rounded-2xl border-2 transition-all space-y-3 ${
                appCustomization?.allowPublicStudentRegistration
                  ? 'bg-[#0f2c1b] border-emerald-500/80'
                  : 'bg-[#151c17] border-slate-700/80'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black font-display text-white">
                        Student Self-Registration Link
                      </span>
                    </div>
                    <p className="text-xs text-emerald-200/80 mt-1">
                      {appCustomization?.allowPublicStudentRegistration
                        ? 'ALLOW: "Register New Student" link is ACTIVE and VISIBLE on the login screen for students.'
                        : 'STOPPED & HIDDEN: Register link is COMPLETELY HIDDEN. Only you or Grade Social Workers can register students.'}
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                    appCustomization?.allowPublicStudentRegistration
                      ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400/40'
                      : 'bg-rose-900/60 text-rose-300 border border-rose-700'
                  }`}>
                    {appCustomization?.allowPublicStudentRegistration ? 'ACTIVE & VISIBLE' : 'STOPPED & HIDDEN'}
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-white/10">
                  <span className="text-[11px] text-slate-400">
                    Click button to immediately change status:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = !appCustomization?.allowPublicStudentRegistration;
                      updateAppCustomization({ allowPublicStudentRegistration: nextVal });
                      setCustomAllowStudentReg(nextVal);
                      showToast(nextVal
                        ? 'Student registration ALLOWED: Register link is now active & visible on login screen.'
                        : 'Student registration STOPPED & HIDDEN: Register link is now hidden from login screen.'
                      );
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                      appCustomization?.allowPublicStudentRegistration
                        ? 'bg-rose-700 hover:bg-rose-800 text-white'
                        : 'bg-[#eec149] hover:bg-[#dfb136] text-slate-950'
                    }`}
                  >
                    {appCustomization?.allowPublicStudentRegistration ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Stop & Hide Student Registration</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-slate-950" />
                        <span>Allow Student Registration</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 2. SOCIAL WORKER REGISTRATION CONTROL */}
              <div className={`p-5 rounded-2xl border-2 transition-all space-y-3 ${
                appCustomization?.allowPublicWorkerRegistration
                  ? 'bg-[#0f2c1b] border-emerald-500/80'
                  : 'bg-[#151c17] border-slate-700/80'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black font-display text-white">
                        Social Worker Registration Link
                      </span>
                    </div>
                    <p className="text-xs text-emerald-200/80 mt-1">
                      {appCustomization?.allowPublicWorkerRegistration
                        ? 'ALLOW: "Register New Social Worker" link is ACTIVE and VISIBLE on the login screen.'
                        : 'STOPPED & HIDDEN: Register link is COMPLETELY HIDDEN. Social workers can only be appointed by Master Admin.'}
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                    appCustomization?.allowPublicWorkerRegistration
                      ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400/40'
                      : 'bg-rose-900/60 text-rose-300 border border-rose-700'
                  }`}>
                    {appCustomization?.allowPublicWorkerRegistration ? 'ACTIVE & VISIBLE' : 'STOPPED & HIDDEN'}
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-white/10">
                  <span className="text-[11px] text-slate-400">
                    Click button to immediately change status:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = !appCustomization?.allowPublicWorkerRegistration;
                      updateAppCustomization({ allowPublicWorkerRegistration: nextVal });
                      setCustomAllowWorkerReg(nextVal);
                      showToast(nextVal
                        ? 'Social Worker registration ALLOWED: Register link is now active & visible on login screen.'
                        : 'Social Worker registration STOPPED & HIDDEN: Register link is now hidden from login screen.'
                      );
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                      appCustomization?.allowPublicWorkerRegistration
                        ? 'bg-rose-700 hover:bg-rose-800 text-white'
                        : 'bg-[#eec149] hover:bg-[#dfb136] text-slate-950'
                    }`}
                  >
                    {appCustomization?.allowPublicWorkerRegistration ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Stop & Hide Worker Registration</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-slate-950" />
                        <span>Allow Worker Registration</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* OFFICIAL GRADE SOCIAL WORKERS ROSTER & DIRECT INPUT */}
          <div className="bg-[#091b11] rounded-3xl p-6 sm:p-8 border border-[#245934] shadow-lg space-y-4 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#245934]/60">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#eec149]">
                  Village Leadership & Counselors
                </div>
                <h2 className="text-xl font-black text-white font-display">
                  Grade Social Workers Roster
                </h2>
                <p className="text-xs text-emerald-200/80 mt-0.5">
                  Input and manage the official permanent social workers assigned to each ASYV high school grade.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setNewWorkerName('');
                  setNewWorkerEmail('');
                  setNewWorkerGrade('Ingabe');
                  setNewWorkerPassword('worker2026!');
                  setShowAddWorkerModal(true);
                }}
                className="px-4 py-2.5 bg-[#eec149] hover:bg-[#dfb136] text-slate-950 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <UserPlus className="w-4 h-4 text-slate-950" />
                <span>+ Register New Social Worker</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {GRADES.map(grade => {
                const assignedWorker = users.find(u => u.role === 'social_worker' && u.grade === grade);

                return (
                  <div
                    key={grade}
                    className={`p-5 rounded-2xl border transition-all ${
                      assignedWorker
                        ? 'bg-[#06140c] border-[#245934] text-white shadow-xs'
                        : 'bg-[#121f16] border-dashed border-[#eec149]/50 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-[#245934] text-[#eec149]">
                        {grade} Grade
                      </span>
                      {assignedWorker ? (
                        <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Assigned</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-amber-400">
                          Vacant
                        </span>
                      )}
                    </div>

                    {assignedWorker ? (
                      <div className="space-y-2 mt-3">
                        <div className="font-bold text-white text-sm">
                          {assignedWorker.name} {assignedWorker.familyName || ''}
                        </div>
                        <div className="text-xs font-mono text-emerald-300/90 truncate">
                          {assignedWorker.email}
                        </div>
                        {assignedWorker.phone && (
                          <div className="text-[11px] text-emerald-200/80 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-[#eec149]" />
                            <span>{assignedWorker.phone}</span>
                          </div>
                        )}
                        <div className="pt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(assignedWorker)}
                            className="text-xs font-bold text-[#eec149] hover:underline cursor-pointer"
                          >
                            Edit Profile
                          </button>
                          <span className="text-slate-500">·</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Remove ${assignedWorker.name} as ${grade} Grade Social Worker?`)) {
                                deleteUser(assignedWorker.id);
                              }
                            }}
                            className="text-xs font-bold text-rose-400 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 mt-3">
                        <p className="text-xs text-slate-300 leading-relaxed">
                          No social worker is currently appointed for {grade} Grade.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setNewWorkerName('');
                            setNewWorkerEmail('');
                            setNewWorkerGrade(grade);
                            setNewWorkerPassword('worker2026!');
                            setShowAddWorkerModal(true);
                          }}
                          className="w-full py-2 px-3 bg-[#eec149] hover:bg-[#dfb136] text-slate-950 rounded-xl text-xs font-black transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Input {grade} Social Worker</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* REAL DATA DATABASE CONTROLS */}
          <div className="bg-[#091b11] rounded-3xl p-6 sm:p-8 border border-[#245934] shadow-lg space-y-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#245934]/60">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#eec149]">
                  Real Data Management & Database Storage
                </div>
                <h2 className="text-xl font-black text-white font-display">
                  Database Management & Backup
                </h2>
                <p className="text-xs text-emerald-200/80 mt-0.5">
                  The application is fully persistent in browser and central server. Admin maintains master control over all entered data.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportAuditCsv}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  title="Export all system activity and user audit logs into CSV format"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#eec149]" />
                  <span>Export Activity & Audit Logs (CSV)</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  className="px-4 py-2 bg-[#122b1c] hover:bg-[#1a3d28] text-emerald-200 border border-[#245934] rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-[#eec149]" />
                  <span>Download JSON Backup</span>
                </button>

                <label className="px-4 py-2 bg-[#eec149] hover:bg-[#dfb136] text-slate-950 rounded-xl text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-slate-950" />
                  <span>Restore from JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleUploadBackup}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Clean Data Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 space-y-3">
                <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-sm">
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>Keep Only Master Admin Account</span>
                </div>
                <p className="text-xs text-rose-900/80 dark:text-rose-300/80 leading-relaxed">
                  Permanently deletes all student and social worker accounts across all grades. The only account that remains in the system is this Master Administrator account.
                </p>
                <button
                  type="button"
                  onClick={() => setShowPurgeAllUsersModal(true)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Delete All Accounts (Keep Only Admin)
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-[#d95f18]" />
                  <span>Clean Slate Database</span>
                </div>
                <p className="text-xs text-amber-900/80 dark:text-amber-300/80 leading-relaxed">
                  Wipes out all records and collections to a pristine, clean state, keeping only the Master Administrator account ready for inputting real school data.
                </p>
                <button
                  type="button"
                  onClick={() => setShowResetConfirmModal(true)}
                  className="px-4 py-2 bg-[#d95f18] hover:bg-[#b84e12] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Reset to Clean State (Admin Only)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: REGISTERED USERS DIRECTORY & CREDENTIALS RECOVERY       */}
      {/* ============================================================== */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          {/* Top Summary Statistics Cards - Executive Command */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <div className="bg-[#091b11] p-4 rounded-2xl border border-[#245934] shadow-sm text-white">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300/80">
                Total Registered
              </div>
              <div className="text-2xl font-black text-[#eec149] mt-1 font-display">
                {users.length}
              </div>
              <div className="text-[11px] text-emerald-200/70 font-semibold mt-0.5">
                All Village Accounts
              </div>
            </div>

            <div className="bg-[#091b11] p-4 rounded-2xl border border-[#245934] shadow-sm text-white">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300/80">
                Registered Students
              </div>
              <div className="text-2xl font-black text-white mt-1 font-display">
                {studentsCount}
              </div>
              <div className="text-[10px] text-emerald-200/70 font-medium mt-0.5">
                Ingabe ({users.filter(u => u.role === 'student' && u.grade === 'Ingabe').length}) · Ingabo ({users.filter(u => u.role === 'student' && u.grade === 'Ingabo').length}) · Ijabo ({users.filter(u => u.role === 'student' && u.grade === 'Ijabo').length})
              </div>
            </div>

            <div className="bg-[#091b11] p-4 rounded-2xl border border-[#245934] shadow-sm text-white">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300/80">
                Social Workers
              </div>
              <div className="text-2xl font-black text-[#f59e0b] mt-1 font-display">
                {workersCount}
              </div>
              <div className="text-[11px] text-emerald-200/70 font-medium mt-0.5">
                Grade Counselors
              </div>
            </div>

            <div className="bg-[#091b11] p-4 rounded-2xl border border-[#245934] shadow-sm text-white">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300/80">
                Mental Champions
              </div>
              <div className="text-2xl font-black text-emerald-300 mt-1 font-display">
                {championsCount}
              </div>
              <div className="text-[11px] text-amber-300 font-medium mt-0.5">
                {pendingChampionsCount > 0 ? `${pendingChampionsCount} Pending Review` : 'Peer Ambassadors'}
              </div>
            </div>

            <div className="bg-[#091b11] p-4 rounded-2xl border border-[#245934] shadow-sm text-white col-span-2 sm:col-span-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300/80">
                Master Admins
              </div>
              <div className="text-2xl font-black text-[#eec149] mt-1 font-display">
                {users.filter(u => u.role === 'developer').length}
              </div>
              <div className="text-[11px] text-emerald-200/70 font-medium mt-0.5">
                System Superusers
              </div>
            </div>
          </div>

          {/* Action Bar & Search */}
          <div className="bg-[#091b11] p-4 sm:p-5 rounded-3xl border border-[#245934] shadow-md flex flex-col md:flex-row items-center justify-between gap-3 text-white">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, class, email, phone..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#050f09] border border-[#245934] rounded-2xl text-white placeholder-emerald-200/50 focus:border-[#eec149] outline-hidden"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-[#050f09] border border-[#245934] rounded-xl font-bold text-emerald-200 outline-hidden cursor-pointer"
              >
                <option value="all">All Grades</option>
                {GRADES.map(g => (
                  <option key={g} value={g}>{g} Grade</option>
                ))}
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-[#050f09] border border-[#245934] rounded-xl font-bold text-emerald-200 outline-hidden cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="social_worker">Social Workers</option>
                <option value="developer">Administrator</option>
              </select>

              {/* Export Registered Users CSV */}
              <button
                type="button"
                onClick={handleExportUsersCsv}
                className="px-3 py-2 bg-[#122b1c] hover:bg-[#1a3d28] text-emerald-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 border border-[#245934]"
                title="Download formatted CSV report of all registered users"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#eec149]" />
                <span className="hidden sm:inline">Export Users</span>
                <span>(CSV)</span>
              </button>

              {/* Add Social Worker Button */}
              <button
                type="button"
                onClick={() => setShowAddWorkerModal(true)}
                className="px-3.5 py-2 bg-[#d95f18] hover:bg-[#b84e12] text-white rounded-xl text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                <UserPlus className="w-4 h-4 text-white" />
                <span>+ Worker</span>
              </button>

              {/* Add Real Student Button */}
              <button
                type="button"
                onClick={() => setShowAddStudentModal(true)}
                className="px-3.5 py-2 bg-[#eec149] hover:bg-[#dfb136] text-slate-950 rounded-xl text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                <UserPlus className="w-4 h-4 text-slate-950" />
                <span>+ Student</span>
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-[#091b11] rounded-3xl border border-[#245934] shadow-lg overflow-hidden text-white">
            <div className="p-4 border-b border-[#245934]/60 flex items-center justify-between text-xs font-semibold text-emerald-300">
              <span className="font-bold text-white">
                Registered Village Accounts Directory ({filteredUsers.length} shown of {users.length})
              </span>
              <span className="text-[11px] text-[#eec149] font-medium hidden sm:inline">
                Hover or click "See PSD" to inspect/recover forgotten user credentials
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#050f09] border-b border-[#245934] text-[#eec149] font-black uppercase tracking-wider text-[11px]">
                    <th className="p-3.5 pl-4">User Identity & Email</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Grade</th>
                    <th className="p-3.5">Class / Combination</th>
                    <th className="p-3.5 min-w-[210px]">Password (PSD) / Recovery</th>
                    <th className="p-3.5">Champion Status</th>
                    <th className="p-3.5">Registered Date</th>
                    <th className="p-3.5 text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#245934]/40">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#06140c] transition-colors">
                      {/* Identity & Email */}
                      <td className="p-3.5 pl-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-10 h-10 rounded-xl object-cover shrink-0 border border-[#245934]"
                          />
                          <div>
                            <div className="font-bold text-white text-sm flex items-center gap-1.5">
                              <span>{u.name} {u.familyName || ''}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono text-emerald-300 text-[11px]">
                                {u.email}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(u.email);
                                  showToast(`Copied email: ${u.email}`);
                                }}
                                className="text-emerald-400 hover:text-[#eec149] p-0.5 cursor-pointer"
                                title="Copy email address"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold capitalize ${
                          u.role === 'developer'
                            ? 'bg-slate-900 text-white'
                            : u.role === 'social_worker'
                            ? 'bg-teal-50 text-teal-800 border border-teal-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}>
                          {u.role === 'developer' ? 'Master Admin' : u.role.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Grade */}
                      <td className="p-3.5">
                        <span className="font-bold text-slate-800">{u.grade}</span>
                      </td>

                      {/* Class */}
                      <td className="p-3.5 text-slate-600 font-medium">
                        {u.schoolClass || '—'}
                      </td>

                      {/* Password / Recovery Key with small button at right corner to see PSD */}
                      <td className="p-3.5">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2 p-1.5 px-2 bg-slate-50 border border-slate-200/90 rounded-xl min-w-[190px] max-w-[230px] shadow-2xs">
                            <div className="flex items-center gap-1.5 overflow-hidden">
                              <KeyRound className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span className={`font-mono text-xs select-all truncate ${
                                revealedPasswords[u.id]
                                  ? 'text-emerald-700 font-bold bg-emerald-50 px-1 py-0.5 rounded'
                                  : 'text-slate-400 tracking-wider'
                              }`}>
                                {revealedPasswords[u.id] ? (u.password || 'password123') : '••••••••'}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {/* Small button at right corner to see/reveal PSD */}
                              <button
                                type="button"
                                onClick={() => toggleRevealPassword(u.id)}
                                className="px-1.5 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                title={revealedPasswords[u.id] ? "Hide password" : "See user password (PSD) to help recover when forgotten"}
                              >
                                {revealedPasswords[u.id] ? (
                                  <>
                                    <EyeOff className="w-3 h-3 text-amber-800" />
                                    <span>Hide</span>
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-3 h-3 text-amber-800" />
                                    <span>See PSD</span>
                                  </>
                                )}
                              </button>

                              {/* Copy PSD Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(u.password || 'password123');
                                  showToast(`Password copied for ${u.name}!`);
                                }}
                                className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-slate-200/60 rounded cursor-pointer transition-colors"
                                title="Copy password to clipboard"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Quick password reset link */}
                          <button
                            type="button"
                            onClick={() => {
                              setResettingUserPassword(u);
                              setNewPasswordInput('');
                            }}
                            className="text-[10px] font-bold text-[#245934] hover:text-[#d95f18] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-2.5 h-2.5" />
                            <span>Recover / Change PSD</span>
                          </button>
                        </div>
                      </td>

                      {/* Champion Status */}
                      <td className="p-3.5">
                        {u.role === 'student' ? (
                          u.isMentalChampion || u.championStatus === 'approved' ? (
                            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Approved Champion</span>
                            </div>
                          ) : u.championStatus === 'pending' ? (
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded">
                                Pending
                              </span>
                              <button
                                onClick={() => {
                                  approveMentalChampion(u.id);
                                  showToast(`Approved ${u.name} as Mental Champion!`);
                                }}
                                className="px-2 py-0.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold cursor-pointer"
                                title="Approve Champion"
                              >
                                Approve
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400">Regular Student</span>
                          )
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Registered Date */}
                      <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                        {new Date(u.registeredAt).toLocaleDateString()}
                      </td>

                      {/* Action buttons */}
                      <td className="p-3.5 text-right pr-4">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Inspect Complete User Dossier / Info */}
                          <button
                            type="button"
                            onClick={() => setSelectedDossierUser(u)}
                            className="px-2 py-1 text-[11px] bg-emerald-50 hover:bg-[#245934] hover:text-white text-[#245934] rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-bold border border-emerald-200"
                            title="Inspect Complete User Dossier & Info"
                          >
                            <Info className="w-3.5 h-3.5" />
                            <span>Info</span>
                          </button>

                          {/* Impersonate / Preview Button */}
                          {u.role !== 'developer' && (
                            <button
                              type="button"
                              onClick={() => impersonateUser(u)}
                              className="px-2 py-1 text-[11px] bg-slate-100 hover:bg-[#245934] hover:text-white text-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-semibold"
                              title="Test & View App as this user"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View As</span>
                            </button>
                          )}

                          {/* Edit user credentials */}
                          <button
                            type="button"
                            onClick={() => handleStartEdit(u)}
                            className="p-1.5 text-slate-500 hover:text-[#245934] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit user details and credentials"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete user completely */}
                          {u.role !== 'developer' && (
                            <button
                              type="button"
                              onClick={() => setUserToDelete(u)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete user completely from system"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: PORTAL CUSTOMIZATION & THEME SETTINGS                    */}
      {/* ============================================================== */}
      {activeTab === 'customization' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#245934] mb-1">
                <Sparkles className="w-4 h-4 text-[#eec149]" />
                <span>Master Administrator Customizer</span>
                <span>·</span>
                <span>Full System Frontend Control</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 font-display">
                Portal Customizer & Theme Branding
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                As Master Administrator, you have total control over the front pages, login screens, school motto banners, welcoming check-in prompts, and student/worker registration policies.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  resetAppCustomization();
                  setCustomMotto('LEARN, ADAPT AND LEAD');
                  setCustomSubMotto('Ingabe · Ingabo · Ijabo');
                  setCustomPortalTitle('Mind Bridge');
                  setCustomPortalSubtitle('The Agahozo Shalom Youth Village Psychosocial Platform');
                  setCustomWelcomeTitle('Do you need any help from {workerName}, 💁‍♂️?');
                  setCustomWelcomeSubtitle('Your Grade social worker is available right now for confidential listening, academic support, or personal guidance.');
                  setCustomLoginNotice('Restricted Official Village Care Network · Authorized access only');
                  setCustomFooterTagline('made to support the ASYV social workers support!');
                  setCustomAllowStudentReg(false);
                  setCustomAllowWorkerReg(false);
                  showToast('Restored official ASYV portal defaults!');
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-colors cursor-pointer flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4 text-slate-500" />
                <span>Reset to ASYV Defaults</span>
              </button>
            </div>
          </div>

          {/* Customization Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateAppCustomization({
                schoolMotto: customMotto.trim() || 'LEARN, ADAPT AND LEAD',
                schoolSubMotto: customSubMotto.trim() || 'Ingabe · Ingabo · Ijabo',
                portalTitle: customPortalTitle.trim() || 'Mind Bridge',
                portalSubtitle: customPortalSubtitle.trim() || 'The Agahozo Shalom Youth Village Psychosocial Platform',
                welcomeBannerTitle: customWelcomeTitle.trim() || 'Do you need any help from {workerName}, 💁‍♂️?',
                welcomeBannerSubtitle: customWelcomeSubtitle.trim() || 'Your Grade social worker is available right now for confidential listening, academic support, or personal guidance.',
                welcomeHeroTitle: customWelcomeHeroTitle.trim() || 'Welcome to Mind Bridge',
                welcomeHeroSubtitle: customWelcomeHeroSubtitle.trim() || 'Where Every ASYV Youth Heals, Grows, and Becomes a Leader',
                welcomeHeroDescription: customWelcomeHeroDescription.trim(),
                strategicPlanTag: customStrategicPlanTag.trim() || 'ASYV Strategic Vision',
                strategicPlanTitle: customStrategicPlanTitle.trim() || 'Fostering Healing, Self-Sufficiency, and Sustainability',
                strategicPlanDescription: customStrategicPlanDescription.trim(),
                loginNotice: customLoginNotice.trim() || 'Restricted Official Village Care Network · Authorized access only',
                footerTagline: customFooterTagline.trim() || 'made to support the ASYV social workers support!',
                allowPublicStudentRegistration: customAllowStudentReg,
                allowPublicWorkerRegistration: customAllowWorkerReg,
                customInspirationalQuote: customInspiringQuote.trim(),
                customQuoteAuthor: customQuoteAuthor.trim(),
                activeAsyvPalette: customPalette,
                strategicPlanImageUrl: customStrategicPlanImage,
                portalLogoImageUrl: customPortalLogoImage
              });
              showToast('Portal branding, front page picture, and settings saved successfully!');
            }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* School Motto & Top Banner Customization */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#245934]">
                <Sparkles className="w-4 h-4 text-[#eec149]" />
                <span>1. School Motto Banner (Visible Across All Tabs)</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary School Motto (Uppercase Banner)
                </label>
                <input
                  type="text"
                  required
                  value={customMotto}
                  onChange={(e) => setCustomMotto(e.target.value)}
                  placeholder="e.g. LEARN, ADAPT AND LEAD"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden font-bold"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Displayed in bold uppercase on the header banner across every tab.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sub-Motto / Grade Pillars
                </label>
                <input
                  type="text"
                  required
                  value={customSubMotto}
                  onChange={(e) => setCustomSubMotto(e.target.value)}
                  placeholder="e.g. Ingabe · Ingabo · Ijabo"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                />
              </div>

              {/* Live Preview of Motto */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1b4327] via-[#245934] to-[#163821] text-white space-y-1">
                <div className="text-[10px] font-bold text-[#eec149] uppercase tracking-wider">
                  Live Banner Preview
                </div>
                <div className="text-lg font-black uppercase text-amber-200 font-display">
                  {customMotto || 'LEARN, ADAPT AND LEAD'}
                </div>
                <div className="text-xs text-emerald-200 font-medium">
                  {customSubMotto || 'Ingabe · Ingabo · Ijabo'}
                </div>
              </div>
            </div>

            {/* Portal Title & Branding */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#245934]">
                <ShieldCheck className="w-4 h-4 text-[#eec149]" />
                <span>2. Platform Names & Header Wordmark</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Application Portal Name
                </label>
                <input
                  type="text"
                  required
                  value={customPortalTitle}
                  onChange={(e) => setCustomPortalTitle(e.target.value)}
                  placeholder="e.g. Mind Bridge"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Portal Subtitle / Tagline
                </label>
                <input
                  type="text"
                  required
                  value={customPortalSubtitle}
                  onChange={(e) => setCustomPortalSubtitle(e.target.value)}
                  placeholder="e.g. The Agahozo Shalom Youth Village Psychosocial Platform"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Footer Tagline
                </label>
                <input
                  type="text"
                  required
                  value={customFooterTagline}
                  onChange={(e) => setCustomFooterTagline(e.target.value)}
                  placeholder="e.g. made to support the ASYV social workers support!"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                />
              </div>
            </div>

            {/* Front Login Notice & Registration Permissions */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#245934]">
                <Lock className="w-4 h-4 text-[#eec149]" />
                <span>3. Sign-In Notice & Access Governance</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sign-In Screen Notice / Banner
                </label>
                <textarea
                  rows={2}
                  value={customLoginNotice}
                  onChange={(e) => setCustomLoginNotice(e.target.value)}
                  placeholder="Security and confidentiality notice on login page..."
                  className="w-full px-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customAllowStudentReg}
                    onChange={(e) => setCustomAllowStudentReg(e.target.checked)}
                    className="w-4 h-4 text-[#245934] rounded"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      Allow Self-Registration for Students
                    </div>
                    <div className="text-[11px] text-slate-500">
                      When enabled, students can create accounts from the sign-in modal.
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customAllowWorkerReg}
                    onChange={(e) => setCustomAllowWorkerReg(e.target.checked)}
                    className="w-4 h-4 text-[#245934] rounded"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      Allow Self-Registration for Social Workers
                    </div>
                    <div className="text-[11px] text-slate-500">
                      When enabled, new psychosocial staff can register their assigned grade.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Student Welcome Prompt Customization */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#245934]">
                <HelpCircle className="w-4 h-4 text-[#eec149]" />
                <span>4. Student Welcome Check-In Prompt</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Welcome Banner Question Heading
                </label>
                <input
                  type="text"
                  required
                  value={customWelcomeTitle}
                  onChange={(e) => setCustomWelcomeTitle(e.target.value)}
                  placeholder="e.g. Do you need any help from {workerName}, 💁‍♂️?"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden font-bold"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Tip: Use {'{workerName}'} to automatically insert the student's assigned Grade Social Worker.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Welcome Banner Subtitle Description
                </label>
                <textarea
                  rows={2}
                  value={customWelcomeSubtitle}
                  onChange={(e) => setCustomWelcomeSubtitle(e.target.value)}
                  className="w-full px-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                />
              </div>
            </div>

            {/* Welcoming Front Page & Authentic ASYV Photos Customization */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6 lg:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#245934]">
                  <Sparkles className="w-4 h-4 text-[#eec149]" />
                  <span>5. Welcoming Front Page & ASYV Strategic Photos Customization</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Live on Public Welcoming Landing Screen
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 7 cols: Text Configuration */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Front Welcome Headline
                      </label>
                      <input
                        type="text"
                        value={customWelcomeHeroTitle}
                        onChange={(e) => setCustomWelcomeHeroTitle(e.target.value)}
                        placeholder="e.g. Welcome to Mind Bridge"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Front Welcome Sub-Headline
                      </label>
                      <input
                        type="text"
                        value={customWelcomeHeroSubtitle}
                        onChange={(e) => setCustomWelcomeHeroSubtitle(e.target.value)}
                        placeholder="e.g. Where Every ASYV Youth Heals, Grows, and Becomes a Leader"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Front Hero Community Description
                    </label>
                    <textarea
                      rows={2}
                      value={customWelcomeHeroDescription}
                      onChange={(e) => setCustomWelcomeHeroDescription(e.target.value)}
                      placeholder="Psychosocial care description for village youth, counselors, and peer champions..."
                      className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Strategic Plan Tag
                      </label>
                      <input
                        type="text"
                        value={customStrategicPlanTag}
                        onChange={(e) => setCustomStrategicPlanTag(e.target.value)}
                        placeholder="e.g. ASYV Strategic Vision"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden font-bold text-[#d95f18]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Strategic Plan Photo Title
                      </label>
                      <input
                        type="text"
                        value={customStrategicPlanTitle}
                        onChange={(e) => setCustomStrategicPlanTitle(e.target.value)}
                        placeholder="e.g. Fostering Healing, Self-Sufficiency, and Sustainability"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Strategic Photo Caption / Graduation Vision
                    </label>
                    <textarea
                      rows={2}
                      value={customStrategicPlanDescription}
                      onChange={(e) => setCustomStrategicPlanDescription(e.target.value)}
                      placeholder="Inspiring caption for the graduate celebration photograph..."
                      className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                    />
                  </div>

                  {/* Featured Picture Upload & Management Controls - FULLY AUTOMATIC */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <label className="block text-xs font-bold text-slate-800">
                          Featured Welcome Picture (Kid Throwing Hat / Graduate Photo)
                        </label>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                          Auto-Saves
                        </span>
                      </div>
                      {customStrategicPlanImage !== '/assets/aistudio/download_954a9c9b.jpg' && (
                        <button
                          type="button"
                          onClick={handleAutoResetFeaturedPhoto}
                          className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Reset to Original Kid Photo</span>
                        </button>
                      )}
                    </div>

                    <div className="p-4 bg-slate-50 border-2 border-dashed border-emerald-500/40 rounded-2xl space-y-3.5">
                      <div className="flex flex-wrap items-center gap-3">
                        {/* Instant Automatic Upload from Computer Button */}
                        <label className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition-all cursor-pointer ${
                          isUploadingHero
                            ? 'bg-emerald-900 cursor-not-allowed opacity-80'
                            : 'bg-[#245934] hover:bg-emerald-800 transform hover:scale-102'
                        }`}>
                          {isUploadingHero ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-[#eec149]" />
                              <span>Uploading & Changing...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 text-[#eec149]" />
                              <span>Upload Picture (Auto-Changes Live)</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingHero}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleAutoUploadFeaturedPhoto(file);
                              e.target.value = ''; // Reset input to allow re-uploading same file
                            }}
                          />
                        </label>

                        {/* Reset Preset Button */}
                        <button
                          type="button"
                          onClick={handleAutoResetFeaturedPhoto}
                          className="px-3.5 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
                        >
                          Restore Original Kid Photo
                        </button>
                      </div>

                      {/* Direct URL input with instant Apply button */}
                      <div>
                        <span className="text-[11px] text-slate-500 font-semibold block mb-1">
                          Or apply direct web image URL:
                        </span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={heroDirectUrlInput || (customStrategicPlanImage.startsWith('data:') ? '[Custom Uploaded Image Data]' : customStrategicPlanImage)}
                            onChange={(e) => setHeroDirectUrlInput(e.target.value)}
                            placeholder="e.g. https://.../photo.jpg or /assets/..."
                            className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (heroDirectUrlInput) handleAutoApplyPhotoUrl(heroDirectUrlInput);
                            }}
                            className="px-4 py-2 bg-[#1b4327] hover:bg-[#245934] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors shrink-0"
                          >
                            Apply URL
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right 5 cols: Live Card Preview & Drop Zone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const droppedFile = e.dataTransfer.files?.[0];
                    if (droppedFile) handleAutoUploadFeaturedPhoto(droppedFile);
                  }}
                  className="lg:col-span-5 bg-gradient-to-br from-[#081810] via-[#102919] to-[#081810] p-4 rounded-2xl border-2 border-emerald-500/40 text-white flex flex-col justify-between space-y-3 relative group"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#eec149] flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#eec149]" />
                      <span>Live Welcoming Screen Preview</span>
                    </span>
                    <span className="text-[10px] text-emerald-300 font-bold">
                      {customAllowStudentReg ? '● Registration Active' : '○ Registration Closed'}
                    </span>
                  </div>

                  {/* Header Preview */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white p-0.5 border border-[#eec149]">
                      <img
                        src={customPortalLogoImage}
                        alt="Emblem"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#eec149] leading-tight">
                        {customPortalTitle || 'Mind Bridge'}
                      </div>
                      <div className="text-[9px] text-emerald-200 truncate max-w-[200px]">
                        {customPortalSubtitle}
                      </div>
                    </div>
                  </div>

                  {/* Hero Headline Preview */}
                  <div className="space-y-1">
                    <div className="text-sm font-black text-white font-display leading-tight">
                      {customWelcomeHeroTitle || 'Welcome to Mind Bridge'}
                    </div>
                    <div className="text-[11px] font-bold text-amber-200">
                      {customWelcomeHeroSubtitle}
                    </div>
                    <div className="p-2 bg-black/40 rounded-lg border border-emerald-900/40 text-[10px]">
                      <span className="font-bold text-[#eec149]">“{customMotto || 'LEARN, ADAPT AND LEAD'}”</span>
                      <span className="text-emerald-200 block text-[9px]">{customSubMotto}</span>
                    </div>
                  </div>

                  {/* Photo Preview & Drop-Upload Zone */}
                  <div className="relative rounded-xl overflow-hidden border-2 border-[#eec149]/60 bg-black group/photo">
                    <img
                      src={customStrategicPlanImage}
                      alt="Featured Welcome Photo"
                      className="w-full h-36 object-cover transform group-hover/photo:scale-102 transition-transform duration-300"
                    />

                    {/* Gradient Overlay with Captions */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent p-2.5 flex flex-col justify-end">
                      <span className="text-[8px] font-black uppercase text-[#eec149] tracking-wider">
                        {customStrategicPlanTag || 'ASYV Strategic Vision'}
                      </span>
                      <span className="text-[11px] font-black text-white leading-tight">
                        {customStrategicPlanTitle}
                      </span>
                    </div>

                    {/* Hover Upload Trigger Overlay */}
                    <label className="absolute inset-0 bg-black/70 opacity-0 group-hover/photo:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center cursor-pointer">
                      <Camera className="w-6 h-6 text-[#eec149] mb-1 animate-bounce" />
                      <span className="text-xs font-black text-white">Click or Drop Photo Here</span>
                      <span className="text-[10px] text-emerald-300">Automatically changes live on front page</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleAutoUploadFeaturedPhoto(file);
                          e.target.value = '';
                        }}
                      />
                    </label>

                    {/* Active Uploading Spinner */}
                    {isUploadingHero && (
                      <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center text-center p-2 z-20">
                        <Loader2 className="w-7 h-7 text-[#eec149] animate-spin mb-1" />
                        <span className="text-xs font-bold text-white">Uploading & Applying...</span>
                        <span className="text-[10px] text-emerald-300">Syncing to all devices worldwide</span>
                      </div>
                    )}
                  </div>

                  {/* Live Status of Register Button */}
                  <div className="flex items-center justify-between pt-1 text-[10px]">
                    <span className="text-slate-300 font-semibold">Student Link: {customAllowStudentReg ? 'Active' : 'Closed'}</span>
                    <span className="text-[10px] text-[#eec149] font-bold">
                      ✓ Changes auto-sync live
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Inspiring Quote / Court of Encouragement Customization */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4 lg:col-span-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#245934]">
                <Sparkles className="w-4 h-4 text-[#eec149]" />
                <span>5. Motivating & Emotional Support Court (Displayed After Visit & On Dashboards)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Inspiring & Emotional Support Quote
                  </label>
                  <textarea
                    rows={2}
                    value={customInspiringQuote}
                    onChange={(e) => setCustomInspiringQuote(e.target.value)}
                    placeholder="e.g. If you see far, you will go far..."
                    className="w-full px-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden font-medium"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Shown upon sign-out / after visiting, and on the student inspiration court banner.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Attribution / Author
                  </label>
                  <input
                    type="text"
                    value={customQuoteAuthor}
                    onChange={(e) => setCustomQuoteAuthor(e.target.value)}
                    placeholder="e.g. Anne Heyman, ASYV Founder"
                    className="w-full px-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden font-bold"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Source or speaker attribution.
                  </span>
                </div>
              </div>

              {/* ASYV Official Color Palette Swatches */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    6. Active ASYV Village Color Theme
                  </span>
                  <span className="text-[11px] font-semibold text-[#245934]">
                    Selected: {ASYV_COLOR_PALETTES.find(p => p.id === customPalette)?.name || 'Acacia Forest'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {ASYV_COLOR_PALETTES.map((p) => {
                    const isSelected = customPalette === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setCustomPalette(p.id)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#245934] ring-2 ring-[#245934]/30 bg-white shadow-xs'
                            : 'border-slate-200 bg-slate-50 hover:bg-white'
                        }`}
                      >
                        <div
                          className="h-6 w-full rounded-lg mb-1 shadow-2xs"
                          style={{ backgroundColor: p.hex }}
                        />
                        <div className="text-[10px] font-bold text-slate-800 truncate">
                          {p.name.split(' ')[0]}
                        </div>
                        <div className="font-mono text-[9px] text-slate-400">
                          {p.hex}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#245934] hover:bg-[#1b4327] text-white font-bold rounded-2xl text-xs sm:text-sm transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4 text-[#eec149]" />
                  <span>Save All Portal Customizations</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: AUDIT LOG & COMPLIANCE ACTIVITY                        */}
      {/* ============================================================== */}
      {activeTab === 'audit' && <AuditLogView />}

      {/* ============================================================== */}
      {/* TAB 3: VILLAGE CONTACT & HOTLINE INFORMATION                  */}
      {/* ============================================================== */}
      {activeTab === 'contacts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#245934]">
                Official School Contacts
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 font-display">
                Edit ASYV Village Support & Emergency Contacts
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                These numbers and contacts appear directly on student SOS alerts, student dashboard headers, and emergency crisis pages.
              </p>
            </div>

            <form onSubmit={handleSaveContactInfo} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Village 24/7 Hotline Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={contactHotline}
                    onChange={(e) => setContactHotline(e.target.value)}
                    placeholder="+250 788 312 400"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Village WhatsApp Urgent Line
                  </label>
                  <input
                    type="text"
                    required
                    value={contactWhatsapp}
                    onChange={(e) => setContactWhatsapp(e.target.value)}
                    placeholder="+250 788 312 401"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Village Health Clinic Extension
                  </label>
                  <input
                    type="text"
                    required
                    value={contactClinic}
                    onChange={(e) => setContactClinic(e.target.value)}
                    placeholder="Extension 104 · Health Center"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confidential Support Email
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="wellbeing@asyv.org"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Physical Office Location on Campus
                </label>
                <input
                  type="text"
                  required
                  value={contactOffice}
                  onChange={(e) => setContactOffice(e.target.value)}
                  placeholder="ASYV Psychosocial Support Center · Main Village Campus, Rubona"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Counseling Coordinator Lead Desk
                  </label>
                  <input
                    type="text"
                    required
                    value={contactLead}
                    onChange={(e) => setContactLead(e.target.value)}
                    placeholder="Village Psychosocial Support Lead"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Office Hours
                  </label>
                  <input
                    type="text"
                    required
                    value={contactHours}
                    onChange={(e) => setContactHours(e.target.value)}
                    placeholder="Monday – Friday: 7:30 AM – 5:30 PM (24/7 on-call)"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Emergency Protocol & Care Guidance Note
                </label>
                <textarea
                  rows={2}
                  value={contactNotice}
                  onChange={(e) => setContactNotice(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-[#245934] hover:bg-[#1b4327] text-white font-bold rounded-2xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save & Publish Village Contact Information</span>
              </button>
            </form>
          </div>

          {/* Live Preview Card */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-[#d95f18]">
                Student View Live Preview
              </div>
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 font-bold text-[#1b4327] text-sm">
                  <Phone className="w-4 h-4 text-[#245934]" />
                  <span>Village Emergency Dispatch</span>
                </div>
                <div className="text-xs space-y-2 text-slate-700">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Hotline</div>
                    <div className="font-mono font-bold text-slate-900 text-sm">{contactHotline}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">WhatsApp Crisis</div>
                    <div className="font-mono font-bold text-slate-900 text-sm">{contactWhatsapp}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Clinic Extension</div>
                    <div className="font-bold text-slate-900">{contactClinic}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Center Desk</div>
                    <div className="text-slate-800">{contactOffice}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: VILLAGE ANNOUNCEMENTS & BULLETINS                       */}
      {/* ============================================================== */}
      {activeTab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#245934]">
                Broadcast Bulletin
              </div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                New Village Notice
              </h2>
            </div>

            <form onSubmit={handleAddAnnouncement} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={newAnnTitle}
                  onChange={(e) => setNewAnnTitle(e.target.value)}
                  placeholder="e.g., Exam Week Mindfulness Circle"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={newAnnCategory}
                  onChange={(e) => setNewAnnCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-semibold"
                >
                  <option value="wellness">Wellness Support</option>
                  <option value="urgent">Urgent Notice</option>
                  <option value="workshop">Workshop</option>
                  <option value="general">General Village Notice</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Grade
                </label>
                <select
                  value={newAnnGrade}
                  onChange={(e) => setNewAnnGrade(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-semibold"
                >
                  <option value="all">All Grades (Ingabe, Ingabo, Ijabo)</option>
                  {GRADES.map(g => (
                    <option key={g} value={g}>{g} Grade Only</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Content
                </label>
                <textarea
                  required
                  rows={4}
                  value={newAnnContent}
                  onChange={(e) => setNewAnnContent(e.target.value)}
                  placeholder="Type the message for the students..."
                  className="w-full p-3 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#245934] hover:bg-[#1b4327] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Broadcast Notice</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Active Notices ({announcements.length})</span>
                <span>Visible on Student & Worker Dashboards</span>
              </div>

              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      ann.active
                        ? 'bg-white border-slate-200 hover:border-[#245934]'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            ann.category === 'urgent'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {ann.category}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {ann.targetGrades === 'all' ? 'All Village Grades' : `${(ann.targetGrades as Grade[]).join(', ')} Grade`}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm">{ann.title}</h3>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ann.content}</p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => toggleAnnouncementActive(ann.id)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                            ann.active
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {ann.active ? 'Active' : 'Hidden'}
                        </button>
                        <button
                          onClick={() => deleteAnnouncement(ann.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: RESOURCE LIBRARY & TIPS MANAGER (REAL DATA INPUT)       */}
      {/* ============================================================== */}
      {activeTab === 'tips' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#245934]">
                Psychosocial Curriculum
              </div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Add Real Guidance Tip
              </h2>
              <p className="text-xs text-slate-500">
                Directly populates the student Tips Explorer page with authentic educational guidance.
              </p>
            </div>

            <form onSubmit={handleAddTip} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={newTipCategory}
                  onChange={(e) => setNewTipCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-semibold"
                >
                  <option value="study">Study Tips & Academic Focus</option>
                  <option value="stress">Stress Management & Calming</option>
                  <option value="social">Social Wellness & Friendship</option>
                  <option value="living">Living Well in Village Society</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={newTipTitle}
                  onChange={(e) => setNewTipTitle(e.target.value)}
                  placeholder="e.g., Grounding During Chemistry Prep"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Summary / Explanation
                </label>
                <textarea
                  required
                  rows={3}
                  value={newTipSummary}
                  onChange={(e) => setNewTipSummary(e.target.value)}
                  placeholder="Explain why this technique works and how to apply it..."
                  className="w-full p-3 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Actionable Step ("Try this today")
                </label>
                <input
                  type="text"
                  value={newTipActionable}
                  onChange={(e) => setNewTipActionable(e.target.value)}
                  placeholder="e.g., Write 3 focus points before evening prep."
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Author Desk
                </label>
                <input
                  type="text"
                  value={newTipAuthor}
                  onChange={(e) => setNewTipAuthor(e.target.value)}
                  placeholder="ASYV Psychosocial Coordination Desk"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#245934] hover:bg-[#1b4327] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Tip to Student Explorer</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Guidance Library Items ({wellnessTips.length})</span>
              <span>Input & Curate Real Student Resources</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1">
              {wellnessTips.map((tip) => (
                <div
                  key={tip.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-emerald-100 text-[#1b4327]">
                        {tip.category}
                      </span>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${tip.title}"?`)) {
                            deleteWellnessTip(tip.id);
                            showToast('Deleted tip from library');
                          }
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{tip.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{tip.summary}</p>
                  </div>

                  <div className="text-[11px] font-medium text-slate-500 pt-2 border-t border-slate-200">
                    <span className="font-bold text-[#245934]">Actionable: </span>
                    {tip.actionable}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 6: GRADE ASSIGNMENTS & QUIZZES                            */}
      {/* ============================================================== */}
      {activeTab === 'assignments' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#245934]">
                Evaluation & Quizzes
              </div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Create Grade Assignment
              </h2>
              <p className="text-xs text-slate-500">
                Distribute multiple choice and open ended reflection quizzes directly to students.
              </p>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={newAssignTitle}
                  onChange={(e) => setNewAssignTitle(e.target.value)}
                  placeholder="e.g., Weekly Stress Check-In Quiz"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assigned Grade
                </label>
                <select
                  value={newAssignGrade}
                  onChange={(e) => setNewAssignGrade(e.target.value as Grade)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl font-semibold"
                >
                  {GRADES.map(g => (
                    <option key={g} value={g}>{g} Grade</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  required
                  value={newAssignDueDate}
                  onChange={(e) => setNewAssignDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Instructions
                </label>
                <textarea
                  rows={2}
                  value={newAssignInstructions}
                  onChange={(e) => setNewAssignInstructions(e.target.value)}
                  placeholder="Instructions for students..."
                  className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                Includes 1 Multiple Choice Question & 1 Open Ended Reflection.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#245934] hover:bg-[#1b4327] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Assignment to Students</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Existing Assignments ({assignments.length})</span>
              <span>Submissions tracked automatically</span>
            </div>

            <div className="space-y-4">
              {assignments.map((asg) => (
                <div key={asg.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-[#1b4327]">
                          {asg.grade} Grade
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Due: {asg.dueDate}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base">{asg.title}</h3>
                      <p className="text-xs text-slate-600 mt-1">{asg.instructions}</p>
                    </div>

                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700">
                      {asg.submissions?.length || 0} Submissions
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 border-t border-slate-200 pt-2">
                    {asg.questions.length} Questions ({asg.questions.filter(q => q.type === 'multiple_choice').length} Multiple Choice, {asg.questions.filter(q => q.type === 'open_ended').length} Open-Ended)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 7: DAILY REFLECTION QUESTIONS                             */}
      {/* ============================================================== */}
      {activeTab === 'daily-questions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#245934]">
                Daily Check-In Prompts
              </div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Set Grade Reflection Prompt
              </h2>
            </div>

            <form onSubmit={handleSaveDailyQuestion} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Grade
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {GRADES.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        setSelectedDqGrade(g);
                        const found = dailyQuestions.find(d => d.grade === g);
                        setDqPrompt(found?.question || '');
                        setDqNote(found?.contextNote || '');
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        selectedDqGrade === g
                          ? 'border-[#245934] bg-emerald-50 text-[#1b4327]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reflection Question Prompt
                </label>
                <textarea
                  required
                  rows={4}
                  value={dqPrompt}
                  onChange={(e) => setDqPrompt(e.target.value)}
                  placeholder="Enter the reflection question for the day..."
                  className="w-full p-3 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Context / Guiding Note
                </label>
                <textarea
                  rows={2}
                  value={dqNote}
                  onChange={(e) => setDqNote(e.target.value)}
                  placeholder="Helpful guidance for answering..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#245934] hover:bg-[#1b4327] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Question for {selectedDqGrade}</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Active Daily Prompts by Grade</span>
              <span>{dailyAnswers.length} Total Student Reflections</span>
            </div>

            <div className="space-y-4">
              {dailyQuestions.map((dq) => (
                <div key={dq.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase px-2 py-0.5 rounded bg-emerald-100 text-[#1b4327]">
                      {dq.grade} Grade
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Author: {dq.socialWorkerName}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{dq.question}</h4>
                  <p className="text-xs text-slate-600">{dq.contextNote}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 8: SOS EMERGENCY MONITOR (ALL GRADES)                      */}
      {/* ============================================================== */}
      {activeTab === 'sos' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-rose-700">
                Village Crisis & SOS Dispatch Monitor
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 font-display">
                Emergency Alerts Across All Village Grades
              </h2>
            </div>
            <span className="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-800 rounded-full text-xs font-bold">
              {activeSosCount} Active Emergency Needs
            </span>
          </div>

          {emergencyAlerts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No emergency alerts recorded. Village atmosphere is calm.
            </div>
          ) : (
            <div className="space-y-3">
              {emergencyAlerts.map((alt) => (
                <div
                  key={alt.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    alt.status === 'active'
                      ? 'border-rose-400 bg-rose-50/60 ring-2 ring-rose-200'
                      : 'border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          alt.urgency === 'critical'
                            ? 'bg-rose-600 text-white animate-pulse'
                            : 'bg-amber-500 text-white'
                        }`}>
                          {alt.urgency} Urgency
                        </span>
                        <span className="font-bold text-slate-800 text-xs">
                          {alt.studentName} {alt.studentFamilyName} ({alt.grade} · {alt.studentClass})
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {new Date(alt.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 font-medium leading-relaxed mt-1">
                        "{alt.message}"
                      </p>
                      {alt.workerResponse && (
                        <div className="mt-2 text-xs text-emerald-800 font-medium bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                          <strong>Response Note:</strong> {alt.workerResponse}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {alt.status === 'active' ? (
                        respondingAlertId === alt.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={sosResponseNote}
                              onChange={(e) => setSosResponseNote(e.target.value)}
                              placeholder="Dispatch response note..."
                              className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl outline-hidden"
                            />
                            <button
                              onClick={() => handleAcknowledgeSos(alt.id)}
                              className="px-3 py-1.5 bg-[#245934] text-white rounded-xl text-xs font-bold cursor-pointer"
                            >
                              Dispatch
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setRespondingAlertId(alt.id)}
                            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                          >
                            Respond & Resolve SOS
                          </button>
                        )
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          Resolved
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* EDIT USER CREDENTIALS MODAL                                     */}
      {/* ============================================================== */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 animate-fadeIn">
          <form onSubmit={handleSaveEdit} className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative space-y-4">
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#245934]">
                Administrator Credential Editor
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Edit User Registration Data
              </h2>
              <p className="text-xs text-slate-500">
                Correct invalid names, misassigned grades, typos, or reset passwords.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                />
              </div>

              {editingUser.role === 'student' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Family Name
                  </label>
                  <input
                    type="text"
                    value={editFamilyName}
                    onChange={(e) => setEditFamilyName(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assigned Grade
                </label>
                <select
                  value={editGrade}
                  onChange={(e) => setEditGrade(e.target.value as Grade)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden font-semibold"
                >
                  {GRADES.map(g => (
                    <option key={g} value={g}>{g} Grade</option>
                  ))}
                </select>
              </div>

              {editingUser.role === 'student' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Class / Combination
                  </label>
                  <input
                    type="text"
                    value={editClass}
                    onChange={(e) => setEditClass(e.target.value)}
                    placeholder="e.g., Senior 4 MEG"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password / Reset Key
              </label>
              <input
                type="text"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                placeholder="Set new password..."
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden font-mono"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#245934] hover:bg-[#1b4327] text-white font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Corrections</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* ADD REAL STUDENT MODAL                                         */}
      {/* ============================================================== */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 animate-fadeIn">
          <form onSubmit={handleAddStudentSubmit} className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative space-y-4">
            <button
              type="button"
              onClick={() => setShowAddStudentModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#245934]">
                Direct Student Registration
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Add Real Student to Village Roster
              </h2>
              <p className="text-xs text-slate-500">
                Enroll a student directly under their official grade and family house.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g., Amani"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Family Name
                </label>
                <input
                  type="text"
                  required
                  value={newStudentFamilyName}
                  onChange={(e) => setNewStudentFamilyName(e.target.value)}
                  placeholder="e.g., Mugisha"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Student Email Address
              </label>
              <input
                type="email"
                required
                value={newStudentEmail}
                onChange={(e) => setNewStudentEmail(e.target.value)}
                placeholder="amani.mugisha@asyv.edu.rw"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Grade
                </label>
                <select
                  value={newStudentGrade}
                  onChange={(e) => setNewStudentGrade(e.target.value as Grade)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden font-semibold"
                >
                  {GRADES.map(g => (
                    <option key={g} value={g}>{g} Grade</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Combination / Class
                </label>
                <input
                  type="text"
                  value={newStudentClass}
                  onChange={(e) => setNewStudentClass(e.target.value)}
                  placeholder="Senior 4 MEG"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Initial Password
              </label>
              <input
                type="text"
                required
                value={newStudentPassword}
                onChange={(e) => setNewStudentPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden font-mono"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddStudentModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#245934] hover:bg-[#1b4327] text-white font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register Student</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* ADD SOCIAL WORKER MODAL                                         */}
      {/* ============================================================== */}
      {showAddWorkerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 animate-fadeIn">
          <form onSubmit={handleAddWorkerSubmit} className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative space-y-4">
            <button
              type="button"
              onClick={() => setShowAddWorkerModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Staff Appointment
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Register Grade Social Worker
              </h2>
              <p className="text-xs text-slate-500">
                Assign a dedicated psychosocial counselor and grade leader to the ASYV Village.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name & Title
              </label>
              <input
                type="text"
                required
                value={newWorkerName}
                onChange={(e) => setNewWorkerName(e.target.value)}
                placeholder="e.g., Aimable Rwamucyo"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-teal-700 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Staff Email Address
              </label>
              <input
                type="email"
                required
                value={newWorkerEmail}
                onChange={(e) => setNewWorkerEmail(e.target.value)}
                placeholder="worker@ingabe26 or aimable@asyv.org.rw"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-teal-700 outline-hidden font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Must be unique. Single-use email policy strictly enforced.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assigned Grade Leader
                </label>
                <select
                  value={newWorkerGrade}
                  onChange={(e) => setNewWorkerGrade(e.target.value as Grade)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:border-teal-700 outline-hidden font-semibold"
                >
                  {GRADES.map(g => (
                    <option key={g} value={g}>{g} Grade Leader</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Initial Password (PSD)
                </label>
                <input
                  type="text"
                  required
                  value={newWorkerPassword}
                  onChange={(e) => setNewWorkerPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-teal-700 outline-hidden font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddWorkerModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register Social Worker</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* QUICK PASSWORD RECOVERY / RESET MODAL                          */}
      {/* ============================================================== */}
      {resettingUserPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 animate-fadeIn">
          <form onSubmit={handleQuickResetPassword} className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative space-y-4">
            <button
              type="button"
              onClick={() => {
                setResettingUserPassword(null);
                setNewPasswordInput('');
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#d95f18] flex items-center gap-1.5">
                <KeyRound className="w-4 h-4" />
                <span>System Admin Password Recovery</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-display mt-0.5">
                Recover User Password
              </h2>
              <p className="text-xs text-slate-500">
                Reset forgotten password for <strong className="text-slate-800">{resettingUserPassword.name} {resettingUserPassword.familyName || ''}</strong>.
              </p>
            </div>

            {/* Current Account Details & Existing PSD */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">User Email:</span>
                <span className="font-mono text-slate-800 font-bold">{resettingUserPassword.email}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Role & Grade:</span>
                <span className="font-semibold text-[#245934]">{resettingUserPassword.role} · {resettingUserPassword.grade}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <span className="text-xs text-slate-600 font-medium">Currently Stored PSD:</span>
                <div className="flex items-center gap-1.5">
                  <span className={`font-mono text-xs px-2 py-0.5 rounded font-bold ${
                    revealedPasswords[resettingUserPassword.id]
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600 tracking-wider'
                  }`}>
                    {revealedPasswords[resettingUserPassword.id] ? (resettingUserPassword.password || 'password123') : '••••••••'}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleRevealPassword(resettingUserPassword.id)}
                    className="px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded text-[10px] font-bold cursor-pointer"
                  >
                    {revealedPasswords[resettingUserPassword.id] ? 'Hide' : 'See PSD'}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Enter New Password / Recovery Key
              </label>
              <input
                type="text"
                required
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                placeholder="Type new password or pick a preset below..."
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-[#245934] outline-hidden font-mono"
              />
            </div>

            {/* Quick Generator Presets */}
            <div>
              <span className="block text-[11px] font-bold text-slate-500 mb-1.5">
                Quick Temporary Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {['asyv2026!', 'village2026', 'rubona2026', 'hope2026'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setNewPasswordInput(preset)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-900 border border-slate-200 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setResettingUserPassword(null);
                  setNewPasswordInput('');
                }}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#245934] hover:bg-[#1b4327] text-white font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>Save New Password</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* USER DOSSIER & COMPREHENSIVE INFORMATION MODAL                 */}
      {/* ============================================================== */}
      {selectedDossierUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedDossierUser(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <img
                src={selectedDossierUser.avatar}
                alt={selectedDossierUser.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#245934]/20 shadow-xs"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900 font-display">
                    {selectedDossierUser.name} {selectedDossierUser.familyName || ''}
                  </h2>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    selectedDossierUser.role === 'developer'
                      ? 'bg-slate-900 text-white'
                      : selectedDossierUser.role === 'social_worker'
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {selectedDossierUser.role === 'developer' ? 'Master Admin' : selectedDossierUser.role.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {selectedDossierUser.email}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedDossierUser.email);
                      showToast(`Copied ${selectedDossierUser.email}`);
                    }}
                    className="p-1 text-slate-400 hover:text-[#245934] cursor-pointer"
                    title="Copy email"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Credential & Password Recovery Box */}
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-[#d95f18]" />
                  <span>Account Credentials & Password (PSD)</span>
                </span>
                <button
                  type="button"
                  onClick={() => toggleRevealPassword(selectedDossierUser.id)}
                  className="px-2 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 border border-amber-300 rounded text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {revealedPasswords[selectedDossierUser.id] ? (
                    <>
                      <EyeOff className="w-3 h-3 text-amber-900" />
                      <span>Hide PSD</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3 text-amber-900" />
                      <span>See PSD</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-amber-200">
                <span className="font-mono text-xs font-bold text-slate-800">
                  {revealedPasswords[selectedDossierUser.id] ? (selectedDossierUser.password || 'password123') : '••••••••••••'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedDossierUser.password || 'password123');
                      showToast(`Password copied for ${selectedDossierUser.name}!`);
                    }}
                    className="px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 rounded flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy PSD</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setResettingUserPassword(selectedDossierUser);
                      setNewPasswordInput('');
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold bg-[#245934] hover:bg-[#1b4327] text-white rounded flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Change PSD</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[11px] text-slate-500 block uppercase font-bold tracking-wider">Assigned Grade</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">{selectedDossierUser.grade} Grade</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[11px] text-slate-500 block uppercase font-bold tracking-wider">Class / Combination</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">{selectedDossierUser.schoolClass || 'General ASYV'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[11px] text-slate-500 block uppercase font-bold tracking-wider">Registered Since</span>
                <span className="text-xs font-semibold text-slate-800 mt-0.5 block">{new Date(selectedDossierUser.registeredAt).toLocaleString()}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[11px] text-slate-500 block uppercase font-bold tracking-wider">Mental Champion</span>
                <span className="text-xs font-bold text-emerald-800 mt-0.5 block">
                  {selectedDossierUser.isMentalChampion || selectedDossierUser.championStatus === 'approved' ? 'Active Ambassador' : 'Standard Account'}
                </span>
              </div>
            </div>

            {/* User Bio if present */}
            {selectedDossierUser.bio && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                <span className="text-[11px] text-slate-500 block uppercase font-bold tracking-wider mb-1">Bio / Profile Notes</span>
                <p className="text-slate-700 leading-relaxed">{selectedDossierUser.bio}</p>
              </div>
            )}

            {/* Action Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {selectedDossierUser.role !== 'developer' && (
                  <button
                    type="button"
                    onClick={() => {
                      impersonateUser(selectedDossierUser);
                      setSelectedDossierUser(null);
                    }}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-[#245934] hover:text-white text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View App As User</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    handleStartEdit(selectedDossierUser);
                    setSelectedDossierUser(null);
                  }}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Info</span>
                </button>

                {selectedDossierUser.role !== 'developer' && (
                  <button
                    type="button"
                    onClick={() => {
                      const u = selectedDossierUser;
                      setSelectedDossierUser(null);
                      setUserToDelete(u);
                    }}
                    className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete User Completely</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedDossierUser(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CONFIRMATION MODALS (CLEAR SAMPLE DATA / RESTORE SAMPLE DATA)  */}
      {/* ============================================================== */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-[#d95f18]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Initialize Clean Real Database?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This will remove all demo students, test messages, and dummy submissions, leaving the system 100% clean so you and the grade social workers can input authentic student data.
            </p>
            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearSampleDataToCleanState();
                  setShowResetConfirmModal(false);
                  showToast('Database wiped of sample data. Ready for real ASYV data!');
                }}
                className="px-5 py-2.5 bg-[#d95f18] hover:bg-[#b84e12] text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
              >
                Yes, Start Clean Database
              </button>
            </div>
          </div>
        </div>
      )}

      {showRestoreConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-700">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Load Official Sample Template?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This will restore sample student records, test assignments, and demonstration questions for review and testing.
            </p>
            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowRestoreConfirmModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  restoreSampleData();
                  setShowRestoreConfirmModal(false);
                  showToast('Sample template data reloaded!');
                }}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
              >
                Load Sample Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PURGE ALL USERS MODAL (LEAVES ONLY ADMIN) */}
      {showPurgeAllUsersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-rose-100 space-y-4">
            <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Delete All Accounts in System?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This will permanently delete every single student and social worker account in the database. <strong className="text-slate-900">Only the Master Administrator account ({currentUser.email}) will remain in the system.</strong>
            </p>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 font-medium">
              ⚠️ You can subsequently add real students and social workers manually or allow registration from your Customizer tab.
            </div>
            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowPurgeAllUsersModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteAllNonAdminUsers();
                  setShowPurgeAllUsersModal(false);
                  showToast('All accounts deleted! Only the Master Administrator account remains in the system.');
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
              >
                Yes, Delete All Other Accounts
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PERMANENT COMPLETE USER DELETION MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border-2 border-rose-300 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                  Master Admin Action
                </span>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  Delete User Completely?
                </h3>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-900 text-sm">
                {userToDelete.name} {userToDelete.familyName || ''}
              </div>
              <div className="text-slate-500 font-mono text-[11px]">
                {userToDelete.email}
              </div>
              <div className="flex items-center gap-2 pt-1 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-slate-200 font-bold text-slate-700 capitalize">
                  {userToDelete.role.replace('_', ' ')}
                </span>
                <span className="font-semibold text-[#245934]">
                  {userToDelete.grade} Grade
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This will <strong>permanently delete</strong> this user from the system, including all their messages, questionnaire submissions, and logs. This action is irreversible.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteUser(userToDelete.id);
                  showToast(`Permanently deleted account for ${userToDelete.name}!`);
                  setUserToDelete(null);
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
              >
                Yes, Delete Completely
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Button at bottom of developer dashboard */}
      <div className="pt-6 border-t border-slate-200 flex justify-center">
        <button
          onClick={logout}
          className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-700 hover:text-rose-700 font-bold rounded-2xl text-sm transition-all shadow-xs cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Sign Out from Master Administrator Console</span>
        </button>
      </div>
    </div>
  );
};
