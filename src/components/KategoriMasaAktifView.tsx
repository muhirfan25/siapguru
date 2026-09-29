import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  Zap, 
  HelpCircle, 
  CreditCard, 
  ArrowRight,
  School,
  X
} from 'lucide-react';
import { SiapGuruLogo } from './SiapGuruLogo';

interface KategoriMasaAktifViewProps {
  onBackToLanding: () => void;
  onLoginClick: () => void;
  defaultPaket?: string;
}

export const KategoriMasaAktifView: React.FC<KategoriMasaAktifViewProps> = ({
  onBackToLanding,
  onLoginClick,
  defaultPaket = "Masa Aktif 1 Tahun - Rp 100.000"
}) => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedPaketForModal, setSelectedPaketForModal] = useState(defaultPaket);
  const [regData, setRegData] = useState({
    nama: "",
    noHp: "",
    email: "",
    asalSekolah: "",
    jenisKelamin: "Laki-laki",
    paket: defaultPaket
  });

  const handleOpenBuyModal = (paketName: string) => {
    setSelectedPaketForModal(paketName);
    setRegData(prev => ({ ...prev, paket: paketName }));
    setIsRegisterModalOpen(true);
  };

  const handleKirimPendaftaran = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Halo Admin SIAP GURU, saya ingin membeli paket lisensi aplikasi.

Berikut data pendaftaran & pembelian saya:
- Nama Lengkap: ${regData.nama}
- Asal Sekolah: ${regData.asalSekolah}
- No. WhatsApp: ${regData.noHp}
- Email: ${regData.email}
- Jenis Kelamin: ${regData.jenisKelamin}
- Pilihan Paket: ${regData.paket}

Informasi Transfer Pembayaran:
• Bank BRI: 022301014562531 (a.n. MUH IRFAN)
• DANA / E-Wallet: 085255700081

Mohon untuk konfirmasi dan proses aktivasi akun sekolah/guru saya. Terima kasih!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/6285255700081?text=${encoded}`, "_blank");
    setIsRegisterModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-poppins selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToLanding}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-all cursor-pointer border border-slate-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </button>
            <div className="hidden sm:flex items-center gap-2.5">
              <SiapGuruLogo size="sm" variant="icon" />
              <span className="text-lg font-extrabold text-blue-600 tracking-tight">
                SIAP GURU
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block text-xs text-slate-500 font-medium">
              Sudah punya akun sekolah?
            </span>
            <button
              onClick={onLoginClick}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              Masuk Akun
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="relative pt-12 pb-16 lg:pt-16 lg:pb-20 overflow-hidden bg-gradient-to-b from-blue-50/60 via-indigo-50/30 to-slate-50 border-b border-slate-200">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-10 right-10 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 border border-blue-300/60 text-blue-800 text-xs sm:text-sm font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Kategori Masa Aktif &amp; Lisensi Resmi SIAP GURU</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Pilihan Paket Masa Aktif &amp; Investasi Hemat
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            Dapatkan akses penuh ke generator modul ajar AI, administrasi kelas, rekap absensi, leger nilai, dan pusat laporan resmi format A4. Harga transparan tanpa biaya tersembunyi.
          </p>
        </div>
      </header>

      {/* 4 Pricing Cards Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* 1. Paket 30 Hari - Rp 29.999 */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all flex flex-col justify-between relative group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                  Uji Coba 1 Bulan
                </span>
                <span className="text-xs text-blue-700 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  30 Hari
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-1">Masa Aktif 30 Hari</h3>
              <p className="text-slate-500 text-xs mb-5 leading-relaxed">
                Pilihan tepat untuk mencoba langsung seluruh keunggulan sistem di sekolah Anda selama sebulan penuh.
              </p>

              <div className="mb-6 pb-5 border-b border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Rp 29.999</span>
                </div>
                <div className="text-slate-500 text-xs font-medium mt-1">
                  Masa aktif: 30 hari kalender
                </div>
              </div>

              <ul className="space-y-3 mb-8 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Akses Penuh AI Generator Modul Ajar</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Input Absensi &amp; Rekap Nilai Siswa</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Cetak PDF Resmi A4 Ber-KOP Sekolah</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Bebas Perpanjang Paket Kapan Saja</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenBuyModal("Masa Aktif 30 Hari - Rp 29.999")}
              className="w-full py-3.5 px-4 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 font-bold rounded-xl text-center text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
            >
              Beli Paket 30 Hari
            </button>
          </div>

          {/* 2. Paket 6 Bulan - Rp 49.999 */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-indigo-200 shadow-sm hover:shadow-xl hover:border-indigo-400 transition-all flex flex-col justify-between relative group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                  1 Semester
                </span>
                <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  180 Hari
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-1">Masa Aktif 6 Bulan</h3>
              <p className="text-slate-500 text-xs mb-5 leading-relaxed">
                Pilihan ekonomis untuk mendampingi satu semester pembelajaran guru hingga tuntas pembagian rapor.
              </p>

              <div className="mb-6 pb-5 border-b border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Rp 49.999</span>
                </div>
                <div className="text-slate-500 text-xs font-medium mt-1">
                  Masa aktif: 6 bulan (1 semester)
                </div>
              </div>

              <ul className="space-y-3 mb-8 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Semua Fitur Paket 30 Hari Lengkap</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Rekap Nilai Formatif &amp; Sumatif Semester</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Agenda Mengajar &amp; Jurnal Harian Lengkap</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>Bantuan Teknis WhatsApp Prioritas</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenBuyModal("Masa Aktif 6 Bulan - Rp 49.999")}
              className="w-full py-3.5 px-4 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold rounded-xl text-center text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
            >
              Beli Paket 6 Bulan
            </button>
          </div>

          {/* 3. Paket 1 Tahun - Rp 100.000 */}
          <div className="bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-7 border-2 border-indigo-400 shadow-2xl flex flex-col justify-between relative overflow-hidden text-white group scale-102 lg:-translate-y-2">
            <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black rounded-full shadow-xs uppercase tracking-wider">
                  ★ Paling Populer
                </span>
                <span className="text-xs text-indigo-200 font-bold bg-indigo-800/80 px-2.5 py-0.5 rounded-full border border-indigo-600">
                  1 Tahun Ajaran
                </span>
              </div>

              <h3 className="text-xl font-black text-white mb-1">Masa Aktif 1 Tahun</h3>
              <p className="text-indigo-200/80 text-xs mb-5 leading-relaxed">
                Solusi terlengkap untuk satu tahun ajaran penuh (Semester Ganjil &amp; Genap).
              </p>

              <div className="mb-6 pb-5 border-b border-indigo-800/80">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">Rp 100.000</span>
                </div>
                <div className="text-indigo-200/70 text-xs font-medium mt-1">
                  Masa aktif: 365 hari penuh
                </div>
              </div>

              <ul className="space-y-3 mb-8 text-xs text-slate-200">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Akses Penuh 2 Semester (1 Tahun Ajaran)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Multi-Guru &amp; Akun Admin Sekolah</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Dashboard Supervisi &amp; Pantau Kelas</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Pencadangan Data &amp; Pemulihan Berkala</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenBuyModal("Masa Aktif 1 Tahun - Rp 100.000")}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black rounded-xl text-center text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/30 cursor-pointer"
            >
              Beli Paket 1 Tahun
            </button>
          </div>

          {/* 4. Aktif Lifetime (Permanen) - Rp 149.999 */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-emerald-500 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between relative group">
            <div className="absolute -top-3.5 right-6">
              <span className="px-3 py-1 bg-emerald-600 text-white text-[11px] font-extrabold rounded-full shadow-md uppercase tracking-wider">
                Sekali Bayar
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                  Lifetime
                </span>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Selamanya
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-1">Aktif Lifetime</h3>
              <p className="text-slate-500 text-xs mb-5 leading-relaxed">
                Investasi terbaik sekali bayar untuk pemakaian selamanya tanpa perlu pusing perpanjangan tahunan.
              </p>

              <div className="mb-6 pb-5 border-b border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">Rp 149.999</span>
                </div>
                <div className="text-slate-500 text-xs font-medium mt-1">
                  Masa aktif: Selamanya (seumur hidup)
                </div>
              </div>

              <ul className="space-y-3 mb-8 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Akses Permanen Tanpa Batas Waktu</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Bebas Biaya Perpanjangan Bulanan/Tahunan</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Pembaruan Fitur AI &amp; Template Gratis</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Layanan Prioritas &amp; Asistensi VIP</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenBuyModal("Aktif Lifetime (Permanen) - Rp 149.999")}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-center text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
            >
              Beli Paket Lifetime
            </button>
          </div>

        </div>

        {/* Info Metode Pembayaran & Aktivasi Cepat */}
        <div className="mt-14 bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
                <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                <span>Instruksi Transfer &amp; Aktivasi Cepat</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Rekening Resmi Aktivasi SIAP GURU
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Setelah memilih paket, silakan transfer sesuai nominal ke salah satu rekening resmi berikut dan konfirmasikan via WhatsApp untuk aktivasi instan:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700">
                  <div className="text-[11px] text-blue-400 font-bold uppercase tracking-wider">Bank BRI (Rekening Resmi)</div>
                  <div className="text-base sm:text-lg font-black text-white tracking-wide mt-0.5">022301014562531</div>
                  <div className="text-xs text-slate-400">Atas Nama: MUH IRFAN</div>
                </div>

                <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700">
                  <div className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">DANA / E-Wallet</div>
                  <div className="text-base sm:text-lg font-black text-white tracking-wide mt-0.5">085255700081</div>
                  <div className="text-xs text-slate-400">Atas Nama: MUH IRFAN</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={() => handleOpenBuyModal("Masa Aktif 1 Tahun - Rp 100.000")}
                className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Beli Paket Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://wa.me/6285255700081?text=Halo%20Admin%20SIAP%20GURU,%20saya%20ingin%20konsultasi%20mengenai%20paket%20masa%20aktif%20aplikasi."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold rounded-xl text-xs text-center border border-slate-700 transition-all cursor-pointer"
              >
                Tanya Admin via WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Lisensi & Masa Aktif */}
        <div className="mt-14 max-w-4xl mx-auto space-y-4">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">Pertanyaan Umum (FAQ) Masa Aktif</h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Jawaban atas pertanyaan seputar aktivasi dan pemakaian aplikasi.</p>
          </div>

          <div className="space-y-3">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                Kapan masa aktif akun mulai terhitung?
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed pl-6">
                Masa aktif dihitung sejak akun berhasil diaktivasi oleh administrator. Anda dapat memantau sisa hari masa aktif secara transparan pada dashboard aplikasi.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                Apakah data guru dan siswa hilang jika masa aktif habis?
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed pl-6">
                Tidak hilang. Data tetap tersimpan aman di sistem. Anda cukup melakukan perpanjangan paket untuk mengaktifkan kembali akses pengoperasian.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                Bisakah upgrade dari paket 30 Hari atau 6 Bulan ke Paket Lifetime?
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed pl-6">
                Sangat bisa. Anda dapat melakukan peningkatan (upgrade) paket lisensi kapan saja tanpa harus memasukkan ulang data sekolah Anda.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL REGISTRASI & PEMBELIAN PAKET */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative my-8 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsRegisterModalOpen(false)} 
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600 mb-2">
                <School className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Form Beli Paket Lisensi</h3>
              <p className="text-xs text-slate-500 mt-0.5">Lengkapi formulir untuk aktivasi paket SIAP GURU</p>
            </div>

            <form onSubmit={handleKirimPendaftaran} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap &amp; Gelar</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Irfan, S.Pd."
                  value={regData.nama}
                  onChange={(e) => setRegData({...regData, nama: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Asal Sekolah / Instansi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SMAN 1 Sungai Penuh"
                  value={regData.asalSekolah}
                  onChange={(e) => setRegData({...regData, asalSekolah: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">No. WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="0812xxxx"
                    value={regData.noHp}
                    onChange={(e) => setRegData({...regData, noHp: e.target.value})}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="email@sekolah.id"
                    value={regData.email}
                    onChange={(e) => setRegData({...regData, email: e.target.value})}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pilihan Paket Masa Aktif</label>
                <select
                  value={regData.paket}
                  onChange={(e) => setRegData({...regData, paket: e.target.value})}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium bg-white"
                >
                  <option value="Masa Aktif 30 Hari - Rp 29.999">Masa Aktif 30 Hari — Rp 29.999</option>
                  <option value="Masa Aktif 6 Bulan - Rp 49.999">Masa Aktif 6 Bulan (1 Semester) — Rp 49.999</option>
                  <option value="Masa Aktif 1 Tahun - Rp 100.000">Masa Aktif 1 Tahun (1 Tahun Ajaran) — Rp 100.000 (Populer)</option>
                  <option value="Aktif Lifetime (Permanen) - Rp 149.999">Aktif Lifetime (Permanen / Sekali Bayar) — Rp 149.999</option>
                </select>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-[11px] text-slate-600 space-y-1">
                <div className="font-bold text-blue-900">Transfer Pembayaran:</div>
                <div>• BRI: <strong className="text-slate-900 font-mono">022301014562531</strong> (MUH IRFAN)</div>
                <div>• DANA: <strong className="text-slate-900 font-mono">085255700081</strong> (MUH IRFAN)</div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Konfirmasi &amp; Aktivasi via WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#080D21] text-slate-400 py-10 border-t border-indigo-950/80 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SiapGuruLogo size="xs" variant="icon" />
            <span className="text-sm font-bold text-white tracking-tight">
              <span className="text-blue-400">SIAP GURU</span> &bull; Kategori Masa Aktif &amp; Lisensi
            </span>
          </div>
          <div className="text-xs text-slate-500">
            &copy; 2026 SIAP GURU. Seluruh Hak Cipta Dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
};
