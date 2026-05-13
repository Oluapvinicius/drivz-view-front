<template>
  <div class="pedido-cliente-bg">
    <div class="mapa-bg-placeholder">



    </div>
    <div class="pedido-cliente-modal">
      <div class="progress-bar-wrapper">
        <img src="../assets/barra-distancia.svg" alt="Barra de progresso" class="progress-bar-img" />
      </div>
      <div class="trajeto-row">
        <div class="trajeto-ponto">
          
          <span class="trajeto-label">R. João Blesa - 45. Alphaville</span>
        </div>
        <img src="../assets/carro-distancia.svg" alt="Carro" class="trajeto-carro" />
        <div class="trajeto-ponto">
        
          <span class="trajeto-label">R. João Blesa - 45. Alphaville</span>
        </div>
      </div>
      <button class="cancelar-btn">Cancelar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PedidoClienteDistancia',
};




</script>

<style scoped>
.pedido-cliente-bg {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #f5f5f5;
  overflow: hidden;
}
.mapa-bg-placeholder {
  position: absolute;
  inset: 0;
  background: #e0e0e0;
  z-index: 0;
}
.pedido-cliente-modal {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  z-index: 1;
  background: #fff;
  border-radius: 32px 32px 0 0;
  box-shadow: 0 4px 32px rgba(0,0,0,0.18);
  width: 600px;
  max-width: 98vw;
  padding: 260px 140px 170px 190px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.progress-bar-wrapper {
  width: 90%;
  margin: 0 auto 40px auto;
}
.progress-bar-img {
  width: 100%;
  height: 18px;
  object-fit: contain;
}
.trajeto-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 48px;
  gap: 56px;
}
.trajeto-ponto {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.trajeto-quadrado {
  width: 22px;
  height: 22px;
  background: #111;
  border-radius: 4px;
  margin-bottom: 10px;
}
.trajeto-circulo {
  width: 22px;
  height: 22px;
  background: #111;
  border-radius: 50%;
  margin-bottom: 10px;
}
.trajeto-label {
  font-size: 1.08rem;
  color: #222;
  text-align: center;
  max-width: 180px;
  font-weight: 500;
}
.trajeto-carro {
  width: 110px;
  height: 60px;
  object-fit: contain;
}
.cancelar-btn {
  margin-top: 0;
  width: 90%;
  background: #D62828;
  color: #fff;
  border: none;
  border-radius: 32px;
  padding: 20px 0;
  font-size: 1.35rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 12px rgba(214,40,40,0.10);
  letter-spacing: 0.5px;
}
.cancelar-btn:hover {
  background: #b71c1c;
}
</style>
