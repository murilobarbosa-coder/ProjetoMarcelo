const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Aluno = require('./Aluno');
const FichaTreino = require('./FichaTreino');
const Exercicio = require('./Exercicio');

module.exports = {
  sequelize,
  Usuario,
  Aluno,
  FichaTreino,
  Exercicio
};