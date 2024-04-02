const express = require('express');
const router = express.Router();
const carritoController = require('../../controllers/public/carritoController');

// Rutas para el carrito
router.get('/carrito', carritoController.getCarrito);
router.post('/carrito', carritoController.addToCarrito);
router.put('/carrito/:carritoId', carritoController.updateCarrito);
router.delete('/carrito/:carritoId', carritoController.deleteCarrito);
router.delete('/carrito/clear', carritoController.clearCarrito);

module.exports = router;
