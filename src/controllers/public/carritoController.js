const Carrito = require("../../../models/carritoModel");
const Usuario = require("../../../models/usuarioModel");
const Producto = require("../../../models/productsModel");
const NotificacionesPush = require("../../../models/notificacionesPushModel");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;
const { Op } = require("sequelize");
const sendPushNotification = require('../../services/notifications');




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

  sendCartNotification: async () => {
    try {
      // Obtener la fecha actual menos 2 horas
      const twoHoursAgo = new Date(new Date() - 1 * 60 * 1000);

      // Obtener todos los carritos cuya fecha de creación sea mayor a 2 horas
      const carritoItems = await Carrito.findAll({
        where: {
          createdAt: {
            [Op.lte]: twoHoursAgo // Carritos creados hace más de 2 horas
          }
        }
      });

      // Si hay carritos pendientes
      if (carritoItems.length > 0) {
        // Obtener los customerIds únicos de los carritos
        const customerIds = [...new Set(carritoItems.map(item => item.customerId))];

        // Recorrer cada customerId para enviar notificaciones
        for (let customerId of customerIds) {
          // Crear la carga útil para la notificación
          const payload = {
            title: "Tu carrito te está esperando",
            message: "Hay productos en tu carrito listos para la compra.",
            data: { customerId } // Usar customerId para identificador único en el frontend
          };

          // Obtener todas las suscripciones de notificaciones para el cliente
          const subscriptions = await NotificacionesPush.findAll({
            where: { customerId }
          });

          // Enviar la notificación a cada suscripción
          subscriptions.forEach(async (subscription) => {
            await sendPushNotification(subscription, payload);
          });
        }

        console.log("Notificaciones de carrito enviadas a los usuarios con carritos pendientes.");
      } else {
        console.log("No hay carritos pendientes.");
      }
    } catch (error) {
      console.error("Error al enviar notificación de carrito:", error);
    }
  },
};

module.exports = carritoController;