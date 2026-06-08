import { apiFetch } from './api';

export async function inserirPrestador(prestador) {
    return apiFetch('/prestador', {
        method: 'POST',
        body: JSON.stringify(prestador)
    });
}

export async function prestadoresGuincho() {
    const dados = await apiFetch('/pedidos/guincho');
    console.log('Dados reais da API de emergência:', dados);
    return dados;
}