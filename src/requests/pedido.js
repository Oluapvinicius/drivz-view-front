import { apiFetch } from './api';

export async function listarPedidos() {
    return apiFetch('/pedidos');
}

export async function criarPedido(pedido) {
    return apiFetch('/pedido', {
        method: 'POST',
        body: JSON.stringify(pedido)
    });
}

export async function atualizarStatusPedido(id, status) {
    return apiFetch(`/pedido/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    });
}

export async function buscarPedidoPorId(id) {
    return apiFetch(`/pedido/${id}`);
}