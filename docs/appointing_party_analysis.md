# Analisis Appointing Party (ISO 19650) & Fitur SaaS

Dokumen ini menganalisis peran **Appointing Party** (Pihak Penunjuk/Klien) sesuai standar ISO 19650 dan menerjemahkannya ke dalam fitur-fitur SaaS CDE.

## 1. Definisi Appointing Party
Dalam ISO 19650, **Appointing Party** adalah individu atau organisasi yang menunjuk pihak lain (Lead Appointed Party) untuk melaksanakan pekerjaan (desain, konstruksi, atau manajemen aset). Biasanya ini adalah **Pemilik Proyek (Project Owner)**, Pengembang (Developer), atau Pemerintah.

Mereka adalah "pemilik" dari informasi proyek dan bertanggung jawab memastikan manajemen informasi berjalan dengan baik.

## 2. Hak & Kewajiban (ISO 19650)

### Kewajiban (Obligations)
1.  **Menetapkan Persyaratan Informasi (OIR, PIR, AIR, EIR):**
    -   Harus mendefinisikan informasi apa yang dibutuhkan, kapan, dan bagaimana formatnya.
    -   Dokumen kunci: *Employer's Information Requirements (EIR)*.
2.  **Menyediakan CDE:**
    -   Bertanggung jawab menyediakan Common Data Environment (bisa menyewa sendiri atau mendelegasikan ke pihak lain, tapi tanggung jawab tetap di mereka).
3.  **Menetapkan Standar & Protokol:**
    -   Menentukan standar penamaan file, klasifikasi, dan prosedur keamanan.
4.  **Review & Acceptance:**
    -   Wajib memeriksa dan menyetujui (atau menolak) informasi yang diserahkan oleh tim penyedia (delivery team) sebelum digunakan.
5.  **Pengarsipan (Archiving):**
    -   Menyimpan rekaman informasi proyek untuk jangka panjang.

### Hak (Rights)
1.  **Kepemilikan Data:**
    -   Memiliki hak penuh atas data yang dihasilkan (sesuai kontrak).
2.  **Akses Penuh:**
    -   Berhak mengakses seluruh informasi di CDE (kecuali area WIP internal kontraktor yang belum dibagikan).
3.  **Menolak Pekerjaan:**
    -   Berhak menolak dokumen/model yang tidak sesuai standar EIR.

## 3. Terjemahan ke Fitur SaaS CDE

Berikut adalah bagaimana peran tersebut diterjemahkan menjadi fitur konkret di aplikasi SaaS kita:

### A. Fitur Setup & Konfigurasi (Kewajiban Menetapkan Standar)
| Kewajiban ISO 19650 | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Menetapkan Standar** | **Project Settings > Naming Convention** | UI untuk mengatur format nama file (misal: `[Project]-[Originator]-[Zone]...`). Bisa lock setting ini agar tidak diubah user lain. |
| **Menetapkan EIR** | **Information Requirements Module** | Fitur untuk upload dokumen EIR atau membuat checklist persyaratan yang harus dipenuhi setiap submission. |
| **Menyediakan CDE** | **Billing & Subscription** | Appointing Party (sebagai Superadmin) adalah pihak yang membayar langganan SaaS. |

### B. Fitur Review & Approval (Kewajiban Review)
| Kewajiban ISO 19650 | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Review & Acceptance** | **Approval Workflow (Gatekeeping)** | Fitur "Approve to Publish". Dokumen di status *Shared* tidak bisa jadi *Published* tanpa klik "Approve" dari Appointing Party (atau wakilnya/MK). |
| **Menolak Pekerjaan** | **Reject with Comments** | Tombol "Reject" yang mewajibkan input alasan/komentar. Status file kembali ke *WIP* atau *Rejected*. |
| **Audit Trail** | **Activity Log** | Mencatat siapa yang melakukan approval dan kapan. "Approved by [Owner Name] at [Date]". |

### C. Fitur Akses & Kontrol (Hak Kepemilikan)
| Hak ISO 19650 | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Kepemilikan Data** | **Data Export / Takeout** | Fitur "Download All Project Data" (zip) untuk backup atau pindah platform. |
| **Akses Penuh** | **Superadmin / Owner Role** | Role khusus yang bisa melihat semua folder (Shared, Published, Archived) dan mengelola user. |
| **Keamanan** | **User Management** | Hak untuk menambah/menghapus akses user kapan saja (misal: memutus akses kontraktor yang sudah selesai kontrak). |

## 4. Skenario Khusus: Delegasi
Seringkali, Appointing Party (Owner) tidak punya keahlian teknis untuk mengelola CDE sehari-hari. ISO 19650 mengizinkan pendelegasian fungsi ini (biasanya ke MK atau BIM Consultant).

**Fitur SaaS:**
-   **Delegated Admin:** Owner bisa menunjuk user lain (misal: MK) sebagai "Admin Teknis" yang bisa mengatur folder dan approval, TAPI tidak bisa menghapus proyek atau mengubah billing.
-   **Owner Dashboard:** Meskipun didelegasikan, Owner tetap punya dashboard "Read-only" untuk memantau progres tanpa takut salah klik.

## Kesimpulan
Untuk SaaS CDE kita, fitur **Appointing Party** bukan hanya sekadar "Admin", tapi lebih ke **"Project Governor"**. Fitur kuncinya adalah:
1.  **Kontrol Standar (Naming/EIR)**
2.  **Otoritas Approval (Shared -> Published)**
3.  **Kepemilikan Data (Billing & Export)**
