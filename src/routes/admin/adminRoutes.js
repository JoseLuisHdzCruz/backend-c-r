// /src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/Admin/adminController');

// Ruta para obtener todos los usuarios
router.get('/notification/:admonId', adminController.getAllNotifications);
router.get('/get-employee', adminController.getAllEmpleados);
router.get('/get-employee/:id', adminController.getEmployeetById);
router.post('/add-employee', adminController.addEmployee);
router.put('/update-employee/:id', adminController.updateEmployee);
router.post('/login', adminController.login);


module.exports = router;