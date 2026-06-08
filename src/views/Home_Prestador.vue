<template>
  <div class="app-container">
    <template v-if="activeScreen === 'history'">
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

    <template v-else>
      <aside class="sidebar" :class="{ active: sidebarOpen }">
        <div class="sidebar__top-row"></div>

        <div class="sidebar__profile-block">
          <img src="../assets/profile.svg" alt="Foto do usuário" class="sidebar__logo">
        </div>

        <div class="sidebar__user-info">
          <span class="sidebar__title">{{ user.nome || 'Prestador' }}</span>
          <p v-if="user?.telefone" class="sidebar__phone">{{ user.telefone }}</p>
          <p v-if="user?.localizacao" class="sidebar__location">{{ user.localizacao }}</p>
        </div>

        <div class="sidebar__divider"></div>

      <nav class="sidebar__menu">
        <button class="sidebar__item" @click="handleSidebarAction('messages')">
          <img src="../assets/mensage.svg" alt="Mensagens" class="sidebar__icon">
          <span class="sidebar__label">Mensagens</span>
        </button>
        <button class="sidebar__item" @click="handleSidebarAction('garage')">
          <img src="../assets/Warehouse.svg" alt="Garagem" class="sidebar__icon">
          <span class="sidebar__label">Minha Garagem</span>
        </button>
      </nav>

        <div class="sidebar__footer">
          <button class="sidebar__settings" @click="orderPopupOpen = !orderPopupOpen">
            <img src="../assets/config.svg" alt="Configurações" class="sidebar__icon">
          </button>
        </div>

        <div v-if="orderPopupOpen" class="sidebar-popup">
          <div class="sidebar-popup__header">
            <h4>Menu</h4>
            <button class="sidebar-popup__close" @click="orderPopupOpen = false">×</button>
          </div>
          <div class="sidebar-popup__list">
            <button class="sidebar-popup__option" @click="handleSidebarAction('orders')">
              Registro de Pedido
            </button>
          </div>
        </div>
      </aside>

      <div class="overlay" :class="{ active: sidebarOpen || orderPopupOpen }" @click="closeAllPopups"></div>

      <main class="main-content">
        <header class="header">
          <button class="header__menu-toggle" @click="toggleSidebar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        <div class="header__logo">
          <img src="../assets/Group 294.svg" alt="Logo">
        </div>
        </header>
        <div class="map-container">
          <div id="map-prestador" class="map-placeholder"></div>
        <button class="emergency-test-btn" @click="showEmergencyPopup">Testar Emergência</button>
        </div>
      </main>

      <aside class="right-sidebar" :class="{ active: rightSidebarOpen }">
        <button class="right-sidebar__close" @click="rightSidebarOpen = !rightSidebarOpen">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path :d="rightSidebarOpen ? 'M15 18l-6-6 6-6' : 'M9 6l6 6-6 6'" />
          </svg>
        </button>
        <div class="right-sidebar__header">
          <div class="right-sidebar__title-group">
            <div class="right-sidebar__badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                class="right-sidebar__icon">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h2 class="right-sidebar__title">Mostrando solicitações próximas</h2>
          </div>
          <button class="right-sidebar__refresh" @click="refreshRequests">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36M20.49 15a9 9 0 01-14.85 3.36" />
            </svg>
          </button>
        </div>

        <div class="right-sidebar__list">
          <div v-for="request in nearbyRequests" :key="request.id" class="request-card" @click="openRequestModal(request)">
            <div class="request-card__top">
              <div class="request-card__avatar">
                <img :src="request.avatar" :alt="request.name" />
              </div>
              <div class="request-card__header">
                <h3 class="request-card__name">{{ request.name }}</h3>
                <p class="request-card__distance">{{ request.distance }}</p>
              </div>
            </div>
            <div class="request-card__rating">
              <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= request.rating }">★</span>
            </div>
          </div>
        </div>
      </aside>

    <div v-if="selectedRequest" class="modal-overlay" @click="closeRequestModal">
      <div class="request-modal" @click.stop>
        <div class="request-modal__content">
          <div class="request-modal__header">
            <div class="request-modal__avatar">
              <img src="../assets/profile.svg" alt="">
            </div>
            <h2 class="request-modal__name">{{ selectedRequest.name }}</h2>
            <div class="request-modal__rating">
              <span v-for="i in 5" :key="i" class="request-modal__star" :class="{ filled: i <= selectedRequest.rating }">★</span>
              <span class="request-modal__rating-value">{{ selectedRequest.rating }}.0</span>
            </div>
          </div>

          <div class="request-modal__location">
            <div class="request-modal__location-icon"><img src="../assets/location.png" alt="" class="locationIcon"></div>
            <span class="request-modal__location-label">LOCAL DE SOLICITAÇÃO</span>
          </div>

          <div class="request-modal__map">
            <div class="request-modal__map-placeholder">
         
            </div>
          </div>

          <div class="request-modal__actions">
            <button class="request-modal__accept-btn" @click="acceptRequest">
              Aceitar Serviço 
            </button>
            <button class="request-modal__ignore-btn" @click="closeRequestModal">
              Ignorar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="emergencyPopupOpen" class="modal-overlay" @click="closeEmergencyPopup">
      <div class="emergency-modal" @click.stop>
        <div class="emergency-modal__top">
          <div class="emergency-modal__icon">
            <img src="../assets/emergencia-cima.svg" alt="Emergência" />
          </div>
          <div class="emergency-modal__title-group">
            <span class="emergency-modal__title-label">EMERGÊNCIA</span>
          </div>
          <button class="emergency-modal__close" @click="closeEmergencyPopup">×</button>
        </div>

        <div class="emergency-modal__avatar">
          <img :src="emergencyRequest.avatar" alt="" />
        </div>
        <h2 class="emergency-modal__name">{{ emergencyRequest.name }}</h2>
        <div class="emergency-modal__stars">
          <span v-for="i in 5" :key="i" :class="['emergency-modal__star', { filled: i <= emergencyRequest.rating }]">★</span>
        </div>

        <div class="emergency-modal__locations">
          <div class="emergency-modal__location-row">
            <img src="../assets/origem.svg" alt="Origem" class="emergency-modal__location-icon" />
            <div>
              <span class="emergency-modal__location-label">ORIGEM</span>
              <p>{{ emergencyRequest.origin }}</p>
            </div>
          </div>
          <div class="emergency-modal__location-row">
            <img src="../assets/destino.svg" alt="Destino" class="emergency-modal__location-icon" />
            <div>
              <span class="emergency-modal__location-label">DESTINO</span>
              <p>{{ emergencyRequest.destination }}</p>
            </div>
          </div>
        </div>

        <button class="emergency-modal__accept-btn" @click="acceptEmergencyService">Aceitar Serviço</button>
      </div>
    </div>
    </template>
  </div>
</template>

<script>
import { buscarCliente } from '../requests/buscarUsuarios';
import { buscarPrestador } from '../requests/buscarUsuarios';
import { buscarClientePorId } from '../requests/cliente';
import { userStorage } from '../utils/userStorage';
import { MapboxService } from '../requests/mapboxService';
import { listarPedidos } from '../requests/pedido';
import { prestadoresGuincho } from '../requests/prestador';

export default {
  name: 'HomePrestador',
  data() {
    return {
      user: { nome: '', telefone: '', localizacao: '' },
      sidebarOpen: false,
      orderPopupOpen: false,
      rightSidebarOpen: true,
      activeScreen: 'home',
      selectedRequest: null,
      emergencyPopupOpen: false,
      emergencyRequest: {
        name: 'Rogerio',
        origin: 'Rodovia dos Bandeirantes, KM 152',
        destination: 'Centro Automotivo Porto, Rua das Flores, 500.',
        rating: 4,
        avatar: '../assets/profile.svg'
      },
      orders: [],
      mapService: null,
      requestMarkerIds: [],
      presenterLocation: [-46.9015, -23.5255],
      nearbyRequests: [],

      timerConvites: null,
      popupConfirmacaoOpen: false,
      pedidoPendente: { id: null, name: '', origin: '', destination: '', description: '' }
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    closeAllPopups() {
      this.sidebarOpen = false;
      this.orderPopupOpen = false;
    },

    handleSidebarAction(action) {
      this.closeAllPopups();
      if (action === 'orders') {
        this.activeScreen = 'history';
        this.carregarHistoricoDePedidos();
      } else if (action === 'messages') {
        this.$router.push('/mensagens-prestador');
      } else if (action === 'garage') {
        this.$router.push('/meus-veiculos');
      } else {
        console.log(`Navegando para a tela: ${action}`);
      }
    },

    async refreshRequests() {
      try {
        const dadosPedidos = await listarPedidos();

        let listaReal = [];
        if (Array.isArray(dadosPedidos)) listaReal = dadosPedidos;
        else if (dadosPedidos && Array.isArray(dadosPedidos.pedidos)) listaReal = dadosPedidos.pedidos;
        else if (dadosPedidos && Array.isArray(dadosPedidos.response)) listaReal = dadosPedidos.response;
        else return;

        const promessasDePedidos = listaReal.map(async (pedido) => {
          const clienteId = pedido.id_cliente || pedido.clienteId;
          let dadosCliente = null;

          if (clienteId) {
            try {
              const resCliente = await buscarClientePorId(clienteId);
              dadosCliente = resCliente.response || resCliente;
            } catch (err) {
              console.error(`Erro ao buscar dados do cliente ${clienteId}:`, err);
            }
          }

          return {
            id: pedido.id || pedido.id_pedido,
            name: dadosCliente?.nome || pedido.clienteNome || 'Cliente',
            address: pedido.endereco_origem || pedido.endereco || 'Endereço não informado',
            rating: Number(dadosCliente?.avaliacao || 5),
            avatar: dadosCliente?.avatar || 'https://via.placeholder.com/150',
            distance: pedido.distancia_km ? `${pedido.distancia_km} km` : 'Calculando...',
            detalhesPedido: pedido
          };
        });

        this.nearbyRequests = await Promise.all(promessasDePedidos);

        if (this.mapService) {
          await this.updateRequestMarkersFromAPI();
        }
      } catch (error) {
        console.error('Erro na requisição manual de pedidos:', error);
      }
    },

    async verificarNovosConvitesDePedido() {
      if (this.popupConfirmacaoOpen) return;

      try {
        const prestadorLogadoId = userStorage.getUserId();
        if (!prestadorLogadoId) return;

        const dadosGuinchoRaw = await prestadoresGuincho();

        const listaGuinchos = dadosGuinchoRaw?.response || [];
        if (listaGuinchos.length === 0) return;

        const perfilPrestadorApi = listaGuinchos[0];

        const dadosGerais = await listarPedidos();
        let todosPedidos = [];
        if (Array.isArray(dadosGerais)) todosPedidos = dadosGerais;
        else if (dadosGerais?.response) todosPedidos = dadosGerais.response;
        else if (dadosGerais?.pedidos) todosPedidos = dadosGerais.pedidos;

        if (todosPedidos.length === 0) return;

        const pedidoEmergencia = todosPedidos.find(pedido => {
          const ehParaEstePrestador = String(pedido.id_prestador) === String(perfilPrestadorApi.id_prestador);
          const ehDesteUsuarioLogado = String(pedido.id_prestador) === String(prestadorLogadoId);

          return ehParaEstePrestador && ehDesteUsuarioLogado;
        });

        if (pedidoEmergencia) {
          let dadosCliente = null;
          const clienteId = pedidoEmergencia.id_cliente;

          if (clienteId) {
            try {
              const resCliente = await buscarClientePorId(clienteId);
              dadosCliente = resCliente.response || resCliente;
            } catch (err) {
              console.error(`Erro ao buscar cliente da emergência:`, err);
            }
          }

          this.pedidoPendente = {
            id: pedidoEmergencia.id || pedidoEmergencia.id_pedido,
            name: dadosCliente?.nome || pedidoEmergencia.clienteNome,
            origin: pedidoEmergencia.endereco_origem,
            destination: pedidoEmergencia.endereco_destino,
            description: pedidoEmergencia.descricao
          };

          this.popupConfirmacaoOpen = true;
        }

      } catch (error) {
        console.error("Erro na validação do loop de emergência:", error);
      }
    },

    async aceitarPedido() {
      try {
        const url = `http://localhost:8080/v1/drivez/pedidos/aceitar/${this.pedidoPendente.id}`;
        await fetch(url, { method: 'POST' });

        this.popupConfirmacaoOpen = false;
        alert('Você aceitou a solicitação! Ela será incluída na sua rota.');
        await this.refreshRequests();
      } catch (error) {
        console.error("Erro ao aceitar a solicitação direta:", error);
      }
    },

    recusarPedido() {
      this.popupConfirmacaoOpen = false;
      this.pedidoPendente = { id: null, name: '', origin: '', destination: '', description: '' };
    },

    async carregarHistoricoDePedidos() {
      try {
        const prestadorId = userStorage.getUserId();
        const url = `http://localhost:8080/v1/drivez/pedidos/historico/${prestadorId}`;
        const response = await fetch(url);
        const dados = await response.json();

        const listaHistorico = dados.response || dados || [];
        this.orders = listaHistorico.map(o => ({
          id: o.id,
          provider: o.clienteNome || 'Cliente',
          avatar: o.avatar || 'https://via.placeholder.com/150',
          date: o.data_solicitacao ? new Date(o.data_solicitacao).toLocaleDateString('pt-BR') : 'Recentemente',
          origin: o.endereco_origem || 'Origem não gravada',
          destination: o.endereco_destino || 'Destino não gravado'
        }));
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      }
    },

    async initMap() {
      this.mapService = new MapboxService();

      if (this.user.localizacao) {
        const coords = await this.mapService.forwardGeocode(this.user.localizacao);
        if (coords) this.presenterLocation = coords;
      }

      this.mapService.initPresenterMap('map-prestador', this.presenterLocation);

      if (this.mapService.map) {
        this.mapService.map.on('load', () => {
          this.mapService.addMarker('prestador', this.presenterLocation[0], this.presenterLocation[1], {
            color: '#D62828',
            popupHTML: `<div style="padding: 8px;"><strong>Você está aqui</strong></div>`
          });
        });
      }
    },

    async updateRequestMarkersFromAPI() {
      this.clearRequestMarkers();
      const coordinatesToFit = [this.presenterLocation];

      for (const request of this.nearbyRequests) {
        let enderecoLimpo = String(request.address)
          .replace(/\d{5}-\d{3}/g, '')
          .replace(/,\s*,/g, ',')
          .trim();

        if (!enderecoLimpo.toLowerCase().includes('são paulo')) {
          enderecoLimpo = `${enderecoLimpo}, São Paulo, Brasil`;
        }

        const coords = await this.mapService.forwardGeocode(enderecoLimpo, this.presenterLocation);

        if (coords) {
          request.lng = coords[0];
          request.lat = coords[1];
          coordinatesToFit.push(coords);

          const markerId = `request-${request.id}`;
          const popupHTML = `<div style="padding: 5px;"><strong>${request.name}</strong></div>`;

          this.mapService.addMarker(markerId, request.lng, request.lat, {
            color: '#0066CC',
            popupHTML
          });

          this.requestMarkerIds.push(markerId);
        }
      }

      if (coordinatesToFit.length > 1) {
        this.mapService.fitToBounds(coordinatesToFit, { padding: 80, duration: 1200 });
      }
    },

    clearRequestMarkers() {
      this.requestMarkerIds.forEach(id => this.mapService.removeMarker(id));
      this.requestMarkerIds = [];
    },

    openRequestModal(request) {
      this.selectedRequest = request;
    },

    closeRequestModal() {
      this.selectedRequest = null;
    },

    async acceptRequest() {
      if (!this.selectedRequest) return;
      try {
        const url = `http://localhost:8080/v1/drivez/pedidos/aceitar/${this.selectedRequest.id}`;
        await fetch(url, { method: 'POST' });
        alert('Serviço aceito com sucesso!');
        this.closeRequestModal();
        await this.refreshRequests();
      } catch (error) {
        console.error('Erro ao aceitar serviço:', error);
        alert('Erro ao aceitar serviço');
      }
    },

    showEmergencyPopup() {
      this.emergencyPopupOpen = true;
    },

    closeEmergencyPopup() {
      this.emergencyPopupOpen = false;
    },

    async acceptEmergencyService() {
      try {
        const url = `http://localhost:8080/v1/drivez/pedidos/aceitar/${this.emergencyRequest.id}`;
        await fetch(url, { method: 'POST' });
        alert('Serviço de emergência aceito!');
        this.closeEmergencyPopup();
        await this.refreshRequests();
      } catch (error) {
        console.error('Erro ao aceitar serviço de emergência:', error);
      }
    }
  },

  async mounted() {

    this.timerConvites = setInterval(async () => {
      await this.verificarNovosConvitesDePedido();
    }, 5000);

    const userId = userStorage.getUserId();
    if (userId) {
      try {
        let response = await buscarPrestador(userId);
        const dadosFinais = response.response || response;
        if (dadosFinais) {
          this.user = { ...this.user, ...dadosFinais };
          userStorage.setSession(userId, dadosFinais, 'prestador');
        }
      } catch (error) {
        console.error('Erro ao carregar perfil inicial:', error);
      }
    }

    try {
      await this.initMap();
    } catch (error) {
      console.error('Erro ao inicializar o mapa:', error);
    }

    try {
      await this.refreshRequests();
    } catch (error) {
      console.error('Erro na primeira carga de pedidos:', error);
    }
  },

  beforeDestroy() {
    if (this.timerConvites) {
      clearInterval(this.timerConvites);
    }
    this.clearRequestMarkers();
    if (this.mapService) this.mapService.destroyMap();
  }
};
</script>

<style scoped>
@import 'mapbox-gl/dist/mapbox-gl.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}


.app-container {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  align-self: center;
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

.sidebar__menu-button {
  background: transparent;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  position: relative;
}

.sidebar__menu-button::before,
.sidebar__menu-button::after,
.sidebar__menu-button span {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background: white;
  transition: all 0.3s ease;
}

.sidebar__menu-button::before {
  top: 6px;
}

.sidebar__menu-button span {
  top: 15px;
}

.sidebar__menu-button::after {
  bottom: 6px;
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

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-left: 0;
  position: relative;
}

.header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: transparent;
  z-index: 101;
}

.header__menu-toggle {
  position: absolute;
  left: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  transition: color 0.2s ease;
}


.header__logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header__logo img {
  max-height: 150px;
  max-width: 320px;
  object-fit: contain;
}



.header__menu-toggle svg {
  width: 50px;
  height: 50px;
  stroke: currentColor;
  stroke-width: 2;
}

.map-container {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: gray;
  position: relative;
}

.right-sidebar {
  position: fixed;
  right: 0;
  top: 0;
  width: 380px;
  height: 100vh;
  background-color: #ffffff;
  border-left: 1px solid #f0f0f0;
  z-index: 998;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  box-shadow: -2px 0 18px rgba(0, 0, 0, 0.08);
}

.right-sidebar.active {
  transform: translateX(0);
}

.right-sidebar__close {
  position: absolute;
  left: -40px;
  top: 10%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: #D62828;
  border: none;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 999;
  box-shadow: 0 4px 16px rgba(214, 40, 40, 0.3);
  transition: all 0.3s ease;
}

.right-sidebar__close:hover {
  background: #a01818;
  transform: translateY(-50%) scale(1.1);
}

.right-sidebar__close svg {
  width: 24px;
  height: 24px;
  stroke: white;
  stroke-width: 2;
}

.right-sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  gap: 16px;
}

.right-sidebar__title-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.right-sidebar__badge {
  width: 40px;
  height: 40px;
  background: #D62828;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.right-sidebar__icon {
  width: 20px;
  height: 20px;
  color: white;
  stroke: white;
}

.right-sidebar__title {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.3;
}

.right-sidebar__refresh {
  background: transparent;
  border: none;
  color: #D62828;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.right-sidebar__refresh:hover {
  transform: rotate(180deg);
}

.right-sidebar__list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
}

.right-sidebar__list::-webkit-scrollbar {
  width: 6px;
}

.right-sidebar__list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.request-card {
  background: #ffffff;
  border: 1.5px solid #f0f0f0;
  border-radius: 14px;
  padding: 14px 16px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.request-card:hover {
  border-color: #D62828;
  box-shadow: 0 4px 12px rgba(214, 40, 40, 0.1);
}

.request-card__top {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}

.request-card__avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: #f0f0f0;
}

.request-card__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.request-card__header {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
}

.request-card__name {
  font-size: 14px;
  font-weight: 700;
  color: #D62828;
  margin: 0;
}

.request-card__distance {
  font-size: 12px;
  color: #888;
  margin: 0;
}

.request-card__rating {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 14px;
  color: #ddd;
}

.star.filled {
  color: #ffc107;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
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

.request-modal {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.request-modal__content {
  display: flex;
  flex-direction: column;
  padding: 40px 24px;
}

.request-modal__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  text-align: center;
}

.request-modal__avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  background: #f0f0f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.request-modal__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.request-modal__name {
  font-size: 28px;
  font-weight: 700;
  color: #1f1f1f;
  margin: 0;
}

.request-modal__rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.request-modal__star {
  font-size: 20px;
  color: #ddd;
}

.request-modal__star.filled {
  color: #ffc107;
}

.request-modal__rating-value {
  font-size: 16px;
  font-weight: 600;
  color: #4a4a4a;
  margin-left: 8px;
}

.request-modal__location {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.request-modal__location-icon {
  font-size: 18px;
}

.request-modal__location-label {
  font-size: 12px;
  font-weight: 700;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.request-modal__map {
  width: 100%;
  height: 240px;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 24px;
  background: #f5f5f5;
}

.request-modal__map-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e8f4f8 0%, #d5e8ed 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.request-modal__actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.request-modal__accept-btn {
  width: 100%;
  background: #D62828;
  border: none;
  color: white;
  padding: 16px;
  border-radius: 28px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.request-modal__accept-btn:hover {
  background: #a01818;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(214, 40, 40, 0.3);
}

.request-modal__accept-arrow {
  font-size: 20px;
}

.request-modal__ignore-btn {
  width: 100%;
  background: transparent;
  border: none;
  color: #666;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.request-modal__ignore-btn:hover {
  color: #333;
  text-decoration: underline;
}

.emergency-test-btn {
  position: absolute;
  right: 24px;
  bottom: 24px;
  padding: 14px 20px;
  background: #D62828;
  color: white;
  border: none;
  border-radius: 28px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 14px 30px rgba(214, 40, 40, 0.25);
  z-index: 10;
}

.emergency-test-btn:hover {
  background: #a01818;
}

.emergency-modal {
  width: min(520px, calc(100% - 40px));
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

.emergency-modal__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  background: #D62828;
}

.emergency-modal__icon {
  width: 24px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emergency-modal__icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.emergency-modal__title-group {
  flex: 1;
}

.emergency-modal__title-label {
  display: block;
  color: #ffffff;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.8px;
}

.emergency-modal__subtitle {
  margin: 4px 0 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  line-height: 1.4;
}

.emergency-modal__close {
  background: transparent;
  border: none;
  color: white;
  font-size: 38px;
  cursor: pointer;
}

.emergency-modal__avatar {
  margin: 24px auto 16px;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  overflow: hidden;
  border: 6px solid #f5f5f5;
}

.emergency-modal__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.emergency-modal__name {
  text-align: center;
  font-size: 24px;
  font-weight: 800;
  margin: 0;
  color: #1f1f1f;
}

.emergency-modal__stars {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin: 12px 0 20px;

}

.emergency-modal__star {
  font-size: 24px;
  color: #ddd;
}

.emergency-modal__star.filled {
  color: #ffc107;
}

.emergency-modal__locations {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 0 28px 24px;
}

.emergency-modal__location-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.emergency-modal__location-icon {
  width: 28px;
  height: 28px;
  margin-top: 4px;
}

.emergency-modal__location-row div {
  flex: 1;
}

.emergency-modal__location-label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #7a7a7a;
  margin-bottom: 6px;
  text-transform: uppercase;
}

.emergency-modal__location-row p {
  margin: 0;
  color: #333;
  line-height: 1.5;
  font-size: 15px;
}

.emergency-modal__accept-btn {
  width: 85%;
  background: #D62828;
  border: none;
  color: white;
  padding: 28px 59px;
  font-size:18px;
  font-weight: 700;
  border-radius: 12px;
  cursor: pointer;
  margin: 24px auto 32px;
  display: flex;
  align-items: center; 
  justify-content: center;
}

.emergency-modal__accept-btn:hover {
  background: #a01818;
}

.popup-confirmacao-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999 !important;
}

.popup-confirmacao-card {
  background: #ffffff;
  width: 90%;
  max-width: 440px;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.popup-confirmacao-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 12px;
  margin-bottom: 16px;
}

.popup-confirmacao-card__header h3 {
  font-size: 1.25rem;
  color: #0f172a;
  font-weight: 700;
  margin: 0;
}

.pulse-dot {
  color: #ef4444;
  font-size: 22px;
  line-height: 1;
  animation: pulseAnimation 1.2s infinite alternate;
}

.popup-confirmacao-card__body p {
  font-size: 0.95rem;
  color: #334155;
  margin: 8px 0;
  line-height: 1.5;
}

.popup-confirmacao-card__body .description-text {
  background: #f8fafc;
  padding: 12px;
  border-left: 4px solid #3b82f6;
  border-radius: 4px;
  margin-top: 14px;
  color: #475569;
}

.popup-confirmacao-card__actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn-action-aceitar {
  flex: 2;
  background: #10b981;
  color: #ffffff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-action-aceitar:hover {
  background: #059669;
}

.btn-action-recusar {
  flex: 1;
  background: #ef4444;
  color: #ffffff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-action-recusar:hover {
  background: #dc2626;
}

@keyframes pulseAnimation {
  from {
    transform: scale(0.9);
    opacity: 0.4;
  }

  to {
    transform: scale(1.1);
    opacity: 1;
  }
}

@media (max-width: 1024px) {
  .right-sidebar {
    width: 320px;
  }

  .right-sidebar__title {
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 280px;
    padding: 24px 20px;
  }

  .right-sidebar {
    width: 100%;
    max-width: 340px;
  }


}

@media (max-width: 480px) {
  .sidebar {
    width: 100%;
    max-width: 280px;
  }

  .right-sidebar {
    width: 100%;
  }
}

.locationIcon{
  width: 18px;
  height: 18px;
}
</style>
