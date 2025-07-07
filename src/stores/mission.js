// src/stores/mission.js
import { defineStore } from 'pinia';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

function normalizeMissionData(mission) {
  return {
    ...mission,
    id: Number(mission.id),
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
    availableMissions: (state) => state.missions.filter(mission => mission.status === 'available'),
    activeMissions: (state) => state.missions.filter(mission => mission.status === 'assigned'),
    completedMissions: (state) => state.missions.filter(mission => mission.status === 'completed'),
    cancelledMissions: (state) => state.missions.filter(mission => mission.status === 'cancelled'),
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
        console.log('Fetched all missions:', this.missions.length);
      } catch (err) {
        console.error('Error fetching all missions:', err);
        this._setError('Gagal memuat daftar misi. Coba lagi nanti.');
      } finally {
        this.loading = false;
      }
    },

    async fetchMissionById(id) {
      this.loading = true;
      this.error = null;
    
      const numericId = Number(id);
      if (!Number.isInteger(numericId) || numericId <= 0) {
        this.error = 'ID misi tidak valid.';
        this.currentMission = null;
        this.loading = false;
        return;
      }
    
      try {
        const response = await axios.get(`${API_BASE_URL}/missions/${numericId}`);
        this.currentMission = normalizeMissionData(response.data);
        console.log(`✅ [fetchMissionById] Berhasil fetch misi ID ${this.currentMission.id}`);
      } catch (err) {
        console.error(`❌ Error fetching mission with ID ${numericId}:`, err);
        this.error = 'Gagal memuat detail misi. Misi mungkin tidak ditemukan.';
        this.currentMission = null;
      } finally {
        this.loading = false;
      }
    },
    

    async createMission(missionData) {
      this.loading = true;
      this.error = null;
      try {
        const payloadToSend = normalizeMissionData({
          ...missionData,
          // Pastikan ID dan clientId dikonversi menjadi string saat dikirim
          id: String(missionData.id),
          clientId: String(missionData.clientId),
          status: 'available',
          applicants: [],
          assignedNinjaId: null,
        });
    
        const response = await axios.post(`${API_BASE_URL}/missions`, payloadToSend);
        this.missions.push(normalizeMissionData(response.data));
        console.log('✅ Misi dibuat dengan ID:', response.data.id);
        return response.data;
      } catch (err) {
        console.error('❌ Error creating mission:', err);
        if (err.response && err.response.status === 409) {
          this.error = 'Konflik ID: Misi dengan ID ini sudah ada.';
        } else {
          this.error = 'Terjadi kesalahan saat membuat misi. Coba lagi nanti.';
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
        const response = await axios.put(`${API_BASE_URL}/missions/${Number(missionId)}`, fullPayload);
        
        const updated = normalizeMissionData(response.data);
    
        const index = this.missions.findIndex(m => Number(m.id) === Number(missionId));
        if (index !== -1) {
          this.missions[index] = updated;
        }
        if (this.currentMission && Number(this.currentMission.id) === Number(missionId)) {
          this.currentMission = updated;
        }
    
        console.log(`Misi ${missionId} berhasil diperbarui.`);
        return true;
      } catch (err) {
        console.error(`Error memperbarui misi ${missionId}:`, err);
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
        const mission = this.missions.find(m => Number(m.id) === Number(missionId));
        if (!mission) {
          this._setError('Misi tidak ditemukan.');
          return false;
        }
    
        // Pastikan semua data yang dikirim memiliki tipe number konsisten
        const fullPayload = normalizeMissionData({
          ...mission,
          status: newStatus,
        });
    
        const response = await axios.put(`${API_BASE_URL}/missions/${Number(missionId)}`, fullPayload);
        const updated = normalizeMissionData(response.data);
    
        const index = this.missions.findIndex(m => Number(m.id) === Number(missionId));
        if (index !== -1) {
          this.missions[index] = updated;
        }
        if (this.currentMission && Number(this.currentMission.id) === Number(missionId)) {
          this.currentMission = updated;
        }
        console.log(`Status misi ${missionId} diperbarui ke ${newStatus}.`);
        return true;
      } catch (err) {
        console.error(`Error memperbarui status misi untuk ${missionId}:`, err);
        this._setError(`Gagal mengubah status misi ke ${newStatus}.`);
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    async deleteMission(id) {
      this.loading = true;
      this.error = null;
      try {
        await axios.delete(`${API_BASE_URL}/missions/${Number(id)}`);
        this.missions = this.missions.filter(m => Number(m.id) !== Number(id));
        if (this.currentMission && Number(this.currentMission.id) === Number(id)) {
          this.currentMission = null;
        }
        console.log('Misi dihapus:', id);
        return true;
      } catch (err) {
        console.error(`Error menghapus misi dengan ID ${id}:`, err);
        this._setError('Gagal menghapus misi. Coba lagi.');
        return false;
      } finally {
        this.loading = false;
      }
    },

    async applyForMission(missionId, ninjaId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_BASE_URL}/missions/${Number(missionId)}`);
        let mission = normalizeMissionData(response.data);

        if (!mission.applicants.includes(Number(ninjaId))) {
          mission.applicants.push(Number(ninjaId));
          const updatedMission = await axios.put(`${API_BASE_URL}/missions/${Number(missionId)}`, mission);
          const normalized = normalizeMissionData(updatedMission.data);

          const index = this.missions.findIndex(m => Number(m.id) === Number(missionId));
          if (index !== -1) {
            this.missions[index] = normalized;
          }
          if (this.currentMission && Number(this.currentMission.id) === Number(missionId)) {
            this.currentMission = normalized;
          }
          console.log(`Ninja ${ninjaId} melamar misi ${missionId}.`);
          return true;
        } else {
          this._setError('Anda sudah melamar misi ini.');
          return false;
        }
      } catch (err) {
        console.error(`Error melamar misi ${missionId}:`, err);
        this._setError('Gagal melamar misi. Coba lagi nanti.');
        return false;
      } finally {
        this.loading = false;
      }
    },

    async assignNinjaToMission(missionId, ninjaId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_BASE_URL}/missions/${Number(missionId)}`);
        let mission = normalizeMissionData(response.data);

        mission.assignedNinjaId = Number(ninjaId);
        mission.status = 'assigned';

        const updatedMission = await axios.put(`${API_BASE_URL}/missions/${Number(missionId)}`, mission);
        const normalized = normalizeMissionData(updatedMission.data);

        const index = this.missions.findIndex(m => Number(m.id) === Number(missionId));
        if (index !== -1) {
          this.missions[index] = normalized;
        }
        if (this.currentMission && Number(this.currentMission.id) === Number(missionId)) {
          this.currentMission = normalized;
        }
        console.log(`Misi ${missionId} ditugaskan ke Ninja ${ninjaId}.`);
        return true;
      } catch (err) {
        console.error(`Error menugaskan ninja ke misi ${missionId}:`, err);
        this._setError('Gagal menugaskan ninja ke misi.');
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
      console.log('Mission store state reset.');
    }
  },
});
