const express = require('express');
const router = express.Router();
const carritoController = require('../../controllers/public/carritoController');

// Rutas para el carrito
router.get('/:customerId', carritoController.verifyToken, carritoController.getCarrito);
router.post('/',carritoController.verifyToken, carritoController.addToCarrito);
router.put('/:customerId/:productoId',carritoController.verifyToken, carritoController.updateCarrito);
router.delete('/',carritoController.verifyToken, carritoController.deleteCarrito);
router.delete('/clear/:customerId',carritoController.verifyToken, carritoController.clearCarrito);

module.exports = router;
