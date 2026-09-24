import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  `<KelolaSiswaView siswaList={siswaList} />`,
  `<KelolaSiswaView siswaList={siswaList} userRole={userRole} sekolahId={sekolahId} />`
);
content = content.replace(
  `<KelolaGuruView guruList={guruList} />`,
  `<KelolaGuruView guruList={guruList} userRole={userRole} sekolahId={sekolahId} />`
);

fs.writeFileSync('src/App.tsx', content);
console.log("App.tsx props updated");
