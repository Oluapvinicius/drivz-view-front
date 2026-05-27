<template>
  <div class="order-tracking-container">
    <div class="map-background">      <button class="test-button" @click="prevStep">← Voltar (Teste)</button>
          <button class="test-button" @click="nextStep">➜ Próximo Step (Teste)</button></div>
    <div class="tracking-card">
      <div class="timeline-section">
        <div class="step-container">
          <div class="step-point" :class="{ active: currentStep >= 1 }">
            <img src="../assets/lupaIcon.svg" alt="Buscando" class="step-icon" />
          </div>
          <span class="step-label" :class="{ active: currentStep >= 1 }">Buscando</span>
        </div>
        <div class="line-wrapper">
          <div class="step-line" :class="{ active: currentStep >= 2 }"></div>
        </div>
        <div class="step-container">
          <div class="step-point" :class="{ active: currentStep >= 2 }">
            <img src="../assets/carroicon.svg" alt="A caminho" class="step-icon" />
          </div>
          <span class="step-label" :class="{ active: currentStep >= 2 }">A caminho</span>
        </div>
        <div class="line-wrapper">
          <div class="step-line" :class="{ active: currentStep >= 3 }"></div>
        </div>
        <div class="step-container">
          <div class="step-point" :class="{ active: currentStep >= 3 }">
            <img src="../assets/bandeira.svg" alt="Viagem" class="step-icon" />
          </div>
          <span class="step-label" :class="{ active: currentStep >= 3 }">Avaliação</span>
        </div>
      </div>

      <template v-if="currentStep === 1">
        <div class="container-down">
        <div class="addresses-section">
          <div class="address-item">
            <div class="address-icon origin"></div>
            <div class="address-content">
              <span class="address-label">Origem</span>
              <span class="address-text">Av. Paulista, 1578 - Bela Vista</span>
            </div>
          </div>
          <div class="address-item">
            <div class="address-icon destination"></div>
            <div class="address-content">
              <span class="address-label">Destino</span>
              <span class="address-text">Rua Augusta, 2200 - Jardins</span>
            </div>
          </div>
        </div>
        <div class="search-status">
          <span class="status-text">Procurando motorista...</span>
          <span class="demand-badge">Alta demanda</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 70%;"></div>
        </div>
        <button class="action-button cancel">Cancelar Solicitação</button>
        <div class="tip-box">
          <img src="../assets/lampada.svg" alt="Dica" class="tip-icon" />
          <span class="tip-text">Dica: Mantenha o app aberto para agilizar a conexão</span>
        </div>
        </div>
  
      </template>
      <template v-if="currentStep === 2">
        <div class="step2-Container">
        <div class="driver-profile">
          <div class="driver-photo">
            <img src="/driver-default.svg" alt="Motorista" />
          </div>
          <div class="driver-center-content">
            <h3 class="driver-name">{{ driver.name }}</h3>
            <div class="plate-badge">{{ driver.plate }}</div>
          </div>

          <div class="driver-rating-badge">
            <span class="rating-star">★</span>
            <span class="rating-value">{{ driver.rating }}</span>
          </div>

          <button class="chat-button" @click="toggleChatModal" title="Enviar mensagem">
            <img src="../assets/icon.svg" alt="Chat" />
          </button>
        </div>
        <div class="metrics-section">
          <div class="metric-item">
            <span class="metric-label">DISTÂNCIA</span>
            <span class="metric-value">{{ driver.distance }}</span>
          </div>
          <div class="metric-divider"></div>
          <div class="metric-item">
            <span class="metric-label">CHEGADA EM</span>
            <span class="metric-value">{{ driver.eta }}</span>
          </div>
        </div>
        <div class="addresses-section">
          <div class="address-item">
            <div class="address-icon origin"></div>
            <div class="address-content">
              <span class="address-label">Origem</span>
              <span class="address-text">Av. Paulista, 1578 - Bela Vista</span>
            </div>
          </div>
          <div class="address-item">
            <div class="address-icon destination"></div>
            <div class="address-content">
              <span class="address-label">Destino</span>
              <span class="address-text">Rua Augusta, 2200 - Jardins</span>
            </div>
          </div>
        </div>
        <button class="action-button cancel">Cancelar Solicitação</button>
        </div>
      </template>
    </div>

   
    <div v-if="showChatModal" class="chat-modal-overlay" @click="toggleChatModal">
      <div class="chat-modal" @click.stop>

        <div class="chat-header">
          <button class="back-button" @click="toggleChatModal"><img src="../assets/arrow.png" class="back-arrow" alt=""></button>
          <div class="chat-driver-info">
            <img src="/driver-default.svg" alt="Motorista" class="chat-driver-photo" />
            <div class="chat-driver-details">
              <h3 class="chat-driver-name">Rimberio Guincho</h3>
              <span class="chat-driver-role">★ 4.0 • Prestador</span>
            </div>
          </div>
        </div>

   
        <div class="chat-messages">
        
          <div class="message-group driver-message">
            <div class="message-bubble">Olá! Sou o Rimberio. Já recebi seu pedido de guincho.</div>
            <span class="message-time">14:31</span>
          </div>


          <div class="message-group client-message">
            <div class="message-bubble">Estou a aproximadamente 15 minutos do seu local. Pode confirmar se está na Avenida Paulista?</div>
            <span class="message-time">14:31</span>
          </div>

         
          <div class="message-group driver-message">
            <div class="message-bubble">Olá. Rimberio! Sim, estou exatamente em frente ao MASP.</div>
            <span class="message-time">14:33</span>
          </div>

          <div class="message-group driver-message">
            <div class="message-bubble">O carro está com o pneu furado e não tenho estepe.</div>
            <span class="message-time">14:33</span>
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
export default {
  name: 'PedidoCliente',
  data() {
    return {
      currentStep: 1,
      showChatModal: false,
      driver: {
        name: 'Rimberio Guincho',
        rating: '4.0',
        plate: 'ABC-1234',
        distance: '423 m',
        eta: '5 min'
      }
    }
  },
  methods: {
    nextStep() {
      if (this.currentStep < 3) {
        this.currentStep++;
      }
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    toggleChatModal() {
      this.showChatModal = !this.showChatModal;
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
  height: 580px;
  background: #ffffff;
  border-radius: 32px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15),
              0 4px 12px rgba(0, 0, 0, 0.08);
  z-index: 10;
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  gap: 17px;
  overflow-y: auto;
  animation: cardSlideIn 0.4s cubic-bezier(0.23, 1, 0.320, 1);
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateX(-50%);
  }
  to {
    opacity: 1;
    transform: translateX(-50%);
  }
}

.timeline-section {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 8px;
}

.step-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.line-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  height: 52px;
}

.step-point {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
  border: 3px solid transparent;
}

.step-point.active {
  background: #c41e1e;
  box-shadow: 0 4px 12px rgba(196, 30, 30, 0.25);
}

.step-icon {
  width: 19 px;
  height: 19px;
  object-fit: contain;
  filter: brightness(0) saturate(100%) invert(87%) sepia(0%) saturate(0%);
}

.step-point.active .step-icon {
  filter: brightness(0) saturate(100%) invert(100%);
}

.step-line {
  flex: 1;
  height: 3px;
  background: #e0e0e0;
  transition: background 0.3s ease;
}

.step-line.active {
  background: #c41e1e;
}

.step-label {
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #888;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.step-label.active {
  color: #c41e1e;
  font-weight: 700;
}

.driver-profile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: #ffffff;
  padding: 20px 16px;
  border-radius: 14px;
  position: relative;
}

.driver-photo {
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

.driver-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.driver-center-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.driver-name {
  font-size: 20px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
  text-align: center;
  line-height: 1.2;
}

.plate-badge {
  background: #fff34d;
  color: #1a1a1a;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 900;
  text-align: center;
  white-space: nowrap;
  letter-spacing: 1px;
}

.driver-rating-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  background: #f0f0f0;
  padding: 10px 14px;
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

.chat-button svg {
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

.search-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.status-text {
  font-size: 13px;
  font-weight: 500;
  color: #555;
}

.demand-badge {
  background: #ffebee;
  color: #930009;
  font-size: 11px;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 20px;
  white-space: nowrap;
}

.progress-bar {
  width: 100%;
  height: 5px;
  background: #ffdad5;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #c41e1e;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.tip-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #eef3fc;
  padding: 12px 14px;
  border-radius: 20px;
}

.tip-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  opacity: 0.8;
}

.tip-text {
  font-size: 12px;
  color: #555;
  font-weight: 500;
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

.test-button {
  width: 100%;
  padding: 12px 16px;
  background: #fff;
  color: #c41e1e;
  border: 2px solid #c41e1e;
  border-radius: 24px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.test-button:hover {
  background: #c41e1e;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(196, 30, 30, 0.2);
}

.test-button:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .tracking-card {
    width: calc(100% - 32px);
    bottom: 24px;
    height: 520px;
    padding: 24px 20px;
    border-radius: 28px;
    gap: 20px;
  }

  .step-container {
    gap: 8px;
  }

  .step-point {
    width: 44px;
    height: 44px;
  }

  .step-icon {
    width: 24px;
    height: 24px;
  }

  .step-label {
    font-size: 10px;
  }

  .driver-profile {
    padding: 16px 12px;
    gap: 12px;
  }

  .driver-photo {
    width: 70px;
    height: 70px;
    border-radius: 12px;
  }

  .driver-name {
    font-size: 16px;
  }

  .driver-rating-badge {
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

  .plate-badge {
    font-size: 10px;
    padding: 6px 10px;
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
    height: 480px;
    transform: none;
    border-radius: 24px;
    padding: 20px 16px;
    gap: 16px;
  }

  .step-container {
    gap: 6px;
  }

  .step-point {
    width: 40px;
    height: 40px;
  }

  .step-icon {
    width: 22px;
    height: 22px;
  }

  .step-label {
    font-size: 9px;
  }

  .driver-profile {
    padding: 14px 10px;
    gap: 10px;
  }

  .driver-photo {
    width: 64px;
    height: 64px;
    border-radius: 10px;
  }

  .driver-name {
    font-size: 14px;
  }

  .driver-rating-badge {
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

  .plate-badge {
    font-size: 9px;
    padding: 5px 8px;
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
}
.container-down {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.step2-Container {
  background: #ffffff;

  display: flex;
  flex-direction: column;
  gap: 12px;

}


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
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.back-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #1a1a1a;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button:hover {
  background: #f5f5f5;
  border-radius: 50%;
}

.chat-driver-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.chat-driver-photo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  background: #e8e8e8;
}

.chat-driver-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.chat-driver-name {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.chat-driver-role {
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

.driver-message {
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

.driver-message .message-bubble {
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
  border: 1px  solid #dba59e6e;

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

@media (max-width: 768px) {
  .chat-modal {
    width: 95%;
    height: 85vh;
  }

  .message-bubble {
    max-width: 85%;
  }

  .chat-modal-overlay {
    padding: 20px;
  }
}

.back-arrow {
  width: 20px;
  height: 20px;
}
</style>
