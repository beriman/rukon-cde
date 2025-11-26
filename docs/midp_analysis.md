# Analisis MIDP (Master Information Delivery Plan) & Fitur SaaS

## 1. Definisi MIDP
**MIDP (Master Information Delivery Plan)** adalah rencana induk pengiriman informasi proyek. Ini adalah gabungan (agregasi) dari seluruh **TIDP** yang dibuat oleh masing-masing Task Team.

Jika TIDP adalah jadwal per divisi, MIDP adalah **Jadwal Besar Proyek**.
Penanggung jawab utama MIDP adalah **Lead Appointed Party** (Kontraktor Utama / Lead Designer).

## 2. Fungsi Utama MIDP
1.  **Single Source of Truth:** Satu jadwal terpadu untuk seluruh deliverables proyek.
2.  **Cek Tabrakan Jadwal:** Memastikan tidak ada bottleneck (misal: Struktur butuh data Arsitek di minggu ke-5, tapi Arsitek baru jadwalkan selesai di minggu ke-7).
3.  **Monitoring Level Proyek:** Alat bagi Project Manager untuk melihat kesehatan proyek secara keseluruhan.

## 3. Terjemahan ke Fitur SaaS CDE

Di SaaS CDE, MIDP sebaiknya **tergenerasi otomatis** dari TIDP, bukan dibuat manual dari nol.

### A. Fitur Agregasi & Visualisasi
| Fungsi MIDP | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Agregasi** | **Auto-Compilation** | Sistem otomatis menarik data dari semua TIDP yang sudah di-approve menjadi satu tabel master. |
| **Visualisasi** | **Gantt Chart View** | Menampilkan jadwal pengiriman dalam bentuk Gantt Chart. Bisa difilter per disiplin, per status, atau per tanggal. |
| **Timeline** | **Milestone Markers** | Menandai tanggal-tanggal kunci proyek (misal: Submission IMB, Tender) di timeline MIDP. |

### B. Fitur Analisa & Manajemen Risiko
| Fungsi MIDP | Fitur SaaS | Deskripsi Fitur |
| :--- | :--- | :--- |
| **Dependency Check** | **Predecessor/Successor Logic** | (Fitur Advanced) Menghubungkan item TIDP satu sama lain (Task B butuh Task A). Sistem warnai merah jika jadwal tidak logis. |
| **Progress Tracking** | **S-Curve Generation** | Membuat kurva S otomatis: Rencana (dari tanggal MIDP) vs Realisasi (dari tanggal actual upload). |
| **Reporting** | **Executive Summary** | Laporan satu halaman untuk Owner: "Bulan ini rencana 50 dokumen, terealisasi 45 dokumen (90%)". |

## 4. Workflow MIDP di SaaS
1.  **Collection:** Lead Appointed Party memonitor status submission TIDP dari sub-tim.
2.  **Review:** Lead mengecek apakah jadwal yang diajukan sub-tim masuk akal dan sesuai Master Schedule proyek.
3.  **Baseline:** Setelah semua oke, Lead mengunci MIDP sebagai **Baseline**.
4.  **Execution:** Proyek berjalan. Sistem membandingkan progress harian dengan Baseline MIDP.
5.  **Update:** Jika ada keterlambatan masif, Lead bisa merevisi MIDP (Re-baseline) dengan persetujuan Owner.

## Kesimpulan
Fitur MIDP di SaaS adalah **Dashboard Utama** bagi Project Manager.
Tanpa fitur ini, CDE hanya menjadi "gudang file" (penyimpanan pasif).
Dengan fitur MIDP, CDE menjadi **alat manajemen proyek** (pengendalian aktif).
