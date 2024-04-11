// /src/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const domicilioController = require('../../controllers/public/domicilioController');

// Rutas para Sucursales
router.get('/get-colonias/:cp', domicilioController.getAllColoniasByCP);

router.get('/get-sucursal', domicilioController.getAllSucursales);
router.post('/add-sucursal', domicilioController.createSucursal);
router.put('/update-sucursal/:id', domicilioController.updateSucursal);
router.delete('/delete-sucursal/:id', domicilioController.deleteSucursal);
router.get('/get-sucursal/:id', domicilioController.getSucursalById);

router.get('/get-domicilio/:id', domicilioController.getAllDomicilios);
router.post('/add-domicilio', domicilioController.createDomicilio);
router.put('/update-domicilio/:id', domicilioController.updateDomicilio);
router.delete('/delete-domicilio/:id', domicilioController.deleteDomicilio);
router.get('/get-domicilioById/:id', domicilioController.getDomicilioById);

module.exports = router;
