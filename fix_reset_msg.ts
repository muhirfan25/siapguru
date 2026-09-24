import fs from 'fs';
let content = fs.readFileSync('src/components/ResetDatabaseView.tsx', 'utf-8');

content = content.replace(
  "Apakah Anda benar-benar YAKIN 100% untuk menghapus seluruh data siswa, absensi, nilai, jadwal, agenda, dan bimbingan secara permanen?",
  "Apakah Anda benar-benar YAKIN 100% untuk menghapus seluruh data GURU, siswa, absensi, nilai, jadwal, agenda, dan bimbingan secara permanen?"
);

content = content.replace(
  "<span>1. Master Data Siswa (NISN & Kelas)</span>",
  "<span>1. Master Data Guru & Siswa</span>"
);

fs.writeFileSync('src/components/ResetDatabaseView.tsx', content);
