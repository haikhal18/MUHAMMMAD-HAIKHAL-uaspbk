// src/stores/auth.js
import { defineStore } from 'pinia';
import axios from 'axios';
import router from '@/router'; // Import router untuk navigasi setelah login/logout

// Konfigurasi URL dasar API Anda
const API_BASE_URL = 'http://localhost:3000'; // Sesuaikan dengan port json-server Anda

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null, // Objek user setelah login (id, username, role, email, dll.)
    isAuthenticated: false, // Status apakah user sudah login
    userRole: null, // Peran user: 'client' atau 'ninja'
    loading: false, // Status loading saat proses login/registrasi
    error: null, // Pesan error jika ada
  }),

  getters: {
    // Getter untuk mengecek apakah user adalah klien
    isClient: (state) => state.userRole === 'client',
    // Getter untuk mengecek apakah user adalah ninja
    isNinja: (state) => state.userRole === 'ninja',
    // Getter untuk mendapatkan token (jika Anda menerapkan JWT/token di masa depan)
    // getToken: (state) => state.user?.token || null,
  },

  actions: {
    /**
     * Menginisialisasi state autentikasi dari localStorage saat aplikasi dimuat.
     */
    initializeAuth() {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          this.user = user;
          this.isAuthenticated = true;
          this.userRole = user.role;
          console.log('Auth initialized from localStorage:', user.username, user.userRole); // Log userRole
        } else {
          console.log('No user found in localStorage.');
        }
      } catch (e) {
        console.error('Failed to parse user from localStorage:', e);
        this.logout(); // Bersihkan jika ada error parsing
      }
    },

    /**
     * Aksi untuk proses login pengguna.
     * @param {string} username - Username pengguna.
     * @param {string} password - Password pengguna.
     * @returns {boolean} - True jika login berhasil, false jika gagal.
     */
    async login(username, password) {
      this.loading = true;
      this.error = null;
      try {
        // Mencari pengguna berdasarkan username dan password.
        const response = await axios.get(`${API_BASE_URL}/users?username=${username}&password=${password}`);

        if (response.data.length > 0) {
          const loggedInUser = response.data[0];
          this.user = loggedInUser;
          this.isAuthenticated = true;
          this.userRole = loggedInUser.role;

          // Simpan data user ke localStorage untuk mempertahankan sesi
          localStorage.setItem('user', JSON.stringify(loggedInUser));

          console.log('Login successful:', loggedInUser.username, loggedInUser.role);
          return true; // Login berhasil
        } else {
          this.error = 'Username atau password salah.';
          console.warn('Login failed: Invalid credentials.');
          return false; // Login gagal
        }
      } catch (err) {
        console.error('Login error:', err);
        this.error = 'Terjadi kesalahan saat login. Coba lagi nanti.';
        return false;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Aksi untuk proses registrasi pengguna baru.
     * @param {object} userData - Objek data pengguna baru (TERMASUK ID MANUAL).
     * id: Number,
     * username: String,
     * email: String,
     * password: String,
     * role: String ('client' atau 'ninja')
     * @returns {boolean} - True jika registrasi berhasil, false jika gagal.
     */
    

    /**
     * Aksi untuk proses logout pengguna.
     */
    logout() {
      this.user = null;
      this.isAuthenticated = false;
      this.userRole = null;
      localStorage.removeItem('user'); // Hapus dari localStorage
      console.log('User logged out.');
      // Opsional: redirect ke halaman login setelah logout
      // if (router.currentRoute.value.meta.requiresAuth) { // Hanya redirect jika sedang di halaman yang memerlukan auth
      //   router.push('/login');
      // }
    },

    /**
     * Aksi untuk memuat ulang data user dari API (misal setelah update profil).
     */
    async fetchCurrentUser() {
      if (!this.isAuthenticated || !this.user?.id) return;

      this.loading = true;
      this.error = null;
      try {
        // Pastikan ID yang dikirim dalam URL adalah Number
        const response = await axios.get(`${API_BASE_URL}/users/${Number(this.user.id)}`);
        this.user = response.data;
        // Pastikan ID user yang disimpan di localStorage juga menjadi Number (jika db.json pakai int)
        this.user.id = Number(this.user.id); 
        localStorage.setItem('user', JSON.stringify(this.user));
        console.log('Current user data refreshed.');
      } catch (err) {
        console.error('Error fetching current user data:', err);
        this.error = 'Gagal memuat data pengguna terbaru.';
        // Jika gagal memuat, mungkin sesi sudah tidak valid, bisa logout
        // this.logout();
      } finally {
        this.loading = false;
      }
    }
  },
});