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
    xs: { box: 'w-7 h-7', svg: 'w-5 h-5', text: 'text-sm', sub: 'text-[9px]' },
    sm: { box: 'w-9 h-9', svg: 'w-6 h-6', text: 'text-base', sub: 'text-[10px]' },
    md: { box: 'w-12 h-12', svg: 'w-8 h-8', text: 'text-xl', sub: 'text-xs' },
    lg: { box: 'w-16 h-16', svg: 'w-11 h-11', text: 'text-2xl', sub: 'text-sm' },
    xl: { box: 'w-20 h-20', svg: 'w-14 h-14', text: 'text-3xl', sub: 'text-base' },
    '2xl': { box: 'w-24 h-24', svg: 'w-16 h-16', text: 'text-4xl', sub: 'text-lg' },
  };

  const currentSize = sizeMap[size];

  // The Aesthetic SVG Emblem for "SG" (Siap Guru)
  const Emblem = (
    <div
      className={`relative ${currentSize.box} rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 p-[1.5px] shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 hover:scale-105 group select-none flex items-center justify-center`}
    >
      {/* Outer ambient glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-400/20 via-blue-500/20 to-purple-500/30 blur-[6px] opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Inner Surface with glassy depth */}
      <div className="relative w-full h-full rounded-[14px] bg-gradient-to-br from-indigo-900/90 via-slate-900/95 to-indigo-950/90 backdrop-blur-md flex items-center justify-center overflow-hidden border border-white/15">
        {/* Subtle geometric lines in background */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
          fill="none"
        >
          <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1" className="text-blue-300" strokeDasharray="3 3" />
          <path d="M15 85 L85 15" stroke="currentColor" strokeWidth="1" className="text-cyan-300" />
        </svg>

        {/* Master Monogram SG SVG Vector */}
        <svg
          viewBox="0 0 100 100"
          className={`${currentSize.svg} text-white drop-shadow-[0_2px_8px_rgba(59,130,246,0.5)]`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="sgGradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" /> {/* Cyan 400 */}
              <stop offset="50%" stopColor="#60A5FA" /> {/* Blue 400 */}
              <stop offset="100%" stopColor="#818CF8" /> {/* Indigo 400 */}
            </linearGradient>
            <linearGradient id="sgGradGold" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FDE047" />
            </linearGradient>
            <linearGradient id="sgGradAccent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#BAE6FD" />
            </linearGradient>
          </defs>

          {/* Letter 'S' - Dynamic Modern Streamlined Curve */}
          <path
            d="M 44 26 C 36 24 23 27 23 37 C 23 48 45 46 45 57 C 45 66 33 68 24 65 C 21 64 19 62 19 62"
            stroke="url(#sgGradAccent)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Letter 'G' - Bold Geometric Curve interlocked */}
          <path
            d="M 77 34 C 73 26 62 23 53 25 C 40 28 35 40 35 52 C 35 66 45 76 60 76 C 73 76 80 67 80 55 L 61 55"
            stroke="url(#sgGradPrimary)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Education & AI Cap / Star Sparkle at Top Right */}
          <path
            d="M 80 18 L 82 23 L 87 25 L 82 27 L 80 32 L 78 27 L 73 25 L 78 23 Z"
            fill="url(#sgGradGold)"
          />

          {/* Ready Checkmark / Forward Chevron embedded */}
          <path
            d="M 50 83 L 56 89 L 68 79"
            stroke="#38BDF8"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
        </svg>

        {/* Micro sparkle in top right corner */}
        {showSparkle && (
          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] animate-pulse" />
        )}
      </div>
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
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
              SG
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none mt-0.5">
            Sistem Administrasi & Perangkat
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
          Sistem Informasi Administrasi & Perangkat Guru
        </span>
      </div>
    </div>
  );
};
