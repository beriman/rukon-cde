# Analisis Appointed Party (ISO 19650) & Fitur SaaS

Dokumen ini menganalisis peran **Appointed Party** (Pihak yang Ditunjuk) sesuai standar ISO 19650 dan menerjemahkannya ke dalam fitur-fitur SaaS CDE.

## 1. Definisi Appointed Party
Dalam ISO 19650, **Appointed Party** adalah organisasi atau individu yang ditunjuk untuk menghasilkan informasi, barang, atau jasa.
Ini mencakup spektrum yang luas, mulai dari:
-   **Lead Appointed Party:** Kontraktor Utama, Konsultan Perencana Utama (yang memiliki kontrak langsung dengan Owner).
-   **Appointed Party (Tier 2+):** Sub-kontraktor, Supplier, Vendor, Konsultan Spesialis.

Mereka adalah "mesin produksi" informasi dalam proyek.

## 2. Hak & Kewajiban (ISO 19650)

### Kewajiban (Obligations)
1.  **Produksi Informasi:**
    -   Menghasilkan data (gambar, model, dokumen) sesuai standar dan jadwal yang disepakati (MIDP/TIDP).
2.  **Kolaborasi:**
    -   Bekerja sama dengan tim lain, berbagi informasi untuk koordinasi (misal: cek clash).
3.  **Kepatuhan Standar:**
    -   Mengikuti aturan penamaan file, metadata, dan prosedur CDE yang ditetapkan Appointing Party.
4.  **Quality Assurance (QA):**
    -   Melakukan pengecekan internal (Check/Review/Approve) sebelum data dibagikan keluar (WIP -> Shared).

### Hak (Rights)
1.  **Kejelasan Persyaratan:**
    -   Berhak mendapatkan instruksi jelas mengenai apa yang harus dikerjakan (Exchange Information Requirements - EIR).
2.  **Akses Informasi Referensi:**
    -   Berhak mengakses data referensi (misal: gambar existing, data tanah) yang relevan untuk pekerjaannya.
3.  **Privasi WIP:**
    -   Berhak memiliki area kerja internal (WIP) yang **tidak bisa diintip** oleh pihak lain (termasuk Owner) sampai data tersebut siap dibagikan.

## 3. Terjemahan ke Fitur SaaS CDE

Berikut adalah bagaimana peran tersebut diterjemahkan menjadi fitur konkret di aplikasi SaaS kita:

### A. Fitur Produksi & Upload (Kewajiban Produksi)
| Kewajiban ISO 19650 | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Kepatuhan Standar** | **Naming Validator** | Sistem menolak upload jika nama file tidak sesuai format baku. Memberikan saran perbaikan otomatis. |
| **Produksi Informasi** | **Bulk Upload & Versioning** | Drag-and-drop banyak file sekaligus. Sistem otomatis mendeteksi jika file adalah revisi dari versi sebelumnya (P01 -> P02). |
| **Metadata Input** | **Mandatory Tags** | Form upload mewajibkan pengisian metadata (misal: Status, Revision, Classification) sebelum tombol "Save" aktif. |

### B. Fitur Kolaborasi & QA (Kewajiban Kolaborasi)
| Kewajiban ISO 19650 | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **QA Internal** | **Internal Review Workflow** | Sebelum file masuk status *Shared*, harus ada approval internal dari "Team Lead" Appointed Party tersebut. |
| **Kolaborasi** | **Shared Folder Access** | Akses read-only ke folder *Shared* disiplin lain untuk referensi (misal: Struktur bisa lihat Arsitek). |
| **Koordinasi** | **Clash Detection / Overlay** | (Fitur Advanced) Menumpuk gambar/model sendiri dengan model pihak lain untuk cek bentrokan. |

### C. Fitur Privasi & Akses (Hak Appointed Party)
| Hak ISO 19650 | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Privasi WIP** | **Private WIP Folders** | Folder WIP hanya bisa dilihat oleh anggota tim Appointed Party itu sendiri. Owner/MK tidak bisa lihat isinya. |
| **Akses Referensi** | **Reference Links** | Kemampuan untuk menautkan file referensi ke file kerja tanpa menduplikasi data. |
| **Kejelasan Info** | **Task / Requirement View** | Dashboard yang menampilkan daftar "To-Do" atau dokumen yang harus disubmit minggu ini (berdasarkan TIDP). |

## 4. Perbedaan Lead vs. Sub-Appointed Party di SaaS
Meskipun sama-sama "Appointed Party", Lead memiliki tanggung jawab lebih di CDE.

-   **Lead Appointed Party (Kontraktor Utama):**
    -   Bisa membuat folder untuk Sub-kon.
    -   Bisa melihat WIP Sub-kon (jika disetting demikian).
    -   Bertanggung jawab meng-approve data Sub-kon sebelum naik ke Owner.

-   **Appointed Party (Sub-kon):**
    -   Hanya punya akses ke folder tugasnya sendiri.
    -   Workflow approval berjenjang: Sub-kon -> Kontraktor Utama -> MK -> Owner.

## Kesimpulan
Untuk **Appointed Party**, CDE adalah "Meja Kerja Digital". Fitur terpenting bagi mereka adalah:
1.  **Kemudahan Upload** (agar tidak membuang waktu admin).
2.  **Kejelasan Status** (file saya ditolak atau diterima?).
3.  **Privasi** (ruang aman untuk bekerja sebelum disetor).
