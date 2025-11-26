# Analisis ISO 19650-7 (Reconstruction & Destruction) & Fitur SaaS

## 1. Definisi ISO 19650-7
**ISO 19650-7** (masih dalam pengembangan/konsep di beberapa literatur, sering dianggap bagian dari *End of Life*) mengatur informasi selama proses **Rekonstruksi** atau **Penghancuran (Demolition)**.

Fokus utamanya adalah **Circular Economy** dan **Safety during Demolition**.
Bagaimana kita tahu ada asbes di balik dinding ini sebelum kita hancurkan?
Bagaimana kita tahu baja ini masih kuat untuk dipakai ulang (reused) di gedung lain?

## 2. Konsep Kunci: Deconstruction Information
Berbeda dengan konstruksi (membangun), dekonstruksi butuh data terbalik:
1.  **Hazardous Material Log:** Peta lokasi zat berbahaya (Asbes, Timbal, Zat Radioaktif).
2.  **Structural Integrity:** Data kekuatan struktur saat ini (bukan saat baru dibangun).
3.  **Material Passport:** Identitas material untuk daur ulang (misal: Baja Grade A, bisa dilelehkan ulang).

## 3. Terjemahan ke Fitur SaaS CDE

SaaS CDE untuk Part 7 berfungsi sebagai **"Bank Material"** dan **"Peta Ranjau"**.

### A. Demolition Planning
| Kebutuhan ISO | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Hazard Mapping** | **HazMat Layer** | Layer khusus di viewer 3D yang menunjukkan lokasi zat berbahaya. Merah = Asbes. Kuning = Gas Pipa. |
| **Sequence** | **4D Deconstruction** | Simulasi urutan pembongkaran terbalik. "Bongkar atap dulu, baru kolom". Salah urutan = Roboh. |
| **Permit** | **Demolition Permit Workflow** | Workflow persetujuan khusus untuk izin bongkar, wajib melampirkan "Structural Safety Check". |

### B. Material Recovery (Circular Economy)
| Kebutuhan ISO | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Inventory** | **Material Passport** | Setiap elemen BIM punya data: "Bisa didaur ulang? Ya/Tidak", "Nilai Jual Rongsokan: Rp...". |
| **Marketplace** | **Salvage Export** | Fitur export daftar material bekas ke format Excel/API untuk dijual ke pengepul material bekas. |
| **Audit** | **Waste Tracking** | Laporan berapa ton beton jadi puing, berapa ton baja jadi duit. |

## 4. Workflow ISO 19650-7 di SaaS
1.  **Audit:** Sebelum bongkar, tim survei melakukan "Pre-Demolition Audit". Data masuk ke CDE.
2.  **Plan:** Kontraktor bongkar membuat rencana urutan (Method Statement) di CDE.
3.  **Approve:** Structural Engineer menyetujui urutan bongkar.
4.  **Execute:** Selama pembongkaran, material dipilah (Salvage vs Waste).
5.  **Record:** Data material yang keluar dicatat untuk laporan "Green Building" (Waste Diversion Rate).

## 5. Implikasi untuk SaaS CDE
SaaS CDE ISO 19650-7 harus:
1.  **Reverse Logic:** Bisa menangani proses "pengurangan" model, bukan cuma "penambahan".
2.  **Integration with Waste Mgmt:** Terhubung dengan sistem pengelolaan limbah B3.
3.  **Long-Term Archive Access:** Data gedung lama (yang sudah roboh) mungkin masih dibutuhkan 10 tahun lagi jika ada tuntutan hukum soal kesehatan (misal: paru-paru asbes).

## Kesimpulan
ISO 19650-7 menutup siklus hidup aset.
Dari tanah kembali ke tanah (atau kembali ke pabrik daur ulang).
SaaS CDE memastikan proses "kematian" gedung ini aman, legal, dan menguntungkan (dari sisi material bekas).
