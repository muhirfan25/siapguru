import fs from 'fs';

let filepath = 'src/components/KelolaSiswaView.tsx';
let content = fs.readFileSync(filepath, 'utf-8');

const target = `            <label className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 cursor-pointer transition-colors shadow-xs">
              <Upload className="w-4 h-4" />
              <span>Import Excel</span>
              <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} />
            </label>`;
            
const replacement = `            <label className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 cursor-pointer transition-colors shadow-xs">
              <Upload className="w-4 h-4" />
              <span>Import Excel</span>
              <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} />
            </label>
            <button
              onClick={handleHapusMassal}
              className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-colors shadow-xs"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus Massal</span>
            </button>`;

content = content.replace(target, replacement);

fs.writeFileSync(filepath, content);
console.log("Patched " + filepath);

