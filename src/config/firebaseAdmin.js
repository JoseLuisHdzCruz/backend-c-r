// src/config/firebaseAdmin.js
const admin = require("firebase-admin");
const serviceAccount = require("../../chucheriasapp-firebase-adminsdk-2ch2b-043957698c.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
