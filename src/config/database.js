const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './academia.sqlite',
  logging: false
});

module.exports = sequelize;