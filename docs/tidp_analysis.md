# Analisis TIDP (Task Information Delivery Plan) & Fitur SaaS

## 1. Definisi TIDP
**TIDP (Task Information Delivery Plan)** adalah jadwal rinci pengiriman informasi yang dibuat oleh setiap **Task Team** (tim disiplin spesifik, misal: Tim Arsitek, Tim Struktur, Tim MEP).

Ini adalah "Janji Temu" dari setiap tim kepada Lead Appointed Party tentang:
-   **Apa** yang akan mereka kerjakan (Daftar Gambar/Model/Laporan).
-   **Kapan** mereka akan menyetorkannya.
-   **Siapa** yang bertanggung jawab (Author).

## 2. Komponen Utama TIDP (ISO 19650)
Setiap baris dalam TIDP harus memuat:
1.  **ID Unik:** Kode referensi dokumen (sesuai naming convention).
2.  **Deskripsi:** Judul atau penjelasan singkat.
3.  **Responsibility:** Siapa author/pembuatnya.
4.  **Level of Information Need:** Seberapa detail isinya (LOD/LOIN).
5.  **Milestones:** Tanggal-tanggal penting (Draft, Review, Final).

## 3. Terjemahan ke Fitur SaaS CDE

Dalam SaaS CDE, TIDP bukan sekadar file Excel statis, tapi **modul perencanaan interaktif**.

### A. Fitur Input & Manajemen TIDP
| Komponen TIDP | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Pembuatan TIDP** | **Interactive Grid / Spreadsheet View** | Antarmuka mirip Excel di browser untuk input daftar dokumen. Bisa import dari CSV/Excel. |
| **Validasi Naming** | **ID Generator / Validator** | Saat input ID dokumen, sistem mengecek apakah formatnya sesuai standar proyek. |
| **Assignment** | **User Tagging** | Kolom "Author" terhubung langsung dengan database user, sehingga tugas langsung muncul di dashboard user tersebut. |

### B. Fitur Tracking & Progress
| Kebutuhan | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Monitoring** | **Status Indicators** | Di sebelah setiap item TIDP, ada indikator status real-time: *Not Started, In Progress, Shared, Published*. |
| **Deadline** | **Due Date Alerts** | Notifikasi otomatis ke Author H-3 sebelum tanggal submission yang dijanjikan di TIDP. |
| **Keterkaitan** | **Link to File** | Setelah file diupload ke CDE, file tersebut otomatis ter-link ke baris TIDP-nya. Tidak perlu update manual "Sudah dikirim". |

## 4. Workflow TIDP di SaaS
1.  **Inisiasi:** Lead Appointed Party meminta setiap Task Team menyusun TIDP.
2.  **Drafting:** Kapten Tim (Task Team Lead) login ke SaaS, masuk ke modul TIDP, dan mengisi rencana kerja timnya.
3.  **Submission:** Tim mensubmit TIDP mereka ke Lead Appointed Party untuk direview.
4.  **Approval:** Lead Appointed Party menyetujui TIDP.
5.  **Agregasi:** Sistem otomatis menggabungkan TIDP-TIDP ini menjadi **MIDP** (lihat dokumen MIDP Analysis).

## Kesimpulan
Fitur TIDP di SaaS CDE mengubah "dokumen mati" menjadi **alat kontrol produksi**.
Bagi User (Task Team), ini adalah **To-Do List** resmi mereka.
Bagi Sistem, ini adalah **basis data** untuk memprediksi kapan file akan masuk.
