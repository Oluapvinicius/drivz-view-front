<template>
  <aside class="sidebar" :class="{ active: sidebarOpen }">
    <div class="sidebar__top-row">
      <button class="sidebar__menu-button" @click="$emit('toggleSidebar')"></button>
      <button class="sidebar__notification" @click="$emit('sidebarAction', 'notifications')">
        <img src="../assets/notifica.svg" alt="Notificações" class="sidebar__notification-icon">
      </button>
    </div>

    <div class="sidebar__profile-block">
      <img :src="userProfileImage" alt="Foto do usuário" class="sidebar__logo">
    </div>

    <div class="sidebar__user-info">
      <span class="sidebar__title">{{ user?.nome || 'Usuário' }}</span>
      <p v-if="user?.telefone" class="sidebar__phone">{{ user.telefone }}</p>
      <p v-if="user?.localizacao" class="sidebar__location">{{ user.localizacao }}</p>
    </div>

    <div class="sidebar__divider"></div>

    <nav class="sidebar__menu">
      <button class="sidebar__item" @click="$emit('sidebarAction', 'messages')">
        <img src="../assets/mensage.svg" alt="Mensagens" class="sidebar__icon">
        <span class="sidebar__label">Mensagens</span>
      </button>
      <button class="sidebar__item" @click="$emit('sidebarAction', 'profile')">
        <img src="../assets/profile.svg" alt="Perfil" class="sidebar__icon">
        <span class="sidebar__label">Editar Perfil</span>
      </button>
    </nav>

    <div class="sidebar__footer">
      <button class="sidebar__logout" @click="logout" title="Sair da conta">
        <svg class="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </button>
      <button class="sidebar__settings" @click="$emit('togglePopup')">
        <img src="../assets/config.svg" alt="Configurações" class="sidebar__icon">
      </button>
    </div>

     <div v-if="orderPopupOpen" class="sidebar-popup">
        <div class="sidebar-popup__header">
          <h4>Menu</h4>
          <button class="sidebar-popup__close" @click="closeAllPopups">×</button>
        </div>
        <div class="sidebar-popup__list">
          <button class="sidebar-popup__option" @click="goToOrderScreen">
            Registro de Pedidos
          </button>
          <button class="sidebar-popup__option" @click="logout" style="color: #D62828; font-weight: 700;">
            Sair da Conta
          </button>
        </div>
      </div>
  </aside>
</template>

<script>
import { useRouter } from 'vue-router';
import { userStorage } from '../utils/userStorage';
import defaultProfile from '../assets/profile.svg';

const router = useRouter();

export default {
  name: 'SidebarCliente',
  props: {
    sidebarOpen: Boolean,
    user: Object,
    popupOpen: Boolean
  },
  data() {
    return {
      orderPopupOpen: false
    };
  },
  computed: {
    userProfileImage() {
      if (this.user && (this.user.img_perfil || this.user.profileImage || this.user.foto)) {
        return this.user.img_perfil || this.user.profileImage || this.user.foto;
      }
      return defaultProfile;
    }
  },
  methods: {
    closeAllPopups() {
      this.orderPopupOpen = false;
      this.$emit('toggleSidebar');
    },
    goToOrderScreen() {
      this.$emit('sidebarAction', 'orders');
      this.closeAllPopups();
    },
    logout() {
      if (confirm('Deseja sair da sua conta?')) {
        userStorage.clear();
        localStorage.clear();
        sessionStorage.clear();
        router.push('/');
      }
    }
  }
}
</script>

<style scoped>

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 320px;
  height: 100vh;
  background-color: #D62828;
  color: white;
  padding: 32px 24px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  box-shadow: 2px 0 18px rgba(0, 0, 0, 0.16);
}

.sidebar.active {
  transform: translateX(0);
}

.sidebar__top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.sidebar__menu-button,
.sidebar__notification {
  background: transparent;
  border: none;
  padding: 8px;
  cursor: pointer;
}

.sidebar__menu-icon,
.sidebar__notification-icon {
  width: 32px;
  height: 32px;
}

.sidebar__profile-block {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 18px;
}

.sidebar__logo {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
}

.sidebar__user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 22px;
}

.sidebar__title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 1px;
  text-align: left;
}

.sidebar__phone {
  font-size: 17px;
  font-weight: 600;
  margin: 0;
}

.sidebar__location {
  font-size: 15px;
  opacity: 0.9;
  margin: 0;
}

.sidebar__divider {
  height: 1px;
  width: 100%;
  background: rgba(255, 255, 255, 0.18);
  margin-bottom: 24px;
}

.sidebar__menu {
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
  list-style: none;
}

.sidebar__item {
  display: flex;
  align-items: center;
  gap: 18px;
  background: transparent;
  border: none;
  color: white;
  padding: 18px 16px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  transition: background-color 0.2s ease, transform 0.2s ease;
  border-radius: 16px;
}

.sidebar__item:hover {
  background-color: rgba(255, 255, 255, 0.12);
  transform: translateX(2px);
}

.sidebar__icon {
  width: 28px;
  height: 28px;
}

.sidebar__label {
  flex: 1;
  text-align: left;
}

.sidebar__footer {
  margin-top: auto;
  display: flex;
  justify-content: flex-start;
}

.sidebar__settings {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 62px;
  height: 62px;
  border-radius: 18px;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.sidebar__settings:hover {
  background-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-1px);
}

.sidebar__settings .sidebar__icon {
  width: 32px;
  height: 32px;
}

.sidebar-popup {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #D62828;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 12px;
}
</style>
