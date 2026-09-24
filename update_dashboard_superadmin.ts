import fs from 'fs';

let content = fs.readFileSync('src/components/DashboardSuperadminView.tsx', 'utf-8');

// 1. Update imports
content = content.replace(
  "import { Building2, Users, Shield, Plus, Lock, Unlock, Search, CheckCircle, XCircle } from 'lucide-react';",
  "import { Building2, Users, Shield, Plus, Lock, Unlock, Search, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react';"
);

content = content.replace(
  "import { collection, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';",
  "import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';"
);

// 2. Add state for edit
content = content.replace(
  "const [isAdding, setIsAdding] = useState(false);",
  "const [isAdding, setIsAdding] = useState(false);\n  const [showEditModal, setShowEditModal] = useState(false);\n  const [editingSekolah, setEditingSekolah] = useState<{id: string, nama: string, emailAdmin: string} | null>(null);"
);

// 3. Add handleUpdateSekolah and handleDeleteSekolah
const newFunctions = `
  const handleUpdateSekolah = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSekolah) return;
    try {
      await updateDoc(doc(firestore, COLLECTIONS.SEKOLAH, editingSekolah.id), {
        nama: editingSekolah.nama,
        emailAdmin: editingSekolah.emailAdmin.trim().toLowerCase()
      });
      Swal.fire('Berhasil', 'Data sekolah diperbarui', 'success');
      setShowEditModal(false);
      setEditingSekolah(null);
      fetchSekolah();
    } catch (error: any) {
      Swal.fire('Error', 'Gagal memperbarui sekolah', 'error');
    }
  };

  const handleDeleteSekolah = async (id: string) => {
    const result = await Swal.fire({
      title: 'Hapus Sekolah?',
      text: "Semua data yang terkait dengan sekolah ini mungkin harus dihapus manual. Lanjutkan?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!'
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(firestore, COLLECTIONS.SEKOLAH, id));
        Swal.fire('Terhapus!', 'Sekolah telah dihapus.', 'success');
        fetchSekolah();
      } catch (error) {
        Swal.fire('Error', 'Gagal menghapus sekolah', 'error');
      }
    }
  };
`;

content = content.replace(
  "const fetchSekolah = async () => {",
  newFunctions + "\n  const fetchSekolah = async () => {"
);

// 4. Update the Action column
const oldActionCell = `<td className="p-4 text-right">
                      <button 
                        onClick={() => toggleStatus(sekolah.id, sekolah.status)}
                        className={\`p-2 rounded-lg \${sekolah.status === 'active' ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'}\`}
                        title={sekolah.status === 'active' ? 'Blokir Sekolah' : 'Aktifkan Sekolah'}
                      >
                        {sekolah.status === 'active' ? <Lock size={18} /> : <Unlock size={18} />}
                      </button>
                    </td>`;

const newActionCell = `<td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setEditingSekolah({
                              id: sekolah.id, 
                              nama: sekolah.nama, 
                              emailAdmin: (sekolah as any).emailAdmin || ''
                            });
                            setShowEditModal(true);
                          }}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                          title="Edit Sekolah"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => toggleStatus(sekolah.id, sekolah.status)}
                          className={\`p-2 rounded-lg \${sekolah.status === 'active' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}\`}
                          title={sekolah.status === 'active' ? 'Blokir Sekolah' : 'Aktifkan Sekolah'}
                        >
                          {sekolah.status === 'active' ? <Lock size={18} /> : <Unlock size={18} />}
                        </button>
                        <button 
                          onClick={() => handleDeleteSekolah(sekolah.id)}
                          className="p-2 rounded-lg text-rose-600 hover:bg-rose-50"
                          title="Hapus Sekolah"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>`;

content = content.replace(oldActionCell, newActionCell);

// 5. Add edit modal JSX
const editModalJSX = `
      {showEditModal && editingSekolah && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edit Sekolah</h3>
            </div>
            <form onSubmit={handleUpdateSekolah} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Sekolah</label>
                <input 
                  type="text" required
                  value={editingSekolah.nama} onChange={e => setEditingSekolah({...editingSekolah, nama: e.target.value})}
                  className="w-full px-4 py-2 border rounded-xl" placeholder="Contoh: SMAN 1 Jakarta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Admin Sekolah</label>
                <input 
                  type="email" required
                  value={editingSekolah.emailAdmin} onChange={e => setEditingSekolah({...editingSekolah, emailAdmin: e.target.value})}
                  className="w-full px-4 py-2 border rounded-xl" placeholder="admin@sekolah.com"
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Batal</button>
                <button type="submit" className="px-4 py-2 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 font-medium">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};`;

content = content.replace(/    <\/div>\n  \);\n};\s*$/, editModalJSX);

fs.writeFileSync('src/components/DashboardSuperadminView.tsx', content);
