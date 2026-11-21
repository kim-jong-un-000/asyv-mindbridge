import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ImageIcon, Link2, Loader2, RefreshCw, Trash2, Upload, Wifi, WifiOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  BUILT_IN_LANDING_MEDIA,
  DEFAULT_LANDING_IMAGE_URL,
  addLandingImage,
  deleteLandingImage,
  describePublish,
  publishLandingImage,
  resetLandingImage,
  subscribeLandingLibrary,
  uploadAndPublishLandingImage,
  type LandingMediaItem
} from '../../lib/landingMedia';

export const MediaManagerView: React.FC = () => {
  const { currentUser, landingImage, landingMediaStatus, appCustomization, addAuditLog } = useApp();
  const [library, setLibrary] = useState<LandingMediaItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  const adminLabel = currentUser?.email || 'admin';
  const isLive = landingMediaStatus === 'live';

  useEffect(() => subscribeLandingLibrary(setLibrary), []);

  const allMedia = useMemo(() => [...library, ...BUILT_IN_LANDING_MEDIA], [library]);
  const activeUrl = landingImage?.url || appCustomization?.strategicPlanImageUrl || DEFAULT_LANDING_IMAGE_URL;
  const activeId = landingImage?.mediaId || allMedia.find(m => m.url === activeUrl)?.id || null;
  const selected = allMedia.find(m => m.id === (selectedId ?? activeId)) || null;

  const run = async (key: string, fn: () => Promise<string | void>, ok: string) => {
    setBusy(key);
    setMessage(null);
    try {
      const text = await fn();
      setMessage({ kind: 'ok', text: text || ok });
    } catch (err: any) {
      setMessage({ kind: 'error', text: err?.message || 'Something went wrong. Please try again.' });
    } finally {
      setBusy(null);
    }
  };

  const applyItem = (item: LandingMediaItem) =>
    run(`apply-${item.id}`, async () => {
      const result = await publishLandingImage(item, adminLabel);
      setSelectedId(item.id);
      addAuditLog?.('APP_CUSTOMIZED', `Admin set the welcome page image to "${item.name}"`, 'info');
      return describePublish(result, `"${item.name}" is now live on the welcome page for everyone.`);
    }, '');

  const handleUpload = (file: File) =>
    run('upload', async () => {
      const { item, result } = await uploadAndPublishLandingImage(file, adminLabel);
      setSelectedId(item.id);
      addAuditLog?.('APP_CUSTOMIZED', `Admin uploaded and activated welcome image "${item.name}"`, 'info');
      return describePublish(result, 'Image uploaded and set as the welcome page image.');
    }, '');

  const handleAddUrl = () => {
    const url = urlInput.trim();
    if (!/^(https?:\/\/|\/)/.test(url)) {
      setMessage({ kind: 'error', text: 'Enter an image URL starting with https:// or /' });
      return;
    }
    return run('url', async () => {
      const item = await addLandingImage(nameInput.trim() || 'Web image', url, adminLabel);
      setSelectedId(item.id);
      setUrlInput('');
      setNameInput('');
    }, 'Image added to the library. Select it and click "Use on Welcome Page" to publish.');
  };

  const handleDelete = (item: LandingMediaItem) => {
    if (item.id === activeId) {
      setMessage({ kind: 'error', text: 'This image is live. Set another image first, then delete it.' });
      return;
    }
    if (!window.confirm(`Delete "${item.name}" from the media library?`)) return;
    return run(`delete-${item.id}`, async () => {
      await deleteLandingImage(item.id);
      if (selectedId === item.id) setSelectedId(null);
    }, 'Image removed from the library.');
  };

  const handleReset = () =>
    run('reset', async () => {
      const result = await resetLandingImage(adminLabel);
      setSelectedId(BUILT_IN_LANDING_MEDIA[0].id);
      addAuditLog?.('APP_CUSTOMIZED', 'Admin restored the official welcome page image', 'info');
      return describePublish(result, 'Official ASYV image restored on the welcome page.');
    }, '');

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-md border-2 border-[#245934]/30 dark:border-[#245934] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-black font-display text-slate-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#245934] dark:text-emerald-400" />
              Welcome Page Media Library
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              Browse, select, or replace the main welcome page picture. The image you choose is saved in Firestore and stays on the welcome page for every device until you change it.
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
              isLive
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700'
                : landingMediaStatus === 'connecting'
                  ? 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                  : 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
            }`}
          >
            {isLive ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            {isLive ? 'Firestore connected · synced live' : landingMediaStatus === 'connecting' ? 'Connecting to Firestore…' : 'Firestore unavailable'}
          </span>
        </div>

        {landingMediaStatus === 'unavailable' && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200">
            Firestore could not be reached. Make sure a Firestore database exists for this Firebase project and that its security rules allow the
            <code className="mx-1 font-mono">app_settings</code> and <code className="mx-1 font-mono">landing_media_library</code> collections.
          </div>
        )}

        {message && (
          <div
            className={`p-3 rounded-2xl text-xs font-semibold border ${
              message.kind === 'ok'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Preview */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {selected && selected.id !== activeId ? 'Selected preview' : 'Live on welcome page'}
            </div>
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#eec149] bg-slate-100 dark:bg-black aspect-[4/3]">
              <img src={selected?.url || activeUrl} alt={selected?.name || 'Active welcome image'} className="w-full h-full object-cover" />
              {(selected?.id ?? activeId) === activeId && (
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#245934] text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Live
                </span>
              )}
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">{selected?.name || landingImage?.name || 'Official ASYV image'}</div>
            {landingImage?.updatedAt && (
              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                Last changed {new Date(landingImage.updatedAt).toLocaleString()} by {landingImage.updatedBy || 'admin'}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={!selected || selected.id === activeId || !!busy}
                onClick={() => selected && applyItem(selected)}
                className="px-4 py-2.5 rounded-xl bg-[#245934] hover:bg-[#1b4327] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {busy?.startsWith('apply') ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Use on Welcome Page
              </button>
              <button
                type="button"
                disabled={!!busy || activeId === BUILT_IN_LANDING_MEDIA[0].id}
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-800 dark:text-slate-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {busy === 'reset' ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Restore Official Image
              </button>
            </div>
          </div>

          {/* Library grid + add */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <label
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed text-xs font-bold cursor-pointer transition-colors ${
                  busy === 'upload'
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'
                    : 'border-[#245934]/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-[#1b4327] dark:text-emerald-200'
                }`}
              >
                {busy === 'upload' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {busy === 'upload' ? 'Uploading…' : 'Upload new image (replaces current)'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={!!busy}
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                    e.target.value = '';
                  }}
                />
              </label>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                placeholder="Name (optional)"
                className="sm:w-40 px-3 py-2 text-xs border border-slate-300 rounded-xl outline-hidden focus:border-[#245934]"
              />
              <input
                type="text"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="https://…/photo.jpg"
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl outline-hidden focus:border-[#245934] font-mono"
              />
              <button
                type="button"
                disabled={!urlInput.trim() || !!busy}
                onClick={handleAddUrl}
                className="px-4 py-2 rounded-xl bg-[#1b4327] hover:bg-[#245934] disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Link2 className="w-3.5 h-3.5" /> Add URL
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {allMedia.map(item => {
                const isActive = item.id === activeId;
                const isSelected = item.id === (selectedId ?? activeId);
                return (
                  <div
                    key={item.id}
                    className={`group relative rounded-2xl overflow-hidden border-2 bg-white dark:bg-slate-800 transition-all ${
                      isSelected ? 'border-[#d95f18] shadow-lg' : 'border-slate-200 dark:border-slate-700 hover:border-[#245934]'
                    }`}
                  >
                    <button type="button" onClick={() => setSelectedId(item.id)} className="block w-full text-left cursor-pointer">
                      <img src={item.url} alt={item.name} className="w-full aspect-[4/3] object-cover" loading="lazy" />
                      <div className="p-2">
                        <div className="text-[11px] font-bold text-slate-900 dark:text-white truncate">{item.name}</div>
                        <div className="text-[10px] text-slate-600 dark:text-slate-400">{item.builtIn ? 'Built-in' : 'Uploaded'}</div>
                      </div>
                    </button>
                    {isActive && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#245934] text-white text-[9px] font-black uppercase">Live</span>
                    )}
                    {!item.builtIn && (
                      <button
                        type="button"
                        title="Delete from library"
                        onClick={() => handleDelete(item)}
                        disabled={!!busy}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 hover:bg-rose-50 text-rose-600 border border-rose-200 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
