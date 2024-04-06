const { MercadoPagoConfig, Preference } = require("mercadopago");
const axios = require("axios");

// const { v4: uuidv4 } = require('uuid');
const accessToken = process.env.MERCADOPAGO_API_KEY;

// Inicializar el cliente de Mercado Pago
const mercadopagoClient = new MercadoPagoConfig({ accessToken: accessToken });

const paymentController = {
  createOrder: async (req, res) => {
    const { customerId, items, venta } = req.body;
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
          failure: "https://chucherias-y-regalos.vercel.app/checkup",
          pending: "https://chucherias-y-regalos.vercel.app/",
        },
        auto_return: "approved",
      };

      // Realizar la solicitud para crear el pago
      const preference = new Preference(mercadopagoClient);
      const result = await preference.create({ body });
      // Enviar la respuesta al cliente

      await axios.post("https://backend-c-r-production.up.railway.app/ventas/", {
        customerId, venta
      });

      res.json({
        id: result.id,
      });
    } catch (error) {
      // Manejar los errores
      console.error("Error al crear el pago:", error);
      res.status(500).json({ error: "Error al procesar la solicitud" });
    }
  },
};

module.exports = paymentController;
