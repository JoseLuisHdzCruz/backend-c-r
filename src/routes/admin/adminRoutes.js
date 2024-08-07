// /src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/Admin/adminController');

// Ruta para obtener todos los usuarios
router.get('/notification/:admonId', adminController.getAllNotifications);
router.get('/get-employee', adminController.getAllEmpleados);
router.get('/getPromociones', adminController.getAllPromociones);
router.put('/updatePromociones/:id', adminController.updatePromocion);
router.get('/get-employee/:id', adminController.getEmployeetById);
router.get('/getNosotros/:id', adminController.getNosotrosById);
router.put('/updateNosotros/:id', adminController.updateNosotrosById);
router.put('/status/:id', adminController.updateUserStatus);
router.post('/add-employee', adminController.addEmployee);
router.post('/createPromociones', adminController.createPromocion);
router.post('/forgotPassword', adminController.verificarCorreoYEnviarClave);
router.post('/keyCompare', adminController.compararClave);
router.post('/changePassword', adminController.cambiarContraseña);
router.put('/update-employee/:id', adminController.updateEmployee);
router.post('/login', adminController.login);
router.post('/searchEmployee', adminController.searchUsersAdvance);

router.post("/cupones", adminController.createCoupon);
router.get("/cupones", adminController.getAllCoupons);


module.exports = router;