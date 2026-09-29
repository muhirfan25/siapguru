import React, { useState } from "react";
import { Users, Upload, Download, Plus, Search, Trash2, Pencil, X, Save, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import * as XLSX from "xlsx";
import { Guru } from "../types";
import { saveDocument, deleteDocument, batchSaveDocuments, COLLECTIONS } from "../lib/firebase";
import { 
  notifySimpanSuccess, 
  notifySimpanError, 
  notifyEditSuccess, 
  notifyEditError, 
  notifyHapusSuccess, 
  notifyHapusError, 
  notifyUnduhSuccess, 
  notifyUnduhError,
  confirmDeleteAlert 
} from "../lib/swal";

interface KelolaGuruViewProps {
  guruList: Guru[];
  userRole?: string | null;
  sekolahId?: string;
}

export const KelolaGuruView: React.FC<KelolaGuruViewProps> = ({ guruList, userRole, sekolahId }) => {
  const [nip, setNip] = useState("");
  const [nama, setNama] = useState("");
  const [search, setSearch] = useState("");
  
  // Edit Guru State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNip, setEditNip] = useState("");
  const [editNama, setEditNama] = useState("");

  const handleAddGuru = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nip || !nama) return;

    try {
      const newGuru: Omit<Guru, 'id'> = {
        nip,
        nama,
      };
      await saveDocument(COLLECTIONS.GURU, Date.now().toString(), { ...newGuru, sekolahId: userRole !== 'superadmin' ? sekolahId : undefined });
      setNip("");
      setNama("");
      notifySimpanSuccess("Data guru berhasil ditambahkan.");
    } catch (error) {
      console.error(error);
      notifySimpanError();
    }
  };

  const startEditing = (guru: Guru) => {
    setEditingId(guru.id);
    setEditNip(guru.nip);
    setEditNama(guru.nama);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditNip("");
    setEditNama("");
  };

  const saveEdit = async (id: string) => {
    if (!editNip || !editNama) return;
    try {
      await saveDocument(COLLECTIONS.GURU, id, { nip: editNip, nama: editNama, ...(sekolahId ? { sekolahId } : {}) });
      cancelEditing();
      notifyEditSuccess("Data guru berhasil diperbarui.");
    } catch (error) {
      console.error(error);
      notifyEditError();
    }
  };

  const handleDeleteGuru = async (id: string) => {
    const isConfirmed = await confirmDeleteAlert("Apakah Anda yakin ingin menghapus data guru ini?");
    if (!isConfirmed) return;

    try {
      await deleteDocument(COLLECTIONS.GURU, id);
      notifyHapusSuccess("Data guru berhasil dihapus.");
    } catch (error) {
      console.error(error);
      notifyHapusError();
    }
  };

  
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
        notifyHapusSuccess(`${toDelete.length} data guru berhasil dihapus.`);
      } catch (error: any) {
        console.error(error);
        notifyHapusError("Gagal menghapus data massal. Pastikan Anda memiliki akses.");
      }
    }
  };


  const handleDownloadTemplate = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet([
        { NIP: "198001012010011001", "Nama Lengkap": "Ahmad Subarjo, S.Pd" },
        { NIP: "198502022012022002", "Nama Lengkap": "Budi Santoso, M.Pd" }
      ]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Template Guru");
      XLSX.writeFile(workbook, "Template_Data_Guru.xlsx");
      notifyUnduhSuccess("Template Excel berhasil diunduh.");
    } catch (error) {
      console.error(error);
      notifyUnduhError();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        const newGurus = data.map((row: any, idx: number) => ({
          id: `guru_${Date.now()}_${idx}`,
          nip: String(row["NIP"] || row["nip"] || "").trim(),
          nama: String(row["Nama Lengkap"] || row["Nama"] || row["nama"] || "").trim(),
          sekolahId: userRole !== 'superadmin' ? sekolahId : undefined
        })).filter(guru => guru.nip && guru.nama);

        if (newGurus.length > 0) {
          await batchSaveDocuments(COLLECTIONS.GURU, newGurus);
          notifySimpanSuccess(`${newGurus.length} data guru berhasil diimpor.`);
        } else {
          notifySimpanError("Format tidak valid atau data kosong.");
        }
      } catch (error: any) {
        console.error("Excel import error:", error);
        notifySimpanError(error?.message || "Gagal menyimpan data ke database. Pastikan koneksi Firebase terhubung.");
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  const filteredGuru = guruList.filter(guru => 
    guru.nama.toLowerCase().includes(search.toLowerCase()) || 
    guru.nip.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Kelola Data Guru
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Kelola data seluruh tenaga pendidik di sekolah</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Download className="w-4 h-4" /> Template Excel
          </button>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="file"
                accept=".xlsx, .xls"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileUpload}
              />
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                <FileSpreadsheet className="w-4 h-4" /> Import Excel
              </button>
            </div>
            <button
              onClick={handleHapusMassal}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <Trash2 className="w-4 h-4" /> Hapus Massal
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Tambah Guru Baru
            </h3>
            <form onSubmit={handleAddGuru} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">NIP / NIY (Nomor Induk Pegawai / Yayasan)</label>
                <input
                  type="text"
                  required
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Contoh: 19800101... atau NIY Yayasan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Contoh: Ahmad Subarjo, S.Pd"
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                <Save className="w-4 h-4" /> Simpan Data
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari NIP / NIY atau Nama Guru..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">NIP / NIY</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Nama Lengkap</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase text-right w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredGuru.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                        Tidak ada data guru ditemukan
                      </td>
                    </tr>
                  ) : (
                    filteredGuru.map((guru) => (
                      <tr key={guru.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        {editingId === guru.id ? (
                          <>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={editNip}
                                onChange={(e) => setEditNip(e.target.value)}
                                className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded focus:outline-none"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={editNama}
                                onChange={(e) => setEditNama(e.target.value)}
                                className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded focus:outline-none"
                              />
                            </td>
                            <td className="px-4 py-2 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => saveEdit(guru.id)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded">
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                                <button onClick={cancelEditing} className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 font-mono">{guru.nip}</td>
                            <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-200">{guru.nama}</td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => startEditing(guru)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                                  title="Edit"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteGuru(guru.id)}
                                  className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
