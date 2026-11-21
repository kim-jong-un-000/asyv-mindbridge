import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  memoryLocalCache,
  type Firestore
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

// AI Studio projects may use a named Firestore database; set `firestoreDatabaseId` in firebase-applet-config.json.
const firestoreDatabaseId = (firebaseConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId || '(default)';

function createFirestore(): Firestore {
  try {
    return initializeFirestore(
      app,
      { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) },
      firestoreDatabaseId
    );
  } catch {
    return initializeFirestore(app, { localCache: memoryLocalCache() }, firestoreDatabaseId);
  }
}

export const firestore = createFirestore();
