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

// ========== EMERGÊNCIA ENDPOINTS ==========

export async function listarEmergenciasPendentes() {
    const url = "http://localhost:8080/v1/drivez/emergencias";
    const response = await fetch(url, {
        method: "GET",
    });
    return response.json();
}

export async function buscarEmergenciaPendente(idPrestador) {
    const url = `http://localhost:8080/v1/drivez/emergencias/pendente/${idPrestador}`;
    const response = await fetch(url, {
        method: "GET",
    });
    return response.json();
}

export async function aceitarEmergencia(idPedido, idPrestador) {
    const url = `http://localhost:8080/v1/drivez/emergencias/aceitar/${idPedido}/${idPrestador}`;
    const response = await fetch(url, {
        method: "POST",
    });
    return response.json();
}

export async function solicitarEmergencia(dadosEmergencia) {
    const url = "http://localhost:8080/v1/drivez/pedido";
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosEmergencia)
    });
    return response.json();
}

export async function verificarEmergenciaPrestador(idPedido) {
    const url = `http://localhost:8080/v1/drivez/pedido/${idPedido}`;
    const response = await fetch(url, {
        method: "GET",
    });
    return response.json();
}
