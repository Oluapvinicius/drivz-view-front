import { apiFetch } from './api';

export async function inserirCliente(usuario) {
    return apiFetch('/cliente', {
        method: 'POST',
        body: JSON.stringify(usuario)
    });
}

export async function buscarClientePorId(id) {
    return apiFetch(`/cliente/${id}`);
}

export async function atualizarCliente(id, cliente) {
    return apiFetch(`/cliente/${id}`, {
        method: 'PUT',
        body: JSON.stringify(cliente)
    });
}

export async function buscarAvaliacaoCliente(id) {
    return apiFetch(`/avaliacoes/mediaCliente/${id}`);
}

export async function alterarSenhaCliente(id, senhaAtual, novaSenha) {
    return apiFetch(`/cliente/${id}/alterarsenha`, {
        method: 'PUT',
        body: JSON.stringify({ senhaAtual, novaSenha })
    });
}