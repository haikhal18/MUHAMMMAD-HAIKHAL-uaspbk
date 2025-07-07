<template>
    <div class="home-page">
      <section class="hero-section">
        <div class="container hero-content">
          <h1 class="hero-title">CYBER NINJA OPS</h1>
          <p class="hero-description">
            Platform terdepan untuk misi siber rahasia. Hubungkan klien dengan Cyber Ninja terbaik
            untuk operasi infiltrasi, pemulihan data, dan keamanan digital tingkat tinggi.
            Stealth Ops Dispatch: Where Shadow Meets Code.
          </p>
          <div class="hero-buttons">
            <router-link to="/missions" class="base-button primary-action-button">
              <i class="fas fa-search"></i> Jelajahi Misi
            </router-link>
            <router-link to="/register" class="base-button secondary-action-button">
              <i class="fas fa-user-plus"></i> Bergabung Sekarang
            </router-link>
          </div>
        </div>
      </section>
  
      <section class="features-section container">
        <h2 class="section-title">Mengapa Memilih Kami?</h2>
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon">
              <i class="fas fa-lock"></i>
            </div>
            <h3 class="feature-title">Keamanan Tanpa Kompromi</h3>
            <p class="feature-description">Setiap operasi dienkripsi dan setiap agen terverifikasi untuk integritas maksimal.</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <i class="fas fa-dollar-sign"></i>
            </div>
            <h3 class="feature-title">Bayaran Kompetitif</h3>
            <p class="feature-description">Dapatkan imbalan yang setimpal dengan keahlian dan risiko misi yang Anda ambil.</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <i class="fas fa-user-secret"></i>
            </div>
            <h3 class="feature-title">Jaringan Elit Ninja</h3>
            <p class="feature-description">Terhubung dengan talenta siber terbaik di dunia untuk misi paling menantang.</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <i class="fas fa-rocket"></i>
            </div>
            <h3 class="feature-title">Eksekusi Cepat & Efisien</h3>
            <p class="feature-description">Sistem matchmaking misi kami memastikan penugasan yang cepat dan tepat sasaran.</p>
          </div>
        </div>
      </section>
  
      </div>
  </template>
  
  <script setup>
  // Tidak ada logika JS spesifik yang diperlukan untuk halaman ini,
  // ini murni komponen presentasi.
  </script>
  
  <style scoped>
  /* Scoped styles untuk Home.vue */
  
  .home-page {
    /* Latar belakang utama aplikasi sudah diatur di main.css pada #app */
    /* Di sini kita hanya mendesain konten halaman Home */
    width: 100%; /* Pastikan halaman mengambil lebar penuh */
    box-sizing: border-box;
  }
  
  /* --- Hero Section --- */
  .hero-section {
    min-height: 80vh; /* Tinggi minimum hero section */
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: var(--spacing-xl) 0; /* Padding atas/bawah */
    position: relative;
    /* Gambar background utama dari main.css akan ada di belakang ini */
  }
  
  .hero-content {
    max-width: 900px;
    color: var(--color-text-light);
    /* Memberikan sedikit background gelap untuk teks agar lebih kontras */
    background-color: rgba(0, 0, 0, 0.4);
    padding: var(--spacing-xl);
    border-radius: var(--border-radius-md);
    backdrop-filter: blur(5px); /* Efek blur pada background di balik konten hero */
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(74, 74, 110, 0.3); /* Border samar */
  }
  
  .hero-title {
    font-family: var(--font-heading, 'Arial Black', sans-serif);
    font-size: 4em; /* Ukuran font besar */
    color: var(--color-primary-accent); /* Aksen merah muda neon */
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: var(--spacing-md);
    text-shadow: 0 0 15px rgba(233, 69, 96, 0.8), 0 0 30px rgba(233, 69, 96, 0.5); /* Efek glow kuat */
  }
  
  .hero-description {
    font-size: 1.2em;
    line-height: 1.6;
    margin-bottom: var(--spacing-xl);
    color: var(--color-text-muted);
  }
  
  .hero-buttons {
    display: flex;
    justify-content: center;
    gap: var(--spacing-lg); /* Jarak antar tombol */
  }
  
  .primary-action-button {
    background-color: var(--color-primary-accent); /* Merah muda neon */
    box-shadow: 0 0 15px rgba(233, 69, 96, 0.7); /* Glow kuat */
    transition: all 0.3s ease;
  }
  .primary-action-button:hover {
    background-color: var(--color-secondary-accent); /* Biru tua saat hover */
    box-shadow: 0 0 20px rgba(15, 52, 96, 0.8);
    transform: translateY(-3px) scale(1.02);
  }
  
  .secondary-action-button {
    background-color: transparent;
    border: 2px solid var(--color-secondary-accent); /* Border biru tua */
    color: var(--color-secondary-accent);
    box-shadow: 0 0 10px rgba(15, 52, 96, 0.5); /* Glow biru */
    transition: all 0.3s ease;
  }
  .secondary-action-button:hover {
    background-color: var(--color-secondary-accent); /* Isi dengan biru tua saat hover */
    color: var(--color-text-light);
    box-shadow: 0 0 15px rgba(15, 52, 96, 0.8);
    transform: translateY(-3px) scale(1.02);
  }
  
  .hero-buttons .base-button .fas {
    margin-right: 8px; /* Jarak antara ikon dan teks */
  }
  
  /* --- Features Section --- */
  .features-section {
    padding: var(--spacing-xl) 0;
    text-align: center;
    margin-top: var(--spacing-xl); /* Jarak dari hero section */
  }
  
  .section-title {
    font-size: 2.5em;
    margin-bottom: var(--spacing-xl);
    color: var(--color-primary-accent);
    text-shadow: 0 0 8px rgba(233, 69, 96, 0.6);
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Responsif, 2-4 kolom */
    gap: var(--spacing-lg); /* Jarak antar fitur */
  }
  
  .feature-item {
    background-color: var(--color-background-card);
    border: 1px solid var(--color-border-card);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-xl);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .feature-item:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
    border-color: var(--color-primary-accent); /* Border berubah saat hover */
  }
  
  .feature-icon {
    font-size: 3em;
    color: var(--color-secondary-accent); /* Warna ikon fitur */
    margin-bottom: var(--spacing-md);
    text-shadow: 0 0 10px rgba(15, 52, 96, 0.5);
  }
  
  .feature-item .feature-title {
    font-family: var(--font-primary); /* Judul fitur pakai font biasa */
    font-size: 1.4em;
    color: var(--color-text-light); /* Warna teks terang */
    margin-bottom: var(--spacing-sm);
    text-shadow: none; /* Hilangkan shadow teks untuk fitur title */
  }
  
  .feature-item .feature-description {
    font-size: 0.95em;
    color: var(--color-text-muted);
  }
  
  /* --- Responsiveness --- */
  @media (max-width: 992px) {
    .hero-title {
      font-size: 3.5em;
    }
    .hero-description {
      font-size: 1.1em;
    }
    .section-title {
      font-size: 2em;
    }
  }
  
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.8em;
    }
    .hero-description {
      font-size: 1em;
    }
    .hero-content {
      padding: var(--spacing-lg);
    }
    .hero-buttons {
      flex-direction: column; /* Tombol jadi tumpuk di mobile */
      gap: var(--spacing-md);
    }
    .features-grid {
      grid-template-columns: 1fr; /* 1 kolom di mobile */
    }
  }
  
  @media (max-width: 480px) {
    .hero-title {
      font-size: 2.2em;
    }
    .hero-content {
      padding: var(--spacing-md);
    }
  }
  </style>