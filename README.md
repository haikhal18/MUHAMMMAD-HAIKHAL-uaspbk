🚀 Stealth Ops Dispatch
Gambar utama aplikasi Stealth Ops Dispatch: Sistem Misi Siber Terenkripsi

Selamat datang di Stealth Ops Dispatch, proyek aplikasi web fiktif yang saya bangun sebagai Tugas Akhir / UAS Pemrograman Berbasis Komponen (PBK).

Aplikasi ini adalah platform rahasia di mana:

Klien bisa mengajukan misi siber (seperti tes penetrasi atau pemulihan data).

Cyber Ninja (para ahli) bisa melihat misi yang tersedia, melamar, dan mengelola tugas mereka.

Tujuan utama proyek ini adalah mendemonstrasikan kemampuan saya dalam membangun aplikasi frontend modern yang interaktif dan berbasis data.

✨ Fitur Utama yang Telah Dibuat
Login & Daftar Akun: Pengguna (Klien atau Cyber Ninja) bisa membuat akun dan masuk ke sistem.

Profil Pengguna: Setiap pengguna bisa melihat dan mengedit detail profil mereka sendiri.

Manajemen Misi (untuk Klien):

Mengajukan Misi: Klien bisa membuat misi baru dengan detail lengkap.

Melihat Misi Saya: Klien bisa melihat semua misi yang mereka ajukan, statusnya, dan siapa saja yang melamar.

Edit Misi: Klien bisa mengubah detail misi yang sudah diajukan (jika statusnya memungkinkan).

Hapus Misi: Klien bisa menghapus misi yang diajukan.

Menugaskan Ninja: Klien bisa menunjuk Cyber Ninja tertentu untuk mengerjakan misi mereka.

Mengubah Status Misi: Klien bisa membatalkan misi atau menandai misi sebagai selesai.

Manajemen Misi (untuk Cyber Ninja):

Melihat Misi Tersedia: Ninja bisa melihat misi-misi yang siap dikerjakan.

Melamar Misi: Ninja bisa mengajukan diri untuk mengerjakan misi.

Melihat Misi Aktif: Ninja bisa melacak misi yang sedang mereka kerjakan.

Melihat Misi Selesai: Ninja bisa melihat riwayat misi yang sudah mereka tuntaskan.

Memperbarui Progres: Ninja bisa memberikan laporan progres untuk misi aktif.

Mengubah Status Misi: Ninja bisa menandai misi yang dikerjakan sebagai selesai.

Pencarian & Filter Misi: Memudahkan pengguna mencari misi berdasarkan status atau keahlian, atau kata kunci.

Manajemen Data Pusat: Menggunakan sistem khusus (Pinia) untuk mengelola semua data aplikasi agar selalu sinkron.

Komunikasi dengan Server: Aplikasi terhubung ke server data sederhana (JSON Server) untuk mengambil dan menyimpan semua informasi.

Desain Keren: Tampilan aplikasi responsif (cocok di HP, tablet, komputer) dengan tema futuristik ala Cyber Ninja.

🛠️ Teknologi yang Digunakan
Proyek ini dibangun menggunakan teknologi-teknologi inti berikut:

Frontend: Vue.js 3 (Kerangka kerja utama aplikasi)

Vue Router 4: Untuk navigasi antar halaman.

Pinia: Untuk manajemen data di seluruh aplikasi.

Komunikasi Data: Axios (Untuk mengirim permintaan ke server)

Pengembangan Cepat: Vite (Alat bantu untuk menjalankan dan membangun proyek dengan cepat)

Server Data Sederhana: json-server (Server data "palsu" yang membaca db.json Anda)

Pengujian Kode: Vitest (Untuk memastikan kode berfungsi sesuai harapan)

Ikon: Font Awesome (Koleksi ikon menarik)

🚀 Cara Menjalankan Aplikasi Ini
Ikuti langkah-langkah di bawah ini untuk mengatur dan menjalankan proyek secara lokal.

Prasyarat (Yang Perlu Anda Punya)
Pastikan Anda sudah menginstal Node.js (versi 18.x atau lebih baru) dan npm (yang otomatis terinstal bersama Node.js).

Langkah-langkah (Jalankan Perintah Ini di Terminal VS Code Anda)
Masuk ke Folder Proyek:

Buka Terminal baru di VS Code (Terminal > New Terminal).

Pastikan Anda berada di dalam folder proyek Anda (PS C:\Users\Lenovo\uas-project>).

Instal Semua Kebutuhan (Dependensi):

Bash

npm install
(Ini hanya perlu dilakukan sekali di awal, atau jika Anda menambahkan/menghapus paket)

Mulai Server Data (API Mock):
Ada dua cara untuk menjalankan server data Anda:

Opsi A: Dengan json-server (Update Otomatis Bawaan)

Di terminal yang sama (atau terminal baru), jalankan perintah:

Bash

npm run start-api
Ini akan memulai json-server dan secara otomatis memonitor db.json untuk perubahan.

Opsi B: Dengan nodemon (Untuk Restart Otomatis Lebih Kuat)

Instal nodemon (jika belum):

Bash

npm install -g nodemon
Lalu, jalankan server data Anda dengan perintah ini:

Bash

nodemon --watch db.json --exec "json-server --watch db.json --port 3000"
Ini akan memonitor db.json dan me-restart json-server secara otomatis jika ada perubahan, bahkan jika json-server bawaannya tidak mendeteksi.

Penting: Pilih salah satu opsi di atas (A atau B), dan biarkan terminal ini TETAP TERBUKA dan AKTIF. Ini adalah server data Anda yang berjalan di http://localhost:3000.

Mulai Aplikasi Web (Frontend):

Buka Terminal BARU LAGI di VS Code (Terminal > New Terminal).

Di terminal ini, jalankan perintah:

Bash

npm run dev
Biarkan terminal ini juga TETAP TERBUKA dan AKTIF. Ini adalah aplikasi web Anda yang berjalan di http://localhost:5173 (atau port lain).

Akses Aplikasi di Browser:

Buka browser web Anda (Chrome, Firefox, dll.).

Kunjungi alamat yang ditampilkan oleh npm run dev (biasanya http://localhost:5173/).

Akun Demo untuk Pengujian Cepat
Anda bisa menggunakan akun-akun berikut untuk mencoba fitur-fitur di aplikasi:

Klien (ID: 1):

Username: client_alpha

Password: password123

Cyber Ninja (ID: 2):

Username: ninja_shadow

Password: password123

✅ Checklist untuk Menyelesaikan Tugas Akhir / UAS Anda
Berikut adalah hal-hal penting yang perlu Anda pastikan untuk menyelesaikan UAS Anda:

Konsep & Analisis (Dokumen Laporan):

Jelaskan studi kasus proyek ini (apa itu Stealth Ops Dispatch, tujuannya).

Buat daftar lengkap fitur-fitur yang ada dan jelaskan mengapa itu penting.

Gambarlah struktur menu/navigasi aplikasi Anda.

Cantumkan endpoint API yang digunakan (misal: GET /users, POST /missions, PUT /missions/:id, DELETE /missions/:id). Sesuaikan dengan fitur yang Anda buat.

Sertakan screenshot dari aplikasi Anda yang berfungsi dan jelaskan cara menggunakannya.

Implementasi Kode (Proyek Vue.js):

Struktur Routing: Pastikan src/router/index.js sudah diatur dengan benar (rute publik, rute klien, rute ninja) dan menggunakan layout yang sesuai.

Komponen Halaman: Pastikan setiap menu/fitur memiliki komponen halaman Vue yang sesuai di folder views/.

Interaksi API: Pastikan aplikasi mengambil data dari json-server (misal: daftar misi, profil pengguna) dan menampilkannya secara dinamis. Operasi POST, PATCH, PUT, DELETE harus berfungsi untuk menyimpan perubahan.

Penting: Pastikan penanganan tipe data ID (string vs. number) sudah konsisten di db.json (semua ID disarankan INTEGER) dan di semua kode Anda (menggunakan Number() saat membandingkan atau mengonversi ID).

Manajemen State: Pastikan Anda menggunakan Pinia store (auth.js, mission.js, ui.js) untuk menyimpan dan mengelola data global (misal: status login, data misi).

Unit Testing: Anda wajib menulis setidaknya satu unit test menggunakan Vitest untuk komponen atau Pinia store Anda. File test ada di __tests__/.

Presentasi (Video YouTube):

Buat file presentasi (misal, Google Slides).

Rekam video presentasi (maksimal 15 menit) yang menjelaskan proyek Anda dan mendemonstrasikan fitur-fiturnya.

Pastikan semua fitur yang Anda presentasikan berfungsi dengan baik saat didemonstrasikan.

