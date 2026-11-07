const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

const Aluno = sequelize.define('Aluno', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  matricula: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  dataNascimento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  planoAtivo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

// Relacionamento 1:1 - Aluno pertence a um Usuário
Aluno.belongsTo(Usuario, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
Usuario.hasOne(Aluno, { foreignKey: 'usuarioId' });

module.exports = Aluno;
