import React, { useState } from 'react';
import { Download, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'navbar' | 'sidebar' | 'banner' | 'floating';
  label?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'navbar',
  label = 'Instal Aplikasi'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If already running standalone (already installed), no need to show intrusive install prompts
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome !== 'accepted') {
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  if (variant === 'sidebar') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200/80 dark:border-blue-800/60 transition-all cursor-pointer ${className}`}
          title="Pasang aplikasi SIAP GURU di Layar Utama HP / Desktop"
        >
          <img src="/pwa-192x192.png" alt="" className="w-5 h-5 rounded-md object-cover" />
          <span className="flex-1 text-left truncate">{label}</span>
          <Download className="w-3.5 h-3.5 shrink-0" />
        </button>

        <PWAInstallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  if (variant === 'floating') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`fixed bottom-24 right-6 z-40 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-full shadow-lg shadow-blue-600/35 hover:scale-105 active:scale-95 transition-all text-xs cursor-pointer border border-white/20 animate-bounce duration-1000 ${className}`}
          title="Pasang di Layar Utama HP"
        >
          <img src="/pwa-192x192.png" alt="" className="w-5 h-5 rounded-full object-cover bg-white" />
          <span>Pasang di HP</span>
        </button>

        <PWAInstallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  // Default navbar variant
  return (
    <>
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 text-xs font-bold transition-all shadow-2xs hover:scale-[1.02] cursor-pointer ${className}`}
        title="Pasang aplikasi SIAP GURU ke Layar Utama HP atau Laptop"
      >
        <img src="/pwa-192x192.png" alt="" className="w-4 h-4 rounded object-cover" />
        <span>{label}</span>
      </button>

      <PWAInstallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
