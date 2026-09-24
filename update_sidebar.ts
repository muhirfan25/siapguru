import fs from 'fs';
let content = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');

// I need to add Reset Database to SISTEM & OUTPUT for superadmin only, or for admin_sekolah too if they can reset their own?
// The prompt says: "menu hapus data base tidak ada, tolong d munculkan seprti yang sebelumnya, menu ada ketika dia login sebagai superadmin"

const oldMenuSection = `{ isHeader: true, label: 'SISTEM & OUTPUT' },
      { id: 'laporan', label: 'Pusat Laporan', icon: FileSpreadsheet },
      { id: 'pengaturan', label: 'Pengaturan & Profil', icon: Settings },`;

const newMenuSection = `{ isHeader: true, label: 'SISTEM & OUTPUT' },
      { id: 'laporan', label: 'Pusat Laporan', icon: FileSpreadsheet },
      { id: 'pengaturan', label: 'Pengaturan & Profil', icon: Settings },
      ...(userRole === 'superadmin' ? [{ id: 'reset_db', label: 'Hapus Database', icon: Trash2 }] : []),`;

if(content.includes(oldMenuSection)) {
    content = content.replace(oldMenuSection, newMenuSection);
    // need to import Trash2 if not there
    if (!content.includes('Trash2')) {
        content = content.replace('Building2}', 'Building2, Trash2}');
    }
    fs.writeFileSync('src/components/Sidebar.tsx', content);
    console.log('Sidebar updated');
} else {
    console.log('Menu section not found');
}
