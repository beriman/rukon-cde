# Analisis CDE Security (ISO 19650-5 & SaaS Best Practices)

## 1. Pendekatan Keamanan (ISO 19650-5)
ISO 19650-5 menekankan **"Security-Minded Approach"**.
Ini bukan hanya tentang password, tapi tentang melindungi **aset fisik** melalui perlindungan **aset digital**.

Contoh risiko yang dimitigasi:
-   Teroris mengakses model BIM bandara untuk mencari titik lemah struktur.
-   Pencuri mengakses jadwal CCTV gedung dari dokumen maintenance.
-   Kompetitor mencuri data harga satuan dari dokumen tender.

## 2. Fitur Keamanan SaaS CDE
Untuk memenuhi standar ISO 19650-5 dan best practice SaaS modern, CDE harus memiliki fitur berikut:

### A. Kontrol Akses & Identitas (Identity & Access Management)
| Fitur Security | Deskripsi | Implementasi SaaS |
| :--- | :--- | :--- |
| **MFA (Multi-Factor Authentication)** | Wajibkan user login pakai password + kode HP. | Integrasi dengan Google Authenticator / Microsoft Authenticator. |
| **SSO (Single Sign-On)** | Login pakai akun kantor (Google Workspace / Azure AD). | Protokol SAML 2.0 atau OIDC. |
| **Granular Permissions** | Izin akses detail, bukan cuma "Boleh/Tidak". | Level: *View Only, Download, Upload, Edit, Delete, Admin*. |
| **Project Segregation** | User Proyek A tidak boleh tahu Proyek B ada. | Isolasi database level tenant atau logic level aplikasi. |

### B. Proteksi Data (Data Protection)
| Fitur Security | Deskripsi | Implementasi SaaS |
| :--- | :--- | :--- |
| **Encryption at Rest** | Data di server diacak kodenya. | AES-256 encryption untuk database dan file storage (S3). |
| **Encryption in Transit** | Data saat dikirim aman dari sadapan. | TLS 1.3 (HTTPS) untuk semua komunikasi web. |
| **Data Sovereignty** | Lokasi server fisik data. | Pilihan region server (misal: "Simpan data saya hanya di Server Jakarta"). |
| **Watermarking** | Mencegah kebocoran dokumen screenshot. | Overlay nama user & tanggal saat dokumen dibuka di viewer. |

### C. Audit & Kepatuhan (Audit & Compliance)
| Fitur Security | Deskripsi | Implementasi SaaS |
| :--- | :--- | :--- |
| **Audit Trail** | Rekam jejak "Siapa melakukan Apa, Kapan". | Log tidak bisa dihapus: *"User Budi downloaded 'Denah.pdf' at 10:00 AM"*. |
| **Session Management** | Auto-logout jika tidak aktif. | Timeout session 30 menit. Force logout device lain. |
| **Penetration Testing** | Bukti sistem tahan retas. | Laporan rutin hasil pentest pihak ketiga (Certified Ethical Hacker). |

## 3. Workflow Keamanan Sensitif (ISO 19650-5)
Untuk proyek sensitif (misal: Istana Negara, Penjara, Bank), workflow standar tidak cukup.
CDE perlu fitur **"Sensitive Information Process"**:
1.  **Triage:** Saat upload, user ditanya "Apakah file ini mengandung data sensitif?".
2.  **Classification:** Jika YA, file diberi label "CONFIDENTIAL".
3.  **Isolation:** File "CONFIDENTIAL" masuk ke folder terisolasi yang hanya bisa diakses oleh user dengan *Security Clearance* khusus.
4.  **Redaction:** (Advanced) Fitur untuk menghitamkan (blur) bagian sensitif pada gambar sebelum dishare ke kontraktor umum.

## Kesimpulan
Security di SaaS CDE adalah pondasi kepercayaan (Trust).
Tanpa fitur keamanan level enterprise (MFA, Audit Trail, Encryption), Owner proyek besar tidak akan berani menaruh data aset vital mereka di cloud.
