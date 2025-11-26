# Analisis BEP (BIM Execution Plan) & Fitur SaaS

## 1. Definisi BEP (ISO 19650)
**BEP (BIM Execution Plan)** adalah dokumen strategi yang menjelaskan **bagaimana** tim proyek akan mengelola informasi untuk memenuhi kebutuhan Owner (EIR).

Dalam ISO 19650, BEP dibagi menjadi dua fase:
1.  **Pre-appointment BEP (Tender Stage):**
    -   Diajukan oleh calon Kontraktor saat tender.
    -   Isinya: "Ini lho kemampuan tim kami, dan ini strategi kasar kami."
    -   Tujuannya: Meyakinkan Owner untuk memilih mereka.
2.  **Post-appointment BEP (Contract Stage):**
    -   Disusun oleh Kontraktor Pemenang setelah kontrak ditandatangani.
    -   Isinya: Rencana detail, nama personil, software yang dipakai, matriks tanggung jawab (RACI).
    -   Tujuannya: Menjadi panduan operasional sehari-hari.

## 2. Komponen Utama BEP
Sebuah BEP yang lengkap biasanya mencakup:
-   **Project Information:** Detail proyek & tim.
-   **Goals & Uses:** Tujuan BIM (misal: untuk Clash Detection, 4D Scheduling, FM).
-   **Roles & Staffing:** Siapa BIM Manager, siapa Coordinator.
-   **Process:** Workflow approval, strategi kolaborasi.
-   **Software & Hardware:** Versi software yang dipakai (agar kompatibel).
-   **Data Standards:** Naming convention, struktur folder, format file (IFC/Native).

## 3. Terjemahan ke Fitur SaaS CDE

SaaS CDE modern mengubah BEP dari "Dokumen PDF Tebal yang Jarang Dibaca" menjadi **"Konfigurasi Sistem yang Hidup"**.

### A. Fitur Pembuatan & Manajemen BEP
| Komponen BEP | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Penyusunan** | **Online BEP Editor** | Editor berbasis web (seperti Notion/Wiki) untuk menulis BEP langsung di platform. Bisa pakai template standar ISO 19650. |
| **Kolaborasi** | **Section Commenting** | Owner bisa memberi komentar spesifik di bab tertentu (misal: "Tolong revisi bagian software version"). |
| **Approval** | **Digital Signature** | BEP ditandatangani secara digital oleh semua pihak sebagai tanda kesepakatan kontrak. |

### B. Fitur Penegakan Aturan (Enforcement)
Ini adalah nilai jual utama SaaS. BEP bukan cuma janji, tapi dipaksa oleh sistem.

| Janji di BEP | Fitur Penegakan di SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Naming Convention** | **Naming Policy Enforcement** | Jika di BEP janji pakai format `PROYEK-ZONA-LEVEL-TIPE-PERAN-NOMOR`, sistem akan menolak file yang namanya `Final_Revisi_Banget.rvt`. |
| **Software Version** | **Metadata Validation** | Sistem bisa membaca header file IFC/RVT. Jika janji pakai Revit 2024 tapi upload Revit 2022, bisa diberi peringatan. |
| **Folder Structure** | **Auto-Generated Folders** | Struktur folder CDE digenerate otomatis berdasarkan kesepakatan di BEP. User tidak bisa bikin folder sembarangan. |

## 4. Workflow BEP di SaaS
1.  **Tender:** Calon kontraktor submit *Pre-appointment BEP* via portal tender CDE.
2.  **Award:** Pemenang mengubah dokumen itu menjadi *Post-appointment BEP*.
3.  **Setup:** Admin mengonfigurasi CDE (Naming, Folder, Permission) berdasarkan isi BEP yang disepakati.
4.  **Operasi:** Tim bekerja. Jika ada perubahan strategi (misal ganti software), BEP diupdate di sistem, dan konfigurasi CDE menyesuaikan.

## Kesimpulan
Di era SaaS, **BEP adalah Konfigurasi**.
Fitur "BEP Builder" di dalam CDE sangat krusial untuk memastikan bahwa apa yang disepakati di awal proyek benar-benar dijalankan oleh sistem secara otomatis.
