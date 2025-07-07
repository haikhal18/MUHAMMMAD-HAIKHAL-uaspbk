<template>
  <div class="client-new-mission-page">
    <section class="page-hero">
      <h1 class="page-title">Posting Misi Cyber Baru</h1>
      <p class="page-subtitle">Rincikan operasi yang Anda butuhkan untuk para Cyber Ninja.</p>
    </section>

    <section class="new-mission-form-section">
      <form @submit.prevent="submitNewMission" class="new-mission-form">
        <BaseInput
          id="mission-id"
          label="ID Misi (Manual)"
          type="number"
          v-model="formData.id"@input="handleIdInput"placeholder="Masukkan ID misi unik (misal: 112, 113)"
          :errorMessage="errors.id"
          required
          hint="Pastikan ID unik dan belum digunakan. Contoh: 112, 113, dst."
        />
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
          hint="Tanggal terakhir misi harus diselesaikan."
          required
        />
        <BaseInput
          id="mission-skills"
          label="Keahlian yang Dibutuhkan"
          type="text"
          v-model="skillsInput"
          placeholder="Contoh: Penetration Testing, Digital Forensics, OSINT (pisahkan dengan koma)"
          :errorMessage="errors.requiredSkills"
          hint="Daftar keahlian spesifik yang harus dimiliki oleh Cyber Ninja pelamar."
        />

        <BaseButton
          type="submit"
          text="Posting Misi Sekarang"
          :loading="missionStore.loading"
          :disabled="missionStore.loading"
        />
      </form>

      <AlertMessage
        v-if="alert.isVisible"
        v-model:isVisible="alert.isVisible"
        :message="alert.message"
        :type="alert.type"
        :auto-dismiss="alert.autoDismiss"
        @dismissed="alert.isVisible = false"
        class="new-mission-alert"
      />
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useMissionStore } from '@/stores/mission';

import BaseInput from '@/components/common/BaseInput.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import AlertMessage from '@/components/common/AlertMessage.vue';

const authStore = useAuthStore();
const missionStore = useMissionStore();
const router = useRouter();

const formData = reactive({
  id: null,
  clientId: null,
  title: '',
  description: '',
  bounty: null,
  deadline: '',
  requiredSkills: [],
});

const skillsInput = ref('');
const errors = ref({});
const alert = reactive({
  isVisible: false,
  message: '',
  type: 'info',
  autoDismiss: 3000,
});

const showAlert = (message, type, autoDismiss = 3000) => {
  alert.isVisible = true;
  alert.message = message;
  alert.type = type;
  alert.autoDismiss = autoDismiss;
};

const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (
    !formData.id ||
    isNaN(Number(formData.id)) ||
    Number(formData.id) <= 0 ||
    !Number.isInteger(Number(formData.id))
  ) {
    errors.value.id = 'ID misi harus angka bulat positif.';
    isValid = false;
  }

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
    if (deadlineDate < today) {
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

const submitNewMission = async () => {
  formData.clientId = authStore.user?.id;

  if (!authStore.isClient || !formData.clientId) {
    showAlert('Anda harus login sebagai klien.', 'error');
    return;
  }

  if (!validateForm()) {
    showAlert('Periksa kembali formulir Anda.', 'error');
    return;
  }

  const payload = {
    id: String(formData.id), // Konversi ke string!
    clientId: String(formData.clientId), // Konversi ke string!
    title: formData.title,
    description: formData.description,
    bounty: formData.bounty,
    deadline: formData.deadline,
    requiredSkills: formData.requiredSkills,
    status: 'available',
    applicants: [],
    assignedNinjaId: null,
  };

  try {
    const createdMission = await missionStore.createMission(payload);
    if (createdMission) {
      showAlert(`Misi berhasil diposting! ID: ${createdMission.id}`, 'success', 5000);
      resetForm();
    } else {
      if (missionStore.error?.includes('Konflik ID')) {
        errors.value.id = 'ID ini sudah digunakan.';
        showAlert('ID sudah dipakai. Gunakan ID unik lain.', 'error');
      } else {
        showAlert(missionStore.error || 'Gagal membuat misi.', 'error');
      }
    }
  } catch (err) {
    console.error('Error creating mission:', err);
    if (err.response?.status === 409) {
      errors.value.id = 'ID ini sudah digunakan.';
      showAlert('ID Misi sudah dipakai.', 'error');
    } else {
      showAlert('Terjadi kesalahan saat membuat misi.', 'error');
    }
  }
};

const resetForm = () => {
  formData.id = null;
  formData.clientId = authStore.user?.id;
  formData.title = '';
  formData.description = '';
  formData.bounty = null;
  formData.deadline = '';
  formData.requiredSkills = [];
  skillsInput.value = '';
  errors.value = {};
};

onMounted(() => {
  if (!authStore.isAuthenticated || !authStore.isClient) {
    router.push('/login');
  }
  resetForm();
});
</script>

<style scoped>
/* Scoped styles untuk ClientNewMission.vue */

.client-new-mission-page {
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

/* --- New Mission Form Section --- */
.new-mission-form-section {
  background-color: var(--color-background-card);
  border: 1px solid var(--color-border-card);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-xl);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  position: relative; /* Untuk AlertMessage */
}

.new-mission-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* Penyesuaian untuk alert di dalam form section */
.new-mission-alert {
  margin-top: var(--spacing-lg);
  position: relative; /* Biarkan dia di flow dokumen */
  z-index: 1; /* Pastikan di atas elemen lain */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .page-title {
    font-size: 2.5em;
  }
  .page-subtitle {
    font-size: 1em;
  }
  .new-mission-form-section {
    padding: var(--spacing-lg);
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