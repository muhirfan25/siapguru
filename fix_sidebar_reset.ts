import fs from 'fs';
let content = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');

const regex = /\.\.\.\(userRole === 'superadmin' \? \[\{ id: 'resetdb', label: 'Hapus Database', icon: Trash2 \}\] : \[\]\),/g;
content = content.replace(regex, `{ id: 'resetdb', label: 'Hapus Database', icon: Trash2 },`);

fs.writeFileSync('src/components/Sidebar.tsx', content);
console.log("Sidebar resetdb patched");
