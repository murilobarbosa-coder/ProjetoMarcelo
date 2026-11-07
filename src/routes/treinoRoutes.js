const { Router } = require('express');
const TreinoController = require('../controllers/TreinoController');
const authMiddleware = require('../middlewares/auth');

const router = Router();

// POST /api/treinos (Criação de ficha de treino)
router.post('/', authMiddleware, TreinoController.criarFicha);

// GET /api/treinos/meus (Ficha completa do aluno logado, identificado pelo token)
router.get('/meus', authMiddleware, TreinoController.meusTreinos);

// GET /api/treinos/aluno/:alunoId (Busca treinos do aluno)
router.get('/aluno/:alunoId', authMiddleware, TreinoController.buscarPorAluno);

module.exports = router;