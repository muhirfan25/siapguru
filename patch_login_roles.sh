#!/bin/bash
cat << 'INNER_EOF' > src/components/LoginView.tsx
import React, { useState } from 'react';
import { UserCircle, Shield, ArrowLeft, LogIn } from 'lucide-react';
import Swal from 'sweetalert2';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore, COLLECTIONS } from "../lib/firebase";
import { collection, query, where, getDocs, doc, getDoc, setDoc } from "firebase/firestore";

interface LoginViewProps {
  onLoginSuccess: (role: 'superadmin' | 'admin_sekolah' | 'guru', name?: string, sekolahId?: string) => void;
  onBack: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onBack }) => {
  const [role, setRole] = useState<'guru' | 'admin'>('guru');
  const [identifier, setIdentifier] = useState(''); // Can be NIP or Email
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (role === 'admin') {
      try {
        const email = identifier.trim().toLowerCase();
        let userCredential;
        
        try {
          userCredential = await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
          if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
            userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // After creation, if it's superadmin, we don't need a users doc strictly, but good to have
            if (email === 'pbmirfan81@gmail.com') {
              await setDoc(doc(firestore, COLLECTIONS.USERS, userCredential.user.uid), {
                email,
                role: 'superadmin',
                updatedAt: Date.now()
              });
            } else {
              // Create default admin_sekolah doc
              await setDoc(doc(firestore, COLLECTIONS.USERS, userCredential.user.uid), {
                email,
                role: 'admin_sekolah',
                sekolahId: '',
                updatedAt: Date.now()
              });
            }
          } else {
            throw error; // Rethrow other errors
          }
        }

        if (email === 'pbmirfan81@gmail.com') {
          onLoginSuccess('superadmin', 'Superadmin IRFAN');
          return;
        }

        // Fetch User Doc for admin_sekolah
        const userDocRef = doc(firestore, COLLECTIONS.USERS, userCredential.user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userName = userCredential.user.displayName || email.split('@')[0];
          onLoginSuccess('admin_sekolah', userName, userData.sekolahId);
        } else {
          // If no doc, create it
          await setDoc(userDocRef, {
            email,
            role: 'admin_sekolah',
            sekolahId: '',
            updatedAt: Date.now()
          });
          onLoginSuccess('admin_sekolah', email.split('@')[0], '');
        }

      } catch (error: any) {
        console.error("Login admin error:", error);
        Swal.fire({
          icon: 'error',
          title: 'Login Gagal',
          text: error.code === 'auth/email-already-in-use' ? 'Password salah untuk email ini!' : 'Email atau Password salah!',
          confirmButtonColor: '#3b82f6',
          timer: 3000
        });
      } finally {
        setLoading(false);
      }
    } else {
      // GURU LOGIN via Firestore Check
      try {
        const q = query(
          collection(firestore, COLLECTIONS.GURU), 
          where('nip', '==', identifier.trim()),
          where('password', '==', password)
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const guruData = querySnapshot.docs[0].data();
          onLoginSuccess('guru', guruData.nama, guruData.sekolahId);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Guru Gagal',
            text: 'NIP atau Password Guru salah, atau belum didaftarkan Admin!',
            confirmButtonColor: '#3b82f6',
            timer: 3000
          });
        }
      } catch (error: any) {
        console.error("Guru Login Error:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error Koneksi',
          text: 'Gagal menghubungi database. Pastikan perangkat Anda online.',
          confirmButtonColor: '#3b82f6'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 transition-colors">
      <button onClick={onBack} className="absolute top-6 left-6 p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm">
        <ArrowLeft size={20} className="text-slate-500 dark:text-slate-400" />
      </button>
      
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700">
        <div className="p-8 pb-6 text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Selamat Datang</h2>
          <p className="text-slate-500 dark:text-slate-400">Silakan masuk ke akun Anda</p>
        </div>

        <div className="flex border-y border-slate-100 dark:border-slate-700">
          <button
            type="button"
            className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 ${role === 'guru' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400'}`}
            onClick={() => { setRole('guru'); setIdentifier(''); setPassword(''); }}
          >
            <UserCircle size={20} /> Guru
          </button>
          <button
            type="button"
            className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 ${role === 'admin' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400'}`}
            onClick={() => { setRole('admin'); setIdentifier(''); setPassword(''); }}
          >
            <Shield size={20} /> Administrator
          </button>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              {role === 'guru' ? 'NIP Guru' : 'Email Admin (Superadmin: pbmirfan81@gmail.com)'}
            </label>
            <input 
              type={role === 'guru' ? 'text' : 'email'} 
              required
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
              placeholder={role === 'guru' ? 'Masukkan NIP' : 'admin@sekolah.com'}
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-70 transition-colors"
          >
            {loading ? <span className="animate-spin text-white">⌛</span> : <LogIn size={20} />}
            {loading ? 'Memproses...' : 'Masuk Sistem'}
          </button>
        </form>
      </div>
    </div>
  );
};
INNER_EOF
