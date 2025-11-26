# Analisis AIR (Asset Information Requirements) & Fitur SaaS

## 1. Definisi AIR (ISO 19650)
**AIR (Asset Information Requirements)** adalah dokumen yang merinci informasi teknis, komersial, dan manajerial yang dibutuhkan untuk **mengoperasikan dan merawat aset** setelah konstruksi selesai.

Jika PIR fokus pada "Keputusan Proyek", AIR fokus pada "Operasional Gedung".
AIR adalah "Daftar Belanja" dari Tim Facility Management (FM) kepada Tim Konstruksi.

AIR menjawab pertanyaan:
-   "Data apa yang saya butuhkan untuk memperbaiki AC ini 5 tahun lagi?"
-   "Kapan garansi lift ini habis?"
-   "Di mana lokasi katup pemadam kebakaran di lantai 3?"

## 2. Isi Dokumen AIR
AIR biasanya sangat teknis dan detail, mencakup:
1.  **Legal & Compliance:** Sertifikat, Izin, Dokumen K3.
2.  **Commercial:** Biaya penggantian, umur ekonomis, data supplier.
3.  **Technical:** Spesifikasi teknis, manual operasi, data perawatan.
4.  **Geometry:** Model 3D as-built yang akurat.

Format data yang diminta biasanya spesifik, misal: "Harus format COBie" atau "Harus input ke sistem CAFM Maximo".

## 3. Terjemahan ke Fitur SaaS CDE

Dalam SaaS CDE, AIR diterjemahkan menjadi **"Asset Data Collection & Handover Module"**.

### A. Fitur Pengumpulan Data Aset
| Kebutuhan AIR | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Struktur Data** | **Asset Registry Template** | Template database aset yang sesuai standar (misal: COBie). Kontraktor tinggal isi, tidak perlu bikin format sendiri. |
| **Input Data** | **BIM-to-Data Extraction** | Fitur untuk menyedot data parameter langsung dari model 3D (Revit/IFC) ke dalam tabel aset CDE. |
| **Manual & Dokumen** | **QR Code Tagging** | Fitur untuk generate QR Code unik per aset. Saat discan di lapangan, langsung muncul manual PDF-nya di HP. |

### B. Fitur Validasi & Handover
| Kebutuhan AIR | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Kelengkapan** | **Data Completeness Checker** | Dashboard yang menunjukkan: "Lantai 1: 90% Aset lengkap datanya. Lantai 2: Masih 50%". |
| **Format** | **COBie Export** | Tombol satu klik untuk mengekspor seluruh data aset CDE menjadi file Excel COBie yang siap diimpor ke software FM. |
| **Digital Twin** | **Viewer with Asset Link** | Klik objek AC di 3D Viewer, langsung muncul data riwayat perawatannya (jika terintegrasi sistem FM). |

## 4. Workflow AIR di SaaS
1.  **Define:** Owner (Tim FM) mendefinisikan parameter aset yang wajib diisi (AIR) di awal proyek via CDE.
2.  **Populate:** Selama konstruksi, Kontraktor mengisi data tersebut. Bisa via upload Excel, sync dari Revit, atau input manual di lapangan via HP.
3.  **Validate:** Menjelang serah terima, CDE memvalidasi apakah semua kolom wajib sudah terisi.
4.  **Handover:** Saat serah terima, data diekspor atau ditransfer via API ke sistem manajemen gedung Owner.

## Kesimpulan
AIR di SaaS CDE adalah jembatan antara **Dunia Konstruksi (Project)** dan **Dunia Operasional (Asset)**.
Fitur ini memastikan bahwa saat kunci gedung diserahkan, "kunci digital"-nya (data aset) juga lengkap dan siap pakai.
Tanpa fitur ini, Owner hanya dapat gedung kosong tanpa manual book.
