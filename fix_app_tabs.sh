#!/bin/bash
sed -i 's/activeTab === "kelolaguru"/activeTab === "guru"/' src/App.tsx
sed -i 's/activeTab === "kontrolsandi"/activeTab === "password"/' src/App.tsx
sed -i 's/activeTab === "absensi"/activeTab === "input_absen"/g' src/App.tsx
sed -i 's/activeTab === "penilaian"/activeTab === "input_nilai"/g' src/App.tsx
sed -i 's/activeTab === "agenda"/activeTab === "agenda_mengajar"/g' src/App.tsx
sed -i 's/activeTab === "bimbingan"/activeTab === "bimbingan_wali"/g' src/App.tsx
sed -i 's/activeTab === "catatan"/activeTab === "catatan_guru"/g' src/App.tsx
sed -i 's/activeTab === "arsip"/activeTab === "arsip_perangkat"/g' src/App.tsx
sed -i 's/activeTab === "perangkat_ai"/activeTab === "generator_perangkat_ai"/g' src/App.tsx
sed -i 's/activeTab === "modulai"/activeTab === "modul_ajar_ai"/g' src/App.tsx
sed -i 's/activeTab === "asistenai"/activeTab === "asisten_ai"/g' src/App.tsx

# Add activeTab === "sekolah" and activeTab === "siswa_bimbingan"
sed -i '/activeTab === "siswa" &&/i \
          {activeTab === "sekolah" && userRole === "superadmin" && <DashboardSuperadminView />}' src/App.tsx

