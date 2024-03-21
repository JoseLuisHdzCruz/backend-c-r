// app.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./src/routes/public/userRoutes');
const productRoutes = require('./src/routes/public/productRoutes');
const crypto = require('crypto');
const fs = require('fs');

// Lee el contenido del archivo .env si existe
let envData = '';
if (fs.existsSync('.env')) {
  envData = fs.readFileSync('.env', 'utf8');
}

// Verifica si JWT_SECRET ya está definido en el archivo .env
if (!envData.includes('JWT_SECRET')) {
  const secretKey = crypto.randomBytes(32).toString('hex');

  // Actualiza el contenido del archivo .env
  envData += `JWT_SECRET=${secretKey}\n`;

  // Escribe el contenido actualizado en el archivo .env
  fs.writeFileSync('.env', envData);

  console.log('Clave secreta generada y almacenada en el archivo .env');
  console.log('Asegúrate de mantener el archivo .env seguro y no compartirlo públicamente.');
} else {
  console.log('La variable JWT_SECRET ya está definida en el archivo .env');
}

dotenv.config(); // Cargar variables de entorno desde .env

const app = express();
const port = process.env.PORT || 5000;

// Configuración de Express
app.use(cors()); // Middleware de CORS
app.use(express.json());



// Configuración de rutas
app.use('/users', userRoutes);
app.use('/products', productRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
