import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type Timestamp
} from 'firebase/firestore';
import { firestore } from './firebase';
import type { AppCustomization } from '../types';
import campusSereneImage from '../assets/images/asyv_campus_serene_1791360386714.jpg';
import wellnessCircleImage from '../assets/images/student_wellness_circle_1791360405521.jpg';

/**
 * Firestore layout
 *   app_settings/landing_media   -> the active welcome-page image (single source of truth)
 *   app_settings/customization   -> every other admin portal customization
 *   landing_media_library/{id}   -> images uploaded by the admin
 */
const SETTINGS = 'app_settings';
const ACTIVE_DOC = 'landing_media';
const CUSTOMIZATION_DOC = 'customization';
const LIBRARY = 'landing_media_library';

export const DEFAULT_LANDING_IMAGE_URL = '/assets/aistudio/download_954a9c9b.jpg';

export interface LandingMediaItem {
  id: string;
  name: string;
  url: string;
  builtIn?: boolean;
  createdAt?: string;
  uploadedBy?: string;
  sizeBytes?: number;
}

export interface ActiveLandingImage {
  url: string;
  mediaId: string;
  name: string;
  updatedAt?: string;
  updatedBy?: string;
}

export type LandingMediaStatus = 'connecting' | 'live' | 'unavailable';

export const BUILT_IN_LANDING_MEDIA: LandingMediaItem[] = [
  { id: 'builtin-official', name: 'Official ASYV Strategic Plan (Kid Photo)', url: DEFAULT_LANDING_IMAGE_URL, builtIn: true },
  { id: 'builtin-campus', name: 'ASYV Campus at Sunrise', url: campusSereneImage, builtIn: true },
  { id: 'builtin-wellness', name: 'Student Wellness Circle', url: wellnessCircleImage, builtIn: true }
];

const FIRESTORE_TIMEOUT_MS = 12_000;

function withTimeout<T>(promise: Promise<T>): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error('Firestore did not respond. Check that the Firestore database exists and its security rules allow writes.')),
        FIRESTORE_TIMEOUT_MS
      )
    )
  ]);
}

const toIso = (value: unknown): string | undefined => {
  const ts = value as Timestamp | null | undefined;
  return ts && typeof ts.toDate === 'function' ? ts.toDate().toISOString() : undefined;
};

const statusListeners = new Set<(s: LandingMediaStatus) => void>();
let currentStatus: LandingMediaStatus = 'connecting';
const setStatus = (s: LandingMediaStatus) => {
  currentStatus = s;
  statusListeners.forEach(fn => fn(s));
};

export function subscribeLandingMediaStatus(cb: (s: LandingMediaStatus) => void): () => void {
  statusListeners.add(cb);
  cb(currentStatus);
  return () => statusListeners.delete(cb);
}

export function subscribeActiveLandingImage(cb: (active: ActiveLandingImage | null) => void): () => void {
  const timer = setTimeout(() => {
    if (currentStatus === 'connecting') setStatus('unavailable');
  }, FIRESTORE_TIMEOUT_MS);
  const unsub = onSnapshot(
    doc(firestore, SETTINGS, ACTIVE_DOC),
    { includeMetadataChanges: true },
    snap => {
      if (!snap.metadata.fromCache) setStatus('live');
      const data = snap.data();
      if (!data?.url) return cb(null);
      cb({
        url: data.url,
        mediaId: data.mediaId || '',
        name: data.name || '',
        updatedAt: toIso(data.updatedAt),
        updatedBy: data.updatedBy
      });
    },
    err => {
      console.warn('Firestore landing media unavailable:', err.message);
      setStatus('unavailable');
    }
  );
  return () => {
    clearTimeout(timer);
    unsub();
  };
}

export function subscribeLandingLibrary(cb: (items: LandingMediaItem[]) => void): () => void {
  return onSnapshot(
    query(collection(firestore, LIBRARY), orderBy('createdAt', 'desc')),
    snap => {
      cb(
        snap.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name || 'Uploaded image',
            url: data.url,
            createdAt: toIso(data.createdAt),
            uploadedBy: data.uploadedBy,
            sizeBytes: data.sizeBytes
          };
        })
      );
    },
    err => console.warn('Firestore media library unavailable:', err.message)
  );
}

export async function setActiveLandingImage(item: Pick<LandingMediaItem, 'id' | 'name' | 'url'>, updatedBy: string): Promise<void> {
  await withTimeout(
    setDoc(doc(firestore, SETTINGS, ACTIVE_DOC), {
      url: item.url,
      mediaId: item.id,
      name: item.name,
      updatedBy,
      updatedAt: serverTimestamp()
    })
  );
}

// Firestore documents are capped at 1 MiB, so uploads are downscaled and re-encoded as JPEG data URLs.
const MAX_DATA_URL_CHARS = 900_000;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not read this image file.'));
    img.src = src;
  });
}

export async function compressImageFile(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    let maxSide = 1600;
    let quality = 0.86;
    for (let attempt = 0; attempt < 8; attempt++) {
      const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Image processing is not supported in this browser.');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      if (dataUrl.length <= MAX_DATA_URL_CHARS) return dataUrl;
      if (quality > 0.6) quality -= 0.1;
      else maxSide = Math.round(maxSide * 0.8);
    }
    throw new Error('Image is too large even after compression. Please choose a smaller image.');
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function addLandingImage(name: string, url: string, uploadedBy: string): Promise<LandingMediaItem> {
  const ref = await withTimeout(
    addDoc(collection(firestore, LIBRARY), {
      name,
      url,
      uploadedBy,
      sizeBytes: url.startsWith('data:') ? Math.round((url.length * 3) / 4) : null,
      createdAt: serverTimestamp()
    })
  );
  return { id: ref.id, name, url, uploadedBy };
}

export function deleteLandingImage(id: string): Promise<void> {
  return withTimeout(deleteDoc(doc(firestore, LIBRARY, id)));
}

/** Mirrors the active image to the app server (central DB + WebSocket) so it also persists if Firestore is unreachable. */
async function mirrorToServer(url: string): Promise<boolean> {
  try {
    const res = await fetch('/api/upload-hero-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: url })
    });
    return res.ok;
  } catch {
    return false;
  }
}

export interface PublishResult {
  firestore: boolean;
  server: boolean;
  firestoreError?: string;
}

export async function publishLandingImage(item: Pick<LandingMediaItem, 'id' | 'name' | 'url'>, updatedBy: string): Promise<PublishResult> {
  const [fs, server] = await Promise.allSettled([setActiveLandingImage(item, updatedBy), mirrorToServer(item.url)]);
  const result: PublishResult = {
    firestore: fs.status === 'fulfilled',
    server: server.status === 'fulfilled' && server.value,
    firestoreError: fs.status === 'rejected' ? (fs.reason as Error)?.message : undefined
  };
  if (!result.firestore && !result.server) throw new Error(result.firestoreError || 'Could not save the welcome image.');
  return result;
}

export const resetLandingImage = (updatedBy: string) => publishLandingImage(BUILT_IN_LANDING_MEDIA[0], updatedBy);

/** Compresses an uploaded file, stores it in the Firestore library (when reachable) and makes it the live welcome image. */
export async function uploadAndPublishLandingImage(file: File, uploadedBy: string): Promise<{ item: LandingMediaItem; result: PublishResult }> {
  const dataUrl = await compressImageFile(file);
  const name = file.name.replace(/\.[^.]+$/, '') || 'Uploaded image';
  let item: LandingMediaItem;
  try {
    item = await addLandingImage(name, dataUrl, uploadedBy);
  } catch {
    item = { id: `local-${Date.now()}`, name, url: dataUrl, uploadedBy };
  }
  return { item, result: await publishLandingImage(item, uploadedBy) };
}

export function describePublish(result: PublishResult, success: string): string {
  if (result.firestore) return success;
  return `${success} Saved on the Mind Bridge server, but Firestore sync failed: ${result.firestoreError}`;
}

export function subscribeCustomization(cb: (custom: Partial<AppCustomization>) => void): () => void {
  return onSnapshot(
    doc(firestore, SETTINGS, CUSTOMIZATION_DOC),
    snap => {
      const data = snap.data();
      if (!data) return;
      const { updatedAt: _updatedAt, ...custom } = data;
      cb(custom as Partial<AppCustomization>);
    },
    err => console.warn('Firestore customization unavailable:', err.message)
  );
}

export async function saveCustomization(custom: AppCustomization): Promise<void> {
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(custom)) {
    if (value === undefined) continue;
    // Large inline images live in the media library, not in the customization document.
    if (typeof value === 'string' && value.startsWith('data:') && value.length > 50_000) continue;
    clean[key] = value;
  }
  await withTimeout(setDoc(doc(firestore, SETTINGS, CUSTOMIZATION_DOC), { ...clean, updatedAt: serverTimestamp() }));
}
