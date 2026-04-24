<script setup>
import { ref } from 'vue';

const tituloLogin = ref('Entrar')
const esqueceu = ref('Esqueceu a senha?')
const asd = ref('')

</script>

<template>
  <div class="conteinerAll">

     <div class="containerLeft">
    <img src="../assets/carro.png" alt="Imagem de Login" >
    </div>

  <div class="containerRight">

    <div class="box_place">
     
      <div class="logo">
      <h1 class="titulo_login"> {{ tituloLogin }} </h1>
      </div>
      
      <div class="campos">
        <input type="email" id="Email" v-model="as" placeholder="Email">
        <input type="password" id="Senha" v-model="asd" placeholder="Senha">
      </div>

      <h1 class="esqueceu-senha">{{ esqueceu }}</h1>

      <button @click="" class="button-entrar">
        Entrar
      </button>

      <h1 class="cadastroH1">Ainda não tem conta?
        <router-link to="" class="link-destaque">Cadastre-se</router-link>
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
  align-items: center;
  background: linear-gradient(90deg, #8d0f11 50%, #ffffff 50%);
}

.containerRight {
  width: 60%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
}

.box_place {
  width: 100%;
  max-width: 530px;
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
  background: #ffffff;
}

.titulo_login {
  font-size: 35px;  
  text-align: center;
  color: #111111;
}

.campos {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.campos input {
  width: 100%;
  height: 60px;
  padding: 0 18px;
  border: 1px solid #dfe7f2;
  border-radius: 4px;
  background-color: #eef4fb;
  font-size: 16px;
  color: #111111;
}

.button-entrar {
  width: 100%;
  height: 56px;
  border: none;
  
  background: #b5080d;
  color: #ffffff;
  font-size: 18px;
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
}
.esqueceu-senha {
  text-align: right;
  color: #b5080d;
  font-size: 20px;
}
.cadastroH1 {
  color: #111111;
  font-size: 21px;
}


.containerLeft {
  width: 40%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
img {
  width: 100%;
  height: auto; 
}
</style>
