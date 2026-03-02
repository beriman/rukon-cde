**To**: Orchestrator / Project Team (SM / Dev)
**From**: Antigravity
**Date**: 2026-03-02
**Priority**: Medium

## Task Request
Meneliti fitur Aconex (terutama Workflow dan Mail Management) yang bisa memperkuat Rukon2.

## Research Findings & Recommendations

Setelah melakukan riset terhadap kapabilitas Oracle Aconex, berikut adalah fitur-fitur utama dari **Mail Management** dan **Workflow** yang menjadi standar industri dan dapat kita adopsi untuk memperkuat Rukon CDE:

### 1. Mail Management (Komunikasi & Korespondensi Proyek)
Sistem Mail di Aconex bukan sekadar email biasa, melainkan pusat dokumentasi komunikasi yang mengikat secara kontrak.

**Fitur Kunci Aconex:**
- **Unalterable Audit Trail**: Sekali "Mail" dikirim, pesan tersebut tidak bisa diedit, ditarik (*recall*), atau dihapus. Ini menciptakan rekam jejak (*single source of truth*) yang absolut dan permanen untuk mencegah sengketa (*disputes*).
- **Mail Threading & Unique Numbering**: Setiap komunikasi diberi nomor unik otomatis. Seluruh balasan (*replies/forwards*) terikat dalam satu *thread* visual yang mudah ditelusuri sejarahnya.
- **Formulir Terstruktur (Custom Forms)**: Komunikasi tidak hanya berupa *free-text*, melainkan menggunakan form kustom spesifik (misal: RFI form, Site Memo form, Variation form) dengan *field* mandatori.
- **Integrasi Email Eksternal**: Pengguna menerima notifikasi via Outlook/Gmail. Jika mereka membalas notifikasi tersebut, balasan otomatis masuk/tercatat kembali ke sistem Aconex.

**Rekomendasi Implementasi untuk Rukon2 (Epic 4 - Correspondence):**
1. **Immutable Log**: Pastikan modul *Correspondence* di Rukon2 tidak memiliki tombol "Edit" atau "Delete" setelah pesan dikirim secara resmi (Status "Sent").
2. **Mail Inbox Logic**: Buat tampilan seperti inbox email dengan dukungan visual *thread* untuk instruksi dan balasan.
3. **Reply-via-Email**: (Nice-to-have) Pertimbangkan membuat fitur di mana balasan email dari klien otomatis di- *parse* masuk ke sistem Rukon2.

---

### 2. Workflow Management (Alur Persetujuan & Review Dokumen)
Workflow di Aconex digunakan untuk mengotomatisasi proses persetujuan dokumen lintas organisasi secara terstruktur.

**Fitur Kunci Aconex:**
- **Customizable Templates (Serial & Parallel)**: Pengguna bisa mendefinisikan *template* proses approval. Bisa berurutan (Serial: A -> B -> C) atau bersamaan (Parallel: A, B, C me-review bareng, butuh konsensus).
- **Time-bound Tracking**: Setiap langkah/aktor dalam workflow diberikan tenggat waktu (*due date*). Sistem membedakan "Original Due Date" dan "Actual Date", serta memberikan peringatan dini (*bottleneck identification*).
- **Cross-Organizational Workflows**: Workflow ini dapat melewati batasan perusahaan (Contoh: Drafter Kontraktor -> Lead Kontraktor -> Konsultan MK -> Client Representative) dengan *visibility masking* yang aman.
- **Status & Outcome Matrix**: Saat me-review, pengguna harus memilih "Outcome" resmi (Misal: *Approved, Approved as Noted, Rejected*).

**Rekomendasi Implementasi untuk Rukon2 (Epic 2/3 - Approval Workflows):**
1. **Workflow Builder UI**: Buat fitur visual (seperti node/drag-and-drop atau reorderable list) bagi pengguna untuk mengatur *template* alur persetujuan proyek.
2. **SLA Monitoring Dashboard**: Tambahkan *metrics* di Dashboard untuk melacak siapa yang sering menyebabkan *delay* (bottleneck) dalam proses approval dokumen.
3. **Outcome Enforcement**: Dokumentasi hanya dapat pindah ke stage *Published* jika semua partisipan dalam *Parallel Workflow* memberikan outcome *Approved*.

## Expected Output
Riset fitur telah selesai dicatat. Wawasan (insights) ini dapat diintegrasikan oleh **SM (Bob)** saat melakukan refining *User Stories* untuk Epic 4 (Correspondence) maupun Epic 2 (Approval).
