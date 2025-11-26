# Analisis Kompetitor Common Data Environment (CDE)

Dokumen ini berisi analisis fitur dari beberapa platform CDE terkemuka (Plannerly, Tekla/Trimble Connect, dan Autodesk Construction Cloud) untuk menjadi referensi dalam pengembangan CDE SaaS versi "murah".

## 1. Plannerly
Plannerly memposisikan dirinya sebagai platform manajemen BIM yang menyederhanakan kepatuhan terhadap ISO 19650.

### Fitur Utama:
- **Manajemen Dokumen & Workflow:** Persetujuan dokumen terintegrasi, penamaan otomatis, dan versioning.
- **BIM Scope & Task Management:** Visualisasi lingkup kerja (scope), milestones, dan tugas yang terhubung langsung dengan elemen BIM.
- **Integrasi Model:** Mendukung lebih dari 80 format file BIM (termasuk IFC dan Revit) dan terintegrasi dengan Autodesk Construction Cloud.
- **Smart Foldering:** Pengorganisasian file cerdas dengan filter yang dapat disimpan.
- **Kepatuhan ISO 19650:** Template dan alur kerja bawaan yang selaras dengan standar ISO 19650 (WIP, Shared, Published, Archived).
- **Verifikasi Model:** Pengecekan otomatis apakah model memenuhi persyaratan informasi yang ditentukan.

### Poin Penting untuk SaaS Kita:
- Fokus pada **simplifikasi** standar yang rumit (ISO 19650) menjadi alur kerja visual yang mudah dipahami.
- Fitur **penamaan otomatis** sangat membantu pengguna menghindari kesalahan manual.

## 2. Tekla (via Trimble Connect)
Tekla menggunakan Trimble Connect sebagai backbone CDE-nya, yang dikenal kuat dalam kolaborasi model 3D dan data konstruksi.

### Fitur Utama:
- **Single Source of Truth:** Repositori terpusat untuk semua data proyek (gambar, model, spesifikasi).
- **Kolaborasi Real-time:** Akses data kapan saja dan di mana saja untuk tim multi-disiplin.
- **Status Sharing:** Mendukung status data seperti WIP, Shared, dan Published.
- **BIM Viewer:** Kemampuan melihat dan meninjau model 3D yang sangat baik langsung di browser/aplikasi.
- **Aksesibilitas:** Dukungan kuat untuk perangkat mobile dan tablet untuk tim lapangan.
- **Integrasi:** Terhubung mulus dengan Tekla Structures, SketchUp, dan software lainnya.

### Poin Penting untuk SaaS Kita:
- **Viewer 3D/BIM** yang ringan di browser adalah nilai jual utama.
- Kemudahan akses bagi tim lapangan (mobile friendly) sangat krusial.

## 3. Autodesk Construction Cloud (ACC)
ACC adalah solusi enterprise yang sangat komprehensif, mencakup seluruh siklus hidup konstruksi.

### Fitur Utama:
- **Kontrol Dokumen & Versioning:** Kontrol versi yang ketat dan audit trail lengkap.
- **Manajemen Izin (Permissions):** Kontrol akses yang sangat granular (siapa bisa lihat/edit/hapus apa).
- **Design Collaboration:** Alur kerja khusus untuk membagikan paket desain antar tim disiplin (Arsitek, Struktur, MEP).
- **Issue Management:** Pelacakan masalah (issues) yang terpusat dan dapat ditugaskan ke orang tertentu.
- **Review & Approval Workflows:** Alur persetujuan dokumen yang dapat dikustomisasi.
- **ISO 19650 Support:** Mendukung penamaan file standar ISO 19650 secara native.

### Poin Penting untuk SaaS Kita:
- **Granular Permissions** adalah fitur wajib untuk keamanan data proyek.
- **Audit Trail** (siapa melakukan apa dan kapan) sangat penting untuk akuntabilitas.
- Fitur **Issue Tracking** sederhana bisa menjadi nilai tambah besar dibanding sekadar penyimpanan file.

## Kesimpulan untuk Pengembangan SaaS CDE
Untuk membuat versi "murah" namun fungsional, kita harus memprioritaskan:
1.  **Struktur Folder & Penamaan Standar:** Mengadopsi prinsip ISO 19650 tanpa membuatnya terlalu rumit.
2.  **Manajemen Izin:** Memastikan data aman dan hanya diakses oleh yang berhak.
3.  **Viewer Sederhana:** Setidaknya bisa melihat PDF dan format gambar dengan baik (bonus jika bisa IFC ringan).
4.  **Audit Trail:** Mencatat riwayat perubahan file.
5.  **Status Workflow:** Mekanisme simpel untuk memindahkan file dari WIP -> Shared -> Published.
