const cron = require("node-cron");
const carritoController = require("../controllers/public/carritoController");

// Configura el job para enviar notificación cada minuto (para pruebas)
cron.schedule("* * * * *", async () => {
  console.log("Ejecutando job de notificación de carrito pendiente...");
  
  try {
    // Llamar la función que envía las notificaciones de carrito
  console.log("Entro");

    await carritoController.sendCartNotification();
  console.log("Salio xD");

  } catch (error) {
    console.error("Error al ejecutar el job de notificación de carrito:", error);
  }
});
