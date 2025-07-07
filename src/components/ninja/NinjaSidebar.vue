<template>
    <aside class="ninja-sidebar" :class="{ 'is-open': isOpen }">
      <div class="sidebar-header">
        <router-link to="/ninja/dashboard" class="dashboard-link">
          <i class="fas fa-desktop icon"></i>
          <span class="text">Dashboard Ninja</span>
        </router-link>
      </div>
  
      <nav class="sidebar-nav">
        <ul>
          <li>
            <router-link to="/ninja/missions/available" active-class="active-sidebar-link">
              <i class="fas fa-eye icon"></i>
              <span class="text">Misi Tersedia</span>
            </router-link>
          </li>
          <li>
            <router-link to="/ninja/missions/applied" active-class="active-sidebar-link">
              <i class="fas fa-inbox icon"></i>
              <span class="text">Misi Dilamar</span>
            </router-link>
          </li>
          <li>
            <router-link to="/ninja/missions/active" active-class="active-sidebar-link">
              <i class="fas fa-running icon"></i>
              <span class="text">Misi Aktif</span>
            </router-link>
          </li>
          <li>
            <router-link to="/ninja/missions/completed" active-class="active-sidebar-link">
              <i class="fas fa-check-circle icon"></i>
              <span class="text">Misi Selesai</span>
            </router-link>
          </li>
          <li>
            <router-link to="/ninja/profile" active-class="active-sidebar-link">
              <i class="fas fa-user-ninja icon"></i>
              <span class="text">Profil Ninja</span>
            </router-link>
          </li>
        </ul>
      </nav>
  
      <div class="sidebar-footer">
        <router-link to="#" @click="handleLogout" class="logout-link">
          <i class="fas fa-sign-out-alt icon"></i>
          <span class="text">Logout</span>
        </router-link>
      </div>
    </aside>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth'; // Sesuaikan path jika berbeda
 
  
  const props = defineProps({ // Definisikan prop isOpen untuk mobile toggle
    isOpen: {
      type: Boolean,
      default: false
    }
  });
  
  const authStore = useAuthStore();
  const router = useRouter();
  
  const handleLogout = () => {
    authStore.logout();
    router.push('/login'); // Redirect ke halaman login setelah logout
  };
  </script>
  
  <style scoped>
  /* Scoped styles untuk NinjaSidebar */
  .ninja-sidebar {
    background-color: var(--color-background-card); /* Ungu gelap kebiruan */
    padding: var(--spacing-lg) var(--spacing-md);
    width: 250px; /* Lebar sidebar */
    min-height: 100vh; /* Pastikan sidebar setinggi viewport */
    display: flex;
    flex-direction: column;
    border-right: 1px solid rgba(74, 74, 110, 0.5); /* Border kanan */
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
    position: sticky; /* Agar tetap di tempat saat di-scroll */
    top: 0;
    left: 0;
    z-index: 999; /* Pastikan di atas konten utama jika perlu */
  }
  
  .sidebar-header {
    padding-bottom: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
    border-bottom: 1px dashed rgba(74, 74, 110, 0.3); /* Garis putus-putus */
  }
  
  .dashboard-link {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    text-decoration: none;
    font-size: 1.3em;
    font-weight: bold;
    color: var(--color-primary-accent); /* Warna aksen untuk judul dashboard */
    text-shadow: 0 0 5px rgba(233, 69, 96, 0.5);
    transition: color 0.3s ease;
  }
  
  .dashboard-link:hover {
    color: #fff; /* Warna terang saat hover */
  }
  
  .dashboard-link .icon {
    font-size: 1.2em;
  }
  
  .sidebar-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .sidebar-nav li {
    margin-bottom: var(--spacing-sm);
  }
  
  .sidebar-nav a {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-sm);
    text-decoration: none;
    color: var(--color-text-light);
    transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
  }
  
  .sidebar-nav a:hover {
    background-color: rgba(15, 52, 96, 0.5); /* Biru tua transparan saat hover */
    color: var(--color-primary-accent);
    transform: translateX(5px); /* Efek slide sedikit */
  }
  
  .sidebar-nav a .icon {
    font-size: 1.1em;
    color: var(--color-text-muted); /* Warna ikon default */
    width: 20px; /* Lebar tetap untuk ikon */
    text-align: center;
  }
  
  /* Gaya untuk link aktif */
  .sidebar-nav a.active-sidebar-link {
    background-color: var(--color-secondary-accent); /* Biru tua solid */
    color: var(--color-text-light);
    font-weight: bold;
    box-shadow: 0 0 10px rgba(15, 52, 96, 0.7);
  }
  
  .sidebar-nav a.active-sidebar-link .icon {
    color: var(--color-primary-accent); /* Ikon berubah warna saat aktif */
  }
  
  .sidebar-footer {
    margin-top: auto; /* Mendorong footer ke bagian bawah sidebar */
    padding-top: var(--spacing-lg);
    border-top: 1px dashed rgba(74, 74, 110, 0.3);
  }
  
  .logout-link {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-sm);
    text-decoration: none;
    color: var(--color-text-muted); /* Warna redup untuk logout */
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  .logout-link:hover {
    background-color: rgba(153, 0, 0, 0.3); /* Merah gelap transparan */
    color: var(--color-primary-accent);
  }
  
  .logout-link .icon {
    font-size: 1.1em;
    width: 20px;
    text-align: center;
  }
  
  /* Responsiveness */
  @media (max-width: 992px) {
    .ninja-sidebar {
      width: 200px; /* Perkecil sidebar pada ukuran tablet */
    }
    .dashboard-link .text,
    .sidebar-nav a .text,
    .logout-link .text {
      font-size: 0.9em;
    }
  }
  
  @media (max-width: 768px) {
    /* Pada mobile, sidebar bisa diubah menjadi menu toggle atau hidden */
    .ninja-sidebar {
      position: fixed; /* Ubah menjadi fixed untuk mobile overlay */
      height: 100%;
      transform: translateX(-100%); /* Sembunyikan secara default */
      transition: transform 0.3s ease-in-out;
      box-shadow: 5px 0 15px rgba(0, 0, 0, 0.5);
      z-index: 1000;
    }
    /* Kelas untuk menampilkan sidebar (dikelola oleh parent Layout) */
    .ninja-sidebar.is-open {
      transform: translateX(0);
    }
    /* Sembunyikan teks dan tampilkan hanya ikon */
    .ninja-sidebar .text {
      display: none;
    }
    .ninja-sidebar .sidebar-nav a,
    .ninja-sidebar .dashboard-link,
    .ninja-sidebar .logout-link {
      justify-content: center; /* Rata tengah ikon */
      padding: var(--spacing-md);
    }
    .ninja-sidebar .sidebar-nav a .icon,
    .ninja-sidebar .dashboard-link .icon,
    .ninja-sidebar .logout-link .icon {
      font-size: 1.5em; /* Perbesar ikon */
    }
    .ninja-sidebar .sidebar-header,
    .ninja-sidebar .sidebar-footer {
      border: none; /* Hilangkan border di mobile */
      padding: var(--spacing-sm);
    }
  }
  </style>