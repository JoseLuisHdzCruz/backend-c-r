const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config(); // Cargar variables de entorno desde .env

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 38195,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
});

module.exports = sequelize;
