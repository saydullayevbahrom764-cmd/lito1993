import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDemo-replace-with-your-key",
  authDomain: "birbir-clone.firebaseapp.com",
  projectId: "birbir-clone",
  storageBucket: "birbir-clone.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
};

let app, db, auth, storage;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
} catch (e) {
  console.warn("Firebase init error:", e);
}

export { db, auth, storage };
export default app;
