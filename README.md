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

Mulai Server Data (API Mock):

Di terminal yang sama (atau terminal baru), jalankan perintah:

Bash

npm run start-api
