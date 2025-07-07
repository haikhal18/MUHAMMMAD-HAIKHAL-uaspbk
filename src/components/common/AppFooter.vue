<template>
    <footer class="app-footer">
      <div class="container footer-content">
        <div class="footer-section copyright">
          <p>&copy; {{ currentYear }} Stealth Ops Dispatch. All rights reserved.</p>
          <p>A Cyber Ninja's platform for covert operations.</p>
        </div>
  
        <div class="footer-section quick-links">
          <h3>Quick Links</h3>
          <ul>
            <li><router-link to="/about">Tentang Kami</router-link></li>
            <li><router-link to="/contact">Kontak</router-link></li>
            <li><router-link to="/missions">Misi</router-link></li>
            </ul>
        </div>
  
        <div class="footer-section social-links">
          <h3>Connect</h3>
          <div class="social-icons">
            <a href="#" target="_blank" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
            <a href="#" target="_blank" aria-label="Discord"><i class="fab fa-discord"></i></a>
            <a href="#" target="_blank" aria-label="GitHub"><i class="fab fa-github"></i></a>
          </div>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  // Computed property untuk mendapatkan tahun saat ini secara dinamis
  const currentYear = computed(() => {
    return new Date().getFullYear();
  });
  </script>
  
  <style scoped>
  /* Scoped styles untuk AppFooter */
  .app-footer {
    background-color: rgba(18, 18, 18, 0.9); /* Sedikit transparan, konsisten dengan header */
    color: var(--color-text-muted);
    padding: var(--spacing-lg) 0;
    border-top: 1px solid rgba(74, 74, 110, 0.5); /* Border tipis di atas */
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.4);
    margin-top: auto; /* Penting untuk footer lengket di bagian bawah halaman */
  }
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap; /* Izinkan wrap pada ukuran kecil */
    gap: var(--spacing-lg); /* Jarak antar section footer */
  }
  
  .footer-section {
    flex: 1; /* Memberikan fleksibilitas pada setiap section */
    min-width: 200px; /* Lebar minimum sebelum wrap */
  }
  
  .footer-section h3 {
    font-family: var(--font-heading, var(--font-primary));
    color: var(--color-primary-accent);
    margin-bottom: var(--spacing-md);
    font-size: 1.2em;
    text-shadow: 0 0 3px rgba(233, 69, 96, 0.3);
  }
  
  .copyright p {
    font-size: 0.9em;
    line-height: 1.5;
    margin-bottom: var(--spacing-sm);
  }
  
  .quick-links ul {
    list-style: none;
    padding: 0;
  }
  
  .quick-links li {
    margin-bottom: var(--spacing-sm);
  }
  
  .quick-links a {
    color: var(--color-text-muted);
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .quick-links a:hover {
    color: var(--color-primary-accent);
    text-decoration: underline;
  }
  
  .social-icons {
    display: flex;
    gap: var(--spacing-md);
  }
  
  .social-icons a {
    color: var(--color-text-light);
    font-size: 1.5em; /* Ukuran ikon */
    transition: color 0.3s ease, transform 0.2s ease;
  }
  
  .social-icons a:hover {
    color: var(--color-primary-accent);
    transform: translateY(-3px);
  }
  
  /* Responsiveness */
  @media (max-width: 768px) {
    .footer-content {
      flex-direction: column; /* Tata letak kolom pada mobile */
      align-items: center;
      text-align: center;
    }
  
    .footer-section {
      min-width: unset; /* Reset min-width */
      width: 100%; /* Ambil lebar penuh */
      margin-bottom: var(--spacing-lg); /* Tambah jarak antar section */
    }
  
    .social-icons {
      justify-content: center; /* Rata tengah ikon sosial */
    }
  }
  </style>