import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Send, Shield, Clock, Heart, AlertOctagon } from 'lucide-react';

export const ChatRoom: React.FC = () => {
  const {
    currentUser,
    messages,
    sendMessage,
    markMessagesRead,
    getSocialWorkerForGrade,
    setActivePage
  } = useApp();

  const [inputContent, setInputContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!currentUser || currentUser.role !== 'student') return null;

  const worker = getSocialWorkerForGrade(currentUser.grade);
  const workerId = worker ? worker.id : 'worker-ingabe';

  // Filter messages between this student and their social worker
  const chatMessages = messages.filter(
    m =>
      (m.senderId === currentUser.id && m.receiverId === workerId) ||
      (m.senderId === workerId && m.receiverId === currentUser.id)
  );

  useEffect(() => {
    if (worker) {
      markMessagesRead(worker.id);
    }
  }, [worker, chatMessages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim() || !worker) return;
    sendMessage(worker.id, inputContent.trim());
    setInputContent('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col h-[calc(100vh-160px)] min-h-[550px] overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {worker && (
            <img
              src={worker.avatar}
              alt={worker.name}
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-2xl object-cover ring-2 ring-teal-500/20"
            />
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                {worker ? worker.name : 'Psychosocial Support Worker'}
              </h2>
              <span className="text-xs text-teal-700 dark:text-emerald-400 font-semibold bg-teal-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                {currentUser.grade} Grade Leader
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Shield className="w-3.5 h-3.5 text-teal-600 dark:text-emerald-400" />
              <span>Strictly confidential 1-on-1 school counseling</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setActivePage('emergency')}
          className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Send SOS Emergency"
        >
          <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
          <span>SOS Alert</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40 dark:bg-slate-950/40">
        <div className="text-center my-2">
          <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[11px] font-medium text-slate-500 dark:text-slate-400 shadow-2xs">
            Start of confidential conversation with your psychosocial worker
          </span>
        </div>

        {chatMessages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          const isSos = msg.content.startsWith('🚨 [EMERGENCY ALERT]');

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-2xs ${
                  isSos
                    ? 'bg-rose-600 text-white font-medium'
                    : isMe
                    ? 'bg-teal-700 dark:bg-emerald-700 text-white rounded-br-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-xs'
                }`}
              >
                <div className="text-xs font-semibold mb-1 opacity-90 flex items-center justify-between gap-4">
                  <span>{isMe ? 'You' : worker?.name}</span>
                  <span className="text-[10px] opacity-75 font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
          placeholder={`Message ${worker ? worker.name.split(' ')[0] : 'your social worker'} confidentially...`}
          className="flex-1 px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:border-teal-500 dark:focus:border-emerald-400 focus:ring-1 focus:ring-teal-500 outline-hidden transition-colors"
        />
        <button
          type="submit"
          disabled={!inputContent.trim()}
          className="px-4 py-2.5 bg-teal-700 dark:bg-emerald-600 hover:bg-teal-800 dark:hover:bg-emerald-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-bold rounded-2xl text-sm transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
