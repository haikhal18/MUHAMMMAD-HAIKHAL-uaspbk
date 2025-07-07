<template>
  <aside class="client-sidebar">
    <div class="sidebar-header">
      <router-link to="/client/dashboard" class="dashboard-link">
        <i class="fas fa-chart-line icon"></i>
        <span class="text">Dashboard Klien</span>
      </router-link>
    </div>

    <nav class="sidebar-nav">
      <ul>
        <li>
          <router-link to="/client/missions/new" active-class="active-sidebar-link">
            <i class="fas fa-plus-circle icon"></i>
            <span class="text">Posting Misi Baru</span>
          </router-link>
        </li>
        <li>
          <router-link to="/client/missions" active-class="active-sidebar-link">
            <i class="fas fa-list-alt icon"></i>
            <span class="text">Misi Saya</span>
          </router-link>
        </li>
        <li>
          <router-link to="/client/profile" active-class="active-sidebar-link">
            <i class="fas fa-user-circle icon"></i>
            <span class="text">Profil Klien</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <router-link to="#" @click.prevent="handleLogout" class="logout-link">
        <i class="fas fa-sign-out-alt icon"></i>
        <span class="text">Logout</span>
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.client-sidebar {
  background-color: var(--color-background-card);
  padding: var(--spacing-lg) var(--spacing-md);
  width: 250px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(74, 74, 110, 0.5);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  left: 0;
  z-index: 999;
}

.sidebar-header {
  padding-bottom: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  border-bottom: 1px dashed rgba(74, 74, 110, 0.3);
}

.dashboard-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
  font-size: 1.3em;
  font-weight: bold;
  color: var(--color-primary-accent);
  text-shadow: 0 0 5px rgba(233, 69, 96, 0.5);
  transition: color 0.3s ease;
}

.dashboard-link:hover {
  color: #fff;
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
  background-color: rgba(15, 52, 96, 0.5);
  color: var(--color-primary-accent);
  transform: translateX(5px);
}

.sidebar-nav a .icon {
  font-size: 1.1em;
  color: var(--color-text-muted);
  width: 20px;
  text-align: center;
}

.sidebar-nav a.active-sidebar-link {
  background-color: var(--color-secondary-accent);
  color: var(--color-text-light);
  font-weight: bold;
  box-shadow: 0 0 10px rgba(15, 52, 96, 0.7);
}

.sidebar-nav a.active-sidebar-link .icon {
  color: var(--color-primary-accent);
}

.sidebar-footer {
  margin-top: auto;
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
  color: var(--color-text-muted);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.logout-link:hover {
  background-color: rgba(153, 0, 0, 0.3);
  color: var(--color-primary-accent);
}

.logout-link .icon {
  font-size: 1.1em;
  width: 20px;
  text-align: center;
}

@media (max-width: 992px) {
  .client-sidebar {
    width: 200px;
  }

  .dashboard-link .text,
  .sidebar-nav a .text,
  .logout-link .text {
    font-size: 0.9em;
  }
}

@media (max-width: 768px) {
  .client-sidebar {
    position: fixed;
    height: 100%;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    box-shadow: 5px 0 15px rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  .client-sidebar.is-open {
    transform: translateX(0);
  }

  .client-sidebar .text {
    display: none;
  }

  .client-sidebar .sidebar-nav a,
  .client-sidebar .dashboard-link,
  .client-sidebar .logout-link {
    justify-content: center;
    padding: var(--spacing-md);
  }

  .client-sidebar .sidebar-nav a .icon,
  .client-sidebar .dashboard-link .icon,
  .client-sidebar .logout-link .icon {
    font-size: 1.5em;
  }

  .client-sidebar .sidebar-header,
  .client-sidebar .sidebar-footer {
    border: none;
    padding: var(--spacing-sm);
  }
}
</style>
