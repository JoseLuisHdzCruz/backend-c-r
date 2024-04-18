// /src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/Admin/adminController');

// Ruta para obtener todos los usuarios
router.get('/:admonId', adminController.getAllNotifications);


module.exports = router;