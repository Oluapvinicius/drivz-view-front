import { userStorage } from '@/utils/userStorage';
import ordersData from '../data/orders.json';

export async function buscarPedidos() {
  try {
    const clienteId = userStorage.getClienteId();
    
    if (!clienteId) {
      console.error('Erro: ID do cliente não encontrado no armazenamento local');
      return { response: [] };
    }

    const url = `http://localhost:8080/v1/drivez/pedido/cliente/${clienteId}`;
    console.log('[pedidos.js] Buscando de:', url);
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('[pedidos.js] Resposta da API:', data);
    return data || { response: [] };
  } catch (error) {
    console.error('[pedidos.js] Erro ao buscar pedidos:', error);
    return { response: [] };
  }
}

export async function buscarPedidosComFallback() {
  try {
    const clienteId = userStorage.getClienteId();
    
    console.log('[pedidos.js] clienteId recuperado:', clienteId);
    
    if (!clienteId) {
      console.warn('[pedidos.js] clienteId está vazio, usando dados locais');
      return ordersData;
    }

    const url = `http://localhost:8080/v1/drivez/pedido/cliente/${clienteId}`;
    console.log('[pedidos.js] Buscando pedidos de:', url);
    
    try {
      const response = await fetch(url, { timeout: 5000 });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('[pedidos.js] Resposta bruta da API:', data);
      
      // Trata diferentes formatos de resposta da API
      let pedidosRaw = [];
      
      if (Array.isArray(data)) {
        pedidosRaw = data;
      } else if (data && data.response && Array.isArray(data.response)) {
        pedidosRaw = data.response;
      } else if (data && data.HEADER && Array.isArray(data.HEADER.response)) {
        pedidosRaw = data.HEADER.response;
      }
      
      console.log('[pedidos.js] Pedidos encontrados na API:', pedidosRaw.length);
      
      if (pedidosRaw.length > 0) {
        const pedidosFormatados = pedidosRaw.map(item => ({
          id: item.id_pedido || item.id,
          
          provider: item.nome_prestador || item.prestador_nome || item.title || 'Prestador',
          avatar: item.foto_prestador || item.avatar || item.foto   || 'https://via.placeholder.com/150',
          email_prestador: item.email_prestador || item.email || '',
          telefone_prestador: item.telefone_prestador || item.telefone || '',
          categoria: item.categoria || '',

          date: item.data_solicitacao || item.data_pedido || item.data || new Date().toLocaleDateString('pt-BR'),
          origin: item.endereco_origem || item.origem || 'Local não informado',
          destination: item.endereco_destino || item.destino || 'Local não informado',
          status: item.status_pedido || item.status || 'Concluído',
          descricao: item.descricao || '',
          distancia_km: item.distancia_km || 0
        }));
        
        console.log('[pedidos.js] Retornando pedidos formatados:', pedidosFormatados);
        return pedidosFormatados;
      }
      
    } catch (fetchError) {
      console.warn('[pedidos.js] Erro ao buscar da API, usando dados locais:', fetchError.message);
    }

    console.log('[pedidos.js] Usando dados locais do orders.json');
    return ordersData;
    
  } catch (error) {
    console.error('[pedidos.js] Erro geral:', error);
    console.log('[pedidos.js] Retornando dados locais como fallback');
    return ordersData;
  }
}
