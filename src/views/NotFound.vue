<template>
    <div class="not-found-page">
      <div class="not-found-content">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">Misi Tidak Ditemukan</h2>
        <p class="error-message">
          Nampaknya rute yang Anda cari tidak ada dalam database jaringan Stealth Ops.
          Mungkin misi ini telah diarsipkan atau tidak pernah ada.
        </p>
        <router-link to="/" class="base-button back-home-button">
          <i class="fas fa-arrow-alt-circle-left"></i> Kembali ke Markas Utama
        </router-link>
      </div>
    </div>
  </template>
  
  <style scoped>
  
  .not-found-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - var(--spacing-xl) * 2); /* Mengkompensasi padding main-content */
    padding: var(--spacing-xl) var(--spacing-md);
    text-align: center;
    /* Latar belakang utama aplikasi sudah diatur di main.css pada #app */
  }
  
  .not-found-content {
    background-color: rgba(26, 26, 46, 0.9); /* Card background gelap semi-transparan */
    border: 1px solid var(--color-border-card);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-xl);
    max-width: 600px; /* Batasi lebar konten */
    width: 100%;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
  }
  
  .error-code {
    font-family: var(--font-heading, var(--font-primary));
    font-size: 8em; /* Angka 404 yang besar */
    color: var(--color-primary-accent);
    text-shadow: 0 0 20px rgba(233, 69, 96, 0.9), 0 0 40px rgba(233, 69, 96, 0.6);
    margin-bottom: var(--spacing-md);
    line-height: 1; /* Pastikan tidak ada spasi berlebih */
  }
  
  .error-title {
    font-family: var(--font-heading, var(--font-primary));
    font-size: 2.5em;
    color: var(--color-text-light);
    margin-bottom: var(--spacing-lg);
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  }
  
  .error-message {
    font-size: 1.1em;
    color: var(--color-text-muted);
    line-height: 1.6;
    margin-bottom: var(--spacing-xl);
  }
  
  .back-home-button {
    background-color: var(--color-secondary-accent); /* Biru tua */
    color: var(--color-text-light);
    box-shadow: 0 0 10px rgba(15, 52, 96, 0.6);
  }
  
  .back-home-button:hover {
    background-color: var(--color-primary-accent); /* Merah muda neon saat hover */
    box-shadow: 0 0 15px rgba(233, 69, 96, 0.8);
    transform: translateY(-3px) scale(1.02);
  }
  
  .back-home-button .fas {
    margin-right: 8px;
  }
  
  /* Responsiveness */
  @media (max-width: 768px) {
    .error-code {
      font-size: 6em;
    }
    .error-title {
      font-size: 2em;
    }
    .error-message {
      font-size: 1em;
    }
    .not-found-content {
      padding: var(--spacing-lg);
    }
  }
  
  @media (max-width: 480px) {
    .error-code {
      font-size: 4.5em;
    }
    .error-title {
      font-size: 1.6em;
    }
    .error-message {
      font-size: 0.9em;
    }
  }
  </style>