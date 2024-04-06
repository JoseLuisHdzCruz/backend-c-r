const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const axios = require("axios");

// const { v4: uuidv4 } = require('uuid');
const accessToken = process.env.MERCADOPAGO_API_KEY;

// Inicializar el cliente de Mercado Pago
const mercadopagoClient = new MercadoPagoConfig({ accessToken: accessToken });

const paymentController = {
  createOrder: async (req, res) => {
    const { items, venta, customerId, metodoPagoId } = req.body;
    try {
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
        notification_url: `https://backend-c-r-production.up.railway.app/order/webhook?venta=${venta}&customerId=${customerId}&metodoPagoId=${metodoPagoId}`
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

  receiveWebhook : async (req, res) => {
    try {
      const payments = req.query;

      console.log(payments["data.id"]);
        const venta = payments.venta;
        console.log(payments.metodoPagoId, venta, payments.customerId)
  
      res.sendStatus(204);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something goes wrong" });
    }
  }
};

module.exports = paymentController;
