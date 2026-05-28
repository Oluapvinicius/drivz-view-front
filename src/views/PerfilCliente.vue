<template>
  <section class="profile-screen">
    <div class="profile-screen__topbar">
      <button class="profile-screen__back" @click="goBack">
        <img src="../assets/arrow.png" alt="Voltar" class="profile-screen__back-icon" />
      </button>
      <span class="profile-screen__title">Meu Perfil</span>
    </div>

    <input ref="fileInput" type="file" accept="image/*" @change="onImageSelected" style="position:absolute;left:-9999px;" />

    <div v-if="mostrarFinalizarCadastro" class="profile-screen__finalize-card">
      <div class="profile-screen__finalize-text">Finalize seu cadastro: insira uma imagem de perfil, CPF e telefone.</div>
      <div class="profile-screen__finalize-actions">
        <button class="profile-screen__button profile-screen__button--primary" @click="salvarAlteracoes">Salvar</button>
      </div>
    </div>

    <div class="profile-screen__content">
      <div class="profile-screen__panel profile-screen__panel--left">
        <div class="profile-screen__photo-card">
          <div class="profile-screen__image-wrap" @click="triggerImageInput">
            <img :src="avatarSrc" alt="Perfil" class="profile-screen__avatar" />
          </div>
          <button class="profile-screen__button profile-screen__button--outline" @click="triggerImageInput">Alterar Foto</button>
          <div class="profile-screen__name-block">
            <div class="profile-screen__rating-stars">
              <span v-for="n in 5" :key="n" class="star-icon" :class="{ fill: n <= avaliacao }">★</span>
            </div>
            <h3>{{ form.nome }}</h3>
          </div>
        </div>
      </div>
      <div class="profile-screen__panel profile-screen__panel--right">
        <div class="profile-screen__section-header">
          <h4>Dados Pessoais</h4>
        </div>

        <div class="profile-screen__form">
          <div class="profile-screen__field profile-screen__field--full">
            <input type="text" placeholder="Nome do usuario" v-model="form.nome" />
          </div>
          <div class="profile-screen__field profile-screen__field--half">
            <input type="text" placeholder="CPF/CNPJ" v-model="form.documento" @input="handleDocumentoInput"
              :class="{ 'profile-screen__field-invalid': form.documento && !documentoValido }"
            />
            <span v-if="form.documento && !documentoValido" class="profile-screen__field-error">
              CPF (XXX.XXX.XXX-XX) ou CNPJ (XX.XXX.XXX/XXXX-XX)
            </span>
          </div>
          <div class="profile-screen__field profile-screen__field--half">
            <input type="text" placeholder="Telefone" v-model="form.telefone" @input="handleTelefoneInput"
              :class="{ 'profile-screen__field-invalid': form.telefone && !telefoneValido }"
            />
            <span v-if="form.telefone && !telefoneValido" class="profile-screen__field-error">
              Digite um telefone válido (XX) XXXXX-XXXX
            </span>
          </div>
          <div class="profile-screen__field profile-screen__field--full">
            <input type="email" placeholder="Email" v-model="form.email" />
          </div>
        </div>

        <button class="profile-screen__button profile-screen__button--outline" @click="togglePassword">
          {{ showPassword ? 'Cancelar Alteração' : 'Alterar Senha' }}
        </button>

        <div v-if="showPassword" class="profile-screen__password-card">
          <div class="profile-screen__password-title">Alterar a Senha de Usuario</div>
          <div class="profile-screen__password-form">
            <div class="profile-screen__field">
              <input type="password" placeholder="Senha Atual" />
            </div>
            <div class="profile-screen__field">
              <input type="password" placeholder="Nova Senha" />
            </div>
            <div class="profile-screen__password-warning">Senha fraca</div>
            <div class="profile-screen__field">
              <input type="password" placeholder="Confirme a Nova Senha" />
            </div>
          </div>
          <button class="profile-screen__button profile-screen__button--primary">
            Alterar Senha
          </button>
        </div>
      </div>
    </div>
    <div v-if="temAlteracao" class="profile-screen__confirm-card"
      :class="{ 'profile-screen__confirm-card--shaking': chamarAtencaoCard }">
      <p>Você possui alterações não salvas.</p>
      <div class="profile-screen__confirm-buttons">
        <button class="profile-screen__button profile-screen__button--outline" @click="descartarAlteracoes">
          Descartar
        </button>
        <button class="profile-screen__button profile-screen__button--primary" @click="salvarAlteracoes" :disabled="!podeSalvar">
          Salvar Alterações
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { buscarClientePorId, atualizarCliente, buscarAvaliacaoCliente } from '@/requests/cliente';
import { userStorage } from '@/utils/userStorage';
import { computed, onBeforeUnmount, ref, onMounted } from 'vue';
import defaultProfile from '@/assets/profile.svg';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import { uploadImagemCloudinary } from '@/requests/cloudinary'; 

const emit = defineEmits(['back']);
const router = useRouter();

const goBack = () => router.back();

const showPassword = ref(false);
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const dadosIniciais = ref({
  nome: 'Nome do Usuário',
  documento: '',
  telefone: '',
  email: '',
  profileImage: '',
  img_perfil: '',
  cpf: '',
  cnpj: '',
  senha: ''
});

const form = ref({ ...dadosIniciais.value });
const fileInput = ref(null);

const triggerImageInput = () => {
  if (!fileInput.value) return;
  // Reset value so selecting the same file again triggers change
  try {
    fileInput.value.value = '';
  } catch (e) {
    // ignore
  }
  // Click synchronously so browser treats it as a user gesture
  fileInput.value.click();
};

const enviandoImagem = ref(false);

const previewLocalImagem = ref('');

const onImageSelected = async (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    previewLocalImagem.value = e.target.result;
  };
  reader.readAsDataURL(file);

  enviandoImagem.value = true;
  try {
    const urlGerada = await uploadImagemCloudinary(file);
    
    form.value.profileImage = urlGerada;
    
  } catch (error) {
    console.error(error);
    alert('Erro ao processar imagem de perfil. Tente novamente.');
    form.value.profileImage = dadosIniciais.value.profileImage;
  } finally {
    previewLocalImagem.value = '';
    enviandoImagem.value = false;
    if (fileInput.value) fileInput.value.value = '';
  }
};

const avatarSrc = computed(() => {
  return previewLocalImagem.value || form.value.profileImage || defaultProfile;
});

const formatarDocumento = (valor) => {
  const apenas = valor.replace(/\D/g, '');
  if (apenas.length <= 11) {
    return apenas.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else {
    return apenas.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
};

const formatarTelefone = (valor) => {
  const apenas = valor.replace(/\D/g, '');
  return apenas.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
};

const handleDocumentoInput = () => {
  form.value.documento = formatarDocumento(form.value.documento);
};

const handleTelefoneInput = () => {
  form.value.telefone = formatarTelefone(form.value.telefone);
};

const validarDocumento = (doc) => {
  const apenasDigitos = doc.replace(/\D/g, '');
  return apenasDigitos.length === 11 || apenasDigitos.length === 14;
};

const validarTelefone = (tel) => {
  const apenasDigitos = tel.replace(/\D/g, '');
  return apenasDigitos.length === 11;
};

const validarEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

const documentoValido = computed(() => {
  return form.value.documento && validarDocumento(form.value.documento);
});

const telefoneValido = computed(() => {
  return form.value.telefone && validarTelefone(form.value.telefone);
});

const emailValido = computed(() => {
  return form.value.email && validarEmail(form.value.email);
});

const nomeValido = computed(() => {
  return form.value.nome && form.value.nome.trim().length > 0;
});

const podeSalvar = computed(() => {
  return nomeValido.value && emailValido.value && documentoValido.value && telefoneValido.value && form.value.profileImage;
});

const mostrarFinalizarCadastro = computed(() => {
  return !podeSalvar.value;
});

const dadosCarregados = ref(false);
const avaliacao = ref(0);

onMounted(async () => {
  try {
    const usuario = await buscarClientePorId(userStorage.getClienteId())
    // const avaliacaoResposta = await buscarAvaliacaoCliente(userStorage.getClienteId());
    // usuario.response.avaliacao = avaliacaoResposta.avaliacao || 0;
    console.log(usuario)

    const dadosFormatados = {
      nome: usuario.response.nome || '',
      documento: usuario.response.cpf || usuario.response.cnpj || '',
      telefone: usuario.response.telefone || '',
      email: usuario.response.email || '',
      profileImage: usuario.response.img_perfil || usuario.response.foto || usuario.response.imagem || '',
      img_perfil: usuario.response.img_perfil || usuario.response.foto || usuario.response.imagem || '',
      cpf: usuario.response.cpf || '',
      cnpj: usuario.response.cnpj || '',
      senha: usuario.response.senha || ''
    };

    dadosIniciais.value = { ...dadosFormatados };
    form.value = { ...dadosFormatados };
    dadosCarregados.value = true;
    // avaliacao.value = usuario.response.avaliacao
    console.log('Dados do perfil carregados:', form.value);

  } catch (error) {
    console.error('Falha ao carregar dados do perfil:', error);
  }
});

const temAlteracao = computed(() => {
  if (!dadosCarregados.value) return false;
  return JSON.stringify(form.value) !== JSON.stringify(dadosIniciais.value);
});


const salvarAlteracoes = async () => {
  if (!podeSalvar.value) {
    alert('Preencha todos os campos corretamente antes de salvar.');
    return;
  }

  const documentoLimpo = form.value.documento.replace(/\D/g, '');
  const payload = {
    nome: form.value.nome.trim(),
    email: form.value.email.trim(),
    telefone: form.value.telefone.replace(/\D/g, ''),
    img_perfil: form.value.profileImage,
    cpf: documentoLimpo.length === 11 ? documentoLimpo : '',
    cnpj: documentoLimpo.length === 14 ? documentoLimpo : '',
    senha: form.value.senha || dadosIniciais.value.senha || ''
  };

  console.log('Payload enviado para backend:', payload);

  try {
    const resposta = await atualizarCliente(userStorage.getClienteId(), payload);
    console.log('Resposta do backend:', resposta);
    dadosIniciais.value = { ...form.value };
    previewLocalImagem.value = '';
    dadosCarregados.value = true;
  } catch (error) {
    console.error('Erro ao salvar no backend:', error);
    alert('Falha ao salvar as alterações. Tente novamente.');
  }
};

const descartarAlteracoes = () => {
  form.value = { ...dadosIniciais.value };
};

const chamarAtencaoCard = ref(false);

onBeforeRouteLeave((to, from, next) => {
  if (temAlteracao.value) {
    chamarAtencaoCard.value = true;
    
    setTimeout(() => {
      chamarAtencaoCard.value = false;
    }, 500);

    next(false); 
  } else {
    next();
  }
});

const bolarFecharAba = (event) => {
  if (temAlteracao.value) {
    event.preventDefault();
    event.returnValue = '';
  }
};

window.addEventListener('beforeunload', bolarFecharAba);

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', bolarFecharAba);
});



</script>

<style scoped>
.profile-screen *,
.profile-screen *::before,
.profile-screen *::after {
  box-sizing: border-box;
}

.profile-screen {
  min-height: 100vh;
  width: 100%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 0;
  font-family: Arial, sans-serif;
}

.profile-screen__topbar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: #d62828;
  color: white;
  padding: 18px 32px 18px 80px;
  gap: 16px;

}

.profile-screen__finalize-card {
  position: fixed;
  top: 64px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 60;
  background: #efefef;
  border-radius: 8px;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
}

.profile-screen__finalize-text {
  font-weight: 600;
  font-size: 16px;
  color: #1B2D45;
  margin: 0;
}

.profile-screen__finalize-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  width: 100%;
  font-size: 14px;
}

.profile-screen__finalize-actions .profile-screen__button {
  font-size: .9rem;
}

.profile-screen__back {
  position: absolute;
  left: 32px;
  background: transparent;
  border: none;
  padding: 0;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.profile-screen__back-icon {
  width: 24px;
  height: 24px;
  filter: brightness(0) invert(1);
}

.profile-screen__title {
  font-size: 20px;
  font-weight: 700;
  padding-left: 20px;
}

.profile-screen__content {
  flex: 1;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 48px;
  padding: 40px 64px 24px;
}

.profile-screen__panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-screen__panel--left {
  align-items: center;
  border-right: 2px solid #d62828;
  padding-right: 48px;
}

.profile-screen__panel--right {
  align-items: flex-start;
}

.profile-screen__photo-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.profile-screen__image-wrap {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
}

.profile-screen__image-wrap:hover {
  opacity: 0.8;
  transform: scale(1.05);
}

.profile-screen__avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-screen__name-block h3 {
  margin: 8px 0 0;
  font-size: 20px;
  color: #111111;
  text-align: center;
}

.profile-screen__rating-stars {
  display: flex;
  justify-content: center;
  gap: 4px;
  color: #ffcc00;
}

.star-icon {
  width: 20px;
  height: 20px;
}

.star-icon.fill {
  fill: #ffcc00;
}

.profile-screen__section-header h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.profile-screen__form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
  max-width: 580px;
}

.profile-screen__field {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 4px;
}

.profile-screen__field-error {
  color: #d62828;
  font-size: 12px;
  font-weight: 600;
  margin-left: 4px;
}

.profile-screen__field--full {
  grid-column: span 2;
}

.profile-screen__field input {
  width: 100%;
  height: 44px;
  border-radius: 8px;
  border: none;
  background: #E8F0FE;
  padding: 0 16px;
  color: #555;
  font-size: 14px;
  outline: none;
  transition: background-color 0.2s, border 0.2s;
}

.profile-screen__field input.profile-screen__field-invalid {
  background: #ffe6e6;
  border: 1px solid #d62828;
}

.profile-screen__field input::placeholder {
  color: #7a7a7a;
}

.profile-screen__button {
  width: fit-content;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
}

.profile-screen__button:hover {
  opacity: 0.8;
}

.profile-screen__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.profile-screen__button--outline {
  background: white;
  color: #d62828;
  border: 1px solid #7a7a7a;
}

.profile-screen__button--primary {
  background: #d62828;
  color: white;
  align-self: flex-end;
  padding: 10px 24px;
  font-size: 14px;
  border-radius: 8px;
}

.profile-screen__password-card {
  background: white;
  border: 1px solid #d8d8d8;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
  width: 100%;
  max-width: 580px;
}

.profile-screen__password-title {
  font-size: 16px;
  font-weight: 700;
  color: #1b263b;
}

.profile-screen__password-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.profile-screen__password-warning {
  color: #d62828;
  font-size: 12px;
  font-weight: 700;
  margin-left: 4px;
}

.profile-screen__confirm-card {
  background: #efefef;
  border-radius: 8px;
  padding: 16px 24px;
  margin-top: 20px;
  width: 100%;
  max-width: 580px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-self: flex-end;
}

.profile-screen__confirm-card p {
  margin: 0;
  font-size: 20px;
  color: #1B2D45;
  font-weight: 600;
  align-self: center;
}

.profile-screen__confirm-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  font-size: 14px;
}

.profile-screen__confirm-card--shaking {
  animation: shakeEffect 0.4s ease-in-out;
  border-color: #d62828 !important;
  background: #f8d7da !important;
}

@keyframes shakeEffect {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}

@media (max-width: 900px) {
  .profile-screen__content {
    grid-template-columns: 1fr;
    padding: 24px;
  }

  .profile-screen__panel--left {
    border-right: none;
    border-bottom: 2px solid #d62828;
    padding-right: 0;
    padding-bottom: 32px;
  }
}

@media (max-width: 600px) {
  .profile-screen__form {
    grid-template-columns: 1fr;
  }

  .profile-screen__field--full,
  .profile-screen__field--half {
    grid-column: span 1;
  }

  .profile-screen__topbar {
    padding-left: 64px;
  }
}

@media (min-width: 1800px) {
  .profile-screen__content {
    grid-template-columns: 420px 1fr;
    gap: 80px;
    padding: 80px 180px 48px;
  }

  .profile-screen__panel--left {
    padding-right: 80px;
  }

  .profile-screen__image-wrap {
    width: 300px;
    height: 300px;
  }

  .profile-screen__avatar {
    width: 100%;
    height: 100%;
  }

  .profile-screen__name-block h3 {
    font-size: 38px;
  }

  .profile-screen__rating-stars .star-icon {
    width: 32px;
    height: 32px;
    font-size: 32px;
  }

  .profile-screen__form {
    max-width: 900px;
    gap: 32px;
  }

  .profile-screen__field input,
  .profile-screen__field select {
    height: 60px;
    font-size: 22px;
    padding: 0 28px;
  }

  .profile-screen__button {
    font-size: 22px;
    padding: 16px 32px;
  }

  .profile-screen__section-header h4 {
    font-size: 28px;
  }
}

@media (min-width: 2560px) {
  .profile-screen__content {
    grid-template-columns: 350px 1fr;
    gap: 42px;
    padding: 28px 168px 45px;
  }

  .profile-screen__panel--left {
    padding-right: 84px;
  }

  .profile-screen__image-wrap {
    width: 294px;
    height: 294px;
  }

  .profile-screen__name-block h3 {
    font-size: 38px;
  }

  .profile-screen__rating-stars .star-icon {
    width: 34px;
    height: 34px;
    font-size: 34px;
  }

  .profile-screen__form {
    max-width: 980px;
    gap: 34px;
  }

  .profile-screen__field input,
  .profile-screen__field select {
    height: 63px;
    font-size: 22px;
    padding: 0 34px;
  }

  .profile-screen__button {
    font-size: 22px;
    padding: 17px 34px;
  }

  .profile-screen__section-header h4 {
    font-size: 27px;
  }

  .profile-screen__topbar {
    padding: 28px 22px 22px 56px;
  }

  .profile-screen__title {
    font-size: 22px;
    font-weight: 700;
  }

  .profile-screen__back {
    height: 22px;
    width: 22px;
  }
}
</style>