import React, { useState } from 'react';
import { 
  BookOpen, 
  Download, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck, 
  UserCheck, 
  Users, 
  Award, 
  CalendarCheck, 
  BookMarked, 
  Clock, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Library,
  BrainCircuit,
  Key,
  HardDriveDownload,
  Info
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Pengaturan } from '../types';
import Swal from 'sweetalert2';

interface PanduanAplikasiViewProps {
  config: Pengaturan;
  userRole: 'superadmin' | 'admin_sekolah' | 'guru' | null;
}

export const PanduanAplikasiView: React.FC<PanduanAplikasiViewProps> = ({ config, userRole }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBab, setActiveBab] = useState<string>('all');
  const [customPdfUrl, setCustomPdfUrl] = useState<string>('');
  const [isEditingUrl, setIsEditingUrl] = useState<boolean>(false);

  // Chapters data
  const chapters = [
    {
      id: 'alur_cepat',
      badge: 'Alur Cepat 5 Menit',
      title: 'Langkah Awal Pengoperasian (Quick Start)',
      icon: Clock,
      color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      desc: 'Panduan kilat alur penggunaan aplikasi mulai dari registrasi akun hingga cetak perangkat pembelajaran.',
      steps: [
        {
          num: '1',
          role: 'Admin Sekolah',
          title: 'Setup Master Data Sekolah',
          desc: 'Masuk ke menu Data Siswa dan Data Guru. Lakukan impor cepat menggunakan file Excel (.xlsx / .csv) atau input manual. Tetapkan NIP/NIY dan sandi awal guru (default: 123456).'
        },
        {
          num: '2',
          role: 'Admin / Guru',
          title: 'Input Mata Pelajaran & Jadwal Mengajar',
          desc: 'Buka menu Mata Pelajaran untuk mendaftarkan mapel tiap tingkat kelas, lalu atur Jadwal Mengajar mingguan agar guru memiliki rujukan jam mengajar.'
        },
        {
          num: '3',
          role: 'Guru',
          title: 'Hasilkan Dokumen Pembelajaran dengan AI',
          desc: 'Buka menu AI Generator Perangkat atau AI Modul Ajar. Masukkan Capaian Pembelajaran (CP) dan materi, lalu klik Hasilkan. Dokumen otomatis tersusun rapi siap cetak A4 atau unduh doc.'
        },
        {
          num: '4',
          role: 'Guru',
          title: 'Pengisian Presensi, Penilaian & Agenda Mengajar',
          desc: 'Lakukan pencatatan kehadiran harian di menu Input Absensi, masukkan capaian tugas/ujian di Input Penilaian, dan catat aktivitas kelas di Jurnal Agenda Mengajar.'
        },
        {
          num: '5',
          role: 'Admin & Guru',
          title: 'Pusat Cetak Laporan & Supervisi',
          desc: 'Kunjungi menu Pusat Laporan untuk mencetak Rekap Absensi, Lembar Penilaian, Jurnal Guru, hingga Perangkat Ajar ber-KOP resmi dan bertanda tangan digital.'
        }
      ]
    },
    {
      id: 'akun_login',
      badge: 'Bab 1',
      title: 'Akun Pengguna & Autentikasi Login (NIP/NIY)',
      icon: Key,
      color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      desc: 'Ketentuan dan panduan login bagi Guru dan Administrator Sekolah.',
      items: [
        {
          title: 'Login Guru menggunakan NIP atau NIY',
          content: 'Guru masuk ke aplikasi dengan memilih tab "Guru" di halaman Login, lalu memasukkan NIP (Nomor Induk Pegawai bagi sekolah negeri) atau NIY (Nomor Induk Yayasan bagi sekolah swasta/yayasan).'
        },
        {
          title: 'Sandi Awal & Kontrol Sandi',
          content: 'Password default guru saat pertama kali didaftarkan oleh admin adalah 123456 atau NIP masing-masing. Admin sekolah dapat mereset sandi guru kapan saja melalui menu "Kontrol Sandi".'
        },
        {
          title: 'Login Administrator Sekolah & Superadmin',
          content: 'Admin Sekolah dan Superadmin masuk melalui tab "Administrator" menggunakan alamat Email dan Password yang telah diverifikasi.'
        }
      ]
    },
    {
      id: 'data_master',
      badge: 'Bab 2',
      title: 'Manajemen Data Master (Siswa, Guru, Mapel, Jadwal)',
      icon: Users,
      color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      desc: 'Cara mengelola basis data sekolah agar terintegrasi ke seluruh fitur guru.',
      items: [
        {
          title: 'Kelola & Impor Data Siswa',
          content: 'Buka menu Data Siswa. Admin dapat mengunduh Template Excel Siswa, mengisinya, lalu mengunggahnya secara massal. Data siswa akan otomatis terhubung ke jurnal presensi dan penilaian kelas.'
        },
        {
          title: 'Kelola & Impor Data Guru',
          content: 'Buka menu Data Guru. Masukkan NIP/NIY, nama lengkap dengan gelar, dan status kepegawaian. Guru yang terdaftar otomatis memiliki akun login ke sistem.'
        },
        {
          title: 'Mata Pelajaran & Jadwal Mengajar',
          content: 'Menu Mata Pelajaran memuat kurikulum, semester, dan tingkat. Jadwal Mengajar menghubungkan hari, jam ke-, kelas, dan nama guru pengampu untuk memudahkan supervisi harian.'
        }
      ]
    },
    {
      id: 'fitur_ai',
      badge: 'Bab 3',
      title: 'Pemanfaatan Fitur Cerdas AI (Kecerdasan Buatan)',
      icon: Sparkles,
      color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      desc: 'Fitur AI canggih untuk mempercepat penyusunan administrasi pembelajaran.',
      items: [
        {
          title: 'Generator Perangkat Ajar AI',
          content: 'Menghasilkan 6 dokumen perangkat Kurikulum Merdeka secara otomatis: Analisis CP, Penurunan TP, Alur Tujuan Pembelajaran (ATP), Program Tahunan (Prota), Program Semester (Prosem), dan Kriteria Ketercapaian Tujuan Pembelajaran (KKTP).'
        },
        {
          title: 'AI Modul Ajar (Deep Learning & Berdiferensiasi)',
          content: 'Membuat Modul Ajar lengkap dengan Identitas, Capaian Pembelajaran, Profil Pelajar Pancasila, Pendekatan Deep Learning (Mindful, Meaningful, Joyful), Langkah Pembelajaran Berdiferensiasi, Rubrik Asesmen, dan LKPD.'
        },
        {
          title: 'AI Asisten Guru & Konsultasi Pembelajaran',
          content: 'Asisten cerdas untuk brainstorming metode pembelajaran, strategi menghadapi siswa berkebutuhan khusus, ide kuis interaktif, dan pembuatan ice breaking kelas.'
        },
        {
          title: 'Pabrik Soal Digital & Bahan Ajar',
          content: 'Membuat kisi-kisi soal, naskah soal pilihan ganda & uraian beserta kunci jawaban dan rubrik penilaian sesuai taksonomi Bloom (C1-C6).'
        }
      ]
    },
    {
      id: 'akademik_harian',
      badge: 'Bab 4',
      title: 'Administrasi Harian & Penilaian Siswa',
      icon: Award,
      color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      desc: 'Operasional kegiatan belajar mengajar harian guru di kelas.',
      items: [
        {
          title: 'Input Absensi / Presensi Siswa',
          content: 'Pilih kelas dan tanggal mengajar. Tandai status: Hadir (H), Sakit (S), Izin (I), atau Tanpa Keterangan (A). Sistem langsung menghitung persentase kehadiran setiap siswa secara otomatis.'
        },
        {
          title: 'Input Penilaian Akademik',
          content: 'Kelola nilai tugas, asesmen formatif, sumatif lingkup materi, Penilaian Tengah Semester (PTS), dan Penilaian Akhir Semester (PAS). Nilai akhir dan predikat terhitung otomatis.'
        },
        {
          title: 'Agenda Mengajar (Jurnal Kelas)',
          content: 'Catat materi yang diajarkan pada setiap pertemuan, tujuan pembelajaran, ketercapaian materi, dan catatan kejadian khusus selama pembelajaran berlangsung.'
        },
        {
          title: 'Catatan Guru & Bimbingan Wali',
          content: 'Pencatatan kasus pembinaan, konseling siswa, dan tindak lanjut perkembangan karakter peserta didik.'
        }
      ]
    },
    {
      id: 'laporan_output',
      badge: 'Bab 5',
      title: 'Pusat Laporan & Cetak Dokumen Resmi PDF',
      icon: FileText,
      color: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      desc: 'Mencetak dokumen resmi berstandar dinas pendidikan lengkap dengan KOP dan tanda tangan.',
      items: [
        {
          title: 'Standar KOP & Profil Sekolah',
          content: 'Semua dokumen di Pusat Laporan otomatis menyertakan KOP Sekolah (Logo, Nama Dinas, Instansi, Alamat, Email) yang disetel pada menu Pengaturan.'
        },
        {
          title: 'Tanda Tangan Elektronik Digital',
          content: 'Menyertakan tanda tangan digital Kepala Sekolah dan Guru Pengampu beserta NIP/NIY dan tanggal pengesahan dokumen.'
        },
        {
          title: 'Ekspor Dokumen ke Format PDF & Word',
          content: 'Laporan dapat diunduh langsung dalam format PDF standar dokumen A4 atau format Word (.doc) untuk pengeditan lebih lanjut.'
        }
      ]
    },
    {
      id: 'masa_aktif_backup',
      badge: 'Bab 6',
      title: 'Masa Aktif, Lisensi & Pencadangan Data (Backup)',
      icon: ShieldCheck,
      color: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
      desc: 'Informasi kategori masa aktif pemakaian sekolah dan perlindungan data.',
      items: [
        {
          title: 'Kategori Masa Aktif Fleksibel',
          content: 'Tersedia pilihan Uji Coba (1 Jam, 1 Hari, 3 Hari, 7 Hari, 30 Hari), Paket 6 Bulan (1 Semester), Paket 1 Tahun (1 Tahun Ajaran), hingga Aktif Permanen (Lifetime).'
        },
        {
          title: 'Pencadangan Data Berkala (Backup Database)',
          content: 'Admin sekolah disarankan melakukan backup database secara berkala melalui menu "Pencadangan Data" untuk mengunduh arsip JSON seluruh data sekolah ke laptop/komputer.'
        },
        {
          title: 'Pemulihan Data (Restore)',
          content: 'File JSON cadangan dapat dipulihkan kapan saja dengan satu klik untuk mengembalikan data jika terjadi kendala pada perangkat pengguna.'
        }
      ]
    },
    {
      id: 'bantuan_faq',
      badge: 'Bab 7',
      title: 'Tanya Jawab & Bantuan Teknis (FAQ)',
      icon: HelpCircle,
      color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      desc: 'Solusi cepat kendala operasional, panduan cetak PDF, dan kontak resmi helpdesk.',
      items: [
        {
          title: 'Bagaimana jika login NIP/NIY guru tidak ditemukan?',
          content: 'Pastikan Administrator Sekolah telah mendaftarkan nama guru beserta NIP/NIY pada menu Data Guru. Guru sekolah negeri login menggunakan NIP, sedangkan guru yayasan/swasta menggunakan NIY.'
        },
        {
          title: 'Bagaimana cara mengunduh buku panduan format PDF A4?',
          content: 'Cukup klik tombol "Unduh PDF A4" di bagian atas halaman ini. Dokumen resmi buku panduan aplikasi berformat standar A4 akan langsung dibuat dan diunduh ke perangkat Anda.'
        },
        {
          title: 'Bagaimana jika lupa sandi akun guru?',
          content: 'Administrator sekolah dapat mereset sandi guru kapan saja ke nilai awal (default 123456 atau NIP/NIY) melalui menu "Kontrol Sandi".'
        },
        {
          title: 'Kontak Resmi Layanan Bantuan (Helpdesk)',
          content: 'Layanan asistensi dan konsultasi teknis aplikasi SIAP GURU tersedia via WhatsApp di nomor 0852-5570-0081 pada hari dan jam kerja.'
        }
      ]
    }
  ];

  // Download PDF generator using jsPDF
  const handleDownloadPdf = () => {
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let currentY = 18;
      const schoolTitle = config.Nama_Sekolah || config.namaSekolah || 'Sekolah Pengguna';

      // Header KOP Buku Panduan
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 28, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('BUKU PANDUAN RINGKAS PENGGUNAAN APLIKASI', pageWidth / 2, 11, { align: 'center' });
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('SIAP GURU • Sistem Informasi Administrasi & Perangkat Guru Berbasis AI', pageWidth / 2, 18, { align: 'center' });
      doc.text(`Instansi: ${schoolTitle} • Dokumen Petunjuk Operasional Resmi`, pageWidth / 2, 23, { align: 'center' });

      currentY = 36;

      // Overview box
      doc.setFillColor(241, 245, 249); // slate-100
      doc.roundedRect(14, currentY, pageWidth - 28, 22, 2, 2, 'F');
      
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('PENDAHULUAN & TUJUAN PANDUAN', 18, currentY + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      const introText = 'Buku panduan ini disusun sebagai rujukan teknis ringkas bagi Administrator Sekolah dan Bapak/Ibu Guru dalam mengoperasikan seluruh modul SIAP GURU, mencakup manajemen master data, administrasi akademik kelas, generator perangkat AI, dan pusat laporan resmi.';
      const splitIntro = doc.splitTextToSize(introText, pageWidth - 36);
      doc.text(splitIntro, 18, currentY + 12);

      currentY += 28;

      // Table of Summary Chapters
      const tableData = [
        ['Alur Cepat', 'Panduan Kilat 5 Menit', 'Alur mulai data master, jadwal, modul ajar, hingga cetak laporan'],
        ['Bab 1', 'Akun & Login Pengguna', 'Login Guru pakai NIP / NIY (Nomor Induk Yayasan) & Email Admin'],
        ['Bab 2', 'Manajemen Data Master', 'Impor Excel Data Siswa, Guru, Mata Pelajaran & Jadwal Mengajar'],
        ['Bab 3', 'Kecerdasan Buatan (AI)', 'Generator CP, TP, ATP, Modul Ajar Deep Learning, Pabrik Soal'],
        ['Bab 4', 'Administrasi Harian', 'Presensi Harian, Penilaian Tugas/Formatif/Sumatif, Agenda Mengajar'],
        ['Bab 5', 'Pusat Laporan & Output', 'Cetak PDF resmi ber-KOP sekolah dan tanda tangan elektronik digital'],
        ['Bab 6', 'Masa Aktif & Pencadangan', 'Kategori aktif (1 Jam, 1 Hari, 30 Hari, Permanen) & Backup JSON'],
        ['Bab 7', 'Tanya Jawab & Bantuan', 'Solusi kendala NIP/NIY, cetak dokumen PDF, & WhatsApp Helpdesk']
      ];

      autoTable(doc, {
        startY: currentY,
        head: [['Bab', 'Kategori Panduan', 'Uraian Ringkas Fitur']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
        styles: { fontSize: 8, cellPadding: 2.2 },
        columnStyles: {
          0: { cellWidth: 24, fontStyle: 'bold' },
          1: { cellWidth: 50, fontStyle: 'bold' },
          2: { cellWidth: 'auto' }
        },
        margin: { left: 14, right: 14 }
      });

      currentY = (doc as any).lastAutoTable.finalY + 8;

      // Detail Sections
      chapters.forEach((chap) => {
        // Page break check
        if (currentY > pageHeight - 40) {
          doc.addPage();
          currentY = 16;
        }

        doc.setFillColor(238, 242, 255); // indigo-50
        doc.roundedRect(14, currentY, pageWidth - 28, 7.5, 1.5, 1.5, 'F');
        doc.setTextColor(30, 58, 138); // blue-900
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.text(`${chap.badge.toUpperCase()}: ${chap.title.toUpperCase()}`, 18, currentY + 5.2);
        currentY += 11;

        if (chap.steps) {
          chap.steps.forEach(st => {
            if (currentY > pageHeight - 25) {
              doc.addPage();
              currentY = 16;
            }
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8.5);
            doc.setTextColor(15, 23, 42);
            doc.text(`${st.num}. [${st.role}] ${st.title}`, 16, currentY);
            currentY += 4.5;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(51, 65, 85);
            const lines = doc.splitTextToSize(st.desc, pageWidth - 34);
            doc.text(lines, 20, currentY);
            currentY += (lines.length * 3.8) + 2.5;
          });
        }

        if (chap.items) {
          chap.items.forEach(it => {
            if (currentY > pageHeight - 25) {
              doc.addPage();
              currentY = 16;
            }
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8.5);
            doc.setTextColor(30, 41, 59);
            doc.text(`• ${it.title}`, 16, currentY);
            currentY += 4.5;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(71, 85, 105);
            const lines = doc.splitTextToSize(it.content, pageWidth - 34);
            doc.text(lines, 20, currentY);
            currentY += (lines.length * 3.8) + 2.5;
          });
        }

        currentY += 3;
      });

      // Footer Notes
      if (currentY > pageHeight - 25) {
        doc.addPage();
        currentY = 16;
      }
      doc.setFillColor(248, 250, 252);
      doc.rect(14, currentY, pageWidth - 28, 18, 'F');
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(`Dicetak dari SIAP GURU pada: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`, 18, currentY + 6);
      doc.text('Aplikasi Sistem Informasi Administrasi & Perangkat Guru • Dukungan Teknis: 0852-5570-0081', 18, currentY + 11);

      // Save PDF
      doc.save(`Buku_Panduan_Ringkas_SIAP_GURU_${schoolTitle.replace(/\s+/g, '_')}.pdf`);
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil Mengunduh PDF',
        text: 'File Buku Panduan Ringkas SIAP GURU (A4) telah berhasil diunduh.',
        confirmButtonColor: '#2563eb',
        timer: 2500
      });
    } catch (err: any) {
      console.error('Error generating guide PDF:', err);
      Swal.fire('Error', 'Gagal membuat file PDF: ' + err.message, 'error');
    }
  };

  // Filter chapters based on active tab & search query
  const filteredChapters = chapters.filter(chap => {
    const matchesBab = activeBab === 'all' || chap.id === activeBab;
    if (!matchesBab) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = chap.title.toLowerCase().includes(q);
    const descMatch = chap.desc.toLowerCase().includes(q);
    const itemMatch = chap.items?.some(it => it.title.toLowerCase().includes(q) || it.content.toLowerCase().includes(q));
    const stepMatch = chap.steps?.some(st => st.title.toLowerCase().includes(q) || st.desc.toLowerCase().includes(q));
    return titleMatch || descMatch || itemMatch || stepMatch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 print:p-0 print:m-0 print:max-w-full">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#0A1128] via-[#0E1A3C] to-[#162044] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-950/80 relative overflow-hidden print:hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" /> Buku Petunjuk Resmi SIAP GURU
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Panduan Ringkas Aplikasi
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Petunjuk operasional lengkap untuk <strong>Admin Sekolah</strong> dan <strong>Bapak/Ibu Guru</strong>. Tersedia dalam tampilan interaktif serta dapat diunduh langsung dalam format dokumen PDF A4 resmi.
            </p>
          </div>

          {/* Action Button - Unduh PDF A4 Saja */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleDownloadPdf}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
              title="Unduh file dokumen PDF A4 resmi"
            >
              <Download className="w-4 h-4" />
              <span>Unduh PDF A4</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 dark:border-slate-700/80 flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari topik panduan (misal: NIP/NIY, modul ajar, absensi)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Quick Chapter Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 hide-scrollbar">
          <button
            onClick={() => setActiveBab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeBab === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Semua Topik
          </button>
          <button
            onClick={() => setActiveBab('alur_cepat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeBab === 'alur_cepat'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            ⚡ Alur Cepat
          </button>
          <button
            onClick={() => setActiveBab('akun_login')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeBab === 'akun_login'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            🔑 NIP/NIY &amp; Login
          </button>
          <button
            onClick={() => setActiveBab('fitur_ai')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeBab === 'fitur_ai'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            ✨ Fitur AI
          </button>
          <button
            onClick={() => setActiveBab('akademik_harian')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeBab === 'akademik_harian'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            📊 Absen &amp; Nilai
          </button>
          <button
            onClick={() => setActiveBab('laporan_output')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeBab === 'laporan_output'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            🖨️ Cetak PDF
          </button>
        </div>
      </div>

      {/* Chapters Listing */}
      <div className="space-y-6">
        {filteredChapters.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
            <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Tidak ada topik panduan yang cocok</h3>
            <p className="text-slate-500 text-xs mt-1">Coba gunakan kata kunci lain seperti "login", "modul", "siswa", atau "nilai".</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveBab('all'); }}
              className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 cursor-pointer"
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          filteredChapters.map((chap) => {
            const Icon = chap.icon;
            return (
              <div 
                key={chap.id} 
                className="bg-white dark:bg-slate-800 rounded-3xl shadow-xs border border-slate-200/90 dark:border-slate-700/80 overflow-hidden break-inside-avoid"
              >
                {/* Chapter Header */}
                <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/30">
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2.5 rounded-2xl border ${chap.color} shadow-xs`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          {chap.badge}
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                        {chap.title}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Chapter Description */}
                <div className="px-6 pt-4 pb-1">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {chap.desc}
                  </p>
                </div>

                {/* Chapter Content */}
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Step by step format if available */}
                  {chap.steps && (
                    <div className="space-y-3.5">
                      {chap.steps.map((st) => (
                        <div 
                          key={st.num} 
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-700/60 flex items-start gap-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                            {st.num}
                          </div>
                          <div className="space-y-1 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                {st.role}
                              </span>
                              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                                {st.title}
                              </h4>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-0.5">
                              {st.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Standard Item Cards */}
                  {chap.items && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {chap.items.map((item, idx) => (
                        <div 
                          key={idx}
                          className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-700/60 hover:bg-slate-100/60 dark:hover:bg-slate-900/70 transition-colors flex items-start gap-3"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                              {item.title}
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                              {item.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* External PDF Custom Link Card (Optional for Superadmin / Admin Sekolah) */}
      {(userRole === 'superadmin' || userRole === 'admin_sekolah') && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-indigo-950/40 rounded-3xl p-6 border border-blue-200 dark:border-indigo-800 print:hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Tautan File PDF Panduan Eksternal Sekolah (Opsional)
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl">
                Jika sekolah Anda memiliki dokumen SOP / buku panduan PDF khusus tersendiri (misal disimpan di Google Drive atau server sekolah), Anda dapat menautkan linknya di sini untuk langsung dibuka oleh guru.
              </p>
            </div>
            
            <button
              onClick={() => setIsEditingUrl(!isEditingUrl)}
              className="px-4 py-2 bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-600 font-bold rounded-xl text-xs hover:bg-indigo-50 transition-colors shrink-0 cursor-pointer shadow-2xs"
            >
              {isEditingUrl ? 'Tutup Pengaturan' : 'Atur Link PDF'}
            </button>
          </div>

          {isEditingUrl && (
            <div className="mt-4 pt-4 border-t border-blue-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-3">
              <input
                type="url"
                placeholder="Masukkan link PDF (contoh: https://drive.google.com/.../view atau link file PDF)"
                value={customPdfUrl}
                onChange={(e) => setCustomPdfUrl(e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => {
                  if (customPdfUrl) {
                    window.open(customPdfUrl, '_blank');
                  } else {
                    Swal.fire('Info', 'Masukkan link URL dokumen PDF terlebih dahulu', 'info');
                  }
                }}
                className="w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Link PDF</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Support Contact Footer Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left print:hidden">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0 border border-emerald-200 dark:border-emerald-800">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
              Butuh Bantuan Teknis atau Panduan Tambahan?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tim support SIAP GURU siap membantu sekolah dan bapak/ibu guru jika mengalami kendala teknis.
            </p>
          </div>
        </div>
        <a
          href="https://wa.me/6285255700081?text=Halo%20Admin%20SIAP%20GURU,%20saya%20ingin%20bertanya%20mengenai%20buku%20panduan%20aplikasi."
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer shrink-0"
        >
          Hubungi Helpdesk WhatsApp
        </a>
      </div>
    </div>
  );
};
