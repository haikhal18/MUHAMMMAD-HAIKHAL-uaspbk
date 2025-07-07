// src/main.js

import { createApp } from 'vue'; // Mengimpor fungsi createApp dari Vue 3
import { createPinia } from 'pinia'; // Mengimpor fungsi createPinia untuk state management
import App from './App.vue'; // Mengimpor komponen root App.vue
import router from './router'; // Mengimpor konfigurasi Vue Router dari ./router/index.js
import { useAuthStore } from './stores/auth'; // Mengimpor authStore dari Pinia untuk inisialisasi autentikasi

// --- Mengimpor Gaya CSS Global ---
// File CSS utama yang berisi variabel, reset, dan gaya global aplikasi
import './assets/css/main.css';
// Mengimpor Font Awesome untuk ikon-ikon (pastikan sudah diinstal: npm install @fortawesome/fontawesome-free)
import '@fortawesome/fontawesome-free/css/all.css';

// --- Membuat Aplikasi Vue ---
const app = createApp(App); // Membuat instance aplikasi Vue menggunakan komponen App.vue sebagai root

// --- Menginisialisasi Pinia ---
const pinia = createPinia(); // Membuat instance Pinia store
app.use(pinia); // Menggunakan Pinia di aplikasi Vue

// --- Menginisialisasi Autentikasi dari Pinia Store ---
// Panggil useAuthStore() setelah Pinia di-attach ke aplikasi (app.use(pinia))
// agar store dapat diakses.
const authStore = useAuthStore();
authStore.initializeAuth(); // Memanggil aksi untuk memuat sesi dari localStorage

// --- Menggunakan Vue Router ---
app.use(router); // Menggunakan Vue Router di aplikasi Vue

// --- Me-mount Aplikasi ke Elemen DOM ---
// Aplikasi Vue akan di-mount ke elemen HTML dengan ID 'app' di public/index.html
app.mount('#app');

console.log('Vue application mounted successfully!');
console.log('App started at:', new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })); 