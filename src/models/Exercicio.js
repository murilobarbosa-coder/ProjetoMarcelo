const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const FichaTreino = require('./FichaTreino');

const Exercicio = sequelize.define('Exercicio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false // Ex: "Supino Reto"
  },
  series: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 3
  },
  repeticoes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10
  },
  cargaKg: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
});

// Relacionamento 1:N - Uma Ficha de Treino possui vários Exercícios
Exercicio.belongsTo(FichaTreino, { foreignKey: 'fichaTreinoId', onDelete: 'CASCADE' });
FichaTreino.hasMany(Exercicio, { foreignKey: 'fichaTreinoId', as: 'exercicios' });

module.exports = Exercicio;