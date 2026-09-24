import fs from 'fs';

function patchFile(filepath: string) {
  let content = fs.readFileSync(filepath, 'utf-8');
  
  const target = `          <div className="relative">
            <input
              type="file"
              accept=".xlsx, .xls"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileUpload}
            />
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
              <FileSpreadsheet className="w-4 h-4" /> Import Excel
            </button>
            <button
              onClick={handleHapusMassal}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm ml-3"
            >
              <Trash2 className="w-4 h-4" /> Hapus Massal
            </button>
          </div>`;
          
  const replacement = `          <div className="flex items-center gap-3">
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
          </div>`;
          
  if (content.includes('Hapus Massal')) {
      content = content.replace(target, replacement);
      fs.writeFileSync(filepath, content);
      console.log("Patched " + filepath);
  }
}

patchFile('src/components/KelolaGuruView.tsx');
patchFile('src/components/KelolaSiswaView.tsx');

