const admin = require("firebase-admin");
const path = require("path");

const firebaseConfig = {
  apiKey: "AIzaSyBjvb4nQAe8xKqdBHf8asQrX55dienhTpg",
  authDomain: "cineevent-1a246.firebaseapp.com",
  projectId: "cineevent-1a246",
  storageBucket: "cineevent-1a246.firebasestorage.app",
  messagingSenderId: "20576254243",
  appId: "1:20576254243:web:8f82a576490760c4e0b496",
  measurementId: "G-5NSCZ3R6Z8",
};

const initFirebase = () => {
  try {
    // Initialize Firebase Admin SDK
    // If a service account key exists in environment, use it
    // Otherwise, use Application Default Credentials or initialize without credentials for client-side token verification
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: firebaseConfig.projectId,
      });
    } else {
      // For local development or when using default credentials
      admin.initializeApp({
        projectId: firebaseConfig.projectId,
      });
    }
    console.log("Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase:", error.message);
    // Continue even if initialization fails - might use default credentials
  }
};

module.exports = { firebaseConfig, admin, initFirebase };
