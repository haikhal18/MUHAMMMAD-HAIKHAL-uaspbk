<template>
    <nav class="navbar">
      <div class="navbar-brand">
        <router-link to="/" class="navbar-logo">
          <img src="@/assets/animehub-logo.png" alt="AnimeHub Logo" class="logo-image" />
          AnimeHub
        </router-link>
      </div>
  
      <ul class="navbar-menu">
        <li><router-link to="/" class="nav-link">Home</router-link></li>
        <li><router-link to="/anime" class="nav-link">Browse Anime</router-link></li>
        <li v-if="isAuthenticated"><router-link to="/watchlist" class="nav-link">My Watchlist</router-link></li>
      </ul>
  
      <div class="navbar-auth">
        <template v-if="isAuthenticated">
          <span class="welcome-text">Selamat Datang, {{ currentUserUsername }}!</span>
          <button @click="handleLogout" class="auth-button logout-button">Logout</button>
        </template>
        <template v-else>
          <router-link to="/login" class="auth-button login-button">Login</router-link>
        </template>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/userStore'; // Sesuaikan path jika userStore.js tidak di root stores
  
  const router = useRouter();
  const authStore = useAuthStore();
  
  // Computed property untuk mengecek status autentikasi dari store
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  // Computed property untuk mendapatkan username pengguna yang sedang login dari store
  const currentUserUsername = computed(() => authStore.user ? authStore.user.username : 'Pengguna');
  
  // Fungsi untuk menangani proses logout
  const handleLogout = () => {
    if (confirm('Anda yakin ingin logout?')) {
      authStore.logout(); // Panggil action logout dari Pinia store
      router.push({ name: 'Home' }); // Arahkan kembali ke halaman utama setelah logout
    }
  };
  </script>
  
  <style scoped>
  .navbar {
    background-color: #1a1c20; /* Darker background for navbar */
    padding: 15px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
    color: #e0e0e0;
  }
  
  .navbar-brand {
    display: flex;
    align-items: center;
  }
  
  .navbar-logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #61dafb; /* Accent color for logo text */
    font-size: 1.8em;
    font-weight: bold;
    transition: color 0.3s ease;
  }
  
  .navbar-logo:hover {
    color: #4cb2d1;
  }
  
  .logo-image {
    height: 40px; /* Adjust logo size */
    margin-right: 10px;
  }
  
  .navbar-menu {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 30px; /* Spacing between menu items */
  }
  
  .nav-link {
    text-decoration: none;
    color: #c0c0c0;
    font-size: 1.1em;
    padding: 8px 12px;
    border-radius: 6px;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  .nav-link:hover,
  .router-link-active { /* Style for active link */
    background-color: #3a3f4a;
    color: #61dafb;
  }
  
  .navbar-auth {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .welcome-text {
    font-size: 1.05em;
    color: #e0e0e0;
  }
  
  .auth-button {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-size: 1.0em;
    font-weight: bold;
    cursor: pointer;
    text-decoration: none; /* For router-link */
    transition: background-color 0.3s ease;
  }
  
  .login-button {
    background-color: #007bff; /* Blue for login */
    color: white;
  }
  
  .login-button:hover {
    background-color: #0056b3;
  }
  
  .logout-button {
    background-color: #f44336; /* Red for logout */
    color: white;
  }
  
  .logout-button:hover {
    background-color: #da190b;
  }
  
  /* Responsiveness for smaller screens (optional, but good practice) */
  @media (max-width: 768px) {
    .navbar {
      flex-direction: column;
      align-items: flex-start;
      padding: 15px 20px;
    }
  
    .navbar-menu {
      flex-direction: column;
      gap: 10px;
      margin-top: 15px;
      width: 100%;
    }
  
    .nav-link {
      display: block;
      width: calc(100% - 24px); /* Full width with padding */
      text-align: left;
    }
  
    .navbar-auth {
      margin-top: 15px;
      width: 100%;
      justify-content: flex-start;
    }
  
    .auth-button {
      width: auto;
    }
  }
  </style>