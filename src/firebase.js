import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCZX1PZN1fHMSDefdbgp10aaIwxM9VC3bU",
  authDomain: "osontop-ca806.firebaseapp.com",
  projectId: "osontop-ca806",
  storageBucket: "osontop-ca806.firebasestorage.app",
  messagingSenderId: "923845329864",
  appId: "1:923845329864:web:17feb16329982f683dbbefe",
  measurementId: "G-I5HR442968"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
