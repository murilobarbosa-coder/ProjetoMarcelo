const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize, Usuario, Aluno } = require('../models');
const { criarFichaInicial } = require('../services/fichaInicial');

const SECRET_KEY = process.env.JWT_SECRET || 'secreta_academia_123';
const SENHA_MIN = 6; // regra 3.1 da documentação: mínimo de 6 a 8 caracteres
const TIPOS = ['ALUNO', 'INSTRUTOR', 'ADMIN'];

const normalizarEmail = (email) => String(email || '').trim().toLowerCase();
const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Gera matrículas sequenciais no formato MAT-2026-001
async function gerarMatricula(transaction) {
  const ano = new Date().getFullYear();
  let numero = (await Aluno.count({ transaction })) + 1;
  while (true) {
    const candidata = `MAT-${ano}-${String(numero).padStart(3, '0')}`;
    const existe = await Aluno.findOne({ where: { matricula: candidata }, transaction });
    if (!existe) return candidata;
    numero += 1;
  }
}

class AuthController {
  // POST /api/auth/register
  async register(req, res) {
    try {
      const { nome, senha, tipo, matricula, dataNascimento } = req.body;
      const email = normalizarEmail(req.body.email);

      // Validações de entrada
      if (!nome || !String(nome).trim()) {
        return res.status(400).json({ mensagem: 'Informe o seu nome.' });
      }
      if (!emailValido(email)) {
        return res.status(400).json({ mensagem: 'Informe um e-mail válido.' });
      }
      if (typeof senha !== 'string' || senha.length < SENHA_MIN) {
        return res.status(400).json({ mensagem: `A senha deve ter pelo menos ${SENHA_MIN} caracteres.` });
      }
      if (tipo && !TIPOS.includes(tipo)) {
        return res.status(400).json({ mensagem: 'Tipo de conta inválido.' });
      }
      if (dataNascimento) {
        const data = new Date(`${dataNascimento}T00:00:00`);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dataNascimento) || isNaN(data) || data > new Date()) {
          return res.status(400).json({ mensagem: 'Data de nascimento inválida.' });
        }
      }

      // Verifica se o e-mail já existe
      const usuarioExistente = await Usuario.findOne({ where: { email } });
      if (usuarioExistente) {
        return res.status(400).json({ mensagem: 'E-mail já cadastrado.' });
      }

      // Criptografa a senha
      const senhaHash = await bcrypt.hash(senha, 10);

      // Tudo em uma transação: se algo falhar, nada é gravado pela metade
      const { usuario, ficha } = await sequelize.transaction(async (transaction) => {
        const novoUsuario = await Usuario.create({
          nome: String(nome).trim(),
          email,
          senha: senhaHash,
          tipo: tipo || 'ALUNO'
        }, { transaction });

        let fichaInicial = null;

        // Aluno: cria o registro em Alunos e já recebe uma ficha sorteada com um professor sorteado
        if (novoUsuario.tipo === 'ALUNO') {
          const aluno = await Aluno.create({
            usuarioId: novoUsuario.id,
            matricula: matricula || await gerarMatricula(transaction),
            dataNascimento: dataNascimento || null
          }, { transaction });

          fichaInicial = await criarFichaInicial(aluno, transaction);
        }

        return { usuario: novoUsuario, ficha: fichaInicial };
      });

      return res.status(201).json({
        mensagem: 'Usuário cadastrado com sucesso!',
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo },
        ficha
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError' || /UNIQUE constraint failed/i.test(error.message)) {
        return res.status(400).json({ mensagem: 'E-mail ou matrícula já cadastrado.' });
      }
      return res.status(500).json({ mensagem: 'Erro interno ao cadastrar usuário.', erro: error.message });
    }
  }

  // POST /api/auth/login
  async login(req, res) {
    try {
      const email = normalizarEmail(req.body.email);
      const { senha } = req.body;

      if (!email || typeof senha !== 'string' || !senha) {
        return res.status(400).json({ mensagem: 'Informe e-mail e senha.' });
      }

      // Busca o usuário no banco
      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) {
        return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
      }

      // Valida a senha
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
      }

      // Regra de negócio: aluno com plano inativo não autentica
      if (usuario.tipo === 'ALUNO') {
        const aluno = await Aluno.findOne({ where: { usuarioId: usuario.id } });
        if (aluno && !aluno.planoAtivo) {
          return res.status(403).json({ mensagem: 'Seu plano está inativo. Procure a recepção da academia.' });
        }
      }

      // Gera o Token JWT
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, tipo: usuario.tipo },
        SECRET_KEY,
        { expiresIn: '8h' }
      );

      return res.json({
        mensagem: 'Login realizado com sucesso!',
        token,
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo }
      });
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro interno ao realizar login.', erro: error.message });
    }
  }
}

module.exports = new AuthController();
