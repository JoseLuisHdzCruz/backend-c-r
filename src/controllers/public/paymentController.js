const mercadopage = require('mercadopago');
const access_token = process.env.MERCADOPAGO_API_KEY;

const paymentController = {
  createOrder: async (req, res) => {
    mercadopage.configure({
        access_token,
      });
    
      try {
        const result = await mercadopage.preferences.create({
          items: [
            {
              title: "Laptop",
              unit_price: 500,
              currency_id: "MX",
              quantity: 1,
            },
          ],
          notification_url: "https://e720-190-237-16-208.sa.ngrok.io/webhook",
          back_urls: {
            success: "http://localhost:5000/order/success",
            // pending: "https://e720-190-237-16-208.sa.ngrok.io/pending",
            // failure: "https://e720-190-237-16-208.sa.ngrok.io/failure",
          },
        });
    
        console.log(result);
    
        // res.json({ message: "Payment creted" });
        res.json(result.body);
      } catch (error) {
        return res.status(500).json({ message: "Something goes wrong" });
      }
  },
  receiveWebhook : async (req, res) => {
    try {
        const payment = req.query;
        console.log(payment);
        if (payment.type === "payment") {
          const data = await mercadopage.payment.findById(payment["data.id"]);
          console.log(data);
        }
    
        res.sendStatus(204);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something goes wrong" });
      }
  },
};

module.exports = paymentController;