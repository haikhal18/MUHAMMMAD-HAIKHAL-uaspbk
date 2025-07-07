<template>
    <div v-if="isVisible" :class="['alert-message', typeClass, { 'fade-out': fadingOut }]">
      <div class="alert-content">
        <slot>
          {{ message }}
        </slot>
      </div>
      <button v-if="dismissible" @click="dismiss" class="alert-dismiss-btn" aria-label="Tutup Notifikasi">
        &times;
      </button>
    </div>
  </template>
  
  <script setup>
  import { computed, ref, watch, onMounted } from 'vue';
  
  const props = defineProps({
    /**
     * Teks pesan yang akan ditampilkan.
     */
    message: {
      type: String,
      default: '',
    },
    /**
     * Tipe alert untuk styling.
     * @values 'info', 'success', 'warning', 'error'
     */
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['info', 'success', 'warning', 'error'].includes(value),
    },
    /**
     * Menentukan apakah alert bisa ditutup oleh pengguna.
     */
    dismissible: {
      type: Boolean,
      default: true,
    },
    /**
     * Durasi (dalam milidetik) sebelum alert otomatis hilang.
     * Set ke 0 atau null untuk tidak otomatis hilang.
     */
    autoDismiss: {
      type: [Number, null],
      default: null, // Default tidak otomatis hilang
    },
    /**
     * Kontrol visibilitas alert dari parent.
     * Digunakan dengan v-model:isVisible
     */
    isVisible: {
      type: Boolean,
      default: false,
    },
  });
  
  const emit = defineEmits(['update:isVisible', 'dismissed']);
  
  const fadingOut = ref(false);
  let dismissTimeout = null;
  
  // Computed property untuk kelas CSS berdasarkan tipe alert
  const typeClass = computed(() => `alert-${props.type}`);
  
  // Fungsi untuk menutup alert
  const dismiss = () => {
    fadingOut.value = true;
    // Beri waktu untuk animasi fade-out sebelum benar-benar menyembunyikan
    setTimeout(() => {
      emit('update:isVisible', false); // Update v-model
      emit('dismissed'); // Emit event bahwa alert sudah ditutup
      fadingOut.value = false; // Reset fade-out status
    }, 300); // Durasi transisi fade-out
  };
  
  // Watcher untuk properti isVisible dan autoDismiss
  watch(() => props.isVisible, (newValue) => {
    if (newValue && props.autoDismiss) {
      // Clear timeout sebelumnya jika ada untuk menghindari duplikasi
      if (dismissTimeout) {
        clearTimeout(dismissTimeout);
      }
      // Set timeout untuk dismiss otomatis
      dismissTimeout = setTimeout(() => {
        dismiss();
      }, props.autoDismiss);
    } else if (!newValue && dismissTimeout) {
      // Clear timeout jika alert disembunyikan secara eksternal
      clearTimeout(dismissTimeout);
      dismissTimeout = null;
    }
  }, { immediate: true }); // Jalankan watcher segera saat komponen dimuat
  
  // Pastikan timeout dibersihkan saat komponen di-unmount
  onMounted(() => {
    if (props.isVisible && props.autoDismiss) {
      dismissTimeout = setTimeout(() => {
        dismiss();
      }, props.autoDismiss);
    }
  });
  </script>
  
  <style scoped>
  /* Gaya dasar untuk alert container */
  .alert-message {
    padding: var(--spacing-md);
    border-radius: var(--border-radius-sm);
    margin-bottom: var(--spacing-md);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    font-size: 0.95em;
    line-height: 1.4;
    opacity: 1;
    transition: opacity 0.3s ease-out; /* Transisi untuk fade-out */
  }
  
  /* Gaya untuk konten alert (jika ada slot) */
  .alert-content {
    flex-grow: 1; /* Konten alert akan mengisi ruang yang tersedia */
  }
  
  /* Gaya untuk tombol dismiss */
  .alert-dismiss-btn {
    background: none;
    border: none;
    color: inherit; /* Menggunakan warna teks dari parent */
    font-size: 1.5em;
    line-height: 1;
    cursor: pointer;
    padding: 0 5px;
    margin-left: var(--spacing-sm);
    opacity: 0.7;
    transition: opacity 0.2s ease;
  }
  
  .alert-dismiss-btn:hover {
    opacity: 1;
  }
  
  /* --- Tipe Alert Styling --- */
  
  /* Info */
  .alert-info {
    background-color: rgba(15, 52, 96, 0.2); /* Warna biru tua transparan */
    border: 1px solid var(--color-secondary-accent);
    color: var(--color-text-light);
  }
  
  /* Success */
  .alert-success {
    background-color: rgba(76, 175, 80, 0.15); /* Hijau transparan */
    border: 1px solid #4CAF50;
    color: #4CAF50;
  }
  
  /* Warning */
  .alert-warning {
    background-color: rgba(255, 193, 7, 0.15); /* Kuning transparan */
    border: 1px solid #ffc107;
    color: #ffc107;
  }
  
  /* Error */
  .alert-error {
    background-color: rgba(233, 69, 96, 0.15); /* Merah muda neon transparan */
    border: 1px solid var(--color-primary-accent);
    color: var(--color-primary-accent);
  }
  
  /* Gaya untuk fade-out effect */
  .alert-message.fade-out {
    opacity: 0;
  }
  </style>