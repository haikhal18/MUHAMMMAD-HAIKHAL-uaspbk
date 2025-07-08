<template>
    <div class="ninja-available-missions-page">
      <section class="page-hero">
        <h1 class="page-title">Misi Tersedia</h1>
        <p class="page-subtitle">Jelajahi operasi siber yang menunggu keahlian Anda.</p>
      </section>
  
      <section class="mission-filter-sort-section">
        <div class="filter-controls">
          <BaseInput
            label="Filter Keahlian"
            type="select"
            v-model="filterSkill"
            :options="skillOptions"
            @change="applyFilters"
          />
          <BaseInput
            label="Cari Misi"
            type="text"
            v-model="searchQuery"
            placeholder="Cari berdasarkan judul, deskripsi, atau keahlian..."
            @input="debounceSearch"
          />
        </div>
      </section>
  
      <section class="mission-list-section">
        <LoadingSpinner v-if="missionStore.loading" text="Memuat misi yang tersedia..." />
        <AlertMessage
          v-if="missionStore.error && !missionStore.loading"
          v-model:isVisible="showErrorAlert"
          type="error"
          :message="missionStore.error"
          :dismissible="true"
          @dismissed="missionStore.error = null"
        />
  
        <div v-if="!missionStore.loading && filteredAvailableMissions.length" class="mission-grid">
          <MissionCard
            v-for="mission in filteredAvailableMissions"
            :key="mission.id"
            :mission="mission"
          >
            <template #actions>
              <BaseButton
                v-if="!hasApplied(mission.id)"
                variant="primary"
                text="Lamar Misi Ini"
                :loading="isApplying[mission.id]"
                :disabled="isApplying[mission.id]"
                @click="confirmApply(mission.id, mission.title)"
              />
              <BaseButton
                v-else
                variant="outline"
                text="Sudah Dilamar"
                :disabled="true"
              />
            </template>
          </MissionCard>
        </div>
        <div v-else-if="!missionStore.loading" class="no-missions">
          <p>Tidak ada misi tersedia yang sesuai dengan filter Anda saat ini.</p>
          <p>Tetap waspada, peluang baru akan segera muncul!</p>
        </div>
      </section>
  
      <ModalDialog
        v-model:isVisible="showApplyConfirmModal"
        title="Konfirmasi Lamaran Misi"
        max-width="450px"
        :disableClose="isApplying[missionToApply.id]"
      >
        <p>Anda yakin ingin melamar misi <strong>"{{ missionToApply.title }}"</strong>?</p>
        <p>Keahlian Anda akan diverifikasi oleh Klien.</p>
        <template #footer>
          <BaseButton variant="outline" text="Batal" @click="cancelApply" :disabled="isApplying[missionToApply.id]" />
          <BaseButton variant="primary" text="Konfirmasi Lamaran" @click="executeApply" :loading="isApplying[missionToApply.id]" />
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
import BaseInput from '@/components/common/BaseInput.vue';
import ModalDialog from '@/components/ui/ModalDialog.vue';

const authStore = useAuthStore();
const missionStore = useMissionStore();
const router = useRouter();

const showErrorAlert = ref(false);
const filterSkill = ref('all');
const searchQuery = ref('');
let searchTimeout = null;

const showApplyConfirmModal = ref(false);
const missionToApply = ref({ id: null, title: '' });
const isApplying = ref({});

const skillOptions = ref([{ value: 'all', label: 'Semua Keahlian' }]);

const availableMissionsFromStore = computed(() => missionStore.availableMissions);

// ✅ Sort dengan mengurai angka dari ID MID-123
function extractNumberFromId(id) {
  const match = String(id).match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}

const filteredAvailableMissions = computed(() => {
  let missions = availableMissionsFromStore.value;

  if (filterSkill.value !== 'all') {
    missions = missions.filter(mission =>
      mission.requiredSkills.includes(filterSkill.value)
    );
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.trim().toLowerCase();
    missions = missions.filter(
      mission =>
        mission.title.toLowerCase().includes(query) ||
        mission.description.toLowerCase().includes(query) ||
        mission.requiredSkills.some(skill => skill.toLowerCase().includes(query))
    );
  }

  return missions.sort((a, b) =>
    extractNumberFromId(b.id) - extractNumberFromId(a.id)
  );
});

// ✅ Periksa apakah user sudah melamar
const hasApplied = (missionId) => {
  const mission = missionStore.missions.find(m => String(m.id) === String(missionId));
  return mission && mission.applicants.map(String).includes(String(authStore.user?.id));
};

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

watch(availableMissionsFromStore, (newMissions) => {
  const allSkills = new Set();
  newMissions.forEach(mission => {
    mission.requiredSkills.forEach(skill => allSkills.add(skill));
  });
  skillOptions.value = [
    { value: 'all', label: 'Semua Keahlian' },
    ...Array.from(allSkills).sort().map(skill => ({ value: skill, label: skill }))
  ];
}, { immediate: true });

onMounted(() => {
  if (authStore.isNinja && authStore.user?.id) {
    missionStore.fetchAllMissions();
  } else {
    router.push('/login');
  }
});

const applyFilters = () => {
  console.log('Applying skill filter:', filterSkill.value);
};

const debounceSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    console.log('Searching for:', searchQuery.value);
  }, 300);
};

// ✅ Konfirmasi lamaran
const confirmApply = (id, title) => {
  missionToApply.value = { id: String(id), title };
  showApplyConfirmModal.value = true;
};

// ✅ Batal lamaran
const cancelApply = () => {
  showApplyConfirmModal.value = false;
  missionToApply.value = { id: null, title: '' };
};

// ✅ Eksekusi lamaran
const executeApply = async () => {
  const missionId = String(missionToApply.value.id);
  const userId = String(authStore.user.id);
  isApplying.value[missionId] = true;

  try {
    const success = await missionStore.applyForMission(missionId, userId);
    if (success) {
      alert(`Berhasil melamar misi "${missionToApply.value.title}"!`);
    } else {
      console.log('Gagal melamar misi.');
    }
  } catch (error) {
    console.error('Error during apply execution:', error);
  } finally {
    isApplying.value[missionId] = false;
    showApplyConfirmModal.value = false;
    missionToApply.value = { id: null, title: '' };
  }
};
</script>

  
  <style scoped>
  /* Scoped styles untuk NinjaAvailableMissions.vue */
  
  .ninja-available-missions-page {
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
    .filter-controls {
      grid-template-columns: 1fr; /* Kolom tunggal di mobile */
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
    .mission-filter-sort-section, .mission-list-section {
      padding: var(--spacing-md);
    }
  }
  </style>