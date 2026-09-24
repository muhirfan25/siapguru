import fs from 'fs';
let content = fs.readFileSync('src/components/KelolaGuruView.tsx', 'utf-8');

// Update Interface
content = content.replace(
  `interface KelolaGuruViewProps {\n  guruList: Guru[];\n}`,
  `interface KelolaGuruViewProps {\n  guruList: Guru[];\n  userRole?: string | null;\n  sekolahId?: string;\n}`
);

// Update Component signature
content = content.replace(
  `export const KelolaGuruView: React.FC<KelolaGuruViewProps> = ({ guruList }) => {`,
  `export const KelolaGuruView: React.FC<KelolaGuruViewProps> = ({ guruList, userRole, sekolahId }) => {`
);

// Add Mass Delete Function
const handleMassDelete = `
  const handleHapusMassal = async () => {
    const isConfirmed = await confirmDeleteAlert("Apakah Anda yakin ingin menghapus SEMUA data guru yang ditampilkan? Tindakan ini tidak dapat dibatalkan.");
    if (isConfirmed) {
      try {
        const toDelete = filteredGuru; // Delete based on what's visible/filtered or everything.
        if (toDelete.length === 0) return;
        
        // chunk the deletions if there are many
        // For simplicity, delete one by one or in batches (deleteDocument doesn't batch but we can loop)
        for (const guru of toDelete) {
          if (userRole === 'admin_sekolah' && guru.sekolahId !== sekolahId) {
             continue; // security check frontend
          }
          await deleteDocument(COLLECTIONS.GURU, guru.id);
        }
        notifyHapusSuccess(\`\${toDelete.length} data guru berhasil dihapus.\`);
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
const excelImportTarget = `        const newGurus = data.map((row: any, idx: number) => ({\n          id: \`guru_\${Date.now()}_\${idx}\`,\n          nip: String(row["NIP"] || row["nip"] || "").trim(),\n          nama: String(row["Nama Lengkap"] || row["Nama"] || row["nama"] || "").trim()\n        })).filter(guru => guru.nip && guru.nama);`;
const excelImportReplace = `        const newGurus = data.map((row: any, idx: number) => ({\n          id: \`guru_\${Date.now()}_\${idx}\`,\n          nip: String(row["NIP"] || row["nip"] || "").trim(),\n          nama: String(row["Nama Lengkap"] || row["Nama"] || row["nama"] || "").trim(),\n          sekolahId: userRole !== 'superadmin' ? sekolahId : undefined\n        })).filter(guru => guru.nip && guru.nama);`;
content = content.replace(excelImportTarget, excelImportReplace);

// Fix add guru
content = content.replace(
  `await saveDocument(COLLECTIONS.GURU, Date.now().toString(), newGuru);`,
  `await saveDocument(COLLECTIONS.GURU, Date.now().toString(), { ...newGuru, sekolahId: userRole !== 'superadmin' ? sekolahId : undefined });`
)

fs.writeFileSync('src/components/KelolaGuruView.tsx', content);
console.log("KelolaGuruView patched");
