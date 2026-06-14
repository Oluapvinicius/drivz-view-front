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
      <div class="profile-screen__finalize-text">Finalize seu cadastro: insira uma imagem de perfil, CPF/CNPJ e telefone.</div>
      <div class="profile-screen__finalize-actions">
        <button class="profile-screen__button profile-screen__button--primary" @click="salvarAlteracoes">Salvar</button>
      </div>
    </div>

    <div class="profile-screen__content">
      <div v-if="!dadosCarregados" class="profile-screen__loading">
        <div class="profile-screen__spinner"></div>
        <p>Carregando perfil...</p>
      </div>

      <template v-else>
      <div class="profile-screen__panel profile-screen__panel--left">
        <div class="profile-screen__photo-card">
          <div class="profile-screen__image-wrap" @click="triggerImageInput">
            <img :src="avatarSrc" alt="Perfil" class="profile-screen__avatar" />
            <div v-if="enviandoImagem" class="profile-screen__image-loading">
              <span>Enviando...</span>
            </div>
          </div>
          <button class="profile-screen__button profile-screen__button--outline" @click="triggerImageInput" style="width: 100%; margin-top: 12px;">
            Alterar Foto
          </button>
          <div class="profile-screen__name-block">
            <div class="profile-screen__rating-stars">
              <span v-for="n in 5" :key="n" class="star-icon" :class="{ fill: n <= avaliacaoExibicao }">★</span>
            </div>
            <h3>{{ form.nome }}</h3>
            <p class="profile-screen__categoria">{{ form.categoria }}</p>
          </div>
        </div>
      </div>

      <div class="profile-screen__panel profile-screen__panel--right">
        <!-- DADOS PESSOAIS -->
        <div class="profile-screen__section-header">
          <h4>Dados Pessoais</h4>
        </div>

        <div class="profile-screen__form">
          <div class="profile-screen__field profile-screen__field--full">
            <label class="profile-screen__field-label">Nome</label>
            <input type="text" placeholder="Nome do prestador" v-model="form.nome" />
          </div>

          <div class="profile-screen__field profile-screen__field--full">
            <label class="profile-screen__field-label">Categoria de Serviço</label>
            <input type="text" placeholder="Ex: Mecânico, Pintor, Encanador" v-model="form.categoria" />
          </div>

          <div class="profile-screen__field profile-screen__field--half">
            <label class="profile-screen__field-label">CPF/CNPJ</label>
            <input
              type="text"
              placeholder="CPF ou CNPJ"
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
            <label class="profile-screen__field-label">Nº de registro (CNH)</label>
            <input
              type="text"
              placeholder="Número da CNH"
              v-model="form.cnh"
            />
          </div>

          <!-- <div class="profile-screen__field profile-screen__field--half">
            <label class="profile-screen__field-label">Data de Validade</label>
            <input
              type="date"
              v-model="form.data_validade"
              :class="{ 'profile-screen__field-invalid': form.data_validade && !dataValidadeValida }"
            />
            <span v-if="form.data_validade && !dataValidadeValida" class="profile-screen__field-error">
              A CNH está vencida
            </span>
          </div> -->

          <div class="profile-screen__field profile-screen__field--half">
            <label class="profile-screen__field-label">Telefone</label>
            <input
              type="text"
              placeholder="Telefone"
              v-model="form.telefone"
              @input="handleTelefoneInput"
              @blur="formatarTelefoneOnBlur"
              :class="{ 'profile-screen__field-invalid': form.telefone && !telefoneValido }"
            />
            <span v-if="form.telefone && !telefoneValido" class="profile-screen__field-error">
              (XX) XXXXX-XXXX
            </span>
          </div>

          <div class="profile-screen__field profile-screen__field--full">
            <label class="profile-screen__field-label">Email</label>
            <input type="email" placeholder="seu@email.com" v-model="form.email" readonly class="profile-screen__field-readonly" />
          </div>
        </div>

     
        <div class="profile-screen__section-header" style="margin-top: 32px;">
          <h4>Descrição Profissional</h4>
        </div>

        <div class="profile-screen__form">
          <div class="profile-screen__field profile-screen__field--full">
            <textarea
              placeholder="Descreva sua experiência, especialidades, horários de atendimento e qualquer informação importante sobre seus serviços..."
              v-model="form.descricao"
              rows="6"
              class="profile-screen__field-textarea"
            ></textarea>
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
      </template>
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
import { buscarPrestadorPorId, atualizarPrestador, alterarSenhaPrestador, buscarAvaliacaoPrestador } from '@/requests/buscarUsuarios';
import { userStorage } from '@/utils/userStorage';
import { computed, onBeforeUnmount, ref, reactive, onMounted } from 'vue';
import defaultProfile from '@/assets/profile.svg';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import { uploadImagemCloudinary } from '@/requests/cloudinary';

const emit = defineEmits(['back']);
const router = useRouter();

const goBack = () => router.back();

const showPassword    = ref(false);
const senhaAtual      = ref('');
const novaSenha       = ref('');
const confirmaSenha   = ref('');
const forcaSenha      = ref('fraca');
const carregandoSenha = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
  if (!showPassword.value) cancelarAlteracaoSenha();
};

const prestadorId = userStorage.getUserId();
const userDataStorage = userStorage.getUserData() || {};

const dispatchUserDataUpdated = (updatedData) => {
  window.dispatchEvent(new CustomEvent('userDataUpdated', { detail: updatedData }));
};

const estruturaDados = {
  nome:         '',
  categoria:    '',
  documento:    '',
  telefone:     '',
  email:        '',
  descricao:    '',
  profileImage: '',
  img_perfil:   '',
  cpf:          '',
  cnpj:         '',
  cnh:          '',
  data_validade:'',
  senha:        ''
};

const dadosIniciais = ref({ ...estruturaDados });
const form = reactive({ ...estruturaDados });

const fileInput         = ref(null);
const enviandoImagem    = ref(false);
const previewLocalImagem = ref('');

const triggerImageInput = () => {
  if (!fileInput.value) return;
  try { fileInput.value.value = ''; } catch (e) { /* ignore */ }
  fileInput.value.click();
};

const onImageSelected = async (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;


  const reader = new FileReader();
  reader.onload = (e) => { previewLocalImagem.value = e.target.result; };
  reader.readAsDataURL(file);

  enviandoImagem.value = true;
  try {
    const urlGerada = await uploadImagemCloudinary(file);


    form.profileImage = urlGerada;
    form.img_perfil   = urlGerada;

  } catch (error) {
    console.error(error);
    alert('Erro ao processar imagem de perfil. Tente novamente.');
    form.profileImage = dadosIniciais.value.profileImage;
    form.img_perfil   = dadosIniciais.value.img_perfil;
  } finally {
    previewLocalImagem.value = '';
    enviandoImagem.value     = false;
    if (fileInput.value) fileInput.value.value = '';
  }
};

const avatarSrc = computed(() =>
  previewLocalImagem.value || form.profileImage || defaultProfile
);

const formatarDocumento = (valor) => {
  const apenas = valor.replace(/\D/g, '');
  return apenas.length <= 11
    ? apenas.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    : apenas.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

const formatarTelefone = (valor) => {
  const apenas = valor.replace(/\D/g, '');
  return apenas.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
};

const handleDocumentoInput = () => {
  const digits = form.documento.replace(/\D/g, '');
  form.documento = digits.length > 14 ? digits.slice(0, 14) : digits;
};

const formatarDocumentoOnBlur = () => {
  form.documento = formatarDocumento(form.documento);
};

const handleTelefoneInput = () => {
  const digits = form.telefone.replace(/\D/g, '');
  form.telefone = digits.length > 11 ? digits.slice(0, 11) : digits;
};

const formatarTelefoneOnBlur = () => {
  form.telefone = formatarTelefone(form.telefone);
};

const documentoValido = computed(() => {
  const d = form.documento.replace(/\D/g, '');
  return d.length === 11 || d.length === 14;
});

const telefoneValido = computed(() => {
  return form.telefone.replace(/\D/g, '').length === 11;
});

const emailValido = computed(() => {
  return /^\S+@\S+\.\S+$/.test(form.email);
});

const nomeValido = computed(() => {
  return form.nome && form.nome.trim().length > 0;
});

const dataValidadeValida = computed(() => {
  if (!form.data_validade) return true;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dataSelecionada = new Date(form.data_validade + 'T00:00:00');
  return dataSelecionada >= hoje;
});

const podeSalvar = computed(() => {
  const temImagem = form.profileImage || dadosIniciais.value.profileImage;
  return (
    nomeValido.value &&
    emailValido.value &&
    documentoValido.value &&
    telefoneValido.value &&
    temImagem &&
    dataValidadeValida.value
  );
});

const mostrarFinalizarCadastro = computed(() =>
  !podeSalvar.value && !temAlteracao.value
);


const dadosCarregados = ref(false);
const avaliacao       = ref(null);
const avaliacaoExibicao = computed(() =>
  avaliacao.value === null ? 5 : avaliacao.value
);

onMounted(async () => {
  try {
    // Verificar se tem ID
    if (!prestadorId || prestadorId === 'undefined') {
      console.warn('PerfilPrestador: ID não encontrado no localStorage.');
      // Usar dados do localStorage como fallback
      const dados = {
        nome:         userDataStorage.nome         || userDataStorage.nome_prestador || '',
        categoria:    userDataStorage.categoria    || '',
        documento:    userDataStorage.cpf          || userDataStorage.cnpj || '',
        telefone:     userDataStorage.telefone     || '',
        email:        userDataStorage.email        || userDataStorage.email_prestador || '',
        descricao:    userDataStorage.descricao    || userDataStorage.descricao_profissional || '',
        profileImage: userDataStorage.img_perfil   || userDataStorage.foto || userDataStorage.imagem || '',
        img_perfil:   userDataStorage.img_perfil   || userDataStorage.foto || userDataStorage.imagem || '',
        cpf:          userDataStorage.cpf          || '',
        cnpj:         userDataStorage.cnpj         || '',
        cnh:          userDataStorage.cnh          || '',
        data_validade:userDataStorage.data_validade || '',
        senha:        ''
      };
      Object.assign(dadosIniciais.value, dados);
      Object.assign(form, dados);
      dadosCarregados.value = true;
      return;
    }

    // Buscar dados da API
    const usuario = await buscarPrestadorPorId(prestadorId);
    const response = usuario?.response || usuario || {};

    const dadosAPI = {
      nome:         response.nome          || userDataStorage.nome_prestador || '',
      categoria:    response.categoria     || userDataStorage.categoria || '',
      documento:    response.cpf           || response.cnpj || userDataStorage.cpf || userDataStorage.cnpj || '',
      telefone:     response.telefone      || userDataStorage.telefone || '',
      email:        response.email         || response.email_prestador || userDataStorage.email_prestador || '',
      descricao:    response.descricao     || response.descricao_profissional || userDataStorage.descricao_profissional || '',
      profileImage: response.img_perfil    || response.foto || response.imagem || userDataStorage.img_perfil || userDataStorage.foto || '',
      img_perfil:   response.img_perfil    || response.foto || response.imagem || userDataStorage.img_perfil || userDataStorage.foto || '',
      cpf:          response.cpf           || userDataStorage.cpf || '',
      cnpj:         response.cnpj          || userDataStorage.cnpj || '',
      cnh:          response.cnh           || userDataStorage.cnh || '',
      data_validade: response.data_validade 
        ? response.data_validade.split('T')[0] 
        : userDataStorage.data_validade || '',
      senha:        ''
    };

    // Guardar estado inicial
    Object.assign(dadosIniciais.value, dadosAPI);
    // Popular form com dados
    Object.assign(form, dadosAPI);
    // Atualizar localStorage
    userStorage.setSession(prestadorId, dadosAPI, 'prestador');

    // Carregar avaliação
    try {
      const metricsRes = await buscarAvaliacaoPrestador(prestadorId);
      if (metricsRes.status_code === 200 && metricsRes.response && typeof metricsRes.response.media === 'number') {
        avaliacao.value = Math.round(metricsRes.response.media);
      }
    } catch (error) {
      console.warn('Não foi possível carregar as métricas de avaliação:', error);
    }

  } catch (error) {
    console.error('Falha ao carregar dados do perfil:', error);
    alert('Erro ao carregar o perfil. Tente novamente.');
  } finally {
    dadosCarregados.value = true;
  }
});

const temAlteracao = computed(() => {
  if (!dadosCarregados.value) return false;

  const normalizar = (d) => ({
    nome:         d.nome,
    categoria:    d.categoria,
    documento:    d.documento.replace(/\D/g, ''),
    telefone:     d.telefone.replace(/\D/g, ''),
    email:        d.email,
    descricao:    d.descricao,
    profileImage: d.profileImage,
    img_perfil:   d.img_perfil,
    cnh:          d.cnh,
    data_validade:d.data_validade
  });

  return JSON.stringify(normalizar(form)) !== JSON.stringify(normalizar(dadosIniciais.value));
});


const salvarAlteracoes = async () => {
  if (!podeSalvar.value) {
    const erros = [];
    if (!nomeValido.value)       erros.push('Nome');
    if (!emailValido.value)      erros.push('Email');
    if (!documentoValido.value)  erros.push('CPF/CNPJ');
    if (!telefoneValido.value)   erros.push('Telefone');
    if (!dataValidadeValida.value) erros.push('Validade da CNH');
    if (!form.profileImage && !dadosIniciais.value.profileImage) erros.push('Foto de perfil');

    alert(erros.length > 0
      ? `Campos inválidos: ${erros.join(', ')}`
      : 'Preencha todos os campos corretamente antes de salvar.'
    );
    return;
  }

  if (!prestadorId) {
    alert('ID de prestador não encontrado. Faça login novamente.');
    return;
  }

  const documentoLimpo = form.documento.replace(/\D/g, '');
  const payload = {
    nome:         form.nome.trim(),
    categoria:    form.categoria.trim(),
    email:        form.email.trim(),
    telefone:     form.telefone.replace(/\D/g, ''),
    descricao:    form.descricao.trim(),
    img_perfil:   form.profileImage || form.img_perfil || dadosIniciais.value.img_perfil || '',
    cpf:          documentoLimpo.length === 11 ? documentoLimpo : null,
    cnpj:         documentoLimpo.length === 14 ? documentoLimpo : null,
    cnh:          form.cnh,
    data_validade:form.data_validade
  };

  try {
    const resposta = await atualizarPrestador(prestadorId, payload);
    console.log('Resposta do backend:', resposta);

    // Atualizar dados iniciais com os dados salvos
    const dadosSalvos = {
      nome:         form.nome,
      categoria:    form.categoria,
      documento:    form.documento,
      telefone:     form.telefone,
      email:        form.email,
      descricao:    form.descricao,
      profileImage: form.profileImage,
      img_perfil:   form.img_perfil,
      cpf:          form.cpf,
      cnpj:         form.cnpj,
      cnh:          form.cnh,
      data_validade:form.data_validade,
      localizacao:  dadosIniciais.value.localizacao || userDataStorage.localizacao || '',
      senha:        ''
    };

    // Sincronizar estado
    Object.assign(dadosIniciais.value, dadosSalvos);
    userStorage.setSession(prestadorId, dadosSalvos, 'prestador');
    dispatchUserDataUpdated(dadosSalvos);

    previewLocalImagem.value = '';

    alert('✓ Perfil atualizado com sucesso!');
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
    forcaSenha.value = (/\d/.test(senha) && /[A-Z]/.test(senha)) ? 'forte' : 'media';
  } else {
    const temNum  = /\d/.test(senha);
    const temMai  = /[A-Z]/.test(senha);
    const temEsp  = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha);
    forcaSenha.value = (temNum && temMai && temEsp)
      ? 'muito-forte'
      : (temNum && temMai) ? 'forte' : 'media';
  }
};

const textoForca = computed(() => ({
  'fraca':       '❌ Fraca',
  'media':       '⚠️ Média',
  'forte':       '✓ Forte',
  'muito-forte': '✓✓ Muito Forte'
}[forcaSenha.value] || 'Fraca'));

const podeAlterarSenha = computed(() =>
  senhaAtual.value.length > 0 &&
  novaSenha.value.length >= 6 &&
  confirmaSenha.value === novaSenha.value &&
  (forcaSenha.value === 'forte' || forcaSenha.value === 'muito-forte')
);

const cancelarAlteracaoSenha = () => {
  senhaAtual.value    = '';
  novaSenha.value     = '';
  confirmaSenha.value = '';
  forcaSenha.value    = 'fraca';
  showPassword.value  = false;
};

const salvarNovaSenha = async () => {
  if (!podeAlterarSenha.value) {
    alert('Preencha todos os campos corretamente. A nova senha deve ser forte.');
    return;
  }
  if (!prestadorId) {
    alert('ID de prestador não encontrado. Faça login novamente.');
    return;
  }

  carregandoSenha.value = true;
  try {
    const resultado = await alterarSenhaPrestador(prestadorId, senhaAtual.value, novaSenha.value);
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
    setTimeout(() => { chamarAtencaoCard.value = false; }, 500);
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
onBeforeUnmount(() => window.removeEventListener('beforeunload', bolarFecharAba));
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

.profile-screen__loading {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 400px;
  color: #666;
  font-size: 16px;
}

.profile-screen__spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f0f0f0;
  border-top-color: #d62828;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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
  position: relative;
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

.profile-screen__image-loading {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.profile-screen__name-block h3 {
  margin: 8px 0 4px;
  font-size: 22px;
  font-weight: 700;
  color: #1b263b;
  text-align: center;
}

.profile-screen__categoria {
  margin: 0;
  font-size: 14px;
  color: #666;
  text-align: center;
  font-weight: 500;
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
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.profile-screen__section-header {
  padding-bottom: 16px;
  border-bottom: 2px solid #d62828;
  margin-bottom: 24px;
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
  gap: 8px;
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

.profile-screen__field input,
.profile-screen__field textarea {
  width: 100%;
  border-radius: 10px;
  border: 2px solid #e0e0e0;
  background: #fafafa;
  padding: 0 16px;
  color: #1b263b;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
}

.profile-screen__field input {
  height: 48px;
}

.profile-screen__field-textarea {
  padding: 14px 16px;
  resize: vertical;
  min-height: 120px;
}

.profile-screen__field input:focus,
.profile-screen__field textarea:focus {
  border-color: #d62828;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(214, 40, 40, 0.15);
}

.profile-screen__field input.profile-screen__field-invalid {
  background: #ffe6e6;
  border: 1.5px solid #d62828;
}

.profile-screen__field input::placeholder,
.profile-screen__field textarea::placeholder {
  color: #94a3b8;
}

.profile-screen__field-readonly {
  background: #edf2f7 !important;
  color: #5f6c7b !important;
  border: 1px solid #cbd5e1 !important;
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
}

.profile-screen__strength-fill.profile-screen__strength-hidden {
  display: none;
}

.profile-screen__strength-fraca      { width: 25%;  background: #d62828; }
.profile-screen__strength-media      { width: 50%;  background: #f08030; }
.profile-screen__strength-forte      { width: 75%;  background: #10b981; }
.profile-screen__strength-muito-forte{ width: 100%; background: linear-gradient(90deg, #047857, #10b981); }

.profile-screen__strength-text {
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 2px;
}

.profile-screen__strength-text-fraca        { color: #d62828; }
.profile-screen__strength-text-media        { color: #f08030; }
.profile-screen__strength-text-forte,
.profile-screen__strength-text-muito-forte  { color: #10b981; }

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
  z-index: 10;
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
  .profile-screen__panel--left { padding-right: 80px; }
  .profile-screen__image-wrap  { width: 300px; height: 300px; }
  .profile-screen__avatar      { width: 100%; height: 100%; }
  .profile-screen__name-block h3 { font-size: 38px; }
  .profile-screen__rating-stars .star-icon { width: 32px; height: 32px; font-size: 32px; }
  .profile-screen__form { max-width: 900px; gap: 32px; }
  .profile-screen__field input,
  .profile-screen__field select { height: 60px; font-size: 22px; padding: 0 28px; }
  .profile-screen__button { font-size: 22px; padding: 16px 32px; }
  .profile-screen__section-header h4 { font-size: 28px; }
}

@media (min-width: 2560px) {
  .profile-screen__content {
    grid-template-columns: 600px 1fr;
    gap: 120px;
    padding: 120px 320px 64px;
  }
  .profile-screen__panel--left { padding-right: 120px; }
  .profile-screen__image-wrap  { width: 420px; height: 420px; }
  .profile-screen__name-block h3 { font-size: 54px; }
  .profile-screen__rating-stars .star-icon { width: 48px; height: 48px; font-size: 48px; }
  .profile-screen__form { max-width: 1400px; gap: 48px; }
  .profile-screen__field input,
  .profile-screen__field select { height: 90px; font-size: 32px; padding: 0 48px; }
  .profile-screen__button { font-size: 32px; padding: 24px 48px; }
  .profile-screen__section-header h4 { font-size: 38px; }
}
</style>