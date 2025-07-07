<template>
    <div :class="['base-input-wrapper', { 'has-error': !!errorMessage }]">
      <label v-if="label" :for="id" class="input-label">{{ label }}</label>
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        @input="handleInput"
        @change="handleChange"
        @blur="handleBlur"
        :class="['base-input-field']"
      />
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="hint" class="input-hint">{{ hint }}</p>
    </div>
  </template>
  
  <script setup>
  import {  computed } from 'vue';
  
  const props = defineProps({
    /**
     * Nilai model untuk two-way binding (v-model).
     */
    modelValue: {
      type: [String, Number],
      default: '',
    },
    /**
     * Tipe input HTML (text, email, password, number, dll.).
     */
    type: {
      type: String,
      default: 'text',
    },
    /**
     * ID unik untuk input, digunakan untuk atribut 'for' label.
     * Jika tidak disediakan, akan dibuat secara otomatis.
     */
    id: {
      type: String,
      default: () => `input-${Math.random().toString(36).substring(2, 9)}`,
    },
    /**
     * Teks label yang ditampilkan di atas input.
     */
    label: {
      type: String,
      default: '',
    },
    /**
     * Teks placeholder yang ditampilkan di dalam input saat kosong.
     */
    placeholder: {
      type: String,
      default: '',
    },
    /**
     * Menentukan apakah input dinonaktifkan.
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * Menentukan apakah input hanya bisa dibaca (tidak bisa diedit).
     */
    readonly: {
      type: Boolean,
      default: false,
    },
    /**
     * Menentukan apakah input wajib diisi.
     */
    required: {
      type: Boolean,
      default: false,
    },
    /**
     * Pesan kesalahan yang ditampilkan di bawah input.
     */
    errorMessage: {
      type: String,
      default: '',
    },
    /**
     * Teks petunjuk yang ditampilkan di bawah input.
     */
    hint: {
      type: String,
      default: '',
    },
  });
  
  const emit = defineEmits(['update:modelValue', 'change', 'blur']);
  
  // Metode untuk mengupdate v-model
  const handleInput = (event) => {
    emit('update:modelValue', event.target.value);
  };
  
  // Metode untuk event change (saat fokus hilang dan nilai berubah)
  const handleChange = (event) => {
    emit('change', event.target.value);
  };
  
  // Metode untuk event blur (saat fokus hilang)
  const handleBlur = (event) => {
    emit('blur', event.target.value);
  };
  </script>
  
  <style scoped>
  /*
    Gaya dasar .base-input-field sudah didefinisikan di src/assets/css/main.css.
    Di sini, kita hanya akan menambahkan gaya untuk layout, label, error, dan hint
    yang spesifik untuk komponen ini.
  */
  
  .base-input-wrapper {
    margin-bottom: var(--spacing-md); /* Jarak antar input field */
  }
  
  .input-label {
    display: block; /* Pastikan label berada di baris sendiri */
    margin-bottom: var(--spacing-sm);
    font-size: 0.9em;
    color: var(--color-text-light); /* Warna teks label */
    font-weight: bold;
  }
  
  /* Gaya untuk input field itu sendiri sudah di main.css */
  /* .base-input-field { ... } */
  
  .base-input-wrapper.has-error .base-input-field {
    border-color: var(--color-primary-accent); /* Border merah muda saat ada error */
    box-shadow: 0 0 0 2px rgba(233, 69, 96, 0.4);
  }
  
  .error-message {
    color: var(--color-primary-accent); /* Warna merah muda neon untuk pesan error */
    font-size: 0.85em;
    margin-top: 5px;
    margin-bottom: 0; /* Override default p margin */
  }
  
  .input-hint {
    color: var(--color-text-muted); /* Warna teks redup untuk hint */
    font-size: 0.8em;
    margin-top: 5px;
    margin-bottom: 0; /* Override default p margin */
  }
  </style>