import fs from 'fs';

let content = `import React from "react";
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
  Library
} from "lucide-react";
import { Siswa, Mapel, LogAbsensi, DataNilai, Jadwal } from "../types";

interface DashboardViewProps {
  userRole?: "superadmin" | "admin_sekolah" | "guru" | string | null;
  sekolahId?: string;
  userName?: string;
  siswaList: Siswa[];
  mapelList: Mapel[];
  absensiList: LogAbsensi[];
  nilaiList: DataNilai[];
  jadwalList: Jadwal[];
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userRole,
  userName,
  siswaList,
  mapelList,
  absensiList,
  nilaiList,
  jadwalList,
  onNavigate
}) => {
  // Stats Calculation
  const today = new Date().toISOString().slice(0, 10);
  const todaysAttendance = absensiList.filter((a) => a.tanggal === today);
  const hadirCount = todaysAttendance.filter((a) => a.status === "hadir").length;
  
  const activeSiswa = siswaList.filter((s) => s.status === "aktif").length;
  const attendanceRate = activeSiswa > 0 ? Math.round((hadirCount / activeSiswa) * 100) : 0;

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
      id: "bimbingan_wali",
      title: "Bimbingan Guru Wali",
      desc: "Pencatatan konseling, apresiasi siswa & tindak lanjut orang tua.",
      icon: HeartHandshake,
      badge: "Guru Wali",
      color: "bg-pink-50 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400 border-pink-200"
    },
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
    {
      id: "laporan",
      title: "Pusat Laporan PDF",
      desc: "Cetak rekapitulasi presensi, leger nilai & jurnal resmi ke PDF.",
      icon: FileText,
      badge: "Cetak Dokumen",
      color: "bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400 border-teal-200"
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
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="mb-3">
            <h2 className="text-base sm:text-lg font-medium text-indigo-100 mb-0.5">
              Selamat Datang,
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold leading-tight text-white drop-shadow-sm">
              {userName || (userRole === "admin_sekolah" || userRole === "superadmin" ? "Admin" : "Guru")}! 👋
            </p>
          </div>
          <p className="text-indigo-100 text-lg font-medium">
            Anda login sebagai <span className="font-bold bg-white/20 px-2 py-1 rounded-lg ml-1">{userRole === "admin_sekolah" || userRole === "superadmin" ? "Administrator" : "Guru"}</span>
          </p>
        </div>
        
        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-20">
          <Sparkles className="w-64 h-64" />
        </div>

        {/* Quick actions row inside banner */}
        <div className="mt-8 pt-6 border-t border-white/20 flex flex-wrap gap-4 relative z-10">
          <button 
            onClick={() => onNavigate("input_absen")}
            className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl text-xs font-bold backdrop-blur-md transition-colors flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Mulai Absensi</span>
          </button>
          
          <button 
            onClick={() => onNavigate("modul_ajar_ai")}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-md transition-transform hover:scale-105 flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <Wand2 className="w-4 h-4" />
            <span>Buat Modul AI</span>
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Siswa Aktif</p>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{activeSiswa}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Kehadiran Hari Ini</p>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{attendanceRate}%</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Mata Pelajaran</p>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{mapelList.length}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center space-x-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Jadwal Kelas</p>
            <div className="flex items-end justify-between">
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{jadwalList.length}</h4>
              <button 
                onClick={() => onNavigate("jadwal")}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
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
            if (userRole === "guru" && ["siswa", "mapel", "laporan", "pengaturan"].includes(item.id)) return null;
            
            return (
              <div 
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="group bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 p-5 rounded-2xl shadow-xs hover:shadow-md border border-slate-200 dark:border-slate-800 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={\`w-12 h-12 rounded-xl flex items-center justify-center \${item.color}\`}>
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
`;

fs.writeFileSync('src/components/DashboardView.tsx', content);
