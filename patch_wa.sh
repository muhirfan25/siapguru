cat << 'INNER' > insert_wa.sed
/<\/footer>/a\
\
      {/* WhatsApp Floating Button */}\
      <a\
        href="https://wa.me/6285255700081?text=Halo,%20saya%20ingin%20bertanya%20tentang%20aplikasi%20SATU%20GURU."\
        target="_blank"\
        rel="noopener noreferrer"\
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg shadow-green-500/30 hover:bg-[#20bd5a] hover:scale-110 transition-all duration-300 group"\
        title="Hubungi kami via WhatsApp"\
      >\
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">\
          <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.06-.3-.15-1.265-.46-2.411-1.485-.893-.798-1.502-1.782-1.677-2.077-.175-.295-.018-.456.13-.603.136-.135.301-.344.451-.519.151-.175.201-.295.301-.495.101-.2.05-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.285-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.21 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.767-.721 2.016-1.426.248-.705.248-1.31.173-1.426-.074-.115-.272-.18-.572-.33z" />\
          <path fillRule="evenodd" clipRule="evenodd" d="M12.002 22a9.96 9.96 0 01-5.112-1.408l-5.69 1.493 1.517-5.545A9.972 9.972 0 1112.002 22zM12 20a7.973 7.973 0 10-4.148-1.164l-.248.148-3.329.873.888-3.243-.162-.257A7.973 7.973 0 0012 20z" />\
        </svg>\
        <span className="absolute right-16 bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-100 pointer-events-none">Hubungi via WhatsApp</span>\
      </a>
INNER
sed -i -f insert_wa.sed src/components/LandingPageView.tsx
