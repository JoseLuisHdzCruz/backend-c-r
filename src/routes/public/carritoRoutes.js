const express = require('express');
const router = express.Router();
const carritoController = require('../../controllers/public/carritoController');

// Rutas para el carrito
router.get('/:customerId', carritoController.getCarrito);
router.post('/', carritoController.addToCarrito);
router.put('/', carritoController.updateCarrito);
router.delete('/', carritoController.deleteCarrito);
router.delete('/clear/:customerId', carritoController.clearCarrito);

module.exports = router;
