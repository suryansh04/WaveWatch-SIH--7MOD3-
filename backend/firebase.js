const admin = require("firebase-admin");
const serviceAccount = require("./wavewatch-65c6e-firebase-adminsdk-fbsvc-b46fadc14a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
