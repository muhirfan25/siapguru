s/const firebaseConfig = {/const firebaseConfig = firebaseConfigData; \/\/ {/g
s/apiKey: "AIzaSyAwJgHCcCRL3tWDPQaMKR0QS0znWDxuMXE",/\/\/ apiKey: "..."/g
s/authDomain: "aplikasiguruai.firebaseapp.com",/\/\/ authDomain: "..."/g
s/projectId: "aplikasiguruai",/\/\/ projectId: "..."/g
s/storageBucket: "aplikasiguruai.firebasestorage.app",/\/\/ storageBucket: "..."/g
s/messagingSenderId: "83937950753",/\/\/ messagingSenderId: "..."/g
s/appId: "1:83937950753:web:53471174f4901a50f2f760"/\/\/ appId: "..."/g
s/export const firestore = getFirestore(app);/export const firestore = getFirestore(app, firebaseConfigData.firestoreDatabaseId || "(default)");/g
