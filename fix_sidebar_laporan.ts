import fs from 'fs';
let content = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');

const regex = /{ isHeader: true, label: 'SISTEM & OUTPUT' },\s*{ id: 'pengaturan', label: 'Pengaturan & Profil', icon: Settings },/g;
content = content.replace(regex, `{ isHeader: true, label: 'SISTEM & OUTPUT' },\n      { id: 'laporan', label: 'Pusat Laporan', icon: FileSpreadsheet },\n      { id: 'pengaturan', label: 'Pengaturan & Profil', icon: Settings },`);

fs.writeFileSync('src/components/Sidebar.tsx', content);
