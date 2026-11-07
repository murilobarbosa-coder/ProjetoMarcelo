/**
 * Seed opcional: npm run seed
 *
 * - Cria um professor (INSTRUTOR) de exemplo, se ainda não existir.
 * - Vincula esse professor às fichas que estão sem instrutor (instrutorId nulo),
 *   como a "Treino A - Peito e Tríceps" que já existe no banco.
 * - Cria uma aluna de exemplo (Maria) com 3 fichas completas, se ela ainda não existir.
 *
 * Pode rodar mais de uma vez: nada é duplicado e nenhuma senha existente é alterada.
 */
const bcrypt = require('bcryptjs');
const { sequelize, Usuario, Aluno, FichaTreino, Exercicio } = require('./models');

const PROFESSOR = { nome: 'Ricardo Alves', email: 'ricardo@academia.com', senha: 'prof1234' };
const ALUNA = { nome: 'Maria Souza', email: 'maria@email.com', senha: 'maria123', matricula: 'MAT-2026-002' };

const FICHAS_MARIA = [
  {
    titulo: 'Treino A - Peito e Tríceps',
    observacoes: 'Descanso de 60 a 90 segundos entre as séries. Faça 5 minutos de aquecimento na esteira antes de começar.',
    exercicios: [
      { nome: 'Supino Reto com Barra', series: 4, repeticoes: 10, cargaKg: 40 },
      { nome: 'Supino Inclinado com Halteres', series: 3, repeticoes: 12, cargaKg: 14 },
      { nome: 'Crucifixo na Máquina', series: 3, repeticoes: 12, cargaKg: 25 },
      { nome: 'Tríceps Pulley', series: 3, repeticoes: 12, cargaKg: 20 },
      { nome: 'Tríceps Testa', series: 3, repeticoes: 10, cargaKg: 15 }
    ]
  },
  {
    titulo: 'Treino B - Costas e Bíceps',
    observacoes: 'Mantenha a postura e evite balançar o tronco nas roscas.',
    exercicios: [
      { nome: 'Puxada Frontal', series: 4, repeticoes: 10, cargaKg: 45 },
      { nome: 'Remada Curvada', series: 3, repeticoes: 10, cargaKg: 30 },
      { nome: 'Remada Baixa', series: 3, repeticoes: 12, cargaKg: 35 },
      { nome: 'Rosca Direta', series: 3, repeticoes: 12, cargaKg: 20 },
      { nome: 'Rosca Martelo', series: 3, repeticoes: 12, cargaKg: 10 }
    ]
  },
  {
    titulo: 'Treino C - Pernas e Ombros',
    observacoes: 'Se sentir dor no joelho no agachamento, reduza a carga e avise o professor.',
    exercicios: [
      { nome: 'Agachamento Livre', series: 4, repeticoes: 10, cargaKg: 50 },
      { nome: 'Leg Press 45°', series: 4, repeticoes: 12, cargaKg: 120 },
      { nome: 'Cadeira Extensora', series: 3, repeticoes: 15, cargaKg: 40 },
      { nome: 'Desenvolvimento com Halteres', series: 3, repeticoes: 10, cargaKg: 12 },
      { nome: 'Elevação Lateral', series: 3, repeticoes: 15, cargaKg: 6 },
      { nome: 'Prancha Abdominal', series: 3, repeticoes: 1, cargaKg: null }
    ]
  }
];

async function criarUsuario({ nome, email, senha, tipo }) {
  const [usuario, criado] = await Usuario.findOrCreate({
    where: { email },
    defaults: { nome, email, senha: await bcrypt.hash(senha, 10), tipo }
  });
  return { usuario, criado };
}

async function main() {
  await sequelize.sync({ force: false });

  // 1) Professor
  const { usuario: professor, criado: professorCriado } = await criarUsuario({ ...PROFESSOR, tipo: 'INSTRUTOR' });
  console.log(professorCriado
    ? `Professor criado: ${PROFESSOR.email} / ${PROFESSOR.senha}`
    : `Professor já existia: ${PROFESSOR.email}`);

  // 2) Fichas sem professor passam a ter um responsável
  const [vinculadas] = await FichaTreino.update(
    { instrutorId: professor.id },
    { where: { instrutorId: null } }
  );
  console.log(`Fichas sem professor vinculadas a ${professor.nome}: ${vinculadas}`);

  // 3) Aluna de exemplo com fichas completas
  const { usuario: usuarioMaria, criado: mariaCriada } = await criarUsuario({ ...ALUNA, tipo: 'ALUNO' });
  if (!mariaCriada) {
    console.log(`Aluna de exemplo já existia: ${ALUNA.email} (nada foi alterado)`);
  } else {
    const aluno = await Aluno.create({
      usuarioId: usuarioMaria.id,
      matricula: ALUNA.matricula,
      dataNascimento: '1998-09-23'
    });
    for (const modelo of FICHAS_MARIA) {
      const ficha = await FichaTreino.create({
        alunoId: aluno.id,
        instrutorId: professor.id,
        titulo: modelo.titulo,
        observacoes: modelo.observacoes
      });
      await Exercicio.bulkCreate(modelo.exercicios.map(ex => ({ ...ex, fichaTreinoId: ficha.id })));
    }
    console.log(`Aluna criada: ${ALUNA.email} / ${ALUNA.senha} com ${FICHAS_MARIA.length} fichas`);
  }

  await sequelize.close();
}

main().catch(err => {
  console.error('Erro ao executar o seed:', err);
  process.exit(1);
});
