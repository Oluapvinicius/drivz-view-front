<script setup>
import { inserirCliente } from '@/requests/cliente'
import { inserirPrestador } from '@/requests/prestador'
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();

const imagemRetangulo = new URL('../assets/Rectangle 31.svg ', import.meta.url)
const imagemVoltar = new URL('../assets/arrow.png', import.meta.url)
const tipoUsuarioSelecionado = ref('cliente')
const nome = ref('')
const email = ref('')
const senha = ref('')
const confirmaSenha = ref('')
const senhaVisivel = ref(false)
const confirmaSenhaVisivel = ref(false)
const emailErro = ref('')
const senhaErro = ref('')
const confirmaSenhaErro = ref('')
const nomeErro = ref('')
const apiErro = ref('')

const selecionarTipoUsuario = (tipo) => {
  tipoUsuarioSelecionado.value = tipo
}

const irParaLogin = () => {
  router.push({ name: 'login' });
};

const selecionarCliente = () => selecionarTipoUsuario('cliente')
const selecionarPrestador = () => selecionarTipoUsuario('prestador')




const enviarCadastro = async () => {
  apiErro.value = '';
  try {
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

    if (!validarCampos()) {
      console.log('Dados inválidos. Verifique as informações inseridas.')
      return;
    }

    let resultado;

    if (tipoUsuarioSelecionado.value === 'prestador') {
      try {
        resultado = await inserirPrestador(usuario)
      } catch (err) {
        console.error('Erro ao cadastrar prestador:', err);
        apiErro.value = err && (err.body?.message || err.message) ? (err.body?.message || err.message) : 'Erro ao conectar com o servidor.';
        return;
      }
    } else {
      try {
        resultado = await inserirCliente(usuario)
      } catch (err) {
        console.error('Erro ao cadastrar cliente:', err);
        apiErro.value = err && (err.body?.message || err.message) ? (err.body?.message || err.message) : 'Erro ao conectar com o servidor.';
        return;
      }
    }

    console.log(resultado)

    if (resultado && resultado.status_code === 201) {
      irParaLogin()
    }
  } catch (err) {
    console.error('Erro inesperado ao enviar cadastro:', err);
    apiErro.value = err && (err.body?.message || err.message) ? (err.body?.message || err.message) : 'Erro inesperado. Tente novamente mais tarde.';
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
            <div v-if="apiErro" class="api-error" style="color: #b00020; margin-bottom: 12px; font-weight: 700;">
              {{ apiErro }}
            </div>
            <div>
              <input type="text" placeholder="Digite seu nome completo" v-model="nome" />
              <span v-if="nomeErro" class="erro-campo erro-animada">{{ nomeErro }}</span>
            </div>
            <div>
              <input type="email" placeholder="exemplo@gmail.com" v-model="email" />
              <span v-if="emailErro" class="erro-campo erro-animada">{{ emailErro }}</span>
            </div>
            <div style="position: relative;">
              <input :type="senhaVisivel ? 'text' : 'password'" placeholder="Senha" v-model="senha" />
              <button type="button" @click="senhaVisivel = !senhaVisivel" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer;">
                <span v-if="senhaVisivel"><img src="../assets/view.png" alt=""class="hide-icon"></span>
                <span v-else><img src="../assets/hide.png" alt=""class="hide-icon"></span>
              </button>
              <span v-if="senhaErro" class="erro-campo erro-animada">{{ senhaErro }}</span>
            </div>
            <div style="position: relative;">
              <input :type="confirmaSenhaVisivel ? 'text' : 'password'" placeholder="Confirme a Senha" v-model="confirmaSenha" />
              <button type="button" @click="confirmaSenhaVisivel = !confirmaSenhaVisivel" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer;">
              
              </button>
              <span v-if="confirmaSenhaErro" class="erro-campo erro-animada">{{ confirmaSenhaErro }}</span>
            </div>
          </div>

          <button class="cadastro-button" type="button" @click="enviarCadastro">
            Entrar
          </button>
        </div>
      </section>

      <section class="cadastro-panel cadastro-panel--hero">
        <img src="../assets/logo-sem-texto.png" alt="" class="hero-bg-img" />
        <div class="hero-content">
          <span class="hero-subtitle">A EXCELÊNCIA EM MOVIMENTO</span>
          <h1 class="hero-headline">Drive<span class="red">Z:</span><br>A sua<br>jornada<br>começa<br>aqui<span class="red">.</span></h1>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
:root {
  font-family: 'Roboto', sans-serif;
}

:global(html),
:global(body) {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #0d2746;
}

* {
  box-sizing: border-box;
}

.cadastro-page {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  margin: 0;
  padding: 0;
  background: #0d2746;
}

.cadastro-card {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
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
  height: 70px;
  border: none;

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
  background: #0d0d0d;
  overflow: hidden;
}

.hero-bg-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
  padding: clamp(60px, 10vh, 120px) clamp(24px, 3.5vw, 48px) 0;
  gap: clamp(8px, 1.2vh, 16px);
}

.hero-subtitle {
  color: #555555;
  font-family: 'Inter', sans-serif;
  font-size: clamp(9px, 0.85vw, 12px);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  font-weight: 500;
}

.hero-headline {
  color: #111111;
  font-family: 'Inter', sans-serif;
  font-size: clamp(2rem, 4vw, 4.8rem);
  line-height: 1.05;
  font-weight: 800;
  margin: 0;
}

.hero-headline .red {
  color: #b5080d;
}

/* --- Telas médias --- */
@media (max-width: 1200px) {
  .cadastro-card { grid-template-columns: 1.3fr 1fr; }
}

@media (max-width: 1024px) {
  .cadastro-card { grid-template-columns: 1.5fr 1fr; }
  .cadastro-panel--form { padding: 64px 40px 40px; }
  .cadastro-title { font-size: 30px; margin-bottom: 28px; }
  .cadastro-switch { height: 80px; margin-bottom: 28px; }
  .cadastro-fields { gap: 16px; margin-bottom: 28px; }
  .cadastro-fields input { height: 58px; }
  .cadastro-button { height: 58px; font-size: 17px; }
}

/* --- Tablet / empilha verticalmente --- */
@media (max-width: 768px) {
  :global(html),
  :global(body) { overflow-y: auto; height: auto; }

  .cadastro-page { height: auto; min-height: 100vh; overflow: visible; }

  .cadastro-card {
    grid-template-columns: 1fr;
    grid-template-rows: 38vh auto;
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }

  .cadastro-panel--hero { order: -1; min-height: 38vh; }

  .hero-content { padding: clamp(20px, 5vw, 36px); gap: 10px; }
  .hero-headline { font-size: clamp(1.8rem, 6vw, 3rem); }

  .cadastro-panel--form {
    order: 1;
    padding: 52px 28px 40px;
    overflow-y: auto;
  }

  .cadastro-box { max-width: 100%; }
  .cadastro-title { font-size: 28px; margin-bottom: 24px; }
  .cadastro-switch { height: 80px; margin-bottom: 24px; }
  .cadastro-fields { gap: 14px; margin-bottom: 24px; }
  .cadastro-fields input { height: 58px; }
  .cadastro-button { height: 56px; font-size: 17px; }
}

/* --- Mobile pequeno --- */
@media (max-width: 480px) {
  .cadastro-card { grid-template-rows: 32vh auto; }
  .cadastro-panel--hero { min-height: 32vh; }
  .hero-content { padding: 18px 20px 0; gap: 8px; }
  .hero-headline { font-size: clamp(1.6rem, 7vw, 2.4rem); }
  .cadastro-panel--form { padding: 44px 16px 32px; }
  .cadastro-title { font-size: 24px; }
  .cadastro-switch { height: 72px; border-radius: 20px; margin-bottom: 20px; }
  .cadastro-switch__label { font-size: 15px; }
  .cadastro-switch__sublabel { font-size: 12px; }
  .cadastro-fields input { height: 52px; font-size: 15px; }
  .cadastro-button { height: 52px; font-size: 16px; }
}

/* --- Telas grandes (2K/4K) --- */
@media (min-width: 2560px) {
  .hero-content { padding: clamp(100px, 12vh, 160px) clamp(48px, 4vw, 80px) 0; gap: 24px; }
  .hero-subtitle { font-size: 15px; }
  .hero-headline { font-size: clamp(4rem, 5vw, 7rem); }
  .cadastro-panel--form { padding: 120px 96px 80px; }
  .cadastro-box { max-width: 640px; }
  .cadastro-title { font-size: 52px; margin-bottom: 56px; }
  .cadastro-switch { height: 130px; margin-bottom: 56px; }
  .cadastro-switch__label { font-size: 24px; }
  .cadastro-switch__sublabel { font-size: 18px; }
  .cadastro-fields { gap: 32px; margin-bottom: 56px; }
  .cadastro-fields input { height: 96px; font-size: 22px; padding: 0 28px; }
  .cadastro-button { height: 90px; font-size: 24px; }
}

.erro-campo {
  color: #d32f2f;
  background: #ffeaea;
  border: 1px solid #ffbdbd;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 1em;
  margin-top: 4px;
  margin-bottom: 2px;
  display: block;
  font-weight: 500;
  box-shadow: 0 2px 8px 0 rgba(211,47,47,0.08);
  transition: all 0.3s;
}

.erro-animada {
  animation: shake 0.3s;
}

@keyframes shake {
  0% { transform: translateX(0); }
  20% { transform: translateX(-5px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
  100% { transform: translateX(0); }
}

.hide-icon {
  width: 24px;
  height: 24px;
}
</style>