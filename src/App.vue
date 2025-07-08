<template>
  <div id="app">
    <AppHeader />

    <main class="main-content">
      <router-view />
    </main>

    <AppFooter />

    <AlertMessage
      v-if="uiStore.currentNotification.isVisible"
      v-model:isVisible="uiStore.currentNotification.isVisible"
      :message="uiStore.currentNotification.message"
      :type="uiStore.currentNotification.type"
      :auto-dismiss="uiStore.currentNotification.autoDismiss"
      :dismissible="uiStore.currentNotification.autoDismiss === null || uiStore.currentNotification.autoDismiss === 0"
      @dismissed="uiStore.hideNotification()"
      class="global-alert-position"
    />

    <LoadingSpinner v-if="uiStore.globalLoading" :overlay="true" text="Memproses data..." />
  </div>
</template>

<script setup>
import AppHeader from '@/components/common/AppHeader.vue';
import AppFooter from '@/components/common/AppFooter.vue';
import AlertMessage from '@/components/common/AlertMessage.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';

import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useUiStore } from '@/stores/ui';

const authStore = useAuthStore();
const uiStore = useUiStore();

onMounted(() => {
  authStore.initializeAuth();
});
</script>

<style>

#app {
  font-family: var(--font-primary);
  background-color: var(--color-background-dark);
  color: var(--color-text-light);
  line-height: 1.6;
  overflow-x: hidden;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  background-image: url('./assets/images/cyber-ninja-merah.jpg'); 
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  background-attachment: fixed;

  position: relative;
  z-index: 0;
}

#app::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(2px);
  z-index: -1;
}

/* Gaya dasar untuk area konten utama (ini juga bisa ada di main.css) */
/* Namun, jika Anda ingin App.vue mengatur tata letak flexbox vertikal,
   maka flex-grow pada main-content juga relevan di sini. */
.main-content {
  flex-grow: 1;
  padding: var(--spacing-xl) var(--spacing-md); /* Menambahkan padding horizontal di sini untuk konsistensi */
  width: 100%;
  box-sizing: border-box;
}

/* Gaya untuk posisi alert global */
.global-alert-position {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  /* Menambah background agar lebih terlihat */
  background-color: var(--color-background-card); 
  border: 1px solid var(--color-border-card);
}
</style>