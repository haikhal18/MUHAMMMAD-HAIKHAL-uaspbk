<template>
    <div class="client-layout">
      <div v-if="isSidebarOpen" class="mobile-sidebar-overlay" @click="closeSidebar"></div>
  
      <ClientSidebar :is-open="isSidebarOpen" />
  
      <main class="client-content">
        <button v-if="isMobile" @click="toggleSidebar" class="mobile-sidebar-toggle" aria-label="Toggle Sidebar">
          <i class="fas fa-bars"></i>
        </button>
  
        <router-view />
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import ClientSidebar from '@/components/client/ClientSidebar.vue'; // Impor sidebar klien
  
  const isSidebarOpen = ref(false); // State untuk mengontrol visibilitas sidebar
  const isMobile = ref(false); // State untuk mendeteksi apakah di mode mobile
  
  // Fungsi untuk membuka/menutup sidebar
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
  
  // Fungsi untuk menutup sidebar (dipanggil oleh overlay)
  const closeSidebar = () => {
    isSidebarOpen.value = false;
  };
  
  // Fungsi untuk mendeteksi apakah layar adalah mobile
  const checkMobile = () => {
    // Angka 768px adalah breakpoint yang kita gunakan di CSS sidebar
    isMobile.value = window.innerWidth <= 768;
  
    // Jika layar bukan mobile lagi dan sidebar terbuka, tutup sidebar
    if (!isMobile.value && isSidebarOpen.value) {
      isSidebarOpen.value = false;
    }
  };
  
  // Hooks Lifecycle Vue
  onMounted(() => {
    // Panggil saat komponen pertama kali di-mount
    checkMobile();
    // Tambahkan event listener untuk mendeteksi perubahan ukuran layar
    window.addEventListener('resize', checkMobile);
  });
  
  onUnmounted(() => {
    // Hapus event listener saat komponen di-unmount untuk mencegah memory leak
    window.removeEventListener('resize', checkMobile);
  });
  </script>
  
  <style scoped>
  /* Scoped styles untuk ClientLayout */
  .client-layout {
    display: flex; /* Menggunakan Flexbox untuk menata sidebar dan konten */
    min-height: 100vh; /* Pastikan layout mengisi seluruh tinggi viewport */
    background-color: var(--color-background-dark); /* Latar belakang utama */
    color: var(--color-text-light); /* Warna teks default */
    position: relative; /* Penting untuk posisi tombol toggle dan overlay mobile */
    overflow-x: hidden; /* Mencegah scroll horizontal saat sidebar di luar layar */
  }
  
  /* Konten utama di sebelah sidebar */
  .client-content {
    flex-grow: 1; /* Konten utama akan mengisi sisa ruang yang tersedia */
    padding: var(--spacing-lg); /* Padding umum untuk konten halaman */
    overflow-y: auto; /* Memungkinkan scroll pada konten jika panjang */
    position: relative; /* Penting untuk posisi tombol toggle */
  }
  
  /* --- Gaya untuk Mobile Sidebar Toggle --- */
  
  .mobile-sidebar-toggle {
    display: none; /* Sembunyikan secara default di desktop */
    position: fixed; /* Posisi tetap di viewport */
    top: var(--spacing-md); /* Jarak dari atas */
    left: var(--spacing-md); /* Jarak dari kiri */
    background-color: var(--color-secondary-accent); /* Warna tombol */
    color: var(--color-text-light);
    border: none;
    border-radius: var(--border-radius-sm);
    padding: var(--spacing-sm);
    font-size: 1.5em; /* Ukuran ikon hamburger */
    cursor: pointer;
    z-index: 1001; /* Pastikan tombol di atas sidebar overlay */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    transition: background-color 0.3s ease;
  }
  
  .mobile-sidebar-toggle:hover {
    background-color: var(--color-button-hover);
  }
  
  /* --- Gaya untuk Mobile Sidebar Overlay --- */
  .mobile-sidebar-overlay {
    display: none; /* Sembunyikan secara default */
    position: fixed; /* Posisi tetap */
    top: 0;
    left: 0;
    width: 100vw; /* Lebar penuh viewport */
    height: 100vh; /* Tinggi penuh viewport */
    background-color: rgba(0, 0, 0, 0.5); /* Background semi-transparan */
    z-index: 999; /* Di bawah sidebar tapi di atas konten utama */
  }
  
  /* --- Responsive Adjustments --- */
  @media (max-width: 768px) {
    .client-layout {
      flex-direction: column; /* Pada mobile, sidebar tidak lagi disamping, tapi fixed */
    }
  
    /*
      Menambahkan padding di bagian atas konten utama agar tidak tertutup
      oleh tombol toggle saat di mobile.
      `calc(var(--spacing-lg) + 60px)`: padding default + tinggi tombol toggle + sedikit margin.
    */
    .client-content {
      padding-top: calc(var(--spacing-lg) + 60px);
    }
  
    /* Tampilkan tombol toggle di mobile */
    .mobile-sidebar-toggle {
      display: block;
    }
  
    /* Tampilkan overlay saat sidebar terbuka di mobile */
    .mobile-sidebar-overlay[data-v-f3a3f5a] { /* Gunakan selector dengan hash unik jika ingin lebih spesifik */
        display: block; /* Ini akan ditimpa oleh v-if="isSidebarOpen" */
    }
  }
  </style>