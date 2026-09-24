import React, { useState, useEffect } from "react";
import { ClipboardCheck, CheckCircle2, Save, UserCheck } from "lucide-react";
import { Siswa, Mapel, LogAbsensi, Pengaturan } from "../types";
import { saveDocument, batchSaveDocuments, COLLECTIONS } from "../lib/firebase";
import { notifySimpanSuccess, notifySimpanError } from "../lib/swal";

interface InputAbsensiViewProps {
  siswaList: Siswa[];
  mapelList: Mapel[];
  absensiList: LogAbsensi[];
  config: Pengaturan;
}

export const InputAbsensiView: React.FC<InputAbsensiViewProps> = ({
  siswaList,
  mapelList,
  absensiList,
  config
}) => {
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedKelas, setSelectedKelas] = useState<string>("");
  const [selectedMapel, setSelectedMapel] = useState<string>("");
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Local attendance state mapping: studentId -> status
  const [attendanceState, setAttendanceState] = useState<Record<string, 'Hadir' | 'Izin' | 'Sakit' | 'Alpa'>>({});

  const kelasOptions = Array.from(new Set(siswaList.map((s) => s.kelas).filter(Boolean))).sort();
  const studentsInClass = siswaList.filter((s) => s.kelas === selectedKelas);

  // Load existing records for selected Date + Class + Mapel
  useEffect(() => {
    if (tanggal && selectedKelas && selectedMapel) {
      const existingRecords = absensiList.filter(
        (a) =>
          (a.waktu === tanggal || a.tanggal === tanggal) &&
          a.kelas === selectedKelas &&
          a.mapel === selectedMapel
      );

      const stateMap: Record<string, 'Hadir' | 'Izin' | 'Sakit' | 'Alpa'> = {};
      studentsInClass.forEach((s) => {
        const found = existingRecords.find((rec) => rec.idSiswa === s.id || rec.idSiswa === s.nisn);
        stateMap[s.id] = found ? found.status : "Hadir";
      });

      setAttendanceState(stateMap);
    }
  }, [tanggal, selectedKelas, selectedMapel, absensiList, siswaList]);

  // Set All Hadir
  const handleSetHadirSemua = () => {
    const updated: Record<string, 'Hadir' | 'Izin' | 'Sakit' | 'Alpa'> = {};
    studentsInClass.forEach((s) => {
      updated[s.id] = "Hadir";
    });
    setAttendanceState(updated);
  };

  // Change individual status
  const handleStatusChange = (studentId: string, status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa') => {
    setAttendanceState((prev) => ({ ...prev, [studentId]: status }));
  };

  // Save batch attendance to Firestore
  const handleSaveAbsensi = async () => {
    if (!tanggal || !selectedKelas || !selectedMapel) {
      notifySimpanError("Silakan pilih Tanggal, Kelas, dan Mata Pelajaran.");
      return;
    }

    if (studentsInClass.length === 0) {
      notifySimpanError("Belum ada siswa di kelas ini.");
      return;
    }

    const yearMonth = tanggal.split("-");
    const thn = yearMonth[0] || "2026";
    const bln = yearMonth[1] || "01";

    const itemsToSave: LogAbsensi[] = studentsInClass.map((s) => {
      const docId = `${tanggal}_${selectedKelas}_${selectedMapel}_${s.id}`;
      return {
        id: docId,
        waktu: tanggal,
        tanggal: tanggal,
        kelas: selectedKelas,
        mapel: selectedMapel,
        idSiswa: s.id,
        namaSiswa: s.nama,
        status: attendanceState[s.id] || "Hadir",
        bulan: bln,
        tahun: thn,
        namaGuru: config.Nama_Guru || "Guru"
      };
    });

    try {
      await batchSaveDocuments(COLLECTIONS.LOG_ABSENSI, itemsToSave);
      notifySimpanSuccess(`Absensi kelas ${selectedKelas} (${itemsToSave.length} siswa) tersimpan ke Firebase!`);
    } catch (err: any) {
      notifySimpanError(err.message || "Gagal menyimpan absensi.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xs border border-slate-200 dark:border-slate-800 space-y-4">
        {/* Header and mode toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-blue-600" />
              Input Absensi Harian Siswa
            </h2>
            <p className="text-xs text-slate-500">
              Catat presensi harian.
            </p>
          </div>
        </div>

        {/* Filter Selection Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Tanggal *</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold border rounded-lg bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Pilih Kelas *</label>
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold border rounded-lg bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 outline-none"
            >
              <option value="">Pilih Kelas</option>
              {kelasOptions.map((k) => (
                <option key={k} value={k}>
                  Kelas {k}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Pilih Mata Pelajaran *</label>
            <select
              value={selectedMapel}
              onChange={(e) => setSelectedMapel(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold border rounded-lg bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 outline-none"
            >
              <option value="">Pilih Mapel</option>
              {mapelList.map((m) => (
                <option key={m.id} value={m.namaMapel}>
                  {m.namaMapel}
                </option>
              ))}
            </select>
          </div>
        </div>

        {statusMsg && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
              statusMsg.type === "success"
                ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                : "bg-red-50 text-red-800 dark:bg-red-950/60 dark:text-red-300"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Manual Attendance Mode */}
        <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={handleSetHadirSemua}
                disabled={studentsInClass.length === 0}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <UserCheck className="w-4 h-4" />
                <span>Hadir Semua</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-200">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 uppercase font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3 text-center w-12">No</th>
                    <th className="p-3">Nama Siswa</th>
                    <th className="p-3 text-center w-24">Hadir</th>
                    <th className="p-3 text-center w-24">Izin</th>
                    <th className="p-3 text-center w-24">Sakit</th>
                    <th className="p-3 text-center w-24">Alpa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {!selectedKelas || !selectedMapel ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        Silakan pilih Tanggal, Kelas, dan Mata Pelajaran terlebih dahulu.
                      </td>
                    </tr>
                  ) : studentsInClass.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        Tidak ada siswa di Kelas {selectedKelas}.
                      </td>
                    </tr>
                  ) : (
                    studentsInClass.map((s, idx) => {
                      const currentStatus = attendanceState[s.id] || "Hadir";
                      return (
                        <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="p-3 text-center font-semibold text-slate-500">{idx + 1}</td>
                          <td className="p-3 font-semibold text-slate-800 dark:text-slate-100">{s.nama}</td>

                          {/* Status Options */}
                          <td className="p-3 text-center">
                            <input
                              type="radio"
                              name={`status_${s.id}`}
                              checked={currentStatus === "Hadir"}
                              onChange={() => handleStatusChange(s.id, "Hadir")}
                              className="w-4 h-4 accent-emerald-600 cursor-pointer"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="radio"
                              name={`status_${s.id}`}
                              checked={currentStatus === "Izin"}
                              onChange={() => handleStatusChange(s.id, "Izin")}
                              className="w-4 h-4 accent-amber-500 cursor-pointer"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="radio"
                              name={`status_${s.id}`}
                              checked={currentStatus === "Sakit"}
                              onChange={() => handleStatusChange(s.id, "Sakit")}
                              className="w-4 h-4 accent-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="radio"
                              name={`status_${s.id}`}
                              checked={currentStatus === "Alpa"}
                              onChange={() => handleStatusChange(s.id, "Alpa")}
                              className="w-4 h-4 accent-red-600 cursor-pointer"
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveAbsensi}
                disabled={studentsInClass.length === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-md cursor-pointer transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Absensi ke Firebase</span>
              </button>
            </div>
          </div>
      </div>
    </div>
  );
};
