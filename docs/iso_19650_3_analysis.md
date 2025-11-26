# Analisis ISO 19650-3 (Operational Phase) & Fitur SaaS

## 1. Definisi ISO 19650-3
**ISO 19650-3** mengatur fase **"Operational"** (Pengelolaan Aset).
Ini adalah fase terpanjang (bisa 50-100 tahun), jauh lebih lama dari fase konstruksi (2-3 tahun).

Fokus utamanya adalah **Asset Information Management**:
-   Bagaimana data dari konstruksi (PIM) ditransfer ke operasional (AIM).
-   Bagaimana data diupdate saat ada renovasi/perbaikan.
-   Bagaimana data dipakai untuk Facility Management (FM).

## 2. Perbedaan PIM vs AIM
-   **PIM (Project Information Model):** Model selama konstruksi. Isinya detail konstruksi, sejarah revisi, dan data sementara.
-   **AIM (Asset Information Model):** Model untuk operasional. Isinya hanya data "As-Built" yang valid, manual maintenance, dan data garansi.

## 3. Terjemahan ke Fitur SaaS CDE

SaaS CDE untuk fase ini sering disebut **"CDE for Asset Management"** atau jembatan ke CAFM (Computer Aided Facility Management).

### A. Trigger Events (Pemicu)
Di fase operasional, pekerjaan tidak berjalan linear, tapi berdasarkan "Trigger".
| Trigger ISO | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Planned Maintenance** | **Maintenance Scheduler** | Sistem memberi notifikasi: "AC Unit #123 waktunya ganti filter bulan depan." |
| **Corrective Maintenance** | **Issue Reporting (Ticket)** | User lapor: "Lampu lobi mati." -> Terbit tiket perbaikan -> Kontraktor maintenance dipanggil. |
| **Major Works** | **Renovation Project** | Jika ada renovasi besar, CDE membuat "Sub-Project" baru di dalam aset tersebut. |

### B. Pengelolaan AIM (Asset Information Model)
| Kebutuhan ISO | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Handover (PIM to AIM)** | **Data Cleaning Wizard** | Alat untuk membuang data sampah konstruksi (misal: gambar revisi yang tidak terpakai) sebelum masuk ke database aset. |
| **Updating AIM** | **Live Asset Twin** | Saat teknisi mengganti pompa, dia update serial number baru di HP. Model AIM pusat otomatis terupdate. |
| **History** | **Asset Lifecycle Log** | Rekam jejak seumur hidup: "Pompa ini dipasang 2020, servis 2021, ganti sparepart 2023." |

## 4. Workflow ISO 19650-3 di SaaS
1.  **Handover:** Kontraktor menyerahkan PIM.
2.  **Validation:** Owner memvalidasi data PIM sesuai AIR.
3.  **Migration:** Data valid masuk ke AIM (Database Aset).
4.  **Operation:**
    -   **Trigger:** Ada kerusakan.
    -   **Work:** Teknisi memperbaiki.
    -   **Update:** Teknisi update data di AIM.
5.  **End of Life:** Aset dihancurkan, data diarsipkan.

## 5. Implikasi untuk SaaS CDE
SaaS CDE ISO 19650-3 harus:
1.  **Long-Term Storage:** Siap menyimpan data selama 50 tahun (format file harus *future-proof*).
2.  **Integration Friendly:** Harus bisa bicara dengan software FM (Maximo, Archibus) dan BMS (Building Management System).
3.  **Mobile First:** User utamanya adalah teknisi lapangan, bukan drafter di kantor.

## Kesimpulan
ISO 19650-3 mengubah CDE dari "Gudang Gambar" menjadi **"Otak Gedung"**.
Tanpa Part 3, data konstruksi yang mahal-mahal dibuat akan mati dan tidak berguna saat gedung mulai beroperasi.
