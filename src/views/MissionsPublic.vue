<template>
    <div class="missions-public-page container">
      <section class="public-missions-hero">
        <h1 class="page-title">Misi Siber Terbuka</h1>
        <p class="page-subtitle">Jelajahi peluang misi terenkripsi yang tersedia di jaringan.</p>
      </section>
  
      <section class="mission-list-section">
        <LoadingSpinner v-if="missionStore.loading" text="Memuat daftar misi..." />
        <AlertMessage
          v-if="missionStore.error && !missionStore.loading"
          v-model:isVisible="showMissionErrorAlert"
          type="error"
          :message="missionStore.error"
          :dismissible="true"
          @dismissed="missionStore.error = null"
          class="mission-error-alert"
        />
  
        <div v-if="!missionStore.loading && missionStore.availableMissions.length" class="mission-grid">
          <MissionCard
            v-for="mission in missionStore.availableMissions"
            :key="mission.id"
            :mission="mission"
          >
            <template #actions>
              <router-link to="/register" class="base-button secondary-action-button">Daftar untuk Melamar</router-link>
            </template>
          </MissionCard>
        </div>
        <div v-else-if="!missionStore.loading" class="no-missions">
          <p>Tidak ada misi terbuka yang tersedia saat ini.</p>
          <p>Silakan kembali lagi nanti atau <router-link to="/register" class="highlight-link">Daftar</router-link> untuk mendapatkan pemberitahuan.</p>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useMissionStore } from '@/stores/mission'; // Impor Pinia missionStore
  import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
  import AlertMessage from '@/components/common/AlertMessage.vue';
  import MissionCard from '@/components/ui/MissionCard.vue';
  import { nextTick } from 'vue';
  
  const missionStore = useMissionStore();
  
  const showMissionErrorAlert = ref(false); // Untuk mengontrol visibilitas alert
  
  // Watcher untuk error dari missionStore
  watch(() => missionStore.error, (newError) => {
    if (newError) {
      showMissionErrorAlert.value = true;
      nextTick(() => {
          setTimeout(() => showMissionErrorAlert.value = false, 5000); // Hilangkan alert setelah 5 detik
      });
    } else {
      showMissionErrorAlert.value = false; // Sembunyikan alert jika error dihapus
    }
  });
  
  onMounted(() => {
    // Panggil aksi untuk mengambil semua misi yang statusnya 'available'
    // Gunakan filter di sini agar hanya misi publik yang diambil
    missionStore.fetchAllMissions({ status: 'available' });
  });
  </script>
  
  <style scoped>
  /* Scoped styles untuk MissionsPublic.vue */
  
  .missions-public-page {
    padding: var(--spacing-xl) var(--spacing-md);
    max-width: 1200px;
    margin: 0 auto;
  }
  
  /* --- Public Missions Hero Section --- */
  .public-missions-hero {
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
  
  /* --- Mission List Section --- */
  .mission-list-section {
    position: relative; /* Untuk AlertMessage jika di-posisi-kan absolut */
  }
  
  .mission-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Responsif, min 300px per kolom */
    gap: var(--spacing-lg); /* Jarak antar kartu misi */
    margin-top: var(--spacing-lg);
  }
  
  .no-missions {
    text-align: center;
    padding: var(--spacing-xl);
    background-color: rgba(26, 26, 46, 0.7);
    border: 1px dashed var(--color-border-card);
    border-radius: var(--border-radius-md);
    color: var(--color-text-muted);
    font-size: 1.1em;
  }
  
  .no-missions .highlight-link {
      color: var(--color-primary-accent);
      font-weight: bold;
      text-decoration: none;
      transition: color 0.3s ease;
  }
  .no-missions .highlight-link:hover {
      color: #fff;
      text-decoration: underline;
  }
  
  /* Penyesuaian tombol di MissionCard untuk public view */
  .secondary-action-button {
    background-color: transparent;
    border: 2px solid var(--color-secondary-accent);
    color: var(--color-secondary-accent);
    box-shadow: 0 0 10px rgba(15, 52, 96, 0.5);
  }
  .secondary-action-button:hover {
    background-color: var(--color-secondary-accent);
    color: var(--color-text-light);
    box-shadow: 0 0 15px rgba(15, 52, 96, 0.8);
  }
  
  /* Alert Message Styling */
  .mission-error-alert {
    margin: var(--spacing-md) auto; /* Pusatkan alert */
    max-width: 500px; /* Batasi lebar alert */
    position: relative; /* Agar tidak mengganggu flow grid */
    z-index: 10;
  }
  
  /* --- Responsiveness --- */
  @media (max-width: 768px) {
    .page-title {
      font-size: 2.5em;
    }
    .page-subtitle {
      font-size: 1em;
    }
    .mission-grid {
      grid-template-columns: 1fr; /* Kolom tunggal di mobile */
    }
  }
  
  @media (max-width: 480px) {
    .page-title {
      font-size: 2em;
    }
    .public-missions-hero {
      padding: var(--spacing-md);
    }
    .mission-list-section {
      padding: var(--spacing-md);
    }
  }
  </style>