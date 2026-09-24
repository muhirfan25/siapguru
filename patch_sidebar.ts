import fs from 'fs';
let content = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');

// Fix the typo
content = content.replace(
    "...(userRole === 'superadmin' ? [{ id: 'sekolah', label: 'Kelola Sekolah', icon: Building2, Trash2 }] : []),",
    "...(userRole === 'superadmin' ? [{ id: 'sekolah', label: 'Kelola Sekolah', icon: Building2 }] : []),"
);

// Make resetdb only available to superadmin
content = content.replace(
    "{ id: 'resetdb', label: 'Hapus Database', icon: Trash2 },",
    "...(userRole === 'superadmin' ? [{ id: 'resetdb', label: 'Hapus Database', icon: Trash2 }] : []),"
);

fs.writeFileSync('src/components/Sidebar.tsx', content);
console.log("Sidebar patched");
