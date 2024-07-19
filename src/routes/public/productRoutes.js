// /src/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../../controllers/public/productController');
const promocionesController = require('../../controllers/public/promocionesController');
const upload = require('../../config/multerConfig');

// Ruta para obtener todos los productos
router.get('/', productController.getAllProducts);

// Ruta para obtener todos los productos
router.get('/categoria/:categoriaId', productController.getAllProductsCategories);

// Ruta para obtener todos los productos
router.get('/randomProducts', productController.getRandomProducts);

// Ruta para obtener un producto por ID
router.get('/:id', productController.getProductById);

// Ruta para crear un nuevo producto
router.post('/add', upload.single('imagen'), productController.createProduct);

// Ruta para buscar productos
router.post('/search', productController.searchProducts);

// Ruta de busqueda avanzada
router.post('/search-advance', productController.searchProductsAdvance);

// Ruta para actualizar un producto
router.put('/:id', upload.single('imagen'), productController.updateProduct);

// Ruta para obtener los 20 productos más vendidos
router.get('/productos/mas-vendidos', productController.obtenerProductosMasVendidos);

// Ruta para obtener las promociones
router.get('/promos/:fecha', promocionesController.obtenerPromocionesPorFecha);
router.get('/categories/getAll', productController.getAllCategories);
router.get('/status/getAll', productController.getAllStatus);
router.put('/update/:id', productController.updateProductAttribute);
router.get('/getSearchTerm/:term', productController.getProductBySearchTerm);


module.exports = router;
