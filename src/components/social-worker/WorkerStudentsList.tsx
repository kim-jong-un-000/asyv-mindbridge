import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import {
  Users,
  Search,
  MessageSquare,
  Award,
  Calendar,
  Mail,
  GraduationCap,
  X,
  Send,
  ShieldCheck,
  CheckCircle2,
  Clock,
  UserPlus,
  Lock,
  Sparkles,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

export const WorkerStudentsList: React.FC = () => {
  const {
    currentUser,
    getStudentsByGrade,
    setActivePage,
    sendMessage,
    createStudentBySocialWorker
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [quickMsg, setQuickMsg] = useState('');
  const [msgSent, setMsgSent] = useState(false);

  // Student Enrollment State (by Social Worker)
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollName, setEnrollName] = useState('');
  const [enrollFamilyName, setEnrollFamilyName] = useState('');
  const [enrollEmail, setEnrollEmail] = useState('');
  const [enrollClass, setEnrollClass] = useState('Senior 4 MEG');
  const [enrollPassword, setEnrollPassword] = useState('asyv2028');
  const [enrollError, setEnrollError] = useState('');
  const [enrollToast, setEnrollToast] = useState('');

  if (!currentUser || currentUser.role !== 'social_worker') return null;

  const students = getStudentsByGrade(currentUser.grade);

  // Filter By: controls state
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterChampion, setFilterChampion] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name_asc' | 'family_asc' | 'class_asc' | 'recent'>('name_asc');

  // Extract distinct classes from the grade's students
  const availableClasses = Array.from(
    new Set(students.map(s => s.schoolClass).filter(Boolean))
  ) as string[];

  // Filter & Sort
  const filtered = students
    .filter(s => {
      const matchesSearch = `${s.name} ${s.familyName || ''} ${s.email} ${s.schoolClass || ''}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      
      const matchesClass = filterClass === 'all' || s.schoolClass === filterClass;

      const matchesChampion =
        filterChampion === 'all' ||
        (filterChampion === 'champion' && (s.isMentalChampion || s.championStatus === 'approved')) ||
        (filterChampion === 'pending' && s.championStatus === 'pending') ||
        (filterChampion === 'regular' && !s.isMentalChampion && s.championStatus !== 'approved');

      return matchesSearch && matchesClass && matchesChampion;
    })
    .sort((a, b) => {
      if (sortBy === 'name_asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'family_asc') {
        return (a.familyName || '').localeCompare(b.familyName || '');
      }
      if (sortBy === 'class_asc') {
        return (a.schoolClass || '').localeCompare(b.schoolClass || '');
      }
      if (sortBy === 'recent') {
        return new Date(b.registeredAt || 0).getTime() - new Date(a.registeredAt || 0).getTime();
      }
      return 0;
    });

  const championsCount = students.filter(s => s.isMentalChampion || s.championStatus === 'approved').length;
  const isAnyFilterActive = searchQuery !== '' || filterClass !== 'all' || filterChampion !== 'all' || sortBy !== 'name_asc';

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilterClass('all');
    setFilterChampion('all');
    setSortBy('name_asc');
  };

  const handleSendQuickMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !quickMsg.trim()) return;

    sendMessage(selectedStudent.id, quickMsg.trim());
    setQuickMsg('');
    setMsgSent(true);
    setTimeout(() => setMsgSent(false), 4000);
  };

  const handleEnrollStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setEnrollError('');

    if (!enrollName.trim() || !enrollFamilyName.trim()) {
      setEnrollError('Both first name and family name are required for ASYV enrollment.');
      return;
    }

    if (!enrollEmail.trim() || !enrollEmail.includes('@')) {
      setEnrollError('Please provide a valid student school email address.');
      return;
    }

    const res = createStudentBySocialWorker({
      name: enrollName.trim(),
      familyName: enrollFamilyName.trim(),
      email: enrollEmail.trim().toLowerCase(),
      grade: currentUser.grade,
      schoolClass: enrollClass.trim() || 'General',
      password: enrollPassword.trim() || 'asyv2028'
    });

    if (res.success) {
      const studentFullName = `${enrollName.trim()} ${enrollFamilyName.trim()}`;
      setShowEnrollModal(false);
      setEnrollName('');
      setEnrollFamilyName('');
      setEnrollEmail('');
      setEnrollClass('Senior 4 MEG');
      setEnrollPassword('asyv2028');
      setEnrollToast(`Student ${studentFullName} successfully enrolled in ${currentUser.grade} Grade roster!`);
      setTimeout(() => setEnrollToast(''), 5000);
    } else {
      setEnrollError(res.error || 'Failed to enroll student. Please verify the email is not already taken.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {enrollToast && (
        <div className="bg-teal-700 text-white px-5 py-3.5 rounded-2xl shadow-lg border border-teal-500/40 flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
            <span>{enrollToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setEnrollToast('')}
            className="text-white/80 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
            <span>Student Registry</span>
            <span>·</span>
            <span>{currentUser.grade} Grade Only</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display">
            {currentUser.grade} Grade Students Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Total of <strong className="text-slate-800">{students.length} students</strong> registered in your grade. Tap any student name to inspect full identity and credentials.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student or class..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-teal-500 outline-hidden"
            />
          </div>

          {/* Enroll Student to Grade Button */}
          <button
            type="button"
            onClick={() => {
              setEnrollError('');
              setShowEnrollModal(true);
            }}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4 text-amber-300" />
            <span>+ Enroll Student</span>
          </button>
        </div>
      </div>

      {/* "FILTER BY:" HIGH EFFICIENCY TOOLBAR */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Filter className="w-4 h-4 text-teal-700" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-teal-800 flex items-center gap-2">
                <span>Filter By:</span>
                <span className="text-[11px] font-semibold text-slate-500 normal-case">
                  Find the student you want quickly without wasting time
                </span>
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">
                Showing <strong className="text-teal-800 font-bold">{filtered.length}</strong> of {students.length} students enrolled in {currentUser.grade} Grade
              </div>
            </div>
          </div>

          {isAnyFilterActive && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All Filters</span>
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* 1. Quick Search */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Filter by Name / Email
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search first or family name..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-hidden font-medium"
              />
            </div>
          </div>

          {/* 2. Filter by Class / Combination */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Filter by Class / Combination
            </label>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-hidden font-semibold text-slate-700 cursor-pointer"
            >
              <option value="all">All Classes & Combinations</option>
              {availableClasses.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* 3. Filter by Champion Status */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Filter by Champion Status
            </label>
            <select
              value={filterChampion}
              onChange={(e) => setFilterChampion(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-hidden font-semibold text-slate-700 cursor-pointer"
            >
              <option value="all">All Students ({students.length})</option>
              <option value="champion">Mental Champions ({championsCount})</option>
              <option value="regular">Regular Students ({students.length - championsCount})</option>
            </select>
          </div>

          {/* 4. Sort By */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Sort Roster Order
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-hidden font-semibold text-slate-700 cursor-pointer"
            >
              <option value="name_asc">First Name (A → Z)</option>
              <option value="family_asc">Family Name (A → Z)</option>
              <option value="class_asc">Class / Combination</option>
              <option value="recent">Recently Registered</option>
            </select>
          </div>
        </div>

        {/* 1-Tap Quick Filter Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
            <span>Quick Filter:</span>
          </span>

          <button
            type="button"
            onClick={() => { setFilterClass('all'); setFilterChampion('all'); }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterClass === 'all' && filterChampion === 'all'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All ({students.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterChampion(filterChampion === 'champion' ? 'all' : 'champion')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filterChampion === 'champion'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Mental Champions ({championsCount})</span>
          </button>

          {availableClasses.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setFilterClass(filterClass === c ? 'all' : c)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterClass === c
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table / Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Registered Student Roster ({filtered.length})</span>
          <span>Click row to open identity credentials</span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No students found matching "{searchQuery}".
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedStudent(s)}
                className="p-4 sm:p-5 hover:bg-teal-50/40 transition-colors cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={s.avatar}
                    alt={s.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-200 group-hover:ring-teal-400 transition-all"
                  />
                  <div>
                    {/* First name and family name */}
                    <div className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors font-display">
                      {s.name} {s.familyName || ''}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="font-semibold text-slate-700">{s.schoolClass || 'Unassigned'}</span>
                      <span className="text-slate-300">·</span>
                      <span className="font-mono text-[11px]">{s.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {s.isMentalChampion && (
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Mental Champion</span>
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStudent(s);
                    }}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    View Credentials
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* STUDENT CREDENTIALS / IDENTITY MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
              <img
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-teal-50"
              />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Registered ASYV Student Credentials
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 font-display">
                  {selectedStudent.name} {selectedStudent.familyName || ''}
                </h2>
                <div className="text-xs text-slate-500 font-medium">
                  {selectedStudent.grade} Grade · {selectedStudent.schoolClass || 'General'}
                </div>
              </div>
            </div>

            {/* Credentials details breakdown */}
            <div className="py-5 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-400 font-medium">First Name</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{selectedStudent.name}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-400 font-medium">Family Name</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{selectedStudent.familyName || 'N/A'}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-400 font-medium">Class Combination</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{selectedStudent.schoolClass || 'Unassigned'}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-slate-400 font-medium">Assigned Grade</div>
                  <div className="font-bold text-teal-800 text-sm mt-0.5">{selectedStudent.grade} Grade</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div className="text-slate-400 font-medium">Registered School Email</div>
                <div className="font-mono text-slate-900 font-bold mt-0.5 break-all">{selectedStudent.email}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs flex items-center justify-between">
                <div>
                  <div className="text-slate-400 font-medium">Registration Date & Time</div>
                  <div className="font-mono text-slate-800 font-semibold mt-0.5">
                    {new Date(selectedStudent.registeredAt).toLocaleString()}
                  </div>
                </div>
                <Clock className="w-4 h-4 text-slate-400" />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs flex items-center justify-between">
                <div>
                  <div className="text-slate-400 font-medium">Mental Champion Status</div>
                  <div className="font-bold text-slate-900 mt-0.5 capitalize">
                    {selectedStudent.championStatus || 'Not Applied'}
                  </div>
                </div>
                {selectedStudent.isMentalChampion ? (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">Approved</span>
                ) : (
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded">Standard</span>
                )}
              </div>
            </div>

            {/* Quick Private Message to Student */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                <span>Send Quick Private Message to {selectedStudent.name}:</span>
              </div>

              {msgSent && (
                <div className="p-2 mb-2 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Message sent to {selectedStudent.name}'s account!</span>
                </div>
              )}

              <form onSubmit={handleSendQuickMsg} className="space-y-2">
                <input
                  type="text"
                  value={quickMsg}
                  onChange={(e) => setQuickMsg(e.target.value)}
                  placeholder={`Type private note for ${selectedStudent.name}...`}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-teal-500 outline-hidden"
                />
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStudent(null);
                      setActivePage('chat');
                    }}
                    className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
                  >
                    Open Full Chat Room →
                  </button>

                  <button
                    type="submit"
                    disabled={!quickMsg.trim()}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-200 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Note</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* STUDENT ENROLLMENT MODAL BY SOCIAL WORKER */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowEnrollModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                  Village Care Roster Enrollment
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 font-display">
                  Enroll Student to {currentUser.grade} Grade
                </h2>
                <p className="text-xs text-slate-500">
                  Provision an official student account directly into your grade roster.
                </p>
              </div>
            </div>

            {enrollError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{enrollError}</span>
              </div>
            )}

            <form onSubmit={handleEnrollStudent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={enrollName}
                    onChange={(e) => setEnrollName(e.target.value)}
                    placeholder="e.g. Keza"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:border-teal-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Family Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={enrollFamilyName}
                    onChange={(e) => setEnrollFamilyName(e.target.value)}
                    placeholder="e.g. Uwase"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:border-teal-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ASYV School Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={enrollEmail}
                    onChange={(e) => setEnrollEmail(e.target.value)}
                    placeholder="keza.uwase@asyv.edu.rw"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:border-teal-500 outline-hidden"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Each email can only be registered once. The student will use this email to sign in.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Class / Combination
                  </label>
                  <input
                    type="text"
                    required
                    value={enrollClass}
                    onChange={(e) => setEnrollClass(e.target.value)}
                    placeholder="e.g. Senior 4 MEG"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:border-teal-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Assigned Grade
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${currentUser.grade} Grade`}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-100 border border-slate-200 rounded-xl text-teal-800 font-bold cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Temporary Student Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={enrollPassword}
                    onChange={(e) => setEnrollPassword(e.target.value)}
                    placeholder="asyv2028"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm border border-slate-200 rounded-xl font-mono focus:border-teal-500 outline-hidden"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Default: <code className="font-bold text-slate-600">asyv2028</code>. The student can use this password to sign in immediately.
                </span>
              </div>

              <div className="p-3 bg-teal-50/80 border border-teal-200 rounded-2xl text-[11px] text-teal-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <span>
                  This account will be permanently registered in the Cloud SQL PostgreSQL database and linked to your grade roster.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Confirm & Enroll Student</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
