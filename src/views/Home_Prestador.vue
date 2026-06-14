<template>
  <div class="app-container">
    <template v-if="activeScreen === 'history'">
      <section class="orders-screen">
        <div class="orders-screen__header">
          <h2 class="orders-screen__title">Histórico de Pedidos</h2>
          <button class="orders-screen__back" @click="activeScreen = 'home'">Voltar</button>
        </div>

        <div v-if="historyLoading" class="orders-screen__loading">
          <div class="orders-spinner"></div>
          <span>Carregando pedidos...</span>
        </div>

        <div v-else-if="orders.length === 0" class="orders-screen__empty">
          <span class="orders-screen__empty-icon">📋</span>
          <p>Você ainda não atendeu nenhum pedido.</p>
          <button class="orders-screen__cta" @click="activeScreen = 'home'">Voltar para o mapa</button>
        </div>

        <div v-else class="orders-screen__list">
          <article v-for="order in orders" :key="order.id" class="orders-screen__card">
            <div class="orders-screen__top">
              <div class="orders-screen__provider">
                <img :src="order.clientAvatar || defaultProfileFallback" @error="order.clientAvatar = defaultProfileFallback"
                  alt="Avatar do cliente" class="orders-screen__avatar" />
                <div class="orders-screen__provider-info">
                  <span class="orders-screen__provider-label">Cliente</span>
                  <strong class="orders-screen__provider-name">{{ order.clientName }}</strong>
                  <span v-if="order.categoria" class="orders-screen__category">{{ order.categoria }}</span>
                </div>
              </div>
              <div class="orders-screen__info">
                <span class="orders-screen__date">{{ order.date }}</span>
                <span
                  class="orders-screen__status-badge"
                  :class="{
                    'status--concluido': order.status === 'Concluído' || order.status === 'concluido' || order.status === 'concluído',
                    'status--pendente': order.status === 'Pendente' || order.status === 'pendente',
                    'status--cancelado': order.status === 'Cancelado' || order.status === 'cancelado',
                    'status--andamento': order.status === 'Em andamento' || order.status === 'em_andamento'
                  }"
                >{{ order.status }}</span>
              </div>
            </div>
            <div class="orders-screen__route">
              <div class="orders-screen__route-group">
                <span class="orders-screen__route-title">Origem</span>
                <span class="orders-screen__route-text">{{ order.origin }}</span>
              </div>
              <div class="orders-screen__route-arrow">↓</div>
              <div class="orders-screen__route-group">
                <span class="orders-screen__route-title">Destino</span>
                <span class="orders-screen__route-text">{{ order.destination }}</span>
              </div>
            </div>
            <div v-if="order.descricao || order.distancia_km" class="orders-screen__footer">
              <span v-if="order.descricao" class="orders-screen__desc">{{ order.descricao }}</span>
              <span v-if="order.distancia_km" class="orders-screen__distance">{{ order.distancia_km }} km</span>
            </div>
          </article>
        </div>
      </section>
    </template>

    <template v-else>
      <aside class="sidebar" :class="{ active: sidebarOpen }">
        <div class="sidebar__top-row"></div>

        <div class="sidebar__profile-block">
          <img :src="userProfileImage" alt="Foto do usuário" class="sidebar__logo">
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
          <button class="sidebar__item" @click="handleSidebarAction('profile')">
            <img src="../assets/profile.svg" alt="Perfil" class="sidebar__icon">
            <span class="sidebar__label">Editar Perfil</span>
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
            <button class="sidebar-popup__option" @click="logout" style="color: #D62828; font-weight: 700;">
              Sair da Conta
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
            <img src="../assets/logo-principal-black.png" alt="DriveZ" class="header__logo-img">
          </div>
        </header>
        <div class="map-container">
          <div id="map-prestador" class="map-placeholder"></div>
         
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"
                class="right-sidebar__icon">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </div>
            <h2 class="right-sidebar__title">Mensagens</h2>
          </div>
        </div>

        <div class="right-sidebar__list">
          <div v-if="messageNotifications.length === 0" class="msg-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ddd" stroke-width="1.5">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            <p>Nenhuma mensagem ainda.</p>
          </div>
          <div
            v-for="notif in messageNotifications"
            :key="notif.roomId"
            class="msg-notif-card"
            @click="irParaMensagem(notif)"
          >
            <div class="msg-notif-card__avatar">
              <img :src="defaultProfileFallback" :alt="notif.name" />
            </div>
            <div class="msg-notif-card__body">
              <div class="msg-notif-card__header">
                <span class="msg-notif-card__name">{{ notif.name }}</span>
                <span class="msg-notif-card__time">{{ notif.time }}</span>
              </div>
              <p class="msg-notif-card__preview">{{ notif.lastMessage }}</p>
            </div>
            <span v-if="notif.unread > 0" class="msg-notif-card__badge">{{ notif.unread }}</span>
          </div>
        </div>
      </aside>

      <div v-if="selectedRequest" class="modal-overlay" @click="closeRequestModal">
        <div class="request-modal" @click.stop>
          <div class="request-modal__content">
            <div class="request-modal__header">
              <div class="request-modal__avatar">
                <img :src="selectedRequest.avatar" alt="Foto do cliente">
              </div>
              <h2 class="request-modal__name">{{ selectedRequest.name }}</h2>
              <div class="request-modal__rating">
                <span v-for="i in 5" :key="i" class="request-modal__star"
                  :class="{ filled: i <= selectedRequest.rating }">★</span>
                <span class="request-modal__rating-value">{{ selectedRequest.rating }}.0</span>
              </div>
            </div>

            <div class="request-modal__location">
              <div class="request-modal__location-icon"><img src="../assets/location.png" alt="" class="locationIcon">
              </div>
              <span class="request-modal__location-label">LOCAL DE SOLICITAÇÃO</span>
            </div>
            <p class="request-modal__location-address">{{ selectedRequest.address }}</p>

            <div class="request-modal__map">
              <div id="request-card-map" class="request-modal__map-placeholder"></div>
            </div>

            <div class="request-modal__actions">
              <button class="request-modal__accept-btn" @click="aceitarPedido">
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
            <span v-for="i in 5" :key="i"
              :class="['emergency-modal__star', { filled: i <= emergencyRequest.rating }]">★</span>
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

          <button class="emergency-modal__accept-btn" @click="aceitarPedido">Aceitar Serviço</button>
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
import { ref } from 'vue'
import { listarPedidos, listarEmergenciasPendentes, aceitarEmergencia } from '../requests/pedido';
import { buscarPedidosPrestador } from '../requests/pedidos';
import { prestadoresGuincho } from '../requests/prestador';
import defaultProfile from '../assets/profile.svg';
import { useRouter } from 'vue-router';
import { db } from '@/firebase/firebase';
import { collection, query, orderBy, onSnapshot, doc } from 'firebase/firestore';

const router = useRouter();

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
      historyLoading: false,
      mapService: null,
      requestMarkerIds: [],
      presenterLocation: [-46.9015, -23.5255],
      requestMapService: null,
      nearbyRequests: [],
      defaultProfileFallback: defaultProfile,
      timerConvites: null,
      popupConfirmacaoOpen: false,
      pedidoPendente: { id: null, name: '', origin: '', destination: '', description: '' },
      messageNotifications: [],
      _firestoreUnsubs: [],
    };
  },
  computed: {
    userProfileImage() {
      if (this.user && (this.user.profileImage || this.user.img_perfil || this.user.foto)) {
        return this.user.profileImage || this.user.img_perfil || this.user.foto;
      }
      return defaultProfile;
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    closeAllPopups() {
      this.sidebarOpen = false;
      this.orderPopupOpen = false;
    },

    normalizeUserSessionData(userData = {}) {
      const imagem = userData.profileImage || userData.img_perfil || userData.foto || userData.imagem || '';
      return {
        nome: userData.nome || userData.nome_prestador || userData.name || '',
        telefone: userData.telefone || userData.phone || userData.celular || '',
        localizacao: userData.localizacao || userData.endereco || '',
        img_perfil: imagem,
        profileImage: imagem
      };
    },

    loadUserFromStorage(event) {
      const sourceData = event?.detail || userStorage.getUserData();
      if (!sourceData) return;
      const rawData = sourceData?.response || sourceData?.user || sourceData || {};
      this.user = {
        ...this.user,
        ...this.normalizeUserSessionData(rawData)
      };
    },

    handleSidebarAction(action) {
      this.closeAllPopups();
      if (action === 'orders') {
        this.activeScreen = 'history';
        this.carregarHistoricoDePedidos();
      } else if (action === 'messages') {
        this.$router.push('/mensagens-prestador');
      } else if (action === 'profile') {
        this.$router.push('/perfil-prestador');
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

          // 1. Captura a propriedade de imagem que vem da API do cliente
          const rawAvatar = dadosCliente?.img_perfil || dadosCliente?.profileImage || dadosCliente?.foto || dadosCliente?.avatar || dadosCliente?.imagem;

          // 2. TRATAMENTO DA URL: Se a foto existir, verifica se precisa injetar a URL do backend (http://localhost:8080)
          let fotoFinal = defaultProfile;
          if (rawAvatar) {
            if (rawAvatar.startsWith('http') || rawAvatar.startsWith('data:image')) {
              fotoFinal = rawAvatar;
            } else {
              // Ajuste o endereço "http://localhost:8080" se o seu backend rodar em outra porta
              fotoFinal = `https://backend-drivez-atgfavb2cuccgrah.eastus2-01.azurewebsites.net/${rawAvatar.replace(/^\//, '')}`;
            }
          }

          return {
            id: pedido.id || pedido.id_pedido,
            name: dadosCliente?.nome || dadosCliente?.nome_cliente || dadosCliente?.name || pedido.clienteNome || 'Cliente',
            address: pedido.endereco_origem || pedido.endereco || 'Endereço não informado',
            rating: Number(dadosCliente?.avaliacao || 5),
            avatar: fotoFinal, // <-- Agora passa a foto com a URL corrigida
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

        // Buscar todos os prestadores da categoria 'guincho'
        const dadosGuinchoRaw = await prestadoresGuincho();
        const listaGuinchos = dadosGuinchoRaw?.response || dadosGuinchoRaw || [];
        const guinchoIds = listaGuinchos.map(p => String(p.id_prestador || p.id || p.prestadorId || p.id_prestador));

        // Buscar diretamente emergências pendentes via endpoint dedicado
        const dadosGerais = await listarEmergenciasPendentes();
        let emergenciasPendentes = [];
        if (Array.isArray(dadosGerais)) emergenciasPendentes = dadosGerais;
        else if (dadosGerais?.response) emergenciasPendentes = dadosGerais.response;
        else if (dadosGerais?.emergencias) emergenciasPendentes = dadosGerais.emergencias;

        if (emergenciasPendentes.length === 0) {
          // limpa lista se não houver emergências
          this.nearbyRequests = [];
          return;
        }

        // Mapear emergências para objetos de UI exibíveis para prestadores guincho
        const promessas = emergenciasPendentes.map(async (pedido) => {
          const clienteId = pedido.id_cliente || pedido.clienteId || pedido.idCliente;
          let dadosCliente = null;

          if (clienteId) {
            try {
              const resCliente = await buscarClientePorId(clienteId);
              dadosCliente = resCliente.response || resCliente;
            } catch (err) {
              console.error(`Erro ao buscar dados do cliente ${clienteId}:`, err);
            }
          }

          const rawAvatar = dadosCliente?.img_perfil || dadosCliente?.profileImage || dadosCliente?.foto || dadosCliente?.avatar || dadosCliente?.imagem;
          let fotoFinal = defaultProfile;
          if (rawAvatar) {
            if (rawAvatar.startsWith('http') || rawAvatar.startsWith('data:image')) fotoFinal = rawAvatar;
            else fotoFinal = `https://backend-drivez-atgfavb2cuccgrah.eastus2-01.azurewebsites.net/${String(rawAvatar).replace(/^\//, '')}`;
          }

          return {
            id: pedido.id || pedido.id_pedido || `${pedido.id || Date.now()}`,
            name: dadosCliente?.nome || dadosCliente?.nome_cliente || pedido.clienteNome || 'Cliente',
            address: pedido.endereco_origem || pedido.endereco || 'Origem não informada',
            origin: pedido.endereco_origem || '',
            destination: pedido.endereco_destino || pedido.endereco_destino || pedido.endereco || '',
            message: pedido.descricao || 'Solicitação de emergência',
            rating: Number(dadosCliente?.avaliacao || 5),
            avatar: fotoFinal,
            detalhesPedido: pedido
          };
        });

        const requests = await Promise.all(promessas);

        // Apenas mostrar casos de emergência para prestadores da categoria guincho (inclui o usuário logado se for guincho)
        // Se o prestador logado não for guincho, ele não verá esses cards.
        const meuIdStr = String(prestadorLogadoId);
        const souGuincho = guinchoIds.includes(meuIdStr);

        if (souGuincho) {
          this.nearbyRequests = requests;
        } else {
          this.nearbyRequests = [];
        }

      } catch (error) {
        console.error("Erro na validação do loop de emergência:", error);
      }
    },

    async handleMockEmergency(event) {
      try {
        console.log('[Home_Prestador] handleMockEmergency chamado com event:', event);
        const pedido = event?.detail;
        console.log('[Home_Prestador] Pedido recebido:', pedido);
        if (!pedido) {
          console.warn('[Home_Prestador] Pedido vazio, retornando');
          return;
        }

        const prestadorLogadoId = userStorage.getUserId();
        console.log('[Home_Prestador] Prestador logado:', prestadorLogadoId);
        if (!prestadorLogadoId) {
          console.warn('[Home_Prestador] Sem prestador logado');
          return;
        }

        // NOTA: Removido filtro de categoria "guincho" - qualquer prestador pode receber emergências
        // Se necessário, adicionar lógica de categoria depois
        console.log('[Home_Prestador] Aceitando emergência para qualquer prestador (sem filtro de categoria)');

        // Busca dados do cliente (se houver)
        const clienteId = pedido.id_cliente || pedido.clienteId || pedido.idCliente;
        let dadosCliente = null;
        if (clienteId) {
          try {
            const resCliente = await buscarClientePorId(clienteId);
            dadosCliente = resCliente.response || resCliente;
          } catch (err) {
            console.error('Erro ao buscar cliente no mock:', err);
          }
        }

        const rawAvatar = dadosCliente?.img_perfil || dadosCliente?.profileImage || dadosCliente?.foto || dadosCliente?.avatar || dadosCliente?.imagem;
        let fotoFinal = this.defaultProfileFallback || '../assets/profile.svg';
        if (rawAvatar) {
          if (String(rawAvatar).startsWith('http') || String(rawAvatar).startsWith('data:image')) fotoFinal = rawAvatar;
          else fotoFinal = `https://backend-drivez-atgfavb2cuccgrah.eastus2-01.azurewebsites.net/${String(rawAvatar).replace(/^\//, '')}`;
        }

        const pedidoId = pedido.id || pedido.id_pedido || `${pedido.id || Date.now()}`;

        // Preencher o objeto usado pelo modal de emergência já existente
        this.emergencyRequest = {
          id: pedidoId,
          name: dadosCliente?.nome || dadosCliente?.nome_cliente || pedido.clienteNome || 'Cliente',
          origin: pedido.endereco_origem || pedido.endereco || 'Origem não informada',
          destination: pedido.endereco_destino || pedido.endereco || '',
          rating: Number(dadosCliente?.avaliacao || 5),
          avatar: fotoFinal,
          detalhesPedido: pedido
        };

        // Atualiza pedidoPendente para compatibilidade com outras ações
        this.pedidoPendente = {
          id: pedidoId,
          name: this.emergencyRequest.name,
          origin: this.emergencyRequest.origin,
          destination: this.emergencyRequest.destination,
          description: pedido.descricao || ''
        };

        // Abre o modal/card de emergência existente
        this.emergencyPopupOpen = true;
        console.log('[Home_Prestador] ✅ Modal de emergência aberto!', this.emergencyRequest);
      } catch (error) {
        console.error('[Home_Prestador] Erro ao processar mock-emergency:', error);
      }
    },



    async aceitarPedido() {
      try {
        const pedidoId = this.pedidoPendente.id || (this.selectedRequest && this.selectedRequest.id);
        if (!pedidoId) {
          console.warn('Nenhum pedido selecionado para aceitar');
          return;
        }

        this.popupConfirmacaoOpen = false;

        let prestadorId = userStorage.getUserId() || `mock-prestador-${Date.now()}`;
        try {
          // Preferir usar o endpoint especializado
          await aceitarEmergencia(pedidoId, prestadorId);
          console.log('[Home_Prestador] aceitarEmergencia OK', pedidoId, prestadorId);
        } catch (err) {
          console.warn('[Home_Prestador] aceitarEmergencia falhou, emitindo mock-accept fallback', err);
        }

        // Emite sinal cross-tab para garantir que o cliente receba o aceite (fallback/mocks)
        const _rawPd = userStorage.getUserData() || {};
        const _pd = _rawPd?.response || _rawPd?.user || _rawPd || {};
        const prestador = {
          nome: _pd.nome || _pd.nome_prestador || _pd.name || 'Prestador',
          img_perfil: _pd.img_perfil || _pd.foto || _pd.profileImage || null,
          media_avaliacoes: _pd.media_avaliacoes || _pd.rating || '4.5',
          placa: _pd.placa || _pd.placa_veiculo || _pd.plate || '---',
        };
        try {
          const ev = new CustomEvent('drivez:mock-accept', { detail: { pedidoId, prestadorId, prestador } });
          window.dispatchEvent(ev);
        } catch (e) { console.warn('erro dispatchEvent mock-accept', e); }
        try { localStorage.setItem('drivez:mock-accept', JSON.stringify({ pedidoId, prestadorId, prestador, timestamp: Date.now() })); } catch (e) { }
        try { const bc = new BroadcastChannel('drivez-channel'); bc.postMessage({ type: 'mock-accept', payload: { pedidoId, prestadorId, prestador } }); bc.close(); } catch (e) { }

        // Após aceitar, abre a tela de acompanhamento do prestador
        const detalhes = this.selectedRequest?.detalhesPedido || this.pedidoPendente || {};
        const txtOrigem = this.selectedRequest?.origin || this.pedidoPendente.origin || this.selectedRequest?.address || '';
        const txtDestino = this.selectedRequest?.destination || this.pedidoPendente.destination || '';

        await this.prepareAndOpenPedido(detalhes, txtOrigem, txtDestino);
        await this.refreshRequests();
      } catch (error) {
        console.error("Erro ao aceitar a solicitação direta:", error);
      }
    },
    irParaMensagem(notif) {
      try {
        this.$router.push({
          name: 'mensagens-prestador',
          query: {
            contactId: notif.roomId,
            contactName: notif.name,
          }
        });
      } catch (error) {
        console.error("Erro ao ir para a mensagem:", error);
      }
    },

    formatNotifTime(timestamp) {
      if (!timestamp) return '';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const diff = Date.now() - date.getTime();
      if (diff < 60000) return 'agora';
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
      return `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
    },

    setupMessageListeners() {
      this._firestoreUnsubs.forEach(u => u());
      this._firestoreUnsubs = [];

      const prestadorId = userStorage.getUserId();
      if (!prestadorId) return;

      let trackedRooms = [];
      try { trackedRooms = JSON.parse(localStorage.getItem('drivez_prestador_rooms') || '[]'); } catch {}

      const allRoomIds = [...new Set([Number(prestadorId), ...trackedRooms].filter(Boolean))];

      allRoomIds.forEach(roomId => {
        // Listener no documento da sala — fonte primária do nome do cliente
        const roomDocUnsub = onSnapshot(doc(db, 'rooms', String(roomId)), snapshot => {
          const data = snapshot.data() || {};
          if (!data.clientName) return;
          const idx = this.messageNotifications.findIndex(n => n.roomId === roomId);
          if (idx >= 0) {
            this.messageNotifications[idx].name = data.clientName;
          }
          // Guarda o nome para quando as mensagens chegarem
          if (!this._roomNames) this._roomNames = {};
          this._roomNames[roomId] = data.clientName;
        }, err => console.error('[HomePrestador] room doc error:', err));
        this._firestoreUnsubs.push(roomDocUnsub);

        // Listener nas mensagens — prévia e contagem
        const q = query(
          collection(db, 'rooms', String(roomId), 'messages'),
          orderBy('createdAt')
        );
        const unsub = onSnapshot(q, snapshot => {
          const clientDocs = snapshot.docs.filter(d => d.data().sender === 'cliente');
          if (clientDocs.length === 0) return;

          const lastDoc = clientDocs[clientDocs.length - 1];
          const lastData = lastDoc.data();

          // Busca o melhor nome disponível
          const bestSenderName = clientDocs
            .map(d => d.data().senderName)
            .find(n => n && n.trim() && n.trim() !== 'Cliente') || '';

          if (!this._roomNames) this._roomNames = {};
          const resolvedName =
            this._roomNames[roomId] ||
            bestSenderName ||
            this.messageNotifications.find(n => n.roomId === roomId)?.name ||
            'Cliente';

          const notif = {
            roomId,
            name: resolvedName,
            lastMessage: lastData.text || '',
            time: this.formatNotifTime(lastData.createdAt),
            unread: clientDocs.length,
          };

          const idx = this.messageNotifications.findIndex(n => n.roomId === roomId);
          if (idx >= 0) {
            this.messageNotifications.splice(idx, 1, notif);
          } else {
            this.messageNotifications.push(notif);
          }
        }, err => console.error('[HomePrestador] Firestore listener error:', err));

        this._firestoreUnsubs.push(unsub);
      });
    },

    recusarPedido() {
      this.popupConfirmacaoOpen = false;
      this.pedidoPendente = { id: null, name: '', origin: '', destination: '', description: '' };
    },

    async carregarHistoricoDePedidos() {
      this.historyLoading = true;
      try {
        const resultado = await buscarPedidosPrestador();
        this.orders = Array.isArray(resultado) ? resultado : [];
        console.log('[HomePrestador] Histórico carregado:', this.orders.length, 'pedidos');
      } catch (error) {
        console.error('[HomePrestador] Erro ao carregar histórico:', error);
        this.orders = [];
      } finally {
        this.historyLoading = false;
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

    async prepareAndOpenPedido(detalhesPedido = {}, txtOrigem = '', txtDestino = '') {
      // Tentativa de extrair coordenadas do objeto do pedido em várias formas comuns
      const d = detalhesPedido || {};

      const getNumber = (v) => (v !== undefined && v !== null && v !== '' ? Number(v) : null);

      const tryKeys = (o, keys) => {
        for (const k of keys) {
          if (o[k] !== undefined && o[k] !== null) return o[k];
        }
        return null;
      };

      let origemLng = tryKeys(d, ['origemLng','origem_lng','originLng','origin_lng','lng_origem','longitude_origem','longitudeOrigem','longitude']);
      let origemLat = tryKeys(d, ['origemLat','origem_lat','originLat','origin_lat','lat_origem','latitude_origem','latitudeOrigem','latitude']);
      let destinoLng = tryKeys(d, ['destinoLng','destino_lng','destinationLng','destination_lng','lng_destino','longitude_destino','longitudeDestino']);
      let destinoLat = tryKeys(d, ['destinoLat','destino_lat','destinationLat','destination_lat','lat_destino','latitude_destino','latitudeDestino']);

      origemLng = getNumber(origemLng);
      origemLat = getNumber(origemLat);
      destinoLng = getNumber(destinoLng);
      destinoLat = getNumber(destinoLat);

      // Se não temos coordenadas, tentar geocodificar com Mapbox
      const mapSvc = this.mapService || new MapboxService();

      if ((!origemLng || !origemLat) && txtOrigem) {
        try {
          const coords = await mapSvc.forwardGeocode(txtOrigem, this.presenterLocation);
          if (coords) {
            origemLng = coords[0]; origemLat = coords[1];
          }
        } catch (e) { console.warn('Erro ao geocodificar origem:', e); }
      }

      if ((!destinoLng || !destinoLat) && txtDestino) {
        try {
          const coords = await mapSvc.forwardGeocode(txtDestino, this.presenterLocation);
          if (coords) {
            destinoLng = coords[0]; destinoLat = coords[1];
          }
        } catch (e) { console.warn('Erro ao geocodificar destino:', e); }
      }

      // Navegar para a tela do pedido do prestador passando as coordenadas e textos
      const query = {
        origemLng: origemLng != null ? String(origemLng) : '',
        origemLat: origemLat != null ? String(origemLat) : '',
        destinoLng: destinoLng != null ? String(destinoLng) : '',
        destinoLat: destinoLat != null ? String(destinoLat) : '',
        txtOrigem: txtOrigem || '',
        txtDestino: txtDestino || ''
      };

      // Try to include client info if available on detalhesPedido
      try {
        const clienteNome = detalhesPedido?.clienteNome || detalhesPedido?.nome || detalhesPedido?.nome_cliente || detalhesPedido?.customerName || detalhesPedido?.name || null;
        const clienteRating = detalhesPedido?.clienteRating || detalhesPedido?.rating || detalhesPedido?.avaliacao || detalhesPedido?.cliente_avaliacao || null;
        const clienteFoto = detalhesPedido?.clienteFoto || detalhesPedido?.foto || detalhesPedido?.avatar || detalhesPedido?.avatarUrl || null;
        if (clienteNome) query.clientName = String(clienteNome);
        if (clienteRating !== undefined && clienteRating !== null) query.clientRating = String(clienteRating);
        if (clienteFoto) query.clientPhoto = String(clienteFoto);
        const clientePlaca = detalhesPedido?.placa || detalhesPedido?.plate || detalhesPedido?.placa_veiculo || null;
        if (clientePlaca) query.clientPlate = String(clientePlaca);
      } catch (e) { /* ignore */ }

      this.$router.push({ name: 'pedido-prestador', query });
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

    async openRequestModal(request) {
      this.selectedRequest = request;
      await this.$nextTick();
      await this.initRequestCardMap();
    },

    closeRequestModal() {
      if (this.requestMapService) {
        this.requestMapService.destroyMap();
        this.requestMapService = null;
      }
      this.selectedRequest = null;
    },

    async initRequestCardMap() {
      if (!this.selectedRequest) return;

      if (this.requestMapService) {
        this.requestMapService.destroyMap();
        this.requestMapService = null;
      }

      this.requestMapService = new MapboxService();

      let coords = null;
      if (this.selectedRequest.lng != null && this.selectedRequest.lat != null) {
        coords = [this.selectedRequest.lng, this.selectedRequest.lat];
      } else if (this.selectedRequest.address) {
        coords = await this.requestMapService.forwardGeocode(this.selectedRequest.address, this.presenterLocation);
      }

      if (!coords) {
        return;
      }

      this.requestMapService.initPresenterMap('request-card-map', coords);
      if (this.requestMapService.map) {
        this.requestMapService.map.on('load', () => {
          this.requestMapService.addMarker('selected-request', coords[0], coords[1], {
            color: '#D62828',
            popupHTML: '<div style="padding: 8px;"><strong>Origem do solicitante</strong></div>'
          });
          this.requestMapService.map.flyTo({ center: coords, zoom: 14 });
        });
      }
    },

    async acceptRequest() {
      if (!this.selectedRequest) return;
      try {
        // Try backend accept; prefer the dedicated aceitarEmergencia() wrapper
        const pedidoId = this.selectedRequest.id;
        try {
          if (String(pedidoId).startsWith('mock-')) throw new Error('mock');
          const prestadorId = userStorage.getUserId() || `mock-prestador-${Date.now()}`;
          await aceitarEmergencia(pedidoId, prestadorId);
        } catch (err) {
          const prestadorId = userStorage.getUserId() || `mock-prestador-${Date.now()}`;
          const _rawPd2 = userStorage.getUserData() || {};
          const _pd2 = _rawPd2?.response || _rawPd2?.user || _rawPd2 || {};
          const prestador2 = {
            nome: _pd2.nome || _pd2.nome_prestador || _pd2.name || 'Prestador',
            img_perfil: _pd2.img_perfil || _pd2.foto || _pd2.profileImage || null,
            media_avaliacoes: _pd2.media_avaliacoes || _pd2.rating || '4.5',
            placa: _pd2.placa || _pd2.placa_veiculo || _pd2.plate || '---',
          };
          const ev = new CustomEvent('drivez:mock-accept', { detail: { pedidoId, prestadorId, prestador: prestador2 } });
          window.dispatchEvent(ev);
          try {
            localStorage.setItem('drivez:mock-accept', JSON.stringify({ pedidoId, prestadorId, prestador: prestador2, timestamp: Date.now() }));
          } catch (e) { }
        }

        alert('Serviço aceito com sucesso!');
        this.closeRequestModal();
        const detalhes = this.selectedRequest?.detalhesPedido || this.selectedRequest || {};
        const txtOrigem = this.selectedRequest?.origin || this.selectedRequest?.address || '';
        const txtDestino = this.selectedRequest?.destination || '';
        await this.prepareAndOpenPedido(detalhes, txtOrigem, txtDestino);
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
        const pedidoId = this.emergencyRequest.id;
        try {
          const prestadorId = userStorage.getUserId() || `mock-prestador-${Date.now()}`;
          await aceitarEmergencia(pedidoId, prestadorId);
        } catch (err) {
          const prestadorId = userStorage.getUserId() || `mock-prestador-${Date.now()}`;
          const _rawPd3 = userStorage.getUserData() || {};
          const _pd3 = _rawPd3?.response || _rawPd3?.user || _rawPd3 || {};
          const prestador3 = {
            nome: _pd3.nome || _pd3.nome_prestador || _pd3.name || 'Prestador',
            img_perfil: _pd3.img_perfil || _pd3.foto || _pd3.profileImage || null,
            media_avaliacoes: _pd3.media_avaliacoes || _pd3.rating || '4.5',
            placa: _pd3.placa || _pd3.placa_veiculo || _pd3.plate || '---',
          };
          const ev = new CustomEvent('drivez:mock-accept', { detail: { pedidoId, prestadorId, prestador: prestador3 } });
          window.dispatchEvent(ev);
          try {
            localStorage.setItem('drivez:mock-accept', JSON.stringify({ pedidoId, prestadorId, prestador: prestador3, timestamp: Date.now() }));
          } catch (e) { }
        }

        alert('Serviço de emergência aceito!');
        this.closeEmergencyPopup();
        const detalhes = this.emergencyRequest?.detalhesPedido || this.emergencyRequest || {};
        const txtOrigem = this.emergencyRequest?.origin || '';
        const txtDestino = this.emergencyRequest?.destination || '';
        await this.prepareAndOpenPedido(detalhes, txtOrigem, txtDestino);
        await this.refreshRequests();
      } catch (error) {
        console.error('Erro ao aceitar serviço de emergência:', error);
      }
    },

    logout() {
      if (confirm('Deseja sair da sua conta?')) {
        userStorage.clear();
        localStorage.clear();
        sessionStorage.clear();
        this.$router.push('/');
      }
    },

    testMockEmergency() {
      console.log('[Home_Prestador] 🧪 Disparando teste de mock-emergency');
      const mockEvent = new CustomEvent('drivez:mock-emergency', {
        detail: {
          id: `test-mock-${Date.now()}`,
          id_pedido: `test-mock-${Date.now()}`,
          id_cliente: userStorage.getUserId() || 'cliente-teste',
          endereco_origem: 'Rua Teste, 123 - São Paulo, Brasil',
          endereco_destino: 'Av. Teste, 456 - São Paulo, Brasil',
          descricao: 'Teste de emergência',
          clienteNome: 'Cliente Teste',
          data_solicitacao: new Date().toISOString(),
          tipo_pedido: 'emergencia'
        }
      });
      window.dispatchEvent(mockEvent);
    }
  },

  async mounted() {

    if (!userStorage.isPrestador()) {
      if (userStorage.isCliente()) {
        console.warn('[Home_Prestador] Usuário cliente logado. Redirecionando para home-cliente.');
        router.push({ name: 'home-cliente' });
        return;
      }
      console.error('[Home_Prestador] Sessão inválida ou usuário não é prestador. Redirecionando para login.');
      router.push({ name: 'login' });
      return;
    }

    this.loadUserFromStorage();
    window.addEventListener('userDataUpdated', this.loadUserFromStorage);
    this.setupMessageListeners();
    
    // Escuta eventos de emergência mock emitidos pelo cliente (frontend-only)
    // Usar arrow function para preservar 'this'
    this._mockEmergencyListener = (event) => this.handleMockEmergency(event);
    window.addEventListener('drivez:mock-emergency', this._mockEmergencyListener);
    console.log('[Home_Prestador] Listener de mock-emergency registrado');
    
    // Fallback: escuta mudanças no localStorage (funciona entre abas)
    this._storageListener = (event) => {
      if (event?.key === 'drivez:mock-emergency' && event?.newValue) {
        try {
          const mockData = JSON.parse(event.newValue);
          console.log('[Home_Prestador] 📱 Mock-emergency recebido via localStorage:', mockData);
          this.handleMockEmergency({ detail: mockData });
        } catch (e) {
          console.error('[Home_Prestador] Erro ao processar localStorage:', e);
        }
      }
    };
    window.addEventListener('storage', this._storageListener);
    console.log('[Home_Prestador] Listener de storage registrado');

    this.timerConvites = setInterval(async () => {
      await this.verificarNovosConvitesDePedido();
    }, 5000);

    const userId = userStorage.getUserId();
    if (userId) {
      try {
        let response = await buscarPrestador(userId);
        const dadosFinais = response.response || response;
        if (dadosFinais) {
          this.user = { ...this.user, ...this.normalizeUserSessionData(dadosFinais) };
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
    try { clearInterval(this.timerConvites); } catch (e) {}
    window.removeEventListener('userDataUpdated', this.loadUserFromStorage);
    if (this._mockEmergencyListener) window.removeEventListener('drivez:mock-emergency', this._mockEmergencyListener);
    if (this._storageListener) window.removeEventListener('storage', this._storageListener);
    this._firestoreUnsubs.forEach(u => u());
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
  gap: 12px;
  align-items: center;
}

.sidebar__logout {
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

.sidebar__logout:hover {
  background-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-1px);
}

.sidebar__logout .sidebar__icon {
  width: 32px;
  height: 32px;
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

.header__logo img,
.header__logo-img {
    height: 200px;
  width: auto;
  max-width: 250px;
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
  margin: 18px 24px;
  padding: 28px 32px;
  background: #f5f6f8;
  border-radius: 28px;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.orders-screen__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.orders-screen__title {
  font-size: 20px;
  font-weight: 800;
  color: #111111;
  flex: 1;
}

.orders-screen__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 200px;
  color: #D62828;
  font-size: 15px;
}

.orders-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #D62828;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.orders-screen__back {
  background: #D62828;
  border: none;
  color: white;
  border-radius: 12px;
  padding: 12px 24px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  transition: background 0.2s ease, transform 0.2s ease;
}

.orders-screen__back:hover {
  background: #b81f1f;
  transform: translateY(-1px);
}

.orders-screen__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 240px;
  text-align: center;
  color: #334155;
  background: #ffffff;
  border-radius: 20px;
  padding: 32px 24px;
  border: 1px dashed #d8d8d8;
}

.orders-screen__empty-icon {
  font-size: 48px;
}

.orders-screen__empty p {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
}

.orders-screen__status-badge {
  display: inline-block;
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  background: #e8e8e8;
  color: #555555;
}

.status--concluido {
  background: #d4edda;
  color: #1a7a3a;
}

.status--pendente {
  background: #fff3cd;
  color: #856404;
}

.status--cancelado {
  background: #f8d7da;
  color: #842029;
}

.status--andamento {
  background: #cfe2ff;
  color: #084298;
}

.orders-screen__category {
  display: block;
  font-size: 12px;
  color: #D62828;
  font-weight: 600;
  margin-top: 2px;
}

.orders-screen__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.orders-screen__desc {
  font-size: 13px;
  color: #7f7f7f;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.orders-screen__distance {
  font-size: 13px;
  font-weight: 700;
  color: #333333;
  white-space: nowrap;
  flex-shrink: 0;
}

.orders-screen__cta {
  background: #D62828;
  border: none;
  color: white;
  padding: 14px 24px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
}

.orders-screen__cta:hover {
  background: #b81f1f;
}

.orders-screen__list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  overflow-y: auto;
  padding-right: 8px;
  flex: 1;
  min-height: 0;
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
  border-radius: 28px;
  padding: 28px 32px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 28px;
  transition: border-color 0.2s ease;
}

.orders-screen__card:hover {
  border-color: #D62828;
}

.orders-screen__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.orders-screen__provider {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.orders-screen__avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.orders-screen__provider-label {
  display: block;
  font-size: 12px;
  color: #7f7f7f;
  font-weight: 500;
  margin-bottom: 2px;
}

.orders-screen__provider-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.orders-screen__provider-name {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: #111111;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.orders-screen__date {
  font-size: 16px;
  color: #333333;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.orders-screen__info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.orders-screen__route {
  display: flex;
  flex-direction: column;
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
  letter-spacing: 0.5px;
}

.orders-screen__route-text {
  font-size: 15px;
  color: #4a4a4a;
  line-height: 1.5;
  font-weight: 500;
}

.orders-screen__route-arrow {
  font-size: 20px;
  color: #b3b3b3;
  text-align: start;
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
  margin-bottom: 8px;
}

.request-modal__location-address {
  margin: 0 auto 20px;
  max-width: 90%;
  font-size: 14px;
  color: #4a4a4a;
  text-align: center;
  line-height: 1.6;
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
  font-size: 18px;
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

  .orders-screen__list {
    grid-template-columns: 1fr;
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

  .orders-screen {
    margin: 18px;
    padding: 25px;
  }

  .orders-screen__grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .orders-screen__card {
    padding: 20px 24px;
    gap: 20px;
  }

  .orders-screen__avatar {
    width: 48px;
    height: 48px;
  }

  .orders-screen__provider-name {
    font-size: 14px;
  }

  .orders-screen__date {
    font-size: 14px;
  }

  .orders-screen__route-text {
    font-size: 14px;
  }

  .orders-screen__list {
    grid-template-columns: 1fr;
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

  .orders-screen {
    margin: 12px;
    padding: 18px;
  }

  .orders-screen__list {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .orders-screen__card {
    padding: 16px 18px;
    gap: 16px;
  }

  .orders-screen__avatar {
    width: 44px;
    height: 44px;
  }

  .orders-screen__provider-name {
    font-size: 13px;
  }

  .orders-screen__date {
    font-size: 12px;
  }

  .orders-screen__route-text {
    font-size: 13px;
  }
}

.locationIcon {
  width: 18px;
  height: 18px;
}

/* ─── Notificações de mensagem ─── */
.msg-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 140px;
  color: #ccc;
  font-size: 13px;
  text-align: center;
}

.msg-notif-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #fff;
  border: 1.5px solid #f0f0f0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.msg-notif-card:hover {
  border-color: #D62828;
  box-shadow: 0 4px 16px rgba(214, 40, 40, 0.12);
  transform: translateY(-1px);
}

.msg-notif-card__avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: #f0f0f0;
  border: 2px solid #f5e5e5;
}

.msg-notif-card__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.msg-notif-card__body {
  flex: 1;
  min-width: 0;
}

.msg-notif-card__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
}

.msg-notif-card__name {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.msg-notif-card__time {
  font-size: 11px;
  color: #bbb;
  flex-shrink: 0;
}

.msg-notif-card__preview {
  font-size: 13px;
  color: #888;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.msg-notif-card__badge {
  min-width: 22px;
  height: 22px;
  background: #D62828;
  color: white;
  font-size: 11px;
  font-weight: 700;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(214, 40, 40, 0.35);
}
</style>
