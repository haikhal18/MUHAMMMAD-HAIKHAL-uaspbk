<template>
    <header class="app-header">
      <div class="container">
        <div class="header-content">
          <router-link to="/" class="logo-link">
            <img src="@/assets/images/logo.png" alt="Stealth Ops Dispatch Logo" class="logo-img" v-if="logoExists">
            <span class="logo-text" v-else>STEALTH OPS</span>
          </router-link>
  
          <nav class="main-nav">
            <ul>
              <li><router-link to="/" active-class="active-link">Home</router-link></li>
              <li><router-link to="/missions" active-class="active-link">Misi Publik</router-link></li>
              <li><router-link to="/about" active-class="active-link">Tentang</router-link></li>
              <li><router-link to="/contact" active-class="active-link">Kontak</router-link></li>
            </ul>
          </nav>
  
          <div class="auth-buttons">
            <template v-if="!authStore.isAuthenticated">
              <router-link to="/login" class="base-button login-button">Login</router-link>
              <router-link to="/register" class="base-button register-button">Daftar</router-link>
            </template>
            <template v-else>
              <router-link :to="dashboardLink" class="base-button dashboard-button">
                Dashboard {{ authStore.userRole === 'client' ? 'Klien' : 'Ninja' }}
              </router-link>
              <button @click="handleLogout" class="base-button logout-button">Logout</button>
            </template>
          </div>
        </div>
      </div>
    </header>
  </template>
  
  <script setup>
  import { computed, ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth'; // Sesuaikan path jika berbeda
  
  const authStore = useAuthStore();
  const router = useRouter();
  
  // Computed property untuk menentukan link dashboard berdasarkan peran pengguna
  const dashboardLink = computed(() => {
    if (authStore.userRole === 'client') {
      return '/client/dashboard';
    } else if (authStore.userRole === 'ninja') {
      return '/ninja/dashboard';
    }
    return '/'; // Default fallback
  });
  
  const handleLogout = () => {
    authStore.logout();
    router.push('/login'); // Redirect ke halaman login setelah logout
  };
  
  // Cek apakah logo.png ada (opsional, untuk mencegah error jika gambar belum ada)
  const logoExists = ref(true);
  onMounted(() => {
    const img = new Image();
    img.src = new URL('@/assets/images/logo.png', import.meta.url).href;
    img.onerror = () => {
      logoExists.value = false;
    };
  });
  </script>
  
  <style scoped>
  /* Scoped styles untuk AppHeader */
  .app-header {
    background-color: rgba(18, 18, 18, 0.9); /* Sedikit transparan, lebih gelap dari background utama */
    padding: var(--spacing-md) 0;
    border-bottom: 1px solid rgba(74, 74, 110, 0.5); /* Border tipis di bawah */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
    position: sticky; /* Header tetap di atas saat di-scroll */
    top: 0;
    z-index: 1000; /* Pastikan header di atas konten lain */
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
  }
  
  .logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
  }
  
  .logo-img {
    height: 40px; /* Ukuran logo */
    margin-right: 10px;
  }
  
  .logo-text {
    font-family: var(--font-heading, var(--font-primary));
    font-size: 1.8em;
    font-weight: bold;
    color: var(--color-primary-accent); /* Warna logo teks */
    text-shadow: 0 0 8px rgba(233, 69, 96, 0.7); /* Efek glow */
  }
  
  /* Main Navigation */
  .main-nav ul {
    list-style: none;
    display: flex;
    gap: var(--spacing-lg); /* Jarak antar item menu */
  }
  
  .main-nav a {
    color: var(--color-text-light);
    font-size: 1em;
    padding: 5px 0;
    transition: color 0.3s ease, text-shadow 0.3s ease;
    position: relative; /* Untuk underline efek */
  }
  
  .main-nav a:hover {
    color: var(--color-primary-accent);
    text-shadow: 0 0 5px rgba(233, 69, 96, 0.5);
  }
  
  /* Active link style */
  .main-nav a.active-link {
    color: var(--color-primary-accent);
    font-weight: bold;
    text-shadow: 0 0 8px rgba(233, 69, 96, 0.7);
  }
  
  .main-nav a.active-link::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -5px;
    width: 100%;
    height: 3px;
    background-color: var(--color-primary-accent);
    border-radius: 2px;
  }
  
  /* Auth Buttons */
  .auth-buttons {
    display: flex;
    gap: var(--spacing-sm);
  }
  
  /* Menggunakan gaya dari main.css */
  .base-button {
    /* Gaya dasar sudah di main.css */
    padding: var(--spacing-sm) var(--spacing-md);
    text-decoration: none; /* Penting untuk router-link sebagai button */
    display: inline-flex; /* Agar padding dan alignment bekerja baik */
    align-items: center;
    justify-content: center;
  }
  
  .login-button {
    background-color: var(--color-secondary-accent); /* Biru tua untuk login */
  }
  
  .login-button:hover {
    background-color: var(--color-button-hover);
  }
  
  .register-button {
    background-color: transparent;
    border: 1px solid var(--color-primary-accent);
    color: var(--color-primary-accent);
    box-shadow: none; /* Hilangkan shadow default */
  }
  
  .register-button:hover {
    background-color: rgba(233, 69, 96, 0.1);
    box-shadow: 0 0 10px rgba(233, 69, 96, 0.5);
    transform: translateY(-2px);
  }
  
  .dashboard-button {
    background-color: #3f0099; /* Warna ungu lebih gelap untuk dashboard */
    box-shadow: 0 0 8px rgba(63, 0, 153, 0.3);
  }
  .dashboard-button:hover {
    background-color: #2a0066;
    box-shadow: 0 0 12px rgba(63, 0, 153, 0.5);
  }
  
  .logout-button {
    background-color: #990000; /* Merah gelap untuk logout */
  }
  .logout-button:hover {
    background-color: #660000;
  }
  
  /* Responsive Styles */
  @media (max-width: 768px) {
    .header-content {
      flex-wrap: wrap; /* Izinkan wrap pada ukuran kecil */
      justify-content: center;
      gap: var(--spacing-md);
    }
  
    .main-nav {
      flex-basis: 100%; /* Navigasi ambil 100% lebar */
      order: 3; /* Pindahkan navigasi ke bawah pada mobile */
      margin-top: var(--spacing-md);
    }
  
    .main-nav ul {
      justify-content: center;
      flex-wrap: wrap;
      gap: var(--spacing-sm);
    }
  
    .logo-link,
    .auth-buttons {
      flex-basis: 48%; /* Bagi ruang untuk logo dan tombol */
      justify-content: center; /* Rata tengah */
    }
  
    .logo-link {
      order: 1;
    }
  
    .auth-buttons {
      order: 2;
    }
  }
  
  @media (max-width: 480px) {
    .logo-text {
      font-size: 1.5em;
    }
    .auth-buttons {
      flex-direction: column; /* Tombol jadi tumpuk */
      width: 100%;
    }
    .base-button {
      width: 100%; /* Tombol ambil lebar penuh */
    }
  }
  </style>