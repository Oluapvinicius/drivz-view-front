import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Login.vue';
import Cadastro from '../views/Cadastro.vue';
import HomeCliente from '../views/HomeCliente.vue';
import HomePrestador from '../views/Home_Prestador.vue';
import PedidoCliente from '../views/PedidoCliente.vue';
import PedidoPrestador from '../views/PedidoPrestador.vue';
import ConfigurarPedidoCliente from '../views/ConfigurarPedidoCliente.vue';
import MensagemCliente from '../views/MensagemCliente.vue';
import PerfilCliente from '../views/PerfilCliente.vue';
import PerfilPrestador from '../views/PerfilPrestador.vue';
import MeusVeiculos from '../views/MeusVeiculos.vue';


const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/cadastro',
    name: 'cadastro',
    component: Cadastro
  },
  {
    path: '/home-cliente',
    name: 'home-cliente',
    component: HomeCliente
  },
  {
    path: '/home-prestador',
    name: 'home-prestador',
    component: HomePrestador
  },
  {
    path: '/pedido-cliente',
    name: 'pedido-cliente',
    component: PedidoCliente
  },
  {
    path: '/pedido-prestador',
    name: 'pedido-prestador',
    component: PedidoPrestador
  },
  {
    path: '/configurar-pedido-cliente',
    name: 'configurar-pedido-cliente',
    component: ConfigurarPedidoCliente
  },
  {
    path: '/mensagem-cliente',
    name: 'mensagem-cliente',
    component: MensagemCliente
  },
  {
    path: '/perfil-cliente',
    name: 'perfil-cliente',
    component: PerfilCliente
  },
  {
    path: '/perfil-prestador',
    name: 'perfil-prestador',
    component: PerfilPrestador
  },
  {
    path: '/meus-veiculos',
    name: 'meus-veiculos',
    component: MeusVeiculos
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router