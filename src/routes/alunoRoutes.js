const { Router } = require('express');
const AlunoController = require('../controllers/AlunoController');
const authMiddleware = require('../middlewares/auth');

const router = Router();

// GET /api/alunos (Lista todos os alunos)
router.get('/', authMiddleware, AlunoController.listarTodos);

// GET /api/alunos/:id (Busca um aluno específico por ID)
router.get('/:id', authMiddleware, AlunoController.buscarPorId);

module.exports = router;