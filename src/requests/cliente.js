export async function inserirCliente(usuario) {
    const url = "http://localhost:8080/v1/drivez/cliente";
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario)
    });
    return response.json();
}

export async function buscarClientePorId(id) {
    const url = `http://localhost:8080/v1/drivez/cliente/${id}`;
    const response = await fetch(url, {
        method: "GET",
    });
    return response.json();
}

export async function atualizarCliente(id, cliente) {
    const url = `http://localhost:8080/v1/drivez/cliente/${id}`;
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cliente)
    });
    return response.json();
}