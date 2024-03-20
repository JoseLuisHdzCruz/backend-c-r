const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config(); // Cargar variables de entorno desde .env

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 51144,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Esta opción permite múltiples consultas en una sola sentencia.
  // Habilita la compatibilidad con MySQL 8.0.
  multipleStatements: true,
});

module.exports = sequelize;
