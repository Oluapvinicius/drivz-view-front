<template>
  <div class="mensagem-app">
    <header class="mensagem-topbar">
      <button class="mensagem-back" @click="$router.back()" aria-label="Voltar">
        <img src="../assets/arrow.png" alt="Voltar" />
      </button>
      <div class="mensagem-topbar__title">
        <span>Contatos</span>
      </div>
      <div class="mensagem-topbar__spacer"></div>
    </header>

    <div class="mensagem-screen">
      <aside class="mensagem-sidebar">
        <div class="mensagem-sidebar__search">
          <img src="../assets/lupa.svg" alt="Pesquisar" class="mensagem-sidebar__icon" />
          <input
            type="text"
            placeholder="Pesquisar Cliente"
            v-model="searchQuery"
            class="mensagem-sidebar__input"
          />
        </div>

        <div class="mensagem-sidebar__list">
          <button
            v-for="contact in filteredContacts"
            :key="contact.id"
            class="mensagem-contact-card"
            :class="{ active: contact.id === selectedContact.id }"
            @click="selectContact(contact.id)"
          >
            <img :src="contact.avatar" :alt="contact.name" class="mensagem-contact-card__avatar" />
            <div class="mensagem-contact-card__text">
              <strong>{{ contact.name }}</strong>
              <p>{{ contact.lastMessage }}</p>
            </div>
          </button>
        </div>
      </aside>

      <section class="mensagem-chat">
        <div class="mensagem-chat__body">
          <div
            v-for="message in chatMessages"
            :key="message.id"
            :class="['mensagem-bubble', message.type]"
          >
            <div class="mensagem-bubble__content">
              <p>{{ message.text }}</p>
              <template v-if="message.media">
                <img :src="message.media" alt="Anexo" class="mensagem-bubble__image" />
              </template>
            </div>
            <span class="mensagem-bubble__time">{{ message.time }}</span>
          </div>
        </div>

        <div class="mensagem-chat__footer">
          <button class="mensagem-icon-button mensagem-attach" type="button" aria-label="Anexar imagem">
            <img src="../assets/image.svg" alt="Anexar imagem" />
          </button>
          <input
            type="text"
            placeholder="Digite a mensagem"
            v-model="newMessage"
            @keyup.enter="sendMessage"
            class="mensagem-input"
          />
          <button class="mensagem-icon-button mensagem-send" type="button" @click="sendMessage" aria-label="Enviar mensagem">
            <img src="../assets/email.svg" alt="Enviar mensagem" />
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { userStorage } from '../utils/userStorage';
import { enviarMensagem, buscarHistoricoMensagens } from '../requests/mensagem.js';

const route = useRoute();
const pedidoId = Number(route.query.pedidoId) || null;
const contactId = Number(route.query.contactId) || null;
const routeContactName = route.query.contactName || 'Cliente';
const routeContactAvatar = route.query.contactAvatar || 'https://via.placeholder.com/150';

console.log('[MensagemPrestador] Params:', { pedidoId, contactId, routeContactName });

const socket = ref(null);
const searchQuery = ref('');
const selectedContactId = ref(contactId || 1);
const newMessage = ref('');
const chatMessagesArray = ref([]);

// Dados mock para sidebar de contatos
const contacts = ref([]);

// Adiciona o contato com quem está conversando
if (contactId) {
  contacts.value = [{
    id: contactId,
    name: routeContactName || 'Cliente',
    avatar: routeContactAvatar || 'https://via.placeholder.com/150',
    lastMessage: 'Conversa ativa'
  }];
}

const selectedContact = computed(() => {
  return contacts.value.find((contact) => contact.id === selectedContactId.value) || contacts.value[0];
});

const filteredContacts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return contacts.value;
  return contacts.value.filter((contact) => {
    return contact.name.toLowerCase().includes(query);
  });
});

const chatMessages = computed(() => {
  return chatMessagesArray.value;
});

function getSocketHost() {
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:8080/v1/drivez';
  return apiBase.replace(/\/v1\/drivez\/?$/, '');
}

function handleIncomingMessage(payload) {
  console.log('[MensagemPrestador] Mensagem recebida:', payload);
  if (!payload) return;
  
  chatMessagesArray.value.push({
    id: payload.id_mensagem || Date.now(),
    type: 'incoming',
    text: payload.texto_mensagem || payload.text || '',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    media: payload.imagem || null
  });
}

function selectContact(id) {
  selectedContactId.value = id;
}

function sendMessage() {
  const text = newMessage.value.trim();
  if (!text || !pedidoId || !contactId) {
    console.warn('[MensagemPrestador] Não pode enviar:', { text, pedidoId, contactId });
    return;
  }

  const prestadorId = userStorage.getUserId();
  console.log('[MensagemPrestador] Enviando mensagem:', { prestadorId, contactId, pedidoId, text });

  // Adicionar à tela imediatamente
  chatMessagesArray.value.push({
    id: Date.now(),
    type: 'outgoing',
    text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  // Enviar via socket
  if (socket.value) {
    socket.value.emit('chat-message', {
      data_envio: new Date().toISOString(),
      texto_mensagem: text,
      lida: false,
      id_pedido: pedidoId,
      id_prestador: prestadorId,
      id_cliente: contactId,
      imagem: null
    });
    console.log('[MensagemPrestador] Mensagem emitida via socket');
  } else {
    console.warn('[MensagemPrestador] Socket não conectado');
  }

  newMessage.value = '';
}

onMounted(() => {
  console.log('[MensagemPrestador] Montando componente...');
  
  if (!pedidoId) {
    console.warn('[MensagemPrestador] Sem pedidoId, não conectando socket');
    return;
  }

  try {
    const socketHost = getSocketHost();
    console.log('[MensagemPrestador] Conectando socket em:', socketHost);
    
    socket.value = io(socketHost, { 
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });
    
    socket.value.on('connect', () => {
      console.log('[MensagemPrestador] Socket conectado:', socket.value.id);
      // Entrar na sala do pedido
      socket.value.emit('join-pedido', pedidoId);
      console.log('[MensagemPrestador] Emitiu join-pedido para:', pedidoId);
    });

    socket.value.on('joined-room', (data) => {
      console.log('[MensagemPrestador] Entrou na sala:', data);
    });

    socket.value.on('chat-message', handleIncomingMessage);
    
    socket.value.on('connect_error', (error) => {
      console.warn('[MensagemPrestador] Socket connection error:', error);
    });

    socket.value.on('disconnect', () => {
      console.log('[MensagemPrestador] Socket desconectado');
    });

  } catch (error) {
    console.warn('[MensagemPrestador] Erro ao conectar socket:', error);
  }
});

onBeforeUnmount(() => {
  if (socket.value) {
    socket.value.disconnect();
    socket.value = null;
  }
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.mensagem-app {
  min-height: 100vh;
  background: #f9f6e6;
  color: #111827;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.mensagem-topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  background: #d62828;
  padding: 25px 24px;
  color: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.mensagem-topbar__title {
  flex: 1;
  text-align: center;
}

.mensagem-topbar__title span {
  font-size: 20px;
  font-weight: 700;
}

.mensagem-topbar__spacer {
  width: 44px;
}

.mensagem-back {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 14px;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
}

.mensagem-back img {
  width: 26px;
  height: 26px;
  filter: invert(1) brightness(2);
}

.mensagem-screen {
  display: grid;
  grid-template-columns: 600px minmax(0, 1fr);
  min-height: calc(100vh - 80px);
}

.mensagem-sidebar {
  background: rgba(250, 250, 250);
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.mensagem-sidebar__search {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border: 0.8px solid rgba(0, 0, 0, 0.9);
  border-radius: 34px;
  padding: 23px 16px;
}

.mensagem-sidebar__icon {
  width: 20px;
  height: 20px;
}

.mensagem-sidebar__input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 15px;
  background: transparent;
}

.mensagem-sidebar__list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  padding-right: 4px;
}

.mensagem-contact-card {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 18px;
  border-radius: 22px;
  border: 0.8px solid rgba(0, 0, 0, 0.9);
  background: white;
  text-align: left;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.mensagem-contact-card.active {
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.mensagem-contact-card:hover {
  transform: translateY(-1px);
}

.mensagem-contact-card__avatar {
  width: 62px;
  height: 62px;
  border-radius: 20px;
  object-fit: cover;
}

.mensagem-contact-card__text strong {
  display: block;
  font-size: 17px;
  margin-bottom: 4px;
}

.mensagem-contact-card__text p {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.4;
}

.mensagem-chat {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;
}

.mensagem-chat__body {
  margin-top: 28px;
  flex: 1;
  padding-right: 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.mensagem-bubble {
  max-width: 82%;
  display: inline-flex;
  flex-direction: column;
  gap: 10px;
}

.mensagem-bubble.incoming {
  align-self: flex-start;
  background: white;
  border-radius: 22px 22px 22px 6px;
  padding: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
}

.mensagem-bubble.outgoing {
  align-self: flex-end;
  background: #f3f4f6;
  border-radius: 22px 22px 6px 22px;
  padding: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
}

.mensagem-bubble__content p {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
}

.mensagem-bubble__image {
  width: 100%;
  border-radius: 20px;
  margin-top: 10px;
  object-fit: cover;
}

.mensagem-bubble__time {
  font-size: 12px;
  color: #6b7280;
  align-self: flex-end;
}

.mensagem-chat__footer {
  margin-top: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px;
  border-radius: 30px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.mensagem-icon-button {
  background: transparent;
  border: none;
  padding: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.mensagem-icon-button:hover {
  transform: translateY(-1px);
}

.mensagem-icon-button img {
  width: 30px;
  height: 30px;
}

.mensagem-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #111827;
  background: transparent;
}

@media (max-width: 1100px) {
  .mensagem-screen {
    grid-template-columns: 1fr;
  }

  .mensagem-sidebar {
    min-height: 280px;
  }
}

@media (max-width: 760px) {
  .mensagem-topbar {
    padding: 14px 16px;
  }

  .mensagem-screen {
    display: block;
  }

  .mensagem-sidebar,
  .mensagem-chat {
    padding: 18px;
  }
}
</style>
