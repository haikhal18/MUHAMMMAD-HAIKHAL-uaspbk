<template>
  <div class="mission-card">
    <div class="card-header">
      <h3 class="mission-title">{{ mission?.title }}</h3>
      <span :class="['mission-status', `status-${mission?.status}`]">{{ formatStatus(mission?.status) }}</span>
    </div>

    <div class="card-body">
      <p class="mission-description">{{ truncateDescription(mission?.description) }}</p>
      <div class="mission-details">
        <div class="detail-item">
          <span class="detail-label">Bayaran:</span>
          <span class="info-value bounty">${{ mission?.bounty?.toLocaleString() }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Deadline:</span>
          <span class="info-value deadline">{{ formatDate(mission?.deadline) }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Keahlian Dibutuhkan:</span>
          <div class="info-value skills">
            <span v-for="skill in mission?.requiredSkills" :key="skill" class="skill-tag">{{ skill }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card-footer">
      <slot name="actions"></slot>
      </div>
  </div>
</template>

<script setup>
import {  computed } from 'vue';

const props = defineProps({
  /**
   * Objek misi yang akan ditampilkan.
   */
  mission: {
    type: Object,
    required: true,
    validator: (value) => {
      return (
        // PERBAIKAN DI SINI: Izinkan ID berupa number ATAU string
        (typeof value.id === 'number' || typeof value.id === 'string') && 
        typeof value.title === 'string' &&
        typeof value.description === 'string' &&
        typeof value.bounty === 'number' && // Pastikan bounty adalah number
        typeof value.deadline === 'string' && // Pastikan deadline adalah string (YYYY-MM-DD)
        Array.isArray(value.requiredSkills) && // Pastikan requiredSkills adalah array
        typeof value.status === 'string' // Pastikan status adalah string
      );
    },
  },
});

// Fungsi untuk memotong deskripsi jika terlalu panjang
const truncateDescription = (description, maxLength = 150) => {
  if (!description) return ''; // Tambahkan penanganan jika description undefined
  if (description.length <= maxLength) {
    return description;
  }
  return description.substring(0, maxLength) + '...';
};

// Fungsi untuk memformat tanggal
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  // Menggunakan 'id-ID' secara eksplisit untuk konsistensi di test dan browser
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Fungsi untuk memformat status agar lebih mudah dibaca
const formatStatus = (status) => {
  const statusMap = {
    available: 'Tersedia',
    assigned: 'Ditugaskan',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  };
  return statusMap[status] || status;
};
</script>

<style scoped>
/* Scoped styles untuk MissionCard */
.mission-card {
  background-color: var(--color-background-card); /* Ungu gelap kebiruan */
  border: 1px solid var(--color-border-card);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.mission-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
  flex-wrap: wrap; /* Untuk responsif */
}

.mission-title {
  font-family: var(--font-heading, var(--font-primary));
  font-size: 1.5em;
  color: var(--color-primary-accent);
  margin: 0; /* Override default h3 margin */
  flex-grow: 1; /* Agar judul mengambil ruang */
  margin-right: var(--spacing-sm); /* Jarak dengan status */
}

.mission-status {
  padding: 5px 10px;
  border-radius: var(--border-radius-sm);
  font-size: 0.8em;
  font-weight: bold;
  text-transform: uppercase;
  color: var(--color-text-light);
  white-space: nowrap; /* Mencegah status pecah baris */
}

/* Gaya status berdasarkan warnanya */
.status-available {
  background-color: rgba(76, 175, 80, 0.2); /* Hijau transparan */
  border: 1px solid #4CAF50;
  color: #4CAF50;
}
.status-assigned {
  background-color: rgba(15, 52, 96, 0.3); /* Biru tua transparan */
  border: 1px solid var(--color-secondary-accent);
  color: var(--color-secondary-accent);
}
.status-completed {
  background-color: rgba(138, 43, 226, 0.2); /* Ungu transparan */
  border: 1px solid #8A2BE2;
  color: #8A2BE2;
}
.status-cancelled {
  background-color: rgba(233, 69, 96, 0.2); /* Merah muda transparan */
  border: 1px solid var(--color-primary-accent);
  color: var(--color-primary-accent);
}

.card-body {
  flex-grow: 1; /* Pastikan body mengisi ruang yang tersisa */
  margin-bottom: var(--spacing-md);
}

.mission-description {
  font-size: 0.95em;
  color: var(--color-text-light);
  margin-bottom: var(--spacing-md);
}

.mission-details {
  display: grid;
  grid-template-columns: 1fr; /* Default 1 kolom */
  gap: var(--spacing-sm);
  font-size: 0.9em;
}

.detail-item {
  display: flex;
  flex-wrap: wrap; /* Agar label dan value bisa wrap jika terlalu panjang */
  align-items: baseline;
  gap: 5px; /* Jarak antara label dan value */
}

.detail-label {
  font-weight: bold;
  color: var(--color-text-muted);
  flex-shrink: 0; /* Jangan menyusut */
}

.info-value { /* Menggunakan info-value karena ini adalah kelas umum untuk nilai info */
  color: var(--color-text-light);
  flex-grow: 1; /* Value mengisi sisa ruang */
}

.info-value.bounty {
  color: #4CAF50; /* Warna hijau untuk bayaran */
  font-weight: bold;
  font-size: 1.1em;
}

.info-value.deadline {
  color: var(--color-primary-accent); /* Warna aksen untuk deadline */
}

.skill-tag {
  background-color: rgba(74, 74, 110, 0.5);
  color: var(--color-text-light);
  padding: 3px 8px;
  border-radius: var(--border-radius-sm);
  font-size: 0.75em;
  white-space: nowrap;
  display: inline-block; /* Untuk margin antar tag */
  margin-right: 5px;
  margin-bottom: 5px;
}

.card-footer {
  display: flex;
  justify-content: flex-end; /* Tombol ke kanan */
  align-items: center;
  flex-wrap: wrap; /* PENTING: Izinkan tombol untuk wrap ke baris baru */
  margin-top: var(--spacing-md);
  gap: var(--spacing-sm); /* Jarak antar tombol */
  padding-top: var(--spacing-sm);
  border-top: 1px solid rgba(74, 74, 110, 0.2); /* Garis pemisah opsional */
}

/* Gaya khusus untuk TOMBOL di dalam card-footer MissionCard */
.card-footer .base-button {
    padding: 5px 10px; /* Perkecil padding tombol */
    font-size: 0.85em; /* Perkecil ukuran font */
    min-width: 100px; /* PENTING: Atur lebar minimum yang seragam (sesuaikan nilai ini) */
    text-align: center; /* Pastikan teks di tengah */
    justify-content: center; /* Untuk flex items, pusatkan konten */
    box-sizing: border-box; /* Agar padding dan border tidak menambah lebar total */
}

/* Khusus untuk router-link yang juga berperan sebagai tombol di slot (misal: "Lihat Detail") */
.card-footer .view-detail-button {
    min-width: 100px; /* Pastikan juga router-link Lihat Detail punya min-width yang sama */
}


/* Responsive adjustments */
@media (min-width: 600px) {
  .mission-details {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* 2 kolom pada layar lebih lebar */
  }
}

@media (max-width: 480px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  .mission-title {
    margin-right: 0;
  }
  .card-footer {
    flex-direction: column; /* Tombol jadi tumpuk pada layar sangat kecil */
    align-items: stretch; /* Tombol mengambil lebar penuh */
  }
  /* Tombol ambil lebar penuh di mobile */
  .card-footer .base-button,
  .card-footer .view-detail-button {
    min-width: unset; /* Hapus min-width di mobile */
    width: 100%; /* Tombol ambil lebar penuh di mobile */
  }
}
</style>