const admin = require('firebase-admin');
const serviceAccount = require('./app-chucherias-firebase-adminsdk-fa7f5-adfb840103.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
