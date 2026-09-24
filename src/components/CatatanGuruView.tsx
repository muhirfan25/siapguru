import React, { useState } from "react";
import { StickyNote, Plus, Trash2, Pencil, X, Save, CheckCircle2 } from "lucide-react";
import { CatatanGuru, Pengaturan } from "../types";
import { saveDocument, deleteDocument, COLLECTIONS } from "../lib/firebase";
import { 
  notifySimpanSuccess, 
  notifySimpanError, 
  notifyEditSuccess, 
  notifyEditError, 
  notifyHapusSuccess, 
  notifyHapusError, 
  confirmDeleteAlert 
} from "../lib/swal";

interface CatatanGuruViewProps {
  catatanList: CatatanGuru[];
  config: Pengaturan;
}

export const CatatanGuruView: React.FC<CatatanGuruViewProps> = ({
  catatanList,
  config
}) => {
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("");
  const [isi, setIsi] = useState("");
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split("T")[0]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const resetForm = () => {
    setJudul("");
    setKategori("");
    setIsi("");
    setTanggal(new Date().toISOString().split("T")[0]);
    setIsEditing(false);
    setEditId(null);
  };

  const handleSimpan = async () => {
    if (!judul || !kategori || !isi) return;

    try {
      if (isEditing && editId) {
        const dataToSave = {
          id: editId,
          judul,
          kategori,
          isi,
          tanggal,
        };
        await saveDocument(COLLECTIONS.CATATAN_GURU, editId, dataToSave);
        notifyEditSuccess("Catatan");
      } else {
        const newId = Date.now().toString();
        const dataToSave = {
          id: newId,
          judul,
          kategori,
          isi,
          tanggal,
        };
        await saveDocument(COLLECTIONS.CATATAN_GURU, newId, dataToSave);
        notifySimpanSuccess("Catatan");
      }
      resetForm();
    } catch (error) {
      console.error(error);
      if (isEditing) notifyEditError("Catatan");
      else notifySimpanError("Catatan");
    }
  };

  const handleEdit = (catatan: CatatanGuru) => {
    setJudul(catatan.judul);
    setKategori(catatan.kategori);
    setIsi(catatan.isi);
    setTanggal(catatan.tanggal || new Date().toISOString().split("T")[0]);
    setIsEditing(true);
    setEditId(catatan.id);
  };

  const handleHapus = async (id: string) => {
    const isConfirmed = await confirmDeleteAlert("Catatan");
    if (isConfirmed) {
      try {
        await deleteDocument(COLLECTIONS.CATATAN_GURU, id);
        notifyHapusSuccess("Catatan");
      } catch (error) {
        console.error(error);
        notifyHapusError("Catatan");
      }
    }
  };

  const kategoriOptions = ["Pribadi", "Akademik", "Administrasi", "Rapat", "Lainnya"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <StickyNote className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Catatan Penting Guru
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelola dan perbarui catatan penting Anda
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            {isEditing ? "Edit Catatan" : "Tambah Catatan Baru"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tanggal
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Judul Catatan
              </label>
              <input
                type="text"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Judul catatan"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Kategori
              </label>
              <div className="flex flex-wrap gap-2">
                {kategoriOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setKategori(opt)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      kategori === opt 
                      ? "bg-blue-600 text-white shadow-sm" 
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Isi Catatan
              </label>
              <textarea
                value={isi}
                onChange={(e) => setIsi(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[120px] resize-y"
                placeholder="Tulis isi catatan Anda di sini..."
              />
            </div>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSimpan}
              disabled={!judul || !kategori || !isi}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? "Perbarui Catatan" : "Simpan Catatan"}</span>
            </button>
            {isEditing && (
              <button
                onClick={resetForm}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-medium transition-all"
              >
                <X className="w-4 h-4" />
                <span>Batal</span>
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Tanggal</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Kategori</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase w-1/3">Judul</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Isi Singkat</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase w-24 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {catatanList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <StickyNote className="w-8 h-8 opacity-20" />
                      <p>Belum ada catatan penting</p>
                    </div>
                  </td>
                </tr>
              ) : (
                catatanList.map((catatan) => (
                  <tr key={catatan.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {catatan.tanggal || "-"}
                    </td>
                    <td className="p-4 text-sm text-slate-700 dark:text-slate-300">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50`}>
                        {catatan.kategori}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-900 dark:text-white">
                      {catatan.judul}
                    </td>
                    <td className="p-4 text-sm text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                      {catatan.isi}
                    </td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(catatan)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleHapus(catatan.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
