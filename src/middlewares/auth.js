const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'secreta_academia_123';

const authMiddleware = (req, res, next) => {
  // Captura o cabeçalho de autorização da requisição
  const authHeader = req.headers.authorization;

  // Verifica se o cabeçalho foi enviado
  if (!authHeader) {
    return res.status(401).json({ mensagem: 'Acesso negado. Token não fornecido.' });
  }

  // O formato esperado do cabeçalho é: "Bearer <TOKEN>"
  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ mensagem: 'Erro no formato do Token.' });
  }

  const [scheme, token] = parts;

  // Valida se o esquema é "Bearer"
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ mensagem: 'Token malformatado. Deve ser do tipo Bearer.' });
  }

  // Valida e decodifica o Token JWT
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // Injeta os dados do usuário decodificados (id, email, tipo) no objeto da requisição
    req.usuario = decoded;

    // Libera a requisição para continuar para a Controller
    return next();
  } catch (err) {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
  }
};

module.exports = authMiddleware;
