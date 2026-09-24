import fs from 'fs';
let content = fs.readFileSync('src/lib/firebase.ts', 'utf-8');

// Add global var
const importTarget = `export const auth = getAuth(app);`;
const varStr = `\nexport let globalSekolahId: string | undefined = undefined;\nexport function setGlobalSekolahId(id?: string) { globalSekolahId = id; }\n`;
if (!content.includes('globalSekolahId')) {
    content = content.replace(importTarget, importTarget + varStr);
}

// saveDocument
const saveTarget = `await setDoc(docRef, { ...data, updatedAt: Date.now() }, { merge: true });`;
const saveReplace = `const payload = { ...data, updatedAt: Date.now() };
    if (globalSekolahId && !payload.sekolahId) {
      payload.sekolahId = globalSekolahId;
    }
    await setDoc(docRef, payload, { merge: true });`;
content = content.replace(saveTarget, saveReplace);

// batchSaveDocuments
const batchTarget = `batch.set(docRef, { ...docData, updatedAt: Date.now() }, { merge: true });`;
const batchReplace = `const payload = { ...docData, updatedAt: Date.now() };
      if (globalSekolahId && !payload.sekolahId) {
        payload.sekolahId = globalSekolahId;
      }
      batch.set(docRef, payload, { merge: true });`;
content = content.replace(batchTarget, batchReplace);

fs.writeFileSync('src/lib/firebase.ts', content);
console.log("Firebase globals added");
