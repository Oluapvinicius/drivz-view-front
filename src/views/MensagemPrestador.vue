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
import { ref, computed } from 'vue';

const searchQuery = ref('');
const selectedContactId = ref(1);
const newMessage = ref('');

const contacts = [
  {
    id: 1,
    name: 'João Silva',
    avatar: 'https://via.placeholder.com/150',
    lastMessage: 'Chegou mais rápido que o esperado',
  },
  {
    id: 2,
    name: 'Maria Santos',
    avatar: 'https://via.placeholder.com/150',
    lastMessage: 'Você chega em quanto tempo?',
  },
  {
    id: 3,
    name: 'Carlos Oliveira',
    avatar: 'https://via.placeholder.com/150',
    lastMessage: 'Obrigado pela rapidez!',
  },
  {
    id: 4,
    name: 'Ana Costa',
    avatar: 'https://via.placeholder.com/150',
    lastMessage: 'Solicitação de um reboque urgente',
  }
];

const chats = [
  {
    contactId: 1,
    messages: [
      { id: 1, type: 'incoming', text: 'Olá, você consegue fazer um reboque agora?', time: '14:20' },
      { id: 2, type: 'outgoing', text: 'Opa, sim! Já estou saindo para lá', time: '14:22' },
      { id: 3, type: 'incoming', text: 'Perfeito, obrigado!', time: '14:25' },
      { id: 4, type: 'incoming', text: 'Chegou mais rápido que o esperado', time: '14:50' }
    ]
  },
  {
    contactId: 2,
    messages: [
      { id: 1, type: 'incoming', text: 'Oi, preciso de um reboque urgente', time: '16:10' },
      { id: 2, type: 'outgoing', text: 'Qual é a sua localização?', time: '16:11' },
      { id: 3, type: 'incoming', text: 'Estou na Rua Oscar Freire, 500', time: '16:12' },
      { id: 4, type: 'outgoing', text: 'Chegando em 5 minutos', time: '16:13' },
      { id: 5, type: 'incoming', text: 'Você chega em quanto tempo?', time: '16:15' }
    ]
  },
  {
    contactId: 3,
    messages: [
      { id: 1, type: 'incoming', text: 'Olá, tudo bem?', time: '10:30' },
      { id: 2, type: 'outgoing', text: 'Tudo certo! Qual é a necessidade?', time: '10:32' },
      { id: 3, type: 'incoming', text: 'Meu carro pifou na Av. Faria Lima', time: '10:35' },
      { id: 4, type: 'outgoing', text: 'Já estou indo, 10 minutos', time: '10:36' },
      { id: 5, type: 'incoming', text: 'Obrigado pela rapidez!', time: '11:00' }
    ]
  },
  {
    contactId: 4,
    messages: [
      { id: 1, type: 'incoming', text: 'Oi, você atende reboque na Av. Brasil?', time: '17:00' },
      { id: 2, type: 'outgoing', text: 'Sim, atendo sim! Qual é o endereço exato?', time: '17:01' }
    ]
  }
];

const selectedContact = computed(() => {
  return contacts.find((contact) => contact.id === selectedContactId.value) || contacts[0];
});

const filteredContacts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return contacts;

  return contacts.filter((contact) => {
    return contact.name.toLowerCase().includes(query) ||
      contact.lastMessage.toLowerCase().includes(query);
  });
});

const chatMessages = computed(() => {
  const chat = chats.find((item) => item.contactId === selectedContactId.value);
  return chat ? chat.messages : [];
});

function selectContact(contactId) {
  selectedContactId.value = contactId;
}

function sendMessage() {
  const text = newMessage.value.trim();
  if (!text) return;

  const chat = chats.find((item) => item.contactId === selectedContactId.value);
  if (chat) {
    chat.messages.push({
      id: Date.now(),
      type: 'outgoing',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  }

  newMessage.value = '';
}
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
