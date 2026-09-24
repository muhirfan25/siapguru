import React from 'react';
import { 
  GraduationCap,
  KeyRound,
  Presentation,
  Sparkles,
  Play,
  Users,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileEdit,
  BookMarked,
  Shield,
  FileText,
  Brain,
  Bot,
  Clock,
  MonitorPlay,
  TestTube,
  Printer,
  Sliders,
  Check,
  Star,
  CheckCircle2,
  Zap,
  ArrowRight
} from 'lucide-react';
import { SiapGuruLogo } from './SiapGuruLogo';

interface LandingPageViewProps {
  onLoginClick: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onLoginClick }) => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = React.useState(false);
  const [regData, setRegData] = React.useState({
    nama: "",
    noHp: "",
    email: "",
    asalSekolah: "",
    jenisKelamin: "Laki-laki",
    paket: "Personal (Rp 99.000)"
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Halo Admin, saya ingin mendaftar aplikasi SIAP GURU.

Berikut data pendaftaran saya:
- Nama: ${regData.nama}\n- Asal Sekolah: ${regData.asalSekolah}
- No HP/WA: ${regData.noHp}
- Email: ${regData.email}
- Jenis Kelamin: ${regData.jenisKelamin}
- Pilihan Paket: ${regData.paket}

Untuk transfer pendaftaran dapat dilakukan ke:
BRI 022301014562531 AN. MUH IRFAN
DANA: 085255700081

Apabila sudah transfer silahkan konfirmasi ya kak, jangan lupa lampirkan tanda bukti, terima kasih semoga kakak dapat manfaat yang banyak dari aplikasi ini.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/6285255700081?text=${encodedMessage}`, "_blank");
    setIsRegisterModalOpen(false);
  };
  return (
    <div className="bg-slate-50 text-slate-800 antialiased font-sans selection:bg-indigo-100 selection:text-indigo-900 scroll-smooth">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SiapGuruLogo size="sm" variant="icon" />
            <span className="text-xl font-extrabold text-blue-600 tracking-tight flex items-center gap-1.5">
              SIAP GURU
              <span className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.7)]"></span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
            <a href="#fitur-ai" className="hover:text-blue-600 transition-colors flex items-center gap-1.5 text-blue-600 font-semibold bg-blue-50 border border-blue-200/60 px-3 py-1 rounded-full">
              <Sparkles className="w-4 h-4 text-blue-600" /> Fitur AI
            </a>
            <a href="#utama" className="hover:text-blue-600 transition-colors">Manajemen</a>
            <a href="#akademik" className="hover:text-blue-600 transition-colors">Akademik</a>
            <a href="#output" className="hover:text-blue-600 transition-colors">Sistem & Output</a>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-200/80 text-indigo-900 shadow-xs">
              <SiapGuruLogo size="xs" variant="icon" showSparkle={false} />
              <span className="text-xs font-extrabold tracking-tight">SG</span>
            </div>
            <button onClick={() => setIsRegisterModalOpen(true)} className="hidden sm:block px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-xl transition-all cursor-pointer">Daftar</button>
            <button onClick={onLoginClick} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] cursor-pointer">Masuk</button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-24 overflow-hidden">
        {/* Aesthetic background glows */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Compelling Sales & Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-200 text-indigo-900 text-xs sm:text-sm font-bold shadow-xs">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Asisten Cerdas #1 Pendidik Indonesia &bull; Berbasis AI Terpadu</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
                Hentikan Lembur Administrasi.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700">
                  Jadilah Guru yang Selalu SIAP!
                </span>
              </h1>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white text-xs font-bold tracking-wide uppercase">SIAP GURU</span>
                  <span className="text-base sm:text-lg font-bold text-slate-800">Sistem Informasi Administrasi &amp; Perangkat Guru</span>
                </div>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Solusi <em>all-in-one</em> terpadu agar guru selalu <strong>siap mengajar di kelas</strong>, <strong>siap menghadapi supervisi</strong>, dan berkas administrasi <strong>selalu siap cetak</strong> kapan saja tanpa lembur mendadak. Rancang Modul Ajar Deep Learning, CP-TP-ATP, presensi, hingga cetak laporan resmi ber-KOP A4 hanya dalam hitungan detik.
                </p>
              </div>

              {/* Value Pills Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-xs">
                  <Zap className="w-5 h-5 text-amber-500 shrink-0" />
                  <span>5 Menit Rancang Perangkat Ajar</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-xs">
                  <Printer className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>Cetak PDF Resmi A4 Ber-KOP Sekolah</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>100% Pedoman Kurikulum Merdeka</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-xs">
                  <Clock className="w-5 h-5 text-purple-600 shrink-0" />
                  <span>Hemat 15+ Jam Waktu Setiap Minggu</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <button 
                  onClick={() => setIsRegisterModalOpen(true)} 
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold rounded-xl shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.99] text-center cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Daftar Sekarang</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <a 
                  href="#fitur-ai" 
                  className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-indigo-50/60 border border-indigo-200 text-slate-800 font-bold rounded-xl transition-all text-center flex items-center justify-center gap-2 shadow-xs cursor-pointer hover:border-indigo-300"
                >
                  <Play className="w-4 h-4 text-indigo-600" fill="currentColor" /> 
                  <span>Eksplorasi Fitur AI</span>
                </a>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600" /> Tanpa Instalasi Software
                </span>
                <span className="text-slate-300">&bull;</span>
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600" /> Akses Cloud Laptop & HP
                </span>
                <span className="text-slate-300">&bull;</span>
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600" /> Dukungan Teknis 24/7
                </span>
              </div>
            </div>

            {/* Right Column: Aesthetic SIAP GURU (SG) Showcase Emblem */}
            <div className="lg:col-span-5 flex justify-center relative">
              {/* Outer decorative card */}
              <div className="w-full max-w-md relative bg-gradient-to-br from-white/95 via-indigo-50/40 to-white/95 backdrop-blur-xl border border-indigo-100/90 rounded-3xl p-7 sm:p-8 shadow-2xl shadow-indigo-500/15 relative overflow-hidden group">
                
                {/* Ambient glow effect inside card */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-cyan-400/20 via-blue-500/20 to-purple-500/30 rounded-full blur-2xl pointer-events-none group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-300/20 rounded-full blur-2xl pointer-events-none"></div>

                {/* Top Corner Badge: SG Verified */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-indigo-100/80">
                  <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Sistem Aktif & Terintegrasi
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200/80">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>SG Official</span>
                  </div>
                </div>

                {/* Center Showcase: Aesthetic Large SG Logo */}
                <div className="flex flex-col items-center text-center my-4">
                  <div className="relative mb-5 transform transition-transform duration-300 group-hover:scale-105">
                    <SiapGuruLogo size="2xl" variant="icon" showSparkle={true} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    SIAP GURU
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                      SG
                    </span>
                  </h3>
                  <p className="text-xs text-indigo-600 font-semibold mt-1">
                    Smart Teacher Copilot &amp; Multi-Tenant EdAdmin
                  </p>
                </div>

                {/* Micro Metrics & Features */}
                <div className="space-y-2.5 mt-6 pt-5 border-t border-indigo-100/80">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        <Brain className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-900">Generator AI Deep Learning</p>
                        <p className="text-[10px] text-slate-500">CP, TP, ATP, Prota &amp; Modul Ajar</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Instan</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                        <Printer className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-900">Format Cetak Resmi A4</p>
                        <p className="text-[10px] text-slate-500">Kop Surat, Logo &amp; TTD Kepala Sekolah</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">1-Klik</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                        <ClipboardCheck className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-900">Presensi &amp; Rekap Nilai Otomatis</p>
                        <p className="text-[10px] text-slate-500">Kalkulasi Rapor &amp; Ledger Presisi</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">Otomatis</span>
                  </div>
                </div>

                {/* Bottom Trust Tagline */}
                <div className="mt-5 text-center bg-indigo-50/60 p-2.5 rounded-xl border border-indigo-100">
                  <p className="text-[11px] font-medium text-indigo-900">
                    ✨ <em>"Mengajar dengan tenang, administrasi selalu siap di genggaman."</em>
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* KECERDASAN BUATAN (AI) SECTION */}
      <section id="fitur-ai" className="py-20 bg-gradient-to-b from-indigo-50/80 via-blue-50/50 to-indigo-50/80 text-slate-900 relative overflow-hidden border-b border-indigo-100">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-200/50 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-200/50 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-4 py-1.5 rounded-full bg-white border border-indigo-200 text-indigo-700 text-sm font-semibold inline-flex items-center gap-2 shadow-xs">
              <Sparkles className="w-4 h-4 text-indigo-600" /> Artificial Intelligence Tools
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">Kecerdasan Buatan Pendamping Guru</h2>
            <p className="text-slate-600 mt-2 text-base">Buat dokumen administrasi rumit secara instan dan presisi hanya dengan hitungan detik.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Feature 1 */}
            <div className="bg-white/95 backdrop-blur-sm border border-indigo-100 hover:border-indigo-300 hover:shadow-lg transition-all p-6 rounded-2xl relative flex flex-col justify-between shadow-xs group">
              <div>
                <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Generator Perangkat Ajar AI</h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  Buat 6 dokumen lengkap sekaligus: <span className="text-indigo-600 font-semibold">Analisis CP, TP, ATP, Prota, Prosem, dan KKTP</span> secara presisi.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium pt-4 border-t border-slate-100">
                <span className="bg-indigo-50 px-2.5 py-1 rounded text-indigo-700 border border-indigo-200/70 font-semibold">PDF A4</span>
                <span className="bg-indigo-50 px-2.5 py-1 rounded text-indigo-700 border border-indigo-200/70 font-semibold">Word (.doc)</span>
              </div>
            </div>

            {/* AI Feature 2 */}
            <div className="bg-white/95 backdrop-blur-sm border border-indigo-100 hover:border-indigo-300 hover:shadow-lg transition-all p-6 rounded-2xl shadow-xs group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Generator Modul Ajar (Deep Learning)</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Susun Modul Ajar berdiferensiasi dan mendalam sesuai struktur Kurikulum Merdeka hanya dari topik materi Anda.
                </p>
              </div>
            </div>

            {/* AI Feature 3 */}
            <div className="bg-white/95 backdrop-blur-sm border border-indigo-100 hover:border-indigo-300 hover:shadow-lg transition-all p-6 rounded-2xl shadow-xs group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center text-white mb-4 shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Asisten AI Pendamping Guru</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Mitra diskusi cerdas 24/7 untuk konsultasi metode pedagogi, penanganan masalah siswa, dan ide aktivitas kelas.
                </p>
              </div>
            </div>

            {/* AI Feature 4 */}
            <div className="bg-white/95 backdrop-blur-sm border border-indigo-100 hover:border-indigo-300 hover:shadow-lg transition-all p-6 rounded-2xl shadow-xs group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                  <MonitorPlay className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Generator Bahan Ajar Digital</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Ubah ringkasan materi menjadi bahan tayang presentasi, komik edukasi, atau bahan bacaan interaktif.
                </p>
              </div>
            </div>

            {/* AI Feature 5 */}
            <div className="bg-white/95 backdrop-blur-sm border border-indigo-100 hover:border-indigo-300 hover:shadow-lg transition-all p-6 rounded-2xl shadow-xs group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-700 rounded-xl flex items-center justify-center text-white mb-4 shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                  <TestTube className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Pabrik Soal AI</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Buat puluhan variasi soal latihan, Kuis, Sumatif (PG & Essay) lengkap dengan kunci jawaban dan rubrik penilaian.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MENU UTAMA & AKADEMIK */}
      <section id="utama" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manajemen Utama & Akademik</h2>
            <p className="text-slate-600 mt-2">Pusat kontrol harian untuk mengelola siswa, kelas, dan proses belajar mengajar secara terstruktur.</p>
          </div>

          {/* Grid Menu Utama */}
          <div className="mb-12">
            <h3 className="text-sm font-bold tracking-wider text-indigo-600 uppercase mb-4">📌 Menu Utama</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Kelola Siswa */}
              <div className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 border border-blue-200/60">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Kelola Siswa</h4>
                  <p className="text-slate-600 text-sm">Pangkalan data siswa komprehensif. Pantau biodata, rekam jejak akademis, hingga mutasi siswa secara *real-time*.</p>
                </div>
              </div>

              {/* Kelola Guru (Setelah Kelola Siswa) */}
              <div className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 border border-indigo-200/60">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Kelola Guru</h4>
                  <p className="text-slate-600 text-sm">Berfungsi untuk menambahkan nama-nama Guru bagi admin sekolah, baik secara input manual maupun import data massal dengan Excel.</p>
                </div>
              </div>

              {/* Kelola Mapel */}
              <div className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 border border-emerald-200/60">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Kelola Mapel</h4>
                  <p className="text-slate-600 text-sm">Atur mata pelajaran, alokasi jam mengajar, serta capaian pembelajaran dasar dalam satu antarmuka yang intuitif.</p>
                </div>
              </div>

              {/* Kontrol Sandi Akun (Kotak Khusus setelah Kelola Mapel) */}
              <div className="p-6 bg-gradient-to-b from-amber-50/50 to-slate-50/70 rounded-2xl border border-amber-200/80 hover:border-amber-300 hover:shadow-xs transition-all flex flex-col justify-between relative overflow-hidden">
                <div>
                  <div className="w-12 h-12 bg-amber-100/80 text-amber-700 rounded-xl flex items-center justify-center mb-4 border border-amber-300/70 shadow-2xs">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h4 className="text-xl font-bold text-slate-900">Kontrol Sandi Akun</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                      Khusus Admin
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm">Berguna untuk manajemen akses masuk sistem (Login) khusus guru yang dikelola langsung oleh admin sekolah.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Menu Akademik */}
          <div id="akademik">
            <h3 className="text-sm font-bold tracking-wider text-blue-600 uppercase mb-4">🎓 Menu Akademik</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-4 border border-amber-200/60">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Jadwal Mengajar</h4>
                <p className="text-slate-500 text-xs">Kalender pintar terintegrasi dengan pengingat otomatis sebelum kelas dimulai.</p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 border border-blue-200/60">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Input Presensi</h4>
                <p className="text-slate-500 text-xs">Absensi harian cepat. Rekapitulasi persentase kehadiran bulanan terhitung otomatis.</p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all">
                <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center mb-4 border border-rose-200/60">
                  <FileEdit className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Input Penilaian</h4>
                <p className="text-slate-500 text-xs">Olah nilai formatif & sumatif secara otomatis menjadi format siap cetak untuk rapor.</p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all">
                <div className="w-10 h-10 bg-cyan-50 text-cyan-600 rounded-lg flex items-center justify-center mb-4 border border-cyan-200/60">
                  <BookMarked className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Agenda Mengajar</h4>
                <p className="text-slate-500 text-xs">Buku batas harian digital untuk mencatat progres materi dan catatan penting kelas.</p>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all ">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4 border border-purple-200/60">
                  <Shield className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Bimbingan Guru Wali</h4>
                <p className="text-slate-500 text-xs">Modul khusus wali kelas untuk mencatat rekam konseling, catatan kedisiplinan, serta pencapaian prestasi siswa binaan.</p>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4 border border-emerald-200/60">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Catatan Penting Guru</h4>
                <p className="text-slate-500 text-xs">Manajemen Catatan yang dapat dikelola dan diperbaharui oleh Guru, didalamnya menu ini ada Judul catatan, kategori, isi catatan dan Tindakan yang akan di lakukan oleh guru</p>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center mb-4 border border-orange-200/60">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Arsip Perangkat Ajar</h4>
                <p className="text-slate-500 text-xs">Arsip repositori drive perangkat pembelajaran yang dapat diakses untuk melihat RPP yang telah di unggah di google drive</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SISTEM DAN OUTPUT */}
      <section id="output" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900">Sistem & Output Siap Cetak</h2>
            <p className="text-slate-600 mt-2">Seluruh dokumen yang dihasilkan rapi, standar resmi, dan siap pakai.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <Printer className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Pusat Laporan Resmi</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Cetak seluruh dokumen administrasi guru dalam format standar pemerintah. Dilengkapi dengan tata letak <strong>Kop Surat Sekolah</strong>, tabel yang rapi, dan kolom Tanda Tangan digital/manual.
                </p>
              </div>
              <ul className="space-y-2 text-sm text-slate-700 border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Format PDF Siap Cetak Ukuran A4</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Tata Letak Tabel Rapi & Presisi</li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <Sliders className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Pengaturan Profil & Kop Sekolah</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Isi data profil dan identitas sekolah Anda satu kali. Sistem secara otomatis menerapkan identitas tersebut ke seluruh Kop Surat Laporan PDF dan Nama Penandatangan.
                </p>
              </div>
              <ul className="space-y-2 text-sm text-slate-700 border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Integrasi Otomatis ke Semua Dokumen</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Mendukung Logo Sekolah & TTD Digital</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE / BENEFITS / FAQ */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Kenapa Memilih SIAP GURU */}
          <div className="mb-20">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold tracking-wide uppercase inline-flex items-center gap-1.5 mb-3">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Nilai Tambah Utama
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Kenapa Pendidik &amp; Sekolah Memilih <span className="text-blue-600">SIAP GURU</span>?
              </h2>
              <p className="text-slate-600 mt-4 text-base sm:text-lg leading-relaxed">
                Dirancang langsung dari keresahan nyata ribuan guru: dokumen berantakan, format yang terus berganti, dan malam-malam yang tersita untuk mengetik tabel.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-slate-50/80 hover:bg-white rounded-3xl border border-slate-200/80 hover:border-blue-300 hover:shadow-xl transition-all duration-300 text-left group">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Clock className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Pangkas 80% Waktu &amp; Bebas Lembur</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Otomatisasi cerdas mengubah pengerjaan berkas berminggu-minggu menjadi hitungan detik. Anda tidak perlu lagi begadang di depan laptop, punya waktu istirahat yang utuh, dan lebih bahagia bersama keluarga.
                </p>
              </div>

              <div className="p-8 bg-slate-50/80 hover:bg-white rounded-3xl border border-slate-200/80 hover:border-blue-300 hover:shadow-xl transition-all duration-300 text-left group">
                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Brain className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">AI Khusus Kurikulum Merdeka</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Bukan AI umum yang asal merangkai kata. Algoritma kami dirancang khusus mengikuti struktur CP, TP, ATP, Modul Ajar Deep Learning berdiferensiasi, dan kisi-kisi soal yang 100% valid dan kontekstual.
                </p>
              </div>

              <div className="p-8 bg-slate-50/80 hover:bg-white rounded-3xl border border-slate-200/80 hover:border-blue-300 hover:shadow-xl transition-all duration-300 text-left group">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Selalu Siap Supervisi &amp; Akreditasi</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Kepala Sekolah atau Pengawas datang mendadak? Tidak perlu panik! Seluruh data tersimpan aman di cloud dan siap dicetak ke format resmi A4 ber-KOP sekolah serta lembar pengesahan kapan pun diminta.
                </p>
              </div>
            </div>
          </div>

          {/* Keuntungan Menggunakan SIAP GURU */}
          <div className="mb-20 bg-gradient-to-br from-indigo-50 via-blue-50/40 to-indigo-50 p-8 sm:p-12 rounded-3xl border border-indigo-100 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-200/50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="relative z-10 max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 bg-white/90 border border-indigo-200 px-3 py-1 rounded-full shadow-xs">
                  Solusi Finansial &amp; Operasional Terbaik
                </span>
                <h2 className="text-3xl font-black text-slate-900 mt-3">Keuntungan Nyata untuk Anda &amp; Sekolah</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/90 border border-white shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Ekosistem All-in-One Terpadu</h4>
                    <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                      Satu langganan untuk presensi harian, nilai formatif-sumatif, agenda mengajar, hingga pembuatan modul tanpa perlu repot membeli banyak software terpisah.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/90 border border-white shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Standar Format Cetak Resmi Pemerintah</h4>
                    <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                      Laporan yang diekspor otomatis berformat PDF A4 lengkap dengan logo dan Kop Sekolah, nama pejabat penandatangan, serta tata letak tabel yang rapi presisi.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/90 border border-white shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Pabrik Soal Berstandar HOTS/LOTS</h4>
                    <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                      Ciptakan puluhan variasi instrumen asesmen dan ujian pilihan ganda serta uraian beserta kunci jawaban dan rubrik penilaian hanya dari satu topik.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/90 border border-white shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Investasi Sangat Hemat &amp; Bergaransi</h4>
                    <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                      Biaya sangat terjangkau dibanding efisiensi ratusan jam kerja guru. Lengkap dengan panduan penggunaan dan pendampingan admin via WhatsApp.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-10">Pertanyaan yang Sering Diajukan (FAQ)</h2>
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-bold text-slate-900 mb-2">Apakah aplikasi ini harus diunduh (install) di laptop/HP?</h4>
                <p className="text-slate-600">Tidak perlu. SIAP GURU berbasis web (Cloud), Anda cukup membuka melalui browser (Chrome/Safari) dan login dari perangkat apapun yang terkoneksi internet.</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-bold text-slate-900 mb-2">Apakah fitur AI ini aman dan sesuai kurikulum pendidikan di Indonesia?</h4>
                <p className="text-slate-600">Ya, prompt pada engine AI kami telah disesuaikan secara khusus dengan pedoman Kurikulum Merdeka sehingga output yang dihasilkan (Modul Ajar, ATP, CP) relevan dan sesuai aturan.</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-bold text-slate-900 mb-2">Jika saya berlangganan personal, apakah data saya tercampur dengan guru lain?</h4>
                <p className="text-slate-600">Tidak. Pada akun personal, workspace database Anda terisolasi khusus untuk sekolah Anda sendiri (atau akun tunggal Anda), privasi data terjamin.</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-bold text-slate-900 mb-2">Bagaimana jika saya mengalami kesulitan penggunaan?</h4>
                <p className="text-slate-600">Kami menyediakan tombol Bantuan WhatsApp langsung ke teknisi. Anda juga akan dipandu dengan video panduan jika berlangganan paket tertentu.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CALL TO ACTION (CTA) */}
      <section className="py-20 bg-gradient-to-b from-[#080D21] via-[#0A1128] to-[#0E1A3C] text-white text-center relative overflow-hidden border-y border-indigo-950/80">
        <div className="absolute inset-0 bg-radial from-indigo-900/30 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight">
            Guru Hebat Fokus Mendidik,<br/><span className="text-indigo-400">Biarkan AI</span> yang Mengurus Administrasi.
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Hemat puluhan jam setiap bulannya. Bergabunglah dengan ribuan guru lainnya yang sudah beralih ke administrasi digital berbasis AI.
          </p>
          <div className="pt-2">
            <button onClick={() => setIsRegisterModalOpen(true)} className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] cursor-pointer">
              Mulai Sekarang Gratis
            </button>
          </div>
        </div>
      </section>


      {/* HARGA SECTION */}
      <section id="harga" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold tracking-wide uppercase inline-flex items-center gap-1.5 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Investasi Cerdas Guru &amp; Sekolah
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Pilihan Paket Berlangganan Terjangkau</h2>
            <p className="text-slate-600 mt-3 text-base">Hemat jutaan rupiah dibanding membeli software terpisah. Pilih paket yang pas untuk kebutuhan Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Paket Personal */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-xl transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase">Guru Mandiri</span>
                  <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">Akses Langsung</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Paket Personal</h3>
                <p className="text-slate-500 text-sm mb-6">Cocok untuk penggunaan mandiri oleh satu orang guru yang ingin bebas dari lembur administrasi.</p>
                <div className="mb-6 pb-6 border-b border-slate-100">
                  <span className="text-4xl font-black text-slate-900">Rp 99.000</span>
                  <span className="text-slate-500 text-sm ml-2 font-medium">/ akun aktif</span>
                </div>
                <ul className="space-y-3.5 mb-8">
                  <li className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                    <Check className="w-5 h-5 text-indigo-600 shrink-0" /> Generator AI Modul Ajar &amp; Perangkat Ajar Lengkap
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                    <Check className="w-5 h-5 text-indigo-600 shrink-0" /> Cetak Dokumen PDF Resmi A4 Ber-KOP &amp; TTD
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                    <Check className="w-5 h-5 text-indigo-600 shrink-0" /> Input Presensi &amp; Rekap Nilai Formatif-Sumatif
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                    <Check className="w-5 h-5 text-indigo-600 shrink-0" /> Penyimpanan Cloud Aman &amp; Dukungan WhatsApp
                  </li>
                </ul>
              </div>
              <button onClick={() => { setRegData({...regData, paket: "Personal (Rp 99.000)"}); setIsRegisterModalOpen(true); }} className="w-full py-3.5 px-4 bg-slate-100 hover:bg-indigo-50 text-slate-900 hover:text-indigo-700 font-bold rounded-xl text-center transition-all cursor-pointer shadow-xs">
                Daftar Paket Personal
              </button>
            </div>

            {/* Paket Sekolah */}
            <div className="bg-gradient-to-b from-[#0A1128] via-[#0E1A3C] to-[#101F42] p-8 rounded-3xl border border-indigo-700/80 shadow-2xl flex flex-col justify-between relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-black rounded-full shadow-xs uppercase tracking-wide">Paling Populer &amp; Hemat</span>
                  <span className="text-xs text-indigo-300 font-bold bg-indigo-900/60 px-2.5 py-0.5 rounded-full border border-indigo-700">Multi-User</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Institusi Sekolah</h3>
                <p className="text-indigo-200/80 text-sm mb-6">Lisensi terpadu untuk sekolah: seluruh guru memiliki akun mandiri dan Kepala Sekolah dapat memantau supervisi.</p>
                <div className="mb-6 pb-6 border-b border-indigo-900/80">
                  <span className="text-4xl font-black text-white">Rp 199.000</span>
                  <span className="text-indigo-200/70 text-sm ml-2 font-medium">/ lembaga sekolah</span>
                </div>
                <ul className="space-y-3.5 mb-8">
                  <li className="flex items-center gap-3 text-slate-200 text-sm font-medium">
                    <Check className="w-5 h-5 text-emerald-400 shrink-0" /> Mencakup Semua Fitur Lengkap Paket Personal
                  </li>
                  <li className="flex items-center gap-3 text-slate-200 text-sm font-medium">
                    <Check className="w-5 h-5 text-emerald-400 shrink-0" /> Akses Multi-Guru (Seluruh Pengajar di Sekolah)
                  </li>
                  <li className="flex items-center gap-3 text-slate-200 text-sm font-medium">
                    <Check className="w-5 h-5 text-emerald-400 shrink-0" /> Dashboard Khusus Supervisi Kepala Sekolah
                  </li>
                  <li className="flex items-center gap-3 text-slate-200 text-sm font-medium">
                    <Check className="w-5 h-5 text-emerald-400 shrink-0" /> Fitur Pencadangan &amp; Pemulihan Data Sekolah Cloud
                  </li>
                </ul>
              </div>
              <button onClick={() => { setRegData({...regData, paket: "Sekolah (Rp 199.000)"}); setIsRegisterModalOpen(true); }} className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white font-bold rounded-xl text-center transition-all shadow-lg shadow-indigo-600/40 cursor-pointer">
                Daftar Paket Sekolah
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#080D21] text-slate-400 py-12 border-t border-indigo-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <SiapGuruLogo size="xs" variant="icon" />
            <span className="text-lg font-bold text-white tracking-tight"><span className="text-blue-400">SIAP GURU</span> (Sistem Informasi Administrasi & Perangkat Guru)</span>
          </div>
          <div className="text-sm text-slate-500">
            &copy; 2026 <span className="text-blue-400 font-semibold">SIAP GURU</span>. Seluruh Hak Cipta Dilindungi.
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/6285255700081?text=Halo,%20saya%20ingin%20bertanya%20tentang%20aplikasi%20SIAP%20GURU."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 hover:scale-105 transition-all duration-200 group"
        title="Hubungi kami via WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
          <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.06-.3-.15-1.265-.46-2.411-1.485-.893-.798-1.502-1.782-1.677-2.077-.175-.295-.018-.456.13-.603.136-.135.301-.344.451-.519.151-.175.201-.295.301-.495.101-.2.05-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.285-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.21 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.767-.721 2.016-1.426.248-.705.248-1.31.173-1.426-.074-.115-.272-.18-.572-.33z" />
          <path fillRule="evenodd" clipRule="evenodd" d="M12.002 22a9.96 9.96 0 01-5.112-1.408l-5.69 1.493 1.517-5.545A9.972 9.972 0 1112.002 22zM12 20a7.973 7.973 0 10-4.148-1.164l-.248.148-3.329.873.888-3.243-.162-.257A7.973 7.973 0 0012 20z" />
        </svg>
        <span className="absolute right-16 bg-[#0A1128] text-slate-100 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-indigo-950/80 pointer-events-none">Hubungi via WhatsApp</span>
      </a>
      {/* REGISTER MODAL */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Formulir Pendaftaran</h3>
              <button onClick={() => setIsRegisterModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                  <input type="text" required value={regData.nama} onChange={(e) => setRegData({...regData, nama: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all text-sm" placeholder="Masukkan nama Anda" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">No HP/WA</label>
                  <input type="tel" required value={regData.noHp} onChange={(e) => setRegData({...regData, noHp: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all text-sm" placeholder="08..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Asal Sekolah</label>
                  <input type="text" required value={regData.asalSekolah} onChange={(e) => setRegData({...regData, asalSekolah: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all mb-4 text-sm" placeholder="Nama Sekolah" />
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Alamat Email</label>
                  <input type="email" required value={regData.email} onChange={(e) => setRegData({...regData, email: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all text-sm" placeholder="email@contoh.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select required value={regData.jenisKelamin} onChange={(e) => setRegData({...regData, jenisKelamin: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all text-sm">
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Pilihan Paket</label>
                  <select required value={regData.paket} onChange={(e) => setRegData({...regData, paket: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all text-sm">
                    <option value="Personal (Rp 99.000)">Personal / Mandiri - Rp 99.000</option>
                    <option value="Sekolah (Rp 199.000)">Institusi Sekolah - Rp 199.000</option>
                  </select>
                </div>
                <div className="pt-4">
                  <button type="submit" className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/25 transition-all text-center cursor-pointer">
                    Kirim Pendaftaran
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
