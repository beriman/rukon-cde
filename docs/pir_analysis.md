# Analisis PIR (Project Information Requirements) & Fitur SaaS

## 1. Definisi PIR (ISO 19650)
**PIR (Project Information Requirements)** adalah dokumen yang menjelaskan informasi apa yang dibutuhkan Owner pada **titik-titik keputusan penting (Key Decision Points)** dalam sebuah proyek spesifik.

Jika OIR adalah "Kebutuhan Organisasi Jangka Panjang", maka PIR adalah "Kebutuhan Proyek Ini Saja".

PIR menjawab pertanyaan:
-   "Apa yang perlu saya ketahui sebelum menyetujui desain konsep?"
-   "Apa yang perlu saya ketahui sebelum tender konstruksi?"
-   "Apa yang perlu saya ketahui sebelum serah terima gedung?"

## 2. Isi Dokumen PIR
PIR berfokus pada **Pertanyaan Strategis** (Plain Language Questions) yang harus dijawab oleh Tim Proyek melalui data/informasi.

Contoh isi PIR:
1.  **Key Decision Points:** Kapan Owner harus mengambil keputusan? (misal: Akhir Tahap Konsep, Akhir Tahap Desain Teknis).
2.  **Questions:**
    -   "Apakah desain ini memenuhi target budget?"
    -   "Apakah material yang dipilih tahan api sesuai standar baru?"
    -   "Berapa estimasi biaya operasional gedung ini per tahun?"
3.  **Deliverables:** Bukti apa yang diminta untuk menjawab pertanyaan di atas? (misal: Laporan Cost Estimate, Simulasi Energi).

## 3. Terjemahan ke Fitur SaaS CDE

Dalam SaaS CDE, PIR diterjemahkan menjadi **"Milestone & Gatekeeping System"**.

### A. Fitur Manajemen Milestone (Decision Gates)
| Kebutuhan PIR | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Key Decision Points** | **Stage Gate Workflow** | Proyek dibagi menjadi fase-fase (Concept, Design, Construction). Untuk pindah dari satu fase ke fase lain, harus melewati "Gate" (Pintu Gerbang). |
| **Questions** | **Requirement Checklist** | Di setiap Gate, ada daftar pertanyaan/checklist yang harus "Centang Hijau" semua sebelum Gate terbuka. |
| **Deliverables** | **Submission Linking** | User harus melampirkan file/bukti spesifik ke setiap butir checklist PIR. |

### B. Fitur Evaluasi & Keputusan
| Kebutuhan PIR | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Evaluasi** | **Gate Review Dashboard** | Dashboard khusus bagi Owner untuk melihat rangkuman jawaban atas pertanyaan PIR di fase tersebut. |
| **Keputusan** | **Go / No-Go Button** | Tombol besar bagi Owner untuk memutuskan: "Lanjut ke Fase Berikutnya" atau "Revisi Fase Ini". |

## 4. Workflow PIR di SaaS
1.  **Setup:** Di awal proyek, Owner mendefinisikan "Stage Gates" (misal: RIBA Plan of Work Stages 1-7) dan pertanyaan PIR untuk setiap Gate.
2.  **Execution:** Tim proyek bekerja dan mengupload dokumen.
3.  **Submission:** Menjelang akhir fase, Lead Appointed Party melink-kan dokumen-dokumen kunci ke checklist PIR.
4.  **Review:** Owner membuka Gate Review Dashboard.
5.  **Decision:** Jika semua pertanyaan PIR terjawab memuaskan, Owner klik "Approve Stage", dan proyek resmi masuk fase berikutnya.

## Kesimpulan
PIR di SaaS CDE berfungsi sebagai **Pos Penjagaan (Checkpoint)**.
Fitur ini mencegah proyek "asal jalan" tanpa arah.
Sistem memaksa tim untuk berhenti sejenak di setiap akhir fase dan memastikan Owner mendapatkan informasi yang dibutuhkan untuk bilang "Lanjut!".
