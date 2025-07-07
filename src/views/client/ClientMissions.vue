<template>
  <div class="client-missions-page">
    <section class="page-hero">
      <h1 class="page-title">Misi Saya</h1>
      <p class="page-subtitle">Kelola semua operasi siber yang Anda posting.</p>
    </section>

    <section class="mission-filter-sort-section">
      <div class="filter-controls">
        <BaseInput
          label="Filter Status"
          type="select"
          v-model="filterStatus"
          :options="statusOptions"
          @change="applyFilters"
        />
        <BaseInput
          label="Cari Misi"
          type="text"
          v-model="searchQuery"
          placeholder="Cari berdasarkan judul atau deskripsi..."
          @input="debounceSearch"
        />
      </div>
    </section>

    <section class="mission-list-section">
      <LoadingSpinner v-if="missionStore.loading" text="Memuat daftar misi Anda..." />
      <AlertMessage
        v-if="missionStore.error && !missionStore.loading"
        v-model:isVisible="showErrorAlert"
        type="error"
        :message="missionStore.error"
        :dismissible="true"
        @dismissed="missionStore.error = null"
      />

      <div v-if="!missionStore.loading && filteredMissions.length" class="mission-grid">
        <MissionCard
          v-for="mission in filteredMissions"
          :key="mission.id"
          :mission="mission"
        >
          <template #actions>
            <BaseButton
              v-if="mission.status === 'available'"
              variant="secondary"
              text="Edit Misi"
              @click="editMission(mission.id)"
            />
            <BaseButton
              v-if="mission.status === 'available' && mission.applicants?.length > 0" variant="primary"
              text="Kelola Pelamar"
              @click="manageMission(mission.id)"
            />
            <BaseButton
              v-else-if="mission.status === 'available' && mission.applicants?.length === 0" variant="outline"
              text="Menunggu Pelamar"
              :disabled="true"
            />
            <BaseButton
              v-else-if="mission.status === 'assigned'"
              variant="secondary"
              text="Lihat Progres"
              @click="manageMission(mission.id)"
            />
            <BaseButton
              v-else-if="mission.status === 'completed'"
              variant="secondary"
              text="Tinjau Misi"
              @click="manageMission(mission.id)"
            />
            <BaseButton
              v-else-if="mission.status === 'cancelled'"
              variant="outline"
              text="Dibatalkan"
              :disabled="true"
            />
            <BaseButton
              variant="danger"
              text="Hapus"
              @click="confirmDelete(mission.id, mission.title)"
              :disabled="missionStore.loading || mission.status === 'assigned' || mission.status === 'completed'" />
            <router-link :to="`/client/missions/${mission.id}`" class="base-button view-detail-button">
                Lihat Detail
            </router-link>
          </template>
        </MissionCard>
      </div>
      <div v-else-if="!missionStore.loading" class="no-missions">
        <p>Anda belum memposting misi apapun yang sesuai dengan filter saat ini.</p>
        <p>Mulai <router-link to="/client/missions/new" class="highlight-link">Posting Misi Baru</router-link> sekarang!</p>
      </div>
    </section>

    <ModalDialog
      v-model:isVisible="showDeleteConfirmModal"
      title="Konfirmasi Penghapusan Misi"
      max-width="450px"
      :disableClose="isDeletingMission"
    >
      <p>Anda yakin ingin menghapus misi <strong>"{{ missionToDelete.title }}"</strong>?</p>
      <p class="warning-text">Tindakan ini tidak dapat dibatalkan.</p>
      <template #footer>
        <BaseButton variant="outline" text="Batal" @click="cancelDelete" :disabled="isDeletingMission" />
        <BaseButton variant="danger" text="Hapus Sekarang" @click="executeDelete" :loading="isDeletingMission" />
      </template>
    </ModalDialog>
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
import BaseInput from '@/components/common/BaseInput.vue';
import ModalDialog from '@/components/ui/ModalDialog.vue';
import { nextTick } from 'vue';

const authStore = useAuthStore();
const missionStore = useMissionStore();
const router = useRouter();

const showErrorAlert = ref(false);
const filterStatus = ref('all');
const searchQuery = ref('');
let searchTimeout = null;

const showDeleteConfirmModal = ref(false);
const missionToDelete = ref({ id: null, title: '' });
const isDeletingMission = ref(false);

const statusOptions = [
  { value: 'all', label: 'Semua Status' },
  { value: 'available', label: 'Tersedia' },
  { value: 'assigned', label: 'Aktif' },
  { value: 'completed', label: 'Selesai' },
  { value: 'cancelled', label: 'Dibatalkan' },
];

const clientMissions = computed(() => {
  if (!authStore.user?.id) return [];
  // Mengonversi kedua sisi perbandingan ke NUMBER
  // Ini akan memastikan perbandingan angka, tidak peduli apakah ID awalnya string atau number
  // sesuai dengan konsistensi ID integer di db.json
  return missionStore.missions.filter(mission => 
    Number(mission.clientId) === Number(authStore.user.id)
  );
});

const filteredMissions = computed(() => {
  let missions = clientMissions.value;

  if (filterStatus.value !== 'all') {
    missions = missions.filter(mission => mission.status === filterStatus.value);
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.trim().toLowerCase();
    missions = missions.filter(
      mission =>
        mission.title.toLowerCase().includes(query) ||
        mission.description.toLowerCase().includes(query)
    );
  }

  // Mengurutkan misi (yang terbaru di atas)
  // Penting: Mengonversi ID ke Number untuk sorting numerik jika ID mungkin string di awal
  return missions.sort((a, b) => Number(b.id) - Number(a.id));
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
  if (authStore.isClient && authStore.user?.id) {
    missionStore.fetchAllMissions(); // Mengambil semua misi, nanti difilter di computed property
  } else {
    router.push('/login'); // Redirect jika tidak berhak
  }
});

const applyFilters = () => {
  console.log('Applying filter:', filterStatus.value);
  // `filteredMissions` computed property akan otomatis re-evaluate
};

const debounceSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    console.log('Searching for:', searchQuery.value);
    // `filteredMissions` computed property akan otomatis re-evaluate
  }, 300);
};

const editMission = (missionId) => {
  router.push(`/client/missions/${missionId}/edit`);
};

const manageMission = (missionId) => {
  router.push(`/client/missions/${missionId}`);
};

const confirmDelete = (id, title) => {
  missionToDelete.value = { id, title };
  showDeleteConfirmModal.value = true;
};

const cancelDelete = () => {
  showDeleteConfirmModal.value = false;
  missionToDelete.value = { id: null, title: '' };
};

const executeDelete = async () => {
  isDeletingMission.value = true;
  try {
    const success = await missionStore.deleteMission(Number(missionToDelete.value.id));
    if (success) {
      console.log('Misi berhasil dihapus!');
      missionStore.fetchAllMissions(); // Refresh data di halaman setelah hapus
    } else {
      console.log('Gagal menghapus misi.');
    }
  } catch (error) {
    console.error('Error during delete execution:', error);
  } finally {
    isDeletingMission.value = false;
    showDeleteConfirmModal.value = false;
    missionToDelete.value = { id: null, title: '' };
  }
};
</script>

<style scoped>
/* Scoped styles untuk ClientMissions.vue */

.client-missions-page {
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

/* --- Filter & Sort Section --- */
.mission-filter-sort-section {
  background-color: var(--color-background-card);
  border: 1px solid var(--color-border-card);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

.filter-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

/* --- Mission List Section --- */
.mission-list-section {
  position: relative;
}

.mission-grid {
  /* Tampilan Vertikal, Satu per Satu */
  display: flex; /* Menggunakan flexbox */
  flex-direction: column; /* Menata item dalam satu kolom */
  gap: var(--spacing-md); /* Jarak antar kartu misi (sesuaikan jika perlu) */
  margin-top: var(--spacing-lg);
  
  /* Hapus properti grid yang lama: */
  /* grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); */
  /* flex-wrap: unset; */
  /* overflow-x: unset; */
  /* -webkit-overflow-scrolling: unset; */
  /* padding-bottom: unset; */
}

/* MissionCard di dalamnya akan mengambil lebar penuh kontainernya */
.mission-grid .mission-card {
    width: 100%; /* Memastikan setiap kartu mengambil lebar penuh */
    /* flex-shrink: unset; */ /* Tidak relevan di flex-direction: column */
}

/* Gaya khusus untuk TOMBOL di dalam card-footer MissionCard */
/* Ini akan menimpa gaya default .base-button untuk tombol ini */
/* PERBAIKAN: Tambahkan min-width untuk menyeragamkan ukuran */
.mission-grid .mission-card .base-button {
    padding: 5px 10px; /* Perkecil padding tombol */
    font-size: 0.85em; /* Perkecil ukuran font */
    min-width: 100px; /* PENTING: Atur lebar minimum yang seragam (sesuaikan nilai ini) */
    text-align: center; /* Pastikan teks di tengah */
    justify-content: center; /* Untuk flex items, pusatkan konten */
    box-sizing: border-box; /* Agar padding dan border tidak menambah lebar total */
}

/* Khusus untuk router-link yang juga berperan sebagai tombol di slot */
.mission-grid .mission-card .view-detail-button {
    min-width: 100px; /* Pastikan juga router-link Lihat Detail punya min-width yang sama */
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
  .filter-controls {
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
  .mission-filter-sort-section, .mission-list-section {
    padding: var(--spacing-md);
  }
}
</style>