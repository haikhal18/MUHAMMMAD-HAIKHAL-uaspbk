// src/stores/mission.js
import { defineStore } from 'pinia';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Fungsi normalisasi data misi dari backend
function normalizeMissionData(mission) {
  return {
    ...mission,
    // JANGAN ubah ID jadi number karena kita pakai ID string seperti "MID-123"
    // id: Number(mission.id), ❌ dihapus agar ID tetap string
    clientId: Number(mission.clientId),
    bounty: Number(mission.bounty),
    assignedNinjaId: mission.assignedNinjaId !== null ? Number(mission.assignedNinjaId) : null,
    applicants: Array.isArray(mission.applicants)
      ? mission.applicants.map(id => Number(id))
      : [],
  };
}

export const useMissionStore = defineStore('mission', {
  state: () => ({
    missions: [],
    currentMission: null,
    loading: false,
    error: null,
  }),

  getters: {
    availableMissions: (state) => state.missions.filter(m => m.status === 'available'),
    activeMissions: (state) => state.missions.filter(m => m.status === 'assigned'),
    completedMissions: (state) => state.missions.filter(m => m.status === 'completed'),
    cancelledMissions: (state) => state.missions.filter(m => m.status === 'cancelled'),
  },

  actions: {
    _setError(message, isLoading = false) {
      this.error = message;
      this.loading = isLoading;
    },

    async fetchAllMissions(filters = {}) {
      this.loading = true;
      this.error = null;
      try {
        const queryParams = new URLSearchParams(filters).toString();
        const url = `${API_BASE_URL}/missions${queryParams ? `?${queryParams}` : ''}`;
        const response = await axios.get(url);
        this.missions = response.data.map(normalizeMissionData);
      } catch (err) {
        console.error('Error fetching all missions:', err);
        this._setError('Gagal memuat daftar misi.');
      } finally {
        this.loading = false;
      }
    },

    async fetchMissionById(id) {
      this.loading = true;
      this.error = null;

      if (!id || typeof id !== 'string') {
        this.error = 'ID misi tidak valid.';
        this.currentMission = null;
        this.loading = false;
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/missions/${id}`);
        this.currentMission = normalizeMissionData(response.data);
      } catch (err) {
        console.error(`Gagal fetch misi ID ${id}:`, err);
        this.error = 'Gagal memuat detail misi.';
        this.currentMission = null;
      } finally {
        this.loading = false;
      }
    },

    async createMission(missionData) {
      this.loading = true;
      this.error = null;

      if (!missionData.id || typeof missionData.id !== 'string') {
        this.error = 'ID misi harus berupa string, misal: MID-123';
        this.loading = false;
        return null;
      }

      try {
        const payloadToSend = {
          ...missionData,
          id: missionData.id, // tetap string
          clientId: String(missionData.clientId), // string juga kalau mau konsisten
          status: 'available',
          applicants: [],
          assignedNinjaId: null,
        };

        const response = await axios.post(`${API_BASE_URL}/missions`, payloadToSend);
        this.missions.push(normalizeMissionData(response.data));
        return response.data;
      } catch (err) {
        console.error('Error creating mission:', err);
        if (err.response && err.response.status === 409) {
          this.error = 'Konflik ID: Misi sudah ada.';
        } else {
          this.error = 'Gagal membuat misi.';
        }
        return null;
      } finally {
        this.loading = false;
      }
    },

    async updateMission(missionId, updatedData) {
      this.loading = true;
      this.error = null;
      try {
        const fullPayload = normalizeMissionData({ id: missionId, ...updatedData });
        const response = await axios.put(`${API_BASE_URL}/missions/${missionId}`, fullPayload);
        const updated = normalizeMissionData(response.data);

        const index = this.missions.findIndex(m => m.id === missionId);
        if (index !== -1) this.missions[index] = updated;
        if (this.currentMission?.id === missionId) this.currentMission = updated;

        return true;
      } catch (err) {
        console.error(`Error updating mission ${missionId}:`, err);
        this._setError('Gagal memperbarui misi.');
        return false;
      } finally {
        this.loading = false;
      }
    },

    async updateMissionStatus(missionId, newStatus) {
      this.loading = true;
      this.error = null;
      try {
        const mission = this.missions.find(m => m.id === missionId);
        if (!mission) {
          this._setError('Misi tidak ditemukan.');
          return false;
        }

        const fullPayload = normalizeMissionData({ ...mission, status: newStatus });
        const response = await axios.put(`${API_BASE_URL}/missions/${missionId}`, fullPayload);
        const updated = normalizeMissionData(response.data);

        const index = this.missions.findIndex(m => m.id === missionId);
        if (index !== -1) this.missions[index] = updated;
        if (this.currentMission?.id === missionId) this.currentMission = updated;

        return true;
      } catch (err) {
        console.error(`Error update status misi ${missionId}:`, err);
        this._setError('Gagal update status misi.');
        return false;
      } finally {
        this.loading = false;
      }
    },

    async deleteMission(id) {
      this.loading = true;
      this.error = null;
      try {
        await axios.delete(`${API_BASE_URL}/missions/${id}`);
        this.missions = this.missions.filter(m => m.id !== id);
        if (this.currentMission?.id === id) this.currentMission = null;
        return true;
      } catch (err) {
        console.error(`Error hapus misi ID ${id}:`, err);
        this._setError('Gagal hapus misi.');
        return false;
      } finally {
        this.loading = false;
      }
    },

    async applyForMission(missionId, ninjaId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_BASE_URL}/missions/${missionId}`);
        let mission = normalizeMissionData(response.data);

        if (!mission.applicants.includes(Number(ninjaId))) {
          mission.applicants.push(Number(ninjaId));
          const updated = await axios.put(`${API_BASE_URL}/missions/${missionId}`, mission);
          const normalized = normalizeMissionData(updated.data);

          const index = this.missions.findIndex(m => m.id === missionId);
          if (index !== -1) this.missions[index] = normalized;
          if (this.currentMission?.id === missionId) this.currentMission = normalized;

          return true;
        } else {
          this._setError('Anda sudah melamar misi ini.');
          return false;
        }
      } catch (err) {
        console.error(`Error melamar misi ${missionId}:`, err);
        this._setError('Gagal melamar misi.');
        return false;
      } finally {
        this.loading = false;
      }
    },

    async assignNinjaToMission(missionId, ninjaId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_BASE_URL}/missions/${missionId}`);
        let mission = normalizeMissionData(response.data);

        mission.assignedNinjaId = Number(ninjaId);
        mission.status = 'assigned';

        const updated = await axios.put(`${API_BASE_URL}/missions/${missionId}`, mission);
        const normalized = normalizeMissionData(updated.data);

        const index = this.missions.findIndex(m => m.id === missionId);
        if (index !== -1) this.missions[index] = normalized;
        if (this.currentMission?.id === missionId) this.currentMission = normalized;

        return true;
      } catch (err) {
        console.error(`Error assign ninja to misi ${missionId}:`, err);
        this._setError('Gagal assign ninja.');
        return false;
      } finally {
        this.loading = false;
      }
    },

    resetState() {
      this.missions = [];
      this.currentMission = null;
      this.loading = false;
      this.error = null;
    }
  },
});
