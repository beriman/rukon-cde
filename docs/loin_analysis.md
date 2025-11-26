# Analisis Level of Information Need (EN 17412-1) & Fitur SaaS

## 1. Definisi Level of Information Need (LOIN)
**LOIN** adalah konsep modern untuk menggantikan LOD (Level of Detail/Development).
LOD sering ambigu (LOD 300 itu sedetail apa?).
LOIN lebih spesifik: **"Informasi apa yang dibutuhkan? Untuk siapa? Kapan?"**

LOIN membagi kebutuhan informasi menjadi 3 aspek:
1.  **Geometrical info:** Bentuk, dimensi, lokasi.
2.  **Alphanumerical info:** Data properti (Material, Fire Rating, Manufacturer).
3.  **Documentation:** Dokumen pendukung (Manual PDF, Garansi).

## 2. Mengapa SaaS CDE Butuh LOIN?
Agar tidak terjadi **"Information Overload"** atau **"Information Gap"**.
-   Jangan kirim model 1GB (LOD 500) ke Owner jika dia cuma butuh denah lantai (LOD 200).
-   Jangan kirim kotak kosong (LOD 100) ke Kontraktor jika dia butuh detail sambungan baja (LOD 400).

## 3. Fitur SaaS CDE untuk LOIN

SaaS CDE harus punya fitur **"Information Requirement Manager"**.

### A. Defining Requirements (IDS - Information Delivery Specification)
| Fitur | Deskripsi | Implementasi Teknis |
| :--- | :--- | :--- |
| **IDS Editor** | Form untuk membuat aturan: "Dinding harus punya properti *FireRating* dan *AcousticRating*". | Web-based editor untuk membuat file `.ids` (standar buildingSMART). |
| **Milestone Mapping** | Menentukan target: "Di tahap *Tender*, Dinding cukup punya *FireRating*. Di tahap *Handover*, harus tambah *Manufacturer*." | Matrix UI: Rows = Objects, Columns = Milestones. |

### B. Automated Checking
| Fitur | Deskripsi | Implementasi Teknis |
| :--- | :--- | :--- |
| **LOIN Validator** | Saat upload IFC, sistem mengecek apakah properti yang diminta sudah ada. | Parsing IFC dan membandingkan dengan rules IDS. |
| **Compliance Report** | Laporan otomatis: "Model Arsitek baru memenuhi 80% kebutuhan informasi tahap Tender." | Dashboard grafik kepatuhan. |

## 4. Workflow LOIN di SaaS
1.  **Define:** BIM Manager membuat aturan LOIN di CDE (misal: "Semua Pintu harus ada *WarrantyDate*").
2.  **Export:** Aturan ini diexport jadi file IDS atau XML untuk disetting di Revit/Archicad.
3.  **Model:** Arsitek memodelkan pintu dan mengisi data *WarrantyDate*.
4.  **Upload:** Arsitek upload IFC ke CDE.
5.  **Validate:** CDE otomatis menolak jika *WarrantyDate* masih kosong. "Upload Rejected: Missing LOIN data."

## 5. Implikasi untuk SaaS CDE
1.  **Granular Validation:** CDE tidak cuma cek "File ada/tidak", tapi cek "Isi file lengkap/tidak".
2.  **Dynamic Requirements:** Kebutuhan informasi berubah seiring waktu (Desain -> Konstruksi -> Operasional). CDE harus bisa handle *Time-based Requirements*.

## Kesimpulan
LOIN mengubah CDE dari "Tempat Sampah File" menjadi **"Gerbang Kualitas Data"**.
Hanya data yang **berguna** dan **lengkap** yang boleh masuk ke sistem.
