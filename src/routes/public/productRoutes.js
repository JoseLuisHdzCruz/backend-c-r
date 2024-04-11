// /src/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../../controllers/public/productController');

// Ruta para obtener todos los productos
router.get('/', productController.getAllProducts);

// Ruta para obtener todos los productos
router.get('/categoriaId', productController.getAllProductsCategories);

// Ruta para obtener todos los productos
router.get('/randomProducts', productController.getRandomProducts);

// Ruta para obtener un producto por ID
router.get('/:id', productController.getProductById);

// Ruta para crear un nuevo producto
router.post('/', productController.createProduct);

// Ruta para buscar productos
router.post('/search', productController.searchProducts);

// Ruta para actualizar un producto
router.put('/:id', productController.updateProduct);

module.exports = router;
