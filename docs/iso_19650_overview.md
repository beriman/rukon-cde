# Ringkasan ISO 19650 untuk Common Data Environment (CDE)

ISO 19650 adalah standar internasional untuk pengelolaan informasi selama siklus hidup aset binaan (built asset) menggunakan Building Information Modelling (BIM). Dokumen ini merangkum konsep-konsep kunci yang relevan untuk pengembangan CDE.

## 1. Konsep Dasar CDE
Menurut ISO 19650, CDE bukan sekadar teknologi, tetapi kombinasi dari **solusi teknologi** dan **alur kerja (workflow)**.
CDE berfungsi sebagai **Single Source of Truth** (sumber kebenaran tunggal) untuk semua informasi proyek, memastikan semua pihak bekerja dengan data yang sama dan terkini.

## 2. Information Container (Wadah Informasi)
Setiap file atau kumpulan data dalam CDE disebut sebagai *Information Container*. Ini bisa berupa:
- Model 3D (BIM)
- Gambar 2D (PDF, DWG)
- Dokumen (Laporan, Spesifikasi)
- Data non-grafis lainnya

Setiap container harus memiliki **ID Unik** yang persisten.

## 3. Konvensi Penamaan (Naming Convention)
ISO 19650 merekomendasikan standar penamaan file yang ketat untuk memudahkan identifikasi. Format umum (berdasarkan National Annex, bisa disesuaikan):

`[Proyek]-[Originator]-[Volume/Sistem]-[Level/Lokasi]-[Tipe]-[Peran]-[Nomor]`

Contoh: `PRJ01-ARC-ZZ-01-M3-A-0001`

- **Proyek:** Kode proyek.
- **Originator:** Kode perusahaan pembuat file.
- **Volume/Sistem:** Zona atau sistem bangunan.
- **Level/Lokasi:** Lantai atau lokasi spesifik.
- **Tipe:** Jenis dokumen (M3=Model 3D, DR=Drawing).
- **Peran:** Disiplin (A=Arsitek, S=Struktur).
- **Nomor:** Nomor urut (4-6 digit).

## 4. Status Workflow (State)
Informasi dalam CDE bergerak melalui empat status utama (State):

### a. Work In Progress (WIP)
- Data sedang dikerjakan oleh tim internal (task team).
- Belum diverifikasi atau disetujui untuk dibagikan.
- Hanya dapat diakses oleh tim pembuatnya.

### b. Shared
- Data telah diperiksa dan disetujui untuk dibagikan dengan tim lain (untuk koordinasi atau referensi).
- **Client Shared:** Dibagikan ke klien untuk persetujuan.
- Data di sini tidak boleh diubah. Jika ada revisi, harus kembali ke WIP.

### c. Published
- Data telah disetujui sepenuhnya (authorized) oleh klien atau pihak berwenang.
- Digunakan untuk tujuan spesifik: Konstruksi, Tender, atau Handover.
- Merupakan dokumen kontraktual.

### d. Archived
- Rekaman historis dari setiap container yang pernah dibagikan atau dipublikasikan.
- Untuk keperluan audit dan jejak rekam (audit trail).

## 5. Metadata Wajib
Setiap file dalam CDE harus memiliki metadata berikut:
- **Status Code:** Menunjukkan status saat ini (misal: S0=WIP, S1=Shared for Coordination, A1=Approved).
- **Revision Code:** Menunjukkan versi file (misal: P01, P02 untuk WIP; C01, C02 untuk Published).
- **Classification:** Kode klasifikasi (misal: Uniclass 2015) untuk memudahkan pencarian.

## Implikasi untuk SaaS CDE Kita
1.  **Workflow Engine:** Sistem harus memfasilitasi perpindahan file antar status (WIP -> Shared -> Published) dengan mekanisme persetujuan (approval).
2.  **Naming Validator:** Fitur untuk mengecek apakah nama file sesuai format standar sebelum diunggah.
3.  **Revision Control:** Otomatisasi versi (P01 -> P02) saat file baru diunggah di container yang sama.
4.  **Metadata Fields:** Menyediakan kolom khusus untuk Status, Revisi, dan Klasifikasi yang bisa dicari/difilter.
