<template>
    <div class="default-layout">
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </template>
  
  <script setup>
  
  // Tidak ada logika spesifik untuk layout ini,
  // hanya merender header, konten (router-view), dan footer.
  </script>
  
  <style scoped>
  /* Scoped styles untuk DefaultLayout */
  .default-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh; /* Pastikan layout mengisi seluruh tinggi viewport */
    background-color: transparent; /* Latar belakang diambil dari main.css #app */
    color: var(--color-text-light); /* Warna teks default */
  }
  
  /*
    Gaya untuk .main-content sudah ada di main.css:
    .main-content {
      flex-grow: 1;
      padding: var(--spacing-xl) 0;
    }
    Namun, Anda bisa menyesuaikannya di sini jika perlu spesifik untuk layout ini.
  */
  .main-content {
    flex-grow: 1; /* Konten utama akan mengisi sisa ruang */
    padding: var(--spacing-xl) var(--spacing-md); /* Padding atas/bawah dan samping */
    width: 100%; /* Pastikan mengisi lebar penuh */
    box-sizing: border-box; /* Pastikan padding tidak menambah lebar */
  }
  </style>