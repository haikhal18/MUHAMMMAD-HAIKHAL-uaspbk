<template>
    <transition name="modal-fade">
      <div class="modal-backdrop" v-if="isVisible" @click.self="handleClickBackdrop">
        <div class="modal-dialog" :style="modalStyle" role="dialog" aria-modal="true" :aria-labelledby="modalTitleId">
          <header class="modal-header">
            <h3 :id="modalTitleId" class="modal-title">{{ title }}</h3>
            <button
              type="button"
              class="modal-close-button"
              @click="close"
              aria-label="Tutup dialog"
              v-if="!disableClose"
            >
              &times;
            </button>
          </header>
  
          <section class="modal-body">
            <slot></slot>
          </section>
  
          <footer class="modal-footer" v-if="$slots.footer">
            <slot name="footer"></slot>
          </footer>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup>
  import { computed, watch, onMounted, onUnmounted } from 'vue';
  
  const props = defineProps({
    /**
     * Judul modal yang ditampilkan di header.
     */
    title: {
      type: String,
      default: 'Informasi',
    },
    /**
     * Kontrol visibilitas modal. Gunakan dengan v-model:isVisible.
     */
    isVisible: {
      type: Boolean,
      default: false,
    },
    /**
     * Lebar maksimum modal (misal: '500px', '80%').
     */
    maxWidth: {
      type: String,
      default: '600px',
    },
    /**
     * Menentukan apakah modal bisa ditutup dengan mengklik backdrop atau tombol close.
     */
    disableClose: {
      type: Boolean,
      default: false, // Default bisa ditutup
    },
  });
  
  const emit = defineEmits(['update:isVisible', 'close']);
  
  // ID unik untuk judul modal agar bisa diakses oleh aria-labelledby
  const modalTitleId = computed(() => `modal-title-${Math.random().toString(36).substring(2, 9)}`);
  
  // Style dinamis untuk modal berdasarkan maxWidth
  const modalStyle = computed(() => ({
    'max-width': props.maxWidth,
  }));
  
  // Fungsi untuk menutup modal
  const close = () => {
    if (!props.disableClose) {
      emit('update:isVisible', false); // Update v-model
      emit('close'); // Emit event close
    }
  };
  
  // Handle klik pada backdrop
  const handleClickBackdrop = () => {
    if (!props.disableClose) {
      close();
    }
  };
  
  // Efek samping: mengelola scroll body saat modal terbuka/tertutup
  watch(() => props.isVisible, (newVal) => {
    if (newVal) {
      document.body.style.overflow = 'hidden'; // Nonaktifkan scroll body
    } else {
      document.body.style.overflow = ''; // Aktifkan kembali scroll body
    }
  });
  
  // Listener untuk menutup modal dengan tombol ESC
  const handleKeydown = (event) => {
    if (props.isVisible && event.key === 'Escape' && !props.disableClose) {
      close();
    }
  };
  
  // Tambahkan/hapus event listener saat komponen mount/unmount
  onMounted(() => {
    document.addEventListener('keydown', handleKeydown);
  });
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
    // Pastikan scroll body dikembalikan jika komponen di-unmount saat modal terbuka
    document.body.style.overflow = '';
  });
  </script>
  
  <style scoped>
  /* --- Backdrop --- */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7); /* Background gelap transparan */
    backdrop-filter: blur(8px); /* Efek blur yang kuat */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000; /* Pastikan di atas semua elemen lain */
  }
  
  /* --- Modal Dialog --- */
  .modal-dialog {
    background-color: var(--color-background-card); /* Latar belakang card */
    border: 1px solid var(--color-border-card);
    border-radius: var(--border-radius-md);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.7);
    padding: var(--spacing-lg);
    position: relative;
    width: 90%; /* Default width */
    max-height: 90vh; /* Agar tidak melebihi tinggi viewport */
    display: flex;
    flex-direction: column;
    overflow: hidden; /* Mengatur overflow jika konten terlalu panjang */
  }
  
  /* --- Modal Header --- */
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
    border-bottom: 1px solid rgba(74, 74, 110, 0.3); /* Garis bawah pada header */
    padding-bottom: var(--spacing-sm);
  }
  
  .modal-title {
    font-family: var(--font-heading, var(--font-primary));
    color: var(--color-primary-accent);
    margin: 0; /* Override default h3 margin */
    font-size: 1.6em;
    text-shadow: 0 0 5px rgba(233, 69, 96, 0.5);
  }
  
  .modal-close-button {
    background: none;
    border: none;
    font-size: 2em;
    color: var(--color-text-muted);
    cursor: pointer;
    padding: 0;
    line-height: 1;
    transition: color 0.3s ease, transform 0.2s ease;
  }
  
  .modal-close-button:hover {
    color: var(--color-primary-accent);
    transform: rotate(90deg);
  }
  
  /* --- Modal Body --- */
  .modal-body {
    flex-grow: 1; /* Konten body mengisi sisa ruang */
    overflow-y: auto; /* Aktifkan scroll jika kontennya panjang */
    padding-top: var(--spacing-md); /* Sedikit padding atas */
    padding-bottom: var(--spacing-md);
  }
  
  /* --- Modal Footer (opsional) --- */
  .modal-footer {
    margin-top: var(--spacing-md);
    padding-top: var(--spacing-sm);
    border-top: 1px solid rgba(74, 74, 110, 0.3); /* Garis atas pada footer */
    display: flex;
    justify-content: flex-end; /* Tombol di footer rata kanan */
    gap: var(--spacing-sm);
  }
  
  /* --- Transisi Modal (Vue Transition) --- */
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
  }
  
  /* Transisi untuk scale-in/scale-out (opsional, bisa digabung dengan opacity) */
  /*
  .modal-fade-enter-active .modal-dialog,
  .modal-fade-leave-active .modal-dialog {
    transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  }
  
  .modal-fade-enter-from .modal-dialog,
  .modal-fade-leave-to .modal-dialog {
    transform: scale(0.9);
  }
  */
  
  /* Responsiveness */
  @media (max-width: 600px) {
    .modal-dialog {
      width: 95%; /* Lebih lebar pada layar kecil */
      padding: var(--spacing-md);
    }
    .modal-title {
      font-size: 1.4em;
    }
  }
  </style>