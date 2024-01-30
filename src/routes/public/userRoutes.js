// /src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../../controllers/public/userController');
// const Recaptcha = require('express-recaptcha').RecaptchaV3;
// const recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY, { callback: 'cb' });



// Ruta para obtener todos los usuarios
router.get('/', userController.getAllUsers);

// Ruta para obtener un usuario por ID
router.get('/:id', userController.getUserById);

// Ruta para crear un nuevo usuario
router.post('/', userController.createUser);

// Ruta para iniciar sesión
router.post('/login', userController.loginUser);

// // Ruta para actualizar un usuario
// router.put('/:id', userController.updateUser);

// // Ruta para eliminar un usuario
// router.delete('/:id', userController.deleteUser);

module.exports = router;
