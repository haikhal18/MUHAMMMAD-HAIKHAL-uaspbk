<template>
  <div class="client-mission-detail-page">
    <section class="page-hero">
      <h1 class="page-title">Detail Misi</h1>
      <p class="page-subtitle">Rincian lengkap operasi siber Anda.</p>
    </section>

    <LoadingSpinner v-if="missionStore.loading" text="Memuat detail misi..." />
    <AlertMessage
      v-if="missionStore.error && !missionStore.loading"
      v-model:isVisible="showErrorAlert"
      type="error"
      :message="missionStore.error"
      :dismissible="true"
      @dismissed="missionStore.error = null"
      class="mission-detail-alert"
    />

    <div v-if="!missionStore.loading && mission" class="mission-detail-card">
      <div class="detail-header">
        <h2 class="mission-title">{{ mission.title }}</h2>
        <span :class="['mission-status', `status-${mission.status}`]">{{ formatStatus(mission.status) }}</span>
      </div>

      <div class="detail-body">
        <p class="mission-description">{{ mission.description }}</p>

        <div class="detail-info-grid">
          <div class="info-item">
            <span class="info-label">Bayaran:</span>
            <span class="info-value bounty">${{ mission.bounty.toLocaleString() }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Deadline:</span>
            <span class="info-value deadline">{{ formatDate(mission.deadline) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Keahlian Dibutuhkan:</span>
            <div class="info-value skills">
              <span v-for="skill in mission.requiredSkills" :key="skill" class="skill-tag">{{ skill }}</span>
            </div>
          </div>
          <div class="info-item" v-if="mission.assignedNinjaId">
            <span class="info-label">Ditugaskan ke:</span>
            <span class="info-value assigned-ninja">{{ getUserNameById(mission.assignedNinjaId, 'Belum Ditugaskan') }}</span>
          </div>
        </div>

        <div class="detail-actions">
            <BaseButton
              v-if="mission.status === 'available' || mission.status === 'assigned'"
              variant="danger"
              text="Batalkan Misi"
              @click="confirmCancelMission(mission.id, mission.title)"
            />
            <BaseButton
              v-if="mission.status === 'assigned'"
              variant="primary"
              text="Tandai Selesai"
              @click="confirmCompleteMission(mission.id, mission.title)"
            />
            <BaseButton
              v-if="mission.status === 'completed'"
              variant="secondary"
              text="Arsipkan Misi"
              @click="archiveMission(mission.id)"
            />
          </div>
        </div>

        <div class="detail-section applicants-section" v-if="mission.status === 'available' && mission.applicants.length > 0">
          <h3 class="section-sub-heading">Pelamar Misi ({{ mission.applicants.length }})</h3>
          <LoadingSpinner v-if="loadingApplicants" text="Memuat pelamar..." />
          <ul v-else class="applicant-list">
            <li v-for="applicantId in mission.applicants" :key="applicantId" class="applicant-item">
              <div class="applicant-info">
                <i class="fas fa-user-ninja applicant-icon"></i>
                <span class="applicant-name">{{ getUserNameById(applicantId) }}</span>
                <span class="applicant-role">(Cyber Ninja)</span>
              </div>
              <div class="applicant-actions">
                <BaseButton
                  variant="primary"
                  text="Tugaskan Ninja Ini"
                  @click="confirmAssignNinja(mission.id, applicantId)"
                  :disabled="isAssigning"
                />
                <BaseButton variant="outline" text="Lihat Profil" @click="viewNinjaProfile(applicantId)" />
              </div>
            </li>
          </ul>
        </div>
        <div v-else-if="mission.status === 'available' && mission.applicants.length === 0" class="no-applicants">
          <p>Belum ada Cyber Ninja yang melamar misi ini.</p>
        </div>
      </div>

      <div v-else-if="!missionStore.loading && !mission" class="mission-not-found">
        <p>Misi tidak ditemukan atau Anda tidak memiliki akses.</p>
        <router-link to="/client/missions" class="base-button">Kembali ke Daftar Misi</router-link>
      </div>

      <ModalDialog
        v-model:isVisible="showAssignConfirmModal"
        title="Tetapkan Cyber Ninja"
        max-width="450px"
        :disableClose="isAssigning"
      >
        <p>Anda yakin ingin menugaskan misi ini kepada <strong>{{ ninjaToAssign.name }}</strong>?</p>
        <p class="warning-text">Setelah ditugaskan, misi akan berstatus 'Aktif'.</p>
        <template #footer>
          <BaseButton variant="outline" text="Batal" @click="cancelAssign" :disabled="isAssigning" />
          <BaseButton variant="primary" text="Tetapkan Sekarang" @click="executeAssign" :loading="isAssigning" />
        </template>
      </ModalDialog>

      <ModalDialog
        v-model:isVisible="showCancelConfirmModal"
        title="Batalkan Misi"
        max-width="450px"
        :disableClose="isUpdatingStatus"
      >
        <p>Anda yakin ingin membatalkan misi <strong>"{{ missionToUpdateStatus.title }}"</strong>?</p>
        <p class="warning-text">Misi yang dibatalkan tidak dapat dikembalikan ke status aktif.</p>
        <template #footer>
          <BaseButton variant="outline" text="Tidak" @click="cancelStatusUpdate" :disabled="isUpdatingStatus" />
          <BaseButton variant="danger" text="Ya, Batalkan Misi" @click="executeCancelMission" :loading="isUpdatingStatus" />
        </template>
      </ModalDialog>

      <ModalDialog
        v-model:isVisible="showCompleteConfirmModal"
        title="Selesaikan Misi"
        max-width="450px"
        :disableClose="isUpdatingStatus"
      >
        <p>Anda yakin ingin menandai misi <strong>"{{ missionToUpdateStatus.title }}"</strong> sebagai selesai?</p>
        <p>Pastikan semua hasil misi telah diterima dan disetujui.</p>
        <template #footer>
          <BaseButton variant="outline" text="Tidak" @click="cancelStatusUpdate" :disabled="isUpdatingStatus" />
          <BaseButton variant="primary" text="Ya, Misi Selesai" @click="executeCompleteMission" :loading="isUpdatingStatus" />
        </template>
      </ModalDialog>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useMissionStore } from '@/stores/mission';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import AlertMessage from '@/components/common/AlertMessage.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import ModalDialog from '@/components/ui/ModalDialog.vue';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const missionStore = useMissionStore();

const showErrorAlert = ref(false);
const allUsers = ref([]);
const loadingApplicants = ref(false);

const showAssignConfirmModal = ref(false);
const ninjaToAssign = ref({ id: null, name: '', missionId: null });
const isAssigning = ref(false);

const showCancelConfirmModal = ref(false);
const showCompleteConfirmModal = ref(false);
const missionToUpdateStatus = ref({ id: null, title: '' });
const isUpdatingStatus = ref(false);

const mission = computed(() => missionStore.currentMission);

// ✅ Ambil dan parse ID dari route (selalu number)
const missionId = computed(() => Number(route.params.id));

// --- Ambil nama user berdasarkan ID ---
const getUserNameById = (id, fallbackText = 'Unknown User') => {
  if (!id) return fallbackText;
  const user = allUsers.value.find(u => Number(u.id) === Number(id));
  return user ? user.username : fallbackText;
};

// --- Ambil semua users ---
const fetchAllUsers = async () => {
  if (allUsers.value.length > 0) return;

  loadingApplicants.value = true;
  try {
    const response = await axios.get('http://localhost:3000/users');
    allUsers.value = response.data;
  } catch (err) {
    console.error('Error fetching all users:', err);
    missionStore.error = 'Gagal memuat data pengguna untuk pelamar.';
  } finally {
    loadingApplicants.value = false;
  }
};

// --- Ambil misi dan validasi kepemilikan ---
const fetchMissionAndValidateUser = async (id) => {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    missionStore.error = 'ID misi tidak valid.';
    router.push('/client/missions');
    return;
  }

  if (!authStore.isAuthenticated || !authStore.isClient || !authStore.user?.id) {
    router.push('/login');
    return;
  }

  await missionStore.fetchMissionById(parsedId);

  if (mission.value) {
    if (Number(mission.value.clientId) !== Number(authStore.user.id)) {
      missionStore.error = 'Anda tidak memiliki akses untuk melihat misi ini.';
      router.push('/client/missions');
    }

    if ((mission.value.applicants?.length || 0) > 0 || mission.value.assignedNinjaId) {
      await fetchAllUsers();
    }
  }
};

// --- Watch dan Lifecycle Hooks ---
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

// ✅ Watch perubahan route dan ambil data jika ID berubah
watch(
  () => route.params.id,
  (newId) => {
    const parsedId = Number(newId);
    if (Number.isInteger(parsedId) && parsedId !== Number(missionStore.currentMission?.id)) {
      fetchMissionAndValidateUser(parsedId);
    }
  },
  { immediate: true }
);

onMounted(() => {
  // Tidak perlu fetch di sini karena watcher `immediate` sudah mencakup
});

// --- Format dan Status ---
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatStatus = (status) => {
  const statusMap = {
    available: 'Tersedia',
    assigned: 'Ditugaskan (Aktif)',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  };
  return statusMap[status] || status;
};




const confirmCancelMission = (id, title) => {
  missionToUpdateStatus.value = { id: Number(id), title };
  showCancelConfirmModal.value = true;
};

const executeCancelMission = async () => {
  isUpdatingStatus.value = true;
  try {
    await missionStore.updateMissionStatus(Number(missionToUpdateStatus.value.id), 'cancelled');
    await missionStore.fetchMissionById(Number(missionToUpdateStatus.value.id));
  } finally {
    isUpdatingStatus.value = false;
    showCancelConfirmModal.value = false;
  }
};

const confirmCompleteMission = (id, title) => {
  missionToUpdateStatus.value = { id: Number(id), title };
  showCompleteConfirmModal.value = true;
};

const executeCompleteMission = async () => {
  isUpdatingStatus.value = true;
  try {
    await missionStore.updateMissionStatus(Number(missionToUpdateStatus.value.id), 'completed');
    await missionStore.fetchMissionById(Number(missionToUpdateStatus.value.id));
  } finally {
    isUpdatingStatus.value = false;
    showCompleteConfirmModal.value = false;
  }
};

const archiveMission = (id) => {
  alert(`Fitur Arsip Misi ${Number(id)} belum diimplementasikan.`);
};

const confirmAssignNinja = (missionId, ninjaId) => {
  showAssignConfirmModal.value = true;
  ninjaToAssign.value = {
    id: Number(ninjaId),
    name: getUserNameById(ninjaId),
    missionId: Number(missionId),
  };
};

const cancelAssign = () => {
  showAssignConfirmModal.value = false;
};

const executeAssign = async () => {
  isAssigning.value = true;
  try {
    await missionStore.assignNinjaToMission(
      Number(ninjaToAssign.value.missionId),
      Number(ninjaToAssign.value.id)
    );
    await missionStore.fetchMissionById(Number(ninjaToAssign.value.missionId));
  } finally {
    isAssigning.value = false;
    showAssignConfirmModal.value = false;
  }
};

const viewNinjaProfile = (ninjaId) => {
  alert(`Fitur Lihat Profil Ninja ${Number(ninjaId)} belum diimplementasikan.`);
};
</script>

<style scoped>
/* Scoped styles untuk ClientMissionDetail.vue */

.client-mission-detail-page {
  padding: var(--spacing-xl) var(--spacing-md);
  max-width: 900px;
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

/* --- Mission Detail Card --- */
.mission-detail-card {
  background-color: var(--color-background-card);
  border: 1px solid var(--color-border-card);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-xl);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
}

.mission-title {
  font-family: var(--font-heading, var(--font-primary));
  font-size: 2.2em;
  color: var(--color-text-light);
  margin: 0;
  flex-grow: 1;
  margin-right: var(--spacing-md);
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}

.mission-status {
  padding: 8px 15px;
  border-radius: var(--border-radius-sm);
  font-size: 0.9em;
  font-weight: bold;
  text-transform: uppercase;
  color: var(--color-text-light);
  white-space: nowrap;
}

/* Gaya status berdasarkan warnanya (sama dengan MissionCard) */
.status-available { background-color: rgba(76, 175, 80, 0.2); border: 1px solid #4CAF50; color: #4CAF50; }
.status-assigned { background-color: rgba(15, 52, 96, 0.3); border: 1px solid var(--color-secondary-accent); color: var(--color-secondary-accent); }
.status-completed { background-color: rgba(138, 43, 226, 0.2); border: 1px solid #8A2BE2; color: #8A2BE2; }
.status-cancelled { background-color: rgba(233, 69, 96, 0.2); border: 1px solid var(--color-primary-accent); color: var(--color-primary-accent); }

.detail-body {
  margin-bottom: var(--spacing-xl);
}

.mission-description {
  font-size: 1.1em;
  line-height: 1.7;
  color: var(--color-text-light);
  margin-bottom: var(--spacing-xl);
  white-space: pre-wrap; /* Mempertahankan spasi dan baris baru */
}

.detail-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.info-item {
  background-color: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(74, 74, 110, 0.5);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-md);
}

.info-label {
  font-size: 0.9em;
  color: var(--color-text-muted);
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.info-value {
  font-size: 1.1em;
  color: var(--color-text-light);
  font-family: var(--font-primary);
}

.info-value.bounty {
  color: #4CAF50; /* Hijau untuk bayaran */
  font-weight: bold;
}
.info-value.deadline {
  color: var(--color-primary-accent); /* Aksen merah muda untuk deadline */
}
.info-value.assigned-ninja {
    color: var(--color-secondary-accent); /* Biru tua untuk assigned ninja */
    font-weight: bold;
}

.skill-tag {
  background-color: rgba(74, 74, 110, 0.5);
  color: var(--color-text-light);
  padding: 3px 8px;
  border-radius: var(--border-radius-sm);
  font-size: 0.8em;
  white-space: nowrap;
  display: inline-block; /* Untuk margin antar tag */
  margin-right: 5px;
  margin-bottom: 5px;
}

.detail-actions {
    display: flex;
    gap: var(--spacing-md);
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-top: var(--spacing-lg);
    padding-top: var(--spacing-md);
    border-top: 1px dashed rgba(74, 74, 110, 0.3);
}

/* --- Applicants Section --- */
.detail-section {
  background-color: var(--color-background-card);
  border: 1px solid var(--color-border-card);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-xl);
  margin-top: var(--spacing-xl);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

.section-sub-heading {
  font-family: var(--font-heading, var(--font-primary));
  font-size: 1.8em;
  color: var(--color-secondary-accent);
  text-align: center;
  margin-bottom: var(--spacing-lg);
  text-shadow: 0 0 6px rgba(15, 52, 96, 0.4);
}

.applicant-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.applicant-item {
  background-color: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(74, 74, 110, 0.5);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.applicant-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-grow: 1;
}

.applicant-icon {
  font-size: 1.5em;
  color: var(--color-primary-accent);
}

.applicant-name {
  font-size: 1.1em;
  font-weight: bold;
  color: var(--color-text-light);
}

.applicant-role {
  font-size: 0.85em;
  color: var(--color-text-muted);
}

.applicant-actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.no-applicants {
  text-align: center;
  padding: var(--spacing-md);
  color: var(--color-text-muted);
  font-size: 1.1em;
}

.mission-not-found {
  text-align: center;
  padding: var(--spacing-xl);
  background-color: rgba(26, 26, 46, 0.7);
  border: 1px dashed var(--color-border-card);
  border-radius: var(--border-radius-md);
  color: var(--color-primary-accent);
  font-size: 1.2em;
  margin-top: var(--spacing-xl);
}
.mission-not-found .base-button {
    margin-top: var(--spacing-lg);
}

/* Warning text in modal */
.warning-text {
  color: var(--color-primary-accent);
  font-weight: bold;
  margin-top: var(--spacing-md);
}

/* Alert Message Styling */
.mission-detail-alert {
  margin: var(--spacing-md) auto;
  max-width: 500px;
  position: relative;
  z-index: 10;
}

/* Responsiveness */
@media (max-width: 768px) {
  .page-title {
    font-size: 2.5em;
  }
  .page-subtitle {
    font-size: 1em;
  }
  .mission-detail-card {
    padding: var(--spacing-lg);
  }
  .mission-title {
    font-size: 1.8em;
  }
  .detail-info-grid {
    grid-template-columns: 1fr;
  }
  .detail-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .applicant-item {
    flex-direction: column;
    align-items: flex-start;
  }
  .applicant-actions {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 2em;
  }
  .page-hero {
    padding: var(--spacing-md);
  }
  .mission-detail-card {
    padding: var(--spacing-md);
  }
}
</style>