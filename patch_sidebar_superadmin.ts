import fs from 'fs';
let content = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');

const replacement = `if (userRole === 'superadmin') {
    menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'sekolah', label: 'Kelola Sekolah', icon: Building2 },
      { id: 'siswa', label: 'Data Siswa', icon: Users },
      { id: 'guru', label: 'Data Guru', icon: UserCheck },
      { id: 'password', label: 'Kontrol Sandi', icon: Key },
      { id: 'mapel', label: 'Mata Pelajaran', icon: BookOpen },
      { id: 'jadwal', label: 'Jadwal Mengajar', icon: Clock },
      { id: 'laporan', label: 'Pusat Laporan', icon: FileSpreadsheet },
      { id: 'pengaturan', label: 'Pengaturan', icon: Settings }
    ];
  } else if (userRole === 'admin_sekolah') {`;

content = content.replace(/if \(userRole === 'superadmin'\) \{[\s\S]*?\} else if \(userRole === 'admin_sekolah'\) \{/, replacement);

fs.writeFileSync('src/components/Sidebar.tsx', content);
