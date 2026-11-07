const abas = {
  'entrar': { tab: document.getElementById('tab-entrar'), painel: document.getElementById('painel-entrar') },
  'criar-conta': { tab: document.getElementById('tab-criar-conta'), painel: document.getElementById('painel-criar-conta') }
};

const formLogin = document.getElementById('form-login');
const formCadastro = document.getElementById('form-cadastro');
const erroEntrar = document.getElementById('erro-entrar');
const erroCriar = document.getElementById('erro-criar');

// Já logado? Vai direto para a ficha (se o token estiver vencido, a ficha devolve para cá).
if (sessao.token()) window.location.replace('/ficha.html');

/* ---------- Abas ---------- */
function abrir(nome, { foco = false } = {}) {
  for (const [chave, { tab, painel }] of Object.entries(abas)) {
    const ativa = chave === nome;
    tab.setAttribute('aria-selected', String(ativa));
    tab.tabIndex = ativa ? 0 : -1;
    painel.hidden = !ativa;
  }
  if (foco) abas[nome].painel.querySelector('input').focus();
}

for (const [chave, { tab }] of Object.entries(abas)) {
  tab.addEventListener('click', () => { history.replaceState(null, '', `#${chave}`); abrir(chave); });
  tab.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const outra = chave === 'entrar' ? 'criar-conta' : 'entrar';
    abrir(outra); abas[outra].tab.focus();
  });
}
document.querySelectorAll('[data-abrir]').forEach(a => a.addEventListener('click', (e) => {
  e.preventDefault();
  history.replaceState(null, '', `#${a.dataset.abrir}`);
  abrir(a.dataset.abrir, { foco: true });
  document.querySelector('.auth').scrollIntoView({ block: 'center' });
}));
abrir(location.hash === '#criar-conta' ? 'criar-conta' : 'entrar');

/* ---------- Mostrar/ocultar senha ---------- */
document.querySelectorAll('[data-toggle]').forEach(botao => {
  const campos = botao.dataset.toggle.split(' ').map(id => document.getElementById(id));
  const plural = botao.textContent.includes('senhas');
  botao.addEventListener('click', () => {
    const mostrar = campos[0].type === 'password';
    campos.forEach(c => { c.type = mostrar ? 'text' : 'password'; });
    botao.textContent = mostrar ? (plural ? 'Ocultar senhas' : 'Ocultar') : (plural ? 'Mostrar senhas' : 'Mostrar');
    botao.setAttribute('aria-pressed', String(mostrar));
  });
});

/* ---------- Utilitários ---------- */
function mostrarErro(caixa, msg) { caixa.textContent = msg; caixa.hidden = false; }
function ocupado(botao, textoOcupado, ligado) {
  const rotulo = botao.querySelector('span');
  if (ligado) { botao.dataset.rotulo = rotulo.textContent; rotulo.textContent = textoOcupado; }
  else rotulo.textContent = botao.dataset.rotulo;
  botao.disabled = ligado;
}

if (new URLSearchParams(location.search).get('expirou')) {
  mostrarErro(erroEntrar, 'Sua sessão expirou. Entre novamente para ver sua ficha.');
}

/* ---------- Entrar ---------- */
formLogin.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  erroEntrar.hidden = true;

  const email = document.getElementById('login-email').value.trim();
  const campoSenha = document.getElementById('login-senha');
  const senha = campoSenha.value;
  if (!email || !senha) {
    mostrarErro(erroEntrar, 'Preencha o e-mail e a senha.');
    (email ? campoSenha : document.getElementById('login-email')).focus();
    return;
  }

  const botao = document.getElementById('btn-entrar');
  ocupado(botao, 'Entrando…', true);
  try {
    const { token, usuario } = await api('/auth/login', { method: 'POST', body: { email, senha }, auth: false });
    if (usuario.tipo !== 'ALUNO') {
      mostrarErro(erroEntrar, 'Esta área é exclusiva para alunos. Professores e administradores usam o sistema de gestão.');
      return;
    }
    sessao.salvar(token, usuario);
    window.location.replace('/ficha.html');
  } catch (e) {
    mostrarErro(erroEntrar, e.message);
    if (e.status === 401) { campoSenha.value = ''; campoSenha.focus(); }
  } finally {
    ocupado(botao, '', false);
  }
});

/* ---------- Criar conta ---------- */
formCadastro.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  erroCriar.hidden = true;

  const nome = document.getElementById('cad-nome').value.trim();
  const email = document.getElementById('cad-email').value.trim();
  const dataNascimento = document.getElementById('cad-nasc').value;
  const senha = document.getElementById('cad-senha').value;
  const senha2 = document.getElementById('cad-senha2').value;

  const problema =
    !nome ? ['Informe o seu nome.', 'cad-nome'] :
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? ['Informe um e-mail válido.', 'cad-email'] :
    senha.length < 6 ? ['A senha deve ter pelo menos 6 caracteres.', 'cad-senha'] :
    senha !== senha2 ? ['As senhas não são iguais.', 'cad-senha2'] : null;
  if (problema) {
    mostrarErro(erroCriar, problema[0]);
    document.getElementById(problema[1]).focus();
    return;
  }

  const botao = document.getElementById('btn-criar');
  ocupado(botao, 'Criando conta…', true);
  try {
    await api('/auth/register', {
      method: 'POST', auth: false,
      body: { nome, email, senha, ...(dataNascimento && { dataNascimento }) }
    });
    // Conta criada: já entra automaticamente
    const { token, usuario } = await api('/auth/login', { method: 'POST', body: { email, senha }, auth: false });
    sessao.salvar(token, usuario);
    sessionStorage.setItem('academia.novaConta', '1');
    window.location.replace('/ficha.html');
  } catch (e) {
    mostrarErro(erroCriar, e.message);
  } finally {
    ocupado(botao, '', false);
  }
});
