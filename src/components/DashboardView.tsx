import React from "react";
import {
  Users,
  School,
  BookOpen,
  ClipboardCheck,
  Wand2,
  Calendar,
  Star,
  TrendingUp,
  Presentation,
  BookMarked,
  HeartHandshake,
  Bot,
  FileText,
  Settings,
  ArrowRight,
  Sparkles,
  LayoutGrid,
  Library,
  FileSignature,
  Briefcase,
  Clock,
  Shield
} from "lucide-react";
import { Sekolah, Siswa, Guru, Mapel, LogAbsensi, DataNilai, Jadwal } from "../types";

interface DashboardViewProps {
  userRole?: "superadmin" | "admin_sekolah" | "guru" | string | null;
  sekolahId?: string;
  sekolahData?: Sekolah | null;
  userName?: string;
  siswaList: Siswa[];
  guruList?: Guru[];
  mapelList: Mapel[];
  absensiList: LogAbsensi[];
  nilaiList: DataNilai[];
  jadwalList: Jadwal[];
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userRole,
  sekolahId,
  sekolahData,
  userName,
  siswaList,
  guruList = [],
  mapelList,
  absensiList,
  nilaiList,
  jadwalList,
  onNavigate
}) => {
  // Stats Calculation
  const today = new Date().toISOString().slice(0, 10);
  const todaysAttendance = absensiList.filter((a) => a.tanggal === today);
  const hadirCount = todaysAttendance.filter((a) => a.status === "hadir" || a.status === "Hadir").length;
  
  // Total Siswa Aktif: includes all imported students (excluding explicitly non-aktif if any)
  const totalSiswaAktif = siswaList.filter((s: any) => s.status !== "non-aktif" && s.status !== "alumni").length;
  const totalGuruAktif = guruList.length;
  const attendanceRate = totalSiswaAktif > 0 ? Math.round((hadirCount / totalSiswaAktif) * 100) : 0;

  // Chart Data Preparation (Last 5 Days)
  const last5Days = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (4 - i));
    return d.toISOString().slice(0, 10);
  });

  const chartData = last5Days.map((date) => {
    const dayRecords = absensiList.filter((a) => a.tanggal === date);
    const hadir = dayRecords.filter((a) => a.status === "hadir").length;
    return {
      date: date.slice(5),
      pct: dayRecords.length > 0 ? Math.round((hadir / dayRecords.length) * 100) : 0
    };
  });

  // Calculate Average Grade per Mapel
  const subjectAverages = mapelList.map((m) => {
    const grades = nilaiList.filter((n) => n.mapel === m.namaMapel && n.nilai !== "" && typeof n.nilai === "number");
    if (grades.length === 0) return { name: m.namaMapel, avg: 0, count: 0 };
    const sum = grades.reduce((acc, curr) => acc + (curr.nilai as number), 0);
    return {
      name: m.namaMapel,
      avg: Math.round(sum / grades.length),
      count: grades.length
    };
  });

  // Full Menu Cards List matching all sidebar destinations
  const menuCards = [
    {
      id: "siswa",
      title: "Kelola Master Siswa",
      desc: "Olah data seluruh siswa, NISN, import Excel, edit & hapus data.",
      icon: Users,
      badge: "Master Data",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200"
    },
    {
      id: "mapel",
      title: "Kelola Mata Pelajaran",
      desc: "Atur daftar mapel, semester, dan alokasi jam mengajar harian.",
      icon: BookOpen,
      badge: "Kurikulum",
      color: "bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 border-purple-200"
    },
    // KECERDASAN BUATAN (AI) - Persiapan Administrasi & Perangkat Ajar
    {
      id: "generator_perangkat_ai",
      title: "AI Generator Perangkat",
      desc: "Hasilkan perangkat pembelajaran otomatis dengan kecerdasan buatan.",
      icon: Library,
      badge: "Kecerdasan Buatan",
      color: "bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-950/60 dark:text-fuchsia-400 border-fuchsia-200"
    },
    {
      id: "modul_ajar_ai",
      title: "AI Modul Ajar",
      desc: "Generator RPP Deep Learning Kurikulum Merdeka (hingga 5 pertemuan).",
      icon: Wand2,
      badge: "Kecerdasan Buatan",
      color: "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300"
    },
    {
      id: "asisten_ai",
      title: "AI Asisten Guru",
      desc: "Konsultan pedagogi AI, pembuat soal HOTS, & draf narasi rapor.",
      icon: Bot,
      badge: "Kecerdasan Buatan",
      color: "bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400 border-violet-200"
    },
    {
      id: "bahanajar",
      title: "Bahan Ajar Digital",
      desc: "Akses bahan ajar digital interaktif untuk referensi mengajar.",
      icon: BookOpen,
      badge: "Kecerdasan Buatan",
      color: "bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 border-sky-200"
    },
    {
      id: "pabriksoal",
      title: "Pabrik Soal",
      desc: "Bank soal dan generator latihan evaluasi pembelajaran siswa.",
      icon: FileText,
      badge: "Kecerdasan Buatan",
      color: "bg-lime-50 text-lime-600 dark:bg-lime-950/60 dark:text-lime-400 border-lime-200"
    },
    // AKADEMIK - Pelaksanaan Pembelajaran & Administrasi Harian
    {
      id: "jadwal",
      title: "Jadwal Mengajar",
      desc: "Kelola jadwal tatap muka kelas, jam pelajaran, dan ruang kelas.",
      icon: Calendar,
      badge: "Jadwal",
      color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-200"
    },
    {
      id: "input_absen",
      title: "Scan & Input Absensi",
      desc: "Pencatatan presensi harian manual & scan QR Code kamera otomatis.",
      icon: ClipboardCheck,
      badge: "Presensi",
      color: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200"
    },
    {
      id: "input_nilai",
      title: "Input Penilaian & Leger",
      desc: "Rekap nilai harian, UTS, UAS, kalkulasi otomatis & leger siswa.",
      icon: Presentation,
      badge: "Nilai & Rapor",
      color: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200"
    },
    {
      id: "agenda_mengajar",
      title: "Agenda Mengajar Guru",
      desc: "Jurnal harian KBM, keterlaksanaan materi & catatan kehadiran.",
      icon: BookMarked,
      badge: "Jurnal KBM",
      color: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400 border-cyan-200"
    },
    {
      id: "catatan_guru",
      title: "Catatan Guru",
      desc: "Catatan penting, observasi kelas, dan rekam jejak pengajaran harian.",
      icon: FileSignature,
      badge: "Catatan KBM",
      color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200"
    },
    {
      id: "arsip_perangkat",
      title: "Arsip Perangkat",
      desc: "Simpanan modul ajar, ATP, CP, dan berkas administrasi pembelajaran.",
      icon: Briefcase,
      badge: "Arsip Guru",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200"
    },
    {
      id: "bimbingan_wali",
      title: "Bimbingan Guru Wali",
      desc: "Pencatatan konseling, apresiasi siswa & tindak lanjut orang tua.",
      icon: HeartHandshake,
      badge: "Guru Wali",
      color: "bg-pink-50 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400 border-pink-200"
    },
    // SISTEM & OUTPUT
    {
      id: "laporan",
      title: "Pusat Laporan PDF",
      desc: "Cetak rekapitulasi presensi, leger nilai & jurnal resmi ke PDF.",
      icon: FileText,
      badge: "Cetak Dokumen",
      color: "bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400 border-teal-200"
    },
    {
      id: "panduan_aplikasi",
      title: "Panduan Aplikasi (PDF)",
      desc: "Petunjuk alur operasional, unduh buku panduan resmi A4, & panduan NIP/NIY.",
      icon: BookOpen,
      badge: "Petunjuk & PDF",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200"
    },
    {
      id: "pengaturan",
      title: "Pengaturan & Profil",
      desc: "Kelola profil guru, NIP, instansi sekolah, & gambar tanda tangan.",
      icon: Settings,
      badge: "Profil & Sekolah",
      color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-[#0A1128] via-[#0E1A3C] to-[#12183A] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-indigo-950/80">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> SIAP GURU &bull; Sistem Informasi Administrasi & Perangkat Guru
          </div>
          <div className="mb-2">
            <h2 className="text-base sm:text-lg font-medium text-indigo-200/80 mb-0.5">
              Selamat Datang,
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold leading-tight text-white tracking-tight">
              {userName || (userRole === "admin_sekolah" || userRole === "superadmin" ? "Admin" : "Guru")}! 👋
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-slate-300 text-sm font-normal">
              Anda login sebagai <span className="font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/70 px-2.5 py-0.5 rounded-lg ml-1 text-xs">{userRole === "admin_sekolah" ? "Administrator Sekolah" : userRole === "superadmin" ? "Superadmin" : "Guru"}</span>
            </span>

            {/* Subscription Status Badge */}
            {userRole === "superadmin" ? (
              <span className="font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/70 px-2.5 py-0.5 rounded-lg text-xs inline-flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> Akses Master Superadmin
              </span>
            ) : sekolahData ? (
              (() => {
                if (sekolahData.subscriptionPlan === 'permanen') {
                  return (
                    <span className="font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/70 px-2.5 py-0.5 rounded-lg text-xs inline-flex items-center gap-1.5 shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      Masa Aktif: Permanen (Lifetime)
                    </span>
                  );
                }

                if (sekolahData.expiresAt) {
                  const diffMs = sekolahData.expiresAt - Date.now();
                  const diffMinutes = Math.floor(diffMs / (1000 * 60));
                  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

                  let timeString = '';
                  let subDate = '';
                  let isUrgent = false;

                  if (diffMs <= 0) {
                    timeString = '0 Hari (Kedaluwarsa)';
                    subDate = 'Waktu habis';
                    isUrgent = true;
                  } else if (diffHours < 1) {
                    timeString = `Sisa ${diffMinutes} Menit`;
                    subDate = `s/d ${new Date(sekolahData.expiresAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;
                    isUrgent = true;
                  } else if (diffHours < 24) {
                    const remMin = diffMinutes % 60;
                    timeString = remMin > 0 ? `Sisa ${diffHours} Jam ${remMin} Menit` : `Sisa ${diffHours} Jam`;
                    subDate = `s/d ${new Date(sekolahData.expiresAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;
                    isUrgent = true;
                  } else {
                    timeString = `Sisa ${diffDays} Hari`;
                    subDate = `s/d ${new Date(sekolahData.expiresAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`;
                    isUrgent = diffDays <= 7;
                  }

                  let planLabel = '30 Hari (Uji Coba)';
                  if (sekolahData.subscriptionPlan === 'custom') {
                    const u = sekolahData.customDurationUnit === 'jam' ? 'Jam' : sekolahData.customDurationUnit === 'bulan' ? 'Bulan' : 'Hari';
                    planLabel = `Custom ${sekolahData.customDurationValue || 1} ${u}`;
                  } else if (sekolahData.subscriptionPlan === '1_jam') {
                    planLabel = 'Uji Coba 1 Jam';
                  } else if (sekolahData.subscriptionPlan === '2_jam') {
                    planLabel = 'Uji Coba 2 Jam';
                  } else if (sekolahData.subscriptionPlan === '3_jam') {
                    planLabel = 'Uji Coba 3 Jam';
                  } else if (sekolahData.subscriptionPlan === '6_jam') {
                    planLabel = 'Uji Coba 6 Jam';
                  } else if (sekolahData.subscriptionPlan === '12_jam') {
                    planLabel = 'Uji Coba 12 Jam';
                  } else if (sekolahData.subscriptionPlan === '1_hari') {
                    planLabel = 'Uji Coba 1 Hari (24 Jam)';
                  } else if (sekolahData.subscriptionPlan === '2_hari') {
                    planLabel = 'Uji Coba 2 Hari';
                  } else if (sekolahData.subscriptionPlan === '3_hari') {
                    planLabel = 'Uji Coba 3 Hari (72 Jam)';
                  } else if (sekolahData.subscriptionPlan === '7_hari') {
                    planLabel = 'Uji Coba 7 Hari';
                  } else if (sekolahData.subscriptionPlan === '14_hari') {
                    planLabel = 'Uji Coba 14 Hari';
                  } else if (sekolahData.subscriptionPlan === '6_bulan') {
                    planLabel = '6 Bulan (1 Semester)';
                  } else if (sekolahData.subscriptionPlan === '1_tahun') {
                    planLabel = '1 Tahun (1 Tahun Ajaran)';
                  }

                  return (
                    <span className={`font-semibold px-2.5 py-0.5 rounded-lg text-xs inline-flex items-center gap-1.5 border shadow-xs ${
                      isUrgent 
                        ? 'bg-amber-950/80 text-amber-300 border-amber-800/70 animate-pulse' 
                        : 'bg-blue-950/80 text-blue-300 border-blue-800/70'
                    }`}>
                      <Clock className="w-3.5 h-3.5" />
                      Masa Aktif: {timeString} • {planLabel} ({subDate})
                    </span>
                  );
                }

                return (
                  <span className="font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/70 px-2.5 py-0.5 rounded-lg text-xs inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Masa Aktif: 30 Hari (Uji Coba)
                  </span>
                );
              })()
            ) : null}
          </div>

          {/* Urgent Warning if <= 7 days or <= 24 hours left */}
          {sekolahData && sekolahData.subscriptionPlan !== 'permanen' && sekolahData.expiresAt && (
            (() => {
              const diffMs = sekolahData.expiresAt - Date.now();
              if (diffMs > 0 && diffMs <= 7 * 24 * 60 * 60 * 1000) {
                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                const remainingLabel = diffHours < 24 
                  ? (diffHours < 1 ? `${Math.floor(diffMs / (1000 * 60))} menit` : `${diffHours} jam`) 
                  : `${diffDays} hari`;
                return (
                  <div className="mt-3 p-3 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>
                        Pemberitahuan: Masa aktif uji coba sekolah Anda tersisa <strong>{remainingLabel} lagi</strong>. Hubungi Superadmin untuk aktivasi / perpanjangan paket.
                      </span>
                    </div>
                    <a 
                      href="https://wa.me/6285255700081?text=Halo%20Admin%20SIAP%20GURU,%20saya%20ingin%20perpanjang%20masa%20aktif%20sekolah%20kami."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-lg bg-amber-400 text-slate-900 font-bold hover:bg-amber-300 transition-colors shrink-0"
                    >
                      Perpanjang via WA
                    </a>
                  </div>
                );
              }
              return null;
            })()
          )}

          <p className="text-indigo-200/90 text-xs sm:text-sm mt-3 max-w-2xl leading-relaxed">
            Menegaskan guru selalu dalam kondisi <strong>siap</strong>: siap mengajar di kelas, siap menghadapi supervisi Kepala Sekolah/Pengawas, dan berkas administrasi selalu siap cetak kapan saja tanpa lembur mendadak.
          </p>
        </div>
        
        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-15 text-indigo-400">
          <Sparkles className="w-64 h-64" />
        </div>

        {/* Quick actions row inside banner */}
        <div className="mt-8 pt-6 border-t border-indigo-950/80 flex flex-wrap gap-4 relative z-10">
          <button 
            onClick={() => onNavigate("input_absen")}
            className="bg-white/10 hover:bg-white/15 text-white px-5 py-2.5 rounded-xl text-xs font-semibold backdrop-blur-md transition-all flex items-center space-x-2 shrink-0 cursor-pointer border border-white/15 hover:border-white/25"
          >
            <ClipboardCheck className="w-4 h-4 text-indigo-300" />
            <span>Mulai Absensi</span>
          </button>
          
          <button 
            onClick={() => onNavigate("modul_ajar_ai")}
            className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center space-x-2 shrink-0 cursor-pointer border border-indigo-400/40"
          >
            <Wand2 className="w-4 h-4 text-white" />
            <span>Buat Modul AI</span>
          </button>

          <button 
            onClick={() => onNavigate("panduan_aplikasi")}
            className="bg-blue-600/25 hover:bg-blue-600/40 text-blue-200 hover:text-white px-5 py-2.5 rounded-xl text-xs font-semibold backdrop-blur-md transition-all flex items-center space-x-2 shrink-0 cursor-pointer border border-blue-400/30"
          >
            <BookOpen className="w-4 h-4 text-blue-300" />
            <span>Panduan Ringkas (PDF)</span>
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-200/70 dark:border-indigo-800/60">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Siswa Aktif</p>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{totalSiswaAktif}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-200/70 dark:border-blue-800/60">
            <School className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Guru</p>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{totalGuruAktif}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-200/70 dark:border-emerald-800/60">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Kehadiran Hari Ini</p>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{attendanceRate}%</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 flex items-center space-x-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl border border-purple-200/70 dark:border-purple-800/60">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Mata Pelajaran</p>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{mapelList.length}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 flex items-center space-x-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-200/70 dark:border-amber-800/60">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Jadwal Kelas</p>
            <div className="flex items-end justify-between">
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{jadwalList.length}</h4>
              <button 
                onClick={() => onNavigate("jadwal")}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 cursor-pointer"
              >
                Lihat &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <LayoutGrid className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Akses Cepat Layanan</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {menuCards.map((item) => {
            // Filter menu items for normal guru
            if (userRole === "guru" && ["siswa", "mapel", "pengaturan"].includes(item.id)) return null;
            
            return (
              <div 
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="group bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 p-5 rounded-2xl shadow-xs hover:shadow-md border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/80 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                      <item.icon size={24} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-md">
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                
                <div className="flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                  Buka Modul <ArrowRight size={14} className="ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
