<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <router-link to="/" class="logo-link">
          <img
            src="@/assets/images/logo.png"
            alt="Stealth Ops Dispatch Logo"
            class="logo-img"
            v-if="logoExists"
          />
          <span class="logo-text" v-else>STEALTH OPS</span>
        </router-link>

        <nav class="main-nav">
          <ul>
            <li><router-link to="/" active-class="active-link">Home</router-link></li>
            <li><router-link to="/missions" active-class="active-link">Misi Publik</router-link></li>
            <li><router-link to="/about" active-class="active-link">Tentang</router-link></li>
            <li><router-link to="/contact" active-class="active-link">Kontak</router-link></li>
          </ul>
        </nav>

        <div class="auth-buttons">
          <template v-if="!authStore.isAuthenticated">
            <router-link to="/login" class="base-button login-button">Login</router-link>
            <router-link to="/register" class="base-button register-button">Daftar</router-link>
          </template>
          <template v-else>
            <router-link :to="dashboardLink" class="base-button dashboard-button">
              Dashboard {{ authStore.userRole === 'client' ? 'Klien' : 'Ninja' }}
            </router-link>
            <button @click="handleLogout" class="base-button logout-button">Logout</button>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const dashboardLink = computed(() => {
  if (authStore.userRole === 'client') return '/client/dashboard';
  if (authStore.userRole === 'ninja') return '/ninja/dashboard';
  return '/';
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const logoExists = ref(true);
onMounted(() => {
  const img = new Image();
  img.src = new URL('@/assets/images/logo.png', import.meta.url).href;
  img.onerror = () => {
    logoExists.value = false;
  };
});
</script>

<style scoped>
.app-header {
  backdrop-filter: blur(10px);
  background-color: rgba(12, 12, 12, 0.85);
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid rgba(74, 74, 110, 0.5);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-img {
  height: 40px;
  margin-right: 10px;
}

.logo-text {
  font-family: var(--font-heading, 'Orbitron', sans-serif);
  font-size: 2em;
  font-weight: bold;
  color: var(--color-primary-accent);
  text-shadow: 0 0 10px rgba(255, 0, 51, 0.7), 0 0 5px rgba(255, 0, 51, 0.5);
  letter-spacing: 2px;
  transition: color 0.3s ease;
}

.logo-link:hover .logo-text {
  color: #ff5577;
  text-shadow: 0 0 12px rgba(255, 85, 119, 0.7);
}

.main-nav ul {
  list-style: none;
  display: flex;
  gap: var(--spacing-lg);
}

.main-nav a {
  color: var(--color-text-light);
  font-size: 1em;
  padding: 6px 10px;
  position: relative;
  font-weight: 500;
  transition: all 0.3s ease-in-out;
}

.main-nav a:hover {
  color: var(--color-primary-accent);
  text-shadow: 0 0 6px rgba(255, 0, 51, 0.5);
}

.main-nav a.active-link {
  color: var(--color-primary-accent);
  font-weight: bold;
  text-shadow: 0 0 8px rgba(233, 69, 96, 0.7);
}

.main-nav a.active-link::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--color-primary-accent);
  box-shadow: 0 0 8px rgba(255, 0, 51, 0.6);
  border-radius: 2px;
  transition: 0.3s ease-in-out;
}

.auth-buttons {
  display: flex;
  gap: var(--spacing-sm);
}

.base-button {
  padding: var(--spacing-sm) var(--spacing-md);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.login-button {
  background-color: var(--color-secondary-accent);
}

.login-button:hover {
  background-color: var(--color-button-hover);
}

.register-button {
  background-color: transparent;
  border: 1px solid var(--color-primary-accent);
  color: var(--color-primary-accent);
  box-shadow: none;
}

.register-button:hover {
  background-color: rgba(233, 69, 96, 0.1);
  box-shadow: 0 0 10px rgba(233, 69, 96, 0.5);
  transform: translateY(-2px);
}

.dashboard-button {
  background-color: #3f0099;
  box-shadow: 0 0 8px rgba(63, 0, 153, 0.3);
}

.dashboard-button:hover {
  background-color: #2a0066;
  box-shadow: 0 0 12px rgba(63, 0, 153, 0.5);
}

.logout-button {
  background-color: #990000;
}

.logout-button:hover {
  background-color: #660000;
}

@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--spacing-md);
  }

  .main-nav {
    flex-basis: 100%;
    order: 3;
    margin-top: var(--spacing-md);
  }

  .main-nav ul {
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }

  .logo-link,
  .auth-buttons {
    flex-basis: 48%;
    justify-content: center;
  }

  .logo-link {
    order: 1;
  }

  .auth-buttons {
    order: 2;
  }
}

@media (max-width: 480px) {
  .logo-text {
    font-size: 1.5em;
  }

  .auth-buttons {
    flex-direction: column;
    width: 100%;
  }

  .base-button {
    width: 100%;
  }
}
</style>
