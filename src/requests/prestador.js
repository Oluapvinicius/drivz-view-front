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
    const url = "http://localhost:8080/v1/drivez/pedidos/guincho";
    const response = await fetch(url, {
        method: "GET",
    });
    
    // Converte para JSON primeiro e loga os dados reais!
    const dados = await response.json(); 
    console.log("Dados reais da API de emergência:", dados); 
    
    return dados;
}