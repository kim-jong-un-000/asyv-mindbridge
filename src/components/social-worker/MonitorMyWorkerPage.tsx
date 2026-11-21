import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileCheck2,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Eye,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  AlertOctagon,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  RefreshCw,
  Search,
  Check,
  Calendar,
  FileText
} from 'lucide-react';
import { Assignment, AssignmentSubmission, User } from '../../types';

export const MonitorMyWorkerPage: React.FC = () => {
  const {
    currentUser,
    getStudentsByGrade,
    assignments,
    sendMessage,
    setActivePage
  } = useApp();

  const [activeTab, setActiveTab] = useState<'students' | 'tasks' | 'unanswered' | 'inspector'>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('');
  const [inspectingStudent, setInspectingStudent] = useState<{ student: User; submission: AssignmentSubmission; assignmentTitle: string } | null>(null);
  const [customAlertStudent, setCustomAlertStudent] = useState<User | null>(null);
  const [customAlertMessage, setCustomAlertMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  if (!currentUser || currentUser.role !== 'social_worker') {
    return null;
  }

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Grade data
  const gradeStudents = getStudentsByGrade(currentUser.grade);
  const gradeAssignments = assignments.filter(a => a.grade === currentUser.grade);

  // Compute student-by-student completion statistics
  const studentStats = gradeStudents.map(student => {
    const completedAssignments = gradeAssignments.filter(a =>
      a.submissions.some(s => s.studentId === student.id)
    );
    const uncompletedAssignments = gradeAssignments.filter(
      a => !a.submissions.some(s => s.studentId === student.id)
    );
    const total = gradeAssignments.length;
    const completedCount = completedAssignments.length;
    const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 100;
    const isCompleted = total > 0 ? completedCount === total : true;

    return {
      student,
      total,
      completedCount,
      percentage,
      isCompleted,
      completedAssignments,
      uncompletedAssignments
    };
  });

  // Totals
  const totalStudents = gradeStudents.length;
  const completedStudentsCount = studentStats.filter(s => s.isCompleted && s.total > 0).length;
  const incompleteStudents = studentStats.filter(s => !s.isCompleted && s.total > 0);
  const incompleteStudentsCount = incompleteStudents.length;
  const totalSubmissionsReceived = gradeAssignments.reduce((acc, a) => {
    const validSubs = a.submissions.filter(s => gradeStudents.some(gs => gs.id === s.studentId));
    return acc + validSubs.length;
  }, 0);
  const totalPossible = totalStudents * gradeAssignments.length;
  const overallPercentage = totalPossible > 0 ? Math.round((totalSubmissionsReceived / totalPossible) * 100) : 100;

  // Filter students based on search
  const filteredStudentStats = studentStats.filter(item => {
    const q = searchQuery.toLowerCase();
    const fullName = `${item.student.name} ${item.student.familyName || ''}`.toLowerCase();
    const email = item.student.email.toLowerCase();
    const sClass = (item.student.schoolClass || '').toLowerCase();
    return fullName.includes(q) || email.includes(q) || sClass.includes(q);
  });

  // Send 1-click alert reminder
  const handleSendQuickAlert = (student: User, assignmentTitle?: string) => {
    const taskName = assignmentTitle || 'your pending grade questionnaires / assigned work';
    const alertText = `⚠️ [Urgent Task Alert from ${currentUser.name}, ${currentUser.grade} Grade Leader]: Please log in to complete and submit "${taskName}". If you need any assistance, reflection support, or guidance, reply directly to this chat or visit my office desk!`;
    sendMessage(student.id, alertText);
    showToast(`Urgent alert notification sent to ${student.name}!`);
  };

  // Send custom alert message
  const handleSendCustomAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAlertStudent || !customAlertMessage.trim()) return;

    sendMessage(customAlertStudent.id, customAlertMessage.trim());
    showToast(`Custom follow-up alert sent to ${customAlertStudent.name}!`);
    setCustomAlertStudent(null);
    setCustomAlertMessage('');
  };

  // Send alert to ALL incomplete students
  const handleAlertAllIncomplete = () => {
    if (incompleteStudents.length === 0) {
      showToast('All students have completed their tasks!');
      return;
    }

    incompleteStudents.forEach(item => {
      const pendingNames = item.uncompletedAssignments.map(a => `"${a.title}"`).join(', ');
      const msg = `⚠️ [Grade Leader Follow-up]: Hello ${item.student.name}, our records show you have pending coursework (${pendingNames}). Please submit your responses today. We are here to support your success!`;
      sendMessage(item.student.id, msg);
    });

    showToast(`Urgent alerts dispatched to all ${incompleteStudents.length} pending students!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1b4327] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/30 animate-fadeIn text-xs sm:text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 text-[#eec149]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-emerald-400 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official ASYV Psychosocial Supervision</span>
            <span>·</span>
            <span>{currentUser.grade} Grade Leader</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            Monitor My Worker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Supervise completed tasks sent to your grade, identify unanswered assignments, track student completion rates, and dispatch direct alerts to students who have not finished their coursework.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {incompleteStudentsCount > 0 && (
            <button
              onClick={handleAlertAllIncomplete}
              className="px-4 py-2.5 bg-[#d95f18] hover:bg-[#b84e12] text-white text-xs font-bold rounded-2xl transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              title="Send urgent reminder message to all students with pending work"
            >
              <Send className="w-4 h-4" />
              <span>Alert All Unfinished ({incompleteStudentsCount})</span>
            </button>
          )}

          <button
            onClick={() => setActivePage('assignments')}
            className="px-4 py-2.5 bg-[#245934] hover:bg-[#1b4327] text-white text-xs font-bold rounded-2xl transition-all cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Set New Task / Questionnaire</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: Serious, Highly Aesthetic Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Tasks Sent */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tasks Sent to Grade
            </span>
            <FileCheck2 className="w-5 h-5 text-teal-700 dark:text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display tabular-nums">
            {gradeAssignments.length}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Questionnaires & papers for {currentUser.grade}
          </div>
        </div>

        {/* Card 2: Total Submissions Received */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Answers Received
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display tabular-nums">
            {totalSubmissionsReceived}
            <span className="text-xs font-bold text-slate-400 ml-1.5">
              / {totalPossible} total
            </span>
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
            {overallPercentage}% overall grade submission rate
          </div>
        </div>

        {/* Card 3: Completed Students */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Completed Students
            </span>
            <Users className="w-5 h-5 text-[#245934] dark:text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#1b4327] dark:text-emerald-400 font-display tabular-nums">
            {completedStudentsCount}
            <span className="text-xs font-bold text-slate-400 ml-1.5">
              / {totalStudents} students
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {totalStudents > 0 ? Math.round((completedStudentsCount / totalStudents) * 100) : 0}% finished all work
          </div>
        </div>

        {/* Card 4: Unanswered / Pending Students */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Unanswered Students
            </span>
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 dark:text-amber-400 font-display tabular-nums">
            {incompleteStudentsCount}
          </div>
          <div className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold mt-1">
            {incompleteStudentsCount > 0 ? 'Action required: send alert message' : 'All students fully submitted!'}
          </div>
        </div>
      </div>

      {/* Main Monitoring Workplace Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md overflow-hidden">
        {/* Navigation Tabs */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('students')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'students'
                  ? 'bg-[#245934] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Student Progress ({totalStudents})</span>
            </button>

            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'tasks'
                  ? 'bg-[#245934] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Completed Tasks ({gradeAssignments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('unanswered')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'unanswered'
                  ? 'bg-[#d95f18] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Unanswered Tasks ({incompleteStudentsCount})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('inspector');
                if (gradeAssignments.length > 0 && !selectedAssignmentId) {
                  setSelectedAssignmentId(gradeAssignments[0].id);
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'inspector'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Inspect Answers ({totalSubmissionsReceived})</span>
            </button>
          </div>

          {/* Search box for students */}
          {activeTab === 'students' && (
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student by name, class..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-hidden focus:border-[#245934] dark:focus:border-emerald-400 text-slate-900 dark:text-slate-100"
              />
            </div>
          )}
        </div>

        {/* TAB 1: ALL STUDENTS PROGRESS DIRECTORY */}
        {activeTab === 'students' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
              <span>{currentUser.grade} Grade Student Roster ({filteredStudentStats.length})</span>
              <span>Tasks Completed & Actions</span>
            </div>

            {filteredStudentStats.length === 0 ? (
              <div className="p-12 text-center text-slate-400 dark:text-slate-500 text-xs">
                No matching students found in {currentUser.grade} Grade.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredStudentStats.map(({ student, total, completedCount, percentage, isCompleted, completedAssignments, uncompletedAssignments }) => (
                  <div
                    key={student.id}
                    className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-teal-400 dark:hover:border-emerald-500 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{student.name} {student.familyName || ''}</span>
                          {isCompleted ? (
                            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded-md flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                              <span>Completed All Tasks</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold rounded-md flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                              <span>{uncompletedAssignments.length} Pending</span>
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{student.schoolClass || 'General Class'}</span>
                          <span>·</span>
                          <span className="font-mono text-teal-800 dark:text-teal-300 text-[11px]">{student.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Buttons */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4 min-w-[340px]">
                      <div className="w-full sm:w-44 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            {completedCount} / {total} Completed
                          </span>
                          <span className="font-extrabold text-[#245934] dark:text-emerald-400">
                            {percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
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

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* If incomplete: Send Alert Message */}
                        {!isCompleted && (
                          <button
                            type="button"
                            onClick={() => handleSendQuickAlert(student)}
                            className="px-3 py-1.5 bg-[#d95f18] hover:bg-[#b84e12] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                            title="Send 1-click alert notification to this student"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Alert</span>
                          </button>
                        )}

                        {/* View Submissions if any */}
                        {completedAssignments.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const firstCompleted = completedAssignments[0];
                              const sub = firstCompleted.submissions.find(s => s.studentId === student.id);
                              if (sub) {
                                setInspectingStudent({
                                  student,
                                  submission: sub,
                                  assignmentTitle: firstCompleted.title
                                });
                              }
                            }}
                            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                            title="Inspect answers submitted by this student"
                          >
                            <Eye className="w-3.5 h-3.5 text-teal-700 dark:text-emerald-400" />
                            <span>View Answers</span>
                          </button>
                        )}

                        {/* Direct 1-to-1 Chat */}
                        <button
                          type="button"
                          onClick={() => setActivePage('chat')}
                          className="p-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-xl transition-colors cursor-pointer"
                          title="Open direct confidential 1-to-1 chat"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COMPLETED TASKS SENT TO GRADE */}
        {activeTab === 'tasks' && (
          <div className="p-6 space-y-4">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
              Tasks & Questionnaires Sent to {currentUser.grade} ({gradeAssignments.length})
            </div>

            {gradeAssignments.length === 0 ? (
              <div className="p-12 text-center text-slate-400 dark:text-slate-500 text-xs space-y-3">
                <FileCheck2 className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
                <p className="font-semibold text-slate-700 dark:text-slate-300">No tasks sent to your grade yet</p>
                <p>Create questionnaires and reflective paperwork for your students.</p>
                <button
                  onClick={() => setActivePage('assignments')}
                  className="px-4 py-2 bg-[#245934] text-white rounded-xl text-xs font-bold"
                >
                  Create First Task
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {gradeAssignments.map(task => {
                  const validSubs = task.submissions.filter(s => gradeStudents.some(gs => gs.id === s.studentId));
                  const taskPercent = totalStudents > 0 ? Math.round((validSubs.length / totalStudents) * 100) : 0;
                  const completedStudents = gradeStudents.filter(gs => task.submissions.some(s => s.studentId === gs.id));
                  const uncompletedStudents = gradeStudents.filter(gs => !task.submissions.some(s => s.studentId === gs.id));

                  return (
                    <div
                      key={task.id}
                      className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div>
                          <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
                            {task.title}
                          </h3>
                          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 font-mono">
                              <Calendar className="w-3.5 h-3.5 text-teal-700 dark:text-emerald-400" />
                              Due: {task.dueDate}
                            </span>
                            <span>·</span>
                            <span>{task.questions.length} Questions</span>
                            <span>·</span>
                            <span>By {task.creatorName}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              {validSubs.length} of {totalStudents} Completed
                            </div>
                            <div className="text-[11px] font-extrabold text-[#245934] dark:text-emerald-400">
                              {taskPercent}% Rate
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedAssignmentId(task.id);
                              setActiveTab('inspector');
                            }}
                            className="px-3.5 py-1.5 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-800 dark:text-teal-300 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect Answers</span>
                          </button>
                        </div>
                      </div>

                      {/* Instructions */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        {task.instructions}
                      </p>

                      {/* Completed vs Uncompleted Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                        {/* Completed list */}
                        <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40">
                          <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center justify-between mb-2">
                            <span>Completed Students ({completedStudents.length})</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          </div>
                          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                            {completedStudents.length === 0 ? (
                              <p className="text-slate-400 italic">No submissions yet.</p>
                            ) : (
                              completedStudents.map(s => {
                                const sub = task.submissions.find(x => x.studentId === s.id);
                                return (
                                  <div key={s.id} className="flex items-center justify-between py-1 border-b border-emerald-100/60 dark:border-emerald-900/30 last:border-0">
                                    <div className="flex items-center gap-2">
                                      <img src={s.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                                      <span className="font-medium text-slate-800 dark:text-slate-200">{s.name} {s.familyName || ''}</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (sub) {
                                          setInspectingStudent({
                                            student: s,
                                            submission: sub,
                                            assignmentTitle: task.title
                                          });
                                        }
                                      }}
                                      className="text-[11px] font-bold text-teal-800 dark:text-teal-300 hover:underline cursor-pointer"
                                    >
                                      View Answers →
                                    </button>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>

                        {/* Uncompleted list with 1-click alert */}
                        <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
                          <div className="font-bold text-rose-900 dark:text-rose-300 flex items-center justify-between mb-2">
                            <span>Unanswered / Pending Students ({uncompletedStudents.length})</span>
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          </div>
                          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                            {uncompletedStudents.length === 0 ? (
                              <p className="text-emerald-700 dark:text-emerald-400 font-semibold">100% of students have finished!</p>
                            ) : (
                              uncompletedStudents.map(s => (
                                <div key={s.id} className="flex items-center justify-between py-1 border-b border-rose-100/60 dark:border-rose-900/30 last:border-0">
                                  <div className="flex items-center gap-2">
                                    <img src={s.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                                    <span className="font-medium text-slate-800 dark:text-slate-200">{s.name} {s.familyName || ''}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleSendQuickAlert(s, task.title)}
                                    className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                                    title="Send reminder alert for this task"
                                  >
                                    <Send className="w-2.5 h-2.5" />
                                    <span>Send Alert</span>
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: UNANSWERED TASKS & FOLLOW-UP DIRECTORY */}
        {activeTab === 'unanswered' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
              <span>Students with Incomplete Work in {currentUser.grade} Grade</span>
              {incompleteStudentsCount > 0 && (
                <button
                  onClick={handleAlertAllIncomplete}
                  className="px-3 py-1 bg-[#d95f18] hover:bg-[#b84e12] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Alert to All ({incompleteStudentsCount})</span>
                </button>
              )}
            </div>

            {incompleteStudents.length === 0 ? (
              <div className="p-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Congratulations! All tasks completed
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Every student in {currentUser.grade} Grade has submitted all assigned questionnaires and papers.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {incompleteStudents.map(({ student, uncompletedAssignments }) => (
                  <div
                    key={student.id}
                    className="p-4 rounded-2xl border-2 border-amber-300 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-11 h-11 rounded-2xl object-cover ring-2 ring-amber-300 dark:ring-amber-800 shrink-0 mt-0.5"
                      />
                      <div>
                        <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{student.name} {student.familyName || ''}</span>
                          <span className="px-2 py-0.5 bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 rounded-md text-[10px] font-bold">
                            {uncompletedAssignments.length} Unanswered
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Class: <strong className="text-slate-700 dark:text-slate-300">{student.schoolClass}</strong> · Email: <span className="font-mono">{student.email}</span>
                        </div>
                        <div className="mt-2 text-xs space-y-1">
                          <span className="font-bold text-amber-900 dark:text-amber-300">Pending Assignments:</span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {uncompletedAssignments.map(a => (
                              <span
                                key={a.id}
                                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-slate-800 dark:text-slate-200 text-[11px] font-medium flex items-center gap-1.5"
                              >
                                <Clock className="w-3 h-3 text-amber-600" />
                                <span>{a.title}</span>
                                <span className="text-slate-400 font-mono text-[10px]">(Due: {a.dueDate})</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        type="button"
                        onClick={() => {
                          setCustomAlertStudent(student);
                          setCustomAlertMessage(`⚠️ [Urgent Task Alert]: Hello ${student.name}, please complete your pending ${currentUser.grade} grade assignment(s) today. Let me know if you need any assistance!`);
                        }}
                        className="px-3.5 py-2 bg-[#d95f18] hover:bg-[#b84e12] text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Alert Message</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActivePage('chat')}
                        className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: INSPECT SUBMITTED QUESTIONNAIRE ANSWERS */}
        {activeTab === 'inspector' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
                  Student Questionnaire Answer Sheets
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select a grade task below to review all responses submitted by students in {currentUser.grade} Grade.
                </p>
              </div>

              {/* Assignment selector */}
              {gradeAssignments.length > 0 && (
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    Select Task:
                  </label>
                  <select
                    value={selectedAssignmentId}
                    onChange={(e) => setSelectedAssignmentId(e.target.value)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {gradeAssignments.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.title} ({a.submissions.filter(s => gradeStudents.some(gs => gs.id === s.studentId)).length} submissions)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Submissions List for selected assignment */}
            {(() => {
              const currentAssignment = gradeAssignments.find(a => a.id === selectedAssignmentId) || gradeAssignments[0];
              if (!currentAssignment) {
                return (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No assignments available for {currentUser.grade} Grade.
                  </div>
                );
              }

              const validSubs = currentAssignment.submissions.filter(s =>
                gradeStudents.some(gs => gs.id === s.studentId)
              );

              return (
                <div className="space-y-4">
                  <div className="bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/40 rounded-2xl p-4 text-xs">
                    <div className="font-bold text-teal-900 dark:text-teal-300 text-sm">
                      {currentAssignment.title}
                    </div>
                    <div className="text-teal-800 dark:text-teal-400 mt-1">
                      {currentAssignment.instructions}
                    </div>
                    <div className="mt-2 text-[11px] text-teal-700 dark:text-teal-500 flex items-center gap-3">
                      <span>Questions: {currentAssignment.questions.length}</span>
                      <span>·</span>
                      <span>Due: {currentAssignment.dueDate}</span>
                      <span>·</span>
                      <span className="font-bold text-emerald-800 dark:text-emerald-300">
                        {validSubs.length} of {totalStudents} students submitted
                      </span>
                    </div>
                  </div>

                  {validSubs.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 text-xs bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
                      No student submissions received yet for this questionnaire.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {validSubs.map(sub => {
                        const studentObj = gradeStudents.find(gs => gs.id === sub.studentId);
                        return (
                          <div
                            key={sub.id}
                            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-xs space-y-4"
                          >
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 p-0.5 border border-[#245934]/30 shadow-xs flex items-center justify-center shrink-0 overflow-hidden">
                                  <img
                                    src={studentObj?.avatar?.endsWith('.svg') || studentObj?.avatar?.startsWith('data:') ? studentObj.avatar : '/asyv_emblem.svg'}
                                    alt={sub.studentName}
                                    className="w-full h-full object-contain"
                                    onError={(e) => { (e.target as HTMLImageElement).src = '/asyv_emblem.svg'; }}
                                  />
                                </div>
                                <div>
                                  <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                                    {sub.studentName}
                                  </div>
                                  <div className="text-xs text-slate-500 dark:text-slate-400">
                                    Class: {studentObj?.schoolClass || 'Student'} · Submitted: {new Date(sub.submittedAt).toLocaleString()}
                                  </div>
                                </div>
                              </div>

                              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Delivered Online</span>
                              </span>
                            </div>

                            {/* Answers breakdown */}
                            <div className="space-y-3">
                              {currentAssignment.questions.map((q, idx) => {
                                const ans = sub.answers.find(a => a.questionId === q.id);
                                return (
                                  <div
                                    key={q.id}
                                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5"
                                  >
                                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-start gap-2">
                                      <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 flex items-center justify-center shrink-0 text-[10px] font-black">
                                        Q{idx + 1}
                                      </span>
                                      <span>{q.prompt}</span>
                                    </div>

                                    {/* Multiple choice response */}
                                    {q.type === 'multiple_choice' && (
                                      <div className="pl-7 text-xs">
                                        <span className="text-slate-500 dark:text-slate-400 font-medium">Selected Answer: </span>
                                        {ans?.selectedOption !== undefined && q.options && q.options[ans.selectedOption] ? (
                                          <span className="font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                                            {q.options[ans.selectedOption]}
                                          </span>
                                        ) : (
                                          <span className="text-slate-400 italic">No option selected</span>
                                        )}
                                      </div>
                                    )}

                                    {/* Open ended text response */}
                                    {q.type === 'open_ended' && (
                                      <div className="pl-7">
                                        <div className="text-slate-500 dark:text-slate-400 font-medium mb-1">
                                          Written Response:
                                        </div>
                                        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 italic leading-relaxed">
                                          {ans?.answerText ? `"${ans.answerText}"` : <span className="text-slate-400">Left blank</span>}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* MODAL 1: INSPECT INDIVIDUAL STUDENT SUBMISSION */}
      {inspectingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={inspectingStudent.student.avatar}
                  alt={inspectingStudent.student.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-300"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                    {inspectingStudent.student.name} {inspectingStudent.student.familyName || ''}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Assignment: <strong className="text-slate-700 dark:text-slate-200">{inspectingStudent.assignmentTitle}</strong> · Submitted: {new Date(inspectingStudent.submission.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInspectingStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Answer details */}
            <div className="space-y-4 text-xs">
              <h4 className="font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                Submitted Questionnaire Answers
              </h4>
              {inspectingStudent.submission.answers.map((ans, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 flex items-center justify-center text-[10px] font-black">
                      {idx + 1}
                    </span>
                    <span>Question {idx + 1} Response</span>
                  </div>

                  {ans.selectedOption !== undefined && (
                    <div className="pl-7 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                      Option Selected: Index #{ans.selectedOption + 1}
                    </div>
                  )}

                  {ans.answerText && (
                    <div className="pl-7 text-xs text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                      "{ans.answerText}"
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectingStudent(null)}
                className="px-5 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-xl text-xs cursor-pointer"
              >
                Close Answer Sheet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CUSTOM ALERT DISPATCH */}
      {customAlertStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                  Send Alert Notification
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Direct message to: <strong>{customAlertStudent.name} {customAlertStudent.familyName || ''}</strong> ({customAlertStudent.schoolClass})
                </p>
              </div>

              <button
                onClick={() => setCustomAlertStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendCustomAlertSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Alert Message Content
                </label>
                <textarea
                  required
                  rows={4}
                  value={customAlertMessage}
                  onChange={(e) => setCustomAlertMessage(e.target.value)}
                  className="w-full p-3 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-[#d95f18] focus:ring-1 focus:ring-[#d95f18] outline-hidden leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCustomAlertStudent(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#d95f18] hover:bg-[#b84e12] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Alert Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
