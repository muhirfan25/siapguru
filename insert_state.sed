/export const LandingPageView/a\
  const [isRegisterModalOpen, setIsRegisterModalOpen] = React.useState(false);\
  const [regData, setRegData] = React.useState({\
    nama: "",\
    noHp: "",\
    email: "",\
    jenisKelamin: "Laki-laki",\
    paket: "Personal (Rp 99.000)"\
  });\
\
  const handleRegisterSubmit = (e: React.FormEvent) => {\
    e.preventDefault();\
    const message = `Halo Admin, saya ingin mendaftar aplikasi SATU GURU.\n\nBerikut data pendaftaran saya:\n- Nama: ${regData.nama}\n- No HP/WA: ${regData.noHp}\n- Email: ${regData.email}\n- Jenis Kelamin: ${regData.jenisKelamin}\n- Pilihan Paket: ${regData.paket}\n\nUntuk transfer pendaftaran dapat dilakukan ke:\nBRI 022301014562531 AN. MUH IRFAN\nDANA: 085255700081\n\nApabila sudah transfer silahkan konfirmasi ya kak, jangan lupa lampirkan tanda bukti, terima kasih semoga kakak dapat manfaat yang banyak dari aplikasi ini.`;\
    const encodedMessage = encodeURIComponent(message);\
    window.open(`https://wa.me/6285255700081?text=${encodedMessage}`, "_blank");\
    setIsRegisterModalOpen(false);\
  };
