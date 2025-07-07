<template>
    <div class="contact-page container">
      <section class="contact-hero">
        <h1 class="contact-title">Hubungi Kami</h1>
        <p class="contact-subtitle">Kami selalu siap membantu Anda dalam setiap misi.</p>
      </section>
  
      <section class="contact-info-section">
        <div class="info-card">
          <div class="info-icon"><i class="fas fa-envelope-open-text"></i></div>
          <h3 class="info-title">Dukungan Email</h3>
          <p class="info-description">Untuk pertanyaan umum dan dukungan teknis.</p>
          <a href="mailto:support@stealthops.com" class="contact-link">support@stealthops.com</a>
        </div>
  
        <div class="info-card">
          <div class="info-icon"><i class="fas fa-phone-alt"></i></div>
          <h3 class="info-title">Hotline Darurat</h3>
          <p class="info-description">Hanya untuk situasi kritis dan misi sensitif.</p>
          <a href="tel:+6281234567890" class="contact-link">+62 812-3456-7890</a>
        </div>
  
        <div class="info-card">
          <div class="info-icon"><i class="fas fa-map-marker-alt"></i></div>
          <h3 class="info-title">Markas Pusat</h3>
          <p class="info-description">Lokasi fisik kami (akses terbatas, koordinasi diperlukan).</p>
          <p class="contact-address">
            Hidden Sector 7, Cybernetics City<br>
            Nexus Prime, Andromeda Galaxy
          </p>
        </div>
      </section>
  
      <section class="contact-form-section">
        <h2 class="section-heading"><i class="fas fa-headset"></i> Kirim Pesan Terenkripsi</h2>
        <form @submit.prevent="submitForm" class="contact-form">
          <BaseInput
            label="Nama Lengkap / Alias"
            type="text"
            v-model="formData.name"
            placeholder="Nama panggilan Anda di jaringan"
            :errorMessage="errors.name"
            required
          />
          <BaseInput
            label="Email Anda"
            type="email"
            v-model="formData.email"
            placeholder="Alamat email aktif Anda"
            :errorMessage="errors.email"
            required
          />
          <BaseInput
            label="Subjek Pesan"
            type="text"
            v-model="formData.subject"
            placeholder="Misal: Pertanyaan Misi, Laporan Bug"
            :errorMessage="errors.subject"
            required
          />
          <BaseInput
            label="Pesan Anda"
            type="textarea"
            v-model="formData.message"
            placeholder="Tulis pesan terenkripsi Anda di sini..."
            :errorMessage="errors.message"
            rows="6"
            required
          />
          <BaseButton
            type="submit"
            text="Kirim Pesan"
            :loading="isLoading"
            :disabled="isLoading"
          />
        </form>
  
        <AlertMessage
          v-if="alert.isVisible"
          v-model:isVisible="alert.isVisible"
          :message="alert.message"
          :type="alert.type"
          :auto-dismiss="alert.autoDismiss"
          @dismissed="alert.isVisible = false"
        />
      </section>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import BaseInput from '@/components/common/BaseInput.vue';
  import BaseButton from '@/components/common/BaseButton.vue';
  import AlertMessage from '@/components/common/AlertMessage.vue';
  import axios from 'axios'; // Untuk simulasi pengiriman form
  
  const formData = ref({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const errors = ref({});
  const isLoading = ref(false);
  const alert = ref({
    isVisible: false,
    message: '',
    type: 'info',
    autoDismiss: 3000,
  });
  
  // Fungsi validasi sederhana
  const validateForm = () => {
    errors.value = {}; // Reset error
    if (!formData.value.name) errors.value.name = 'Nama lengkap / alias wajib diisi.';
    if (!formData.value.email) {
      errors.value.email = 'Email wajib diisi.';
    } else if (!/\S+@\S+\.\S+/.test(formData.value.email)) {
      errors.value.email = 'Format email tidak valid.';
    }
    if (!formData.value.subject) errors.value.subject = 'Subjek pesan wajib diisi.';
    if (!formData.value.message) errors.value.message = 'Pesan wajib diisi.';
  
    return Object.keys(errors.value).length === 0;
  };
  
  // Fungsi untuk menampilkan alert
  const showAlert = (message, type, autoDismiss = 3000) => {
    alert.value = {
      isVisible: true,
      message,
      type,
      autoDismiss,
    };
  };
  
  // Fungsi untuk submit form
  const submitForm = async () => {
    if (!validateForm()) {
      showAlert('Harap perbaiki kesalahan pada formulir.', 'error', null); // Manual dismiss
      return;
    }
  
    isLoading.value = true;
    try {
      // Simulasi pengiriman form ke API (json-server tidak mendukung ini langsung tanpa kustomisasi)
      // Dalam dunia nyata, ini akan POST ke endpoint backend Anda
      console.log('Mengirim pesan:', formData.value);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulasi delay API
  
      showAlert('Pesan Anda telah dikirim! Kami akan menghubungi Anda secepatnya.', 'success', 5000);
      // Reset form
      formData.value = {
        name: '',
        email: '',
        subject: '',
        message: '',
      };
    } catch (error) {
      console.error('Gagal mengirim pesan:', error);
      showAlert('Gagal mengirim pesan. Silakan coba lagi nanti.', 'error', null);
    } finally {
      isLoading.value = false;
    }
  };
  </script>
  
  <style scoped>
  /* Scoped styles untuk Contact.vue */
  
  .contact-page {
    padding: var(--spacing-xl) var(--spacing-md);
    max-width: 900px;
    margin: 0 auto;
  }
  
  /* --- Contact Hero Section --- */
  .contact-hero {
    text-align: center;
    margin-bottom: var(--spacing-xl);
    padding: var(--spacing-lg);
    background-color: var(--color-background-card);
    border-radius: var(--border-radius-md);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
    border: 1px solid var(--color-border-card);
  }
  
  .contact-title {
    font-family: var(--font-heading, var(--font-primary));
    font-size: 3em;
    color: var(--color-primary-accent);
    text-shadow: 0 0 10px rgba(233, 69, 96, 0.7);
    margin-bottom: var(--spacing-sm);
  }
  
  .contact-subtitle {
    font-size: 1.2em;
    color: var(--color-text-muted);
    font-style: italic;
  }
  
  /* --- Contact Info Section --- */
  .contact-info-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
  }
  
  .info-card {
    background-color: var(--color-background-card);
    border: 1px solid var(--color-border-card);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-lg);
    text-align: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .info-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
    border-color: var(--color-primary-accent);
  }
  
  .info-icon {
    font-size: 2.8em;
    color: var(--color-secondary-accent);
    margin-bottom: var(--spacing-md);
    text-shadow: 0 0 8px rgba(15, 52, 96, 0.6);
  }
  
  .info-title {
    font-family: var(--font-primary);
    font-size: 1.3em;
    color: var(--color-text-light);
    margin-bottom: var(--spacing-sm);
  }
  
  .info-description {
    font-size: 0.9em;
    color: var(--color-text-muted);
    margin-bottom: var(--spacing-md);
  }
  
  .contact-link {
    font-size: 1em;
    font-weight: bold;
    color: var(--color-primary-accent);
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .contact-link:hover {
    color: #fff;
  }
  
  .contact-address {
    font-size: 0.9em;
    color: var(--color-text-light);
    line-height: 1.4;
  }
  
  /* --- Contact Form Section --- */
  .contact-form-section {
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
  
  .contact-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  /* --- Responsiveness --- */
  @media (max-width: 768px) {
    .contact-title {
      font-size: 2.5em;
    }
    .contact-subtitle {
      font-size: 1em;
    }
    .contact-info-section {
      grid-template-columns: 1fr; /* Kolom tunggal di mobile */
    }
    .info-card {
      padding: var(--spacing-md);
    }
    .contact-form-section {
      padding: var(--spacing-lg);
    }
  }
  
  @media (max-width: 480px) {
    .contact-title {
      font-size: 2em;
    }
    .section-heading {
      font-size: 1.6em;
    }
    .info-icon {
      font-size: 2.2em;
    }
  }
  </style>