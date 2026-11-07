const { Aluno, Usuario, FichaTreino, Exercicio } = require('../models');

class AlunoController {
  // GET /api/alunos
  async listarTodos(req, res) {
    try {
      const alunos = await Aluno.findAll({
        include: [
          {
            model: Usuario,
            attributes: ['id', 'nome', 'email'] // Omite a senha por segurança
          }
        ]
      });
      return res.json(alunos);
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro ao buscar alunos.', erro: error.message });
    }
  }

  // GET /api/alunos/:id
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;

      const aluno = await Aluno.findByPk(id, {
        include: [
          { model: Usuario, attributes: ['id', 'nome', 'email'] },
          {
            model: FichaTreino,
            include: [{ model: Exercicio, as: 'exercicios' }]
          }
        ]
      });

      if (!aluno) {
        return res.status(404).json({ mensagem: 'Aluno não encontrado.' });
      }

      return res.json(aluno);
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro ao buscar aluno.', erro: error.message });
    }
  }
}

module.exports = new AlunoController();