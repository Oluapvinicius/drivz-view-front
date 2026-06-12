const BASE_URL = "https://backend-drivez-atgfavb2cuccgrah.eastus2-01.azurewebsites.net/v1/drivez";

export async function buscarCliente(id) {
  const url = `${BASE_URL}/cliente/${id}`;
  const response = await fetch(url);
  return response.json();
}

export async function buscarPrestador(id) {
  const url = `${BASE_URL}/prestador/${id}`;
  const response = await fetch(url);
  return response.json();
}

export async function buscarPrestadorPorId(id) {
  const url = `${BASE_URL}/prestador/${id}`;
  const response = await fetch(url);
  return response.json();
}

export async function atualizarPrestador(id, dados) {
  const url = `${BASE_URL}/prestador/${id}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  return response.json();
}

export async function buscarAvaliacaoPrestador(id) {
  const url = `${BASE_URL}/prestador/${id}/avaliacoes`;
  const response = await fetch(url);
  return response.json();
}

export async function alterarSenhaPrestador(id, senhaAtual, novaSenha) {
  const url = `${BASE_URL}/prestador/${id}/alterar-senha`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      senhaAtual,
      novaSenha
    })
  });
  return response.json();
}