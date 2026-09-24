import fs from 'fs';
let content = fs.readFileSync('src/components/DashboardSuperadminView.tsx', 'utf-8');

// Update setDoc for SEKOLAH to include emailAdmin
content = content.replace(
  /await setDoc\(doc\(firestore, COLLECTIONS.SEKOLAH, newId\), \{\n\s*nama: newSekolah.nama,\n\s*status: 'active',\n\s*createdAt: Date.now\(\)\n\s*\}\);/,
  `await setDoc(doc(firestore, COLLECTIONS.SEKOLAH, newId), {
        nama: newSekolah.nama,
        emailAdmin: newSekolah.emailAdmin.trim().toLowerCase(),
        status: 'active',
        createdAt: Date.now()
      });`
);

// Update table header
content = content.replace(
  '<th className="p-4 font-semibold">Nama Sekolah</th>',
  '<th className="p-4 font-semibold">Nama Sekolah</th>\n                <th className="p-4 font-semibold">Admin Email</th>'
);

// Update table row
content = content.replace(
  '<td className="p-4 font-medium text-slate-900 dark:text-white">{sekolah.nama}</td>',
  '<td className="p-4 font-medium text-slate-900 dark:text-white">{sekolah.nama}</td>\n                    <td className="p-4 text-slate-500 text-sm">{(sekolah as any).emailAdmin || "-"}</td>'
);

fs.writeFileSync('src/components/DashboardSuperadminView.tsx', content);
