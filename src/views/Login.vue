<template>
  <div class="login-page">
    <div class="login-form-card">
      <h2 class="form-title">Akses Jaringan Stealth Ops</h2>
      <p class="form-subtitle">Masuk sebagai Cyber Ninja atau Klien.</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <BaseInput
          id="username"
          label="Username / ID Agen"
          type="text"
          v-model="username"
          placeholder="Masukkan username atau ID unik Anda"
          :errorMessage="authStore.error && authStore.error.includes('Username') ? authStore.error : ''"
          required
        />
        <BaseInput
          id="password"
          label="Kode Akses Terenkripsi"
          type="password"
          v-model="password"
          placeholder="********"
          :errorMessage="authStore.error && authStore.error.includes('password') ? authStore.error : ''"
          required
        />

        <BaseButton
          type="submit"
          text="Login ke Sistem"
          :loading="authStore.loading"
          :disabled="authStore.loading"
        />
      </form>

      <AlertMessage
        v-if="authStore.error && !authStore.loading && showLoginErrorAlert"
        v-model:isVisible="showLoginErrorAlert"
        type="error"
        :message="authStore.error"
        :dismissible="true"
        @dismissed="authStore.error = null" class="login-alert"
      />

      <div class="form-footer">
        <router-link to="/register" class="register-link">
          Belum terdaftar di jaringan? <span class="highlight-link">Bergabung Sekarang</span>
        </router-link>
        </div>
    </div>

    <LoadingSpinner v-if="authStore.loading" :overlay="true" text="Mengautentikasi Data..." />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import AlertMessage from '@/components/common/AlertMessage.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import { nextTick } from 'vue';

const username = ref('');
const password = ref('');
const authStore = useAuthStore();
const router = useRouter();

const showLoginErrorAlert = ref(false);

// Watcher untuk error dari authStore
// Ini akan menampilkan AlertMessage setiap kali authStore.error berubah
watch(() => authStore.error, (newError) => {
  if (newError) {
    showLoginErrorAlert.value = true;
    nextTick(() => {
        // Otomatis hilangkan error alert setelah beberapa detik jika ada
        if (newError.includes('Username') || newError.includes('password') || newError.includes('Terjadi kesalahan')) {
             setTimeout(() => showLoginErrorAlert.value = false, 5000);
        } else {
             // Untuk error lain yang mungkin tidak spesifik, biarkan pengguna menutup manual
        }
    });
  } else {
    showLoginErrorAlert.value = false; // Sembunyikan alert jika error dihapus
  }
});

// Pastikan showLoginErrorAlert diinisialisasi false saat komponen pertama kali dimuat
onMounted(() => {
    showLoginErrorAlert.value = false;
    // Bersihkan error di store saat halaman login dimuat, agar tidak ada error sisa dari sesi sebelumnya
    authStore.error = null;
});


const handleLogin = async () => {
  // Reset error dari store secara eksplisit sebelum mencoba login baru
  authStore.error = null;

  // Lakukan login melalui Pinia authStore
  const success = await authStore.login(username.value, password.value);

  if (success) {
    // Navigasi ke dashboard yang sesuai berdasarkan peran pengguna
    if (authStore.isClient) {
      router.push('/client/dashboard');
    } else if (authStore.isNinja) {
      router.push('/ninja/dashboard');
    }
  } else {
    // Error sudah diatur di authStore, watcher akan menampilkannya
    console.log('Login attempt failed, error shown via alert.');
  }
};
</script>

<style scoped>
/* Scoped styles untuk Login.vue */

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - var(--spacing-xl) * 2); /* Mengkompensasi padding main-content */
  padding: var(--spacing-xl) 0;
  /* Latar belakang utama aplikasi sudah diatur di main.css pada #app */
}

.login-form-card {
  background-color: rgba(26, 26, 46, 0.9); /* Card background gelap semi-transparan */
  border: 1px solid var(--color-border-card);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-xl);
  max-width: 450px; /* Lebar maksimum card login */
  width: 90%; /* Ambil 90% lebar tersedia */
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
  text-align: center;
  position: relative; /* Untuk AlertMessage yang di-posisi-kan absolut jika diperlukan */
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

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

/* Penyesuaian untuk alert di dalam card login */
.login-alert {
  margin-top: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  text-align: left; /* Rata kiri teks alert */
}

.form-footer {
  margin-top: var(--spacing-md);
  font-size: 0.9em;
  color: var(--color-text-muted);
}

.register-link {
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 0.3s ease;
}

.highlight-link {
  color: var(--color-primary-accent); /* Warna aksen untuk link daftar */
  font-weight: bold;
}

.register-link:hover, .highlight-link:hover {
  color: #fff;
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .form-title {
    font-size: 2em;
  }
  .login-form-card {
    padding: var(--spacing-lg);
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