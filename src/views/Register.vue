<template>
  <div class="register-page">
    <div class="register-form-card">
      <h2 class="form-title">Bergabung dengan Jaringan Stealth Ops</h2>
      <p class="form-subtitle">Pilih peran Anda: Klien atau Cyber Ninja.</p>

      <form @submit.prevent="handleRegister" class="register-form">
        <BaseInput
          id="user-id"
          label="ID Agen / Client"
          type="text"
          v-model="formData.id"
          placeholder="Contoh: 123"
          :errorMessage="errors.id"
          required
        />
        <BaseInput
          id="username"
          label="Username"
          type="text"
          v-model="formData.username"
          :errorMessage="authStore.error && authStore.error.includes('Username') ? authStore.error : errors.username"
          required
        />
        <BaseInput
          id="email"
          label="Email Terenkripsi"
          type="email"
          v-model="formData.email"
          :errorMessage="authStore.error && authStore.error.includes('Email') ? authStore.error : errors.email"
          required
        />
        <BaseInput
          id="password"
          label="Buat Kode Akses Rahasia"
          type="password"
          v-model="formData.password"
          placeholder="********"
          :errorMessage="errors.password"
          required
        />
        <BaseInput
          id="confirm-password"
          label="Konfirmasi Kode Akses"
          type="password"
          v-model="formData.confirmPassword"
          placeholder="********"
          :errorMessage="errors.confirmPassword"
          required
        />

        <div class="role-selection">
          <label class="role-label">Daftar sebagai:</label>
          <div class="role-options">
            <label class="radio-button-wrapper">
              <input type="radio" v-model="formData.role" value="client" name="role" required />
              <span class="custom-radio-button">Klien</span>
            </label>
            <label class="radio-button-wrapper">
              <input type="radio" v-model="formData.role" value="ninja" name="role" required />
              <span class="custom-radio-button">Cyber Ninja</span>
            </label>
          </div>
          <p v-if="errors.role" class="error-message">{{ errors.role }}</p>
        </div>

        <BaseButton
          type="submit"
          text="Daftar ke Jaringan"
          :loading="authStore.loading"
          :disabled="authStore.loading"
        />
      </form>

      <AlertMessage
        v-if="authStore.error || Object.keys(errors).length > 0"
        v-model:isVisible="showRegisterAlert"
        type="error"
        :message="authStore.error || 'Harap perbaiki kesalahan pada formulir.'"
        :dismissible="true"
        @dismissed="clearErrors"
        class="register-alert"
      />

      <!-- ✅ Link ke Login -->
      <div class="form-footer">
        Sudah punya akun? 
        <RouterLink class="login-link highlight-link" to="/login">Masuk di sini</RouterLink>
      </div>
    </div>

    <LoadingSpinner v-if="authStore.loading" :overlay="true" text="Mendaftarkan Akun..." />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import AlertMessage from '@/components/common/AlertMessage.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';

const formData = ref({
  id: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: null,
});

const errors = ref({});
const showRegisterAlert = ref(false);
const authStore = useAuthStore();
const router = useRouter();

const clearErrors = () => {
  authStore.error = null;
  errors.value = {};
  showRegisterAlert.value = false;
};

watch(() => authStore.error, (newError) => {
  if (newError) {
    showRegisterAlert.value = true;
    nextTick(() => {
      setTimeout(() => showRegisterAlert.value = false, 5000);
    });
  }
});

watch(errors, (newErrors) => {
  if (Object.keys(newErrors).length > 0) {
    showRegisterAlert.value = true;
  } else if (!authStore.error) {
    showRegisterAlert.value = false;
  }
});

onMounted(() => {
  clearErrors();
  resetForm();
});

const validateForm = () => {
  clearErrors();
  let isValid = true;

  if (!formData.value.id || !/^\d+$/.test(formData.value.id)) {
    errors.value.id = 'ID hanya boleh angka, contoh: 123.';
    isValid = false;
  }

  if (!formData.value.username.trim()) {
    errors.value.username = 'Username wajib diisi.';
    isValid = false;
  }

  if (!formData.value.email.trim()) {
    errors.value.email = 'Email wajib diisi.';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(formData.value.email)) {
    errors.value.email = 'Format email tidak valid.';
    isValid = false;
  }

  if (!formData.value.password) {
    errors.value.password = 'Password wajib diisi.';
    isValid = false;
  } else if (formData.value.password.length < 6) {
    errors.value.password = 'Password minimal 6 karakter.';
    isValid = false;
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Konfirmasi password tidak cocok.';
    isValid = false;
  }

  if (!formData.value.role) {
    errors.value.role = 'Pilih peran (Klien atau Cyber Ninja).';
    isValid = false;
  }

  return isValid;
};

const handleRegister = async () => {
  if (!validateForm()) return;

  const payload = {
    id: formData.value.id,
    username: formData.value.username,
    email: formData.value.email,
    password: formData.value.password,
    role: formData.value.role,
  };

  const success = await authStore.register(payload);

  if (success) {
    router.push('/login'); // ✅ Redirect ke halaman login
  } else {
    if (authStore.error?.includes('ID sudah digunakan')) {
      errors.value.id = 'ID ini sudah digunakan.';
    }
    if (authStore.error?.includes('Username sudah digunakan')) {
      errors.value.username = 'Username ini sudah digunakan.';
    }
    if (authStore.error?.includes('Email sudah terdaftar')) {
      errors.value.email = 'Email ini sudah terdaftar.';
    }
  }
};

const resetForm = () => {
  formData.value = {
    id: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: null,
  };
  errors.value = {};
};
</script>

<style scoped>
/* (biarkan CSS seperti yang sudah kamu buat sebelumnya — tidak diubah) */

/* ... CSS yang sama dari pesan sebelumnya ... */
</style>

<style scoped>
/* Tambahkan styling CSS sesuai kebutuhan proyek Anda */
</style>


<style scoped>
/* Scoped styles untuk Register.vue */

.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - var(--spacing-xl) * 2);
  padding: var(--spacing-xl) 0;
}

.register-form-card {
  background-color: rgba(26, 26, 46, 0.9);
  border: 1px solid var(--color-border-card);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-xl);
  max-width: 500px; /* Lebih lebar dari login card karena ada lebih banyak field */
  width: 90%;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
  text-align: center;
  position: relative;
}

.form-title {
  font-family: var(--font-heading, var(--font-primary));
  font-size: 2.5em;
  color: var(--color-primary-accent);
  margin-bottom: var(--spacing-sm);
  text-shadow: 0 0 10px rgba(233, 69, 96, 0.7);
}

.form-subtitle {
  font-size: 1.1em;
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-xl);
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.role-selection {
  margin-top: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  text-align: left; /* Rata kiri untuk label dan radio */
}

.role-label {
  display: block;
  font-size: 0.9em;
  color: var(--color-text-light);
  font-weight: bold;
  margin-bottom: var(--spacing-sm);
}

.role-options {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.radio-button-wrapper {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.radio-button-wrapper input[type="radio"] {
  display: none; /* Sembunyikan radio button asli */
}

.custom-radio-button {
  background-color: #2a2a4a; /* Warna latar belakang custom radio */
  border: 1px solid var(--color-border-card);
  color: var(--color-text-light);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  transition: all 0.3s ease;
  min-width: 120px; /* Biar ukurannya sama */
  text-align: center;
}

.radio-button-wrapper input[type="radio"]:checked + .custom-radio-button {
  background-color: var(--color-primary-accent); /* Warna aksen saat terpilih */
  color: var(--color-text-light);
  border-color: var(--color-primary-accent);
  box-shadow: 0 0 10px rgba(233, 69, 96, 0.5);
}

.radio-button-wrapper input[type="radio"]:hover + .custom-radio-button {
  background-color: var(--color-secondary-accent);
}

/* Error message for role selection */
.role-selection .error-message {
  margin-top: var(--spacing-sm);
  text-align: left;
}

/* Penyesuaian untuk alert di dalam card registrasi */
.register-alert {
  margin-top: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  text-align: left;
}

.form-footer {
  margin-top: var(--spacing-md);
  font-size: 0.9em;
  color: var(--color-text-muted);
}

.login-link {
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 0.3s ease;
}

.highlight-link {
  color: var(--color-primary-accent);
  font-weight: bold;
}

.login-link:hover, .highlight-link:hover {
  color: #fff;
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .form-title {
    font-size: 2em;
  }
  .register-form-card {
    padding: var(--spacing-lg);
  }
  .role-options {
    flex-direction: column; /* Tumpuk opsi peran di mobile */
    align-items: stretch;
  }
  .custom-radio-button {
    width: 100%; /* Ambil lebar penuh */
  }
}

@media (max-width: 400px) {
  .form-title {
    font-size: 1.8em;
  }
  .form-subtitle {
    font-size: 0.9em;
  }
}
</style>