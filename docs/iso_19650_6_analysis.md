# Analisis ISO 19650-6 (Health & Safety) & Fitur SaaS

## 1. Definisi ISO 19650-6
**ISO 19650-6** mengatur pengelolaan informasi **Kesehatan & Keselamatan Kerja (K3)** atau *Health & Safety (H&S)*.
Standar ini menggantikan PAS 1192-6.

Fokus utamanya adalah **"Collaborative Sharing of Structured H&S Information"**.
Tujuannya: Agar risiko K3 (misal: lubang galian, bahan kimia berbahaya) diketahui oleh semua pihak sejak fase desain sampai operasional.

## 2. Konsep Kunci: Risk Information Cycle
ISO 19650-6 menekankan bahwa informasi risiko harus hidup sepanjang siklus proyek:
1.  **Identify:** Arsitek mengidentifikasi risiko (misal: "Jendela ini susah dibersihkan, butuh gondola").
2.  **Use:** Kontraktor menggunakan info itu untuk merencanakan metode kerja aman.
3.  **Share:** Info risiko disimpan di CDE agar Facility Manager di masa depan tahu.

## 3. Terjemahan ke Fitur SaaS CDE

SaaS CDE untuk Part 6 harus mengubah "Dokumen K3 Tebal" menjadi **"Data Risiko Terstruktur"**.

### A. Risk Register Management
| Kebutuhan ISO | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Structured Risk** | **Digital Risk Register** | Database risiko online. Bukan upload Excel, tapi input form: *Lokasi, Bahaya, Mitigasi, Tingkat Risiko*. |
| **Visualisation** | **3D Risk Tagging** | Fitur untuk menempelkan ikon "Tengkorak" (Bahaya) langsung di model 3D BIM pada lokasi yang berbahaya. |
| **Prioritisation** | **Risk Heatmap** | Dashboard yang menunjukkan area mana yang paling banyak risiko tingginya. |

### B. Safety Information Sharing
| Kebutuhan ISO | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Context** | **Safe-to-Build Check** | Sebelum status desain berubah jadi *Construction*, sistem memaksa Designer mencentang "Safety Review Completed". |
| **Access** | **Mobile Safety App** | Pekerja di lapangan bisa scan QR Code di ruangan untuk melihat daftar bahaya di area tersebut. |
| **Golden Thread** | **Incident Log Link** | Jika terjadi kecelakaan, laporannya di-link kembali ke elemen BIM terkait untuk evaluasi desain masa depan. |

## 4. Workflow ISO 19650-6 di SaaS
1.  **Design:** Arsitek menandai area berbahaya di model 3D (misal: atap curam).
2.  **Tender:** Kontraktor melihat "3D Risk Map" saat mengajukan penawaran, jadi bisa menghitung biaya scaffolding lebih akurat.
3.  **Construction:** Safety Officer menggunakan CDE untuk inspeksi harian. Temuan bahaya baru langsung diinput ke Risk Register.
4.  **Handover:** Data risiko yang relevan untuk operasional (misal: letak katup gas tekanan tinggi) diserahkan ke Owner sebagai bagian dari AIM.

## 5. Implikasi untuk SaaS CDE
SaaS CDE ISO 19650-6 harus:
1.  **Visual:** Risiko lebih mudah dipahami jika dilihat di 3D daripada di tabel Excel.
2.  **Proaktif:** Memberi peringatan dini (Alert) jika user membuka gambar area berbahaya.
3.  **Terintegrasi:** Data K3 tidak boleh terpisah di software K3 sendiri, harus nempel di CDE proyek.

## Kesimpulan
ISO 19650-6 menyelamatkan nyawa dengan informasi.
SaaS CDE berperan memastikan informasi bahaya itu **sampai** ke orang yang berisiko, sebelum kecelakaan terjadi.
