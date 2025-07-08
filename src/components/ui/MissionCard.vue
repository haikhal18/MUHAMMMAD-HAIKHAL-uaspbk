<template>
  <div class="mission-card">
    <div class="card-header">
      <h3 class="mission-title">{{ mission?.title }}</h3>
      <span
        v-if="mission?.status"
        :class="['mission-status', 'status', `status-${mission.status}`]"
      >
        {{ formatStatus(mission.status) }}
      </span>
    </div>

    <div class="card-body">
      <p class="mission-description">{{ truncatedDescription }}</p>
      <div class="mission-details">
        <div class="detail-item">
          <span class="detail-label">Bayaran:</span>
          <span class="info-value bounty">{{ formattedBounty }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Deadline:</span>
          <span class="info-value deadline">{{ formattedDeadline }}</span>
        </div>
        <div class="detail-item" v-if="mission?.requiredSkills?.length">
          <span class="detail-label">Keahlian Dibutuhkan:</span>
          <div class="info-value skills">
            <span
              v-for="skill in mission.requiredSkills"
              :key="skill"
              class="skill-tag"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="card-footer">
      <RouterLink
        v-if="mission?.id"
        :to="generateDetailLink()"
        class="detail-link view-detail-button"
      >
        Detail Misi
      </RouterLink>
      <slot name="actions" />
    </div>
  </div>
</template>


<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
  mission: {
    type: Object,
    required: true,
  },
});

const auth = useAuthStore();

const truncatedDescription = computed(() => {
  const desc = props.mission?.description || '';
  return desc.length > 150 ? desc.slice(0, 150) + '...' : desc;
});

const formattedBounty = computed(() => {
  return props.mission?.bounty?.toLocaleString('id-ID') || '0';
});

const formattedDeadline = computed(() => {
  if (!props.mission?.deadline) return 'N/A';
  const date = new Date(props.mission.deadline);
  const day = date.getDate();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
});

const formatStatus = (status) => {
  const map = {
    available: 'Tersedia',
    assigned: 'Ditugaskan',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  };
  return map[status] || status;
};

const generateDetailLink = () => {
  const id = props.mission.id;
  if (auth.isAuthenticated) {
    if (auth.user.role === 'client') return `/client/missions/${id}`;
    if (auth.user.role === 'ninja') return `/ninja/missions/${id}`;
  }
  return `/missions/${id}`;
};
</script>

<style scoped>
.mission-card {
  background-color: var(--color-background-card);
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
  flex-wrap: wrap;
}

.mission-title {
  font-family: var(--font-heading, var(--font-primary));
  font-size: 1.5em;
  color: var(--color-primary-accent);
  margin: 0;
  flex-grow: 1;
  margin-right: var(--spacing-sm);
}

.status {
  padding: 5px 10px;
  border-radius: var(--border-radius-sm);
  font-size: 0.8em;
  font-weight: bold;
  text-transform: uppercase;
  color: var(--color-text-light);
  white-space: nowrap;
}

.status-available {
  background-color: rgba(76, 175, 80, 0.2);
  border: 1px solid #4caf50;
  color: #4caf50;
}
.status-assigned {
  background-color: rgba(15, 52, 96, 0.3);
  border: 1px solid var(--color-secondary-accent);
  color: var(--color-secondary-accent);
}
.status-completed {
  background-color: rgba(138, 43, 226, 0.2);
  border: 1px solid #8a2be2;
  color: #8a2be2;
}
.status-cancelled {
  background-color: rgba(233, 69, 96, 0.2);
  border: 1px solid var(--color-primary-accent);
  color: var(--color-primary-accent);
}

.card-body {
  flex-grow: 1;
  margin-bottom: var(--spacing-md);
}

.description {
  font-size: 0.95em;
  color: var(--color-text-light);
  margin-bottom: var(--spacing-md);
}

.mission-details {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-sm);
  font-size: 0.9em;
}

.detail-item {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 5px;
}

.detail-label {
  font-weight: bold;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.info-value {
  color: var(--color-text-light);
  flex-grow: 1;
}

.info-value.bounty {
  color: #4caf50;
  font-weight: bold;
  font-size: 1.1em;
}

.info-value.deadline {
  color: var(--color-primary-accent);
}

.skill-tag {
  background-color: rgba(74, 74, 110, 0.5);
  color: var(--color-text-light);
  padding: 3px 8px;
  border-radius: var(--border-radius-sm);
  font-size: 0.75em;
  white-space: nowrap;
  display: inline-block;
  margin-right: 5px;
  margin-bottom: 5px;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  margin-top: var(--spacing-md);
  gap: var(--spacing-sm);
  padding-top: var(--spacing-sm);
  border-top: 1px solid rgba(74, 74, 110, 0.2);
}

.card-footer .base-button {
  padding: 5px 10px;
  font-size: 0.85em;
  min-width: 100px;
  text-align: center;
  justify-content: center;
  box-sizing: border-box;
}

.card-footer .view-detail-button {
  min-width: 100px;
}

@media (min-width: 600px) {
  .mission-details {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
    flex-direction: column;
    align-items: stretch;
  }
  .card-footer .base-button,
  .card-footer .view-detail-button {
    min-width: unset;
    width: 100%;
  }
}
</style>
