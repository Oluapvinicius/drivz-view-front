<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginApi } from '@/requests/login';
import { userStorage } from '../utils/userStorage';




const tituloLogin = ref('Entrar')
const esqueceu = ref('Esqueceu a senha?')
const email = ref('')
const senha = ref('')
const senhaVisivel = ref(false)
const emailErro = ref('')
const senhaErro = ref('')
const loginErro = ref('')

const button = ref()

const router = useRouter();

const irParaHome = (respostaCompleta) => {
  const usuario = respostaCompleta.user || respostaCompleta;
  const identificador = usuario.id || usuario.id_cliente || usuario.id_prestador || usuario.clienteId || usuario.prestadorId;
  const tipoUsuario = String(usuario.tipoUsuario || usuario.tipo_usuario || usuario.tipo || usuario.role || '');

  if (!identificador) {
    loginErro.value = 'Erro: não foi possível identificar o usuário na resposta.';
    return;
  }

  userStorage.setSession(identificador, usuario, tipoUsuario);

  // Salva o nome do cliente em chave simples para uso no chat
  const dadosUsuario = usuario?.response || usuario;
  const nomeEncontrado = dadosUsuario?.nome || dadosUsuario?.nome_cliente || dadosUsuario?.name || '';
  const tipo = tipoUsuario.toLowerCase();
  if (nomeEncontrado && (tipo === 'cliente' || tipo === 'client')) {
    localStorage.setItem('clienteNome', nomeEncontrado);
  }

  if (userStorage.getUserData().type === 'prestador') {
    router.push({ name: 'home-prestador' });
  } else {
    router.push({ name: 'home-cliente' });
  }
};

const validarCampos = async () => {
  emailErro.value = '';
  senhaErro.value = '';
  loginErro.value = '';

  if (!email.value) {
    emailErro.value = 'Por favor, preencha o campo de email.';
    return;
  }
  const emailPattern = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  if (!emailPattern.test(email.value)) {
    emailErro.value = 'Campo de email deve conter um email válido.';
    return;
  }

  if (!senha.value) {
    senhaErro.value = 'Por favor, preencha o campo de senha.';
    return;
  }


  try {
    const resposta = await loginApi(email.value, senha.value);
    console.log(resposta)

    irParaHome(resposta);

  } catch (e) {
    loginErro.value = e.message || 'Erro de conexão com o servidor.';
  }
}




</script>

<template>
  <transition name="slide-fade" mode="out-in">
    <div class="conteinerAll">

      <div class="containerLeft">
        <img src="../assets/logo-sem-texto.png" alt="" class="left-bg-img" />
        <div class="left-content">
          <span class="left-subtitle">A EXCELÊNCIA EM MOVIMENTO</span>
          <h1 class="left-headline">Drive<span class="red">Z:</span><br>A sua<br>jornada<br>começa<br>aqui<span class="red">.</span></h1>
        </div>
      </div>

      <div class="containerRight">

        <div class="box_place">

          <div class="logo">
            <h1 class="titulo_login"> {{ tituloLogin }} </h1>
          </div>



          <div class="campos">
            <div class="campo-email">
              <input type="email" id="Email" v-model="email" placeholder="Email">
              <span v-if="emailErro" class="erro-campo erro-animada">{{ emailErro }}</span>
            </div>
            <div class="campo-senha" style="position: relative;">
              <input :type="senhaVisivel ? 'text' : 'password'" id="Senha" v-model="senha" placeholder="Senha"
                minlength="8">
              <button type="button" @click="senhaVisivel = !senhaVisivel"
                style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer;">
                <span v-if="senhaVisivel"><img src="../assets/view.png" alt="" class="hide-icon"></span>
                <span v-else><img src="../assets/hide.png" class="hide-icon" alt=""></span>
              </button>
              <span v-if="senhaErro" class="erro-campo erro-animada">{{ senhaErro }}</span>
            </div>
            <span v-if="loginErro" class="erro-campo erro-animada">{{ loginErro }}</span>
          </div>

          <h1 class="esqueceu-senha">{{ esqueceu }}</h1>

          <button @click="validarCampos" class="button-entrar">
            Entrar
          </button>

          <h1 class="cadastroH1">Ainda não tem conta?

            <router-link to="/cadastro" class="link-destaque">Cadastre-se</router-link>

          </h1>


        </div>
      </div>
    </div>
  </transition>
</template>



<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-to {
  transform: translateX(20px);
  opacity: 0;
}

:root {
  font-family: 'Roboto', sans-serif;
}

:global(html),
:global(body) {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #8d0f11;
}

* {
  box-sizing: border-box;
}

.conteinerAll {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: #ffffff;
}

.containerLeft {
  position: relative;
  width: 45%;
  height: 100%;
  flex-shrink: 0;
  background: #0d0d0d;
  overflow: hidden;
}

.left-bg-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.left-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  padding: clamp(60px, 10vh, 120px) clamp(24px, 3.5vw, 48px) 0;
  gap: clamp(8px, 1.2vh, 16px);
}

.left-subtitle {
  color: #555555;
  font-family: 'Inter', sans-serif;
  font-size: clamp(9px, 0.85vw, 12px);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  font-weight: 500;
}

.left-headline {
  color: #111111;
  font-family: 'Inter', sans-serif;
  font-size: clamp(2rem, 4vw, 4.8rem);
  line-height: 1.05;
  font-weight: 800;
  margin: 0;
}

.left-headline .red {
  color: #b5080d;
}

.containerRight {
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  background: #ffffff;
}

/* --- Telas médias --- */
@media (max-width: 1200px) {
  .containerLeft { width: 42%; }
}

@media (max-width: 1024px) {
  .containerLeft { width: 38%; }
  .box_place { padding: 40px 32px; gap: 22px; }
  .titulo_login { font-size: 34px; }
}

/* --- Tablet / empilha verticalmente --- */
@media (max-width: 768px) {
  :global(html),
  :global(body) { overflow-y: auto; height: auto; }

  .conteinerAll {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }

  .containerLeft {
    width: 100%;
    height: 40vh;
    flex-shrink: 0;
  }

  .left-content {
    padding: clamp(20px, 5vw, 36px);
    gap: 10px;
  }

  .left-headline { font-size: clamp(1.8rem, 6vw, 3rem); }

  .containerRight {
    flex: 1;
    height: auto;
    overflow-y: visible;
  }

  .box_place {
    max-width: 100%;
    padding: 36px 28px;
    gap: 20px;
  }

  .titulo_login { font-size: 32px; }
  .esqueceu-senha { font-size: 17px; }
  .cadastroH1 { font-size: 18px; }
}

/* --- Mobile pequeno --- */
@media (max-width: 480px) {
  .containerLeft { height: 34vh; }

  .left-content { padding: 18px 20px 0; gap: 8px; }
  .left-headline { font-size: clamp(1.8rem, 7vw, 2.4rem); }

  .box_place { padding: 24px 16px; gap: 16px; }
  .titulo_login { font-size: 26px; }
  .campos input { height: 54px; font-size: 15px; }
  .button-entrar { height: 52px; font-size: 16px; }
  .esqueceu-senha { font-size: 15px; }
  .cadastroH1 { font-size: 16px; }
}

/* --- Telas grandes (2K/4K) --- */
@media (min-width: 2560px) {
  .containerLeft { width: 45%; }

  .left-content {
    padding: clamp(100px, 12vh, 160px) clamp(48px, 4vw, 80px) 0;
    gap: 24px;
  }

  .left-subtitle { font-size: 15px; }
  .left-headline { font-size: clamp(4rem, 5vw, 7rem); }

  .box_place { max-width: 800px; padding: 80px 64px; gap: 36px; }
  .titulo_login { font-size: 52px; }
  .campos input { height: 88px; padding: 0 28px; font-size: 20px; }
  .button-entrar { height: 80px; font-size: 24px; }
  .esqueceu-senha { font-size: 24px; }
  .cadastroH1 { font-size: 26px; }
  .link-destaque { font-size: 26px; }
}

.box_place {
  width: 100%;
  max-width: 620px;
  padding: 56px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 28px;
  background: #ffffff;
}

.titulo_login {
  font-size: 40px;
  text-align: center;
  color: #111111;
}

.campos {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.campos input {
  width: 100%;
  height: 68px;
  padding: 0 20px;
  border: 1px solid #dfe7f2;
  border-radius: 6px;
  background-color: #eef4fb;
  font-size: 17px;
  color: #111111;
}

.button-entrar {
  width: 100%;
  height: 64px;
  border: none;

  background: #b5080d;
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
}



.link-destaque {
  color: #b5080d;
  text-decoration: none;
  font-weight: 700;
  margin-left: 6px;
  cursor: pointer;
}

.esqueceu-senha {
  text-align: right;
  color: #b5080d;
  font-size: 20px;
  cursor: pointer;
}

.cadastroH1 {
  color: #111111;
  font-size: 21px;

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
  box-shadow: 0 2px 8px 0 rgba(211, 47, 47, 0.08);
  transition: all 0.3s;
}

.erro-animada {
  animation: shake 0.3s;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }

  20% {
    transform: translateX(-5px);
  }

  40% {
    transform: translateX(5px);
  }

  60% {
    transform: translateX(-5px);
  }

  80% {
    transform: translateX(5px);
  }

  100% {
    transform: translateX(0);
  }
}

.hide-icon {
  width: 24px;
  height: 24px;
}
</style>