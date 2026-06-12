const BASE_URL = "https://backend-drivez-atgfavb2cuccgrah.eastus2-01.azurewebsites.net/v1/drivez";

export async function inserirPrestador(prestador) {
    const url = `${BASE_URL}/prestador`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(prestador)
    });
    return response.json();
}

export async function prestadoresGuincho() {
    const url = `${BASE_URL}/prestador/categoria/guincho`;
    const response = await fetch(url, {
        method: "GET",
    });

    const dados = await response.json(); 
    console.log("Dados reais da API de emergência:", dados); 
    
    return dados;
}

export async function buscarPrestadorPorId(id) {
    const url = `${BASE_URL}/prestador/${id}`;
    const response = await fetch(url, {
        method: "GET",
    });
    return response.json();
}

export async function atualizarPrestador(id, prestador) {
    const url = `${BASE_URL}/prestador/${id}`;
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(prestador)
    });
    const dados = await response.json();
    console.log("Resposta da API de atualização:", dados);
    return dados;
}

export async function buscarAvaliacaoPrestador(id) {
    const url = `${BASE_URL}/avaliacoes/mediaPrestador/${id}`;
    const response = await fetch(url, {
        method: "GET",
    });
    return response.json();
}

export async function alterarSenhaPrestador(id, senhaAtual, novaSenha) {
    const url = `${BASE_URL}/prestador/${id}/alterarsenha`;
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

export async function listarPrestadores() {
    const url = `${BASE_URL}/prestador`;
    const response = await fetch(url, {
        method: "GET",
    });
    return response.json();
}