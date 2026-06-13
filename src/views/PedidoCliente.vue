<!-- <template>
  <div class="order-tracking-container">
    <div id="map" class="map-background"></div>

    <div class="tracking-card" :class="{ 'expanded': currentStep === 3 }">
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
          <div class="search-status">
            <span class="status-text">Procurando motorista...</span>
            <span class="demand-badge">Alta demanda</span>
          </div>

          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: searchProgress + '%' }"></div>
          </div>

          <button class="action-button cancel" @click="showCancelModal = true">Cancelar Solicitação</button>
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
        </div>
      </template>

      <template v-if="currentStep === 3">
        <div class="evaluation-container">
          <h2 class="evaluation-title">A solicitação foi finalizada, avalie o seu serviço!</h2>
          <div class="evaluation-profile">
            <div class="eval-driver-photo">
              <img src="/driver-default.svg" alt="Prestador" />
            </div>
            <h3 class="eval-driver-name">{{ driver.name }}</h3>
            <span class="eval-driver-role">Prestador</span>
          </div>
          <div class="rating-stars">
            <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= userRating }"
              @click="userRating = star">
              ★
            </span>
          </div>
          <div class="comment-section">
            <label class="comment-label">Fazer comentário (Opcional)</label>
            <textarea v-model="userComment" class="comment-input"
              placeholder="Serviço de altissima qualidade!"></textarea>
          </div>
          <button class="submit-button" @click="submitEvaluation">Enviar ➤</button>
        </div>
      </template>
    </div>

    <div v-if="showChatModal" class="chat-modal-overlay" @click="toggleChatModal">
      <div class="chat-modal" @click.stop>
        <div class="chat-header">
          <button class="back-button" @click="toggleChatModal">
            <img src="../assets/arrow.png" class="back-arrow" alt="">
          </button>
          <div class="chat-driver-info">
            <img src="/driver-default.svg" alt="Motorista" class="chat-driver-photo" />
            <div class="chat-driver-details">
              <h3 class="chat-driver-name">{{ driver.name }}</h3>
              <span class="chat-driver-role">★ {{ driver.rating }} • Prestador</span>
            </div>
          </div>
        </div>

        <div class="chat-messages">
          <div class="message-group driver-message">
            <div class="message-bubble">Olá! Sou o Rimberio. Já recebi seu pedido de guincho.</div>
            <span class="message-time">14:31</span>
          </div>
          <div class="message-group client-message">
            <div class="message-bubble">Estou a aproximadamente 15 minutos do seu local. Pode confirmar se está na
              Avenida
              Paulista?</div>
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
              <path
                d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,0.9 1.77946707,1.4325843 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.99621575 L3.03521743,10.4371816 C3.03521743,10.5942791 3.19218622,10.7513764 3.50612381,10.7513764 L16.6915026,11.5368634 C16.6915026,11.5368634 17.1624089,11.5368634 17.1624089,12.0081556 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z">
              </path>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div v-if="showCancelModal" class="custom-modal-overlay" @click="showCancelModal = false">
      <div class="custom-modal-box" @click.stop>
        <h3 class="modal-title">Deseja mesmo cancelar?</h3>
        <p class="modal-text">Esta ação não poderá ser desfeita e sua busca por um prestador será encerrada.</p>

        <div class="modal-actions">
          <button class="btn-keep" @click="showCancelModal = false">Continuar com o pedido</button>
          <button class="btn-confirm-cancel" @click="confirmarCancelamento">Sim, cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template> -->

<!-- <template>
  <div class="order-tracking-container">
    <div id="map" class="map-background"></div>

    <div class="tracking-card" :class="{ 'expanded': currentStep === 3 }">

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
          <div class="search-status">
            <span class="status-text">Procurando motorista...</span>
            <span class="demand-badge">Alta demanda</span>
          </div>

          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: searchProgress + '%' }"></div>
          </div>

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
        </div>
      </template>

      <template v-if="currentStep === 3">
        <div class="evaluation-container">
          <h2 class="evaluation-title">A solicitação foi finalizada, avalie o seu serviço!</h2>
          <div class="evaluation-profile">
            <div class="eval-driver-photo">
              <img src="/driver-default.svg" alt="Prestador" />
            </div>
            <h3 class="eval-driver-name">{{ driver.name }}</h3>
            <span class="eval-driver-role">Prestador</span>
          </div>
          <div class="rating-stars">
            <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= userRating }"
              @click="userRating = star">
              ★
            </span>
          </div>

          <div v-if="erroAvaliacao" class="error-message-box">
            {{ erroAvaliacao }}
          </div>

          <div class="comment-section">
            <label class="comment-label">Fazer comentário (Opcional)</label>
            <textarea v-model="userComment" class="comment-input"
              placeholder="Serviço de altissima qualidade!"></textarea>
          </div>
          <button class="submit-button" @click="submitEvaluation">Enviar ➤</button>
        </div>
      </template>
      <div v-if="currentStep !== 3" class="cancel-button-wrapper">
        <button class="action-button cancel btn-global-cancel" @click="showCancelModal = true">
          Cancelar Solicitação
        </button>
      </div>
    </div>

    <div v-if="showCancelModal" class="custom-modal-overlay" @click="showCancelModal = false">
      <div class="custom-modal-box" @click.stop>
        <h3 class="modal-title">Deseja mesmo cancelar?</h3>
        <p class="modal-text">Esta ação não poderá ser desfeita e sua busca por um prestador será encerrada.</p>
        <div class="modal-actions">
          <button class="btn-keep" @click="showCancelModal = false">Continuar com o pedido</button>
          <button class="btn-confirm-cancel" @click="confirmarCancelamento">Sim, cancelar</button>
        </div>
      </div>
    </div>

    <div v-if="showChatModal" class="chat-modal-overlay" @click="toggleChatModal">
      <div class="chat-modal" @click.stop>
        <div class="chat-header">
          <button class="back-button" @click="toggleChatModal">
            <img src="../assets/arrow.png" class="back-arrow" alt="">
          </button>
          <div class="chat-driver-info">
            <img src="/driver-default.svg" alt="Motorista" class="chat-driver-photo" />
            <div class="chat-driver-details">
              <h3 class="chat-driver-name">{{ driver.name }}</h3>
              <span class="chat-driver-role">★ {{ driver.rating }} • Prestador</span>
            </div>
          </div>
        </div>

        <div class="chat-messages">
          <div v-for="msg in mensagensChat" :key="msg.id"
            :class="['message-group', msg.tipo === 'driver' ? 'driver-message' : 'client-message']">
            <div class="message-bubble">{{ msg.texto }}</div>
            <span class="message-time">{{ msg.hora }}</span>
          </div>
        </div>

        <div class="chat-input-area">
          <input type="text" class="chat-input" placeholder="Mensagem" v-model="novaMensagem"
            @keyup.enter="enviarMensagem" />
          <button class="chat-send-button" @click="enviarMensagem">
            ➤
          </button>
        </div>
      </div>
    </div>

  </div>
</template> -->

<template>
  <div class="order-tracking-container">
    <div id="map" class="map-background"></div>

    <div class="tracking-card" :class="{ 'expanded': currentStep === 3 }">

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
          <div class="search-status">
            <span class="status-text">Procurando motorista...</span>
            <span class="demand-badge">Alta demanda</span>
          </div>

          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: searchProgress + '%' }"></div>
          </div>

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
              <img :src="driver.avatar" :alt="driver.name" />
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
        </div>
      </template>

      <template v-if="currentStep === 3">
        <div class="evaluation-container">
          <h2 class="evaluation-title">A solicitação foi finalizada, avalie o seu serviço!</h2>
          <div class="evaluation-profile">
            <div class="eval-driver-photo">
              <img :src="driver.avatar" :alt="driver.name" />
            </div>
            <h3 class="eval-driver-name">{{ driver.name }}</h3>
            <span class="eval-driver-role">Prestador</span>
          </div>
          <div class="rating-stars">
            <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= userRating }"
              @click="userRating = star">
              ★
            </span>
          </div>

          <div v-if="erroAvaliacao" class="error-message-box">
            {{ erroAvaliacao }}
          </div>

          <div class="comment-section">
            <label class="comment-label">Fazer comentário (Opcional)</label>
            <textarea v-model="userComment" class="comment-input"
              placeholder="Serviço de altissima qualidade!"></textarea>
          </div>
          <button class="submit-button" @click="submitEvaluation">Enviar ➤</button>
        </div>
      </template>
      <div v-if="currentStep !== 3" class="cancel-button-wrapper">
        <button class="action-button cancel btn-global-cancel" @click="showCancelModal = true">
          Cancelar Solicitação
        </button>
      </div>
    </div>

    <div v-if="showCancelModal" class="custom-modal-overlay" @click="showCancelModal = false">
      <div class="custom-modal-box" @click.stop>
        <h3 class="modal-title">Deseja mesmo cancelar?</h3>
        <p class="modal-text">Esta ação não poderá ser desfeita e sua busca por um prestador será encerrada.</p>
        <div class="modal-actions">
          <button class="btn-keep" @click="showCancelModal = false">Continuar com o pedido</button>
          <button class="btn-confirm-cancel" @click="confirmarCancelamento">Sim, cancelar</button>
        </div>
      </div>
    </div>

    <div v-if="showChatModal" class="chat-modal-overlay" @click="toggleChatModal">
      <div class="chat-modal" @click.stop>
        <div class="chat-header">
          <button class="back-button" @click="toggleChatModal">
            <img src="../assets/arrow.png" class="back-arrow" alt="">
          </button>
          <div class="chat-driver-info">
            <img :src="driver.avatar" :alt="driver.name" class="chat-driver-photo" />
            <div class="chat-driver-details">
              <h3 class="chat-driver-name">{{ driver.name }}</h3>
              <span class="chat-driver-role">★ {{ driver.rating }} • Prestador</span>
            </div>
          </div>
        </div>

        <div class="chat-messages">
          <div v-for="msg in mensagensChat" :key="msg.id"
            :class="['message-group', msg.tipo === 'driver' ? 'driver-message' : 'client-message']">
            <div class="message-bubble">{{ msg.texto }}</div>
            <span class="message-time">{{ msg.hora }}</span>
          </div>
        </div>

        <div class="chat-input-area">
          <input type="text" class="chat-input" placeholder="Mensagem" v-model="novaMensagem"
            @keyup.enter="enviarMensagem" />
          <button class="chat-send-button" @click="enviarMensagem">
            ➤
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

// export default {
//   name: 'PedidoCliente',
//   data() {
//     return {
//       currentStep: 1,
//       endereçoOrigem: 'Buscando endereço...',
//       endereçoDestino: 'Buscando endereço...',
//       mapboxService: null,
//       showChatModal: false,
//       userRating: 0,
//       userComment: '',
//       driver: {
//         name: 'Rimberio Guincho',
//         rating: '4.9',
//         plate: 'ABC-1234',
//         distance: '-- km',
//         eta: '-- min'
//       }
//     };
//   },
//   mounted() {
//     const { origemLng, origemLat, destinoLng, destinoLat, txtOrigem, txtDestino } = this.$route.query;

//     this.endereçoOrigem = txtOrigem || 'Av. Paulista, 1578 - Bela Vista';
//     this.endereçoDestino = txtDestino || 'Rua Augusta, 2200 - Jardins';

//     const origin = [parseFloat(origemLng) || -46.6558, parseFloat(origemLat) || -23.5615];
//     const destination = [parseFloat(destinoLng) || -46.6624, parseFloat(destinoLat) || -23.5575];

//     this.mapboxService = new MapboxService();

//     this.mapboxService.initMap('map', origin, destination, (dadosCalculados) => {
//       this.driver.distance = dadosCalculados.distancia;
//       this.driver.eta = dadosCalculados.tempo;
//     });
//   },
//   beforeDestroy() {
//     if (this.mapboxService) this.mapboxService.destroyMap();
//   },
//   methods: {
//     toggleChatModal() {
//       this.showChatModal = !this.showChatModal;
//     },
//     submitEvaluation() {
//       console.log('Avaliação enviada:', { rating: this.userRating, comment: this.userComment });
//       alert(`Avaliação enviada com sucesso!`);
//       this.$router.push({ name: 'Home' });
//     }
//   }
// };

import { MapboxService } from '@/requests/mapboxService';
import { buscarPrestadorPorId, buscarAvaliacaoPrestador, buscarEnderecosPrestador } from '@/requests/prestador';
import { solicitarEmergencia, verificarEmergenciaPrestador, aceitarEmergencia } from '@/requests/pedido';
import { userStorage } from '@/utils/userStorage';
import { emitMockEmergency } from '@/utils/mockEmergency';

export default {
  name: 'PedidoCliente',
  data() {
    return {
      currentStep: 1,
      endereçoOrigem: 'Buscando endereço...',
      endereçoDestino: 'Buscando endereço...',
      mapboxService: null,
      showChatModal: false,
      showCancelModal: false,
      userRating: 0,
      userComment: '',
      erroAvaliacao: '',
      searchProgress: 0,
      searchInterval: null,
      simulationInterval: null,
      tipoPedido: 'comum',
      idPedidoEmergencia: null,
      aguardandoAceite: false,
      pollingInterval: null,
      descricaoEmergencia: '',
      driver: {
        name: 'Guinchos Mariano',
        rating: '4.0',
        plate: 'BDA-4132',
        distance: '-- km',
        eta: '-- min',
        avatar: new URL('../assets/pessoa.jpg', import.meta.url).href
      },
      novaMensagem: '',
      mensagensChat: [
        { id: 1, tipo: 'driver', texto: 'Olá! Já recebi seu pedido.', hora: '14:31' },
      ]
    };
  },
  async mounted() {
    const { origemLng, origemLat, destinoLng, destinoLat, txtOrigem, txtDestino, contactId, tipo, descricao } = this.$route.query;

    this.endereçoOrigem = txtOrigem || 'Endereço de Origem';
    this.endereçoDestino = txtDestino || 'Não informado';
    this.tipoPedido = tipo === 'emergencia' ? 'emergencia' : 'comum';
    this.descricaoEmergencia = descricao || '';

    const origin = [parseFloat(origemLng), parseFloat(origemLat)];
    const temDestino = destinoLng && destinoLat && destinoLng !== 'null' && destinoLat !== 'null';

    this.mapboxService = new MapboxService();

    if (temDestino) {
      const destination = [parseFloat(destinoLng), parseFloat(destinoLat)];

      this.mapboxService.initMap('map', origin, destination, (dadosCalculados) => {
        this.driver.distance = dadosCalculados.distancia;
        this.driver.eta = dadosCalculados.tempo;
        
        if (this.tipoPedido === 'emergencia') {
          this.solicitarEmergencia();
        } else {
          this.iniciarLoadingBusca();
        }
      });
    } else {
      this.mapboxService.initMapApenasOrigem('map', origin, () => {
        this.driver.distance = '-- km';
        this.driver.eta = 'Calculando...';
        
        if (this.tipoPedido === 'emergencia') {
          this.solicitarEmergencia();
        } else {
          this.iniciarLoadingBusca();
        }
      });
    }

    // Inscrever-se para eventos mock de aceite (quando usamos modo frontend-only)
    window.addEventListener('drivez:mock-accept', this.handleMockAccept);
    // Também escutar mudanças no localStorage para receber aceitações de outras abas
    this._storageListener = (event) => {
      if (event?.key === 'drivez:mock-accept' && event?.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          this.handleMockAccept({ detail: { pedidoId: parsed.pedidoId, prestadorId: parsed.prestadorId } });
        } catch (e) {
          console.warn('Erro ao processar drivez:mock-accept via storage:', e);
        }
      }
    };
    window.addEventListener('storage', this._storageListener);
    // BroadcastChannel listener (fallback mais robusto entre abas/janelas same-origin)
    try {
      this._bc = new BroadcastChannel('drivez-channel');
      this._bc.onmessage = (ev) => {
        try {
          if (ev?.data?.type === 'mock-accept') {
            this.handleMockAccept({ detail: ev.data.payload });
          }
        } catch (e) {
          console.warn('Erro ao processar BroadcastChannel message:', e);
        }
      };
    } catch (e) {
      // BroadcastChannel não suportado
    }
  },
  beforeDestroy() {
    if (this.mapboxService) this.mapboxService.destroyMap();
    clearInterval(this.searchInterval);
    clearInterval(this.simulationInterval);
    clearInterval(this.pollingInterval);
    window.removeEventListener('drivez:mock-accept', this.handleMockAccept);
    if (this._storageListener) window.removeEventListener('storage', this._storageListener);
    if (this._bc) {
      try { this._bc.close(); } catch (e) {}
      this._bc = null;
    }
  },
  methods: {
    iniciarLoadingBusca() {
      this.searchProgress = 0;

      this.searchInterval = setInterval(() => {
        if (this.searchProgress >= 100) {
          clearInterval(this.searchInterval);

          
          this.iniciarDeslocamentoLento();
          return;
        }

        this.searchProgress += 2;
      }, 140);
    },

    iniciarDeslocamentoLento() {
      let distanciaAtual = parseFloat(this.driver.distance) || 6.2;
      let tempoAtual = parseInt(this.driver.eta.includes('h') ? (parseInt(this.driver.eta.split('h')[0]) * 60 + parseInt(this.driver.eta.split('h')[1])) : this.driver.eta) || 15;

      this.simulationInterval = setInterval(() => {
        if (distanciaAtual <= 0.2 || tempoAtual <= 1) {
          clearInterval(this.simulationInterval);
          this.driver.distance = '0 km';
          this.driver.eta = 'Chegou';

          setTimeout(() => {
            this.currentStep = 3;
          }, 1500);
          return;
        }

        distanciaAtual = (distanciaAtual - 0.4).toFixed(1);
        tempoAtual = tempoAtual - 1;

        this.driver.distance = `${Math.max(0, distanciaAtual)} km`;
        this.driver.eta = this.formatarTempo(Math.max(1, tempoAtual));
      }, 4000);
    },
    toggleChatModal() {
      this.showChatModal = !this.showChatModal;
    },
    formatarTempo(minutosTotais) {
      if (minutosTotais >= 60) {
        const horas = Math.floor(minutosTotais / 60);
        const minutosRestantes = minutosTotais % 60;
        const minFormatado = minutosRestantes < 10 ? `0${minutosRestantes}` : minutosRestantes;
        return `${horas}h ${minFormatado}min`;
      }
      return `${minutosTotais} min`;
    },
    confirmarCancelamento() {
      this.showCancelModal = false;
      this.$router.push({ name: 'home-cliente' });
    },

    submitEvaluation() {
      if (this.userRating === 0) {
        this.erroAvaliacao = '⚠️ Por favor, selecione ao menos uma estrela para avaliar o serviço.';
        return;
      }

      this.erroAvaliacao = '';

      const dadosAvaliacao = {
        prestadorId: this.$route.query.contactId,
        nota: this.userRating,
        comentario: this.userComment
      };

      console.log('Avaliação enviada com sucesso:', dadosAvaliacao);
      this.$router.push({ name: 'home-cliente' });
    },
    enviarMensagem() {
      const textoFormatado = this.novaMensagem.trim();
      if (!textoFormatado) return;

      const agora = new Date();
      const horaFormatada = agora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      this.mensagensChat.push({
        id: Date.now(),
        tipo: 'client',
        texto: textoFormatado,
        hora: horaFormatada
      });

      this.novaMensagem = '';

      setTimeout(() => {
        this.mensagensChat.push({
          id: Date.now() + 1,
          tipo: 'driver',
          texto: 'Combinado! Estou chegando.',
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }, 1500);
    },

    async solicitarEmergencia() {
      try {
        console.log('[PedidoCliente] Solicitando emergência com dados:', {
          origem: this.endereçoOrigem,
          destino: this.endereçoDestino
        });

        const clienteId = userStorage.getUserId();
        if (!clienteId) {
          console.error('[PedidoCliente] Sem ID de cliente');
          return;
        }

        const novaEmergencia = {
          id_cliente: clienteId,
          endereco_origem: this.endereçoOrigem,
          endereco_destino: this.endereçoDestino,
          descricao: this.descricaoEmergencia || '',
          data_solicitacao: new Date().toISOString(),
          tipo_pedido: 'emergencia'
        };

        let resposta = null;
        let timeoutId = null;
        
        try {
          // Adiciona timeout de 5 segundos para requisição
          const promiseAPI = solicitarEmergencia(novaEmergencia);
          const promiseTimeout = new Promise((_, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Timeout na API')), 5000);
          });
          
          resposta = await Promise.race([promiseAPI, promiseTimeout]);
          if (timeoutId) clearTimeout(timeoutId);
          console.log('[PedidoCliente] Resposta da emergência:', resposta);
        } catch (err) {
          if (timeoutId) clearTimeout(timeoutId);
          console.warn('[PedidoCliente] ⚠️ Falha ao criar emergência no backend:', err?.message || err);
          
          // Criar um ID local e emitir evento mock para prestadores
          const mockId = `mock-${Date.now()}`;
          novaEmergencia.id_pedido = mockId;
          novaEmergencia.id = mockId;
          
          console.log('[PedidoCliente] 📢 DISPARANDO EVENTO MOCK COM PAYLOAD:', novaEmergencia);
          
          // Emite evento global para prestadores na mesma sessão
          try {
            emitMockEmergency({ ...novaEmergencia, id_pedido: mockId, id: mockId });
            console.log('[PedidoCliente] ✅ Evento mock disparado com sucesso');
          } catch (emitErr) {
            console.error('[PedidoCliente] ❌ Erro ao emitir mock-emergency:', emitErr);
          }
          
          // Fallback: também dispara via localStorage (funciona entre abas)
          try {
            localStorage.setItem('drivez:mock-emergency', JSON.stringify({ ...novaEmergencia, id_pedido: mockId, id: mockId, timestamp: Date.now() }));
            console.log('[PedidoCliente] 📱 Fallback localStorage ativado');
          } catch (e) {
            console.error('[PedidoCliente] Erro no fallback localStorage:', e);
          }
          
          resposta = { response: novaEmergencia };
        }

        const pedidoData = resposta?.response || resposta;
        let idExtraido = null;

        if (typeof pedidoData === 'object' && pedidoData !== null) {
          idExtraido = pedidoData.id || pedidoData.id_pedido || pedidoData.pedidoId;
        }

        // Se não conseguiu extrair ID válido, ativa fallback mock
        if (!idExtraido) {
          console.warn('[PedidoCliente] ⚠️ Resposta inválida da API, ativando fallback mock');
          console.log('[PedidoCliente] Resposta recebida:', resposta);
          
          const mockId = `mock-${Date.now()}`;
          novaEmergencia.id_pedido = mockId;
          novaEmergencia.id = mockId;
          
          console.log('[PedidoCliente] 📢 DISPARANDO EVENTO MOCK (Fallback) COM PAYLOAD:', novaEmergencia);
          
          try {
            emitMockEmergency({ ...novaEmergencia, id_pedido: mockId, id: mockId });
            console.log('[PedidoCliente] ✅ Evento mock disparado com sucesso (fallback)');
          } catch (emitErr) {
            console.error('[PedidoCliente] ❌ Erro ao emitir mock-emergency:', emitErr);
          }
          
          try {
            localStorage.setItem('drivez:mock-emergency', JSON.stringify({ ...novaEmergencia, id_pedido: mockId, id: mockId, timestamp: Date.now() }));
            console.log('[PedidoCliente] 📱 Fallback localStorage ativado');
          } catch (e) {
            console.error('[PedidoCliente] Erro no fallback localStorage:', e);
          }
          
          idExtraido = mockId;
        }

        if (idExtraido) {
          this.idPedidoEmergencia = idExtraido;
          console.log('[PedidoCliente] ID da emergência:', this.idPedidoEmergencia);
        } else {
          console.warn('[PedidoCliente] Não encontrou ID na resposta, usando fallback');
        }

        this.aguardandoAceite = true;
        // Se for mock (id começa com mock-) não use polling na API; espere evento de mock-accept
        if (String(this.idPedidoEmergencia).startsWith('mock-')) {
          console.log('[PedidoCliente] Emergência mock criada, aguardando evento mock-accept');
        } else {
          this.iniciarPollingEmergencia();
        }
      } catch (error) {
        console.error('[PedidoCliente] Erro ao solicitar emergência:', error);
        alert('Erro ao solicitar emergência');
      }
    },

    iniciarPollingEmergencia() {
      console.log('[PedidoCliente] Iniciando polling de emergência (intervalo: 3s)');
      let tentativas = 0;
      const maxTentativas = 100;

      // Aumenta polling para verificar aceitação (de 3s para 6s)
      this.pollingInterval = setInterval(async () => {
        tentativas++;
        console.log(`[PedidoCliente] Polling tentativa ${tentativas}/${maxTentativas}`);

        if (tentativas > maxTentativas) {
          console.log('[PedidoCliente] Timeout atingido (5 minutos)');
          clearInterval(this.pollingInterval);
          alert('Tempo de espera excedido. Tente novamente.');
          this.cancelarEmergencia();
          return;
        }

        try {
          const pedidoAtualizado = await verificarEmergenciaPrestador(this.idPedidoEmergencia);
          console.log('[PedidoCliente] Status da emergência:', pedidoAtualizado);

          const temPrestador = pedidoAtualizado?.id_prestador &&
                               pedidoAtualizado.id_prestador !== 0 &&
                               pedidoAtualizado.id_prestador !== null &&
                               String(pedidoAtualizado.id_prestador).trim() !== '';

          if (temPrestador) {
            console.log('[PedidoCliente] ✓ PRESTADOR ACEITOU A EMERGÊNCIA!');
            clearInterval(this.pollingInterval);
            this.aguardandoAceite = false;
            await this.carregarDadosPrestador(pedidoAtualizado.id_prestador);
            this.currentStep = 2;
          }
        } catch (error) {
          console.error('[PedidoCliente] Erro no polling:', error);
        }
      }, 6000);
    },

    // Listener para aceite em modo mock
    async handleMockAccept(event) {
      const detail = event?.detail || {};
      const pedidoId = detail.pedidoId || detail.id_pedido || detail.idPedido || detail.pedidoId;
      const idPrestador = detail.prestadorId || detail.prestador_id || detail.id_prestador || detail.prestador?.id || detail.prestadorId;
      console.log('[PedidoCliente] handleMockAccept chamado — detail:', detail, 'this.idPedidoEmergencia:', this.idPedidoEmergencia);
      if (!pedidoId) return;

      // Aceita match se:
      // - IDs iguais; ou
      // - idPedidoEmergencia é mock-*; ou
      // - estamos aguardando aceite e o pedido emitido for mock-* (fallback mais tolerante entre abas)
      const matches =
        String(pedidoId) === String(this.idPedidoEmergencia) ||
        (this.idPedidoEmergencia && String(this.idPedidoEmergencia).startsWith('mock-')) ||
        (this.aguardandoAceite && String(pedidoId || '').startsWith('mock-'));
      console.log('[PedidoCliente] aceitar? matches=', matches);
      if (!matches) return;

      console.log('[PedidoCliente] Recebeu mock-accept para pedido', pedidoId, 'prestador', idPrestador);
      this.aguardandoAceite = false;

      // Tentar recuperar dados do pedido (origem/destino) a partir do localStorage
      try {
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('drivez:mock-emergency');
          if (stored) {
            const parsed = JSON.parse(stored);
            const storedId = parsed?.id_pedido || parsed?.id || parsed?.pedidoId || parsed?.pedido_id;
            if (storedId && (String(storedId) === String(pedidoId) || (this.idPedidoEmergencia && String(this.idPedidoEmergencia).startsWith('mock-')))) {
              // usa os campos que existem no payload salvo
              if (parsed.endereco_origem) this.endereçoOrigem = parsed.endereco_origem;
              if (parsed.endereco_destino) this.endereçoDestino = parsed.endereco_destino;
              if (parsed.endereco) this.endereçoOrigem = this.endereçoOrigem || parsed.endereco;
              console.log('[PedidoCliente] Preenchendo origem/destino a partir do localStorage:', this.endereçoOrigem, this.endereçoDestino);
            }
          }
        }
      } catch (e) {
        console.warn('[PedidoCliente] Erro ao recuperar emergency do localStorage:', e);
      }

      // Se o evento já vier com os dados do prestador, usa diretamente
      const prestadorObj = detail.prestador || detail.prestadorData || detail.prestador_info || detail.prestadorDetails;
      if (prestadorObj && typeof prestadorObj === 'object') {
        this.driver = {
          name: prestadorObj.nome || prestadorObj.name || prestadorObj.nome_prestador || 'Prestador',
          rating: prestadorObj.media_avaliacoes || prestadorObj.rating || prestadorObj.avaliacao || '4.5',
          plate: prestadorObj.placa || prestadorObj.plate || prestadorObj.placa_veiculo || '---',
          distance: prestadorObj.distance || prestadorObj.distancia || '-- km',
          eta: prestadorObj.eta || prestadorObj.tempo || 'A caminho',
          avatar: prestadorObj.img_perfil || prestadorObj.foto || prestadorObj.profileImage || new URL('../assets/pessoa.jpg', import.meta.url).href
        };
        this.currentStep = 2;
        // calcular rota e métricas como no prestador
        this.calcularRotaPrestador();
        clearInterval(this.pollingInterval);
        return;
      }

      // Caso contrário, busca via API usando id do prestador
      if (idPrestador) {
        try {
          await this.carregarDadosPrestador(idPrestador);
        } catch (e) {
          console.warn('[PedidoCliente] falha ao carregar prestador por id:', e);
        }
      }

      // Se já temos origem/destino preenchidos, calcula rota como o prestador faz
      try {
        await this.calcularRotaPrestador();
      } catch (e) {
        /* ignore */
      }

      this.currentStep = 2;
      clearInterval(this.pollingInterval);
    },

    async carregarDadosPrestador(idPrestador) {
      try {
        console.log('[PedidoCliente] Carregando dados do prestador:', idPrestador);

        const resposta = await buscarPrestadorPorId(idPrestador);
        const prestadorData = resposta?.response || resposta;

        console.log('[PedidoCliente] Dados do prestador recebidos:', prestadorData);

        if (prestadorData) {
          this.driver = {
            name: prestadorData.nome || prestadorData.nome_prestador || 'Prestador',
            rating: prestadorData.media_avaliacoes || prestadorData.rating || '4.5',
            plate: prestadorData.placa || 'ABC-0000',
            distance: prestadorData.distance || prestadorData.distancia || '-- km',
            eta: prestadorData.eta || prestadorData.tempo || 'A caminho',
            avatar: prestadorData.img_perfil || prestadorData.foto || prestadorData.profileImage || new URL('../assets/pessoa.jpg', import.meta.url).href
          };
          console.log('[PedidoCliente] Dados do driver atualizados:', this.driver);
        }
        // Buscar endereços vinculados ao prestador e preencher origem/destino
        try {
          const endResp = await buscarEnderecosPrestador(idPrestador);
          const enderecos = endResp?.response?.enderecos || endResp?.enderecos || [];
          if (Array.isArray(enderecos) && enderecos.length > 0) {
            const formatEndereco = (e) => {
              if (!e) return '';
              const parts = [];
              if (e.logradouro) parts.push(e.logradouro);
              if (e.bairro) parts.push(e.bairro);
              if (e.cidade) parts.push(e.cidade);
              if (e.uf) parts.push(e.uf);
              return parts.join(', ');
            };

            this.endereçoOrigem = formatEndereco(enderecos[0]);
            if (enderecos.length > 1) this.endereçoDestino = formatEndereco(enderecos[1]);
            console.log('[PedidoCliente] Endereços do prestador:', this.endereçoOrigem, this.endereçoDestino);
            // Calcular rota/tempo/distância após definir endereços
            try {
              await this.calcularRotaPrestador();
            } catch (e) {
              console.warn('[PedidoCliente] Erro ao calcular rota do prestador:', e);
            }
          }
        } catch (e) {
          console.warn('[PedidoCliente] Não foi possível carregar endereços do prestador:', e);
        }
      } catch (error) {
        console.error('[PedidoCliente] Erro ao carregar dados do prestador:', error);
      }
    },

    cancelarEmergencia() {
      console.log('[PedidoCliente] Cancelando emergência');
      clearInterval(this.pollingInterval);
      this.aguardandoAceite = false;
      this.tipoPedido = 'comum';
      this.$router.push({ name: 'home-cliente' });
    },
  }
};
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
  gap: 13px;
  overflow-y: auto;
  
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

@keyframes cardExpand {
  from {
    width: 460px;
    height: 580px;
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

.timeline-section {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 8px;
}

.tracking-card.expanded .timeline-section {
  display: none;
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
  transition: width 0.3s linear;
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

.custom-marker {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.origin-marker {
  background-color: #000000;
  border: 3px solid #ffffff;
  border-radius: 4px;
  width: 16px;
  height: 16px;
}

.destination-marker {
  background-color: #ffffff;
  border: 4px solid #1a1a1a;
  width: 18px;
  height: 18px;
}

.map-background .test-button {
  position: relative;
  z-index: 50;
  width: auto;
  margin: 10px;
  display: inline-block;
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

  .tracking-card.expanded {
    width: calc(100% - 32px);
    max-width: 600px;
    bottom: 50%;
    transform: translateX(-50%) translateY(50%);
    padding: 32px 24px;
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

  .tracking-card.expanded {
    position: fixed;
    bottom: 50%;
    left: 50%;
    right: auto;
    width: calc(100% - 32px);
    transform: translateX(-50%) translateY(50%);
    height: auto;
    padding: 28px 20px;
    gap: 18px;
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

.eval-driver-photo {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.eval-driver-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.eval-driver-name {
  font-size: 20px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
}

.eval-driver-role {
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

.submit-button {
  width: 100%;
  padding: 16px 24px;
  background: #c41e1e;
  color: #ffffff;
  border: none;
  border-radius: 28px;
  font-size: 15px;
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

.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.custom-modal-box {
  background: white;
  padding: 24px;
  border-radius: 20px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  animation: modalScale 0.2s ease-out;
}

.modal-title {
  margin: 0 0 12px 0;
  font-size: 20px;
  color: #111827;
  font-weight: 700;
}

.modal-text {
  font-size: 15px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0 0 24px 0;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-keep {
  background: #f3f4f6;
  color: #374151;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-keep:hover {
  background: #e5e7eb;
}

.btn-confirm-cancel {
  background: #d62828;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-confirm-cancel:hover {
  background: #b51e1e;
}

@keyframes modalScale {
  from {
    transform: scale(0.95);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

.error-message-box {
  background-color: #ffe3e3;
  color: #d62828;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  margin: 10px 0;
  border: 1px solid #f5baba;
  animation: shakeFadeIn 0.3s ease-in-out;
}

@keyframes shakeFadeIn {
  0% {
    transform: translateX(0);
    opacity: 0;
  }

  20% {
    transform: translateX(-6px);
  }

  40% {
    transform: translateX(6px);
  }

  60% {
    transform: translateX(-4px);
  }

  80% {
    transform: translateX(4px);
  }

  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .evaluation-title {
    font-size: 16px;
  }

  .eval-driver-photo {
    width: 80px;
    height: 80px;
  }

  .eval-driver-name {
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
  .evaluation-title {
    font-size: 14px;
  }

  .eval-driver-photo {
    width: 70px;
    height: 70px;
  }

  .eval-driver-name {
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

/* Emergency Styles */
.emergency-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0px;
  width: 100%;
}

.emergency-icon-top {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emergency-icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.emergency-waiting {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  align-items: center;
  text-align: center;
}

.emergency-waiting-title {
  font-size: 24px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
}

.emergency-waiting-text {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

.emergency-pulse-animation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 16px 0;
}

.pulse-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #c41e1e;
  animation: pulse 1.2s infinite;
}

.pulse-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.pulse-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0.6;
    transform: scale(0.8);
  }
}

.emergency-locations-waiting {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  background: #f9f9f9;
  padding: 16px;
  border-radius: 14px;
}

.emergency-location-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.emergency-location-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.emergency-location-label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.emergency-location-text {
  font-size: 14px;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.4;
  word-break: break-word;
}

.emergency-cancel-btn {
  width: 100%;
  background: #c41e1e;
  border: none;
  color: white;
  padding: 14px 20px;
  border-radius: 28px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.emergency-cancel-btn:hover {
  background: #a01818;
  box-shadow: 0 6px 16px rgba(196, 30, 30, 0.3);
}

.emergency-cancel-btn:active {
  background: #8b1414;
  transform: scale(0.98);
}
</style>
