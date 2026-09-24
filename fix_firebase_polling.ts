import fs from 'fs';
let content = fs.readFileSync('src/lib/firebase.ts', 'utf-8');

if (!content.includes('initializeFirestore')) {
  content = content.replace('getFirestore,', 'getFirestore, initializeFirestore,');
  content = content.replace(
    'export const firestore = getFirestore(app, "(default)");',
    'export const firestore = initializeFirestore(app, { experimentalForceLongPolling: true }, "(default)");'
  );
  fs.writeFileSync('src/lib/firebase.ts', content);
  console.log("Enabled experimentalForceLongPolling in Firebase");
} else {
  console.log("Already using initializeFirestore");
}
