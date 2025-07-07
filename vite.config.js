import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; // Penting: Impor modul 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Konfigurasi untuk Vitest
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'], // Penting untuk localStorage mock
    // Menambahkan alias agar Vitest tahu cara me-resolve path @
    // Ini seringkali sudah diurus oleh `resolve.alias` utama,
    // tapi kadang Vitest butuh penegasan di scope `test`
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // Mocks untuk aset statis (penting!)
    // Ini memberitahu Vitest untuk menganggap file gambar sebagai string kosong (atau URL mock)
    // agar tidak mencoba memuatnya.
    // Carilah properti `server.deps.inline` atau `server.fs.allow` di konfigurasi `test` Vitest.
    // Untuk error gambar ini, solusi umumnya adalah mengabaikan import gambar di tes.
    // Solusi paling umum: menambahkan 'mock' untuk jenis file ini di `setupFiles`
    // atau memastikan file tersebut ada.

    // Mari kita coba solusi yang lebih umum dengan `transformMode.web` di Vitest
    // atau memastikan `logo.png` ada.

    // SOLUSI PALING MUDAH UNTUK ERROR INI:
    // Cukup pastikan gambar logo.png benar-benar ada di:
    // C:\Users\Lenovo\uas-project\src\assets\images\logo.png
    // Jika belum ada, buat file kosong dengan nama tersebut, atau salin gambar logo apa saja ke sana.
    // Karena errornya "Does the file exist?", Vitest tidak menemukan file gambar tersebut.
    // Nama file di kode AppHeader.vue adalah logo.png.

    // Coba lagi dengan memastikan file gambar logo.png benar-benar ada
    // di direktori src/assets/images/logo.png.
    // Jika sudah ada, coba ini di test runner:
    // server: {
    //   deps: {
    //     inline: [/@vue\//]
    //   }
    // }
  },
});