import fs from 'fs';
let content = fs.readFileSync('src/components/DashboardSuperadminView.tsx', 'utf-8');

// 1. Add import for firebaseConfig
content = content.replace(
  "import { firestore, COLLECTIONS } from '../lib/firebase';",
  "import { firestore, COLLECTIONS, firebaseConfig } from '../lib/firebase';"
);

// 2. Add password state
content = content.replace(
  "const [newSekolah, setNewSekolah] = useState({ nama: '', emailAdmin: '' });",
  "const [newSekolah, setNewSekolah] = useState({ nama: '', emailAdmin: '', passwordAdmin: '' });\n  const [isAdding, setIsAdding] = useState(false);"
);

// 3. Update handleAddSekolah to call REST API
const addFunctionRegex = /const handleAddSekolah = async \([^)]*\) => \{[\s\S]*?Swal\.fire\('Berhasil', 'Sekolah berhasil ditambahkan', 'success'\);[\s\S]*?setNewSekolah\(\{ nama: '', emailAdmin: '' \}\);[\s\S]*?fetchSekolah\(\);\n    \} catch \(error\) \{[\s\S]*?\}\n  \};/;

const newAddFunction = `const handleAddSekolah = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSekolah.nama || !newSekolah.emailAdmin || !newSekolah.passwordAdmin) {
      Swal.fire('Error', 'Harap isi semua kolom', 'error');
      return;
    }
    setIsAdding(true);
    try {
      const newId = 'sekolah_' + Date.now();
      
      // Create Firebase Auth user using REST API to prevent logging out current superadmin
      const res = await fetch(\`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=\${firebaseConfig.apiKey}\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newSekolah.emailAdmin.trim().toLowerCase(),
          password: newSekolah.passwordAdmin,
          returnSecureToken: true
        })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Gagal membuat akun Admin');
      }
      
      const adminUid = data.localId;

      // Add Sekolah
      await setDoc(doc(firestore, COLLECTIONS.SEKOLAH, newId), {
        nama: newSekolah.nama,
        status: 'active',
        createdAt: Date.now()
      });

      // Add Admin document
      await setDoc(doc(firestore, COLLECTIONS.USERS, adminUid), {
        email: newSekolah.emailAdmin.trim().toLowerCase(),
        role: 'admin_sekolah',
        sekolahId: newId,
        updatedAt: Date.now()
      });

      Swal.fire('Berhasil', 'Sekolah dan Admin berhasil ditambahkan', 'success');
      setShowAddModal(false);
      setNewSekolah({ nama: '', emailAdmin: '', passwordAdmin: '' });
      fetchSekolah();
    } catch (error: any) {
      Swal.fire('Error', error.message || 'Gagal menambahkan sekolah', 'error');
    } finally {
      setIsAdding(false);
    }
  };`;

content = content.replace(addFunctionRegex, newAddFunction);

// 4. Update the form to include email and password fields
const formRegex = /<form onSubmit=\{handleAddSekolah\} className="p-6 space-y-4">[\s\S]*?<\/form>/;
const newForm = `<form onSubmit={handleAddSekolah} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Sekolah</label>
                <input 
                  type="text" required
                  value={newSekolah.nama} onChange={e => setNewSekolah({...newSekolah, nama: e.target.value})}
                  className="w-full px-4 py-2 border rounded-xl" placeholder="Contoh: SMAN 1 Jakarta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Admin Sekolah</label>
                <input 
                  type="email" required
                  value={newSekolah.emailAdmin} onChange={e => setNewSekolah({...newSekolah, emailAdmin: e.target.value})}
                  className="w-full px-4 py-2 border rounded-xl" placeholder="admin@sekolah.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password Admin</label>
                <input 
                  type="password" required
                  value={newSekolah.passwordAdmin} onChange={e => setNewSekolah({...newSekolah, passwordAdmin: e.target.value})}
                  className="w-full px-4 py-2 border rounded-xl" placeholder="Minimal 6 karakter"
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Batal</button>
                <button type="submit" disabled={isAdding} className="px-4 py-2 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 font-medium disabled:opacity-50">
                  {isAdding ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>`;

content = content.replace(formRegex, newForm);

fs.writeFileSync('src/components/DashboardSuperadminView.tsx', content);
