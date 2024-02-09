// /src/config/db.js

const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config(); // Cargar variables de entorno desde .env

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

module.exports = {
  connect: () => {
    db.connect((err) => {
      if (err) {
        console.error('Error de conexión a la base de datos:', err);
        throw err;
      }
      console.log('Conectado a la base de datos MySQL');
    });
  },
  query: (sql, values) => {
    return new Promise((resolve, reject) => {
      db.query(sql, values, (err, result) => {
        if (err) {
          console.error('Error en la consulta a la base de datos:', err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
};
