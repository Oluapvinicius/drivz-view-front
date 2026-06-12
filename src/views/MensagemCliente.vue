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
          <input type="text" placeholder="Pesquisar Contato" v-model="searchQuery" class="mensagem-sidebar__input" />
        </div>

        <div class="mensagem-sidebar__list">
          <button v-for="contact in filteredContacts" :key="contact.id" class="mensagem-contact-card"
            :class="{ active: contact.id === selectedContact.id }" @click="selectContact(contact.id)">
            <img :src="contact.avatar" :alt="contact.name" class="mensagem-contact-card__avatar" />
            <div class="mensagem-contact-card__text">
              <strong>{{ contact.name }}</strong>
              <p>{{ contact.subtitle }}</p>
            </div>
          </button>
        </div>
      </aside>

      <section class="mensagem-chat">
        <div class="mensagem-chat__body">
          <div v-for="message in chatMessages" :key="message.id" :class="['mensagem-bubble', message.type]">
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
          <input type="text" placeholder="Digite a mensagem" v-model="newMessage" @keyup.enter="sendMessage"
            class="mensagem-input" />
          <button class="mensagem-icon-button mensagem-send" type="button" @click="sendMessage"
            aria-label="Enviar mensagem">
            <img src="../assets/email.svg" alt="Enviar mensagem" />
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
// Using runtime data (API or dynamic creation). Start with empty lists.
const contacts = ref([]);
const chats = ref([]);

const searchQuery = ref('');
const selectedContactId = ref(route.query.contactId ? Number(route.query.contactId) : contacts.value[0]?.id || 1);
const newMessage = ref('');

const selectedContact = computed(() => {
  return contacts.value.find((contact) => String(contact.id) === String(selectedContactId.value)) || contacts.value[0] || {};
});

const filteredContacts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return contacts.value;

  return contacts.value.filter((contact) => {
    return (
      contact.name.toLowerCase().includes(query) ||
      contact.subtitle.toLowerCase().includes(query) ||
      contact.location.toLowerCase().includes(query)
    );
  });
});

const chatMessages = computed(() => {
  const chat = chats.value.find((item) => String(item.contactId) === String(selectedContactId.value));
  return chat ? chat.messages : [];
});

function selectContact(contactId) {
  selectedContactId.value = contactId;
}

function findContactByQuery(query) {
  if (!query) return null;
  const contactId = query.contactId;
  const providerName = query.providerName;
  const providerEmail = query.providerEmail;

  let contact = contacts.value.find((item) => String(item.id) === String(contactId));
  if (contact) return contact;
  if (providerEmail) {
    contact = contacts.value.find((item) => item.email === providerEmail);
    if (contact) return contact;
  }
  if (providerName) {
    contact = contacts.value.find((item) => item.name === providerName);
    if (contact) return contact;
  }
  return null;
}

function createDynamicContact(query) {
  const nextId = contacts.value.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
  const newContact = {
    id: nextId,
    name: query.providerName || 'Prestador',
    subtitle: 'Conversa iniciada após solicitação de serviço',
    avatar: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=200&h=200',
    location: '',
    email: query.providerEmail || ''
  };
  contacts.value.push(newContact);
  chats.value.push({
    contactId: nextId,
    messages: [
      {
        id: 1,
        type: 'incoming',
        text: 'Solicitação de serviço recebida. Vamos conversar pelo chat.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]
  });
  return newContact;
}

watch(
  () => route.query,
  (query) => {
    if (!query?.contactId) return;

    const contact = findContactByQuery(query);
    if (contact) {
      selectedContactId.value = contact.id;
      return;
    }

    const newContact = createDynamicContact(query);
    selectedContactId.value = newContact.id;
  },
  { immediate: true }
);

function sendMessage() {
  const text = newMessage.value.trim();
  if (!text) return;

  const chat = chats.value.find((item) => String(item.contactId) === String(selectedContactId.value));
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

function requestService() {
  const contatoAtivo = selectedContact.value;

  router.push({
    name: 'configurar-pedido-cliente',
    query: {
      contactId: contatoAtivo.id,
      providerName: contatoAtivo.name,
      providerEmail: contatoAtivo.email,
      tipo: 'comum'
    }
  });
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
  position: sticky;
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
  display: flex;
  align-items: center;
  gap: 14px;
}

.mensagem-topbar__avatar {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.28);
}

.mensagem-topbar__contact-text h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
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

.mensagem-topbar__title span {
  font-size: 20px;
  font-weight: 700;
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

.mensagem-chat__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.mensagem-chat__profile {
  display: flex;
  align-items: center;
  gap: 18px;
}

.mensagem-chat__avatar {
  width: 62px;
  height: 62px;
  border-radius: 18px;
  object-fit: cover;
}

.mensagem-chat__profile h2 {
  margin: 0;
  font-size: 22px;
}

.mensagem-chat__profile p {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 14px;
}

.mensagem-chat__email {
  margin: 6px 0 0;
  color: #4b5563;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
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

.mensagem-topbar__action {
  background: #ffffff;
  color: #d62828;
  font-size: 14px;
  font-weight: 700;
  padding: 10px 20px;
  border: 2px solid #ffffff;
  border-radius: 14px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  white-space: nowrap;
}

.mensagem-topbar__action:hover {
  background: #f9f6e6;
  color: #b51a1a;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.mensagem-topbar__action:active {
  transform: translateY(0);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

@media (max-width: 760px) {
  .mensagem-topbar__action {
    padding: 8px 14px;
    font-size: 13px;
    border-radius: 10px;
  }
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

  .mensagem-chat__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>
