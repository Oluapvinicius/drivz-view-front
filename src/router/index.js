import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Login.vue'
import CadastroView from '../views/Cadastro.vue'
import HomeCView from '../views/HomeCliente.vue'
import PedidoCliente from '../views/ConfigurarPedidoCliente.vue'
import MensagemCliente from '../views/MensagemCliente.vue'

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
  },
  {
    path: '/home-c',
    name: 'home-c',
    component: HomeCView
  },
  {
    path: '/mensagem-cliente',
    name: 'mensagem-cliente',
    component: MensagemCliente
  },
  {
    path: '/pedido-c',
    name: 'pedido-c',
    component: PedidoCliente
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router