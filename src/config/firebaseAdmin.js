// src/config/firebaseAdmin.js
const admin = require("firebase-admin");
const serviceAccount = require("../../chucheriasapp-firebase-adminsdk-2ch2b-f7e2b4d80d.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
