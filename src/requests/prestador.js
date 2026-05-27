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