<template>
  <div class="client-dashboard-page">
    <section class="dashboard-hero">
      <h1 class="dashboard-title">Halo, <span class="client-name">{{ authStore.user?.username || 'Klien' }}</span>!</h1>
      <p class="dashboard-subtitle">Selamat datang di pusat komando misi Anda.</p>
    </section>

    <section class="dashboard-stats-grid">
      <div class="stat-card">
        <div class="stat-icon"><i class="fas fa-tasks"></i></div>
        <div class="stat-content">
          <h3 class="stat-value">{{ totalMissionsPosted }}</h3>
          <p class="stat-label">Total Misi Diposting</p>
        </div>
      </div>

      <div class="stat-card stat-card-active">
        <div class="stat-icon"><i class="fas fa-hourglass-half"></i></div>
        <div class="stat-content">
          <h3 class="stat-value">{{ activeMissionsCount }}</h3>
          <p class="stat-label">Misi Aktif</p>
        </div>
      </div>

      <div class="stat-card stat-card-completed">
        <div class="stat-icon"><i class="fas fa-check-double"></i></div>
        <div class="stat-content">
          <h3 class="stat-value">{{ completedMissionsCount }}</h3>
          <p class="stat-label">Misi Selesai</p>
        </div>
      </div>

      <div class="stat-card stat-card-available">
        <div class="stat-icon"><i class="fas fa-clipboard-list"></i></div>
        <div class="stat-content">
          <h3 class="stat-value">{{ availableMissionsCount }}</h3>
          <p class="stat-label">Misi Menunggu Penugasan</p>
        </div>
      </div>
    </section>

    <section class="recent-activity-section">
      <h2 class="section-heading"><i class="fas fa-history"></i> Aktivitas Misi Terkini</h2>
      <LoadingSpinner v-if="missionStore.loading" text="Memuat aktivitas misi..." />
      <AlertMessage
        v-if="missionStore.error && !missionStore.loading"
        v-model:isVisible="showErrorAlert"
        type="error"
        :message="missionStore.error"
        :dismissible="true"
        @dismissed="missionStore.error = null"
      />

      <div v-if="!missionStore.loading && recentMissions.length" class="recent-missions-list">
        <MissionCard
          v-for="mission in recentMissions"
          :key="mission.id"
          :mission="mission"
        >
          <template #actions>
            <BaseButton
              v-if="mission.status === 'available' && mission.applicants.length > 0"
              variant="primary"
              text="Kelola Pelamar"
              @click="manageApplicants(mission.id)"
            />
            <BaseButton
              v-else-if="mission.status === 'available'"
              variant="outline"
              text="Menunggu Pelamar"
              :disabled="true"
            />
            <BaseButton
              v-else-if="mission.status === 'assigned'"
              variant="secondary"
              text="Lihat Progres"
              @click="viewProgress(mission.id)"
            />
             <BaseButton
              v-else-if="mission.status === 'completed'"
              variant="secondary"
              text="Tinjau Misi"
              @click="reviewMission(mission.id)"
            />
          </template>
        </MissionCard>
      </div>
      <div v-else-if="!missionStore.loading" class="no-recent-activity">
        <p>Belum ada aktivitas misi terkini.</p>
        <p>Mulai <router-link to="/client/missions/new" class="highlight-link">Posting Misi Baru</router-link> sekarang!</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useMissionStore } from '@/stores/mission';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import AlertMessage from '@/components/common/AlertMessage.vue';
import MissionCard from '@/components/ui/MissionCard.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import { nextTick } from 'vue';

const authStore = useAuthStore();
const missionStore = useMissionStore();
const router = useRouter();

const showErrorAlert = ref(false);

// Computed properties untuk statistik misi klien
const clientMissions = computed(() => {
  if (!authStore.user?.id) return [];
  // Filter misi yang diposting oleh klien yang sedang login
  // PERBAIKAN: Mengonversi kedua sisi perbandingan ke NUMBER
  // Ini akan memastikan perbandingan angka, tidak peduli apakah ID awalnya string atau number
  // sesuai dengan konsistensi ID integer di db.json
  return missionStore.missions.filter(mission => 
    Number(mission.clientId) === Number(authStore.user.id)
  );
});

const totalMissionsPosted = computed(() => clientMissions.value.length);
const activeMissionsCount = computed(() => clientMissions.value.filter(m => m.status === 'assigned').length);
const completedMissionsCount = computed(() => clientMissions.value.filter(m => m.status === 'completed').length);
const availableMissionsCount = computed(() => clientMissions.value.filter(m => m.status === 'available').length);

// Ambil 3 misi terkini yang diposting oleh klien
const recentMissions = computed(() => {
  // Urutkan berdasarkan ID (asumsi ID lebih tinggi = lebih baru) dan ambil 3 teratas
  // Penting: Mengonversi ID ke Number untuk sorting numerik jika ID mungkin string di awal
  return [...clientMissions.value]
    .sort((a, b) => Number(b.id) - Number(a.id))
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
  // Hanya fetch misi jika user adalah klien dan sudah login
  if (authStore.isClient && authStore.user?.id) {
    // Kita panggil fetchAllMissions tanpa filter spesifik di sini
    // karena kita akan memfilter di `clientMissions` computed property
    missionStore.fetchAllMissions();
  } else {
    // Jika tidak login sebagai klien, redirect atau tampilkan pesan
    router.push('/login'); // Redirect ke login jika tidak berhak
  }
});

// Aksi untuk tombol di kartu misi
const manageApplicants = (missionId) => {
  router.push(`/client/missions/${missionId}`); // Arahkan ke halaman detail misi untuk kelola pelamar
};

const viewProgress = (missionId) => {
  router.push(`/client/missions/${missionId}`); // Arahkan ke halaman detail misi untuk lihat progres
};

const reviewMission = (missionId) => {
  router.push(`/client/missions/${missionId}`); // Arahkan ke halaman detail misi untuk review
};
</script>

<style scoped>
/* Scoped styles untuk ClientDashboard.vue */

.client-dashboard-page {
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

.client-name {
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
.stat-card-active .stat-icon { color: #FFA500; } /* Orange */
.stat-card-active .stat-value { color: #FFA500; }
.stat-card-completed .stat-icon { color: #4CAF50; } /* Green */
.stat-card-completed .stat-value { color: #4CAF50; }
.stat-card-available .stat-icon { color: #00BFFF; } /* Deep Sky Blue */
.stat-card-available .stat-value { color: #00BFFF; }

/* --- Recent Activity Section --- */
.recent-activity-section {
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

.no-recent-activity {
  text-align: center;
  padding: var(--spacing-md);
  color: var(--color-text-muted);
  font-size: 1.1em;
}

.no-recent-activity .highlight-link {
  color: var(--color-primary-accent);
  font-weight: bold;
  text-decoration: none;
  transition: color 0.3s ease;
}
.no-recent-activity .highlight-link:hover {
  color: #fff;
  text-decoration: underline;
}

/* Responsiveness */
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