<template>
    <div class="loading-spinner-container" :class="{ 'overlay': overlay }">
      <div class="spinner"></div>
      <p v-if="text" class="spinner-text">{{ text }}</p>
    </div>
  </template>
  
  <script setup>
  
  const props = defineProps({
    text: {
      type: String,
      default: 'Memuat data...',
    },
    overlay: {
      type: Boolean,
      default: false,
    },
  });
  </script>
  
  <style scoped>
  /* Container untuk spinner, bisa menjadi overlay jika overlay=true */
  .loading-spinner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--color-text-light);
    font-size: 1.1em;
    gap: var(--spacing-sm);
  }
  
  /* Gaya untuk spinner itu sendiri */
  .spinner {
    width: 50px; /* Ukuran spinner */
    height: 50px;
    border: 4px solid rgba(255, 255, 255, 0.2); /* Warna border luar (transparan) */
    border-top: 4px solid var(--color-primary-accent); /* Warna border yang bergerak (merah muda neon) */
    border-radius: 50%;
    animation: spin 1s linear infinite; /* Animasi berputar */
  }
  
  /* Animasi putaran */
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Teks di bawah spinner */
  .spinner-text {
    margin-top: var(--spacing-sm);
    color: var(--color-primary-accent); /* Teks menggunakan warna aksen */
    text-shadow: 0 0 5px rgba(233, 69, 96, 0.5); /* Efek glow ringan */
    font-family: var(--font-heading, var(--font-primary));
  }
  
  /* Gaya untuk mode overlay */
  .loading-spinner-container.overlay {
    position: fixed; /* Posisi tetap di viewport */
    top: 0;
    left: 0;
    width: 100vw; /* Lebar penuh viewport */
    height: 100vh; /* Tinggi penuh viewport */
    background-color: rgba(0, 0, 0, 0.8); /* Background gelap transparan */
    z-index: 9999; /* Pastikan di atas semua elemen lain */
    backdrop-filter: blur(5px); /* Efek blur pada background di belakang spinner */
  }
  </style>