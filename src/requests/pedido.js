const BASE_URL = "https://backend-drivez-atgfavb2cuccgrah.eastus2-01.azurewebsites.net/v1/drivez";

export async function listarPedidos() {
    const url = `${BASE_URL}/pedidos`;
    const response = await fetch(url, {
        method: "GET",
    });
    return response.json();
}

export async function criarPedido(pedido) {
    const url = `${BASE_URL}/pedido`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(pedido)
    });
    return response.json();
}

export async function atualizarStatusPedido(id, status) {
    const url = `${BASE_URL}/pedido/${id}/status`;
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
    });
    return response.json();
}

export async function buscarPedidoPorId(id) {
    const url = `${BASE_URL}/pedido/${id}`;
    const response = await fetch(url, {
        method: "GET",
    });
    return response.json();
}