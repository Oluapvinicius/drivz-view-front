<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const tituloLogin = ref('Entrar')
const esqueceu = ref('Esqueceu a senha?')
const email = ref('')
const senha = ref('')

const button = ref()

const router = useRouter();

const irParaHome = () => {
  router.push('/home-c');
};
</script>

<template>
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
        <input type="email" id="Email" v-model="email" placeholder="Email">
        <input type="password" id="Senha" v-model="senha" placeholder="Senha">
      </div>

      <h1 class="esqueceu-senha">{{ esqueceu }}</h1>

      <button @click="irParaHome" class="button-entrar" >
        Entrar
      </button>

      <h1 class="cadastroH1">Ainda não tem conta?
        <router-link to="/cadastro" class="link-destaque">Cadastre-se</router-link>
      </h1>


    </div>
  </div>
  
 

  </div>
</template>



<style scoped>
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



/* .box_place h1:nth-of-type(2) {
  text-align: right;
  color: #b5080d;
  font-size: 14px;
}

.box_place h1:nth-of-type(3) {
  text-align: center;
  color: #111111;
  font-size: 15px;
} */

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
</style>
