<template>
  <div class="order-tracking-container">
    <div id="map" class="map-background"></div>

    <div class="tracking-card" :class="{ 'expanded': currentStep === 2 }">
      <!-- <button class="test-button" @click="currentStep = currentStep === 1 ? 2 : 1">
        Teste: {{ currentStep === 1 ? 'Frente' : 'TrAz' }}
      </button> -->

      <template v-if="currentStep === 1">
      <div class="client-profile">
        <div class="client-photo">
          <img :src="client.photo || photoFallback" alt="Cliente" />
        </div>
        <div class="client-center-content">
          <h3 class="client-name">{{ client.name }}</h3>
          
        </div>

        <div class="client-rating-badge">
          <span class="rating-star">★</span>
          <span class="rating-value">{{ client.rating }}</span>
        </div>

        <button class="chat-button" @click="toggleChatModal" title="Enviar mensagem">
          <img src="../assets/icon.svg" alt="Chat" />
        </button>
      </div>

      <div class="metrics-section">
        <div class="metric-item">
          <span class="metric-label">DISTÂNCIA</span>
          <span class="metric-value">{{ client.distance }}</span>
        </div>
        <div class="metric-divider"></div>
        <div class="metric-item">
          <span class="metric-label">CHEGADA EM</span>
          <span class="metric-value">{{ client.eta }}</span>
        </div>
      </div>

      <div class="addresses-section">
        <div class="address-item">
          <div class="address-icon origin"></div>
          <div class="address-content">
            <span class="address-label">Origem</span>
            <span class="address-text">{{ endereçoOrigem }}</span>
          </div>
        </div>
        <div class="address-item">
          <div class="address-icon destination"></div>
          <div class="address-content">
            <span class="address-label">Destino</span>
            <span class="address-text">{{ endereçoDestino }}</span>
          </div>
        </div>
      </div>

      <button class="action-button cancel">Cancelar Solicitação</button>
      </template>

      <template v-if="currentStep === 2">
        <div class="evaluation-container">
          <div class="client-profile small">
            <div class="client-photo">
              <img :src="client.photo || photoFallback" alt="Cliente" />
            </div>
            <div class="client-center-content">
              <div class="client-top">
                <h3 class="client-name">{{ client.name }}</h3>
                <span class="rating-inline">★ {{ client.rating }}</span>
              </div>
              <div class="client-sub">{{ endereçoOrigem }} → {{ endereçoDestino }}</div>
              <div class="plate-badge small">{{ client.plate }}</div>
            </div>
            <button class="chat-button" @click="toggleChatModal" title="Enviar mensagem">
              <img src="../assets/icon.svg" alt="Chat" />
            </button>
          </div>
          <div class="metrics-section">
            <div class="metric-item">
              <span class="metric-label">DISTÂNCIA</span>
              <span class="metric-value">{{ client.distance || '-- km' }}</span>
            </div>
            <div class="metric-divider"></div>
            <div class="metric-item">
              <span class="metric-label">CHEGADA EM</span>
              <span class="metric-value">{{ client.eta || 'Calculando...' }}</span>
            </div>
          </div>

          <h2 class="evaluation-title">Avalie o serviço do cliente!</h2>

          <div class="rating-stars">
            <span 
              v-for="star in 5" 
              :key="star"
              class="star"
              :class="{ filled: star <= userRating }"
              @click="userRating = star"
            >
              ★
            </span>
          </div>

          <div class="comment-section">
            <label class="comment-label">Fazer comentário (Opcional)</label>
            <textarea 
              v-model="userComment" 
              class="comment-input" 
              placeholder="Cliente prestativo e educado!"
            ></textarea>
          </div>

          <button class="submit-button" @click="submitEvaluation">Enviar</button>
        </div>
      </template>
    </div>


    <div v-if="showChatModal" class="chat-modal-overlay" @click="toggleChatModal">
      <div class="chat-modal" @click.stop>
        <div class="chat-header">
          <div class="chat-client-info">
            <img src="/driver-default.svg" alt="Cliente" class="chat-client-photo" />
            <div class="chat-client-details">
              <h3 class="chat-client-name">{{ client.name }}</h3>
              <span class="chat-client-role">★ {{ client.rating }} • Cliente</span>
            </div>
          </div>
          <button class="back-button" @click="toggleChatModal">
            <img src="../assets/close.svg" class="back-arrow" alt="" />
          </button>
        </div>

        <div class="chat-messages">
          <div class="message-group client-message">
            <div class="message-bubble">Oi! Já estou no local aguardando!</div>
            <span class="message-time">14:30</span>
          </div>

          <div class="message-group provider-message">
            <div class="message-bubble">Perfeito! Estou chegando em aproximadamente 5 minutos.</div>
            <span class="message-time">14:31</span>
          </div>

          <div class="message-group client-message">
            <div class="message-bubble">Ótimo! Fico na porta de entrada.</div>
            <span class="message-time">14:31</span>
          </div>
        </div>

        <div class="chat-input-area">
          <button class="chat-icon-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </button>
          <input type="text" class="chat-input" placeholder="Mensagem" />
          <button class="chat-send-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,0.9 1.77946707,1.4325843 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.99621575 L3.03521743,10.4371816 C3.03521743,10.5942791 3.19218622,10.7513764 3.50612381,10.7513764 L16.6915026,11.5368634 C16.6915026,11.5368634 17.1624089,11.5368634 17.1624089,12.0081556 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MapboxService } from '@/requests/mapboxService';
import { userStorage } from '@/utils/userStorage';
import { buscarPrestadorPorId } from '@/requests/prestador';
export default {
  name: 'PedidoPrestador',
  data() {
    return {
      mapboxService: null,
      endereçoOrigem: 'Buscando endereço...',
      endereçoDestino: 'Buscando endereço...',
      photoFallback: null,
      client: {
        name: 'Cliente',
        rating: '4.5',
        distance: '-- km',
        eta: 'A caminho...',
        photo: null,
        plate: null
      },
      showChatModal: false,
      currentStep: 1,
      userRating: 0,
      userComment: '',

    }
  },
  async mounted() {
    const { origemLng, origemLat, destinoLng, destinoLat, txtOrigem, txtDestino } = this.$route.query || {};

    this.endereçoOrigem = txtOrigem || 'Endereço de Origem';
    this.endereçoDestino = txtDestino || 'Não informado';

    const origin = origemLng && origemLat ? [parseFloat(origemLng), parseFloat(origemLat)] : null;
    const destination = destinoLng && destinoLat ? [parseFloat(destinoLng), parseFloat(destinoLat)] : null;

    this.mapboxService = new MapboxService();

    // Inicializa o mapa igual ao do cliente, mas invertendo origem e destino
    if (origin && destination) {
      // passamos destination como origem e origin como destino (inversão)
      this.mapboxService.initMap('map', destination, origin, (dadosCalculados) => {
        try {
          if (dadosCalculados && dadosCalculados.distancia) this.client.distance = dadosCalculados.distancia;
          if (dadosCalculados && dadosCalculados.tempo) this.client.eta = dadosCalculados.tempo;
        } catch (e) { console.warn('Erro ao aplicar dados calculados do mapa:', e); }
      });
    } else if (origin) {
      // Sem destino informado — mostra apenas o ponto de origem do cliente
      this.mapboxService.initMapApenasOrigem('map', origin, () => {
        this.client.distance = this.client.distance || '-- km';
        this.client.eta = this.client.eta || 'Calculando...';
      });
    }

    // Preencher dados do cliente a partir da query (enviados pelo prestador ao aceitar)
    const { clientName, clientRating, clientPhoto, clientPlate } = this.$route.query || {};
    if (clientName) this.client.name = clientName;
    if (clientRating) this.client.rating = clientRating;
    // ensure rating format
    if (!this.client.rating) this.client.rating = '4.5';
    if (clientPhoto) {
      // aceita URLs relativas e absolutas
      if (String(clientPhoto).startsWith('http') || String(clientPhoto).startsWith('data:')) {
        this.client.photo = clientPhoto;
      } else {
        this.client.photo = clientPhoto ? `http://localhost:8080/${String(clientPhoto).replace(/^\//, '')}` : null;
      }
    }
    // fallback avatar
    if (!this.client.photo) this.photoFallback = this.photoFallback || `https://i.pravatar.cc/150?u=${encodeURIComponent(this.client.name)}`;
    // plate: usar plate enviado ou gerar aleatória
    if (clientPlate) {
      this.client.plate = clientPlate;
    } else if (!this.client.plate) {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const randLetters = Array.from({ length: 3 }).map(() => letters.charAt(Math.floor(Math.random() * letters.length))).join('');
      const randNumbers = String(Math.floor(1000 + Math.random() * 9000));
      this.client.plate = `${randLetters}-${randNumbers}`;
    }

    // Tentar preencher com os dados do prestador logado (userStorage) ou buscar pela API
    try {
      const stored = userStorage.getUserData();
      const prestadorId = userStorage.getUserId();
      if (stored && (stored.nome || stored.name || stored.foto || stored.placa)) {
        this.client.name = stored.nome || stored.name || this.client.name;
        this.client.rating = stored.media_avaliacoes || stored.rating || this.client.rating;
        this.client.photo = this.client.photo || stored.foto || stored.img_perfil || stored.profileImage || this.client.photo;
        this.client.plate = this.client.plate || stored.placa || stored.plate || this.client.plate;
      } else if (prestadorId) {
        try {
          const resp = await buscarPrestadorPorId(prestadorId);
          if (resp) {
            this.client.name = resp.nome || resp.name || this.client.name;
            this.client.rating = resp.media_avaliacoes || resp.rating || this.client.rating;
            this.client.photo = this.client.photo || resp.foto || resp.img_perfil || this.client.photo;
            this.client.plate = this.client.plate || resp.placa || resp.plate || this.client.plate;
          }
        } catch (e) { console.warn('Erro ao buscar prestador por id:', e); }
      }
    } catch (e) {
      console.warn('Erro ao obter dados do prestador:', e);
    }
  },
  beforeDestroy() {
    if (this.mapboxService) this.mapboxService.destroyMap();
  },
  methods: {
    toggleChatModal() {
      this.showChatModal = !this.showChatModal;
    },
    submitEvaluation() {
      console.log('Avaliação enviada:', {
        rating: this.userRating,
        comment: this.userComment
      });
      alert(`Avaliação enviada! Rating: ${this.userRating} estrelas`);
      this.userRating = 0;
      this.userComment = '';
      this.currentStep = 1;
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.order-tracking-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.map-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e8e8e8 0%, #d5d5d5 100%);
  z-index: 0;
}

.tracking-card {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  width: 460px;
  background: #ffffff;
  border-radius: 32px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15),
              0 4px 12px rgba(0, 0, 0, 0.08);
  z-index: 10;
  padding: 32px 26px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  animation: cardSlideIn 0.4s cubic-bezier(0.23, 1, 0.320, 1);
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.tracking-card.expanded {
  width: 90vw;
  max-width: 480px;
  height: auto;
  bottom: 50%;
  transform: translateX(-50%) translateY(50%);
  max-height: 90vh;
  animation: cardExpand 0.5s cubic-bezier(0.23, 1, 0.320, 1) forwards;
  padding: 30px 30px;
  gap: 24px;
}

@keyframes cardExpand {
  from {
    width: 460px;
    height: auto;
    bottom: 32px;
  }
  to {
    width: 90vw;
    height: auto;
    max-height: 90vh;
    bottom: 50%;
    transform: translateX(-50%) translateY(50%);
  }
}

.client-profile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: #ffffff;
  padding: 20px 16px;
  border-radius: 14px;
  position: relative;
}

.client-photo {
  width: 90px;
  height: 90px;
  border-radius: 14px;
  background: #e8e8e8;
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.client-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.client-center-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.client-name {
  font-size: 20px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
  text-align: center;
  line-height: 1.2;
}

.client-profile.small {
  align-items: center;
  gap: 14px;
}
.plate-badge.small {
  display: inline-block;
  margin-top: 8px;
  background: #ffd54a;
  color: #111;
  padding: 6px 12px;
  border-radius: 12px;
  font-weight: 800;
  letter-spacing: 1px;
}
.client-type {
  font-size: 12px;
  color: #888;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.client-rating-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1px;
  background: #f0f0f0;
  padding: 5px 8px;
  border-radius: 24px;
  flex-shrink: 0;
}

.rating-star {
  color: #d4a844;
  font-size: 18px;
}

.rating-value {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
}

.chat-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #c5e5ff;
  border: none;
  color: #0066cc;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.chat-button:hover {
  background: #aad4f5;
  transform: scale(1.05);
}

.chat-button:active {
  transform: scale(0.95);
}

.chat-button img {
  width: 20px;
  height: 20px;
}

.metrics-section {
  display: flex;
  align-items: center;
  background: #f3f4f5;
  border-radius: 14px;
  overflow: hidden;
  height: 70px;
}

.metric-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 16px;
}

.metric-label {
  font-size: 9px;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 18px;
  font-weight: 800;
  color: #1a1a1a;
}

.metric-divider {
  width: 1px;
  height: 40px;
  background: #e0e0e0;
}

.addresses-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f9f9f9;
  padding: 18px;
  border-radius: 14px;
}

.address-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.address-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.address-icon.origin {
  background: #000;
  border-radius: 3px;
}

.address-icon.destination {
  border: 2px solid #999;
  border-radius: 50%;
}

.address-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.address-label {
  font-size: 10px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.address-text {
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 1.4;
}

.action-button {
  width: 100%;
  padding: 16px 20px;
  border: none;
  border-radius: 28px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: none;
  letter-spacing: 0;
}

.action-button.cancel {
  background: #c41e1e;
  color: #ffffff;
}

.action-button.cancel:hover {
  background: #a01818;
  box-shadow: 0 6px 16px rgba(196, 30, 30, 0.3);
}

.action-button.cancel:active {
  background: #8b1414;
  transform: scale(0.98);
}

/* Chat Modal Styles */
.chat-modal-overlay {
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

.chat-modal {
  width: 90%;
  max-width: 1000px;
  height: 70vh;
  background: #ffffff;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
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

.chat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 25px;
  border-bottom: 1px solid #f0f0f0;
}

.back-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #1a1a1a;
  padding: 0;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button:hover {
  background: #f5f5f5;
  border-radius: 50%;
}

.chat-client-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.chat-client-photo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  background: #e8e8e8;
}

.chat-client-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.chat-client-name {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.chat-client-role {
  font-size: 12px;
  color: #888;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.provider-message {
  align-items: flex-start;
}

.client-message {
  align-items: flex-end;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

.provider-message .message-bubble {
  background: #e8e8e8;
  color: #1a1a1a;
}

.client-message .message-bubble {
  background: #c41e1e;
  color: #ffffff;
}

.message-time {
  font-size: 11px;
  color: #999;
  padding: 0 8px;
}

.chat-input-area {
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  gap: 12px;
  padding: 10px 10px;
  border-radius: 50px;
  border: 1px solid #dba59e6e;
  height: 70px;
  width: 90%;
  margin-bottom: 20px;
}

.chat-icon-button {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-icon-button:hover {
  color: #1a1a1a;
}

.chat-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  border-radius: 20px;
  padding: 0;
  background: transparent;
}

.chat-input::placeholder {
  color: #bbb;
}

.chat-send-button {
  background: #c41e1e;
  border: none;
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.chat-send-button:hover {
  background: #a01818;
  transform: scale(1.05);
}

.chat-send-button:active {
  transform: scale(0.95);
}

.back-arrow {
  width: 52px;
  height: 52px;
}

.comment-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

.comment-label {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  text-transform: capitalize;
}

.comment-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 13px;
  font-family: inherit;
  resize: none;
  height: 100px;
  background: #f9f9f9;
  color: #1a1a1a;
  transition: all 0.3s ease;
}

.comment-input::placeholder {
  color: #bbb;
  font-size: 12px;
}

.comment-input:focus {
  outline: none;
  border-color: #c41e1e;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(196, 30, 30, 0.1);
}

.evaluation-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-align: center;
  width: 100%;
}

.evaluation-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.4;
  padding: 0 12px;
}

.evaluation-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.eval-client-photo {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.eval-client-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.eval-client-name {
  font-size: 20px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
}

.eval-client-role {
  font-size: 12px;
  color: #888;
  font-weight: 500;
}

.rating-stars {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.star {
  font-size: 36px;
  color: #ddd;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.star:hover {
  transform: scale(1.1);
  color: #ffc107;
}

.star.filled {
  color: #ffc107;
  text-shadow: 0 2px 8px rgba(255, 193, 7, 0.4);
}

.submit-button {
  width: 100%;
  padding: 16px 24px;
  background: #c41e1e;
  color: #ffffff;
  border: none;
  border-radius: 28px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.submit-button:hover {
  background: #a01818;
  box-shadow: 0 6px 16px rgba(196, 30, 30, 0.3);
  transform: translateY(-2px);
}

.submit-button:active {
  background: #8b1414;
  transform: translateY(0);
}

.submit-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .tracking-card {
    width: calc(100% - 32px);
    bottom: 24px;
    padding: 24px 20px;
    border-radius: 28px;
    gap: 16px;
  }

  .client-profile {
    padding: 16px 12px;
    gap: 12px;
  }

  .client-photo {
    width: 70px;
    height: 70px;
    border-radius: 12px;
  }

  .client-name {
    font-size: 16px;
  }

  .client-type {
    font-size: 10px;
  }

  .client-rating-badge {
    padding: 8px 10px;
    font-size: 12px;
  }

  .rating-star {
    font-size: 16px;
  }

  .rating-value {
    font-size: 12px;
  }

  .chat-button {
    width: 44px;
    height: 44px;
  }

  .metrics-section {
    height: 60px;
  }

  .metric-label {
    font-size: 8px;
  }

  .metric-value {
    font-size: 16px;
  }

  .address-text {
    font-size: 12px;
  }

  .action-button {
    padding: 14px 16px;
    font-size: 14px;
  }

  .chat-modal {
    width: 95%;
    height: 85vh;
  }

  .message-bubble {
    max-width: 85%;
  }

  .evaluation-title {
    font-size: 16px;
  }

  .eval-client-photo {
    width: 80px;
    height: 80px;
  }

  .eval-client-name {
    font-size: 18px;
  }

  .star {
    font-size: 32px;
    gap: 8px;
  }

  .comment-input {
    min-height: 90px;
    font-size: 12px;
  }

  .submit-button {
    padding: 14px 20px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .order-tracking-container {
    height: 100vh;
  }

  .tracking-card {
    position: fixed;
    bottom: 16px;
    left: 16px;
    right: 16px;
    width: calc(100% - 32px);
    transform: none;
    border-radius: 24px;
    padding: 20px 16px;
    gap: 14px;
  }

  .client-profile {
    padding: 14px 10px;
    gap: 10px;
  }

  .client-photo {
    width: 64px;
    height: 64px;
    border-radius: 10px;
  }

  .client-name {
    font-size: 14px;
  }

  .client-rating-badge {
    padding: 7px 10px;
    font-size: 11px;
  }

  .rating-star {
    font-size: 14px;
  }

  .rating-value {
    font-size: 11px;
  }

  .chat-button {
    width: 42px;
    height: 42px;
  }

  .metric-value {
    font-size: 15px;
  }

  .address-text {
    font-size: 11px;
  }

  .action-button {
    padding: 12px 14px;
    font-size: 13px;
  }

  .chat-modal {
    width: 100%;
    height: 100vh;
    border-radius: 0;
  }

  .message-bubble {
    max-width: 80%;
  }

  .chat-input-area {
    width: 95%;
  }

  .evaluation-title {
    font-size: 14px;
  }

  .eval-client-photo {
    width: 70px;
    height: 70px;
  }

  .eval-client-name {
    font-size: 16px;
  }

  .star {
    font-size: 28px;
    gap: 6px;
  }

  .comment-input {
    min-height: 80px;
    font-size: 11px;
    padding: 10px 12px;
  }

  .comment-label {
    font-size: 12px;
  }

  .submit-button {
    padding: 12px 16px;
    font-size: 13px;
  }
}
</style>

