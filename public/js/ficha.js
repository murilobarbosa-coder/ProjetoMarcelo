const topo = document.getElementById('topo');
const conteudo = document.getElementById('conteudo');

const usuarioLogado = sessao.usuario();
if (!sessao.token() || !usuarioLogado) {
  sessao.limpar();
  window.location.replace('/index.html');
}

document.getElementById('nome-topo').textContent = usuarioLogado ? usuarioLogado.nome : '';
document.getElementById('btn-sair').addEventListener('click', sair);

function sair() {
  sessao.limpar();
  window.location.replace('/index.html');
}

/* ---------- Formatação ---------- */
const dataBR = (valor) => {
  if (!valor) return '';
  const d = new Date(valor);
  return isNaN(d) ? '' : d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
};
const numeroBR = (n) => Number(n).toLocaleString('pt-BR', { maximumFractionDigits: 2 });
const iniciais = (nome) => nome.trim().split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;

/* ---------- Componentes ---------- */
function banner(aluno, fichas) {
  const totalEx = fichas.reduce((s, f) => s + (f.exercicios || []).length, 0);
  return el('section', { class: 'banner on-ink', 'aria-label': 'Resumo do aluno' },
    el('div', { class: 'banner-in' },
      el('div', {},
        el('h1', { class: 'display', text: `Olá, ${aluno.nome.split(' ')[0]}` }),
        el('p', { class: 'lead', text: fichas.length ? 'Escolha o treino de hoje e confira cada exercício.' : 'Sua área de treino.' })
      ),
      el('dl', { class: 'tiles' },
        el('div', { class: 'tile' }, el('dt', { text: 'Matrícula' }), el('dd', { text: aluno.matricula })),
        el('div', { class: 'tile' }, el('dt', { text: 'Plano' }), el('dd', {}, el('span', { class: 'badge', text: aluno.planoAtivo ? 'Ativo' : 'Inativo' }))),
        el('div', { class: 'tile' }, el('dt', { text: 'Fichas' }), el('dd', { text: fichas.length })),
        el('div', { class: 'tile' }, el('dt', { text: 'Exercícios' }), el('dd', { text: totalEx }))
      )
    )
  );
}

function cartaoExercicio(ex, indice) {
  const temCarga = ex.cargaKg !== null && ex.cargaKg !== undefined;
  return el('li', { class: 'ex-card' },
    el('span', { class: 'ex-n', 'aria-hidden': 'true', text: String(indice + 1).padStart(2, '0') }),
    el('h3', { class: 'display', text: ex.nome }),
    el('div', { class: 'ex-stats' },
      el('div', {}, el('div', { class: 'v', text: ex.series }), el('div', { class: 'l', text: ex.series === 1 ? 'Série' : 'Séries' })),
      el('div', {}, el('div', { class: 'v', text: ex.repeticoes }), el('div', { class: 'l', text: ex.repeticoes === 1 ? 'Repetição' : 'Repetições' })),
      temCarga
        ? el('div', {}, el('div', { class: 'v' }, numeroBR(ex.cargaKg), el('small', { text: 'kg' })), el('div', { class: 'l', text: 'Carga' }))
        : el('div', {}, el('div', { class: 'v none', text: '—' }), el('div', { class: 'l', text: 'Sem carga definida' }))
    )
  );
}

function cartaoProfessor(instrutor) {
  return el('section', { class: 'prof-card on-ink', 'aria-label': 'Professor responsável' },
    el('p', { class: 'lbl', text: 'Professor responsável' }),
    el('div', { class: 'prof-top' },
      el('div', { class: instrutor ? 'avatar' : 'avatar empty', 'aria-hidden': 'true', text: instrutor ? iniciais(instrutor.nome) : '?' }),
      el('p', { class: 'name display', text: instrutor ? instrutor.nome : 'Não informado' })
    ),
    instrutor
      ? (instrutor.email && el('a', { href: `mailto:${instrutor.email}`, text: instrutor.email }))
      : el('p', { class: 'lbl', style: 'margin-top:14px', text: 'Pergunte na recepção quem montou este treino.' })
  );
}

function cartaoResumo(ficha) {
  const exercicios = ficha.exercicios || [];
  const totalSeries = exercicios.reduce((s, ex) => s + ex.series, 0);
  return el('section', { class: 'summary', 'aria-label': 'Resumo da ficha' },
    el('h3', { class: 'display', text: 'Resumo da ficha' }),
    el('dl', {},
      el('div', {}, el('dt', { text: 'Exercícios' }), el('dd', { text: exercicios.length })),
      el('div', {}, el('dt', { text: 'Séries no total' }), el('dd', { text: totalSeries })),
      ficha.createdAt && el('div', {}, el('dt', { text: 'Criada em' }), el('dd', { text: new Date(ficha.createdAt).toLocaleDateString('pt-BR') }))
    ),
    ficha.observacoes && el('div', { class: 'obs' },
      el('p', { class: 'lbl', text: 'Observações do professor' }),
      el('p', { text: ficha.observacoes })
    ),
    el('button', { class: 'btn btn-ghost dark skew', type: 'button', onclick: () => window.print() }, el('span', { text: 'Imprimir ficha' }))
  );
}

function estado(titulo, texto, botao) {
  return el('section', { class: 'state' }, el('h2', { class: 'display', text: titulo }), el('p', { text: texto }), botao);
}

/* ---------- Tela ---------- */
function montar({ aluno, fichas }) {
  topo.replaceChildren(banner(aluno, fichas));

  const avisos = [];
  if (sessionStorage.getItem('academia.novaConta') && fichas.length) {
    sessionStorage.removeItem('academia.novaConta');
    const f = fichas[fichas.length - 1];
    avisos.push(el('div', { class: 'welcome', role: 'status' },
      el('strong', { text: 'Conta criada! ' }),
      `Montamos a sua primeira ficha, “${f.titulo}”${f.instrutor ? `, com o professor ${f.instrutor.nome}` : ''}. Confira os exercícios abaixo.`
    ));
  }

  if (!fichas.length) {
    conteudo.replaceChildren(...avisos, estado(
      'Você ainda não tem ficha de treino',
      'Assim que um professor montar o seu treino, ele aparece aqui. Fale com a recepção para agendar a avaliação.'
    ));
    return;
  }

  let selecionada = fichas.find(f => `#ficha-${f.id}` === location.hash) || fichas[0];

  const tabs = el('div', { class: 'tabs', role: 'group', 'aria-label': 'Suas fichas' });
  const area = el('div');

  function desenhar() {
    tabs.querySelectorAll('.tab').forEach(b => b.setAttribute('aria-current', String(Number(b.dataset.id) === selecionada.id)));
    const exercicios = selecionada.exercicios || [];
    area.replaceChildren(
      el('div', { class: 'ficha-head' },
        el('h2', { class: 'display', text: selecionada.titulo }),
        selecionada.instrutor && el('p', { text: `Ficha montada por ${selecionada.instrutor.nome}` })
      ),
      el('div', { class: 'layout' },
        el('div', {}, exercicios.length
          ? el('ol', { class: 'ex-grid' }, exercicios.map(cartaoExercicio))
          : estado('Ficha sem exercícios', 'O professor ainda não cadastrou exercícios nesta ficha.')),
        el('aside', { class: 'side' }, cartaoProfessor(selecionada.instrutor), cartaoResumo(selecionada))
      )
    );
  }

  for (const ficha of fichas) {
    const qtd = (ficha.exercicios || []).length;
    tabs.append(el('button', {
      class: 'tab skew', type: 'button', 'data-id': ficha.id,
      onclick: () => { selecionada = ficha; history.replaceState(null, '', `#ficha-${ficha.id}`); desenhar(); }
    }, el('span', {},
      el('span', { class: 't', text: ficha.titulo }),
      el('span', { class: 'm', text: plural(qtd, 'exercício', 'exercícios') })
    )));
  }

  conteudo.replaceChildren(...avisos, tabs, area);
  desenhar();
}

async function carregar() {
  try {
    montar(await api('/treinos/meus'));
  } catch (e) {
    if (e.status === 401) return; // api() já redirecionou para o login
    topo.replaceChildren();
    const botao = e.status === 403
      ? el('button', { class: 'btn skew', type: 'button', onclick: sair }, el('span', { text: 'Sair' }))
      : el('button', { class: 'btn skew', type: 'button', onclick: () => location.reload() }, el('span', { text: 'Tentar de novo' }));
    conteudo.replaceChildren(estado(
      e.status === 403 ? 'Acesso indisponível' : 'Não foi possível carregar sua ficha', e.message, botao
    ));
    conteudo.style.paddingTop = '48px';
  }
}

carregar();
