// /src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const upload = require('../../config/multerConfig');
const userController = require('../../controllers/public/userController');

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

// Ruta para actualizar la pregunta y respuesta de un usuario
router.put('/updateUser/:customerId', userController.updateSecretQuestionAndAnswer);

// Ruta para obtener todas la notificaciones
router.get('/getAllNotifications/:customerId', userController.getAllNotifications);

// Ruta para actualizar el estado de una notificación por su id
router.put('/notificaciones/:notificationId', userController.actualizarEstadoNotificacion);

router.post('/api/store-fcm-token', userController.fcmToken);

router.post('/searchAdvance', userController.searchUsersAdvance);

router.put('/banner/:id', upload.single('imagen'), userController.updateImgUser);

// Ruta para suscripción a notificaciones push
router.post("/subscription/update", userController.createOrUpdateSubscription);

router.post("/subscription-general/create", userController.createSubscription);

module.exports = router;