import React, { useState } from 'react';
import { UserCircle, Shield, ArrowLeft, LogIn } from 'lucide-react';
import Swal from 'sweetalert2';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore, COLLECTIONS } from "../lib/firebase";
import { collection, query, where, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { SiapGuruLogo } from './SiapGuruLogo';

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
            try {
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
            } catch (createError: any) {
              if (createError.code === 'auth/email-already-in-use') {
                throw new Error('password-salah');
              }
              throw createError;
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
        
        let resolvedSekolahId = '';
        if (userDoc.exists()) {
          const userData = userDoc.data();
          resolvedSekolahId = userData.sekolahId || '';
        }

        // If no sekolahId found in user document, try searching in sekolah collection
        if (!resolvedSekolahId) {
          try {
            const sekolahQ = query(
              collection(firestore, COLLECTIONS.SEKOLAH),
              where('emailAdmin', '==', email)
            );
            const sekolahSnap = await getDocs(sekolahQ);
            if (!sekolahSnap.empty) {
              resolvedSekolahId = sekolahSnap.docs[0].id;
            }
          } catch (e) {
            console.warn("Could not query sekolah collection:", e);
          }
        }

        // If STILL no sekolahId, create a distinct dedicated school for this admin
        if (!resolvedSekolahId) {
          try {
            const cleanUid = userCredential.user.uid.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
            resolvedSekolahId = `sekolah_${cleanUid || Date.now().toString()}`;
            const schoolName = `Sekolah ${email.split('@')[0].toUpperCase()}`;
            const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
            
            await setDoc(doc(firestore, COLLECTIONS.SEKOLAH, resolvedSekolahId), {
              nama: schoolName,
              emailAdmin: email,
              status: 'active',
              subscriptionPlan: '30_hari',
              activatedAt: Date.now(),
              expiresAt: Date.now() + thirtyDaysMs,
              createdAt: Date.now()
            });
          } catch (err) {
            console.error("Failed to auto-create sekolah record:", err);
            resolvedSekolahId = `sekolah_${userCredential.user.uid.slice(0, 10)}`;
          }
        }

        // Check if school is blocked or subscription expired
        if (resolvedSekolahId) {
          const sDoc = await getDoc(doc(firestore, COLLECTIONS.SEKOLAH, resolvedSekolahId));
          if (sDoc.exists()) {
            const sData = sDoc.data();
            if (sData.status === 'blocked') {
              Swal.fire({
                icon: 'error',
                title: 'Akun Dinonaktifkan',
                text: 'Akses akun sekolah Anda saat ini dinonaktifkan oleh Superadmin. Silakan hubungi Superadmin.',
                confirmButtonColor: '#ef4444'
              });
              setLoading(false);
              return;
            }
            if (sData.subscriptionPlan !== 'permanen' && sData.expiresAt && sData.expiresAt < Date.now()) {
              const expiredDate = new Date(sData.expiresAt).toLocaleString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) + ' WIB';
              Swal.fire({
                icon: 'warning',
                title: 'Masa Aktif Kedaluwarsa',
                html: `
                  <div class="text-left text-sm space-y-2">
                    <p>Masa aktif akun sekolah Anda telah berakhir pada <b>${expiredDate}</b>.</p>
                    <p>Kategori masa aktif yang dapat diaktifkan:</p>
                    <ul class="list-disc pl-5 text-xs text-gray-600 space-y-1">
                      <li>⚡ Uji Coba Cepat (1 Jam / 1 Hari / 3 Hari / 30 Hari)</li>
                      <li>📆 Masa Aktif 6 Bulan (1 Semester)</li>
                      <li>🗓️ Masa Aktif 1 Tahun (1 Tahun Ajaran)</li>
                      <li>💎 Aktif Permanen (Lifetime / Selamanya)</li>
                    </ul>
                    <p class="pt-2 text-xs text-blue-600 font-semibold">Silakan hubungi Superadmin untuk aktivasi atau perpanjangan.</p>
                  </div>
                `,
                confirmButtonColor: '#2563eb',
                confirmButtonText: 'Hubungi WhatsApp',
                showCancelButton: true,
                cancelButtonText: 'Tutup'
              }).then((result) => {
                if (result.isConfirmed) {
                  window.open('https://wa.me/6285255700081?text=Halo%20Admin%20SIAP%20GURU,%20masa%20aktif%20sekolah%20kami%20telah%20berakhir.%20Mohon%20info%20perpanjangan.', '_blank');
                }
              });
              setLoading(false);
              return;
            }
          }
        }

        // Ensure user document has this verified distinct sekolahId
        await setDoc(userDocRef, {
          email,
          role: 'admin_sekolah',
          sekolahId: resolvedSekolahId,
          updatedAt: Date.now()
        }, { merge: true });

        const userName = userCredential.user.displayName || email.split('@')[0];
        onLoginSuccess('admin_sekolah', userName, resolvedSekolahId);

      } catch (error: any) {
        if (error.message !== 'password-salah') {
          console.error("Login admin error:", error);
        }
        Swal.fire({
          icon: 'error',
          title: 'Login Gagal',
          text: (error.message === 'password-salah' || error.code === 'auth/email-already-in-use') ? 'Password salah untuk email ini!' : 'Email atau Password salah!',
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
          where('nip', '==', identifier.trim())
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const guruDoc = querySnapshot.docs[0];
          const guruData = guruDoc.data();
          
          const storedPassword = guruData.password;
          const isPasswordValid = storedPassword 
            ? storedPassword === password 
            : (password === '123456' || password === identifier.trim() || password === 'guru123');

          if (isPasswordValid) {
            let targetSekolahId = guruData.sekolahId;
            if (!targetSekolahId) {
              const sekSnap = await getDocs(collection(firestore, COLLECTIONS.SEKOLAH));
              if (!sekSnap.empty) {
                targetSekolahId = sekSnap.docs[0].id;
              }
            }

            // Check if school is blocked or subscription expired
            if (targetSekolahId) {
              const sDoc = await getDoc(doc(firestore, COLLECTIONS.SEKOLAH, targetSekolahId));
              if (sDoc.exists()) {
                const sData = sDoc.data();
                if (sData.status === 'blocked') {
                  Swal.fire({
                    icon: 'error',
                    title: 'Akses Guru Dinonaktifkan',
                    text: 'Akses akun sekolah Anda saat ini dinonaktifkan oleh Superadmin. Silakan hubungi pihak Admin Sekolah.',
                    confirmButtonColor: '#ef4444'
                  });
                  return;
                }
                if (sData.subscriptionPlan !== 'permanen' && sData.expiresAt && sData.expiresAt < Date.now()) {
                  const expiredDate = new Date(sData.expiresAt).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) + ' WIB';
                  Swal.fire({
                    icon: 'warning',
                    title: 'Masa Aktif Sekolah Kedaluwarsa',
                    html: `
                      <div class="text-left text-sm space-y-2">
                        <p>Masa aktif lisensi sekolah Anda telah berakhir pada <b>${expiredDate}</b>.</p>
                        <p class="text-xs text-gray-500">Silakan hubungi Admin Sekolah Anda atau Superadmin untuk melakukan aktivasi perpanjangan masa aktif (Uji Coba, 6 Bulan, 1 Tahun, atau Permanen).</p>
                      </div>
                    `,
                    confirmButtonColor: '#2563eb',
                    confirmButtonText: 'Hubungi WhatsApp',
                    showCancelButton: true,
                    cancelButtonText: 'Tutup'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      window.open('https://wa.me/6285255700081?text=Halo%20Admin%20SIAP%20GURU,%20masa%20aktif%20sekolah%20kami%20telah%20berakhir.%20Mohon%20info%20perpanjangan.', '_blank');
                    }
                  });
                  return;
                }
              }
            }

            onLoginSuccess('guru', guruData.nama, targetSekolahId);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Login Guru Gagal',
              text: 'Password yang dimasukkan salah! (Default: 123456 atau NIP/NIY)',
              confirmButtonColor: '#3b82f6',
              timer: 3000
            });
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Guru Gagal',
            text: 'NIP / NIY Guru tidak ditemukan atau belum didaftarkan oleh Admin Sekolah!',
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
          <div className="flex justify-center mb-4">
            <SiapGuruLogo size="xl" variant="icon" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/70 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-2 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            SIAP GURU (SG)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">Selamat Datang</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">Sistem Informasi Administrasi & Perangkat Guru</p>
        </div>

        <div className="flex border-y border-slate-100 dark:border-slate-700">
          <button
            type="button"
            className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 transition-colors ${role === 'guru' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30' : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400'}`}
            onClick={() => { setRole('guru'); setIdentifier(''); setPassword(''); }}
          >
            <UserCircle size={20} /> Guru
          </button>
          <button
            type="button"
            className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 transition-colors ${role === 'admin' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30' : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400'}`}
            onClick={() => { setRole('admin'); setIdentifier(''); setPassword(''); }}
          >
            <Shield size={20} /> Administrator
          </button>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              {role === 'guru' ? 'NIP / NIY Guru' : 'Email Admin'}
            </label>
            <input 
              type={role === 'guru' ? 'text' : 'email'} 
              required
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all"
              placeholder={role === 'guru' ? 'Masukkan NIP atau NIY' : 'admin@sekolah.com'}
            />
            {role === 'guru' && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
                <span>ℹ️ Berlaku NIP (Sekolah Negeri) atau NIY (Nomor Induk Yayasan untuk Sekolah Swasta)</span>
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-70 transition-all shadow-lg shadow-indigo-600/25 active:scale-[0.99] cursor-pointer"
          >
            {loading ? <span className="animate-spin text-white">⌛</span> : <LogIn size={20} />}
            {loading ? 'Memproses...' : 'Masuk Sistem'}
          </button>
        </form>
      </div>
    </div>
  );
};
