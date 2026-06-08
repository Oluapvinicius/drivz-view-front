import { userStorage } from '@/utils/userStorage';
import { apiFetch } from './api';

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
  return apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ email: usuario, senha: senha })
  });
}