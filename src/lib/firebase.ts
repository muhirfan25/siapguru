import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, initializeFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs,
  getDocFromServer,
  writeBatch,
  query,
  where
} from "firebase/firestore";
import { 
  Siswa, 
  Mapel, 
  Jadwal, 
  LogAbsensi, 
  DataNilai, 
  JurnalAgenda, 
  SiswaBimbingan, 
  BimbinganWali, 
  Pengaturan 
} from "../types";

// Konfigurasi Firebase Pribadi Hardcode
export const firebaseConfig = {
  apiKey: "AIzaSyCB8Us6v-_duP8T4vcA3qEfq9dPASa2e3U",
  authDomain: "siagat.firebaseapp.com",
  projectId: "siagat",
  storageBucket: "siagat.firebasestorage.app",
  messagingSenderId: "761104349550",
  appId: "1:761104349550:web:b95908c5cc8e5b64b3a97f"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const firestore = initializeFirestore(app, { experimentalForceLongPolling: true }, "(default)");
export const auth = getAuth(app);
export let globalSekolahId: string | undefined = undefined;
export function setGlobalSekolahId(id?: string) { globalSekolahId = id; }


// Collections references
export const COLLECTIONS = {
  SEKOLAH: "sekolah",
  USERS: "users",
  SISWA: "data_siswa",
  GURU: "data_guru",
  MAPEL: "mapel",
  JADWAL: "jadwal",
  LOG_ABSENSI: "log_absensi",
  DATA_NILAI: "data_nilai",
  JURNAL_AGENDA: "jurnal_agenda",
  SISWA_BIMBINGAN: "siswa_bimbingan",
  BIMBINGAN_WALI: "bimbingan_wali",
  CATATAN_GURU: "catatan_guru",
  ARSIP_PERANGKAT: "arsip_perangkat",
  PENGATURAN: "pengaturan"
};

// Validate Connection to Firestore on startup
async function testConnection() {
  try {
    await getDocFromServer(doc(firestore, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("offline")) {
      console.warn("Firestore client operating in offline mode.");
    }
  }
}
testConnection();

// Generic Realtime Subscription with offline fallback
export function subscribeCollection<T>(collectionName: string, callback: (data: T[]) => void, sekolahId?: string) {
  const colRef = collection(firestore, collectionName);
  const q = sekolahId ? query(colRef, where("sekolahId", "==", sekolahId)) : colRef;
  
  return onSnapshot(
    q, 
    (snapshot) => {
      const items: T[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as unknown as T);
      });
      callback(items);
    },
    (error) => {
      console.warn(`Firestore subscription notice on ${collectionName}:`, error?.message || error);
    }
  );
}

// Single Document Save/Update
export async function saveDocument(collectionName: string, id: string, data: Record<string, any>) {
  try {
    const docRef = doc(firestore, collectionName, id);
    const payload: Record<string, any> = { ...data, updatedAt: Date.now() };
    if (globalSekolahId && !payload.sekolahId) {
      payload.sekolahId = globalSekolahId;
    }
    await setDoc(docRef, payload, { merge: true });
  } catch (err: any) {
    console.error(`Error saving document in ${collectionName}:`, err);
    throw err;
  }
}

// Single Document Delete
export async function deleteDocument(collectionName: string, id: string) {
  try {
    const docRef = doc(firestore, collectionName, id);
    await deleteDoc(docRef);
  } catch (err: any) {
    console.error(`Error deleting document in ${collectionName}:`, err);
    throw err;
  }
}

// Batch Save Documents
export async function batchSaveDocuments(collectionName: string, items: Array<{ id: string; [key: string]: any }>) {
  if (!items || items.length === 0) return;
  try {
    const batch = writeBatch(firestore);
    items.forEach((item) => {
      const docRef = doc(firestore, collectionName, item.id);
      const payload: Record<string, any> = { ...item, updatedAt: Date.now() };
      if (globalSekolahId && !payload.sekolahId) {
        payload.sekolahId = globalSekolahId;
      }
      batch.set(docRef, payload, { merge: true });
    });
    await batch.commit();
  } catch (err: any) {
    console.error(`Error batch saving documents in ${collectionName}:`, err);
    throw err;
  }
}

// Pengaturan special helper (Doc ID: "config" or "config_sekolahId")
export async function savePengaturan(config: Pengaturan, sekolahId?: string) {
  try {
    const docId = sekolahId ? `config_${sekolahId}` : "config";
    const docRef = doc(firestore, COLLECTIONS.PENGATURAN, docId);
    await setDoc(docRef, { ...config, ...(sekolahId ? { sekolahId } : {}), updatedAt: Date.now() }, { merge: true });
  } catch (err: any) {
    console.error("Error saving pengaturan:", err);
    throw err;
  }
}

export function subscribePengaturan(callback: (config: Pengaturan) => void, sekolahId?: string) {
  const docId = sekolahId ? `config_${sekolahId}` : "config";
  const docRef = doc(firestore, COLLECTIONS.PENGATURAN, docId);
  return onSnapshot(
    docRef, 
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as Pengaturan);
      }
    },
    (error) => {
      console.warn("Firestore pengaturan subscription notice:", error?.message || error);
    }
  );
}

// Clear / Wipe All Collections in Database (Except Configuration)
export async function clearAllDatabaseCollections(sekolahId?: string) {
  // Set flag in localStorage and Firestore so auto-seeder never re-populates on any device
  localStorage.setItem("edadmin_database_cleared", "true");
  try {
    const configDocRef = doc(firestore, COLLECTIONS.PENGATURAN, "config");
    await setDoc(configDocRef, { isDatabaseCleared: true, updatedAt: Date.now() }, { merge: true });
  } catch (err) {
    console.warn("Could not set isDatabaseCleared flag in pengaturan collection:", err);
  }

  const collectionsToClear = [
    COLLECTIONS.GURU,
    COLLECTIONS.SISWA,
    COLLECTIONS.MAPEL,
    COLLECTIONS.JADWAL,
    COLLECTIONS.LOG_ABSENSI,
    COLLECTIONS.DATA_NILAI,
    COLLECTIONS.JURNAL_AGENDA,
    COLLECTIONS.SISWA_BIMBINGAN,
    COLLECTIONS.BIMBINGAN_WALI
  ];

  const errors: string[] = [];

  for (const colName of collectionsToClear) {
    try {
      const colRef = collection(firestore, colName);
      const q = sekolahId ? query(colRef, where("sekolahId", "==", sekolahId)) : colRef;
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const docs = snapshot.docs;
        for (let i = 0; i < docs.length; i += 400) {
          const batch = writeBatch(firestore);
          const chunk = docs.slice(i, i + 400);
          chunk.forEach((docSnap) => {
            batch.delete(docSnap.ref);
          });
          await batch.commit();
        }
      }
    } catch (err: any) {
      console.error(`Error clearing collection ${colName}:`, err);
      errors.push(`${colName}: ${err?.message || err}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Sebagian koleksi gagal dihapus: ${errors.join(", ")}`);
  }
}

// Backup & Export All Collections
export async function exportAllDatabaseCollections(sekolahId?: string) {
  const collectionsToExport = [
    { key: "guru", name: COLLECTIONS.GURU },
    { key: "siswa", name: COLLECTIONS.SISWA },
    { key: "mapel", name: COLLECTIONS.MAPEL },
    { key: "jadwal", name: COLLECTIONS.JADWAL },
    { key: "absensi", name: COLLECTIONS.LOG_ABSENSI },
    { key: "nilai", name: COLLECTIONS.DATA_NILAI },
    { key: "agenda", name: COLLECTIONS.JURNAL_AGENDA },
    { key: "siswa_bimbingan", name: COLLECTIONS.SISWA_BIMBINGAN },
    { key: "bimbingan_wali", name: COLLECTIONS.BIMBINGAN_WALI },
    { key: "catatan_guru", name: COLLECTIONS.CATATAN_GURU },
    { key: "arsip_perangkat", name: COLLECTIONS.ARSIP_PERANGKAT },
    { key: "pengaturan", name: COLLECTIONS.PENGATURAN }
  ];

  const resultData: Record<string, any[]> = {};
  let totalRecords = 0;

  for (const item of collectionsToExport) {
    try {
      const colRef = collection(firestore, item.name);
      const q = sekolahId ? query(colRef, where("sekolahId", "==", sekolahId)) : colRef;
      const snap = await getDocs(q);
      const docsData: any[] = [];
      snap.forEach((d) => {
        docsData.push({ id: d.id, ...d.data() });
      });
      resultData[item.name] = docsData;
      totalRecords += docsData.length;
    } catch (e) {
      console.warn(`Warning exporting ${item.name}:`, e);
      resultData[item.name] = [];
    }
  }

  return {
    meta: {
      appName: "SIAP_GURU",
      backupVersion: "1.0",
      exportedAt: new Date().toISOString(),
      sekolahId: sekolahId || "ALL_SCHOOLS",
      totalRecords
    },
    data: resultData
  };
}

// Restore Database from Backup JSON
export async function restoreDatabaseBackup(backupJson: any, targetSekolahId?: string) {
  if (!backupJson || !backupJson.data || typeof backupJson.data !== "object") {
    throw new Error("Format berkas cadangan (backup) tidak valid atau rusak.");
  }

  let restoredCount = 0;
  const collectionsData = backupJson.data;

  for (const colName of Object.keys(collectionsData)) {
    const records = collectionsData[colName];
    if (Array.isArray(records) && records.length > 0) {
      for (let i = 0; i < records.length; i += 300) {
        const chunk = records.slice(i, i + 300);
        const batch = writeBatch(firestore);
        
        for (const item of chunk) {
          const { id, ...dataToSave } = item;
          if (targetSekolahId && !dataToSave.sekolahId) {
            dataToSave.sekolahId = targetSekolahId;
          }
          const docRef = id ? doc(firestore, colName, id) : doc(collection(firestore, colName));
          batch.set(docRef, dataToSave, { merge: true });
          restoredCount++;
        }
        await batch.commit();
      }
    }
  }

  return restoredCount;
}


