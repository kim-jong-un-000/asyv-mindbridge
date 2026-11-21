import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Send, Shield, User as UserIcon, MessageSquare, AlertOctagon, CheckCheck } from 'lucide-react';

export const WorkerChat: React.FC = () => {
  const {
    currentUser,
    getStudentsByGrade,
    messages,
    sendMessage,
    markMessagesRead
  } = useApp();

  if (!currentUser || currentUser.role !== 'social_worker') return null;

  const students = getStudentsByGrade(currentUser.grade);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students[0]?.id || ''
  );
  const [inputContent, setInputContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  // Filter messages specifically for the selected student and this worker
  const activeChat = messages.filter(
    m =>
      (m.senderId === selectedStudentId && m.receiverId === currentUser.id) ||
      (m.senderId === currentUser.id && m.receiverId === selectedStudentId)
  );

  useEffect(() => {
    if (selectedStudentId) {
      markMessagesRead(selectedStudentId);
    }
  }, [selectedStudentId, activeChat.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim() || !selectedStudentId) return;

    sendMessage(selectedStudentId, inputContent.trim());
    setInputContent('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs h-[calc(100vh-160px)] min-h-[550px] overflow-hidden flex flex-col md:flex-row">
      {/* Student List Sidebar (Students in this grade ONLY) */}
      <div className="w-full md:w-80 border-r border-slate-200/80 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-850">
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-emerald-400">
            {currentUser.grade} Grade Conversations
          </div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
            Confidential 1-on-1 Student Chats
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {students.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500">
              No students registered in {currentUser.grade} yet.
            </div>
          ) : (
            students.map((student) => {
              const isSelected = student.id === selectedStudentId;
              const unreadFromThis = messages.filter(
                m => m.senderId === student.id && m.receiverId === currentUser.id && !m.isRead
              ).length;

              const lastMsg = messages
                .filter(
                  m =>
                    (m.senderId === student.id && m.receiverId === currentUser.id) ||
                    (m.senderId === currentUser.id && m.receiverId === student.id)
                )
                .slice(-1)[0];

              return (
                <div
                  key={student.id}
                  onClick={() => setSelectedStudentId(student.id)}
                  className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-teal-100/60 dark:bg-teal-950/70 border-l-4 border-teal-600 dark:border-emerald-400'
                      : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/60 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-10 h-10 rounded-xl object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {student.name} {student.familyName || ''}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {lastMsg ? lastMsg.content : `${student.schoolClass || 'Student'}`}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    {unreadFromThis > 0 ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-teal-600 dark:bg-emerald-600 text-white rounded-full">
                        {unreadFromThis}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {student.schoolClass?.split(' ')[0] || ''}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Conversation View */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
        {selectedStudent ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                      {selectedStudent.name} {selectedStudent.familyName || ''}
                    </h2>
                    <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded">
                      {selectedStudent.schoolClass || 'Student'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                    {selectedStudent.email}
                  </div>
                </div>
              </div>

              <div className="text-right text-xs text-teal-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-teal-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Private & Grade-Restricted</span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 bg-slate-50/40 dark:bg-slate-950/40">
              {activeChat.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400 dark:text-slate-500">
                  No conversation history yet with {selectedStudent.name}. Type below to send a welcoming supportive message.
                </div>
              ) : (
                activeChat.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  const isSos = msg.content.startsWith('🚨 [EMERGENCY ALERT]');

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                          isSos
                            ? 'bg-rose-600 text-white font-medium ring-2 ring-rose-400'
                            : isMe
                            ? 'bg-teal-700 dark:bg-emerald-700 text-white rounded-br-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-xs'
                        }`}
                      >
                        <div className="text-[11px] font-semibold mb-1 opacity-90 flex items-center justify-between gap-4">
                          <span>{isMe ? 'You (Social Worker)' : selectedStudent.name}</span>
                          <span className="text-[10px] opacity-75 font-mono">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                placeholder={`Type supportive counseling reply to ${selectedStudent.name}...`}
                className="flex-1 px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:border-teal-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-teal-500 outline-hidden"
              />
              <button
                type="submit"
                disabled={!inputContent.trim()}
                className="px-5 py-2.5 bg-teal-700 dark:bg-emerald-600 hover:bg-teal-800 dark:hover:bg-emerald-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400 dark:text-slate-500 text-sm">
            Select a student from your grade on the left to start a private counseling chat.
          </div>
        )}
      </div>
    </div>
  );
};
