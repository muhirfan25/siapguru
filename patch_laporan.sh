sed -i '470i\
  const handleExportCatatanPDF = () => {\
    try {\
      const doc = new jsPDF("l", "mm", "a4");\
      const semTitle = selectedSemester === "ganjil" ? " (SEMESTER GANJIL TA 2026/2027)" : selectedSemester === "genap" ? " (SEMESTER GENAP TA 2026/2027)" : "";\
      applyOfficialKop(doc, `LAPORAN CATATAN PENTING GURU${semTitle}`, true);\
\
      const filteredCatatan = catatanList.filter((c) => filterBySemester(c, selectedSemester));\
      const tableBody = filteredCatatan.map((c, idx) => [\
        idx + 1,\
        c.tanggal || "-",\
        c.kategori,\
        c.judul,\
        c.isi\
      ]);\
\
      autoTable(doc, {\
        startY: 55,\
        head: [["No", "Tanggal", "Kategori", "Judul Catatan", "Isi Catatan"]],\
        body: tableBody,\
        theme: "grid",\
        headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: "bold" },\
        styles: { fontSize: 8, cellPadding: 2.5 }\
      });\
\
      const finalY = (doc as any).lastAutoTable.finalY || 100;\
      applySignatures(doc, finalY);\
      doc.save(`Laporan_Catatan_Guru_${selectedSemester}.pdf`);\
      notifyCetakSuccess("Laporan Catatan Guru berhasil diunduh!");\
    } catch (err: any) {\
      notifyCetakError(err.message || "Gagal mencetak Laporan Catatan Guru.");\
    }\
  };\
\
  const handleExportArsipPDF = () => {\
    try {\
      const doc = new jsPDF("l", "mm", "a4");\
      const semTitle = selectedSemester === "ganjil" ? " (SEMESTER GANJIL TA 2026/2027)" : selectedSemester === "genap" ? " (SEMESTER GENAP TA 2026/2027)" : "";\
      applyOfficialKop(doc, `LAPORAN ARSIP PERANGKAT PEMBELAJARAN${semTitle}`, true);\
\
      const filteredArsip = arsipList.filter((a) => filterBySemester(a, selectedSemester));\
      const tableBody = filteredArsip.map((a, idx) => [\
        idx + 1,\
        a.tanggal || "-",\
        a.namaArsip,\
        a.url,\
        a.namaPengunggah\
      ]);\
\
      autoTable(doc, {\
        startY: 55,\
        head: [["No", "Tanggal", "Nama Arsip", "Tautan Berkas", "Nama Pengunggah"]],\
        body: tableBody,\
        theme: "grid",\
        headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: "bold" },\
        styles: { fontSize: 8, cellPadding: 2.5 },\
        columnStyles: { 3: { cellWidth: 80 } }\
      });\
\
      const finalY = (doc as any).lastAutoTable.finalY || 100;\
      applySignatures(doc, finalY);\
      doc.save(`Laporan_Arsip_Perangkat_${selectedSemester}.pdf`);\
      notifyCetakSuccess("Laporan Arsip Perangkat berhasil diunduh!");\
    } catch (err: any) {\
      notifyCetakError(err.message || "Gagal mencetak Laporan Arsip Perangkat.");\
    }\
  };\
' src/components/PusatLaporanView.tsx
