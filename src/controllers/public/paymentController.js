const Venta = require("../../../models/ventaModel");
const DetalleVenta = require("../../../models/detalleVentaModel");
const TempVenta = require("../../../models/tempVentaModel");
const TempDetalleVenta = require("../../../models/tempDetalleVenta");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const { MercadoPagoConfig, Preference } = require("mercadopago");

// const { v4: uuidv4 } = require('uuid');
const accessToken = process.env.MERCADOPAGO_API_KEY;

// Inicializar el cliente de Mercado Pago
const mercadopagoClient = new MercadoPagoConfig({ accessToken: accessToken });

const paymentController = {
  createOrder: async (req, res) => {
    const { items, customerId, metodoPagoId, venta } = req.body;
    try {
      const fecha = new Date();

      // Generar folio manualmente (puedes implementar la lógica que necesites para generar el folio)
      const folio = uuidv4();

      const statusVentaId = 1;
      const nuevaVenta = await TempVenta.create({
        folio,
        customerId: customerId,
        cantidad: venta.cantidad,
        total: venta.total,
        totalProductos: venta.totalProductos,
        totalEnvio: venta.totalEnvio,
        totalIVA: venta.totalIVA,
        no_transaccion: null,
        fecha,
        statusVentaId,
        metodoPagoId: metodoPagoId,
        sucursalesId: venta.sucursalesId,
        domicilioId: venta.domicilioId,
      });

      const ventaId = nuevaVenta.ventaId;
      // Crear los registros de detalle de venta
      await Promise.all(
        venta.productos.map(async (producto) => {
          await TempDetalleVenta.create({
            productoId: producto.productoId,
            producto: producto.producto,
            precio: producto.precio,
            imagen: producto.imagen,
            IVA: producto.IVA,
            cantidad: producto.cantidad,
            totalDV: producto.totalDV,
            ventaId: nuevaVenta.ventaId,
          });
        })
      );

      const body = {
        items: items.map((item) => ({
          title: item.title,
          quantity: Number(item.quantity),
          unit_price: Number(item.price),
          picture_url: item.imagen,
          currency_id: "MXN",
        })),
        back_urls: {
          success: "https://chucherias-y-regalos.vercel.app/purchase-history",
          failure: "https://chucherias-y-regalos.vercel.app/select-payment",
          pending: "https://chucherias-y-regalos.vercel.app/",
        },
        auto_return: "approved",
        notification_url: `https://backend-c-r-production.up.railway.app/order/webhook?customerId=${customerId}?ventaId=${ventaId}`,
      };

      // Realizar la solicitud para crear el pago
      const preference = new Preference(mercadopagoClient);
      const result = await preference.create({ body });

      

      res.json({
        id: result.id,
      });
    } catch (error) {
      // Manejar los errores
      console.error("Error al crear el pago:", error);
      res.status(500).json({ error: "Error al procesar la solicitud" });
    }
  },

  receiveWebhook: async (req, res) => {
    try {
      const { customerId, ventaId } = req.query;
      // const venta = JSON.parse(req.query.venta)
      console.log(req.query["data.id"]);
      console.log(ventaId);

      const tempVenta = await TempVenta.findByPk(ventaId);
      if (!tempVenta) {
        return res.status(404).json({ error: "Venta no encontrada" });
      }

      const nuevaVenta = await Venta.create({
        folio: tempVenta.folio,
        customerId: tempVenta.customerId,
        cantidad: tempVenta.cantidad,
        total: tempVenta.total,
        totalProductos: tempVenta.totalProductos,
        totalEnvio: tempVenta.totalEnvio,
        totalIVA: tempVenta.totalIVA,
        no_transaccion: req.query["data.id"],
        fecha: tempVenta.fecha,
        statusVentaId: tempVenta.statusVentaId,
        metodoPagoId: tempVenta.metodoPagoId,
        sucursalesId: tempVenta.sucursalesId,
        domicilioId: tempVenta.domicilioId,
      });

      const tempDetalleVenta = await TempDetalleVenta.findAll({where: { ventaId }});
      if (!tempDetalleVenta) {
        return res.status(404).json({ error: "Detalle venta no encontrada" });
      }

      // Crear los registros de detalle de venta
      await Promise.all(
        tempDetalleVenta.map(async (producto) => {
          await DetalleVenta.create({
            productoId: producto.productoId,
            producto: producto.producto,
            precio: producto.precio,
            imagen: producto.imagen,
            IVA: producto.IVA,
            cantidad: producto.cantidad,
            totalDV: producto.totalDV,
            ventaId: nuevaVenta.ventaId,
          });
        })
      );

      await axios.delete(
        `https://backend-c-r-production.up.railway.app/cart/clear/${customerId}`
      );

      res.status(201).json({ message: "Success" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something goes wrong" });
    }
  },
};

module.exports = paymentController;
