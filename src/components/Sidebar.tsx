import React from 'react';
import { 
  Users, UserCheck, ShieldAlert, BookOpen, Clock, CalendarCheck, 
  Award, BookMarked, UsersRound, Settings, FileSpreadsheet, Key, LogOut,
  ChevronLeft, LayoutDashboard, BrainCircuit, Library, Briefcase, FileSignature, Sparkles, Plus, Lock, Building2, Trash2,
  HardDriveDownload, FileText
} from 'lucide-react';
import { SiapGuruLogo } from './SiapGuruLogo';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  userRole: 'superadmin' | 'admin_sekolah' | 'guru' | null;
  sekolahId?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onLogout,
  sidebarOpen,
  setSidebarOpen,
  userRole
}) => {
  let menuItems = [];

  if (userRole === 'superadmin' || userRole === 'admin_sekolah') {
    menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ...(userRole === 'superadmin' ? [{ id: 'sekolah', label: 'Kelola Sekolah', icon: Building2 }] : []),
      
      { isHeader: true, label: 'MANAJEMEN' },
      { id: 'siswa', label: 'Data Siswa', icon: Users },
      { id: 'guru', label: 'Data Guru', icon: UserCheck },
      { id: 'password', label: 'Kontrol Sandi', icon: Key },
      { id: 'mapel', label: 'Mata Pelajaran', icon: BookOpen },

      { isHeader: true, label: 'KECERDASAN BUATAN (AI)' },
      { id: 'generator_perangkat_ai', label: 'AI Generator Perangkat', icon: Library, highlight: true },
      { id: 'modul_ajar_ai', label: 'AI Modul Ajar', icon: BrainCircuit, highlight: true },
      { id: 'asisten_ai', label: 'AI Asisten Guru', icon: Sparkles, highlight: true },
      { id: 'bahanajar', label: 'Bahan Ajar Digital', icon: BookOpen, highlight: true },
      { id: 'pabriksoal', label: 'Pabrik Soal', icon: FileSpreadsheet, highlight: true },
      
      { isHeader: true, label: 'AKADEMIK' },
      { id: 'jadwal', label: 'Jadwal Mengajar', icon: Clock },
      { id: 'input_absen', label: 'Input Absensi', icon: CalendarCheck },
      { id: 'input_nilai', label: 'Input Penilaian', icon: Award },
      { id: 'agenda_mengajar', label: 'Agenda Mengajar', icon: BookMarked },
      { id: 'catatan_guru', label: 'Catatan Guru', icon: FileSignature },
      { id: 'arsip_perangkat', label: 'Arsip Perangkat', icon: Briefcase },
      { id: 'bimbingan_wali', label: 'Bimbingan Wali', icon: ShieldAlert },

      { isHeader: true, label: 'SISTEM & OUTPUT' },
      { id: 'panduan_aplikasi', label: 'Panduan Aplikasi', icon: FileText, highlight: true },
      { id: 'laporan', label: 'Pusat Laporan', icon: FileSpreadsheet },
      { id: 'pengaturan', label: 'Pengaturan & Profil', icon: Settings },
      { id: 'backup', label: 'Pencadangan Data', icon: HardDriveDownload },
      ...(userRole === 'superadmin' ? [{ id: 'resetdb', label: 'Hapus Database', icon: Trash2 }] : []),
    ];
  } else if (userRole === 'guru') {
    menuItems = [
      { id: 'dashboard', label: 'Beranda Guru', icon: LayoutDashboard },
      
      { isHeader: true, label: 'KECERDASAN BUATAN (AI)' },
      { id: 'generator_perangkat_ai', label: 'AI Generator Perangkat', icon: Library, highlight: true },
      { id: 'modul_ajar_ai', label: 'AI Modul Ajar', icon: BrainCircuit, highlight: true },
      { id: 'asisten_ai', label: 'AI Asisten Guru', icon: Sparkles, highlight: true },
      { id: 'bahanajar', label: 'Bahan Ajar Digital', icon: BookOpen, highlight: true },
      { id: 'pabriksoal', label: 'Pabrik Soal', icon: FileSpreadsheet, highlight: true },

      { isHeader: true, label: 'AKADEMIK' },
      { id: 'input_absen', label: 'Input Absensi', icon: CalendarCheck },
      { id: 'input_nilai', label: 'Input Penilaian', icon: Award },
      { id: 'agenda_mengajar', label: 'Jurnal Agenda', icon: BookMarked },
      { id: 'catatan_guru', label: 'Catatan Guru', icon: FileSignature },
      { id: 'arsip_perangkat', label: 'Arsip Perangkat', icon: Briefcase },
      { id: 'bimbingan_wali', label: 'Bimbingan Wali', icon: ShieldAlert },

      { isHeader: true, label: 'SISTEM & OUTPUT' },
      { id: 'panduan_aplikasi', label: 'Panduan Aplikasi', icon: FileText, highlight: true },
      { id: 'laporan', label: 'Pusat Laporan', icon: FileSpreadsheet },
    ];
  }

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      />
      <div className={`fixed lg:static inset-y-0 left-0 w-72 lg:flex-shrink-0 bg-gradient-to-b from-[#0A1128] via-[#0E1A3C] to-[#080D21] text-slate-300 border-r border-indigo-950/80 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex items-center justify-between border-b border-indigo-950/80">
          <div className="flex items-center gap-3">
            <SiapGuruLogo size="sm" variant="icon" />
            <div>
              <h2 className="text-xl font-extrabold text-blue-400 tracking-tight flex items-center gap-1.5">
                SIAP GURU
                <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.9)]"></span>
              </h2>
              <p className="text-[9px] font-semibold text-indigo-300/80 uppercase tracking-wider">Sistem Administrasi Guru</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10">
            <ChevronLeft size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 hide-scrollbar">
          {menuItems.map((item, index) => (
            item.isHeader ? (
              <div key={`header-${index}`} className="px-4 pt-5 pb-2 text-[10px] font-bold text-indigo-300/70 uppercase tracking-wider flex items-center gap-2">
                <span>{item.label}</span>
              </div>
            ) : (
            <button
              key={item.id}
              onClick={() => { if(item.id) setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 group font-medium ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 border border-indigo-400/30' 
                  : 'hover:bg-white/[0.07] text-slate-300/80 hover:text-white'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-indigo-300/60 group-hover:text-indigo-200 transition-colors'} />
              <span className="text-sm">{item.label}</span>
              {item.highlight && (
                <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  activeTab === item.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-indigo-950/90 text-indigo-300 border border-indigo-800/60'
                }`}>
                  AI
                </span>
              )}
            </button>
            )
          ))}
        </div>
        <div className="p-4 border-t border-indigo-950/80">
          <button 
            onClick={onLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:text-white hover:bg-rose-500/20 border border-transparent hover:border-rose-500/30 rounded-xl transition-all font-semibold text-sm"
          >
            <LogOut size={20} /> Keluar Sistem
          </button>
        </div>
      </div>
    </>
  );
};
