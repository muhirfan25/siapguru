import fs from 'fs';
let content = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');

const regex = /if \(userRole === 'superadmin' \|\| userRole === 'admin_sekolah'\) \{[\s\S]*?\}  return \(/;

const newMenu = `if (userRole === 'superadmin' || userRole === 'admin_sekolah') {
    menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ...(userRole === 'superadmin' ? [{ id: 'sekolah', label: 'Kelola Sekolah', icon: Building2 }] : []),
      
      { isHeader: true, label: 'MANAJEMEN' },
      { id: 'siswa', label: 'Data Siswa', icon: Users },
      { id: 'guru', label: 'Data Guru', icon: UserCheck },
      { id: 'password', label: 'Kontrol Sandi', icon: Key },
      { id: 'mapel', label: 'Mata Pelajaran', icon: BookOpen },
      
      { isHeader: true, label: 'AKADEMIK' },
      { id: 'jadwal', label: 'Jadwal Mengajar', icon: Clock },
      { id: 'input_absen', label: 'Input Absensi', icon: CalendarCheck },
      { id: 'input_nilai', label: 'Input Penilaian', icon: Award },
      { id: 'agenda_mengajar', label: 'Agenda Mengajar', icon: BookMarked },
      { id: 'catatan_guru', label: 'Catatan Guru', icon: FileSignature },
      { id: 'arsip_perangkat', label: 'Arsip Perangkat', icon: Briefcase },
      { id: 'bimbingan_wali', label: 'Bimbingan Wali', icon: ShieldAlert },
      
      { isHeader: true, label: 'KECERDASAN BUATAN (AI)' },
      { id: 'generator_perangkat_ai', label: 'AI Generator Perangkat', icon: Library, highlight: true },
      { id: 'modul_ajar_ai', label: 'AI Modul Ajar', icon: BrainCircuit, highlight: true },
      { id: 'asisten_ai', label: 'AI Asisten Guru', icon: Sparkles, highlight: true },
      { id: 'bahanajar', label: 'Bahan Ajar Digital', icon: BookOpen, highlight: true },
      { id: 'pabriksoal', label: 'Pabrik Soal', icon: FileSpreadsheet, highlight: true },

      { isHeader: true, label: 'SISTEM & OUTPUT' },
      { id: 'laporan', label: 'Pusat Laporan', icon: FileSpreadsheet },
      { id: 'pengaturan', label: 'Pengaturan & Profil', icon: Settings },
    ];
  } else if (userRole === 'guru') {
    menuItems = [
      { id: 'dashboard', label: 'Beranda Guru', icon: LayoutDashboard },
      
      { isHeader: true, label: 'AKADEMIK' },
      { id: 'input_absen', label: 'Input Absensi', icon: CalendarCheck },
      { id: 'input_nilai', label: 'Input Nilai', icon: Award },
      { id: 'agenda_mengajar', label: 'Jurnal Agenda', icon: BookMarked },
      { id: 'bimbingan_wali', label: 'Bimbingan Wali', icon: ShieldAlert },
      { id: 'catatan_guru', label: 'Catatan Guru', icon: FileSignature },
      { id: 'arsip_perangkat', label: 'Arsip Perangkat', icon: Briefcase },
      
      { isHeader: true, label: 'KECERDASAN BUATAN (AI)' },
      { id: 'generator_perangkat_ai', label: 'AI Generator Perangkat', icon: Library, highlight: true },
      { id: 'modul_ajar_ai', label: 'AI Modul Ajar', icon: BrainCircuit, highlight: true },
      { id: 'asisten_ai', label: 'AI Asisten Guru', icon: Sparkles, highlight: true },
      { id: 'bahanajar', label: 'Bahan Ajar Digital', icon: BookOpen, highlight: true },
      { id: 'pabriksoal', label: 'Pabrik Soal', icon: FileSpreadsheet, highlight: true },
    ];
  }

  return (`;

if (regex.test(content)) {
  content = content.replace(regex, newMenu);
  fs.writeFileSync('src/components/Sidebar.tsx', content);
  console.log("Replaced successfully!");
} else {
  console.log("Regex did not match!");
}
