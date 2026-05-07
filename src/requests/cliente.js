export async function inserirUsuarios(usuario) {
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