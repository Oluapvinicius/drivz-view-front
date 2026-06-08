export async function buscarCliente(id) {
  const url = `http://localhost:8080/v1/drivez/cliente/${id}`;
  const response = await fetch(url);
  return response.json();
}

export async function buscarPrestador(id) {
  const url = `http://localhost:8080/v1/drivez/prestador/${id}`;
  const response = await fetch(url);
  return response.json();
}

export async function buscarPrestadorPorId(id) {
  const url = `http://localhost:8080/v1/drivez/prestador/${id}`;
  const response = await fetch(url);
  return response.json();
}

export async function atualizarPrestador(id, dados) {
  const url = `http://localhost:8080/v1/drivez/prestador/${id}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  return response.json();
}

export async function buscarAvaliacaoPrestador(id) {
  const url = `http://localhost:8080/v1/drivez/prestador/${id}/avaliacoes`;
  const response = await fetch(url);
  return response.json();
}

export async function alterarSenhaPrestador(id, senhaAtual, novaSenha) {
  const url = `http://localhost:8080/v1/drivez/prestador/${id}/alterar-senha`;
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