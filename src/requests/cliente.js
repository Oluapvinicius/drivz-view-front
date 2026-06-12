const BASE_URL = "https://backend-drivez-atgfavb2cuccgrah.eastus2-01.azurewebsites.net/v1/drivez";

export async function inserirCliente(usuario) {
    const url = `${BASE_URL}/cliente`;
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
    const url = `${BASE_URL}/cliente/${id}`;
    const response = await fetch(url, {
        method: "GET",
    });
    return response.json();
}

export async function atualizarCliente(id, cliente) {
    const url = `${BASE_URL}/cliente/${id}`;
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cliente)
    });
    return response.json();
}

export async function buscarAvaliacaoCliente(id) {
    const url = `${BASE_URL}/avaliacoes/mediaCliente/${id}`;
    const response = await fetch(url, {
        method: "GET",
    });
    return response.json();
}

export async function alterarSenhaCliente(id, senhaAtual, novaSenha) {
    const url = `${BASE_URL}/cliente/${id}/alterarsenha`;
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            senhaAtual: senhaAtual,
            novaSenha: novaSenha
        })
    });
    return response.json();
}