import { apiFetch } from './api';

export async function listarVeiculos() {
  try {
    const res = await apiFetch('/veiculo');
    // API returns { response: { movies: [...] } } based on controller
    if (res && res.response && Array.isArray(res.response.movies)) {
      return res.response.movies.map(v => ({
        id: v.id_veiculo || v.id || null,
        placa: v.placa,
        renavam: v.codigo_renavam || v.renavam || '',
        validadeDoc: v.validade ? v.validade.split('T')[0] : v.validade || '',
        categoria: v.categoria || ''
      }));
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

  return apiFetch(`/veiculo/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export async function deletarVeiculo(id) {
  return apiFetch(`/veiculo/${id}`, {
    method: 'DELETE'
  });
}

export default { listarVeiculos, criarVeiculo, atualizarVeiculo, deletarVeiculo };
