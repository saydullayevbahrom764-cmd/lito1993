import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCZX1PZNTfHMSDefdbgpi0aaTwxM9VCDbU",
  authDomain: "osontop-ca806.firebaseapp.com",
  projectId: "osontop-ca806",
  storageBucket: "osontop-ca806.firebasestorage.app",
  messagingSenderId: "823845329864",
  appId: "1:823845329864:web:7f6b16329982f683dbbefd",
  measurementId: "G-T5HR44296B",
};

const app = initializeApp(firebaseConfig);
export const db      = getFirestore(app);
export const auth    = getAuth(app);
export const storage = getStorage(app);
export default app;
