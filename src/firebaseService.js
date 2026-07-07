import {
  collection, doc, setDoc, getDoc, getDocs, addDoc,
  updateDoc, deleteDoc, query, where, orderBy,
  onSnapshot, serverTimestamp, limit,
} from "firebase/firestore";
import {
  RecaptchaVerifier, signInWithPhoneNumber,
  onAuthStateChanged, signOut,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "./firebase";

// ── AUTH ──────────────────────────────────────────────
export const setupRecaptcha = (id) => {
  if (window.recaptchaVerifier) window.recaptchaVerifier.clear();
  window.recaptchaVerifier = new RecaptchaVerifier(auth, id, {
    size: "invisible", callback: () => {},
  });
  return window.recaptchaVerifier;
};
export const sendSms = async (phone) => {
  const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
  window.confirmationResult = result;
  return result;
};
export const verifySms = async (code) => {
  const r = await window.confirmationResult.confirm(code);
  return r.user;
};
export const logOut = () => signOut(auth);
export const onAuthChange = (cb) => onAuthStateChanged(auth, cb);

// ── USERS ─────────────────────────────────────────────
export const createUser = async (uid, data) => {
  await setDoc(doc(db, "users", uid), {
    ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  });
};
export const getUser = async (uid) => {
  const s = await getDoc(doc(db, "users", uid));
  return s.exists() ? { id: s.id, ...s.data() } : null;
};
export const updateUser = async (uid, data) => {
  await updateDoc(doc(db, "users", uid), { ...data, updatedAt: serverTimestamp() });
};

// ── LISTINGS ──────────────────────────────────────────
export const createListing = async (data) => {
  const r = await addDoc(collection(db, "listings"), {
    ...data, createdAt: serverTimestamp(), views: 0, favorites: 0, active: true,
  });
  return r.id;
};
export const getListings = async (cat = null, lim = 40) => {
  let q = cat
    ? query(collection(db, "listings"), where("category", "==", cat), where("active", "==", true), orderBy("createdAt", "desc"), limit(lim))
    : query(collection(db, "listings"), where("active", "==", true), orderBy("createdAt", "desc"), limit(lim));
  const s = await getDocs(q);
  return s.docs.map(d => ({ id: d.id, ...d.data() }));
};
export const getListing = async (id) => {
  const s = await getDoc(doc(db, "listings", id));
  return s.exists() ? { id: s.id, ...s.data() } : null;
};
export const updateListing = async (id, data) => {
  await updateDoc(doc(db, "listings", id), { ...data, updatedAt: serverTimestamp() });
};
export const deleteListing = async (id) => {
  await updateDoc(doc(db, "listings", id), { active: false });
};
export const listenListings = (cb) => {
  const q = query(collection(db, "listings"), where("active", "==", true), orderBy("createdAt", "desc"), limit(60));
  return onSnapshot(q, (s) => cb(s.docs.map(d => ({ id: d.id, ...d.data() }))));
};

// ── FAVORITES ─────────────────────────────────────────
export const addFavorite = async (uid, lid) => {
  await setDoc(doc(db, "favorites", `${uid}_${lid}`), { uid, lid, savedAt: serverTimestamp() });
};
export const removeFavorite = async (uid, lid) => {
  await deleteDoc(doc(db, "favorites", `${uid}_${lid}`));
};
export const getUserFavorites = async (uid) => {
  const q = query(collection(db, "favorites"), where("uid", "==", uid));
  const s = await getDocs(q);
  return s.docs.map(d => d.data().lid);
};

// ── CHATS ─────────────────────────────────────────────
export const sendMessage = async (chatId, msg) => {
  await addDoc(collection(db, "chats", chatId, "messages"), {
    ...msg, createdAt: serverTimestamp(),
  });
  await setDoc(doc(db, "chats", chatId), {
    lastMessage: msg.text, lastAt: serverTimestamp(),
    participants: [msg.from, msg.to],
  }, { merge: true });
};
export const listenMessages = (chatId, cb) => {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (s) => cb(s.docs.map(d => ({ id: d.id, ...d.data() }))));
};
export const getUserChats = async (uid) => {
  const q = query(collection(db, "chats"), where("participants", "array-contains", uid));
  const s = await getDocs(q);
  return s.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ── IMAGES ────────────────────────────────────────────
export const uploadImage = async (file, path) => {
  const r = ref(storage, path);
  await uploadBytes(r, file);
  return await getDownloadURL(r);
};

// ── REVIEWS ───────────────────────────────────────────
export const addReview = async (sellerId, review) => {
  await addDoc(collection(db, "users", sellerId, "reviews"), {
    ...review, createdAt: serverTimestamp(),
  });
};
export const getReviews = async (sellerId) => {
  const s = await getDocs(collection(db, "users", sellerId, "reviews"));
  return s.docs.map(d => ({ id: d.id, ...d.data() }));
};
