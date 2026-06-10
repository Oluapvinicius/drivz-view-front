<template>
  <div class="pedido-page">
    <header class="pedido-header">
      <button class="header-back" @click="goBack" aria-label="Voltar">
        <img src="../assets/arrow.png" alt="Voltar" />
      </button>
      <h1>Configurar Pedido</h1>
      <div class="header-spacer"></div>
    </header>

    <main class="pedido-content">
      <div class="pedido-card">

        <div class="autocomplete-container">
          <label class="pedido-label" for="origem">Origem</label>
          <input id="origem" v-model="origem" class="pedido-input" @input="aoDigitar('origem')"
            @blur="setTimeout(() => { sugestoesOrigem = [] }, 200)" autocomplete="off" />
          <ul v-if="sugestoesOrigem.length > 0" class="sugestoes-lista">
            <li v-for="(s, i) in sugestoesOrigem" :key="i" @click="selecionarEndereco(s, 'origem')">
              {{ s.place_name }}
            </li>
          </ul>
        </div>

        <div v-if="tipoPedido === 'emergencia'" class="autocomplete-container">
          <label class="pedido-label" for="destino">Destino</label>
          <input id="destino" v-model="destino" class="pedido-input" @input="aoDigitar('destino')"
            @blur="setTimeout(() => { sugestoesDestino = [] }, 200)" autocomplete="off" />
          <ul v-if="sugestoesDestino.length > 0" class="sugestoes-lista">
            <li v-for="(s, i) in sugestoesDestino" :key="i" @click="selecionarEndereco(s, 'destino')">
              {{ s.place_name }}
            </li>
          </ul>
        </div>

        <label class="pedido-label" for="descricao">
          Descrição <span>(Opcional)</span>
        </label>
        <textarea id="descricao" v-model="descricao" class="pedido-textarea" rows="6"
          placeholder="Descreva o pedido com mais detalhes"></textarea>

        <button class="pedido-button" @click="continuarPedido">Continuar</button>
      </div>
    </main>

  </div>
</template>
<script>
import guinchoIcon from '../assets/guincho.svg';
import mecanicoIcon from '../assets/mecanico.svg';
import eletricistaIcon from '../assets/eletricista.svg';
import borracheiroIcon from '../assets/borracheiro.svg';
import pneuIcon from '../assets/pneu.svg';
import { supabase } from '../supabase';

// export default {
//   name: 'ConfigurarPedidoCliente',
// data() {
//   return {
//     origem: '',
//     destino: '',
//     sugestoesOrigem: [],
//     sugestoesDestino: [],
//     timeoutDebounce: null,
//     descricao: '',
//     categoryPopupOpen: false,
//     searchQuery: '',
//     selectedCategory: null,
//     categories: [
//       { name: 'Guincho', icon: guinchoIcon },
//       { name: 'Mecânico', icon: mecanicoIcon },
//       { name: 'Eletricista', icon: eletricistaIcon },
//       { name: 'Borracheiro', icon: borracheiroIcon },
//       { name: 'Troca de Pneu', icon: pneuIcon }
//     ]
//   };
// },
// computed: {
//   filteredCategories() {
//     const query = this.searchQuery.trim().toLowerCase();
//     if (!query) return this.categories;
//     return this.categories.filter(item => item.name.toLowerCase().includes(query));
//   }
// },
// methods: {
//   goBack() {
//     this.$router.back();
//   },
//   aoDigitar(campo) {
//     clearTimeout(this.timeoutDebounce);

//     const valor = this[campo];
//     const listaSugestoes = campo === 'origem' ? 'sugestoesOrigem' : 'sugestoesDestino';

//     if (valor.length < 4) {
//       this[listaSugestoes] = [];
//       return;
//     }

//     this.timeoutDebounce = setTimeout(() => {
//       const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(valor)}&format=json&countrycodes=br&addressdetails=1&limit=5`;

//       fetch(url, {
//         headers: {
//           'Accept-Language': 'pt-BR'
//         }
//       })
//         .then(response => response.json())
//         .then(dados => {
//           this[listaSugestoes] = dados;
//         })
//         .catch(erro => {
//           console.error('Erro ao buscar endereços:', erro);
//         });
//     }, 500);
//   },
//   selecionarEndereco(sugestao, campo) {
//     if (campo === 'origem') {
//       this.origem = sugestao.display_name;
//       this.sugestoesOrigem = [];
//     } else {
//       this.destino = sugestao.display_name;
//       this.sugestoesDestino = [];
//     }
//   },
//   continuar() {
//     this.categoryPopupOpen = true;
//   },
//   closePopup() {
//     this.categoryPopupOpen = false;
//   },
//   selectCategory(category) {
//     this.selectedCategory = category;
//     this.categoryPopupOpen = false;
//     this.$router.push({ name: 'pedido-cliente' });
//   }
// }

//   data() {
//     return {
//       origem: '',
//       destino: '',
//       origemCoords: null,
//       destinoCoords: null,
//       sugestoesOrigem: [],
//       sugestoesDestino: [],
//       timeoutDebounce: null,
//       descricao: '',
//       categoryPopupOpen: false,
//       searchQuery: '',
//       selectedCategory: null,
//       categories: [
//         { name: 'Guincho', icon: guinchoIcon },
//         { name: 'Mecânico', icon: mecanicoIcon },
//         { name: 'Eletricista', icon: eletricistaIcon },
//         { name: 'Borracheiro', icon: borracheiroIcon },
//         { name: 'Troca de Pneu', icon: pneuIcon }
//       ]
//     };
//   },
//   methods: {
//     goBack() {
//       this.$router.back();
//     },
//     aoDigitar(campo) {
//       clearTimeout(this.timeoutDebounce);
//     },

//     selecionarEndereco(sugestao, campo) {
//       const coords = [parseFloat(sugestao.lon), parseFloat(sugestao.lat)];

//       if (campo === 'origem') {
//         this.origem = sugestao.display_name;
//         this.origemCoords = coords;
//         this.sugestoesOrigem = [];
//       } else {
//         this.destino = sugestao.display_name;
//         this.destinoCoords = coords;
//         this.sugestoesDestino = [];
//       }
//     },

//     selectCategory(category) {
//       this.selectedCategory = category;
//       this.categoryPopupOpen = false;

//       this.$router.push({
//         name: 'pedido-cliente',
//         query: {
//           origemLng: this.origemCoords ? this.origemCoords[0] : null,
//           origemLat: this.origemCoords ? this.origemCoords[1] : null,
//           destinoLng: this.destinoCoords ? this.destinoCoords[0] : null,
//           destinoLat: this.destinoCoords ? this.destinoCoords[1] : null,
//         }
//       });
//     }
//   }
// };

export default {
  name: 'ConfigurarPedidoCliente',
  data() {
    return {
      tipoPedido: 'comum',
      origem: '',
      destino: '',
      origemCoords: null,
      destinoCoords: null,
      sugestoesOrigem: [],
      sugestoesDestino: [],
      timeoutDebounce: null,
      descricao: '',
      categoryPopupOpen: false,
      searchQuery: '',
      selectedCategory: null,
      categories: [
        { name: 'Guincho', icon: guinchoIcon },
        { name: 'Mecânico', icon: mecanicoIcon },
        { name: 'Eletricista', icon: eletricistaIcon },
        { name: 'Borracheiro', icon: borracheiroIcon },
        { name: 'Troca de Pneu', icon: pneuIcon }
      ]
    };
  },
  computed: {
    filteredCategories() {
      const query = this.searchQuery.trim().toLowerCase();
      if (!query) return this.categories;
      return this.categories.filter(item => item.name.toLowerCase().includes(query));
    }
  },
  mounted() {
    const tipoVindoDoChat = this.$route.query.tipo;

    if (tipoVindoDoChat) {
      this.tipoPedido = tipoVindoDoChat;
    }
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    aoDigitar(campo) {
      clearTimeout(this.timeoutDebounce);

      const valor = this[campo];
      const listaSugestoes = campo === 'origem' ? 'sugestoesOrigem' : 'sugestoesDestino';

      if (valor.length < 3) {
        this[listaSugestoes] = [];
        return;
      }

      this.timeoutDebounce = setTimeout(() => {
        const token = import.meta.env.VITE_MAPBOX_TOKEN

        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(valor)}.json?access_token=${token}&country=br&autocomplete=true&limit=5&language=pt`;

        fetch(url)
          .then(response => response.json())
          .then(data => {
            this[listaSugestoes] = data.features || [];
          })
          .catch(erro => {
            console.error('Erro ao buscar endereços no Mapbox:', erro);
          });
      }, 400);
    },
    selecionarEndereco(sugestao, campo) {
      const coords = sugestao.geometry.coordinates;

      if (campo === 'origem') {
        this.origem = sugestao.place_name;
        this.origemCoords = coords;
        this.sugestoesOrigem = [];
      } else {
        this.destino = sugestao.place_name;
        this.destinoCoords = coords;
        this.sugestoesDestino = [];
      }
    },
    async continuarPedido() {
      const tipoAtual = this.$route.query.tipo || 'comum';
      const pedidoId = `pedido_${Date.now()}`; // Gera um ID único baseado no tempo atual

      if (tipoAtual === 'emergencia') {
        try {
          // Grava a emergência na tabela do Supabase
          const { error } = await supabase
            .from('solicitacoes') // Nome da sua tabela no Supabase
            .insert([
              { 
                id: pedidoId, 
                status: 'buscando', // O celular do prestador vai filtrar por esse status
                origem_txt: this.origem,
                destino_txt: this.destino,
                origem_lat: this.origemCoords ? this.origemCoords[1] : null,
                origem_lng: this.origemCoords ? this.origemCoords[0] : null
              }
            ]);

          if (error) throw error;

          // Se gravou com sucesso, vai para a tela do mapa passando o ID do pedido criado
          this.$router.push({ 
            name: 'pedido-cliente', 
            query: { id_pedido: pedidoId, tipo: 'emergencia', ...this.$route.query } 
          });

        } catch (err) {
          console.error("Erro ao salvar emergência no Supabase:", err);
          alert("Falha ao iniciar pedido de emergência.");
        }
      } else {
        // Fluxo comum (segue o roteamento normal que você já tinha feito)
      }
    },
    closePopup() {
      this.categoryPopupOpen = false;
    },
    selectCategory(category) {
      this.selectedCategory = category;
      this.categoryPopupOpen = false;

      this.$router.push({
        name: 'pedido-cliente',
        query: {
          origemLng: this.origemCoords[0],
          origemLat: this.origemCoords[1],
          destinoLng: this.destinoCoords[0],
          destinoLat: this.destinoCoords[1],
          txtOrigem: this.origem,
          txtDestino: this.destino,
          categoria: category.name,

          contactId: this.$route.query.contactId,
          providerName: this.$route.query.providerName,
          providerEmail: this.$route.query.providerEmail
        }
      });
    }
  }
};
</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.pedido-page {
  min-height: 100vh;
  background: #ffffff;
  color: #111827;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  display: flex;
  flex-direction: column;
}

.pedido-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #dc2626;
  color: #ffffff;
  padding: 18px 16px;
  flex-shrink: 0;
}

.header-back {
  border: none;
  background: transparent;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.header-back img {
  width: 18px;
  height: 18px;
  object-fit: contain;
  filter: invert(1);
}

.pedido-header h1 {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  text-align: center;
  flex: 1;
}

.header-spacer {
  width: 40px;
}

.pedido-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
}

.pedido-card {
  width: min(98vw, 900px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pedido-label {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  gap: 15px;
}

.pedido-label span {
  font-weight: 400;
  color: #6b7280;
}

.pedido-input,
.pedido-textarea {
  width: 100%;
  border: 1.5px solid #dc2626;
  border-radius: 18px;
  padding: 16px 18px;
  font-size: 16px;
  color: #111827;
  background: #ffffff;
  outline: none;
}

.pedido-input::placeholder,
.pedido-textarea::placeholder {
  color: #9ca3af;
}

.pedido-textarea {
  min-height: 180px;
  resize: none;
}

.pedido-input:focus,
.pedido-textarea:focus {
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.12);
}

.pedido-button {
  width: 100%;
  background: #dc2626;
  color: #ffffff;
  border: none;
  border-radius: 18px;
  padding: 18px 20px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

.pedido-button:hover {
  opacity: 0.96;
}

.category-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.24);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  z-index: 30;
}

.category-modal {
  width: min(100%, 520px);
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.16);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.category-modal h2 {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  text-align: center;
}

.category-divider {
  height: 2px;
  width: 92px;
  background: #dc2626;
  border-radius: 999px;
  margin: 0 auto;
}

.search-field {
  width: 100%;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-field img {
  width: 18px;
  height: 18px;
}

.search-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  color: #111827;
}

.category-list {
  display: grid;
  gap: 14px;
}

.category-button {
  width: 100%;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 18px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.category-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}

.category-icon {
  width: 32px;
  height: 32px;
  display: block;
}

.category-label {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  text-align: left;
}

.btn-logout {
  background-color: #ef4444;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}

.btn-logout:hover {
  background-color: #dc2626;
}

.autocomplete-container {
  position: relative;
  width: 100%;
}


.sugestoes-lista {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;

  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  margin-top: 8px;
  padding: 0;
  list-style: none;


  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  max-height: 250px;
  overflow-y: auto;
}


.sugestoes-lista li {
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s ease;


  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}


.sugestoes-lista li:last-child {
  border-bottom: none;
}


.sugestoes-lista li:hover {
  background-color: #fef2f2;
  color: #dc2626;
}


.sugestoes-lista::-webkit-scrollbar {
  width: 6px;
}

.sugestoes-lista::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 10px;
}
</style>