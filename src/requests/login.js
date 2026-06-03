import { userStorage } from '@/utils/userStorage';

// export async function loginApi(usuario, senha) {
//   const response = await fetch('http://localhost:8080/v1/drivez/login', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ email: usuario, senha: senha })
//   });
//   const data = await response.json();
  
//   if (Object(data).hasOwnProperty('id_cliente')) {
//     const clienteId = data.id || data.id_cliente;
//     userStorage.setClienteId(clienteId);
//     userStorage.setClienteData(data);
//   }else{
//     const prestadorId = data.id || data.id_prestador;
//     userStorage.setPrestadorId(prestadorId);
//     userStorage.setPrestadorData(data);
//   }
  
//   return data;
// }

export async function loginApi(usuario, senha) {
  const response = await fetch('http://localhost:8080/v1/drivez/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: usuario, senha: senha })
  });

  if (!response.ok) {
    const dadosErro = await response.json().catch(() => ({}));
    throw new Error(dadosErro.message || 'Erro ao realizar login.');
  }

  return await response.json();
}