// services/notifications.js
const webpush = require('web-push');
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

webpush.setVapidDetails(
  'mailto:chucheriasyregalos01@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const sendPushNotification = async (subscription, payload) => {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    console.log("Notificación enviada!");
  } catch (error) {
    console.error("Error al enviar notificación:", error);
  }
};

module.exports = sendPushNotification;
