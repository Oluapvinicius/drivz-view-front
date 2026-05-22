<template>
 <div class="conteinerAll">
  <div class="map"></div>
  <div class="containerMid">
    <div class="stepsContainer">
      <div class="stepsWrapper">
        <div class="stepItem active">
          <div class="stepIcon">
            <img src="../assets/lupaIcon.svg" alt="Passo 1" />
          </div>
        </div>
        
        <div class="stepLine"></div>
        
        <div class="stepItem">
          <div class="stepIcon">
            <img src="../assets/carroicon.svg" alt="Passo 2" />
          </div>
        </div>
        
        <div class="stepLine"></div>
        
        <div class="stepItem">
          <div class="stepIcon">
            <img src="../assets/bandeira.svg" alt="Passo 3" />
          </div>
        </div>
      </div>
      
      <div class="stepsLabels">
        <div class="stepLabelWrapper">
          <div class="stepLabel active">Buscando</div>
        </div>
        <div class="stepLabelWrapper">
          <div class="stepLabel">A caminho</div>
        </div>
        <div class="stepLabelWrapper">
          <div class="stepLabel">Viagem</div>
        </div>
      </div>
    </div>

    <div class="locationCard">
      <div class="locationItem">
        <div class="locationIcon">
          <img src="../assets/Border.svg" alt="Origem" />
        </div>
        <div class="locationDetails">
          <div class="locationLabel">Origem</div>
          <div class="locationText">Av. Paulista, 1000 - Bela Vista</div>
        </div>
      </div>

      <div class="locationItem">
        <div class="locationIcon">
          <img src="../assets/border2.svg" alt="Destino" />
        </div>
        <div class="locationDetails">
          <div class="locationLabel">Destino</div>
          <div class="locationText">Rua Oscar Freire, 500 - Jardins</div>
        </div>
      </div>
    </div>

    <div class="searchProgress">
      <div class="searchText">Procurando motorista...</div>
      <div class="badgeContainer">
        <span class="demandBadge">Alta demanda</span>
      </div>
    </div>

    <div class="progressBar">
      <div class="progressFill"></div>
    </div>

    <button class="cancelButton">Cancelar Solicitação</button>

    <div class="tipSection">
      <img src="../assets/lampada.svg" alt="Dica" class="tipIcon" />
      <div class="tipText">Dica: Mantenha o app aberto para agilizar a conexão</div>
    </div>
  </div>
 </div>
</template>


<script>
export default {
  name: 'PedidoCliente',
  data() {
    return {}
  }
}
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
body {
  height: 100vh;
}
.conteinerAll {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: #ffffff;
}

.map {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #d0d0d0;
  z-index: 1;
}

.containerMid {
  position: absolute;
  width: 18%;
  height: 44%;
  top: 48%;
  right: 41.5%;
  border: none;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  z-index: 2;
  background: #fff;
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.18);
  padding: 36px 26px 28px 26px;
  margin: 18px;
  overflow: hidden;
}

.stepsContainer {
  width: 100%;
  margin-bottom: 30px;
}

.stepsWrapper {
  display: flex;
 
  justify-content: space-between;
  gap: 0px;
  align-items: center;
}

.stepItem {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.stepItem.active .stepIcon {
  background: #c41e1e;
  color: white;
}

.stepIcon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  color: #999;
  font-size: 24px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.stepIcon svg {
  width: 24px;
  height: 24px;
}

.stepLabel {
  font-size: 14px;
  color: #666;
  text-align: center;
  font-weight: 500;
}

.stepLabel.active {
  color: #c41e1e;
  font-weight: 700;
}

.stepsLabels {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0;
  margin-top: 12px;
  gap: 10%;
}

.stepLabelWrapper {
  flex: 1;
  display: flex;
  justify-content: center;
}

.stepLine {
  flex: 0.5;
  height: 2px;
  background: #E9BCB6;
  margin: 0;
  align-self: center;
}

.locationCard {
  background: #F3F4F5;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  border: 0px solid #E9BCB6;
}

.locationItem {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.locationIcon {
  width: 40px;
  height: 40px;
  background: transparent;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #333;
}

.locationIcon svg {
  width: 20px;
  height: 20px;
}

.locationDetails {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.locationLabel {
  font-size: 11px;
  color: #535F75;
  font-weight: 400;
}

.locationText {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  line-height: 1.3;
}

.searchProgress {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom:10px;
  gap: 0px;
}

.searchText {
  font-size: 15px;
  color: #586379;
  font-weight: 500;
}

.badgeContainer {
  display: flex;
}

.demandBadge {
  background: #ffebee;
  color: #930009;
  font-size: 12px;
  font-weight: 550;
  padding: 4px 8px;
  border-radius: 25px;
  white-space: nowrap;
}

.progressBar {
  width: 100%;
  height: 4px;
  background: #FFDAD5;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 32px;
}

.progressFill {
  height: 100%;
  background: #c41e1e;
  border-radius: 2px;
  width: 25%;
}

.cancelButton {
  width: 100%;
  padding: 18px 20px;
  background: #c41e1e;
  color: white;
  border: none;
  border-radius: 28px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 28px;
  transition: background 0.3s ease;
}

.cancelButton:hover {
  background: #a01818;
}

.cancelButton:active {
  background: #8b1414;
}

.tipSection {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  padding: 7px;
  background: #eef3fc;
  border-radius: 25px;
  margin-top: auto;
}

.tipIcon {
  width: 18px;
  height: 18px;
  color: #586379;
  flex-shrink: 0;
  
}

.tipText {
  font-size: 14px;
  color: #586379;
  line-height: 1.4;
  font-weight: 500;
}

@media (max-width: 640px) {
  .conteinerAll {
    flex-direction: column;
    min-height: auto;
  }

  .map {
    position: relative;
    width: 100%;
    min-height: 300px;
  }

  .containerMid {
    position: relative;
    width: 100%;
    height: auto;
    top: auto;
    right: auto;
    border-radius: 24px 24px 0 0;
    padding: 24px 16px 20px 16px;
    margin: 0;
    box-shadow: 0 -8px 32px 0 rgba(0,0,0,0.1);
  }

  .stepsContainer {
    margin-bottom: 20px;
  }

  .stepsWrapper {
    gap: 0;
  }

  .stepIcon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .stepIcon svg {
    width: 20px;
    height: 20px;
  }

  .stepLabel {
    font-size: 12px;
  }

  .stepsLabels {
    gap: 5%;
    margin-top: 10px;
  }

  .stepLine {
    flex: 0.5;
    height: 2px;
  }

  .locationCard {
    padding: 12px;
    margin-bottom: 20px;
    gap: 16px;
  }

  .locationItem {
    gap: 10px;
  }

  .locationIcon {
    width: 36px;
    height: 36px;
  }

  .locationIcon svg {
    width: 18px;
    height: 18px;
  }

  .locationLabel {
    font-size: 10px;
  }

  .locationText {
    font-size: 13px;
  }

  .searchProgress {
    margin-bottom: 8px;
  }

  .searchText {
    font-size: 14px;
  }

  .demandBadge {
    font-size: 11px;
    padding: 3px 6px;
  }

  .progressBar {
    height: 3px;
    margin-bottom: 20px;
  }

  .cancelButton {
    padding: 14px 16px;
    font-size: 15px;
    margin-bottom: 16px;
  }

  .tipSection {
    gap: 8px;
    padding: 6px;
    margin-top: 10px;
  }

  .tipIcon {
    width: 16px;
    height: 16px;
  }

  .tipText {
    font-size: 12px;
  }
}


</style>

