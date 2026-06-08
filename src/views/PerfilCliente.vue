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
            <input 
              type="text" 
              placeholder="CPF/CNPJ" 
              v-model="form.documento" 
              @input="handleDocumentoInput"
              @blur="formatarDocumentoOnBlur"
              :class="{ 'profile-screen__field-invalid': form.documento && !documentoValido }"
            />
            <span v-if="form.documento && !documentoValido" class="profile-screen__field-error">
              CPF (XXX.XXX.XXX-XX) ou CNPJ (XX.XXX.XXX/XXXX-XX)
            </span>
          </div>
          <div class="profile-screen__field profile-screen__field--half">
            <input 
              type="text" 
              placeholder="Telefone" 
              v-model="form.telefone" 
              @input="handleTelefoneInput"
              @blur="formatarTelefoneOnBlur"
              :class="{ 'profile-screen__field-invalid': form.telefone && !telefoneValido }"
            />
            <span v-if="form.telefone && !telefoneValido" class="profile-screen__field-error">
              Digite um telefone válido (XX) XXXXX-XXXX
            </span>
          </div>
          <div class="profile-screen__field profile-screen__field--full">
            <input type="email" placeholder="Email" v-model="form.email" readonly class="profile-screen__field-readonly" />
          </div>
        </div>

        <button class="profile-screen__button profile-screen__button--outline" @click="togglePassword">
          {{ showPassword ? 'Cancelar Alteração' : 'Alterar Senha' }}
        </button>

        <div v-if="showPassword" class="profile-screen__password-card">
          <div class="profile-screen__password-title">Alterar Senha</div>
          <div class="profile-screen__password-form">
            <div class="profile-screen__field">
              <label class="profile-screen__field-label">Senha Atual</label>
              <input 
                v-model="senhaAtual"
                type="password" 
                placeholder="Digite sua senha atual" 
                class="profile-screen__field-input"
              />
            </div>
            <div class="profile-screen__field">
              <label class="profile-screen__field-label">Nova Senha</label>
              <input 
                v-model="novaSenha"
                type="password" 
                placeholder="Digite uma nova senha"
                @input="atualizarIndicadorForca"
                class="profile-screen__field-input"
              />
              <div class="profile-screen__password-strength">
                <div class="profile-screen__strength-bar">
                  <div 
                    class="profile-screen__strength-fill"
                    :class="[
                      `profile-screen__strength-${forcaSenha}`,
                      { 'profile-screen__strength-hidden': !novaSenha }
                    ]"
                  ></div>
                </div>
                <span v-if="novaSenha" class="profile-screen__strength-text" :class="`profile-screen__strength-text-${forcaSenha}`">
                  {{ textoForca }}
                </span>
              </div>
            </div>
            <div class="profile-screen__field">
              <label class="profile-screen__field-label">Confirmar Nova Senha</label>
              <input 
                v-model="confirmaSenha"
                type="password" 
                placeholder="Confirme sua nova senha"
                class="profile-screen__field-input"
                :class="{ 'profile-screen__field-input-error': confirmaSenha && confirmaSenha !== novaSenha }"
              />
              <span v-if="confirmaSenha && confirmaSenha !== novaSenha" class="profile-screen__field-error">
                As senhas não conferem
              </span>
            </div>
          </div>
          <div class="profile-screen__password-actions">
            <button 
              class="profile-screen__button profile-screen__button--outline" 
              @click="cancelarAlteracaoSenha"
            >
              Cancelar
            </button>
            <button 
              class="profile-screen__button profile-screen__button--primary"
              @click="salvarNovaSenha"
              :disabled="!podeAlterarSenha || carregandoSenha"
            >
              {{ carregandoSenha ? 'Salvando...' : 'Alterar Senha' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="temAlteracao" class="profile-screen__confirm-banner" :class="{ 'profile-screen__confirm-banner--shaking': chamarAtencaoCard }">
      <div class="profile-screen__confirm-banner__content">
        <div>
          <strong>Alterações não salvas</strong>
          <p>Salve para manter seus dados atualizados.</p>
        </div>
        <div class="profile-screen__confirm-buttons">
          <button class="profile-screen__button profile-screen__button--outline" @click="descartarAlteracoes">
            Descartar
          </button>
          <button class="profile-screen__button profile-screen__button--primary" @click="salvarAlteracoes" :disabled="!podeSalvar">
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { buscarClientePorId, atualizarCliente, buscarAvaliacaoCliente, alterarSenhaCliente } from '@/requests/cliente';
import { userStorage } from '@/utils/userStorage';
import { computed, onBeforeUnmount, ref, reactive, onMounted } from 'vue';
import defaultProfile from '@/assets/profile.svg';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import { uploadImagemCloudinary } from '@/requests/cloudinary'; 

const emit = defineEmits(['back']);
const router = useRouter();

const goBack = () => router.back();

const showPassword = ref(false);
const togglePassword = () => {
  showPassword.value = !showPassword.value;
  if (!showPassword.value) {
    cancelarAlteracaoSenha();
  }
};

// Variáveis para trocar senha
const senhaAtual = ref('');
const novaSenha = ref('');
const confirmaSenha = ref('');
const forcaSenha = ref('fraca');
const carregandoSenha = ref(false);

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

const clienteId = userStorage.getClienteId();
const userDataStorage = userStorage.getUserData() || {};
const localProfileDefaults = {
  nome: userDataStorage.nome || userDataStorage.nome_cliente || '',
  documento: userDataStorage.cpf || userDataStorage.cnpj || userDataStorage.documento || '',
  telefone: userDataStorage.telefone || '',
  email: userDataStorage.email || userDataStorage.email_cliente || '',
  profileImage: userDataStorage.img_perfil || userDataStorage.foto || userDataStorage.imagem || '',
  img_perfil: userDataStorage.img_perfil || userDataStorage.foto || userDataStorage.imagem || '',
  cpf: userDataStorage.cpf || '',
  cnpj: userDataStorage.cnpj || '',
  senha: ''
};
const form = reactive({ ...dadosIniciais.value, ...localProfileDefaults });
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
    
    form.profileImage = urlGerada;
    
  } catch (error) {
    console.error(error);
    alert('Erro ao processar imagem de perfil. Tente novamente.');
    form.profileImage = dadosIniciais.value.profileImage;
  } finally {
    previewLocalImagem.value = '';
    enviandoImagem.value = false;
    if (fileInput.value) fileInput.value.value = '';
  }
};

const avatarSrc = computed(() => {
  return previewLocalImagem.value || form.profileImage || defaultProfile;
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
  // Apenas aceita números
  const apenasDigitos = form.documento.replace(/\D/g, '');
  
  // Limita a 14 caracteres (máximo do CNPJ)
  if (apenasDigitos.length > 14) {
    form.documento = apenasDigitos.slice(0, 14);
  } else {
    form.documento = apenasDigitos;
  }
};

const formatarDocumentoOnBlur = () => {
  // Formata quando sai do campo
  form.documento = formatarDocumento(form.documento);
};

const handleTelefoneInput = () => {
  // Apenas aceita números
  const apenasDigitos = form.telefone.replace(/\D/g, '');
  
  // Limita a 11 caracteres
  if (apenasDigitos.length > 11) {
    form.telefone = apenasDigitos.slice(0, 11);
  } else {
    form.telefone = apenasDigitos;
  }
};

const formatarTelefoneOnBlur = () => {
  // Formata quando sai do campo
  form.telefone = formatarTelefone(form.telefone);
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
  return form.documento && validarDocumento(form.documento);
});

const telefoneValido = computed(() => {
  return form.telefone && validarTelefone(form.telefone);
});

const emailValido = computed(() => {
  return form.email && validarEmail(form.email);
});

const nomeValido = computed(() => {
  return form.nome && form.nome.trim().length > 0;
});

const podeSalvar = computed(() => {
  // Permite salvar se tem imagem nova OU se tinha imagem anterior
  const temImagemValida = form.profileImage || dadosIniciais.value.profileImage;
  return nomeValido.value && emailValido.value && documentoValido.value && telefoneValido.value && temImagemValida;
});

const mostrarFinalizarCadastro = computed(() => {
  return !podeSalvar.value && !temAlteracao.value;
});

const dadosCarregados = ref(false);
const avaliacao = ref(0);

onMounted(async () => {
  try {
    dadosIniciais.value = { ...dadosIniciais.value, ...localProfileDefaults };
    Object.assign(form, dadosIniciais.value);

    if (!clienteId) {
      console.warn('PerfilCliente: clienteId não encontrado em localStorage. Usando dados locais se houver.');
      dadosCarregados.value = true;
      return;
    }

    const usuario = await buscarClientePorId(clienteId);
    const response = usuario?.response || usuario || {};

    const dadosFormatados = {
      nome: response.nome || response.nome_cliente || localProfileDefaults.nome || '',
      documento: response.cpf || response.cnpj || response.documento || localProfileDefaults.documento || '',
      telefone: response.telefone || localProfileDefaults.telefone || '',
      email: response.email || response.email_cliente || localProfileDefaults.email || '',
      profileImage: response.img_perfil || response.foto || response.imagem || localProfileDefaults.profileImage || '',
      img_perfil: response.img_perfil || response.foto || response.imagem || localProfileDefaults.img_perfil || '',
      cpf: response.cpf || localProfileDefaults.cpf || '',
      cnpj: response.cnpj || localProfileDefaults.cnpj || '',
      senha: ''
    };

    dadosIniciais.value = { ...dadosIniciais.value, ...dadosFormatados };
    Object.assign(form, dadosIniciais.value);
    dadosCarregados.value = true;

    const sessionPayload = { ...userDataStorage, ...dadosFormatados };
    userStorage.setSession(clienteId, sessionPayload, 'cliente');

    console.log('Dados do perfil carregados:', form);
  } catch (error) {
    console.error('Falha ao carregar dados do perfil:', error);
    dadosCarregados.value = true;
  }
});

const temAlteracao = computed(() => {
  if (!dadosCarregados.value) return false;
  
  // Normalizar dados para comparação (remove formatação)
  const normalizarDados = (dados) => ({
    nome: dados.nome,
    documento: dados.documento.replace(/\D/g, ''),
    telefone: dados.telefone.replace(/\D/g, ''),
    email: dados.email,
    profileImage: dados.profileImage,
    img_perfil: dados.img_perfil
  });
  
  return JSON.stringify(normalizarDados(form)) !== JSON.stringify(normalizarDados(dadosIniciais.value));
});


const salvarAlteracoes = async () => {
  if (!podeSalvar.value) {
    // Gerar mensagem de erro detalhada
    let erros = [];
    if (!nomeValido.value) erros.push('Nome');
    if (!emailValido.value) erros.push('Email');
    if (!documentoValido.value) erros.push('CPF/CNPJ');
    if (!telefoneValido.value) erros.push('Telefone');
    if (!form.profileImage && !dadosIniciais.value.profileImage) erros.push('Foto de perfil');
    
    const mensagem = erros.length > 0 
      ? `Campos inválidos: ${erros.join(', ')}`
      : 'Preencha todos os campos corretamente antes de salvar.';
    
    alert(mensagem);
    return;
  }

  if (!clienteId) {
    alert('ID de cliente não encontrado. Faça login novamente.');
    return;
  }

  const documentoLimpo = form.documento.replace(/\D/g, '');
  const payload = {
    nome: form.nome.trim(),
    email: form.email.trim(),
    telefone: form.telefone.replace(/\D/g, ''),
    img_perfil: form.profileImage || dadosIniciais.value.profileImage || '',
    cpf: documentoLimpo.length === 11 ? documentoLimpo : '',
    cnpj: documentoLimpo.length === 14 ? documentoLimpo : '',
    senha: ''
  };

  console.log('Payload enviado para backend:', payload);

  try {
    const resposta = await atualizarCliente(clienteId, payload);
    console.log('Resposta do backend:', resposta);

    const sessionPayload = { ...userDataStorage, ...payload };
    userStorage.setSession(clienteId, sessionPayload, 'cliente');

    dadosIniciais.value = { ...form };
    previewLocalImagem.value = '';
    dadosCarregados.value = true;
  } catch (error) {
    console.error('Erro ao salvar no backend:', error);
    alert('Falha ao salvar as alterações. Tente novamente.');
  }
};

const descartarAlteracoes = () => {
  Object.assign(form, dadosIniciais.value);
};

const atualizarIndicadorForca = () => {
  const senha = novaSenha.value;
  
  if (senha.length < 6) {
    forcaSenha.value = 'fraca';
  } else if (senha.length < 10) {
    const temNumero = /\d/.test(senha);
    const temLetraAlta = /[A-Z]/.test(senha);
    if (temNumero && temLetraAlta) {
      forcaSenha.value = 'forte';
    } else {
      forcaSenha.value = 'media';
    }
  } else {
    const temNumero = /\d/.test(senha);
    const temLetraAlta = /[A-Z]/.test(senha);
    const temEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha);
    if (temNumero && temLetraAlta && temEspecial) {
      forcaSenha.value = 'muito-forte';
    } else if (temNumero && temLetraAlta) {
      forcaSenha.value = 'forte';
    } else {
      forcaSenha.value = 'media';
    }
  }
};

const textoForca = computed(() => {
  const forca = {
    'fraca': '❌ Fraca',
    'media': '⚠️ Média',
    'forte': '✓ Forte',
    'muito-forte': '✓✓ Muito Forte'
  };
  return forca[forcaSenha.value] || 'Fraca';
});

const podeAlterarSenha = computed(() => {
  return (
    senhaAtual.value.length > 0 &&
    novaSenha.value.length >= 6 &&
    confirmaSenha.value === novaSenha.value &&
    (forcaSenha.value === 'forte' || forcaSenha.value === 'muito-forte')
  );
});

const cancelarAlteracaoSenha = () => {
  senhaAtual.value = '';
  novaSenha.value = '';
  confirmaSenha.value = '';
  forcaSenha.value = 'fraca';
  showPassword.value = false;
};

const salvarNovaSenha = async () => {
  if (!podeAlterarSenha.value) {
    alert('Preencha todos os campos corretamente. A nova senha deve ser forte.');
    return;
  }

  if (!clienteId) {
    alert('ID de cliente não encontrado. Faça login novamente.');
    return;
  }

  carregandoSenha.value = true;

  try {
    console.log('Alterando senha para clienteId:', clienteId);
    const resultado = await alterarSenhaCliente(clienteId, senhaAtual.value, novaSenha.value);

    console.log('Resposta da alteração de senha:', resultado);

    if (resultado.status_code === 200 || resultado.status === 200) {
      alert('✓ Senha alterada com sucesso!');
      cancelarAlteracaoSenha();
    } else {
      alert('❌ ' + (resultado.message || 'Erro ao alterar senha.'));
    }
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    alert('❌ Erro ao processar a alteração. Tente novamente.');
  } finally {
    carregandoSenha.value = false;
  }
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
  background: linear-gradient(135deg, #d62828 0%, #b02020 100%);
  color: white;
  padding: 18px 32px 18px 80px;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(214, 40, 40, 0.15);
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
  border: 1.5px solid #cbd5e1;
  background: #ffffff;
  padding: 0 16px;
  color: #1b263b;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
}

.profile-screen__field input:focus {
  border-color: #d62828;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(214, 40, 40, 0.1);
}

.profile-screen__field input.profile-screen__field-invalid {
  background: #ffe6e6;
  border: 1.5px solid #d62828;
}

.profile-screen__field input::placeholder {
  color: #94a3b8;
}

.profile-screen__field-readonly {
  background: #edf2f7;
  color: #5f6c7b;
  border: 1px solid #cbd5e1;
  cursor: not-allowed;
}

.profile-screen__button {
  width: fit-content;
  border-radius: 8px;
  padding: 10px 24px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.profile-screen__button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.profile-screen__button:active:not(:disabled) {
  transform: translateY(0);
}

.profile-screen__button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.profile-screen__button--outline {
  background: white;
  color: #d62828;
  border: 1.5px solid #d62828;
}

.profile-screen__button--outline:hover:not(:disabled) {
  background: #f8f8f8;
  border-color: #b02020;
}

.profile-screen__button--primary {
  background: linear-gradient(135deg, #d62828 0%, #b02020 100%);
  color: white;
  align-self: flex-end;
  padding: 11px 28px;
  font-size: 13px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(214, 40, 40, 0.2);
}

.profile-screen__button--primary:hover:not(:disabled) {
  box-shadow: 0 6px 16px rgba(214, 40, 40, 0.3);
}

.profile-screen__button--primary:active:not(:disabled) {
  background: linear-gradient(135deg, #b02020 0%, #8a1818 100%);
}

.profile-screen__password-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 12px;
  width: 100%;
  max-width: 580px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.3s;
}

.profile-screen__password-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.profile-screen__password-title {
  font-size: 18px;
  font-weight: 700;
  color: #1b263b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.profile-screen__password-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.profile-screen__field-label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
  display: block;
}

.profile-screen__field-input {
  width: 100%;
  height: 44px;
  border-radius: 8px;
  border: 1.5px solid #cbd5e1;
  background: #ffffff;
  padding: 0 14px;
  color: #1b263b;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  font-family: inherit;
}

.profile-screen__field-input:focus {
  border-color: #d62828;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(214, 40, 40, 0.1);
}

.profile-screen__field-input-error {
  border-color: #d62828;
  background: #ffe6e6;
}

.profile-screen__password-strength {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.profile-screen__strength-bar {
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

.profile-screen__strength-fill {
  height: 100%;
  width: 0%;
  transition: width 0.3s, background-color 0.3s;
  border-radius: 3px;
  background: linear-gradient(90deg, #d62828 0%, #f08030 100%);
}

.profile-screen__strength-fill.profile-screen__strength-hidden {
  display: none;
}

.profile-screen__strength-fraca {
  width: 25%;
  background: linear-gradient(90deg, #d62828 0%, #d62828 100%);
}

.profile-screen__strength-media {
  width: 50%;
  background: linear-gradient(90deg, #f08030 0%, #f08030 100%);
}

.profile-screen__strength-forte {
  width: 75%;
  background: linear-gradient(90deg, #10b981 0%, #10b981 100%);
}

.profile-screen__strength-muito-forte {
  width: 100%;
  background: linear-gradient(90deg, #047857 0%, #10b981 100%);
}

.profile-screen__strength-text {
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 2px;
}

.profile-screen__strength-text-fraca {
  color: #d62828;
}

.profile-screen__strength-text-media {
  color: #f08030;
}

.profile-screen__strength-text-forte,
.profile-screen__strength-text-muito-forte {
  color: #10b981;
}

.profile-screen__password-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}

.profile-screen__confirm-banner {
  position: sticky;
  bottom: 0;
  margin-top: 24px;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 16px 16px;
  z-index: 1;
}

.profile-screen__confirm-banner__content {
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 860px;
  border: 1px solid rgba(27, 38, 59, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 22px;
}

.profile-screen__confirm-banner__content strong {
  display: block;
  font-size: 1rem;
  color: #1b263b;
  margin-bottom: 4px;
}

.profile-screen__confirm-banner__content p {
  margin: 0;
  color: #475569;
  line-height: 1.5;
}

.profile-screen__confirm-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 14px;
}

.profile-screen__confirm-banner--shaking {
  animation: shakeEffect 0.4s ease-in-out;
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