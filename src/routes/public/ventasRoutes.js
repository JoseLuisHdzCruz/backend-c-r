const express = require("express");
const router = express.Router();
const ventasController = require("../../controllers/public/ventasController");
const Venta = require("../../../models/ventaModel");
const DetalleVenta = require("../../../models/detalleVentaModel");
const stripe = require("stripe")(
  "sk_test_51Pf8IA2NI1ZNadeOuyF3F0Maonkrfcy5iN7LdgJFvslXY8gWof16cLI4L1kj9Q5yNynMrcU2OTgLidxQ2Oxc0tgK00qpJdKqVv"
);
let folioCounter = 0;


const endpointSecret = "whsec_Q5Rd0u3j7Hw1iTeOO9Kh88Cp3pqgsgdswhsec_b380248ff75fb60c902e0bb91658d61b743f6f88c79ae0620e1b0df134c5d652";

// Rutas para manejar las ventas
router.post("/", ventasController.crearVenta);
router.get("/", ventasController.obtenerTodasLasVentas);
router.get("/getAllDetailSale", ventasController.getAllDetailsSales);
router.get("/:id", ventasController.obtenerVentaPorId);
router.get("/cliente/:customerId", ventasController.obtenerVentasPorCustomerId);
router.post("/filtroVentas", ventasController.filtrarVentasPorFecha);
router.post("/getAllSales", ventasController.filtrarTodasVentasPorFecha);
router.post("/cancelar-venta", ventasController.cancelarVenta);
router.post("/mate", ventasController.obtenerDetalleVentasPorProductoIdYFecha);
router.get(
  "/status/venta/:folio",
  ventasController.obtenerDetalleStatusPorFolio
);
router.post("/create-checkout-session", ventasController.crateVentaStripe);

// Rutas para manejar los detalles de venta
router.get("/detalle/:id", ventasController.obtenerDetalleVentaPorIdVenta);

router.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "mxn", // Ajusta la moneda según tu caso
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
});

router.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.log("Error al verificar el webhook:", err.message);
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;


      // Obtener los datos de metadata
    const venta = JSON.parse(session.metadata.venta);

    const fecha = new Date();
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');

    // Incrementar el contador de folios y generar el folio
    // Asegúrate de manejar `folioCounter` de manera persistente
    folioCounter += 1;
    const folio = `${year}${month}${String(folioCounter).padStart(3, '0')}`;

    const metodoPagoId = 4; // Asegúrate de usar el método de pago correcto

    // Crear la nueva venta
    const nuevaVenta = await Venta.create({
      folio,
      customerId: venta.customerId,
      cantidad: venta.cantidad,
      total: venta.total,
      totalProductos: venta.totalProductos,
      totalEnvio: venta.totalEnvio,
      totalIVA: venta.totalIVA,
      fecha,
      statusVentaId: 4,
      metodoPagoId: metodoPagoId,
      sucursalesId: venta.sucursalesId,
      domicilioId: venta.domicilioId,
      descuentoPromocion: null,
    });

    // Crear los registros de detalle de venta
    await Promise.all(
      venta.productos.map(async (item) => {
        await DetalleVenta.create({
          productoId: item.productoId,
          producto: item.producto,
          precio: item.precio,
          imagen: item.imagen,
          IVA: item.IVA,
          cantidad: item.cantidad,
          totalDV: item.totalDV,
          ventaId: nuevaVenta.ventaId,
        });
      })
    );

    // Limpiar el carrito del cliente
    await axios.delete(
      `https://backend-c-r-production.up.railway.app/cart/clear/${customerId}`
    );

    res.json({ received: true });
  } else {
    // Manejar otros eventos si es necesario
    res.json({ received: true });
  }
});

module.exports = router;
