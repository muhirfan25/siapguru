#!/bin/bash
sed -i 's/email: "",/email: "",\n    asalSekolah: "",/' src/components/LandingPageView.tsx
sed -i 's/- Nama: ${regData.nama}/- Nama: ${regData.nama}\\n- Asal Sekolah: ${regData.asalSekolah}/' src/components/LandingPageView.tsx
