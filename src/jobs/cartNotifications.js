const cron = require("node-cron");
const carritoController = require("../controllers/public/carritoController");

// Configura el job para que se ejecute todos los días a las 10:00 a.m.
cron.schedule("0 10 * * *", async () => {
  console.log("Ejecutando job de notificación de carrito pendiente a las 10 a.m. hora de México...");
  
  try {

    await carritoController.sendCartNotification();

  } catch (error) {
    console.error("Error al ejecutar el job de notificación de carrito:", error);
  }
});
