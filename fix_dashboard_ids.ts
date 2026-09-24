import fs from 'fs';
let content = fs.readFileSync('src/components/DashboardView.tsx', 'utf-8');

content = content.replace(/id: "absensi",/g, 'id: "input_absen",');
content = content.replace(/id: "penilaian",/g, 'id: "input_nilai",');
content = content.replace(/id: "agenda",/g, 'id: "agenda_mengajar",');
content = content.replace(/id: "bimbingan",/g, 'id: "bimbingan_wali",');
content = content.replace(/id: "modulai",/g, 'id: "modul_ajar_ai",');
content = content.replace(/id: "asistenai",/g, 'id: "asisten_ai",');
content = content.replace(/onNavigate\("modulai"\)/g, 'onNavigate("modul_ajar_ai")');
content = content.replace(/onNavigate\("penilaian"\)/g, 'onNavigate("input_nilai")');

fs.writeFileSync('src/components/DashboardView.tsx', content);
