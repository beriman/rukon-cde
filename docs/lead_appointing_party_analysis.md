# Analisis Lead Appointing Party (Client Rep/PMC) & Fitur SaaS

**Catatan:** Dalam ISO 19650, istilah resmi yang digunakan adalah **Appointing Party**. Tidak ada istilah baku "Lead Appointing Party". Namun, dalam praktik proyek besar, fungsi ini sering dijalankan oleh **Client Representative**, **Project Management Consultant (PMC)**, atau **Employer's Agent**. Dokumen ini menganalisis peran tersebut.

## 1. Definisi & Peran
Pihak ini bertindak sebagai "tangan kanan" Pemilik Proyek (Owner). Jika Owner adalah investor yang tidak teknis, maka pihak inilah yang menjalankan fungsi operasional Appointing Party sehari-hari.

**Peran Utama:**
-   **Wakil Pemilik:** Mengambil keputusan teknis atas nama Owner.
-   **Pengawas Utama:** Mengawasi kinerja Lead Appointed Party (Kontraktor/Konsultan Utama).
-   **Auditor Informasi:** Memastikan data yang masuk ke CDE sesuai dengan standar Owner.

## 2. Tanggung Jawab (Mewakili Appointing Party)
1.  **Menetapkan Requirements (OIR, PIR, AIR, EIR):**
    -   Menerjemahkan kebutuhan bisnis Owner menjadi persyaratan teknis BIM/Informasi.
2.  **Validasi Deliverables:**
    -   Melakukan pemeriksaan mendalam (Technical Review) terhadap data yang disubmit Kontraktor sebelum Owner memberikan persetujuan final (atau pihak ini diberi kuasa approval penuh).
3.  **Manajemen CDE (Sisi Klien):**
    -   Memastikan CDE sisi klien (jika terpisah) atau akses klien di CDE proyek terkelola dengan baik.

## 3. Terjemahan ke Fitur SaaS CDE

Fitur untuk peran ini mirip dengan Appointing Party, namun lebih berat di **Monitoring** dan **Audit**.

### A. Fitur Monitoring & Reporting
| Tanggung Jawab | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Pengawasan Progres** | **Executive Dashboard** | Grafik real-time: S-Curve progres fisik vs rencana, status submission dokumen (Approved vs Rejected). |
| **Audit Kepatuhan** | **Compliance Checker** | Laporan otomatis seberapa patuh Kontraktor terhadap standar penamaan dan metadata. |
| **Isu Kritikal** | **High-Level Issue Tracker** | Dashboard khusus untuk isu-isu "High Priority" yang membutuhkan keputusan Owner/Wakil. |

### B. Fitur Review Teknis
| Tanggung Jawab | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Validasi Data** | **Review Markup Tools** | Alat markup lengkap (cloud, text, measure) di viewer untuk memberi catatan koreksi ke Kontraktor. |
| **Delegated Approval** | **Approval on Behalf** | Fitur yang mengizinkan akun ini melakukan "Approve" menggantikan akun Owner (tercatat di log sebagai "Approved by PMC on behalf of Owner"). |

### C. Fitur Manajemen Requirements
| Tanggung Jawab | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Definisi EIR** | **Requirements Library** | Bank data persyaratan (template EIR) yang bisa digunakan kembali untuk proyek-proyek Owner lainnya. |
| **Verifikasi Aset** | **Asset Data Validation** | Pengecekan otomatis apakah data COBie/Aset yang disetor Kontraktor sudah lengkap atributnya (Merk, Tipe, Garansi). |

## Kesimpulan
Dalam SaaS CDE, **Lead Appointing Party (Client Rep/PMC)** membutuhkan akun dengan level akses **"Super Admin Teknis"**.
Mereka butuh power untuk:
1.  Mengaudit kinerja semua pihak.
2.  Melakukan approval teknis.
3.  Mengelola standar proyek.

Berbeda dengan Owner murni yang mungkin hanya butuh dashboard "terima beres", pihak ini butuh *tools* untuk "membedah" data.
