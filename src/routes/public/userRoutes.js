// /src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../../controllers/public/userController');
const upload = require('../../config/cloudinaryConfig');

// Ruta para obtener todos los usuarios
router.get('/', userController.getAllUsers);

// Ruta para obtener un usuario por ID
router.get('/:id', userController.getUserById);

// Ruta para obtener un usuario por ID
router.get('/getSession/:id', userController.getSessionBySessionId);

// Ruta para obtener un telefono por correo
router.get('/findPhone/:correo', userController.findPhoneByEmail);

// Ruta para obtener la pregunta secreta del usuario mediante correo
router.post('/secretQuestion', userController.getSecretQuestion);

// Ruta para comparar si la respuesta enviada es correcta
router.post('/secretAnswer', userController.checkSecretAnswer);

// Ruta para crear un nuevo usuario
router.post('/', userController.createUser);

// Ruta para iniciar sesión
router.post('/login', userController.loginUser);

// Ruta para cerrar sesión
router.post('/logout', userController.logoutUser);

// Ruta para cerrar todas las sesiónes de un usuario
router.post('/logoutAllSessions', userController.logoutAllUsers);

// Ruta para enviar por correo clave de verificacion
router.post('/forgotPassword', userController.verificarCorreoYEnviarClave);

// Ruta para enviar por correo clave de verificacion
router.post('/sedKeyWhatsApp', userController.enviarTokenPorWhatsapp);

// Ruta para verificar la clave
router.post('/keyCompare', userController.compararClave);

// Ruta para actualizar la contraseña
router.post("/changePassword", userController.cambiarContraseña);

// Ruta para actualizar la imagen de perfil
router.post('/usuario/:customerId/imagen', upload, userController.actualizarImagenPerfil);


// Ruta para actualizar un usuario
// router.put('/:id', userController.updateUser);

// // Ruta para eliminar un usuario
// router.delete('/:id', userController.deleteUser);

module.exports = router;