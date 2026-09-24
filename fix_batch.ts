import fs from 'fs';
let content = fs.readFileSync('src/lib/firebase.ts', 'utf-8');

const target = `batch.set(docRef, { ...item, updatedAt: Date.now() }, { merge: true });`;
const replacement = `const payload = { ...item, updatedAt: Date.now() };
      if (globalSekolahId && !payload.sekolahId) {
        payload.sekolahId = globalSekolahId;
      }
      batch.set(docRef, payload, { merge: true });`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/lib/firebase.ts', content);
  console.log("batchSaveDocuments patched");
} else {
  console.log("target not found");
}
