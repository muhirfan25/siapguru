import React, { useState, useEffect } from "react";
import { PieChart, ClipboardCheck, Star, Sparkles, Menu } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { DashboardView } from "./components/DashboardView";
import { KelolaSiswaView } from "./components/KelolaSiswaView";
import { KelolaGuruView } from "./components/KelolaGuruView";
import { KontrolSandiView } from "./components/KontrolSandiView";
import { KelolaMapelView } from "./components/KelolaMapelView";
import { JadwalMengajarView } from "./components/JadwalMengajarView";
import { InputAbsensiView } from "./components/InputAbsensiView";
import { InputPenilaianView } from "./components/InputPenilaianView";
import { AgendaMengajarView } from "./components/AgendaMengajarView";
import { CatatanGuruView } from "./components/CatatanGuruView";
import { ArsipPerangkatView } from "./components/ArsipPerangkatView";
import { BimbinganWaliView } from "./components/BimbinganWaliView";
import { GeneratorPerangkatAjarAIView } from "./components/GeneratorPerangkatAjarAIView";
import { ModulAjarAIView } from "./components/ModulAjarAIView";
import { AsistenGuruAIView } from "./components/AsistenGuruAIView";
import { PusatLaporanView } from "./components/PusatLaporanView";
import { PanduanAplikasiView } from "./components/PanduanAplikasiView";
import { PengaturanView } from "./components/PengaturanView";
import { ResetDatabaseView } from "./components/ResetDatabaseView";
import { BackupDatabaseView } from "./components/BackupDatabaseView";
import { LandingPageView } from "./components/LandingPageView";
import { KategoriMasaAktifView } from "./components/KategoriMasaAktifView";
import { LoginView } from "./components/LoginView";
import { DashboardSuperadminView } from "./components/DashboardSuperadminView";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, firestore } from "./lib/firebase";
import { 
  subscribeCollection, 
  subscribePengaturan, 
  batchSaveDocuments, 
  savePengaturan,
  setGlobalSekolahId,
  COLLECTIONS 
} from "./lib/firebase";

import { 
  Sekolah,
  Siswa, 
  Guru,
  Mapel, 
  Jadwal, 
  LogAbsensi, 
  DataNilai, 
  JurnalAgenda, 
  SiswaBimbingan, 
  BimbinganWali,
  CatatanGuru,
  ArsipPerangkat,
  Pengaturan 
} from "./types";

const DEFAULT_CONFIG: Pengaturan = {
  Nama_Guru: "",
  NIP_Guru: "",
  Pemerintah: "PEMERINTAH PROVINSI",
  Nama_Sekolah: "",
  Alamat_Sekolah: "",
  Nama_Kepsek: "",
  NIP_Kepsek: "",
  Tempat_Tanda_Tangan: "",
  Logo_Kiri: "",
  Logo_Kanan: ""
};

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("edadmin_theme") === "dark";
  });
  const [isConnected, setIsConnected] = useState(false);

  // Authentication State
  const [appState, setAppState] = useState<'landing' | 'login' | 'dashboard' | 'paket'>(() => {
    return (localStorage.getItem("edadmin_auth_state") as 'landing' | 'login' | 'dashboard' | 'paket') || "landing";
  });
  
  const [userRole, setUserRole] = useState<'superadmin' | 'admin_sekolah' | 'guru' | null>(() => {
    return (localStorage.getItem("edadmin_user_role") as 'guru' | 'admin' | null) || null;
  });

  const [sekolahId, setSekolahId] = useState<string>(() => {
    const saved = localStorage.getItem("edadmin_sekolah_id") || "";
    if (saved) setGlobalSekolahId(saved);
    return saved;
  });

  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem("edadmin_user_name") || "";
  });

  // Sync auth state and globalSekolahId
  useEffect(() => {
    setGlobalSekolahId(sekolahId || undefined);
  }, [sekolahId]);

  useEffect(() => {
    localStorage.setItem("edadmin_auth_state", appState);
    if (userRole) {
      localStorage.setItem("edadmin_user_role", userRole);
      localStorage.setItem("edadmin_user_name", userName);
      localStorage.setItem("edadmin_sekolah_id", sekolahId);
    } else {
      localStorage.removeItem("edadmin_user_role");
      localStorage.removeItem("edadmin_user_name");
      localStorage.removeItem("edadmin_sekolah_id");
    }
  }, [appState, userRole, sekolahId, userName]);

  const handleLogout = async () => {
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
    } catch (error) {
      console.error(error);
    }
    setUserRole(null);
    setUserName("");
    setSekolahId("");
    setGlobalSekolahId(undefined);
    setGuruList([]);
    setSiswaList([]);
    setMapelList([]);
    setJadwalList([]);
    setAbsensiList([]);
    setNilaiList([]);
    setAgendaList([]);
    setSiswaBimbinganList([]);
    setBimbinganList([]);
    setCatatanList([]);
    setArsipList([]);
    setConfig(DEFAULT_CONFIG);
    setAppState('landing');
    setActiveTab('dashboard');
  };

  // Sync dark class on documentElement and body for Tailwind CSS theme switching
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      localStorage.setItem("edadmin_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      localStorage.setItem("edadmin_theme", "light");
    }
  }, [isDarkMode]);

  // Firestore Data Collections
  const [guruList, setGuruList] = useState<Guru[]>([]);
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [mapelList, setMapelList] = useState<Mapel[]>([]);
  const [jadwalList, setJadwalList] = useState<Jadwal[]>([]);
  const [absensiList, setAbsensiList] = useState<LogAbsensi[]>([]);
  const [nilaiList, setNilaiList] = useState<DataNilai[]>([]);
  const [agendaList, setAgendaList] = useState<JurnalAgenda[]>([]);
  const [siswaBimbinganList, setSiswaBimbinganList] = useState<SiswaBimbingan[]>([]);
  const [bimbinganList, setBimbinganList] = useState<BimbinganWali[]>([]);
  const [catatanList, setCatatanList] = useState<CatatanGuru[]>([]);
  const [arsipList, setArsipList] = useState<ArsipPerangkat[]>([]);
  const [config, setConfig] = useState<Pengaturan>(DEFAULT_CONFIG);
  const [sekolahData, setSekolahData] = useState<Sekolah | null>(null);

  // Subscribe to Firebase real-time collections
  useEffect(() => {
    let unsubs: Array<() => void> = [];

    // Clear state before subscribing to new tenant
    setGuruList([]);
    setSiswaList([]);
    setMapelList([]);
    setJadwalList([]);
    setAbsensiList([]);
    setNilaiList([]);
    setAgendaList([]);
    setSiswaBimbinganList([]);
    setBimbinganList([]);
    setCatatanList([]);
    setArsipList([]);
    setSekolahData(null);

    if (userRole) {
      const targetSekolahId = userRole === 'superadmin' ? undefined : (sekolahId || undefined);

      if (sekolahId && userRole !== 'superadmin') {
        unsubs.push(onSnapshot(doc(firestore, COLLECTIONS.SEKOLAH, sekolahId), (snap) => {
          if (snap.exists()) {
            setSekolahData({ id: snap.id, ...snap.data() } as Sekolah);
          } else {
            setSekolahData(null);
          }
        }));
      }

      unsubs.push(subscribeCollection<any>(COLLECTIONS.GURU, (data) => {
        setGuruList(data);
        setIsConnected(true);
      }, targetSekolahId));

      unsubs.push(subscribeCollection<any>(COLLECTIONS.SISWA, (data) => {
        setSiswaList(data);
        setIsConnected(true);
      }, targetSekolahId));

      unsubs.push(subscribeCollection<any>(COLLECTIONS.MAPEL, (data) => {
        setMapelList(data);
      }, targetSekolahId));

      unsubs.push(subscribeCollection<any>(COLLECTIONS.JADWAL, (data) => {
        setJadwalList(data);
      }, targetSekolahId));

      unsubs.push(subscribeCollection<any>(COLLECTIONS.LOG_ABSENSI, (data) => {
        setAbsensiList(data);
      }, targetSekolahId));

      unsubs.push(subscribeCollection<any>(COLLECTIONS.DATA_NILAI, (data) => {
        setNilaiList(data);
      }, targetSekolahId));

      unsubs.push(subscribeCollection<any>(COLLECTIONS.JURNAL_AGENDA, (data) => {
        setAgendaList(data);
      }, targetSekolahId));

      unsubs.push(subscribeCollection<any>(COLLECTIONS.SISWA_BIMBINGAN, (data) => {
        setSiswaBimbinganList(data);
      }, targetSekolahId));

      unsubs.push(subscribeCollection<any>(COLLECTIONS.BIMBINGAN_WALI, (data) => {
        setBimbinganList(data);
      }, targetSekolahId));

      unsubs.push(subscribeCollection<any>(COLLECTIONS.CATATAN_GURU, (data) => {
        setCatatanList(data);
      }, targetSekolahId));

      unsubs.push(subscribeCollection<any>(COLLECTIONS.ARSIP_PERANGKAT, (data) => {
        setArsipList(data);
      }, targetSekolahId));

      unsubs.push(subscribePengaturan((cfg) => {
        if (cfg && Object.keys(cfg).length > 0) {
          setConfig((prev) => ({ ...prev, ...cfg }));
        }
      }, targetSekolahId));
    }
    
    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, [userRole, sekolahId]);

  const handleSuccessReset = () => {
    setSiswaList([]);
    setMapelList([]);
    setJadwalList([]);
    setAbsensiList([]);
    setNilaiList([]);
    setAgendaList([]);
    setSiswaBimbinganList([]);
    setBimbinganList([]);
    setCatatanList([]);
    setArsipList([]);
  };

  // Render Based on App State
  if (appState === 'paket') {
    return (
      <KategoriMasaAktifView
        onBackToLanding={() => setAppState('landing')}
        onLoginClick={() => setAppState('login')}
      />
    );
  }

  if (appState === 'landing') {
    return (
      <LandingPageView 
        onLoginClick={() => setAppState('login')} 
        onNavigateToPaket={() => setAppState('paket')}
      />
    );
  }

  if (appState === 'login') {
    return (
      <LoginView 
          onLoginSuccess={(role, name, sid) => {
            setUserRole(role);
            setUserName(name || '');
            setSekolahId(sid || '');
            setAppState('dashboard');
            setActiveTab('dashboard');
          }}
          onBack={() => setAppState('landing')} 
        />
    );
  }

  return (
    <div className={`min-h-screen flex bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-roboto transition-colors ${isDarkMode ? "dark" : ""}`}>
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
        userRole={userRole} sekolahId={sekolahId}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          activeTab={activeTab}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isDarkMode={isDarkMode}
          onSetDarkMode={(isDark) => setIsDarkMode(isDark)}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          isConnected={isConnected}
          config={config}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-8 custom-scrollbar pb-24 lg:pb-8">
          {activeTab === "dashboard" && (
            <DashboardView
              userRole={userRole}
              sekolahId={sekolahId}
              sekolahData={sekolahData}
              userName={userName}
              siswaList={siswaList}
              guruList={guruList}
              mapelList={mapelList}
              absensiList={absensiList}
              nilaiList={nilaiList}
              jadwalList={jadwalList}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === "sekolah" && userRole === "superadmin" && <DashboardSuperadminView />}
          {activeTab === "siswa" && <KelolaSiswaView siswaList={siswaList} userRole={userRole} sekolahId={sekolahId} />}

          {activeTab === "guru" && <KelolaGuruView guruList={guruList} userRole={userRole} sekolahId={sekolahId} />}

          {activeTab === "password" && <KontrolSandiView guruList={guruList} />}

          {activeTab === "mapel" && <KelolaMapelView mapelList={mapelList} />}

          {activeTab === "jadwal" && (
            <JadwalMengajarView
              jadwalList={jadwalList}
              mapelList={mapelList}
              siswaList={siswaList}
            />
          )}

          {activeTab === "input_absen" && (
            <InputAbsensiView
              siswaList={siswaList}
              mapelList={mapelList}
              absensiList={absensiList}
              config={config}
            />
          )}

          {activeTab === "input_nilai" && (
            <InputPenilaianView
              siswaList={siswaList}
              mapelList={mapelList}
              nilaiList={nilaiList}
              config={config}
            />
          )}

          {activeTab === "agenda_mengajar" && (
            <AgendaMengajarView
              agendaList={agendaList}
              mapelList={mapelList}
              siswaList={siswaList}
              config={config}
            />
          )}

          {activeTab === "catatan_guru" && (
            <CatatanGuruView
              catatanList={catatanList}
              config={config}
            />
          )}

          {activeTab === "arsip_perangkat" && (
            <ArsipPerangkatView
              arsipList={arsipList}
              config={config}
            />
          )}

          {activeTab === "bimbingan_wali" && (
            <BimbinganWaliView
              bimbinganList={bimbinganList}
              siswaBimbinganList={siswaBimbinganList}
              siswaList={siswaList}
              absensiList={absensiList}
              config={config}
            />
          )}

          {activeTab === "generator_perangkat_ai" && <GeneratorPerangkatAjarAIView config={config} />}

          {activeTab === "modul_ajar_ai" && <ModulAjarAIView config={config} />}

          {activeTab === "asisten_ai" && <AsistenGuruAIView config={config} />}

          {activeTab === "bahanajar" && (
            <div className="w-full h-full min-h-[calc(100vh-140px)] flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <iframe 
                src="https://ajargen.vercel.app/" 
                className="w-full flex-1 border-0 min-h-[600px]" 
                title="Bahan Ajar Digital"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {activeTab === "pabriksoal" && (
            <div className="w-full h-full min-h-[calc(100vh-140px)] flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <iframe 
                src="https://pabriksoal.netlify.app/" 
                className="w-full flex-1 border-0 min-h-[600px]" 
                title="Pabrik Soal"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {activeTab === "laporan" && (
            <PusatLaporanView
              siswaList={siswaList}
              mapelList={mapelList}
              absensiList={absensiList}
              nilaiList={nilaiList}
              agendaList={agendaList}
              bimbinganList={bimbinganList}
              catatanList={catatanList}
              arsipList={arsipList}
              config={config}
            />
          )}

          {activeTab === "panduan_aplikasi" && (
            <PanduanAplikasiView
              config={config}
              userRole={userRole}
            />
          )}

          {activeTab === "pengaturan" && (
            <PengaturanView
              userRole={userRole} sekolahId={sekolahId}
              config={config}
              onNavigateToReset={() => setActiveTab("resetdb")}
              onNavigateToBackup={() => setActiveTab("backup")}
            />
          )}

          {activeTab === "backup" && (
            <BackupDatabaseView
              userRole={userRole}
              sekolahId={sekolahId}
              config={config}
              siswaList={siswaList}
              guruList={guruList}
              mapelList={mapelList}
              absensiList={absensiList}
              nilaiList={nilaiList}
              jadwalList={jadwalList}
              onNavigateToReset={() => setActiveTab("resetdb")}
            />
          )}

          {activeTab === "resetdb" && (
            <ResetDatabaseView
              onSuccessReset={handleSuccessReset}
              userRole={userRole}
              sekolahId={sekolahId}
              onNavigateToBackup={() => setActiveTab("backup")}
            />
          )}
        </main>

        {/* Native Mobile Bottom Navigation Bar */}
        <nav 
          className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-30 lg:hidden px-2 py-1.5 pb-safe shadow-lg flex items-center justify-around transition-colors"
          aria-label="Navigasi Bawah Mobile"
        >
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl transition-all active:scale-90 ${
              activeTab === "dashboard"
                ? "text-blue-600 dark:text-blue-400 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <PieChart className={`w-5 h-5 ${activeTab === "dashboard" ? "scale-110" : ""}`} />
            <span className="text-[10px] mt-0.5 tracking-tight truncate">Beranda</span>
          </button>

          <button
            onClick={() => setActiveTab("input_absen")}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl transition-all active:scale-90 ${
              activeTab === "input_absen"
                ? "text-blue-600 dark:text-blue-400 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <ClipboardCheck className={`w-5 h-5 ${activeTab === "input_absen" ? "scale-110" : ""}`} />
            <span className="text-[10px] mt-0.5 tracking-tight truncate">Absensi</span>
          </button>

          <button
            onClick={() => setActiveTab("input_nilai")}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl transition-all active:scale-90 ${
              activeTab === "input_nilai"
                ? "text-blue-600 dark:text-blue-400 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Star className={`w-5 h-5 ${activeTab === "input_nilai" ? "scale-110" : ""}`} />
            <span className="text-[10px] mt-0.5 tracking-tight truncate">Nilai</span>
          </button>

          <button
            onClick={() => setActiveTab("modul_ajar_ai")}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl transition-all active:scale-90 ${
              activeTab === "generator_perangkat_ai" || activeTab === "modul_ajar_ai" || activeTab === "asisten_ai" || activeTab === "bahanajar" || activeTab === "pabriksoal"
                ? "text-amber-500 dark:text-amber-400 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400"
            }`}
          >
            <Sparkles className={`w-5 h-5 ${activeTab === "generator_perangkat_ai" || activeTab === "modul_ajar_ai" || activeTab === "asisten_ai" || activeTab === "bahanajar" || activeTab === "pabriksoal" ? "scale-110 text-amber-500" : ""}`} />
            <span className="text-[10px] mt-0.5 tracking-tight truncate">Asisten AI</span>
          </button>

          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all active:scale-90"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight truncate">Menu</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
