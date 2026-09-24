import React, { useState } from "react";
import { KeyRound, Shield, Search, CheckCircle2, Pencil, X } from "lucide-react";
import { Guru } from "../types";
import { saveDocument, COLLECTIONS } from "../lib/firebase";
import { notifyEditSuccess, notifyEditError } from "../lib/swal";

interface KontrolSandiViewProps {
  guruList: Guru[];
}

export const KontrolSandiView: React.FC<KontrolSandiViewProps> = ({ guruList }) => {
  const [search, setSearch] = useState("");
  
  // Edit Password State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPassword, setEditPassword] = useState("");

  const startEditing = (guru: Guru) => {
    setEditingId(guru.id);
    setEditPassword(guru.password || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditPassword("");
  };

  const saveEdit = async (id: string) => {
    try {
      await saveDocument(COLLECTIONS.GURU, id, { password: editPassword });
      cancelEditing();
      notifyEditSuccess("Sandi akun berhasil diperbarui.");
    } catch (error) {
      console.error(error);
      notifyEditError();
    }
  };

  const filteredGuru = guruList.filter(guru => 
    guru.nama.toLowerCase().includes(search.toLowerCase()) || 
    guru.nip.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Kontrol Sandi Akun
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manajemen akses masuk sistem (Login) khusus guru.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari NIP atau Nama Guru..."
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
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">NIP</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Nama Lengkap</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Password Akses</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase text-right w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredGuru.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                    Tidak ada data guru ditemukan. Tambahkan data guru terlebih dahulu.
                  </td>
                </tr>
              ) : (
                filteredGuru.map((guru) => (
                  <tr key={guru.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 font-mono">{guru.nip}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-200">{guru.nama}</td>
                    
                    {editingId === guru.id ? (
                      <>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={editPassword}
                            onChange={(e) => setEditPassword(e.target.value)}
                            placeholder="Set password..."
                            className="w-full max-w-[200px] px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                        <td className="px-4 py-3 text-sm">
                          {guru.password ? (
                            <span className="text-slate-800 dark:text-slate-200 font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                              {guru.password}
                            </span>
                          ) : (
                            <span className="text-rose-500 text-xs font-semibold bg-rose-50 dark:bg-rose-900/30 px-2 py-1 rounded">
                              Belum Diset
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end">
                            <button
                              onClick={() => startEditing(guru)}
                              className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded flex items-center gap-1 text-xs font-semibold"
                            >
                              <KeyRound className="w-3.5 h-3.5" /> Ubah Sandi
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
  );
};
