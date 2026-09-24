sed -i '801i\
          {/* Card 7: Catatan Penting Guru */}\
          <div className="p-5 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">\
            <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">\
              <FileText className="w-4 h-4 text-red-600" />\
              Laporan Catatan Penting Guru\
            </h3>\
            <p className="text-xs text-slate-500">\
              Cetak laporan detail dari seluruh catatan penting dan agenda harian guru.\
            </p>\
            <button\
              onClick={handleExportCatatanPDF}\
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-xs cursor-pointer transition-colors mt-4"\
            >\
              <Download className="w-4 h-4" />\
              <span>Cetak PDF Catatan Penting</span>\
            </button>\
          </div>\
\
          {/* Card 8: Arsip Perangkat Pembelajaran */}\
          <div className="p-5 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">\
            <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">\
              <FileText className="w-4 h-4 text-red-600" />\
              Laporan Arsip Perangkat\
            </h3>\
            <p className="text-xs text-slate-500">\
              Cetak daftar tautan repositori arsip perangkat ajar sebagai bukti fisik kelengkapan mengajar.\
            </p>\
            <button\
              onClick={handleExportArsipPDF}\
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-xs cursor-pointer transition-colors mt-4"\
            >\
              <Download className="w-4 h-4" />\
              <span>Cetak PDF Arsip Perangkat</span>\
            </button>\
          </div>\
' src/components/PusatLaporanView.tsx
