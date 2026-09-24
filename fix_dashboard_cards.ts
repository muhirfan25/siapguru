import fs from 'fs';
let content = fs.readFileSync('src/components/DashboardView.tsx', 'utf-8');

const oldCardsRegex = /\{[\s\S]*?id: "modul_ajar_ai"[\s\S]*?\},[\s\S]*?\{[\s\S]*?id: "asisten_ai"[\s\S]*?\}/;

const newCards = `{
      id: "generator_perangkat_ai",
      title: "AI Generator Perangkat",
      desc: "Hasilkan perangkat pembelajaran otomatis dengan kecerdasan buatan.",
      icon: Library,
      badge: "Kecerdasan Buatan",
      color: "bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-950/60 dark:text-fuchsia-400 border-fuchsia-200"
    },
    {
      id: "modul_ajar_ai",
      title: "Modul Ajar Deep Learning AI",
      desc: "Generator RPP Deep Learning Kurikulum Merdeka (hingga 5 pertemuan).",
      icon: Wand2,
      badge: "Kecerdasan Buatan",
      color: "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300"
    },
    {
      id: "asisten_ai",
      title: "Asisten Chatbot Guru AI",
      desc: "Konsultan pedagogi AI, pembuat soal HOTS, & draf narasi rapor.",
      icon: Bot,
      badge: "Kecerdasan Buatan",
      color: "bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400 border-violet-200"
    },
    {
      id: "bahanajar",
      title: "Bahan Ajar Digital",
      desc: "Akses bahan ajar digital interaktif untuk referensi mengajar.",
      icon: BookOpen,
      badge: "Kecerdasan Buatan",
      color: "bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 border-sky-200"
    },
    {
      id: "pabriksoal",
      title: "Pabrik Soal",
      desc: "Bank soal dan generator latihan evaluasi pembelajaran siswa.",
      icon: FileText,
      badge: "Kecerdasan Buatan",
      color: "bg-lime-50 text-lime-600 dark:bg-lime-950/60 dark:text-lime-400 border-lime-200"
    }`;

content = content.replace(oldCardsRegex, newCards);

fs.writeFileSync('src/components/DashboardView.tsx', content);
