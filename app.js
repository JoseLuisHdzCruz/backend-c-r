// app.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./src/config/database');
const userRoutes = require('./src/routes/public/userRoutes');
const crypto = require('crypto');
const fs = require('fs');

// Generar una clave secreta si aún no está configurada
if (!process.env.JWT_SECRET) {
  const secretKey = crypto.randomBytes(32).toString('hex');

  // Guardar la clave en un archivo de entorno (.env)
  fs.writeFileSync('.env', `JWT_SECRET=${secretKey}\n`);

  console.log('Clave secreta generada y almacenada en el archivo .env');
  console.log('Asegúrate de mantener el archivo .env seguro y no compartirlo públicamente.');
}

dotenv.config(); // Cargar variables de entorno desde .env

const app = express();
const port = process.env.PORT || 5000;

// Configuración de Express
app.use(cors()); // Middleware de CORS
app.use(express.json());

// Conectar a la base de datos
db.connect();

// Configuración de rutas
app.use('/users', userRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
