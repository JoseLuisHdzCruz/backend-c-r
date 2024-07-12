// /src/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../../controllers/public/productController');
const promocionesController = require('../../controllers/public/promocionesController');

// Ruta para obtener todos los productos
router.get('/', productController.getAllProducts);

// Ruta para obtener todas las categorias
router.get('/categorias/', productController.getAllCategorias);

// Ruta para obtener todos los productos
router.get('/categoria/:categoriaId', productController.getAllProductsCategories);

// Ruta para obtener todos los productos
router.get('/randomProducts', productController.getRandomProducts);

// Ruta para obtener un producto por ID
router.get('/:id', productController.getProductById);

// Ruta para crear un nuevo producto
router.post('/add', productController.createProduct);

// Ruta para buscar productos
router.post('/search', productController.searchProducts);

// Ruta de busqueda avanzada
router.post('/search-advance', productController.searchProductsAdvance);

// Ruta para actualizar un producto
router.put('/:id', productController.updateProduct);

// Ruta para obtener los 20 productos más vendidos
router.get('/productos/mas-vendidos', productController.obtenerProductosMasVendidos);

// Ruta para obtener las promociones
router.get('/promos/:fecha', promocionesController.obtenerPromocionesPorFecha);


module.exports = router;
