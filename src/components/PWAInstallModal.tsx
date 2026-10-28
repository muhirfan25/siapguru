import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Share2, 
  PlusSquare, 
  Monitor, 
  CheckCircle2, 
  X, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>(isIOS ? 'ios' : 'android');
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const outcome = await install();
    if (outcome === 'accepted') {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2500);
    } else if (outcome === 'manual_guide') {
      if (isIOS) setActiveTab('ios');
      else setActiveTab('android');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-lg my-auto max-h-[88vh] sm:max-h-[85vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pwa-modal-title"
      >
        {/* Sticky Header with Official App Icon */}
        <div className="sticky top-0 z-20 px-5 py-4 sm:px-6 sm:py-4.5 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white shrink-0 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img 
                src="/pwa-192x192.png" 
                alt="Ikon SIAP GURU" 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shadow-md border-2 border-white/50 object-cover bg-white shrink-0" 
              />
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-bold text-blue-100 backdrop-blur-xs mb-0.5">
                  <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                  <span>Aplikasi Resmi PWA</span>
                </div>
                <h3 id="pwa-modal-title" className="text-base sm:text-lg font-black text-white leading-tight truncate">
                  Instal SIAP GURU
                </h3>
                <p className="text-[11px] text-blue-100/90 truncate">
                  Pasang di Layar Utama HP &bull; Buka 1 Ketukan
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/15 transition-colors shrink-0 cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Tutup Panduan"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {installSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Berhasil Dipasang!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto">
                Ikon resmi SIAP GURU kini telah tersimpan di layar utama (Home Screen) perangkat Anda.
              </p>
            </div>
          ) : (
            <>
              {/* Direct 1-Click Install Button if supported by browser */}
              {isInstallable && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950/60 border border-blue-200 dark:border-indigo-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                  <div className="text-left w-full sm:w-auto">
                    <div className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Instalasi 1-Klik Tersedia</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Browser Anda mendukung instalasi langsung
                    </div>
                  </div>
                  <button
                    onClick={handleInstallClick}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Pasang Sekarang</span>
                  </button>
                </div>
              )}

              {/* Platform Switcher Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Pilih Jenis Perangkat Anda:
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('android')}
                    className={`py-2 px-2 rounded-xl text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'android'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Android</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('ios')}
                    className={`py-2 px-2 rounded-xl text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'ios'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    <Share2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">iPhone / iPad</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('desktop')}
                    className={`py-2 px-2 rounded-xl text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'desktop'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Laptop / PC</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: Android Guide */}
              {activeTab === 'android' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span>Petunjuk Pemasangan di HP Android (Google Chrome):</span>
                  </div>
                  <ol className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px] shadow-xs">
                        1
                      </span>
                      <div className="leading-relaxed">
                        Buka website <strong className="text-blue-600 dark:text-blue-400">siapguru.web.id</strong> menggunakan aplikasi <strong className="text-slate-900 dark:text-white">Google Chrome</strong> di HP Anda.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px] shadow-xs">
                        2
                      </span>
                      <div className="leading-relaxed">
                        Ketuk ikon <strong>Titik Tiga (⋮)</strong> di pojok kanan atas browser Google Chrome.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px] shadow-xs">
                        3
                      </span>
                      <div className="leading-relaxed">
                        Pilih menu <strong className="text-slate-900 dark:text-white">"Tambahkan ke Layar Utama"</strong> atau <strong className="text-slate-900 dark:text-white">"Instal Aplikasi"</strong>.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px] shadow-xs">
                        4
                      </span>
                      <div className="leading-relaxed">
                        Ketuk tombol <strong>"Instal"</strong>. Ikon resmi SIAP GURU langsung terpasang di Home Screen HP Anda.
                      </div>
                    </li>
                  </ol>
                </div>
              )}

              {/* Tab 2: iOS Guide */}
              {activeTab === 'ios' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span>Petunjuk Pemasangan di iPhone / iPad (Safari):</span>
                  </div>
                  <ol className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px] shadow-xs">
                        1
                      </span>
                      <div className="leading-relaxed">
                        Buka website di browser resmi <strong className="text-slate-900 dark:text-white">Safari</strong> bawaan Apple.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px] shadow-xs">
                        2
                      </span>
                      <div className="leading-relaxed">
                        Ketuk tombol <strong className="text-slate-900 dark:text-white">Bagikan (Share)</strong> yang bersimbol kotak panah ke atas (<Share2 className="w-3.5 h-3.5 inline text-blue-600 mx-0.5" />) di bilah navigasi bawah Safari.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px] shadow-xs">
                        3
                      </span>
                      <div className="leading-relaxed">
                        Gulir menu ke bawah dan ketuk opsi <strong className="text-slate-900 dark:text-white">"Tambahkan ke Layar Utama" (Add to Home Screen)</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-slate-700 dark:text-slate-300 mx-0.5" />).
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px] shadow-xs">
                        4
                      </span>
                      <div className="leading-relaxed">
                        Ketuk <strong className="text-slate-900 dark:text-white">"Tambah" (Add)</strong> di pojok kanan atas. Ikon SIAP GURU langsung muncul di beranda iPhone Anda.
                      </div>
                    </li>
                  </ol>
                </div>
              )}

              {/* Tab 3: Desktop Guide */}
              {activeTab === 'desktop' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span>Petunjuk Pemasangan di Laptop / Komputer:</span>
                  </div>
                  <ol className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px] shadow-xs">
                        1
                      </span>
                      <div className="leading-relaxed">
                        Buka website menggunakan browser <strong className="text-slate-900 dark:text-white">Google Chrome</strong> atau <strong className="text-slate-900 dark:text-white">Microsoft Edge</strong>.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px] shadow-xs">
                        2
                      </span>
                      <div className="leading-relaxed">
                        Perhatikan di ujung paling kanan <strong>kolom alamat URL browser (Address Bar)</strong>, akan tampak ikon <strong className="text-blue-600 dark:text-blue-400">Instal Aplikasi (<Download className="w-3.5 h-3.5 inline mx-0.5" />)</strong> atau tombol komputer.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px] shadow-xs">
                        3
                      </span>
                      <div className="leading-relaxed">
                        Klik tombol tersebut lalu pilih <strong>"Instal"</strong>. Aplikasi langsung berjalan sebagai aplikasi mandiri di desktop Anda.
                      </div>
                    </li>
                  </ol>
                </div>
              )}

              {/* Benefit Highlight */}
              <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold shadow-xs">
                  ⚡
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300">
                  <strong className="text-blue-950 dark:text-blue-200 block font-bold">Keunggulan SIAP GURU PWA:</strong>
                  Sangat ringan (&lt; 2 MB), tidak memenuhi memori HP, layar penuh tanpa gangguan tab, dan data otomatis tersimpan di cloud.
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 z-20 px-5 py-3.5 sm:px-6 sm:py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Gratis &bull; Tanpa Google Play Store
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
