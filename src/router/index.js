import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Login.vue'
import CadastroView from '../views/Cadastro.vue'


const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/cadastro',
    name: 'cadastro',   
    component: CadastroView
  }
]

const router = createRouter({
  history: createWebHistory(), 
  routes
})

export default router