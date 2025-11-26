# Analisis ISO 19650-2 (Delivery Phase) & Fitur SaaS

## 1. Definisi ISO 19650-2
**ISO 19650-2** mengatur fase **"Delivery"** (Perancangan & Konstruksi).
Ini adalah fase paling sibuk, di mana Kontraktor, Konsultan, dan Subkon saling bertukar ribuan file.

Fokus utama Part 2 adalah **Proses Manajemen Informasi** dari awal tender sampai serah terima aset.
Ada 8 langkah standar (Sub-processes):
1.  Assessment and Need (Owner menentukan kebutuhan).
2.  Invitation to Tender (Tender dimulai).
3.  Tender Response (Kontraktor melamar).
4.  Appointment (Kontrak diteken).
5.  Mobilization (Persiapan tim).
6.  Collaborative Production (Kerja bareng).
7.  Information Model Delivery (Setor hasil kerja).
8.  Project Close-out (Tutup buku).

## 2. Terjemahan ke Fitur SaaS CDE

SaaS CDE harus memfasilitasi ke-8 langkah ini, bukan cuma langkah ke-6 (Produksi).

### A. Fase Tender & Appointment (Langkah 1-4)
| Langkah ISO | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Invitation to Tender** | **E-Tendering Portal** | Owner upload dokumen tender (EIR, Reference Data) ke "Tender Room" yang aman. |
| **Tender Response** | **Bid Submission Box** | Calon kontraktor upload Pre-appointment BEP & Capability Statement. |
| **Appointment** | **Contract Module** | Konversi dokumen tender menjadi dokumen kontrak. Finalisasi BEP & TIDP di sistem. |

### B. Fase Produksi & Kolaborasi (Langkah 5-6)
Ini adalah "Core" dari CDE.
| Langkah ISO | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Mobilization** | **Team Onboarding** | Invite user, setup permission, test akses CDE sebelum mulai kerja. |
| **Collaborative Production** | **Check/Review/Approve** | Workflow persetujuan berjenjang: *Author -> Task Team Check -> Lead Appointed Check -> Shared*. |
| **Coordination** | **Clash Detection** | Integrasi model 3D untuk cek tabrakan antar disiplin (Arsitek vs Struktur). |

### C. Fase Delivery & Close-out (Langkah 7-8)
| Langkah ISO | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Model Delivery** | **Submission Gateway** | Pintu gerbang formal untuk submit data ke Owner. Ada validasi otomatis (cek penamaan, cek format). |
| **Acceptance** | **Client Approval** | Owner mereview submission. Jika OK, status berubah jadi *Published*. Jika tidak, *Rejected*. |
| **Close-out** | **Archive & Handover** | Pembekuan data proyek. Ekspor data aset (AIR) ke sistem FM. |

## 3. Implikasi untuk SaaS CDE
SaaS CDE yang baik untuk ISO 19650-2 harus:
1.  **Bukan Sekadar Storage:** Harus punya fitur *Process Management* (Tender, Review, Approval).
2.  **Audit Trail Lengkap:** Siapa yang approve gambar ini? Kapan? Kenapa direject?
3.  **Status-Driven:** File tidak boleh loncat dari *WIP* ke *Published* tanpa melewati *Shared* dan *Client Approval*.

## Kesimpulan
ISO 19650-2 adalah **SOP Proyek**.
SaaS CDE adalah **Mesin yang Menjalankan SOP** tersebut secara otomatis.
Tanpa fitur workflow yang kuat, CDE akan gagal mendukung ISO 19650-2 karena user akan kembali kirim-kiriman file via email/WhatsApp (Unmanaged).
