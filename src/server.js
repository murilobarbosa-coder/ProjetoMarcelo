const path = require('path');
const express = require('express');
const { sequelize } = require('./models');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar JSON nas requisições
app.use(express.json());

// Serve o site (HTML/CSS/JS) da pasta /public em http://localhost:3000/
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rota de teste rápida (antes era '/', agora '/status' pois '/' abre o site)
app.get('/status', (req, res) => {
  res.send('API da Academia está rodando com sucesso!');
});

// Central de Rotas da API
app.use('/api', routes);

// Sincroniza o banco de dados SQLite e inicia o servidor
sequelize.sync({ force: false })
  .then(() => {
    console.log('Banco de dados SQLite sincronizado com sucesso.');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
  });