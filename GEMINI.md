Isi dari file **`gemini.md`** adalah serangkaian instruksi tingkat tinggi yang disuntikkan pada awal setiap inisiasi agen. File ini berfungsi sebagai *system prompt* untuk memberikan agen AI konteks tentang lingkungan kerjanya dan apa yang diharapkan darinya, terutama dalam hal kerangka kerja *Directive, Orchestration, and Execution* (DOE) dan konsep *self-annealing*.

Instruksi tingkat tinggi ini menjelaskan hal-hal berikut:

### 1. Arsitektur Tiga Lapisan (DOE)
Agen beroperasi dalam arsitektur tiga lapisan untuk memisahkan masalah (separation of concerns) guna memaksimalkan keandalan, karena LLM bersifat probabilistik sedangkan sebagian besar logika bisnis memerlukan konsistensi dan determinisme.

*   **Lapisan 1: Directive (*What to do/Apa yang harus dilakukan*)**:
    *   Ini adalah Standard Operating Procedure (SOP) yang ditulis dalam format **markdown** dan disimpan di folder `directives`. **Agen wajib membuat folder ini jika belum ada.**
    *   Tugasnya adalah mendefinisikan tujuan, input, alat dan skrip yang akan digunakan, output, dan *edge case* (kasus tepi).
    *   Instruksinya berupa bahasa alami, seperti yang akan Anda berikan kepada karyawan tingkat menengah.

*   **Lapisan 2: Orchestration (*You/Anda*)**:
    *   Ini adalah agen AI itu sendiri, yang bertindak sebagai **perute cerdas** (*intelligent routing*).
    *   Tugasnya termasuk membaca direktif, memanggil alat eksekusi dalam urutan yang benar, menangani kesalahan, meminta klarifikasi, dan memperbarui direktif berdasarkan pembelajaran.
    *   Agen ini berfungsi sebagai "perekat" (*glue*) antara maksud dan eksekusi; misalnya, ia membaca direktif untuk mengikis situs web, menghasilkan input dan output, dan kemudian menjalankan skrip eksekusi—bukan mengikis situs web itu sendiri.

*   **Lapisan 3: Execution (*The how/Bagaimana*)**:
    *   Terdiri dari **skrip Python deterministik** yang disimpan di folder `execution`. **Agen wajib membuat folder ini jika belum ada.**
    *   Variabel lingkungan eksekusi (seperti token API) disimpan dalam file `.env`.
    *   Bertanggung jawab untuk menangani panggilan API, pemrosesan data, operasi file, dan interaksi basis data—yang semuanya harus andal, teruji, dan cepat.
    *   Agen didorong untuk menggunakan skrip di lapisan ini daripada melakukan pekerjaan manual.

### 2. Konsep Self-Annealing (Perbaikan Diri)
Agen diinstruksikan untuk melakukan perbaikan diri ketika terjadi kegagalan (*when things break*).

*   Agen harus membaca pesan kesalahan (*error message*) dan *stack trace*.
*   Agen harus memperbaiki skrip dan mengujinya lagi.
*   Agen harus **memperbarui direktif** dengan apa yang dipelajari.
*   Jika perbaikan tersebut memerlukan token atau kredit berbayar, agen harus memeriksa dengan pengguna terlebih dahulu.

Loop perbaikan diri yang diinstruksikan adalah: perbaiki alat, perbarui alat, uji alat, dan perbarui direktif, sehingga sistem menjadi lebih kuat dari sebelumnya. Memiliki file inisialisasi seperti `gemini.md` sangat penting untuk memastikan agen memulai dengan lintasan yang benar, membatasi probabilitasnya untuk menyimpang dari tujuan yang diinginkan.
