#!/bin/bash
cat << 'INNER_EOF' > src/components/Sidebar.tsx
import React from 'react';
import { 
  Users, UserCheck, ShieldAlert, BookOpen, Clock, CalendarCheck, 
  Award, BookMarked, UsersRound, Settings, FileSpreadsheet, Key, LogOut,
  ChevronLeft, LayoutDashboard, BrainCircuit, Library, Briefcase, FileSignature, Sparkles, Plus, Lock, Building2
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  userRole: 'superadmin' | 'admin_sekolah' | 'guru' | null;
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

  if (userRole === 'superadmin') {
    menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'sekolah', label: 'Kelola Sekolah', icon: Building2 },
    ];
  } else if (userRole === 'admin_sekolah') {
    menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'siswa', label: 'Data Siswa', icon: Users },
      { id: 'guru', label: 'Data Guru', icon: UserCheck },
      { id: 'password', label: 'Kontrol Sandi', icon: Key },
      { id: 'mapel', label: 'Mata Pelajaran', icon: BookOpen },
      { id: 'jadwal', label: 'Jadwal Mengajar', icon: Clock },
      { id: 'laporan', label: 'Pusat Laporan', icon: FileSpreadsheet },
      { id: 'pengaturan', label: 'Pengaturan', icon: Settings }
    ];
  } else if (userRole === 'guru') {
    menuItems = [
      { id: 'dashboard', label: 'Beranda Guru', icon: LayoutDashboard },
      { id: 'input_absen', label: 'Input Absensi', icon: CalendarCheck },
      { id: 'input_nilai', label: 'Input Nilai', icon: Award },
      { id: 'agenda_mengajar', label: 'Jurnal Agenda', icon: BookMarked },
      { id: 'siswa_bimbingan', label: 'Siswa Bimbingan', icon: UsersRound },
      { id: 'bimbingan_wali', label: 'Bimbingan Wali', icon: ShieldAlert },
      { id: 'catatan_guru', label: 'Catatan Guru', icon: FileSignature },
      { id: 'arsip_perangkat', label: 'Arsip Perangkat', icon: Briefcase },
      { id: 'asisten_ai', label: 'Tanya Asisten AI', icon: Sparkles, highlight: true },
      { id: 'modul_ajar_ai', label: 'Buat Modul AI', icon: BrainCircuit, highlight: true },
      { id: 'generator_perangkat_ai', label: 'Generator Perangkat AI', icon: Library, highlight: true },
    ];
  }

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity lg:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      />
      <div className={`fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-bold text-xl leading-none">S</span>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 tracking-tight">SIAGAT</h2>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Multi-Tenant EdAdmin</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <ChevronLeft size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 hide-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium ${
                activeTab === item.id 
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-indigo-500 transition-colors'} />
              {item.label}
              {item.highlight && (
                <span className="ml-auto flex h-2 w-2 rounded-full bg-amber-400"></span>
              )}
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={onLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors font-medium"
          >
            <LogOut size={20} /> Keluar Sistem
          </button>
        </div>
      </div>
    </>
  );
};
INNER_EOF
