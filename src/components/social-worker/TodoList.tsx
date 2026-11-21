import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ListTodo,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Calendar,
  AlertCircle,
  Clock,
  AlertOctagon,
  Bell,
  Sparkles,
  Flame,
  Check
} from 'lucide-react';
import { TodoTask } from '../../types';
import { TRANSLATIONS } from '../../utils/i18n';

export const TodoList: React.FC = () => {
  const {
    currentUser,
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    stopAlert,
    isAlertActive,
    language
  } = useApp();
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('high');
  const [dueDate, setDueDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [feedbackMsg, setFeedbackMsg] = useState('');

  if (!currentUser || currentUser.role !== 'social_worker') return null;

  const myTodos = todos.filter(t => t.workerId === currentUser.id);
  const pendingTodos = myTodos.filter(t => !t.isCompleted);
  const completedTodos = myTodos.filter(t => t.isCompleted);

  // Active approaching or critical alerts using central logic
  const approachingTasks = pendingTodos.filter(isAlertActive);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTodo(title.trim(), priority, dueDate);
    setTitle('');
    showFeedback('New task added successfully!');
  };

  const handleStopAlert = (task: TodoTask) => {
    stopAlert(task.id);
    showFeedback(`Alert stopped for "${task.title}". It will return when deadline approaches!`);
  };

  const handleMarkDone = (task: TodoTask) => {
    toggleTodo(task.id);
    showFeedback(`Task "${task.title}" marked as done!`);
  };

  return (
    <div className="space-y-6 relative">
      {/* Feedback Toast */}
      {feedbackMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#1b4327] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-400/30 animate-fadeIn text-xs sm:text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 text-[#eec149]" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* NON-BLOCKING APPROACHING / REACHED DEADLINES BANNER */}
      {approachingTasks.length > 0 && (
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
                    {approachingTasks.length} Deadline Alert{approachingTasks.length > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  You can stop this alert temporarily, mark it done, or add another task below. When the deadline is near, it will return automatically.
                </p>
              </div>
            </div>

            <a
              href="#add-task-form"
              className="px-3 py-1.5 bg-[#245934] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Other Task</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {approachingTasks.map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-900 dark:text-white text-xs truncate flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{task.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                    <span className="font-semibold text-rose-700 dark:text-rose-400 capitalize">
                      {task.priority === 'high' ? t.highPriority : task.priority === 'medium' ? t.mediumPriority : t.lowPriority}
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
                    onClick={() => handleStopAlert(task)}
                    className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-[11px] transition-all cursor-pointer"
                    title="Stop alert for now; will return when deadline is near"
                  >
                    Stop Alert
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMarkDone(task)}
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

      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-emerald-400 mb-1">
            <span>{t.navTodoPlanner}</span>
            <span>·</span>
            <span>{currentUser.grade}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
            {t.todoPageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {t.todoPageSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-900 px-4 py-2 rounded-2xl shrink-0">
          <div className="text-2xl font-extrabold text-teal-900 dark:text-teal-200 font-display tabular-nums">
            {pendingTodos.length}
          </div>
          <div className="text-xs text-teal-700 dark:text-teal-400 font-semibold leading-tight">
            {t.pending}<br />{t.todoPlannerBtn}
          </div>
        </div>
      </div>

      {/* Add Task Form with Date / Deadline Input */}
      <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
            {t.addNewTask}
          </h2>
          <span className="text-[11px] text-teal-700 dark:text-emerald-400 font-semibold">
            {t.urgentActionRequired}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t.taskDescriptionLabel}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Follow-up meeting with Senior 4 MEG family mentor..."
              className="w-full px-4 py-2.5 text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl focus:border-teal-500 outline-hidden"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t.deadlineLabel}
            </label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200 outline-hidden bg-white dark:bg-slate-800"
            />
          </div>

          <div className="sm:col-span-3 flex flex-col justify-end">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t.priorityLabel}
            </label>
            <div className="flex gap-2">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200 outline-hidden flex-1 cursor-pointer"
              >
                <option value="high" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t.highPriority}</option>
                <option value="medium" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t.mediumPriority}</option>
                <option value="low" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{t.lowPriority}</option>
              </select>

              <button
                type="submit"
                className="py-2.5 px-4 bg-teal-700 dark:bg-emerald-600 hover:bg-teal-800 dark:hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{t.add}</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Pending Tasks Section (Disappears and decrements pending count when marked finished) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2">
          <span>{t.activePendingTasks} ({pendingTodos.length})</span>
          <span>{t.markDone}</span>
        </div>

        {pendingTodos.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
            {t.allCaughtUp}
          </div>
        ) : (
          <div className="space-y-2">
            {pendingTodos.map((task) => (
              <div
                key={task.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-4 border transition-all flex items-center justify-between gap-4 ${
                  isAlertActive(task)
                    ? 'border-rose-400 dark:border-rose-700 bg-rose-50/30 dark:bg-rose-950/20 shadow-xs hover:border-rose-500'
                    : 'border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-teal-400 dark:hover:border-emerald-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTodo(task.id)}
                    className="text-slate-300 dark:text-slate-600 hover:text-teal-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                    title="Mark task as finished"
                  >
                    <Circle className="w-5 h-5" />
                  </button>

                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug flex items-center gap-2">
                      <span>{task.title}</span>
                      {isAlertActive(task) && (
                        <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 text-[10px] font-bold">
                          Approaching
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className={`font-semibold capitalize ${
                        task.priority === 'high'
                          ? 'text-rose-600 dark:text-rose-400'
                          : task.priority === 'medium'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {task.priority} priority
                      </span>
                      <span>·</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">
                        Due: {task.dueDate || 'Today'}
                      </span>
                      <span>·</span>
                      <span>Added {new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleTodo(task.id)}
                    className="px-3 py-1.5 bg-teal-50 dark:bg-emerald-950/60 hover:bg-teal-100 dark:hover:bg-emerald-900/60 text-teal-800 dark:text-emerald-300 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.markDone}</span>
                  </button>
                  <button
                    onClick={() => deleteTodo(task.id)}
                    className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg transition-colors cursor-pointer"
                    title={t.delete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Tasks Section (Can be viewed and deleted) */}
      {completedTodos.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2">
            <span>{t.completedArchive} ({completedTodos.length})</span>
            <span>{t.completed}</span>
          </div>

          <div className="space-y-2">
            {completedTodos.map((task) => (
              <div
                key={task.id}
                className="bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl p-3.5 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-4 text-slate-500 dark:text-slate-400"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTodo(task.id)}
                    className="text-emerald-600 dark:text-emerald-400 cursor-pointer"
                    title="Mark active again"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <span className="text-xs sm:text-sm line-through text-slate-500 dark:text-slate-400 font-medium">
                    {task.title}
                  </span>
                </div>

                <button
                  onClick={() => deleteTodo(task.id)}
                  className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg transition-colors cursor-pointer"
                  title="Remove from archive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
