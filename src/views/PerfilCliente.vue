
<template>
  <section class="profile-screen">
    <div class="profile-screen__topbar">
      <button class="profile-screen__back" @click="goBack">
        <img src="../assets/arrow.png" alt="Voltar" class="profile-screen__back-icon" />
      </button>
      <span class="profile-screen__title">Meu Perfil</span>
    </div>

    <div class="profile-screen__content">
      <div class="profile-screen__panel profile-screen__panel--left">
        <div class="profile-screen__photo-card">
          <div class="profile-screen__image-wrap">
            <img 
              src="../assets/profile.svg" 
              alt="Perfil" 
              class="profile-screen__avatar" 
            />
          </div>
          <div class="profile-screen__name-block">
            <div class="profile-screen__rating-stars">
              <span class="star-icon fill">★</span>
              <span class="star-icon fill">★</span>
              <span class="star-icon fill">★</span>
              <span class="star-icon fill">★</span>
              <span class="star-icon">☆</span>
            </div>
            <h3>Nome do Usuário</h3>
          </div>
        </div>
      </div>

      <div class="profile-screen__panel profile-screen__panel--right">
        <div class="profile-screen__section-header">
          <h4>Dados Pessoais</h4>
        </div>

        <div class="profile-screen__form">
          <div class="profile-screen__field profile-screen__field--full">
            <input type="text" placeholder="Nome do usuario" />
          </div>
          <div class="profile-screen__field profile-screen__field--half">
            <input type="text" placeholder="CPF/CNPJ" />
          </div>
          <div class="profile-screen__field profile-screen__field--half">
            <input type="text" placeholder="Telefone" />
          </div>
          <div class="profile-screen__field profile-screen__field--full">
            <input type="email" placeholder="Email" />
          </div>
        </div>

        <button 
          class="profile-screen__button profile-screen__button--outline" 
          @click="togglePassword"
        >
          {{ showPassword ? 'Cancelar Alteração' : 'Alterar Senha' }}
        </button>

        <div v-if="showPassword" class="profile-screen__password-card">
          <div class="profile-screen__password-title">Alterar a Senha de Usuario</div>
          <div class="profile-screen__password-form">
            <div class="profile-screen__field">
              <input type="password" placeholder="Senha Atual" />
            </div>
            <div class="profile-screen__field">
              <input type="password" placeholder="Nova Senha" />
            </div>
            <div class="profile-screen__password-warning">Senha fraca</div>
            <div class="profile-screen__field">
              <input type="password" placeholder="Confirme a Nova Senha" />
            </div>
          </div>
          <button class="profile-screen__button profile-screen__button--primary">
            Alterar Senha
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import SidebarCliente from '../components/SidebarCliente.vue';
import { useRouter } from 'vue-router';

const emit = defineEmits(['back']);
const router = useRouter();

const goBack = () => router.back();

const showPassword = ref(true);
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style scoped>
.profile-screen *,
.profile-screen *::before,
.profile-screen *::after {
  box-sizing: border-box;
}

.profile-screen {
  min-height: 100vh;
  width: 100%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 0;
  font-family: Arial, sans-serif;
}

.profile-screen__topbar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: #d62828;
  color: white;
  padding: 18px 32px 18px 80px;
}

.profile-screen__back {
  position: absolute;
  left: 32px;
  background: transparent;
  border: none;
  padding: 0;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.profile-screen__back-icon {
  width: 24px;
  height: 24px;
  filter: brightness(0) invert(1);
}

.profile-screen__title {
  font-size: 20px;
  font-weight: 700;
}

.profile-screen__content {
  flex: 1;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 48px;
  padding: 40px 64px 24px;
}

.profile-screen__panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-screen__panel--left {
  align-items: center;
  border-right: 2px solid #d62828;
  padding-right: 48px;
}

.profile-screen__panel--right {
  align-items: flex-start;
}

.profile-screen__photo-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.profile-screen__image-wrap {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: #f0f0f0; 
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.profile-screen__avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-screen__name-block h3 {
  margin: 8px 0 0;
  font-size: 24px;
  color: #111111;
  text-align: center;
}

.profile-screen__rating-stars {
  display: flex;
  justify-content: center;
  gap: 4px;
  color: #ffcc00;
}

.star-icon {
  width: 20px;
  height: 20px;
}

.star-icon.fill {
  fill: #ffcc00;
}

.profile-screen__section-header h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.profile-screen__form {
  display: grid;
  grid-template-columns: 1fr 1fr; 
  gap: 16px;
  width: 100%;
  max-width: 580px;
}

.profile-screen__field {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.profile-screen__field--full {
  grid-column: span 2;
}

.profile-screen__field input {
  width: 100%;
  height: 44px;
  border-radius: 8px;
  border: none;
  background: #E8F0FE;
  padding: 0 16px;
  color: #555;
  font-size: 14px;
  outline: none;
}

.profile-screen__field input::placeholder {
  color: #7a7a7a;
}

.profile-screen__button {
  width: fit-content;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
}

.profile-screen__button:hover {
  opacity: 0.8;
}

.profile-screen__button--outline {
  background: white;
  color: #d62828;
  border: 1px solid #7a7a7a;
}

.profile-screen__button--primary {
  background: #d62828;
  color: white;
  align-self: flex-end; 
  padding: 10px 24px;
  font-size: 14px;
  border-radius: 8px;
}

.profile-screen__password-card {
  background: white;
  border: 1px solid #d8d8d8;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
  width: 100%;
  max-width: 580px;
}

.profile-screen__password-title {
  font-size: 16px;
  font-weight: 700;
  color: #1b263b;
}

.profile-screen__password-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.profile-screen__password-warning {
  color: #d62828;
  font-size: 12px;
  font-weight: 700;
  margin-left: 4px;
}

@media (max-width: 900px) {
  .profile-screen__content {
    grid-template-columns: 1fr;
    padding: 24px;
  }
  .profile-screen__panel--left {
    border-right: none;
    border-bottom: 2px solid #d62828;
    padding-right: 0;
    padding-bottom: 32px;
  }
}

@media (max-width: 600px) {
  .profile-screen__form {
    grid-template-columns: 1fr;
  }
  .profile-screen__field--full,
  .profile-screen__field--half {
    grid-column: span 1;
  }
  .profile-screen__topbar {
    padding-left: 64px;
  }
}
@media (min-width: 1800px) {
  .profile-screen__content {
    grid-template-columns: 420px 1fr;
    gap: 80px;
    padding: 80px 180px 48px;
  }
  .profile-screen__panel--left {
    padding-right: 80px;
  }
  .profile-screen__image-wrap {
    width: 300px;
    height: 300px;
  }
  .profile-screen__avatar {
    width: 100%;
    height: 100%;
  }
  .profile-screen__name-block h3 {
    font-size: 38px;
  }
  .profile-screen__rating-stars .star-icon {
    width: 32px;
    height: 32px;
    font-size: 32px;
  }
  .profile-screen__form {
    max-width: 900px;
    gap: 32px;
  }
  .profile-screen__field input,
  .profile-screen__field select {
    height: 60px;
    font-size: 22px;
    padding: 0 28px;
  }
  .profile-screen__button {
    font-size: 22px;
    padding: 16px 32px;
  }
  .profile-screen__section-header h4 {
    font-size: 28px;
  }
}

@media (min-width: 2560px) {
  .profile-screen__content {
    grid-template-columns: 350px 1fr;
    gap: 42px;
    padding: 28px 168px 45px;
  }
  .profile-screen__panel--left {
    padding-right: 84px;
  }
  .profile-screen__image-wrap {
    width: 294px;
    height: 294px;
  }
  .profile-screen__name-block h3 {
    font-size: 38px;
  }
  .profile-screen__rating-stars .star-icon {
    width: 34px;
    height: 34px;
    font-size: 34px;
  }
  .profile-screen__form {
    max-width: 980px;
    gap: 34px;
  }
  .profile-screen__field input,
  .profile-screen__field select {
    height: 63px;
    font-size: 22px;
    padding: 0 34px;
  }
  .profile-screen__button {
    font-size: 22px;
    padding: 17px 34px;
  }
  .profile-screen__section-header h4 {
    font-size: 27px;
  }
  .profile-screen__topbar {
    padding: 28px 22px 22px 56px;
  }
  .profile-screen__title {
    font-size: 22px;
    font-weight: 700;
  }
  .profile-screen__back {
    height: 22px;
    width: 22px;
  }
}
</style>