<template>
    <div class="client-profile-page">
      <section class="page-hero">
        <h1 class="page-title">Profil Klien</h1>
        <p class="page-subtitle">Kelola informasi pribadi dan data perusahaan Anda.</p>
      </section>
  
      <section class="profile-card">
        <h2 class="section-heading"><i class="fas fa-user-circle"></i> Informasi Akun</h2>
        <LoadingSpinner v-if="authStore.loading" text="Memuat profil..." />
        <AlertMessage
          v-if="profileAlert.isVisible"
          v-model:isVisible="profileAlert.isVisible"
          :message="profileAlert.message"
          :type="profileAlert.type"
          :auto-dismiss="profileAlert.autoDismiss"
          @dismissed="profileAlert.isVisible = false"
          class="profile-alert"
        />
  
        <form @submit.prevent="updateProfile" class="profile-form" v-if="!authStore.loading && formData.username">
          <BaseInput
            id="username"
            label="Username"
            type="text"
            v-model="formData.username"
            :errorMessage="errors.username"
            required
            hint="ID unik Anda di jaringan Stealth Ops."
            :disabled="true" />
          <BaseInput
            id="email"
            label="Email Terenkripsi"
            type="email"
            v-model="formData.email"
            :errorMessage="errors.email"
            required
          />
          <BaseInput
            id="company"
            label="Nama Perusahaan"
            type="text"
            v-model="formData.company"
            :errorMessage="errors.company"
            hint="Nama perusahaan Anda yang terkait dengan misi."
          />
          <BaseInput
            id="password"
            label="Kode Akses Baru (Opsional)"
            type="password"
            v-model="formData.password"
            placeholder="Biarkan kosong jika tidak ingin mengubah password"
            :errorMessage="errors.password"
          />
          <BaseInput
            id="confirm-password"
            label="Konfirmasi Kode Akses Baru"
            type="password"
            v-model="formData.confirmPassword"
            placeholder="Ulangi kode akses baru"
            :errorMessage="errors.confirmPassword"
          />
  
          <BaseButton
            type="submit"
            text="Simpan Perubahan"
            :loading="isUpdating"
            :disabled="isUpdating"
          />
        </form>
        <div v-else-if="!authStore.loading" class="profile-not-found">
          <p>Gagal memuat data profil. Mungkin sesi Anda berakhir.</p>
          <router-link to="/login" class="base-button">Login Kembali</router-link>
        </div>
      </section>
    </div>
  </template>
  
  <script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import AlertMessage from '@/components/common/AlertMessage.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import axios from 'axios';

const authStore = useAuthStore();
const router = useRouter();

const formData = reactive({
  id: '', // Gunakan string untuk ID seperti "id-212"
  username: '',
  email: '',
  company: '',
  password: '',
  confirmPassword: '',
  role: 'client',
});

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

  if (!formData.email.trim()) {
    errors.value.email = 'Email wajib diisi.';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.value.email = 'Format email tidak valid.';
    isValid = false;
  }

  if (formData.password || formData.confirmPassword) {
    if (formData.password.length < 6) {
      errors.value.password = 'Password minimal 6 karakter.';
      isValid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      errors.value.confirmPassword = 'Konfirmasi password tidak cocok.';
      isValid = false;
    }
  }

  return isValid;
};

const populateFormData = () => {
  if (authStore.user) {
    formData.id = authStore.user.id; // string seperti "id-212"
    formData.username = authStore.user.username;
    formData.email = authStore.user.email;
    formData.company = authStore.user.company || '';
    formData.password = '';
    formData.confirmPassword = '';
    errors.value = {};
  }
};

const updateProfile = async () => {
  if (!validateForm()) {
    showAlert('Harap perbaiki kesalahan pada formulir.', 'error', null);
    return;
  }

  isUpdating.value = true;
  errors.value = {};

  const payload = {
    email: formData.email,
    company: formData.company,
  };

  if (formData.password) {
    payload.password = formData.password;
  }

  try {
    // Gunakan ID string seperti "id-212"
    const response = await axios.patch(`http://localhost:3000/users/${formData.id}`, payload);

    authStore.user = { ...authStore.user, ...response.data };
    localStorage.setItem('user', JSON.stringify(authStore.user));

    showAlert('Profil berhasil diperbarui!', 'success', 3000);
    formData.password = '';
    formData.confirmPassword = '';
  } catch (err) {
    console.error('Error updating profile:', err);
    showAlert('Gagal memperbarui profil. Silakan coba lagi.', 'error', null);
  } finally {
    isUpdating.value = false;
  }
};

onMounted(() => {
  if (!authStore.isAuthenticated || !authStore.isClient) {
    router.push('/login');
  } else {
    populateFormData();
  }
});

watch(() => authStore.user, (newUser) => {
  if (newUser) {
    populateFormData();
  }
}, { deep: true });
</script>

  
  <style scoped>
  /* Scoped styles untuk ClientProfile.vue */
  
  .client-profile-page {
    padding: var(--spacing-xl) var(--spacing-md);
    max-width: 800px;
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
  
  /* --- Profile Card Section --- */
  .profile-card {
    background-color: var(--color-background-card);
    border: 1px solid var(--color-border-card);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-xl);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
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
  
  .profile-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .profile-not-found {
    text-align: center;
    padding: var(--spacing-lg);
    color: var(--color-primary-accent);
    font-size: 1.1em;
  }
  .profile-not-found .base-button {
      margin-top: var(--spacing-md);
  }
  
  /* Penyesuaian untuk alert di dalam card profil */
  .profile-alert {
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
    .profile-card {
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
    .section-heading {
      font-size: 1.6em;
    }
  }
  </style>