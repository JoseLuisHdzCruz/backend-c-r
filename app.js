// app.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./src/routes/public/userRoutes');
const productRoutes = require('./src/routes/public/productRoutes');
const addressRoutes = require('./src/routes/public/domicilioRoutes')
const carritoRoutes = require('./src/routes/public/carritoRoutes');
const ventasRoutes = require('./src/routes/public/ventasRoutes');
const paymentRoutes = require('./src/routes/public/paymentRoutes')
const adminRoutes = require('./src/routes/admin/adminRoutes')
const crypto = require('crypto');
const fs = require('fs');
require ('./src/jobs/cartNotifications')

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
app.use('/address', addressRoutes);
app.use('/cart', carritoRoutes);
app.use('/ventas', ventasRoutes);
app.use('/order', paymentRoutes);


//Rutas de Administrador
app.use('/admin', adminRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
