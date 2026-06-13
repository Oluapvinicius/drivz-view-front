export async function inserirPrestador(prestador) {
    const url = "http://localhost:8080/v1/drivez/prestador";
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
    const url = "http://localhost:8080/v1/drivez/prestador/categoria/guincho";
    const response = await fetch(url, {
        method: "GET",
    });

    const dados = await response.json(); 
    console.log("Dados reais da API de emergência:", dados); 
    
    return dados;
}

export async function buscarPrestadorPorId(id) {
    const url = `http://localhost:8080/v1/drivez/prestador/${id}`;
    const response = await fetch(url, {
        method: "GET",
    });
    return response.json();
}

export async function buscarEnderecosPrestador(id) {
    const url = `http://localhost:8080/v1/drivez/prestador-endereco/prestador/${id}`;
    const response = await fetch(url, {
        method: "GET",
    });
    return response.json();
}

export async function atualizarPrestador(id, prestador) {
    const url = `http://localhost:8080/v1/drivez/prestador/${id}`;
    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(prestador)
    });
    console.log("Resposta da API de atualização:", await response.json());
    return response.json();
}

export async function buscarAvaliacaoPrestador(id) {
    const url = `http://localhost:8080/v1/drivez/avaliacoes/mediaPrestador/${id}`;
    const response = await fetch(url, {
        method: "GET",
    });
    return response.json();
}

export async function alterarSenhaPrestador(id, senhaAtual, novaSenha) {
    const url = `http://localhost:8080/v1/drivez/prestador/${id}/alterarsenha`;
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
    const url = "http://localhost:8080/v1/drivez/prestador";
    const response = await fetch(url, {
        method: "GET",
    });
    return response.json();
}