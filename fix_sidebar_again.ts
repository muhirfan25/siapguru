import fs from 'fs';
let content = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');

// I'll manually replace the KECERDASAN BUATAN part for BOTH roles
const oldAI1 = `{ isHeader: true, label: 'KECERDASAN BUATAN (AI)' },
      { id: 'asisten_ai', label: 'AI Asisten Guru', icon: Sparkles, highlight: true },
      { id: 'modul_ajar_ai', label: 'AI Modul Ajar', icon: BrainCircuit, highlight: true },
      { id: 'generator_perangkat_ai', label: 'AI Generator Perangkat', icon: Library, highlight: true },
    ];`;

const newAI1 = `{ isHeader: true, label: 'KECERDASAN BUATAN (AI)' },
      { id: 'generator_perangkat_ai', label: 'AI Generator Perangkat', icon: Library, highlight: true },
      { id: 'modul_ajar_ai', label: 'AI Modul Ajar', icon: BrainCircuit, highlight: true },
      { id: 'asisten_ai', label: 'AI Asisten Guru', icon: Sparkles, highlight: true },
      { id: 'bahanajar', label: 'Bahan Ajar Digital', icon: BookOpen, highlight: true },
      { id: 'pabriksoal', label: 'Pabrik Soal', icon: FileSpreadsheet, highlight: true },

      { isHeader: true, label: 'SISTEM & OUTPUT' },
      { id: 'laporan', label: 'Pusat Laporan', icon: FileSpreadsheet },
      { id: 'pengaturan', label: 'Pengaturan & Profil', icon: Settings },
    ];`;
    
const oldAI2 = `{ isHeader: true, label: 'KECERDASAN BUATAN (AI)' },
      { id: 'asisten_ai', label: 'Tanya Asisten AI', icon: Sparkles, highlight: true },
      { id: 'modul_ajar_ai', label: 'Buat Modul AI', icon: BrainCircuit, highlight: true },
      { id: 'generator_perangkat_ai', label: 'Generator Perangkat AI', icon: Library, highlight: true },
    ];`;

const newAI2 = `{ isHeader: true, label: 'KECERDASAN BUATAN (AI)' },
      { id: 'generator_perangkat_ai', label: 'Generator Perangkat AI', icon: Library, highlight: true },
      { id: 'modul_ajar_ai', label: 'Buat Modul AI', icon: BrainCircuit, highlight: true },
      { id: 'asisten_ai', label: 'Tanya Asisten AI', icon: Sparkles, highlight: true },
      { id: 'bahanajar', label: 'Bahan Ajar Digital', icon: BookOpen, highlight: true },
      { id: 'pabriksoal', label: 'Pabrik Soal', icon: FileSpreadsheet, highlight: true },
    ];`;

content = content.replace(oldAI1, newAI1);
// For oldAI2 I might need to find the correct string
let oldAI2_alternate = `{ id: 'asisten_ai', label: 'Tanya Asisten AI', icon: Sparkles, highlight: true },
      { id: 'modul_ajar_ai', label: 'Buat Modul AI', icon: BrainCircuit, highlight: true },
      { id: 'generator_perangkat_ai', label: 'Generator Perangkat AI', icon: Library, highlight: true },
    ];`;
    
content = content.replace(oldAI2_alternate, `
      { isHeader: true, label: 'KECERDASAN BUATAN (AI)' },
      { id: 'generator_perangkat_ai', label: 'Generator Perangkat AI', icon: Library, highlight: true },
      { id: 'modul_ajar_ai', label: 'Buat Modul AI', icon: BrainCircuit, highlight: true },
      { id: 'asisten_ai', label: 'Tanya Asisten AI', icon: Sparkles, highlight: true },
      { id: 'bahanajar', label: 'Bahan Ajar Digital', icon: BookOpen, highlight: true },
      { id: 'pabriksoal', label: 'Pabrik Soal', icon: FileSpreadsheet, highlight: true },
    ];`);
    
// We also need to remove the old "Pusat Laporan" and "Pengaturan" from the MANAJEMEN/AKADEMIK section for superadmin
content = content.replace("{ id: 'pengaturan', label: 'Pengaturan', icon: Settings },", "");
content = content.replace("{ id: 'laporan', label: 'Pusat Laporan', icon: FileSpreadsheet },", "");

fs.writeFileSync('src/components/Sidebar.tsx', content);
