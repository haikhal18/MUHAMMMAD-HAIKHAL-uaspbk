<template>
    <div class="ninja-completed-missions-page">
      <section class="page-hero">
        <h1 class="page-title">Misi Selesai</h1>
        <p class="page-subtitle">Riwayat operasi siber yang telah Anda tuntaskan.</p>
      </section>
  
      <section class="mission-list-section">
        <LoadingSpinner v-if="missionStore.loading" text="Memuat misi yang telah selesai..." />
        <AlertMessage
          v-if="missionStore.error && !missionStore.loading"
          v-model:isVisible="showErrorAlert"
          type="error"
          :message="missionStore.error"
          :dismissible="true"
          @dismissed="missionStore.error = null"
        />
  
        <div v-if="!missionStore.loading && completedMissions.length" class="mission-grid">
          <MissionCard
            v-for="mission in completedMissions"
            :key="mission.id"
            :mission="mission"
          >
            <template #actions>
              <BaseButton
                variant="primary"
                text="Lihat Detail Misi"
                @click="viewMissionDetail(mission.id)"
              />
              </template>
          </MissionCard>
        </div>
        <div v-else-if="!missionStore.loading" class="no-missions">
          <p>Anda belum menyelesaikan misi apapun.</p>
          <p>Ayo jelajahi <router-link to="/ninja/missions/available" class="highlight-link">Misi Tersedia</router-link> dan mulai operasi baru!</p>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useMissionStore } from '@/stores/mission';

import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import AlertMessage from '@/components/common/AlertMessage.vue';
import MissionCard from '@/components/ui/MissionCard.vue';
import BaseButton from '@/components/common/BaseButton.vue';

const authStore = useAuthStore();
const missionStore = useMissionStore();
const router = useRouter();

const showErrorAlert = ref(false);

// ✅ Misi selesai yang ditugaskan ke ninja ini (ID bisa string atau integer)
const completedMissions = computed(() => {
  if (!authStore.user?.id) return [];

  return missionStore.missions
    .filter(mission =>
      String(mission.assignedNinjaId) === String(authStore.user.id) &&
      mission.status === 'completed' // ✅ pastikan status misi sesuai
    )
    .sort((a, b) => Number(b.id) - Number(a.id)); // ✅ urut berdasarkan angka ID, bukan string
});

// Error watcher
watch(() => missionStore.error, (newError) => {
  if (newError) {
    showErrorAlert.value = true;
    nextTick(() => {
      setTimeout(() => showErrorAlert.value = false, 5000);
    });
  } else {
    showErrorAlert.value = false;
  }
});

// Saat halaman dimuat
onMounted(() => {
  if (authStore.isNinja && authStore.user?.id) {
    missionStore.fetchAllMissions();
  } else {
    router.push('/login');
  }
});

// Navigasi ke detail misi
const viewMissionDetail = (missionId) => {
  router.push(`/ninja/missions/${missionId}`);
};
</script>

  <style scoped>
  /* Scoped styles untuk NinjaCompletedMissions.vue */
  
  .ninja-completed-missions-page {
    padding: var(--spacing-xl) var(--spacing-md);
    max-width: 1200px;
    margin: 0 auto;
  }
  
  /* --- Page Hero Section --- */
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
  
  /* --- Mission List Section --- */
  .mission-list-section {
    position: relative;
  }
  
  .mission-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-lg);
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
  
  /* Responsive adjustments */
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
    .page-hero {
      padding: var(--spacing-md);
    }
    .mission-list-section {
      padding: var(--spacing-md);
    }
  }
  </style>