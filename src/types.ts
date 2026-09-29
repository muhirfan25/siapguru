export type SubscriptionPlan = 
  | '1_jam'
  | '2_jam'
  | '3_jam'
  | '6_jam'
  | '12_jam'
  | '1_hari'
  | '2_hari'
  | '3_hari'
  | '7_hari'
  | '14_hari'
  | '30_hari'
  | '6_bulan'
  | '1_tahun'
  | 'permanen'
  | 'custom';

export interface Sekolah {
  id: string; // Document ID
  nama: string;
  alamat?: string;
  kepalaSekolah?: string;
  status: 'active' | 'blocked' | 'expired';
  subscriptionPlan?: SubscriptionPlan;
  customDurationValue?: number;
  customDurationUnit?: 'jam' | 'hari' | 'bulan';
  expiresAt?: number | null; // Timestamp in ms. null or undefined for permanen
  activatedAt?: number;
  emailAdmin?: string;
  createdAt?: number;
  updatedAt?: number;
}

export type UserRole = 'superadmin' | 'admin_sekolah' | 'guru';

export interface UserAccount {
  id: string; // Auth UID
  email: string;
  role: UserRole;
  sekolahId?: string; // Optional for superadmin
  nama?: string;
  subscriptionPlan?: SubscriptionPlan;
  expiresAt?: number | null;
  updatedAt?: number;
}

export interface Siswa {
  id: string;
  nisn: string;
  nama: string;
  kelas: string;
  sekolahId?: string;
  updatedAt?: number;
}

export interface Mapel {
  id: string;
  namaMapel: string;
  semester: string;
  tahunAjaran: string;
  sekolahId?: string;
  updatedAt?: number;
}

export interface Jadwal {
  id: string;
  hari: string;
  jam: string;
  kelas: string;
  mapel: string;
  sekolahId?: string;
  updatedAt?: number;
}

export interface LogAbsensi {
  id: string;
  waktu: string; // YYYY-MM-DD
  tanggal: string;
  kelas: string;
  mapel: string;
  idSiswa: string;
  namaSiswa: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';
  bulan: string;
  tahun: string;
  namaGuru: string;
  sekolahId?: string;
  updatedAt?: number;
}

export interface DataNilai {
  id: string;
  waktu: string;
  jenis: string; // e.g. UH1, UTS, UAS, Tugas 1
  mapel: string;
  kelas: string;
  idSiswa: string;
  namaSiswa: string;
  nilai: number | '';
  namaGuru: string;
  sekolahId?: string;
  updatedAt?: number;
}

export interface JurnalAgenda {
  id: string;
  tanggal: string;
  jam: string;
  kelas: string;
  mapel: string;
  materi: string;
  status: string; // Terlaksana / Tunda
  absenSiswa: string;
  ket?: string;
  namaGuru: string;
  sekolahId?: string;
  updatedAt?: number;
}

export interface SiswaBimbingan {
  id: string;
  namaSiswa: string;
  kelas: string;
  sekolahId?: string;
  updatedAt?: number;
}

export interface BimbinganWali {
  id: string;
  tanggal: string;
  namaSiswa: string;
  kelas: string;
  jenis: string; // Akademik, Pribadi, Sosial, Keterampilan
  kasus: string;
  tindakLanjut: string;
  guruWali: string;
  sekolahId?: string;
  updatedAt?: number;
}

export interface Guru {
  id: string;
  nip: string;
  nama: string;
  password?: string;
  sekolahId?: string;
  updatedAt?: number;
}

export interface CatatanGuru {
  id: string;
  judul: string;
  kategori: string;
  isi: string;
  tanggal: string;
  sekolahId?: string;
  updatedAt?: number;
}

export interface ArsipPerangkat {
  id: string;
  namaArsip: string;
  url: string;
  namaPengunggah: string;
  tanggal: string;
  sekolahId?: string;
  updatedAt?: number;
}

export interface Pengaturan {
  Nama_Guru: string;
  NIP_Guru: string;
  Pemerintah: string;
  Nama_Sekolah: string;
  Alamat_Sekolah: string;
  Nama_Kepsek: string;
  NIP_Kepsek: string;
  Tempat_Tanda_Tangan: string;
  Logo_Kiri: string;
  Logo_Kanan: string;
  isDatabaseCleared?: boolean;
  sekolahId?: string;
}

export interface ModulFormState {
  namaGuru: string;
  namaSekolah: string;
  tahunAjaran: string;
  jenjang: string;
  fase: string;
  kelas: string;
  waktu: string;
  mataPelajaran: string;
  topik: string;
  subTopik: string;
  jumlahPertemuan: string;
  model: string;
  metode?: string;
  tujuan: string;
  karakteristik: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
