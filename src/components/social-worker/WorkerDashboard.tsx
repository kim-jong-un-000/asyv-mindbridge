import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  MessageSquare,
  AlertOctagon,
  ListTodo,
  FileCheck2,
  CalendarDays,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  LogOut,
  Sparkles,
  HelpCircle,
  Phone,
  MapPin,
  Edit3,
  Save,
  X,
  PhoneCall,
  Send,
  AlertTriangle,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Check,
  Eye,
  Heart,
  Quote,
  RefreshCw
} from 'lucide-react';
import { Assignment, AssignmentSubmission, VillageContactItem } from '../../types';
import { TRANSLATIONS } from '../../utils/i18n';
import { INSPIRING_EMOTIONAL_QUOTES } from '../../data/initialData';

export const WorkerDashboard: React.FC = () => {
  const {
    currentUser,
    getStudentsByGrade,
    messages,
    sendMessage,
    todos,
    addTodo,
    toggleTodo,
    stopAlert,
    isAlertActive,
    emergencyAlerts,
    acknowledgeEmergency,
    timetables,
    assignments,
    users,
    setActivePage,
    logout,
    updateSocialWorkerProfile,
    contactInfo,
    updateContactInfo,
    language,
    appCustomization
  } = useApp();

  const [quoteIdx, setQuoteIdx] = useState<number>(0);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Profile modal state
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileWhatsapp, setProfileWhatsapp] = useState(currentUser?.whatsappNumber || '');
  const [profileLocation, setProfileLocation] = useState(currentUser?.officeLocation || '');
  const [profileBio, setProfileBio] = useState(currentUser?.bio || '');

  // Hotline and Contacts Management Modal state
  const [showHotlineModal, setShowHotlineModal] = useState(false);
  const [hotlinePhoneInput, setHotlinePhoneInput] = useState(contactInfo.hotlinePhone);
  const [whatsappPhoneInput, setWhatsappPhoneInput] = useState(contactInfo.whatsappPhone);
  const [clinicExtInput, setClinicExtInput] = useState(contactInfo.clinicExtension);
  const [contactsList, setContactsList] = useState<VillageContactItem[]>(contactInfo.customContacts || []);
  const [newContactName, setNewContactName] = useState('');
  const [newContactRole, setNewContactRole] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactCategory, setNewContactCategory] = useState<VillageContactItem['category']>('mental_health');

  // Visual summary widget tab state
  const [summaryView, setSummaryView] = useState<'students' | 'incomplete' | 'submissions'>('students');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('');
  const [selectedSubmission, setSelectedSubmission] = useState<{ studentName: string; submission: AssignmentSubmission } | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string>('');

  if (!currentUser || currentUser.role !== 'social_worker') return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSocialWorkerProfile({
      name: profileName,
      phone: profilePhone,
      whatsappNumber: profileWhatsapp,
      officeLocation: profileLocation,
      bio: profileBio
    });
    showToast('Profile and personal contact numbers updated!');
    setShowEditProfileModal(false);
  };

  const handleSaveHotlines = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactInfo({
      hotlinePhone: hotlinePhoneInput,
      whatsappPhone: whatsappPhoneInput,
      clinicExtension: clinicExtInput,
      customContacts: contactsList,
      updatedAt: new Date().toISOString()
    });
    showToast('Village hotline numbers and support contacts saved!');
    setShowHotlineModal(false);
  };

  const handleAddCustomContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;

    const newContact: VillageContactItem = {
      id: `c-${Date.now()}`,
      name: newContactName.trim(),
      role: newContactRole.trim() || 'Village Psychosocial Support',
      phone: newContactPhone.trim(),
      category: newContactCategory
    };

    setContactsList(prev => [...prev, newContact]);
    setNewContactName('');
    setNewContactRole('');
    setNewContactPhone('');
    showToast(`Added contact: ${newContact.name}`);
  };

  const handleRemoveContact = (id: string) => {
    setContactsList(prev => prev.filter(c => c.id !== id));
  };

  // Grade data
  const gradeStudents = getStudentsByGrade(currentUser.grade);
  const gradeAssignments = assignments.filter(a => a.grade === currentUser.grade);
  const pendingTodos = todos.filter(t => t.workerId === currentUser.id && !t.isCompleted);
  const gradeSosAlerts = emergencyAlerts.filter(
    a => a.grade === currentUser.grade && a.status === 'active'
  );
  const gradeMessages = messages.filter(
    m => m.receiverId === currentUser.id && !m.isRead
  );
  const pendingChampionApps = gradeStudents.filter(
    s => s.championStatus === 'pending'
  );
  const gradeChampions = gradeStudents.filter(
    s => s.isMentalChampion || s.championStatus === 'approved'
  );

  // Overall completion calculation
  const totalPossibleSubmissions = gradeStudents.length * gradeAssignments.length;
  let totalReceivedSubmissions = 0;
  gradeAssignments.forEach(a => {
    totalReceivedSubmissions += a.submissions.filter(s =>
      gradeStudents.some(gs => gs.id === s.studentId)
    ).length;
  });

  const overallPercentage = totalPossibleSubmissions > 0
    ? Math.round((totalReceivedSubmissions / totalPossibleSubmissions) * 100)
    : 100;

  // Student specific completion analysis
  const studentCompletionStats = gradeStudents.map(student => {
    const completedAssignments = gradeAssignments.filter(a =>
      a.submissions.some(s => s.studentId === student.id)
    );
    const uncompletedAssignments = gradeAssignments.filter(a =>
      !a.submissions.some(s => s.studentId === student.id)
    );

    const total = gradeAssignments.length;
    const completedCount = completedAssignments.length;
    const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 100;

    return {
      student,
      total,
      completedCount,
      percentage,
      isFullyCompleted: uncompletedAssignments.length === 0,
      completedAssignments,
      uncompletedAssignments
    };
  });

  // Students who have incomplete / unanswered assignments
  const incompleteStudents = studentCompletionStats.filter(s => !s.isFullyCompleted && s.total > 0);

  // Send quick alert reminder to student
  const handleSendReminderAlert = (studentId: string, studentName: string, assignmentTitle?: string) => {
    const taskTitle = assignmentTitle || 'your assigned grade questionnaire / coursework';
    const reminderMsg = `⚠️ [Urgent Reminder from your ${currentUser.grade} Grade Leader, ${currentUser.name}]: Please complete and submit your pending assignment "${taskTitle}". Feel free to message me back or visit my counseling desk if you need any support or guidance!`;

    sendMessage(studentId, reminderMsg);
    showToast(`Urgent alert reminder sent to ${studentName}!`);
  };

  // Approaching deadline tasks using central active alert filter
  const approachingTodos = pendingTodos.filter(isAlertActive);

  const currentQuote = INSPIRING_EMOTIONAL_QUOTES[quoteIdx % INSPIRING_EMOTIONAL_QUOTES.length];
  const displayQuote = appCustomization?.customInspirationalQuote && quoteIdx === 0
    ? appCustomization.customInspirationalQuote
    : currentQuote.quote[language] || currentQuote.quote.en;
  const displayAuthor = appCustomization?.customQuoteAuthor && quoteIdx === 0
    ? appCustomization.customQuoteAuthor
    : `${currentQuote.author} · ${currentQuote.sourceOrRole}`;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1b4327] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-400/30 animate-fadeIn text-xs sm:text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 text-[#eec149]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* NON-OBSTRUCTIVE INLINE URGENT DEADLINES BANNER */}
      {approachingTodos.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-md border-2 border-rose-500/80 dark:border-rose-600 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px] uppercase tracking-wider">
                    {t.urgentActionRequired}
                  </span>
                  <span className="text-xs font-bold text-rose-700 dark:text-rose-400">
                    {approachingTodos.length} Active Deadline Alert{approachingTodos.length > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Stop alert pauses notification until deadline is near. Clicking Done or Add Other Task clears the alert.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setActivePage('todo')}
                className="px-3 py-1.5 bg-[#245934] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Other Task</span>
              </button>
              <button
                onClick={() => setActivePage('todo')}
                className="text-xs font-bold text-rose-700 dark:text-rose-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {approachingTodos.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-900 dark:text-white text-xs truncate">
                    {task.title}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="font-semibold text-rose-700 dark:text-rose-400 capitalize">
                      {task.priority}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-2.5 h-2.5 text-rose-500" />
                      {task.dueDate || t.dueToday}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      stopAlert(task.id);
                      showToast(`Alert stopped for "${task.title}". Will return when deadline approaches.`);
                    }}
                    className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-[11px] transition-all cursor-pointer"
                    title="Stop alert for now; will return when time approaches"
                  >
                    Stop Alert
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      toggleTodo(task.id);
                      showToast(`Task "${task.title}" marked as done!`);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[11px] transition-all shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{t.markDone}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-emerald-400 mb-1">
            <span>Official ASYV Psychosocial Panel</span>
            <span>·</span>
            <span>{currentUser.grade} {t.socialWorker}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            {t.workerWelcomeTitle}, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {t.workerWelcomeSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Dedicated Monitor My Worker Page Button */}
          <button
            onClick={() => setActivePage('monitor-my-worker')}
            className="px-4 py-2.5 bg-gradient-to-r from-teal-800 to-[#1b4327] hover:from-teal-900 hover:to-[#15341e] text-white text-xs font-extrabold rounded-2xl transition-all cursor-pointer flex items-center gap-2 shadow-md ring-2 ring-emerald-400/40"
          >
            <FileCheck2 className="w-4 h-4 text-[#eec149]" />
            <span>{t.monitorWorkerBtn} ({incompleteStudents.length} {t.pending})</span>
          </button>

          {/* Edit Profile & Personal Phone */}
          <button
            onClick={() => {
              setProfileName(currentUser.name || '');
              setProfilePhone(currentUser.phone || '');
              setProfileWhatsapp(currentUser.whatsappNumber || '');
              setProfileLocation(currentUser.officeLocation || '');
              setProfileBio(currentUser.bio || '');
              setShowEditProfileModal(true);
            }}
            className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-2xl transition-colors cursor-pointer flex items-center gap-2 border border-slate-200 dark:border-slate-700"
          >
            <Edit3 className="w-4 h-4 text-teal-700 dark:text-emerald-400" />
            <span>{t.myProfileBtn}</span>
          </button>

          {/* Manage Village Hotlines & Important Help Contacts */}
          <button
            onClick={() => {
              setHotlinePhoneInput(contactInfo.hotlinePhone);
              setWhatsappPhoneInput(contactInfo.whatsappPhone);
              setClinicExtInput(contactInfo.clinicExtension);
              setContactsList(contactInfo.customContacts || []);
              setShowHotlineModal(true);
            }}
            className="px-3.5 py-2.5 bg-[#245934] hover:bg-[#1b4327] text-white text-xs font-bold rounded-2xl transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
          >
            <PhoneCall className="w-4 h-4 text-[#eec149]" />
            <span>{t.hotlineNumbersBtn}</span>
          </button>

          {/* Open Planner */}
          <button
            onClick={() => setActivePage('todo')}
            className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl transition-colors cursor-pointer flex items-center gap-2"
          >
            <ListTodo className="w-4 h-4" />
            <span>{t.todoPlannerBtn} ({pendingTodos.length})</span>
          </button>
        </div>
      </div>

      {/* MOTIVATING COURT & EMOTIONAL SUPPORT BANNER FOR SOCIAL WORKERS */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#1b4327] via-[#245934] to-[#122e1b] text-white shadow-sm relative overflow-hidden group">
        <div className="absolute right-2 -bottom-2 opacity-10 pointer-events-none">
          <Quote className="w-28 h-28" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#eec149] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-[#eec149] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#eec149]" />
              <span>{t.courtOfInspiration}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setQuoteIdx((prev) => (prev + 1) % INSPIRING_EMOTIONAL_QUOTES.length)}
            className="text-xs font-bold text-emerald-100 hover:text-white flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl cursor-pointer transition-colors w-fit border border-white/10"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t.inspireAnotherCourt}</span>
          </button>
        </div>

        <p className="text-sm sm:text-base font-medium italic leading-relaxed text-amber-50 mb-2">
          "{displayQuote}"
        </p>

        <div className="text-xs text-emerald-200 font-semibold flex items-center justify-between pt-1 border-t border-white/10">
          <span>— {displayAuthor}</span>
          <span className="text-[10px] uppercase font-bold text-[#eec149]">ASYV Staff & Village Sanctuary</span>
        </div>
      </div>

      {/* EMERGENCY SOS BANNER (Prominently displayed when students in their grade send SOS) */}
      {gradeSosAlerts.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-500 rounded-3xl p-5 sm:p-6 shadow-md animate-pulse">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <AlertOctagon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-rose-600 text-white rounded-md text-[10px] font-bold uppercase tracking-wider">
                    CRITICAL NOTIFICATION
                  </span>
                  <span className="text-xs font-bold text-rose-900">
                    {gradeSosAlerts.length} Student SOS Alert from {currentUser.grade} Grade
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-rose-900 font-display mt-1">
                  Urgent Student Assistance Request
                </h2>
                <div className="mt-2 space-y-2">
                  {gradeSosAlerts.map(alert => (
                    <div key={alert.id} className="p-3 bg-white rounded-xl border border-rose-200 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{alert.studentName} {alert.studentFamilyName} ({alert.studentClass})</span>
                        <span className="font-mono text-slate-400">
                          {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-rose-800 italic">"{alert.message}"</p>
                      <div className="pt-2 flex gap-2">
                        <button
                          onClick={() => {
                            acknowledgeEmergency(alert.id, 'Social worker acknowledges and is responding.');
                            showToast('SOS acknowledged!');
                          }}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                        >
                          Acknowledge & Respond
                        </button>
                        <button
                          onClick={() => setActivePage('chat')}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-semibold cursor-pointer"
                        >
                          Direct Chat
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setActivePage('sos-alerts')}
              className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-xl shadow-xs shrink-0 cursor-pointer"
            >
              View SOS Center
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Students */}
        <div
          onClick={() => setActivePage('students')}
          className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-teal-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              {currentUser.grade} Students
            </span>
            <Users className="w-5 h-5 text-teal-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tabular-nums">
            {gradeStudents.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Registered students in grade
          </div>
        </div>

        {/* Distributed Assignments & Tasks */}
        <div
          onClick={() => setActivePage('assignments')}
          className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-teal-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Grade Tasks & Forms
            </span>
            <FileCheck2 className="w-5 h-5 text-teal-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tabular-nums">
            {gradeAssignments.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Distributed to {currentUser.grade}
          </div>
        </div>

        {/* Overall Completion Rate */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Completion Rate
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#245934] font-display tabular-nums">
            {overallPercentage}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {totalReceivedSubmissions} of {totalPossibleSubmissions} submitted
          </div>
        </div>

        {/* Incomplete Students Alert */}
        <div
          onClick={() => setSummaryView('incomplete')}
          className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:border-amber-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Pending Follow-ups
            </span>
            <AlertTriangle className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 font-display tabular-nums">
            {incompleteStudents.length}
          </div>
          <div className="text-[11px] text-amber-700 mt-1 font-semibold">
            {incompleteStudents.length > 0 ? 'Students need follow-up' : 'All students completed!'}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VISUAL SUMMARY WIDGET: MONITOR MY WORKER / GRADE TASKS & COMPLETION       */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden">
        {/* Widget Top Header */}
        <div className="p-6 bg-gradient-to-r from-teal-900 via-[#1b4327] to-teal-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#eec149]">
              <FileCheck2 className="w-4 h-4 text-[#eec149]" />
              <span>Monitor My Grade Tasks & Questionnaires</span>
            </div>
            <h2 className="text-xl font-extrabold font-display text-white mt-1">
              Student Assignment Progress & Follow-up Center
            </h2>
            <p className="text-xs text-emerald-100/90 mt-0.5">
              View completion percentage per student, inspect submitted answers, and dispatch 1-click alert messages to students who haven't completed work.
            </p>
          </div>

          {/* Segmented View Switcher */}
          <div className="flex items-center gap-1 bg-black/25 rounded-2xl p-1 border border-white/10 shrink-0 text-xs font-bold">
            <button
              onClick={() => setSummaryView('students')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                summaryView === 'students'
                  ? 'bg-white text-teal-950 shadow-xs'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              All Students ({gradeStudents.length})
            </button>
            <button
              onClick={() => setSummaryView('incomplete')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                summaryView === 'incomplete'
                  ? 'bg-[#d95f18] text-white shadow-xs'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              <span>Needs Follow-up</span>
              {incompleteStudents.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-[#d95f18] text-[10px] flex items-center justify-center font-black">
                  {incompleteStudents.length}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setSummaryView('submissions');
                if (gradeAssignments.length > 0 && !selectedAssignmentId) {
                  setSelectedAssignmentId(gradeAssignments[0].id);
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                summaryView === 'submissions'
                  ? 'bg-white text-teal-950 shadow-xs'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              Inspect Answers ({totalReceivedSubmissions})
            </button>
          </div>
        </div>

        {/* Tab Content 1: All Students Progress Breakdown */}
        {summaryView === 'students' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-100">
              <span>{currentUser.grade} Student Roster ({gradeStudents.length})</span>
              <span>Tasks Completed & Progress Bar</span>
            </div>

            {gradeAssignments.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No assignments have been published yet for {currentUser.grade} Grade. Click "Set Grade Assignments" above to dispatch questionnaires.
              </div>
            ) : (
              <div className="space-y-3">
                {studentCompletionStats.map(({ student, total, completedCount, percentage, isFullyCompleted, uncompletedAssignments }) => (
                  <div
                    key={student.id}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-teal-400 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-11 h-11 rounded-2xl object-cover ring-1 ring-slate-200 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          <span>{student.name} {student.familyName || ''}</span>
                          {isFullyCompleted ? (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-700" />
                              <span>100% Finished</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-700" />
                              <span>{uncompletedAssignments.length} Pending</span>
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{student.schoolClass || 'General'}</span>
                          <span className="text-slate-300">·</span>
                          <span className="font-mono text-teal-800 text-[11px]">{student.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Actions */}
                    <div className="flex items-center gap-4 min-w-[280px]">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700">
                            {completedCount} / {total} Completed
                          </span>
                          <span className="font-extrabold text-[#245934]">
                            {percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-500 ${
                              percentage === 100
                                ? 'bg-emerald-600'
                                : percentage >= 50
                                ? 'bg-teal-600'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>

                      {/* 1-Click Alert Reminder Action if Incomplete */}
                      {!isFullyCompleted && (
                        <button
                          type="button"
                          onClick={() => handleSendReminderAlert(
                            student.id,
                            student.name,
                            uncompletedAssignments[0]?.title
                          )}
                          className="px-3 py-1.5 bg-[#d95f18] hover:bg-[#b84e12] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
                          title="Send instant urgent reminder message to this student"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Alert</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content 2: Needs Follow-up (Unanswered tasks only) */}
        {summaryView === 'incomplete' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 p-3.5 rounded-2xl">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#d95f18]" />
                <span>Quick Follow-up: Students with Unfinished Questionnaires / Tasks</span>
              </div>
              <span className="font-extrabold">
                {incompleteStudents.length} Students Pending Work
              </span>
            </div>

            {incompleteStudents.length === 0 ? (
              <div className="p-10 text-center bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-base">Exceptional News! No Pending Work</h3>
                <p className="text-xs text-emerald-800">
                  Every registered student in {currentUser.grade} Grade has submitted all assigned questionnaires.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {incompleteStudents.map(({ student, uncompletedAssignments, completedCount, total }) => (
                  <div
                    key={student.id}
                    className="p-5 rounded-2xl border-2 border-amber-200 bg-white shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <div className="font-bold text-sm text-slate-900">
                            {student.name} {student.familyName || ''}
                          </div>
                          <div className="text-xs text-slate-500">
                            {student.schoolClass} · {student.email}
                          </div>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[11px] font-bold">
                        {uncompletedAssignments.length} Missing
                      </span>
                    </div>

                    <div className="bg-amber-50/60 rounded-xl p-3 border border-amber-100 text-xs space-y-1.5">
                      <div className="font-bold text-amber-900 text-[11px] uppercase tracking-wider">
                        Unsubmitted Tasks:
                      </div>
                      {uncompletedAssignments.map(a => (
                        <div key={a.id} className="flex items-center justify-between text-slate-700">
                          <span className="font-medium truncate max-w-[200px]">• {a.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono">Due: {a.dueDate}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleSendReminderAlert(
                          student.id,
                          student.name,
                          uncompletedAssignments[0]?.title
                        )}
                        className="flex-1 py-2 px-3 bg-[#d95f18] hover:bg-[#b84e12] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Dispatch Urgent Reminder</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActivePage('chat')}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        1-on-1 Chat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content 3: Inspect Received Answers & Questionnaires */}
        {summaryView === 'submissions' && (
          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Questionnaire / Assessment:
                </label>
                <select
                  value={selectedAssignmentId}
                  onChange={(e) => setSelectedAssignmentId(e.target.value)}
                  className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 outline-hidden cursor-pointer"
                >
                  {gradeAssignments.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.title} ({a.submissions.length} received submissions)
                    </option>
                  ))}
                </select>
              </div>

              {selectedAssignmentId && (() => {
                const targetAssign = gradeAssignments.find(a => a.id === selectedAssignmentId);
                return (
                  <div className="text-xs text-slate-500">
                    Received <strong className="text-teal-800 font-bold">{targetAssign?.submissions.length || 0}</strong> of {gradeStudents.length} student answers
                  </div>
                );
              })()}
            </div>

            {(() => {
              const targetAssign = gradeAssignments.find(a => a.id === selectedAssignmentId);
              if (!targetAssign) {
                return (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    Please select an assignment above to inspect submissions.
                  </div>
                );
              }

              if (targetAssign.submissions.length === 0) {
                return (
                  <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-slate-200">
                    No submissions have been received yet for "{targetAssign.title}".
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Student Submissions ({targetAssign.submissions.length}):
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {targetAssign.submissions.map((sub) => {
                      const studentObj = gradeStudents.find(s => s.id === sub.studentId);
                      return (
                        <div
                          key={sub.id}
                          className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2 hover:border-teal-500 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              {studentObj && (
                                <img
                                  src={studentObj.avatar}
                                  alt={sub.studentName}
                                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                                />
                              )}
                              <div>
                                <div className="font-bold text-xs text-slate-900">
                                  {sub.studentName}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {new Date(sub.submittedAt).toLocaleDateString()} at {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => setSelectedSubmission({
                                studentName: sub.studentName,
                                submission: sub
                              })}
                              className="px-3 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Answers</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Main 2-Column Action Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Students Directory Quickview */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                {currentUser.grade} Grade Students List
              </h2>
              <p className="text-xs text-slate-500">
                Registered students in your grade network. Click to view full student dossier.
              </p>
            </div>
            <button
              onClick={() => setActivePage('students')}
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({gradeStudents.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {gradeStudents.map((s) => (
              <div
                key={s.id}
                onClick={() => setActivePage('students')}
                className="p-3.5 rounded-2xl border border-slate-200/70 hover:border-teal-500 bg-slate-50/50 hover:bg-white transition-all cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={s.avatar}
                    alt={s.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <div className="font-bold text-sm text-slate-900">
                      {s.name} {s.familyName || ''}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span>Class: {s.schoolClass || 'General'}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[11px] text-teal-700 font-medium">{s.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {s.isMentalChampion && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md text-[11px] font-bold">
                      Champion
                    </span>
                  )}
                  <span className="text-xs font-bold text-teal-700 hover:underline">
                    View Credentials →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Quick Tools */}
        <div className="space-y-4">
          {/* Action Hub Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-slate-900 font-display">
              Psychosocial Action Hub
            </h2>

            <button
              onClick={() => setActivePage('assignments')}
              className="w-full py-2.5 px-3.5 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl text-left text-xs font-bold text-slate-800 hover:text-teal-900 transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-4 h-4 text-teal-600" />
                <span>Set New Grade Assignment</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => setActivePage('daily-question')}
              className="w-full py-2.5 px-3.5 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl text-left text-xs font-bold text-slate-800 hover:text-teal-900 transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-teal-600" />
                <span>Update Daily Grade Question</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => setActivePage('timetable')}
              className="w-full py-2.5 px-3.5 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl text-left text-xs font-bold text-slate-800 hover:text-teal-900 transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <CalendarDays className="w-4 h-4 text-teal-600" />
                <span>Build Champions Timetable</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => setActivePage('todo')}
              className="w-full py-2.5 px-3.5 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl text-left text-xs font-bold text-slate-800 hover:text-teal-900 transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <ListTodo className="w-4 h-4 text-teal-600" />
                <span>Daily Action Planner</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Pending Applications Callout */}
          {pendingChampionApps.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <Award className="w-4 h-4 text-amber-700" />
                <span>{pendingChampionApps.length} Champion Requests</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Students from {currentUser.grade} have requested to join the Mental Champions network and are awaiting your approval.
              </p>
              <button
                onClick={() => setActivePage('champion-apps')}
                className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Review & Approve Applications
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sign Out Action at Bottom */}
      <div className="pt-6 border-t border-slate-200 flex justify-center">
        <button
          onClick={logout}
          className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-700 hover:text-rose-700 font-bold rounded-2xl text-sm transition-all shadow-xs cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Sign Out from Mind Bridge Social Worker Panel</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: SUBMISSION DETAIL VIEWER (INSPECT STUDENT QUESTIONNAIRE ANSWERS)  */}
      {/* ========================================================================= */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                  Student Questionnaire Submission
                </span>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  {selectedSubmission.studentName}’s Responses
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Submitted on {new Date(selectedSubmission.submission.submittedAt).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {selectedSubmission.submission.answers.map((ans, idx) => {
                const targetAssign = gradeAssignments.find(a => a.id === selectedSubmission.submission.assignmentId);
                const qObj = targetAssign?.questions.find(q => q.id === ans.questionId);

                return (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-teal-700 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {qObj?.prompt || `Question #${idx + 1}`}
                      </span>
                    </div>

                    <div className="pl-7 text-xs">
                      {ans.selectedOption !== undefined && qObj?.options ? (
                        <div className="p-2.5 rounded-xl bg-white border border-teal-200 text-teal-950 font-semibold">
                          Selected Choice: <span className="font-bold text-[#245934]">{qObj.options[ans.selectedOption] || `Option #${ans.selectedOption + 1}`}</span>
                        </div>
                      ) : ans.answerText ? (
                        <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-800 leading-relaxed italic">
                          "{ans.answerText}"
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No answer text provided</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="px-5 py-2 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Done Inspecting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: GRADE LEADER PROFILE & CONTACT MODAL                             */}
      {/* ========================================================================= */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                  Grade Leader Profile Management
                </span>
                <h3 className="text-lg font-bold font-display text-slate-900">
                  Update {currentUser.grade} Grade Leader Information
                </h3>
              </div>
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Full Display Name
                </label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Enter full display name"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Direct Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+250 788 123 456"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 text-sm font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Shown to students for support</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    WhatsApp Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileWhatsapp}
                    onChange={(e) => setProfileWhatsapp(e.target.value)}
                    placeholder="+250 788 123 456"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 text-sm font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">For instant village WhatsApp reach</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Campus / Village Office Location
                </label>
                <input
                  type="text"
                  value={profileLocation}
                  onChange={(e) => setProfileLocation(e.target.value)}
                  placeholder="e.g. Ingabe House · Counseling Desk 1"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Bio / Psychosocial Focus Note
                </label>
                <textarea
                  rows={3}
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  placeholder="Tell students about your focus areas, availability, and counseling philosophy..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 text-xs leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#245934] hover:bg-[#1b4327] text-white font-bold rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Publish Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: VILLAGE HOTLINES & IMPORTANT CONTACTS MANAGEMENT                 */}
      {/* ========================================================================= */}
      {showHotlineModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xl space-y-5 max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                  Village Care & Support Directory
                </span>
                <h3 className="text-lg font-bold font-display text-slate-900">
                  Update Village Hotlines & Add Important Contacts
                </h3>
              </div>
              <button
                onClick={() => setShowHotlineModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Hotline Form */}
            <form onSubmit={handleSaveHotlines} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Village Psychosocial Hotline
                  </label>
                  <input
                    type="tel"
                    required
                    value={hotlinePhoneInput}
                    onChange={(e) => setHotlinePhoneInput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 text-sm font-mono"
                  />
                  <span className="text-[10px] text-slate-400">24/7 Village Mental Health Helpline</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Support WhatsApp Helpline
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsappPhoneInput}
                    onChange={(e) => setWhatsappPhoneInput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 text-sm font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Official WhatsApp support chat line</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Health Clinic Extension & Contact
                </label>
                <input
                  type="text"
                  required
                  value={clinicExtInput}
                  onChange={(e) => setClinicExtInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-900 text-sm"
                />
              </div>

              {/* Custom Important Contacts Section */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs">
                    Important Village Persons (Mental Health, Clinic, School Help)
                  </span>
                  <span className="text-[11px] text-teal-700 font-semibold">
                    {contactsList.length} Contacts
                  </span>
                </div>

                {/* Existing Contacts List */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {contactsList.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{c.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {c.role} · <span className="font-mono text-teal-800 font-bold">{c.phone}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveContact(c.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Remove contact"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Contact Row */}
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2.5">
                  <div className="font-bold text-emerald-950 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-[#245934]" />
                    <span>Add Another Important Person to Village Directory</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={newContactName}
                      onChange={(e) => setNewContactName(e.target.value)}
                      placeholder="Name (e.g. Dr. Mukiza)"
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-hidden"
                    />

                    <input
                      type="text"
                      value={newContactRole}
                      onChange={(e) => setNewContactRole(e.target.value)}
                      placeholder="Role (e.g. School Help)"
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-hidden"
                    />

                    <input
                      type="tel"
                      value={newContactPhone}
                      onChange={(e) => setNewContactPhone(e.target.value)}
                      placeholder="Phone (+250 788...)"
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-hidden font-mono"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleAddCustomContact}
                      className="px-3.5 py-1.5 bg-[#245934] hover:bg-[#1b4327] text-white font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add to List</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowHotlineModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#245934] hover:bg-[#1b4327] text-white font-bold rounded-xl transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
