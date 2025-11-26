# Analisis Classification Systems (ISO 12006-2) & Fitur SaaS

## 1. Definisi Classification System
**Classification System** adalah "Bahasa Baku" agar mesin bisa mengerti data konstruksi.
Tanpa klasifikasi, komputer tidak tahu bedanya "Dinding Bata" dengan "Dinding Beton". Bagi komputer, keduanya hanya "Objek 3D".

**ISO 12006-2** adalah kerangka kerja (framework) internasional untuk membuat sistem klasifikasi.
Turunannya yang paling populer adalah:
1.  **Uniclass 2015 (UK):** Wajib untuk proyek ISO 19650 di Inggris & Commonwealth. Sangat lengkap (dari skala Wilayah sampai Baut).
2.  **OmniClass (US):** Populer di Amerika Utara.
3.  **MasterFormat (US):** Fokus ke spesifikasi konstruksi.

## 2. Mengapa SaaS CDE Butuh Klasifikasi?
1.  **Searchability:** User bisa cari "Semua Pintu Tahan Api" tanpa harus tahu nama filenya.
2.  **Cost Estimation:** Software Estimasi butuh kode klasifikasi untuk menghitung harga satuan.
3.  **Asset Management:** Facility Manager butuh kode untuk jadwal maintenance (misal: Semua AC Split kodenya `Pr_70_60_36`).

## 3. Fitur SaaS CDE untuk Klasifikasi

SaaS CDE harus punya **"Built-in Dictionary"**.

### A. Auto-Classification
| Fitur | Deskripsi | Implementasi Teknis |
| :--- | :--- | :--- |
| **Metadata Picker** | Saat upload file, user tidak mengetik manual, tapi memilih dari dropdown tree Uniclass. | Integrasi database Uniclass API ke form upload. |
| **AI Classifier** | Sistem menebak klasifikasi berdasarkan nama file. "Lantai_2.pdf" -> `EF_20_10` (Floors). | Machine Learning text classification. |
| **Mapping Tool** | Jika user upload file dengan klasifikasi lama (misal: Uniclass 1.4), sistem otomatis konversi ke Uniclass 2015. | Mapping table database. |

### B. Search & Filter
| Fitur | Deskripsi | Implementasi Teknis |
| :--- | :--- | :--- |
| **Faceted Search** | Filter dokumen berdasarkan kode: "Tampilkan semua dokumen `Ss_25_10` (Wall Systems)". | Elasticsearch dengan indexing pada kolom Classification Code. |
| **Visual Filter** | Di 3D Viewer, warnai objek berdasarkan klasifikasi. "Merah = Dinding Bata", "Biru = Dinding Kaca". | Color override pada viewer berdasarkan properti Pset. |

## 4. Workflow Klasifikasi di SaaS
1.  **Setup:** Admin proyek memilih standar klasifikasi (misal: Uniclass 2015).
2.  **Upload:** Arsitek upload model. CDE membaca properti `ClassificationCode` di dalam file IFC.
3.  **Validation:** CDE menolak file jika kodenya salah/kosong. "Error: Dinding ID #123 belum punya kode Uniclass."
4.  **Usage:** Quantity Surveyor download data "Volume Dinding Bata" berdasarkan kode klasifikasi yang valid tadi.

## 5. Implikasi untuk SaaS CDE
1.  **Database Maintenance:** Standar Uniclass diupdate setiap 3 bulan (tambah kode baru). SaaS Anda harus rajin update database-nya.
2.  **Multi-Standard Support:** Proyek di Indonesia mungkin pakai Uniclass, proyek di Arab Saudi mungkin pakai OmniClass. CDE harus support switch standar per proyek.

## Kesimpulan
Klasifikasi adalah **Metadata Paling Penting** di CDE.
Tanpa klasifikasi, CDE hanya jadi "Google Drive" (penyimpanan file bodoh).
Dengan klasifikasi, CDE jadi "BIM Database" (penyimpanan data cerdas).
