/* Utilitários compartilhados: chamadas à API e sessão (token JWT). */
const TOKEN_KEY = 'academia.token';
const USUARIO_KEY = 'academia.usuario';

const sessao = {
  token: () => localStorage.getItem(TOKEN_KEY),
  usuario: () => {
    try { return JSON.parse(localStorage.getItem(USUARIO_KEY)); } catch { return null; }
  },
  salvar(token, usuario) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
  },
  limpar() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
  }
};

class ApiError extends Error {
  constructor(mensagem, status) {
    super(mensagem);
    this.status = status;
  }
}

/**
 * Chama a API. Com auth=true envia o Bearer token; se o servidor responder 401,
 * a sessão expirou e o usuário volta para o login.
 */
async function api(caminho, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) headers.Authorization = `Bearer ${sessao.token()}`;

  let resposta;
  try {
    resposta = await fetch(`/api${caminho}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor. Confira se a API está rodando (npm start).', 0);
  }

  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    if (auth && resposta.status === 401) {
      sessao.limpar();
      window.location.replace('/index.html?expirou=1');
    }
    throw new ApiError(dados.mensagem || 'Algo deu errado. Tente novamente.', resposta.status);
  }
  return dados;
}

/** Cria elementos de forma segura (usa textContent, nunca innerHTML). */
function el(tag, props = {}, ...filhos) {
  const node = document.createElement(tag);
  for (const [chave, valor] of Object.entries(props)) {
    if (valor === false || valor == null) continue;
    if (chave === 'class') node.className = valor;
    else if (chave === 'text') node.textContent = valor;
    else if (chave.startsWith('on')) node.addEventListener(chave.slice(2), valor);
    else node.setAttribute(chave, valor === true ? '' : valor);
  }
  for (const filho of filhos.flat()) {
    if (filho == null || filho === false) continue;
    node.append(filho.nodeType ? filho : document.createTextNode(String(filho)));
  }
  return node;
}
