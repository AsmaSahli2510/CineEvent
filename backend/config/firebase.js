const admin = require("firebase-admin");

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || "cineevent-1a246",
};

let firebaseReady = false;

const buildServiceAccount = () => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const decoded = Buffer.from(
      process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
      "base64",
    ).toString("utf8");
    return JSON.parse(decoded);
  }

  return null;
};

const initFirebase = () => {
  try {
    if (admin.apps.length > 0) {
      firebaseReady = true;
      return;
    }

    const serviceAccount = buildServiceAccount();
    const options = serviceAccount
      ? {
          credential: admin.credential.cert(serviceAccount),
          projectId: firebaseConfig.projectId,
        }
      : {
          projectId: firebaseConfig.projectId,
        };

    admin.initializeApp(options);
    firebaseReady = true;
    console.log("Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase:", error.message);
    firebaseReady = false;
  }
};

module.exports = {
  firebaseConfig,
  admin,
  initFirebase,
  isFirebaseReady: () => firebaseReady,
};
