// app.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./src/config/database');
const userRoutes = require('./src/routes/public/userRoutes');
const Recaptcha = require('express-recaptcha').RecaptchaV3;
const recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY);


dotenv.config(); // Cargar variables de entorno desde .env

const app = express();
const port = process.env.PORT || 5000;

// Configuración de Express
app.use(cors()); // Middleware de CORS
app.use(express.json());
app.use(recaptcha.middleware.render);


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
