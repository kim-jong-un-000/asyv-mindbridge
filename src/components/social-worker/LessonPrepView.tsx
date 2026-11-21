import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WellnessLesson } from '../../types';
import {
  FileText,
  Upload,
  Image as ImageIcon,
  Send,
  Plus,
  CheckCircle2,
  Paperclip,
  Maximize2
} from 'lucide-react';

export const LessonPrepView: React.FC = () => {
  const { currentUser, wellnessLessons, createWellnessLesson } = useApp();

  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<WellnessLesson['category']>('mindfulness');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [attachmentType, setAttachmentType] = useState<'image' | 'document' | 'none'>('image');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [imageSize, setImageSize] = useState<'medium' | 'large' | 'full'>('medium');
  const [success, setSuccess] = useState(false);

  if (!currentUser || currentUser.role !== 'social_worker') return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachmentName(file.name);
    // Create local object URL for instant preview
    const url = URL.createObjectURL(file);
    setAttachmentUrl(url);
    if (file.type.startsWith('image/')) {
      setAttachmentType('image');
    } else {
      setAttachmentType('document');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    createWellnessLesson({
      title: title.trim(),
      category,
      description: description.trim() || title.trim(),
      content: content.trim(),
      targetGrades: 'all',
      attachmentType: attachmentUrl ? attachmentType : 'none',
      attachmentUrl: attachmentUrl || undefined,
      attachmentName: attachmentName || undefined
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setIsCreating(false);
      setTitle('');
      setDescription('');
      setContent('');
      setAttachmentUrl('');
      setAttachmentName('');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
            <span>Curriculum & Teaching Materials</span>
            <span>·</span>
            <span>Dispatched to Champions</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display">
            Wellness Lesson & Course Preparation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Prepare comprehensive psychosocial teaching modules, attach worksheets or illustrative graphics, and dispatch to all registered Mental Champions across ASYV.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-2xl text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'Close Editor' : 'Draft New Lesson'}</span>
        </button>
      </div>

      {/* Lesson Creator Form */}
      {isCreating && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-200 shadow-md space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 font-display">
              Create Wellness Lesson & Educational Resource
            </h2>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full">
              Delivered to Mental Champions
            </span>
          </div>

          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Lesson successfully posted to all registered Mental Champions!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Lesson Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Somatic Regulation and Restorative Circle Protocols"
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-2xl focus:border-teal-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Curriculum Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as WellnessLesson['category'])}
                className="w-full px-3 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-2xl focus:border-teal-500 outline-hidden font-semibold"
              >
                <option value="mindfulness">Mindfulness & Centering</option>
                <option value="stress">Stress & Anxiety Relief</option>
                <option value="study">Academic Focus & Balance</option>
                <option value="social">Village Social Dynamics</option>
                <option value="resilience">Trauma-Informed Resilience</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Short Summary Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary for champion facilitators..."
              className="w-full px-4 py-2 text-sm border border-slate-300 rounded-2xl focus:border-teal-500 outline-hidden"
            />
          </div>

          {/* Full Lesson Content */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Lesson Notes & Educational Message
            </label>
            <textarea
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the complete instructions, reflection questions, and guiding philosophy for the champions to study..."
              className="w-full p-4 text-sm border border-slate-300 rounded-2xl focus:border-teal-500 outline-hidden leading-relaxed"
            />
          </div>

          {/* File & Image Attachment Section (Direct Explorer & Size Adjuster) */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-teal-600" />
                <span>Attach Photos or Documents (Window Explorer Supported)</span>
              </div>
              <span className="text-[11px] text-slate-400">PDF, JPG, PNG accepted</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Upload file from your computer:
                </label>
                <label className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl cursor-pointer text-xs font-semibold text-slate-600 transition-colors">
                  <Upload className="w-4 h-4 text-teal-600" />
                  <span>Choose file from Explorer</span>
                  <input
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {attachmentName && (
                  <span className="text-xs text-teal-700 font-semibold mt-1 block">
                    Selected: {attachmentName}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Or paste image URL / document link:
                </label>
                <input
                  type="text"
                  value={attachmentUrl}
                  onChange={(e) => {
                    setAttachmentUrl(e.target.value);
                    if (!attachmentName) setAttachmentName('Online Resource');
                  }}
                  placeholder="https://... or paste link"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:border-teal-500 outline-hidden"
                />
              </div>
            </div>

            {/* Prompt requirement: Measure the size you want it to have */}
            {attachmentUrl && attachmentType === 'image' && (
              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  Select Desired Display Size:
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setImageSize('medium')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      imageSize === 'medium' ? 'bg-teal-700 text-white' : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    Medium (250px)
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageSize('large')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      imageSize === 'large' ? 'bg-teal-700 text-white' : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    Large (400px)
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Post to Mental Champions Account</span>
            </button>
          </div>
        </form>
      )}

      {/* Lessons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wellnessLessons.map((l) => (
          <div
            key={l.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between"
          >
            {l.attachmentType === 'image' && l.attachmentUrl && (
              <div className="h-48 w-full bg-slate-100 overflow-hidden relative">
                <img
                  src={l.attachmentUrl}
                  alt={l.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 bg-teal-50 text-teal-800 rounded-md text-xs font-bold uppercase tracking-wider">
                  {l.category}
                </span>
                <span className="text-xs text-slate-400">
                  Author: {l.workerName}
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 font-display">
                {l.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {l.description}
              </p>

              <div className="mt-4 p-4 bg-slate-50 rounded-2xl text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                {l.content}
              </div>

              {l.attachmentType === 'document' && (
                <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center gap-2 text-xs text-teal-900 font-semibold">
                  <FileText className="w-4 h-4 text-teal-700" />
                  <span>{l.attachmentName || 'Curriculum Protocol Document'}</span>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50/60 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
              <span>Target: All Mental Champions</span>
              <span>{new Date(l.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
