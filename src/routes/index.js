const { Router } = require('express');
const authRoutes = require('./authRoutes');
const alunoRoutes = require('./alunoRoutes');
const treinoRoutes = require('./treinoRoutes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/alunos', alunoRoutes);
router.use('/treinos', treinoRoutes);

module.exports = router;