// src/stores/ui.js
import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    // Global Loading State
    globalLoading: false, // Digunakan untuk overlay loading penuh halaman

    // Notification/Toast/Snackbar State
    notification: {
      isVisible: false,
      message: '',
      type: 'info', // 'info', 'success', 'warning', 'error'
      autoDismiss: 3000, // Durasi (ms) otomatis hilang, null untuk tidak otomatis
      id: null, // ID unik untuk setiap notifikasi
    },

    // Global Modal State (opsional, jika Anda ingin modal yang dikontrol dari store)
    // globalModal: {
    //   isVisible: false,
    //   title: '',
    //   content: null, // Bisa berupa komponen atau string HTML
    //   maxWidth: '600px',
    //   disableClose: false,
    //   resolve: null, // Untuk menahan Promise saat menunggu konfirmasi modal
    //   reject: null,
    // },
  }),

  getters: {
    // Getter untuk mendapatkan properti notifikasi saat ini
    currentNotification: (state) => state.notification,
  },

  actions: {
    /**
     * Mengatur status loading global.
     * @param {boolean} status - True untuk menampilkan loading, false untuk menyembunyikan.
     */
    setGlobalLoading(status) {
      this.globalLoading = status;
    },

    /**
     * Menampilkan notifikasi (toast/snackbar).
     * @param {string} message - Pesan notifikasi.
     * @param {'info'|'success'|'warning'|'error'} [type='info'] - Tipe notifikasi untuk styling.
     * @param {number|null} [autoDismiss=3000] - Durasi (ms) sebelum otomatis hilang. Null untuk tidak otomatis.
     */
    showNotification(message, type = 'info', autoDismiss = 3000) {
      // Pastikan notifikasi sebelumnya bersih jika ada
      if (this.notification.id) {
        clearTimeout(this.notification.id);
      }

      this.notification = {
        isVisible: true,
        message,
        type,
        autoDismiss,
        // Buat ID unik agar watch di komponen AlertMessage bisa mendeteksi perubahan
        id: setTimeout(() => {
            // Ini akan dipanggil setelah autoDismiss waktu berlalu
            // Kita biarkan AlertMessage.vue yang mengelola dismiss/fade-out
            // Namun, jika Anda tidak menggunakan autoDismiss di komponen AlertMessage,
            // Anda bisa panggil hideNotification di sini:
            // this.hideNotification();
        }, autoDismiss || 0), // Jika autoDismiss null, gunakan 0 untuk langsung dieksekusi (atau tidak)
      };
      // Jika autoDismiss adalah null, jangan set timeout di sini,
      // biarkan komponen AlertMessage yang mengontrolnya sepenuhnya dengan `dismissible: true`.
      if (autoDismiss === null) {
          clearTimeout(this.notification.id); // Batalkan timeout jika diset null
          this.notification.id = null;
      }
    },

    /**
     * Menyembunyikan notifikasi.
     * Biasanya dipanggil oleh komponen AlertMessage itu sendiri saat ditutup.
     */
    hideNotification() {
      if (this.notification.id) {
        clearTimeout(this.notification.id);
        this.notification.id = null;
      }
      this.notification.isVisible = false;
      this.notification.message = '';
      this.notification.type = 'info';
      this.notification.autoDismiss = 3000;
    },

  
    
    resetState() {
      this.globalLoading = false;
      this.notification = {
        isVisible: false,
        message: '',
        type: 'info',
        autoDismiss: 3000,
        id: null,
      };
      // this.hideGlobalModal(); // Jika ada global modal
      console.log('UI store state reset.');
    }
  },
});