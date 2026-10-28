import React from 'react';

interface SiapGuruLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'icon' | 'full' | 'floating-badge';
  className?: string;
  showSparkle?: boolean;
}

export const SiapGuruLogo: React.FC<SiapGuruLogoProps> = ({
  size = 'md',
  variant = 'icon',
  className = '',
  showSparkle = true,
}) => {
  // Size mappings for the icon emblem
  const sizeMap = {
    xs: { box: 'w-7 h-7', text: 'text-sm', sub: 'text-[9px]' },
    sm: { box: 'w-9 h-9', text: 'text-base', sub: 'text-[10px]' },
    md: { box: 'w-12 h-12', text: 'text-xl', sub: 'text-xs' },
    lg: { box: 'w-16 h-16', text: 'text-2xl', sub: 'text-sm' },
    xl: { box: 'w-20 h-20', text: 'text-3xl', sub: 'text-base' },
    '2xl': { box: 'w-24 h-24', text: 'text-4xl', sub: 'text-lg' },
  };

  const currentSize = sizeMap[size];

  // The Official Icon Emblem for SIAP GURU (Uploaded Image Asset)
  const Emblem = (
    <div
      className={`relative ${currentSize.box} rounded-2xl p-[1px] shadow-md shadow-blue-500/20 transition-all duration-300 hover:scale-105 group select-none flex items-center justify-center shrink-0`}
    >
      <img
        src="/pwa-192x192.png"
        alt="Logo Resmi SIAP GURU"
        className="w-full h-full object-cover rounded-xl shadow-xs border border-white/50 dark:border-slate-700 bg-white"
        loading="eager"
      />
      {showSparkle && (
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 shadow-[0_0_8px_#10b981]" />
      )}
    </div>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{Emblem}</div>;
  }

  if (variant === 'floating-badge') {
    return (
      <div
        className={`group relative inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-indigo-100 dark:border-indigo-900/50 shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 ${className}`}
      >
        <div className="relative">
          {Emblem}
          <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
          </span>
        </div>
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-sm">
              SIAP GURU
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
              Aplikasi Resmi
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none mt-0.5">
            Sistem Administrasi &amp; Perangkat
          </span>
        </div>
      </div>
    );
  }

  // Full Variant (Logo + Typography)
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {Emblem}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`font-extrabold text-blue-600 dark:text-blue-400 tracking-tight ${currentSize.text}`}>
            SIAP GURU
          </span>
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 shadow-[0_0_8px_rgba(37,99,235,0.7)]" />
        </div>
        <span className={`font-semibold text-slate-600 dark:text-slate-300 tracking-normal ${currentSize.sub}`}>
          Sistem Informasi Administrasi &amp; Perangkat Guru
        </span>
      </div>
    </div>
  );
};
