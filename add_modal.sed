/<\/div>\n  );/i\
      {/* REGISTER MODAL */}\
      {isRegisterModalOpen && (\
        <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">\
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">\
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">\
              <h3 className="text-xl font-bold text-slate-900">Formulir Pendaftaran</h3>\
              <button onClick={() => setIsRegisterModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">\
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /><\/svg>\
              </button>\
            </div>\
            <div className="p-6 max-h-[80vh] overflow-y-auto">\
              <form onSubmit={handleRegisterSubmit} className="space-y-4">\
                <div>\
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>\
                  <input type="text" required value={regData.nama} onChange={(e) => setRegData({...regData, nama: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" placeholder="Masukkan nama Anda" />\
                </div>\
                <div>\
                  <label className="block text-sm font-semibold text-slate-700 mb-1">No HP/WA</label>\
                  <input type="tel" required value={regData.noHp} onChange={(e) => setRegData({...regData, noHp: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" placeholder="08..." />\
                </div>\
                <div>\
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Alamat Email</label>\
                  <input type="email" required value={regData.email} onChange={(e) => setRegData({...regData, email: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" placeholder="email@contoh.com" />\
                </div>\
                <div>\
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Jenis Kelamin</label>\
                  <select required value={regData.jenisKelamin} onChange={(e) => setRegData({...regData, jenisKelamin: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all">\
                    <option value="Laki-laki">Laki-laki</option>\
                    <option value="Perempuan">Perempuan</option>\
                  </select>\
                </div>\
                <div>\
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Pilihan Paket</label>\
                  <select required value={regData.paket} onChange={(e) => setRegData({...regData, paket: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all">\
                    <option value="Personal (Rp 99.000)">Personal / Pribadi - Rp 99.000</option>\
                    <option value="Sekolah (Rp 199.000)">Sekolah / Banyak Guru - Rp 199.000</option>\
                  </select>\
                </div>\
                <div className="pt-4">\
                  <button type="submit" className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all text-center">\
                    Kirim Pendaftaran\
                  </button>\
                </div>\
              </form>\
            </div>\
          </div>\
        </div>\
      )}
