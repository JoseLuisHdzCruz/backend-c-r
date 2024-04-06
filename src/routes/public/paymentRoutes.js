const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/public/paymentController');

// Rutas para manejar las ventas
router.post('/create-order', paymentController.createOrder);

// router.post("/webhook", paymentController.receiveWebhook);

router.get("/success", (req, res) => res.send("Success"));

module.exports = router;
