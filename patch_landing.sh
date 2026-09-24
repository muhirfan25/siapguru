# Remove Alokasi Waktu Digital
sed -i '215,224d' src/components/LandingPageView.tsx

# Change App Title
sed -i 's/GuruDigital<span className="text-indigo-600">.AI<\/span>/SATU GURU/g' src/components/LandingPageView.tsx
sed -i 's/Revolusi Administrasi Guru: Lebih Cepat & Otomatis dengan <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">AI<\/span>/SATU GURU/g' src/components/LandingPageView.tsx

# Update Subtitle in Hero Section
sed -i 's/Tinggalkan tumpukan kertas dan jam kerja tambahan. Kelola siswa, susun perangkat ajar instan, hingga cetak laporan resmi ber-kop sekolah hanya dalam hitungan detik./(Sistem Administrasi Terpadu Guru)<br\/>Menekankan konsep one-stop solution di mana seluruh dokumen administrasi terintegrasi dalam satu pintu./g' src/components/LandingPageView.tsx

