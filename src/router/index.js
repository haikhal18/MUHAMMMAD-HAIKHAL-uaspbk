// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // Import Pinia authStore

// --- Import Layout Components ---
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import ClientLayout from '@/layouts/ClientLayout.vue';
import NinjaLayout from '@/layouts/NinjaLayout.vue';

// --- Import View Components (Halaman) ---
// Halaman Publik
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
import Contact from '@/views/Contact.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import MissionsPublic from '@/views/MissionsPublic.vue';
import NotFound from '@/views/NotFound.vue'; // Halaman 404

// Halaman Klien (Client Dashboard)
import ClientDashboard from '@/views/client/ClientDashboard.vue';
import ClientMissions from '@/views/client/ClientMissions.vue';
import ClientNewMission from '@/views/client/ClientNewMission.vue';
import ClientMissionDetail from '@/views/client/ClientMissionDetail.vue';
import ClientEditMission from '@/views/client/ClientEditMission.vue'; // <--- Tambah import ini
import ClientProfile from '@/views/client/ClientProfile.vue';

// Halaman Ninja (Ninja Dashboard)
import NinjaDashboard from '@/views/ninja/NinjaDashboard.vue';
import NinjaAvailableMissions from '@/views/ninja/NinjaAvailableMissions.vue';
import NinjaAppliedMissions from '@/views/ninja/NinjaAppliedMissions.vue';
import NinjaActiveMissions from '@/views/ninja/NinjaActiveMissions.vue';
import NinjaCompletedMissions from '@/views/ninja/NinjaCompletedMissions.vue';
import NinjaMissionDetail from '@/views/ninja/NinjaMissionDetail.vue';
import NinjaProfile from '@/views/ninja/NinjaProfile.vue';

// --- Definisi Rute Aplikasi ---
const routes = [
  // --- Rute Publik (Menggunakan DefaultLayout) ---
  {
    path: '/',
    component: DefaultLayout, // Semua child route ini akan menggunakan DefaultLayout
    children: [
      {
        path: '', // Rute kosong berarti ini adalah rute default untuk '/'
        name: 'Home',
        component: Home,
      },
      {
        path: 'missions',
        name: 'MissionsPublic',
        component: MissionsPublic,
      },
      {
        path: 'about',
        name: 'About',
        component: About,
      },
      {
        path: 'contact',
        name: 'Contact',
        component: Contact,
      },
      {
        path: 'login',
        name: 'Login',
        component: Login,
      },
      {
        path: 'register',
        name: 'Register',
        component: Register,
      },
    ],
  },

  // --- Rute Klien (Menggunakan ClientLayout) ---
  {
    path: '/client',
    component: ClientLayout, // Semua child route ini akan menggunakan ClientLayout
    meta: { requiresAuth: true, role: 'client' }, // Metadata untuk Navigation Guard
    children: [
      {
        path: 'dashboard',
        name: 'ClientDashboard',
        component: ClientDashboard,
      },
      {
        path: 'missions', // Daftar semua misi yang diposting klien
        name: 'ClientMissions',
        component: ClientMissions,
      },
      {
        path: 'missions/new', // Form untuk posting misi baru
        name: 'ClientNewMission',
        component: ClientNewMission,
      },
      {
        path: 'missions/:id', // Detail misi spesifik klien
        name: 'ClientMissionDetail',
        component: ClientMissionDetail,
        props: true, // Memungkinkan parameter :id diakses sebagai prop di komponen
      },
      {
        path: 'missions/:id/edit', // <--- Rute baru untuk Edit Misi
        name: 'ClientEditMission',
        component: ClientEditMission,
        props: true, // Untuk melewati ID misi sebagai prop
      },
      {
        path: 'profile', // Profil klien
        name: 'ClientProfile',
        component: ClientProfile,
      },
    ],
  },

  // --- Rute Ninja (Menggunakan NinjaLayout) ---
  {
    path: '/ninja',
    component: NinjaLayout, // Semua child route ini akan menggunakan NinjaLayout
    meta: { requiresAuth: true, role: 'ninja' }, // Metadata untuk Navigation Guard
    children: [
      {
        path: 'dashboard',
        name: 'NinjaDashboard',
        component: NinjaDashboard,
      },
      {
        path: 'missions/available', // Misi yang tersedia untuk dilamar
        name: 'NinjaAvailableMissions',
        component: NinjaAvailableMissions,
      },
      {
        path: 'missions/applied', // Misi yang sudah dilamar
        name: 'NinjaAppliedMissions',
        component: NinjaAppliedMissions,
      },
      {
        path: 'missions/active', // Misi yang sedang aktif dikerjakan
        name: 'NinjaActiveMissions',
        component: NinjaActiveMissions,
      },
      {
        path: 'missions/completed', // Misi yang sudah selesai
        name: 'NinjaCompletedMissions',
        component: NinjaCompletedMissions,
      },
      {
        path: 'missions/:id', // Detail misi spesifik ninja (bisa untuk melamar, update progres)
        name: 'NinjaMissionDetail',
        component: NinjaMissionDetail,
        props: true, // Memungkinkan parameter :id diakses sebagai prop di komponen
      },
      {
        path: 'profile', // Profil ninja
        name: 'NinjaProfile',
        component: NinjaProfile,
      },
    ],
  },

  // --- Catch-all 404 Route ---
  // Ini HARUS menjadi rute terakhir dalam array `routes`
  {
    path: '/:pathMatch(.*)*', // Menangkap semua URL yang tidak cocok dengan rute di atasnya
    name: 'NotFound',
    component: NotFound,
  },
];

// --- Inisialisasi Router ---
const router = createRouter({
  history: createWebHistory(), // Menggunakan HTML5 History API untuk URL bersih
  routes, // Menggunakan definisi rute yang telah dibuat
  // Opsi scroll behavior (opsional)
  scrollBehavior(to, from, savedPosition) {
    // Selalu scroll ke atas saat navigasi ke rute baru
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// --- Navigation Guard (Middleware Routing) ---
router.beforeEach((to, from, next) => {
  // Dapatkan instance authStore (penting: harus di dalam beforeEach/per navigasi)
  const authStore = useAuthStore();

  const requiresAuth = to.meta.requiresAuth; // Cek apakah rute memerlukan otentikasi
  const requiredRole = to.meta.role;       // Cek peran yang diperlukan (jika ada)

  if (requiresAuth && !authStore.isAuthenticated) {
    // Jika rute memerlukan otentikasi TAPI pengguna belum login
    console.log(`Nav Guard: Redirecting to login. Route '${to.path}' requires authentication.`);
    next({ name: 'Login', query: { redirect: to.fullPath } }); // Redirect ke halaman Login
  } else if (requiresAuth && authStore.isAuthenticated) {
    // Jika rute memerlukan otentikasi DAN pengguna sudah login
    if (requiredRole && authStore.userRole !== requiredRole) {
      // Jika rute memerlukan peran spesifik TAPI peran pengguna tidak cocok
      console.warn(`Nav Guard: Access denied for '${to.path}'. User '${authStore.user?.username}' is a '${authStore.userRole}', but '${requiredRole}' is required.`);
      // Redirect ke dashboard yang sesuai dengan peran pengguna, atau ke halaman 403 (Unauthorized)
      if (authStore.isClient) {
        next({ name: 'ClientDashboard' });
      } else if (authStore.isNinja) {
        next({ name: 'NinjaDashboard' });
      } else {
        // Fallback jika peran tidak dikenal
        next({ name: 'Home' });
      }
    } else {
      // Pengguna sudah login dan memiliki peran yang benar (atau rute tidak memerlukan peran spesifik)
      next(); // Lanjutkan ke rute
    }
  } else {
    // Rute tidak memerlukan otentikasi (misal: Home, Login, Register, MissionsPublic, About, Contact, NotFound)
    // Atau jika pengguna sudah login dan mencoba mengakses Login/Register,
    // mungkin kita ingin mengarahkan mereka ke dashboard mereka.
    if (to.name === 'Login' || to.name === 'Register') {
      if (authStore.isAuthenticated) {
        console.log(`Nav Guard: Redirecting authenticated user from '${to.path}' to dashboard.`);
        if (authStore.isClient) {
          next({ name: 'ClientDashboard' });
        } else if (authStore.isNinja) {
          next({ name: 'NinjaDashboard' });
        } else {
          next({ name: 'Home' }); // Fallback
        }
      } else {
        next(); // Belum login, lanjutkan ke Login/Register
      }
    } else {
      next(); // Lanjutkan ke rute publik
    }
  }
});

export default router;