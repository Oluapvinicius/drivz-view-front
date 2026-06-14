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
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from '@/firebase/firebase';
import { collection, onSnapshot, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';

const route = useRoute();
const router = useRouter();

const CONTACTS_KEY = 'drivez_cliente_contacts';
const SELECTED_KEY = 'drivez_cliente_selected';

const currentUser = 'cliente';

function loadSaved(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; }
  catch { return fallback; }
}

const ROOM_ID = 12; 

const contacts = ref(loadSaved(CONTACTS_KEY, [
  { id: ROOM_ID, name: 'Prestador', subtitle: 'Conversa com prestador', avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&q=80&w=200&h=200' }
]));
const searchQuery = ref('');
const selectedContactId = ref(ROOM_ID);
const newMessage = ref('');
const chatMessages = ref([]);
let unsubscribeMessages = null;

const selectedContact = computed(() =>
  contacts.value.find(c => String(c.id) === String(selectedContactId.value)) || contacts.value[0] || {}
);

const filteredContacts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return contacts.value;
  return contacts.value.filter(c =>
    c.name.toLowerCase().includes(q) ||
    (c.subtitle || '').toLowerCase().includes(q)
  );
});

watch(contacts, val => localStorage.setItem(CONTACTS_KEY, JSON.stringify(val)), { deep: true });
watch(selectedContactId, val => { if (val != null) localStorage.setItem(SELECTED_KEY, String(val)); });

function formatTimestamp(timestamp) {
  if (!timestamp) return '';
  let date;
  if (timestamp?.toDate) {
    date = timestamp.toDate();
  } else if (timestamp?.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    date = new Date(timestamp);
  }
  if (isNaN(date.getTime())) return '';
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function mapDocToMessage(doc) {
  const data = doc.data() || {};
  const ts = data.createdAt || data.updatedAt || data.timestamp || data.sentAt || null;
  const sender = data.sender || 'prestador';
  return {
    id: doc.id,
    text: data.text || '',
    time: formatTimestamp(ts || new Date()),
    type: sender === currentUser ? 'outgoing' : 'incoming',
    sender,
    _ts: ts || new Date(),
  };
}

function selectContact(id) {
  selectedContactId.value = id;
  writeRoomMetadata(id);
}

function subscribeToMessages(roomId) {
  if (unsubscribeMessages) unsubscribeMessages();
  chatMessages.value = [];
  if (!roomId) return;

  const messagesRef = collection(db, 'chats', String(roomId), 'messages');
  unsubscribeMessages = onSnapshot(
    messagesRef,
    snapshot => {
      chatMessages.value = snapshot.docs
        .map(mapDocToMessage)
        .sort((a, b) => {
          const ta = a._ts?.toDate?.()?.getTime() ?? (a._ts instanceof Date ? a._ts.getTime() : 0);
          const tb = b._ts?.toDate?.()?.getTime() ?? (b._ts instanceof Date ? b._ts.getTime() : 0);
          return ta - tb;
        });
    },
    error => console.error('Erro no listener Firestore:', error)
  );
}

watch(selectedContactId, (newId) => {
  subscribeToMessages(newId);
  if (newId) writeRoomMetadata(newId);
}, { immediate: true });

// room fixa — sempre chats/12/messages independente da rota
writeRoomMetadata(ROOM_ID);

function getClienteName() {
  // 1. Chave simples gravada pelo HomeCliente ao carregar o perfil (mais confiável)
  const simples = localStorage.getItem('clienteNome');
  if (simples && simples.trim()) return simples.trim();

  // 2. Tenta userData em todas as estruturas possíveis
  try {
    const raw = JSON.parse(localStorage.getItem('userData') || '{}');
    for (const src of [raw?.response, raw?.user, raw]) {
      if (!src || typeof src !== 'object') continue;
      const n = src.nome || src.nome_cliente || src.nome_usuario || src.name;
      if (n && typeof n === 'string' && n.trim()) return n.trim();
    }
  } catch {}
  return 'Cliente';
}

async function writeRoomMetadata(prestadorId) {
  const nome = getClienteName();
  if (!prestadorId) return;
  try {
    await setDoc(doc(db, 'chats', String(prestadorId)), {
      clientName: nome,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (e) { console.error('Erro ao gravar metadata da sala:', e); }
}

async function sendMessage() {
  const text = newMessage.value.trim();
  if (!text || !selectedContactId.value) return;

  try {
    const messagesRef = collection(db, 'chats', String(selectedContactId.value), 'messages');
    await addDoc(messagesRef, {
      sender: currentUser,
      senderName: getClienteName(),
      clientName: getClienteName(), // compatibilidade mobile
      text,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(), // compatibilidade mobile
    });
    newMessage.value = '';
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
  }
}

function requestService() {
  const contatoAtivo = selectedContact.value;
  router.push({
    name: 'configurar-pedido-cliente',
    query: {
      contactId: contatoAtivo.id,
      providerName: contatoAtivo.name,
      providerEmail: contatoAtivo.email,
      tipo: 'comum',
    }
  });
}

onBeforeUnmount(() => {
  if (typeof unsubscribeMessages === 'function') unsubscribeMessages();
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.mensagem-app {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #f9f6e6;
  color: #111827;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.mensagem-topbar {
  flex-shrink: 0;
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
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-columns: 600px minmax(0, 1fr);
}

.mensagem-sidebar {
  background: rgba(250, 250, 250);
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 0;
  overflow-y: auto;
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
  padding: 24px;
  min-height: 0;
  overflow: hidden;
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
  min-height: 0;
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
    max-height: 280px;
  }
}

@media (max-width: 760px) {
  .mensagem-topbar {
    padding: 14px 16px;
  }

  .mensagem-screen {
    display: flex;
    flex-direction: column;
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
