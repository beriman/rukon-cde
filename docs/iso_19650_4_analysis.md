# Analisis ISO 19650-4 (Information Exchange) & Fitur SaaS

## 1. Definisi ISO 19650-4
**ISO 19650-4** adalah bagian yang paling teknis dan spesifik tentang **"Serah Terima Data"** (Information Exchange).
Jika Part 2 bicara "Proses", Part 4 bicara **"Kualitas Barang"** yang diserahkan.

Fokus utamanya adalah **Quality Assurance** dari pertukaran informasi.
Prinsipnya: "Jangan terima sampah."
Setiap kali ada pertukaran (misal: Kontraktor -> Owner), harus ada kriteria jelas untuk bilang "Sah/Valid".

## 2. Kriteria Pertukaran Informasi
Menurut ISO 19650-4, pertukaran informasi yang baik harus memenuhi kriteria:
1.  **Continuity:** Tidak ada data yang hilang saat pindah software.
2.  **Communication:** Format file bisa dibaca oleh penerima.
3.  **Consistency:** Struktur datanya konsisten (tidak berubah-ubah).
4.  **Completeness:** Semua metadata wajib terisi.

## 3. Terjemahan ke Fitur SaaS CDE

SaaS CDE untuk Part 4 berfungsi sebagai **"Quality Gatekeeper"**.

### A. Open BIM & Interoperability
ISO 19650-4 sangat mendorong penggunaan **Open Schema** (IFC, COBie) agar data tidak terkunci di satu vendor software.

| Kriteria ISO | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Open Formats** | **IFC Viewer & Parser** | CDE harus bisa membuka dan membaca isi file IFC tanpa perlu convert ke format proprietary. |
| **Schema Validation** | **IFC Checker** | Saat upload IFC, sistem mengecek: "Apakah file ini valid IFC 2x3 atau IFC 4?". |
| **Data Loss Prevention** | **Native + Open Pair** | Fitur untuk mengupload sepasang file (RVT + IFC) secara bersamaan sebagai satu kesatuan *Information Container*. |

### B. Quality Assurance (QA) Workflow
Sebelum file diterima oleh Owner, harus lewat pos pemeriksaan.

| Kriteria ISO | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Completeness** | **Metadata Validator** | "File ini ditolak karena kolom 'FireRating' masih kosong." |
| **Consistency** | **Naming Convention Enforcer** | "File ini ditolak karena namanya tidak sesuai standar proyek." |
| **Review Process** | **Markup & Issue Tracking** | Reviewer bisa memberi coretan (markup) langsung di atas model 3D di browser, lalu assign sebagai "Issue" ke Author. |

## 4. Workflow ISO 19650-4 di SaaS
1.  **Export:** Author (di Revit/Archicad) export model ke IFC sesuai settingan MVD (Model View Definition) yang disepakati.
2.  **Upload:** Author upload ke CDE.
3.  **Auto-Check:** CDE melakukan *Sanity Check* (Format, Nama, Ukuran, Virus).
4.  **Content Check:** Reviewer manusia mengecek isi visual.
5.  **Exchange:** Jika lolos, status berubah jadi *Shared* atau *Published*. Pihak lain bisa download.

## 5. Implikasi untuk SaaS CDE
SaaS CDE ISO 19650-4 harus:
1.  **Agnostik:** Tidak boleh memihak satu vendor software BIM tertentu. Harus netral.
2.  **Validator Cerdas:** Bukan cuma simpan file, tapi "mengerti" isi file (bisa baca properti di dalam IFC).
3.  **Audit Trail Pertukaran:** Mencatat detail teknis setiap transaksi file (Hash code, File size, Upload time).

## Kesimpulan
ISO 19650-4 adalah **Standar Mutu**.
SaaS CDE berperan sebagai **Laboratorium Uji** yang memastikan setiap data yang lewat sudah memenuhi Standar Mutu tersebut sebelum dikonsumsi oleh pihak lain.
