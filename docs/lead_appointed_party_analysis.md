# Analisis Lead Appointed Party (ISO 19650) & Fitur SaaS

Dokumen ini menganalisis peran **Lead Appointed Party** (Pihak yang Ditunjuk Utama) sesuai standar ISO 19650 dan menerjemahkannya ke dalam fitur-fitur SaaS CDE.

## 1. Definisi Lead Appointed Party
**Lead Appointed Party** adalah organisasi yang ditunjuk langsung oleh Appointing Party (Owner) untuk memimpin tim pengiriman (delivery team).
Contoh paling umum:
-   **Kontraktor Utama (Main Contractor)** pada fase konstruksi.
-   **Konsultan Perencana Utama (Lead Designer)** pada fase desain.

Mereka bertanggung jawab tidak hanya atas pekerjaan mereka sendiri, tetapi juga mengoordinasikan pekerjaan dari seluruh **Appointed Parties** (Sub-kon, Supplier, Konsultan Spesialis) di bawah mereka.

## 2. Tanggung Jawab Utama (ISO 19650)

### Manajerial & Koordinasi
1.  **Menyusun BEP (BIM Execution Plan):**
    -   Membuat rencana eksekusi BIM sebelum dan sesudah kontrak, menjelaskan bagaimana tim akan bekerja.
2.  **Menyusun MIDP (Master Information Delivery Plan):**
    -   Menggabungkan rencana pengiriman tugas (TIDP) dari semua sub-tim menjadi satu jadwal induk.
3.  **Mobilisasi Tim:**
    -   Memastikan tim dan sub-tim memiliki kapabilitas, software, dan akses CDE yang benar.
4.  **Manajemen Risiko:**
    -   Mengidentifikasi risiko terkait pengiriman informasi.

### Operasional CDE
1.  **Gatekeeper (Penjaga Gawang):**
    -   Memeriksa dan menyetujui data dari Appointed Parties (Sub-kon) sebelum data tersebut diteruskan ke Owner (Status: Shared -> Published).
2.  **Koordinasi Model:**
    -   Menggabungkan (federate) model dari berbagai disiplin untuk cek bentrokan (clash detection).

## 3. Terjemahan ke Fitur SaaS CDE

Fitur untuk Lead Appointed Party harus fokus pada **Manajemen Tim** dan **Agregasi Data**.

### A. Fitur Manajemen Tim (Team Management)
| Tanggung Jawab ISO 19650 | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Mobilisasi Tim** | **Sub-Team Management** | Kemampuan untuk mengundang user dan mengelompokkan mereka ke dalam "Sub-Teams" (misal: Tim Struktur, Tim MEP). |
| **Kontrol Akses** | **Granular Permissions** | Lead bisa mengatur agar Sub-kon A tidak bisa melihat folder Sub-kon B (jika diperlukan), tapi Lead bisa melihat semuanya. |
| **Distribusi Info** | **Transmittals** | Mengirimkan paket dokumen resmi ke Sub-kon dengan tanda terima digital. |

### B. Fitur Perencanaan & Tracking (MIDP)
| Tanggung Jawab ISO 19650 | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Menyusun MIDP** | **Task / Schedule Module** | Fitur untuk membuat jadwal submission. "Siapa harus setor Apa dan Kapan". |
| **Tracking Progress** | **Submission Dashboard** | Grafik yang menunjukkan status submission dari semua sub-tim (On-time, Late, Rejected). |
| **Risk Management** | **Early Warning System** | Notifikasi otomatis jika ada sub-tim yang belum upload mendekati deadline. |

### C. Fitur Koordinasi & QA (Gatekeeping)
| Tanggung Jawab ISO 19650 | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Gatekeeper** | **Staged Approval Workflow** | Workflow bertingkat: Sub-kon Upload -> Lead Review (Approve/Reject) -> Owner Review. |
| **Koordinasi Model** | **Federated Model Viewer** | Viewer yang bisa membuka beberapa model IFC sekaligus (Arsitek + Struktur + MEP) di satu layar browser. |
| **Clash Detection** | **Basic Clash Check** | (Fitur Premium) Deteksi otomatis bentrokan antar model yang digabungkan. |

## 4. Perbedaan Fitur: Lead vs. Regular Appointed Party

| Fitur | Lead Appointed Party | Regular Appointed Party |
| :--- | :--- | :--- |
| **Invite User** | Bisa (untuk timnya & sub-kon) | Hanya untuk internal timnya |
| **Approval** | Bisa Approve data Sub-kon | Hanya Submit data sendiri |
| **View Scope** | Lihat seluruh Delivery Team | Hanya lihat Task Team sendiri |
| **MIDP Access** | Edit & Manage Master Plan | Input Task Plan (TIDP) sendiri |

## Kesimpulan
SaaS CDE untuk **Lead Appointed Party** harus berfungsi seperti **"Command Center"**.
Mereka butuh alat untuk:
1.  **Melihat Big Picture** (Dashboard MIDP).
2.  **Mengontrol Kualitas** (Approval Workflow).
3.  **Mengelola Pasukan** (Sub-team Management).

Tanpa fitur-fitur ini, Lead Appointed Party akan kesulitan menjalankan peran koordinator mereka sesuai ISO 19650.
