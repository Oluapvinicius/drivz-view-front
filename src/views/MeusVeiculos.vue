<template>
  <div class="veiculos-container">
    <div class="header">
      <button class="header__menu-toggle">
        
      </button>
      <div class="header__logo">
        <img src="../assets/logo.svg" alt="DRIVEZ" />
      </div>
      <button class="header__back" @click="$router.back()">Voltar</button>
    </div>

    <div class="content">
      <h1 class="page-title">MEUS VEÍCULOS</h1>

      <div v-if="vehicles.length === 0" class="empty-state">
        <p>Nenhum veículo adicionado ainda</p>
      </div>

      <div v-else class="vehicles-list">
        <div v-for="(vehicle, index) in vehicles" :key="index" class="vehicle-card">
          <div class="vehicle-card__labels">
            <span class="vehicle-card__label vehicle-card__id-label">ID</span>
            <span class="vehicle-card__label vehicle-card__placa-label">PLACA</span>
            <span class="vehicle-card__label vehicle-card__renavam-label">RENAVAM</span>
            <span class="vehicle-card__label vehicle-card__validade-label">VALIDADE DOC.</span>
            <span class="vehicle-card__label vehicle-card__categoria-label">CATEGORIA</span>
            <span class="vehicle-card__actions-label"></span>
          </div>
          <div class="vehicle-card__header">
            <span class="vehicle-card__id">{{ index + 1 }}</span>
            <span class="vehicle-card__placa">{{ vehicle.placa }}</span>
            <span class="vehicle-card__renavam">{{ vehicle.renavam }}</span>
            <span class="vehicle-card__validade">{{ vehicle.validadeDoc }}</span>
            <div class="vehicle-card__categoria">
              <span class="categoria-badge">{{ vehicle.categoria }}</span>
            </div>
            <div class="vehicle-card__actions">
              <button class="edit-btn" @click="toggleEditMenu(index)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                </svg>
              </button>
              <div v-if="editMenuOpen === index" class="edit-menu">
                <button @click="editVehicle(index)">Editar</button>
                <button @click="deleteVehicle(index)">Deletar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button class="fab-button" @click="showAddDialog = true">
      <span>+</span>
    </button>

    <div v-if="showAddDialog" class="modal-overlay" @click="showAddDialog = false">
      <div class="modal-content" @click.stop>
        <h2>Criar novo veículo?</h2>
        <p>Deseja adicionar um novo veículo à sua frota?</p>
        <div class="modal-buttons">
          <button class="btn-cancel" @click="showAddDialog = false">Não</button>
          <button class="btn-confirm" @click="confirmAddVehicle">Sim</button>
        </div>
      </div>
    </div>

    <div v-if="showVehicleForm" class="modal-overlay" @click="closeVehicleForm">
      <div class="modal-content form-modal" @click.stop>
        <h2>{{ isEditing ? 'Editar Veículo' : 'Adicionar Veículo' }}</h2>
        
        <div class="form-group">
          <label>Placa *</label>
          <input v-model="formData.placa" type="text" placeholder="ABC-1234" maxlength="8" />
        </div>

        <div class="form-group">
          <label>RENAVAM *</label>
          <input v-model="formData.renavam" type="text" placeholder="00000000000" maxlength="11" />
        </div>

        <div class="form-group">
          <label>Validade do Documento *</label>
          <input v-model="formData.validadeDoc" type="date" />
        </div>

        <div class="form-group">
          <label>Categoria *</label>
          <select v-model="formData.categoria">
            <option value="">Selecione uma categoria</option>
            <option value="SEDAN">SEDAN</option>
            <option value="SUV">SUV</option>
            <option value="PICKUP">PICKUP</option>
            <option value="VAN">VAN</option>
            <option value="CAMINHÃO">CAMINHÃO</option>
          </select>
        </div>

        <div class="modal-buttons">
          <button class="btn-cancel" @click="closeVehicleForm">Cancelar</button>
          <button class="btn-confirm" @click="saveVehicle" :disabled="!isFormValid">
            {{ isEditing ? 'Atualizar' : 'Adicionar' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="showSaveConfirm" class="modal-overlay" @click="showSaveConfirm = false">
      <div class="modal-content confirm-modal" @click.stop>
        <h2>Salvar Alterações?</h2>
        <div class="modal-buttons">
          <button class="btn-cancel" @click="showSaveConfirm = false">CANCELAR</button>
          <button class="btn-confirm confirm-green" @click="confirmSave">CONFIRMAR</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MeusVeiculos',
  data() {
    return {
      vehicles: [],
      showAddDialog: false,
      showVehicleForm: false,
      showSaveConfirm: false,
      editMenuOpen: null,
      isEditing: false,
      editingIndex: null,
      formData: {
        id: null,
        placa: '',
        renavam: '',
        validadeDoc: '',
        categoria: ''
      },
      loading: false,
      apiAvailable: true
    }
  },
  computed: {
    isFormValid() {
      return (
        this.formData.placa.trim() !== '' &&
        this.formData.renavam.trim() !== '' &&
        this.formData.validadeDoc !== '' &&
        this.formData.categoria !== ''
      );
    }
  },
  methods: {
    async loadVehicles() {
      this.loading = true;
      try {
        const { listarVeiculos } = await import('@/requests/veiculo');
        const apiVehicles = await listarVeiculos();
        if (Array.isArray(apiVehicles) && apiVehicles.length > 0) {
          this.vehicles = apiVehicles;
          localStorage.setItem('meusVeiculos', JSON.stringify(this.vehicles));
        } else {
          // fallback to local storage
          const stored = localStorage.getItem('meusVeiculos');
          this.vehicles = stored ? JSON.parse(stored) : [];
        }
        this.apiAvailable = true;
      } catch (e) {
        console.warn('API unavailable, using local data', e.message);
        this.apiAvailable = false;
        const stored = localStorage.getItem('meusVeiculos');
        this.vehicles = stored ? JSON.parse(stored) : [];
      } finally {
        this.loading = false;
      }
    },
    confirmAddVehicle() {
      this.showAddDialog = false;
      this.resetForm();
      this.isEditing = false;
      this.showVehicleForm = true;
    },
    toggleEditMenu(index) {
      this.editMenuOpen = this.editMenuOpen === index ? null : index;
    },
    editVehicle(index) {
      this.isEditing = true;
      this.editingIndex = index;
      const vehicle = this.vehicles[index];
      this.formData = {
        placa: vehicle.placa,
        renavam: vehicle.renavam,
        validadeDoc: vehicle.validadeDoc,
        categoria: vehicle.categoria
      };
      this.showVehicleForm = true;
      this.editMenuOpen = null;
    },
    async deleteVehicle(index) {
      if (confirm('Tem certeza que deseja deletar este veículo?')) {
        const vehicle = this.vehicles[index];
        // optimistic UI
        this.vehicles.splice(index, 1);
        this.editMenuOpen = null;
        localStorage.setItem('meusVeiculos', JSON.stringify(this.vehicles));

        if (this.apiAvailable && vehicle && vehicle.id) {
          const { deletarVeiculo } = await import('@/requests/veiculo');
          try {
            await deletarVeiculo(vehicle.id);
          } catch (e) {
            console.error('Erro ao deletar no backend:', e.message);
            // Revert UI
            this.vehicles.splice(index, 0, vehicle);
            localStorage.setItem('meusVeiculos', JSON.stringify(this.vehicles));
            alert('Falha ao deletar no servidor. Tente novamente.');
          }
        }
      }
    },
    async saveVehicle() {
      if (!this.isFormValid) return;
      this.showVehicleForm = false;
      this.showSaveConfirm = true;
    },
    async confirmSave() {
      if (this.isEditing) {
        const idx = this.editingIndex;
        const updated = {
          id: this.formData.id,
          placa: this.formData.placa.toUpperCase(),
          renavam: this.formData.renavam,
          validadeDoc: this.formData.validadeDoc,
          categoria: this.formData.categoria
        };

        // optimistic update
        this.vehicles.splice(idx, 1, updated);
        localStorage.setItem('meusVeiculos', JSON.stringify(this.vehicles));

        if (this.apiAvailable && updated.id) {
          const { atualizarVeiculo } = await import('@/requests/veiculo');
          try {
            await atualizarVeiculo(updated.id, updated);
            alert('Veículo atualizado com sucesso!');
          } catch (e) {
            console.error('Erro ao atualizar no backend:', e.message);
            alert('Falha ao atualizar no servidor. Dados mantidos localmente.');
            this.apiAvailable = false;
          }
        } else {
          alert('Veículo atualizado localmente.');
        }
      } else {
        const newVehicle = {
          placa: this.formData.placa.toUpperCase(),
          renavam: this.formData.renavam,
          validadeDoc: this.formData.validadeDoc,
          categoria: this.formData.categoria
        };

        if (this.apiAvailable) {
          const { criarVeiculo } = await import('@/requests/veiculo');
          try {
            const res = await criarVeiculo(newVehicle);
            // if backend returns created item, map id; otherwise fallback generate id
            const createdId = res && (res.veiculo && res.veiculo.id ? res.veiculo.id : res.id) || (Date.now());
            this.vehicles.push({ id: createdId, ...newVehicle });
            localStorage.setItem('meusVeiculos', JSON.stringify(this.vehicles));
            alert('Veículo adicionado com sucesso!');
          } catch (e) {
            console.error('Erro ao criar no backend:', e.message);
            // fallback: add to local storage
            const fallbackId = Date.now();
            this.vehicles.push({ id: fallbackId, ...newVehicle });
            localStorage.setItem('meusVeiculos', JSON.stringify(this.vehicles));
            this.apiAvailable = false;
            alert('Veículo adicionado localmente (servidor indisponível).');
          }
        } else {
          const fallbackId = Date.now();
          this.vehicles.push({ id: fallbackId, ...newVehicle });
          localStorage.setItem('meusVeiculos', JSON.stringify(this.vehicles));
          alert('Veículo adicionado localmente.');
        }
      }

      this.showSaveConfirm = false;
      this.resetForm();
    },
    closeVehicleForm() {
      this.showVehicleForm = false;
      this.resetForm();
    },
    resetForm() {
      this.formData = {
        id: null,
        placa: '',
        renavam: '',
        validadeDoc: '',
        categoria: ''
      };
      this.isEditing = false;
      this.editingIndex = null;
    }
  }
  ,
  async mounted() {
    await this.loadVehicles();
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.veiculos-container {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.header {
  background: transparent;
  padding: 50px 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  position: relative;
}

.header__menu-toggle {
  background: none;
  border: none;
  cursor: pointer;
  width: 1px;
  height: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background 0.3s ease;
  color: #1a1a1a;
}

.header__menu-toggle:hover {
  background: #f5f5f5;
}

.header__logo {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
 max-height: 150px;
  max-width: 320px;
}

.header__logo img {
  height: 100%;
  object-fit: contain;
}

.header__back {
  background: #c41e1e;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background 0.3s ease;
}


.content {
  padding: 0 20px 120px 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 3px solid #c41e1e;
  display: inline-block;
}

.vehicles-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vehicle-card {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: visible;
}

.vehicle-card__labels,
.vehicle-card__header {
  display: grid;
  grid-template-columns: 40px 100px minmax(120px, 1fr) 100px 80px 56px;
  align-items: center;
  gap: 16px;
}

.vehicle-card__labels {
  padding: 14px 16px;
  background: #c41e1e;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.vehicle-card__label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.vehicle-card__id-label {
  justify-self: center;
}

.vehicle-card__placa-label {
  justify-self: start;
}

.vehicle-card__renavam-label {
  justify-self: start;
}

.vehicle-card__validade-label {
  justify-self: center;
}

.vehicle-card__categoria-label {
  justify-self: center;
}

.vehicle-card__actions-label {
  justify-self: end;
}

.vehicle-card__header {
  padding: 16px;
  background: #f9f9f9;
  border-bottom: 1px solid #f0f0f0;
}

.vehicle-card__header:hover {
  background: #ffffff;
}

.vehicle-card__id {
  flex-shrink: 0;
  width: 40px;
  text-align: center;
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
}

.vehicle-card__placa {
  flex-shrink: 0;
  width: 100px;
  font-weight: 700;
  color: #c41e1e;
  font-size: 16px;
}

.vehicle-card__renavam {
  flex: 1;
  min-width: 120px;
  font-size: 14px;
  color: #1a1a1a;
}

.vehicle-card__validade {
  flex-shrink: 0;
  width: 100px;
  font-size: 14px;
  color: #1a1a1a;
  text-align: center;
}

.vehicle-card__categoria {
  flex-shrink: 0;
  width: 80px;
  display: flex;
  justify-content: center;
}

.categoria-badge {
  display: inline-block;
  background: #f0f0f0;
  color: #1a1a1a;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.vehicle-card__actions {
  flex-shrink: 0;
  position: relative;
  margin-left: auto;
}

.edit-btn {
  background: none;
  border: none;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s ease;
  color: #1a1a1a;
}

.edit-btn:hover {
  background: #f0f0f0;
}

.edit-btn svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
}

.edit-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 20;
  overflow: hidden;
  min-width: 120px;
  margin-top: 4px;
}

.edit-menu button {
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  font-size: 14px;
  color: #1a1a1a;
  cursor: pointer;
  transition: background 0.2s ease;
}

.edit-menu button:hover {
  background: #f5f5f5;
}

.edit-menu button:first-child {
  border-bottom: 1px solid #f0f0f0;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #888;
  font-size: 16px;
  background: #ffffff;
  border-radius: 8px;
}

.fab-button {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #c41e1e;
  color: #ffffff;
  border: none;
  font-size: 32px;
  font-weight: 300;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(196, 30, 30, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 50;
}

.fab-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(196, 30, 30, 0.4);
}

.fab-button:active {
  transform: scale(0.95);
}


.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: #ffffff;
  border-radius: 12px;
  padding: 32px;
  max-width: 400px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-content h2 {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.modal-content p {
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
  line-height: 1.5;
}

.modal-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-cancel,
.btn-confirm {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-cancel {
  background: #e0e0e0;
  color: #1a1a1a;
}

.btn-cancel:hover {
  background: #d0d0d0;
}

.btn-confirm {
  background: #c41e1e;
  color: #ffffff;
}

.btn-confirm:hover {
  background: #a01818;
}

.btn-confirm:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.confirm-green {
  background: #28a745;
}

.confirm-green:hover {
  background: #218838;
}


.form-modal {
  max-width: 500px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.form-group input,
.form-group select {
  padding: 12px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #c41e1e;
  box-shadow: 0 0 0 3px rgba(196, 30, 30, 0.1);
}

.form-group select {
  cursor: pointer;
  background: #ffffff;
}

.confirm-modal {
  text-align: center;
}

.confirm-modal h2 {
  margin-bottom: 24px;
}

.confirm-modal .modal-buttons {
  justify-content: center;
  gap: 16px;
}

.confirm-modal .btn-cancel,
.confirm-modal .btn-confirm {
  width: 120px;
}

@media (max-width: 768px) {
  .header {
    padding: 12px 16px;
  }

  .header__logo {
    height: 32px;
  }

  .header__back {
    font-size: 12px;
    padding: 6px 12px;
  }

  .content {
    padding: 0 16px 120px 16px;
  }

  .page-title {
    font-size: 20px;
  }

  .vehicle-card__header {
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px;
  }

  .vehicle-card__placa {
    width: 80px;
  }

  .vehicle-card__renavam {
    width: 100px;
  }

  .vehicle-card__validade {
    width: 80px;
  }

  .fab-button {
    bottom: 24px;
    right: 24px;
    width: 56px;
    height: 56px;
    font-size: 28px;
  }

  .modal-content {
    margin: 20px;
    max-width: calc(100% - 40px);
  }

  .form-group input,
  .form-group select {
    padding: 10px 12px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .header {
    margin-bottom: 16px;
    padding: 12px;
  }

  .header__menu-toggle {
    width: 36px;
    height: 36px;
  }

  .header__logo {
    height: 28px;
  }

  .header__back {
    font-size: 11px;
    padding: 4px 8px;
  }

  .page-title {
    font-size: 18px;
    margin-bottom: 16px;
  }

  .content {
    padding: 0 12px 100px 12px;
  }

  .vehicle-card__header {
    flex-wrap: wrap;
    gap: 6px;
    padding: 10px;
    font-size: 12px;
  }

  .vehicle-card__id {
    width: 30px;
  }

  .vehicle-card__placa {
    width: 70px;
    font-size: 14px;
  }

  .vehicle-card__renavam {
    width: 100%;
    min-width: 100%;
    font-size: 12px;
  }

  .vehicle-card__validade {
    width: 70px;
  }

  .categoria-badge {
    font-size: 10px;
    padding: 4px 8px;
  }

  .fab-button {
    bottom: 16px;
    right: 16px;
    width: 52px;
    height: 52px;
  }

  .modal-content {
    padding: 24px;
    max-width: calc(100% - 30px);
    margin: 15px;
  }

  .modal-content h2 {
    font-size: 18px;
  }

  .modal-buttons {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-confirm {
    width: 100%;
  }
}
</style>
