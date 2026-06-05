export async function buscarCliente(id) {
  const url = `http://localhost:8080/v1/drivez/cliente/${id}`;
  const response = await fetch(url);
  return response.json();
}

export async function buscarPrestador(id) {
  const url = `http://localhost:8080/v1/drivez/prestador/${id}`;
  const response = await fetch(url);
  return response.json();
}