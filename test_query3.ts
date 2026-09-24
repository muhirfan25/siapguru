import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCB8Us6v-_duP8T4vcA3qEfq9dPASa2e3U",
  authDomain: "siagat.firebaseapp.com",
  projectId: "siagat",
  storageBucket: "siagat.firebasestorage.app",
  messagingSenderId: "761104349550",
  appId: "1:761104349550:web:b95908c5cc8e5b64b3a97f"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

async function test() {
  try {
    const q = query(collection(firestore, "pengaturan"));
    const snap = await getDocs(q);
    console.log("pengaturan getDocs succeeded! Docs:", snap.size);
  } catch (err: any) {
    console.error("pengaturan Failed:", err.message);
  }
  process.exit(0);
}
test();
