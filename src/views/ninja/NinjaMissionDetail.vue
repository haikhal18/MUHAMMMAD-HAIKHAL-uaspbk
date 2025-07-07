<template>
  <div class="ninja-mission-detail-page">
    <section class="page-hero">
      <h1 class="page-title">Detail Misi Anda</h1>
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
          <div class="info-item" v-if="mission.clientId">
            <span class="info-label">Klien:</span>
            <span class="info-value client-name">{{ getUserNameById(mission.clientId, 'Unknown Client') }}</span>
          </div>
        </div>

        <div class="detail-actions">
            <template v-if="mission.status === 'available' && !hasApplied(mission.id)">
                <BaseButton
                    variant="primary"
                    text="Lamar Misi Ini"
                    @click="confirmApply(mission.id, mission.title)"
                    :loading="isApplying"
                    :disabled="isApplying"
                />
            </template>
            <template v-else-if="mission.status === 'available' && hasApplied(mission.id)">
                <BaseButton
                    variant="outline"
                    text="Sudah Dilamar"
                    :disabled="true"
                />
            </template>
            <template v-else-if="mission.status === 'assigned' && Number(mission.assignedNinjaId) === Number(authStore.user?.id)">
                <BaseButton
                    variant="secondary"
                    text="Update Progres"
                    @click="showProgressUpdateModal = true"
                />
                <BaseButton
                    variant="primary"
                    text="Tandai Selesai"
                    @click="confirmCompleteMission(mission.id, mission.title)"
                    :disabled="isUpdatingStatus"
                />
            </template>
            <template v-else-if="mission.status === 'completed' && Number(mission.assignedNinjaId) === Number(authStore.user?.id)">
                <BaseButton
                    variant="success"
                    text="Misi Selesai"
                    :disabled="true"
                />
            </template>
            <template v-else-if="mission.status === 'cancelled'">
                <BaseButton
                    variant="danger"
                    text="Misi Dibatalkan"
                    :disabled="true"
                />
            </template>
             <router-link to="/ninja/dashboard" class="base-button">
                 Kembali ke Dashboard Ninja
             </router-link>
        </div>
      </div>
    </div>

    <div v-else-if="!missionStore.loading && !mission" class="mission-not-found">
      <p>Misi tidak ditemukan atau Anda tidak memiliki akses.</p>
      <router-link to="/ninja/dashboard" class="base-button">Kembali ke Dashboard Ninja</router-link>
    </div>

    <ModalDialog
      v-model:isVisible="showApplyConfirmModal"
      title="Konfirmasi Lamaran Misi"
      max-width="450px"
      :disableClose="isApplying"
    >
      <p>Anda yakin ingin melamar misi <strong>"{{ missionToApply.title }}"</strong>?</p>
      <p>Lamaran Anda akan dikirim ke Klien.</p>
      <template #footer>
        <BaseButton variant="outline" text="Batal" @click="cancelApply" :disabled="isApplying" />
        <BaseButton variant="primary" text="Konfirmasi Lamaran" @click="executeApply" :loading="isApplying" />
      </template>
    </ModalDialog>

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

    <ModalDialog
      v-model:isVisible="showProgressUpdateModal"
      title="Update Progres Misi"
      max-width="600px"
      :disableClose="isUpdatingProgress"
    >
      <p>Misi: <strong>{{ mission?.title }}</strong></p>
      <BaseInput
        id="progress-update"
        label="Catatan Progres"
        type="textarea"
        v-model="progressNote"
        placeholder="Deskripsikan progres terkini atau masalah yang dihadapi..."
        rows="5"
      />
      <BaseInput
        id="progress-percentage"
        label="Persentase Progres (%)"
        type="number"
        v-model.number="progressPercentage"
        min="0"
        max="100"
      />
      <template #footer>
        <BaseButton variant="outline" text="Batal" @click="showProgressUpdateModal = false" :disabled="isUpdatingProgress" />
        <BaseButton variant="primary" text="Simpan Progres" @click="saveProgress" :loading="isUpdatingProgress" />
      </template>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useMissionStore } from '@/stores/mission';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import AlertMessage from '@/components/common/AlertMessage.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import BaseInput from '@/components/common/BaseInput.vue';
import ModalDialog from '@/components/ui/ModalDialog.vue';
import axios from 'axios';
import { nextTick } from 'vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const missionStore = useMissionStore();

const missionId = parseInt(route.params.id);

const showErrorAlert = ref(false);
const allUsers = ref([]);
const loadingUsers = ref(false);

const showApplyConfirmModal = ref(false);
const missionToApply = ref({ id: null, title: '' });
const isApplying = ref(false);

const showCompleteConfirmModal = ref(false);
const missionToUpdateStatus = ref({ id: null, title: '' });
const isUpdatingStatus = ref(false);

const showProgressUpdateModal = ref(false);
const progressNote = ref('');
const progressPercentage = ref(0);
const isUpdatingProgress = ref(false);


const mission = computed(() => missionStore.currentMission);

// --- Fungsi untuk mendapatkan nama pengguna berdasarkan ID (baik ninja maupun klien) ---
const getUserNameById = (id, fallbackText = 'Unknown User') => {
  if (!id) return fallbackText;
  // PERBAIKAN: Menggunakan Number() untuk memastikan perbandingan tipe data yang sama
  const user = allUsers.value.find(u => Number(u.id) === Number(id)); 
  return user ? user.username : fallbackText;
};

// --- Mengecek apakah ninja saat ini sudah melamar misi tertentu ---
const hasApplied = (id) => {
  // PERBAIKAN: Menggunakan Number() untuk memastikan perbandingan tipe data yang sama
  return mission.value && mission.value.applicants.map(Number).includes(Number(authStore.user?.id)); 
};

// --- Fungsi untuk mengambil semua user (untuk nama klien/ninja) ---
const fetchAllUsers = async () => {
  // Hanya fetch jika data user belum ada untuk efisiensi
  if (allUsers.value.length > 0) return;

  loadingUsers.value = true;
  try {
    const response = await axios.get('http://localhost:3000/users');
    allUsers.value = response.data;
  } catch (err) {
    console.error('Error fetching all users:', err);
    missionStore.error = 'Gagal memuat data pengguna (klien/ninja) terkait misi.';
  } finally {
    loadingUsers.value = false;
  }
};

// --- Fungsi untuk mengambil misi dan memvalidasi akses pengguna ---
const fetchMissionAndValidateUser = async (id) => {
  if (!authStore.isAuthenticated || !authStore.isNinja || !authStore.user?.id) {
    router.push('/login');
    return;
  }

  await missionStore.fetchMissionById(id);

  if (mission.value) {
    // Validasi tambahan jika misi hanya bisa dilihat oleh ninja yang melamar/ditugaskan
    // PERBAIKAN: Menggunakan Number() untuk memastikan perbandingan tipe data yang sama
    const isAssignedToMe = Number(mission.value.assignedNinjaId) === Number(authStore.user.id);
    const hasMeAsApplicant = mission.value.applicants.map(Number).includes(Number(authStore.user.id));
    const isPubliclyAvailable = mission.value.status === 'available';

    // Ninja hanya bisa melihat detail misi jika:
    // 1. Misi berstatus 'available' (termasuk yang dia lamar)
    // 2. Misi ditugaskan kepadanya
    // 3. (Opsional: Tambahkan kondisi lain jika ada misi yang dibatalkan tapi dia pernah terlibat)
    if (!isAssignedToMe && !hasMeAsApplicant && !isPubliclyAvailable) {
      missionStore.error = 'Anda tidak memiliki akses untuk melihat detail misi ini.';
      showErrorAlert.value = true;
      router.push('/ninja/dashboard'); // Redirect ke dashboard ninja
    }

    // Pastikan data user (klien untuk nama klien) ada
    if (mission.value.clientId) {
      await fetchAllUsers();
    }
  }
};

// --- Watcher dan Lifecycle Hooks ---
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

watch(() => route.params.id, (newId) => {
  const parsedId = parseInt(newId, 10);
  if (parsedId && parsedId !== missionStore.currentMission?.id) {
    fetchMissionAndValidateUser(parsedId);
  }
}, { immediate: true });

onMounted(async () => {
  // `fetchMissionAndValidateUser(missionId)` akan dipanggil oleh watcher `immediate: true`
  // Jadi, tidak perlu memanggilnya lagi di sini.
});


// --- Fungsi Aksi Ninja pada Misi ---
const confirmApply = (id, title) => {
  missionToApply.value = { id, title };
  showApplyConfirmModal.value = true;
};
const cancelApply = () => {
  showApplyConfirmModal.value = false;
  missionToApply.value = { id: null, title: '' };
};
const executeApply = async () => {
  isApplying.value = true;
  try {
    // Pastikan ID misi dan ninja yang dikirim ke store adalah Number
    const success = await missionStore.applyForMission(
      Number(missionToApply.value.id),
      Number(authStore.user.id)
    );
    if (success) {
      alert(`Berhasil melamar misi "${missionToApply.value.title}"!`);
      // Refresh detail misi untuk update status di UI (misalnya, tombol "Lamar" jadi "Sudah Dilamar")
      await missionStore.fetchMissionById(Number(missionToApply.value.id)); 
    } else {
      alert('Gagal melamar misi. Coba lagi.'); // Alert jika ada error
    }
  } catch (error) {
    console.error('Error during apply execution:', error);
    alert('Terjadi kesalahan saat melamar misi.');
  } finally {
    isApplying.value = false;
    showApplyConfirmModal.value = false;
    missionToApply.value = { id: null, title: '' };
  }
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
      // Refresh detail misi untuk update status di UI
      await missionStore.fetchMissionById(Number(missionToUpdateStatus.value.id)); 
    } else {
      alert('Gagal menandai misi selesai. Coba lagi.');
    }
  } catch (error) {
    console.error('Error completing mission:', error);
    alert('Terjadi kesalahan saat menandai misi selesai.');
  } finally {
    isUpdatingStatus.value = false;
    showCompleteConfirmModal.value = false;
  }
};

const saveProgress = async () => {
    isUpdatingProgress.value = true;
    try {
        // Ini adalah contoh, Anda mungkin perlu menambahkan field `progressNote` dan `progressPercentage`
        // ke objek misi di db.json untuk bisa disimpan.
        // Anda bisa memanggil missionStore.updateMission di sini jika ada model data progres.
        console.log('Saving progress:', progressNote.value, progressPercentage.value);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi API
        alert('Progres berhasil disimpan!');
    } catch (error) {
        console.error('Error saving progress:', error);
        alert('Gagal menyimpan progres. Coba lagi.');
    } finally {
        isUpdatingProgress.value = false;
        showProgressUpdateModal.value = false;
        progressNote.value = '';
        progressPercentage.value = 0;
    }
};

const viewNinjaProfile = (ninjaId) => {
  alert(`Fitur Lihat Profil Ninja ${ninjaId} belum diimplementasikan.`);
};

// --- Fungsi Utility ---
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
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
</script>

<style scoped>
/* Scoped styles untuk NinjaMissionDetail.vue */

.ninja-mission-detail-page {
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
.info-value.client-name {
    color: var(--color-secondary-accent); /* Biru tua untuk klien */
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