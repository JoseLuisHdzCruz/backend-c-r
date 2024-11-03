// src/services/notifications.js
const admin = require("../config/firebaseAdmin");

const sendPushNotification = async (token, payload) => {
  try {
    await admin.messaging().send({
      token: token,
      notification: payload,
    });
    console.log("Notificación enviada");
  } catch (error) {
    console.error("Error al enviar notificación:", error);
  }
};

module.exports = sendPushNotification;
