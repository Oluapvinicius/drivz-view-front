export async function listarPedidos() {
    const url = "http://localhost:8080/v1/drivez/pedidos";
    const response = await fetch(url, {
        method: "GET",
    });
    return response.json();
}

export async function criarPedido(pedido) {
    const url = "http://localhost:8080/v1/drivez/pedido";
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
    const url = `http://localhost:8080/v1/drivez/pedido/${id}/status`;
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
    const url = `http://localhost:8080/v1/drivez/pedido/${id}`;
    const response = await fetch(url, {
        method: "GET",
    });
    return response.json();
}