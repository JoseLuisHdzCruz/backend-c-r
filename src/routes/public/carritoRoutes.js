const express = require('express');
const router = express.Router();
const carritoController = require('../../controllers/public/carritoController');

// Rutas para el carrito
router.get('/:customerId',  carritoController.getCarrito);
router.get('/getByToken/:token',  carritoController.getCarritoByToken);
router.post('/', carritoController.addToCarrito);
router.post('/addByToken', carritoController.addToCarritoByToken);
router.put('/:customerId/:productoId', carritoController.updateCarrito);
router.delete('/', carritoController.deleteCarrito);
router.delete('/clear/:customerId', carritoController.clearCarrito);

module.exports = router;
