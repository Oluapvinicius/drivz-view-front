export async function loginApi(usuario, senha) {
  const response = await fetch('http://localhost:8080/v1/drivez/cliente/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: usuario, senha })
  });
  return response.json();
}