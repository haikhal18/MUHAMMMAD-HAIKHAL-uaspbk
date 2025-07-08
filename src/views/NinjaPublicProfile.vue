<template>
    <div class="ninja-public-profile-page">
      <section class="page-hero">
        <h1 class="page-title">Profil Publik Ninja</h1>
        <p class="page-subtitle">Lihat keahlian dan reputasi ninja ini.</p>
      </section>
  
      <section class="profile-card" v-if="ninja">
        <h2 class="section-heading">
          <i class="fas fa-user-ninja"></i> {{ ninja.username }}
        </h2>
  
        <div class="profile-info">
          <div class="info-item">
            <strong>Email:</strong> {{ ninja.email }}
          </div>
          <div class="info-item">
            <strong>Peringkat:</strong> {{ ninja.rating || 'N/A' }}
          </div>
          <div class="info-item">
            <strong>Keahlian:</strong>
            <ul>
              <li v-for="skill in ninja.skills" :key="skill">{{ skill }}</li>
            </ul>
          </div>
        </div>
      </section>
  
      <section v-else class="profile-not-found">
        <p>Ninja tidak ditemukan atau data tidak tersedia.</p>
        <router-link to="/missions" class="base-button">Kembali ke Daftar Misi</router-link>
      </section>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  
  const route = useRoute();
  const ninja = ref(null);
  
  onMounted(async () => {
    const ninjaId = route.params.id;
    try {
      const response = await axios.get(`http://localhost:3000/users/${ninjaId}`);
      if (response.data && response.data.role === 'ninja') {
        ninja.value = response.data;
      }
    } catch (error) {
      console.error('Gagal memuat profil ninja:', error);
    }
  });
  </script>
  
  <style scoped>
  .ninja-public-profile-page {
    padding: var(--spacing-xl) var(--spacing-md);
    max-width: 800px;
    margin: 0 auto;
  }
  
  .page-hero {
    text-align: center;
    margin-bottom: var(--spacing-xl);
    padding: var(--spacing-lg);
    background-color: var(--color-background-card);
    border-radius: var(--border-radius-md);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
    border: 1px solid var(--color-border-card);
  }
  
  .page-title {
    font-family: var(--font-heading, var(--font-primary));
    font-size: 3em;
    color: var(--color-primary-accent);
    text-shadow: 0 0 10px rgba(233, 69, 96, 0.7);
    margin-bottom: var(--spacing-sm);
  }
  
  .page-subtitle {
    font-size: 1.2em;
    color: var(--color-text-muted);
    font-style: italic;
  }
  
  .profile-card {
    background-color: var(--color-background-card);
    border: 1px solid var(--color-border-card);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-xl);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  }
  
  .section-heading {
    font-family: var(--font-heading, var(--font-primary));
    font-size: 2em;
    color: var(--color-secondary-accent);
    text-align: center;
    margin-bottom: var(--spacing-lg);
    text-shadow: 0 0 8px rgba(15, 52, 96, 0.6);
  }
  
  .section-heading .fas {
    margin-right: var(--spacing-sm);
    color: var(--color-primary-accent);
  }
  
  .profile-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    margin-top: var(--spacing-md);
  }
  
  .info-item {
    font-size: 1.1em;
    color: var(--color-text);
  }
  
  .profile-not-found {
    text-align: center;
    padding: var(--spacing-lg);
    color: var(--color-primary-accent);
    font-size: 1.1em;
  }
  
  .profile-not-found .base-button {
    margin-top: var(--spacing-md);
  }
  
  @media (max-width: 768px) {
    .page-title {
      font-size: 2.5em;
    }
    .page-subtitle {
      font-size: 1em;
    }
    .profile-card {
      padding: var(--spacing-lg);
    }
  }
  
  @media (max-width: 480px) {
    .page-title {
      font-size: 2em;
    }
    .page-hero {
      padding: var(--spacing-md);
    }
    .section-heading {
      font-size: 1.6em;
    }
  }
  </style>
  