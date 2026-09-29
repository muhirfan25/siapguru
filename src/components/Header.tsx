import React from "react";
import { Menu, CloudCheck, CloudOff, Moon, Sun, Presentation, ShieldCheck, LogOut } from "lucide-react";
import { Pengaturan } from "../types";

interface HeaderProps {
  activeTab: string;
  onToggleSidebar: () => void;
  isDarkMode: boolean;
  onSetDarkMode: (isDark: boolean) => void;
  onToggleDarkMode?: () => void;
  isConnected: boolean;
  config: Pengaturan;
  onLogout?: () => void;
}

const TAB_TITLES: Record<string, string> = {
  dashboard: "Sistem Informasi Administrasi & Perangkat Guru",
  siswa: "Kelola Master Data Siswa",
  mapel: "Kelola Mata Pelajaran",
  jadwal: "Jadwal Mengajar Guru",
  absensi: "Input Absensi Harian",
  penilaian: "Input Nilai Akademik Siswa",
  agenda: "Jurnal Agenda Mengajar",
  bimbingan: "Catatan Bimbingan Guru Wali",
  downloadperangkat: "Download Perangkat Ajar (Deep Learning)",
  perangkat_ai: "Generator Perangkat Ajar AI (Analisis CP, TP, ATP, Prota, Prosem, KKTP)",
  modulai: "Generator Modul Ajar AI (Deep Learning)",
  asistenai: "Asisten AI Pendamping Guru",
  lkpdai: "Generator LKPD AI (Lembar Kerja Peserta Didik)",
  ailainnya: "Generator AI Lainnya",
  laporan: "Pusat Cetak Laporan PDF",
  panduan_aplikasi: "Buku Panduan Ringkas Penggunaan SIAP GURU (PDF)",
  pengaturan: "Pengaturan & Profil Sekolah",
  backup: "Pencadangan & Pemulihan Database (Backup & Restore)",
  resetdb: "Kosongkan & Hapus Seluruh Isi Database"
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onToggleSidebar,
  isDarkMode,
  onSetDarkMode,
  onToggleDarkMode,
  isConnected,
  config,
  onLogout
}) => {
  const handleSelectDark = (dark: boolean) => {
    if (onSetDarkMode) {
      onSetDarkMode(dark);
    } else if (onToggleDarkMode) {
      onToggleDarkMode();
    }
  };

  return (
    <header className="sticky top-0 h-16 bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-md border-b border-slate-200 dark:border-indigo-950/80 flex items-center justify-between px-3 sm:px-4 lg:px-8 shrink-0 z-30 transition-colors shadow-xs">
      <div className="flex items-center space-x-2.5 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-indigo-950/50 active:scale-95 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 min-w-0 lg:hidden">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold shrink-0 shadow-xs border border-indigo-400/40">
            <Presentation className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col min-w-0 leading-tight">
            <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
              {TAB_TITLES[activeTab] || "Sistem Informasi Administrasi & Perangkat Guru"}
            </span>
            {activeTab !== "dashboard" && (
              <span className="text-[10px] text-slate-500 dark:text-indigo-300/70 font-medium truncate">
                SIAP GURU &bull; Sistem Informasi Administrasi & Perangkat Guru
              </span>
            )}
          </div>
        </div>

        <h1 className="hidden lg:block text-lg font-bold text-slate-800 dark:text-white truncate">
          {TAB_TITLES[activeTab] || "Sistem Informasi Administrasi & Perangkat Guru"}
        </h1>
      </div>

      <div className="flex items-center space-x-2 shrink-0">
        {/* Firebase Live Status Badge */}
        <div
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-xs transition-colors ${
            isConnected
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
              : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
          }`}
        >
          {isConnected ? (
            <>
              <CloudCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">Firebase Live</span>
            </>
          ) : (
            <>
              <CloudOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Connecting...</span>
            </>
          )}
        </div>

        {/* Teacher profile badge */}
        {config.Nama_Guru && (
          <div className="hidden md:flex items-center space-x-2 bg-indigo-50/70 dark:bg-indigo-950/60 px-3 py-1 rounded-xl border border-indigo-200/70 dark:border-indigo-800/60">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-950 dark:text-indigo-200 max-w-[140px] truncate">
              {config.Nama_Guru}
            </span>
          </div>
        )}

        {/* Theme Toggle Switch (Sun = Light Mode, Moon = Dark Mode) */}
        <div className="flex items-center bg-slate-100 dark:bg-[#0E1A3C] p-1 rounded-xl border border-slate-200 dark:border-indigo-950/80 space-x-0.5">
          <button
            type="button"
            onClick={() => handleSelectDark(false)}
            className={`p-2 rounded-lg transition-all flex items-center justify-center min-w-[36px] min-h-[36px] ${
              !isDarkMode
                ? "bg-amber-400 text-slate-950 shadow-xs font-bold scale-105"
                : "text-slate-400 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 active:scale-95"
            }`}
            title="Sinar Matahari: Aktifkan Tema Terang (Light Mode)"
            aria-label="Tema Terang"
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleSelectDark(true)}
            className={`p-2 rounded-lg transition-all flex items-center justify-center min-w-[36px] min-h-[36px] ${
              isDarkMode
                ? "bg-indigo-600 text-white shadow-xs font-bold scale-105 shadow-indigo-600/30"
                : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95"
            }`}
            title="Bulan Sabit: Aktifkan Tema Gelap (Dark Mode)"
            aria-label="Tema Gelap"
          >
            <Moon className="w-4 h-4" />
          </button>
        </div>
        
        {/* Logout Button */}
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-xl font-bold text-xs transition-colors border border-red-200 dark:border-red-800/50 ml-1 cursor-pointer"
            title="Keluar dari Aplikasi"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        )}
      </div>
    </header>
  );
};
