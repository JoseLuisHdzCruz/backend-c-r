// /src/controllers/productController.js

const db = require("../../config/database");
const Yup = require("yup");
const { v4: uuidv4 } = require("uuid");


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

module.exports = {
  getAllProducts: async (req, res, next) => {
    try {
      const products = await db.query("SELECT * FROM products;");
      res.json(products);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      res.status(500).json({ error: "¡Algo salió mal al obtener productos!" });
    }
  },

  getRandomProducts: async (req, res, next) => {
    try {
      // Consulta para obtener 10 productos aleatorios
      const randomProducts = await db.query(
        "SELECT * FROM products ORDER BY RAND() LIMIT 10;"
      );
      res.json(randomProducts);
    } catch (error) {
      console.error("Error al obtener productos aleatorios:", error);
      res.status(500).json({ error: "¡Algo salió mal al obtener productos aleatorios!" });
    }
  },

  getProductById: async (req, res, next) => {
    const productId = req.params.id;
    try {
      const product = await db.query(
        "SELECT * FROM products WHERE productoId = ?",
        [productId]
      );
      if (product.length > 0) {
        res.json(product[0]);
      } else {
        res.status(404).json({ message: "Producto no encontrado" });
      }
    } catch (error) {
      console.error("Error al obtener producto por ID:", error);
      res
        .status(500)
        .json({ error: "¡Algo salió mal al obtener producto por ID!" });
    }
  },

  createProduct: async (req, res, next) => {
    const productData = req.body;

    try {
      // Validar los datos usando Yup
      await validationSchema.validate(productData, { abortEarly: false });
      
      // Generar un id único
      const productId = uuidv4();

      // Insertar el nuevo producto en la base de datos
      const result = await db.query(
        "INSERT INTO products (productoId, nombre, descripcion, precio, existencia, categoriaId, statusId, created, modified, imagen, IVA) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, 1);",
        [
          productId,
          productData.nombre,
          productData.descripcion,
          productData.precio,
          productData.existencia,
          productData.categoriaId,
          productData.statusId,
          productData.imagen
        ]
      );
      
      // Obtener el producto recién creado
      const newProduct = await db.query(
        "SELECT * FROM products WHERE productoId = ?",
        [productId]
      );

      // Responder con el nuevo producto
      res.status(201).json(newProduct[0]);
    } catch (error) {
      // Manejar errores de validación
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
      // Validar los datos usando Yup
      await validationSchema.validate(productData, { abortEarly: false });

      // Verificar si el producto existe
      const existingProduct = await db.query(
        "SELECT * FROM products WHERE productId = ?",
        [productId]
      );

      if (existingProduct.length === 0) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      // Actualizar el producto en la base de datos
      await db.query(
        "UPDATE products SET nombre = ?, descripcion = ?, precio = ?, existencia = ?, categoriaId = ?, statusId = ?, modified = NOW(), imagen = ?, IVA = ? WHERE productId = ?",
        [
          productData.nombre,
          productData.descripcion,
          productData.precio,
          productData.existencia,
          productData.categoriaId,
          productData.statusId,
          productData.imagen || null,
          productData.IVA || null,
          productId,
        ]
      );

      // Obtener el producto actualizado
      const updatedProduct = await db.query(
        "SELECT * FROM products WHERE productId = ?",
        [productId]
      );

      // Responder con el producto actualizado
      res.json(updatedProduct[0]);
    } catch (error) {
      // Manejar errores de validación
      if (error.name === "ValidationError") {
        const errors = error.errors.map((err) => err.message);
        return res.status(400).json({ errors });
      }

      console.error("Error al actualizar producto:", error);
      res.status(500).json({ error: "¡Algo salió mal al actualizar producto!" });
    }
  },
};
