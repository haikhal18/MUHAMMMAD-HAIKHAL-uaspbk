<template>
  <div class="ninja-dashboard-page">
    <section class="dashboard-hero">
      <h1 class="dashboard-title">Halo, <span class="ninja-name">{{ authStore.user?.username || 'Cyber Ninja' }}</span>!</h1>
      <p class="dashboard-subtitle">Selamat datang di pusat operasi rahasia Anda.</p>
    </section>

    <section class="dashboard-stats-grid">
      <div class="stat-card stat-card-assigned">
        <div class="stat-icon"><i class="fas fa-running"></i></div>
        <div class="stat-content">
          <h3 class="stat-value">{{ assignedMissionsCount }}</h3>
          <p class="stat-label">Misi Aktif</p>
        </div>
      </div>

      <div class="stat-card stat-card-completed">
        <div class="stat-icon"><i class="fas fa-award"></i></div>
        <div class="stat-content">
          <h3 class="stat-value">{{ completedMissionsCount }}</h3>
          <p class="stat-label">Misi Selesai</p>
        </div>
      </div>

      <div class="stat-card stat-card-available">
        <div class="stat-icon"><i class="fas fa-clipboard-list"></i></div>
        <div class="stat-content">
          <h3 class="stat-value">{{ availableMissionsCount }}</h3>
          <p class="stat-label">Misi Tersedia</p>
        </div>
      </div>

      <div class="stat-card stat-card-rating" v-if="authStore.user?.rating">
        <div class="stat-icon"><i class="fas fa-star"></i></div>
        <div class="stat-content">
          <h3 class="stat-value">{{ authStore.user.rating.toFixed(1) }}</h3>
          <p class="stat-label">Peringkat Agen</p>
        </div>
      </div>
    </section>

    <section class="recent-missions-section">
      <h2 class="section-heading"><i class="fas fa-history"></i> Misi Aktif Terkini</h2>
      <LoadingSpinner v-if="missionStore.loading" text="Memuat misi aktif..." />
      <AlertMessage
        v-if="missionStore.error && !missionStore.loading"
        v-model:isVisible="showErrorAlert"
        type="error"
        :message="missionStore.error"
        :dismissible="true"
        @dismissed="missionStore.error = null"
      />

      <div v-if="!missionStore.loading && recentActiveMissions.length" class="recent-missions-list">
        <MissionCard
          v-for="mission in recentActiveMissions"
          :key="mission.id"
          :mission="mission"
        >
          <template #actions>
            <BaseButton
              v-if="mission.status === 'assigned'"
              variant="secondary"
              text="Update Progres"
              @click="updateMissionProgress(mission.id)"
            />
            <BaseButton
              v-if="mission.status === 'assigned'"
              variant="primary"
              text="Misi Selesai"
              @click="confirmCompleteMission(mission.id, mission.title)"
              :disabled="isUpdatingStatus"
            />
          </template>
        </MissionCard>
      </div>
      <div v-else-if="!missionStore.loading" class="no-recent-missions">
        <p>Anda belum memiliki misi aktif terkini.</p>
        <p>Jelajahi <router-link to="/ninja/missions/available" class="highlight-link">Misi Tersedia</router-link> untuk memulai!</p>
      </div>
    </section>

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
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router'; // PERBAIKAN: Melengkapi import useRouter
import { useAuthStore } from '@/stores/auth';
import { useMissionStore } from '@/stores/mission';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import AlertMessage from '@/components/common/AlertMessage.vue';
import MissionCard from '@/components/ui/MissionCard.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import ModalDialog from '@/components/ui/ModalDialog.vue';
import { nextTick } from 'vue'; // Ini sudah benar, saya hanya memastikan

const authStore = useAuthStore();
const missionStore = useMissionStore();
const router = useRouter();

const showErrorAlert = ref(false);

// State untuk modal perubahan status misi
const showCompleteConfirmModal = ref(false);
const missionToUpdateStatus = ref({ id: null, title: '' });
const isUpdatingStatus = ref(false);

// Computed properties untuk statistik misi ninja
const ninjaMissions = computed(() => {
  if (!authStore.user?.id) return [];
  // Misi yang ditugaskan kepada ninja ini atau yang dia lamar dan masih tersedia (opsional)
  return missionStore.missions.filter(mission =>
    Number(mission.assignedNinjaId) === Number(authStore.user.id) || // Konversi assignedNinjaId
    (mission.status === 'available' && mission.applicants.map(Number).includes(Number(authStore.user.id))) // Konversi applicants
  );
});

const assignedMissionsCount = computed(() =>
  ninjaMissions.value.filter(m => Number(m.assignedNinjaId) === Number(authStore.user?.id) && m.status === 'assigned').length
);
const completedMissionsCount = computed(() =>
  ninjaMissions.value.filter(m => Number(m.assignedNinjaId) === Number(authStore.user?.id) && m.status === 'completed').length
);
// Mengambil jumlah misi yang *tersedia* untuk dilamar oleh ninja ini
const availableMissionsCount = computed(() =>
  missionStore.availableMissions.length // Menggunakan getter dari missionStore
);

// Ambil 3 misi aktif terkini yang ditugaskan kepada ninja ini
const recentActiveMissions = computed(() => {
  return [...ninjaMissions.value]
    .filter(m => Number(m.assignedNinjaId) === Number(authStore.user?.id) && m.status === 'assigned') // Konversi di filter
    .sort((a, b) => Number(b.id) - Number(a.id)) // Konversi di sorting
    .slice(0, 3);
});

// Watcher untuk error dari missionStore
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
  // Hanya fetch misi jika user adalah ninja dan sudah login
  if (authStore.isNinja && authStore.user?.id) {
    missionStore.fetchAllMissions(); // Ambil semua misi untuk dihitung di computed properties
  } else {
    router.push('/login'); // Redirect jika tidak berhak
  }
});

// --- Fungsi Aksi Ninja pada Misi ---
const updateMissionProgress = (missionId) => {
  // Ini bisa mengarahkan ke halaman detail misi atau modal untuk update progres
  console.log('Update progres misi:', missionId);
  router.push(`/ninja/missions/${missionId}`); // Contoh: arahkan ke detail misi
  // alert(`Fitur Update Progres Misi ${missionId} belum diimplementasikan.`);
};

const confirmCompleteMission = (id, title) => {
  missionToUpdateStatus.value = { id, title };
  showCompleteConfirmModal.value = true;
};

const cancelStatusUpdate = () => {
  showCompleteConfirmModal.value = false;
  missionToUpdateStatus.value = { id: null, title: '' };
};

const executeCompleteMission = async () => {
  isUpdatingStatus.value = true;
  try {
    // Pastikan ID misi yang dikirim ke store adalah Number
    const success = await missionStore.updateMissionStatus(Number(missionToUpdateStatus.value.id), 'completed');
    if (success) {
      alert(`Misi "${missionToUpdateStatus.value.title}" ditandai selesai! Menunggu verifikasi Klien.`);
      // Refresh data di dashboard setelah status berubah
      missionStore.fetchAllMissions(); // Ambil ulang semua misi untuk update statistik
    }
  } catch (error) {
    console.error('Error completing mission:', error);
  } finally {
    isUpdatingStatus.value = false;
    showCompleteConfirmModal.value = false;
  }
};
</script>

<style scoped>
/* Scoped styles untuk NinjaDashboard.vue */

.ninja-dashboard-page {
  padding: var(--spacing-xl) var(--spacing-md);
  max-width: 1200px;
  margin: 0 auto;
}

/* --- Dashboard Hero Section --- */
.dashboard-hero {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background-color: var(--color-background-card);
  border-radius: var(--border-radius-md);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  border: 1px solid var(--color-border-card);
}

.dashboard-title {
  font-family: var(--font-heading, var(--font-primary));
  font-size: 2.8em;
  color: var(--color-text-light);
  margin-bottom: var(--spacing-sm);
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}

.ninja-name {
  color: var(--color-primary-accent);
  text-shadow: 0 0 10px rgba(233, 69, 96, 0.7);
}

.dashboard-subtitle {
  font-size: 1.2em;
  color: var(--color-text-muted);
  font-style: italic;
}

/* --- Dashboard Stats Grid --- */
.dashboard-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  background-color: var(--color-background-card);
  border: 1px solid var(--color-border-card);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
  border-color: var(--color-primary-accent);
}

.stat-icon {
  font-size: 2.5em;
  color: var(--color-secondary-accent);
  text-shadow: 0 0 8px rgba(15, 52, 96, 0.5);
}

.stat-content {
  text-align: left;
}

.stat-value {
  font-family: var(--font-heading, var(--font-primary));
  font-size: 2em;
  color: var(--color-primary-accent);
  margin: 0;
  line-height: 1;
}

.stat-label {
  font-size: 0.9em;
  color: var(--color-text-muted);
  margin: 0;
}

/* Warna spesifik untuk kartu statistik */
.stat-card-assigned .stat-icon { color: #FFA500; } /* Orange */
.stat-card-assigned .stat-value { color: #FFA500; }
.stat-card-completed .stat-icon { color: #4CAF50; } /* Green */
.stat-card-completed .stat-value { color: #4CAF50; }
.stat-card-available .stat-icon { color: #00BFFF; } /* Deep Sky Blue */
.stat-card-available .stat-value { color: #00BFFF; }
.stat-card-rating .stat-icon { color: #FFD700; } /* Gold */
.stat-card-rating .stat-value { color: #FFD700; }


/* --- Recent Missions Section --- */
.recent-missions-section {
  background-color: var(--color-background-card);
  border: 1px solid var(--color-border-card);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-xl);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  position: relative; /* Untuk AlertMessage */
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

.recent-missions-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.no-recent-missions {
  text-align: center;
  padding: var(--spacing-md);
  color: var(--color-text-muted);
  font-size: 1.1em;
}

.no-recent-missions .highlight-link {
  color: var(--color-primary-accent);
  font-weight: bold;
  text-decoration: none;
  transition: color 0.3s ease;
}
.no-recent-missions .highlight-link:hover {
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
@media (max-width: 992px) {
  .dashboard-title {
    font-size: 2.2em;
  }
  .dashboard-subtitle {
    font-size: 1em;
  }
  .dashboard-stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
  .stat-value {
    font-size: 1.8em;
  }
}

@media (max-width: 768px) {
  .dashboard-title {
    font-size: 1.8em;
  }
  .dashboard-hero {
    padding: var(--spacing-md);
  }
  .dashboard-stats-grid {
    grid-template-columns: 1fr; /* Satu kolom di mobile */
  }
  .stat-card {
    justify-content: center; /* Pusatkan konten kartu di mobile */
  }
  .stat-content {
    text-align: center;
  }
  .section-heading {
    font-size: 1.6em;
  }
}
</style>