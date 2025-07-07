<template>
    <div class="about-page container">
      <section class="about-hero">
        <h1 class="about-title">Tentang Stealth Ops Dispatch</h1>
        <p class="about-subtitle">Membangun Jaringan Keamanan Siber Masa Depan</p>
      </section>
  
      <section class="about-section vision-mission">
        <div class="section-content">
          <h2 class="section-heading"><i class="fas fa-eye"></i> Visi Kami</h2>
          <p class="section-text">
            Menjadi platform terkemuka di dunia yang memberdayakan individu dan entitas untuk
            menghadapi ancaman siber yang semakin kompleks. Kami memimpikan dunia di mana keahlian
            siber dapat diakses dengan mudah untuk melindungi inovasi, privasi, dan keamanan digital.
          </p>
        </div>
        <div class="section-content">
          <h2 class="section-heading"><i class="fas fa-bullseye"></i> Misi Kami</h2>
          <ul class="mission-list">
            <li><strong>Menghubungkan:</strong> Menjembatani kesenjangan antara kebutuhan keamanan siber dan talenta ahli.</li>
            <li><strong>Memberdayakan:</strong> Memberikan alat dan peluang bagi Cyber Ninjas untuk mengembangkan keahlian mereka.</li>
            <li><strong>Mengamankan:</strong> Memfasilitasi operasi siber yang aman, rahasia, dan efektif bagi semua pihak.</li>
          </ul>
        </div>
      </section>
  
      <section class="about-section our-story">
        <h2 class="section-heading"><i class="fas fa-history"></i> Kisah Kami</h2>
        <div class="story-grid">
          <div class="story-item">
            <h3>Awal Mula</h3>
            <p>Stealth Ops Dispatch lahir dari kebutuhan mendesak di era digital yang semakin rentan. Para pendiri, veteran dari dunia keamanan siber bawah tanah, menyadari potensi besar dari komunitas freelancer siber yang belum terorganisir.</p>
          </div>
          <div class="story-item">
            <h3>Evolusi Platform</h3>
            <p>Dari konsep sederhana, kami mengembangkan platform yang canggih untuk mengelola misi, memverifikasi keahlian, dan memastikan keamanan komunikasi. Kami berinvestasi pada teknologi enkripsi mutakhir dan protokol anonimitas.</p>
          </div>
          <div class="story-item">
            <h3>Masa Depan</h3>
            <p>Kami terus berinovasi, menjelajahi batas-batas baru dalam keamanan siber. Dengan fokus pada kecerdasan buatan dan otomatisasi, kami bertekad untuk tetap menjadi yang terdepan dalam melindungi aset digital di seluruh galaksi.</p>
          </div>
        </div>
      </section>
  
      <section class="about-section cta-section">
        <h2 class="section-heading">Siap Memulai Misi Anda?</h2>
        <p>Bergabunglah dengan jaringan elit Cyber Ninja kami atau temukan ahli yang Anda butuhkan untuk melindungi aset digital Anda.</p>
        <div class="cta-buttons">
          <router-link to="/register" class="base-button primary-action-button">Daftar Sebagai Ninja</router-link>
          <router-link to="/client/missions/new" class="base-button secondary-action-button">Posting Misi Klien</router-link>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
  // Tidak ada logika JS spesifik yang diperlukan untuk halaman ini.
  // Ini murni komponen presentasi.
  </script>
  
  <style scoped>
  /* Scoped styles untuk About.vue */
  
  .about-page {
    padding: var(--spacing-xl) var(--spacing-md);
    max-width: 1000px; /* Batasi lebar konten */
    margin: 0 auto; /* Pusatkan konten */
  }
  
  /* --- About Hero Section --- */
  .about-hero {
    text-align: center;
    margin-bottom: var(--spacing-xl);
    padding: var(--spacing-lg);
    background-color: var(--color-background-card);
    border-radius: var(--border-radius-md);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
    border: 1px solid var(--color-border-card);
  }
  
  .about-title {
    font-family: var(--font-heading, var(--font-primary));
    font-size: 3.5em;
    color: var(--color-primary-accent);
    text-shadow: 0 0 10px rgba(233, 69, 96, 0.7);
    margin-bottom: var(--spacing-sm);
  }
  
  .about-subtitle {
    font-size: 1.4em;
    color: var(--color-text-muted);
    font-style: italic;
  }
  
  /* --- General Section Styling --- */
  .about-section {
    background-color: var(--color-background-card);
    border: 1px solid var(--color-border-card);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  }
  
  .section-heading {
    font-family: var(--font-heading, var(--font-primary));
    font-size: 2em;
    color: var(--color-secondary-accent); /* Aksen biru tua */
    text-align: center;
    margin-bottom: var(--spacing-lg);
    text-shadow: 0 0 8px rgba(15, 52, 96, 0.6);
  }
  
  .section-heading .fas {
    margin-right: var(--spacing-sm);
    color: var(--color-primary-accent); /* Ikon di heading dengan warna aksen */
  }
  
  .section-text {
    font-size: 1.1em;
    line-height: 1.6;
    color: var(--color-text-light);
    margin-bottom: var(--spacing-md);
  }
  
  /* --- Vision & Mission Section --- */
  .vision-mission {
    display: flex;
    gap: var(--spacing-xl);
    flex-wrap: wrap; /* Izinkan wrap pada ukuran kecil */
  }
  
  .vision-mission .section-content {
    flex: 1;
    min-width: 300px; /* Lebar minimum sebelum wrap */
  }
  
  .mission-list {
    list-style: none;
    padding: 0;
  }
  
  .mission-list li {
    background-color: rgba(74, 74, 110, 0.2); /* Background item list */
    padding: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
    border-left: 3px solid var(--color-primary-accent); /* Border kiri */
    border-radius: var(--border-radius-sm);
    font-size: 1em;
    color: var(--color-text-light);
  }
  
  .mission-list li strong {
    color: var(--color-primary-accent);
  }
  
  /* --- Our Story Section --- */
  .story-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-lg);
  }
  
  .story-item {
    background-color: rgba(26, 26, 46, 0.8); /* Warna lebih gelap dari card background */
    border: 1px solid rgba(74, 74, 110, 0.5);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-lg);
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3); /* Inset shadow */
  }
  
  .story-item h3 {
    font-family: var(--font-primary);
    color: var(--color-text-light);
    font-size: 1.3em;
    margin-bottom: var(--spacing-sm);
    text-shadow: none;
  }
  
  .story-item p {
    font-size: 0.95em;
    color: var(--color-text-muted);
  }
  
  /* --- CTA Section --- */
  .cta-section {
    text-align: center;
    padding: var(--spacing-xl);
    background-color: var(--color-secondary-accent); /* Background biru tua */
    color: var(--color-text-light);
    box-shadow: 0 0 20px rgba(15, 52, 96, 0.7);
    border: 1px solid var(--color-primary-accent); /* Border aksen */
  }
  
  .cta-section .section-heading {
    color: var(--color-text-light); /* Judul di CTA section pakai teks terang */
    text-shadow: none;
    margin-bottom: var(--spacing-md);
  }
  .cta-section .section-heading .fas {
      color: var(--color-primary-accent);
  }
  
  .cta-section p {
    font-size: 1.1em;
    margin-bottom: var(--spacing-lg);
    color: var(--color-text-light);
  }
  
  .cta-buttons {
    display: flex;
    justify-content: center;
    gap: var(--spacing-lg);
    flex-wrap: wrap; /* Untuk responsif */
  }
  
  /* Overrides untuk tombol di CTA section */
  .cta-buttons .primary-action-button {
    background-color: var(--color-primary-accent);
    border: 2px solid var(--color-text-light);
    color: var(--color-text-light);
    box-shadow: 0 0 15px rgba(233, 69, 96, 0.7);
  }
  .cta-buttons .primary-action-button:hover {
    background-color: #f00; /* Merah terang */
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.8);
  }
  
  .cta-buttons .secondary-action-button {
    background-color: var(--color-background-dark); /* background hitam */
    border: 2px solid var(--color-primary-accent);
    color: var(--color-primary-accent);
    box-shadow: 0 0 10px rgba(233, 69, 96, 0.5);
  }
  .cta-buttons .secondary-action-button:hover {
    background-color: var(--color-primary-accent);
    color: var(--color-text-light);
    box-shadow: 0 0 15px rgba(233, 69, 96, 0.8);
  }
  
  
  /* --- Responsiveness --- */
  @media (max-width: 768px) {
    .about-title {
      font-size: 2.8em;
    }
    .about-subtitle {
      font-size: 1.2em;
    }
    .vision-mission {
      flex-direction: column; /* Kolom tunggal pada mobile */
    }
    .story-grid {
      grid-template-columns: 1fr; /* Kolom tunggal pada mobile */
    }
    .cta-buttons {
      flex-direction: column; /* Tombol tumpuk pada mobile */
    }
  }
  
  @media (max-width: 480px) {
    .about-title {
      font-size: 2em;
    }
    .section-heading {
      font-size: 1.6em;
    }
    .about-section {
      padding: var(--spacing-md);
    }
    .story-item, .mission-list li {
      padding: var(--spacing-sm);
    }
  }
  </style>