import {
  collection, doc, setDoc, getDoc, getDocs,
  addDoc, updateDoc, deleteDoc, query, where,
  orderBy, onSnapshot, serverTimestamp
} from "firebase/firestore";
import {
  RecaptchaVerifier, signInWithPhoneNumber,
  onAuthStateChanged, signOut
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "./firebase";

// =====================================================
// AUTH — Telefon raqam bilan login
// =====================================================
export const setupRecaptcha = (containerId) => {
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear();
  }
  window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: () => {},
  });
  return window.recaptchaVerifier;
};

export const sendSmsCode = async (phoneNumber) => {
  const appVerifier = window.recaptchaVerifier;
  const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  window.confirmationResult = result;
  return result;
};

export const verifySmsCode = async (code) => {
  const result = await window.confirmationResult.confirm(code);
  return result.user;
};

export const logOut = () => signOut(auth);

export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

// =====================================================
// USERS — Foydalanuvchilar
// =====================================================
export const createUser = async (uid, data) => {
  await setDoc(doc(db, "users", uid), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const getUser = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const updateUser = async (uid, data) => {
  await updateDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

// =====================================================
// STORES — Do'konlar
// =====================================================
export const createStore = async (storeData) => {
  const docRef = await addDoc(collection(db, "stores"), {
    ...storeData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    views: 0,
    subscriberBase: 0,
    reviews: [],
    products: [],
  });
  return docRef.id;
};

export const getStores = async () => {
  const snap = await getDocs(collection(db, "stores"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getStore = async (storeId) => {
  const snap = await getDoc(doc(db, "stores", storeId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const updateStore = async (storeId, data) => {
  await updateDoc(doc(db, "stores", storeId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const listenStores = (callback) => {
  return onSnapshot(collection(db, "stores"), (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

// =====================================================
// PRODUCTS — Mahsulotlar
// =====================================================
export const addProduct = async (storeId, productData) => {
  const prodRef = await addDoc(collection(db, "stores", storeId, "products"), {
    ...productData,
    createdAt: serverTimestamp(),
    reviews: [],
  });
  return prodRef.id;
};

export const getProducts = async (storeId) => {
  const snap = await getDocs(collection(db, "stores", storeId, "products"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const updateProduct = async (storeId, productId, data) => {
  await updateDoc(doc(db, "stores", storeId, "products", productId), data);
};

export const deleteProduct = async (storeId, productId) => {
  await deleteDoc(doc(db, "stores", storeId, "products", productId));
};

// =====================================================
// CHAT MESSAGES
// =====================================================
export const sendMessage = async (chatId, message) => {
  await addDoc(collection(db, "chats", chatId, "messages"), {
    ...message,
    createdAt: serverTimestamp(),
  });
};

export const listenMessages = (chatId, callback) => {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

// =====================================================
// STORAGE — Rasm yuklash
// =====================================================
export const uploadImage = async (file, path) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const uploadProductImage = async (storeId, file) => {
  const path = `stores/${storeId}/products/${Date.now()}_${file.name}`;
  return await uploadImage(file, path);
};

export const uploadProfilePhoto = async (userId, file) => {
  const path = `users/${userId}/profile_${Date.now()}`;
  return await uploadImage(file, path);
};

// =====================================================
// BOOKINGS — Bronlar
// =====================================================
export const createBooking = async (bookingData) => {
  const ref = await addDoc(collection(db, "bookings"), {
    ...bookingData,
    createdAt: serverTimestamp(),
    status: "pending",
  });
  return ref.id;
};

export const getUserBookings = async (userId) => {
  const q = query(collection(db, "bookings"), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// =====================================================
// SUBSCRIPTIONS — Obunalar
// =====================================================
export const subscribeToStore = async (userId, storeId) => {
  await setDoc(doc(db, "subscriptions", `${userId}_${storeId}`), {
    userId,
    storeId,
    createdAt: serverTimestamp(),
  });
};

export const unsubscribeFromStore = async (userId, storeId) => {
  await deleteDoc(doc(db, "subscriptions", `${userId}_${storeId}`));
};

export const getUserSubscriptions = async (userId) => {
  const q = query(collection(db, "subscriptions"), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data().storeId);
};

// =====================================================
// SAVED (Favorites)
// =====================================================
export const saveItem = async (userId, itemKey) => {
  await setDoc(doc(db, "saved", `${userId}_${itemKey}`), {
    userId,
    itemKey,
    savedAt: serverTimestamp(),
  });
};

export const unsaveItem = async (userId, itemKey) => {
  await deleteDoc(doc(db, "saved", `${userId}_${itemKey}`));
};

export const getUserSaved = async (userId) => {
  const q = query(collection(db, "saved"), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data().itemKey);
};
