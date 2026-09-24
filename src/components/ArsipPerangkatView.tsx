import React, { useState } from "react";
import { Archive, Trash2, Pencil, X, Save, ExternalLink } from "lucide-react";
import { ArsipPerangkat, Pengaturan } from "../types";
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

interface ArsipPerangkatViewProps {
  arsipList: ArsipPerangkat[];
  config: Pengaturan;
}

export const ArsipPerangkatView: React.FC<ArsipPerangkatViewProps> = ({
  arsipList,
  config
}) => {
  const [namaArsip, setNamaArsip] = useState("");
  const [url, setUrl] = useState("");
  
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const resetForm = () => {
    setNamaArsip("");
    setUrl("");
    setIsEditing(false);
    setEditId(null);
  };

  const handleSimpan = async () => {
    if (!namaArsip || !url) return;

    try {
      if (isEditing && editId) {
        const dataToSave = {
          id: editId,
          namaArsip,
          url,
          namaPengunggah: config.Nama_Guru || "Guru",
          tanggal: new Date().toISOString().split("T")[0],
        };
        await saveDocument(COLLECTIONS.ARSIP_PERANGKAT, editId, dataToSave);
        notifyEditSuccess("Arsip Perangkat");
      } else {
        const newId = Date.now().toString();
        const dataToSave = {
          id: newId,
          namaArsip,
          url,
          namaPengunggah: config.Nama_Guru || "Guru",
          tanggal: new Date().toISOString().split("T")[0],
        };
        await saveDocument(COLLECTIONS.ARSIP_PERANGKAT, newId, dataToSave);
        notifySimpanSuccess("Arsip Perangkat");
      }
      resetForm();
    } catch (error) {
      console.error(error);
      if (isEditing) notifyEditError("Arsip Perangkat");
      else notifySimpanError("Arsip Perangkat");
    }
  };

  const handleEdit = (arsip: ArsipPerangkat) => {
    setNamaArsip(arsip.namaArsip);
    setUrl(arsip.url);
    setIsEditing(true);
    setEditId(arsip.id);
  };

  const handleHapus = async (id: string) => {
    const isConfirmed = await confirmDeleteAlert("Arsip Perangkat");
    if (isConfirmed) {
      try {
        await deleteDocument(COLLECTIONS.ARSIP_PERANGKAT, id);
        notifyHapusSuccess("Arsip Perangkat");
      } catch (error) {
        console.error(error);
        notifyHapusError("Arsip Perangkat");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Archive className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Arsip Perangkat Pembelajaran
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelola dan simpan tautan repositori perangkat ajar Anda (misal: link Google Drive)
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            {isEditing ? "Edit Tautan Arsip" : "Tambah Tautan Arsip Baru"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nama Arsip Dokumen
              </label>
              <input
                type="text"
                value={namaArsip}
                onChange={(e) => setNamaArsip(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Misal: Arsip RPP MATEMATIKA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                URL Dokumen (Drive)
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="https://drive.google.com/..."
              />
            </div>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSimpan}
              disabled={!namaArsip || !url}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? "Perbarui Arsip" : "Simpan Arsip"}</span>
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
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Nama Arsip</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Tautan Berkas</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Nama Pengunggah</th>
                <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase w-24 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {arsipList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Archive className="w-8 h-8 opacity-20" />
                      <p>Belum ada tautan arsip perangkat yang ditambahkan</p>
                    </div>
                  </td>
                </tr>
              ) : (
                arsipList.map((arsip) => (
                  <tr key={arsip.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {arsip.tanggal || "-"}
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-900 dark:text-white">
                      {arsip.namaArsip}
                    </td>
                    <td className="p-4 text-sm">
                      <a 
                        href={arsip.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:underline hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors max-w-[250px] truncate"
                        title={arsip.url}
                      >
                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{arsip.url}</span>
                      </a>
                    </td>
                    <td className="p-4 text-sm text-slate-700 dark:text-slate-300">
                      {arsip.namaPengunggah}
                    </td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(arsip)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleHapus(arsip.id)}
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
