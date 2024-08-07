const Venta = require("../../../models/ventaModel");
const DetalleVenta = require("../../../models/detalleVentaModel");
const Notificaciones = require("../../../models/notificacionesModel");
const NotificacionesAdmin = require("../../../models/notificacionesAdminModel");
const StatusVenta = require("../../../models/statusVentaModel");
const fcmServerKey = process.env.FCM_SERVER_KEY;
const { Op } = require("sequelize");
const axios = require("axios");
const Usuario = require("../../../models/usuarioModel");
const stripe = require("stripe")(
  "sk_test_51Pf8IA2NI1ZNadeOuyF3F0Maonkrfcy5iN7LdgJFvslXY8gWof16cLI4L1kj9Q5yNynMrcU2OTgLidxQ2Oxc0tgK00qpJdKqVv"
);
// deberías almacenar y gestionar este valor de forma persistente.
let folioCounter = 0;

const ventasController = {
  // Controlador para crear una nueva venta
  crearVenta: async (req, res) => {
    try {
      const { metodoPagoId, customerId, venta } = req.body;

      // Fecha actual
      const fecha = new Date();

      // Fecha actual
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, "0"); // getMonth() returns 0-based month

      // Función para generar un folio único
      let folio;
      let folioExists = true;
      while (folioExists) {
        folioCounter += 1;
        folio = `${year}${month}${String(folioCounter).padStart(3, "0")}`;

        // Verificar si el folio ya existe en la base de datos
        const existingVenta = await Venta.findOne({ where: { folio } });
        if (!existingVenta) {
          folioExists = false;
        }
      }

      const statusVentaId = 4;
      const nuevaVenta = await Venta.create({
        folio,
        customerId: customerId,
        cantidad: venta.cantidad,
        total: venta.total,
        totalProductos: venta.totalProductos,
        totalEnvio: venta.totalEnvio,
        totalIVA: venta.totalIVA,
        fecha,
        statusVentaId,
        metodoPagoId: metodoPagoId,
        sucursalesId: venta.sucursalesId,
        domicilioId: venta.domicilioId,
        descuentoPromocion: null,
      });
      // Crear los registros de detalle de venta
      const detallesVenta = await Promise.all(
        venta.productos.map(async (producto) => {
          const detalleVenta = await DetalleVenta.create({
            productoId: producto.productoId,
            producto: producto.producto,
            precio: producto.precio,
            imagen: producto.imagen,
            IVA: producto.IVA,
            cantidad: producto.cantidad,
            totalDV: producto.totalDV,
            ventaId: nuevaVenta.ventaId,
          });
          return detalleVenta;
        })
      );

      await axios.delete(
        `https://backend-c-r-production.up.railway.app/cart/clear/${customerId}`
      );

      // Obtener el token FCM del usuario
      const user = await Usuario.findOne({ where: { customerId: customerId } });
      const fcmToken = user.fcmToken;

      // Enviar la notificación push si el usuario tiene un token FCM
      if (fcmToken) {
        const message = {
          to: fcmToken,
          notification: {
            title: "Nueva venta",
            body: "Tu compra ha sido realizada con éxito",
          },
        };

        await axios.post("https://fcm.googleapis.com/fcm/send", message, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `key=${fcmServerKey}`,
          },
        });
      }

      // Respuesta exitosa
      res.status(201).json({ venta: nuevaVenta, detallesVenta });
    } catch (error) {
      console.error("Error al crear la venta con detalle:", error);
      res.status(500).json({ error: "Error al crear la venta con detalle" });
    }
  },

  // Controlador para obtener el estado detallado de una venta por su folio
  obtenerDetalleStatusPorFolio: async (req, res) => {
    const { folio } = req.params;

    try {
      // Buscar la venta por su folio
      const venta = await Venta.findOne({ where: { folio } });

      // Verificar si la venta existe
      if (!venta) {
        return res.status(404).json({ error: "Venta no encontrada" });
      }

      // Obtener el estado de la venta
      const statusVenta = await StatusVenta.findByPk(venta.statusVentaId);

      if (!statusVenta) {
        return res.status(404).json({ error: "Estado de venta no encontrado" });
      }

      // Responder con el estado de la venta
      res.json({ folio: venta.folio, estado: statusVenta.statusVenta });
    } catch (error) {
      console.error("Error al obtener el estado de la venta por folio:", error);
      res
        .status(500)
        .json({ error: "Error al obtener el estado de la venta por folio" });
    }
  },

  // Controlador para obtener todos los registros de ventas
  obtenerTodasLasVentas: async (req, res) => {
    const { startDate, endDate } = req.query;

    let filter = {};

    if (startDate && endDate) {
      filter = {
        where: {
          fecha: {
            [Op.between]: [new Date(startDate), new Date(endDate)],
          },
        },
      };
    } else if (startDate) {
      filter = {
        where: {
          fecha: {
            [Op.gte]: new Date(startDate),
          },
        },
      };
    } else if (endDate) {
      filter = {
        where: {
          fecha: {
            [Op.lte]: new Date(endDate),
          },
        },
      };
    }

    try {
      const ventas = await Venta.findAll(filter);
      res.json(ventas);
    } catch (error) {
      console.error("Error al obtener las ventas:", error);
      res.status(500).json({ error: "Error al obtener las ventas" });
    }
  },

  obtenerVentasPorFecha: async (req, res) => {
    const { startDate, endDate } = req.query;
  
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate y endDate son requeridos' });
    }
  
    const filter = {
      where: {
        fecha: {
          [Op.between]: [new Date(startDate), new Date(`${endDate} 23:59:59`)],
        },
      },
    };
  
    try {
      const ventas = await Venta.findAll(filter);
      res.json(ventas);
    } catch (error) {
      console.error('Error al obtener las ventas por fecha:', error);
      res.status(500).json({ error: 'Error al obtener las ventas por fecha' });
    }
  },

  actualizarStatusPorId: async (req, res) => {
    const { ventaId } = req.params;
    const { statusVentaId } = req.body;

    try {
        // Buscar la venta por su ID
        const venta = await Venta.findByPk(ventaId);

        // Verificar si la venta existe
        if (!venta) {
            return res.status(404).json({ error: "Venta no encontrada" });
        }

        // Actualizar el estado de la venta
        venta.statusVentaId = statusVentaId;
        await venta.save();

        // Obtener el nuevo estado de la venta
        const nuevoStatusVenta = await StatusVenta.findByPk(statusVentaId);

        // Responder con el estado actualizado de la venta
        res.json({ ventaId: venta.ventaId, estado: nuevoStatusVenta.statusVenta });
    } catch (error) {
      console.error(
        "Error al actualizar el estado de la venta por folio:",
        error
      );
      res
        .status(500)
        .json({ error: "Error al actualizar el estado de la venta por folio" });
    }
  },

  // Controlador para obtener todos los registros de ventas
  getAllDetailsSales: async (req, res) => {
    try {
      const ventas = await DetalleVenta.findAll();
      res.json(ventas);
    } catch (error) {
      console.error("Error al obtener las ventas:", error);
      res.status(500).json({ error: "Error al obtener las ventas" });
    }
  },

  // Controlador para obtener una venta por su ID
  obtenerVentaPorId: async (req, res) => {
    const ventaId = req.params.id;
    try {
      const venta = await Venta.findByPk(ventaId);
      if (!venta) {
        return res.status(404).json({ error: "Venta no encontrada" });
      }
      res.json(venta);
    } catch (error) {
      console.error("Error al obtener la venta por ID:", error);
      res.status(500).json({ error: "Error al obtener la venta por ID" });
    }
  },

  // Controlador para obtener una venta por su ID
  obtenerDetalleVentaPorIdVenta: async (req, res) => {
    const ventaId = req.params.id;
    try {
      const venta = await DetalleVenta.findAll({ where: { ventaId } });
      if (!venta) {
        return res.status(404).json({ error: "Detalle venta no encontrada" });
      }
      res.json(venta);
    } catch (error) {
      console.error("Error al obtener el detalle venta por ventaId:", error);
      res.status(500).json({ error: "Error  el detalle venta por ventaId" });
    }
  },

  // Controlador para obtener todas las ventas de un cliente por su ID de cliente
  obtenerVentasPorCustomerId: async (req, res) => {
    const customerId = req.params.customerId;
    try {
      const ventas = await Venta.findAll({ where: { customerId } });
      res.json(ventas);
    } catch (error) {
      console.error("Error al obtener las ventas por customerId:", error);
      res
        .status(500)
        .json({ error: "Error al obtener las ventas por customerId" });
    }
  },

  filtrarVentasPorFecha: async (req, res) => {
    const { fechaInicial, fechaFinal, customerId } = req.body;
    try {
      // Convertir la fecha final a un objeto Date
      const fechaFinalDate = new Date(fechaFinal);

      // Agregar un día a la fecha final
      fechaFinalDate.setDate(fechaFinalDate.getDate() + 1);

      // Consultar ventas filtradas por rango de fechas y customerId
      const ventasFiltradas = await Venta.findAll({
        where: {
          customerId: customerId,
          fecha: {
            [Op.between]: [fechaInicial, fechaFinalDate],
          },
        },
      });

      res.json(ventasFiltradas);
    } catch (error) {
      console.error("Error al filtrar ventas por fecha:", error);
      res.status(500).json({ error: "Error al obtener las ventas filtradas" });
    }
  },

  getAllStatusVenta: async (req, res, next) => {
    try {
      const status = await StatusVenta.findAll();
      res.json(status);
    } catch (error) {
      console.error("Error al obtener los status de ventas:", error);
      res
        .status(500)
        .json({ error: "¡Algo salió mal al obtener los status de ventas!" });
    }
  },

  filtrarTodasVentasPorFecha: async (req, res) => {
    const { startDate, endDate } = req.body;
    try {
      // Convertir la fecha final a un objeto Date
      const fechaFinalDate = new Date(endDate);

      // Agregar un día a la fecha final
      fechaFinalDate.setDate(fechaFinalDate.getDate() + 1);

      // Consultar ventas filtradas por rango de fechas y customerId
      const ventasFiltradas = await Venta.findAll({
        where: {
          fecha: {
            [Op.between]: [startDate, fechaFinalDate],
          },
        },
      });

      res.json(ventasFiltradas);
    } catch (error) {
      console.error("Error al filtrar ventas por fecha:", error);
      res.status(500).json({ error: "Error al obtener las ventas filtradas" });
    }
  },

  obtenerDetalleVentasPorProductoIdYFecha: async (req, res) => {
    const { fechaInicial, fechaFinal, productoId } = req.body;

    try {
      // Paso 1: Obtener las ventas en el rango de fechas
      // Convertir la fecha final a un objeto Date
      const fechaFinalDate = new Date(fechaFinal);

      // Agregar un día a la fecha final
      fechaFinalDate.setDate(fechaFinalDate.getDate() + 1);

      // Consultar ventas filtradas por rango de fechas y customerId
      const ventas = await Venta.findAll({
        where: {
          fecha: {
            [Op.between]: [fechaInicial, fechaFinalDate],
          },
        },
      });
      console.log(ventas);

      // Paso 2: Para cada venta, obtener todos sus detalles de venta
      let totalProductosComprados = 0;

      for (const venta of ventas) {
        const detallesVenta = await DetalleVenta.findAll({
          where: {
            ventaId: venta.ventaId,
            productoId: productoId,
          },
        });

        // Paso 3: Contar la cantidad de productos específicos para cada detalle de venta
        detallesVenta.forEach((detalleVenta) => {
          totalProductosComprados += detalleVenta.cantidad;
        });
      }

      // Enviar el total de productos comprados como respuesta
      res.status(200).json({ totalProductosComprados });
    } catch (error) {
      console.error(
        "Error al obtener detalles de ventas por productoId y fecha:",
        error
      );
      res.status(500).json({
        error:
          "Ocurrió un error al obtener detalles de ventas por productoId y fecha",
      });
    }
  },

  cancelarVenta: async (req, res) => {
    const { folio, reason } = req.body;

    try {
      // Buscar la venta por su folio
      const venta = await Venta.findOne({ where: { folio } });

      // Verificar si la venta existe
      if (!venta) {
        return res.status(404).json({ error: "Venta no encontrada" });
      }

      // Verificar si la venta ya está cancelada
      if (venta.statusVentaId === 5) {
        // Supongamos que el estado 5 representa "cancelado"
        return res.status(400).json({ error: "La venta ya está cancelada" });
      }

      if (venta.statusVentaId === 4) {
        await Notificaciones.create({
          evento: "Cancelacion de venta",
          descripcion: `Se cancelado la compra con el folio: ${venta.folio}`,
          fecha: new Date(),
          estado: "No leído",
          customerId: venta.customerId,
        });
      } else if (venta.statusVentaId === 1) {
        await Notificaciones.create({
          evento: "Cancelacion de venta",
          descripcion: `Se cancelado la compra con el folio: ${venta.folio},  su reembolso se vera reflejado en los proximos 5 dias habiles`,
          fecha: new Date(),
          estado: "No leído",
          customerId: venta.customerId,
        });

        await NotificacionesAdmin.create({
          evento: "Reembolso pendiente",
          descripcion: `Se cancelado la compra con el folio: ${venta.folio},  se debe reembolsar la cantidad: ${venta.total} al usuario: ${venta.customerId}`,
          fecha: new Date(),
          estado: "No leído",
          admonId: 1,
        });
      }

      // Actualizar el estado de la venta a cancelado y agregar el motivo de cancelación
      venta.statusVentaId = 5;
      venta.motivoCancelacion = reason;
      await venta.save();

      // Respuesta exitosa
      res.json({ message: "La venta ha sido cancelada exitosamente" });
    } catch (error) {
      console.error("Error al cancelar la venta:", error);
      res.status(500).json({ error: "Error al cancelar la venta" });
    }
  },

  crateVentaStripe: async (req, res) => {
    const { items, shipping, venta, customerId, metodoPagoId } = req.body;

    try {
      // Imprime para verificar la solicitud
      console.log("Datos recibidos:", req.body);

      // Crea una sesión de Checkout
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: items.map((item) => ({
          price_data: {
            currency: "mxn",
            product_data: {
              name: item.title,
              images: [item.imagen],
            },
            unit_amount: Math.round(item.price), // Convertir a centavos y redondear a entero
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: "https://chucherias-y-regalos.vercel.app/purchase-history",
        cancel_url: "https://chucherias-y-regalos.vercel.app/select-payment",
        shipping_options: shipping
          ? [
              {
                shipping_rate_data: {
                  type: "fixed_amount",
                  fixed_amount: {
                    amount: Math.round(shipping.price), // Convertir a centavos y redondear a entero
                    currency: "mxn",
                  },
                  display_name: "Envío",
                  delivery_estimate: {
                    minimum: {
                      unit: "hour",
                      value: 24,
                    },
                    maximum: {
                      unit: "hour",
                      value: 72,
                    },
                  },
                },
              },
            ]
          : [],
        metadata: {},
      });

      // Fecha actual
      const fecha = new Date();

      // Fecha actual
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, "0"); // getMonth() returns 0-based month

      // Función para generar un folio único
      let folio;
      let folioExists = true;
      while (folioExists) {
        folioCounter += 1;
        folio = `${year}${month}${String(folioCounter).padStart(3, "0")}`;

        // Verificar si el folio ya existe en la base de datos
        const existingVenta = await Venta.findOne({ where: { folio } });
        if (!existingVenta) {
          folioExists = false;
        }
      }

      const statusVentaId = 1;
      const nuevaVenta = await Venta.create({
        folio,
        customerId: customerId,
        cantidad: venta.cantidad,
        total: venta.total,
        totalProductos: venta.totalProductos,
        totalEnvio: venta.totalEnvio,
        totalIVA: venta.totalIVA,
        fecha,
        statusVentaId,
        metodoPagoId: metodoPagoId,
        sucursalesId: venta.sucursalesId,
        domicilioId: venta.domicilioId,
        descuentoPromocion: null,
      });
      // Crear los registros de detalle de venta
      const detallesVenta = await Promise.all(
        venta.productos.map(async (producto) => {
          const detalleVenta = await DetalleVenta.create({
            productoId: producto.productoId,
            producto: producto.producto,
            precio: producto.precio,
            imagen: producto.imagen,
            IVA: producto.IVA,
            cantidad: producto.cantidad,
            totalDV: producto.totalDV,
            ventaId: nuevaVenta.ventaId,
          });
          return detalleVenta;
        })
      );

      await axios.delete(
        `https://backend-c-r-production.up.railway.app/cart/clear/${customerId}`
      );

      res.json({ id: session.id });
    } catch (error) {
      console.error("Error al crear la sesión de Checkout:", error);
      res.status(500).send("Error al crear la sesión de Checkout");
    }
  },
};

module.exports = ventasController;
