import { useState, useEffect, useRef } from "react";
import DynamicCategoryForm from "./CategoryForms.jsx";

// =====================================================
// THEME
// =====================================================
const theme = (dark) => ({
  bg:     dark ? "#0A0A0A" : "#F5F5F5",
  card:   dark ? "#1A1A1A" : "#FFFFFF",
  card2:  dark ? "#222222" : "#F0F0F0",
  card3:  dark ? "#2A2A2A" : "#E8E8E8",
  text:   dark ? "#F1F1F1" : "#1A1A1A",
  sub:    dark ? "#888888" : "#777777",
  sub2:   dark ? "#555555" : "#AAAAAA",
  border: dark ? "#2E2E2E" : "#E5E5E5",
  accent: "#16A34A",
});

const useDark = () => {
  const [dark, setDark] = useState(() => {
    const s = localStorage.getItem("osontop_dark");
    return s !== null ? s === "1" : true;
  });
  const toggle = () => setDark(d => { localStorage.setItem("osontop_dark", d ? "0" : "1"); return !d; });
  return [dark, toggle];
};

// =====================================================
// TRANSLATIONS
// =====================================================
const T = {
  uz: {
    appName:"OsonTop", search:"Biznes, mahsulot yoki xizmat qidiring...",
    home:"Bosh sahifa", map:"Xarita", profile:"Profil",
    nearby:"Yaqin bizneslar", topRated:"Eng baholangan", newBiz:"Yangi bizneslar",
    offers:"Maxsus takliflar", categories:"Kategoriyalar",
    openNow:"Ochiq", closedNow:"Yopiq", reviews:"Sharhlar", noReviews:"Sharhlar yo'q",
    subscribe:"🔔 Obuna", subscribed:"✓ Obuna", subscribers:"obunachi",
    callStore:"📞 Qo'ng'iroq", telegramStore:"✈️ Telegram", share:"🔗 Ulashish",
    chat:"💬 Chat", book:"📅 Bron", products:"Mahsulotlar",
    noProducts:"Mahsulot yo'q", addProduct:"+ Mahsulot qo'shish",
    myStore:"Mening biznesim", createBiz:"Biznes yaratish",
    createBizSub:"Biznesingizni ro'yxatga oling",
    next:"Davom etish", back:"Orqaga", cancel:"Bekor qilish", save:"Saqlash",
    step:"Qadam", of:"/", required:"*",
    bizName:"Biznes nomi", bizNamePh:"Masalan: Aziz Market",
    bizLogo:"Belgi (emoji)", bizAddress:"Manzil",
    bizAddressPh:"Masalan: Toshkent, Chilonzor tumani",
    bizPhone:"Telefon raqami", bizPhonePh:"+998 90 123 45 67",
    bizTelegram:"Telegram", bizTelegramPh:"@biznes_uz",
    pickOnMap:"Xaritadan joy belgilang", locationSet:"Joylashuv belgilandi ✓",
    workHours:"Ish vaqti",
    photos:"Rasmlar", addPhoto:"Rasm qo'shish",
    productName:"Mahsulot / xizmat nomi", productNamePh:"Masalan: Erkaklar krossovkasi",
    productDesc:"Tavsif", productDescPh:"Qisqacha ma'lumot...",
    price:"Narx (so'm)", discountPct:"Chegirma %", discountExpiry:"Chegirma muddati",
    addParam:"+ Parametr", paramName:"Nom", paramValue:"Qiymat",
    submitProduct:"Qo'shish", submitBiz:"Biznes yaratish",
    chooseCategory:"Kategoriya tanlang", chooseCategoryDesc:"Qaysi yo'nalish?",
    leaveReview:"Fikr qoldirish", yourRating:"Bahoyingiz",
    commentPh:"Fikringizni yozing...", submitReview:"Yuborish",
    rateProduct:"Baholash", deleteProduct:"O'chirish",
    confirmDelete:"O'chirishni tasdiqlaysizmi?", yes:"Ha", no:"Yo'q",
    editProduct:"Tahrirlash", activateProduct:"Faollashtirish",
    deactivateProduct:"Faolsizlantirish", duplicateProduct:"Nusxalash",
    makeDiscount:"🏷️ Chegirma", editDiscount:"Chegirmani o'zgartirish",
    removeDiscount:"Chegirmani olib tashlash", discountTitle:"Chegirma qo'yish",
    discountApply:"Chegirma qo'llash", expiryDate:"Muddati",
    noDeals:"Takliflar topilmadi",
    saved:"❤️ Saqlanganlar", nothingSaved:"Hech narsa saqlanmagan",
    myChats:"Chatlarim", noChats:"Chatlar yo'q",
    stats:"📊 Statistika", views:"Ko'rishlar",
    bookings:"Bronlar", myBookings:"Mening bronlarim",
    chooseDate:"Sana tanlang", chooseTime:"Vaqt tanlang",
    bookNow:"Bron qilish", bookSuccess:"Bron muvaffaqiyatli!",
    bookSuccessDesc:"Do'kon siz bilan bog'lanadi", noBookings:"Bronlar yo'q",
    bookPending:"Kutilmoqda", bookConfirmed:"Tasdiqlangan",
    settings:"Sozlamalar", darkMode:"Tungi rejim",
    notifications:"Bildirishnomalar",
    subscribedStores:"Obuna bo'lgan do'konlar", noSubscribed:"Obunalar yo'q",
    editProfile:"Profilni tahrirlash", logout:"Chiqish",
    welcome:"Xush kelibsiz", enterName:"Ism", enterPhone:"Telefon",
    confirm:"Tasdiqlash", smsCode:"SMS kod",
    smsHint:"Raqamingizga 4 xonali kod yuborildi", resend:"Qayta yuborish",
    addProfilePhoto:"Profil rasmi", skip:"O'tkazib yuborish",
    allowNotif:"Bildirishnomalar", notifDesc:"Yangi takliflardan xabardor bo'ling",
    enable:"Yoqish", guestMode:"Mehmon sifatida kirish",
    seeAll:"Barchasi ›", similarBiz:"O'xshash bizneslar",
    discountBadge:"CHEGIRMA", expiresIn:"Muddat", sum:"so'm",
    sortDefault:"Standart", sortDiscount:"Chegirma %", sortRating:"Reyting",
    myProfile:"Mening profilim",
  },
  ru: {
    appName:"OsonTop", search:"Найдите бизнес, товар или услугу...",
    home:"Главная", map:"Карта", profile:"Профиль",
    nearby:"Рядом", topRated:"Топ рейтинг", newBiz:"Новые бизнесы",
    offers:"Спецпредложения", categories:"Категории",
    openNow:"Открыто", closedNow:"Закрыто", reviews:"Отзывы", noReviews:"Нет отзывов",
    subscribe:"🔔 Подписаться", subscribed:"✓ Подписан", subscribers:"подписчиков",
    callStore:"📞 Позвонить", telegramStore:"✈️ Telegram", share:"🔗 Поделиться",
    chat:"💬 Чат", book:"📅 Забронировать", products:"Товары",
    noProducts:"Нет товаров", addProduct:"+ Добавить товар",
    myStore:"Мой бизнес", createBiz:"Создать бизнес",
    createBizSub:"Зарегистрируйте свой бизнес",
    next:"Продолжить", back:"Назад", cancel:"Отмена", save:"Сохранить",
    step:"Шаг", of:"/", required:"*",
    bizName:"Название бизнеса", bizNamePh:"Например: Aziz Market",
    bizLogo:"Значок (emoji)", bizAddress:"Адрес",
    bizAddressPh:"Например: Ташкент, Чиланзарский р-н",
    bizPhone:"Номер телефона", bizPhonePh:"+998 90 123 45 67",
    bizTelegram:"Telegram", bizTelegramPh:"@biznes_uz",
    pickOnMap:"Отметьте на карте", locationSet:"Местоположение указано ✓",
    workHours:"Часы работы",
    photos:"Фотографии", addPhoto:"Добавить фото",
    productName:"Название товара / услуги", productNamePh:"Например: Мужские кроссовки",
    productDesc:"Описание", productDescPh:"Краткая информация...",
    price:"Цена (сум)", discountPct:"Скидка %", discountExpiry:"Срок скидки",
    addParam:"+ Параметр", paramName:"Название", paramValue:"Значение",
    submitProduct:"Добавить", submitBiz:"Создать бизнес",
    chooseCategory:"Выберите категорию", chooseCategoryDesc:"Какое направление?",
    leaveReview:"Оставить отзыв", yourRating:"Ваша оценка",
    commentPh:"Напишите отзыв...", submitReview:"Отправить",
    rateProduct:"Оценить", deleteProduct:"Удалить",
    confirmDelete:"Удалить этот товар?", yes:"Да", no:"Нет",
    editProduct:"Редактировать", activateProduct:"Активировать",
    deactivateProduct:"Деактивировать", duplicateProduct:"Дублировать",
    makeDiscount:"🏷️ Скидка", editDiscount:"Изменить скидку",
    removeDiscount:"Убрать скидку", discountTitle:"Установить скидку",
    discountApply:"Применить скидку", expiryDate:"Срок действия",
    noDeals:"Предложений не найдено",
    saved:"❤️ Сохранённые", nothingSaved:"Ничего не сохранено",
    myChats:"Мои чаты", noChats:"Нет чатов",
    stats:"📊 Статистика", views:"Просмотры",
    bookings:"Брони", myBookings:"Мои брони",
    chooseDate:"Выберите дату", chooseTime:"Выберите время",
    bookNow:"Забронировать", bookSuccess:"Бронь успешна!",
    bookSuccessDesc:"Магазин свяжется с вами", noBookings:"Нет броней",
    bookPending:"Ожидание", bookConfirmed:"Подтверждено",
    settings:"Настройки", darkMode:"Тёмный режим",
    notifications:"Уведомления",
    subscribedStores:"Подписки", noSubscribed:"Нет подписок",
    editProfile:"Редактировать профиль", logout:"Выйти",
    welcome:"Добро пожаловать", enterName:"Имя", enterPhone:"Телефон",
    confirm:"Подтвердить", smsCode:"SMS код",
    smsHint:"На ваш номер отправлен 4-значный код", resend:"Отправить снова",
    addProfilePhoto:"Фото профиля", skip:"Пропустить",
    allowNotif:"Уведомления", notifDesc:"Узнавайте о новых предложениях",
    enable:"Включить", guestMode:"Войти как гость",
    seeAll:"Все ›", similarBiz:"Похожие бизнесы",
    discountBadge:"СКИДКА", expiresIn:"Срок", sum:"сум",
    sortDefault:"По умолчанию", sortDiscount:"По скидке", sortRating:"По рейтингу",
    myProfile:"Мой профиль",
  }
};


// =====================================================
// CATEGORIES
// =====================================================
const CATS = [
  { id:"auto",        emoji:"🚗", color:"#0652DD" },
  { id:"restaurant",  emoji:"🍔", color:"#E17055" },
  { id:"pharmacy",    emoji:"💊", color:"#009432" },
  { id:"services",    emoji:"⚡", color:"#FDCB6E" },
  { id:"plumber",     emoji:"🚰", color:"#0984E3" },
  { id:"hotel",       emoji:"🏨", color:"#1289A7" },
  { id:"medical",     emoji:"👨‍⚕️", color:"#ED4C67" },
  { id:"shopping",    emoji:"🛍",  color:"#6C5CE7" },
  { id:"food",        emoji:"🍕",  color:"#E17055" },
  { id:"clothing",    emoji:"👕",  color:"#636E72" },
  { id:"electronics", emoji:"📱", color:"#0984E3" },
  { id:"beauty",      emoji:"💄", color:"#E84393" },
  { id:"education",   emoji:"📚", color:"#F79F1F" },
  { id:"sport",       emoji:"⚽", color:"#00B894" },
  { id:"kids",        emoji:"🧸",  color:"#FDA7DF" },
  { id:"cleaning",    emoji:"🧹", color:"#C4E538" },
  { id:"pet",         emoji:"🐾",  color:"#D980FA" },
  { id:"repair",      emoji:"🔧", color:"#5758BB" },
];

const CAT_LABELS = {
  uz: { auto:"Avto servis", restaurant:"Restoran/Kafe", pharmacy:"Dorixona", services:"Elektrik", plumber:"Santexnik", hotel:"Mehmonxona", medical:"Shifokor", shopping:"Savdo", food:"Ovqat", clothing:"Kiyim", electronics:"Elektronika", beauty:"Go'zallik", education:"Ta'lim", sport:"Sport", kids:"Bolalar", cleaning:"Tozalash", pet:"Hayvonlar", repair:"Ta'mirlash" },
  ru: { auto:"Авто сервис", restaurant:"Ресторан/Кафе", pharmacy:"Аптека", services:"Электрик", plumber:"Сантехник", hotel:"Гостиница", medical:"Врач", shopping:"Торговля", food:"Еда", clothing:"Одежда", electronics:"Электроника", beauty:"Красота", education:"Образование", sport:"Спорт", kids:"Детское", cleaning:"Уборка", pet:"Животные", repair:"Ремонт" }
};

const QUICK_ACTIONS = [
  { id:"auto", emoji:"🚗" }, { id:"restaurant", emoji:"🍔" }, { id:"pharmacy", emoji:"💊" },
  { id:"services", emoji:"⚡" }, { id:"plumber", emoji:"🚰" }, { id:"hotel", emoji:"🏨" },
  { id:"medical", emoji:"👨‍⚕️" }, { id:"shopping", emoji:"🛍" },
];

const getCatColor = (id) => CATS.find(c => c.id === id)?.color || "#16A34A";
const getCatEmoji = (id) => CATS.find(c => c.id === id)?.emoji || "🏪";

// =====================================================
// HELPERS
// =====================================================
const LS_KEY = "osontop_v11";
const saveLS = (d) => { try { localStorage.setItem(LS_KEY, JSON.stringify(d)); } catch {} };
const loadLS = () => { try { const r = localStorage.getItem(LS_KEY); return r ? JSON.parse(r) : null; } catch { return null; } };
const isoFromNow = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0,10); };
const isExpired  = (s) => { const t = new Date(); t.setHours(0,0,0,0); return new Date(s) < t; };
const daysLeft   = (s, lang) => {
  const t = new Date(); t.setHours(0,0,0,0);
  const diff = Math.ceil((new Date(s) - t) / 86400000);
  if (diff <= 0) return lang==="uz" ? "Bugun" : "Сегодня";
  return lang==="uz" ? `${diff} kun` : `${diff} д.`;
};
const fmt = (n) => Math.round(Number(n)||0).toLocaleString("ru-RU").replace(/,/g," ");
const avgRating = (arr) => arr?.length ? arr.reduce((s,r) => s + r.stars, 0) / arr.length : 0;
const isStoreOpen = (store) => {
  if (!store?.workHours) return true;
  const days = ["sun","mon","tue","wed","thu","fri","sat"];
  const dk = days[new Date().getDay()];
  const h = store.workHours[dk];
  if (!h || h === "Yopiq" || h === "Закрыто") return false;
  if (h === "00:00-24:00") return true;
  const [st, en] = h.split("-");
  const [sh,sm] = st.split(":").map(Number);
  const [eh,em] = en.split(":").map(Number);
  const now = new Date().getHours()*60 + new Date().getMinutes();
  return now >= sh*60+sm && now < eh*60+em;
};
const detectRegion = (lat, lng) => {
  const R = [
    {uz:"Toshkent",ru:"Ташкент",lat:41.299,lng:69.240},
    {uz:"Samarqand",ru:"Самарканд",lat:39.655,lng:66.975},
    {uz:"Buxoro",ru:"Бухара",lat:39.767,lng:64.455},
    {uz:"Namangan",ru:"Наманган",lat:41.000,lng:71.668},
    {uz:"Andijon",ru:"Андижан",lat:40.783,lng:72.344},
    {uz:"Farg'ona",ru:"Фергана",lat:40.384,lng:71.787},
    {uz:"Qarshi",ru:"Карши",lat:38.861,lng:65.789},
    {uz:"Nukus",ru:"Нукус",lat:42.460,lng:59.610},
    {uz:"Urganch",ru:"Ургенч",lat:41.548,lng:60.633},
    {uz:"Termiz",ru:"Термез",lat:37.224,lng:67.278},
    {uz:"Navoiy",ru:"Навои",lat:40.084,lng:65.379},
    {uz:"Jizzax",ru:"Джизак",lat:40.123,lng:67.842},
    {uz:"Guliston",ru:"Гулистан",lat:40.489,lng:68.784},
  ];
  let best = R[0], minD = 999;
  R.forEach(r => { const d = Math.hypot(lat - r.lat, lng - r.lng); if (d < minD) { minD = d; best = r; } });
  return best;
};


// =====================================================
// DEMO DATA
// =====================================================
const DEMO_STORES = [
  { id:"s1", name:"Korzinka", logo:"🛒", color:"#FF6B35", type:"sell", address:"Toshkent, Chilonzor", phone:"+998712000001", telegram:"@korzinka_uz", description:{uz:"O'zbekistonning yetakchi supermarketi",ru:"Ведущий супермаркет Узбекистана"}, workHours:{mon:"08:00-22:00",tue:"08:00-22:00",wed:"08:00-22:00",thu:"08:00-22:00",fri:"08:00-22:00",sat:"08:00-22:00",sun:"09:00-21:00"}, lat:41.299, lng:69.240, views:1240, subscriberBase:320, verified:true, reviews:[{stars:5,comment:"Ajoyib narxlar",author:"Anvar"}], products:[{id:"p1",category:"food",active:true,name:{uz:"Mahsulotlarga chegirma",ru:"Скидка на продукты"},description:{uz:"Barcha oziq-ovqatlarga",ru:"На все продукты питания"},params:[],originalPrice:45000,photos:[],delivery:true,deliveryPrice:5000,discount:{percent:30,expiryDate:isoFromNow(2)},reviews:[{stars:4,comment:"Yaxshi",author:"Dilnoza"}]}] },
  { id:"s2", name:"Zara Tashkent", logo:"👔", color:"#2D3436", type:"sell", address:"Toshkent, Amir Temur ko'chasi", phone:"+998712000002", telegram:"@zara_tashkent", description:{uz:"Jahon brendlari kiyimlari",ru:"Одежда мировых брендов"}, workHours:{mon:"10:00-21:00",tue:"10:00-21:00",wed:"10:00-21:00",thu:"10:00-21:00",fri:"10:00-21:00",sat:"10:00-22:00",sun:"11:00-20:00"}, lat:41.302, lng:69.245, views:890, subscriberBase:210, verified:true, reviews:[], products:[{id:"p2",category:"clothing",active:true,name:{uz:"Yozgi kolleksiya",ru:"Летняя коллекция"},description:{uz:"Yangi yozgi kiyimlar",ru:"Новая летняя коллекция"},params:[{name:"Razmer",value:"S-XL"}],originalPrice:320000,photos:[],delivery:false,deliveryPrice:0,discount:{percent:50,expiryDate:isoFromNow(5)},reviews:[]}] },
  { id:"s3", name:"Texnomart", logo:"📱", color:"#0984E3", type:"sell", address:"Toshkent, Yunusobod", phone:"+998712000003", telegram:"@texnomart_uz", description:{uz:"Elektronika va texnologiya",ru:"Электроника и технологии"}, workHours:{mon:"09:00-21:00",tue:"09:00-21:00",wed:"09:00-21:00",thu:"09:00-21:00",fri:"09:00-21:00",sat:"09:00-21:00",sun:"10:00-20:00"}, lat:41.295, lng:69.235, views:2100, subscriberBase:540, verified:true, reviews:[{stars:5,comment:"Tez yetkazib berish",author:"Jasur"}], products:[{id:"p3",category:"electronics",active:true,name:{uz:"Smartfonlarga chegirma",ru:"Скидка на смартфоны"},description:{uz:"Eng yangi modellar",ru:"Новейшие модели"},params:[],originalPrice:4500000,photos:[],delivery:true,deliveryPrice:15000,discount:{percent:15,expiryDate:isoFromNow(3)},reviews:[]},{id:"p3b",category:"electronics",active:true,name:{uz:"Noutbuklarga chegirma",ru:"Скидка на ноутбуки"},description:{uz:"",ru:""},params:[],originalPrice:5200000,photos:[],delivery:true,deliveryPrice:15000,discount:{percent:20,expiryDate:isoFromNow(4)},reviews:[]}] },
  { id:"s4", name:"Dono Pizza", logo:"🍕", color:"#E17055", type:"sell", address:"Toshkent, Shayxontohur", phone:"+998712000005", telegram:"@dono_pizza", description:{uz:"Toshkentning eng mazali pizzasi",ru:"Самая вкусная пицца Ташкента"}, workHours:{mon:"11:00-23:00",tue:"11:00-23:00",wed:"11:00-23:00",thu:"11:00-23:00",fri:"11:00-00:00",sat:"11:00-00:00",sun:"12:00-23:00"}, lat:41.298, lng:69.242, views:1560, subscriberBase:430, verified:false, reviews:[{stars:4,comment:"Juda mazali!",author:"Olim"}], products:[{id:"p5",category:"restaurant",active:true,name:{uz:"Katta pizza",ru:"Большая пицца"},description:{uz:"Har qanday katta pizza",ru:"Любая большая пицца"},params:[],originalPrice:95000,photos:[],delivery:true,deliveryPrice:5000,discount:{percent:20,expiryDate:isoFromNow(2)},reviews:[]}] },
  { id:"s5", name:"AutoServis Pro", logo:"🚗", color:"#0652DD", type:"service", address:"Toshkent, Sergeli", phone:"+998712000008", telegram:"@autoservis_pro", description:{uz:"Professional avto ta'mirlash",ru:"Профессиональный авто сервис"}, workHours:{mon:"08:00-18:00",tue:"08:00-18:00",wed:"08:00-18:00",thu:"08:00-18:00",fri:"08:00-18:00",sat:"09:00-16:00",sun:"Yopiq"}, lat:41.293, lng:69.238, views:560, subscriberBase:145, verified:true, reviews:[{stars:5,comment:"Tez va sifatli",author:"Bobur"}], products:[{id:"p8",category:"auto",active:true,name:{uz:"Motor ta'mirlash",ru:"Ремонт двигателя"},description:{uz:"Barcha turdagi dvigatellar",ru:"Двигатели всех марок"},params:[{name:"Xizmat",value:"Motor, KPP, Podveska"}],originalPrice:500000,photos:[],delivery:false,deliveryPrice:0,discount:{percent:20,expiryDate:isoFromNow(5)},reviews:[]}] },
  { id:"s6", name:"Najot Dorixona", logo:"💊", color:"#009432", type:"sell", address:"Toshkent, Yunusobod", phone:"+998712000009", telegram:"@najot_pharmacy", description:{uz:"24 soat ishlaydigan dorixona",ru:"Аптека 24 часа"}, workHours:{mon:"00:00-24:00",tue:"00:00-24:00",wed:"00:00-24:00",thu:"00:00-24:00",fri:"00:00-24:00",sat:"00:00-24:00",sun:"00:00-24:00"}, lat:41.307, lng:69.252, views:920, subscriberBase:280, verified:true, reviews:[], products:[{id:"p9",category:"pharmacy",active:true,name:{uz:"Vitaminlarga chegirma",ru:"Скидка на витамины"},description:{uz:"Barcha vitaminlar",ru:"Все витамины"},params:[],originalPrice:85000,photos:[],delivery:true,deliveryPrice:8000,discount:{percent:15,expiryDate:isoFromNow(6)},reviews:[]}] },
  { id:"s7", name:"Grand Hotel", logo:"🏨", color:"#1289A7", type:"service", address:"Toshkent, Mirobod", phone:"+998712000010", telegram:"@grandhotel_uz", description:{uz:"5 yulduzli mehmonxona",ru:"Пятизвёздочный отель"}, workHours:{mon:"00:00-24:00",tue:"00:00-24:00",wed:"00:00-24:00",thu:"00:00-24:00",fri:"00:00-24:00",sat:"00:00-24:00",sun:"00:00-24:00"}, lat:41.303, lng:69.244, views:780, subscriberBase:195, verified:true, reviews:[{stars:5,comment:"Ajoyib xizmat",author:"Kamol"}], products:[{id:"p10",category:"hotel",active:true,name:{uz:"Xona bron qilish",ru:"Бронирование номера"},description:{uz:"Lux xonalar",ru:"Люксовые номера"},params:[{name:"Xona turi",value:"Standart / Lux"}],originalPrice:450000,photos:[],delivery:false,deliveryPrice:0,discount:{percent:25,expiryDate:isoFromNow(10)},reviews:[]}] },
  { id:"s8", name:"CleanPro", logo:"🧹", color:"#C4E538", type:"service", address:"Toshkent, Uchtepa", phone:"+998712000011", telegram:"@cleanpro_uz", description:{uz:"Professional tozalash xizmati",ru:"Профессиональная уборка"}, workHours:{mon:"08:00-20:00",tue:"08:00-20:00",wed:"08:00-20:00",thu:"08:00-20:00",fri:"08:00-20:00",sat:"09:00-18:00",sun:"10:00-16:00"}, lat:41.296, lng:69.233, views:310, subscriberBase:88, verified:false, reviews:[], products:[{id:"p11",category:"cleaning",active:true,name:{uz:"Kvartira tozalash",ru:"Уборка квартиры"},description:{uz:"Professional tozalash",ru:"Профессиональная уборка"},params:[{name:"Xona soni",value:"1-5"}],originalPrice:200000,photos:[],delivery:false,deliveryPrice:0,discount:{percent:25,expiryDate:isoFromNow(4)},reviews:[]}] },
];


// =====================================================
// UI ATOMS
// =====================================================
function Stars({ value, onChange, size=20, readOnly=false }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{display:"flex",gap:3}}>
      {[1,2,3,4,5].map(n => (
        <span key={n} onClick={()=>!readOnly&&onChange&&onChange(n)}
          onMouseEnter={()=>!readOnly&&setHover(n)} onMouseLeave={()=>!readOnly&&setHover(0)}
          style={{fontSize:size,cursor:readOnly?"default":"pointer",color:n<=(hover||value)?"#FFB400":"#444",lineHeight:1}}>★</span>
      ))}
    </div>
  );
}

function Sheet({ onClose, children, maxH="85vh", dark }) {
  const th = theme(dark);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center",maxWidth:430,margin:"0 auto"}} onClick={onClose}>
      <div style={{background:th.card,borderRadius:"22px 22px 0 0",padding:24,width:"100%",maxWidth:430,maxHeight:maxH,overflowY:"auto",boxSizing:"border-box"}} onClick={e=>e.stopPropagation()}>
        <div style={{width:40,height:4,background:th.border,borderRadius:2,margin:"0 auto 18px"}}/>
        {children}
      </div>
    </div>
  );
}

function FullPage({ children, dark }) {
  const th = theme(dark);
  return (
    <div style={{position:"fixed",inset:0,zIndex:200,background:th.bg,maxWidth:430,margin:"0 auto",overflowY:"auto"}}>
      {children}
    </div>
  );
}

function Btn({ children, onClick, ghost=false, disabled=false, color="#16A34A", style:s={} }) {
  return (
    <button onClick={disabled?undefined:onClick} style={{width:"100%",padding:"15px",borderRadius:14,fontSize:15,fontWeight:800,cursor:disabled?"not-allowed":"pointer",background:disabled?"#555":(ghost?"transparent":color),color:ghost?color:"#fff",border:ghost?`1.5px solid ${color}`:"none",opacity:disabled?0.6:1,...s}}>{children}</button>
  );
}

function BackHeader({ onBack, title, dark, right=null }) {
  const th = theme(dark);
  return (
    <div style={{background:th.card,borderBottom:`1px solid ${th.border}`,padding:"50px 16px 14px",display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:50}}>
      <button onClick={onBack} style={{background:th.card2,border:"none",borderRadius:10,width:34,height:34,fontSize:16,cursor:"pointer",color:th.text,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <span style={{flex:1,fontWeight:800,fontSize:17,color:th.text}}>{title}</span>
      {right}
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <div onClick={()=>onChange(!value)} style={{width:48,height:26,borderRadius:13,background:value?"#16A34A":"#444",position:"relative",cursor:"pointer",transition:"background 0.2s",flexShrink:0}}>
      <div style={{position:"absolute",top:3,left:value?25:3,width:20,height:20,borderRadius:10,background:"#fff",transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}}/>
    </div>
  );
}


// =====================================================
// ONBOARDING
// =====================================================
function Onboarding({ lang, setLang, dark, onDone, onGuest }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState(["","","",""]);
  const codeRefs = [useRef(),useRef(),useRef(),useRef()];
  const th = theme(dark);
  const tx = T[lang];
  const inp = {width:"100%",padding:"14px 16px",borderRadius:14,border:`1.5px solid ${th.border}`,background:th.card2,fontSize:15,outline:"none",boxSizing:"border-box",color:th.text,marginBottom:16};

  if (step === 0) return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#16A34A,#0D6B28)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,color:"#fff"}}>
      <div style={{position:"absolute",top:16,right:16,display:"flex",gap:6}}>
        {["uz","ru"].map(l=>(
          <button key={l} onClick={()=>setLang(l)} style={{padding:"6px 14px",borderRadius:20,border:"none",background:lang===l?"#fff":"rgba(255,255,255,0.2)",color:lang===l?"#16A34A":"#fff",fontWeight:700,fontSize:12,cursor:"pointer"}}>{l==="uz"?"🇺🇿 UZ":"🇷🇺 RU"}</button>
        ))}
      </div>
      <div style={{width:90,height:90,borderRadius:26,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12,border:"2px solid rgba(255,255,255,0.3)"}}>
        <span style={{fontSize:50,fontWeight:900,color:"#fff"}}>O</span>
      </div>
      <div style={{fontSize:32,fontWeight:900,marginBottom:8}}><span style={{color:"#fff"}}>Oson</span><span style={{color:"#90EE90"}}>Top</span></div>
      <p style={{opacity:0.9,fontSize:15,textAlign:"center",marginBottom:48,lineHeight:1.6}}>{lang==="uz"?"O'zbekistondagi barcha bizneslar platformasi":"Платформа всех бизнесов Узбекистана"}</p>
      <button onClick={()=>setStep(1)} style={{width:"100%",maxWidth:280,padding:"15px",background:"#fff",color:"#16A34A",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:"pointer",marginBottom:12}}>{lang==="uz"?"Boshlash →":"Начать →"}</button>
      <button onClick={onGuest} style={{width:"100%",maxWidth:280,padding:"15px",background:"rgba(255,255,255,0.15)",color:"#fff",border:"1.5px solid rgba(255,255,255,0.4)",borderRadius:14,fontSize:15,fontWeight:700,cursor:"pointer"}}>👁️ {tx.guestMode}</button>
    </div>
  );

  if (step === 1) return (
    <div style={{minHeight:"100vh",background:th.bg,padding:"60px 24px 32px",display:"flex",flexDirection:"column"}}>
      <div style={{fontSize:40,marginBottom:8}}>👤</div>
      <h2 style={{fontSize:24,fontWeight:800,color:th.text,margin:"0 0 6px"}}>{tx.welcome}</h2>
      <p style={{color:th.sub,marginBottom:28,fontSize:14}}>{lang==="uz"?"Ma'lumotlaringizni kiriting":"Введите ваши данные"}</p>
      <label style={{fontSize:13,color:th.sub,marginBottom:6,fontWeight:600,display:"block"}}>{tx.enterName}</label>
      <input placeholder={lang==="uz"?"Ismingiz":"Ваше имя"} value={name} onChange={e=>setName(e.target.value)} style={inp}/>
      <label style={{fontSize:13,color:th.sub,marginBottom:6,fontWeight:600,display:"block"}}>{tx.enterPhone}</label>
      <input type="tel" placeholder="+998 90 123 45 67" value={phone} onChange={e=>setPhone(e.target.value)} style={inp}/>
      <div style={{flex:1}}/>
      <button onClick={()=>name&&phone?setStep(2):null} style={{width:"100%",padding:"15px",background:name&&phone?"#16A34A":"#555",color:"#fff",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:name&&phone?"pointer":"not-allowed"}}>{tx.next}</button>
    </div>
  );

  if (step === 2) return (
    <div style={{minHeight:"100vh",background:th.bg,padding:"60px 24px 32px",display:"flex",flexDirection:"column"}}>
      <div style={{fontSize:40,marginBottom:8}}>📱</div>
      <h2 style={{fontSize:24,fontWeight:800,color:th.text,margin:"0 0 6px"}}>{tx.smsCode}</h2>
      <p style={{color:th.sub,marginBottom:28,fontSize:14}}>{tx.smsHint}<br/><b style={{color:th.text}}>{phone}</b></p>
      <div style={{display:"flex",gap:12,justifyContent:"center",marginBottom:24}}>
        {code.map((c,i)=>(
          <input key={i} ref={codeRefs[i]} value={c} maxLength={1}
            onChange={e=>{const n=[...code];n[i]=e.target.value.replace(/\D/,"");setCode(n);if(e.target.value&&i<3)codeRefs[i+1].current?.focus();}}
            style={{width:60,height:64,textAlign:"center",fontSize:26,fontWeight:800,border:`2px solid ${c?"#16A34A":th.border}`,borderRadius:14,background:th.card2,outline:"none",color:th.text}}/>
        ))}
      </div>
      <div style={{flex:1}}/>
      <button onClick={()=>setStep(3)} style={{width:"100%",padding:"15px",background:code.every(c=>c)?"#16A34A":"#555",color:"#fff",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:"pointer"}}>{tx.confirm}</button>
    </div>
  );

  if (step === 3) return (
    <div style={{minHeight:"100vh",background:th.bg,padding:"60px 24px 32px",display:"flex",flexDirection:"column",alignItems:"center"}}>
      <div style={{fontSize:40,marginBottom:8}}>📸</div>
      <h2 style={{fontSize:24,fontWeight:800,color:th.text,margin:"0 0 6px",textAlign:"center"}}>{tx.addProfilePhoto}</h2>
      <div style={{width:110,height:110,borderRadius:55,background:"linear-gradient(135deg,#16A34A,#0D6B28)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:50,border:"3px dashed rgba(255,255,255,0.3)",marginBottom:28,cursor:"pointer",marginTop:20}}>😊</div>
      <div style={{flex:1}}/>
      <button onClick={()=>onDone({name,phone})} style={{width:"100%",maxWidth:320,padding:"15px",background:"#16A34A",color:"#fff",border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:"pointer"}}>{tx.next}</button>
      <button onClick={()=>onDone({name,phone})} style={{background:"none",border:"none",color:th.sub,fontSize:14,cursor:"pointer",marginTop:12}}>{tx.skip}</button>
    </div>
  );

  return null;
}


// =====================================================
// BUSINESS CARD
// =====================================================
function BizCard({ store, lang, dark, onClick }) {
  const th = theme(dark);
  const open = isStoreOpen(store);
  const rating = avgRating(store.reviews);
  const deals = store.products.filter(p=>p.active&&p.discount&&!isExpired(p.discount.expiryDate));
  const topDisc = deals.length ? Math.max(...deals.map(p=>p.discount.percent)) : 0;
  const dist = ((Math.random()*1.5+0.2)).toFixed(1);
  return (
    <div onClick={onClick} style={{background:th.card,borderRadius:16,overflow:"hidden",cursor:"pointer",border:`1px solid ${th.border}`,marginBottom:10,boxShadow:"0 2px 8px rgba(0,0,0,0.08)"}}>
      <div style={{display:"flex",gap:12,padding:"14px 14px 12px"}}>
        <div style={{width:54,height:54,borderRadius:14,flexShrink:0,background:store.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,border:`1px solid ${store.color}33`}}>{store.logo}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
            <span style={{fontWeight:700,fontSize:15,color:th.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{store.name}</span>
            {store.verified && <span style={{color:"#16A34A",fontSize:12,flexShrink:0}}>✓</span>}
            {topDisc>0 && <span style={{background:"#16A34A",color:"#fff",borderRadius:6,padding:"1px 5px",fontSize:9,fontWeight:800,flexShrink:0}}>-{topDisc}%</span>}
          </div>
          <div style={{fontSize:12,color:th.sub,marginBottom:3}}>{getCatEmoji(store.products[0]?.category||"")} {CAT_LABELS[lang]?.[store.products[0]?.category||""]||""}</div>
          {rating>0 && (
            <div style={{display:"flex",alignItems:"center",gap:3,marginBottom:3}}>
              {[1,2,3,4,5].map(n=><span key={n} style={{fontSize:10,color:n<=Math.round(rating)?"#FFB400":"#444"}}>★</span>)}
              <span style={{fontSize:11,fontWeight:700,color:th.text,marginLeft:2}}>{rating.toFixed(1)}</span>
              <span style={{fontSize:11,color:th.sub}}>({store.reviews.length})</span>
            </div>
          )}
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:11,color:th.sub}}>📍 {dist} km</span>
            <span style={{fontSize:10,fontWeight:700,borderRadius:5,padding:"1px 6px",background:open?"#16A34A20":"#55555520",color:open?"#16A34A":th.sub}}>{open?T[lang].openNow:T[lang].closedNow}</span>
          </div>
        </div>
        {store.phone && (
          <button onClick={e=>{e.stopPropagation();window.location.href=`tel:${store.phone}`;}}
            style={{background:"#16A34A20",border:"none",borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,alignSelf:"center"}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.4 2 2 0 0 1 3.55 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}

// Deal row (Karrot style)
function DealRow({ deal, lang, dark, saved, onSave, onClick }) {
  const th = theme(dark);
  const discPrice = deal.originalPrice>0 ? Math.round(deal.originalPrice*(1-deal.discount/100)) : 0;
  return (
    <div style={{borderBottom:`1px solid ${th.border}`,cursor:"pointer"}} onClick={onClick}>
      <div style={{display:"flex",gap:12,padding:"12px 16px"}}>
        <div style={{width:96,height:96,borderRadius:12,overflow:"hidden",flexShrink:0,background:th.card2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,position:"relative"}}>
          {deal.photos?.length?<img src={deal.photos[0]} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span>{deal.logo}</span>}
          <div style={{position:"absolute",top:5,left:5,background:"#16A34A",color:"#fff",borderRadius:6,padding:"1px 5px",fontSize:9,fontWeight:800}}>-{deal.discount}%</div>
        </div>
        <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
          <div>
            <div style={{fontWeight:600,fontSize:14,color:th.text,lineHeight:1.4,marginBottom:3,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{deal.title?.[lang]||deal.title?.uz}</div>
            <div style={{fontSize:12,color:th.sub}}>{deal.storeName} · {daysLeft(deal.expiryDate,lang)}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              {discPrice>0&&<span style={{fontWeight:800,fontSize:15,color:th.text}}>{fmt(discPrice)} {T[lang].sum}</span>}
              {deal.originalPrice>0&&deal.discount>0&&<span style={{fontSize:12,color:th.sub,textDecoration:"line-through",marginLeft:5}}>{fmt(deal.originalPrice)}</span>}
            </div>
            <button onClick={e=>{e.stopPropagation();onSave();}} style={{background:"none",border:"none",cursor:"pointer",padding:4,fontSize:18}}>{saved?"❤️":"🤍"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}


// =====================================================
// MAP VIEW
// =====================================================
function MapView({ lang, dark, deals, stores, onDealClick }) {
  const th = theme(dark);
  const mapRef = useRef(null);
  const lMap = useRef(null);
  const markers = useRef([]);
  const [sel, setSel] = useState(null);
  const [catFilter, setCatFilter] = useState("all");
  const MAP_CATS = [
    {id:"all",uz:"Hammasi",ru:"Все",e:"🏷️"},{id:"auto",uz:"Avto",ru:"Авто",e:"🚗"},
    {id:"restaurant",uz:"Kafe",ru:"Кафе",e:"🍔"},{id:"pharmacy",uz:"Dorixona",ru:"Аптека",e:"💊"},
    {id:"medical",uz:"Tibbiyot",ru:"Медицина",e:"👨‍⚕️"},{id:"hotel",uz:"Hotel",ru:"Отель",e:"🏨"},
  ];
  const filtered = catFilter==="all" ? deals : deals.filter(d=>d.category===catFilter);
  useEffect(()=>{
    if (!window.L || lMap.current) return;
    const L = window.L;
    const map = L.map(mapRef.current, {center:[41.299,69.240],zoom:13,zoomControl:false,attributionControl:false});
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{subdomains:"abcd",maxZoom:19}).addTo(map);
    lMap.current = map;
    const userIcon = L.divIcon({className:"",html:`<div style="width:16px;height:16px;border-radius:8px;background:#16A34A;border:3px solid #fff;box-shadow:0 0 0 6px rgba(22,163,74,0.25)"></div>`,iconSize:[16,16],iconAnchor:[8,8]});
    L.marker([41.299,69.240],{icon:userIcon}).addTo(map);
    map.on("click",()=>setSel(null));
  },[]);
  useEffect(()=>{
    if (!window.L || !lMap.current) return;
    const L = window.L;
    markers.current.forEach(m=>m.remove());
    markers.current=[];
    filtered.forEach(deal=>{
      if (!deal.lat||!deal.lng) return;
      const icon = L.divIcon({className:"",html:`<div style="background:#1C1C1C;color:#fff;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-size:18px;border:2.5px solid #16A34A;box-shadow:0 3px 10px rgba(0,0,0,0.5);cursor:pointer;position:relative">${deal.logo}<div style="position:absolute;top:-6px;right:-6px;background:#16A34A;color:#fff;border-radius:5px;padding:1px 4px;font-size:9px;font-weight:800">-${deal.discount}%</div></div>`,iconSize:[40,40],iconAnchor:[20,20]});
      const m = L.marker([deal.lat,deal.lng],{icon}).addTo(lMap.current);
      m.on("click",e=>{e.originalEvent.stopPropagation();setSel(deal);lMap.current.setView([deal.lat,deal.lng],15,{animate:true});});
      markers.current.push(m);
    });
  },[catFilter,deals]);
  const open = sel ? isStoreOpen(stores.find(s=>s.id===sel.storeId)) : false;
  return (
    <div style={{position:"relative",width:"100%",height:"100%"}}>
      <div ref={mapRef} style={{width:"100%",height:"100%"}}/>
      <div style={{position:"absolute",top:8,left:0,right:0,zIndex:20,padding:"0 12px",display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none"}}>
        {MAP_CATS.map(cat=>{
          const active=catFilter===cat.id;
          return (
            <button key={cat.id} onClick={()=>setCatFilter(cat.id)} style={{flexShrink:0,display:"flex",alignItems:"center",gap:5,padding:"7px 14px",borderRadius:22,background:active?"#16A34A":"rgba(28,28,28,0.92)",border:active?"none":"1px solid rgba(255,255,255,0.12)",color:active?"#fff":"rgba(255,255,255,0.8)",fontWeight:600,fontSize:12,cursor:"pointer",backdropFilter:"blur(8px)"}}>
              <span style={{fontSize:14}}>{cat.e}</span>{lang==="uz"?cat.uz:cat.ru}
            </button>
          );
        })}
      </div>
      <button onClick={()=>{if(navigator.geolocation)navigator.geolocation.getCurrentPosition(p=>{lMap.current?.setView([p.coords.latitude,p.coords.longitude],15);});}}
        style={{position:"absolute",right:14,bottom:sel?220:60,zIndex:20,width:44,height:44,borderRadius:12,background:"rgba(28,28,28,0.92)",border:"1px solid rgba(255,255,255,0.12)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)"}}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4"/></svg>
      </button>
      <div style={{position:"absolute",bottom:0,left:0,right:0,zIndex:30,background:"rgba(18,18,18,0.97)",borderRadius:"20px 20px 0 0",backdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,0.08)",transform:sel?"translateY(0)":"translateY(100%)",transition:"transform 0.3s cubic-bezier(0.4,0,0.2,1)",paddingBottom:12}}>
        <div style={{display:"flex",justifyContent:"center",padding:"12px 0 8px"}}><div style={{width:36,height:4,borderRadius:2,background:"rgba(255,255,255,0.2)"}}/></div>
        {sel && (
          <div style={{padding:"0 16px 12px"}}>
            <div style={{display:"flex",gap:14,marginBottom:12,cursor:"pointer"}} onClick={()=>onDealClick(sel)}>
              <div style={{width:60,height:60,borderRadius:14,background:sel.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0,position:"relative"}}>
                {sel.photos?.length?<img src={sel.photos[0]} alt="" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:14}}/>:sel.logo}
                <div style={{position:"absolute",top:3,right:3,background:"#16A34A",color:"#fff",borderRadius:5,padding:"1px 4px",fontSize:9,fontWeight:800}}>-{sel.discount}%</div>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:15,color:"#fff",marginBottom:3}}>{sel.storeName}</div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                  <span style={{width:7,height:7,borderRadius:4,background:open?"#16A34A":"#888",display:"inline-block"}}/>
                  <span style={{fontSize:12,color:open?"#16A34A":"#888",fontWeight:600}}>{open?T[lang].openNow:T[lang].closedNow}</span>
                </div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.5)"}}>⏰ {daysLeft(sel.expiryDate,lang)}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>onDealClick(sel)} style={{flex:2,padding:"11px 0",borderRadius:12,background:"#16A34A",border:"none",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer"}}>{lang==="uz"?"Batafsil":"Подробнее"}</button>
              <button onClick={()=>setSel(null)} style={{width:44,borderRadius:12,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.5)",fontSize:16,cursor:"pointer"}}>✕</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================
// MAP PICKER (mini)
// =====================================================
function MapPicker({ lang, location, onChange, dark }) {
  const mapRef = useRef(null);
  const lMap = useRef(null);
  const markerRef = useRef(null);
  const th = theme(dark);
  useEffect(()=>{
    if (!window.L || lMap.current) return;
    const L = window.L;
    const lat = location?.lat||41.299, lng = location?.lng||69.240;
    const map = L.map(mapRef.current,{center:[lat,lng],zoom:14,zoomControl:true});
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19}).addTo(map);
    const icon = L.divIcon({className:"",html:`<div style="background:#16A34A;width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,iconSize:[26,26],iconAnchor:[13,26]});
    if (location) { markerRef.current = L.marker([lat,lng],{icon,draggable:true}).addTo(map); markerRef.current.on("dragend",e=>{const ll=e.target.getLatLng();onChange({lat:ll.lat,lng:ll.lng});}); }
    map.on("click",e=>{
      const {lat:la,lng:lo}=e.latlng; onChange({lat:la,lng:lo});
      if (markerRef.current) markerRef.current.setLatLng([la,lo]);
      else { markerRef.current=L.marker([la,lo],{icon,draggable:true}).addTo(map); markerRef.current.on("dragend",ev=>{const ll=ev.target.getLatLng();onChange({lat:ll.lat,lng:ll.lng});}); }
    });
    lMap.current = map;
  },[]);
  return (
    <div>
      <div ref={mapRef} style={{height:220,borderRadius:14,overflow:"hidden",border:`1.5px solid ${th.border}`}}/>
      <p style={{fontSize:12,color:location?"#16A34A":th.sub,marginTop:6,textAlign:"center",fontWeight:600}}>{location ? T[lang].locationSet : T[lang].pickOnMap}</p>
    </div>
  );
}


// =====================================================
// CHAT MODAL
// =====================================================
function ChatModal({ store, lang, dark, messages, onClose, onSend }) {
  const th = theme(dark);
  const [text, setText] = useState("");
  const endRef = useRef(null);
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[messages]);
  const send = () => {
    if (!text.trim()) return;
    onSend({text:text.trim(),from:"user",time:new Date().toISOString()});
    setText("");
    setTimeout(()=>onSend({text:lang==="uz"?"Xabaringiz qabul qilindi! Tez javob beramiz 😊":"Ваше сообщение получено! Ответим скоро 😊",from:"store",time:new Date().toISOString()}),900);
  };
  return (
    <div style={{position:"fixed",inset:0,background:th.bg,zIndex:300,maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column"}}>
      <div style={{background:th.card,borderBottom:`1px solid ${th.border}`,padding:"50px 16px 12px",display:"flex",alignItems:"center",gap:12}}>
        <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",padding:4}}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={th.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div style={{position:"relative",flexShrink:0}}>
          <div style={{width:42,height:42,borderRadius:13,background:store.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{store.logo}</div>
          <div style={{position:"absolute",bottom:-2,right:-2,width:14,height:14,borderRadius:7,background:"#16A34A",border:`2px solid ${th.card}`}}/>
        </div>
        <div style={{flex:1}}>
          <div style={{fontWeight:700,fontSize:15,color:th.text}}>{store.name}</div>
          <div style={{fontSize:12,color:"#16A34A",fontWeight:500}}>● {lang==="uz"?"Faol":"Онлайн"}</div>
        </div>
        <button onClick={()=>window.location.href=`tel:${store.phone}`} style={{background:"none",border:"none",cursor:"pointer",padding:6}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={th.sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.4 2 2 0 0 1 3.55 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        </button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"12px 16px 8px"}}>
        {messages.length===0 ? (
          <div style={{textAlign:"center",padding:"60px 20px",color:th.sub}}>
            <div style={{width:72,height:72,borderRadius:36,background:th.card2,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:30}}>{store.logo}</div>
            <div style={{fontWeight:700,fontSize:15,color:th.text,marginBottom:8}}>{store.name}</div>
            <div style={{fontSize:13,lineHeight:1.6}}>{lang==="uz"?"Savol yoki buyurtma uchun yozing 👇":"Напишите вопрос или заявку 👇"}</div>
          </div>
        ) : messages.map((msg,i)=>{
          const isUser = msg.from==="user";
          return (
            <div key={i} style={{display:"flex",justifyContent:isUser?"flex-end":"flex-start",marginBottom:8,alignItems:"flex-end",gap:8}}>
              {!isUser && <div style={{width:28,height:28,borderRadius:9,background:store.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,marginBottom:2}}>{store.logo}</div>}
              <div style={{maxWidth:"72%"}}>
                <div style={{padding:"10px 14px",borderRadius:isUser?"18px 18px 4px 18px":"18px 18px 18px 4px",background:isUser?"#16A34A":th.card,color:isUser?"#fff":th.text,fontSize:14,lineHeight:1.5}}>{msg.text}</div>
                <div style={{fontSize:10,color:th.sub,marginTop:4,textAlign:isUser?"right":"left"}}>{new Date(msg.time).toLocaleTimeString("uz",{hour:"2-digit",minute:"2-digit"})}{isUser?" ✓✓":""}</div>
              </div>
            </div>
          );
        })}
        <div ref={endRef}/>
      </div>
      <div style={{padding:"10px 12px 28px",background:th.card,borderTop:`1px solid ${th.border}`,display:"flex",gap:8,alignItems:"flex-end"}}>
        <div style={{flex:1,background:th.card2,borderRadius:22,padding:"10px 16px",display:"flex",alignItems:"center"}}>
          <textarea placeholder={lang==="uz"?"Xabar yozing...":"Написать сообщение..."} value={text} onChange={e=>setText(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
            style={{flex:1,background:"none",border:"none",fontSize:15,outline:"none",resize:"none",color:th.text,minHeight:24,maxHeight:90,fontFamily:"inherit",lineHeight:1.5}} rows={1}/>
        </div>
        <button onClick={send} disabled={!text.trim()} style={{width:44,height:44,borderRadius:22,background:text.trim()?"#16A34A":th.card2,border:"none",cursor:text.trim()?"pointer":"default",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",transition:"background 0.2s"}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={text.trim()?"#fff":th.sub} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  );
}

// =====================================================
// BOOKING MODAL
// =====================================================
function BookingModal({ store, lang, dark, onClose, onSuccess }) {
  const th = theme(dark);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const times = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];
  const today = new Date().toISOString().slice(0,10);
  const inp = {width:"100%",padding:"13px 15px",borderRadius:12,border:`1.5px solid ${th.border}`,background:th.card2,fontSize:14,outline:"none",boxSizing:"border-box",color:th.text,marginBottom:14};
  if (done) return (
    <Sheet onClose={onClose} dark={dark} maxH="50vh">
      <div style={{textAlign:"center",padding:"20px 0"}}>
        <div style={{fontSize:60,marginBottom:10}}>📅</div>
        <h3 style={{fontSize:18,fontWeight:800,color:th.text,margin:"0 0 6px"}}>{T[lang].bookSuccess}</h3>
        <p style={{color:th.sub,fontSize:13}}>{T[lang].bookSuccessDesc}</p>
      </div>
      <Btn onClick={onClose}>OK</Btn>
    </Sheet>
  );
  return (
    <Sheet onClose={onClose} dark={dark} maxH="85vh">
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
        <div style={{width:44,height:44,borderRadius:13,background:store.color+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{store.logo}</div>
        <div><div style={{fontWeight:800,fontSize:15,color:th.text}}>{store.name}</div><div style={{fontSize:12,color:th.sub}}>{T[lang].book}</div></div>
      </div>
      <label style={{fontSize:13,color:th.sub,marginBottom:6,fontWeight:600,display:"block"}}>{T[lang].chooseDate}</label>
      <input type="date" min={today} value={date} onChange={e=>setDate(e.target.value)} style={inp}/>
      {date && <>
        <label style={{fontSize:13,color:th.sub,marginBottom:8,fontWeight:600,display:"block"}}>{T[lang].chooseTime}</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
          {times.map(t2=>(
            <button key={t2} onClick={()=>setTime(t2)} style={{padding:"8px 13px",borderRadius:10,cursor:"pointer",fontWeight:700,fontSize:12,border:time===t2?"2px solid #16A34A":`2px solid ${th.border}`,background:time===t2?"#F0FDF4":th.card,color:time===t2?"#16A34A":th.sub}}>{t2}</button>
          ))}
        </div>
      </>}
      {time && <>
        <label style={{fontSize:13,color:th.sub,marginBottom:6,fontWeight:600,display:"block"}}>{lang==="uz"?"Izoh":"Примечание"}</label>
        <textarea placeholder={lang==="uz"?"Masalan: 2 kishilik stol...":"Например: Столик на 2..."} value={note} onChange={e=>setNote(e.target.value)} style={{...inp,minHeight:60,resize:"vertical",fontFamily:"inherit"}}/>
      </>}
      <Btn onClick={()=>{if(!date||!time)return;const b={id:"BK-"+Date.now().toString().slice(-6),storeId:store.id,storeName:store.name,storeLogo:store.logo,storeColor:store.color,date,time,note,status:"pending",createdAt:new Date().toISOString()};onSuccess(b);setDone(true);}} disabled={!date||!time}>{T[lang].bookNow}</Btn>
    </Sheet>
  );
}

// =====================================================
// REVIEW MODAL
// =====================================================
function ReviewModal({ title, lang, dark, onClose, onSubmit }) {
  const th = theme(dark);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  return (
    <Sheet onClose={onClose} dark={dark} maxH="55vh">
      <h3 style={{fontSize:16,fontWeight:800,color:th.text,textAlign:"center",marginBottom:4}}>{title}</h3>
      <div style={{display:"flex",justifyContent:"center",margin:"16px 0 18px"}}><Stars value={stars} onChange={setStars} size={34}/></div>
      <textarea placeholder={T[lang].commentPh} value={comment} onChange={e=>setComment(e.target.value)}
        style={{width:"100%",padding:"13px 15px",borderRadius:12,border:`1.5px solid ${th.border}`,background:th.card2,fontSize:14,outline:"none",boxSizing:"border-box",color:th.text,minHeight:70,resize:"vertical",fontFamily:"inherit",marginBottom:14}}/>
      <Btn onClick={()=>stars>0&&onSubmit({stars,comment})} disabled={stars===0}>{T[lang].submitReview}</Btn>
      <div style={{marginTop:10}}><Btn ghost onClick={onClose}>{T[lang].cancel}</Btn></div>
    </Sheet>
  );
}

// =====================================================
// DISCOUNT MODAL
// =====================================================
function DiscountModal({ product, lang, dark, onClose, onApply }) {
  const th = theme(dark);
  const [pct, setPct] = useState(product.discount?.percent?.toString()||"");
  const [expiry, setExpiry] = useState(product.discount?.expiryDate||isoFromNow(3));
  const ok = pct && Number(pct)>0 && Number(pct)<100 && expiry;
  const inp = {width:"100%",padding:"13px 15px",borderRadius:12,border:`1.5px solid ${th.border}`,background:th.card2,fontSize:14,outline:"none",boxSizing:"border-box",color:th.text,marginBottom:14};
  return (
    <Sheet onClose={onClose} dark={dark} maxH="65vh">
      <h3 style={{fontSize:16,fontWeight:800,color:th.text,textAlign:"center",marginBottom:4}}>{T[lang].discountTitle}</h3>
      <p style={{textAlign:"center",color:th.sub,fontSize:13,marginBottom:16}}>{product.name?.[lang]||product.name?.uz}</p>
      <label style={{fontSize:13,color:th.sub,marginBottom:6,fontWeight:600,display:"block"}}>{T[lang].discountPct}</label>
      <input type="number" min="1" max="99" placeholder="30" value={pct} onChange={e=>setPct(e.target.value)} style={inp}/>
      <label style={{fontSize:13,color:th.sub,marginBottom:6,fontWeight:600,display:"block"}}>{T[lang].expiryDate}</label>
      <input type="date" value={expiry} min={new Date().toISOString().slice(0,10)} onChange={e=>setExpiry(e.target.value)} style={inp}/>
      {product.originalPrice>0 && pct && (
        <div style={{background:"#F0FDF4",borderRadius:12,padding:14,marginBottom:14,textAlign:"center"}}>
          <span style={{textDecoration:"line-through",color:th.sub,fontSize:13}}>{fmt(product.originalPrice)} {T[lang].sum}</span>
          {" → "}<b style={{color:"#16A34A",fontSize:17}}>{fmt(product.originalPrice*(1-Number(pct)/100))} {T[lang].sum}</b>
        </div>
      )}
      <Btn onClick={()=>ok&&onApply({percent:Number(pct),expiryDate:expiry})} disabled={!ok}>{T[lang].discountApply}</Btn>
      <div style={{marginTop:10}}><Btn ghost onClick={onClose}>{T[lang].cancel}</Btn></div>
    </Sheet>
  );
}


// =====================================================
// DEAL DETAIL SHEET
// =====================================================
function DealDetailSheet({ deal, lang, dark, saved, onClose, onSave, onChat }) {
  const th = theme(dark);
  const discPrice = deal.originalPrice>0 ? Math.round(deal.originalPrice*(1-deal.discount/100)) : 0;
  return (
    <Sheet onClose={onClose} dark={dark} maxH="92vh">
      {deal.photos?.length ? (
        <div style={{display:"flex",gap:8,overflowX:"auto",marginBottom:14}}>
          {deal.photos.map((src,i)=><img key={i} src={src} alt="" style={{width:100,height:100,borderRadius:12,objectFit:"cover",flexShrink:0}}/>)}
        </div>
      ) : <div style={{fontSize:56,textAlign:"center",marginBottom:10}}>{deal.logo}</div>}
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8}}>
        <div style={{flex:1}}>
          <h2 style={{fontSize:19,fontWeight:800,color:th.text,margin:"0 0 4px"}}>{deal.storeName}</h2>
          {deal.verified && <span style={{fontSize:12,color:"#16A34A",fontWeight:600}}>✓ {lang==="uz"?"Tasdiqlangan":"Подтверждён"}</span>}
        </div>
        <button onClick={onSave} style={{background:"none",border:"none",cursor:"pointer",fontSize:24,padding:4}}>{saved?"❤️":"🤍"}</button>
      </div>
      <p style={{color:th.sub,marginBottom:8,fontSize:14}}>{deal.title?.[lang]||deal.title?.uz}</p>
      {deal.description?.[lang] && <p style={{color:th.sub,fontSize:13,lineHeight:1.6,marginBottom:12,background:th.card2,borderRadius:10,padding:12}}>{deal.description[lang]}</p>}
      {deal.params?.length>0 && (
        <div style={{marginBottom:12}}>
          {deal.params.map((p,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${th.border}`}}>
              <span style={{color:th.sub,fontSize:13}}>{p.name}</span>
              <span style={{color:th.text,fontSize:13,fontWeight:600}}>{p.value}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{background:deal.color+"15",borderRadius:14,padding:16,textAlign:"center",marginBottom:12}}>
        <div style={{fontSize:52,fontWeight:900,color:deal.color,lineHeight:1}}>{deal.discount}%</div>
        <div style={{color:deal.color,fontWeight:600,marginTop:4}}>{T[lang].discountBadge}</div>
        {deal.originalPrice>0 && (
          <div style={{marginTop:8,fontSize:13,color:th.sub}}>
            <span style={{textDecoration:"line-through"}}>{fmt(deal.originalPrice)} {T[lang].sum}</span>{" → "}
            <b style={{color:th.text}}>{fmt(discPrice)} {T[lang].sum}</b>
          </div>
        )}
      </div>
      <div style={{background:th.card2,borderRadius:12,padding:12,marginBottom:12,display:"flex",flexDirection:"column",gap:8}}>
        <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:th.sub,fontSize:13}}>{T[lang].expiresIn}</span><span style={{color:th.text,fontSize:13,fontWeight:600}}>⏰ {daysLeft(deal.expiryDate,lang)}</span></div>
        {deal.storeAddress && <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:th.sub,fontSize:13}}>📍</span><span style={{color:th.text,fontSize:13,fontWeight:600,textAlign:"right",flex:1,marginLeft:10}}>{deal.storeAddress}</span></div>}
        {deal.storePhone && <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:th.sub,fontSize:13}}>📞</span><span style={{color:th.text,fontSize:13,fontWeight:600}}>{deal.storePhone}</span></div>}
        {deal.delivery && <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#16A34A",fontSize:13}}>🚚 {lang==="uz"?"Yetkazib berish":"Доставка"}</span><span style={{color:"#16A34A",fontSize:13,fontWeight:700}}>{fmt(deal.deliveryPrice)} {T[lang].sum}</span></div>}
      </div>
      <button onClick={onChat} style={{width:"100%",padding:"13px",background:"transparent",color:"#16A34A",border:"1.5px solid #16A34A",borderRadius:12,fontSize:14,fontWeight:700,cursor:"pointer",marginBottom:8}}>💬 {T[lang].chat}</button>
    </Sheet>
  );
}

// =====================================================
// =====================================================
// BUSINESS PROFILE VIEW
// =====================================================
function BizProfile({ store, lang, dark, isOwner, isSub, bookings,
  onBack, onToggleSub, onAddProduct, onApplyDiscount, onRemoveDiscount,
  onDeleteProduct, onEditProduct, onToggleActive, onDuplicateProduct,
  onRateProduct, onRateStore, onBook, onChat }) {
  const th = theme(dark);
  const tx = T[lang];
  const [discTarget, setDiscTarget] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [prodMenu, setProdMenu] = useState(null);
  const open = isStoreOpen(store);
  const rating = avgRating(store.reviews);
  const days = ["sun","mon","tue","wed","thu","fri","sat"];
  const dk = days[new Date().getDay()];
  const todayH = store.workHours?.[dk];
  const activeProds = isOwner ? store.products : store.products.filter(p=>p.active!==false);

  return (
    <div style={{minHeight:"100vh",background:th.bg,paddingBottom:30}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#16A34A 0%,#0D6B28 100%)",padding:"50px 16px 20px",color:"#fff"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
          <button onClick={onBack} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,width:34,height:34,color:"#fff",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          {isOwner && <div style={{width:34}}/>}
        </div>
        <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
          <div style={{width:66,height:66,borderRadius:18,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,flexShrink:0,border:"2px solid rgba(255,255,255,0.4)"}}>{store.logo}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
              <span style={{fontSize:18,fontWeight:900}}>{store.name}</span>
              {store.verified && <span style={{fontSize:13}}>✓</span>}
            </div>
            <div style={{fontSize:12,opacity:0.85,marginBottom:4}}>📍 {store.address}</div>
            {rating>0 && (
              <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:4}}>
                {[1,2,3,4,5].map(n=><span key={n} style={{fontSize:11,color:n<=Math.round(rating)?"#FFD700":"rgba(255,255,255,0.3)"}}>★</span>)}
                <span style={{fontSize:12,fontWeight:700}}>{rating.toFixed(1)}</span>
                <span style={{fontSize:12,opacity:0.7}}>({store.reviews.length}) · {store.subscriberBase||0} {tx.subscribers}</span>
              </div>
            )}
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{width:7,height:7,borderRadius:4,background:open?"#00FF88":"#FF4444",display:"inline-block"}}/>
              <span style={{fontSize:11,color:open?"#00FF88":"#FF8888",fontWeight:700}}>{open?tx.openNow:tx.closedNow}</span>
              {todayH && todayH!=="Yopiq" && <span style={{fontSize:11,opacity:0.7}}>· {todayH}</span>}
            </div>
          </div>
        </div>
        {!isOwner ? (
          <div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}>
            {store.phone && <button onClick={()=>window.location.href=`tel:${store.phone}`} style={{flex:1,minWidth:64,padding:"10px 6px",borderRadius:12,border:"none",background:"rgba(255,255,255,0.22)",color:"#fff",fontWeight:700,fontSize:11,cursor:"pointer"}}>{tx.callStore}</button>}
            {store.telegram && <button onClick={()=>window.open(`https://t.me/${store.telegram.replace("@","")}`, "_blank")} style={{flex:1,minWidth:64,padding:"10px 6px",borderRadius:12,border:"none",background:"rgba(0,136,204,0.35)",color:"#fff",fontWeight:700,fontSize:11,cursor:"pointer"}}>{tx.telegramStore}</button>}
            <button onClick={onChat} style={{flex:1,minWidth:64,padding:"10px 6px",borderRadius:12,border:"none",background:"rgba(255,255,255,0.22)",color:"#fff",fontWeight:700,fontSize:11,cursor:"pointer"}}>{tx.chat}</button>
            <button onClick={onBook} style={{flex:1,minWidth:64,padding:"10px 6px",borderRadius:12,border:"none",background:"rgba(255,180,0,0.35)",color:"#fff",fontWeight:700,fontSize:11,cursor:"pointer"}}>{tx.book}</button>
          </div>
        ) : (
          <div style={{marginTop:12,background:"rgba(255,255,255,0.2)",borderRadius:10,padding:"8px 12px",fontSize:12,fontWeight:700,textAlign:"center"}}>{lang==="uz"?"Sizning biznesingiz":"Ваш бизнес"} · {store.products.length} {tx.products.toLowerCase()}</div>
        )}
        {!isOwner && <button onClick={onToggleSub} style={{marginTop:12,width:"100%",padding:"12px",borderRadius:14,border:"none",cursor:"pointer",fontWeight:800,fontSize:14,background:isSub?"rgba(255,255,255,0.2)":"#fff",color:isSub?"#fff":"#16A34A"}}>{isSub?tx.subscribed:tx.subscribe}</button>}
      </div>

      <div style={{padding:16}}>
        {store.description?.[lang] && <div style={{background:th.card,borderRadius:14,padding:14,marginBottom:14,border:`1px solid ${th.border}`}}><p style={{margin:0,fontSize:13,color:th.sub,lineHeight:1.6}}>{store.description[lang]}</p></div>}

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <h3 style={{margin:0,fontSize:16,fontWeight:800,color:th.text}}>{tx.products}</h3>
          {isOwner && <button onClick={onAddProduct} style={{background:"#16A34A",color:"#fff",border:"none",borderRadius:10,padding:"7px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}}>{tx.addProduct}</button>}
        </div>

        {activeProds.length===0 ? (
          <div style={{textAlign:"center",padding:"40px 0",color:th.sub}}>
            <div style={{fontSize:44,marginBottom:10}}>📦</div>
            <div style={{fontWeight:600}}>{tx.noProducts}</div>
            {isOwner && <div style={{marginTop:16}}><Btn onClick={onAddProduct} style={{width:"auto",padding:"11px 20px"}}>{tx.addProduct}</Btn></div>}
          </div>
        ) : activeProds.map(prod=>{
          const hasDeal = prod.discount && !isExpired(prod.discount.expiryDate);
          const pRating = avgRating(prod.reviews);
          const isActive = prod.active !== false;
          return (
            <div key={prod.id} style={{background:th.card,borderRadius:14,padding:13,marginBottom:10,boxShadow:"0 2px 8px rgba(0,0,0,0.06)",border:`1px solid ${th.border}`,opacity:isActive?1:0.6}}>
              <div style={{display:"flex",gap:12}}>
                <div style={{width:58,height:58,borderRadius:12,overflow:"hidden",flexShrink:0,background:store.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,position:"relative"}}>
                  {prod.photos?.length?<img src={prod.photos[0]} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:store.logo}
                  {hasDeal && <div style={{position:"absolute",top:3,left:3,background:"#16A34A",color:"#fff",borderRadius:5,padding:"1px 4px",fontSize:8,fontWeight:800}}>-{prod.discount.percent}%</div>}
                  {!isActive && <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:12,fontSize:16}}>⏸</div>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:14,color:th.text,marginBottom:2}}>{prod.name?.[lang]||prod.name?.uz}</div>
                  <div style={{fontSize:11,color:th.sub,marginBottom:3}}>{CAT_LABELS[lang]?.[prod.category]||prod.category}</div>
                  {prod.originalPrice>0 && (
                    hasDeal ? (
                      <div style={{fontSize:12}}>
                        <span style={{textDecoration:"line-through",color:th.sub}}>{fmt(prod.originalPrice)}</span>{" "}
                        <b style={{color:"#16A34A"}}>{fmt(prod.originalPrice*(1-prod.discount.percent/100))} {tx.sum}</b>
                      </div>
                    ) : <div style={{fontSize:12,color:th.text,fontWeight:700}}>{fmt(prod.originalPrice)} {tx.sum}</div>
                  )}
                  {pRating>0 && <div style={{display:"flex",gap:2,marginTop:3}}>{[1,2,3,4,5].map(n=><span key={n} style={{fontSize:9,color:n<=Math.round(pRating)?"#FFB400":"#444"}}>★</span>)}<span style={{fontSize:10,color:th.sub}}>({prod.reviews?.length||0})</span></div>}
                </div>
                {isOwner && (
                  <div style={{position:"relative"}}>
                    <button onClick={()=>setProdMenu(prodMenu===prod.id?null:prod.id)} style={{background:th.card2,border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer",color:th.sub,fontSize:16}}>⋯</button>
                    {prodMenu===prod.id && (
                      <div style={{position:"absolute",right:0,top:32,background:th.card,border:`1px solid ${th.border}`,borderRadius:12,boxShadow:"0 8px 24px rgba(0,0,0,0.3)",zIndex:50,minWidth:160,overflow:"hidden"}}>
                        {[
                          {icon:"✏️",label:tx.editProduct,action:()=>{setEditTarget(prod);setProdMenu(null);}},
                          {icon:"⏸",label:isActive?tx.deactivateProduct:tx.activateProduct,action:()=>{onToggleActive(prod.id,!isActive);setProdMenu(null);}},
                          {icon:"📋",label:tx.duplicateProduct,action:()=>{onDuplicateProduct(prod.id);setProdMenu(null);}},
                          {icon:"🏷️",label:hasDeal?tx.editDiscount:tx.makeDiscount,action:()=>{setDiscTarget(prod);setProdMenu(null);}},
                          ...(hasDeal?[{icon:"✕",label:tx.removeDiscount,action:()=>{onRemoveDiscount(prod.id);setProdMenu(null);}}]:[]),
                          {icon:"🗑️",label:tx.deleteProduct,action:()=>{setDeleteTarget(prod.id);setProdMenu(null);},red:true},
                        ].map((item,i)=>(
                          <button key={i} onClick={item.action} style={{width:"100%",padding:"11px 16px",background:"none",border:"none",cursor:"pointer",fontSize:13,fontWeight:600,color:item.red?"#FF6B6B":th.text,textAlign:"left",display:"flex",alignItems:"center",gap:10,borderBottom:`1px solid ${th.border}`}}>
                            <span>{item.icon}</span>{item.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {!isOwner && (
                <div style={{marginTop:10,display:"flex",gap:8}}>
                  <button onClick={()=>setReviewTarget(prod.id)} style={{flex:1,padding:"8px",borderRadius:10,border:`1.5px solid ${th.border}`,background:th.card2,color:th.sub,fontWeight:700,fontSize:12,cursor:"pointer"}}>⭐ {tx.rateProduct}</button>
                  {hasDeal && <div style={{flex:1,padding:"8px",borderRadius:10,border:"none",background:"#16A34A20",color:"#16A34A",fontWeight:700,fontSize:12,textAlign:"center"}}>🏷️ -{prod.discount.percent}%</div>}
                </div>
              )}
            </div>
          );
        })}

        {/* Reviews */}
        <div style={{marginTop:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <h3 style={{margin:0,fontSize:16,fontWeight:800,color:th.text}}>{tx.reviews}</h3>
            {!isOwner && <button onClick={()=>setReviewTarget("store")} style={{background:th.card2,border:`1.5px solid ${th.border}`,borderRadius:10,padding:"6px 12px",fontSize:12,fontWeight:700,color:th.text,cursor:"pointer"}}>{tx.leaveReview}</button>}
          </div>
          {store.reviews.length===0 ? <p style={{color:th.sub,fontSize:13}}>{tx.noReviews}</p> : store.reviews.map((r,i)=>(
            <div key={i} style={{background:th.card,borderRadius:12,padding:13,marginBottom:8,border:`1px solid ${th.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <span style={{fontWeight:700,fontSize:13,color:th.text}}>{r.author}</span>
                <Stars value={r.stars} readOnly size={12}/>
              </div>
              {r.comment && <p style={{margin:0,fontSize:13,color:th.sub}}>{r.comment}</p>}
            </div>
          ))}
        </div>

        <div style={{marginTop:20}}>
          <h3 style={{fontSize:15,fontWeight:800,color:th.text,marginBottom:8}}>{tx.similarBiz}</h3>
          <p style={{color:th.sub,fontSize:12}}>{lang==="uz"?"O'xshash bizneslar tez orada":"Похожие бизнесы скоро появятся"}</p>
        </div>
      </div>

      {discTarget && <DiscountModal product={discTarget} lang={lang} dark={dark} onClose={()=>setDiscTarget(null)} onApply={d=>{onApplyDiscount(discTarget.id,d);setDiscTarget(null);}}/>}
      {deleteTarget && (
        <Sheet onClose={()=>setDeleteTarget(null)} dark={dark} maxH="35vh">
          <p style={{fontSize:15,color:th.text,fontWeight:600,marginBottom:20,textAlign:"center"}}>{tx.confirmDelete}</p>
          <div style={{display:"flex",gap:10}}><Btn ghost onClick={()=>setDeleteTarget(null)}>{tx.no}</Btn><Btn onClick={()=>{onDeleteProduct(deleteTarget);setDeleteTarget(null);}}>{tx.yes}</Btn></div>
        </Sheet>
      )}
      {editTarget && (
        <Sheet onClose={()=>setEditTarget(null)} dark={dark} maxH="75vh">
          <h3 style={{fontSize:16,fontWeight:800,color:th.text,marginBottom:16,textAlign:"center"}}>✏️ {tx.editProduct}</h3>
          {[
            {label:tx.productName,key:"nameVal",val:editTarget.name?.[lang]||editTarget.name?.uz||"",type:"text"},
            {label:tx.productDesc,key:"descVal",val:editTarget.description?.[lang]||editTarget.description?.uz||"",type:"textarea"},
            {label:tx.price,key:"priceVal",val:String(editTarget.originalPrice||""),type:"number"},
          ].map((f,i)=>(
            <div key={i}>
              <label style={{fontSize:13,color:th.sub,marginBottom:6,fontWeight:600,display:"block"}}>{f.label}</label>
              {f.type==="textarea" ? (
                <textarea value={editTarget[f.key]!==undefined?editTarget[f.key]:f.val} onChange={e=>setEditTarget(p=>({...p,[f.key]:e.target.value}))}
                  style={{width:"100%",padding:"12px 14px",borderRadius:12,border:`1.5px solid ${th.border}`,background:th.card2,color:th.text,fontSize:14,outline:"none",boxSizing:"border-box",resize:"none",minHeight:60,fontFamily:"inherit",marginBottom:12}}/>
              ) : (
                <input type={f.type} value={editTarget[f.key]!==undefined?editTarget[f.key]:f.val} onChange={e=>setEditTarget(p=>({...p,[f.key]:e.target.value}))}
                  style={{width:"100%",padding:"12px 14px",borderRadius:12,border:`1.5px solid ${th.border}`,background:th.card2,color:th.text,fontSize:14,outline:"none",boxSizing:"border-box",marginBottom:12}}/>
              )}
            </div>
          ))}
          <div style={{display:"flex",gap:10}}>
            <Btn ghost onClick={()=>setEditTarget(null)}>{tx.cancel}</Btn>
            <Btn onClick={()=>{
              const nv = editTarget.nameVal!==undefined?editTarget.nameVal:editTarget.name?.[lang]||editTarget.name?.uz;
              const dv = editTarget.descVal!==undefined?editTarget.descVal:editTarget.description?.[lang]||editTarget.description?.uz;
              const pv = editTarget.priceVal!==undefined?parseFloat(editTarget.priceVal)||0:editTarget.originalPrice;
              onEditProduct(editTarget.id,{name:{uz:nv,ru:nv},description:{uz:dv,ru:dv},originalPrice:pv});
              setEditTarget(null);
            }}>{tx.save}</Btn>
          </div>
        </Sheet>
      )}
    </div>
  );
}


// =====================================================
// CREATE BUSINESS WIZARD (6 steps)
// =====================================================
function CreateBizWizard({ lang, dark, userData, onCreate, onCancel }) {
  const th = theme(dark);
  const tx = T[lang];
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({category:"",name:"",phone:userData.phone||"",telegram:"",address:"",location:null,workHours:{mon:"09:00-18:00",tue:"09:00-18:00",wed:"09:00-18:00",thu:"09:00-18:00",fri:"09:00-18:00",sat:"10:00-16:00",sun:"Yopiq"},photos:[],logo:"🏪"});
  const upd = patch => setForm(p=>({...p,...patch}));
  const LOGOS = ["🏪","🛒","🍕","👕","📱","💄","☕","⚽","🛠️","🚗","💊","🏨","🧹","📚","🏥","🎮","🐾","🔧"];
  const DAY_KEYS = ["mon","tue","wed","thu","fri","sat","sun"];
  const DAY_LABELS = lang==="uz"?["Du","Se","Ch","Pa","Ju","Sh","Ya"]:["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
  const inp = {width:"100%",padding:"13px 15px",borderRadius:12,border:`1.5px solid ${th.border}`,background:th.card2,fontSize:14,outline:"none",boxSizing:"border-box",color:th.text,marginBottom:12};
  const titles = [tx.chooseCategory,lang==="uz"?"Biznes ma'lumotlari":"Информация",lang==="uz"?"Telefon & Telegram":"Телефон",lang==="uz"?"Joylashuv":"Местоположение",tx.workHours,tx.photos];

  return (
    <FullPage dark={dark}>
      <div style={{background:"linear-gradient(135deg,#16A34A,#0D6B28)",padding:"50px 16px 16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <button onClick={step>1?()=>setStep(s=>s-1):onCancel} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,width:34,height:34,color:"#fff",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div>
            <div style={{fontSize:16,fontWeight:800,color:"#fff"}}>{titles[step-1]}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.8)"}}>{tx.step} {step} {tx.of} 6</div>
          </div>
        </div>
        <div style={{height:4,background:"rgba(255,255,255,0.2)",borderRadius:2}}>
          <div style={{height:"100%",width:`${(step/6)*100}%`,background:"#fff",borderRadius:2,transition:"width 0.3s"}}/>
        </div>
      </div>
      <div style={{padding:16,overflowY:"auto",maxHeight:"calc(100vh - 130px)",paddingBottom:40}}>
        {step===1 && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {CATS.map(cat=>(
              <button key={cat.id} onClick={()=>{upd({category:cat.id});setStep(2);}} style={{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:8,padding:"16px 14px",borderRadius:16,cursor:"pointer",textAlign:"left",border:`2px solid ${form.category===cat.id?"#16A34A":th.border}`,background:form.category===cat.id?"#F0FDF4":th.card}}>
                <span style={{fontSize:26}}>{cat.emoji}</span>
                <span style={{fontSize:13,fontWeight:700,color:th.text}}>{CAT_LABELS[lang]?.[cat.id]||cat.id}</span>
              </button>
            ))}
          </div>
        )}
        {step===2 && (
          <div>
            <label style={{fontSize:13,color:th.sub,marginBottom:6,fontWeight:600,display:"block"}}>{tx.bizLogo}</label>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
              {LOGOS.map(l=>(
                <button key={l} onClick={()=>upd({logo:l})} style={{width:46,height:46,borderRadius:12,fontSize:22,cursor:"pointer",border:form.logo===l?"2px solid #16A34A":`2px solid ${th.border}`,background:form.logo===l?"#F0FDF4":th.card}}>{l}</button>
              ))}
            </div>
            <label style={{fontSize:13,color:th.sub,marginBottom:6,fontWeight:600,display:"block"}}>{tx.bizName} <span style={{color:"#16A34A"}}>*</span></label>
            <input placeholder={tx.bizNamePh} value={form.name} onChange={e=>upd({name:e.target.value})} style={inp}/>
            <label style={{fontSize:13,color:th.sub,marginBottom:6,fontWeight:600,display:"block"}}>{tx.bizAddress} <span style={{color:"#16A34A"}}>*</span></label>
            <input placeholder={tx.bizAddressPh} value={form.address} onChange={e=>upd({address:e.target.value})} style={inp}/>
            <Btn onClick={()=>form.name&&form.address?setStep(3):null} disabled={!form.name||!form.address}>{tx.next}</Btn>
          </div>
        )}
        {step===3 && (
          <div>
            <label style={{fontSize:13,color:th.sub,marginBottom:6,fontWeight:600,display:"block"}}>{tx.bizPhone}</label>
            <input type="tel" placeholder={tx.bizPhonePh} value={form.phone} onChange={e=>upd({phone:e.target.value})} style={inp}/>
            <label style={{fontSize:13,color:th.sub,marginBottom:6,fontWeight:600,display:"block"}}>{tx.bizTelegram}</label>
            <input placeholder={tx.bizTelegramPh} value={form.telegram} onChange={e=>upd({telegram:e.target.value})} style={inp}/>
            <Btn onClick={()=>setStep(4)}>{tx.next}</Btn>
          </div>
        )}
        {step===4 && (
          <div>
            <MapPicker lang={lang} location={form.location} onChange={loc=>upd({location:loc})} dark={dark}/>
            <div style={{marginTop:16}}><Btn onClick={()=>setStep(5)}>{tx.next}</Btn></div>
          </div>
        )}
        {step===5 && (
          <div>
            {DAY_KEYS.map((dkey,i)=>(
              <div key={dkey} style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                <span style={{width:26,fontSize:13,color:th.sub,fontWeight:600,flexShrink:0}}>{DAY_LABELS[i]}</span>
                <input value={form.workHours[dkey]} onChange={e=>upd({workHours:{...form.workHours,[dkey]:e.target.value}})} placeholder="09:00-18:00"
                  style={{...inp,marginBottom:0,flex:1,fontSize:13,padding:"10px 12px"}}/>
                <button onClick={()=>upd({workHours:{...form.workHours,[dkey]:"Yopiq"}})}
                  style={{padding:"8px 10px",borderRadius:10,border:`1px solid ${th.border}`,background:form.workHours[dkey]==="Yopiq"?"#FF6B6B20":th.card2,color:form.workHours[dkey]==="Yopiq"?"#FF6B6B":th.sub,fontSize:11,cursor:"pointer",flexShrink:0}}>✕</button>
              </div>
            ))}
            <div style={{marginTop:8}}><Btn onClick={()=>setStep(6)}>{tx.next}</Btn></div>
          </div>
        )}
        {step===6 && (
          <div>
            <label style={{fontSize:13,color:th.sub,marginBottom:8,fontWeight:600,display:"block"}}>{tx.photos}</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:16}}>
              {form.photos.map((src,i)=>(
                <div key={i} style={{width:90,height:90,borderRadius:12,overflow:"hidden",position:"relative"}}>
                  <img src={src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  <button onClick={()=>upd({photos:form.photos.filter((_,j)=>j!==i)})} style={{position:"absolute",top:4,right:4,background:"rgba(0,0,0,0.6)",border:"none",borderRadius:"50%",width:20,height:20,cursor:"pointer",color:"#fff",fontSize:11}}>✕</button>
                </div>
              ))}
              <label style={{width:90,height:90,borderRadius:12,border:`2px dashed ${th.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,cursor:"pointer",background:th.card2}}>
                <span style={{fontSize:24}}>📷</span>
                <span style={{fontSize:10,color:th.sub}}>{tx.addPhoto}</span>
                <input type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>{Array.from(e.target.files||[]).forEach(f=>{const r=new FileReader();r.onload=ev=>upd({photos:[...form.photos,ev.target.result]});r.readAsDataURL(f);});}}/>
              </label>
            </div>
            <Btn onClick={()=>onCreate({...form,id:"biz-"+Date.now(),views:0,subscriberBase:0,reviews:[],products:[],verified:false,color:getCatColor(form.category),type:"sell"})}>{tx.submitBiz}</Btn>
          </div>
        )}
      </div>
    </FullPage>
  );
}

// =====================================================
// ADD PRODUCT FORM
// =====================================================
function AddProductForm({ store, lang, dark, onCancel, onSubmit }) {
  const th = theme(dark);
  const tx = T[lang];
  const [cat, setCat] = useState("");
  const [form, setForm] = useState({name:"",description:"",originalPrice:"",discountPercent:0,discountExpiry:"",photos:[],params:[],delivery:false,deliveryPrice:""});
  const upd = patch => setForm(p=>({...p,...patch}));
  const inp = {width:"100%",padding:"13px 15px",borderRadius:12,border:`1.5px solid ${th.border}`,background:th.card2,fontSize:14,outline:"none",boxSizing:"border-box",color:th.text,marginBottom:12};

  if (!cat) return (
    <FullPage dark={dark}>
      <div style={{background:"linear-gradient(135deg,#16A34A,#0D6B28)",padding:"50px 16px 16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={onCancel} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,width:34,height:34,color:"#fff",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div><div style={{fontSize:16,fontWeight:800,color:"#fff"}}>{lang==="uz"?"Mahsulot qo'shish":"Добавить товар"}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.8)"}}>{store.name}</div></div>
        </div>
      </div>
      <div style={{padding:16,overflowY:"auto",maxHeight:"calc(100vh - 100px)",paddingBottom:30}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {CATS.map(c=>(
            <button key={c.id} onClick={()=>setCat(c.id)} style={{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:8,padding:"16px 14px",borderRadius:14,cursor:"pointer",textAlign:"left",border:`2px solid ${th.border}`,background:th.card}}>
              <span style={{fontSize:26}}>{c.emoji}</span>
              <span style={{fontSize:13,fontWeight:700,color:th.text}}>{CAT_LABELS[lang]?.[c.id]||c.id}</span>
            </button>
          ))}
        </div>
      </div>
    </FullPage>
  );

  return (
    <FullPage dark={dark}>
      <div style={{background:"linear-gradient(135deg,#16A34A,#0D6B28)",padding:"50px 16px 16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>setCat("")} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,width:34,height:34,color:"#fff",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div><div style={{fontSize:16,fontWeight:800,color:"#fff"}}>{getCatEmoji(cat)} {CAT_LABELS[lang]?.[cat]||cat}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.8)"}}>{store.name}</div></div>
        </div>
      </div>
      <div style={{padding:16,overflowY:"auto",maxHeight:"calc(100vh - 110px)",paddingBottom:30}}>
        <label style={{fontSize:13,color:th.sub,marginBottom:6,fontWeight:600,display:"block"}}>{tx.productName} <span style={{color:"#16A34A"}}>*</span></label>
        <input placeholder={tx.productNamePh} value={form.name} onChange={e=>upd({name:e.target.value})} style={inp}/>
        <label style={{fontSize:13,color:th.sub,marginBottom:6,fontWeight:600,display:"block"}}>{tx.productDesc}</label>
        <textarea placeholder={tx.productDescPh} value={form.description} onChange={e=>upd({description:e.target.value})} style={{...inp,minHeight:70,resize:"vertical",fontFamily:"inherit"}}/>
        <label style={{fontSize:13,color:th.sub,marginBottom:6,fontWeight:600,display:"block"}}>{tx.price}</label>
        <input type="number" placeholder="0" value={form.originalPrice} onChange={e=>upd({originalPrice:e.target.value})} style={inp}/>
        <label style={{fontSize:13,color:th.sub,marginBottom:8,fontWeight:600,display:"block"}}>Parametrlar</label>
        {form.params.map((p,i)=>(
          <div key={i} style={{display:"flex",gap:8,marginBottom:8}}>
            <input placeholder={tx.paramName} value={p.name} onChange={e=>{const ps=[...form.params];ps[i]={...ps[i],name:e.target.value};upd({params:ps});}} style={{...inp,marginBottom:0,flex:1}}/>
            <input placeholder={tx.paramValue} value={p.value} onChange={e=>{const ps=[...form.params];ps[i]={...ps[i],value:e.target.value};upd({params:ps});}} style={{...inp,marginBottom:0,flex:1}}/>
            <button onClick={()=>upd({params:form.params.filter((_,j)=>j!==i)})} style={{background:"#FF6B6B20",border:"none",borderRadius:10,padding:"0 12px",color:"#FF6B6B",cursor:"pointer",fontSize:16}}>✕</button>
          </div>
        ))}
        <button onClick={()=>upd({params:[...form.params,{name:"",value:""}]})} style={{background:"none",border:`1.5px dashed ${th.border}`,borderRadius:10,padding:"8px 16px",color:th.sub,cursor:"pointer",fontSize:13,fontWeight:600,marginBottom:14,width:"100%"}}>{tx.addParam}</button>
        <label style={{fontSize:13,color:th.sub,marginBottom:6,fontWeight:600,display:"block"}}>{tx.discountPct}</label>
        <input type="number" min="0" max="99" placeholder="0" value={form.discountPercent||""} onChange={e=>upd({discountPercent:Number(e.target.value)||0})} style={inp}/>
        {form.discountPercent>0 && <>
          <label style={{fontSize:13,color:th.sub,marginBottom:6,fontWeight:600,display:"block"}}>{tx.discountExpiry}</label>
          <input type="date" value={form.discountExpiry} min={new Date().toISOString().slice(0,10)} onChange={e=>upd({discountExpiry:e.target.value})} style={inp}/>
        </>}
        <label style={{fontSize:13,color:th.sub,marginBottom:8,fontWeight:600,display:"block"}}>{tx.photos}</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
          {form.photos.map((src,i)=>(
            <div key={i} style={{width:80,height:80,borderRadius:10,overflow:"hidden",position:"relative"}}>
              <img src={src} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              <button onClick={()=>upd({photos:form.photos.filter((_,j)=>j!==i)})} style={{position:"absolute",top:3,right:3,background:"rgba(0,0,0,0.6)",border:"none",borderRadius:"50%",width:18,height:18,cursor:"pointer",color:"#fff",fontSize:10}}>✕</button>
            </div>
          ))}
          <label style={{width:80,height:80,borderRadius:10,border:`2px dashed ${th.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,cursor:"pointer",background:th.card2}}>
            <span style={{fontSize:20}}>📷</span>
            <span style={{fontSize:9,color:th.sub}}>{tx.addPhoto}</span>
            <input type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>{Array.from(e.target.files||[]).forEach(f=>{const r=new FileReader();r.onload=ev=>upd({photos:[...form.photos,ev.target.result]});r.readAsDataURL(f);});}}/>
          </label>
        </div>
        <Btn onClick={()=>{
          if (!form.name) return;
          onSubmit({id:"prod-"+Date.now(),category:cat,active:true,name:{uz:form.name,ru:form.name},description:{uz:form.description,ru:form.description},params:form.params.filter(p=>p.name&&p.value),originalPrice:parseFloat(form.originalPrice)||0,photos:form.photos,delivery:form.delivery,deliveryPrice:parseFloat(form.deliveryPrice)||0,discount:(form.discountPercent>0&&form.discountExpiry)?{percent:form.discountPercent,expiryDate:form.discountExpiry}:null,reviews:[]});
        }} disabled={!form.name}>{tx.submitProduct}</Btn>
      </div>
    </FullPage>
  );
}


// =====================================================
// HOME TAB
// =====================================================
function HomeTab({ lang, dark, stores, activeDeals, savedKeys, onToggleSave, onBizClick, onDealClick, searchVal, onSetSearch, setLang }) {
  const th = theme(dark);
  const tx = T[lang];
  const [cat, setCat] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [selDeal, setSelDeal] = useState(null);

  const filteredStores = cat==="all" ? stores : stores.filter(s=>s.products.some(p=>p.category===cat));
  const filteredDeals = activeDeals.filter(d=>cat==="all"||d.category===cat).sort((a,b)=>{
    if(sortBy==="discount") return b.discount-a.discount;
    if(sortBy==="rating") return avgRating(stores.find(s=>s.id===b.storeId)?.reviews||[])-avgRating(stores.find(s=>s.id===a.storeId)?.reviews||[]);
    return 0;
  });

  const nearby = [...filteredStores].sort(()=>0.5-Math.random()).slice(0,5);
  const topRated = [...stores].filter(s=>s.reviews.length>0).sort((a,b)=>avgRating(b.reviews)-avgRating(a.reviews)).slice(0,4);
  const newBiz = [...stores].slice(-4).reverse();

  return (
    <div style={{background:th.bg,minHeight:"100vh",paddingBottom:90}}>
      {/* Sticky header */}
      <div style={{background:th.card,borderBottom:`1px solid ${th.border}`,padding:"50px 16px 0",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:28,height:28,borderRadius:9,background:"linear-gradient(135deg,#16A34A,#0D6B28)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{color:"#fff",fontWeight:900,fontSize:15}}>O</span>
            </div>
            <span style={{fontSize:15,fontWeight:800}}><span style={{color:th.text}}>Oson</span><span style={{color:"#16A34A"}}>Top</span></span>
          </div>
          <div style={{background:th.card2,borderRadius:14,padding:2,display:"flex",gap:2}}>
            {["uz","ru"].map(l=>(
              <button key={l} onClick={()=>setLang(l)} style={{padding:"3px 8px",borderRadius:11,border:"none",background:lang===l?"#16A34A":"transparent",color:lang===l?"#fff":th.sub,fontWeight:700,fontSize:10,cursor:"pointer"}}>{l.toUpperCase()}</button>
            ))}
          </div>
        </div>
        {/* Search */}
        <div style={{position:"relative",marginBottom:10}}>
          <svg style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={th.sub} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input placeholder={tx.search} value={searchVal} onChange={e=>onSetSearch(e.target.value)}
            style={{width:"100%",padding:"11px 14px 11px 34px",borderRadius:12,border:"none",background:th.card2,fontSize:14,outline:"none",boxSizing:"border-box",color:th.text}}/>
          {searchVal && <button onClick={()=>onSetSearch("")} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:th.sub,fontSize:16}}>✕</button>}
        </div>
        {/* Category chips */}
        <div style={{display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none",paddingBottom:10}}>
          {[{id:"all",uz:"Hammasi",ru:"Все"},...CATS.map(c=>({id:c.id,uz:CAT_LABELS.uz[c.id]||c.id,ru:CAT_LABELS.ru[c.id]||c.id}))].map(c=>{
            const active=cat===c.id;
            return (
              <button key={c.id} onClick={()=>setCat(c.id)} style={{flexShrink:0,padding:"6px 14px",borderRadius:20,border:`1.5px solid ${active?"#16A34A":th.border}`,background:active?"#16A34A":th.card2,color:active?"#fff":th.sub,fontWeight:600,fontSize:12,cursor:"pointer",whiteSpace:"nowrap"}}>
                {lang==="uz"?c.uz:c.ru}
              </button>
            );
          })}
        </div>
      </div>

      {/* GPS Location */}
      <div style={{padding:"10px 16px 0"}}>
        <div style={{background:th.card,borderRadius:12,padding:"10px 14px",border:`1px solid ${th.border}`,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:18}}>📍</span>
          <div>
            <div style={{fontSize:11,color:th.sub}}>{lang==="uz"?"Joylashuvingiz":"Ваше местоположение"}</div>
            <div style={{fontSize:14,fontWeight:700,color:th.text}} id="loc-display">{lang==="uz"?"Toshkent":"Ташкент"}</div>
          </div>
          <div style={{marginLeft:"auto",fontSize:10,color:"#16A34A",fontWeight:700}}>● GPS</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{padding:"14px 16px 0"}}>
        <h3 style={{fontSize:14,fontWeight:800,color:th.text,margin:"0 0 10px"}}>{lang==="uz"?"Tez amallar":"Быстрые действия"}</h3>
        <div style={{display:"flex",gap:8,overflowX:"auto",scrollbarWidth:"none"}}>
          {QUICK_ACTIONS.map(qa=>(
            <button key={qa.id} onClick={()=>setCat(qa.id)} style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"12px 16px",borderRadius:14,background:cat===qa.id?"#16A34A":th.card,border:`1.5px solid ${cat===qa.id?"#16A34A":th.border}`,cursor:"pointer",minWidth:62}}>
              <span style={{fontSize:24}}>{qa.emoji}</span>
              <span style={{fontSize:10,fontWeight:700,color:cat===qa.id?"#fff":th.sub,whiteSpace:"nowrap"}}>{CAT_LABELS[lang]?.[qa.id]||qa.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <div style={{padding:"14px 16px 0"}}>
        <h3 style={{fontSize:14,fontWeight:800,color:th.text,margin:"0 0 10px"}}>{tx.categories}</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
          {CATS.map(c=>{
            const active=cat===c.id;
            return (
              <button key={c.id} onClick={()=>setCat(c.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"12px 4px 10px",borderRadius:12,cursor:"pointer",background:active?c.color+"20":th.card,border:`1.5px solid ${active?c.color:th.border}`}}>
                <div style={{width:38,height:38,borderRadius:11,background:c.color+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{c.emoji}</div>
                <span style={{fontSize:9,fontWeight:600,color:active?c.color:th.sub,textAlign:"center",lineHeight:1.2}}>{CAT_LABELS[lang]?.[c.id]||c.id}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nearby */}
      <div style={{height:8,background:th.card2,margin:"14px 0 0"}}/>
      <div style={{padding:"14px 16px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <h3 style={{fontSize:15,fontWeight:800,color:th.text,margin:0}}>📍 {tx.nearby}</h3>
          <span style={{fontSize:12,color:"#16A34A",fontWeight:700,cursor:"pointer"}}>{tx.seeAll}</span>
        </div>
        {nearby.map(s=><BizCard key={s.id} store={s} lang={lang} dark={dark} onClick={()=>onBizClick(s.id)}/>)}
      </div>

      {/* Top Rated */}
      {topRated.length>0 && (
        <>
          <div style={{height:8,background:th.card2,margin:"14px 0 0"}}/>
          <div style={{padding:"14px 16px 0"}}>
            <h3 style={{fontSize:15,fontWeight:800,color:th.text,margin:"0 0 10px"}}>⭐ {tx.topRated}</h3>
            {topRated.map(s=><BizCard key={s.id} store={s} lang={lang} dark={dark} onClick={()=>onBizClick(s.id)}/>)}
          </div>
        </>
      )}

      {/* New */}
      <div style={{height:8,background:th.card2,margin:"14px 0 0"}}/>
      <div style={{padding:"14px 16px 0"}}>
        <h3 style={{fontSize:15,fontWeight:800,color:th.text,margin:"0 0 10px"}}>🆕 {tx.newBiz}</h3>
        {newBiz.map(s=><BizCard key={s.id} store={s} lang={lang} dark={dark} onClick={()=>onBizClick(s.id)}/>)}
      </div>

      {/* Deals */}
      {filteredDeals.length>0 && (
        <>
          <div style={{height:8,background:th.card2,margin:"14px 0 0"}}/>
          <div style={{padding:"14px 16px 0"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <h3 style={{fontSize:15,fontWeight:800,color:th.text,margin:0}}>🏷️ {tx.offers} <span style={{fontSize:12,color:th.sub,fontWeight:400}}>({filteredDeals.length})</span></h3>
              <div style={{display:"flex",gap:5}}>
                {[["default",tx.sortDefault],["discount",tx.sortDiscount],["rating",tx.sortRating]].map(([v,l])=>(
                  <button key={v} onClick={()=>setSortBy(v)} style={{padding:"4px 9px",borderRadius:20,border:"none",background:sortBy===v?"#16A34A":th.card2,color:sortBy===v?"#fff":th.sub,fontSize:10,fontWeight:600,cursor:"pointer"}}>{l}</button>
                ))}
              </div>
            </div>
            {filteredDeals.map(deal=>(
              <DealRow key={deal.key} deal={deal} lang={lang} dark={dark}
                saved={savedKeys.includes(deal.key)}
                onSave={()=>onToggleSave(deal.key)}
                onClick={()=>setSelDeal(deal)}/>
            ))}
          </div>
        </>
      )}

      {selDeal && (
        <DealDetailSheet deal={selDeal} lang={lang} dark={dark}
          saved={savedKeys.includes(selDeal.key)}
          onClose={()=>setSelDeal(null)}
          onSave={()=>onToggleSave(selDeal.key)}
          onChat={()=>{ onDealClick(selDeal,"chat"); setSelDeal(null); }}/>
      )}
    </div>
  );
}


// =====================================================
// SAVED TAB
// =====================================================
function SavedTab({ lang, dark, savedDeals, onDealClick, onToggleSave }) {
  const th = theme(dark);
  const tx = T[lang];
  return (
    <div style={{background:th.bg,minHeight:"100vh",paddingBottom:90}}>
      <div style={{background:th.card,borderBottom:`1px solid ${th.border}`,padding:"50px 16px 14px"}}>
        <h2 style={{margin:0,fontSize:20,fontWeight:800,color:th.text}}>{tx.saved}</h2>
      </div>
      <div style={{padding:16}}>
        {savedDeals.length===0 ? (
          <div style={{textAlign:"center",padding:"60px 0",color:th.sub}}>
            <div style={{fontSize:56,marginBottom:12}}>🤍</div>
            <div style={{fontWeight:600,fontSize:16,color:th.text}}>{tx.nothingSaved}</div>
            <div style={{fontSize:13,marginTop:6}}>❤️ {lang==="uz"?"bosib saqlab qo'ying":"нажмите чтобы сохранить"}</div>
          </div>
        ) : savedDeals.map(deal=>(
          <div key={deal.key} onClick={()=>onDealClick(deal)} style={{background:th.card,borderRadius:14,padding:"12px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12,cursor:"pointer",border:`1px solid ${th.border}`}}>
            <div style={{width:54,height:54,borderRadius:12,overflow:"hidden",flexShrink:0,background:deal.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>
              {deal.photos?.length?<img src={deal.photos[0]} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:deal.logo}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:700,fontSize:14,color:th.text}}>{deal.storeName}</div>
              <div style={{fontSize:12,color:th.sub,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{deal.title?.[lang]||deal.title?.uz}</div>
              <div style={{fontSize:11,color:"#16A34A",fontWeight:700,marginTop:2}}>⏰ {daysLeft(deal.expiryDate,lang)}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{background:deal.color,color:"#fff",borderRadius:9,padding:"4px 10px",fontWeight:800,fontSize:14,marginBottom:4}}>-{deal.discount}%</div>
              <button onClick={e=>{e.stopPropagation();onToggleSave(deal.key);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:16}}>❤️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================================
// ADD SHEET
// =====================================================
function AddSheet({ lang, dark, onClose, onCreateBiz, onAddProduct }) {
  const th = theme(dark);
  return (
    <Sheet onClose={onClose} dark={dark} maxH="32vh">
      <h3 style={{fontWeight:800,fontSize:16,color:th.text,textAlign:"center",marginBottom:18}}>{lang==="uz"?"Nima qo'shmoqchisiz?":"Что хотите добавить?"}</h3>
      {[
        {icon:"🏪",label:lang==="uz"?"Biznes yaratish":"Создать бизнес",desc:lang==="uz"?"Biznesingizni ro'yxatga oling":"Зарегистрируйте бизнес",action:()=>{onClose();onCreateBiz();}},
        {icon:"📦",label:lang==="uz"?"Mahsulot / Xizmat qo'shish":"Добавить товар / услугу",desc:lang==="uz"?"Do'koningizga qo'shing":"Добавьте в свой магазин",action:()=>{onClose();onAddProduct();}},
      ].map((item,i)=>(
        <div key={i} onClick={item.action} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 12px",background:th.card2,borderRadius:12,marginBottom:10,cursor:"pointer",border:`1px solid ${th.border}`}}>
          <span style={{fontSize:28}}>{item.icon}</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:14,color:th.text}}>{item.label}</div>
            <div style={{fontSize:12,color:th.sub,marginTop:2}}>{item.desc}</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={th.sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      ))}
    </Sheet>
  );
}

// =====================================================
// PROFILE TAB
// =====================================================
function ProfileTab({ lang, dark, setLang, toggleDark, isGuest, userData, setUserData, myStore, stores, subscriptions, onToggleSub, chatMessages, bookings, onViewBiz, onCreateBiz, onAddProduct, onLogout, profileView, onSetProfileView }) {
  const th = theme(dark);
  const tx = T[lang];
  const [showEdit, setShowEdit] = useState(false);

  if (profileView==="settings") return (
    <div style={{background:th.bg,minHeight:"100vh",paddingBottom:90}}>
      <BackHeader onBack={()=>onSetProfileView("main")} title={"⚙️ "+tx.settings} dark={dark}/>
      <div style={{padding:16}}>
        <div style={{background:th.card,borderRadius:16,overflow:"hidden",marginBottom:12,border:`1px solid ${th.border}`}}>
          <div style={{padding:"10px 16px",fontSize:11,fontWeight:700,color:th.sub,borderBottom:`1px solid ${th.border}`}}>{lang==="uz"?"KO'RINISH":"ВНЕШНИЙ ВИД"}</div>
          <div style={{padding:"16px",display:"flex",alignItems:"center",gap:14}}>
            <span style={{fontSize:22}}>{dark?"☀️":"🌙"}</span>
            <span style={{flex:1,fontWeight:600,fontSize:14,color:th.text}}>{tx.darkMode}</span>
            <Toggle value={dark} onChange={toggleDark}/>
          </div>
        </div>
        <div style={{background:th.card,borderRadius:16,overflow:"hidden",marginBottom:12,border:`1px solid ${th.border}`}}>
          <div style={{padding:"10px 16px",fontSize:11,fontWeight:700,color:th.sub,borderBottom:`1px solid ${th.border}`}}>{lang==="uz"?"TIL":"ЯЗЫК"}</div>
          <div style={{padding:"12px 16px",display:"flex",gap:10}}>
            {[["uz","🇺🇿 O'zbekcha"],["ru","🇷🇺 Русский"]].map(([l,label])=>(
              <button key={l} onClick={()=>setLang(l)} style={{flex:1,padding:"12px 8px",borderRadius:12,cursor:"pointer",border:lang===l?"2px solid #16A34A":`2px solid ${th.border}`,background:lang===l?"#F0FDF4":th.card,color:lang===l?"#16A34A":th.text,fontWeight:700,fontSize:13}}>{label}</button>
            ))}
          </div>
        </div>
        <div style={{background:th.card,borderRadius:16,overflow:"hidden",marginBottom:16,border:`1px solid ${th.border}`}}>
          <div style={{padding:"10px 16px",fontSize:11,fontWeight:700,color:th.sub,borderBottom:`1px solid ${th.border}`}}>OSONTOP</div>
          {[["OsonTop v1.1","Versiya"],["OsonTop Team","Jamoa"],["@osontop_uz","Telegram"]].map(([v,l],i)=>(
            <div key={i} style={{padding:"13px 16px",display:"flex",justifyContent:"space-between",borderBottom:i<2?`1px solid ${th.border}`:"none"}}>
              <span style={{fontSize:13,color:th.text}}>{l}</span>
              <span style={{fontSize:13,color:th.sub,fontWeight:600}}>{v}</span>
            </div>
          ))}
        </div>
        <Btn ghost onClick={onLogout}>{tx.logout}</Btn>
      </div>
    </div>
  );

  if (profileView==="myChats") return (
    <div style={{background:th.bg,minHeight:"100vh",paddingBottom:90}}>
      <BackHeader onBack={()=>onSetProfileView("main")} title={"💬 "+tx.myChats} dark={dark}/>
      <div style={{padding:16}}>
        {Object.keys(chatMessages).length===0 ? (
          <div style={{textAlign:"center",padding:"60px 0",color:th.sub}}><div style={{fontSize:52,marginBottom:10}}>💬</div><div style={{fontWeight:600,fontSize:16}}>{tx.noChats}</div></div>
        ) : Object.entries(chatMessages).map(([sid,msgs])=>{
          const st=stores.find(s=>s.id===sid); if(!st||!msgs.length) return null;
          const last=msgs[msgs.length-1];
          return (
            <div key={sid} onClick={()=>onViewBiz(sid,"chat")} style={{background:th.card,borderRadius:14,padding:"13px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12,cursor:"pointer",border:`1px solid ${th.border}`}}>
              <div style={{width:46,height:46,borderRadius:13,background:st.color+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{st.logo}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:14,color:th.text}}>{st.name}</div>
                <div style={{fontSize:12,color:th.sub,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{last.from==="user"?(lang==="uz"?"Siz: ":"Вы: "):""}{last.text}</div>
              </div>
              <div style={{fontSize:10,color:th.sub}}>{new Date(last.time).toLocaleTimeString("uz",{hour:"2-digit",minute:"2-digit"})}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (profileView==="bookings") return (
    <div style={{background:th.bg,minHeight:"100vh",paddingBottom:90}}>
      <BackHeader onBack={()=>onSetProfileView("main")} title={"📅 "+tx.myBookings} dark={dark}/>
      <div style={{padding:16}}>
        {bookings.length===0 ? (
          <div style={{textAlign:"center",padding:"60px 0",color:th.sub}}><div style={{fontSize:52,marginBottom:10}}>📅</div><div style={{fontWeight:600,fontSize:16}}>{tx.noBookings}</div></div>
        ) : bookings.map((b,i)=>(
          <div key={i} style={{background:th.card,borderRadius:14,padding:14,marginBottom:10,border:`1px solid ${th.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
              <div style={{width:42,height:42,borderRadius:12,background:(b.storeColor||"#16A34A")+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{b.storeLogo||"🏪"}</div>
              <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14,color:th.text}}>{b.storeName}</div><div style={{fontSize:11,color:th.sub}}>#{b.id}</div></div>
              <span style={{background:b.status==="confirmed"?"#00B89420":"#FFB40020",color:b.status==="confirmed"?"#00B894":"#FFB400",borderRadius:8,padding:"3px 10px",fontSize:11,fontWeight:700}}>{b.status==="confirmed"?tx.bookConfirmed:tx.bookPending}</span>
            </div>
            <div style={{display:"flex",gap:10}}>
              <div style={{flex:1,background:th.card2,borderRadius:10,padding:"9px 12px"}}><div style={{fontSize:11,color:th.sub}}>{tx.chooseDate}</div><div style={{fontWeight:700,fontSize:13,color:th.text}}>{b.date}</div></div>
              <div style={{flex:1,background:th.card2,borderRadius:10,padding:"9px 12px"}}><div style={{fontSize:11,color:th.sub}}>{tx.chooseTime}</div><div style={{fontWeight:700,fontSize:13,color:th.text}}>{b.time}</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (profileView==="subscribed") return (
    <div style={{background:th.bg,minHeight:"100vh",paddingBottom:90}}>
      <BackHeader onBack={()=>onSetProfileView("main")} title={"🔔 "+tx.subscribedStores} dark={dark}/>
      <div style={{padding:16}}>
        {subscriptions.length===0 ? (
          <div style={{textAlign:"center",padding:"60px 0",color:th.sub}}><div style={{fontSize:52,marginBottom:10}}>🔔</div><div style={{fontWeight:600,fontSize:16}}>{tx.noSubscribed}</div></div>
        ) : subscriptions.map(sid=>{
          const st=stores.find(s=>s.id===sid); if(!st) return null;
          return (
            <div key={sid} onClick={()=>onViewBiz(sid)} style={{background:th.card,borderRadius:14,padding:"13px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:12,cursor:"pointer",border:`1px solid ${th.border}`}}>
              <div style={{width:44,height:44,borderRadius:12,background:st.color+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{st.logo}</div>
              <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14,color:th.text}}>{st.name}</div><div style={{fontSize:12,color:th.sub}}>📍 {st.address}</div></div>
              <button onClick={e=>{e.stopPropagation();onToggleSub(sid);}} style={{background:"#FF6B6B20",border:"none",borderRadius:10,padding:"6px 10px",color:"#FF6B6B",fontSize:12,fontWeight:700,cursor:"pointer"}}>✕</button>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{background:th.bg,minHeight:"100vh",paddingBottom:90}}>
      <div style={{background:"linear-gradient(135deg,#16A34A,#0D6B28)",padding:"50px 16px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:60,height:60,borderRadius:30,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,border:"2px solid rgba(255,255,255,0.4)",cursor:"pointer"}} onClick={()=>!isGuest&&setShowEdit(true)}>
              {isGuest?"👁️":"👤"}
            </div>
            <div>
              <div style={{fontSize:16,fontWeight:800,color:"#fff"}}>{isGuest?(lang==="uz"?"Mehmon":"Гость"):userData.name||lang==="uz"?"Foydalanuvchi":"Пользователь"}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.8)"}}>{userData.phone||""}</div>
            </div>
          </div>
        </div>
        {!isGuest && <button onClick={()=>setShowEdit(true)} style={{background:"rgba(255,255,255,0.15)",border:"1.5px solid rgba(255,255,255,0.4)",borderRadius:12,padding:"8px 18px",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>✏️ {tx.editProfile}</button>}
      </div>
      <div style={{padding:16}}>
        {[
          {icon:"💬",label:tx.myChats,count:Object.keys(chatMessages).length,view:"myChats"},
          {icon:"📅",label:tx.myBookings,count:bookings.filter(b=>b.status==="pending").length,view:"bookings"},
          {icon:"🔔",label:tx.subscribedStores,count:subscriptions.length,view:"subscribed"},
          {icon:"⚙️",label:tx.settings,count:0,view:"settings"},
        ].map((item,i)=>(
          <div key={i} onClick={()=>onSetProfileView(item.view)} style={{background:th.card,borderRadius:14,padding:"14px 16px",marginBottom:8,display:"flex",alignItems:"center",gap:12,cursor:"pointer",border:`1px solid ${th.border}`}}>
            <span style={{fontSize:22}}>{item.icon}</span>
            <span style={{flex:1,fontWeight:600,fontSize:14,color:th.text}}>{item.label}</span>
            {item.count>0 && <span style={{background:"#16A34A",color:"#fff",borderRadius:8,padding:"2px 8px",fontSize:12,fontWeight:700}}>{item.count}</span>}
            <span style={{color:th.sub2}}>›</span>
          </div>
        ))}

        {/* 🏪 DO'KONIM — pastda joylashgan */}
        <div style={{height:1,background:th.border,margin:"8px 0 14px"}}/>
        <div style={{fontSize:11,fontWeight:700,color:th.sub,marginBottom:8,paddingLeft:2}}>
          {lang==="uz"?"🏪 DO'KONIM":"🏪 МОЙ МАГАЗИН"}
        </div>
        <button onClick={()=>myStore?onViewBiz(myStore.id):onCreateBiz()} style={{width:"100%",display:"flex",alignItems:"center",gap:12,textAlign:"left",background:th.card,border:`1px solid ${th.border}`,borderRadius:16,padding:"14px 16px",marginBottom:10,cursor:"pointer"}}>
          <div style={{width:44,height:44,borderRadius:13,background:myStore?(myStore.color+"20"):"#16A34A20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
            {myStore?myStore.logo:"🏪"}
          </div>
          <span style={{flex:1}}>
            <span style={{display:"block",fontWeight:700,fontSize:14,color:th.text}}>{myStore?myStore.name:tx.myStore}</span>
            <span style={{display:"block",fontSize:11,color:th.sub,marginTop:2}}>{myStore?`${myStore.products.length} ${tx.products.toLowerCase()}`:tx.createBizSub}</span>
          </span>
          <span style={{color:myStore?"#16A34A":th.sub2,fontSize:18}}>›</span>
        </button>

        <div style={{marginTop:6}}><Btn ghost onClick={onLogout}>{tx.logout}</Btn></div>
      </div>

      {showEdit && (
        <Sheet onClose={()=>setShowEdit(false)} dark={dark} maxH="60vh">
          <h3 style={{fontSize:16,fontWeight:800,color:th.text,marginBottom:16,textAlign:"center"}}>{tx.editProfile}</h3>
          {[{label:tx.enterName,key:"name",ph:lang==="uz"?"Ismingiz":"Ваше имя"},{label:"Familiya",key:"surname",ph:""},{label:tx.enterPhone,key:"phone",ph:"+998 90 ..."}].map((f,i)=>(
            <div key={i}>
              <label style={{fontSize:13,color:th.sub,marginBottom:6,fontWeight:600,display:"block"}}>{f.label}</label>
              <input placeholder={f.ph} value={userData[f.key]||""} onChange={e=>setUserData(p=>({...p,[f.key]:e.target.value}))} style={{width:"100%",padding:"12px 14px",borderRadius:12,border:`1.5px solid ${th.border}`,background:th.card2,color:th.text,fontSize:14,outline:"none",boxSizing:"border-box",marginBottom:12}}/>
            </div>
          ))}
          <Btn onClick={()=>setShowEdit(false)}>{tx.save}</Btn>
          <div style={{marginTop:10}}><Btn ghost onClick={()=>setShowEdit(false)}>{tx.cancel}</Btn></div>
        </Sheet>
      )}
    </div>
  );
}


// =====================================================
// MAIN APP
// =====================================================
export default function App() {
  const [dark, toggleDark] = useDark();
  const saved0 = loadLS();

  const [onboarded, setOnboarded] = useState(saved0?.onboarded ?? false);
  const [isGuest, setIsGuest] = useState(false);
  const [lang, setLang] = useState(saved0?.lang ?? "uz");
  const [userData, setUserData] = useState(saved0?.userData ?? {name:"",surname:"",phone:"",photo:""});
  const [stores, setStores] = useState(()=>saved0?.stores || DEMO_STORES);
  const [myStoreId, setMyStoreId] = useState(saved0?.myStoreId ?? null);
  const [savedKeys, setSavedKeys] = useState(saved0?.savedKeys ?? []);
  const [subscriptions, setSubscriptions] = useState(saved0?.subs ?? []);
  const [bookings, setBookings] = useState(saved0?.bookings ?? []);
  const [chatMessages, setChatMessages] = useState(saved0?.chatMessages ?? {});
  const [activeTab, setActiveTab] = useState("home");
  const [profileView, setProfileView] = useState("main");
  const [viewBizId, setViewBizId] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showCreateBiz, setShowCreateBiz] = useState(false);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [chatStore, setChatStore] = useState(null);
  const [bookStore, setBookStore] = useState(null);
  const [searchVal, setSearchVal] = useState("");

  const th = theme(dark);

  useEffect(()=>{ saveLS({onboarded,lang,userData,stores,myStoreId,savedKeys,subs:subscriptions,bookings,chatMessages}); },[onboarded,lang,userData,stores,myStoreId,savedKeys,subscriptions,bookings,chatMessages]);

  // GPS location
  useEffect(()=>{
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos=>{
      const r = detectRegion(pos.coords.latitude, pos.coords.longitude);
      const el = document.getElementById("loc-display");
      if (el) el.textContent = lang==="ru" ? r.ru : r.uz;
    },()=>{});
  },[lang]);

  // Expire cleanup
  useEffect(()=>{
    const timer = setInterval(()=>{ setStores(prev=>prev.map(st=>({...st,products:st.products.map(p=>p.discount&&isExpired(p.discount.expiryDate)?{...p,discount:null}:p)}))); },60000);
    return ()=>clearInterval(timer);
  },[]);

  // Active deals
  const activeDeals = [];
  stores.forEach(st=>st.products.forEach(p=>{
    if (p.active!==false && p.discount && !isExpired(p.discount.expiryDate)) {
      activeDeals.push({key:`${st.id}:${p.id}`,storeId:st.id,productId:p.id,storeName:st.name,storeAddress:st.address,storePhone:st.phone,category:p.category,title:p.name,description:p.description,params:p.params,originalPrice:p.originalPrice,discount:p.discount.percent,expiryDate:p.discount.expiryDate,photos:p.photos,logo:st.logo,color:st.color,lat:st.lat,lng:st.lng,reviews:p.reviews||[],delivery:p.delivery,deliveryPrice:p.deliveryPrice,verified:st.verified});
    }
  }));

  const myStore = myStoreId ? stores.find(s=>s.id===myStoreId) : null;
  const viewStore = viewBizId ? stores.find(s=>s.id===viewBizId) : null;
  const savedDeals = activeDeals.filter(d=>savedKeys.includes(d.key));

  const toggleSave = key => setSavedKeys(p=>p.includes(key)?p.filter(x=>x!==key):[...p,key]);
  const toggleSub = sid => setSubscriptions(p=>p.includes(sid)?p.filter(x=>x!==sid):[...p,sid]);

  const createBiz = bizData => { setStores(p=>[...p,bizData]); setMyStoreId(bizData.id); setShowCreateBiz(false); setViewBizId(bizData.id); };
  const addProduct = (storeId,prod) => { setStores(p=>p.map(s=>s.id!==storeId?s:{...s,products:[prod,...s.products]})); setShowAddProduct(false); };
  const applyDiscount = (storeId,pid,disc) => setStores(p=>p.map(s=>s.id!==storeId?s:{...s,products:s.products.map(pr=>pr.id!==pid?pr:{...pr,discount:disc})}));
  const removeDiscount = (storeId,pid) => setStores(p=>p.map(s=>s.id!==storeId?s:{...s,products:s.products.map(pr=>pr.id!==pid?pr:{...pr,discount:null})}));
  const deleteProduct = (storeId,pid) => setStores(p=>p.map(s=>s.id!==storeId?s:{...s,products:s.products.filter(pr=>pr.id!==pid)}));
  const editProduct = (storeId,pid,upd) => setStores(p=>p.map(s=>s.id!==storeId?s:{...s,products:s.products.map(pr=>pr.id!==pid?pr:{...pr,...upd})}));
  const toggleActive = (storeId,pid,val) => setStores(p=>p.map(s=>s.id!==storeId?s:{...s,products:s.products.map(pr=>pr.id!==pid?pr:{...pr,active:val})}));
  const duplicateProd = (storeId,pid) => { const st=stores.find(s=>s.id===storeId); const pr=st?.products.find(p=>p.id===pid); if(!pr) return; setStores(p=>p.map(s=>s.id!==storeId?s:{...s,products:[{...pr,id:"prod-"+Date.now(),name:{uz:(pr.name?.uz||"")+" (nusxa)",ru:(pr.name?.ru||"")+" (копия)"},discount:null},...s.products]})); };
  const rateProduct = (storeId,pid,review) => { const author=userData.name||(lang==="uz"?"Mehmon":"Гость"); setStores(p=>p.map(s=>s.id!==storeId?s:{...s,products:s.products.map(pr=>pr.id!==pid?pr:{...pr,reviews:[...(pr.reviews||[]),{...review,author}]})})); };
  const rateStore = (storeId,review) => { const author=userData.name||(lang==="uz"?"Mehmon":"Гость"); setStores(p=>p.map(s=>s.id!==storeId?s:{...s,reviews:[...s.reviews,{...review,author}]})); };
  const sendChat = (storeId,msg) => setChatMessages(p=>({...p,[storeId]:[...(p[storeId]||[]),msg]}));
  const handleLogout = () => { setOnboarded(false); setIsGuest(false); setUserData({name:"",surname:"",phone:"",photo:""}); saveLS(null); };

  // Onboarding
  if (!onboarded && !isGuest) return (
    <div style={{maxWidth:430,margin:"0 auto",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <Onboarding lang={lang} setLang={setLang} dark={dark}
        onDone={({name,phone})=>{setUserData(p=>({...p,name,phone}));setOnboarded(true);}}
        onGuest={()=>{setIsGuest(true);setOnboarded(true);}}/>
    </div>
  );

  if (showCreateBiz) return (
    <div style={{maxWidth:430,margin:"0 auto",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <CreateBizWizard lang={lang} dark={dark} userData={userData} onCreate={createBiz} onCancel={()=>setShowCreateBiz(false)}/>
    </div>
  );

  if (showAddProduct && myStore) return (
    <div style={{maxWidth:430,margin:"0 auto",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <AddProductForm store={myStore} lang={lang} dark={dark} onCancel={()=>setShowAddProduct(false)} onSubmit={prod=>addProduct(myStore.id,prod)}/>
    </div>
  );

  if (viewStore) {
    const isOwner = viewStore.id === myStoreId;
    return (
      <div style={{maxWidth:430,margin:"0 auto",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
        <BizProfile store={viewStore} lang={lang} dark={dark}
          isOwner={isOwner} isSub={subscriptions.includes(viewStore.id)}
          bookings={bookings}
          onBack={()=>setViewBizId(null)}
          onToggleSub={()=>toggleSub(viewStore.id)}
          onAddProduct={()=>setShowAddProduct(true)}
          onApplyDiscount={(pid,d)=>applyDiscount(viewStore.id,pid,d)}
          onRemoveDiscount={pid=>removeDiscount(viewStore.id,pid)}
          onDeleteProduct={pid=>deleteProduct(viewStore.id,pid)}
          onEditProduct={(pid,u)=>editProduct(viewStore.id,pid,u)}
          onToggleActive={(pid,v)=>toggleActive(viewStore.id,pid,v)}
          onDuplicateProduct={pid=>duplicateProd(viewStore.id,pid)}
          onRateProduct={(pid,r)=>rateProduct(viewStore.id,pid,r)}
          onRateStore={r=>rateStore(viewStore.id,r)}
          onBook={()=>setBookStore(viewStore)}
          onChat={()=>setChatStore(viewStore)}/>
        {chatStore && <ChatModal store={chatStore} lang={lang} dark={dark} messages={chatMessages[chatStore.id]||[]} onClose={()=>setChatStore(null)} onSend={msg=>sendChat(chatStore.id,msg)}/>}
        {bookStore && <BookingModal store={bookStore} lang={lang} dark={dark} onClose={()=>setBookStore(null)} onSuccess={b=>{setBookings(p=>[b,...p]);setBookStore(null);}}/>}
      </div>
    );
  }

  const navItems = [
    {id:"home",label:T[lang].home,icon:(a)=><svg width="22" height="22" viewBox="0 0 24 24" fill={a?"#16A34A":"none"} stroke={a?"#16A34A":th.sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>},
    {id:"saved",label:lang==="uz"?"Saqlangan":"Сохр.",icon:(a)=><svg width="22" height="22" viewBox="0 0 24 24" fill={a?"#16A34A":"none"} stroke={a?"#16A34A":th.sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>},
    {id:"plus"},
    {id:"map",label:T[lang].map,icon:(a)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?"#16A34A":th.sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>},
    {id:"profile",label:T[lang].profile,icon:(a)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?"#16A34A":th.sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>},
  ];

  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:th.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",position:"relative"}}>
      <style>{`@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:none;opacity:1}} *{-webkit-tap-highlight-color:transparent}`}</style>

      {activeTab==="home" && <HomeTab lang={lang} dark={dark} setLang={setLang} stores={stores} activeDeals={activeDeals} savedKeys={savedKeys} onToggleSave={toggleSave} onBizClick={id=>setViewBizId(id)} onDealClick={(deal,action)=>{setViewBizId(deal.storeId);if(action==="chat")setTimeout(()=>{const st=stores.find(s=>s.id===deal.storeId);if(st)setChatStore(st);},200);}} searchVal={searchVal} onSetSearch={setSearchVal}/>}
      {activeTab==="saved" && <SavedTab lang={lang} dark={dark} savedDeals={savedDeals} onToggleSave={toggleSave} onDealClick={deal=>setViewBizId(deal.storeId)}/>}
      {activeTab==="map" && (
        <div style={{position:"relative", height:"calc(100vh - 80px)"}}>
          <MapView lang={lang} dark={dark} deals={activeDeals} stores={stores} onDealClick={deal=>setViewBizId(deal.storeId)}/>
        </div>
      )}
      {activeTab==="profile" && <ProfileTab lang={lang} dark={dark} setLang={setLang} toggleDark={toggleDark} isGuest={isGuest} userData={userData} setUserData={setUserData} myStore={myStore} stores={stores} subscriptions={subscriptions} onToggleSub={toggleSub} chatMessages={chatMessages} bookings={bookings} onViewBiz={(id,action)=>{setViewBizId(id);if(action==="chat")setTimeout(()=>{const st=stores.find(s=>s.id===id);if(st)setChatStore(st);},200);}} onCreateBiz={()=>setShowCreateBiz(true)} onAddProduct={()=>myStore?setShowAddProduct(true):setShowCreateBiz(true)} onLogout={handleLogout} profileView={profileView} onSetProfileView={setProfileView}/>}

      {showAddSheet && <AddSheet lang={lang} dark={dark} onClose={()=>setShowAddSheet(false)} onCreateBiz={()=>{setShowAddSheet(false);setShowCreateBiz(true);}} onAddProduct={()=>{setShowAddSheet(false);myStore?setShowAddProduct(true):setShowCreateBiz(true);}}/>}
      {chatStore && <ChatModal store={chatStore} lang={lang} dark={dark} messages={chatMessages[chatStore.id]||[]} onClose={()=>setChatStore(null)} onSend={msg=>sendChat(chatStore.id,msg)}/>}
      {bookStore && <BookingModal store={bookStore} lang={lang} dark={dark} onClose={()=>setBookStore(null)} onSuccess={b=>{setBookings(p=>[b,...p]);setBookStore(null);}}/>}

      {/* Bottom Nav */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:th.card,borderTop:`1px solid ${th.border}`,display:"flex",alignItems:"flex-end",padding:"8px 0 20px",zIndex:100}}>
        {navItems.map(item=>{
          if (item.id==="plus") return (
            <div key="plus" style={{flex:1,display:"flex",justifyContent:"center",alignItems:"flex-end"}}>
              <button onClick={()=>setShowAddSheet(true)} style={{width:54,height:54,borderRadius:27,background:"linear-gradient(135deg,#16A34A,#0D6B28)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(22,163,74,0.5)",marginBottom:4}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
          );
          const isActive = activeTab===item.id;
          return (
            <button key={item.id} onClick={()=>{setActiveTab(item.id);if(item.id!=="profile")setProfileView("main");}} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"2px 0"}}>
              {item.icon(isActive)}
              <span style={{fontSize:10,fontWeight:isActive?700:500,color:isActive?"#16A34A":th.sub}}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
