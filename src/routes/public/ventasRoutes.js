const express = require('express');
const router = express.Router();
const ventasController = require('../../controllers/public/ventasController');

// Rutas para manejar las ventas
router.post('/', ventasController.crearVenta);
router.get('/', ventasController.obtenerTodasLasVentas);
router.get('/:id', ventasController.obtenerVentaPorId);
router.get('/cliente/:customerId', ventasController.obtenerVentasPorCustomerId);
router.get('/filtroVentas', ventasController.filtrarVentasPorFecha);

// Rutas para manejar los detalles de venta
router.get('/detalle/:id', ventasController.obtenerDetalleVentaPorIdVenta);

module.exports = router;
