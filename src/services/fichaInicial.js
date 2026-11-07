const { Usuario, FichaTreino, Exercicio } = require('../models');
const MODELOS = require('../data/fichasModelo');

const sortear = (lista) => lista[Math.floor(Math.random() * lista.length)];

/**
 * Cria a primeira ficha de um aluno recém-cadastrado:
 * sorteia um modelo de treino e um professor (INSTRUTOR) já cadastrado.
 * Se ainda não houver nenhum professor, a ficha é criada sem responsável.
 * Deve ser chamada dentro de uma transação.
 */
async function criarFichaInicial(aluno, transaction) {
  const instrutores = await Usuario.findAll({
    where: { tipo: 'INSTRUTOR' },
    attributes: ['id', 'nome'],
    transaction
  });
  const instrutor = instrutores.length ? sortear(instrutores) : null;
  const modelo = sortear(MODELOS);

  const ficha = await FichaTreino.create({
    alunoId: aluno.id,
    instrutorId: instrutor ? instrutor.id : null,
    titulo: modelo.titulo,
    observacoes: modelo.observacoes
  }, { transaction });

  await Exercicio.bulkCreate(
    modelo.exercicios.map(ex => ({ ...ex, fichaTreinoId: ficha.id })),
    { transaction }
  );

  return {
    id: ficha.id,
    titulo: ficha.titulo,
    instrutor: instrutor ? { id: instrutor.id, nome: instrutor.nome } : null
  };
}

module.exports = { criarFichaInicial };
