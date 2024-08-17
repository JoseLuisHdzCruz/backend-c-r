const Venta = require("../../../models/ventaModel");
const DetalleVenta = require("../../../models/detalleVentaModel");
const TempVenta = require("../../../models/tempVentaModel");
const TempDetalleVenta = require("../../../models/tempDetalleVenta");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const { MercadoPagoConfig, Preference } = require("mercadopago");
// deberías almacenar y gestionar este valor de forma persistente.
let folioCounter = 0;
// const { v4: uuidv4 } = require('uuid');
const accessToken = process.env.MERCADOPAGO_API_KEY;

// Inicializar el cliente de Mercado Pago
const mercadopagoClient = new MercadoPagoConfig({ accessToken: accessToken });

const paymentController = {
  createOrder: async (req, res) => {
    const { items, customerId, metodoPagoId, venta } = req.body;
    try {
      const fecha = new Date();

      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-based month

      // Incrementar el contador de folios y generar el folio
      folioCounter += 1;
      const folio = `${year}${month}${String(folioCounter).padStart(7, '0')}`;

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
        domicilioId: venta.domicilioId
      });

      const ventaId = nuevaVenta.ventaId;
      console.log("valor venta", ventaId);
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
        notification_url: `http://localhost:5000/order/webhook?customerId=${customerId}&ventaId=${ventaId}`,
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
      const payment = req.query["data.id"];
      console.log("Id de la venta: " ,ventaId);
      if (payment && payment !== "") {

        console.log(payment);
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
          no_transaccion: payment,
          fecha: tempVenta.fecha,
          statusVentaId: tempVenta.statusVentaId,
          metodoPagoId: tempVenta.metodoPagoId,
          sucursalesId: tempVenta.sucursalesId,
          domicilioId: tempVenta.domicilioId,
          descuentoPromocion: null
        });

        const tempDetalleVenta = await TempDetalleVenta.findAll({
          where: { ventaId },
        });
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
          `http://localhost:5000/cart/clear/${customerId}`
        );

        res.status(201).json({ message: "Success" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something goes wrong" });
    }
  },
};

module.exports = paymentController;
