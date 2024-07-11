const express = require('express');
const router = express.Router();
const ventasController = require('../../controllers/public/ventasController');

// Rutas para manejar las ventas
router.post('/', ventasController.crearVenta);
router.get('/', ventasController.obtenerTodasLasVentas);
router.get('/:id', ventasController.obtenerVentaPorId);
router.get('/cliente/:customerId', ventasController.obtenerVentasPorCustomerId);
router.post('/filtroVentas', ventasController.filtrarVentasPorFecha);
router.post("/cancelar-venta", ventasController.cancelarVenta);
router.post('/mate', ventasController.obtenerDetalleVentasPorProductoIdYFecha);
router.get('/status/venta/:folio', ventasController.obtenerDetalleStatusPorFolio);


// Rutas para manejar los detalles de venta
router.get('/detalle/:id', ventasController.obtenerDetalleVentaPorIdVenta);

module.exports = router;
