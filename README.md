# Academia: API + site do aluno

## Como rodar
1. `npm install` (se ainda não tiver a pasta node_modules)
2. `npm run seed` (opcional: cria professor e fichas de exemplo)
3. `npm start`
4. Abra http://localhost:3000

## Contas de exemplo (criadas pelo seed)
| Perfil    | E-mail                | Senha     |
|-----------|-----------------------|-----------|
| Aluna     | maria@email.com       | maria123  |
| Professor | ricardo@academia.com  | prof1234  |

O aluno João (joao@email.com) continua com a senha que você cadastrou.
O seed vincula a ficha dele, que estava sem professor, ao professor Ricardo.

## Criar conta
Na tela inicial, aba "Criar conta". Ao cadastrar um aluno, a API:
- gera a matrícula no formato MAT-2026-001 (se não for informada);
- sorteia um dos 6 modelos de ficha (`src/data/fichasModelo.js`);
- sorteia um professor (usuário INSTRUTOR) já cadastrado e o vincula à ficha;
- grava tudo em uma transação (se algo falhar, nada fica pela metade).
Se ainda não existir nenhum professor, a ficha é criada sem responsável.

## O que foi acrescentado à API
- `POST /api/auth/register`: validações (nome, e-mail, senha com no mínimo 6 caracteres, data de nascimento), e-mail sem diferença de maiúsculas, ficha inicial sorteada.
- `GET /api/treinos/meus`: ficha completa do aluno logado (identificado pelo token), com exercícios e professor.
- Login bloqueia aluno com plano inativo (regra 3.2 da documentação).
- `server.js` serve a pasta `public/` e a rota de teste passou de `/` para `/status`.

## Site (pasta public/)
- `index.html` + `js/login.js`: entrar e criar conta
- `ficha.html` + `js/ficha.js`: fichas, exercícios e professor responsável
- `js/api.js`: chamadas à API e sessão; `css/style.css`: visual
