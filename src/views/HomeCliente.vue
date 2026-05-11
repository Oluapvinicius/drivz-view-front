<template>
  <PerfilCliente v-if="activeScreen === 'profile'" @back="activeScreen = 'home'" />

  <div v-else class="app-container">
    
    <aside class="sidebar" :class="{ active: sidebarOpen }">
      <div class="sidebar__top-row">
        <button class="sidebar__menu-button" @click="toggleSidebar"></button>
        <button class="sidebar__notification" @click="handleSidebarAction('notifications')">
          <img src="../assets/notifica.svg" alt="Notificações" class="sidebar__notification-icon">
        </button>
      </div>

      <div class="sidebar__profile-block">
        <img src="../assets/profile.svg" alt="Foto do usuário" class="sidebar__logo">
      </div>

      <div class="sidebar__user-info">
        <span class="sidebar__title">CLOTHILDE</span>
        <p class="sidebar__phone">(11) 96663-7777</p>
        <p class="sidebar__location">Jandira - SP</p>
      </div>

      <div class="sidebar__divider"></div>

      <nav class="sidebar__menu">
        <button class="sidebar__item" @click="handleSidebarAction('messages')">
          <img src="../assets/mensage.svg" alt="Mensagens" class="sidebar__icon">
          <span class="sidebar__label">Mensagens</span>
        </button>
        <button class="sidebar__item" @click="handleSidebarAction('profile')">
          <img src="../assets/profile.svg" alt="Perfil" class="sidebar__icon">
          <span class="sidebar__label">Editar Perfil</span>
        </button>
      </nav>

      <div class="sidebar__footer">
        <button class="sidebar__settings" @click="handleSidebarAction('settings')">
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
        </div>
      </div>
    </aside>

    
    <div class="overlay" :class="{ active: sidebarOpen || orderPopupOpen || serviceModalOpen }" @click="closeAllPopups"></div>

 
    <main class="main-content">
   
      <header class="header">
        <div class="header__top">
          <button class="header__menu-toggle" @click="toggleSidebar">
            <img src="../assets/nav-bar-icon.svg" alt="Menu" class="header__menu-icon">
          </button>

          <div class="header__logo-container">
            <img src="../assets/logo.svg" alt="DriveZ" class="header__logo">
          </div>

          <div class="header__spacer"></div>
        </div>

        <div class="header__bottom">
          <div class="header__search-wrapper">
            <div class="header__search">
              <input 
                type="text" 
                class="header__search-input" 
                placeholder="Buscar serviços"
                v-model="searchQuery"
                @input="filterServices"
              >
              <div class="header__search-divider">
              <button class="header__search-btn">
                <img src="../assets/lupa.svg" alt="Buscar" class="header__search-icon">
              </button>
              </div>
            </div>

            <button class="header__refresh" @click="refreshServices">
              <img src="../assets/Refresh.svg" alt="Atualizar" class="header__refresh-icon">
            </button>
          </div>
        </div>
      </header>

     
      <template v-if="activeScreen === 'home'">

        <section class="services">
          <div class="services__container">
            <div v-if="isLoading" class="services__loading">
              <div class="spinner"></div>
              <span>Carregando serviços...</span>
            </div>
            <div v-else class="services__grid">
              <div 
                v-for="service in visibleServices" 
                :key="service.id"
                class="service-card"
                @click="handleServiceClick(service)"
              >
                <img :src="service.image" :alt="service.title" class="service-card__image">
                <div class="service-card__content">
                  <div class="service-card__header">
                    <h3 class="service-card__title">{{ service.title }}</h3>
                    <div class="service-card__rating">
                      <span v-for="i in 5" :key="i" class="service-card__star">
                        {{ i <= service.rating ? '★' : '☆' }}
                      </span>
                    </div>
                  </div>
                  <p class="service-card__description">{{ service.description }}</p>
                  <div class="service-card__location">
                    <span>{{ service.location }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <button class="call-button" @click="handleCallButtonClick">
          <span>SOCORRO</span>
        </button>
      </template>

      <template v-else-if="activeScreen === 'orders'">
        <section class="orders-screen">
          <div class="orders-screen__header">
            <button class="orders-screen__back" @click="activeScreen = 'home'">Voltar</button>
          </div>
          <div class="orders-screen__list">
            <article v-for="order in orders" :key="order.id" class="orders-screen__card">
              <div class="orders-screen__top">
                <div class="orders-screen__provider">
                  <img :src="order.avatar" alt="Avatar" class="orders-screen__avatar" />
                  <div>
                    <span class="orders-screen__provider-label">Prestador:</span>
                    <strong class="orders-screen__provider-name">{{ order.provider }}</strong>
                  </div>
                </div>
                <span class="orders-screen__date">{{ order.date }}</span>
              </div>
              <div class="orders-screen__route">
                <div class="orders-screen__route-group">
                  <span class="orders-screen__route-title">Origem</span>
                  <span class="orders-screen__route-text">{{ order.origin }}</span>
                </div>
                <div class="orders-screen__route-arrow">→</div>
                <div class="orders-screen__route-group">
                  <span class="orders-screen__route-title">Destino</span>
                  <span class="orders-screen__route-text">{{ order.destination }}</span>
                </div>
              </div>
            </article>
          </div>
        </section>
      </template>

      <template v-else-if="activeScreen === 'profile'">
        <PerfilCliente @back="activeScreen = 'home'" />
      </template>

      <div v-if="serviceModalOpen" class="service-modal-overlay" @click="closeAllPopups">
        <div class="service-detail-modal" @click.stop>
          <div class="service-detail-modal__back-row">
            <button class="service-detail-modal__back" @click="closeAllPopups"><img src="../assets/arrow.png" alt="" class="back-button"></button>
          </div>
          <div class="service-detail-modal__header">
            <img :src="selectedService?.image" :alt="selectedService?.title" class="service-detail-modal__image">
            <div class="service-detail-modal__header-content">
              <h2 class="service-detail-modal__title">{{ selectedService?.title }}</h2>
              <div class="service-detail-modal__rating">
                <span v-for="i in 5" :key="i" class="service-detail-modal__star">
                  {{ i <= (selectedService?.rating || 0) ? '★' : '☆' }}
                </span>
              </div>
              <span class="service-detail-modal__category">{{ selectedService?.category || 'Guincho' }}</span>
            </div>
          </div>
          <p class="service-detail-modal__text">
            Especializada em serviços de {{ (selectedService?.category || 'Guincho').toLowerCase() }} e assistência veicular, a {{ selectedService?.title }} oferece suporte rápido e seguro para o seu veículo. Com foco na eficiência e no cuidado com o patrimônio do cliente, estamos prontos para atender emergências com profissionalismo e pontualidade.
          </p>
          <p class="service-detail-modal__text">{{ selectedService?.description }}</p>
          <div class="service-detail-modal__footer">
            <button class="service-detail-modal__button">Solicitar Serviço</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import profileImg from '../assets/profile.svg';
import ordersData from '../data/orders.json';
import PerfilCliente from './PerfilCliente.vue';

export default {
  name: 'HomeCliente',
  components: {
    PerfilCliente
  },
  data() {
    return {
      sidebarOpen: false,
      orderPopupOpen: false,
      serviceModalOpen: false,
      selectedService: null,
      activeScreen: 'home',
      searchQuery: '',
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      maxVisibleServices: 8,
      orders: ordersData,
      services: [],
      isLoading: false,
    };
  },
  computed: {
    filteredServices() {
      if (!this.searchQuery.trim()) {
        return this.services;
      }
      
      return this.services.filter(service => {
        const query = this.searchQuery.toLowerCase();
        return (
          service.title.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          service.location.toLowerCase().includes(query) ||
          (service.category && service.category.toLowerCase().includes(query))
        );
      });
    },
    visibleServices() {
      const limit = this.windowWidth <= 768 ? Math.min(this.maxVisibleServices, 4) : this.maxVisibleServices;
      return this.filteredServices.slice(0, limit);
    }
  },
  methods: {
      async fetchServices() {
        this.isLoading = true;
        try {
          const response = await fetch('http://localhost:8080/v1/drivez/prestador');
          const data = await response.json();
          if (data && data.response) {
            this.services = data.response.map(item => ({
              id: item.id_prestador || item.id || item.email,
              title: item.nome,
              description: item.email,
              location: item.cidade || 'Local não informado',
              category: item.categoria || '',
              rating: 5,
              image: profileImg
            }));
          }
        } catch (error) {
          console.error('Erro ao buscar serviços:', error);
        } finally {
          setTimeout(() => { this.isLoading = false; }, 600);
        }
      },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    closeSidebar() {
      this.sidebarOpen = false;
      this.orderPopupOpen = false;
    },
    openSidebar() {
      this.sidebarOpen = true;
    },
    closeAllPopups() {
      this.sidebarOpen = false;
      this.orderPopupOpen = false;
      this.serviceModalOpen = false;
      this.selectedService = null;
    },
    handleSidebarAction(action) {
      if (action === 'settings') {
        this.orderPopupOpen = !this.orderPopupOpen;
        this.sidebarOpen = true;
        return;
      }

      if (action === 'profile') {
        this.activeScreen = 'profile';
        this.sidebarOpen = false;
        this.orderPopupOpen = false;
        return;
      }

      if (action === 'messages') {
        this.$router.push({ name: 'mensagem-cliente' });
        this.sidebarOpen = false;
        this.orderPopupOpen = false;
        return;
      }

      console.log('Action:', action);
      this.closeSidebar();
    },
    handleServiceClick(service) {
      this.selectedService = service;
      this.serviceModalOpen = true;
    },
    goToOrderScreen() {
      this.activeScreen = 'orders';
      this.orderPopupOpen = false;
      this.sidebarOpen = false;
    },
    handleCallButtonClick() {
      this.$router.push({ name: 'pedido-c' });
    },
    filterServices() {
    },
    refreshServices() {
    
      this.isLoading = true;
      fetch('http://localhost:8080/v1/drivez/prestador')
        .then(response => response.json())
        .then(data => {
          if (data && data.response) {
       
            const shuffled = data.response
              .map(value => ({ value, sort: Math.random() }))
              .sort((a, b) => a.sort - b.sort)
              .map(({ value }) => value);
            this.services = shuffled.map(item => ({
              id: item.id_prestador || item.id || item.email,
              title: item.nome,
              description: item.email,
              location: item.cidade || 'Local não informado',
              rating: 5,
              image: profileImg
            }));
          }
        })
        .catch(error => {
          console.error('Erro ao buscar serviços:', error);
        })
        .finally(() => {
          setTimeout(() => { this.isLoading = false; }, 600);
        });
    },
    updateWindowWidth() {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    }
  },
  mounted() {
    this.fetchServices();
    window.addEventListener('resize', this.updateWindowWidth);
    this.updateWindowWidth();
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && (this.sidebarOpen || this.orderPopupOpen || this.serviceModalOpen)) {
        this.closeAllPopups();
      }
    });
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateWindowWidth);
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  min-height: 100%;
  overflow-x: hidden;
}

.app-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  background-color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}


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


.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.overlay.active {
  opacity: 1;
  pointer-events: auto;
}

.sidebar-popup {
  position: absolute;
  right: 24px;
  bottom: 110px;
  width: 280px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.18);
  padding: 18px;
  z-index: 1001;
}

.sidebar-popup__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.sidebar-popup__header h4 {
  font-size: 18px;
  color: #1f1f1f;
}

.sidebar-popup__close {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #1f1f1f;
}

.sidebar-popup__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-popup__option {
  width: 100%;
  background: #ffffff;
  color: #1f1f1f;
  border: 1px solid #d8d8d8;
  border-radius: 16px;
  padding: 14px 16px;
  font-size: 16px;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
}

.sidebar-popup__option:hover {
  background: #f5f5f5;
}

.sidebar-popup__order {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  background: #f7f7f7;
  border-radius: 16px;
  padding: 14px 16px;
}

.sidebar-popup__order strong {
  display: block;
  font-size: 15px;
  color: #262626;
}

.sidebar-popup__order span {
  display: block;
  font-size: 13px;
  color: #6f6f6f;
}

.sidebar-popup__status {
  color: #D62828;
  font-weight: 700;
}

.orders-screen {
  margin: 18px;
  padding: 22px;
  background: #f5f6f8;
  border-radius: 28px;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.orders-screen__header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 18px;
  margin-bottom: 20px;
}

.orders-screen__back {
  background: #D62828;
  border: none;
  color: white;
  border-radius: 14px;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
}

.orders-screen__list {
  display: flex;
  flex-direction: column;
  gap: 18px;
  overflow-y: auto;
  padding-right: 6px;
  flex: 1;
}

.orders-screen__list::-webkit-scrollbar {
  width: 8px;
}

.orders-screen__list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.16);
  border-radius: 999px;
}

.orders-screen__order {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  background: #f7f7f7;
  border-radius: 18px;
  padding: 18px 20px;
}

.orders-screen__order strong {
  display: block;
  font-size: 15px;
}

.orders-screen__status {
  color: #D62828;
  font-weight: 700;
}

.orders-screen__card {
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 24px;
  padding: 22px 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
}

.orders-screen__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.orders-screen__provider {
  display: flex;
  align-items: center;
  gap: 12px;
}

.orders-screen__avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
}

.orders-screen__provider-label {
  display: block;
  font-size: 12px;
  color: #7f7f7f;
}

.orders-screen__provider-name {
  display: block;
  font-size: 15px;
  font-weight: 700;
  color: #111111;
}

.orders-screen__date {
  font-size: 13px;
  color: #7f7f7f;
}

.orders-screen__route {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
}

.orders-screen__route-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.orders-screen__route-title {
  font-size: 12px;
  font-weight: 700;
  color: #333333;
  text-transform: uppercase;
}

.orders-screen__route-text {
  font-size: 14px;
  color: #4a4a4a;
  line-height: 1.5;
}

.orders-screen__route-arrow {
  font-size: 20px;
  color: #b3b3b3;
  text-align: center;
}

.service-modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.55);
  z-index: 1002;
  padding: 24px;
}

.service-detail-modal {
  width: min(760px, 100%);
  max-height: calc(100vh - 60px);
  overflow-y: auto;
  background: #ffffff;
  border-radius: 36px;
  padding: 34px 34px 28px;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.22);
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.06);
  scrollbar-width: thin;
  scrollbar-color: rgba(214, 40, 40, 0.7) rgba(0, 0, 0, 0.08);
}

.service-detail-modal::-webkit-scrollbar {
  width: 10px;
}

.service-detail-modal::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 999px;
}

.service-detail-modal::-webkit-scrollbar-thumb {
  background: rgba(214, 40, 40, 0.75);
  border-radius: 999px;
}
.back-button {
  width: 28px;
  height: 28px;
}

.service-detail-modal__back-row {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 14px;
}

.service-detail-modal__back {
  background: none;
  border: none;
  font-size: 24px;
  color: #222222;
  cursor: pointer;
  padding: 0;
}

.service-detail-modal__header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 22px;
}

.service-detail-modal__header-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
  text-align: left;
}

.service-detail-modal__image {
  width: 118px;
  height: 118px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #e5e5e5;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.service-detail-modal__title {
  font-size: 34px;
  margin: 0;
  color: #111111;
  letter-spacing: -0.35px;
}

.service-detail-modal__rating {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}

.service-detail-modal__star {
  color: #FFC107;
  font-size: 26px;
}

.service-detail-modal__category {
  display: inline-flex;
  background: #102030;
  color: white;
  border-radius: 999px;
  padding: 12px 26px;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 0;
}

.service-detail-modal__text {
  font-size: 15px;
  line-height: 1.85;
  color: #4A4A4A;
  margin-bottom: 20px;
}

.service-detail-modal__footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
}

.service-detail-modal__button {
  background: #D62828;
  border: none;
  border-radius: 16px;
  color: white;
  padding: 18px 40px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.service-detail-modal__button:hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 40px rgba(214, 40, 40, 0.25);
}

.main-content {
  flex: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  overflow: hidden;
}


.header {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
}

.header__top,
.header__bottom {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.header__top {
  justify-content: space-arround;
}

.header__bottom {
  justify-content: center;
}

.header__search-wrapper {
  position: relative;
  width: 100%;
  max-width: 760px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header__search {
  margin: 0 auto;
}

.header_divider {
  width: 1px;
  height: 24px;
  gap: 14px;
  background-color: #e0e0e0;
}

.header__menu-toggle, 

.header__refresh {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header__menu-toggle {
  padding: 15px;
  min-width: 52px;
  min-height: 52px;
  align-self: flex-start;
  
}
.header__menu-toggle img{
  width: 50px;
  height: 50px;
}

.header__refresh {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}


.header__refresh-icon {
  width: 34px;
  height: 34px;
}


.header__logo {
  height: auto;
  width: min(320px, 100%);
  max-height: 140px;
}

.header__search {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border: 2px solid #e0e0e0;
  border-radius: 28px;
  padding: 10px 18px;
  width: 100%;
  max-width: 560px;
  gap: 10px;
  transition: border-color 0.2s ease;
}



.header__search-input {
  flex: 1;
  min-width: 0;
  background: none;
  border: none;
  font-size: 14px;
  outline: none;
  color: #000000;
}

.header__search-input::placeholder {
  color: #999;
}

.header__search-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header__search-icon {
  width: 20px;
  height: 20px;
}

.header__refresh {
  background: none;
  border: none;
  cursor: pointer;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header__refresh-icon {
  width: 32px;
  height: 32px;
}

.header__menu-hamburger {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}


.services {
  flex: 1;
  padding: 24px 18px 16px;
  overflow: visible;
}

.services__container {
  max-width: 1520px;
  margin: 0 auto;
}


.services__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(200px, 0.5fr));
  gap: 16px;
  justify-content: center;
}

@media (max-width: 1220px) {
  .services__grid {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
    gap: 14px;
  }
}

.service-card {
  background: white;
  border: 1px solid #6D6D6D;
  border-radius: 20px;
  padding: 12px 14px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.service-card:hover {
  border-color: black;
  box-shadow: 0 8px 16px rgba(45, 44, 44, 0.15);
  transform: translateY(-2px);
}

.service-card__image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.service-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.service-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  min-width: 0;
}

.service-card__title {
  font-size: 14px;
  font-weight: 700;
  color: #E63946;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 56px);
  min-width: 0;
}

.service-card__description {
  font-size: 13px;
  color: #4F4F4F;
  line-height: 1.4;
  max-height: 48px;
  overflow: hidden;
}

.service-card__rating {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
}

.service-card__star {
  color: #FFC107;
  font-size: 13px;
}

.service-card__location {
  position: relative;
  padding-left: 12px;
  font-size: 13px;
  color: #27AE60;
}

.service-card__location::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #27AE60;
}

  .call-button {
  position: relative;
  width: min(420px, calc(100% - 180px));
  min-height: 91px;
  padding: 0 36px;
  margin: 24px auto 32px;
  background: #D62828;
  color: white;
  border: none;
  border-radius: 9px;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.18);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.call-button:hover {
    transform: scale(1.02);
    box-shadow: 0 18px 42px rgba(0, 0, 0, 0.22);
}

.call-button:active {
    transform: scale(0.98);
}

@media (max-width: 1024px) {
  .main-content {
    overflow: hidden;
  }

  .services {
    overflow: hidden;
  }

  .services__container {
    max-height: calc(100vh - 300px);
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 4px;
    -webkit-overflow-scrolling: touch;
  }

  .services__grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    justify-content: center;
  }

  .header__search-wrapper {
    gap: 16px;
    justify-content: center;
  }

  .header__search {
    max-width: 100%;
    min-width: 0;
  }

  .header__refresh {
    position: static;
    transform: none;
    right: auto;
    top: auto;
  }
}

@media (max-width: 768px) {
  .services__container {
    max-height: calc(100vh - 280px);
  }
}

@media (max-width: 480px) {
  .services__container {
    max-height: calc(100vh - 260px);
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 280px;
    padding: 22px 18px;
  }

  .header {
    gap: 12px;
    padding: 12px 16px;
  }

  .header__top {
    flex-wrap: wrap;
    gap: 12px;
    justify-content: space-between;
  }

  .header__search-wrapper {
    width: 100%;
    gap: 12px;
  }

  .header__search {
    max-width: 100%;
    min-width: 0;
    padding: 10px 14px;
  }

  .header__logo {
    max-height: 140px;
  }

  .services {
    padding: 20px 16px 200px;
  }

  .services__grid {
    gap: 16px;
    grid-template-columns: 1fr;
  }

  .service-card {
    flex-direction: row;
    align-items: flex-start;
    gap: 14px;
    padding: 14px 14px;
  }

  .service-card__image {
    width: 58px;
    height: 58px;
  }

  .call-button {
    width: calc(100% - 32px);
    min-height: 72px;
    padding: 0 26px;
    margin: 0 auto 28px;
  }
}

@media (max-width: 480px) {
  .header__top {
    flex-wrap: wrap;
    gap: 10px;
    justify-content: space-between;
  }

  .header__search-wrapper {
    width: 100%;
    gap: 10px;
    justify-content: center;
  }

  .header__search {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    padding: 10px 12px;
    border-radius: 22px;
  }

  .header__refresh {
    position: static;
    transform: none;
    right: auto;
    top: auto;
  }

  .header__logo {
    max-height: 120px;
  }

  .services {
    padding: 16px 12px 180px;
  }

  .services__grid {
    gap: 12px;
    grid-template-columns: 1fr;
  }

  .service-card {
    padding: 12px 12px;
  }

  .service-card__image {
    width: 54px;
    height: 54px;
  }

  .service-card__title {
    font-size: 14px;
  }

  .service-card__description {
    font-size: 13px;
  }

  .service-card__star {
    font-size: 13px;
  }

  .call-button {
    width: calc(100% - 24px);
    min-height: 64px;
    font-size: 22px;
    padding: 0 20px;
    margin: 0 auto 24px;
  }
}

.services__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #D62828;
  font-size: 1.2rem;
}
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #D62828;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
