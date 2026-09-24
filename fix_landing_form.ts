import fs from 'fs';
let content = fs.readFileSync('src/components/LandingPageView.tsx', 'utf-8');
const search = '<label className="block text-sm font-semibold text-slate-700 mb-1">Alamat Email</label>';
const replacement = '<label className="block text-sm font-semibold text-slate-700 mb-1">Asal Sekolah</label><input type="text" required value={regData.asalSekolah} onChange={(e) => setRegData({...regData, asalSekolah: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all mb-4" placeholder="Nama Sekolah" />\n                <label className="block text-sm font-semibold text-slate-700 mb-1">Alamat Email</label>';
content = content.replace(search, replacement);
fs.writeFileSync('src/components/LandingPageView.tsx', content);
