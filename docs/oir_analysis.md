# Analisis OIR (Organizational Information Requirements) & Fitur SaaS

## 1. Definisi OIR (ISO 19650)
**OIR (Organizational Information Requirements)** adalah dokumen tingkat tertinggi dalam hierarki informasi ISO 19650.
Ini bukan tentang "proyek ini butuh gambar apa", tapi tentang **"organisasi ini butuh data apa untuk menjalankan bisnisnya?"**.

OIR menjawab pertanyaan strategis Owner:
-   "Data apa yang saya butuhkan untuk mengelola aset saya selama 50 tahun ke depan?"
-   "Data apa yang saya butuhkan untuk laporan keuangan tahunan?"
-   "Data apa yang saya butuhkan untuk kepatuhan regulasi (misal: Safety, Lingkungan)?"

OIR adalah **hulu** dari semua requirement lainnya (AIR, PIR, EIR).

## 2. Isi Dokumen OIR
OIR biasanya berisi:
1.  **Strategic Goals:** Visi misi perusahaan terkait aset (misal: "Menjadi operator gedung paling hemat energi").
2.  **Asset Management Needs:** Data maintenance yang wajib ada (misal: Tanggal garansi, Serial Number, Jadwal servis).
3.  **Regulatory Requirements:** Data yang diminta pemerintah (misal: Sertifikat Laik Fungsi).
4.  **Portfolio Reporting:** Format laporan yang diinginkan Direksi.

## 3. Terjemahan ke Fitur SaaS CDE

Dalam konteks SaaS CDE, OIR diterjemahkan menjadi **"Library Standar Perusahaan"** atau **"Template Master"** yang diterapkan ke semua proyek.

### A. Fitur Manajemen Standar (Corporate Standard)
| Kebutuhan OIR | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Standarisasi Data** | **Data Dictionary / Parameter Library** | Database parameter standar perusahaan (misal: "Setiap pompa HARUS punya parameter `WarrantyDate` dan `Manufacturer`"). |
| **Klasifikasi Aset** | **Classification Manager** | Sistem klasifikasi baku (misal: Uniclass 2015 atau OmniClass) yang wajib dipakai di semua proyek untuk memudahkan reporting portofolio. |
| **Template Proyek** | **Project Templates** | Saat bikin proyek baru, Owner bisa memilih "Template Hotel" atau "Template Kantor" yang sudah berisi struktur folder dan aturan OIR yang relevan. |

### B. Fitur Validasi Aset (Asset Validation)
| Kebutuhan OIR | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Kelengkapan Data** | **COBie Validator** | Pengecekan otomatis apakah data aset yang disetor kontraktor sudah memenuhi standar OIR (misal: Kolom `InstallationDate` tidak boleh kosong). |
| **Kepatuhan** | **Compliance Dashboard** | Dashboard level organisasi (bukan level proyek) untuk melihat kesehatan data seluruh aset perusahaan. |

## 4. Workflow OIR di SaaS
1.  **Define:** Tim Aset Manajemen Owner mendefinisikan OIR di level akun organisasi SaaS (bukan di level proyek).
2.  **Inherit:** Saat Project Manager membuat proyek baru, sistem otomatis "mewarisi" aturan OIR ini ke dalam proyek tersebut.
3.  **Execute:** Kontraktor bekerja di proyek, sistem memvalidasi kerjaan mereka terhadap aturan OIR yang diwariskan tadi.
4.  **Handover:** Saat proyek selesai, data aset yang sudah bersih (sesuai OIR) diekspor ke sistem FM (Facility Management) Owner.

## Kesimpulan
OIR di SaaS CDE adalah fitur **Enterprise Level**.
Ini membedakan CDE "Proyekan" (yang hanya peduli file sharing) dengan CDE "Enterprise" (yang peduli siklus hidup aset jangka panjang).
Fitur kuncinya adalah **Parameter Library** dan **Project Templating**.
