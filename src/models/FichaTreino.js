const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Aluno = require('./Aluno');
const Usuario = require('./Usuario');

const FichaTreino = sequelize.define('FichaTreino', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false // Ex: "Treino A - Peito e Tríceps"
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

// Ficha de Treino pertence a um Aluno
FichaTreino.belongsTo(Aluno, { foreignKey: 'alunoId', onDelete: 'CASCADE' });
Aluno.hasMany(FichaTreino, { foreignKey: 'alunoId' });

// Ficha de Treino criada por um Instrutor (Usuário)
FichaTreino.belongsTo(Usuario, { foreignKey: 'instrutorId', as: 'instrutor' });

module.exports = FichaTreino;
