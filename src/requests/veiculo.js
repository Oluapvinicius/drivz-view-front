import { apiFetch } from './api';
import { userStorage } from '@/utils/userStorage';

export async function listarVeiculos() {
  try {
    const userId = userStorage.getUserId();
    const isPrestador = userStorage.isPrestador();

    const path = (isPrestador && userId) ? `/prestador/${userId}/veiculos` : '/veiculos';
    const res = await apiFetch(path);
   
    if (res && res.response && Array.isArray(res.response.movies)) {
        const vehicles = res.response.movies.map(v => ({
          id: v.id_veiculo || v.id || null,
          placa: v.placa,
          renavam: v.codigo_renavam || v.renavam || '',
          validadeDoc: v.validade ? (String(v.validade).split('T')[0]) : v.validade || '',
          categoria: v.categoria || ''
        }));

        return vehicles;
    }
    return [];
  } catch (e) {
    console.warn('listarVeiculos fallback:', e.message);
    throw e;
  }
}

export async function criarVeiculo(veiculo) {
  const payload = {
    categoria: veiculo.categoria,
    validade: veiculo.validadeDoc,
    codigo_renavam: veiculo.renavam,
    placa: veiculo.placa
  };

  const userId = userStorage.getUserId();
  if (userId) {
    // Preferir prestador; se o tipo não estiver definido, enviar como prestador (fallback)
    if (userStorage.isPrestador()) payload.id_prestador = Number(userId);
    else if (userStorage.isCliente()) payload.id_cliente = Number(userId);
    else payload.id_prestador = Number(userId);
  }

  console.debug('[veiculo] criar payload:', payload);

  return apiFetch('/veiculo', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function atualizarVeiculo(id, veiculo) {
  const payload = {
    categoria: veiculo.categoria,
    validade: veiculo.validadeDoc,
    codigo_renavam: veiculo.renavam,
    placa: veiculo.placa
  };

  const userId = userStorage.getUserId();
  if (userId) {
    if (userStorage.isCliente()) payload.id_cliente = Number(userId);
    else if (userStorage.isPrestador()) payload.id_prestador = Number(userId);
  }

  return apiFetch(`/veiculo/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export async function deletarVeiculo(id) {
  const userId = userStorage.getUserId();
  if (userId) {
    if (userStorage.isPrestador()) {
      return apiFetch(`/prestador/${userId}/veiculo/${id}`, { method: 'DELETE' });
    } else if (userStorage.isCliente()) {
      return apiFetch(`/cliente/${userId}/veiculo/${id}`, { method: 'DELETE' });
    }
  }

  return apiFetch(`/veiculos/${id}`, {
    method: 'DELETE'
  });
}

export default { listarVeiculos, criarVeiculo, atualizarVeiculo, deletarVeiculo };
