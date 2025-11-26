# Analisis Open BIM (IFC & BCF) & Fitur SaaS

## 1. Definisi Open BIM
**Open BIM** adalah pendekatan universal untuk desain kolaboratif, realisasi, dan operasi bangunan berdasarkan standar dan alur kerja terbuka.
Intinya: **"Jangan kunci data user di format proprietary (seperti .RVT atau .PLN)."**

Dua pilar utama Open BIM yang wajib didukung SaaS CDE adalah:
1.  **IFC (Industry Foundation Classes) - ISO 16739:** Format file untuk **Model 3D**.
2.  **BCF (BIM Collaboration Format):** Format file untuk **Komunikasi Isu**.

## 2. IFC (Industry Foundation Classes) - ISO 16739
IFC adalah "PDF-nya dunia BIM". Ia bisa dibuka di software apa saja.

### Fitur SaaS CDE untuk IFC:
| Fitur | Deskripsi | Implementasi Teknis |
| :--- | :--- | :--- |
| **Web-based 3D Viewer** | User bisa putar-putar model 3D di browser tanpa install Revit. | Menggunakan library seperti *xBIM, Ifc.js, atau Autodesk APS*. |
| **Data Inspection** | Klik pintu di 3D, muncul data: "Fire Rating: 2 Jam", "Material: Kayu". | Parsing properti IFC (Pset_DoorCommon) dan tampilkan di panel kanan. |
| **Model Federation** | Menggabungkan model Arsitek (IFC) + Struktur (IFC) + MEP (IFC) jadi satu tampilan utuh. | Fitur "Merge" atau "Overlay" di viewer. |
| **Clash Detection** | Cek otomatis: "Pipa ini nabrak Balok ini". | Algoritma geometri intersection di server. |

## 3. BCF (BIM Collaboration Format)
BCF adalah "WhatsApp-nya dunia BIM".
Daripada kirim screenshot via email ("Tolong geser pintu ini"), user mengirim file BCF.

Isi file BCF:
-   **Screenshot** masalah.
-   **Koordinat Kamera** (X,Y,Z) di model 3D.
-   **GUID** elemen yang bermasalah (ID unik pintu tersebut).
-   **Komentar** text.

### Fitur SaaS CDE untuk BCF:
| Fitur | Deskripsi | Implementasi Teknis |
| :--- | :--- | :--- |
| **Issue Tracker** | Dashboard daftar masalah: "5 Isu Open, 3 Resolved". | Database tiket (seperti Jira) tapi khusus BIM. |
| **Viewpoint Jump** | Klik isu di dashboard -> Kamera 3D otomatis terbang ke lokasi masalah. | Membaca koordinat kamera dari XML BCF. |
| **BCF API (v2.1 / v3.0)** | Sinkronisasi isu real-time dengan software authoring (Revit/Archicad). | REST API endpoint untuk plugin BCF Manager. |

## 4. Workflow Open BIM di SaaS
1.  **Upload:** Arsitek upload `Gedung_Ars.ifc`. Struktur upload `Gedung_Str.ifc`.
2.  **Federate:** BIM Coordinator membuka kedua file di CDE Viewer.
3.  **Check:** Coordinator melihat ada pipa menabrak kolom.
4.  **Create Issue:** Coordinator membuat isu baru. Kamera otomatis tersimpan. Assign ke Engineer MEP.
5.  **Sync:** Engineer MEP buka Revit, klik tombol "Sync BCF".
6.  **Fix:** Di Revit, kamera Engineer MEP otomatis pindah ke lokasi tabrakan. Dia geser pipanya.
7.  **Update:** Engineer MEP upload `Gedung_MEP_v2.ifc` dan set status isu jadi "Resolved".

## 5. Implikasi untuk SaaS CDE
Jika CDE Anda mendukung Open BIM:
1.  **Vendor Neutral:** Anda bisa jualan ke pengguna Revit, Archicad, Tekla, Allplan sekaligus.
2.  **Long-Term Archive:** File IFC dijamin bisa dibuka 50 tahun lagi (standar ISO), beda dengan file .RVT versi lama yang sering tidak kompatibel.
3.  **Complex Backend:** Membangun IFC parser dan 3D geometry engine di web itu SANGAT sulit. Kebanyakan SaaS menggunakan *3rd party engine* (seperti Autodesk Platform Services atau HOOPS) daripada bikin sendiri.

## Kesimpulan
Mendukung Open BIM bukan sekadar fitur tambahan, tapi **syarat wajib** untuk masuk ke pasar proyek pemerintah atau proyek internasional yang mewajibkan ISO 19650.
