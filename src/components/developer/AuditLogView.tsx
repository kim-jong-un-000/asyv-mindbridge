import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Grade, UserRole, AuditLogEntry, AuditActionType } from '../../types';
import {
  ShieldCheck,
  Search,
  Download,
  Trash2,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  User as UserIcon,
  Activity,
  Layers,
  Lock,
  RefreshCw,
  FileSpreadsheet,
  FileCode,
  ShieldAlert
} from 'lucide-react';

const GRADES: Grade[] = ['Ingabe', 'Ingabo', 'Ijabo'];

export const AuditLogView: React.FC = () => {
  const { auditLogs, clearAuditLogs, addAuditLog } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [actionCategory, setActionCategory] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    const seenIds = new Set<string>();
    return auditLogs.filter(log => {
      if (!log || !log.id) return false;
      if (seenIds.has(log.id)) return false;
      seenIds.add(log.id);

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = log.userName.toLowerCase().includes(q);
        const matchesAction = log.action.toLowerCase().includes(q);
        const matchesDetails = log.details.toLowerCase().includes(q);
        const matchesDevice = log.ipOrDevice.toLowerCase().includes(q);
        if (!matchesName && !matchesAction && !matchesDetails && !matchesDevice) {
          return false;
        }
      }

      // Action category filter
      if (actionCategory !== 'all') {
        if (actionCategory === 'auth' && !['LOGIN', 'LOGOUT'].includes(log.action)) return false;
        if (actionCategory === 'registrations' && !['STUDENT_REGISTERED', 'WORKER_REGISTERED', 'STUDENT_CREATED'].includes(log.action)) return false;
        if (actionCategory === 'sos' && !['EMERGENCY_ALERT_SENT', 'EMERGENCY_ALERT_ACKNOWLEDGED'].includes(log.action)) return false;
        if (actionCategory === 'champions' && !['CHAMPION_APPLIED', 'CHAMPION_APPROVED', 'CHAMPION_REJECTED'].includes(log.action)) return false;
        if (actionCategory === 'academic' && !['ASSIGNMENT_CREATED', 'ASSIGNMENT_SUBMITTED', 'DAILY_QUESTION_SET', 'DAILY_QUESTION_ANSWERED'].includes(log.action)) return false;
        if (actionCategory === 'admin' && !['CONTACT_INFO_UPDATED', 'ANNOUNCEMENT_POSTED', 'DATABASE_EXPORTED', 'DATABASE_IMPORTED', 'DATABASE_RESET', 'SECURITY_CHECK'].includes(log.action)) return false;
      }

      // Role filter
      if (roleFilter !== 'all' && log.userRole !== roleFilter) {
        return false;
      }

      // Grade filter
      if (gradeFilter !== 'all' && log.grade !== gradeFilter) {
        return false;
      }

      // Severity filter
      if (severityFilter !== 'all' && log.severity !== severityFilter) {
        return false;
      }

      return true;
    });
  }, [auditLogs, searchQuery, actionCategory, roleFilter, gradeFilter, severityFilter]);

  // Statistics
  const totalLogins = auditLogs.filter(l => l.action === 'LOGIN').length;
  const totalSecurityEvents = auditLogs.filter(l => l.severity === 'security' || l.severity === 'warning').length;
  const recentEventsToday = auditLogs.filter(l => {
    const today = new Date().toISOString().split('T')[0];
    return l.timestamp.startsWith(today);
  }).length;

  // Export functions
  const handleExportCsv = () => {
    const headers = ['Timestamp', 'User Name', 'Role', 'Grade', 'Action', 'Severity', 'Details', 'Network Node'];
    const rows = filteredLogs.map(l => [
      `"${l.timestamp}"`,
      `"${l.userName.replace(/"/g, '""')}"`,
      `"${l.userRole}"`,
      `"${l.grade || 'N/A'}"`,
      `"${l.action}"`,
      `"${l.severity}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.ipOrDevice.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `asyv-mindbridge-audit-log-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog('DATABASE_EXPORTED', 'Administrator exported security audit logs to CSV', 'info');
  };

  const handleExportJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(filteredLogs, null, 2))}`;
    const link = document.createElement('a');
    link.setAttribute('href', jsonString);
    link.setAttribute('download', `asyv-mindbridge-audit-log-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog('DATABASE_EXPORTED', 'Administrator exported security audit logs to JSON', 'info');
  };

  const getActionBadgeClass = (action: AuditActionType, severity: AuditLogEntry['severity']) => {
    if (severity === 'security') return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200';
    if (action.includes('EMERGENCY') || action.includes('PURGED')) return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200';
    if (severity === 'warning') return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200';
    if (severity === 'success' || action.includes('APPROVED')) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200';
    if (action === 'LOGIN') return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200';
    if (action === 'LOGOUT') return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200';
    return 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Overview */}
      <div className="bg-gradient-to-r from-[#1b4327] via-[#245934] to-[#122e1a] text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9a6b00] dark:text-[#eec149] mb-2">
              <ShieldCheck className="w-4 h-4 text-[#9a6b00] dark:text-[#eec149]" />
              <span>System Transparency & Compliance Oversight</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
              Real-Time Security Audit Log
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
              Comprehensive tamper-evident record tracking all user logins, role authorizations, psychosocial emergency reports, grade leader edits, and administrative operations across Ingabe, Ingabo, and Ijabo.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 bg-emerald-50 dark:bg-white/10 hover:bg-white/20 text-slate-900 dark:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-white/20"
              title="Export filtered records to CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportJson}
              className="px-3.5 py-2 bg-emerald-50 dark:bg-white/10 hover:bg-white/20 text-slate-900 dark:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-white/20"
              title="Export filtered records to JSON"
            >
              <FileCode className="w-4 h-4 text-[#9a6b00] dark:text-[#eec149]" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-3.5 py-2 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-rose-400/30"
              title="Clear current log trail"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Log</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 dark:text-slate-500">
            Total Logged Events
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-display tabular-nums mt-1">
            {auditLogs.length}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>Persistent local storage</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-[#245934] dark:text-emerald-400">
            Logins Tracked
          </div>
          <div className="text-3xl font-extrabold text-[#1b4327] dark:text-emerald-300 font-display tabular-nums mt-1">
            {totalLogins}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Students & staff auth
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Security Flags
          </div>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-display tabular-nums mt-1">
            {totalSecurityEvents}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Auth & admin operations
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Campus Network
          </div>
          <div className="text-base font-extrabold text-blue-700 dark:text-blue-300 font-display mt-2">
            Online · TLS Active
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Real-time auditing active</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by user name, action, details, IP node..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-[#245934] dark:focus:border-emerald-500 outline-hidden text-slate-900 dark:text-white"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Category */}
            <select
              value={actionCategory}
              onChange={(e) => setActionCategory(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300 outline-hidden"
            >
              <option value="all">All Action Categories</option>
              <option value="auth">Authentication (Login/Logout)</option>
              <option value="registrations">Registrations & Accounts</option>
              <option value="sos">Emergency SOS Alerts</option>
              <option value="champions">Mental Health Champions</option>
              <option value="academic">Assignments & Prompts</option>
              <option value="admin">System Administration</option>
            </select>

            {/* Role */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300 outline-hidden"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="social_worker">Social Workers</option>
              <option value="developer">Master Admin</option>
            </select>

            {/* Grade */}
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300 outline-hidden"
            >
              <option value="all">All Grades (Ingabe, Ingabo, Ijabo)</option>
              {GRADES.map(g => (
                <option key={g} value={g}>{g} Grade</option>
              ))}
            </select>

            {/* Severity */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300 outline-hidden"
            >
              <option value="all">All Severities</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="security">Security</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>Showing <strong>{filteredLogs.length}</strong> of <strong>{auditLogs.length}</strong> activity records</span>
          {(searchQuery || actionCategory !== 'all' || roleFilter !== 'all' || gradeFilter !== 'all' || severityFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setActionCategory('all');
                setRoleFilter('all');
                setGradeFilter('all');
                setSeverityFilter('all');
              }}
              className="text-[#245934] dark:text-emerald-400 font-bold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Log Entries Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Timestamp & Local Time</th>
                <th className="py-3.5 px-4">User & Role</th>
                <th className="py-3.5 px-4">Grade</th>
                <th className="py-3.5 px-4">Action Event</th>
                <th className="py-3.5 px-4">Event Details</th>
                <th className="py-3.5 px-4">Access Point / Network</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm">
                    No activity logs match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => {
                  const dateObj = new Date(log.timestamp);
                  const formattedTime = !isNaN(dateObj.getTime())
                    ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                    : log.timestamp;
                  const formattedDate = !isNaN(dateObj.getTime())
                    ? dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
                    : '';

                  return (
                    <tr
                      key={`${log.id}-${index}`}
                      onClick={() => setSelectedLog(log)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      {/* Timestamp */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{formattedTime}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">{formattedDate}</div>
                      </td>

                      {/* User & Role */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-[150px]">
                          {log.userName}
                        </div>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {log.userRole.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Grade */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {log.grade ? (
                          <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-[#245934] dark:text-emerald-300 font-bold rounded text-[11px] border border-emerald-200/60 dark:border-emerald-800">
                            {log.grade}
                          </span>
                        ) : (
                          <span className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Action Event */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${getActionBadgeClass(log.action, log.severity)}`}>
                          {log.action}
                        </span>
                      </td>

                      {/* Details */}
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 max-w-xs truncate">
                        {log.details}
                      </td>

                      {/* Network Node */}
                      <td className="py-3 px-4 text-[11px] text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap">
                        {log.ipOrDevice}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                Clear Audit Trail Log?
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This will permanently delete the current audit log records from local storage. A security check log entry will be preserved indicating that the audit archive was purged by the administrator.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAuditLogs();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Yes, Clear Audit Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#245934] dark:text-emerald-400" />
                <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                  Audit Record Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer text-xs font-bold"
              >
                Close ✕
              </button>
            </div>

            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">Record ID:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{selectedLog.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">Timestamp:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{selectedLog.timestamp}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">Actor Name:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedLog.userName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">Role / Grade:</span>
                <span className="text-slate-800 dark:text-slate-200">
                  {selectedLog.userRole} {selectedLog.grade ? `(${selectedLog.grade} Grade)` : ''}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">Action:</span>
                <span className={`px-2 py-0.5 rounded-full font-bold ${getActionBadgeClass(selectedLog.action, selectedLog.severity)}`}>
                  {selectedLog.action}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-500">Network Node:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{selectedLog.ipOrDevice}</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-500 block mb-1">Details:</span>
                <p className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                  {selectedLog.details}
                </p>
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-[#245934] hover:bg-[#1b4327] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
