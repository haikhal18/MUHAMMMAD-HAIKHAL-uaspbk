<template>
  <div class="ninja-active-missions-page">
    <section class="page-hero">
      <h1 class="page-title">Misi Aktif</h1>
      <p class="page-subtitle">Operasi siber yang sedang Anda kerjakan.</p>
    </section>

    <section class="mission-list-section">
      <LoadingSpinner v-if="missionStore.loading" text="Memuat misi aktif Anda..." />
      <AlertMessage
        v-if="missionStore.error && !missionStore.loading"
        v-model:isVisible="showErrorAlert"
        type="error"
        :message="missionStore.error"
        :dismissible="true"
        @dismissed="missionStore.error = null"
      />

      <div v-if="!missionStore.loading && activeMissions.length" class="mission-grid">
        <MissionCard
          v-for="mission in activeMissions"
          :key="mission.id"
          :mission="mission"
        >
          <template #actions>
            <BaseButton
              variant="secondary"
              text="Lihat / Update Progres"
              @click="viewMissionDetail(mission.id)"
            />
            <BaseButton
              variant="primary"
              text="Tandai Selesai"
              @click="confirmCompleteMission(mission.id, mission.title)"
              :disabled="isUpdatingStatus"
            />
          </template>
        </MissionCard>
      </div>

      <div v-else-if="!missionStore.loading" class="no-missions">
        <p>Anda belum memiliki misi aktif saat ini.</p>
        <p>
          Jelajahi
          <router-link to="/ninja/missions/available" class="highlight-link">
            Misi Tersedia
          </router-link>
          untuk memulai operasi baru!
        </p>
      </div>
    </section>

    <!-- Modal Konfirmasi Penyelesaian Misi -->
    <ModalDialog
      v-model:isVisible="showCompleteConfirmModal"
      title="Tandai Misi Selesai"
      max-width="450px"
      :disableClose="isUpdatingStatus"
    >
      <p>Anda yakin ingin menandai misi <strong>"{{ missionToUpdateStatus.title }}"</strong> sebagai selesai?</p>
      <p>Misi ini akan menunggu verifikasi dari Klien.</p>
      <template #footer>
        <BaseButton variant="outline" text="Tidak" @click="cancelStatusUpdate" :disabled="isUpdatingStatus" />
        <BaseButton variant="primary" text="Ya, Misi Selesai" @click="executeCompleteMission" :loading="isUpdatingStatus" />
      </template>
    </ModalDialog>
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
import ModalDialog from '@/components/ui/ModalDialog.vue';

const authStore = useAuthStore();
const missionStore = useMissionStore();
const router = useRouter();

const showErrorAlert = ref(false);

// Modal & Status
const showCompleteConfirmModal = ref(false);
const missionToUpdateStatus = ref({ id: null, title: '' });
const isUpdatingStatus = ref(false);

// ✅ Mendukung ID string seperti "MID-123"
const activeMissions = computed(() => {
  if (!authStore.user?.id) return [];
  return missionStore.missions
    .filter(mission =>
      String(mission.assignedNinjaId) === String(authStore.user.id) &&
      mission.status === 'assigned'
    )
    .sort((a, b) => String(b.id).localeCompare(String(a.id)));
});

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

onMounted(() => {
  if (authStore.isNinja && authStore.user?.id) {
    missionStore.fetchAllMissions();
  } else {
    router.push('/login');
  }
});

// ✅ Router dengan ID string
const viewMissionDetail = (missionId) => {
  router.push(`/ninja/missions/${String(missionId)}`);
};

const confirmCompleteMission = (id, title) => {
  missionToUpdateStatus.value = { id: String(id), title };
  showCompleteConfirmModal.value = true;
};

const cancelStatusUpdate = () => {
  showCompleteConfirmModal.value = false;
  missionToUpdateStatus.value = { id: null, title: '' };
};

const executeCompleteMission = async () => {
  isUpdatingStatus.value = true;
  try {
    const success = await missionStore.updateMissionStatus(
      String(missionToUpdateStatus.value.id),
      'completed'
    );
    if (success) {
      alert(`Misi "${missionToUpdateStatus.value.title}" ditandai selesai! Menunggu verifikasi Klien.`);
      missionStore.fetchAllMissions();
    }
  } catch (error) {
    console.error('Error completing mission:', error);
  } finally {
    isUpdatingStatus.value = false;
    showCompleteConfirmModal.value = false;
    missionToUpdateStatus.value = { id: null, title: '' };
  }
};
</script>

  
  <style scoped>
  /* Scoped styles untuk NinjaActiveMissions.vue */
  
  .ninja-active-missions-page {
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
  
  /* Warning text in modal */
  .warning-text {
    color: var(--color-primary-accent);
    font-weight: bold;
    margin-top: var(--spacing-md);
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