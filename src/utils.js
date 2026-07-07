// =====================================================
// UTILITY HELPERS
// =====================================================

export const LS_KEY = "birbir_v2";

export const saveLS = (data) => {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
};
export const loadLS = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

export const formatPrice = (n) => {
  if (!n && n !== 0) return "";
  return Math.round(Number(n)).toLocaleString("ru-RU").replace(/,/g, " ");
};

export const timeAgo = (dateStr, lang = "uz") => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  const w = Math.floor(d / 7);
  const mo = Math.floor(d / 30);
  const tx = lang === "uz"
    ? { m:"daq", h:"soat", d:"kun", w:"hafta", mo:"oy", ago:"oldin" }
    : { m:"мин", h:"ч", d:"дн", w:"нед", mo:"мес", ago:"назад" };
  if (mo > 0) return `${mo} ${tx.mo} ${tx.ago}`;
  if (w > 0)  return `${w} ${tx.w} ${tx.ago}`;
  if (d > 0)  return `${d} ${tx.d} ${tx.ago}`;
  if (h > 0)  return `${h} ${tx.h} ${tx.ago}`;
  return `${m || 1} ${tx.m} ${tx.ago}`;
};

export const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export const CITIES_UZ = [
  "Toshkent", "Samarqand", "Buxoro", "Namangan", "Andijon",
  "Farg'ona", "Qarshi", "Nukus", "Urganch", "Termiz",
  "Navoiy", "Jizzax", "Guliston", "Chirchiq", "Olmaliq",
];

export const CITIES_RU = [
  "Ташкент", "Самарканд", "Бухара", "Наманган", "Андижан",
  "Фергана", "Карши", "Нукус", "Ургенч", "Термез",
  "Навои", "Джизак", "Гулистан", "Чирчик", "Алмалык",
];

export const CONDITIONS = {
  uz: ["Yangi", "Deyarli yangi", "Yaxshi holat", "O'rtacha holat", "Ta'mirlash kerak"],
  ru: ["Новое", "Почти новое", "Хорошее", "Среднее", "Требует ремонта"],
};

// Demo listings seed data
export const DEMO_LISTINGS = [
  {
    id: "l1", category: "electronics", title: "iPhone 15 Pro Max 256GB",
    price: 14500000, currency: "UZS", condition: "Deyarli yangi",
    city: "Toshkent", district: "Yunusobod",
    description: "iPhone 15 Pro Max 256GB, Natural Titanium. Kafolat bilan. Hamma jihozlari bor.",
    photos: [], views: 342, favorites: 18,
    seller: { id: "u1", name: "Jasur Toshmatov", phone: "+998901234567", verified: true, rating: 4.8, reviewCount: 24 },
    lat: 41.312, lng: 69.284, createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "l2", category: "vehicles", title: "Chevrolet Malibu 2022",
    price: 185000000, currency: "UZS", condition: "Yaxshi holat",
    city: "Toshkent", district: "Chilonzor",
    description: "Chevrolet Malibu 2022. Bitta egasi. To'liq jihozlangan. 45,000 km yurgan.",
    photos: [], views: 891, favorites: 45,
    seller: { id: "u2", name: "Sardor Karimov", phone: "+998901112233", verified: true, rating: 4.5, reviewCount: 11 },
    lat: 41.299, lng: 69.240, createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    extra: { brand: "Chevrolet", model: "Malibu", year: 2022, mileage: 45000, fuel: "Benzin", transmission: "Avtomat", color: "Oq" },
  },
  {
    id: "l3", category: "realEstate", title: "3 xonali kvartira, Yunusobod",
    price: 95000, currency: "USD", condition: null,
    city: "Toshkent", district: "Yunusobod",
    description: "3 xonali kvartira. 9/16 qavat. 82 m². Yangi ta'mirlangan. Metro yaqin.",
    photos: [], views: 1240, favorites: 67,
    seller: { id: "u3", name: "Nodira Xoliqova", phone: "+998907654321", verified: false, rating: 4.2, reviewCount: 6 },
    lat: 41.330, lng: 69.296, createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    extra: { roomCount: 3, area: 82, floor: 9, totalFloors: 16, furnished: true, dealType: "forSale" },
  },
  {
    id: "l4", category: "jobs", title: "Frontend Developer (React)",
    price: 5000000, currency: "UZS", condition: null,
    city: "Toshkent", district: "Mirzo Ulug'bek",
    description: "IT kompaniyaga tajribali Frontend Developer kerak. React, TypeScript bilishi shart.",
    photos: [], views: 523, favorites: 29,
    seller: { id: "u4", name: "TechSoft LLC", phone: "+998712345678", verified: true, rating: 4.9, reviewCount: 38 },
    lat: 41.308, lng: 69.320, createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    extra: { company: "TechSoft LLC", jobType: "fullTime", experience: "2-3 yil" },
  },
  {
    id: "l5", category: "clothing", title: "Nike Air Jordan 1 Retro, 43-razmer",
    price: 1800000, currency: "UZS", condition: "Yangi",
    city: "Toshkent", district: "Shayxontohur",
    description: "Original Nike Air Jordan 1 Retro High OG. 43 razmer. Qutiси bilan. Hech kiyilmagan.",
    photos: [], views: 215, favorites: 32,
    seller: { id: "u5", name: "Alisher Nazarov", phone: "+998935556677", verified: false, rating: 4.0, reviewCount: 3 },
    lat: 41.305, lng: 69.265, createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "l6", category: "homeGoods", title: "Samsung TV 55 dyuym 4K Smart",
    price: 4200000, currency: "UZS", condition: "Yaxshi holat",
    city: "Samarqand", district: "Markaz",
    description: "Samsung 55 dyuym 4K Smart TV. 2021 yil. Barcha kanallar ulanadi. Kafolat bor.",
    photos: [], views: 178, favorites: 12,
    seller: { id: "u6", name: "Bobur Yusupov", phone: "+998901111222", verified: true, rating: 4.7, reviewCount: 15 },
    lat: 39.655, lng: 66.975, createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
  {
    id: "l7", category: "kids", title: "Bolalar aravasi — Chicco",
    price: 1200000, currency: "UZS", condition: "Yaxshi holat",
    city: "Toshkent", district: "Sergeli",
    description: "Chicco aravasi. 0-3 yosh uchun. Yaxshi holda. Barcha jihozlari bor.",
    photos: [], views: 96, favorites: 7,
    seller: { id: "u7", name: "Malika Rahimova", phone: "+998907778899", verified: false, rating: 5.0, reviewCount: 2 },
    lat: 41.250, lng: 69.215, createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: "l8", category: "services", title: "Santexnik xizmatlari — tez va sifatli",
    price: 100000, currency: "UZS", condition: null,
    city: "Toshkent", district: "Uchtepa",
    description: "Har qanday santexnika ishlari. Tez va sifatli. Kafolat beramiz.",
    photos: [], views: 441, favorites: 23,
    seller: { id: "u8", name: "Ikrom Sobirov", phone: "+998901234000", verified: true, rating: 4.6, reviewCount: 52 },
    lat: 41.280, lng: 69.225, createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
];
