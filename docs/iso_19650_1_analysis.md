# Analisis ISO 19650-1 (Concepts & Principles) & Fitur SaaS

## 1. Definisi ISO 19650-1
**ISO 19650-1** adalah "Kitab Undang-Undang" dasar.
Bagian ini tidak bicara teknis detail (seperti penamaan file), tapi bicara **prinsip & konsep**.

Inti dari Part 1 adalah:
1.  **Information Management:** Informasi harus dikelola, bukan dibiarkan liar.
2.  **CDE (Common Data Environment):** Harus ada satu tempat pusat kebenaran.
3.  **Information Container:** Informasi dibungkus dalam "kontainer" (file/model) yang punya ID unik.
4.  **States:** Informasi punya status (WIP, Shared, Published, Archived).

## 2. Konsep Kunci & Terjemahan SaaS

### A. Konsep "Information Container"
ISO 19650-1 bilang: "Jangan cuma lempar file, tapi beri identitas."
Setiap file adalah *Information Container* yang harus punya metadata.

| Konsep ISO | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Unique ID** | **System-Generated ID** | Sistem memberi ID unik internal (UUID) untuk setiap file, terlepas dari nama filenya. |
| **Metadata** | **Custom Properties** | Setiap file punya "KTP" digital: Author, Status, Revisi, Klasifikasi (Uniclass). |
| **Versioning** | **Version Control System** | File `Denah.pdf` versi 1 dan versi 2 tersimpan rapi. User tidak perlu rename jadi `Denah_v2.pdf`. |

### B. Konsep "CDE Workflow" (States)
ISO 19650-1 memperkenalkan 4 status keramat:
1.  **Work In Progress (WIP):** Dapur tim sendiri. Orang lain tidak boleh lihat.
2.  **Shared:** Ruang tamu. Untuk koordinasi antar tim.
3.  **Published:** Etalase. Dokumen resmi yang sudah disetujui Client.
4.  **Archived:** Gudang. Arsip sejarah proyek.

| Konsep ISO | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **WIP State** | **Private Team Folder** | Folder yang hanya bisa diakses oleh Internal Team (misal: Tim Arsitek saja). |
| **Shared State** | **Coordination Folder** | Saat file dipindah ke sini, permission otomatis berubah jadi "View Only" untuk tim lain. |
| **Published State** | **Client Approval Workflow** | File hanya bisa masuk sini jika sudah diklik "Approve" oleh Project Manager & Client. |
| **Archived State** | **Immutable Storage** | File di sini menjadi *Read-Only* selamanya untuk keperluan audit hukum. |

## 3. Implikasi untuk SaaS CDE
Jika SaaS CDE ingin klaim "ISO 19650 Compliant", maka:
1.  **Tidak Boleh Hapus Permanen:** Konsep Archive menuntut jejak audit. Tombol "Delete" sebenarnya hanya "Soft Delete" atau "Move to Trash".
2.  **Strict Permissioning:** User tidak boleh sembarangan memindahkan file dari WIP ke Published tanpa melewati Shared.
3.  **Single Source of Truth:** Tidak boleh ada duplikasi file. Jika ada revisi, ia menumpuk di file yang sama sebagai versi baru (V1 -> V2).

## Kesimpulan
ISO 19650-1 adalah **Logika Dasar** aplikasi CDE.
Tanpa menerapkan Part 1, aplikasi hanyalah "Google Drive biasa".
Dengan Part 1, aplikasi menjadi **Sistem Manajemen Informasi** yang terstruktur.
