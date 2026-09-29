import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Shield, 
  Plus, 
  Lock, 
  Unlock, 
  Search, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash2, 
  GraduationCap, 
  Eye, 
  X,
  School,
  FileSpreadsheet,
  Clock,
  Calendar,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore, COLLECTIONS, firebaseConfig } from '../lib/firebase';
import Swal from 'sweetalert2';
import { Sekolah, UserAccount, Guru, Siswa, SubscriptionPlan } from '../types';

export const calculateExpiryDate = (
  plan: SubscriptionPlan, 
  customVal: number = 1, 
  customUnit: 'jam' | 'hari' | 'bulan' = 'jam'
): number | null => {
  const now = Date.now();
  switch (plan) {
    case '1_jam':
      return now + (1 * 60 * 60 * 1000); // 1 hour
    case '2_jam':
      return now + (2 * 60 * 60 * 1000); // 2 hours
    case '3_jam':
      return now + (3 * 60 * 60 * 1000); // 3 hours
    case '6_jam':
      return now + (6 * 60 * 60 * 1000); // 6 hours
    case '12_jam':
      return now + (12 * 60 * 60 * 1000); // 12 hours
    case '1_hari':
      return now + (24 * 60 * 60 * 1000); // 24 hours
    case '2_hari':
      return now + (2 * 24 * 60 * 60 * 1000); // 2 days
    case '3_hari':
      return now + (3 * 24 * 60 * 60 * 1000); // 3 days
    case '7_hari':
      return now + (7 * 24 * 60 * 60 * 1000); // 7 days
    case '14_hari':
      return now + (14 * 24 * 60 * 60 * 1000); // 14 days
    case '30_hari':
      return now + (30 * 24 * 60 * 60 * 1000); // 30 days
    case '6_bulan':
      return now + (180 * 24 * 60 * 60 * 1000); // 180 days
    case '1_tahun':
      return now + (365 * 24 * 60 * 60 * 1000); // 365 days
    case 'permanen':
      return null;
    case 'custom': {
      const val = Math.max(1, customVal);
      if (customUnit === 'jam') {
        return now + (val * 60 * 60 * 1000);
      } else if (customUnit === 'bulan') {
        return now + (val * 30 * 24 * 60 * 60 * 1000);
      } else {
        return now + (val * 24 * 60 * 60 * 1000);
      }
    }
    default:
      return null;
  }
};

export const getExpiryPreview = (
  plan: SubscriptionPlan, 
  customVal: number = 1, 
  customUnit: 'jam' | 'hari' | 'bulan' = 'jam'
) => {
  if (plan === 'permanen') {
    return {
      title: '💎 Aktif Permanen (Lifetime)',
      detail: 'Akses seumur hidup selamanya tanpa batas kedaluwarsa.'
    };
  }
  const exp = calculateExpiryDate(plan, customVal, customUnit);
  if (!exp) return { title: '-', detail: '-' };

  const timeStr = new Date(exp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
  const dateStr = new Date(exp).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  let durationText = '';
  if (plan === '1_jam') durationText = '1 Jam (60 Menit)';
  else if (plan === '2_jam') durationText = '2 Jam (120 Menit)';
  else if (plan === '3_jam') durationText = '3 Jam (180 Menit)';
  else if (plan === '6_jam') durationText = '6 Jam';
  else if (plan === '12_jam') durationText = '12 Jam';
  else if (plan === '1_hari') durationText = '1 Hari (24 Jam)';
  else if (plan === '2_hari') durationText = '2 Hari (48 Jam)';
  else if (plan === '3_hari') durationText = '3 Hari (72 Jam)';
  else if (plan === '7_hari') durationText = '7 Hari (1 Minggu)';
  else if (plan === '14_hari') durationText = '14 Hari (2 Minggu)';
  else if (plan === '30_hari') durationText = '30 Hari (1 Bulan)';
  else if (plan === '6_bulan') durationText = '6 Bulan (1 Semester)';
  else if (plan === '1_tahun') durationText = '1 Tahun (1 Tahun Ajaran)';
  else if (plan === 'custom') {
    const u = customUnit === 'jam' ? 'Jam' : customUnit === 'bulan' ? 'Bulan' : 'Hari';
    durationText = `${customVal} ${u}`;
  }

  return {
    title: `Durasi: ${durationText}`,
    detail: `Aktif sampai ${dateStr}, pukul ${timeStr}`
  };
};

export const formatRemainingTime = (expiresAt: number) => {
  const diffMs = expiresAt - Date.now();
  if (diffMs <= 0) return { isExpired: true, text: 'Kedaluwarsa', subText: 'Waktu habis' };

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) {
    return { 
      isExpired: false, 
      text: `Sisa ${diffMinutes} Menit`, 
      subText: `s/d ${new Date(expiresAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
      isUrgent: true 
    };
  } else if (diffHours < 24) {
    const remMin = diffMinutes % 60;
    const hourText = remMin > 0 ? `${diffHours} Jam ${remMin} Menit` : `${diffHours} Jam`;
    return { 
      isExpired: false, 
      text: `Sisa ${hourText}`, 
      subText: `s/d ${new Date(expiresAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
      isUrgent: true 
    };
  } else {
    const dateStr = new Date(expiresAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    return { 
      isExpired: false, 
      text: `Sisa ${diffDays} Hari`, 
      subText: `s/d ${dateStr}`,
      isUrgent: diffDays <= 3 
    };
  }
};

export const DashboardSuperadminView: React.FC = () => {
  const [sekolahList, setSekolahList] = useState<Sekolah[]>([]);
  const [guruList, setGuruList] = useState<Guru[]>([]);
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Add / Edit
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSekolah, setNewSekolah] = useState<{
    nama: string;
    emailAdmin: string;
    passwordAdmin: string;
    subscriptionPlan: SubscriptionPlan;
    customVal: number;
    customUnit: 'jam' | 'hari' | 'bulan';
  }>({ 
    nama: '', 
    emailAdmin: '', 
    passwordAdmin: '',
    subscriptionPlan: '30_hari',
    customVal: 1,
    customUnit: 'jam'
  });
  const [isAdding, setIsAdding] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSekolah, setEditingSekolah] = useState<{id: string, nama: string, emailAdmin: string} | null>(null);

  // Modal Atur Masa Aktif (30 hari, 6 bulan, 1 tahun, permanen, 1 jam, 1 hari, 3 hari, custom)
  const [showMasaAktifModal, setShowMasaAktifModal] = useState(false);
  const [targetSekolahForMasaAktif, setTargetSekolahForMasaAktif] = useState<Sekolah | null>(null);
  const [selectedPlanInModal, setSelectedPlanInModal] = useState<SubscriptionPlan>('1_jam');
  const [modalCustomVal, setModalCustomVal] = useState<number>(1);
  const [modalCustomUnit, setModalCustomUnit] = useState<'jam' | 'hari' | 'bulan'>('jam');
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);

  // Modal Pantau Sekolah (Detail monitoring)
  const [showPantauModal, setShowPantauModal] = useState(false);
  const [pantauSekolah, setPantauSekolah] = useState<Sekolah | null>(null);
  const [pantauTab, setPantauTab] = useState<'guru' | 'siswa'>('guru');
  const [pantauSearch, setPantauSearch] = useState('');

  // Real-time subscriptions for Sekolah, Guru, and Siswa across all schools
  useEffect(() => {
    const unsubSekolah = onSnapshot(collection(firestore, COLLECTIONS.SEKOLAH), (snap) => {
      const data: Sekolah[] = [];
      snap.forEach(d => data.push({ id: d.id, ...d.data() } as Sekolah));
      setSekolahList(data);
      setLoading(false);
    }, (error) => {
      console.error("Error subscribing to sekolah:", error);
      setLoading(false);
    });

    const unsubGuru = onSnapshot(collection(firestore, COLLECTIONS.GURU), (snap) => {
      const data: Guru[] = [];
      snap.forEach(d => data.push({ id: d.id, ...d.data() } as Guru));
      setGuruList(data);
    }, (error) => {
      console.error("Error subscribing to guru:", error);
    });

    const unsubSiswa = onSnapshot(collection(firestore, COLLECTIONS.SISWA), (snap) => {
      const data: Siswa[] = [];
      snap.forEach(d => data.push({ id: d.id, ...d.data() } as Siswa));
      setSiswaList(data);
    }, (error) => {
      console.error("Error subscribing to siswa:", error);
    });

    return () => {
      unsubSekolah();
      unsubGuru();
      unsubSiswa();
    };
  }, []);

  const handleUpdateSekolah = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSekolah) return;
    try {
      await updateDoc(doc(firestore, COLLECTIONS.SEKOLAH, editingSekolah.id), {
        nama: editingSekolah.nama,
        emailAdmin: editingSekolah.emailAdmin.trim().toLowerCase()
      });
      Swal.fire('Berhasil', 'Data sekolah diperbarui', 'success');
      setShowEditModal(false);
      setEditingSekolah(null);
    } catch (error: any) {
      Swal.fire('Error', 'Gagal memperbarui sekolah', 'error');
    }
  };

  const handleDeleteSekolah = async (id: string) => {
    const result = await Swal.fire({
      title: 'Hapus Sekolah?',
      text: "Semua data yang terkait dengan sekolah ini mungkin harus dihapus manual. Lanjutkan?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!'
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(firestore, COLLECTIONS.SEKOLAH, id));
        Swal.fire('Terhapus!', 'Sekolah telah dihapus.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Gagal menghapus sekolah', 'error');
      }
    }
  };

  const handleAddSekolah = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSekolah.nama || !newSekolah.emailAdmin || !newSekolah.passwordAdmin) {
      Swal.fire('Error', 'Harap isi semua kolom', 'error');
      return;
    }
    setIsAdding(true);
    try {
      const newId = 'sekolah_' + Date.now();
      
      // Create Firebase Auth user using REST API to prevent logging out current superadmin
      const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newSekolah.emailAdmin.trim().toLowerCase(),
          password: newSekolah.passwordAdmin,
          returnSecureToken: true
        })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Gagal membuat akun Admin');
      }
      
      const adminUid = data.localId;
      const initialExpiresAt = calculateExpiryDate(
        newSekolah.subscriptionPlan,
        newSekolah.customVal,
        newSekolah.customUnit
      );

      // Add Sekolah
      const schoolDocData: any = {
        nama: newSekolah.nama,
        emailAdmin: newSekolah.emailAdmin.trim().toLowerCase(),
        status: 'active',
        subscriptionPlan: newSekolah.subscriptionPlan,
        activatedAt: Date.now(),
        expiresAt: initialExpiresAt,
        createdAt: Date.now()
      };

      if (newSekolah.subscriptionPlan === 'custom') {
        schoolDocData.customDurationValue = newSekolah.customVal;
        schoolDocData.customDurationUnit = newSekolah.customUnit;
      }

      await setDoc(doc(firestore, COLLECTIONS.SEKOLAH, newId), schoolDocData);

      // Add Admin document
      await setDoc(doc(firestore, COLLECTIONS.USERS, adminUid), {
        email: newSekolah.emailAdmin.trim().toLowerCase(),
        role: 'admin_sekolah',
        sekolahId: newId,
        updatedAt: Date.now()
      });

      Swal.fire('Berhasil', 'Sekolah dan Admin berhasil ditambahkan', 'success');
      setShowAddModal(false);
      setNewSekolah({ 
        nama: '', 
        emailAdmin: '', 
        passwordAdmin: '', 
        subscriptionPlan: '30_hari',
        customVal: 1,
        customUnit: 'jam'
      });
    } catch (error: any) {
      Swal.fire('Error', error.message || 'Gagal menambahkan sekolah', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  const handleSetMasaAktif = async (
    sekolahId: string, 
    plan: SubscriptionPlan,
    customVal?: number,
    customUnit?: 'jam' | 'hari' | 'bulan'
  ) => {
    setIsUpdatingPlan(true);
    try {
      const expiresAt = calculateExpiryDate(plan, customVal, customUnit);
      const updateData: any = {
        subscriptionPlan: plan,
        expiresAt: expiresAt,
        activatedAt: Date.now(),
        status: 'active',
        updatedAt: Date.now()
      };

      if (plan === 'custom') {
        updateData.customDurationValue = customVal || 1;
        updateData.customDurationUnit = customUnit || 'jam';
      }

      await updateDoc(doc(firestore, COLLECTIONS.SEKOLAH, sekolahId), updateData);

      let textLabel = '';
      if (plan === 'custom') {
        const uLabel = customUnit === 'jam' ? 'Jam' : customUnit === 'bulan' ? 'Bulan' : 'Hari';
        textLabel = `Uji Coba Custom (${customVal || 1} ${uLabel})`;
      } else {
        const labels: Record<string, string> = {
          '1_jam': 'Uji Coba 1 Jam (60 Menit)',
          '2_jam': 'Uji Coba 2 Jam',
          '3_jam': 'Uji Coba 3 Jam',
          '6_jam': 'Uji Coba 6 Jam',
          '12_jam': 'Uji Coba 12 Jam',
          '1_hari': 'Uji Coba 1 Hari (24 Jam)',
          '2_hari': 'Uji Coba 2 Hari (48 Jam)',
          '3_hari': 'Uji Coba 3 Hari (72 Jam)',
          '7_hari': 'Uji Coba 7 Hari (1 Minggu)',
          '14_hari': 'Uji Coba 14 Hari (2 Minggu)',
          '30_hari': 'Uji Coba 30 Hari (1 Bulan)',
          '6_bulan': 'Masa Aktif 6 Bulan (1 Semester)',
          '1_tahun': 'Masa Aktif 1 Tahun (1 Tahun Ajaran)',
          'permanen': 'Aktif Permanen (Lifetime)'
        };
        textLabel = labels[plan] || plan;
      }

      Swal.fire({
        icon: 'success',
        title: 'Masa Aktif Berhasil Diatur',
        text: `Sekolah berhasil diaktifkan dengan paket: ${textLabel}`,
        timer: 2000,
        showConfirmButton: false
      });
      setShowMasaAktifModal(false);
      setTargetSekolahForMasaAktif(null);
    } catch (error: any) {
      Swal.fire('Error', 'Gagal memperbarui masa aktif: ' + error.message, 'error');
    } finally {
      setIsUpdatingPlan(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    try {
      await updateDoc(doc(firestore, COLLECTIONS.SEKOLAH, id), { status: newStatus });
      Swal.fire('Berhasil', 'Status sekolah diperbarui', 'success');
    } catch (error) {
      Swal.fire('Error', 'Gagal memperbarui status', 'error');
    }
  };

  // Helper counters per school
  const getSchoolGuru = (schId: string) => {
    return guruList.filter(g => g.sekolahId === schId);
  };

  const getSchoolSiswa = (schId: string) => {
    return siswaList.filter(s => s.sekolahId === schId);
  };

  // Filtered schools
  const filteredSekolah = sekolahList.filter(s => 
    s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ((s as any).emailAdmin || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Monitoring modal data
  const currentPantauGuru = pantauSekolah ? getSchoolGuru(pantauSekolah.id).filter(g => 
    g.nama.toLowerCase().includes(pantauSearch.toLowerCase()) ||
    g.nip.toLowerCase().includes(pantauSearch.toLowerCase())
  ) : [];

  const currentPantauSiswa = pantauSekolah ? getSchoolSiswa(pantauSekolah.id).filter(s => 
    s.nama.toLowerCase().includes(pantauSearch.toLowerCase()) ||
    s.nisn.toLowerCase().includes(pantauSearch.toLowerCase()) ||
    s.kelas.toLowerCase().includes(pantauSearch.toLowerCase())
  ) : [];

  if (loading) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Memuat data monitoring sekolah...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Dashboard Monitoring Superadmin
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Pantau seluruh data sekolah terdaftar, statistik guru dan siswa masuk secara real-time.
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl shadow-md shadow-indigo-600/25 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Plus size={18} /> Tambah Sekolah
        </button>
      </div>

      {/* Metric Cards - 4 Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sekolah */}
        <div className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 flex items-center space-x-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl border border-purple-200/70 dark:border-purple-800/60">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Sekolah</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{sekolahList.length}</h3>
          </div>
        </div>

        {/* Total Guru Masuk */}
        <div className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-200/70 dark:border-blue-800/60">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Guru Masuk</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{guruList.length}</h3>
          </div>
        </div>

        {/* Total Siswa Masuk */}
        <div className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-200/70 dark:border-indigo-800/60">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Siswa Masuk</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{siswaList.length}</h3>
          </div>
        </div>

        {/* Sekolah Aktif */}
        <div className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-200/70 dark:border-emerald-800/60">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Sekolah Aktif</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {sekolahList.filter(s => s.status === 'active').length}
            </h3>
          </div>
        </div>
      </div>

      {/* Monitoring Table Container */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-700/80 overflow-hidden">
        {/* Table Header & Search */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50/75 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Daftar Sekolah & Pemantauan Data</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Pantau jumlah guru dan siswa yang telah terdaftar di setiap sekolah</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Cari nama, email, atau ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 font-bold">Nama Sekolah</th>
                <th className="p-4 font-bold">Admin Email</th>
                <th className="p-4 font-bold">ID Sekolah</th>
                <th className="p-4 font-bold text-center">Kategori &amp; Masa Aktif</th>
                <th className="p-4 font-bold text-center">Jumlah Guru</th>
                <th className="p-4 font-bold text-center">Jumlah Siswa</th>
                <th className="p-4 font-bold text-center">Status</th>
                <th className="p-4 font-bold text-right">Aksi &amp; Pantau</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredSekolah.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    {searchQuery ? 'Tidak ada sekolah yang cocok dengan pencarian.' : 'Belum ada data sekolah terdaftar.'}
                  </td>
                </tr>
              ) : (
                filteredSekolah.map(sekolah => {
                  const teachers = getSchoolGuru(sekolah.id);
                  const students = getSchoolSiswa(sekolah.id);

                  return (
                    <tr key={sekolah.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/20 transition-colors">
                      <td className="p-4 font-semibold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <School className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <span>{sekolah.nama}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300 text-sm">
                        {(sekolah as any).emailAdmin || "-"}
                      </td>
                      <td className="p-4 text-slate-500 font-mono text-xs">
                        <span className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-md border border-slate-200/80 dark:border-slate-800">
                          {sekolah.id}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {(() => {
                          const plan = sekolah.subscriptionPlan || '30_hari';
                          if (plan === 'permanen') {
                            return (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full text-xs font-bold border border-emerald-300 dark:border-emerald-800 shadow-2xs">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                Aktif Permanen
                              </span>
                            );
                          }

                          const expires = sekolah.expiresAt;
                          if (!expires) {
                            return (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 rounded-full text-xs font-medium border border-blue-200">
                                <Clock className="w-3 h-3 text-blue-500" />
                                30 Hari
                              </span>
                            );
                          }

                          const timeInfo = formatRemainingTime(expires);

                          if (timeInfo.isExpired) {
                            return (
                              <div className="flex flex-col items-center">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 rounded-full text-xs font-bold border border-rose-300 shadow-2xs">
                                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                                  Kedaluwarsa
                                </span>
                                <span className="text-[10px] text-slate-400 mt-0.5">{timeInfo.subText}</span>
                              </div>
                            );
                          }

                          let planName = '30 Hari';
                          if (plan === 'custom') {
                            const u = sekolah.customDurationUnit === 'jam' ? 'Jam' : sekolah.customDurationUnit === 'bulan' ? 'Bulan' : 'Hari';
                            planName = `${sekolah.customDurationValue || 1} ${u}`;
                          } else if (plan === '1_jam') {
                            planName = '1 Jam';
                          } else if (plan === '2_jam') {
                            planName = '2 Jam';
                          } else if (plan === '3_jam') {
                            planName = '3 Jam';
                          } else if (plan === '6_jam') {
                            planName = '6 Jam';
                          } else if (plan === '12_jam') {
                            planName = '12 Jam';
                          } else if (plan === '1_hari') {
                            planName = '1 Hari';
                          } else if (plan === '2_hari') {
                            planName = '2 Hari';
                          } else if (plan === '3_hari') {
                            planName = '3 Hari';
                          } else if (plan === '7_hari') {
                            planName = '7 Hari';
                          } else if (plan === '14_hari') {
                            planName = '14 Hari';
                          } else if (plan === '6_bulan') {
                            planName = '6 Bulan';
                          } else if (plan === '1_tahun') {
                            planName = '1 Tahun';
                          }

                          const badgeColor = timeInfo.isUrgent 
                            ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300' 
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300';

                          return (
                            <div className="flex flex-col items-center">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeColor} shadow-2xs`}>
                                <Clock className="w-3 h-3" />
                                {planName} • {timeInfo.text}
                              </span>
                              <span className="text-[10px] text-slate-400 mt-0.5">{timeInfo.subText}</span>
                            </div>
                          );
                        })()}
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold rounded-lg text-xs border border-blue-200/70 dark:border-blue-800/60 shadow-2xs">
                          <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          {teachers.length} Guru
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold rounded-lg text-xs border border-indigo-200/70 dark:border-indigo-800/60 shadow-2xs">
                          <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          {students.length} Siswa
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${sekolah.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'}`}>
                          {sekolah.status === 'active' ? 'Aktif' : 'Diblokir'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Pantau Detail Button */}
                          <button 
                            onClick={() => {
                              setPantauSekolah(sekolah);
                              setPantauTab('guru');
                              setPantauSearch('');
                              setShowPantauModal(true);
                            }}
                            className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors cursor-pointer"
                            title="Pantau Data Guru & Siswa Sekolah Ini"
                          >
                            <Eye size={18} />
                          </button>

                          {/* Atur Masa Aktif Button */}
                          <button 
                            onClick={() => {
                              setTargetSekolahForMasaAktif(sekolah);
                              setSelectedPlanInModal(sekolah.subscriptionPlan || '1_jam');
                              setModalCustomVal(sekolah.customDurationValue || 1);
                              setModalCustomUnit(sekolah.customDurationUnit || 'jam');
                              setShowMasaAktifModal(true);
                            }}
                            className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors cursor-pointer"
                            title="Atur Kategori & Masa Aktif (Tombol Turun: 1 Jam, 1 Hari, 3 Hari, dll)"
                          >
                            <Clock size={18} />
                          </button>

                          {/* Edit Button */}
                          <button 
                            onClick={() => {
                              setEditingSekolah({
                                id: sekolah.id, 
                                nama: sekolah.nama, 
                                emailAdmin: (sekolah as any).emailAdmin || ''
                              });
                              setShowEditModal(true);
                            }}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors cursor-pointer"
                            title="Edit Sekolah"
                          >
                            <Edit size={18} />
                          </button>

                          {/* Block/Unblock Button */}
                          <button 
                            onClick={() => toggleStatus(sekolah.id, sekolah.status)}
                            className={`p-2 rounded-lg transition-colors cursor-pointer ${sekolah.status === 'active' ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/60' : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60'}`}
                            title={sekolah.status === 'active' ? 'Blokir Sekolah' : 'Aktifkan Sekolah'}
                          >
                            {sekolah.status === 'active' ? <Lock size={18} /> : <Unlock size={18} />}
                          </button>

                          {/* Delete Button */}
                          <button 
                            onClick={() => handleDeleteSekolah(sekolah.id)}
                            className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
                            title="Hapus Sekolah"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PANTAU SEKOLAH MODAL (DETAIL MONITORING GURU & SISWA) */}
      {showPantauModal && pantauSekolah && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold shadow-md shadow-indigo-600/20">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {pantauSekolah.nama}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ID: <span className="font-mono">{pantauSekolah.id}</span> • Admin: {(pantauSekolah as any).emailAdmin || '-'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowPantauModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Quick Counters & Tabs */}
            <div className="p-6 pb-0 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => { setPantauTab('guru'); setPantauSearch(''); }}
                  className={`p-4 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer ${pantauTab === 'guru' ? 'bg-blue-50 border-blue-300 dark:bg-blue-950/50 dark:border-blue-700 ring-2 ring-blue-500' : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 hover:bg-slate-100'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 rounded-xl">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Data Guru Terdaftar</p>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white">{getSchoolGuru(pantauSekolah.id).length} Guru</h4>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => { setPantauTab('siswa'); setPantauSearch(''); }}
                  className={`p-4 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer ${pantauTab === 'siswa' ? 'bg-indigo-50 border-indigo-300 dark:bg-indigo-950/50 dark:border-indigo-700 ring-2 ring-indigo-500' : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 hover:bg-slate-100'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 rounded-xl">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Data Siswa Terdaftar</p>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white">{getSchoolSiswa(pantauSekolah.id).length} Siswa</h4>
                    </div>
                  </div>
                </button>
              </div>

              {/* Search in modal */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder={pantauTab === 'guru' ? "Cari nama atau NIP/NIY guru..." : "Cari nama, kelas, atau NISN siswa..."}
                  value={pantauSearch}
                  onChange={(e) => setPantauSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            {/* List Table */}
            <div className="p-6 flex-1 overflow-y-auto max-h-[350px]">
              {pantauTab === 'guru' ? (
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 text-xs uppercase font-bold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-3 w-14 text-center">No</th>
                        <th className="p-3">NIP / NIY</th>
                        <th className="p-3">Nama Lengkap</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {currentPantauGuru.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="p-6 text-center text-slate-500">
                            {pantauSearch ? 'Tidak ada guru yang cocok dengan pencarian.' : 'Belum ada data guru yang diimpor di sekolah ini.'}
                          </td>
                        </tr>
                      ) : (
                        currentPantauGuru.map((guru, idx) => (
                          <tr key={guru.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                            <td className="p-3 text-center text-slate-400 text-xs">{idx + 1}</td>
                            <td className="p-3 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">{guru.nip}</td>
                            <td className="p-3 font-medium text-slate-900 dark:text-white">{guru.nama}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 text-xs uppercase font-bold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-3 w-14 text-center">No</th>
                        <th className="p-3">NISN</th>
                        <th className="p-3">Nama Siswa</th>
                        <th className="p-3">Kelas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {currentPantauSiswa.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-6 text-center text-slate-500">
                            {pantauSearch ? 'Tidak ada siswa yang cocok dengan pencarian.' : 'Belum ada data siswa yang diimpor di sekolah ini.'}
                          </td>
                        </tr>
                      ) : (
                        currentPantauSiswa.map((siswa, idx) => (
                          <tr key={siswa.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                            <td className="p-3 text-center text-slate-400 text-xs">{idx + 1}</td>
                            <td className="p-3 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">{siswa.nisn}</td>
                            <td className="p-3 font-medium text-slate-900 dark:text-white">{siswa.nama}</td>
                            <td className="p-3 font-semibold text-indigo-600 dark:text-indigo-400 text-xs">{siswa.kelas}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPantauModal(false)}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-semibold rounded-xl text-sm transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Tambah Sekolah Baru</h3>
            </div>
            <form onSubmit={handleAddSekolah} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Sekolah</label>
                <input 
                  type="text" required
                  value={newSekolah.nama} onChange={e => setNewSekolah({...newSekolah, nama: e.target.value})}
                  className="w-full px-4 py-2 border rounded-xl" placeholder="Contoh: SMAN 1 Jakarta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Admin Sekolah</label>
                <input 
                  type="email" required
                  value={newSekolah.emailAdmin} onChange={e => setNewSekolah({...newSekolah, emailAdmin: e.target.value})}
                  className="w-full px-4 py-2 border rounded-xl" placeholder="admin@sekolah.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password Admin</label>
                <input 
                  type="password" required
                  value={newSekolah.passwordAdmin} onChange={e => setNewSekolah({...newSekolah, passwordAdmin: e.target.value})}
                  className="w-full px-4 py-2 border rounded-xl" placeholder="Minimal 6 karakter"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kategori Masa Aktif Awal (Tombol Turun)</label>
                <select
                  value={newSekolah.subscriptionPlan}
                  onChange={e => setNewSekolah({...newSekolah, subscriptionPlan: e.target.value as SubscriptionPlan})}
                  className="w-full px-4 py-2 border rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                >
                  <optgroup label="⚡ Uji Coba Cepat (Jam)">
                    <option value="1_jam">⚡ Uji Coba 1 Jam (60 Menit Demo Cepat)</option>
                    <option value="2_jam">⚡ Uji Coba 2 Jam (120 Menit)</option>
                    <option value="3_jam">⚡ Uji Coba 3 Jam (180 Menit)</option>
                    <option value="6_jam">⚡ Uji Coba 6 Jam</option>
                    <option value="12_jam">⚡ Uji Coba 12 Jam</option>
                  </optgroup>
                  <optgroup label="⏱️ Uji Coba Harian">
                    <option value="1_hari">⏱️ Uji Coba 1 Hari (24 Jam)</option>
                    <option value="2_hari">⏱️ Uji Coba 2 Hari (48 Jam)</option>
                    <option value="3_hari">⏱️ Uji Coba 3 Hari (72 Jam Evaluasi)</option>
                    <option value="7_hari">⏱️ Uji Coba 7 Hari (1 Minggu)</option>
                    <option value="14_hari">⏱️ Uji Coba 14 Hari (2 Minggu)</option>
                  </optgroup>
                  <optgroup label="📅 Paket Standar &amp; Permanen">
                    <option value="30_hari">📅 Uji Coba 30 Hari (1 Bulan) - Default</option>
                    <option value="6_bulan">📆 Masa Aktif 6 Bulan (1 Semester)</option>
                    <option value="1_tahun">🗓️ Masa Aktif 1 Tahun (1 Tahun Ajaran)</option>
                    <option value="permanen">💎 Aktif Permanen (Lifetime)</option>
                  </optgroup>
                  <optgroup label="⚙️ Custom">
                    <option value="custom">⚙️ Custom (Atur Angka &amp; Satuan Jam/Hari/Bulan)</option>
                  </optgroup>
                </select>

                {newSekolah.subscriptionPlan === 'custom' && (
                  <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                    <div className="w-24">
                      <label className="block text-[11px] text-slate-500 mb-0.5">Jumlah</label>
                      <input 
                        type="number" min="1" max="999"
                        value={newSekolah.customVal}
                        onChange={e => setNewSekolah({...newSekolah, customVal: parseInt(e.target.value) || 1})}
                        className="w-full px-3 py-1.5 border rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[11px] text-slate-500 mb-0.5">Pilihan Satuan (Tombol Turun)</label>
                      <select
                        value={newSekolah.customUnit}
                        onChange={e => setNewSekolah({...newSekolah, customUnit: e.target.value as any})}
                        className="w-full px-3 py-1.5 border rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="jam">Jam (Misal: 1 jam, 2 jam, 6 jam)</option>
                        <option value="hari">Hari (Misal: 1 hari, 3 hari, 14 hari)</option>
                        <option value="bulan">Bulan (Misal: 1 bulan, 3 bulan)</option>
                      </select>
                    </div>
                  </div>
                )}
                <p className="text-[11px] text-slate-400 mt-1">Dapat diubah atau diperpanjang kapan saja oleh Superadmin.</p>
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer">Batal</button>
                <button type="submit" disabled={isAdding} className="px-4 py-2 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 font-medium disabled:opacity-50 cursor-pointer">
                  {isAdding ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ATUR MASA AKTIF DENGAN PILIHAN CUSTOM & 1 JAM */}
      {showMasaAktifModal && targetSekolahForMasaAktif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold shadow-md shadow-indigo-600/20">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Atur Masa Aktif Sekolah</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{targetSekolahForMasaAktif.nama}</p>
                </div>
              </div>
              <button 
                onClick={() => { setShowMasaAktifModal(false); setTargetSekolahForMasaAktif(null); }}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* BAGIAN UTAMA: PILIHAN DARI TOMBOL TURUN (DROPDOWN) */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50/70 to-slate-50 dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 border-2 border-indigo-200 dark:border-indigo-800 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Pilih Masa Aktif dari Tombol Turun (Dropdown)</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 text-[10px] font-bold">
                    Paling Mudah &amp; Cepat
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3.5 leading-relaxed">
                  Pilih durasi langsung dari <strong>tombol turun</strong> di bawah ini (misalnya <strong>1 jam</strong> untuk demo singkat, <strong>1 hari</strong>, <strong>3 hari</strong>, atau tentukan angka sendiri):
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Pilihan Durasi Masa Aktif / Uji Coba:</span>
                      <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-normal">Klik tombol turun untuk memilih</span>
                    </label>
                    <select
                      value={selectedPlanInModal}
                      onChange={(e) => setSelectedPlanInModal(e.target.value as SubscriptionPlan)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border-2 border-indigo-300 dark:border-indigo-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-sm cursor-pointer"
                    >
                      <optgroup label="⚡ Uji Coba Jam (Demo Singkat)">
                        <option value="1_jam">⚡ Uji Coba 1 Jam (60 Menit Demo Singkat)</option>
                        <option value="2_jam">⚡ Uji Coba 2 Jam (120 Menit)</option>
                        <option value="3_jam">⚡ Uji Coba 3 Jam (180 Menit)</option>
                        <option value="6_jam">⚡ Uji Coba 6 Jam</option>
                        <option value="12_jam">⚡ Uji Coba 12 Jam</option>
                      </optgroup>
                      <optgroup label="⏱️ Uji Coba Harian">
                        <option value="1_hari">⏱️ Uji Coba 1 Hari (24 Jam Penuh)</option>
                        <option value="2_hari">⏱️ Uji Coba 2 Hari (48 Jam)</option>
                        <option value="3_hari">⏱️ Uji Coba 3 Hari (72 Jam Evaluasi)</option>
                        <option value="7_hari">⏱️ Uji Coba 7 Hari (1 Minggu)</option>
                        <option value="14_hari">⏱️ Uji Coba 14 Hari (2 Minggu)</option>
                      </optgroup>
                      <optgroup label="📅 Paket Standar Resmi &amp; Permanen">
                        <option value="30_hari">📅 Uji Coba 30 Hari (1 Bulan Penuh)</option>
                        <option value="6_bulan">📆 Masa Aktif 6 Bulan (1 Semester)</option>
                        <option value="1_tahun">🗓️ Masa Aktif 1 Tahun (1 Tahun Ajaran)</option>
                        <option value="permanen">💎 Aktif Permanen (Lifetime / Selamanya)</option>
                      </optgroup>
                      <optgroup label="⚙️ Pilihan Kustom (Isi Sendiri)">
                        <option value="custom">⚙️ Kustom Durasi Sendiri (Isi Angka &amp; Satuan Jam/Hari/Bulan)</option>
                      </optgroup>
                    </select>
                  </div>

                  {/* JIKA MEMILIH KUSTOM DURASI */}
                  {selectedPlanInModal === 'custom' && (
                    <div className="p-3.5 bg-white/90 dark:bg-slate-800/90 rounded-xl border border-indigo-200 dark:border-indigo-800 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-150">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Jumlah Angka</label>
                        <input 
                          type="number" 
                          min="1" 
                          max="999"
                          value={modalCustomVal} 
                          onChange={e => setModalCustomVal(parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                          placeholder="Misal: 1"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Satuan Waktu (Tombol Turun)</label>
                        <select
                          value={modalCustomUnit}
                          onChange={e => setModalCustomUnit(e.target.value as any)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                          <option value="jam">Jam (Uji Coba Jam)</option>
                          <option value="hari">Hari (Uji Coba Hari)</option>
                          <option value="bulan">Bulan</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* KOTAK PRATINJAU LANGSUNG */}
                  {(() => {
                    const preview = getExpiryPreview(selectedPlanInModal, modalCustomVal, modalCustomUnit);
                    return (
                      <div className="p-3 bg-indigo-100/70 dark:bg-indigo-950/50 rounded-xl border border-indigo-200 dark:border-indigo-800 flex items-start gap-2.5">
                        <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <p className="font-bold text-indigo-950 dark:text-indigo-200">{preview.title}</p>
                          <p className="text-indigo-800 dark:text-indigo-300 mt-0.5 font-medium">{preview.detail}</p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* TOMBOL UTAMA SIMPAN & TERAPKAN */}
                  <button
                    disabled={isUpdatingPlan}
                    onClick={() => handleSetMasaAktif(
                      targetSekolahForMasaAktif.id, 
                      selectedPlanInModal, 
                      modalCustomVal, 
                      modalCustomUnit
                    )}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold rounded-xl text-sm shadow-md shadow-indigo-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isUpdatingPlan ? 'Menerapkan...' : 'Simpan & Terapkan Durasi Ini'}</span>
                  </button>
                </div>
              </div>

              {/* BAGIAN 2: PRESET CEPAT UJI COBA (PINTASAN 1-KLIK) */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                  Preset Cepat 1-Klik Uji Coba
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* Preset 1 Jam */}
                  <button
                    disabled={isUpdatingPlan}
                    onClick={() => handleSetMasaAktif(targetSekolahForMasaAktif.id, '1_jam')}
                    className="p-3 rounded-xl border border-amber-300/80 bg-amber-50/60 hover:bg-amber-100 dark:bg-amber-950/20 dark:border-amber-800 hover:scale-[1.02] transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-extrabold text-xs mb-1">
                      <span>⚡ 1 Jam</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">Uji coba cepat 60 menit</p>
                  </button>

                  {/* Preset 1 Hari */}
                  <button
                    disabled={isUpdatingPlan}
                    onClick={() => handleSetMasaAktif(targetSekolahForMasaAktif.id, '1_hari')}
                    className="p-3 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 dark:bg-blue-950/20 dark:border-blue-800 hover:scale-[1.02] transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-1 text-blue-700 dark:text-blue-400 font-extrabold text-xs mb-1">
                      <span>⏱️ 1 Hari</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">24 Jam aktif</p>
                  </button>

                  {/* Preset 3 Hari */}
                  <button
                    disabled={isUpdatingPlan}
                    onClick={() => handleSetMasaAktif(targetSekolahForMasaAktif.id, '3_hari')}
                    className="p-3 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-800 hover:scale-[1.02] transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-1 text-indigo-700 dark:text-indigo-400 font-extrabold text-xs mb-1">
                      <span>⏱️ 3 Hari</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">72 Jam evaluasi</p>
                  </button>

                  {/* Preset 7 Hari */}
                  <button
                    disabled={isUpdatingPlan}
                    onClick={() => handleSetMasaAktif(targetSekolahForMasaAktif.id, '7_hari')}
                    className="p-3 rounded-xl border border-cyan-200 bg-cyan-50/60 hover:bg-cyan-100 dark:bg-cyan-950/20 dark:border-cyan-800 hover:scale-[1.02] transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-1 text-cyan-700 dark:text-cyan-400 font-extrabold text-xs mb-1">
                      <span>⏱️ 7 Hari</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">1 Minggu penuh</p>
                  </button>
                </div>
              </div>

              {/* BAGIAN 3: KATEGORI STANDAR RESMI */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                  Paket Standar &amp; Permanen
                </h4>
                <div className="space-y-2.5">
                  {/* 30 Hari */}
                  <button
                    disabled={isUpdatingPlan}
                    onClick={() => handleSetMasaAktif(targetSekolahForMasaAktif.id, '30_hari')}
                    className="w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs">Uji Coba 30 Hari (1 Bulan)</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Aktif selama 30 hari ke depan.</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </button>

                  {/* 6 Bulan */}
                  <button
                    disabled={isUpdatingPlan}
                    onClick={() => handleSetMasaAktif(targetSekolahForMasaAktif.id, '6_bulan')}
                    className="w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs">Masa Aktif 6 Bulan (1 Semester)</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Aktif 180 hari (1 semester ajaran).</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </button>

                  {/* 1 Tahun */}
                  <button
                    disabled={isUpdatingPlan}
                    onClick={() => handleSetMasaAktif(targetSekolahForMasaAktif.id, '1_tahun')}
                    className="w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs">Masa Aktif 1 Tahun (1 Tahun Ajaran)</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Aktif 365 hari (1 tahun ajaran kalender pendidikan).</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </button>

                  {/* Aktif Permanen */}
                  <button
                    disabled={isUpdatingPlan}
                    onClick={() => handleSetMasaAktif(targetSekolahForMasaAktif.id, 'permanen')}
                    className="w-full text-left p-3.5 rounded-xl border-2 border-emerald-500/70 hover:border-emerald-600 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 transition-all flex items-center justify-between group cursor-pointer bg-emerald-50/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-slate-900 dark:text-white text-xs">Aktif Permanen (Lifetime)</h4>
                          <span className="text-[10px] px-2 py-0.2 bg-emerald-600 text-white rounded-full font-extrabold uppercase">Selamanya</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Akses seumur hidup tanpa batas kedaluwarsa.</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
              <button
                type="button"
                onClick={() => { setShowMasaAktifModal(false); setTargetSekolahForMasaAktif(null); }}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-semibold rounded-xl text-sm transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && editingSekolah && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edit Sekolah</h3>
            </div>
            <form onSubmit={handleUpdateSekolah} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Sekolah</label>
                <input 
                  type="text" required
                  value={editingSekolah.nama} onChange={e => setEditingSekolah({...editingSekolah, nama: e.target.value})}
                  className="w-full px-4 py-2 border rounded-xl" placeholder="Contoh: SMAN 1 Jakarta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Admin Sekolah</label>
                <input 
                  type="email" required
                  value={editingSekolah.emailAdmin} onChange={e => setEditingSekolah({...editingSekolah, emailAdmin: e.target.value})}
                  className="w-full px-4 py-2 border rounded-xl" placeholder="admin@sekolah.com"
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer">Batal</button>
                <button type="submit" className="px-4 py-2 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 font-medium cursor-pointer">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};