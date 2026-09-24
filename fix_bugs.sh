#!/bin/bash
# Fix savePengaturan undefined sekolahId issue
sed -i 's/await setDoc(docRef, { ...config, sekolahId, updatedAt: Date.now() }, { merge: true });/await setDoc(docRef, { ...config, ...(sekolahId ? { sekolahId } : {}), updatedAt: Date.now() }, { merge: true });/' src/lib/firebase.ts

# Check Sidebar props
