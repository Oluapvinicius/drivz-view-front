import { userStorage } from '@/utils/userStorage';

export async function loginApi(usuario, senha) {
  const response = await fetch('http://localhost:8080/v1/drivez/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: usuario, senha })
  });
  const data = await response.json();
  
  if (data && (data.id || data.id_cliente)) {
    const clienteId = data.id || data.id_cliente;
    userStorage.setClienteId(clienteId);
    userStorage.setClienteData(data);
  }
  
  return data;
}