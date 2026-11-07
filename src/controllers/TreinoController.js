const { FichaTreino, Exercicio, Aluno, Usuario } = require('../models');

class TreinoController {
  // POST /api/treinos
  async criarFicha(req, res) {
    try {
      const { alunoId, instrutorId, titulo, observacoes, exercicios } = req.body;

      // Cria a Ficha de Treino
      const ficha = await FichaTreino.create({
        alunoId,
        instrutorId,
        titulo,
        observacoes
      });

      // Se houver lista de exercícios, insere associados à ficha criada
      if (exercicios && exercicios.length > 0) {
        const exerciciosComFichaId = exercicios.map(ex => ({
          ...ex,
          fichaTreinoId: ficha.id
        }));
        await Exercicio.bulkCreate(exerciciosComFichaId);
      }

      const fichaCompleta = await FichaTreino.findByPk(ficha.id, {
        include: [{ model: Exercicio, as: 'exercicios' }]
      });

      return res.status(201).json(fichaCompleta);
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro ao criar ficha de treino.', erro: error.message });
    }
  }

  // GET /api/treinos/meus
  // Devolve os dados do aluno logado e todas as suas fichas, com exercícios e professor.
  async meusTreinos(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.usuario.id, {
        attributes: ['id', 'nome', 'email', 'tipo']
      });
      if (!usuario) {
        return res.status(401).json({ mensagem: 'Usuário não encontrado. Faça login novamente.' });
      }
      if (usuario.tipo !== 'ALUNO') {
        return res.status(403).json({ mensagem: 'Esta área é exclusiva para alunos.' });
      }

      const aluno = await Aluno.findOne({ where: { usuarioId: usuario.id } });
      if (!aluno) {
        return res.status(404).json({ mensagem: 'Cadastro de aluno não encontrado.' });
      }
      if (!aluno.planoAtivo) {
        return res.status(403).json({ mensagem: 'Seu plano está inativo. Procure a recepção da academia.' });
      }

      const fichas = await FichaTreino.findAll({
        where: { alunoId: aluno.id },
        include: [
          { model: Exercicio, as: 'exercicios' },
          { model: Usuario, as: 'instrutor', attributes: ['id', 'nome', 'email'] }
        ],
        order: [['id', 'ASC'], [{ model: Exercicio, as: 'exercicios' }, 'id', 'ASC']]
      });

      return res.json({
        aluno: {
          id: aluno.id,
          nome: usuario.nome,
          email: usuario.email,
          matricula: aluno.matricula,
          dataNascimento: aluno.dataNascimento,
          planoAtivo: aluno.planoAtivo
        },
        fichas
      });
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro ao buscar seus treinos.', erro: error.message });
    }
  }

  // GET /api/treinos/aluno/:alunoId
  async buscarPorAluno(req, res) {
    try {
      const { alunoId } = req.params;

      const fichas = await FichaTreino.findAll({
        where: { alunoId },
        include: [
          { model: Exercicio, as: 'exercicios' },
          { model: Usuario, as: 'instrutor', attributes: ['nome'] }
        ]
      });

      return res.json(fichas);
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro ao buscar treinos.', erro: error.message });
    }
  }
}

module.exports = new TreinoController();