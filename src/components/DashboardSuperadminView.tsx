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
  FileSpreadsheet
} from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore, COLLECTIONS, firebaseConfig } from '../lib/firebase';
import Swal from 'sweetalert2';
import { Sekolah, UserAccount, Guru, Siswa } from '../types';

export const DashboardSuperadminView: React.FC = () => {
  const [sekolahList, setSekolahList] = useState<Sekolah[]>([]);
  const [guruList, setGuruList] = useState<Guru[]>([]);
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Add / Edit
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSekolah, setNewSekolah] = useState({ nama: '', emailAdmin: '', passwordAdmin: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSekolah, setEditingSekolah] = useState<{id: string, nama: string, emailAdmin: string} | null>(null);

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

      // Add Sekolah
      await setDoc(doc(firestore, COLLECTIONS.SEKOLAH, newId), {
        nama: newSekolah.nama,
        emailAdmin: newSekolah.emailAdmin.trim().toLowerCase(),
        status: 'active',
        createdAt: Date.now()
      });

      // Add Admin document
      await setDoc(doc(firestore, COLLECTIONS.USERS, adminUid), {
        email: newSekolah.emailAdmin.trim().toLowerCase(),
        role: 'admin_sekolah',
        sekolahId: newId,
        updatedAt: Date.now()
      });

      Swal.fire('Berhasil', 'Sekolah dan Admin berhasil ditambahkan', 'success');
      setShowAddModal(false);
      setNewSekolah({ nama: '', emailAdmin: '', passwordAdmin: '' });
    } catch (error: any) {
      Swal.fire('Error', error.message || 'Gagal menambahkan sekolah', 'error');
    } finally {
      setIsAdding(false);
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
                <th className="p-4 font-bold text-center">Jumlah Guru</th>
                <th className="p-4 font-bold text-center">Jumlah Siswa</th>
                <th className="p-4 font-bold text-center">Status</th>
                <th className="p-4 font-bold text-right">Aksi & Pantau</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredSekolah.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
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
                  placeholder={pantauTab === 'guru' ? "Cari nama atau NIP guru..." : "Cari nama, kelas, atau NISN siswa..."}
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
                        <th className="p-3">NIP</th>
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