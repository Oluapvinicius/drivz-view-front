<script setup>
import { inserirUsuarios } from '@/requests/cliente'
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();

const imagemRetangulo = new URL('../assets/Rectangle 31.svg', import.meta.url)
const imagemVoltar = new URL('../assets/arrow.png', import.meta.url)
const tipoUsuarioSelecionado = ref('cliente')
const nome = ref('')
const email = ref('')
const senha = ref('')
const confirmaSenha = ref('')
const emailErro = ref('')
const senhaErro = ref('')
const confirmaSenhaErro = ref('')
const nomeErro = ref('')

const selecionarTipoUsuario = (tipo) => {
  tipoUsuarioSelecionado.value = tipo
}

const irParaLogin = () => {
  router.push('/');
};

const selecionarCliente = () => selecionarTipoUsuario('cliente')
const selecionarPrestador = () => selecionarTipoUsuario('prestador')




const enviarCadastro = async () => {
  const usuario = {
    nome: nome.value,
    email: email.value,
    senha: senha.value,
    confirmaSenha: confirmaSenha.value,
    tipoUsuario: tipoUsuarioSelecionado.value,
    telefone: null,
    cpf: null,
    cnpj: null,
    img_perfil: null
  }

  if(validarCampos()) {

    const resultado = await inserirUsuarios(usuario)
    console.log(resultado)

    if(resultado.status_code === 201){
      irParaLogin()
    }

  } else {
    console.log('Dados inválidos. Verifique as informações inseridas.')
  }
}


const validarCampos = () => {
  emailErro.value = '';
  senhaErro.value = '';
  confirmaSenhaErro.value = '';
  nomeErro.value = '';

  if(!nome.value) {
    nomeErro.value = 'Por favor, preencha o campo de nome.';
    return false;
  }

  if (!email.value) {
    emailErro.value = 'Por favor, preencha o campo de email.';
    return false;
  }
  const emailPattern =  /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  if (!emailPattern.test(email.value)) {
    emailErro.value = 'Campo de email deve conter um email válido.';
    return false;
  }

  
  if (!senha.value) {
    senhaErro.value = 'Por favor, preencha o campo de senha.';
    return false;
  }

  if(!confirmaSenha.value || confirmaSenha.value !== senha.value) {
    confirmaSenhaErro.value = 'Por favor, preencha o campo de confirmação de senha.';
    return false;
  }

  return true;
}

senha.onChange = () => {
  if (confirmaSenha.value && confirmaSenha.value !== senha.value) {
    confirmaSenhaErro.value = 'As senhas não coincidem.';
  } else {
    confirmaSenhaErro.value = '';
  }
}

confirmaSenha.onChange = () => {
  if (confirmaSenha.value && confirmaSenha.value !== senha.value) {
    confirmaSenhaErro.value = 'As senhas não coincidem.';
  } else {
    confirmaSenhaErro.value = '';
  }
}

</script>

<template>
  <div class="cadastro-page">
    <div class="cadastro-card">
      <section class="cadastro-panel cadastro-panel--form">
        <router-link to="/" class="back-button">
          <img :src="imagemVoltar" alt="Voltar para login" />
        </router-link>
        <div class="cadastro-box">
          <h1 class="cadastro-title">Cadastro</h1>

          <div class="cadastro-switch" role="tablist">
            <button
              type="button"
              class="cadastro-switch__item"
              :class="{ active: tipoUsuarioSelecionado === 'cliente' }"
              @click="selecionarCliente"
            >
              <span class="cadastro-switch__label">Sou Cliente</span>
              <span class="cadastro-switch__sublabel">Pessoas que necessitam ajuda</span>
            </button>
            <button
              type="button"
              class="cadastro-switch__item"
              :class="{ active: tipoUsuarioSelecionado === 'prestador' }"
              @click="selecionarPrestador"
            >
              <span class="cadastro-switch__label">Sou Prestador</span>
              <span class="cadastro-switch__sublabel">Prestadores de serviço</span>
            </button>
          </div>

          <div class="cadastro-fields">
            <input type="text" placeholder="Digite seu nome completo" v-model="nome" />
            <input type="email" placeholder="exemplo@gmail.com" v-model="email" />
            <input type="password" placeholder="Senha" v-model="senha" />
            <input type="password" placeholder="Confirme a Senha" v-model="confirmaSenha" />
          </div>

          <button class="cadastro-button" type="button" @click="enviarCadastro">
            Entrar
          </button>
        </div>
      </section>

      <section class="cadastro-panel cadastro-panel--hero">
        <div class="hero-bg"></div>
        <img :src="imagemRetangulo" alt="Imagem de fundo" class="hero-image" />
      </section>
    </div>
  </div>
</template>

<style scoped>
:root {
  font-family: 'Roboto', sans-serif;
}

:global(body) {
  margin: 0;
  min-height: 100%;
  background: #e9edf4;
}

* {
  box-sizing: border-box;
}

.cadastro-page {
  min-height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-columns: 1fr;
  margin: 0;
  padding: 0;
  background: #0d2746;
}

.cadastro-card {
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  background: #ffffff;
}

.cadastro-panel {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.cadastro-panel--form {
  position: relative;
  background: #ffffff;
  padding: 96px 64px 64px;
}

.cadastro-box {
  width: 100%;
  max-width: 480px;
}

.cadastro-title {
  font-size: 36px;
  margin: 0 0 42px;
  text-align: center;
  color: #111111;
}

.back-button {
  position: absolute;
  top: 28px;
  left: 28px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  overflow: hidden;
  text-decoration: none;
}

    .back-button img {
    width: 100%;
  height: 100%;
  object-fit: contain;
}

.cadastro-switch {
  width: 100%;
  height: 98px;
  display: flex;
  border: 1px solid #d90813;
  border-radius: 32px;
  overflow: hidden;
  margin-bottom: 42px;
}

.cadastro-switch__item {
  flex: 1;
  border: none;
  background: #ffffff;
  color: #0d2746;
  min-height: 108px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.cadastro-switch__item:hover {
  background: #f8f8fb;
}

.cadastro-switch__item.active {
  background: #d90813;
  color: #ffffff;
}

.cadastro-switch__label {
  display: block;
  font-weight: 700;
  font-size: 18px;
  line-height: 1.3;
}

.cadastro-switch__sublabel {
  display: block;
  margin-top: 6px;
  font-size: 14px;
  line-height: 1.4;
  color: inherit;
  opacity: 0.82;
}

.cadastro-fields {
  display: grid;
  gap: 24px;
  margin-bottom: 44px;
}

.cadastro-fields input {
  width: 100%;
  height: 72px;
  padding: 0 20px;
  border: 1px solid #dfe7f2;
  border-radius: 12px;
  background: #eef4fb;
  font-size: 17px;
  color: #111111;
}

.cadastro-fields input::placeholder {
  color: #9aa7b9;
}

.cadastro-button {
  width: 100%;
  height: 72px;
  border: none;
  border-radius: 14px;
  background: #b5080d;
  color: #ffffff;
  font-size: 19px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease;
}

.cadastro-button:hover {
  background: #d00810;
}

.cadastro-panel--hero {
  position: relative;
  background: #0d2746;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: #1B2D45;
}

.hero-image {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-shape {
  position: absolute;
  width: 180%;
  height: 180%;
  pointer-events: none;
}

.hero-shape--top {
  top: -60%;
  left: -40%;
  background: linear-gradient(140deg, rgba(248, 24, 31, 0.9), rgba(248, 24, 31, 0.1));
  transform: rotate(25deg);
}

.hero-shape--middle {
  top: 12%;
  right: -30%;
  width: 120%;
  height: 54%;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.05), transparent 70%);
  transform: rotate(18deg);
}

.hero-shape--bottom {
  bottom: -50%;
  left: -10%;
  width: 140%;
  height: 70%;
  background: linear-gradient(220deg, rgba(216, 8, 13, 0.95), rgba(216, 8, 13, 0.12));
  transform: rotate(-20deg);
}

.hero-logo {
  position: relative;
  z-index: 1;
  font-size: clamp(5rem, 8vw, 8rem);
  font-weight: 800;
  letter-spacing: -0.08em;
  color: #ff2f33;
  text-align: center;
}

.hero-logo strong {
  color: #ffffff;
}

@media (max-width: 1120px) {
  .cadastro-card {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .cadastro-panel--form {
    padding: 48px 32px;
  }

  .cadastro-panel--hero {
    min-height: 420px;
  }
}

@media (max-width: 720px) {
  .cadastro-page {
    padding: 16px;
  }

  .cadastro-title {
    font-size: 32px;
  }

  .cadastro-switch {
    grid-template-columns: 1fr;
  }

  .cadastro-switch__item {
    min-height: auto;
  }

  .cadastro-fields input {
    height: 58px;
  }

  .cadastro-button {
    height: 58px;
  }
}
</style>

@media (min-width: 2560px) {
  .cadastro-panel--form {
    padding: 128px 96px 96px;
  }

  .cadastro-box {
    max-width: 640px;
  }

  .cadastro-title {
    font-size: 48px;
    margin-bottom: 56px;
  }

  .back-button {
    top: 36px;
    left: 36px;
    width: 64px;
    height: 64px;
  }

  .cadastro-switch {
    height: 128px;
    margin-bottom: 56px;
  }

  .cadastro-switch__item {
    min-height: 140px;
  }

  .cadastro-switch__label {
    font-size: 22px;
  }

  .cadastro-switch__sublabel {
    font-size: 16px;
    margin-top: 8px;
  }

  .cadastro-fields {
    gap: 32px;
    margin-bottom: 56px;
  }

  .cadastro-fields input {
    height: 96px;
    padding: 0 28px;
    font-size: 20px;
  }

  .cadastro-button {
    height: 96px;
    font-size: 24px;
  }
}
