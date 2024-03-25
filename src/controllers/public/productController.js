// /src/controllers/productController.js
// Importa tus modelos aquí
const Producto = require("../../../models/productsModel");
const Categoria = require("../../../models/categoriaModel");

const Yup = require("yup");
const { Op } = require('sequelize');



const validationSchema = Yup.object().shape({
  nombre: Yup.string().required("El nombre es obligatorio"),
  descripcion: Yup.string().required("La descripción es obligatoria"),
  precio: Yup.number().required("El precio es obligatorio").positive("El precio debe ser positivo"),
  existencia: Yup.number().required("La existencia es obligatoria").integer("La existencia debe ser un número entero").min(0, "La existencia no puede ser negativa"),
  categoriaId: Yup.number().required("La categoría es obligatoria"),
  statusId: Yup.number().required("El estado es obligatorio"),
  imagen: Yup.string().nullable(),
  IVA: Yup.number().nullable().positive("El IVA debe ser positivo"),
});

// Función para obtener elementos aleatorios de una matriz
function getRandomElements(array, numElements) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numElements);
}

module.exports = {
  getAllProducts: async (req, res, next) => {
    try {
      const products = await Producto.findAll();
      res.json(products);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      res.status(500).json({ error: "¡Algo salió mal al obtener productos!" });
    }
  },

  getRandomProducts: async (req, res, next) => {
    try {
      const products = await Producto.findAll();
      const randomProducts = getRandomElements(products, 10);
      res.json(randomProducts);
    } catch (error) {
      console.error("Error al obtener productos aleatorios:", error);
      res.status(500).json({ error: "¡Algo salió mal al obtener productos aleatorios!" });
    }
  },

  getProductById: async (req, res, next) => {
    const productId = req.params.id;
    try {
      const product = await Producto.findByPk(productId);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: "Producto no encontrado" });
      }
    } catch (error) {
      console.error("Error al obtener producto por ID:", error);
      res.status(500).json({ error: "¡Algo salió mal al obtener producto por ID!" });
    }
  },

  searchProducts: async (req, res, next) => {
    const { search } = req.body;
  
    try {
      // Convertir la cadena de búsqueda a minúsculas para hacer la búsqueda insensible a mayúsculas y minúsculas
      const searchTerm = search.toLowerCase();
  
      // Realizar la búsqueda de productos que contengan el término de búsqueda en el nombre
      const products = await Producto.findAll({
        where: {
          nombre: {
            [Op.like]: `%${searchTerm}%`
          }
        }
      });
  
      // Responder con los productos encontrados
      res.json(products);
    } catch (error) {
      console.error("Error al buscar productos:", error);
      res.status(500).json({ error: "¡Algo salió mal al buscar productos!" });
    }
  },

  createProduct: async (req, res, next) => {
    const productData = req.body;

    try {
      await validationSchema.validate(productData, { abortEarly: false });

      const newProduct = await Producto.create({
        nombre: productData.nombre,
        descripcion: productData.descripcion,
        precio: productData.precio,
        existencia: productData.existencia,
        categoriaId: productData.categoriaId,
        statusId: productData.statusId,
        imagen: productData.imagen,
        IVA: productData.precio * 0.16,
        precioFinal: productData.precio + productData.precio * 0.16,
      });

      res.status(201).json(newProduct);
    } catch (error) {
      if (error.name === "ValidationError") {
        const errors = error.errors.map((err) => err.message);
        return res.status(400).json({ errors });
      }

      console.error("Error al crear producto:", error);
      res.status(500).json({ error: "¡Algo salió mal al crear producto!" });
    }
  },

  updateProduct: async (req, res, next) => {
    const productId = req.params.id;
    const productData = req.body;

    try {
      await validationSchema.validate(productData, { abortEarly: false });

      const existingProduct = await Producto.findByPk(productId);
      if (!existingProduct) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      await existingProduct.update({
        nombre: productData.nombre,
        descripcion: productData.descripcion,
        precio: productData.precio,
        existencia: productData.existencia,
        categoriaId: productData.categoriaId,
        statusId: productData.statusId,
        imagen: productData.imagen || null,
        IVA: productData.IVA || null
      });

      res.json(existingProduct);
    } catch (error) {
      if (error.name === "ValidationError") {
        const errors = error.errors.map((err) => err.message);
        return res.status(400).json({ errors });
      }

      console.error("Error al actualizar producto:", error);
      res.status(500).json({ error: "¡Algo salió mal al actualizar producto!" });
    }
  },
};