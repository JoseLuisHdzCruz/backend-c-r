// /src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../../controllers/public/userController');

// Ruta para obtener todos los usuarios
router.get('/', userController.getAllUsers);

// Ruta para obtener un usuario por ID
router.get('/:id', userController.getUserById);

// Ruta para obtener la pregunta secreta del usuario mediante correo
router.post('/secretQuestion', userController.getSecretQuestion);

// Ruta para comparar si la respuesta enviada es correcta
router.post('/secretAnswer', userController.checkSecretAnswer);

// Ruta para crear un nuevo usuario
router.post('/', userController.createUser);

// Ruta para iniciar sesión
router.post('/login', userController.loginUser);

// Ruta para enviar por correo clave de verificacion
router.post('/forgotPassword', userController.verificarCorreoYEnviarClave);

// Ruta para verificar la clave
router.post('/keyCompare', userController.compararClave);

// Ruta para actualizar la contraseña
router.post("/changePassword", userController.cambiarContraseña);



// // Ruta para actualizar un usuario
// router.put('/:id', userController.updateUser);

// // Ruta para eliminar un usuario
// router.delete('/:id', userController.deleteUser);

module.exports = router;