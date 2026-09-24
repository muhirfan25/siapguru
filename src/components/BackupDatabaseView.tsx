import React, { useState } from "react";
import { 
  Database, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  FileJson, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Clock, 
  Layers, 
  ShieldCheck, 
  Trash2, 
  HelpCircle, 
  HardDrive, 
  CloudRain, 
  ExternalLink,
  ChevronRight
} from "lucide-react";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { exportAllDatabaseCollections, restoreDatabaseBackup } from "../lib/firebase";
import { Siswa, Guru, Mapel, LogAbsensi, DataNilai, Jadwal, Pengaturan } from "../types";

interface BackupDatabaseViewProps {
  userRole?: string | null;
  sekolahId?: string;
  config: Pengaturan;
  siswaList: Siswa[];
  guruList: Guru[];
  mapelList: Mapel[];
  absensiList: LogAbsensi[];
  nilaiList: DataNilai[];
  jadwalList: Jadwal[];
  onNavigateToReset?: () => void;
}

export const BackupDatabaseView: React.FC<BackupDatabaseViewProps> = ({
  userRole,
  sekolahId,
  config,
  siswaList,
  guruList,
  mapelList,
  absensiList,
  nilaiList,
  jadwalList,
  onNavigateToReset
}) => {
  const [isExportingJson, setIsExportingJson] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [restorePreview, setRestorePreview] = useState<any | null>(null);

  const namaSekolahClean = (config.namaSekolah || "sekolah").toLowerCase().replace(/[^a-z0-9]/g, "_");
  const currentDateStr = new Date().toISOString().slice(0, 10);

  // 1. Export JSON Full Backup
  const handleExportJson = async () => {
    setIsExportingJson(true);
    try {
      const targetSekolahId = userRole === "superadmin" ? undefined : sekolahId;
      const backupResult = await exportAllDatabaseCollections(targetSekolahId);

      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(backupResult, null, 2)
      )}`;
      const downloadAnchor = document.createElement("a");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", `backup_siagat_${namaSekolahClean}_${timestamp}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      Swal.fire({
        icon: "success",
        title: "Pencadangan Berhasil!",
        text: `Total ${backupResult.meta.totalRecords} data berhasil diekspor ke dalam berkas JSON.`,
        confirmButtonColor: "#2563eb"
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal Mencadangkan Data",
        text: err?.message || "Terjadi kesalahan saat mengekspor database.",
        confirmButtonColor: "#ef4444"
      });
    } finally {
      setIsExportingJson(false);
    }
  };

  // 2. Export Excel Workbook
  const handleExportExcel = () => {
    setIsExportingExcel(true);
    try {
      const wb = XLSX.utils.book_new();

      // Siswa Sheet
      const siswaData = siswaList.map((s, idx) => ({
        No: idx + 1,
        NISN: s.nisn,
        "Nama Siswa": s.nama,
        Kelas: s.kelas,
        "Jenis Kelamin": s.jenisKelamin,
        "Status": s.status
      }));
      const wsSiswa = XLSX.utils.json_to_sheet(siswaData);
      XLSX.utils.book_append_sheet(wb, wsSiswa, "Data Siswa");

      // Guru Sheet
      const guruData = guruList.map((g, idx) => ({
        No: idx + 1,
        NIP: g.nip,
        "Nama Guru": g.nama,
        Status: (g as any).status || "Aktif"
      }));
      const wsGuru = XLSX.utils.json_to_sheet(guruData);
      XLSX.utils.book_append_sheet(wb, wsGuru, "Data Guru");

      // Mapel Sheet
      const mapelData = mapelList.map((m, idx) => ({
        No: idx + 1,
        "Nama Mapel": m.nama,
        Tingkat: m.tingkat,
        "Alokasi Jam": m.alokasiJam
      }));
      const wsMapel = XLSX.utils.json_to_sheet(mapelData);
      XLSX.utils.book_append_sheet(wb, wsMapel, "Mata Pelajaran");

      // Jadwal Sheet
      const jadwalData = jadwalList.map((j, idx) => ({
        No: idx + 1,
        Hari: j.hari,
        "Jam Ke": j.jamKe,
        Kelas: j.kelas,
        "Mata Pelajaran": j.mapel,
        Ruangan: j.ruang
      }));
      const wsJadwal = XLSX.utils.json_to_sheet(jadwalData);
      XLSX.utils.book_append_sheet(wb, wsJadwal, "Jadwal Mengajar");

      // Absensi Sheet
      const absensiData = absensiList.slice(0, 5000).map((a, idx) => ({
        No: idx + 1,
        Tanggal: a.tanggal,
        "Nama Siswa": a.namaSiswa,
        Kelas: a.kelas,
        Status: a.status,
        Keterangan: a.keterangan || ""
      }));
      const wsAbsensi = XLSX.utils.json_to_sheet(absensiData);
      XLSX.utils.book_append_sheet(wb, wsAbsensi, "Presensi Absensi");

      // Nilai Sheet
      const nilaiData = nilaiList.slice(0, 5000).map((n, idx) => ({
        No: idx + 1,
        "Nama Siswa": n.namaSiswa,
        Kelas: n.kelas,
        Mapel: n.mapel,
        "Jenis Penilaian": n.jenisPenilaian,
        "Nilai": n.nilai
      }));
      const wsNilai = XLSX.utils.json_to_sheet(nilaiData);
      XLSX.utils.book_append_sheet(wb, wsNilai, "Nilai Akademik");

      XLSX.writeFile(wb, `arsip_data_${namaSekolahClean}_${currentDateStr}.xlsx`);

      Swal.fire({
        icon: "success",
        title: "Ekspor Excel Selesai!",
        text: "Arsip lembar kerja siswa, guru, mapel, jadwal, presensi & nilai berhasil diunduh.",
        confirmButtonColor: "#2563eb"
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal Ekspor Excel",
        text: err?.message || "Terjadi kesalahan saat menyusun berkas Excel.",
        confirmButtonColor: "#ef4444"
      });
    } finally {
      setIsExportingExcel(false);
    }
  };

  // 3. File Selection for Restore
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRestoreFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.data) {
          throw new Error("Berkas JSON bukan format cadangan SIAP GURU yang valid.");
        }
        setRestorePreview(parsed);
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Format Berkas Rusak",
          text: err?.message || "Berkas tidak dapat dibaca sebagai file backup SIAP GURU.",
          confirmButtonColor: "#ef4444"
        });
        setRestoreFile(null);
        setRestorePreview(null);
      }
    };
    reader.readAsText(file);
  };

  // 4. Restore Action
  const handleExecuteRestore = async () => {
    if (!restorePreview) return;

    const result = await Swal.fire({
      icon: "warning",
      title: "Konfirmasi Pemulihan Database?",
      html: `
        <div class="text-left text-sm space-y-2">
          <p>Anda akan memulihkan data dari berkas cadangan:</p>
          <div class="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-mono">
            Tanggal Cadangan: <b>${restorePreview?.meta?.exportedAt ? new Date(restorePreview.meta.exportedAt).toLocaleString("id-ID") : "-"}</b><br/>
            Total Catatan: <b>${restorePreview?.meta?.totalRecords || Object.keys(restorePreview.data).reduce((acc, k) => acc + (restorePreview.data[k]?.length || 0), 0)}</b>
          </div>
          <p class="text-amber-600 font-semibold mt-2">Perhatian: Data yang ada akan disinkronkan dan diperbarui dengan isi berkas cadangan ini.</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Ya, Pulihkan Sekarang",
      cancelButtonText: "Batal",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#64748b"
    });

    if (result.isConfirmed) {
      setIsRestoring(true);
      try {
        const targetSekolahId = userRole === "superadmin" ? undefined : sekolahId;
        const restoredCount = await restoreDatabaseBackup(restorePreview, targetSekolahId);

        Swal.fire({
          icon: "success",
          title: "Pemulihan Berhasil!",
          text: `Sebanyak ${restoredCount} dokumen database berhasil dipulihkan ke sistem.`,
          confirmButtonColor: "#2563eb"
        });

        setRestoreFile(null);
        setRestorePreview(null);
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Gagal Memulihkan Data",
          text: err?.message || "Terjadi kesalahan saat memulihkan database.",
          confirmButtonColor: "#ef4444"
        });
      } finally {
        setIsRestoring(false);
      }
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-blue-100">
              <ShieldCheck className="w-3.5 h-3.5" /> Pusat Keamanan Data & Cadangan
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Pencadangan & Pemulihan Database (Backup & Restore)
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              Amankan seluruh master data sekolah, riwayat presensi harian, nilai akademik, dan perangkat ajar ke dalam media penyimpanan lokal atau Google Drive Anda.
            </p>
          </div>

          {onNavigateToReset && (
            <button
              onClick={onNavigateToReset}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer backdrop-blur-xs shrink-0"
            >
              <span>Lanjut ke Hapus Database</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Ringkasan Data Yang Akan Dicadangkan */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Status Data Terkini di Database
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sekolah: <b>{config.namaSekolah || "Semua Sekolah"}</b> • ID: <span className="font-mono">{sekolahId || "Global"}</span>
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Tersinkronisasi Realtime
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/70 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 font-medium">Data Siswa</p>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{siswaList.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/70 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 font-medium">Data Guru</p>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{guruList.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/70 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 font-medium">Mata Pelajaran</p>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{mapelList.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/70 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 font-medium">Jadwal Pelajaran</p>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{jadwalList.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/70 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 font-medium">Log Presensi</p>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{absensiList.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/70 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 font-medium">Rekap Nilai</p>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{nilaiList.length}</p>
          </div>
        </div>
      </div>

      {/* 2 Metode Utama: Unduh Cadangan JSON & Ekspor Excel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Full Backup JSON */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 rounded-2xl flex items-center justify-center border border-blue-200/70 dark:border-blue-800/60 shadow-2xs">
              <FileJson className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Cadangkan Penuh (Full JSON Backup)
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Mengekspor seluruh koleksi database ke dalam 1 berkas format <code>.json</code> terstruktur. Berkas ini dapat digunakan kembali untuk memulihkan (*restore*) database jika data terhapus atau bermigrasi.
            </p>
            <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl text-xs text-blue-800 dark:text-blue-300 space-y-1 border border-blue-100 dark:border-blue-900/40">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Mencakup 100% Seluruh Data:
              </p>
              <p className="text-[11px] text-blue-700 dark:text-blue-300">
                Data Guru, Siswa, Mapel, Jadwal, Absensi, Nilai, Jurnal Agenda, Bimbingan Wali, Catatan Guru, dan Profil Sekolah.
              </p>
            </div>
          </div>

          <button
            onClick={handleExportJson}
            disabled={isExportingJson}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {isExportingJson ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Sedang Mengekspor Data...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Unduh Cadangan Database (.JSON)</span>
              </>
            )}
          </button>
        </div>

        {/* Card 2: Ekspor Excel Multi-Sheet */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-200/70 dark:border-emerald-800/60 shadow-2xs">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Arsip Lembar Kerja Excel (.XLSX)
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Mengekstrak data ke dalam buku kerja Microsoft Excel dengan lembar terpisah (Siswa, Guru, Mapel, Jadwal, Absensi, dan Nilai). Sangat mudah dibaca dan dicetak secara manual oleh pihak sekolah.
            </p>
            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 space-y-1 border border-emerald-100 dark:border-emerald-900/40">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Siap Dibuka di Excel / Google Spreadsheet:
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                Cocok untuk arsip cetak berkala, pelaporan ke pengawas, atau pemeriksaan data secara offline tanpa aplikasi.
              </p>
            </div>
          </div>

          <button
            onClick={handleExportExcel}
            disabled={isExportingExcel}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {isExportingExcel ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Menyusun Berkas Excel...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Unduh Lembar Kerja (.XLSX)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bagian Pemulihan Database (Restore) */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Pemulihan Data Dari Berkas Cadangan (Restore Database)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Gunakan fitur ini jika sebelumnya Anda pernah mengunduh file cadangan <code>.json</code> dan ingin memulihkannya kembali ke sistem.
            </p>
          </div>
        </div>

        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all">
          <input
            type="file"
            id="backupFileInput"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="backupFileInput" className="cursor-pointer block space-y-3">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto border border-indigo-200/80 dark:border-indigo-800/80 shadow-xs">
              <FileJson className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {restoreFile ? restoreFile.name : "Pilih atau Seret Berkas Cadangan (.JSON) ke Sini"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Pastikan berkas dihasilkan dari fitur unduh cadangan aplikasi SIAP GURU.
              </p>
            </div>
            <span className="inline-block px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors">
              Pilih Berkas Dari Komputer
            </span>
          </label>
        </div>

        {/* Preview Berkas Restore */}
        {restorePreview && (
          <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800/60 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                Informasi Berkas Cadangan Terdeteksi
              </h4>
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-indigo-200/60 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200 rounded-full">
                Valid SIAP GURU Format
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <p>Waktu Pembuatan: <b>{restorePreview.meta?.exportedAt ? new Date(restorePreview.meta.exportedAt).toLocaleString("id-ID") : "-"}</b></p>
              <p>Target Sekolah: <b>{restorePreview.meta?.sekolahId || "-"}</b></p>
              <p>Jumlah Entitas: <b>{Object.keys(restorePreview.data || {}).length} Koleksi</b></p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleExecuteRestore}
                disabled={isRestoring}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all disabled:opacity-50"
              >
                {isRestoring ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sedang Menyinkronkan Data...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Mulai Pulihkan Data Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PANDUAN RUTIN PENCADANGAN DATA */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-500" />
            Langkah & Panduan Praktis Pencadangan Data Rutin
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Ikuti pedoman standar industri berikut untuk menjamin data administrasi sekolah Anda tidak pernah hilang.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Langkah 1 */}
          <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-2">
            <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-black text-sm">
              1
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Cadangkan Mingguan / Bulanan</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Jadwalkan setiap hari Jumat sore atau tanggal 25 tiap bulannya untuk mengunduh <b>Cadangan Penuh (.JSON)</b> melalui tombol di atas.
            </p>
          </div>

          {/* Langkah 2 */}
          <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-2">
            <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-black text-sm">
              2
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Terapkan Kaidah 3-2-1</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Simpan <b>3 salinan</b> data: 1 di server cloud SIAP GURU, 1 di komputer lokal laptop admin sekolah, dan 1 salinan di <b>Google Drive</b> akun sekolah.
            </p>
          </div>

          {/* Langkah 3 */}
          <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-2">
            <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center font-black text-sm">
              3
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Sebelum Mereset Database</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Selalu wajibkan mengunduh file cadangan <b>sebelum</b> masuk ke menu Hapus Database, sehingga data tahun ajaran lalu tetap aman tersimpan.
            </p>
          </div>
        </div>

        {/* Informasi Pencadangan Otomatis Google Cloud */}
        <div className="p-5 bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/50 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-amber-600" />
            Opsi Tambahan: Pencadangan Terjadwal Otomatis di Google Cloud Platform (GCP)
          </h4>
          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            Untuk skala instansi yang lebih besar, Anda dapat mengaktifkan fitur <b>Firestore Scheduled Export</b> melalui Google Cloud Console:
          </p>
          <ol className="list-decimal list-inside text-xs text-amber-800 dark:text-amber-300 space-y-1 font-medium pl-2">
            <li>Buka <b>Google Cloud Console</b> dengan project ID: <code>siagat</code>.</li>
            <li>Buat sebuah bucket penyimpanan di <b>Cloud Storage</b> (misal: <code>gs://siagat-firestore-backups</code>).</li>
            <li>Jalankan perintah ekspor otomatis harian menggunakan <b>Cloud Scheduler</b>:
              <code className="block mt-1 p-2 bg-amber-100 dark:bg-amber-900/60 rounded text-[11px] font-mono">
                gcloud firestore export gs://siagat-firestore-backups --collection-ids=data_siswa,data_guru,data_nilai,log_absensi
              </code>
            </li>
          </ol>
        </div>
      </div>

      {/* Box Zona Bahaya Navigasi (Tautan Cepat ke Hapus Database) */}
      {onNavigateToReset && (
        <div className="p-6 bg-red-50/80 dark:bg-red-950/30 rounded-3xl border border-red-200 dark:border-red-900/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-red-900 dark:text-red-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Sudah selesai mencadangkan dan ingin mereset aplikasi?
            </h4>
            <p className="text-xs text-red-700 dark:text-red-300">
              Jika Anda sedang mempersiapkan tahun ajaran baru dan data sudah diamankan, Anda dapat beralih ke menu Hapus Database.
            </p>
          </div>
          <button
            onClick={onNavigateToReset}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Buka Menu Hapus Database</span>
          </button>
        </div>
      )}
    </div>
  );
};
