import { apiFetch } from './api.js';

/**
 * Listar clientes com mensagens não lidas para um prestador
 */
export const listarMensagensNaoLidas = async (id_prestador) => {
    try {
        const response = await apiFetch(`/mensagem/prestador/${id_prestador}/nao-lidas`, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.error('Erro ao listar mensagens não lidas:', error);
        throw error;
    }
};

/**
 * Enviar nova mensagem via REST
 */
export const enviarMensagem = async (mensagem) => {
    try {
        const response = await apiFetch('/mensagem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mensagem)
        });
        return response;
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        throw error;
    }
};

/**
 * Marcar mensagens como lidas
 */
export const marcarComoLida = async (id_prestador, id_cliente) => {
    try {
        const response = await apiFetch('/mensagem/marcar-lida', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_prestador, id_cliente })
        });
        return response;
    } catch (error) {
        console.error('Erro ao marcar como lida:', error);
        throw error;
    }
};

/**
 * Buscar histórico de mensagens entre prestador e cliente (por pedido)
 */
export const buscarHistoricoMensagens = async (id_pedido) => {
    try {
        const response = await apiFetch(`/mensagem?id_pedido=${id_pedido}`, {
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.error('Erro ao buscar histórico de mensagens:', error);
        throw error;
    }
};
