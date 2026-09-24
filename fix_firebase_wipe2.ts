import fs from 'fs';
let content = fs.readFileSync('src/lib/firebase.ts', 'utf-8');

const targetStr = `export async function clearAllDatabaseCollections() {`;
const returnStr = `  if (errors.length > 0) {
    throw new Error(\`Sebagian koleksi gagal dihapus: \${errors.join(", ")}\`);
  }
}`;

const startIndex = content.indexOf(targetStr);
const endIndex = content.indexOf(returnStr) + returnStr.length;

if (startIndex !== -1 && endIndex !== -1) {
  const newFunc = `export async function clearAllDatabaseCollections(sekolahId?: string) {
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
      console.error(\`Error clearing collection \${colName}:\`, err);
      errors.push(\`\${colName}: \${err?.message || err}\`);
    }
  }

  if (errors.length > 0) {
    throw new Error(\`Sebagian koleksi gagal dihapus: \${errors.join(", ")}\`);
  }
}`;

  content = content.substring(0, startIndex) + newFunc + content.substring(endIndex);
  fs.writeFileSync('src/lib/firebase.ts', content);
  console.log("firebase.ts patched!");
} else {
  console.log("Not found in firebase.ts!");
}
