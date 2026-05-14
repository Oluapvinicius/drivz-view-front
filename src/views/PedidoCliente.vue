<template>
  <div class="pedido-cliente-page">
    <header class="pedido-cliente-header">
      <button class="pedido-cliente-back" @click="goBack" aria-label="Voltar">
        <img src="../assets/arrow.png" alt="Voltar" />
      </button>

      <div class="pedido-cliente-title-wrap">
        <h1 class="pedido-cliente-title">Pedido</h1>
        <p class="pedido-cliente-subtitle">Acompanhe seu chamado</p>
      </div>

      <div class="pedido-cliente-header-spacer" />
    </header>

    <main class="pedido-cliente-content">
   
     
    </main>
  </div>
</template>


<script>
import pedidoAcaminhoIcon from '../assets/pedidoCliente/Pedido a caminho - Cliente.svg';
import pedidoAceitoIcon from '../assets/pedidoCliente/Pedido aceito - Cliente.svg';
import chatIcon from '../assets/pedidoCliente/Chat entre o Cliente e pretador.svg';
import avaliacaoIcon from '../assets/pedidoCliente/Avaliação.svg';

export default {
  name: 'PedidoClienteDistancia',
  data() {
    return {
      pedidoAcaminhoIcon,
      pedidoAceitoIcon,
      chatIcon,
      avaliacaoIcon,
    };
  },
  methods: {
    goBack() {
      this.$router.back();
    },
  },
};

</script>

<style scoped>
.pedido-cliente-page {
  min-height: 100vh;
  background: #ffffff;
  color: #111827;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    sans-serif;
  display: flex;
  flex-direction: column;
}

.pedido-cliente-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #dc2626;
  color: #ffffff;
  padding: 18px 16px;
  flex-shrink: 0;
}

.pedido-cliente-back {
  border: none;
  background: transparent;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.pedido-cliente-back img {
  width: 18px;
  height: 18px;
  object-fit: contain;
  filter: invert(1);
}

.pedido-cliente-title-wrap {
  flex: 1;
  text-align: center;
}

.pedido-cliente-title {
  font-size: 18px;
  font-weight: 800;
  margin: 0;
}

.pedido-cliente-subtitle {
  margin: 3px 0 0;
  font-size: 12px;
  opacity: 0.95;
}

.pedido-cliente-header-spacer {
  width: 44px;
}

.pedido-cliente-content {
  flex: 1;
  padding: 22px 16px 32px;
  display: flex;
  justify-content: center;
}

.pedido-cliente-card {
  width: min(920px, 100%);
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 20px 18px;
}

.pedido-cliente-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;
}

.pedido-cliente-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pedido-cliente-status__dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.15);
}

.pedido-cliente-status__text {
  font-weight: 800;
  color: #111827;
  font-size: 14px;
}

.pedido-cliente-category {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fef2f2;
  border: 1px solid rgba(220, 38, 38, 0.25);
  padding: 10px 12px;
  border-radius: 999px;
}

.pedido-cliente-category__icon {
  width: 22px;
  height: 22px;
}

.pedido-cliente-category__text {
  font-weight: 800;
  color: #b91c1c;
  font-size: 13px;
}

.pedido-cliente-route {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: center;
  margin: 14px 0 18px;
}

.pedido-cliente-route__column {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pedido-cliente-route__marker {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: #dc2626;
}

.pedido-cliente-route__marker--dest {
  background: #22c55e;
}

.pedido-cliente-route__label {
  font-size: 12px;
  font-weight: 800;
  color: #6b7280;
  text-transform: uppercase;
}

.pedido-cliente-route__value {
  font-size: 14px;
  font-weight: 800;
  color: #111827;
  word-break: break-word;
}

.pedido-cliente-route__bar {
  width: 120px;
  height: auto;
}

.pedido-cliente-provider {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 14px;
  border-radius: 18px;
  background: #f9fafb;
  border: 1px solid rgba(0, 0, 0, 0.06);
  margin-bottom: 18px;
}

.pedido-cliente-provider__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pedido-cliente-provider__avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
}

.pedido-cliente-provider__name {
  font-weight: 900;
  font-size: 14px;
}

.pedido-cliente-provider__meta {
  margin-top: 2px;
  font-weight: 700;
  font-size: 12px;
  color: #6b7280;
}

.pedido-cliente-call {
  border: none;
  background: #dc2626;
  color: #ffffff;
  font-weight: 900;
  padding: 12px 18px;
  border-radius: 14px;
  cursor: pointer;
}

.pedido-cliente-call:hover {
  opacity: 0.97;
}

.pedido-cliente-distance {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.pedido-cliente-distance__car {
  width: 160px;
  height: auto;
}

.pedido-cliente-distance__text {
  font-size: 14px;
  font-weight: 800;
  color: #111827;
}

/* Mock visual: se a imagem já contém o layout completo, ela garante igualdade imediata */
.pedido-cliente-mock {
  width: 100%;
  margin-top: 18px;
  display: flex;
  justify-content: center;
}

.pedido-cliente-mock__img {
  width: min(920px, 100%);
  height: auto;
  border-radius: 24px;
  display: block;
}

@media (max-width: 520px) {
  .pedido-cliente-route {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .pedido-cliente-route__center {
    display: flex;
    justify-content: center;
  }
  .pedido-cliente-route__bar {
    width: 70px;
  }
  .pedido-cliente-distance__car {
    width: 120px;
  }
}
</style>

