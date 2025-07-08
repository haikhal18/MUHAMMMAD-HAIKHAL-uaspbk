// src/stores/auth.js
import { defineStore } from 'pinia';
import axios from 'axios';
import router from '@/router';

const API_BASE_URL = 'http://localhost:3000'; // Ganti jika base URL json-server berbeda

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    userRole: null,
    loading: false,
    error: null,
  }),

  getters: {
    isClient: (state) => state.userRole === 'client',
    isNinja: (state) => state.userRole === 'ninja',
  },

  actions: {
    initializeAuth() {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          this.user = user;
          this.isAuthenticated = true;
          this.userRole = user.role;
          console.log('Auth initialized from localStorage:', user.username, user.role);
        } else {
          console.log('No user found in localStorage.');
        }
      } catch (e) {
        console.error('Failed to parse user from localStorage:', e);
        this.logout();
      }
    },

    async login(username, password) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_BASE_URL}/users?username=${username}&password=${password}`);

        if (response.data.length > 0) {
          const loggedInUser = response.data[0];
          this.user = loggedInUser;
          this.isAuthenticated = true;
          this.userRole = loggedInUser.role;
          localStorage.setItem('user', JSON.stringify(loggedInUser));
          console.log('Login successful:', loggedInUser.username, loggedInUser.role);
          return true;
        } else {
          this.error = 'Username atau password salah.';
          console.warn('Login failed: Invalid credentials.');
          return false;
        }
      } catch (err) {
        console.error('Login error:', err);
        this.error = 'Terjadi kesalahan saat login. Coba lagi nanti.';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async register(userData) {
      this.loading = true;
      this.error = null;
      try {
        const existingUsers = await axios.get(`${API_BASE_URL}/users?username=${userData.username}`);
        if (existingUsers.data.length > 0) {
          this.error = 'Username sudah digunakan.';
          return false;
        }

        // Buat ID unik dalam format "id-123"
        if (!userData.id) {
          const allUsers = await axios.get(`${API_BASE_URL}/users`);
          const idNumbers = allUsers.data
            .map(user => parseInt(String(user.id).replace(/[^\d]/g, ''), 10))
            .filter(n => !isNaN(n));
          const nextId = Math.max(...idNumbers, 0) + 1;
          userData.id = `id-${nextId}`;
        }

        const response = await axios.post(`${API_BASE_URL}/users`, userData);
        this.user = response.data;
        this.isAuthenticated = true;
        this.userRole = response.data.role;
        localStorage.setItem('user', JSON.stringify(response.data));
        console.log('Registrasi berhasil:', response.data.username);
        return true;
      } catch (err) {
        console.error('Error saat registrasi:', err);
        this.error = 'Terjadi kesalahan saat registrasi. Coba lagi nanti.';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async fetchCurrentUser() {
      if (!this.isAuthenticated || !this.user?.id) return;

      this.loading = true;
      this.error = null;
      try {
        // Gunakan query search karena json-server tidak mendukung GET by string ID langsung
        const response = await axios.get(`${API_BASE_URL}/users?id=${this.user.id}`);
        if (response.data.length > 0) {
          this.user = response.data[0];
          localStorage.setItem('user', JSON.stringify(this.user));
          console.log('Current user data refreshed.');
        } else {
          console.warn('User not found. Logging out.');
          this.logout();
        }
      } catch (err) {
        console.error('Error fetching current user data:', err);
        this.error = 'Gagal memuat data pengguna terbaru.';
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.isAuthenticated = false;
      this.userRole = null;
      localStorage.removeItem('user');
      console.log('User logged out.');
    }
  }
});
