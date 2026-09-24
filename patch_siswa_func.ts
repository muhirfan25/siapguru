import fs from 'fs';

let filepath = 'src/components/KelolaSiswaView.tsx';
let content = fs.readFileSync(filepath, 'utf-8');

const target = `  // Download XLSX template
  const downloadTemplate = () => {`;
            
const replacement = `  // Hapus Massal
  const handleHapusMassal = async () => {
    const isConfirmed = await confirmDeleteAlert("Apakah Anda yakin ingin menghapus SEMUA data siswa pada kelas ini? Tindakan ini tidak dapat dibatalkan.");
    if (isConfirmed) {
      try {
        const toDelete = filteredList; // Use filteredList because that's what's shown
        if (toDelete.length === 0) {
          notifyHapusError("Pilih kelas terlebih dahulu untuk menghapus siswanya.");
          return;
        }
        
        for (const siswa of toDelete) {
          if (userRole === 'admin_sekolah' && siswa.sekolahId !== sekolahId) {
             continue;
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

  // Download XLSX template
  const downloadTemplate = () => {`;

content = content.replace(target, replacement);

fs.writeFileSync(filepath, content);
console.log("Patched " + filepath);

