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
          <input
            type="text"
            placeholder="Digite a mensagem"
            v-model="newMessage"
            @keyup.enter="sendMessage"
            class="mensagem-input"
          />
          <button class="mensagem-icon-button mensagem-send" type="button" @click="sendMessage" aria-label="Enviar mensagem">
            <img src="../assets/email.svg" alt="Enviar" />
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { db } from '@/firebase/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc } from 'firebase/firestore';

const route = useRoute();

const CONTACTS_KEY = 'drivez_prestador_contacts';
const SELECTED_KEY = 'drivez_prestador_selected';
const ROOMS_KEY   = 'drivez_prestador_rooms';
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&q=80&w=200&h=200';

function loadSaved(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; }
  catch { return fallback; }
}

const routeContactId   = Number(route.query.contactId) || null;
const routeContactName = route.query.contactName || 'Cliente';
const routeContactAvatar = route.query.contactAvatar || DEFAULT_AVATAR;

const currentUser = 'prestador';
const searchQuery = ref('');
const newMessage  = ref('');
const chatMessages = ref([]);
const contacts = ref(loadSaved(CONTACTS_KEY, []));
let unsubscribeMessages = null;
const bgUnsubscribers = [];

// Salas que este prestador já atendeu — persistidas para redescobrir contatos
const trackedRooms = loadSaved(ROOMS_KEY, []);

if (routeContactId) {
  // Registra a sala se ainda não está rastreada
  if (!trackedRooms.includes(routeContactId)) {
    trackedRooms.push(routeContactId);
    localStorage.setItem(ROOMS_KEY, JSON.stringify(trackedRooms));
  }
  // Garante contato na lista
  if (!contacts.value.find(c => c.id === routeContactId)) {
    contacts.value.push({
      id: routeContactId,
      name: routeContactName,
      avatar: routeContactAvatar,
      lastMessage: '',
    });
  }
}

const initialSelected = routeContactId || loadSaved(SELECTED_KEY, contacts.value[0]?.id || null);
const selectedContactId = ref(initialSelected);

watch(contacts, val => localStorage.setItem(CONTACTS_KEY, JSON.stringify(val)), { deep: true });
watch(selectedContactId, val => { if (val != null) localStorage.setItem(SELECTED_KEY, String(val)); });

const selectedContact = computed(() =>
  contacts.value.find(c => c.id === selectedContactId.value) || contacts.value[0] || {}
);

const filteredContacts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return contacts.value;
  return contacts.value.filter(c => c.name.toLowerCase().includes(q));
});

function formatTimestamp(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function mapDocToMessage(doc) {
  const data = doc.data() || {};
  return {
    id: doc.id,
    text: data.text || '',
    time: formatTimestamp(data.createdAt),
    type: data.sender === currentUser ? 'outgoing' : 'incoming',
    sender: data.sender || '',
    senderName: data.senderName || '',
  };
}

function selectContact(id) {
  selectedContactId.value = id;
}

// Sincroniza contato do cliente a partir das mensagens de uma sala
function syncContactFromDocs(roomId, docs) {
  const clientDoc = docs.find(d => d.data().sender === 'cliente');
  if (!clientDoc) return;

  const data = clientDoc.data();
  const clientName = data.senderName || 'Cliente';
  const lastText   = docs.length ? (docs[docs.length - 1].data().text || '') : '';
  const roomIdNum  = Number(roomId);

  const existing = contacts.value.find(c => c.id === roomIdNum);
  if (existing) {
    if (data.senderName) existing.name = data.senderName;
    existing.lastMessage = lastText;
  } else {
    contacts.value.push({
      id: roomIdNum,
      name: clientName,
      avatar: DEFAULT_AVATAR,
      lastMessage: lastText,
    });
    if (!selectedContactId.value) selectedContactId.value = roomIdNum;
  }
}

// Listener principal — mensagens exibidas no chat
function subscribeToMessages(roomId) {
  if (unsubscribeMessages) unsubscribeMessages();
  chatMessages.value = [];
  if (!roomId) return;

  const q = query(collection(db, 'rooms', String(roomId), 'messages'), orderBy('createdAt'));
  unsubscribeMessages = onSnapshot(q,
    snapshot => { chatMessages.value = snapshot.docs.map(mapDocToMessage); },
    err => console.error('Erro Firestore:', err)
  );
}

// Listeners em background em TODAS as salas rastreadas — detecta novos contatos em tempo real
function watchAllTrackedRooms() {
  trackedRooms.forEach(roomId => {
    const q = query(collection(db, 'rooms', String(roomId), 'messages'), orderBy('createdAt'));
    const unsub = onSnapshot(q, snapshot => {
      syncContactFromDocs(roomId, snapshot.docs);
    });
    bgUnsubscribers.push(unsub);
  });
}

// Listener no documento da sala — fonte primária do nome do cliente
function watchRoomDoc(roomId) {
  if (!roomId) return () => {};
  return onSnapshot(doc(db, 'rooms', String(roomId)), snapshot => {
    const data = snapshot.data() || {};
    if (!data.clientName) return;
    const roomIdNum = Number(roomId);
    const contact = contacts.value.find(c => c.id === roomIdNum);
    if (contact) contact.name = data.clientName;
    else contacts.value.push({ id: roomIdNum, name: data.clientName, avatar: DEFAULT_AVATAR, lastMessage: '' });
  });
}

watch(selectedContactId, newId => subscribeToMessages(newId), { immediate: true });

watchAllTrackedRooms();

// Observa documento da sala para todos os contatos rastreados
const roomsToWatch = [...new Set([...trackedRooms, routeContactId].filter(Boolean))];
roomsToWatch.forEach(roomId => bgUnsubscribers.push(watchRoomDoc(roomId)));

async function sendMessage() {
  const text = newMessage.value.trim();
  if (!text || !selectedContactId.value) return;
  try {
    await addDoc(collection(db, 'rooms', String(selectedContactId.value), 'messages'), {
      sender: currentUser,
      text,
      createdAt: serverTimestamp(),
    });
    newMessage.value = '';
  } catch (err) {
    console.error('Erro ao enviar mensagem:', err);
  }
}

onBeforeUnmount(() => {
  if (typeof unsubscribeMessages === 'function') unsubscribeMessages();
  bgUnsubscribers.forEach(u => u());
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