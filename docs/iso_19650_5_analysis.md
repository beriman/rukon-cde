# Analisis ISO 19650-5 (Security-Minded Approach) & Fitur SaaS

## 1. Definisi ISO 19650-5
**ISO 19650-5** adalah standar yang mengatur **Keamanan Informasi** dalam BIM.
Prinsip utamanya adalah **"Security-Minded Approach"**: Kesadaran bahwa data digital (BIM) bisa menjadi senjata bagi pihak jahat untuk menyerang aset fisik atau organisasi.

Part 5 lahir karena BIM membuat data gedung menjadi sangat transparan dan mudah diakses. Jika denah penjara, bank, atau istana negara bocor dalam format 3D yang detail, risiko keamanannya sangat fatal.

## 2. Konsep Kunci: Sensitive Information
Tidak semua data itu sensitif. ISO 19650-5 meminta kita memilah:
1.  **Ordinary Information:** Boleh dibagi ke tim proyek (misal: denah toilet umum).
2.  **Sensitive Information:** Jika bocor, membahayakan keselamatan/keamanan (misal: jalur evakuasi VVIP, letak server CCTV, spesifikasi kaca anti-peluru).

## 3. Terjemahan ke Fitur SaaS CDE

SaaS CDE untuk Part 5 harus punya fitur **"Security Triage"** dan **"Redaction"**.

### A. Triage & Classification
| Kebutuhan ISO | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Security Triage** | **Sensitivity Checkbox** | Saat upload file, user wajib centang: "Does this contain sensitive info? (Yes/No)". |
| **Classification** | **Security Labeling** | Label otomatis pada file: *Official*, *Secret*, *Top Secret*. Label ini menentukan siapa yang boleh lihat. |
| **Need-to-Know** | **Dynamic Permission** | User A boleh lihat Gedung A, tapi TIDAK boleh lihat Gedung B, meskipun mereka satu tim. Akses diberikan per-item, bukan per-folder. |

### B. Protection & Redaction
| Kebutuhan ISO | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Obfuscation** | **Model Redaction Tool** | Fitur untuk "mem-blur" atau menghapus objek sensitif dari model 3D sebelum dishare ke subkon. Misal: Hapus objek CCTV dari model yang dikirim ke tukang cat. |
| **Traceability** | **Forensic Watermarking** | Jika ada screenshot bocor, sistem bisa melacak siapa pelakunya dari *invisible watermark* yang tertanam di gambar. |
| **Incident Mgmt** | **Security Breach Workflow** | Jika terdeteksi akses mencurigakan (misal: download massal jam 2 pagi), akun otomatis terkunci dan Admin dapat notifikasi. |

## 4. Workflow ISO 19650-5 di SaaS
1.  **Assess:** Appointing Party menetapkan "Security Strategy" (apa saja yang dianggap rahasia).
2.  **Plan:** Lead Appointed Party membuat "Security Management Plan" (siapa yang boleh akses apa).
3.  **Mobilize:** Admin CDE setting permission ketat sesuai Plan.
4.  **Produce:** Tim bekerja. Jika membuat data sensitif, wajib lapor/tagging.
5.  **Share:** Sebelum share file keluar, CDE mengecek label keamanan. Jika *Secret*, butuh approval tambahan dari Security Manager.

## 5. Implikasi untuk SaaS CDE
SaaS CDE ISO 19650-5 harus:
1.  **Secure by Design:** Keamanan bukan fitur tambahan, tapi pondasi.
2.  **Granular:** Izin akses bisa diatur sampai level atribut (misal: User boleh lihat temboknya, tapi tidak boleh lihat properti "Ketebalan Baja"-nya).
3.  **Compliance Ready:** Server harus memenuhi standar ISO 27001 (Information Security).

## Kesimpulan
ISO 19650-5 adalah **Satpam Digital**.
Ia memastikan bahwa keterbukaan BIM (Open BIM) tidak disalahgunakan untuk hal-hal yang merugikan pemilik aset.
