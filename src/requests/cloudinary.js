const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dplyyxixl/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'fotos_perfil';

export const uploadImagemCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(CLOUDINARY_URL, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Erro ao enviar imagem para o Cloudinary: ${response.status} ${text}`);
  }

  const data = await response.json();
  return data.secure_url;
};