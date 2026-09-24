import fs from 'fs';
let content = fs.readFileSync('src/components/KelolaSiswaView.tsx', 'utf-8');

// Update Interface
content = content.replace(
  `interface KelolaSiswaViewProps {\n  siswaList: Siswa[];\n}`,
  `interface KelolaSiswaViewProps {\n  siswaList: Siswa[];\n  userRole?: string | null;\n  sekolahId?: string;\n}`
);

// Update Component signature
content = content.replace(
  `export const KelolaSiswaView: React.FC<KelolaSiswaViewProps> = ({ siswaList }) => {`,
  `export const KelolaSiswaView: React.FC<KelolaSiswaViewProps> = ({ siswaList, userRole, sekolahId }) => {`
);

// Add Mass Delete Function
const handleMassDelete = `
  const handleHapusMassal = async () => {
    const isConfirmed = await confirmDeleteAlert("Apakah Anda yakin ingin menghapus SEMUA data siswa yang ditampilkan? Tindakan ini tidak dapat dibatalkan.");
    if (isConfirmed) {
      try {
        const toDelete = filteredSiswa; // Delete based on what's visible/filtered or everything.
        if (toDelete.length === 0) return;
        
        for (const siswa of toDelete) {
          if (userRole === 'admin_sekolah' && siswa.sekolahId !== sekolahId) {
             continue; // security check frontend
          }
          await deleteDocument(COLLECTIONS.SISWA, siswa.id);
        }
        notifyHapusSuccess(\`\${toDelete.length} data siswa berhasil dihapus.\`);
      } catch (error: any) {
        console.error(error);
        notifyHapusError("Gagal menghapus data massal. Pastikan Anda memiliki akses.");
      }
    }
  };
`;
content = content.replace(
  `const handleDownloadTemplate = () => {`,
  `${handleMassDelete}\n\n  const handleDownloadTemplate = () => {`
);

// Add Mass Delete Button to UI
const buttonsUI = `
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
              <FileSpreadsheet className="w-4 h-4" /> Import Excel
            </button>
`;
const newButtonsUI = `
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
              <FileSpreadsheet className="w-4 h-4" /> Import Excel
            </button>
            <button
              onClick={handleHapusMassal}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm ml-3"
            >
              <Trash2 className="w-4 h-4" /> Hapus Massal
            </button>
`;
content = content.replace(buttonsUI, newButtonsUI);

// Fix Excel Import to include sekolahId
const excelImportTarget = `        const newSiswa = data.map((row: any, idx: number) => ({\n          id: \`siswa_\${Date.now()}_\${idx}\`,\n          nisn: String(row["NISN"] || row["nisn"] || "").trim(),\n          nama: String(row["Nama Lengkap"] || row["Nama"] || row["nama"] || "").trim(),\n          kelas: String(row["Kelas"] || row["kelas"] || "").trim()\n        })).filter(siswa => siswa.nisn && siswa.nama && siswa.kelas);`;
const excelImportReplace = `        const newSiswa = data.map((row: any, idx: number) => ({\n          id: \`siswa_\${Date.now()}_\${idx}\`,\n          nisn: String(row["NISN"] || row["nisn"] || "").trim(),\n          nama: String(row["Nama Lengkap"] || row["Nama"] || row["nama"] || "").trim(),\n          kelas: String(row["Kelas"] || row["kelas"] || "").trim(),\n          sekolahId: userRole !== 'superadmin' ? sekolahId : undefined\n        })).filter(siswa => siswa.nisn && siswa.nama && siswa.kelas);`;
content = content.replace(excelImportTarget, excelImportReplace);

// Fix add siswa
content = content.replace(
  `await saveDocument(COLLECTIONS.SISWA, Date.now().toString(), newSiswa);`,
  `await saveDocument(COLLECTIONS.SISWA, Date.now().toString(), { ...newSiswa, sekolahId: userRole !== 'superadmin' ? sekolahId : undefined });`
)

fs.writeFileSync('src/components/KelolaSiswaView.tsx', content);
console.log("KelolaSiswaView patched");
