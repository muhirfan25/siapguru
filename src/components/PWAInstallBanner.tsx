import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // If already installed, never show banner
    if (isInstalled) {
      setIsVisible(false);
      return;
    }

    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('pwa_banner_dismissed') === 'true';
    if (!isDismissed) {
      // Show after 2.5 seconds delay so it feels polite and natural
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isInstalled]);

  if (!isVisible || isInstalled) {
    return (
      <PWAInstallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    );
  }

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome === 'accepted') {
        setIsVisible(false);
      } else {
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <aside 
        aria-label="Pemberitahuan Instalasi Aplikasi PWA"
        className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-40 bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-4 shadow-2xl border border-blue-200 dark:border-blue-900/60 animate-in slide-in-from-bottom-5 duration-300"
      >
        <div className="flex items-start gap-3">
          <img 
            src="/pwa-192x192.png" 
            alt="SIAP GURU Icon" 
            className="w-11 h-11 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 object-cover shrink-0 bg-white" 
          />
          <div className="flex-1 min-w-0 pr-5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 dark:text-blue-400">
              <Sparkles className="w-3 h-3" />
              <span>Instal Aplikasi di Layar Utama HP</span>
            </div>
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
              SIAP GURU (Aplikasi Resmi)
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
              Akses cepat tanpa repot buka browser setiap hari. Ringan, cepat, dan praktis.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
            aria-label="Tutup Banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 py-2 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Pasang di HP Sekarang</span>
          </button>
          <button
            onClick={handleDismiss}
            className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Nanti
          </button>
        </div>
      </aside>

      <PWAInstallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
