const cron = require("node-cron");
const { notifyAbandonedCart } = require("../controllers/public/carritoController"); // Asegúrate de que el path sea correcto

// Ejecuta notifyAbandonedCart todos los días a la medianoche
cron.schedule("*/1 * * * *", notifyAbandonedCart, {
    scheduled: true,
    timezone: "America/Mexico_City" // Ajusta a tu zona horaria si es necesario
  });