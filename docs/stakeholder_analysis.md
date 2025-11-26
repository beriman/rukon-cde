# Analisis Penggunaan CDE Berdasarkan Stakeholder

Dokumen ini menjabarkan bagaimana setiap pemangku kepentingan (stakeholder) utama berinteraksi dengan Common Data Environment (CDE), peran mereka sesuai ISO 19650, dan fitur spesifik yang mereka butuhkan.

## 1. Project Owner (Pemilik Proyek)
Dalam ISO 19650 disebut sebagai **Appointing Party**.

### Peran & Interaksi:
-   **Inisiator:** Bertanggung jawab menyediakan atau menunjuk penyedia CDE.
-   **Penentu Standar:** Menetapkan persyaratan informasi (EIR - Employer's Information Requirements) dan standar penamaan.
-   **Approver Utama:** Satu-satunya pihak yang memiliki wewenang untuk memindahkan status data dari **Shared** ke **Published** (untuk konstruksi atau penggunaan lainnya).
-   **Auditor:** Memantau kemajuan proyek secara makro melalui dashboard.

### Kebutuhan Fitur di CDE:
-   **Dashboard Eksekutif:** Ringkasan progres, status persetujuan, dan isu kritikal.
-   **Approval Workflow:** Antarmuka mudah untuk meninjau dan menyetujui dokumen (Authorize).
-   **Audit Trail Lengkap:** Untuk memastikan akuntabilitas semua pihak.
-   **Data Ownership:** Jaminan kepemilikan data penuh, bahkan jika berganti kontraktor/konsultan.

## 2. Manajemen Konstruksi (MK) / Pengawas
Bertindak sebagai wakil pemilik atau koordinator teknis di lapangan.

### Peran & Interaksi:
-   **Gatekeeper:** Memeriksa kualitas dan kelengkapan data dari Kontraktor/Konsultan sebelum diajukan ke Owner.
-   **Koordinator:** Menggunakan data di status **Shared** untuk koordinasi antar disiplin dan deteksi bentrokan (clash detection).
-   **Pengawas Lapangan:** Memastikan pekerjaan di lapangan sesuai dengan gambar **Published**.
-   **Pelapor:** Mengunggah laporan harian/mingguan, foto progres, dan laporan K3.

### Kebutuhan Fitur di CDE:
-   **Viewer Cepat (Mobile Friendly):** Akses gambar kerja dan spek di tablet/HP saat di lapangan.
-   **Issue Tracking:** Mencatat temuan/cacat di lapangan dan menugaskannya ke kontraktor.
-   **Compare Versions:** Membandingkan gambar revisi dengan versi sebelumnya untuk melihat perubahan.
-   **Markups:** Mencoret-coret gambar digital untuk memberikan catatan revisi.

## 3. Perencana / Konsultan (Designer / Consultant)
Dalam ISO 19650 disebut sebagai **Appointed Party** bersama kontraktor, namun fokus mereka di fase desain.

### Peran & Interaksi:
-   **Pembuat Desain:** Menghasilkan seluruh dokumen desain (Gambar Arsitektur, Struktur, MEP, Spesifikasi Teknis).
-   **Model Author:** Membuat dan mengelola model BIM 3D (Revit, ArchiCAD, Tekla) di tahap **WIP**.
-   **Koordinator Desain:** Melakukan koordinasi antar disiplin (Arsitek-Struktur-MEP) untuk menghindari clash sebelum data masuk **Shared**.
-   **Responder:** Menjawab RFI (Request for Information) dari kontraktor saat fase konstruksi.
-   **Revisi Designer:** Mengeluarkan gambar revisi berdasarkan feedback dari MK atau Owner.

### Kebutuhan Fitur di CDE:
-   **Model Viewer/Checker:** Untuk melihat hasil gabungan model dari berbagai disiplin dan deteksi clash otomatis.
-   **Version Control Ketat:** Karena desain sering revisi, perlu tracking yang jelas (P01, P02, P03...).
-   **Comment Thread:** Diskusi antar disiplin di satu file (misal: "Balok ini bentrok dengan ducting AC").
-   **Export to Native Format:** Kemampuan download file native (.rvt, .dwg) untuk diedit, bukan hanya PDF.
-   **Integration with BIM Tools:** Plugin atau API untuk sinkronisasi langsung dari Revit/AutoCAD ke CDE.

## 4. Kontraktor (Contractor)

Dalam ISO 19650 bisa sebagai **Lead Appointed Party** (Kontraktor Utama) atau **Appointed Party** (Sub-kon).

### Peran & Interaksi:
-   **Produsen Data:** Menghasilkan sebagian besar data konstruksi (Shop Drawings, As-Built, Material Approval).
-   **Pengelola WIP:** Mengelola data internal timnya di status **Work In Progress (WIP)** sebelum dibagikan.
-   **Kolaborator:** Mengunggah data ke status **Shared** untuk dikoordinasikan dengan tim lain.
-   **Penerima Informasi:** Menerima gambar **Published** sebagai dasar acuan kerja yang sah.

### Kebutuhan Fitur di CDE:
-   **Bulk Upload:** Kemudahan mengunggah banyak file sekaligus.
-   **Naming Validator:** Pengecekan otomatis agar nama file sesuai standar proyek (menghindari penolakan admin).
-   **Transmittals:** Bukti serah terima dokumen digital secara resmi.
-   **RFI Management:** Mengajukan pertanyaan teknis (Request for Information) secara terstruktur.

## 4. User / Facility Manager (Pengelola Gedung)
Pihak yang akan menggunakan aset setelah konstruksi selesai.

### Peran & Interaksi:
-   **Penerima Aset:** Menerima data **Archived** dan **Published** (As-Built Drawings, Manual Operasional) saat serah terima.
-   **Operator:** Menggunakan data CDE untuk operasional dan pemeliharaan gedung.

### Kebutuhan Fitur di CDE:
-   **Pencarian Metadata:** Mencari manual pompa atau garansi AC berdasarkan kode aset, bukan hanya nama file.
-   **QR Code Linking (Opsional):** Menghubungkan fisik aset di gedung dengan data digital di CDE.
-   **Offline Access:** Mengunduh paket data lengkap untuk arsip lokal jika langganan CDE berakhir.

---

## Matriks Akses Sederhana (Contoh)

| Fitur | Owner | MK | Perencana | Kontraktor | User (FM) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Upload ke WIP** | ❌ | ✅ | ✅ | ✅ | ❌ |
| **Pindah ke Shared** | ❌ | ✅ | ✅ | ✅ | ❌ |
| **Approve ke Published**| ✅ | ✅ (Delegasi)| ❌ | ❌ | ❌ |
| **View Published** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Download Native** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Edit Model/File** | ❌ | ❌ | ✅ (WIP) | ✅ (WIP) | ❌ |
| **Clash Detection** | ❌ | ✅ | ✅ | ✅ | ❌ |
| **Hapus File** | ❌ | ❌ | ❌ | ❌ | ❌ |

*Catatan: "Hapus File" sebaiknya dinonaktifkan untuk menjaga integritas data (gunakan status "Obsolete" atau "Archived" sebagai gantinya).*

