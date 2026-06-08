import { apiFetch } from './api';

export async function buscarCliente(id) {
  return apiFetch(`/cliente/${id}`);
}

export async function buscarPrestador(id) {
  return apiFetch(`/prestador/${id}`);
}

export async function buscarPrestadorPorId(id) {
  return apiFetch(`/prestador/${id}`);
}

export async function atualizarPrestador(id, dados) {
  return apiFetch(`/prestador/${id}`, {
    method: 'PUT',
    body: JSON.stringify(dados)
  });
}

export async function buscarAvaliacaoPrestador(id) {
  return apiFetch(`/prestador/${id}/avaliacoes`);
}

export async function alterarSenhaPrestador(id, senhaAtual, novaSenha) {
  return apiFetch(`/prestador/${id}/alterar-senha`, {
    method: 'PUT',
    body: JSON.stringify({ senhaAtual, novaSenha })
  });
}