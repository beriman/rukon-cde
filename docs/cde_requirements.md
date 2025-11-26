# Persyaratan SaaS Common Data Environment (CDE)

Berdasarkan analisis kompetitor dan standar ISO 19650, berikut adalah breakdown persyaratan untuk membangun SaaS CDE versi "murah" namun fungsional.

## 1. Fitur Inti (Core Features) - MVP
Fitur-fitur ini **wajib ada** agar sistem dapat disebut sebagai CDE.

-   **Manajemen Proyek & Folder:**
    -   Membuat banyak proyek.
    -   Struktur folder hierarkis.
    -   *Smart Folders* (opsional tapi bagus): Folder virtual berdasarkan metadata.

-   **Manajemen Dokumen (Information Containers):**
    -   Upload/Download file (mendukung format besar).
    -   **Versioning Otomatis:** Menyimpan versi lama saat file baru dengan nama sama diunggah.
    -   **Preview File:** Viewer bawaan untuk PDF dan Gambar (JPG, PNG).

-   **Metadata & Pencarian:**
    -   Pencarian file berdasarkan nama dan isi (jika memungkinkan).
    -   Filter berdasarkan status, tipe file, dan tanggal.

-   **Workflow Status (ISO 19650):**
    -   Label status jelas: WIP, SHARED, PUBLISHED, ARCHIVED.
    -   Mekanisme "Promote" atau "Approve" untuk memindahkan status file.

## 2. Fitur Kolaborasi (Collaboration)
Fitur untuk memfasilitasi kerja sama tim.

-   **Komentar & Markups:**
    -   Memberikan komentar pada file.
    -   (Tahap lanjut) Markup visual di atas PDF/Gambar.

-   **Notifikasi:**
    -   Email/In-app notification saat ada file baru atau status berubah.

-   **Activity Feed:**
    -   Log aktivitas sederhana di dashboard proyek (siapa upload apa).

## 3. Fitur Keamanan & Admin (Security)
Sangat krusial untuk kepercayaan pengguna.

-   **Role-Based Access Control (RBAC):**
    -   Admin: Akses penuh.
    -   Manager: Bisa approve/publish.
    -   Contributor: Bisa upload ke WIP.
    -   Viewer: Hanya bisa lihat (Read-only).

-   **Audit Trail:**
    -   Log sistem yang mencatat setiap aksi (Upload, Download, Delete, View) dengan timestamp dan user ID.

-   **Data Security:**
    -   Enkripsi data saat istirahat (at rest) dan saat transmisi (in transit).
    -   Backup berkala.

## 4. Fitur Spesifik SaaS (SaaS Requirements)
Untuk mendukung model bisnis SaaS.

-   **Multi-Tenancy:** Satu sistem melayani banyak organisasi (tenant) dengan data terisolasi total.
-   **User Management:** Invite user via email.
-   **Subscription Management:** (Tahap lanjut) Integrasi payment gateway, batasan storage per paket harga.
-   **Onboarding:** Tutorial singkat saat pengguna baru masuk.

## 5. Roadmap Pengembangan (Phasing)

### Fase 1: MVP (Minimum Viable Product)
-   User Auth & Multi-tenancy dasar.
-   Manajemen Proyek & Folder.
-   Upload/Download & Versioning.
-   Viewer PDF/Gambar.
-   Status Labeling (Manual).

### Fase 2: ISO 19650 Compliance
-   Naming Convention Validator.
-   Approval Workflow (WIP -> Shared).
-   Audit Trail lengkap.

### Fase 3: Advanced & BIM
-   IFC Viewer (3D Model di browser).
-   Issue Tracking.
-   Integrasi API.

## Stack Teknologi yang Disarankan
-   **Frontend:** React / Next.js (Responsif & Cepat).
-   **Backend:** Node.js / Go (Scalable).
-   **Database:** PostgreSQL (Relational data) + S3 Compatible Storage (File storage).
-   **Viewer:** PDF.js (PDF), Three.js / IFC.js (BIM 3D).
