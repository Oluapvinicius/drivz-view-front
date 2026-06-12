const BASE_URL = "https://backend-drivez-atgfavb2cuccgrah.eastus2-01.azurewebsites.net/v1/drivez";

export async function loginApi(usuario, senha) {
  const url = `${BASE_URL}/login`;
  const response = await fetch(url, {
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