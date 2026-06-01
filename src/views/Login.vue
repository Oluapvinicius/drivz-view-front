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
  const tipoUsuario =
    String(usuario.tipoUsuario || usuario.tipo_usuario || usuario.tipo || usuario.role || usuario.userType || usuario.user_type || '').toLowerCase();

  if (!identificador) {
    loginErro.value = 'Erro: não foi possível identificar o usuário na resposta.';
    return;
  }

  userStorage.setClienteId(identificador);
  userStorage.setClienteData(usuario);
  if (tipoUsuario) {
    userStorage.setUserType(tipoUsuario);
  }

  const isPrestador =
    tipoUsuario === 'prestador' || tipoUsuario === 'provider' || tipoUsuario === 'professional' || usuario.id_prestador || usuario.prestadorId;
  const isCliente =
    tipoUsuario === 'cliente' || tipoUsuario === 'client' || usuario.id_cliente || usuario.clienteId;

  if (isPrestador) {
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

    console.log("Resposta recebida:", resposta);

    if (resposta && (resposta.status === 200 || resposta.status_code === 200)) {

      irParaHome(resposta);
    } else {
      loginErro.value = resposta?.message || 'Erro ao realizar login.';
    }
  } catch (e) {
    loginErro.value = 'Erro de conexão com o servidor.';
  }
}




</script>

<template>
  <transition name="slide-fade" mode="out-in">
    <div class="conteinerAll">

      <div class="containerLeft">
        <div class="left-overlay"></div>
        <div class="left-text">
          <span class="subtitle">A EXCELÊNCIA EM MOVIMENTO</span>
          <h1 class="headline">DriveZ: A sua<br>jornada começa<br>aqui</h1>
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

:global(body) {
  min-height: 100%;
  margin: 0;
  padding: 0;
}

:global(body) {
  background: #8d0f11;
}

* {
  box-sizing: border-box;
}

.conteinerAll {
  display: flex;
  min-height: 100vh;
  width: 100%;
  justify-content: flex-end;
  align-items: stretch;
  background: #ffffff;
}

.containerLeft {
  position: relative;
  width: 38%;
  min-height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 0 0 56px;
  background: #8a0d11;
  overflow: hidden;
}

.containerLeft::before {
  content: "";
  position: absolute;
  inset: 0;
  background: url("../assets/carro.png") center/cover no-repeat;
  z-index: 1;
}

.left-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(175, 16, 26, 1), rgba(26, 28, 30, 1));
  opacity: 0.6;
  z-index: 2;
}

.left-text {
  position: relative;
  z-index: 3;
  max-width: 70%;
  padding: 0;
}

.subtitle {
  display: inline-block;
  color: rgba(242, 212, 213, 0.95);
  font-size: 14px;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  margin-bottom: 18px;
}

.headline {
  color: #ffffff;
  font-size: clamp(2.4rem, 4.5vw, 5rem);
  line-height: 1.02;
  font-weight: 700;
  margin: 0;
}

.containerRight {
  width: 62%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
}

@media (max-width: 1200px) {
  .containerLeft {
    width: 42%;
    padding-left: 36px;
  }

  .containerRight {
    width: 58%;
  }
}

@media (max-width: 900px) {
  .subtitle {
    font-size: 12px;
  }

  .headline {
    font-size: 2.2rem;
  }
}

@media (max-width: 600px) {
  .subtitle {
    font-size: 12px;
    letter-spacing: 0.3em;
  }

  .headline {
    font-size: 2.4rem;
  }

  .box_place {
    padding: 28px 18px;
  }

  .button-entrar {
    height: 52px;
    font-size: 16px;
  }

  .campos input {
    height: 54px;
  }
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

@media (min-width: 2560px) {
.containerLeft {
padding-left: 80px;
}

.subtitle {
font-size: 18px;
margin-bottom: 24px;
}

.headline {
font-size: 6rem;
}

.box_place {
max-width: 800px;
padding: 80px 64px;
gap: 36px;
}

.titulo_login {
font-size: 52px;
}

.campos input {
height: 88px;
padding: 0 28px;
font-size: 20px;
}

.button-entrar {
height: 80px;
font-size: 24px;
}

.esqueceu-senha {
font-size: 24px;
}

.cadastroH1 {
font-size: 26px;
}

.link-destaque {
font-size: 26px;
}
}