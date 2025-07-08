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
          type="text"
          v-model="formData.id"
          placeholder="Contoh: MID-101"
          :errorMessage="errors.id"
          required
          hint="ID unik, gunakan format seperti MID-123"
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
          placeholder="Contoh: Penetration Testing, Digital Forensics"
          :errorMessage="errors.requiredSkills"
          hint="Pisahkan dengan koma jika lebih dari satu."
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

const router = useRouter();
const authStore = useAuthStore();
const missionStore = useMissionStore();

const formData = reactive({
  id: '', // ID sekarang string
  clientId: '',
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

  if (!formData.id || !/^MID-\d{3,}$/.test(formData.id)) {
    errors.value.id = 'Gunakan format ID seperti MID-123.';
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
    errors.value.bounty = 'Bayaran misi harus lebih dari 0.';
    isValid = false;
  }
  if (!formData.deadline) {
    errors.value.deadline = 'Deadline misi wajib diisi.';
    isValid = false;
  } else {
    const deadline = new Date(formData.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (deadline < today) {
      errors.value.deadline = 'Deadline tidak boleh di masa lalu.';
      isValid = false;
    }
  }

  const parsedSkills = skillsInput.value
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  if (parsedSkills.length === 0) {
    errors.value.requiredSkills = 'Minimal satu keahlian harus diisi.';
    isValid = false;
  }

  formData.requiredSkills = parsedSkills;
  return isValid;
};

const submitNewMission = async () => {
  formData.clientId = String(authStore.user?.id || '');

  if (!authStore.isClient || !formData.clientId) {
    showAlert('Anda harus login sebagai klien.', 'error');
    return;
  }

  if (!validateForm()) {
    showAlert('Periksa kembali formulir Anda.', 'error');
    return;
  }

  const payload = {
    id: formData.id, // ID string
    clientId: formData.clientId,
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
    const created = await missionStore.createMission(payload);
    if (created) {
      showAlert('Misi berhasil diposting!', 'success', 4000);
      resetForm();
    } else {
      showAlert(missionStore.error || 'Gagal membuat misi.', 'error');
    }
  } catch (err) {
    console.error('Create mission error:', err);
    showAlert('Terjadi kesalahan saat menyimpan misi.', 'error');
  }
};

const resetForm = () => {
  formData.id = '';
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