<template>
  <div class="client-edit-mission-page">
    <header class="page-hero">
      <h1 class="page-title">Edit Misi Cyber</h1>
      <p class="page-subtitle">Perbarui rincian operasi siber Anda.</p>
    </header>

    <LoadingSpinner v-if="missionStore.loading" text="Memuat detail misi..." />

    <AlertMessage
      v-if="profileAlert?.isVisible"
      v-model:isVisible="profileAlert.isVisible"
      :message="profileAlert.message"
      :type="profileAlert.type"
      :auto-dismiss="profileAlert.autoDismiss"
      @dismissed="profileAlert.isVisible = false"
      class="edit-mission-alert"
    />

    <section class="edit-mission-form-section" v-if="!missionStore.loading && formData.title">
      <form @submit.prevent="updateMission" class="edit-mission-form">
        <BaseInput
          id="mission-title"
          label="Judul Misi"
          type="text"
          v-model="formData.title"
          :errorMessage="errors.title"
          required
        />
        <BaseInput
          id="mission-description"
          label="Deskripsi Misi"
          type="textarea"
          v-model="formData.description"
          :errorMessage="errors.description"
          rows="8"
          required
        />
        <BaseInput
          id="mission-bounty"
          label="Bayaran Misi (USD)"
          type="number"
          v-model.number="formData.bounty"
          :errorMessage="errors.bounty"
          required
        />
        <BaseInput
          id="mission-deadline"
          label="Deadline Misi"
          type="date"
          v-model="formData.deadline"
          :errorMessage="errors.deadline"
          required
        />
        <BaseInput
          id="mission-skills"
          label="Keahlian yang Dibutuhkan"
          type="text"
          v-model="skillsInput"
          placeholder="Contoh: Penetration Testing, Digital Forensics"
          :errorMessage="errors.requiredSkills"
          hint="Pisahkan dengan koma jika lebih dari satu keahlian."
        />

        <BaseButton
          type="submit"
          text="Simpan Perubahan Misi"
          :loading="isUpdating"
          :disabled="isUpdating"
        />
        <BaseButton
          type="button"
          variant="outline"
          text="Batalkan"
          @click="router.push('/client/missions')"
          :disabled="isUpdating"
        />
      </form>
    </section>

    <div v-else-if="!missionStore.loading" class="mission-not-found">
      <p>Misi tidak ditemukan atau Anda tidak memiliki akses.</p>
      <router-link to="/client/missions" class="base-button">Kembali ke Daftar Misi</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useMissionStore } from '@/stores/mission';

import BaseInput from '@/components/common/BaseInput.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import AlertMessage from '@/components/common/AlertMessage.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const missionStore = useMissionStore();

const formData = reactive({
  id: null,
  clientId: null,
  title: '',
  description: '',
  bounty: null,
  deadline: '',
  requiredSkills: [],
  status: '',
  applicants: [],
  assignedNinjaId: null,
});

const skillsInput = ref('');
const errors = ref({});
const isUpdating = ref(false);
const profileAlert = reactive({
  isVisible: false,
  message: '',
  type: 'info',
  autoDismiss: 3000,
});

const showAlert = (message, type, autoDismiss = 3000) => {
  profileAlert.isVisible = true;
  profileAlert.message = message;
  profileAlert.type = type;
  profileAlert.autoDismiss = autoDismiss;
};

const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!formData.title.trim()) {
    errors.value.title = 'Judul misi wajib diisi.';
    isValid = false;
  }
  if (!formData.description.trim()) {
    errors.value.description = 'Deskripsi misi wajib diisi.';
    isValid = false;
  }
  if (!formData.bounty || formData.bounty <= 0) {
    errors.value.bounty = 'Bayaran misi harus angka positif.';
    isValid = false;
  }
  if (!formData.deadline) {
    errors.value.deadline = 'Deadline misi wajib diisi.';
    isValid = false;
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(formData.deadline);
    if (isNaN(deadlineDate.getTime())) {
      errors.value.deadline = 'Format tanggal tidak valid.';
      isValid = false;
    } else if (deadlineDate < today) {
      errors.value.deadline = 'Deadline tidak boleh tanggal yang sudah lewat.';
      isValid = false;
    }
  }
  if (!skillsInput.value.trim()) {
    errors.value.requiredSkills = 'Setidaknya satu keahlian dibutuhkan.';
    isValid = false;
  } else {
    const parsedSkills = skillsInput.value
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (parsedSkills.length === 0) {
      errors.value.requiredSkills = 'Keahlian tidak boleh kosong.';
      isValid = false;
    }
    formData.requiredSkills = parsedSkills;
  }

  return isValid;
};

const populateForm = (missionData) => {
  formData.id = missionData.id ?? null;
  formData.clientId = missionData.clientId ?? null;
  formData.title = missionData.title ?? '';
  formData.description = missionData.description ?? '';
  formData.bounty = missionData.bounty ?? null;
  formData.deadline = missionData.deadline ?? '';
  formData.requiredSkills = Array.isArray(missionData.requiredSkills) ? missionData.requiredSkills : [];
  formData.status = missionData.status ?? '';
  formData.applicants = Array.isArray(missionData.applicants) ? missionData.applicants : [];
  formData.assignedNinjaId = missionData.assignedNinjaId ?? null;

  skillsInput.value = formData.requiredSkills.join(', ');
  errors.value = {};
};

const updateMission = async () => {
  if (!validateForm()) {
    showAlert('Harap perbaiki kesalahan pada formulir.', 'error');
    return;
  }

  isUpdating.value = true;
  errors.value = {};

  const payload = {
    title: formData.title,
    clientId: formData.clientId,
    description: formData.description,
    bounty: formData.bounty,
    deadline: formData.deadline,
    requiredSkills: formData.requiredSkills,
    status: formData.status,
    applicants: formData.applicants,
    assignedNinjaId: formData.assignedNinjaId,
  };

  try {
    const updated = await missionStore.updateMission(formData.id, payload);
    if (updated) {
      showAlert('Misi berhasil diperbarui!', 'success', 3000);
      router.push(`/client/missions/${formData.id}`);
    } else {
      showAlert(missionStore.error || 'Gagal memperbarui misi.', 'error');
    }
  } catch (err) {
    console.error('Error updating mission:', err);
    showAlert('Terjadi kesalahan tidak terduga.', 'error');
  } finally {
    isUpdating.value = false;
  }
};

watch(
  () => route.params.id,
  async (newId) => {
    console.log('🔍 ID dari route:', newId);
    if (!newId || typeof newId !== 'string' || !/^MID-\d+$/.test(newId)) {
      missionStore.error = 'ID misi tidak valid.';
      router.push('/client/missions');
      return;
    }

    await missionStore.fetchMissionById(newId);

    if (missionStore.error) {
      showAlert(missionStore.error, 'error', 5000);
      router.push('/client/missions');
      return;
    }

    const currentMission = missionStore.currentMission;

    if (
      !currentMission ||
      Number(currentMission.clientId) !== Number(authStore.user?.id) ||
      currentMission.status !== 'available'
    ) {
      showAlert('Misi tidak ditemukan atau tidak bisa diedit.', 'error');
      router.push('/client/missions');
      return;
    }

    populateForm(currentMission);
  },
  { immediate: true }
);


onMounted(() => {
  if (!authStore.isAuthenticated || !authStore.isClient || !authStore.user?.id) {
    router.push('/login');
  }
});
</script>


<style scoped>
/* Scoped styles untuk ClientEditMission.vue */

.client-edit-mission-page {
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

/* --- Edit Mission Form Section --- */
.edit-mission-form-section {
  background-color: var(--color-background-card);
  border: 1px solid var(--color-border-card);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-xl);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  position: relative;
}

.edit-mission-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

/* Penyesuaian untuk alert di dalam card form */
.edit-mission-alert {
  margin-top: var(--spacing-lg);
  position: relative;
  z-index: 1;
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .page-title {
    font-size: 2.5em;
  }
  .page-subtitle {
    font-size: 1em;
  }
  .edit-mission-form-section {
    padding: var(--spacing-lg);
  }
  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 2em;
  }
  .page-hero {
    padding: var(--spacing-md);
  }
}
</style>