# Analisis EIR (Exchange Information Requirements) & Fitur SaaS

## 1. Definisi EIR (ISO 19650)
**EIR (Exchange Information Requirements)** adalah dokumen kontrak yang menjelaskan **apa yang harus diserahkan** oleh Kontraktor/Konsultan kepada Owner selama proyek berlangsung.

Jika AIR adalah "Kebutuhan Operasional" dan PIR adalah "Kebutuhan Keputusan", maka EIR adalah **"Instruksi Pengiriman"**.
EIR menggabungkan kebutuhan dari OIR, AIR, dan PIR menjadi satu paket instruksi yang jelas bagi Tim Produksi.

EIR menjawab pertanyaan:
-   "Format file apa yang harus saya setor? (RVT/IFC/PDF?)"
-   "Seberapa detail modelnya? (LOD 300/400?)"
-   "Kapan deadline setiap submission?"
-   "Bagaimana cara menamai file?"

## 2. Isi Dokumen EIR
EIR mencakup 3 aspek utama:
1.  **Technical:** Format software, versi, sistem koordinat, level of detail (LOIN).
2.  **Management:** Standar penamaan file, prosedur approval, keamanan data, peran & tanggung jawab.
3.  **Commercial:** Jadwal pengiriman data (Data Drops), tujuan penggunaan data.

## 3. Terjemahan ke Fitur SaaS CDE

Dalam SaaS CDE, EIR bukan sekadar dokumen PDF yang dilampirkan di kontrak, tapi **"Rule Engine"** yang mengatur perilaku sistem CDE.

### A. Fitur Validasi Teknis (Technical Validation)
| Syarat EIR | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Format File** | **File Extension Whitelist** | Sistem menolak upload jika ekstensi file tidak sesuai yang diminta (misal: tolak `.dwg` jika minta `.ifc`). |
| **Naming Convention** | **Naming Standard Enforcer** | Form upload memaksa user mengisi field (Project-Zone-Level-Type-Role-Number) untuk menghasilkan nama file yang valid. |
| **Metadata** | **Mandatory Metadata Fields** | User tidak bisa klik "Save" jika belum mengisi metadata wajib (misal: Status, Revision, Classification). |

### B. Fitur Manajemen Proses (Process Management)
| Syarat EIR | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Data Drops** | **Submission Scheduler** | Kalender submission yang terintegrasi. H-7 sebelum "Data Drop 1", sistem mengirim reminder ke semua Lead Appointed Party. |
| **Approval** | **Workflow Engine** | Konfigurasi alur persetujuan otomatis. Misal: Dokumen Struktur -> Cek MK -> Cek Owner -> Approved. |
| **Security** | **Role-Based Access Control (RBAC)** | Pengaturan izin akses folder yang ketat sesuai matriks tanggung jawab di EIR. |

## 4. Workflow EIR di SaaS
1.  **Configuration:** Di awal proyek, Admin CDE (mewakili Appointing Party) mengonfigurasi "Rules" CDE berdasarkan dokumen EIR.
    -   Set Naming Convention.
    -   Set Folder Structure.
    -   Set Approval Workflows.
2.  **Onboarding:** Tim Kontraktor diundang masuk. Mereka tidak perlu menghafal buku EIR tebal, karena sistem sudah "menuntun" mereka.
3.  **Submission:** Saat Kontraktor upload file, sistem otomatis mengecek kepatuhan terhadap Rules tadi.
    -   Jika salah nama -> Reject otomatis.
    -   Jika salah format -> Reject otomatis.
4.  **Acceptance:** File yang lolos validasi sistem baru masuk ke inbox Reviewer untuk dicek kontennya.

## Kesimpulan
EIR di SaaS CDE adalah **"Satpam Digital"**.
Ia menjaga agar data sampah (junk data) tidak masuk ke dalam CDE.
Dengan mengotomatisasi pengecekan EIR, kita menghemat ribuan jam kerja Admin yang biasanya habis untuk mengecek nama file secara manual.
