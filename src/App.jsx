import { useState, useRef, useEffect } from "react";
import DynamicCategoryForm from "./CategoryForms.jsx";

// =====================================================
// PWA INSTALL PROMPT
// =====================================================
function PWAInstallPrompt({ dark }) {
  const th = theme(dark);
  const [prompt, setPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }
    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
      // Show after 3 seconds
      setTimeout(() => setShow(true), 3000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setShow(false);
  };

  if (!show || installed) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)', maxWidth: 400,
      background: th.card, borderRadius: 20,
      padding: '16px 20px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      border: `1px solid ${th.border}`,
      zIndex: 999,
      display: 'flex', alignItems: 'center', gap: 14,
      animation: 'slideUp 0.4s ease',
    }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg,#16A34A,#15803D)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ color: '#fff', fontWeight: 900, fontSize: 26 }}>O</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: th.text, marginBottom: 2 }}>OsonTop ni o'rnating</div>
        <div style={{ fontSize: 12, color: th.sub }}>Tezroq ishlaydi, offline ham!</div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setShow(false)} style={{ padding: '8px 12px', borderRadius: 10, background: th.card2, border: 'none', color: th.sub, fontSize: 12, cursor: 'pointer' }}>
          Keyinroq
        </button>
        <button onClick={handleInstall} style={{ padding: '8px 14px', borderRadius: 10, background: '#16A34A', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          O'rnatish
        </button>
      </div>
    </div>
  );
}

// =====================================================
// DARK MODE HOOK
// =====================================================
const useDark = () => {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("dark");
    return saved !== null ? saved === "1" : true; // default: dark
  });
  const toggle = () =>
    setDark((d) => {
      localStorage.setItem("dark", d ? "0" : "1");
      return !d;
    });
  return [dark, toggle];
};

// =====================================================
// THEME TOKENS
// =====================================================
const theme = (dark) => ({
  bg:     dark ? "#101010" : "#F5F5F5",
  card:   dark ? "#1C1C1C" : "#FFFFFF",
  card2:  dark ? "#242424" : "#F0F0F0",
  card3:  dark ? "#2C2C2C" : "#E8E8E8",
  text:   dark ? "#F1F1F1" : "#1A1A1A",
  sub:    dark ? "#888888" : "#777777",
  sub2:   dark ? "#555555" : "#AAAAAA",
  border: dark ? "#2E2E2E" : "#E5E5E5",
  accent: "#16A34A",
  accentDark: "#15803D",
});


// =====================================================
// TRANSLATIONS
// =====================================================
const t = {
  uz: {
    appName: "OsonTop", welcome: "Xush kelibsiz", enterName: "Ism", enterSurname: "Familiya",
    enterPhone: "Telefon raqam", next: "Davom etish", confirm: "Tasdiqlash", smsCode: "SMS kod",
    smsHint: "Raqamingizga 4 xonali kod yuborildi", resend: "Qayta yuborish",
    addPhoto: "Profil rasmi qo'shish", skip: "O'tkazib yuborish",
    allowNotif: "Bildirishnomalarni yoqing", notifDesc: "Yangi chegirmalardan xabardor bo'ling",
    enable: "Yoqish", greeting: "Xush kelibsiz 👋", search: "Mahsulot, xizmat yoki biznes qidiring...",
    all: "Hammasi", food: "Oziq-ovqat", clothing: "Kiyim-kechak", electronics: "Elektronika",
    beauty: "Go'zallik", restaurant: "Restoran/Kafe", home_cat: "Uy-ro'zg'or", sport: "Sport",
    services: "Xizmatlar", auto: "Avto servis", pharmacy: "Dorixona", education: "Ta'lim",
    hotel: "Mehmonxona", repair: "Ta'mirlash", kids: "Bolalar", pet: "Uy hayvonlari",
    cleaning: "Tozalash", medical: "Tibbiyot", entertainment: "O'yin-kulgi",
    openNow: "Hozir ochiq", closedNow: "Yopiq", workHours: "Ish vaqti",
    whatsapp: "WhatsApp", telegram: "Telegram", filterTitle: "Filter",
    minPrice: "Min narx", maxPrice: "Max narx", minDiscount: "Min chegirma",
    applyFilter: "Qo'llash", resetFilter: "Tozalash", distance: "Masofa",
    bookService: "📅 Bron qilish", booking: "Bron", myBookings: "Bronlarim",
    chooseDate: "Sana tanlang", chooseTime: "Vaqt tanlang", bookNow: "Bron qilish",
    bookingSuccess: "Bron muvaffaqiyatli!", bookingSuccessDesc: "Do'kon siz bilan bog'lanadi",
    noBookings: "Bronlar yo'q", bookingDate: "Sana", bookingTime: "Vaqt",
    bookingStatus: "Holat", bookingPending: "Kutilmoqda", bookingConfirmed: "Tasdiqlangan",
    chatWith: "Chat", sendMessage: "Yuborish", typeMessage: "Xabar yozing...",
    noMessages: "Xabarlar yo'q", chatStart: "Suhbatni boshlang",
    analyticsTitle: "Statistika", analyticsViews: "Ko'rishlar", analyticsCoupons: "Kuponlar",
    analyticsBookings: "Bronlar", analyticsRevenue: "Daromad", analyticsToday: "Bugun",
    analyticsWeek: "Hafta", analyticsMonth: "Oy",
    storeType: "Do'kon turi", storeTypeSell: "Savdo", storeTypeService: "Xizmat",
    storeTypeAll: "Hammasi", bannerPhoto: "Banner rasm", offers: "Takliflar", left: "qoldi", getCoupon: "🎟️ Kupon olish",
    home: "Bosh sahifa", saved: "Saqlanganlar", cart: "Savat", map: "Xarita", profile: "Profil",
    savedTitle: "❤️ Saqlanganlar", nothingSaved: "Hech narsa saqlanmagan",
    nothingSavedDesc: "Yoqgan chegirmalarni saqlang", noDeals: "Chegirma topilmadi",
    noDealsDesc: "Boshqa kalit so'z sinab ko'ring", nearby: "Yaqin atrofdagi chegirmali joylar",
    myCoupons: "Mening kuponlarim", notifications: "Bildirishnomalar", settings: "Sozlamalar",
    discount: "CHEGIRMA", expires: "Muddati", namePlaceholder: "Isming",
    surnamePlaceholder: "Familiyangiz", phonePlaceholder: "+998 90 123 45 67",
    addListing: "Mahsulot qo'shish", addListingSub: "Do'koningizga yangi mahsulot qo'shing",
    backToProfile: "Profilga qaytish", step: "Qadam", of: "/",
    chooseCategory: "Kategoriyani tanlang", chooseCategoryDesc: "Mahsulot qaysi yo'nalishga tegishli?",
    productInfo: "Mahsulot ma'lumotlari", productName: "Mahsulot / xizmat nomi",
    productNamePh: "Masalan: Erkaklar krossovkasi", productDesc: "Tavsif",
    productDescPh: "Mahsulot haqida qisqacha ma'lumot bering...",
    parameters: "Parametrlar (ixtiyoriy)", parametersDesc: "O'lcham, rang, model va h.k.",
    paramNamePh: "Masalan: Rang", paramValuePh: "Masalan: Qora", addParam: "+ Parametr qo'shish",
    priceInfo: "Narx", originalPrice: "Narxi (so'm)", locationInfo: "Joylashuv va aloqa",
    storeAddress: "Manzil", storeAddressPh: "Masalan: Chilonzor tumani, 5-mavze",
    pickOnMap: "Xaritadan aniq joyni belgilang", pickOnMapHint: "Manzilni aniq belgilash uchun xaritaga bosing",
    locationSet: "Joylashuv belgilandi ✓", phone: "Telefon raqami (ixtiyoriy)",
    photos: "Mahsulot rasmlari", photosDesc: "Kamida 1 ta rasm yuklang", back: "Orqaga",
    submitListing: "Do'konga qo'shish", fillRequired: "Iltimos barcha majburiy maydonlarni to'ldiring",
    required: "*", sumShort: "so'm", myStore: "Mening do'konim", createStore: "Do'kon yaratish",
    createStoreSub: "Chegirma joylash uchun avval do'koningizni yarating",
    storeName: "Do'kon nomi", storeNamePh: "Masalan: Aziz Market", storeLogo: "Do'kon belgisi (emoji)",
    createStoreBtn: "Do'kon yaratish", productsInStore: "Mahsulotlar",
    noProductsInStore: "Hozircha mahsulot yo'q", noProductsInStoreDesc: "Birinchi mahsulotingizni qo'shing",
    addProductBtn: "+ Mahsulot qo'shish", makeDiscount: "🏷️ Chegirma qilish",
    discountActive: "Chegirmada", editDiscount: "Chegirmani tahrirlash",
    removeDiscount: "Chegirmani bekor qilish", discountModalTitle: "Chegirma qo'yish",
    discountPercent: "Chegirma foizi (%)", expiryDate: "Chegirma muddati",
    applyDiscount: "Chegirmaga chiqarish", subscribe: "🔔 Obuna bo'lish",
    subscribed: "✓ Obuna bo'lingan", subscribers: "obunachi", goToStore: "🏬 Do'konga o'tish",
    ownStoreBadge: "Sizning do'koningiz", storeReviews: "Sharhlar", noReviews: "Hozircha sharhlar yo'q",
    leaveReview: "Fikr bildirish", yourRating: "Bahoyingiz",
    commentPh: "Fikringizni yozing (ixtiyoriy)...", submitReview: "Yuborish",
    cancel: "Bekor qilish", rateProduct: "Mahsulotni baholash", deleteProduct: "O'chirish",
    confirmDelete: "Ushbu mahsulotni o'chirishni xohlaysizmi?", yes: "Ha", no: "Yo'q",
    addToCart: "🛒 Savatga qo'shish", inCart: "Savatda", emptyCart: "Savat bo'sh",
    emptyCartDesc: "Chegirmali mahsulotlarni savatga qo'shing", cartTitle: "🛒 Savat",
    qty: "Soni", total: "Jami", removeFromCart: "O'chirish",
    notificationsTitle: "🔔 Bildirishnomalar", noNotifications: "Hozircha bildirishnoma yo'q",
    noNotificationsDesc: "Do'konlarga obuna bo'ling va yangiliklardan xabardor bo'ling",
    newDiscountNotif: (s) => `${s} yangi chegirma qo'shdi`,
    newProductNotif: (s) => `${s} yangi mahsulot qo'shdi`,
    checkout: "Buyurtma berish", checkoutTitle: "Buyurtmani tasdiqlash",
    deliveryMethod: "Yetkazib berish usuli", pickup: "O'zi olib ketish", delivery: "Yetkazib berish",
    deliveryAddress: "Yetkazib berish manzili", deliveryAddressPh: "Ko'cha, uy raqami",
    paymentMethod: "To'lov usuli", cash: "Naqd pul", card: "Karta",
    placeOrder: "Buyurtma berish", orderSuccess: "Buyurtma muvaffaqiyatli qabul qilindi! 🎉",
    orderSuccessDesc: "Tez orada siz bilan bog'lanamiz", orderSuccessBtn: "Bosh sahifaga qaytish",
    orderNumber: "Buyurtma raqami", couponTitle: "Kupon muvaffaqiyatli olindi! 🎟️",
    couponCode: "Kupon kodi", couponExpiry: "Amal qilish muddati",
    couponSaved: "Kupon saqlandilar bo'limida", myCouponsTitle: "🎟️ Mening kuponlarim",
    noCoupons: "Hozircha kuponlar yo'q", noCouponsDesc: "Chegirmali mahsulotlardan kupon oling",
    couponUsed: "Ishlatilgan", couponActive: "Faol", useCoupon: "Ishlatish",
    couponHint: "Do'konda shu kodni ko'rsating", editProfile: "Profilni tahrirlash",
    saveProfile: "Saqlash", callStore: "📞 Qo'ng'iroq", telegramStore: "✈️ Telegram",
    shareDiscount: "🔗 Ulashish", storesTitle: "Do'konlar", allStores: "Barcha do'konlar",
    searchStores: "Do'kon qidirish", sortBy: "Saralash", sortDefault: "Standart",
    sortDiscount: "Chegirma %", sortPrice: "Narx", sortExpiry: "Muddat",
    darkMode: "Tungi rejim", guestMode: "Mehmon sifatida kirish",
    subscribedStores: "Obuna bo'lgan do'konlar", noSubscribed: "Hech qaysi do'konga obuna bo'lmagansiz",
    statsTitle: "Do'kon statistikasi", statsViews: "Ko'rishlar", statsCoupons: "Kuponlar",
    statsSubscribers: "Obunchilar", statsRevenue: "Taxminiy daromad",
    deliveryAvail: "Yetkazib berish mavjud", deliveryPrice: "Yetkazib berish narxi",
    payTitle: "To'lov usuli", payPayme: "Payme", payClick: "Click",
    payUzum: "Uzum Pay", payCash: "Naqd pul", payNow: "To'lovni amalga oshirish",
  },
  ru: {
    appName: "OsonTop", welcome: "Добро пожаловать", enterName: "Имя", enterSurname: "Фамилия",
    enterPhone: "Номер телефона", next: "Продолжить", confirm: "Подтвердить", smsCode: "SMS код",
    smsHint: "На ваш номер отправлен 4-значный код", resend: "Отправить снова",
    addPhoto: "Добавить фото профиля", skip: "Пропустить",
    allowNotif: "Включите уведомления", notifDesc: "Узнавайте о новых скидках первыми",
    enable: "Включить", greeting: "Добро пожаловать 👋", search: "Найдите товар, услугу или бизнес...",
    all: "Все", food: "Продукты", clothing: "Одежда", electronics: "Электроника",
    beauty: "Красота", restaurant: "Рестораны/Кафе", home_cat: "Дом и быт", sport: "Спорт",
    services: "Услуги", auto: "Авто сервис", pharmacy: "Аптека", education: "Образование",
    hotel: "Гостиница", repair: "Ремонт", kids: "Детское", pet: "Животные",
    cleaning: "Уборка", medical: "Медицина", entertainment: "Развлечения",
    openNow: "Открыто", closedNow: "Закрыто", workHours: "Часы работы",
    whatsapp: "WhatsApp", telegram: "Telegram", filterTitle: "Фильтр",
    minPrice: "Мин цена", maxPrice: "Макс цена", minDiscount: "Мин скидка",
    applyFilter: "Применить", resetFilter: "Сбросить", distance: "Расстояние",
    bookService: "📅 Забронировать", booking: "Бронь", myBookings: "Мои брони",
    chooseDate: "Выберите дату", chooseTime: "Выберите время", bookNow: "Забронировать",
    bookingSuccess: "Бронь успешна!", bookingSuccessDesc: "Магазин свяжется с вами",
    noBookings: "Нет броней", bookingDate: "Дата", bookingTime: "Время",
    bookingStatus: "Статус", bookingPending: "Ожидание", bookingConfirmed: "Подтверждено",
    chatWith: "Чат", sendMessage: "Отправить", typeMessage: "Написать сообщение...",
    noMessages: "Нет сообщений", chatStart: "Начните переписку",
    analyticsTitle: "Статистика", analyticsViews: "Просмотры", analyticsCoupons: "Купоны",
    analyticsBookings: "Брони", analyticsRevenue: "Доход", analyticsToday: "Сегодня",
    analyticsWeek: "Неделя", analyticsMonth: "Месяц",
    storeType: "Тип магазина", storeTypeSell: "Торговля", storeTypeService: "Услуги",
    storeTypeAll: "Все", bannerPhoto: "Баннер фото", offers: "Предложения", left: "осталось", getCoupon: "🎟️ Получить купон",
    home: "Главная", saved: "Сохранённые", cart: "Корзина", map: "Карта", profile: "Профиль",
    savedTitle: "❤️ Сохранённые", nothingSaved: "Ничего не сохранено",
    nothingSavedDesc: "Сохраняйте понравившиеся скидки", noDeals: "Скидок не найдено",
    noDealsDesc: "Попробуйте другой запрос", nearby: "Ближайшие места со скидками",
    myCoupons: "Мои купоны", notifications: "Уведомления", settings: "Настройки",
    discount: "СКИДКА", expires: "Срок", namePlaceholder: "Ваше имя",
    surnamePlaceholder: "Ваша фамилия", phonePlaceholder: "+998 90 123 45 67",
    addListing: "Добавить товар", addListingSub: "Добавьте новый товар в свой магазин",
    backToProfile: "Назад в профиль", step: "Шаг", of: "/",
    chooseCategory: "Выберите категорию", chooseCategoryDesc: "К какому направлению относится товар?",
    productInfo: "Информация о товаре", productName: "Название товара / услуги",
    productNamePh: "Например: Мужские кроссовки", productDesc: "Описание",
    productDescPh: "Краткая информация о товаре...",
    parameters: "Параметры (необязательно)", parametersDesc: "Размер, цвет, модель и т.д.",
    paramNamePh: "Например: Цвет", paramValuePh: "Например: Чёрный", addParam: "+ Добавить параметр",
    priceInfo: "Цена", originalPrice: "Цена (сум)", locationInfo: "Местоположение и контакты",
    storeAddress: "Адрес", storeAddressPh: "Например: Чиланзарский район, 5 квартал",
    pickOnMap: "Отметьте точное место на карте", pickOnMapHint: "Нажмите на карту чтобы указать адрес",
    locationSet: "Местоположение указано ✓", phone: "Номер телефона (необязательно)",
    photos: "Фотографии товара", photosDesc: "Загрузите минимум 1 фото", back: "Назад",
    submitListing: "Добавить в магазин", fillRequired: "Пожалуйста, заполните все обязательные поля",
    required: "*", sumShort: "сум", myStore: "Мой магазин", createStore: "Создать магазин",
    createStoreSub: "Чтобы публиковать скидки, сначала создайте свой магазин",
    storeName: "Название магазина", storeNamePh: "Например: Aziz Market",
    storeLogo: "Значок магазина (эмодзи)", createStoreBtn: "Создать магазин",
    productsInStore: "Товары", noProductsInStore: "Пока нет товаров",
    noProductsInStoreDesc: "Добавьте свой первый товар", addProductBtn: "+ Добавить товар",
    makeDiscount: "🏷️ Сделать скидку", discountActive: "Со скидкой",
    editDiscount: "Изменить скидку", removeDiscount: "Отменить скидку",
    discountModalTitle: "Установить скидку", discountPercent: "Процент скидки (%)",
    expiryDate: "Срок действия скидки", applyDiscount: "Опубликовать скидку",
    subscribe: "🔔 Подписаться", subscribed: "✓ Вы подписаны", subscribers: "подписчиков",
    goToStore: "🏬 Перейти в магазин", ownStoreBadge: "Ваш магазин",
    storeReviews: "Отзывы", noReviews: "Пока нет отзывов", leaveReview: "Оставить отзыв",
    yourRating: "Ваша оценка", commentPh: "Напишите отзыв (необязательно)...",
    submitReview: "Отправить", cancel: "Отмена", rateProduct: "Оценить товар",
    deleteProduct: "Удалить", confirmDelete: "Удалить этот товар?", yes: "Да", no: "Нет",
    addToCart: "🛒 В корзину", inCart: "В корзине", emptyCart: "Корзина пуста",
    emptyCartDesc: "Добавьте товары со скидкой в корзину", cartTitle: "🛒 Корзина",
    qty: "Кол-во", total: "Итого", removeFromCart: "Удалить",
    notificationsTitle: "🔔 Уведомления", noNotifications: "Пока нет уведомлений",
    noNotificationsDesc: "Подпишитесь на магазины, чтобы узнавать новости первыми",
    newDiscountNotif: (s) => `${s} опубликовал новую скидку`,
    newProductNotif: (s) => `${s} добавил новый товар`,
    checkout: "Оформить заказ", checkoutTitle: "Подтверждение заказа",
    deliveryMethod: "Способ получения", pickup: "Самовывоз", delivery: "Доставка",
    deliveryAddress: "Адрес доставки", deliveryAddressPh: "Улица, номер дома",
    paymentMethod: "Способ оплаты", cash: "Наличные", card: "Карта",
    placeOrder: "Оформить заказ", orderSuccess: "Заказ успешно принят! 🎉",
    orderSuccessDesc: "Мы свяжемся с вами в ближайшее время",
    orderSuccessBtn: "Вернуться на главную", orderNumber: "Номер заказа",
    couponTitle: "Купон успешно получен! 🎟️", couponCode: "Код купона",
    couponExpiry: "Срок действия", couponSaved: "Купон сохранён в разделе купонов",
    myCouponsTitle: "🎟️ Мои купоны", noCoupons: "Пока нет купонов",
    noCouponsDesc: "Получайте купоны на товары со скидкой",
    couponUsed: "Использован", couponActive: "Активный", useCoupon: "Использовать",
    couponHint: "Покажите этот код в магазине", editProfile: "Редактировать профиль",
    saveProfile: "Сохранить", callStore: "📞 Позвонить", telegramStore: "✈️ Telegram",
    shareDiscount: "🔗 Поделиться", storesTitle: "Магазины", allStores: "Все магазины",
    searchStores: "Поиск магазина", sortBy: "Сортировка", sortDefault: "По умолчанию",
    sortDiscount: "По скидке %", sortPrice: "По цене", sortExpiry: "По сроку",
    darkMode: "Тёмный режим", guestMode: "Войти как гость",
    subscribedStores: "Подписки", noSubscribed: "Вы не подписаны ни на один магазин",
    statsTitle: "Статистика магазина", statsViews: "Просмотры", statsCoupons: "Купоны",
    statsSubscribers: "Подписчики", statsRevenue: "Примерный доход",
    deliveryAvail: "Доставка доступна", deliveryPrice: "Стоимость доставки",
    payTitle: "Способ оплаты", payPayme: "Payme", payClick: "Click",
    payUzum: "Uzum Pay", payCash: "Наличные", payNow: "Оплатить",
  },
};


// =====================================================
// OSONTOP LOGO COMPONENT
// =====================================================
function OsonTopLogo({ size = 17, iconSize = 32, showIcon = true }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: showIcon ? 8 : 0 }}>
      {showIcon && (
        <div style={{
          width: iconSize, height: iconSize, borderRadius: iconSize * 0.28,
          background: "linear-gradient(135deg,#16A34A,#15803D)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(22,163,74,0.4)",
        }}>
          <span style={{ color: "#fff", fontWeight: 900, fontSize: iconSize * 0.55 }}>O</span>
        </div>
      )}
      <span style={{ fontSize: size, fontWeight: 800, letterSpacing: -0.3 }}>
        <span style={{ color: "#F1F1F1" }}>Oson</span>
        <span style={{ color: "#16A34A" }}>Top</span>
      </span>
    </div>
  );
}

// =====================================================
// CATEGORIES & HELPERS
// =====================================================
const CATEGORY_LIST = [
  { id: "food",          emoji: "🍕", color: "#E17055" },
  { id: "clothing",      emoji: "👕", color: "#2D3436" },
  { id: "electronics",   emoji: "📱", color: "#0984E3" },
  { id: "beauty",        emoji: "💄", color: "#E84393" },
  { id: "restaurant",    emoji: "☕", color: "#FDCB6E" },
  { id: "home_cat",      emoji: "🏠", color: "#00B894" },
  { id: "sport",         emoji: "⚽", color: "#6C5CE7" },
  { id: "services",      emoji: "🛠️", color: "#636E72" },
  { id: "auto",          emoji: "🚗", color: "#0652DD" },
  { id: "pharmacy",      emoji: "💊", color: "#009432" },
  { id: "education",     emoji: "📚", color: "#F79F1F" },
  { id: "hotel",         emoji: "🏨", color: "#1289A7" },
  { id: "repair",        emoji: "🔧", color: "#5758BB" },
  { id: "kids",          emoji: "🧸", color: "#FDA7DF" },
  { id: "medical",       emoji: "🏥", color: "#ED4C67" },
  { id: "entertainment", emoji: "🎮", color: "#9980FA" },
  { id: "pet",           emoji: "🐾", color: "#D980FA" },
  { id: "cleaning",      emoji: "🧹", color: "#C4E538" },
];
const categoryLabel = (id, lang) => t[lang][id] || id;
const browseCategories = (lang) => [
  { id: "all", label: t[lang].all, emoji: "🏷️" },
  ...CATEGORY_LIST.map((c) => ({ id: c.id, label: categoryLabel(c.id, lang), emoji: c.emoji })),
];
const listingCategories = (lang) =>
  CATEGORY_LIST.map((c) => ({ ...c, label: categoryLabel(c.id, lang) }));

const isoDaysFromNow = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
const daysLeftLabel = (dateStr, lang) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((new Date(dateStr) - today) / 86400000);
  if (diff <= 0) return lang === "uz" ? "Bugun" : "Сегодня";
  return lang === "uz" ? `${diff} kun` : `${diff} дней`;
};
const isExpired = (dateStr) => {
  const t2 = new Date();
  t2.setHours(0, 0, 0, 0);
  return new Date(dateStr) < t2;
};
const formatPrice = (n) =>
  Math.round(Number(n) || 0)
    .toLocaleString("ru-RU")
    .replace(/,/g, " ");
const avgRating = (reviews) =>
  reviews?.length ? reviews.reduce((s, r) => s + r.stars, 0) / reviews.length : 0;

const genCouponCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "CH-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

// Do'kon hozir ochiqmi?
const isStoreOpen = (store) => {
  if (!store?.workHours) return true;
  const days = ["sun","mon","tue","wed","thu","fri","sat"];
  const now = new Date();
  const dayKey = days[now.getDay()];
  const hours = store.workHours[dayKey];
  if (!hours || hours === "Yopiq" || hours === "Закрыто") return false;
  if (hours === "00:00-24:00") return true;
  const [start, end] = hours.split("-");
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  return nowMin >= startMin && nowMin < endMin;
};


// =====================================================
// LOCALSTORAGE HELPERS
// =====================================================
const LS_KEY = "osontop_state";
const saveToLS = (data) => {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
};
const loadFromLS = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

// =====================================================
// INITIAL DEMO STORES
// =====================================================
const initialStores = [
  {
    id: "st1", name: "Korzinka", logo: "🛒", color: "#FF6B35", type: "sell",
    address: "Toshkent, Chilonzor tumani", phone: "+998712000001",
    whatsapp: "+998712000001", telegram: "@korzinka_uz",
    banner: "", description: { uz: "O'zbekistonning yetakchi supermarketi", ru: "Ведущий супермаркет Узбекистана" },
    workHours: { mon: "08:00-22:00", tue: "08:00-22:00", wed: "08:00-22:00", thu: "08:00-22:00", fri: "08:00-22:00", sat: "08:00-22:00", sun: "09:00-21:00" },
    lat: 41.299, lng: 69.240, views: 1240, subscriberBase: 320,
    reviews: [{ stars: 5, comment: "Juda yaxshi narxlar", author: "Anvar" }],
    products: [{ id: "p1", category: "food", name: { uz: "Mahsulotlarga chegirma", ru: "Скидка на продукты" }, description: { uz: "Barcha oziq-ovqat mahsulotlariga chegirma", ru: "Скидка на все продукты питания" }, params: [], originalPrice: 45000, photos: [], delivery: true, deliveryPrice: 5000, discount: { percent: 30, expiryDate: isoDaysFromNow(2) }, reviews: [{ stars: 4, comment: "Yaxshi sifat", author: "Dilnoza" }] }],
  },
  {
    id: "st2", name: "Zara Tashkent", logo: "👔", color: "#2D3436", type: "sell",
    address: "Toshkent, Amir Temur ko'chasi", phone: "+998712000002",
    whatsapp: "+998712000002", telegram: "@zara_tashkent",
    banner: "", description: { uz: "Jahon brendlari kiyimlari", ru: "Одежда мировых брендов" },
    workHours: { mon: "10:00-21:00", tue: "10:00-21:00", wed: "10:00-21:00", thu: "10:00-21:00", fri: "10:00-21:00", sat: "10:00-22:00", sun: "11:00-20:00" },
    lat: 41.302, lng: 69.245, views: 890, subscriberBase: 210, reviews: [],
    products: [{ id: "p2", category: "clothing", name: { uz: "Yozgi kolleksiya", ru: "Летняя коллекция" }, description: { uz: "Yangi yozgi kiyimlar kolleksiyasi", ru: "Новая летняя коллекция одежды" }, params: [{ name: "Razmer", value: "S-XL" }], originalPrice: 320000, photos: [], delivery: false, deliveryPrice: 0, discount: { percent: 50, expiryDate: isoDaysFromNow(5) }, reviews: [] }],
  },
  {
    id: "st3", name: "Texnomart", logo: "📱", color: "#0984E3", type: "sell",
    address: "Toshkent, Yunusobod tumani", phone: "+998712000003",
    whatsapp: "+998712000003", telegram: "@texnomart_uz",
    banner: "", description: { uz: "Elektronika va texnologiya do'koni", ru: "Магазин электроники и технологий" },
    workHours: { mon: "09:00-21:00", tue: "09:00-21:00", wed: "09:00-21:00", thu: "09:00-21:00", fri: "09:00-21:00", sat: "09:00-21:00", sun: "10:00-20:00" },
    lat: 41.295, lng: 69.235, views: 2100, subscriberBase: 540,
    reviews: [{ stars: 5, comment: "Tez yetkazib berishadi", author: "Jasur" }],
    products: [
      { id: "p3", category: "electronics", name: { uz: "Smartfonlarga", ru: "На смартфоны" }, description: { uz: "Eng so'nggi smartfon modellariga chegirma", ru: "Скидка на новейшие модели смартфонов" }, params: [], originalPrice: 4500000, photos: [], delivery: true, deliveryPrice: 15000, discount: { percent: 15, expiryDate: isoDaysFromNow(3) }, reviews: [] },
      { id: "p3b", category: "electronics", name: { uz: "Elektronika bo'limi", ru: "Отдел электроники" }, description: { uz: "", ru: "" }, params: [], originalPrice: 1200000, photos: [], delivery: true, deliveryPrice: 10000, discount: { percent: 40, expiryDate: isoDaysFromNow(4) }, reviews: [] },
    ],
  },
  {
    id: "st4", name: "L'Oreal", logo: "💄", color: "#E84393", type: "sell",
    address: "Toshkent, Mirzo Ulug'bek tumani", phone: "+998712000004",
    whatsapp: "+998712000004", telegram: "@loreal_uz",
    banner: "", description: { uz: "Go'zallik mahsulotlari", ru: "Товары красоты" },
    workHours: { mon: "10:00-20:00", tue: "10:00-20:00", wed: "10:00-20:00", thu: "10:00-20:00", fri: "10:00-20:00", sat: "10:00-21:00", sun: "11:00-19:00" },
    lat: 41.305, lng: 69.250, views: 670, subscriberBase: 180, reviews: [],
    products: [{ id: "p4", category: "beauty", name: { uz: "Barcha mahsulotlar", ru: "Все товары" }, description: { uz: "Go'zallik mahsulotlariga maxsus chegirma", ru: "Специальная скидка на товары для красоты" }, params: [], originalPrice: 180000, photos: [], delivery: true, deliveryPrice: 8000, discount: { percent: 25, expiryDate: isoDaysFromNow(7) }, reviews: [] }],
  },
  {
    id: "st5", name: "Dono Pizza", logo: "🍕", color: "#E17055", type: "sell",
    address: "Toshkent, Shayxontohur tumani", phone: "+998712000005",
    whatsapp: "+998712000005", telegram: "@dono_pizza",
    banner: "", description: { uz: "Toshkentning eng mazali pizzasi", ru: "Самая вкусная пицца Ташкента" },
    workHours: { mon: "11:00-23:00", tue: "11:00-23:00", wed: "11:00-23:00", thu: "11:00-23:00", fri: "11:00-00:00", sat: "11:00-00:00", sun: "12:00-23:00" },
    lat: 41.298, lng: 69.242, views: 1560, subscriberBase: 430,
    reviews: [{ stars: 4, comment: "Mazali pizza!", author: "Olim" }],
    products: [{ id: "p5", category: "restaurant", name: { uz: "Katta pizza", ru: "Большая пицца" }, description: { uz: "Katta o'lchamdagi har qanday pizza", ru: "Большая пицца любого вида" }, params: [], originalPrice: 95000, photos: [], delivery: true, deliveryPrice: 5000, discount: { percent: 20, expiryDate: isoDaysFromNow(2) }, reviews: [] }],
  },
  {
    id: "st6", name: "Silk Road", logo: "🧥", color: "#00B894", type: "sell",
    address: "Toshkent, Yakkasaroy tumani", phone: "+998712000006",
    whatsapp: "+998712000006", telegram: "@silkroad_uz",
    banner: "", description: { uz: "Milliy va zamonaviy kiyimlar", ru: "Национальная и современная одежда" },
    workHours: { mon: "09:00-19:00", tue: "09:00-19:00", wed: "09:00-19:00", thu: "09:00-19:00", fri: "09:00-19:00", sat: "09:00-18:00", sun: "Yopiq" },
    lat: 41.308, lng: 69.248, views: 340, subscriberBase: 90, reviews: [],
    products: [{ id: "p6", category: "clothing", name: { uz: "Atlas ko'ylaklar", ru: "Атласные платья" }, description: { uz: "", ru: "" }, params: [], originalPrice: 410000, photos: [], delivery: false, deliveryPrice: 0, discount: { percent: 35, expiryDate: isoDaysFromNow(4) }, reviews: [] }],
  },
  {
    id: "st7", name: "Coffee House", logo: "☕", color: "#FDCB6E", type: "sell",
    address: "Toshkent, Mirobod tumani", phone: "+998712000007",
    whatsapp: "+998712000007", telegram: "@coffeehouse_uz",
    banner: "", description: { uz: "Eng yaxshi qahva va shirinliklar", ru: "Лучший кофе и сладости" },
    workHours: { mon: "08:00-22:00", tue: "08:00-22:00", wed: "08:00-22:00", thu: "08:00-22:00", fri: "08:00-23:00", sat: "09:00-23:00", sun: "09:00-22:00" },
    lat: 41.301, lng: 69.243, views: 780, subscriberBase: 200, reviews: [],
    products: [{ id: "p7", category: "restaurant", name: { uz: "Barcha ichimliklar", ru: "Все напитки" }, description: { uz: "", ru: "" }, params: [], originalPrice: 28000, photos: [], delivery: false, deliveryPrice: 0, discount: { percent: 10, expiryDate: isoDaysFromNow(3) }, reviews: [] }],
  },
  {
    id: "st8", name: "AutoServis Pro", logo: "🚗", color: "#0652DD", type: "service",
    address: "Toshkent, Sergeli tumani", phone: "+998712000008",
    whatsapp: "+998712000008", telegram: "@autoservis_pro",
    banner: "", description: { uz: "Professional avto ta'mirlash xizmati", ru: "Профессиональный авто сервис" },
    workHours: { mon: "08:00-18:00", tue: "08:00-18:00", wed: "08:00-18:00", thu: "08:00-18:00", fri: "08:00-18:00", sat: "09:00-16:00", sun: "Yopiq" },
    lat: 41.293, lng: 69.238, views: 560, subscriberBase: 145, reviews: [{ stars: 5, comment: "Tez va sifatli ta'mirlashdi", author: "Bobur" }],
    products: [{ id: "p8", category: "auto", name: { uz: "Motor ta'mirlash", ru: "Ремонт двигателя" }, description: { uz: "Barcha turdagi avtomobil motorlarini ta'mirlash", ru: "Ремонт двигателей всех марок" }, params: [{ name: "Xizmat", value: "Motor, KPP, Podveska" }], originalPrice: 500000, photos: [], delivery: false, deliveryPrice: 0, discount: { percent: 20, expiryDate: isoDaysFromNow(5) }, reviews: [] }],
  },
  {
    id: "st9", name: "Najot Dorixonasi", logo: "💊", color: "#009432", type: "sell",
    address: "Toshkent, Yunusobod tumani", phone: "+998712000009",
    whatsapp: "+998712000009", telegram: "@najot_pharmacy",
    banner: "", description: { uz: "24 soat ishlaydigan dorixona", ru: "Аптека 24 часа" },
    workHours: { mon: "00:00-24:00", tue: "00:00-24:00", wed: "00:00-24:00", thu: "00:00-24:00", fri: "00:00-24:00", sat: "00:00-24:00", sun: "00:00-24:00" },
    lat: 41.307, lng: 69.252, views: 920, subscriberBase: 280, reviews: [],
    products: [{ id: "p9", category: "pharmacy", name: { uz: "Vitaminlarga chegirma", ru: "Скидка на витамины" }, description: { uz: "Barcha vitaminlar va qo'shimchalarga chegirma", ru: "Скидка на все витамины и добавки" }, params: [], originalPrice: 85000, photos: [], delivery: true, deliveryPrice: 8000, discount: { percent: 15, expiryDate: isoDaysFromNow(6) }, reviews: [] }],
  },
  {
    id: "st10", name: "CleanPro", logo: "🧹", color: "#C4E538", type: "service",
    address: "Toshkent, Uchtepa tumani", phone: "+998712000010",
    whatsapp: "+998712000010", telegram: "@cleanpro_uz",
    banner: "", description: { uz: "Professional tozalash xizmati", ru: "Профессиональная уборка" },
    workHours: { mon: "08:00-20:00", tue: "08:00-20:00", wed: "08:00-20:00", thu: "08:00-20:00", fri: "08:00-20:00", sat: "09:00-18:00", sun: "10:00-16:00" },
    lat: 41.296, lng: 69.233, views: 310, subscriberBase: 88, reviews: [],
    products: [{ id: "p10", category: "cleaning", name: { uz: "Xonadon tozalash", ru: "Уборка квартиры" }, description: { uz: "Professional xonadon tozalash xizmati", ru: "Профессиональная уборка квартиры" }, params: [{ name: "Xona", value: "1-5 xona" }], originalPrice: 200000, photos: [], delivery: false, deliveryPrice: 0, discount: { percent: 25, expiryDate: isoDaysFromNow(4) }, reviews: [] }],
  },
];


// =====================================================
// MAP HELPERS
// =====================================================
const MAP_BOUNDS = { minLat: 41.290, maxLat: 41.312, minLng: 69.230, maxLng: 69.255 };
const toX = (lng) => ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 340 + 20;
const toY = (lat) => ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 280 + 20;
const fromXY = (px, py) => ({
  lng: ((px - 20) / 340) * (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng) + MAP_BOUNDS.minLng,
  lat: MAP_BOUNDS.maxLat - ((py - 20) / 280) * (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat),
});

function MapBackground() {
  return (
    <>
      <rect width="380" height="320" fill="#E8F5E8" />
      <line x1="0" y1="160" x2="380" y2="160" stroke="#fff" strokeWidth="8" opacity="0.7" />
      <line x1="190" y1="0" x2="190" y2="320" stroke="#fff" strokeWidth="8" opacity="0.7" />
      <line x1="0" y1="100" x2="380" y2="220" stroke="#fff" strokeWidth="5" opacity="0.5" />
      <line x1="0" y1="220" x2="380" y2="100" stroke="#fff" strokeWidth="5" opacity="0.5" />
      {[[40,40,80,60],[160,30,100,50],[280,50,70,60],[50,130,70,50],[230,120,90,40],
        [310,130,50,60],[40,210,80,60],[150,200,100,50],[280,210,70,60]].map(([x,y,w,h],i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx={4} fill="#D4EDDA" opacity="0.8" />
      ))}
      <ellipse cx="190" cy="160" rx="35" ry="28" fill="#A8D5A2" opacity="0.6" />
      <text x="190" y="164" textAnchor="middle" fontSize="16">🌳</text>
    </>
  );
}

// =====================================================
// SHARED STYLES GENERATOR
// =====================================================
const mkStyles = (dark) => {
  const th = theme(dark);
  return {
    label: { fontSize: 13, fontWeight: 600, color: th.sub, marginBottom: 6, display: "block" },
    input: {
      width: "100%", padding: "14px 16px", borderRadius: 14,
      border: `1.5px solid ${th.border}`, background: th.card, fontSize: 15,
      outline: "none", marginBottom: 18, boxSizing: "border-box", color: th.text,
    },
    textarea: {
      width: "100%", padding: "14px 16px", borderRadius: 14,
      border: `1.5px solid ${th.border}`, background: th.card, fontSize: 15,
      outline: "none", marginBottom: 18, boxSizing: "border-box", color: th.text,
      minHeight: 80, resize: "vertical", fontFamily: "inherit",
    },
    btn: {
      width: "100%", padding: "16px", background: "#16A34A", color: "#fff",
      border: "none", borderRadius: 16, fontSize: 16, fontWeight: 800, cursor: "pointer",
      boxShadow: "0 4px 16px rgba(230,57,70,0.3)",
    },
    ghostBtn: {
      width: "100%", padding: "14px", background: th.card, color: "#16A34A",
      border: "1.5px solid #16A34A", borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: "pointer",
    },
    secTitle: { fontSize: 15, fontWeight: 800, color: th.text, margin: "0 0 4px" },
    secDesc: { fontSize: 12, color: th.sub, margin: "0 0 16px" },
  };
};


// =====================================================
// SHARED UI COMPONENTS
// =====================================================
function StarRating({ value, onChange, size = 22, readOnly = false }) {
  const [hover, setHover] = useState(0);
  const display = hover || value;
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n}
          onClick={() => !readOnly && onChange && onChange(n)}
          onMouseEnter={() => !readOnly && setHover(n)}
          onMouseLeave={() => !readOnly && setHover(0)}
          style={{ fontSize: size, cursor: readOnly ? "default" : "pointer", color: n <= display ? "#FFB400" : "#E0E0E0", lineHeight: 1 }}>
          ★
        </span>
      ))}
    </div>
  );
}

function ModalSheet({ onClose, children, maxHeight = "85vh", dark }) {
  const th = theme(dark);
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 300,
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      maxWidth: 430, margin: "0 auto",
    }} onClick={onClose}>
      <div style={{
        background: th ? th.card : "#fff", borderRadius: "24px 24px 0 0",
        padding: 24, width: "100%", maxWidth: 430, maxHeight, overflowY: "auto",
        boxSizing: "border-box",
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ width: 40, height: 4, background: th ? th.border : "#E0E0E0", borderRadius: 2, margin: "0 auto 18px" }} />
        {children}
      </div>
    </div>
  );
}

// =====================================================
// QR CODE (pseudo)
// =====================================================
function QRCode({ code, color = "#16A34A" }) {
  const size = 120;
  const cells = 10;
  const cell = size / cells;
  const hash = (s) => s.split("").reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0), 0);
  const filled = (r, c) => (Math.abs(hash(code + r + c)) % 3) !== 0;
  return (
    <svg width={size} height={size} style={{ borderRadius: 8, background: "#fff", padding: 6 }}>
      {Array.from({ length: cells }).map((_, r) =>
        Array.from({ length: cells }).map((_, c) =>
          filled(r, c) && <rect key={r + "-" + c} x={c * cell} y={r * cell} width={cell} height={cell} fill={color} />
        )
      )}
    </svg>
  );
}

// =====================================================
// CONFETTI
// =====================================================
function Confetti({ active }) {
  if (!active) return null;
  const colors = ["#16A34A", "#FFB400", "#00B894", "#0984E3", "#E84393", "#6C5CE7"];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none", overflow: "hidden" }}>
      {Array.from({ length: 30 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const dur = 1 + Math.random();
        return (
          <div key={i} style={{
            position: "absolute", top: "-20px", left: `${left}%`,
            width: 8, height: 8, borderRadius: "50%", background: colors[i % colors.length],
            animation: `fall ${dur}s ${delay}s ease-in forwards`,
          }} />
        );
      })}
      <style>{`@keyframes fall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}`}</style>
    </div>
  );
}

// =====================================================
// SORT FILTER BAR
// =====================================================
function SortFilterBar({ lang, sort, setSort, dark }) {
  const th = theme(dark);
  const tx = t[lang];
  const options = [
    { id: "default", label: tx.sortDefault },
    { id: "discount", label: tx.sortDiscount + " ↓" },
    { id: "price_asc", label: tx.sortPrice + " ↑" },
    { id: "price_desc", label: tx.sortPrice + " ↓" },
    { id: "expiry", label: tx.sortExpiry },
  ];
  return (
    <div style={{ padding: "8px 0 0 20px", display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" }}>
      {options.map((o) => (
        <button key={o.id} onClick={() => setSort(o.id)} style={{
          flexShrink: 0, padding: "6px 14px", borderRadius: 50, border: "none", cursor: "pointer",
          fontSize: 12, fontWeight: 600,
          background: sort === o.id ? "#16A34A" : th.card,
          color: sort === o.id ? "#fff" : th.sub,
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        }}>{o.label}</button>
      ))}
      <div style={{ width: 16, flexShrink: 0 }} />
    </div>
  );
}


// =====================================================
// BUSINESS CARD — biznes kartochkasi (yangi)
// =====================================================
function BusinessCard({ store, th, lang, onClick }) {
  const isOpen = isStoreOpen(store);
  const rating = avgRating(store.reviews);
  const catInfo = CATEGORY_LIST.find(c => store.products[0]?.category === c.id);
  const storeDeals = store.products.filter(p => p.discount && !isExpired(p.discount?.expiryDate));
  const topDiscount = storeDeals.length > 0 ? Math.max(...storeDeals.map(p => p.discount?.percent || 0)) : 0;
  const distance = Math.round(Math.random() * 2000 + 300) + " m";
  const days = ["sun","mon","tue","wed","thu","fri","sat"];
  const dayKey = days[new Date().getDay()];
  const todayHours = store.workHours?.[dayKey];

  return (
    <div onClick={onClick} style={{
      background: th.card, borderRadius: 16, overflow: "hidden",
      cursor: "pointer", border: `1px solid ${th.border}`,
      marginBottom: 12,
    }}>
      <div style={{ display: "flex", gap: 12, padding: "14px 14px 12px" }}>
        {/* Logo */}
        <div style={{
          width: 52, height: 52, borderRadius: 14, flexShrink: 0,
          background: store.color + "22",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26, overflow: "hidden", border: `1px solid ${store.color}33`,
        }}>
          {store.photos?.length ? <img src={store.photos[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : store.logo}
        </div>
        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Nomi + badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: th.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{store.name}</span>
            {topDiscount > 0 && (
              <span style={{ background: "#16A34A", color: "#fff", borderRadius: 6, padding: "1px 6px", fontSize: 10, fontWeight: 800, flexShrink: 0 }}>-{topDiscount}%</span>
            )}
          </div>
          {/* Kategoriya */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
            {catInfo && <span style={{ fontSize: 11 }}>{catInfo.emoji}</span>}
            <span style={{ fontSize: 12, color: th.sub }}>{catInfo ? categoryLabel(catInfo.id, lang) : (lang === "uz" ? "Biznes" : "Бизнес")}</span>
          </div>
          {/* Reyting */}
          {rating > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 4 }}>
              {[1,2,3,4,5].map(n => (
                <span key={n} style={{ fontSize: 11, color: n <= Math.round(rating) ? "#FFB400" : "#E0E0E0" }}>★</span>
              ))}
              <span style={{ fontSize: 11, fontWeight: 700, color: th.text, marginLeft: 2 }}>{rating.toFixed(1)}</span>
              <span style={{ fontSize: 11, color: th.sub }}>({store.reviews.length})</span>
            </div>
          )}
          {/* Masofa + ochiq/yopiq */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: th.sub }}>📍 {distance}</span>
            <span style={{
              fontSize: 10, fontWeight: 700, borderRadius: 5, padding: "1px 6px",
              background: isOpen ? "#16A34A20" : "#55555520",
              color: isOpen ? "#16A34A" : th.sub,
            }}>
              {isOpen ? (lang === "uz" ? "Ochiq" : "Открыто") : (lang === "uz" ? "Yopiq" : "Закрыто")}
            </span>
            {todayHours && todayHours !== "Yopiq" && todayHours !== "Закрыто" && (
              <span style={{ fontSize: 10, color: th.sub }}>{todayHours}</span>
            )}
          </div>
        </div>
        {/* Telefon tugmasi */}
        {store.phone && (
          <button onClick={e => { e.stopPropagation(); window.location.href = `tel:${store.phone}`; }}
            style={{ background: "#16A34A20", border: "none", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, alignSelf: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.4 2 2 0 0 1 3.55 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}

// =====================================================
// KARROT CARD — list view (Karrot uslubi)
// =====================================================
function KarrotCard({ deal, th, lang, tx, savedKeys, heartAnim, toggleSave, setSelectedKey, setViewingStoreId }) {
  const discPrice = deal.originalPrice > 0
    ? Math.round(deal.originalPrice * (1 - deal.discount / 100))
    : 0;
  const timeAgo = (() => {
    const diff = Date.now() - new Date(deal.expiryDate).getTime() + 7 * 24 * 3600 * 1000;
    const days = Math.max(0, Math.floor(diff / 86400000));
    if (days === 0) return lang === "uz" ? "Bugun" : "Сегодня";
    return lang === "uz" ? `${days} kun` : `${days} д.`;
  })();

  return (
    <div style={{ borderBottom: `1px solid ${th.border}`, cursor: "pointer" }}>
      <div style={{ display: "flex", gap: 12, padding: "14px 16px" }}
        onClick={() => setSelectedKey({ storeId: deal.storeId, productId: deal.productId })}>
        {/* Rasm */}
        <div style={{ width: 110, height: 110, borderRadius: 12, overflow: "hidden", flexShrink: 0, background: th.card2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, position: "relative" }}>
          {deal.photos?.length
            ? <img src={deal.photos[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span>{deal.logo}</span>}
          {deal.discount > 0 && (
            <div style={{ position: "absolute", top: 6, left: 6, background: "#16A34A", color: "#fff", borderRadius: 6, padding: "2px 6px", fontSize: 10, fontWeight: 800 }}>
              -{deal.discount}%
            </div>
          )}
        </div>
        {/* Info */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: th.text, lineHeight: 1.4, marginBottom: 4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
              {deal.title?.[lang] || deal.title?.uz}
            </div>
            <div style={{ fontSize: 12, color: th.sub, marginBottom: 6 }}>
              {deal.storeName} · {timeAgo}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              {discPrice > 0 && (
                <span style={{ fontWeight: 800, fontSize: 16, color: th.text }}>
                  {discPrice.toLocaleString("ru-RU")} {lang === "uz" ? "so'm" : "сум"}
                </span>
              )}
              {deal.originalPrice > 0 && deal.discount > 0 && (
                <span style={{ fontSize: 12, color: th.sub, textDecoration: "line-through", marginLeft: 6 }}>
                  {deal.originalPrice.toLocaleString("ru-RU")}
                </span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {deal.delivery && (
                <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={th.sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><polygon points="12 19 19 22 22 19 15 16 12 19"/><line x1="19" y1="22" x2="19" y2="16"/><line x1="15" y1="16" x2="22" y2="16"/></svg>
                </div>
              )}
              <button onClick={e => { e.stopPropagation(); toggleSave(deal.key); }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex", alignItems: "center", gap: 3, animation: heartAnim === deal.key ? "heartPop 0.6s ease" : undefined }}>
                {savedKeys.includes(deal.key)
                  ? <svg width="17" height="17" viewBox="0 0 24 24" fill="#16A34A" stroke="#16A34A" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={th.sub} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// DEAL CARD — yangi katta kartochka
// =====================================================
function DealCard({ deal, th, lang, tx, savedKeys, heartAnim, toggleSave, setSelectedKey, setViewingStoreId }) {
  return (
    <div style={{ background: th.card, borderRadius: 18, marginBottom: 12, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: `1px solid ${th.border}` }}>
      <div style={{ display: "flex", gap: 12, padding: 14 }}>
        {/* Logo / Rasm */}
        <div onClick={() => setSelectedKey({ storeId: deal.storeId, productId: deal.productId })}
          style={{ width: 72, height: 72, borderRadius: 16, overflow: "hidden", flexShrink: 0, background: deal.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, cursor: "pointer", position: "relative" }}>
          {deal.photos?.length ? <img src={deal.photos[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : deal.logo}
          <div style={{ position: "absolute", bottom: 4, right: 4, background: "#16A34A", color: "#fff", borderRadius: 6, padding: "1px 5px", fontSize: 10, fontWeight: 800 }}>-{deal.discount}%</div>
        </div>
        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: th.text, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{deal.storeName}</div>
          <div style={{ fontSize: 12, color: th.sub, marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{deal.title[lang]}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {deal.originalPrice > 0 && (
              <span style={{ fontWeight: 700, fontSize: 13, color: th.text }}>
                {Math.round(deal.originalPrice * (1 - deal.discount / 100)).toLocaleString("ru-RU")} {lang === "uz" ? "so'm" : "сум"}
              </span>
            )}
            <span style={{ fontSize: 10, color: th.sub }}>⏰ {daysLeftLabel(deal.expiryDate, lang)}</span>
            {deal.delivery && <span style={{ fontSize: 10, color: "#16A34A", fontWeight: 700 }}>🚚</span>}
          </div>
        </div>
        {/* Save */}
        <button onClick={() => toggleSave(deal.key)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", alignSelf: "flex-start", animation: heartAnim === deal.key ? "heartPop 0.6s ease" : undefined }}>
          {savedKeys.includes(deal.key) ? "❤️" : "🤍"}
        </button>
      </div>
      {/* Actions */}
      <div style={{ display: "flex", gap: 0, borderTop: `1px solid ${th.border}` }}>
        <button onClick={() => setSelectedKey({ storeId: deal.storeId, productId: deal.productId })}
          style={{ flex: 1, padding: "10px 0", background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#16A34A", borderRight: `1px solid ${th.border}` }}>
          🏷️ {lang === "uz" ? "Aksiya" : "Акция"}
        </button>
        <button onClick={() => setViewingStoreId(deal.storeId)}
          style={{ flex: 1, padding: "10px 0", background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, color: th.sub }}>
          🏪 {lang === "uz" ? "Do'kon" : "Магазин"}
        </button>
      </div>
    </div>
  );
}

// =====================================================
// MAP VIEW
// =====================================================
// FILTER MODAL — narx, chegirma, kategoriya, "hozir ochiq"
// =====================================================
function FilterModal({ lang, dark, filter, onClose, onApply }) {
  const tx = t[lang];
  const th = theme(dark);
  const s = mkStyles(dark);
  const [f, setF] = useState({ ...filter });

  const update = (patch) => setF(prev => ({ ...prev, ...patch }));

  return (
    <ModalSheet onClose={onClose} dark={dark} maxHeight="90vh">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ ...s.secTitle, margin: 0 }}>🎛️ {tx.filterTitle}</h3>
        <button onClick={() => { update({ minPrice: "", maxPrice: "", minDiscount: 0, openNow: false, type: "all" }); }}
          style={{ background: "none", border: "none", color: "#16A34A", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>{tx.resetFilter}</button>
      </div>

      {/* Hozir ochiq */}
      <div onClick={() => update({ openNow: !f.openNow })} style={{
        display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
        background: f.openNow ? "#00B89415" : th.card2, borderRadius: 14,
        border: f.openNow ? "2px solid #00B894" : `2px solid ${th.border}`,
        marginBottom: 16, cursor: "pointer",
      }}>
        <span style={{ fontSize: 22 }}>🟢</span>
        <span style={{ flex: 1, fontWeight: 700, fontSize: 14, color: th.text }}>{tx.openNow}</span>
        <div style={{ width: 44, height: 24, borderRadius: 12, background: f.openNow ? "#00B894" : th.border, position: "relative", transition: "background 0.2s" }}>
          <div style={{ position: "absolute", top: 3, left: f.openNow ? 22 : 3, width: 18, height: 18, borderRadius: 9, background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
        </div>
      </div>

      {/* Do'kon turi */}
      <label style={s.label}>{tx.storeType}</label>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {[["all", tx.storeTypeAll, "🏷️"], ["sell", tx.storeTypeSell, "🛍️"], ["service", tx.storeTypeService, "🛠️"]].map(([val, label, icon]) => (
          <button key={val} onClick={() => update({ type: val })} style={{
            flex: 1, padding: "10px 6px", borderRadius: 12, cursor: "pointer",
            border: f.type === val ? "2px solid #16A34A" : `2px solid ${th.border}`,
            background: f.type === val ? "#F0FDF4" : th.card,
            color: f.type === val ? "#16A34A" : th.sub,
            fontWeight: 700, fontSize: 12,
          }}>{icon} {label}</button>
        ))}
      </div>

      {/* Narx oraligi */}
      <label style={s.label}>💰 {lang === "uz" ? "Narx oralig'i (so'm)" : "Ценовой диапазон (сум)"}</label>
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <input type="number" placeholder={tx.minPrice} value={f.minPrice}
          onChange={e => update({ minPrice: e.target.value })}
          style={{ ...s.input, marginBottom: 0, flex: 1 }} />
        <input type="number" placeholder={tx.maxPrice} value={f.maxPrice}
          onChange={e => update({ maxPrice: e.target.value })}
          style={{ ...s.input, marginBottom: 0, flex: 1 }} />
      </div>

      {/* Min chegirma */}
      <label style={s.label}>🏷️ {lang === "uz" ? `Minimum chegirma: ${f.minDiscount}%` : `Минимальная скидка: ${f.minDiscount}%`}</label>
      <input type="range" min="0" max="90" step="5" value={f.minDiscount}
        onChange={e => update({ minDiscount: Number(e.target.value) })}
        style={{ width: "100%", marginBottom: 8, accentColor: "#16A34A" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: th.sub, marginBottom: 20 }}>
        <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>90%</span>
      </div>

      <button onClick={() => onApply(f)} style={s.btn}>{tx.applyFilter}</button>
    </ModalSheet>
  );
}

// =====================================================
// BOOKING MODAL — xizmat bron qilish
// =====================================================
function BookingModal({ lang, dark, store, onClose, onSuccess }) {
  const tx = t[lang];
  const th = theme(dark);
  const s = mkStyles(dark);
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);

  const times = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];
  const today = new Date().toISOString().slice(0, 10);

  const handleBook = () => {
    const booking = { id: "BK-" + Date.now().toString().slice(-6), storeId: store.id, storeName: store.name, storeLogo: store.logo, storeColor: store.color, date, time, note, status: "pending", createdAt: new Date().toISOString() };
    onSuccess(booking);
    setDone(true);
  };

  if (done) return (
    <ModalSheet onClose={onClose} dark={dark} maxHeight="55vh">
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>📅</div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: th.text, margin: "0 0 8px" }}>{tx.bookingSuccess}</h3>
        <p style={{ color: th.sub, fontSize: 13, margin: "0 0 16px" }}>{tx.bookingSuccessDesc}</p>
        <div style={{ background: th.card2, borderRadius: 14, padding: 16, border: `1px solid ${th.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: th.sub, fontSize: 13 }}>{tx.bookingDate}</span>
            <span style={{ fontWeight: 700, color: th.text }}>{date}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: th.sub, fontSize: 13 }}>{tx.bookingTime}</span>
            <span style={{ fontWeight: 700, color: th.text }}>{time}</span>
          </div>
        </div>
      </div>
      <button onClick={onClose} style={{ ...s.btn, marginTop: 20 }}>OK</button>
    </ModalSheet>
  );

  return (
    <ModalSheet onClose={onClose} dark={dark} maxHeight="85vh">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: store.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{store.logo}</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, color: th.text }}>{store.name}</div>
          <div style={{ fontSize: 12, color: th.sub }}>📅 {tx.bookService}</div>
        </div>
      </div>

      <label style={s.label}>{tx.chooseDate}</label>
      <input type="date" min={today} value={date} onChange={e => setDate(e.target.value)} style={s.input} />

      {date && (
        <>
          <label style={s.label}>{tx.chooseTime}</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
            {times.map(t2 => (
              <button key={t2} onClick={() => setTime(t2)} style={{
                padding: "8px 14px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13,
                border: time === t2 ? "2px solid #16A34A" : `2px solid ${th.border}`,
                background: time === t2 ? "#F0FDF4" : th.card,
                color: time === t2 ? "#16A34A" : th.sub,
              }}>{t2}</button>
            ))}
          </div>
        </>
      )}

      {time && (
        <>
          <label style={s.label}>{lang === "uz" ? "Izoh (ixtiyoriy)" : "Примечание (необязательно)"}</label>
          <textarea placeholder={lang === "uz" ? "Masalan: 2 kishilik stol..." : "Например: Столик на 2 персоны..."} value={note} onChange={e => setNote(e.target.value)} style={s.textarea} />
        </>
      )}

      <button onClick={handleBook} disabled={!date || !time} style={{ ...s.btn, opacity: date && time ? 1 : 0.5 }}>{tx.bookNow}</button>
    </ModalSheet>
  );
}

// =====================================================
// CHAT MODAL — do'kon bilan muloqot
// =====================================================
function ChatModal({ lang, dark, store, messages, onClose, onSend }) {
  const th = theme(dark);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend({ text: text.trim(), from: "user", time: new Date().toISOString() });
    setText("");
    setTimeout(() => {
      onSend({
        text: lang === "uz" ? "Xabaringiz qabul qilindi! Tez orada javob beramiz 😊" : "Ваше сообщение получено! Ответим скоро 😊",
        from: "store", time: new Date().toISOString()
      });
    }, 900);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: th.bg, zIndex: 300, maxWidth: 430, margin: "0 auto", display: "flex", flexDirection: "column" }}>
      {/* Header — Karrot uslubi */}
      <div style={{ background: th.card, borderBottom: `1px solid ${th.border}`, padding: "50px 16px 12px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, marginRight: 2 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={th.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{ width: 42, height: 42, borderRadius: 14, background: store.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, overflow: "hidden" }}>
            {store.photos?.length ? <img src={store.photos[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : store.logo}
          </div>
          <div style={{ position: "absolute", bottom: -2, right: -2, width: 16, height: 16, borderRadius: 8, background: "#16A34A", border: `2px solid ${th.card}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: th.text }}>{store.name}</div>
          <div style={{ fontSize: 12, color: "#16A34A", fontWeight: 500 }}>
            {lang === "uz" ? "● Faol" : "● Онлайн"}
          </div>
        </div>
        <button onClick={() => window.location.href = `tel:${store.phone}`}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={th.sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.4 2 2 0 0 1 3.55 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 8px" }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: th.sub }}>
            <div style={{ width: 72, height: 72, borderRadius: 36, background: th.card2, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 32 }}>{store.logo}</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: th.text, marginBottom: 8 }}>{store.name}</div>
            <div style={{ fontSize: 13, lineHeight: 1.6 }}>
              {lang === "uz" ? "Savol yoki buyurtma uchun yozing 👇" : "Напишите вопрос или заявку 👇"}
            </div>
          </div>
        ) : (
          <div>
            {messages.map((msg, i) => {
              const timeStr = new Date(msg.time).toLocaleTimeString("uz", { hour: "2-digit", minute: "2-digit" });
              const isUser = msg.from === "user";
              return (
                <div key={i} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 8, alignItems: "flex-end", gap: 8 }}>
                  {!isUser && (
                    <div style={{ width: 28, height: 28, borderRadius: 9, background: store.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginBottom: 2 }}>
                      {store.logo}
                    </div>
                  )}
                  <div style={{ maxWidth: "72%" }}>
                    <div style={{
                      padding: "10px 14px",
                      borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      background: isUser ? "#16A34A" : th.card,
                      color: isUser ? "#fff" : th.text,
                      fontSize: 14, lineHeight: 1.5,
                    }}>
                      {msg.text}
                    </div>
                    <div style={{ fontSize: 10, color: th.sub, marginTop: 4, textAlign: isUser ? "right" : "left", paddingLeft: isUser ? 0 : 4, paddingRight: isUser ? 4 : 0 }}>
                      {timeStr}{isUser && " ✓✓"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div style={{ padding: "10px 12px 28px", background: th.card, borderTop: `1px solid ${th.border}`, display: "flex", gap: 8, alignItems: "flex-end" }}>
        <div style={{ flex: 1, background: th.card2, borderRadius: 22, padding: "10px 16px", display: "flex", alignItems: "center" }}>
          <textarea
            placeholder={lang === "uz" ? "Xabar yozing..." : "Написать сообщение..."}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            style={{ flex: 1, background: "none", border: "none", fontSize: 15, outline: "none", resize: "none", color: th.text, minHeight: 24, maxHeight: 90, fontFamily: "inherit", lineHeight: 1.5 }}
            rows={1}
          />
        </div>
        <button onClick={handleSend} disabled={!text.trim()} style={{
          width: 44, height: 44, borderRadius: 22, background: text.trim() ? "#16A34A" : th.card2,
          border: "none", cursor: text.trim() ? "pointer" : "default", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.2s",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={text.trim() ? "#fff" : th.sub} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  );
}

// =====================================================
// STORE ANALYTICS — biznes statistika grafik
// =====================================================
function StoreAnalytics({ lang, dark, store, coupons, bookings }) {
  const tx = t[lang];
  const th = theme(dark);
  const [period, setPeriod] = useState("week");

  const storeCoupons = coupons.filter(c => c.deal?.storeId === store.id || c.storeId === store.id);
  const storeBookings = (bookings || []).filter(b => b.storeId === store.id);

  // Demo weekly data
  const weekDays = lang === "uz" ? ["Du","Se","Ch","Pa","Ju","Sh","Ya"] : ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
  const viewData = [120, 85, 200, 145, 310, 280, 190];
  const maxView = Math.max(...viewData);

  const stats = [
    { icon: "👁️", label: tx.analyticsViews, value: (store.views || 0).toLocaleString(), color: "#0984E3", bg: "#0984E315" },
    { icon: "🎟️", label: tx.analyticsCoupons, value: storeCoupons.length, color: "#16A34A", bg: "#16A34A15" },
    { icon: "📅", label: tx.analyticsBookings, value: storeBookings.length, color: "#00B894", bg: "#00B89415" },
    { icon: "🔔", label: tx.statsSubscribers, value: store.subscriberBase || 0, color: "#FFB400", bg: "#FFB40015" },
  ];

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: th.text, margin: 0 }}>📊 {tx.analyticsTitle}</h3>
        <div style={{ display: "flex", gap: 4, background: th.card2, borderRadius: 10, padding: 3 }}>
          {[["week", tx.analyticsWeek], ["month", tx.analyticsMonth]].map(([val, label]) => (
            <button key={val} onClick={() => setPeriod(val)} style={{
              padding: "4px 10px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700,
              background: period === val ? "#16A34A" : "transparent",
              color: period === val ? "#fff" : th.sub,
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: s.bg, borderRadius: 14, padding: "14px 16px", border: `1px solid ${s.color}30` }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: th.sub, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bar chart — ko'rishlar */}
      <div style={{ background: th.card, borderRadius: 16, padding: "16px 14px", border: `1px solid ${th.border}` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: th.sub, marginBottom: 14 }}>📈 {tx.analyticsViews} ({tx.analyticsWeek})</div>
        <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 80 }}>
          {viewData.map((val, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ fontSize: 9, color: th.sub, fontWeight: 600 }}>{val}</div>
              <div style={{
                width: "100%", borderRadius: "4px 4px 0 0",
                background: `linear-gradient(180deg, #16A34A, #15803D)`,
                height: `${Math.round((val / maxView) * 60)}px`,
                minHeight: 4, transition: "height 0.3s",
                opacity: i === 4 ? 1 : 0.6,
              }} />
              <div style={{ fontSize: 9, color: th.sub }}>{weekDays[i]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function MapView({ lang, deals, stores, onDealClick, dark }) {
  const th = theme(dark);
  const tx = t[lang];
  const mapRef    = useRef(null);
  const leafletMap = useRef(null);
  const markersRef = useRef([]);
  const [selected,    setSelected]    = useState(null);
  const [mapCat,      setMapCat]      = useState("all");
  const [sheetOpen,   setSheetOpen]   = useState(false);

  const MAP_CATS = [
    { id:"all",         uz:"Hammasi",  ru:"Все",      e:"🏷️" },
    { id:"auto",        uz:"Avto",     ru:"Авто",     e:"🚗" },
    { id:"food",        uz:"Ovqat",    ru:"Еда",      e:"🍕" },
    { id:"services",    uz:"Xizmat",   ru:"Услуги",   e:"🛠️" },
    { id:"pharmacy",    uz:"Dorixona", ru:"Аптека",   e:"💊" },
    { id:"restaurant",  uz:"Kafe",     ru:"Кафе",     e:"☕" },
    { id:"beauty",      uz:"Go'zallik",ru:"Красота",  e:"💄" },
    { id:"medical",     uz:"Tibbiyot", ru:"Медицина", e:"🏥" },
  ];

  const filteredDeals = mapCat === "all" ? deals : deals.filter(d => d.category === mapCat);

  useEffect(() => {
    if (!window.L || leafletMap.current) return;
    const L = window.L;

    // Dark map tiles — CartoDB Dark Matter
    const map = L.map(mapRef.current, {
      center: [41.299, 69.240],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      { subdomains: "abcd", maxZoom: 19 }
    ).addTo(map);

    leafletMap.current = map;

    // User pin
    const userIcon = L.divIcon({
      className: "",
      html: `<div style="
        width:16px;height:16px;border-radius:8px;
        background:#16A34A;
        border:3px solid #fff;
        box-shadow:0 0 0 6px rgba(22,163,74,0.25);
      "></div>`,
      iconSize: [16,16], iconAnchor: [8,8],
    });
    L.marker([41.299, 69.240], { icon: userIcon }).addTo(map);

    map.on("click", () => { setSelected(null); setSheetOpen(false); });
  }, []);

  // Markerlarni yangilash (mapCat o'zgarganda)
  useEffect(() => {
    if (!window.L || !leafletMap.current) return;
    const L = window.L;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    filteredDeals.forEach(deal => {
      if (!deal.lat || !deal.lng) return;
      const catObj = MAP_CATS.find(c => c.id === deal.category) || MAP_CATS[0];
      const icon = L.divIcon({
        className: "",
        html: `<div style="
          background:#1C1C1C;
          color:#fff;
          border-radius:50%;
          width:40px;height:40px;
          display:flex;align-items:center;justify-content:center;
          font-size:18px;
          border:2.5px solid #16A34A;
          box-shadow:0 3px 10px rgba(0,0,0,0.5);
          cursor:pointer;
          position:relative;
        ">${deal.logo}
          <div style="
            position:absolute;
            top:-6px;right:-6px;
            background:#16A34A;color:#fff;
            border-radius:6px;padding:1px 4px;
            font-size:9px;font-weight:800;
            line-height:1.4;
          ">-${deal.discount}%</div>
        </div>`,
        iconSize: [40, 40], iconAnchor: [20, 20],
      });
      const marker = L.marker([deal.lat, deal.lng], { icon }).addTo(leafletMap.current);
      marker.on("click", e => {
        e.originalEvent.stopPropagation();
        setSelected(deal);
        setSheetOpen(true);
        leafletMap.current.setView([deal.lat, deal.lng], 15, { animate: true });
      });
      markersRef.current.push(marker);
    });
  }, [mapCat, deals]);

  const isOpen = selected ? isStoreOpen(stores.find(s => s.id === selected.storeId)) : false;

  return (
    <div style={{ position: "relative", background: "#101010", minHeight: "100vh" }}>
      {/* Dark map */}
      <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />

      {/* Kategoriya chiplar — tepada overlay */}
      <div style={{
        position: "absolute", top: 50, left: 0, right: 0, zIndex: 20,
        padding: "10px 12px 0",
        display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none",
      }}>
        {MAP_CATS.map(cat => {
          const active = mapCat === cat.id;
          return (
            <button key={cat.id} onClick={() => setMapCat(cat.id)} style={{
              flexShrink: 0, display: "flex", alignItems: "center", gap: 5,
              padding: "7px 14px", borderRadius: 22,
              background: active ? "#16A34A" : "rgba(28,28,28,0.92)",
              border: active ? "none" : "1px solid rgba(255,255,255,0.12)",
              color: active ? "#fff" : "rgba(255,255,255,0.8)",
              fontWeight: 600, fontSize: 13, cursor: "pointer",
              backdropFilter: "blur(8px)",
              boxShadow: active ? "0 2px 12px rgba(22,163,74,0.4)" : "0 2px 8px rgba(0,0,0,0.4)",
            }}>
              <span style={{ fontSize: 15 }}>{cat.e}</span>
              {lang === "uz" ? cat.uz : cat.ru}
            </button>
          );
        })}
      </div>

      {/* Sol taraf tugmalar */}
      <div style={{ position: "absolute", left: 12, bottom: sheetOpen ? 220 : 100, zIndex: 20, display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>, action: () => {} },
          { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>, action: () => {} },
          { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>, action: () => { if(navigator.geolocation) navigator.geolocation.getCurrentPosition(pos => { leafletMap.current?.setView([pos.coords.latitude, pos.coords.longitude], 16); }); } },
        ].map((btn, i) => (
          <button key={i} onClick={btn.action} style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(28,28,28,0.92)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
            {btn.icon}
          </button>
        ))}
      </div>

      {/* Floating + button */}
      <button style={{
        position: "absolute", right: 16, bottom: sheetOpen ? 220 : 100, zIndex: 20,
        width: 52, height: 52, borderRadius: 26,
        background: "#16A34A",
        border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 20px rgba(22,163,74,0.5)",
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>

      {/* Bottom sheet — tanlangan biznes */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 30,
        background: "rgba(20,20,20,0.96)",
        borderRadius: "20px 20px 0 0",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)",
        transform: sheetOpen ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        paddingBottom: 90,
      }}>
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 8px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)" }} />
        </div>

        {selected && (
          <div style={{ padding: "0 16px 16px" }}>
            {/* Biznes info */}
            <div style={{ display: "flex", gap: 14, marginBottom: 14 }} onClick={() => onDealClick(selected)}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: selected.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0, overflow: "hidden", position: "relative" }}>
                {selected.photos?.length ? <img src={selected.photos[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : selected.logo}
                <div style={{ position: "absolute", top: 4, right: 4, background: "#16A34A", color: "#fff", borderRadius: 6, padding: "1px 5px", fontSize: 10, fontWeight: 800 }}>-{selected.discount}%</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: "#fff", marginBottom: 4 }}>{selected.storeName}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ width: 7, height: 7, borderRadius: 4, background: isOpen ? "#16A34A" : "#888", display: "inline-block" }} />
                  <span style={{ fontSize: 12, color: isOpen ? "#16A34A" : "#888", fontWeight: 600 }}>
                    {isOpen ? (lang === "uz" ? "Hozir ochiq" : "Сейчас открыто") : (lang === "uz" ? "Yopiq" : "Закрыто")}
                  </span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>·</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>📍 {selected.storeAddress}</span>
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>⏰ {daysLeftLabel(selected.expiryDate, lang)} {tx.left}</div>
              </div>
            </div>

            {/* Action tugmalar */}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => onDealClick(selected)} style={{ flex: 2, padding: "12px 0", borderRadius: 12, background: "#16A34A", border: "none", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                {lang === "uz" ? "Batafsil" : "Подробнее"}
              </button>
              {selected.storePhone && (
                <button onClick={() => window.location.href = `tel:${selected.storePhone}`}
                  style={{ flex: 1, padding: "12px 0", borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  📞 {lang === "uz" ? "Qo'ng'iroq" : "Звонок"}
                </button>
              )}
              <button onClick={() => setSheetOpen(false)}
                style={{ width: 46, borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", fontSize: 18, cursor: "pointer" }}>
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================
// MINI MAP PICKER
// =====================================================
function MiniMapPicker({ lang, location, onChange }) {
  const tx = t[lang];
  const svgRef = useRef(null);
  const handleClick = (e) => {
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 380;
    const py = ((e.clientY - rect.top) / rect.height) * 320;
    onChange(fromXY(px, py));
  };
  const pinX = location ? toX(location.lng) : 190;
  const pinY = location ? toY(location.lat) : 160;
  return (
    <div>
      <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "1.5px solid #E8E8E8" }}>
        <svg ref={svgRef} width="100%" viewBox="0 0 380 320" onClick={handleClick} style={{ display: "block", background: "#E8F4E8", cursor: "crosshair" }}>
          <MapBackground />
          {location && (
            <g>
              <circle cx={pinX} cy={pinY} r="16" fill="#16A34A" opacity="0.25" />
              <circle cx={pinX} cy={pinY} r="9" fill="#16A34A" stroke="#fff" strokeWidth="2.5" />
              <text x={pinX} y={pinY + 4} textAnchor="middle" fontSize="11">📍</text>
            </g>
          )}
        </svg>
      </div>
      <p style={{ fontSize: 12, color: location ? "#00B894" : "#AAA", marginTop: 8, fontWeight: 600, textAlign: "center" }}>
        {location ? tx.locationSet : tx.pickOnMapHint}
      </p>
    </div>
  );
}


// =====================================================
// PAYMENT MODAL — Payme / Click / Uzum / Naqd deep link
// =====================================================
function PaymentModal({ lang, dark, total, onClose, onSuccess }) {
  const tx = t[lang];
  const th = theme(dark);
  const s = mkStyles(dark);
  const [method, setMethod] = useState("payme");
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  // Merchantlar (demo). Haqiqiy merchant_id larini shu yerga qo'ying.
  const PAYME_MERCHANT_ID = "6718fbb84bd9b93acbcb1234"; // demo
  const CLICK_SERVICE_ID  = "12345";                     // demo
  const UZUM_SHOP_ID      = "uz_shop_demo";              // demo

  const amountTiyin = Math.round(total * 100); // Payme tiyin hisobida

  const methods = [
    {
      id: "payme",
      label: "Payme",
      icon: "💳",
      color: "#00AAFF",
      logo: "https://payme.uz/favicon.ico",
      desc: lang === "uz" ? "Payme ilovasi orqali" : "Через приложение Payme",
    },
    {
      id: "click",
      label: "Click",
      icon: "🔵",
      color: "#0575E6",
      logo: "https://click.uz/favicon.ico",
      desc: lang === "uz" ? "Click ilovasi orqali" : "Через приложение Click",
    },
    {
      id: "uzum",
      label: "Uzum Pay",
      icon: "🟣",
      color: "#7B2FBE",
      logo: "",
      desc: lang === "uz" ? "Uzum Pay orqali" : "Через Uzum Pay",
    },
    {
      id: "cash",
      label: lang === "uz" ? "Naqd pul" : "Наличные",
      icon: "💵",
      color: "#00B894",
      logo: "",
      desc: lang === "uz" ? "Do'konda naqd to'lov" : "Оплата наличными в магазине",
    },
  ];

  const handlePay = () => {
    if (method === "payme") {
      // Payme deep link: payme://merchant_id/amount
      const paymeStr = "m=" + PAYME_MERCHANT_ID + ";ac.order_id=ORD-" + Date.now() + ";a=" + amountTiyin + ";c=https://lito-brown.vercel.app";
      const link = "https://checkout.paycom.uz/" + btoa(paymeStr);
      window.open(link, "_blank");
      setPaying(true);
      setTimeout(() => { setPaying(false); setPaid(true); setTimeout(() => { onSuccess(); }, 1500); }, 2000);
    } else if (method === "click") {
      // Click deep link
      const link = `https://my.click.uz/services/pay?service_id=${CLICK_SERVICE_ID}&merchant_id=${CLICK_SERVICE_ID}&amount=${total}&transaction_param=ORD-${Date.now()}&return_url=https://lito-brown.vercel.app`;
      window.open(link, "_blank");
      setPaying(true);
      setTimeout(() => { setPaying(false); setPaid(true); setTimeout(() => { onSuccess(); }, 1500); }, 2000);
    } else if (method === "uzum") {
      const link = `https://uzum.uz/pay?shop=${UZUM_SHOP_ID}&amount=${total}`;
      window.open(link, "_blank");
      setPaying(true);
      setTimeout(() => { setPaying(false); setPaid(true); setTimeout(() => { onSuccess(); }, 1500); }, 2000);
    } else {
      // Naqd pul — to'g'ridan-to'g'ri muvaffaqiyat
      onSuccess();
    }
  };

  const selectedMethod = methods.find(m => m.id === method);

  if (paid) return (
    <ModalSheet onClose={onClose} dark={dark} maxHeight="50vh">
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>✅</div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: th.text, margin: "0 0 8px" }}>
          {lang === "uz" ? "To'lov tasdiqlandi!" : "Оплата подтверждена!"}
        </h3>
        <p style={{ color: th.sub, fontSize: 13 }}>
          {lang === "uz" ? "Buyurtmangiz qabul qilindi" : "Ваш заказ принят"}
        </p>
      </div>
    </ModalSheet>
  );

  return (
    <ModalSheet onClose={onClose} dark={dark} maxHeight="85vh">
      <h3 style={{ ...s.secTitle, textAlign: "center", marginBottom: 6 }}>{tx.payTitle}</h3>
      <p style={{ textAlign: "center", color: th.sub, fontSize: 13, marginBottom: 20 }}>
        {lang === "uz" ? "Qulay to'lov usulini tanlang" : "Выберите удобный способ оплаты"}
      </p>

      {/* To'lov usullari */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {methods.map((m) => (
          <button key={m.id} onClick={() => setMethod(m.id)} style={{
            padding: "14px 10px", borderRadius: 16, cursor: "pointer", textAlign: "center",
            border: `2.5px solid ${method === m.id ? m.color : th.border}`,
            background: method === m.id ? m.color + "12" : th.card,
            transition: "all 0.2s",
            position: "relative",
          }}>
            {method === m.id && (
              <div style={{ position: "absolute", top: 8, right: 8, width: 16, height: 16, borderRadius: 8, background: m.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontSize: 10, fontWeight: 900 }}>✓</span>
              </div>
            )}
            <div style={{ fontSize: 28, marginBottom: 6 }}>{m.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: method === m.id ? m.color : th.text }}>{m.label}</div>
            <div style={{ fontSize: 10, color: th.sub, marginTop: 3 }}>{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Jami summa */}
      <div style={{
        background: "linear-gradient(135deg, #16A34A, #15803D)",
        borderRadius: 16, padding: "16px 20px", marginBottom: 20,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 600 }}>{tx.total}</div>
          <div style={{ color: "#fff", fontWeight: 900, fontSize: 24 }}>{formatPrice(total)} {tx.sumShort}</div>
        </div>
        <div style={{ fontSize: 36 }}>{selectedMethod?.icon}</div>
      </div>

      {/* Payme/Click haqida izoh */}
      {(method === "payme" || method === "click" || method === "uzum") && (
        <div style={{
          background: selectedMethod.color + "12",
          border: `1px solid ${selectedMethod.color}40`,
          borderRadius: 12, padding: "10px 14px", marginBottom: 16,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 20 }}>ℹ️</span>
          <span style={{ fontSize: 12, color: th.text, lineHeight: 1.5 }}>
            {lang === "uz"
              ? `${selectedMethod.label} ilovasi ochiladi. To'lovni amalga oshirgach qaytib keling.`
              : `Откроется приложение ${selectedMethod.label}. После оплаты вернитесь обратно.`}
          </span>
        </div>
      )}

      <button onClick={handlePay} disabled={paying} style={{
        ...s.btn,
        background: paying ? "#AAA" : (selectedMethod?.color || "#16A34A"),
        boxShadow: `0 4px 16px ${(selectedMethod?.color || "#16A34A")}50`,
        marginBottom: 10,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        {paying ? (
          <span>{lang === "uz" ? "⏳ Kutilmoqda..." : "⏳ Ожидание..."}</span>
        ) : (
          <span>{selectedMethod?.icon} {tx.payNow} — {formatPrice(total)} {tx.sumShort}</span>
        )}
      </button>
      <button onClick={onClose} style={{ ...s.ghostBtn }}>{tx.cancel}</button>
    </ModalSheet>
  );
}

// =====================================================
// COUPON MODAL
// =====================================================
function CouponModal({ lang, dark, deal, onClose, onGetCoupon }) {
  const tx = t[lang];
  const s = mkStyles(dark);
  const [received, setReceived] = useState(false);
  const [code] = useState(genCouponCode);

  const handleGet = () => {
    onGetCoupon({ code, deal, obtainedAt: new Date().toISOString(), used: false });
    setReceived(true);
  };

  if (received) return (
    <ModalSheet onClose={onClose} dark={dark} maxHeight="65vh">
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>🎟️</div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1A1A2E", margin: "0 0 6px" }}>{tx.couponTitle}</h3>
        <p style={{ color: "#888", fontSize: 13, margin: "0 0 20px" }}>{tx.couponSaved}</p>
        <div style={{ background: "#F0FDF4", borderRadius: 16, padding: "18px 20px", marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "#AAA", fontWeight: 600, marginBottom: 6 }}>{tx.couponCode}</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#16A34A", letterSpacing: 3, fontFamily: "monospace" }}>{code}</div>
        </div>
        <QRCode code={code} color={deal.color} />
        <div style={{ background: "#F7F8FA", borderRadius: 12, padding: "12px 16px", display: "flex", justifyContent: "space-between", marginTop: 12 }}>
          <span style={{ color: "#888", fontSize: 13 }}>{tx.couponExpiry}</span>
          <span style={{ fontWeight: 700, color: "#1A1A2E", fontSize: 13 }}>{daysLeftLabel(deal.expiryDate, lang)} {tx.left}</span>
        </div>
      </div>
      <button onClick={onClose} style={{ ...s.btn, marginTop: 20 }}>OK</button>
    </ModalSheet>
  );

  return (
    <ModalSheet onClose={onClose} dark={dark} maxHeight="60vh">
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>{deal.logo}</div>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: "#1A1A2E", margin: "0 0 4px" }}>{deal.storeName}</h3>
        <p style={{ color: "#888", fontSize: 13, margin: "0 0 16px" }}>{deal.title[lang]}</p>
        <div style={{ background: deal.color + "18", borderRadius: 14, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 44, fontWeight: 900, color: deal.color }}>-{deal.discount}%</div>
          {deal.originalPrice > 0 && (
            <div style={{ fontSize: 13, color: "#888", marginTop: 6 }}>
              <span style={{ textDecoration: "line-through" }}>{formatPrice(deal.originalPrice)}</span>
              {" → "}
              <b style={{ color: "#1A1A2E" }}>{formatPrice(deal.originalPrice * (1 - deal.discount / 100))} {tx.sumShort}</b>
            </div>
          )}
        </div>
      </div>
      <button onClick={handleGet} style={{ ...s.btn, marginBottom: 10 }}>{tx.getCoupon}</button>
      <button onClick={onClose} style={s.ghostBtn}>{tx.cancel}</button>
    </ModalSheet>
  );
}


// =====================================================
// CHECKOUT MODAL — Payme/Click to'lov bilan
// =====================================================
function CheckoutModal({ lang, dark, cartDetailed, cartTotal, onClose, onSuccess }) {
  const tx = t[lang];
  const s = mkStyles(dark);
  const th = theme(dark);
  const [deliveryMethod, setDeliveryMethod] = useState("pickup");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("payme");
  const [loading, setLoading] = useState(false);
  const canOrder = deliveryMethod === "pickup" || address.trim().length > 2;

  const PAYME_MERCHANT_ID = "6718fbb84bd9b93acbcb1234";
  const CLICK_SERVICE_ID  = "12345";

  const paymentMethods = [
    { id: "payme",  label: "Payme",    icon: "💳", color: "#00AAFF" },
    { id: "click",  label: "Click",    icon: "🔵", color: "#0575E6" },
    { id: "uzum",   label: "Uzum Pay", icon: "🟣", color: "#7B2FBE" },
    { id: "cash",   label: lang === "uz" ? "Naqd" : "Наличные", icon: "💵", color: "#00B894" },
  ];

  const handleOrder = () => {
    if (!canOrder) return;
    const orderId = "ORD-" + Date.now().toString().slice(-6);
    if (payment === "payme") {
      const amountTiyin = Math.round(cartTotal * 100);
      const paymeStr2 = "m=" + PAYME_MERCHANT_ID + ";ac.order_id=" + orderId + ";a=" + amountTiyin + ";c=https://lito-brown.vercel.app";
      const encoded = btoa(paymeStr2);
      window.open(`https://checkout.paycom.uz/${encoded}`, "_blank");
      setLoading(true);
      setTimeout(() => { setLoading(false); onSuccess(orderId); }, 1500);
    } else if (payment === "click") {
      const link = `https://my.click.uz/services/pay?service_id=${CLICK_SERVICE_ID}&merchant_id=${CLICK_SERVICE_ID}&amount=${cartTotal}&transaction_param=${orderId}&return_url=https://lito-brown.vercel.app`;
      window.open(link, "_blank");
      setLoading(true);
      setTimeout(() => { setLoading(false); onSuccess(orderId); }, 1500);
    } else if (payment === "uzum") {
      window.open(`https://uzum.uz/pay?amount=${cartTotal}`, "_blank");
      setLoading(true);
      setTimeout(() => { setLoading(false); onSuccess(orderId); }, 1500);
    } else {
      setLoading(true);
      setTimeout(() => { setLoading(false); onSuccess(orderId); }, 1000);
    }
  };

  return (
    <ModalSheet onClose={onClose} dark={dark} maxHeight="92vh">
      <h3 style={{ ...s.secTitle, textAlign: "center", marginBottom: 16 }}>{tx.checkoutTitle}</h3>

      {/* Mahsulotlar */}
      <div style={{ background: th.card2, borderRadius: 14, padding: 14, marginBottom: 16 }}>
        {cartDetailed.map((item) => (
          <div key={item.key} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${th.border}` }}>
            <span style={{ fontSize: 13, color: th.sub }}>{item.name} × {item.qty}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: th.text }}>{formatPrice(item.price * item.qty)} {tx.sumShort}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10 }}>
          <span style={{ fontWeight: 700, color: th.text }}>{tx.total}</span>
          <span style={{ fontWeight: 900, fontSize: 16, color: "#16A34A" }}>{formatPrice(cartTotal)} {tx.sumShort}</span>
        </div>
      </div>

      {/* Yetkazib berish */}
      <label style={s.label}>{tx.deliveryMethod}</label>
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        {[["pickup", tx.pickup, "🏪"], ["delivery", tx.delivery, "🚚"]].map(([val, label, icon]) => (
          <button key={val} onClick={() => setDeliveryMethod(val)} style={{
            flex: 1, padding: "12px 8px", borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: "pointer",
            border: deliveryMethod === val ? "2px solid #16A34A" : `2px solid ${th.border}`,
            background: deliveryMethod === val ? "#F0FDF4" : th.card,
            color: deliveryMethod === val ? "#16A34A" : th.sub,
          }}>{icon} {label}</button>
        ))}
      </div>
      {deliveryMethod === "delivery" && (
        <>
          <label style={s.label}>{tx.deliveryAddress} <span style={{ color: "#16A34A" }}>*</span></label>
          <input placeholder={tx.deliveryAddressPh} value={address} onChange={(e) => setAddress(e.target.value)} style={s.input} />
        </>
      )}

      {/* To'lov usuli */}
      <label style={s.label}>{tx.paymentMethod}</label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
        {paymentMethods.map((m) => (
          <button key={m.id} onClick={() => setPayment(m.id)} style={{
            padding: "12px 8px", borderRadius: 14, fontWeight: 700, fontSize: 13, cursor: "pointer",
            border: payment === m.id ? `2.5px solid ${m.color}` : `2px solid ${th.border}`,
            background: payment === m.id ? m.color + "12" : th.card,
            color: payment === m.id ? m.color : th.sub,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            position: "relative",
          }}>
            {payment === m.id && (
              <div style={{ position: "absolute", top: 6, right: 6, width: 14, height: 14, borderRadius: 7, background: m.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontSize: 9, fontWeight: 900 }}>✓</span>
              </div>
            )}
            <span style={{ fontSize: 22 }}>{m.icon}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Payme/Click haqida izoh */}
      {(payment === "payme" || payment === "click" || payment === "uzum") && (
        <div style={{ background: th.card2, borderRadius: 12, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: th.sub, display: "flex", gap: 8, alignItems: "flex-start" }}>
          <span>ℹ️</span>
          <span>
            {lang === "uz"
              ? `${paymentMethods.find(m => m.id === payment)?.label} ilovasi ochiladi. To'lovni amalga oshirgach buyurtma tasdiqlanadi.`
              : `Откроется приложение ${paymentMethods.find(m => m.id === payment)?.label}. После оплаты заказ будет подтверждён.`}
          </span>
        </div>
      )}

      <button onClick={handleOrder} disabled={!canOrder || loading} style={{
        ...s.btn,
        opacity: canOrder && !loading ? 1 : 0.6,
        background: loading ? "#AAA" : "#16A34A",
      }}>
        {loading ? (lang === "uz" ? "⏳ Kutilmoqda..." : "⏳ Ожидание...") : `${tx.placeOrder} — ${formatPrice(cartTotal)} ${tx.sumShort}`}
      </button>
    </ModalSheet>
  );
}

// =====================================================
// ORDER SUCCESS SCREEN
// =====================================================
function OrderSuccess({ lang, dark, orderNumber, onDone }) {
  const tx = t[lang];
  const s = mkStyles(dark);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", maxWidth: 430, margin: "0 auto" }}>
      <div style={{ background: "#fff", borderRadius: 24, padding: 32, width: "88%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1A1A2E", margin: "0 0 8px" }}>{tx.orderSuccess}</h2>
        <p style={{ color: "#888", fontSize: 13, margin: "0 0 20px" }}>{tx.orderSuccessDesc}</p>
        <div style={{ background: "#F7F8FA", borderRadius: 12, padding: "12px 16px", marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: "#AAA" }}>{tx.orderNumber}</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#16A34A", fontFamily: "monospace" }}>#{orderNumber}</div>
        </div>
        <button onClick={onDone} style={s.btn}>{tx.orderSuccessBtn}</button>
      </div>
    </div>
  );
}

// =====================================================
// EDIT PROFILE MODAL
// =====================================================
function EditProfileModal({ lang, dark, userData, onClose, onSave }) {
  const tx = t[lang];
  const s = mkStyles(dark);
  const [form, setForm] = useState({ ...userData });
  return (
    <ModalSheet onClose={onClose} dark={dark} maxHeight="75vh">
      <h3 style={{ ...s.secTitle, textAlign: "center", marginBottom: 16 }}>{tx.editProfile}</h3>
      <label style={s.label}>{tx.enterName}</label>
      <input placeholder={tx.namePlaceholder} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={s.input} />
      <label style={s.label}>{tx.enterSurname}</label>
      <input placeholder={tx.surnamePlaceholder} value={form.surname} onChange={(e) => setForm({ ...form, surname: e.target.value })} style={s.input} />
      <label style={s.label}>{tx.enterPhone}</label>
      <input type="tel" placeholder={tx.phonePlaceholder} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={s.input} />
      <button onClick={() => onSave(form)} style={{ ...s.btn, marginBottom: 10 }}>{tx.saveProfile}</button>
      <button onClick={onClose} style={s.ghostBtn}>{tx.cancel}</button>
    </ModalSheet>
  );
}


// =====================================================
// DISCOUNT MODAL
// =====================================================
function DiscountModal({ lang, dark, product, onClose, onApply }) {
  const tx = t[lang];
  const s = mkStyles(dark);
  const [percent, setPercent] = useState(product.discount?.percent?.toString() || "");
  const [expiry, setExpiry] = useState(product.discount?.expiryDate || isoDaysFromNow(3));
  const canApply = percent && Number(percent) > 0 && Number(percent) < 100 && expiry;
  return (
    <ModalSheet onClose={onClose} dark={dark} maxHeight="70vh">
      <h3 style={{ ...s.secTitle, textAlign: "center" }}>{tx.discountModalTitle}</h3>
      <p style={{ ...s.secDesc, textAlign: "center" }}>{product.name[lang] || product.name.uz}</p>
      <label style={s.label}>{tx.discountPercent}</label>
      <input type="number" min="1" max="99" placeholder="30" value={percent}
        onChange={(e) => setPercent(e.target.value)} style={s.input} />
      <label style={s.label}>{tx.expiryDate}</label>
      <input type="date" value={expiry} min={new Date().toISOString().slice(0, 10)}
        onChange={(e) => setExpiry(e.target.value)} style={s.input} />
      {product.originalPrice > 0 && percent && (
        <div style={{ background: "#F0FDF4", borderRadius: 14, padding: 16, marginBottom: 16, textAlign: "center" }}>
          <span style={{ textDecoration: "line-through", color: "#AAA", fontSize: 13 }}>{formatPrice(product.originalPrice)} {tx.sumShort}</span>
          {" → "}
          <b style={{ color: "#16A34A", fontSize: 17 }}>{formatPrice(product.originalPrice * (1 - Number(percent) / 100))} {tx.sumShort}</b>
        </div>
      )}
      <button onClick={() => canApply && onApply({ percent: Number(percent), expiryDate: expiry })}
        style={{ ...s.btn, opacity: canApply ? 1 : 0.5, marginBottom: 10 }}>{tx.applyDiscount}</button>
      <button onClick={onClose} style={s.ghostBtn}>{tx.cancel}</button>
    </ModalSheet>
  );
}

// =====================================================
// REVIEW MODAL
// =====================================================
function ReviewModal({ lang, dark, title, onClose, onSubmit }) {
  const tx = t[lang];
  const s = mkStyles(dark);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  return (
    <ModalSheet onClose={onClose} dark={dark} maxHeight="60vh">
      <h3 style={{ ...s.secTitle, textAlign: "center" }}>{title}</h3>
      <div style={{ display: "flex", justifyContent: "center", margin: "16px 0 20px" }}>
        <StarRating value={stars} onChange={setStars} size={34} />
      </div>
      <textarea placeholder={tx.commentPh} value={comment}
        onChange={(e) => setComment(e.target.value)} style={s.textarea} />
      <button onClick={() => stars > 0 && onSubmit({ stars, comment })}
        style={{ ...s.btn, opacity: stars > 0 ? 1 : 0.5, marginBottom: 10 }}>{tx.submitReview}</button>
      <button onClick={onClose} style={s.ghostBtn}>{tx.cancel}</button>
    </ModalSheet>
  );
}

// =====================================================
// STORE STATS PANEL
// =====================================================
function StoreStats({ lang, dark, store, coupons }) {
  const th = theme(dark);
  const tx = t[lang];
  const storeCoupons = coupons.filter((c) => c.deal?.storeId === store.id || c.storeId === store.id);
  const usedCoupons = storeCoupons.filter((c) => c.used).length;
  const stats = [
    { icon: "👁️", label: tx.statsViews, value: (store.views || 0).toLocaleString("ru-RU"), color: "#0984E3" },
    { icon: "🎟️", label: tx.statsCoupons, value: storeCoupons.length, color: "#16A34A" },
    { icon: "🔔", label: tx.statsSubscribers, value: (store.subscriberBase || 0), color: "#00B894" },
    { icon: "💰", label: tx.statsRevenue, value: formatPrice(usedCoupons * 50000) + " " + tx.sumShort, color: "#FFB400" },
  ];
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 15, fontWeight: 800, color: th.text, margin: "0 0 12px" }}>📊 {tx.statsTitle}</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: s.color + "15", borderRadius: 14, padding: "14px 16px", border: `1px solid ${s.color}30` }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: th.sub, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


// =====================================================
// COUPON CARD (with QR)
// =====================================================
function CouponCard({ coupon, lang, dark, onUse }) {
  const th = theme(dark);
  const tx = t[lang];
  const [showQR, setShowQR] = useState(false);
  const color = coupon.deal?.color || "#16A34A";
  const storeName = coupon.deal?.storeName || coupon.storeName || "";
  const productName = coupon.deal?.title?.[lang] || coupon.productName?.[lang] || "";
  const discount = coupon.deal?.discount || coupon.discount || 0;
  const logo = coupon.deal?.logo || coupon.logo || "🏷️";
  const expiryDate = coupon.deal?.expiryDate || coupon.expiryDate || "";

  return (
    <div style={{
      background: th.card, borderRadius: 18, overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)", marginBottom: 14,
      border: `1px solid ${coupon.used ? th.border : color + "44"}`,
    }}>
      <div style={{
        background: coupon.used ? th.card2 : `linear-gradient(135deg,${color},${color}cc)`,
        padding: "16px 18px", display: "flex", alignItems: "center", gap: 12,
      }}>
        <span style={{ fontSize: 28 }}>{logo}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: coupon.used ? th.sub : "#fff" }}>{storeName}</div>
          <div style={{ fontSize: 12, color: coupon.used ? th.sub : "rgba(255,255,255,0.85)" }}>{productName}</div>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.25)", borderRadius: 10, padding: "6px 12px",
          fontWeight: 900, fontSize: 18, color: coupon.used ? th.sub : "#fff",
        }}>-{discount}%</div>
      </div>
      <div style={{ padding: "14px 18px" }}>
        {showQR ? (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <QRCode code={coupon.code} color={coupon.used ? "#aaa" : color} />
            <div style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 900, letterSpacing: 4, color: coupon.used ? "#aaa" : color, margin: "12px 0 4px" }}>{coupon.code}</div>
            <div style={{ fontSize: 12, color: th.sub, marginBottom: 12 }}>{tx.couponHint}</div>
            {!coupon.used ? (
              <button onClick={() => onUse(coupon.code)} style={{
                background: "#16A34A", color: "#fff", border: "none", borderRadius: 12,
                padding: "10px 24px", fontWeight: 700, cursor: "pointer", fontSize: 13,
              }}>{tx.useCoupon}</button>
            ) : (
              <div style={{ color: "#aaa", fontWeight: 700, fontSize: 13 }}>✓ {tx.couponUsed}</div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, color: th.sub }}>{tx.expires}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: th.text }}>{expiryDate ? daysLeftLabel(expiryDate, lang) : "—"}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: th.sub }}>{tx.couponCode}</div>
              <div style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 900, color: coupon.used ? "#aaa" : color }}>{coupon.code}</div>
            </div>
            <button onClick={() => setShowQR(true)} style={{
              background: coupon.used ? th.card2 : "#16A34A",
              color: coupon.used ? th.sub : "#fff", border: "none", borderRadius: 12,
              padding: "8px 16px", fontWeight: 700, cursor: "pointer", fontSize: 12,
            }}>
              {coupon.used ? `✓ ${tx.couponUsed}` : "QR"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================
// MY COUPONS PAGE
// =====================================================
function MyCouponsPage({ lang, dark, coupons, onBack, onUseCoupon }) {
  const tx = t[lang];
  const th = theme(dark);
  const s = mkStyles(dark);
  return (
    <div style={{ padding: "48px 20px 20px", background: th.bg, minHeight: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={onBack} style={{ background: th.card, border: `1.5px solid ${th.border}`, borderRadius: 10, width: 34, height: 34, fontSize: 16, cursor: "pointer", color: th.text }}>←</button>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: th.text, margin: 0 }}>{tx.myCouponsTitle}</h2>
      </div>
      {coupons.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: th.sub }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🎟️</div>
          <div style={{ fontWeight: 600, fontSize: 16 }}>{tx.noCoupons}</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>{tx.noCouponsDesc}</div>
        </div>
      ) : coupons.map((coupon, i) => (
        <CouponCard key={coupon.code || i} coupon={coupon} lang={lang} dark={dark} onUse={onUseCoupon} />
      ))}
    </div>
  );
}


// =====================================================
// STORE VIEW
// =====================================================
function StoreView({ lang, dark, store, isOwner, isSubscribed, coupons, bookings,
  onBack, onSubscribeToggle, onAddProduct, onApplyDiscount,
  onRemoveDiscount, onDeleteProduct, onRateProduct, onRateStore, onOpenDeal,
  onBook, onChat }) {
  const tx = t[lang];
  const th = theme(dark);
  const s = mkStyles(dark);
  const [discountTarget, setDiscountTarget] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const storeRating = avgRating(store.reviews);

  const handleCall = () => { if (store.phone) window.location.href = `tel:${store.phone}`; };
  const handleWhatsApp = () => { const p = (store.whatsapp || store.phone || "").replace(/\D/g, ""); window.open(`https://wa.me/${p}`, "_blank"); };
  const handleTelegram = () => {
    if (store.telegram) window.open(`https://t.me/${store.telegram.replace("@","")}`, "_blank");
    else { const p = (store.phone || "").replace(/\D/g, ""); window.open(`https://t.me/+${p}`, "_blank"); }
  };
  const handleShare = () => {
    const text = `${store.name} — OsonTop`;
    if (navigator.share) navigator.share({ title: store.name, text });
  };

  return (
    <div style={{ minHeight: "100vh", background: th.bg, maxWidth: 430, margin: "0 auto", paddingBottom: 30 }}>
      <div style={{ background: "linear-gradient(135deg,#16A34A 0%,#15803D 100%)", padding: "48px 20px 22px", color: "#fff" }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, width: 34, height: 34, color: "#fff", fontSize: 16, cursor: "pointer", marginBottom: 16 }}>←</button>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>{store.logo}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 19, fontWeight: 900 }}>{store.name}</div>
            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>📍 {store.address}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, fontSize: 12 }}>
              <span style={{ color: "#FFB400" }}>★</span>
              <span style={{ fontWeight: 700 }}>{storeRating ? storeRating.toFixed(1) : "—"}</span>
              <span style={{ opacity: 0.7 }}>({store.reviews.length})</span>
              <span style={{ opacity: 0.6 }}>· {(store.subscriberBase || 0)} {tx.subscribers}</span>
            </div>
            {store.workHours && (() => {
              const open = isStoreOpen(store);
              const days = ["sun","mon","tue","wed","thu","fri","sat"];
              const dayKey = days[new Date().getDay()];
              const hours = store.workHours[dayKey];
              return (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                  <span style={{ width: 7, height: 7, borderRadius: 4, background: open ? "#00FF88" : "#FF4444", display: "inline-block" }} />
                  <span style={{ fontSize: 11, color: open ? "#00FF88" : "#FF8888", fontWeight: 700 }}>
                    {open ? tx.openNow : tx.closedNow}
                  </span>
                  {hours && hours !== "Yopiq" && <span style={{ fontSize: 11, opacity: 0.7 }}>· {hours}</span>}
                </div>
              );
            })()}
          </div>
        </div>
        {!isOwner && (
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            {store.phone && <button onClick={handleCall} style={{ flex: 1, minWidth: 70, padding: "10px 6px", borderRadius: 12, border: "none", background: "rgba(255,255,255,0.25)", color: "#fff", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>{tx.callStore}</button>}
            {(store.telegram || store.phone) && <button onClick={handleTelegram} style={{ flex: 1, minWidth: 70, padding: "10px 6px", borderRadius: 12, border: "none", background: "rgba(0,136,204,0.4)", color: "#fff", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>✈️ Telegram</button>}
            {onChat && <button onClick={onChat} style={{ flex: 1, minWidth: 70, padding: "10px 6px", borderRadius: 12, border: "none", background: "rgba(255,255,255,0.25)", color: "#fff", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>💬 {tx.chatWith}</button>}
            {onBook && <button onClick={onBook} style={{ flex: 1, minWidth: 70, padding: "10px 6px", borderRadius: 12, border: "none", background: "rgba(255,180,0,0.4)", color: "#fff", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>{tx.bookService}</button>}
            <button onClick={handleShare} style={{ flex: 1, minWidth: 70, padding: "10px 6px", borderRadius: 12, border: "none", background: "rgba(255,255,255,0.25)", color: "#fff", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>{tx.shareDiscount}</button>
          </div>
        )}
        {isOwner
          ? <div style={{ marginTop: 12, background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: "8px 12px", fontSize: 12, fontWeight: 700, textAlign: "center" }}>{tx.ownStoreBadge}</div>
          : <button onClick={onSubscribeToggle} style={{ marginTop: 12, width: "100%", padding: "12px", borderRadius: 14, border: "none", cursor: "pointer", fontWeight: 800, fontSize: 14, background: isSubscribed ? "rgba(255,255,255,0.25)" : "#fff", color: isSubscribed ? "#fff" : "#16A34A" }}>
              {isSubscribed ? tx.subscribed : tx.subscribe}
            </button>
        }
      </div>

      <div style={{ padding: 20 }}>
        {isOwner && <StoreAnalytics lang={lang} dark={dark} store={store} coupons={coupons || []} bookings={bookings || []} />}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: th.text }}>{tx.productsInStore}</h3>
          {isOwner && <button onClick={onAddProduct} style={{ background: "#16A34A", color: "#fff", border: "none", borderRadius: 10, padding: "7px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{tx.addProductBtn}</button>}
        </div>

        {store.products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: th.sub }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
            <div style={{ fontWeight: 600 }}>{tx.noProductsInStore}</div>
            <div style={{ fontSize: 13, marginTop: 4, marginBottom: isOwner ? 20 : 0 }}>{tx.noProductsInStoreDesc}</div>
            {isOwner && <button onClick={onAddProduct} style={{ ...s.btn, width: "auto", padding: "12px 22px" }}>{tx.addProductBtn}</button>}
          </div>
        ) : store.products.map((prod) => {
          const hasDiscount = prod.discount && !isExpired(prod.discount.expiryDate);
          const pRating = avgRating(prod.reviews);
          return (
            <div key={prod.id} style={{ background: th.card, borderRadius: 16, padding: 14, marginBottom: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div onClick={() => !isOwner && onOpenDeal && hasDiscount && onOpenDeal(store.id, prod.id)}
                  style={{ width: 60, height: 60, borderRadius: 12, overflow: "hidden", flexShrink: 0, background: store.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, cursor: hasDiscount ? "pointer" : "default" }}>
                  {prod.photos?.length ? <img src={prod.photos[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : store.logo}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: th.text }}>{prod.name[lang] || prod.name.uz}</div>
                  <div style={{ fontSize: 11, color: th.sub, margin: "2px 0" }}>{categoryLabel(prod.category, lang)}</div>
                  {prod.originalPrice > 0 && (
                    hasDiscount ? (
                      <div style={{ fontSize: 12 }}>
                        <span style={{ textDecoration: "line-through", color: "#AAA" }}>{formatPrice(prod.originalPrice)}</span>{" "}
                        <b style={{ color: "#16A34A" }}>{formatPrice(prod.originalPrice * (1 - prod.discount.percent / 100))} {tx.sumShort}</b>
                      </div>
                    ) : <div style={{ fontSize: 12, color: th.text, fontWeight: 700 }}>{formatPrice(prod.originalPrice)} {tx.sumShort}</div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                    <StarRating value={Math.round(pRating)} readOnly size={12} />
                    <span style={{ fontSize: 11, color: "#AAA" }}>({prod.reviews?.length || 0})</span>
                    {prod.delivery && <span style={{ fontSize: 10, color: "#00B894", fontWeight: 700 }}>🚚</span>}
                    {hasDiscount && <span style={{ background: store.color, color: "#fff", borderRadius: 7, padding: "2px 7px", fontSize: 11, fontWeight: 800, marginLeft: "auto" }}>-{prod.discount.percent}%</span>}
                  </div>
                </div>
                {isOwner && <button onClick={() => setDeleteTarget(prod.id)} style={{ background: "none", border: "none", color: "#16A34A", fontSize: 13, cursor: "pointer", alignSelf: "flex-start" }}>✕</button>}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                {isOwner ? (
                  <button onClick={() => setDiscountTarget(prod)} style={{ flex: 1, padding: "9px", borderRadius: 10, border: "none", background: hasDiscount ? th.card2 : "#F0FDF4", color: hasDiscount ? th.sub : "#16A34A", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                    {hasDiscount ? tx.editDiscount : tx.makeDiscount}
                  </button>
                ) : (
                  <button onClick={() => setReviewTarget(prod.id)} style={{ flex: 1, padding: "9px", borderRadius: 10, border: `1.5px solid ${th.border}`, background: th.card, color: th.sub, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>⭐ {tx.rateProduct}</button>
                )}
                {hasDiscount && isOwner && (
                  <button onClick={() => onRemoveDiscount(prod.id)} style={{ flex: 1, padding: "9px", borderRadius: 10, border: `1.5px solid ${th.border}`, background: th.card, color: "#AAA", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>{tx.removeDiscount}</button>
                )}
              </div>
            </div>
          );
        })}

        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: th.text }}>{tx.storeReviews}</h3>
            {!isOwner && <button onClick={() => setReviewTarget("store")} style={{ background: th.card, border: "1.5px solid #16A34A", color: "#16A34A", borderRadius: 10, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{tx.leaveReview}</button>}
          </div>
          {store.reviews.length === 0 ? (
            <p style={{ color: th.sub, fontSize: 13 }}>{tx.noReviews}</p>
          ) : store.reviews.map((r, i) => (
            <div key={i} style={{ background: th.card, borderRadius: 14, padding: 14, marginBottom: 10, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: th.text }}>{r.author}</span>
                <StarRating value={r.stars} readOnly size={13} />
              </div>
              {r.comment && <p style={{ margin: 0, fontSize: 13, color: th.sub }}>{r.comment}</p>}
            </div>
          ))}
        </div>
      </div>

      {discountTarget && <DiscountModal lang={lang} dark={dark} product={discountTarget}
        onClose={() => setDiscountTarget(null)}
        onApply={(d) => { onApplyDiscount(discountTarget.id, d); setDiscountTarget(null); }} />}
      {reviewTarget && <ReviewModal lang={lang} dark={dark}
        title={reviewTarget === "store" ? tx.leaveReview + " — " + store.name : tx.rateProduct}
        onClose={() => setReviewTarget(null)}
        onSubmit={(review) => {
          if (reviewTarget === "store") onRateStore(review);
          else onRateProduct(reviewTarget, review);
          setReviewTarget(null);
        }} />}
      {deleteTarget && (
        <ModalSheet onClose={() => setDeleteTarget(null)} dark={dark} maxHeight="40vh">
          <p style={{ fontSize: 15, color: th.text, fontWeight: 600, marginBottom: 20, textAlign: "center" }}>{tx.confirmDelete}</p>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setDeleteTarget(null)} style={{ flex: 1, padding: 12, borderRadius: 12, border: `1.5px solid ${th.border}`, background: th.card, color: th.text, fontWeight: 700, cursor: "pointer" }}>{tx.no}</button>
            <button onClick={() => { onDeleteProduct(deleteTarget); setDeleteTarget(null); }} style={{ flex: 1, padding: 12, borderRadius: 12, border: "none", background: "#16A34A", color: "#fff", fontWeight: 700, cursor: "pointer" }}>{tx.yes}</button>
          </div>
        </ModalSheet>
      )}
    </div>
  );
}


// =====================================================
// LEAFLET MINI MAP PICKER (real xarita)
// =====================================================
function LeafletMapPicker({ lang, location, onChange }) {
  const tx = t[lang];
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!window.L || leafletMap.current) return;
    const L = window.L;
    const initLat = location?.lat || 41.299;
    const initLng = location?.lng || 69.240;
    const map = L.map(mapRef.current, { center: [initLat, initLng], zoom: 14, zoomControl: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap", maxZoom: 19,
    }).addTo(map);
    const pinIcon = L.divIcon({
      className: "",
      html: `<div style="background:#16A34A;width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
      iconSize: [28, 28], iconAnchor: [14, 28],
    });
    if (location) {
      markerRef.current = L.marker([location.lat, location.lng], { icon: pinIcon, draggable: true }).addTo(map);
      markerRef.current.on("dragend", (e) => { const ll = e.target.getLatLng(); onChange({ lat: ll.lat, lng: ll.lng }); });
    }
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      onChange({ lat, lng });
      if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
      else { markerRef.current = L.marker([lat, lng], { icon: pinIcon, draggable: true }).addTo(map); markerRef.current.on("dragend", (ev) => { const ll = ev.target.getLatLng(); onChange({ lat: ll.lat, lng: ll.lng }); }); }
    });
    leafletMap.current = map;
  }, []);

  return (
    <div>
      <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.12)", height: 240, border: "1.5px solid #E8E8E8" }}>
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      </div>
      <p style={{ fontSize: 12, color: location ? "#00B894" : "#AAA", marginTop: 8, fontWeight: 600, textAlign: "center" }}>
        {location ? (lang === "uz" ? "📍 Joylashuv belgilandi ✓" : "📍 Местоположение указано ✓") : (lang === "uz" ? "Xaritaga bosib joylashuvni belgilang" : "Нажмите на карту чтобы указать место")}
      </p>
    </div>
  );
}

// =====================================================
// KATEGORIYA PARAMETRLAR SXEMASI
// =====================================================
const CAT_SCHEMA = {
  auto: {
    uz: { title: "Avto servis", steps: ["Brend", "Xizmat turi", "Qism"] },
    ru: { title: "Авто сервис", steps: ["Бренд", "Вид услуги", "Деталь"] },
    brands: ["Chevrolet","Nexia","Malibu","Lacetti","Spark","Cobalt","Matiz",
              "Toyota","Hyundai","Kia","BMW","Mercedes","Audi","Lexus","Nissan",
              "Honda","Ford","Volkswagen","Lada","Daewoo","Boshqa"],
    services: {
      uz: ["Dvigatel ta'mirlash","Kuzov ta'mirlash","Elektrik ishlar",
           "Shinalar almashtirish","Moy almashtirish","Konditsioner",
           "To'xtatish tizimi","Uzatish qutisi","Diagnostika","Detallash","Boshqa"],
      ru: ["Ремонт двигателя","Кузовной ремонт","Электрика",
           "Замена шин","Замена масла","Кондиционер",
           "Тормозная система","Коробка передач","Диагностика","Детейлинг","Другое"],
    },
    parts: {
      uz: ["Motor","Kuzov","Elektr tizimi","Xadavoy / Podveska","Tormoz tizimi",
           "Sovutish tizimi","Yoqilg'i tizimi","KPP / Transmissiya",
           "Konditsioner tizimi","Interer","Shina va disklar","Boshqa"],
      ru: ["Двигатель","Кузов","Электрика","Ходовая / Подвеска","Тормозная система",
           "Система охлаждения","Топливная система","КПП / Трансмиссия",
           "Система кондиционирования","Интерьер","Шины и диски","Другое"],
    },
  },
  food: {
    types: {
      uz: ["Sabzavotlar va mevalar","Non va non mahsulotlari","Go'sht va baliq",
           "Sut mahsulotlari","Shirinliklar","Ichimliklar","Tayyor taomlar","Organik mahsulotlar","Boshqa"],
      ru: ["Овощи и фрукты","Хлеб и выпечка","Мясо и рыба",
           "Молочные продукты","Сладости","Напитки","Готовая еда","Органика","Другое"],
    },
  },
  clothing: {
    types: {
      uz: ["Erkaklar kiyimi","Ayollar kiyimi","Bolalar kiyimi","Sport kiyimi",
           "Milliy kiyim","Poyabzal","Aksessuarlar","Sumkalar","Boshqa"],
      ru: ["Мужская одежда","Женская одежда","Детская одежда","Спортивная одежда",
           "Национальная одежда","Обувь","Аксессуары","Сумки","Другое"],
    },
    sizes: ["XS","S","M","L","XL","XXL","3XL","Bolalar","Universal"],
  },
  electronics: {
    types: {
      uz: ["Smartfonlar","Noutbuk va kompyuter","Planshetlar","TV va audio",
           "Maishiy texnika","Foto va video","Aksessuarlar","O'yin qurilmalari","Boshqa"],
      ru: ["Смартфоны","Ноутбуки и ПК","Планшеты","ТВ и аудио",
           "Бытовая техника","Фото и видео","Аксессуары","Игровые устройства","Другое"],
    },
    brands: ["Apple","Samsung","Xiaomi","Huawei","LG","Sony","Lenovo","Asus","HP","Dell","Boshqa"],
  },
  beauty: {
    types: {
      uz: ["Parfyumeriya","Soch parvarishi","Yuz parvarishi","Tana parvarishi",
           "Makiyaj","Tirnoq mahsulotlari","Erkaklar uchun","Professional kosmetika","Boshqa"],
      ru: ["Парфюмерия","Уход за волосами","Уход за лицом","Уход за телом",
           "Макияж","Продукты для ногтей","Для мужчин","Профессиональная косметика","Другое"],
    },
  },
  restaurant: {
    types: {
      uz: ["O'zbek taomlari","Evropa taomlari","Xitoy taomlari","Tez taomlar",
           "Sushi va rollar","Pizza","Burger","Qahva va shirinlik","Yetkazib berish","Boshqa"],
      ru: ["Узбекская кухня","Европейская кухня","Китайская кухня","Фастфуд",
           "Суши и роллы","Пицца","Бургеры","Кофе и десерты","Доставка","Другое"],
    },
  },
  home_cat: {
    types: {
      uz: ["Mebel","Maishiy texnika","Uy bezaklari","Yostiq va ko'rpa",
           "Oshxona anjomlari","Tozalash vositalari","Bog' anjomlar","Ta'mirlash mollari","Boshqa"],
      ru: ["Мебель","Бытовая техника","Декор","Подушки и одеяла",
           "Кухонная посуда","Средства уборки","Садовый инвентарь","Строительные материалы","Другое"],
    },
  },
  sport: {
    types: {
      uz: ["Fitnes va bodibilding","Velosiped","Tennis","Futbol",
           "Basketbol","Suzish","Togʻ turizm","Jangovar san'at","Boshqa"],
      ru: ["Фитнес и бодибилдинг","Велоспорт","Теннис","Футбол",
           "Баскетбол","Плавание","Горный туризм","Единоборства","Другое"],
    },
  },
  services: {
    types: {
      uz: ["Santexnika","Elektrik","Qurilish","Bo'yoqchi",
           "Qulf ustasi","Kompyuter ta'mirlash","Yuklovchi","Haydovchi","Boshqa"],
      ru: ["Сантехника","Электрика","Строительство","Маляр",
           "Слесарь","Ремонт компьютеров","Грузчик","Водитель","Другое"],
    },
  },
  pharmacy: {
    types: {
      uz: ["Dorilar","Vitaminlar","Tibbiy anjomlar","Ko'z linzalari",
           "Bolalar uchun","Homiladorlar uchun","Fitoterapiya","Boshqa"],
      ru: ["Лекарства","Витамины","Медицинское оборудование","Контактные линзы",
           "Для детей","Для беременных","Фитотерапия","Другое"],
    },
  },
  education: {
    types: {
      uz: ["Ingliz tili","Matematika","Dasturlash","Grafik dizayn",
           "Musiqa","Rasm chizish","Sport", "Tayyorlov kurslari","Boshqa"],
      ru: ["Английский язык","Математика","Программирование","Графический дизайн",
           "Музыка","Рисование","Спорт","Подготовительные курсы","Другое"],
    },
  },
  hotel: {
    types: {
      uz: ["Mehmonxona","Hostel","Kvartira ijarasi","Dam olish uyi",
           "Sanatoriya","Kottedj","Turistik bazis","Boshqa"],
      ru: ["Гостиница","Хостел","Аренда квартиры","Дом отдыха",
           "Санаторий","Коттедж","Туристическая база","Другое"],
    },
    stars: ["1 ★","2 ★★","3 ★★★","4 ★★★★","5 ★★★★★"],
  },
  repair: {
    types: {
      uz: ["Telefon ta'mirlash","Noutbuk ta'mirlash","Maishiy texnika ta'mirlash",
           "Eshik-deraza ta'mirlash","Mebel ta'mirlash","Santexnika","Elektr ishlari","Boshqa"],
      ru: ["Ремонт телефонов","Ремонт ноутбуков","Ремонт бытовой техники",
           "Ремонт дверей и окон","Ремонт мебели","Сантехника","Электрика","Другое"],
    },
  },
  kids: {
    types: {
      uz: ["Kiyim","O'yinchoqlar","Kitoblar","Bolalar aravasi",
           "Maktab buyumlari","Oziq-ovqat","Sport anjomlar","Boshqa"],
      ru: ["Одежда","Игрушки","Книги","Детские коляски",
           "Школьные принадлежности","Питание","Спортивный инвентарь","Другое"],
    },
    ages: ["0-1 yosh","1-3 yosh","3-7 yosh","7-12 yosh","12+ yosh"],
  },
  medical: {
    types: {
      uz: ["Terapevt","Stomatolog","Ko'z shifokori","Kardiolog",
           "Nevropatolog","Jarroh","Dermatolog","Ginekolog","Laboratoriya","Boshqa"],
      ru: ["Терапевт","Стоматолог","Офтальмолог","Кардиолог",
           "Невролог","Хирург","Дерматолог","Гинеколог","Лаборатория","Другое"],
    },
  },
  entertainment: {
    types: {
      uz: ["Kinoteatr","O'yin markazi","Karaoke","Bowling",
           "Escape room","Akvapark","Tsirk","Kontsert","Boshqa"],
      ru: ["Кинотеатр","Игровой центр","Караоке","Боулинг",
           "Квест-комната","Аквапарк","Цирк","Концерт","Другое"],
    },
  },
  pet: {
    types: {
      uz: ["Itlar","Mushuklar","Parrandalar","Baliqlar",
           "Veterinar xizmati","Oziq-ovqat","Aksessuarlar","Cho'miltirib tarashtirish","Boshqa"],
      ru: ["Собаки","Кошки","Птицы","Рыбы",
           "Ветеринарные услуги","Корма","Аксессуары","Груминг","Другое"],
    },
  },
  cleaning: {
    types: {
      uz: ["Kvartira tozalash","Ofis tozalash","Oyna tozalash","Gilam yuvish",
           "Kreslolar tozalash","Avto tozalash","Qurilishdan keyin tozalash","Boshqa"],
      ru: ["Уборка квартиры","Уборка офиса","Мойка окон","Чистка ковров",
           "Химчистка мебели","Автомойка","Уборка после ремонта","Другое"],
    },
  },
};

// =====================================================
// ADD PRODUCT FORM
// =====================================================
// ADD PRODUCT FORM — DynamicCategoryForm wrapper
// =====================================================
const emptyFormData = {
  category: "",
  name: "", description: "",
  catType: "", catBrand: "", catPart: "", catService: "",
  catSize: "", catAge: "", catStar: "",
  sizes: [], colors: [], gender: "", condition: "", material: "",
  unit: "", expiryDate: "", stock: "",
  salonType: "", serviceName: "", duration: "", workTime: "",
  menuItems: "", tableBooking: false,
  autoBrand: "", autoModel: "", autoService: "", autoStep: 1,
  roomType: "", capacity: "", stars: "",
  breakfast: false, wifi: false, parking: false, pool: false, ac: false,
  direction: "", teacher: "", startDate: "",
  prescription: false, open24h: false, manufacturer: "",
  homeVisit: false, delivery: false, deliveryPrice: "",
  experience: "", warranty: false, memory: "", ageGroup: "",
  originalPrice: "", discountPercent: 0, discountExpiry: "",
  address: "", location: null, phone: "", telegram: "", photos: [],
  params: [],
};

function AddProductForm({ lang, dark, store, onCancel, onSubmit }) {
  const th = theme(dark);
  const cats = listingCategories(lang);
  const [selectedCat, setSelectedCat] = useState("");
  const [formData, setFormData] = useState({
    ...emptyFormData,
    address: store.address || "",
    phone: store.phone || "",
    telegram: store.telegram || "",
    location: store.lat ? { lat: store.lat, lng: store.lng } : null,
  });

  const handleChange = (patch) => setFormData(prev => ({ ...prev, ...patch }));

  const handleSubmit = (data) => {
    const name = data.name || data.serviceName ||
      [data.autoBrand, data.autoModel, data.autoService].filter(Boolean).join(" — ") ||
      [data.catType, data.catBrand].filter(Boolean).join(" — ") ||
      data.direction || (lang === "uz" ? "Yangi mahsulot" : "Новый товар");
    onSubmit({ ...data, category: selectedCat, name });
  };

  // Step 1 — kategoriya tanlash
  if (!selectedCat) {
    return (
      <div style={{ minHeight: "100vh", background: th.bg }}>
        <div style={{ background: "linear-gradient(135deg,#16A34A 0%,#15803D 100%)", padding: "48px 20px 20px", color: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <button onClick={onCancel} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, width: 34, height: 34, color: "#fff", fontSize: 16, cursor: "pointer" }}>←</button>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800 }}>{lang === "uz" ? "Mahsulot / Xizmat qo'shish" : "Добавить товар / услугу"}</div>
              <div style={{ fontSize: 11, opacity: 0.85 }}>{lang === "uz" ? "Kategoriyani tanlang" : "Выберите категорию"}</div>
            </div>
          </div>
        </div>
        <div style={{ padding: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {cats.map(c => (
              <button key={c.id} onClick={() => setSelectedCat(c.id)}
                style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8, padding: "16px 14px", borderRadius: 16, cursor: "pointer", textAlign: "left", border: `2px solid ${c.color}22`, background: c.color + "10" }}>
                <span style={{ fontSize: 28 }}>{c.emoji}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: th.text }}>{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2+ — kategoriyaga mos forma
  const catInfo = cats.find(c => c.id === selectedCat);
  return (
    <div style={{ minHeight: "100vh", background: th.bg }}>
      <div style={{ background: "linear-gradient(135deg,#16A34A 0%,#15803D 100%)", padding: "48px 20px 16px", color: "#fff", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setSelectedCat("")} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, width: 34, height: 34, color: "#fff", fontSize: 16, cursor: "pointer" }}>←</button>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800 }}>{catInfo?.emoji} {catInfo?.label}</div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>{store.name}</div>
          </div>
        </div>
      </div>
      <div style={{ padding: "16px 20px" }}>
        <DynamicCategoryForm
          category={selectedCat}
          lang={lang}
          dark={dark}
          data={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onBack={() => setSelectedCat("")}
        />
      </div>
    </div>
  );
}

// CREATE STORE FORM
// =====================================================
function CreateStoreForm({ lang, dark, userData, onCreate, onCancel }) {
  const tx = t[lang];
  const th = theme(dark);
  const s = mkStyles(dark);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("🏪");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState(null);
  const logos = ["🏪", "🛍️", "🍕", "👕", "📱", "💄", "☕", "⚽", "🛠️", "🏠"];
  const canCreate = name.trim().length > 0 && address.trim().length > 0;

  return (
    <div style={{ minHeight: "100vh", background: th.bg }}>
      <div style={{ background: "linear-gradient(135deg,#16A34A 0%,#15803D 100%)", padding: "48px 20px 22px", color: "#fff" }}>
        <button onClick={onCancel} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, width: 34, height: 34, color: "#fff", fontSize: 16, cursor: "pointer", marginBottom: 16 }}>←</button>
        <div style={{ fontSize: 19, fontWeight: 900 }}>{tx.createStore}</div>
        <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>{tx.createStoreSub}</div>
      </div>
      <div style={{ padding: 20 }}>
        <label style={s.label}>{tx.storeLogo}</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
          {logos.map((l) => (
            <button key={l} onClick={() => setLogo(l)} style={{ width: 46, height: 46, borderRadius: 12, fontSize: 22, cursor: "pointer", border: logo === l ? "2px solid #16A34A" : `2px solid ${th.border}`, background: logo === l ? "#F0FDF4" : th.card }}>{l}</button>
          ))}
        </div>
        <label style={s.label}>{tx.storeName} <span style={{ color: "#16A34A" }}>{tx.required}</span></label>
        <input placeholder={tx.storeNamePh} value={name} onChange={(e) => setName(e.target.value)} style={s.input} />
        <label style={s.label}>{tx.storeAddress} <span style={{ color: "#16A34A" }}>{tx.required}</span></label>
        <input placeholder={tx.storeAddressPh} value={address} onChange={(e) => setAddress(e.target.value)} style={s.input} />
        <label style={s.label}>{tx.pickOnMap}</label>
        <div style={{ marginBottom: 22 }}><LeafletMapPicker lang={lang} location={location} onChange={setLocation} /></div>
        <button onClick={() => canCreate && onCreate({ name, logo, address, location, phone: userData.phone || "" })}
          style={{ ...s.btn, opacity: canCreate ? 1 : 0.5 }}>{tx.createStoreBtn}</button>
      </div>
    </div>
  );
}

// =====================================================
// ONBOARDING
// =====================================================
function OnboardingStep({ step, setStep, lang, setLang, dark, userData, setUserData, onGuest }) {
  const tx = t[lang];
  const th = theme(dark);
  const s = mkStyles(dark);
  const [code, setCode] = useState(["", "", "", ""]);
  const codeRefs = [useRef(), useRef(), useRef(), useRef()];
  const handleCode = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const n = [...code]; n[idx] = val; setCode(n);
    if (val && idx < 3) codeRefs[idx + 1].current?.focus();
  };

  if (step === 0) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#16A34A 0%,#15803D 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, color: "#fff" }}>
      <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 6 }}>
        {["uz", "ru"].map((l) => (
          <button key={l} onClick={() => setLang(l)} style={{ padding: "6px 14px", borderRadius: 20, border: "none", background: lang === l ? "#fff" : "rgba(255,255,255,0.25)", color: lang === l ? "#16A34A" : "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            {l === "uz" ? "🇺🇿 UZ" : "🇷🇺 RU"}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: "linear-gradient(135deg,#16A34A,#15803D)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px rgba(22,163,74,0.5)" }}>
          <span style={{ color: "#fff", fontWeight: 900, fontSize: 42, letterSpacing: -2 }}>O</span>
        </div>
        <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.5 }}>
          <span style={{ color: "#fff" }}>Oson</span><span style={{ color: "#16A34A" }}>Top</span>
        </span>
      </div>
      <p style={{ opacity: 0.85, fontSize: 16, textAlign: "center", marginBottom: 48 }}>
        {lang === "uz" ? "O'zbekistondagi barcha bizneslar platformasi" : "Платформа всех бизнесов Узбекистана"}
      </p>
      <button onClick={() => setStep(1)} style={{ background: "#fff", color: "#16A34A", border: "none", borderRadius: 16, padding: "16px 48px", fontSize: 17, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 24px rgba(0,0,0,0.15)", marginBottom: 12, width: "100%", maxWidth: 280 }}>
        {lang === "uz" ? "Boshlash" : "Начать"} →
      </button>
      <button onClick={onGuest} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.4)", borderRadius: 16, padding: "14px 48px", fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%", maxWidth: 280 }}>
        👁️ {tx.guestMode}
      </button>
    </div>
  );

  if (step === 1) return (
    <div style={{ minHeight: "100vh", background: th.bg, display: "flex", flexDirection: "column", padding: "60px 24px 32px" }}>
      <div style={{ fontSize: 40, marginBottom: 8 }}>👤</div>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: th.text, margin: "0 0 6px" }}>{tx.welcome}</h2>
      <p style={{ color: th.sub, marginBottom: 32, fontSize: 14 }}>{lang === "uz" ? "Ma'lumotlaringizni kiriting" : "Введите ваши данные"}</p>
      <label style={s.label}>{tx.enterName}</label>
      <input placeholder={tx.namePlaceholder} value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} style={s.input} />
      <label style={s.label}>{tx.enterSurname}</label>
      <input placeholder={tx.surnamePlaceholder} value={userData.surname} onChange={(e) => setUserData({ ...userData, surname: e.target.value })} style={s.input} />
      <label style={s.label}>{tx.enterPhone}</label>
      <input type="tel" placeholder={tx.phonePlaceholder} value={userData.phone} onChange={(e) => setUserData({ ...userData, phone: e.target.value })} style={s.input} />
      <div style={{ flex: 1 }} />
      <button onClick={() => userData.name && userData.phone ? setStep(2) : null} style={{ ...s.btn, opacity: userData.name && userData.phone ? 1 : 0.5 }}>{tx.next}</button>
    </div>
  );

  if (step === 2) return (
    <div style={{ minHeight: "100vh", background: th.bg, display: "flex", flexDirection: "column", padding: "60px 24px 32px" }}>
      <div style={{ fontSize: 40, marginBottom: 8 }}>📱</div>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: th.text, margin: "0 0 6px" }}>{tx.smsCode}</h2>
      <p style={{ color: th.sub, marginBottom: 32, fontSize: 14 }}>{tx.smsHint}<br /><b style={{ color: th.text }}>{userData.phone}</b></p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 28 }}>
        {code.map((c, i) => (
          <input key={i} ref={codeRefs[i]} value={c} onChange={(e) => handleCode(e.target.value, i)} maxLength={1}
            style={{ width: 60, height: 64, textAlign: "center", fontSize: 26, fontWeight: 800, border: `2px solid ${c ? "#16A34A" : th.border}`, borderRadius: 14, background: th.card, outline: "none", color: th.text }} />
        ))}
      </div>
      <p style={{ textAlign: "center", color: "#AAA", fontSize: 13, marginBottom: 32 }}>
        {lang === "uz" ? "Kodni olmadingizmi? " : "Не получили код? "}
        <span style={{ color: "#16A34A", fontWeight: 600, cursor: "pointer" }}>{tx.resend}</span>
      </p>
      <div style={{ flex: 1 }} />
      <button onClick={() => setStep(3)} style={{ ...s.btn, opacity: code.every((c) => c) ? 1 : 0.5 }}>{tx.confirm}</button>
    </div>
  );

  if (step === 3) return (
    <div style={{ minHeight: "100vh", background: th.bg, display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 24px 32px" }}>
      <div style={{ fontSize: 40, marginBottom: 8 }}>📸</div>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: th.text, margin: "0 0 6px", textAlign: "center" }}>{tx.addPhoto}</h2>
      <p style={{ color: th.sub, marginBottom: 32, fontSize: 14, textAlign: "center" }}>{lang === "uz" ? "Profilingizni yanada shaxsiylashtiring" : "Персонализируйте свой профиль"}</p>
      <div style={{ width: 120, height: 120, borderRadius: 60, background: userData.photo ? "#16A34A" : th.card2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: userData.photo ? 56 : 40, marginBottom: 20, cursor: "pointer", border: "3px dashed #16A34A" }}
        onClick={() => setUserData({ ...userData, photo: "📸" })}>
        {userData.photo ? "😊" : "📷"}
      </div>
      <div style={{ flex: 1 }} />
      <button onClick={() => setStep(4)} style={s.btn}>{lang === "uz" ? "Davom etish" : "Продолжить"}</button>
      <button onClick={() => setStep(4)} style={{ background: "none", border: "none", color: "#AAA", fontSize: 14, cursor: "pointer", marginTop: 14 }}>{tx.skip}</button>
    </div>
  );

  if (step === 4) return (
    <div style={{ minHeight: "100vh", background: th.bg, display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 24px 32px" }}>
      <div style={{ fontSize: 64, marginBottom: 12 }}>🔔</div>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: th.text, margin: "0 0 8px", textAlign: "center" }}>{tx.allowNotif}</h2>
      <p style={{ color: th.sub, fontSize: 14, textAlign: "center", marginBottom: 40, lineHeight: 1.6 }}>{tx.notifDesc}</p>
      <div style={{ background: th.card, borderRadius: 20, padding: 24, width: "100%", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", marginBottom: 40 }}>
        {[
          { icon: "🛒", uz: "Sevimli do'konlarda yangi chegirmalar", ru: "Новые скидки в любимых магазинах" },
          { icon: "⏰", uz: "Chegirma muddati tugashidan oldin", ru: "До истечения срока скидки" },
          { icon: "📍", uz: "Yaqin atrofdagi takliflar", ru: "Предложения поблизости" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < 2 ? `1px solid ${th.border}` : "none" }}>
            <span style={{ fontSize: 24 }}>{item.icon}</span>
            <span style={{ fontSize: 13, color: th.sub, flex: 1 }}>{item[lang]}</span>
          </div>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      <button onClick={() => setStep(5)} style={s.btn}>🔔 {tx.enable}</button>
      <button onClick={() => setStep(5)} style={{ background: "none", border: "none", color: "#AAA", fontSize: 14, cursor: "pointer", marginTop: 14 }}>{tx.skip}</button>
    </div>
  );

  return null;
}


// =====================================================
// MAIN APP
// =====================================================
export default function App() {
  const [dark, toggleDark] = useDark();
  const saved = loadFromLS();

  const [step, setStep] = useState(saved?.step ?? 0);
  const [isGuest, setIsGuest] = useState(false);
  const [lang, setLang] = useState(saved?.lang ?? "uz");
  const [userData, setUserData] = useState(saved?.userData ?? { name: "", surname: "", phone: "", photo: "" });
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [savedKeys, setSavedKeys] = useState(saved?.savedKeys ?? []);
  const [activeTab, setActiveTab] = useState("home");
  const [selectedKey, setSelectedKey] = useState(null);
  const [stores, setStores] = useState(() => saved?.stores || initialStores);
  const [myStoreId, setMyStoreId] = useState(saved?.myStoreId ?? null);
  const [cart, setCart] = useState(saved?.cart ?? []);
  const [subscriptions, setSubscriptions] = useState(saved?.subscriptions ?? []);
  const [notifications, setNotifications] = useState(saved?.notifications ?? []);
  const [coupons, setCoupons] = useState(saved?.coupons ?? []);
  const [profileView, setProfileView] = useState("main");
  const [viewingStoreId, setViewingStoreId] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [couponModalDeal, setCouponModalDeal] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [heartAnim, setHeartAnim] = useState(null);
  const [cartAnim, setCartAnim] = useState(false);
  // Yangi state'lar
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState({ minPrice: "", maxPrice: "", minDiscount: 0, openNow: false, type: "all" });
  const [bookingStore, setBookingStore] = useState(null);
  const [bookings, setBookings] = useState(saved?.bookings ?? []);
  const [chatStore, setChatStore] = useState(null);
  const [chatMessages, setChatMessages] = useState(saved?.chatMessages ?? {});
  const [showAddSheet, setShowAddSheet] = useState(false);

  const th = theme(dark);
  const s = mkStyles(dark);
  const tx = t[lang];

  // Persist to localStorage
  useEffect(() => {
    saveToLS({ step, lang, userData, savedKeys, stores, myStoreId, cart, subscriptions, notifications, coupons, bookings, chatMessages });
  }, [step, lang, userData, savedKeys, stores, myStoreId, cart, subscriptions, notifications, coupons]);

  // Auto-cleanup expired discounts
  useEffect(() => {
    const interval = setInterval(() => {
      setStores((prev) => prev.map((store) => ({
        ...store,
        products: store.products.map((prod) =>
          prod.discount && isExpired(prod.discount.expiryDate) ? { ...prod, discount: null } : prod
        ),
      })));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Derived data
  const activeDeals = (() => {
    const list = [];
    stores.forEach((store) => store.products.forEach((prod) => {
      if (prod.discount && !isExpired(prod.discount.expiryDate)) {
        list.push({
          key: `${store.id}:${prod.id}`, storeId: store.id, storeName: store.name,
          storeAddress: store.address, storePhone: store.phone, productId: prod.id,
          category: prod.category, title: prod.name, description: prod.description,
          params: prod.params, originalPrice: prod.originalPrice, discount: prod.discount.percent,
          expiryDate: prod.discount.expiryDate, photos: prod.photos, logo: store.logo,
          color: store.color, lat: store.lat, lng: store.lng, reviews: prod.reviews || [],
          delivery: prod.delivery, deliveryPrice: prod.deliveryPrice,
        });
      }
    }));
    return list;
  })();

  const applySort = (list) => {
    if (sort === "discount") return [...list].sort((a, b) => b.discount - a.discount);
    if (sort === "price_asc") return [...list].sort((a, b) => (a.originalPrice * (1 - a.discount / 100)) - (b.originalPrice * (1 - b.discount / 100)));
    if (sort === "price_desc") return [...list].sort((a, b) => (b.originalPrice * (1 - b.discount / 100)) - (a.originalPrice * (1 - a.discount / 100)));
    if (sort === "expiry") return [...list].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
    return list;
  };

  const filtered = applySort(activeDeals.filter((d) => {
    const matchCat = activeCategory === "all" || d.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || d.storeName.toLowerCase().includes(q) || (d.title[lang] || "").toLowerCase().includes(q) || d.storeAddress.toLowerCase().includes(q);
    // Kengaytirilgan filter
    const store = stores.find(s => s.id === d.storeId);
    const discountedPrice = d.originalPrice * (1 - d.discount / 100);
    const matchMinPrice = !filter.minPrice || discountedPrice >= Number(filter.minPrice);
    const matchMaxPrice = !filter.maxPrice || discountedPrice <= Number(filter.maxPrice);
    const matchDiscount = d.discount >= filter.minDiscount;
    const matchType = filter.type === "all" || (store?.type || "sell") === filter.type;
    const matchOpenNow = !filter.openNow || isStoreOpen(store);
    return matchCat && matchSearch && matchMinPrice && matchMaxPrice && matchDiscount && matchType && matchOpenNow;
  }));

  const filteredStores = search ? stores.filter((st) => st.name.toLowerCase().includes(search.toLowerCase()) || st.address.toLowerCase().includes(search.toLowerCase())) : [];
  const savedList = activeDeals.filter((d) => savedKeys.includes(d.key));
  const selectedDeal = selectedKey ? activeDeals.find((d) => d.key === `${selectedKey.storeId}:${selectedKey.productId}`) : null;
  const myStore = myStoreId ? stores.find((st) => st.id === myStoreId) : null;
  const viewingStore = viewingStoreId ? stores.find((st) => st.id === viewingStoreId) : null;

  const cartDetailed = cart.map((c) => {
    const store = stores.find((st) => st.id === c.storeId);
    const prod = store?.products.find((p) => p.id === c.productId);
    if (!store || !prod) return null;
    const disc = prod.discount && !isExpired(prod.discount.expiryDate);
    const price = disc ? prod.originalPrice * (1 - prod.discount.percent / 100) : prod.originalPrice;
    return { key: `${c.storeId}:${c.productId}`, storeId: c.storeId, productId: c.productId, storeName: store.name, name: prod.name[lang] || prod.name.uz, photo: prod.photos?.[0], logo: store.logo, color: store.color, price, qty: c.qty, delivery: prod.delivery, deliveryPrice: prod.deliveryPrice };
  }).filter(Boolean);

  const cartTotal = cartDetailed.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryTotal = cartDetailed.reduce((s, i) => s + (i.delivery ? i.deliveryPrice : 0), 0);
  const cartCount = cartDetailed.reduce((s, i) => s + i.qty, 0);
  const unreadCount = notifications.filter((n) => !n.read).length;


  // Actions
  const toggleSave = (key) => {
    setHeartAnim(key);
    setTimeout(() => setHeartAnim(null), 600);
    setSavedKeys((prev) => prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]);
  };

  const addToCart = (storeId, productId) => {
    setCartAnim(true);
    setTimeout(() => setCartAnim(false), 500);
    setCart((prev) => {
      const ex = prev.find((c) => c.storeId === storeId && c.productId === productId);
      if (ex) return prev.map((c) => c.storeId === storeId && c.productId === productId ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { storeId, productId, qty: 1 }];
    });
  };
  const changeQty = (storeId, productId, delta) =>
    setCart((prev) => prev.map((c) => c.storeId === storeId && c.productId === productId ? { ...c, qty: Math.max(1, c.qty + delta) } : c));
  const removeFromCart = (storeId, productId) =>
    setCart((prev) => prev.filter((c) => !(c.storeId === storeId && c.productId === productId)));

  const notifySubscribers = (storeId, kind) => {
    const store = stores.find((st) => st.id === storeId);
    if (!store || !subscriptions.includes(storeId)) return;
    const message = kind === "discount" ? tx.newDiscountNotif(store.name) : tx.newProductNotif(store.name);
    setNotifications((prev) => [{ id: Date.now() + Math.random(), storeId, storeName: store.name, message, read: false, time: new Date().toISOString() }, ...prev]);
  };

  const getCoupon = (coupon) => setCoupons((prev) => [coupon, ...prev]);
  const useCoupon = (code) => setCoupons((prev) => prev.map((c) => c.code === code ? { ...c, used: true } : c));
  const toggleSubscribe = (storeId) =>
    setSubscriptions((prev) => prev.includes(storeId) ? prev.filter((id) => id !== storeId) : [...prev, storeId]);

  const createStore = ({ name, logo, address, location, phone }) => {
    const id = "mystore-" + Date.now();
    setStores((prev) => [...prev, { id, name, logo, color: "#16A34A", address, phone, lat: location?.lat || 41.299, lng: location?.lng || 69.240, views: 0, subscriberBase: 0, reviews: [], products: [] }]);
    setMyStoreId(id);
    setProfileView("main");
    setViewingStoreId(id);
  };

  const addProductToStore = (storeId, p) => {
    const finalName = p.name ||
      [p.autoBrand, p.autoModel, p.autoService].filter(Boolean).join(" — ") ||
      [p.catType, p.catBrand].filter(Boolean).join(" — ") ||
      p.direction || p.serviceName || "Yangi mahsulot";

    // Barcha maxsus parametrlarni yig'amiz
    const buildParams = (data) => [
      data.catBrand     && { name: "Brend",           value: data.catBrand },
      data.autoBrand    && { name: "Avto brend",       value: data.autoBrand },
      data.autoModel    && { name: "Model",            value: data.autoModel },
      data.autoService  && { name: "Xizmat turi",      value: data.autoService },
      data.catType      && { name: "Tur",              value: data.catType },
      data.condition    && { name: "Holati",           value: data.condition },
      data.gender       && { name: "Jins",             value: data.gender },
      data.unit         && { name: "O'lchov",          value: data.unit },
      data.memory       && { name: "Xotira",           value: data.memory },
      data.sizes?.length && { name: "O'lchamlar",      value: data.sizes.join(", ") },
      data.color        && { name: "Rang",             value: data.color },
      data.material     && { name: "Material",         value: data.material },
      data.salonType    && { name: "Salon turi",       value: data.salonType },
      data.duration     && { name: "Davomiyligi",      value: data.duration },
      data.workTime     && { name: "Ish vaqti",        value: data.workTime },
      data.roomType     && { name: "Xona turi",        value: data.roomType },
      data.capacity     && { name: "Sig'imi",          value: data.capacity + " kishi" },
      data.stars        && { name: "Yulduzcha",        value: data.stars },
      data.direction    && { name: "Yo'nalish",        value: data.direction },
      data.teacher      && { name: "O'qituvchi",       value: data.teacher },
      data.startDate    && { name: "Boshlanish",       value: data.startDate },
      data.experience   && { name: "Tajriba",          value: data.experience },
      data.manufacturer && { name: "Ishlab chiqaruvchi", value: data.manufacturer },
      data.ageGroup     && { name: "Yosh guruhi",      value: data.ageGroup },
      data.warranty     && { name: "Kafolat",          value: "Ha" },
      data.delivery     && { name: "Yetkazib berish",  value: "Ha" },
      data.homeVisit    && { name: "Uyga borish",      value: "Ha" },
      data.open24h      && { name: "24 soat",          value: "Ha" },
      data.prescription && { name: "Retsept",          value: "Talab etiladi" },
      data.wifi         && { name: "Wi-Fi",            value: "Ha" },
      data.breakfast    && { name: "Nonushta",         value: "Ha" },
      ...(data.params || []),
    ].filter(Boolean).filter(x => x.name && x.value);

    const newProd = {
      id: "prod-" + Date.now(),
      category: p.category,
      name: { uz: finalName, ru: finalName },
      description: { uz: p.description || "", ru: p.description || "" },
      params: buildParams(p),
      originalPrice: parseFloat(p.originalPrice) || 0,
      photos: p.photos || [],
      delivery: !!p.delivery,
      deliveryPrice: parseFloat(p.deliveryPrice) || 0,
      workTime: p.workTime || "",
      discount: (p.discountPercent > 0 && p.discountExpiry)
        ? { percent: p.discountPercent, expiryDate: p.discountExpiry }
        : null,
      reviews: [],
    };
    setStores((prev) => prev.map((st) => {
      if (st.id !== storeId) return st;
      const up = { ...st, products: [newProd, ...st.products] };
      if (p.address) up.address = p.address;
      if (p.location) { up.lat = p.location.lat; up.lng = p.location.lng; }
      if (p.phone) up.phone = p.phone;
      if (p.telegram) up.telegram = p.telegram;
      return up;
    }));
    notifySubscribers(storeId, "product");
    setProfileView("main");
  };

  const applyDiscount = (storeId, productId, discount) => {
    setStores((prev) => prev.map((st) => st.id !== storeId ? st : { ...st, products: st.products.map((p) => p.id !== productId ? p : { ...p, discount }) }));
    notifySubscribers(storeId, "discount");
  };
  const removeDiscount = (storeId, productId) =>
    setStores((prev) => prev.map((st) => st.id !== storeId ? st : { ...st, products: st.products.map((p) => p.id !== productId ? p : { ...p, discount: null }) }));
  const deleteProduct = (storeId, productId) =>
    setStores((prev) => prev.map((st) => st.id !== storeId ? st : { ...st, products: st.products.filter((p) => p.id !== productId) }));
  const rateProduct = (storeId, productId, review) => {
    const author = userData.name || (lang === "uz" ? "Mehmon" : "Гость");
    setStores((prev) => prev.map((st) => st.id !== storeId ? st : { ...st, products: st.products.map((p) => p.id !== productId ? p : { ...p, reviews: [...(p.reviews || []), { ...review, author }] }) }));
  };
  const rateStore = (storeId, review) => {
    const author = userData.name || (lang === "uz" ? "Mehmon" : "Гость");
    setStores((prev) => prev.map((st) => st.id !== storeId ? st : { ...st, reviews: [...st.reviews, { ...review, author }] }));
  };

  const handleOrderSuccess = (orderNumber) => {
    setShowCheckout(false);
    setShowPayment(false);
    setCart([]);
    setOrderSuccess(orderNumber);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2500);
  };

  // Onboarding guard
  if (step < 5 && !isGuest) return (
    <div style={{ maxWidth: 430, margin: "0 auto", fontFamily: "'Segoe UI',sans-serif" }}>
      <OnboardingStep step={step} setStep={setStep} lang={lang} setLang={setLang}
        dark={dark} userData={userData} setUserData={setUserData}
        onGuest={() => setIsGuest(true)} />
    </div>
  );

  // Store view overlay
  if (viewingStore) {
    const isOwner = viewingStore.id === myStoreId;
    return (
      <div style={{ fontFamily: "'Segoe UI',sans-serif", maxWidth: 430, margin: "0 auto" }}>
        <StoreView lang={lang} dark={dark} store={viewingStore} isOwner={isOwner} coupons={coupons}
          isSubscribed={subscriptions.includes(viewingStore.id)}
          onBack={() => setViewingStoreId(null)}
          onSubscribeToggle={() => toggleSubscribe(viewingStore.id)}
          onAddProduct={() => setProfileView("storeAddProduct")}
          onApplyDiscount={(pid, d) => applyDiscount(viewingStore.id, pid, d)}
          onRemoveDiscount={(pid) => removeDiscount(viewingStore.id, pid)}
          onDeleteProduct={(pid) => deleteProduct(viewingStore.id, pid)}
          onRateProduct={(pid, r) => rateProduct(viewingStore.id, pid, r)}
          onRateStore={(r) => rateStore(viewingStore.id, r)}
          onOpenDeal={(sid, pid) => { setSelectedKey({ storeId: sid, productId: pid }); setViewingStoreId(null); }}
          bookings={bookings}
          onBook={() => setBookingStore(viewingStore)}
          onChat={() => setChatStore(viewingStore)} />
        {profileView === "storeAddProduct" && (
          <div style={{ position: "fixed", inset: 0, zIndex: 250, maxWidth: 430, margin: "0 auto", background: th.bg }}>
            <AddProductForm lang={lang} dark={dark} store={viewingStore}
              onCancel={() => setProfileView("main")}
              onSubmit={(p) => { addProductToStore(viewingStore.id, p); setProfileView("main"); }} />
          </div>
        )}
      </div>
    );
  }

  if (activeTab === "profile" && profileView === "createStore") return (
    <div style={{ fontFamily: "'Segoe UI',sans-serif", maxWidth: 430, margin: "0 auto" }}>
      <CreateStoreForm lang={lang} dark={dark} userData={userData} onCreate={createStore} onCancel={() => setProfileView("main")} />
    </div>
  );


  // Main shell
  return (
    <div style={{ fontFamily: "'Segoe UI',sans-serif", background: th.bg, minHeight: "100vh", maxWidth: 430, margin: "0 auto", position: "relative", paddingBottom: 85 }}>
      <Confetti active={showConfetti} />
      <PWAInstallPrompt dark={dark} />
      <style>{`
        @keyframes heartPop{0%{transform:scale(1)}40%{transform:scale(1.5)}100%{transform:scale(1)}}
        @keyframes cartBounce{0%,100%{transform:scale(1)}50%{transform:scale(1.3)}}
        @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:none;opacity:1}}
      `}</style>

      {/* Order success */}
      {orderSuccess && <OrderSuccess lang={lang} dark={dark} orderNumber={orderSuccess} onDone={() => { setOrderSuccess(null); setActiveTab("home"); }} />}

      {/* Edit profile modal */}
      {showEditProfile && <EditProfileModal lang={lang} dark={dark} userData={userData} onClose={() => setShowEditProfile(false)} onSave={(d) => { setUserData(d); setShowEditProfile(false); }} />}

      {/* Filter modal */}
      {showFilter && <FilterModal lang={lang} dark={dark} filter={filter} onClose={() => setShowFilter(false)} onApply={(f) => { setFilter(f); setShowFilter(false); }} />}

      {/* Booking modal */}
      {bookingStore && <BookingModal lang={lang} dark={dark} store={bookingStore} onClose={() => setBookingStore(null)} onSuccess={(booking) => { setBookings(prev => [booking, ...prev]); setBookingStore(null); }} />}

      {/* Chat modal */}
      {chatStore && <ChatModal lang={lang} dark={dark} store={chatStore}
        messages={chatMessages[chatStore.id] || []}
        onClose={() => setChatStore(null)}
        onSend={(msg) => setChatMessages(prev => ({ ...prev, [chatStore.id]: [...(prev[chatStore.id] || []), msg] }))} />}

      {/* Deal modal */}
      {selectedDeal && !showCheckout && !showPayment && (
        <ModalSheet onClose={() => setSelectedKey(null)} dark={dark} maxHeight="92vh">
          {selectedDeal.photos?.length ? (
            <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 16 }}>
              {selectedDeal.photos.map((src, i) => <img key={i} src={src} alt="" style={{ width: 110, height: 110, borderRadius: 14, objectFit: "cover", flexShrink: 0 }} />)}
            </div>
          ) : <div style={{ fontSize: 56, textAlign: "center", marginBottom: 12 }}>{selectedDeal.logo}</div>}
          <h2 style={{ textAlign: "center", fontSize: 22, fontWeight: 700, color: th.text, marginBottom: 4 }}>{selectedDeal.storeName}</h2>
          <p style={{ textAlign: "center", color: th.sub, marginBottom: 10 }}>{selectedDeal.title[lang]}</p>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginBottom: 14 }}>
            <StarRating value={Math.round(avgRating(selectedDeal.reviews))} readOnly size={15} />
            <span style={{ fontSize: 12, color: "#AAA" }}>({selectedDeal.reviews.length})</span>
          </div>
          {selectedDeal.description?.[lang] && (
            <p style={{ color: th.sub, fontSize: 13, lineHeight: 1.6, marginBottom: 16, background: th.card2, borderRadius: 12, padding: 14 }}>{selectedDeal.description[lang]}</p>
          )}
          {selectedDeal.params?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              {selectedDeal.params.map((p, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < selectedDeal.params.length - 1 ? `1px solid ${th.border}` : "none" }}>
                  <span style={{ color: th.sub, fontSize: 13 }}>{p.name}</span>
                  <span style={{ color: th.text, fontSize: 13, fontWeight: 600 }}>{p.value}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ background: selectedDeal.color + "15", borderRadius: 16, padding: 20, textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 56, fontWeight: 900, color: selectedDeal.color, lineHeight: 1 }}>{selectedDeal.discount}%</div>
            <div style={{ color: selectedDeal.color, fontWeight: 600, marginTop: 4 }}>{tx.discount}</div>
            {selectedDeal.originalPrice > 0 && (
              <div style={{ marginTop: 10, fontSize: 13, color: th.sub }}>
                <span style={{ textDecoration: "line-through" }}>{formatPrice(selectedDeal.originalPrice)} {tx.sumShort}</span>
                {" → "}
                <b style={{ color: th.text }}>{formatPrice(selectedDeal.originalPrice * (1 - selectedDeal.discount / 100))} {tx.sumShort}</b>
              </div>
            )}
          </div>
          {selectedDeal.delivery && (
            <div style={{ background: "#00B89415", borderRadius: 12, padding: "10px 16px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#00B894", fontWeight: 600 }}>🚚 {tx.deliveryAvail}</span>
              <span style={{ fontSize: 13, color: "#00B894", fontWeight: 700 }}>{formatPrice(selectedDeal.deliveryPrice)} {tx.sumShort}</span>
            </div>
          )}
          {[
            { label: tx.expires, value: daysLeftLabel(selectedDeal.expiryDate, lang) },
            ...(selectedDeal.storeAddress ? [{ label: "📍", value: selectedDeal.storeAddress }] : []),
            ...(selectedDeal.storePhone ? [{ label: "📞", value: selectedDeal.storePhone }] : []),
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, padding: "10px 14px", background: th.card2, borderRadius: 12, gap: 12 }}>
              <span style={{ color: th.sub, flexShrink: 0 }}>{row.label}:</span>
              <span style={{ fontWeight: 600, color: th.text, textAlign: "right" }}>{row.value}</span>
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button onClick={() => addToCart(selectedDeal.storeId, selectedDeal.productId)} style={{ ...s.btn, flex: 2, marginBottom: 0 }}>{tx.addToCart}</button>
            <button onClick={() => setCouponModalDeal(selectedDeal)} style={{ flex: 1, padding: "14px", background: "#F0FDF4", color: "#16A34A", border: "none", borderRadius: 14, fontWeight: 800, fontSize: 14, cursor: "pointer" }}>🎟️</button>
          </div>
          {/* Habar yozish tugmasi — chatga ulaydi */}
          <button onClick={() => {
            const store = stores.find(s => s.id === selectedDeal.storeId);
            if (store) { setChatStore(store); setSelectedKey(null); }
          }} style={{ ...s.ghostBtn, marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            💬 {lang === "uz" ? "Habar yozish" : "Написать сообщение"}
          </button>
          <button onClick={() => { setViewingStoreId(selectedDeal.storeId); setSelectedKey(null); }} style={{ ...s.ghostBtn, marginTop: 8, fontSize: 13 }}>{tx.goToStore}</button>
        </ModalSheet>
      )}

      {/* Coupon modal */}
      {couponModalDeal && (
        <CouponModal lang={lang} dark={dark} deal={couponModalDeal}
          onClose={() => setCouponModalDeal(null)}
          onGetCoupon={(coupon) => {
            getCoupon(coupon);
            setCouponModalDeal(null);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2000);
          }} />
      )}

      {/* Checkout modal */}
      {showCheckout && (
        <CheckoutModal lang={lang} dark={dark} cartDetailed={cartDetailed} cartTotal={cartTotal}
          onClose={() => setShowCheckout(false)} onSuccess={handleOrderSuccess} />
      )}

      {/* Payment modal (alternative) */}
      {showPayment && (
        <PaymentModal lang={lang} dark={dark} total={cartTotal + deliveryTotal}
          onClose={() => setShowPayment(false)} onSuccess={() => handleOrderSuccess("ORD-" + Date.now().toString().slice(-6))} />
      )}


      {/* ── HOME TAB ── */}
      {activeTab === "home" && <>
        {/* ─── KARROT STYLE HEADER ─── */}
        <div style={{ background: th.card, borderBottom: `1px solid ${th.border}`, padding: "50px 16px 0", position: "sticky", top: 0, zIndex: 50 }}>
          {/* Row 1: LOGO + shahar + ikonkalar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <OsonTopLogo size={16} iconSize={28} showIcon={true} />
              <div style={{ width: 1, height: 16, background: th.border }} />
              <button onClick={() => {}} style={{ display: "flex", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                <span style={{ fontSize: 12 }}>📍</span>
                <span style={{ fontWeight: 600, fontSize: 14, color: th.text }}>Toshkent</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={th.sub} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 2 }}><path d="m6 9 6 6 6-6"/></svg>
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", background: th.card2, borderRadius: 16, padding: 2 }}>
                {["uz","ru"].map(l => (
                  <button key={l} onClick={() => setLang(l)} style={{ padding: "3px 10px", borderRadius: 13, border: "none", background: lang === l ? "#16A34A" : "transparent", color: lang === l ? "#fff" : th.sub, fontWeight: 700, fontSize: 10, cursor: "pointer" }}>{l.toUpperCase()}</button>
                ))}
              </div>
              <button onClick={() => { setActiveTab("profile"); setProfileView("notifications"); }}
                style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={th.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                {unreadCount > 0 && <span style={{ position: "absolute", top: 0, right: 0, width: 8, height: 8, borderRadius: 4, background: "#16A34A" }} />}
              </button>
              <button onClick={() => setActiveTab("profile")} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={th.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>
            </div>
          </div>
          {/* Row 2: qidiruv */}
          <div style={{ position: "relative", marginBottom: 10 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={th.sub} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </span>
            <input placeholder={lang === "uz" ? "Biznes, mahsulot, xizmat qidirish..." : "Поиск бизнеса, товара, услуги..."} value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "11px 40px 11px 36px", borderRadius: 10, border: "none", background: th.card2, fontSize: 14, outline: "none", boxSizing: "border-box", color: th.text }} />
            {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: th.sub, fontSize: 16 }}>✕</button>}
          </div>
          {/* Row 3: kategoriya chiplar */}
          <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 10 }}>
            {[
              { id: "all",         uz: "전체",  ru: "Все",       label_uz: "Hammasi",     label_ru: "Все" },
              { id: "auto",        uz: "🚗",    ru: "🚗",        label_uz: "Avto",         label_ru: "Авто" },
              { id: "food",        uz: "🍕",    ru: "🍕",        label_uz: "Ovqat",        label_ru: "Еда" },
              { id: "services",    uz: "🛠️",   ru: "🛠️",       label_uz: "Xizmat",       label_ru: "Услуги" },
              { id: "pharmacy",    uz: "💊",    ru: "💊",        label_uz: "Dorixona",     label_ru: "Аптека" },
              { id: "electronics", uz: "📱",    ru: "📱",        label_uz: "Elektro",      label_ru: "Электро" },
              { id: "restaurant",  uz: "☕",    ru: "☕",         label_uz: "Restoran",     label_ru: "Кафе" },
              { id: "beauty",      uz: "💄",    ru: "💄",        label_uz: "Go'zallik",    label_ru: "Красота" },
              { id: "medical",     uz: "🏥",    ru: "🏥",        label_uz: "Tibbiyot",     label_ru: "Медицина" },
              { id: "education",   uz: "📚",    ru: "📚",        label_uz: "Ta'lim",       label_ru: "Обучение" },
            ].map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
                  flexShrink: 0, padding: "6px 14px", borderRadius: 20,
                  border: `1.5px solid ${isActive ? "#16A34A" : th.border}`,
                  background: isActive ? "#16A34A" : th.card2,
                  color: isActive ? "#fff" : th.sub,
                  fontWeight: 600, fontSize: 13, cursor: "pointer",
                  whiteSpace: "nowrap",
                }}>
                  {lang === "uz" ? cat.label_uz : cat.label_ru}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── QIDIRUV NATIJALARI — Live suggestions ─── */}
        {search && (
          <div style={{ paddingBottom: 100 }}>
            {/* 🏪 Bizneslar */}
            {filteredStores.length > 0 && (
              <div>
                <div style={{ padding: "16px 16px 8px", fontSize: 12, fontWeight: 700, color: th.sub }}>🏪 {lang === "uz" ? "BIZNESLAR" : "БИЗНЕСЫ"}</div>
                <div style={{ padding: "0 16px" }}>
                  {filteredStores.map(store => (
                    <BusinessCard key={store.id} store={store} th={th} lang={lang} onClick={() => setViewingStoreId(store.id)} />
                  ))}
                </div>
              </div>
            )}
            {/* 📦 Mahsulotlar */}
            {filtered.length > 0 && (
              <div>
                <div style={{ padding: "16px 16px 8px", fontSize: 12, fontWeight: 700, color: th.sub }}>📦 {lang === "uz" ? "MAHSULOTLAR" : "ТОВАРЫ"}</div>
                {filtered.map(deal => <KarrotCard key={deal.key} deal={deal} th={th} lang={lang} tx={tx} savedKeys={savedKeys} heartAnim={heartAnim} toggleSave={toggleSave} setSelectedKey={setSelectedKey} setViewingStoreId={setViewingStoreId} />)}
              </div>
            )}
            {/* 🔧 Xizmatlar */}
            {(() => {
              const serviceStores = stores.filter(st =>
                st.products.some(p => ["services","auto","medical"].includes(p.category)) &&
                !filteredStores.find(fs => fs.id === st.id) &&
                st.products.some(p => (p.name?.uz || "").toLowerCase().includes(search.toLowerCase()))
              );
              if (serviceStores.length === 0) return null;
              return (
                <div>
                  <div style={{ padding: "16px 16px 8px", fontSize: 12, fontWeight: 700, color: th.sub }}>🔧 {lang === "uz" ? "XIZMATLAR" : "УСЛУГИ"}</div>
                  <div style={{ padding: "0 16px" }}>
                    {serviceStores.slice(0, 3).map(store => (
                      <BusinessCard key={store.id} store={store} th={th} lang={lang} onClick={() => setViewingStoreId(store.id)} />
                    ))}
                  </div>
                </div>
              );
            })()}
            {filtered.length === 0 && filteredStores.length === 0 && (
              <div style={{ textAlign: "center", padding: "80px 20px", color: th.sub }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: th.text }}>Hech narsa topilmadi</div>
                <div style={{ fontSize: 13, marginTop: 6 }}>Boshqa so'z bilan qidiring</div>
              </div>
            )}
          </div>
        )}

        {/* ─── ASOSIY LENTA ─── */}
        {!search && (
          <div style={{ paddingBottom: 100 }}>
            {/* ─── KATEGORIYA GRID 4x3 ─── */}
            <div style={{ paddingTop: 16 }}>
              <div style={{ padding: "0 16px 16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                  {[
                    { id:"all",         uz:"Hammasi",  ru:"Все",      e:"🏷️", c:"#16A34A",  bg:"#16A34A20" },
                    { id:"food",        uz:"Ovqat",    ru:"Еда",      e:"🍕", c:"#E17055",  bg:"#E1705520" },
                    { id:"auto",        uz:"Avto",     ru:"Авто",     e:"🚗", c:"#0652DD",  bg:"#0652DD20" },
                    { id:"pharmacy",    uz:"Dorixona", ru:"Аптека",   e:"💊", c:"#009432",  bg:"#00943220" },
                    { id:"electronics", uz:"Elektro",  ru:"Электро",  e:"📱", c:"#0984E3",  bg:"#0984E320" },
                    { id:"services",    uz:"Xizmat",   ru:"Услуги",   e:"🛠️",c:"#636E72",  bg:"#636E7220" },
                    { id:"restaurant",  uz:"Restoran", ru:"Кафе",     e:"☕", c:"#D4AC0D",  bg:"#FDCB6E20" },
                    { id:"clothing",    uz:"Kiyim",    ru:"Одежда",   e:"👕", c:"#888888",  bg:"#88888820" },
                    { id:"beauty",      uz:"Go'zallik",ru:"Красота",  e:"💄", c:"#E84393",  bg:"#E8439320" },
                    { id:"education",   uz:"Ta'lim",   ru:"Обучение", e:"📚", c:"#F79F1F",  bg:"#F79F1F20" },
                    { id:"medical",     uz:"Tibbiyot", ru:"Tibbiyot", e:"🏥", c:"#ED4C67",  bg:"#ED4C6720" },
                    { id:"hotel",       uz:"Hotel",    ru:"Отель",    e:"🏨", c:"#1289A7",  bg:"#1289A720" },
                  ].map(cat => {
                    const isActive = activeCategory === cat.id;
                    return (
                      <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                        padding: "14px 4px 10px", borderRadius: 14, cursor: "pointer",
                        background: isActive ? cat.c + "30" : th.card,
                        border: `1.5px solid ${isActive ? cat.c : th.border}`,
                        transition: "all 0.15s",
                      }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 14,
                          background: cat.bg,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 22,
                        }}>{cat.e}</div>
                        <span style={{ fontSize: 10, fontWeight: 600, color: isActive ? cat.c : th.sub, textAlign: "center", lineHeight: 1.2 }}>
                          {lang === "uz" ? cat.uz : cat.ru}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ─── YAQIN BIZNESLAR ─── */}
            <div style={{ height: 8, background: th.card2, margin: "4px 0 12px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px 10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 16 }}>📍</span>
                <span style={{ fontWeight: 700, fontSize: 15, color: th.text }}>{lang === "uz" ? "Yaqin bizneslar" : "Рядом"}</span>
              </div>
              <button onClick={() => setActiveTab("map")} style={{ fontSize: 12, color: "#16A34A", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>{lang === "uz" ? "Barchasi ›" : "Все ›"}</button>
            </div>
            <div style={{ padding: "0 16px" }}>
              {stores.filter(s => activeCategory === "all" || s.products.some(p => p.category === activeCategory)).slice(0, 5).map(store => (
                <BusinessCard key={store.id} store={store} th={th} lang={lang} onClick={() => setViewingStoreId(store.id)} />
              ))}
            </div>

            {/* ─── TOP RATED BIZNESLAR ─── */}
            <div style={{ height: 8, background: th.card2, margin: "4px 0 12px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px 10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 16 }}>⭐</span>
                <span style={{ fontWeight: 700, fontSize: 15, color: th.text }}>{lang === "uz" ? "Eng baholangan" : "Топ рейтинг"}</span>
              </div>
            </div>
            <div style={{ padding: "0 16px" }}>
              {[...stores]
                .filter(s => s.reviews.length > 0 && (activeCategory === "all" || s.products.some(p => p.category === activeCategory)))
                .sort((a, b) => avgRating(b.reviews) - avgRating(a.reviews))
                .slice(0, 3)
                .map(store => (
                  <BusinessCard key={store.id} store={store} th={th} lang={lang} onClick={() => setViewingStoreId(store.id)} />
                ))}
              {stores.filter(s => s.reviews.length > 0).length === 0 && (
                <div style={{ padding: "0 0 12px", color: th.sub, fontSize: 13, textAlign: "center" }}>
                  {lang === "uz" ? "Hozircha sharhlar yo'q" : "Пока нет отзывов"}
                </div>
              )}
            </div>

            {/* ─── YANGI BIZNESLAR ─── */}
            <div style={{ height: 8, background: th.card2, margin: "4px 0 12px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px 10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 16 }}>🆕</span>
                <span style={{ fontWeight: 700, fontSize: 15, color: th.text }}>{lang === "uz" ? "Yangi bizneslar" : "Новые бизнесы"}</span>
              </div>
            </div>
            <div style={{ padding: "0 16px" }}>
              {[...stores]
                .filter(s => activeCategory === "all" || s.products.some(p => p.category === activeCategory))
                .slice(-4)
                .reverse()
                .map(store => (
                  <BusinessCard key={store.id} store={store} th={th} lang={lang} onClick={() => setViewingStoreId(store.id)} />
                ))}
            </div>

            {/* ─── MAXSUS TAKLIFLAR (Special Offers) ─── */}
            {activeDeals.length > 0 && (
              <>
                <div style={{ height: 8, background: th.card2, margin: "4px 0 12px" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 16 }}>🏷️</span>
                    <span style={{ fontWeight: 700, fontSize: 15, color: th.text }}>
                      {lang === "uz" ? "Maxsus takliflar" : "Специальные предложения"}
                      <span style={{ fontSize: 13, color: th.sub, fontWeight: 400, marginLeft: 6 }}>{(activeCategory === "all" ? activeDeals : filtered).length}</span>
                    </span>
                  </div>
                  <button onClick={() => setShowFilter(true)} style={{ display: "flex", alignItems: "center", gap: 5, background: th.card2, border: `1px solid ${th.border}`, borderRadius: 8, padding: "5px 10px", cursor: "pointer" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={th.sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                    <span style={{ fontSize: 12, color: th.sub, fontWeight: 600 }}>{lang === "uz" ? "Filter" : "Фильтр"}</span>
                  </button>
                </div>
                {(activeCategory === "all" ? activeDeals : filtered).map(deal => (
                  <KarrotCard key={deal.key} deal={deal} th={th} lang={lang} tx={tx} savedKeys={savedKeys} heartAnim={heartAnim} toggleSave={toggleSave} setSelectedKey={setSelectedKey} setViewingStoreId={setViewingStoreId} />
                ))}
                {activeCategory !== "all" && filtered.length === 0 && (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: th.sub }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: th.text }}>{tx.noDeals}</div>
                    <div style={{ fontSize: 13, marginTop: 6 }}>{tx.noDealsDesc}</div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </>}


      {/* ── SAVED TAB ── */}
      {activeTab === "saved" && (
        <div style={{ padding: "48px 20px 20px", background: th.bg, minHeight: "100vh" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: th.text, marginBottom: 20 }}>{tx.savedTitle}</h2>
          {savedList.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🤍</div>
              <div style={{ fontWeight: 600, fontSize: 16, color: th.sub }}>{tx.nothingSaved}</div>
              <div style={{ fontSize: 13, marginTop: 6, color: th.sub }}>{tx.nothingSavedDesc}</div>
            </div>
          ) : savedList.map((deal) => (
            <div key={deal.key} onClick={() => setSelectedKey({ storeId: deal.storeId, productId: deal.productId })}
              style={{ background: th.card, borderRadius: 16, padding: 16, marginBottom: 12, display: "flex", alignItems: "center", gap: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: "pointer" }}>
              <div style={{ background: deal.color + "18", borderRadius: 12, width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0, overflow: "hidden" }}>
                {deal.photos?.length ? <img src={deal.photos[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : deal.logo}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: th.text }}>{deal.storeName}</div>
                <div style={{ fontSize: 12, color: th.sub }}>{deal.title[lang]}</div>
              </div>
              <div style={{ background: deal.color, color: "#fff", borderRadius: 10, padding: "6px 12px", fontWeight: 800, fontSize: 15 }}>-{deal.discount}%</div>
            </div>
          ))}
        </div>
      )}

      {/* ── CART TAB ── */}
      {activeTab === "cart" && (
        <div style={{ padding: "48px 20px 20px", background: th.bg, minHeight: "100vh" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: th.text, marginBottom: 20 }}>{tx.cartTitle}</h2>
          {cartDetailed.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🛒</div>
              <div style={{ fontWeight: 600, fontSize: 16, color: th.sub }}>{tx.emptyCart}</div>
              <div style={{ fontSize: 13, marginTop: 6, color: th.sub }}>{tx.emptyCartDesc}</div>
            </div>
          ) : (
            <>
              {cartDetailed.map((item) => (
                <div key={item.key} style={{ background: th.card, borderRadius: 16, padding: 14, marginBottom: 12, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ background: item.color + "18", borderRadius: 12, width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0, overflow: "hidden" }}>
                    {item.photo ? <img src={item.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : item.logo}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: th.text }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: th.sub, marginBottom: 4 }}>{item.storeName}</div>
                    <div style={{ fontWeight: 800, fontSize: 13, color: "#16A34A" }}>{formatPrice(item.price)} {tx.sumShort}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <button onClick={() => removeFromCart(item.storeId, item.productId)} style={{ background: "none", border: "none", color: "#CCC", fontSize: 14, cursor: "pointer" }}>✕</button>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, background: th.card2, borderRadius: 10, padding: "4px 8px", border: `1px solid ${th.border}` }}>
                      <button onClick={() => changeQty(item.storeId, item.productId, -1)} style={{ background: "none", border: "none", fontSize: 15, fontWeight: 800, cursor: "pointer", color: th.text }}>−</button>
                      <span style={{ fontSize: 13, fontWeight: 700, minWidth: 14, textAlign: "center", color: th.text }}>{item.qty}</span>
                      <button onClick={() => changeQty(item.storeId, item.productId, 1)} style={{ background: "none", border: "none", fontSize: 15, fontWeight: 800, cursor: "pointer", color: th.text }}>+</button>
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ background: th.card, borderRadius: 16, padding: 18, marginTop: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: `1px solid ${th.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: th.sub }}>{tx.total}</span>
                  <span style={{ fontWeight: 700, color: th.text }}>{formatPrice(cartTotal)} {tx.sumShort}</span>
                </div>
                {deliveryTotal > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ color: "#00B894", fontSize: 13 }}>🚚 {tx.deliveryAvail}</span>
                    <span style={{ fontWeight: 700, color: "#00B894", fontSize: 13 }}>{formatPrice(deliveryTotal)} {tx.sumShort}</span>
                  </div>
                )}
                <div style={{ height: 1, background: th.border, margin: "8px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 800, color: th.text, fontSize: 16 }}>{tx.total}</span>
                  <span style={{ fontWeight: 900, fontSize: 20, color: "#16A34A" }}>{formatPrice(cartTotal + deliveryTotal)} {tx.sumShort}</span>
                </div>
              </div>
              <button onClick={() => setShowCheckout(true)} style={{ ...s.btn, marginTop: 14 }}>{tx.checkout} →</button>
            </>
          )}
        </div>
      )}

      {/* ── CHAT TAB — Karrot uslubi ── */}
      {activeTab === "chat" && (
        <div style={{ background: th.bg, minHeight: "100vh", paddingBottom: 80 }}>
          {/* Header */}
          <div style={{ background: th.card, borderBottom: `1px solid ${th.border}`, padding: "50px 16px 0", position: "sticky", top: 0, zIndex: 50 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontWeight: 800, fontSize: 20, color: th.text }}>Chats</span>
              <div style={{ display: "flex", gap: 14 }}>
                <button onClick={() => { setActiveTab("profile"); setProfileView("notifications"); }}
                  style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: 4 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={th.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                  {unreadCount > 0 && <span style={{ position: "absolute", top: 0, right: 0, width: 8, height: 8, borderRadius: 4, background: "#16A34A" }} />}
                </button>
                <button onClick={() => { setActiveTab("profile"); setProfileView("settings"); }}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={th.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </button>
              </div>
            </div>
            {/* Qidiruv */}
            <div style={{ position: "relative", marginBottom: 12 }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={th.sub} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </span>
              <input placeholder={lang === "uz" ? "Qidiruv..." : "Поиск..."} style={{ width: "100%", padding: "10px 14px 10px 34px", borderRadius: 10, border: "none", background: th.card2, fontSize: 14, outline: "none", boxSizing: "border-box", color: th.text }} />
            </div>
            {/* 3 tab */}
            {(() => {
              const tabs = lang === "uz"
                ? ["Barchasi", "Bizneslar", "Shaxsiy"]
                : ["Все", "Бизнесы", "Личные"];
              return (
                <div style={{ display: "flex", borderBottom: `1px solid ${th.border}` }}>
                  {tabs.map((tab, i) => (
                    <button key={i} style={{
                      flex: 1, padding: "10px 0", background: "none", border: "none", cursor: "pointer",
                      fontSize: 14, fontWeight: i === 0 ? 700 : 500,
                      color: i === 0 ? "#16A34A" : th.sub,
                      borderBottom: i === 0 ? "2px solid #16A34A" : "2px solid transparent",
                    }}>{tab}</button>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Chat ro'yxati */}
          {Object.keys(chatMessages).length === 0 ? (
            <div style={{ textAlign: "center", padding: "100px 20px", color: th.sub }}>
              <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.3 }}>💬</div>
              <div style={{ fontWeight: 700, fontSize: 18, color: th.text, marginBottom: 8 }}>
                {lang === "uz" ? "Chatlar yo'q" : "Нет чатов"}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                {lang === "uz" ? "Do'kon sahifasiga kiring va\n\"Chat\" tugmasini bosing" : "Откройте страницу магазина\nи нажмите «Чат»"}
              </div>
            </div>
          ) : (
            <div>
              {Object.entries(chatMessages).map(([storeId, msgs]) => {
                const st = stores.find(s => s.id === storeId);
                if (!st || !msgs.length) return null;
                const lastMsg = msgs[msgs.length - 1];
                const unreadMsgs = msgs.filter(m => m.from === "store" && !m.read).length;
                const timeStr = (() => {
                  const d = new Date(lastMsg.time);
                  const now = new Date();
                  const diffDays = Math.floor((now - d) / 86400000);
                  if (diffDays === 0) return d.toLocaleTimeString("uz", { hour: "2-digit", minute: "2-digit" });
                  if (diffDays === 1) return lang === "uz" ? "Kecha" : "Вчера";
                  if (diffDays < 7) return d.toLocaleDateString("uz", { weekday: "short" });
                  return d.toLocaleDateString("uz", { month: "short", day: "numeric" });
                })();

                return (
                  <div key={storeId} onClick={() => setChatStore(st)}
                    style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderBottom: `1px solid ${th.border}`, cursor: "pointer", background: unreadMsgs > 0 ? th.card2 + "80" : "transparent" }}>
                    {/* Avatar */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <div style={{ width: 52, height: 52, borderRadius: 16, background: st.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, overflow: "hidden" }}>
                        {st.photos?.length ? <img src={st.photos[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : st.logo}
                      </div>
                      {/* Tasdiqlangan badge */}
                      <div style={{ position: "absolute", bottom: -2, right: -2, width: 18, height: 18, borderRadius: 9, background: "#16A34A", border: `2px solid ${th.bg}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 15, color: th.text }}>{st.name}</span>
                        <span style={{ fontSize: 12, color: th.sub }}>{timeStr}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 13, color: th.sub, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: 8 }}>
                          {lastMsg.from === "user" && <span style={{ color: th.sub2 }}>{lang === "uz" ? "Men: " : "Я: "}</span>}
                          {lastMsg.text}
                        </span>
                        {unreadMsgs > 0 && (
                          <div style={{ width: 20, height: 20, borderRadius: 10, background: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>{unreadMsgs}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── MAP TAB ── */}
      {activeTab === "map" && (
        <MapView lang={lang} dark={dark} deals={activeDeals} stores={stores}
          onDealClick={(d) => setSelectedKey({ storeId: d.storeId, productId: d.productId })} />
      )}


      {/* ── PROFILE TAB — main ── */}
      {activeTab === "profile" && profileView === "main" && (
        <div style={{ padding: "48px 20px 20px", background: th.bg, minHeight: "100vh" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ width: 80, height: 80, background: "linear-gradient(135deg,#16A34A,#15803D)", borderRadius: 40, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 12px", cursor: "pointer" }} onClick={() => setShowEditProfile(true)}>
              {isGuest ? "👁️" : (userData.photo ? "😊" : "👤")}
            </div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: th.text }}>
              {isGuest ? (lang === "uz" ? "Mehmon foydalanuvchi" : "Гость") : `${userData.name} ${userData.surname}`}
            </h2>
            <p style={{ color: th.sub, fontSize: 13, margin: "4px 0 0" }}>{userData.phone}</p>
            {!isGuest && <button onClick={() => setShowEditProfile(true)} style={{ marginTop: 8, background: "none", border: `1px solid ${th.border}`, borderRadius: 10, padding: "5px 14px", fontSize: 12, color: th.sub, cursor: "pointer" }}>{tx.editProfile}</button>}
          </div>

          {/* Dark mode toggle OLIB TASHLANDI — Sozlamalar da bor */}

          {!isGuest && (
            <button onClick={() => myStore ? setViewingStoreId(myStore.id) : setProfileView("createStore")}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, textAlign: "left", background: "linear-gradient(135deg,#16A34A 0%,#15803D 100%)", border: "none", borderRadius: 16, padding: "16px 18px", marginBottom: 10, cursor: "pointer", boxShadow: "0 4px 16px rgba(230,57,70,0.25)" }}>
              <span style={{ fontSize: 26 }}>{myStore ? myStore.logo : "🏪"}</span>
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontWeight: 800, fontSize: 15, color: "#fff" }}>{myStore ? myStore.name : tx.myStore}</span>
                <span style={{ display: "block", fontWeight: 500, fontSize: 11, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>{myStore ? `${myStore.products.length} ${tx.productsInStore.toLowerCase()}` : tx.createStoreSub}</span>
              </span>
              <span style={{ color: "#fff", fontSize: 18 }}>›</span>
            </button>
          )}

          {[
            { icon: "👤", label: lang === "uz" ? "Mening profilim" : "Мой профиль", count: 0, action: () => setProfileView("myprofile") },
            { icon: "🎟️", label: tx.myCoupons, count: coupons.filter((c) => !c.used).length, action: () => setProfileView("coupons") },
            { icon: "📅", label: tx.myBookings, count: bookings.filter(b => b.status === "pending").length, action: () => setProfileView("bookings") },
            { icon: "🏪", label: tx.subscribedStores, count: subscriptions.length, action: () => setProfileView("subscribed") },
            { icon: "⚙️", label: tx.settings, count: 0, action: () => setProfileView("settings") },
          ].map((item, i) => (
            <div key={i} onClick={item.action} style={{ background: th.card, borderRadius: 14, padding: "16px 18px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.05)", cursor: "pointer", border: `1px solid ${th.border}` }}>
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <span style={{ flex: 1, fontWeight: 600, fontSize: 14, color: th.text }}>{item.label}</span>
              {item.count > 0 && <span style={{ background: "#16A34A", color: "#fff", borderRadius: 8, padding: "2px 8px", fontSize: 12, fontWeight: 700 }}>{item.count}</span>}
              <span style={{ color: "#CCC" }}>›</span>
            </div>
          ))}

          <button onClick={() => { if (isGuest) { setIsGuest(false); setStep(0); } else { setStep(0); setUserData({ name: "", surname: "", phone: "", photo: "" }); saveToLS(null); } }}
            style={{ width: "100%", padding: "14px", background: th.card, color: "#16A34A", border: "1.5px solid #16A34A", borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 10 }}>
            {lang === "uz" ? "Chiqish" : "Выйти"}
          </button>
        </div>
      )}

      {/* PROFILE — mening profilim */}
      {activeTab === "profile" && profileView === "myprofile" && (
        <div style={{ padding: "48px 20px 20px", background: th.bg, minHeight: "100vh" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <button onClick={() => setProfileView("main")} style={{ background: th.card, border: `1.5px solid ${th.border}`, borderRadius: 10, width: 34, height: 34, fontSize: 16, cursor: "pointer", color: th.text }}>←</button>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: th.text, margin: 0 }}>
              {lang === "uz" ? "👤 Mening profilim" : "👤 Мой профиль"}
            </h2>
          </div>

          {/* Avatar va asosiy ma'lumot */}
          <div style={{ background: "linear-gradient(135deg,#16A34A,#15803D)", borderRadius: 24, padding: "28px 20px", marginBottom: 16, textAlign: "center", boxShadow: "0 8px 32px rgba(230,57,70,0.3)" }}>
            <div style={{ width: 88, height: 88, borderRadius: 44, background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, margin: "0 auto 14px", border: "3px solid rgba(255,255,255,0.5)" }}>
              {userData.photo ? "😊" : "👤"}
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{userData.name} {userData.surname}</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>📱 {userData.phone || "—"}</div>
            <button onClick={() => setShowEditProfile(true)} style={{ marginTop: 14, background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.5)", borderRadius: 12, padding: "8px 22px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              ✏️ {lang === "uz" ? "Tahrirlash" : "Редактировать"}
            </button>
          </div>

          {/* + Mahsulot qo'shish tugmasi */}
          {myStore && (
            <button
              onClick={() => { setViewingStoreId(myStore.id); setTimeout(() => setProfileView("storeAddProduct"), 100); }}
              style={{ width: "100%", padding: "14px 18px", background: "linear-gradient(135deg,#00B894,#00956F)", border: "none", borderRadius: 16, marginBottom: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 4px 16px rgba(0,184,148,0.3)" }}>
              <span style={{ fontSize: 24 }}>➕</span>
              <span style={{ flex: 1, textAlign: "left" }}>
                <span style={{ display: "block", fontWeight: 800, fontSize: 15, color: "#fff" }}>
                  {lang === "uz" ? "Mahsulot qo'shish" : "Добавить товар"}
                </span>
                <span style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>
                  {myStore.name} • {myStore.products.length} {tx.productsInStore.toLowerCase()}
                </span>
              </span>
              <span style={{ color: "#fff", fontSize: 18 }}>›</span>
            </button>
          )}

          {/* Chat tugmasi */}
          <button
            onClick={() => setProfileView("chats")}
            style={{ width: "100%", padding: "14px 18px", background: th.card, border: `1px solid ${th.border}`, borderRadius: 16, marginBottom: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <span style={{ fontSize: 24 }}>💬</span>
            <span style={{ flex: 1, textAlign: "left" }}>
              <span style={{ display: "block", fontWeight: 700, fontSize: 14, color: th.text }}>
                {lang === "uz" ? "Chatlarim" : "Мои чаты"}
              </span>
              <span style={{ display: "block", fontSize: 12, color: th.sub, marginTop: 2 }}>
                {Object.keys(chatMessages).length > 0
                  ? (lang === "uz" ? `${Object.keys(chatMessages).length} ta faol chat` : `${Object.keys(chatMessages).length} активных чатов`)
                  : (lang === "uz" ? "Hozircha chatlar yo'q" : "Пока нет чатов")}
              </span>
            </span>
            {Object.keys(chatMessages).length > 0 && (
              <span style={{ background: "#16A34A", color: "#fff", borderRadius: 8, padding: "2px 8px", fontSize: 12, fontWeight: 700 }}>
                {Object.keys(chatMessages).length}
              </span>
            )}
            <span style={{ color: "#CCC" }}>›</span>
          </button>

          {/* Statistika */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              { icon: "❤️", value: savedKeys.length, label: lang === "uz" ? "Saqlangan" : "Сохранено" },
              { icon: "🎟️", value: coupons.filter(c => !c.used).length, label: lang === "uz" ? "Kuponlar" : "Купоны" },
              { icon: "🛒", value: cartCount, label: lang === "uz" ? "Savat" : "Корзина" },
            ].map((s, i) => (
              <div key={i} style={{ background: th.card, borderRadius: 16, padding: "16px 8px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: `1px solid ${th.border}` }}>
                <div style={{ fontSize: 26 }}>{s.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#16A34A", marginTop: 4 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: th.sub, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Do'konim */}
          <div style={{ background: th.card, borderRadius: 16, padding: "16px 18px", marginBottom: 10, border: `1px solid ${th.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: th.sub, marginBottom: 12 }}>{lang === "uz" ? "🏪 DO'KONIM" : "🏪 МОЙ МАГАЗИН"}</div>
            {myStore ? (
              <div onClick={() => setViewingStoreId(myStore.id)} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: myStore.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{myStore.logo}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: th.text }}>{myStore.name}</div>
                  <div style={{ fontSize: 12, color: th.sub }}>{myStore.products.length} {tx.productsInStore.toLowerCase()}</div>
                </div>
                <span style={{ color: "#16A34A", fontSize: 18 }}>›</span>
              </div>
            ) : (
              <div onClick={() => setProfileView("createStore")} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🏪</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#16A34A" }}>{tx.createStore}</div>
                  <div style={{ fontSize: 12, color: th.sub }}>{tx.createStoreSub}</div>
                </div>
                <span style={{ color: "#16A34A", fontSize: 18 }}>›</span>
              </div>
            )}
          </div>

          {/* Obunalar */}
          <div style={{ background: th.card, borderRadius: 16, padding: "16px 18px", marginBottom: 10, border: `1px solid ${th.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: th.sub, marginBottom: 12 }}>{lang === "uz" ? "🔔 OBUNALARIM" : "🔔 МОИ ПОДПИСКИ"}</div>
            {subscriptions.length === 0 ? (
              <div style={{ color: th.sub, fontSize: 13 }}>{tx.noSubscribed}</div>
            ) : subscriptions.slice(0, 3).map((sid) => {
              const st = stores.find(s => s.id === sid);
              if (!st) return null;
              return (
                <div key={sid} onClick={() => setViewingStoreId(sid)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${th.border}`, cursor: "pointer" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: st.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{st.logo}</div>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: th.text }}>{st.name}</div>
                  <span style={{ color: "#CCC" }}>›</span>
                </div>
              );
            })}
            {subscriptions.length > 3 && (
              <div onClick={() => setProfileView("subscribed")} style={{ fontSize: 12, color: "#16A34A", fontWeight: 700, marginTop: 8, cursor: "pointer", textAlign: "center" }}>
                {lang === "uz" ? `+ yana ${subscriptions.length - 3} ta ko'rish` : `+ ещё ${subscriptions.length - 3}`}
              </div>
            )}
          </div>

          {/* Chiqish */}
          <button onClick={() => { if (isGuest) { setIsGuest(false); setStep(0); } else { setStep(0); setUserData({ name: "", surname: "", phone: "", photo: "" }); saveToLS(null); } }}
            style={{ width: "100%", padding: "14px", background: th.card, color: "#16A34A", border: "1.5px solid #16A34A", borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 6 }}>
            {lang === "uz" ? "🚪 Chiqish" : "🚪 Выйти"}
          </button>
        </div>
      )}

      {/* PROFILE — chats */}
      {activeTab === "profile" && profileView === "chats" && (
        <div style={{ padding: "48px 20px 20px", background: th.bg, minHeight: "100vh" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <button onClick={() => setProfileView("myprofile")} style={{ background: th.card, border: `1.5px solid ${th.border}`, borderRadius: 10, width: 34, height: 34, fontSize: 16, cursor: "pointer", color: th.text }}>←</button>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: th.text, margin: 0 }}>
              💬 {lang === "uz" ? "Chatlarim" : "Мои чаты"}
            </h2>
          </div>
          {Object.keys(chatMessages).length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: th.sub }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>💬</div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>
                {lang === "uz" ? "Hozircha chatlar yo'q" : "Пока нет чатов"}
              </div>
              <div style={{ fontSize: 13, marginTop: 6 }}>
                {lang === "uz" ? "Do'konlarga kiring va xabar yozing" : "Заходите в магазины и пишите сообщения"}
              </div>
            </div>
          ) : Object.entries(chatMessages).map(([storeId, msgs]) => {
            const st = stores.find(s => s.id === storeId);
            if (!st || !msgs.length) return null;
            const lastMsg = msgs[msgs.length - 1];
            const unread = msgs.filter(m => m.from === "store" && !m.read).length;
            return (
              <div key={storeId} onClick={() => setChatStore(st)}
                style={{ background: th.card, borderRadius: 16, padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: "pointer", border: `1px solid ${unread > 0 ? "#16A34A" : th.border}` }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: st.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0, position: "relative" }}>
                  {st.logo}
                  {unread > 0 && (
                    <span style={{ position: "absolute", top: -4, right: -4, background: "#16A34A", color: "#fff", borderRadius: 8, fontSize: 9, fontWeight: 800, padding: "1px 5px", minWidth: 16, textAlign: "center" }}>{unread}</span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: th.text }}>{st.name}</div>
                  <div style={{ fontSize: 12, color: th.sub, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>
                    {lastMsg.from === "user" ? (lang === "uz" ? "Siz: " : "Вы: ") : (st.logo + " ")}{lastMsg.text}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 10, color: th.sub }}>
                    {new Date(lastMsg.time).toLocaleTimeString("uz", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  {unread > 0 && (
                    <div style={{ marginTop: 4, background: "#16A34A", color: "#fff", borderRadius: 8, fontSize: 10, fontWeight: 800, padding: "1px 6px", display: "inline-block" }}>{unread}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PROFILE — coupons */}
      {activeTab === "profile" && profileView === "coupons" && (
        <MyCouponsPage lang={lang} dark={dark} coupons={coupons} onBack={() => setProfileView("main")} onUseCoupon={useCoupon} />
      )}

      {/* PROFILE — bookings */}
      {activeTab === "profile" && profileView === "bookings" && (
        <div style={{ padding: "48px 20px 20px", background: th.bg, minHeight: "100vh" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <button onClick={() => setProfileView("main")} style={{ background: th.card, border: `1.5px solid ${th.border}`, borderRadius: 10, width: 34, height: 34, fontSize: 16, cursor: "pointer", color: th.text }}>←</button>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: th.text, margin: 0 }}>📅 {tx.myBookings}</h2>
          </div>
          {bookings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: th.sub }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>📅</div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>{tx.noBookings}</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>{lang === "uz" ? "Do'konlarga kiring va bron qiling" : "Заходите в магазины и бронируйте"}</div>
            </div>
          ) : bookings.map((b, i) => (
            <div key={i} style={{ background: th.card, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: `1px solid ${th.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: (b.storeColor || "#16A34A") + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{b.storeLogo || "🏪"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: th.text }}>{b.storeName}</div>
                  <div style={{ fontSize: 11, color: th.sub }}>#{b.id}</div>
                </div>
                <span style={{ background: b.status === "confirmed" ? "#00B89420" : "#FFB40020", color: b.status === "confirmed" ? "#00B894" : "#FFB400", borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>
                  {b.status === "confirmed" ? tx.bookingConfirmed : tx.bookingPending}
                </span>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1, background: th.card2, borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ fontSize: 11, color: th.sub }}>{tx.bookingDate}</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: th.text }}>{b.date}</div>
                </div>
                <div style={{ flex: 1, background: th.card2, borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ fontSize: 11, color: th.sub }}>{tx.bookingTime}</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: th.text }}>{b.time}</div>
                </div>
              </div>
              {b.note ? <div style={{ marginTop: 10, fontSize: 12, color: th.sub, fontStyle: "italic" }}>"{b.note}"</div> : null}
            </div>
          ))}
        </div>
      )}

      {/* PROFILE — settings */}
      {activeTab === "profile" && profileView === "settings" && (
        <div style={{ padding: "48px 20px 20px", background: th.bg, minHeight: "100vh" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <button onClick={() => setProfileView("main")} style={{ background: th.card, border: `1.5px solid ${th.border}`, borderRadius: 10, width: 34, height: 34, fontSize: 16, cursor: "pointer", color: th.text }}>←</button>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: th.text, margin: 0 }}>⚙️ {tx.settings}</h2>
          </div>

          {/* Tungi rejim */}
          <div style={{ background: th.card, borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 16, border: `1px solid ${th.border}` }}>
            <div style={{ padding: "12px 18px", fontSize: 12, fontWeight: 700, color: th.sub, borderBottom: `1px solid ${th.border}` }}>
              {lang === "uz" ? "KO'RINISH" : "ВНЕШНИЙ ВИД"}
            </div>
            <div onClick={toggleDark} style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
              <span style={{ fontSize: 22 }}>{dark ? "☀️" : "🌙"}</span>
              <span style={{ flex: 1, fontWeight: 600, fontSize: 14, color: th.text }}>{tx.darkMode}</span>
              <div style={{ width: 48, height: 26, borderRadius: 13, background: dark ? "#16A34A" : th.border, position: "relative", transition: "background 0.3s", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: 3, left: dark ? 24 : 3, width: 20, height: 20, borderRadius: 10, background: "#fff", transition: "left 0.3s", boxShadow: "0 1px 4px rgba(0,0,0,0.25)" }} />
              </div>
            </div>
          </div>

          {/* Til */}
          <div style={{ background: th.card, borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 16, border: `1px solid ${th.border}` }}>
            <div style={{ padding: "12px 18px", fontSize: 12, fontWeight: 700, color: th.sub, borderBottom: `1px solid ${th.border}` }}>
              {lang === "uz" ? "TIL" : "ЯЗЫК"}
            </div>
            <div style={{ padding: "12px 18px", display: "flex", gap: 10 }}>
              {[["uz", "🇺🇿 O'zbekcha"], ["ru", "🇷🇺 Русский"]].map(([l, label]) => (
                <button key={l} onClick={() => setLang(l)} style={{
                  flex: 1, padding: "12px 8px", borderRadius: 12, cursor: "pointer",
                  border: lang === l ? "2px solid #16A34A" : `2px solid ${th.border}`,
                  background: lang === l ? "#F0FDF4" : th.card,
                  color: lang === l ? "#16A34A" : th.text,
                  fontWeight: 700, fontSize: 13,
                }}>{label}</button>
              ))}
            </div>
          </div>

          {/* Ilova haqida */}
          <div style={{ background: th.card, borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 16, border: `1px solid ${th.border}` }}>
            <div style={{ padding: "12px 18px", fontSize: 12, fontWeight: 700, color: th.sub, borderBottom: `1px solid ${th.border}` }}>
              {lang === "uz" ? "ILOVA HAQIDA" : "О ПРИЛОЖЕНИИ"}
            </div>
            {[
              { label: lang === "uz" ? "Ilova versiyasi" : "Версия приложения", value: "1.0.0" },
              { label: lang === "uz" ? "Ishlab chiquvchi" : "Разработчик", value: "OsonTop Team" },
              { label: lang === "uz" ? "Aloqa" : "Контакты", value: "@osontop_uz" },
            ].map((item, i) => (
              <div key={i} style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: i < 2 ? `1px solid ${th.border}` : "none" }}>
                <span style={{ fontSize: 14, color: th.text }}>{item.label}</span>
                <span style={{ fontSize: 13, color: th.sub, fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Hisobni o'chirish */}
          <button onClick={() => { setStep(0); setUserData({ name: "", surname: "", phone: "", photo: "" }); saveToLS(null); }}
            style={{ width: "100%", padding: "14px", background: th.card, color: "#16A34A", border: "1.5px solid #16A34A", borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            {lang === "uz" ? "🚪 Chiqish" : "🚪 Выйти"}
          </button>
        </div>
      )}

      {/* PROFILE — notifications */}
      {activeTab === "profile" && profileView === "notifications" && (
        <div style={{ padding: "48px 20px 20px", background: th.bg, minHeight: "100vh" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <button onClick={() => setProfileView("main")} style={{ background: th.card, border: `1.5px solid ${th.border}`, borderRadius: 10, width: 34, height: 34, fontSize: 16, cursor: "pointer", color: th.text }}>←</button>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: th.text, margin: 0 }}>{tx.notificationsTitle}</h2>
          </div>
          {notifications.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: th.sub }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🔔</div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>{tx.noNotifications}</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>{tx.noNotificationsDesc}</div>
            </div>
          ) : notifications.map((n) => (
            <div key={n.id} onClick={() => { setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x)); setViewingStoreId(n.storeId); }}
              style={{ background: n.read ? th.card : "#F0FDF4", borderRadius: 14, padding: 14, marginBottom: 10, display: "flex", gap: 12, alignItems: "center", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", cursor: "pointer", border: n.read ? `1px solid ${th.border}` : "1px solid #16A34A22" }}>
              <span style={{ fontSize: 20 }}>🔔</span>
              <span style={{ flex: 1, fontSize: 13, color: th.text, fontWeight: n.read ? 500 : 700 }}>{n.message}</span>
              {!n.read && <span style={{ width: 8, height: 8, borderRadius: 4, background: "#16A34A", flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      )}

      {/* PROFILE — subscribed stores */}
      {activeTab === "profile" && profileView === "subscribed" && (
        <div style={{ padding: "48px 20px 20px", background: th.bg, minHeight: "100vh" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <button onClick={() => setProfileView("main")} style={{ background: th.card, border: `1.5px solid ${th.border}`, borderRadius: 10, width: 34, height: 34, fontSize: 16, cursor: "pointer", color: th.text }}>←</button>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: th.text, margin: 0 }}>🏪 {tx.subscribedStores}</h2>
          </div>
          {subscriptions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: th.sub }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🔔</div>
              <div style={{ fontWeight: 600 }}>{tx.noSubscribed}</div>
            </div>
          ) : subscriptions.map((sid) => {
            const store = stores.find((st) => st.id === sid);
            if (!store) return null;
            return (
              <div key={sid} onClick={() => setViewingStoreId(sid)} style={{ background: th.card, borderRadius: 16, padding: 16, marginBottom: 12, display: "flex", alignItems: "center", gap: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: "pointer" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: store.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{store.logo}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: th.text }}>{store.name}</div>
                  <div style={{ fontSize: 12, color: th.sub }}>📍 {store.address}</div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); toggleSubscribe(sid); }} style={{ background: "#F0FDF4", border: "none", borderRadius: 10, padding: "6px 12px", color: "#16A34A", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>✕</button>
              </div>
            );
          })}
        </div>
      )}

      {/* ── + ADD SHEET ── */}
      {showAddSheet && (
        <ModalSheet onClose={() => setShowAddSheet(false)} dark={dark} maxHeight="40vh">
          <h3 style={{ fontWeight: 800, fontSize: 16, color: th.text, textAlign: "center", marginBottom: 20 }}>
            {lang === "uz" ? "Nima qo'shmoqchisiz?" : "Что хотите добавить?"}
          </h3>
          {[
            {
              icon: "🏪",
              label: lang === "uz" ? "Biznes yaratish" : "Создать бизнес",
              desc: lang === "uz" ? "Do'koningizni ro'yxatga oling" : "Зарегистрируйте ваш магазин",
              action: () => { setShowAddSheet(false); setActiveTab("profile"); setProfileView("createStore"); },
            },
            {
              icon: "📦",
              label: lang === "uz" ? "Mahsulot qo'shish" : "Добавить товар",
              desc: lang === "uz" ? "Do'koningizga mahsulot qo'shing" : "Добавьте товар в ваш магазин",
              action: () => { setShowAddSheet(false); if (myStore) { setViewingStoreId(myStore.id); setTimeout(() => setProfileView("storeAddProduct"), 100); } else { setActiveTab("profile"); setProfileView("createStore"); } },
            },
            {
              icon: "🔧",
              label: lang === "uz" ? "Xizmat qo'shish" : "Добавить услугу",
              desc: lang === "uz" ? "Xizmatlaringizni e'lon qiling" : "Опубликуйте ваши услуги",
              action: () => { setShowAddSheet(false); if (myStore) { setViewingStoreId(myStore.id); setTimeout(() => setProfileView("storeAddProduct"), 100); } else { setActiveTab("profile"); setProfileView("createStore"); } },
            },
          ].map((item, i) => (
            <div key={i} onClick={item.action} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
              background: th.card2, borderRadius: 14, marginBottom: 10, cursor: "pointer",
              border: `1px solid ${th.border}`,
            }}>
              <span style={{ fontSize: 28 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: th.text }}>{item.label}</div>
                <div style={{ fontSize: 12, color: th.sub, marginTop: 2 }}>{item.desc}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={th.sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          ))}
        </ModalSheet>
      )}

      {/* ── FOOTER NAV: Home | Search | [+] | Map | Profile ── */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: th.card,
        borderTop: `1px solid ${th.border}`,
        display: "flex", alignItems: "flex-end",
        padding: "8px 0 22px",
        zIndex: 100,
      }}>
        {/* Home */}
        <button onClick={() => { setActiveTab("home"); setProfileView("main"); }}
          style={{ flex:1, background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"4px 0" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill={activeTab==="home"?"#16A34A":"none"} stroke={activeTab==="home"?"#16A34A":th.sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span style={{ fontSize:10, fontWeight:activeTab==="home"?700:500, color:activeTab==="home"?"#16A34A":th.sub }}>{lang==="uz"?"Bosh":"Главная"}</span>
        </button>

        {/* Search */}
        <button onClick={() => { setActiveTab("home"); setTimeout(()=>document.querySelector("input[placeholder]")?.focus(),100); }}
          style={{ flex:1, background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"4px 0" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={th.sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <span style={{ fontSize:10, fontWeight:500, color:th.sub }}>{lang==="uz"?"Qidiruv":"Поиск"}</span>
        </button>

        {/* Markaziy + tugma */}
        <div style={{ flex:1, display:"flex", justifyContent:"center", alignItems:"flex-end" }}>
          <button onClick={() => setShowAddSheet(true)}
            style={{
              width: 54, height: 54, borderRadius: 27,
              background: "linear-gradient(135deg,#16A34A,#15803D)",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px rgba(22,163,74,0.5)",
              marginBottom: 6,
            }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>

        {/* Map */}
        <button onClick={() => setActiveTab("map")}
          style={{ flex:1, background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"4px 0" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={activeTab==="map"?"#16A34A":th.sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
          <span style={{ fontSize:10, fontWeight:activeTab==="map"?700:500, color:activeTab==="map"?"#16A34A":th.sub }}>{lang==="uz"?"Xarita":"Карта"}</span>
        </button>

        {/* Profile */}
        <button onClick={() => { setActiveTab("profile"); }}
          style={{ flex:1, background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"4px 0", position:"relative" }}>
          <div style={{ position:"relative" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={activeTab==="profile"?"#16A34A":th.sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {unreadCount > 0 && (
              <div style={{ position:"absolute", top:-4, right:-6, minWidth:16, height:16, borderRadius:8, background:"#16A34A", display:"flex", alignItems:"center", justifyContent:"center", border:`2px solid ${th.card}` }}>
                <span style={{ fontSize:9, fontWeight:800, color:"#fff", padding:"0 3px" }}>{unreadCount>9?"9+":unreadCount}</span>
              </div>
            )}
          </div>
          <span style={{ fontSize:10, fontWeight:activeTab==="profile"?700:500, color:activeTab==="profile"?"#16A34A":th.sub }}>{lang==="uz"?"Profil":"Профиль"}</span>
        </button>
      </div>

    </div>
  );
}
