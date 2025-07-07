<template>
    <button
      :type="type"
      :disabled="disabled"
      :class="['base-button', variant, { 'loading': loading }]"
      @click="handleClick"
    >
      <slot v-if="!loading">
        {{ text }}
      </slot>
      <span v-else class="loading-spinner"></span>
      </button>
  </template>
  
  <script setup>

  
  const props = defineProps({
    /**
     * Tipe tombol HTML (submit, button, reset)
     * @values 'submit', 'button', 'reset'
     */
    type: {
      type: String,
      default: 'button',
      validator: (value) => ['submit', 'button', 'reset'].includes(value),
    },
    /**
     * Teks yang akan ditampilkan pada tombol jika tidak menggunakan slot.
     */
    text: {
      type: String,
      default: '',
    },
    /**
     * Varian gaya tombol (akan menambah kelas CSS).
     * Contoh: 'primary', 'secondary', 'danger', 'outline'.
     * Pastikan gaya untuk varian ini didefinisikan di main.css atau di scoped style komponen ini.
     */
    variant: {
      type: String,
      default: 'primary', // Default ke primary (sesuai gaya di main.css)
    },
    /**
     * Menentukan apakah tombol dinonaktifkan.
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * Menampilkan status loading pada tombol.
     */
    loading: {
      type: Boolean,
      default: false,
    },
  });
  
  const emit = defineEmits(['click']);
  
  const handleClick = (event) => {
    if (!props.disabled && !props.loading) {
      emit('click', event);
    }
  };
  </script>
  
  <style scoped>
  /*
    Gaya dasar .base-button sudah didefinisikan di src/assets/css/main.css.
    Di sini, kita hanya akan menambahkan gaya untuk varian atau efek loading
    yang spesifik untuk komponen ini atau yang tidak ada di main.css.
  */
  
  /* Varian Tombol (contoh, sesuaikan dengan kebutuhan Anda) */
  .base-button.primary {
    background-color: var(--color-primary-accent); /* Merah muda neon */
    color: var(--color-text-light);
  }
  .base-button.primary:hover {
    background-color: var(--color-secondary-accent); /* Biru tua */
  }
  
  .base-button.secondary {
    background-color: var(--color-secondary-accent); /* Biru tua */
    color: var(--color-text-light);
  }
  .base-button.secondary:hover {
    background-color: var(--color-primary-accent); /* Merah muda neon */
  }
  
  .base-button.danger {
    background-color: #dc3545; /* Merah untuk bahaya */
    color: var(--color-text-light);
  }
  .base-button.danger:hover {
    background-color: #c82333;
  }
  
  .base-button.outline {
    background-color: transparent;
    border: 1px solid var(--color-primary-accent);
    color: var(--color-primary-accent);
    box-shadow: none;
  }
  .base-button.outline:hover {
    background-color: rgba(233, 69, 96, 0.1);
    box-shadow: 0 0 10px rgba(233, 69, 96, 0.5);
    transform: translateY(-2px);
  }
  
  /* Gaya untuk status loading */
  .base-button.loading {
    cursor: not-allowed;
    opacity: 0.7;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .loading-spinner {
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid #fff;
    border-radius: 50%;
    width: 1em; /* Mengikuti ukuran font tombol */
    height: 1em; /* Mengikuti ukuran font tombol */
    animation: spin 1s linear infinite;
    display: inline-block; /* Pastikan spinner terlihat */
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>