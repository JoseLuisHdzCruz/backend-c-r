const Carrito = require("../../../models/carritoModel");
const Usuario = require("../../../models/usuarioModel");
const Producto = require("../../../models/productsModel");
const sendPushNotification = require("../../services/notifications")
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;
const { Op } = require("sequelize");



const carritoController = {
  getCarrito: async (req, res) => {
    const { customerId } = req.params;
    try {
      const carritoItems = await Carrito.findAll({
        where: {customerId}
      });
      res.json(carritoItems);
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      res.status(500).json({ error: "Error al obtener el carrito" });
    }
  },
  getCarritoByToken: async (req, res) => {
    const { token } = req.params;
    try {
      const customer = await Usuario.findOne({
        where: { fcmToken: token }
      });

      if (customer) {
        const carritoItems = await Carrito.findAll({
          where: { customerId: customer.customerId }
        });
        res.json(carritoItems);
      }

    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      res.status(500).json({ error: "Error al obtener el carrito" });
    }
  },
  
  addToCarrito: async (req, res) => {
    try {
      const nuevoItem = await Carrito.create(req.body);
      res.status(201).json(nuevoItem);
    } catch (error) {
      console.error("Error al agregar un item al carrito:", error);
      res.status(500).json({ error: "Error al agregar un item al carrito" });
    }
  },

  updateCarrito : async (req, res) => {
    const { productoId, customerId } = req.params;
    try {
      const [numRowsUpdated, updatedRows] = await Carrito.update(req.body, {
        where: { productoId, customerId },
        returning: true,
      });
      if (numRowsUpdated === 0) {
        return res
          .status(404)
          .json({ error: "No se encontró el elemento del carrito" });
      }
      res.json(updatedRows[0]);
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
      res.status(500).json({ error: "Error al actualizar el carrito" });
    }
  },
  deleteCarrito : async (req, res) => {
    const { productoId, customerId } = req.body;
    try {
      const deletedRows = await Carrito.destroy({ 
        where: { productoId, customerId } 
      });
      if (deletedRows === 0) {
        return res
          .status(404)
          .json({ error: "No se encontró el elemento del carrito" });
      }
      res.json({ message: "Elemento del carrito eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar el elemento del carrito:", error);
      res
        .status(500)
        .json({ error: "Error al eliminar el elemento del carrito" });
    }
  },
  clearCarrito : async (req, res) => {
    const { customerId } = req.params;
  
    try {
      const deletedRows = await Carrito.destroy({ 
        where: { customerId } 
      });
      res.json({ message: `${deletedRows} elementos del carrito eliminados correctamente` });
    } catch (error) {
      console.error('Error al limpiar el carrito:', error);
      res.status(500).json({ error: 'Error al limpiar el carrito' });
    }
  },
  verifyToken: (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Token inválido" });
      }
      req.decoded = decoded;
      next();
    });
  },
  
  addToCarritoByToken: async (req, res) => {
    const { productName, token } = req.body;
    
    try {
      // Buscar al usuario por el token
      const usuario = await Usuario.findOne({
        where: { fcmToken: token }
      });
      
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Buscar el producto por nombre
      const producto = await Producto.findOne({
        where: { nombre: productName }
      });

      if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      // Crear un nuevo ítem en el carrito
      const nuevoItem = await Carrito.create({
        customerId: usuario.customerId,
        productoId: producto.productoId,
        producto: producto.nombre,
        precio: producto.precioFinal,
        IVA: producto.IVA,
        cantidad: 1, // Cantidad por defecto
        imagen: producto.imagen,
      });

      res.status(201).json(nuevoItem);
    } catch (error) {
      console.error("Error al agregar un item al carrito:", error);
      res.status(500).json({ error: "Error al agregar un item al carrito" });
    }
  },

  notifyAbandonedCart : async () => {
    try {
      // Buscar los carritos abandonados (Ejemplo: hace más de 24 horas)
      const abandonedCarts = await Carrito.findAll({
        where: {
          updatedAt: {
            [Op.lt]: new Date(Date.now() - 24 * 60 * 60 * 1000), // Carritos con más de 24 horas sin actualizar
          },
        },
        include: [Usuario], // Incluye al usuario para obtener el token FCM
      });
  
      abandonedCarts.forEach(async (cart) => {
        const token = cart.Usuario.fcmToken;
  
        const payload = {
          title: "¡Tu carrito te está esperando!",
          body: "No olvides completar tu compra y obtener tus productos favoritos.",
        };
  
        await sendPushNotification(token, payload);
      });
    } catch (error) {
      console.error("Error al enviar notificaciones de carrito abandonado:", error);
    }
  }
};

module.exports = carritoController;