import { useState, useRef, useEffect, useCallback } from "react";
import { theme } from "../theme.js";
import { T } from "../translations.js";
import { genId, CITIES_UZ, CITIES_RU } from "../utils.js";
import { Btn, Input, Select, Toggle, PhotoUploader } from "../components/UI.jsx";

const G = "#16A34A";
const GD = "#15803D";

// ─────────────────────────────────────────────────────
// STEP CONSTANTS
// ─────────────────────────────────────────────────────
const STEPS_UZ = ["Kategoriya", "Ma'lumot", "Manzil", "Yakunlash"];
const STEPS_RU = ["Категория", "Данные", "Адрес", "Итог"];

// ─────────────────────────────────────────────────────
// DYNAMIC CATEGORY TREE
// ─────────────────────────────────────────────────────
const TYPES = {
  uz: [
    { id:"product",   icon:"📦", label:"Mahsulot sotish",    sub:"Yangi yoki ishlatilgan",    color:"#2980B9" },
    { id:"service",   icon:"🔧", label:"Xizmat ko'rsatish",  sub:"Ta'mirlash, tozalash",       color:"#8B5CF6" },
    { id:"transport", icon:"🚗", label:"Transport",           sub:"Avtomobil, moto",            color:"#F59E0B" },
    { id:"realestate",icon:"🏠", label:"Ko'chmas mulk",       sub:"Sotish yoki ijara",          color:"#10B981" },
    { id:"job",       icon:"💼", label:"Ish o'rni",           sub:"Xodim izlayman",             color:"#6366F1" },
    { id:"live",      icon:"🎥", label:"Jonli efir",          sub:"Boshlash",                   color:"#EF4444" },
  ],
  ru: [
    { id:"product",   icon:"📦", label:"Продать товар",      sub:"Новый или б/у",              color:"#2980B9" },
    { id:"service",   icon:"🔧", label:"Услуги",              sub:"Ремонт, уборка",             color:"#8B5CF6" },
    { id:"transport", icon:"🚗", label:"Транспорт",           sub:"Авто, мото",                 color:"#F59E0B" },
    { id:"realestate",icon:"🏠", label:"Недвижимость",        sub:"Продажа или аренда",         color:"#10B981" },
    { id:"job",       icon:"💼", label:"Вакансия",            sub:"Ищу сотрудника",             color:"#6366F1" },
    { id:"live",      icon:"🎥", label:"Прямой эфир",         sub:"Начать",                     color:"#EF4444" },
  ],
};


const CAT_TREE = {
  product: {
    uz: [
      { id:"phone",     icon:"📱", label:"Telefon" },
      { id:"tablet",    icon:"📟", label:"Planshet" },
      { id:"laptop",    icon:"💻", label:"Noutbuk" },
      { id:"computer",  icon:"🖥️", label:"Kompyuter" },
      { id:"tv",        icon:"📺", label:"Televizor" },
      { id:"watch",     icon:"⌚", label:"Smart soat" },
      { id:"headphone", icon:"🎧", label:"Quloqchin" },
      { id:"camera",    icon:"📷", label:"Kamera" },
      { id:"game",      icon:"🎮", label:"O'yin pristavkasi" },
      { id:"clothes_m", icon:"👔", label:"Erkaklar kiyimi" },
      { id:"clothes_w", icon:"👗", label:"Ayollar kiyimi" },
      { id:"shoes",     icon:"👟", label:"Oyoq kiyim" },
      { id:"bag",       icon:"👜", label:"Sumka" },
      { id:"furniture", icon:"🛋️", label:"Mebel" },
      { id:"kitchen",   icon:"🍳", label:"Oshxona" },
      { id:"appliance", icon:"🫙", label:"Maishiy texnika" },
      { id:"sport",     icon:"⚽", label:"Sport" },
      { id:"bike",      icon:"🚲", label:"Velosiped" },
      { id:"kids",      icon:"🧸", label:"Bolalar" },
      { id:"beauty",    icon:"💄", label:"Go'zallik" },
      { id:"pet",       icon:"🐾", label:"Hayvonlar" },
      { id:"food",      icon:"🍎", label:"Oziq-ovqat" },
      { id:"build",     icon:"🧱", label:"Qurilish" },
      { id:"tools",     icon:"🔨", label:"Asbob-uskunalar" },
      { id:"other",     icon:"📦", label:"Boshqa" },
    ],
    ru: [
      { id:"phone",     icon:"📱", label:"Телефон" },
      { id:"tablet",    icon:"📟", label:"Планшет" },
      { id:"laptop",    icon:"💻", label:"Ноутбук" },
      { id:"computer",  icon:"🖥️", label:"Компьютер" },
      { id:"tv",        icon:"📺", label:"Телевизор" },
      { id:"watch",     icon:"⌚", label:"Смарт часы" },
      { id:"headphone", icon:"🎧", label:"Наушники" },
      { id:"camera",    icon:"📷", label:"Камера" },
      { id:"game",      icon:"🎮", label:"Приставка" },
      { id:"clothes_m", icon:"👔", label:"Мужская одежда" },
      { id:"clothes_w", icon:"👗", label:"Женская одежда" },
      { id:"shoes",     icon:"👟", label:"Обувь" },
      { id:"bag",       icon:"👜", label:"Сумки" },
      { id:"furniture", icon:"🛋️", label:"Мебель" },
      { id:"kitchen",   icon:"🍳", label:"Кухня" },
      { id:"appliance", icon:"🫙", label:"Бытовая техника" },
      { id:"sport",     icon:"⚽", label:"Спорт" },
      { id:"bike",      icon:"🚲", label:"Велосипед" },
      { id:"kids",      icon:"🧸", label:"Детское" },
      { id:"beauty",    icon:"💄", label:"Красота" },
      { id:"pet",       icon:"🐾", label:"Животные" },
      { id:"food",      icon:"🍎", label:"Продукты" },
      { id:"build",     icon:"🧱", label:"Строительство" },
      { id:"tools",     icon:"🔨", label:"Инструменты" },
      { id:"other",     icon:"📦", label:"Другое" },
    ],
  },
  service: {
    uz: [
      { id:"repair",    icon:"🔧", label:"Uy ta'miri" },
      { id:"it",        icon:"💻", label:"IT xizmatlari" },
      { id:"edu",       icon:"📚", label:"Ta'lim" },
      { id:"beauty_s",  icon:"💆", label:"Go'zallik" },
      { id:"marketing", icon:"📣", label:"Marketing" },
      { id:"photo",     icon:"📸", label:"Foto-video" },
      { id:"clean",     icon:"🧹", label:"Tozalash" },
      { id:"delivery",  icon:"🚚", label:"Yuk tashish" },
      { id:"other_s",   icon:"🛠️", label:"Boshqa" },
    ],
    ru: [
      { id:"repair",    icon:"🔧", label:"Ремонт" },
      { id:"it",        icon:"💻", label:"IT услуги" },
      { id:"edu",       icon:"📚", label:"Обучение" },
      { id:"beauty_s",  icon:"💆", label:"Красота" },
      { id:"marketing", icon:"📣", label:"Маркетинг" },
      { id:"photo",     icon:"📸", label:"Фото-видео" },
      { id:"clean",     icon:"🧹", label:"Клининг" },
      { id:"delivery",  icon:"🚚", label:"Грузоперевозки" },
      { id:"other_s",   icon:"🛠️", label:"Другое" },
    ],
  },
  transport: {
    uz: [
      { id:"car",       icon:"🚗", label:"Avtomobil" },
      { id:"moto",      icon:"🏍️", label:"Moto" },
      { id:"truck",     icon:"🚛", label:"Yuk mashinasi" },
      { id:"bus",       icon:"🚌", label:"Avtobus" },
      { id:"special",   icon:"🚜", label:"Maxsus texnika" },
      { id:"bike_t",    icon:"🚲", label:"Velosiped" },
      { id:"parts",     icon:"⚙️", label:"Ehtiyot qismlar" },
      { id:"rent_t",    icon:"🔑", label:"Ijara" },
    ],
    ru: [
      { id:"car",       icon:"🚗", label:"Автомобиль" },
      { id:"moto",      icon:"🏍️", label:"Мото" },
      { id:"truck",     icon:"🚛", label:"Грузовик" },
      { id:"bus",       icon:"🚌", label:"Автобус" },
      { id:"special",   icon:"🚜", label:"Спецтехника" },
      { id:"bike_t",    icon:"🚲", label:"Велосипед" },
      { id:"parts",     icon:"⚙️", label:"Запчасти" },
      { id:"rent_t",    icon:"🔑", label:"Аренда" },
    ],
  },
  realestate: {
    uz: [
      { id:"apartment", icon:"🏢", label:"Kvartira" },
      { id:"house",     icon:"🏡", label:"Hovli" },
      { id:"land",      icon:"🌿", label:"Yer" },
      { id:"dacha",     icon:"🏕️", label:"Dacha" },
      { id:"office",    icon:"🏛️", label:"Ofis" },
      { id:"shop",      icon:"🏪", label:"Do'kon" },
      { id:"rent_r",    icon:"🔑", label:"Ijara" },
    ],
    ru: [
      { id:"apartment", icon:"🏢", label:"Квартира" },
      { id:"house",     icon:"🏡", label:"Дом" },
      { id:"land",      icon:"🌿", label:"Участок" },
      { id:"dacha",     icon:"🏕️", label:"Дача" },
      { id:"office",    icon:"🏛️", label:"Офис" },
      { id:"shop",      icon:"🏪", label:"Магазин" },
      { id:"rent_r",    icon:"🔑", label:"Аренда" },
    ],
  },
  job: {
    uz: [
      { id:"vacancy",   icon:"📋", label:"Vakansiya" },
      { id:"resume",    icon:"👤", label:"Rezyume" },
      { id:"remote",    icon:"💻", label:"Masofaviy ish" },
      { id:"intern",    icon:"🎓", label:"Amaliyot" },
    ],
    ru: [
      { id:"vacancy",   icon:"📋", label:"Вакансия" },
      { id:"resume",    icon:"👤", label:"Резюме" },
      { id:"remote",    icon:"💻", label:"Удалённая работа" },
      { id:"intern",    icon:"🎓", label:"Стажировка" },
    ],
  },
};


// ─────────────────────────────────────────────────────
// DYNAMIC FORM FIELDS PER CATEGORY
// ─────────────────────────────────────────────────────
const PHONE_BRANDS = ["Samsung","Apple","Xiaomi","OPPO","Vivo","Huawei","Realme","OnePlus","Nokia","Sony","LG","Boshqa"];
const PHONE_STORAGE = ["16GB","32GB","64GB","128GB","256GB","512GB","1TB"];
const PHONE_RAM = ["2GB","3GB","4GB","6GB","8GB","12GB","16GB"];
const COLORS_LIST_UZ = ["Oq","Qora","Kulrang","Ko'k","Yashil","Sariq","Qizil","Oltin","Kumush","Boshqa"];
const COLORS_LIST_RU = ["Белый","Чёрный","Серый","Синий","Зелёный","Жёлтый","Красный","Золотой","Серебряный","Другой"];
const FUEL_UZ = ["Benzin","Dizel","Gaz","Elektr","Gibrid"];
const FUEL_RU = ["Бензин","Дизель","Газ","Электро","Гибрид"];
const TRANS_UZ = ["Avtomat","Mexanik","Variator","Robot"];
const TRANS_RU = ["Автомат","Механика","Вариатор","Робот"];
const REPAIR_UZ = ["Evro ta'mir","Yaxshi holat","O'rtacha","Ta'mirsiz"];
const REPAIR_RU = ["Евроремонт","Хорошее","Среднее","Без ремонта"];
const DISTRICTS_UZ = { "Toshkent":["Yunusobod","Chilonzor","Mirzo Ulug'bek","Shayxontohur","Sergeli","Uchtepa","Olmazor","Yakkasaroy","Mirobod","Bektemir","Hamza","Yangihayot"], "Samarqand":["Markaz","Bulungur","Ishtixon","Jomboy","Kattaqo'rg'on","Narpay","Oqdaryo","Payariq","Pastdarg'om","Paxtachi","Toyloq","Urgut"], "Namangan":["Markaz","Chortoq","Chust","Kosonsoy","Mingbuloq","Namangan tumani","Norin","Pop","To'raqo'rg'on","Uchqo'rg'on","Uychi","Yangiqo'rg'on"] };

// VIP paketlar
const PROMO_PLANS = [
  { id:"free",    icon:"📋", color:"#6B7280", price:0,      label_uz:"Oddiy e'lon",  label_ru:"Обычное",     badge_uz:"Bepul",       badge_ru:"Бесплатно" },
  { id:"vip",     icon:"⭐", color:"#F59E0B", price:49000,  label_uz:"VIP",          label_ru:"VIP",         badge_uz:"49 000 so'm",  badge_ru:"49 000 сум" },
  { id:"top",     icon:"🔝", color:"#3B82F6", price:89000,  label_uz:"TOP",          label_ru:"ТОП",         badge_uz:"89 000 so'm",  badge_ru:"89 000 сум" },
  { id:"viptop",  icon:"🚀", color:"#8B5CF6", price:119000, label_uz:"VIP + TOP",    label_ru:"VIP + ТОП",   badge_uz:"119 000 so'm", badge_ru:"119 000 сум" },
];
const DURATION_UZ = ["30 kun","60 kun","90 kun"];
const DURATION_RU = ["30 дней","60 дней","90 дней"];


// ─────────────────────────────────────────────────────
// PROGRESS STEPPER
// ─────────────────────────────────────────────────────
function StepBar({ step, lang, dark }) {
  const th = theme(dark);
  const labels = lang === "uz" ? STEPS_UZ : STEPS_RU;
  return (
    <div style={{ padding:"0 0 4px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:0 }}>
        {labels.map((label, i) => {
          const done    = i < step;
          const current = i === step;
          return (
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", position:"relative" }}>
              {i > 0 && (
                <div style={{
                  position:"absolute", left:"-50%", top:13, width:"100%", height:2,
                  background: done ? G : th.border2,
                  transition:"background 0.3s",
                }} />
              )}
              <div style={{
                width:26, height:26, borderRadius:13, zIndex:1, position:"relative",
                background: done ? G : current ? "#fff" : th.card2,
                border: `2px solid ${done ? G : current ? G : th.border2}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:12, fontWeight:800,
                color: done ? "#fff" : current ? G : th.sub,
                transition:"all 0.3s",
                boxShadow: current ? `0 0 0 4px ${G}22` : "none",
              }}>
                {done ? "✓" : i + 1}
              </div>
              <span style={{
                fontSize:9, fontWeight: current ? 800 : 500,
                color: current ? G : th.sub, marginTop:3,
                whiteSpace:"nowrap",
              }}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// YANDEX MAP PICKER
// ─────────────────────────────────────────────────────
function YandexMapPicker({ lang, lat, lng, onChange }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const pmRef = useRef(null);
  useEffect(() => {
    const init = () => {
      if (!window.ymaps || mapRef.current || !containerRef.current) return;
      window.ymaps.ready(() => {
        const center = lat && lng ? [lat, lng] : [41.299, 69.240];
        const map = new window.ymaps.Map(containerRef.current, { center, zoom:13, controls:["geolocationControl","zoomControl"] });
        const updatePM = (coords) => {
          onChange({ lat:coords[0], lng:coords[1] });
          if (pmRef.current) { pmRef.current.geometry.setCoordinates(coords); }
          else {
            pmRef.current = new window.ymaps.Placemark(coords, {}, { preset:"islands#greenDotIcon", draggable:true });
            pmRef.current.events.add("dragend", () => { const c = pmRef.current.geometry.getCoordinates(); onChange({ lat:c[0], lng:c[1] }); });
            map.geoObjects.add(pmRef.current);
          }
        };
        if (lat && lng) updatePM([lat, lng]);
        map.events.add("click", e => updatePM(e.get("coords")));
        mapRef.current = map;
      });
    };
    if (window.ymaps) init();
    else { const s = document.createElement("script"); s.src = "https://api-maps.yandex.ru/2.1/?apikey=your-api-key&lang=ru_RU"; s.onload = init; document.head.appendChild(s); }
    return () => { mapRef.current = null; pmRef.current = null; };
  }, []);
  return (
    <div>
      <div ref={containerRef} style={{ height:200, borderRadius:14, border:`1.5px solid #E8E8E8`, overflow:"hidden" }} />
      {lat && lng && <div style={{ marginTop:6, fontSize:12, color:G, fontWeight:600 }}>✓ {lang==="uz"?"Joylashuv belgilandi":"Местоположение указано"}</div>}
    </div>
  );
}


// ─────────────────────────────────────────────────────
// FIELD HELPERS
// ─────────────────────────────────────────────────────
function FieldRow({ children }) {
  return <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>{children}</div>;
}

function SectionTitle({ icon, title }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, margin:"20px 0 14px", paddingBottom:8, borderBottom:"1px solid #E8E8E8" }}>
      <span style={{ fontSize:20 }}>{icon}</span>
      <span style={{ fontSize:15, fontWeight:800, color:"#1A1A1A" }}>{title}</span>
    </div>
  );
}

function RadioGroup({ label, options, value, onChange, dark }) {
  const th = theme(dark);
  return (
    <div style={{ marginBottom:16 }}>
      {label && <div style={{ fontSize:13, fontWeight:600, color:th.text2, marginBottom:8 }}>{label}</div>}
      <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
        {options.map(o => {
          const v = typeof o === "string" ? o : o.value;
          const l = typeof o === "string" ? o : o.label;
          const active = value === v;
          return (
            <button key={v} onClick={() => onChange(v)} style={{
              padding:"8px 16px", borderRadius:20, fontSize:13, fontWeight:600,
              border:`2px solid ${active ? G : th.border}`,
              background: active ? G : th.card2,
              color: active ? "#fff" : th.text2,
              cursor:"pointer", transition:"all 0.15s",
            }}>{l}</button>
          );
        })}
      </div>
    </div>
  );
}

function CheckboxGroup({ label, options, value = [], onChange, dark }) {
  const th = theme(dark);
  const toggle = (v) => onChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v]);
  return (
    <div style={{ marginBottom:16 }}>
      {label && <div style={{ fontSize:13, fontWeight:600, color:th.text2, marginBottom:8 }}>{label}</div>}
      <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
        {options.map(o => {
          const active = value.includes(o);
          return (
            <button key={o} onClick={() => toggle(o)} style={{
              padding:"7px 13px", borderRadius:10, fontSize:12, fontWeight:600,
              border:`1.5px solid ${active ? G : th.border}`,
              background: active ? G + "15" : th.card2,
              color: active ? G : th.text2,
              cursor:"pointer", display:"flex", alignItems:"center", gap:5,
            }}>
              <span style={{ fontSize:13 }}>{active ? "☑" : "☐"}</span>{o}
            </button>
          );
        })}
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// AI TAVSIF GENERATOR (mock)
// ─────────────────────────────────────────────────────
function AIDescHelper({ lang, dark, title, category, data, onResult }) {
  const th = theme(dark);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      // Haqiqiy ilovada OpenAI / Gemini API chaqiriladi
      const templates = {
        uz: {
          phone: `Sotuvda ${title || "smartfon"}. Holati a'lo${data.storage ? ", " + data.storage + " xotira" : ""}${data.ram ? ", " + data.ram + " RAM" : ""}. To'liq komplekt bilan. Batareyasi mustahkam, ekrani muammosiz. Hech qanday nuqsoni yo'q. Jiddiy xaridorlar aloqassin.`,
          car: `${title || "Avtomobil"} sotuvda.${data.year ? " " + data.year + " yil." : ""}${data.mileage ? " " + Number(data.mileage).toLocaleString() + " km yurgan." : ""} Bitta egasi. To'liq jihozlangan. Kuzov va salon a'lo holatda. Kafolat bor.`,
          realestate: `${title || "Kvartira"} sotuvga qo'yildi.${data.roomCount ? " " + data.roomCount + " xonali." : ""}${data.area ? " " + data.area + " m²." : ""}${data.floor ? " " + data.floor + "-qavat." : ""} Yangi ta'mirlangan. Metro yaqin. Hujjatlar tayyor.`,
          default: `${title || "Mahsulot"} sotuvda. Holati yaxshi. Haqiqiy xaridorlar uchun. Qo'shimcha ma'lumot uchun bog'laning.`,
        },
        ru: {
          phone: `Продаётся ${title || "смартфон"}. Состояние отличное${data.storage ? ", " + data.storage : ""}${data.ram ? ", RAM " + data.ram : ""}. Полный комплект. Аккумулятор держит хорошо, экран без дефектов. Серьёзным покупателям — звоните.`,
          car: `Продаётся ${title || "автомобиль"}.${data.year ? " " + data.year + " г.в." : ""}${data.mileage ? " Пробег " + Number(data.mileage).toLocaleString() + " км." : ""} Один хозяин. Полный привод. Кузов и салон в отличном состоянии.`,
          realestate: `Продаётся ${title || "квартира"}.${data.roomCount ? " " + data.roomCount + " комнаты." : ""}${data.area ? " " + data.area + " м²." : ""}${data.floor ? " " + data.floor + " этаж." : ""} Свежий ремонт. Рядом метро. Документы готовы.`,
          default: `Продаётся ${title || "товар"}. Состояние хорошее. Для уточнения деталей свяжитесь.`,
        },
      };
      const catKey = category === "phone" ? "phone" : category === "car" ? "car" : ["apartment","house"].includes(category) ? "realestate" : "default";
      onResult((lang === "uz" ? templates.uz : templates.ru)[catKey]);
      setLoading(false);
      setShow(false);
    }, 1500);
  };

  return (
    <div style={{ marginBottom:16 }}>
      <button onClick={() => setShow(s => !s)} style={{
        width:"100%", padding:"12px 16px", borderRadius:12,
        background:`linear-gradient(135deg, #8B5CF6, #6D28D9)`,
        border:"none", color:"#fff", cursor:"pointer",
        display:"flex", alignItems:"center", justifyContent:"center", gap:8,
        fontSize:14, fontWeight:700, boxShadow:"0 4px 14px rgba(139,92,246,0.35)",
      }}>
        <span style={{ fontSize:18 }}>✨</span>
        {lang === "uz" ? "AI tavsif yaratsin" : "AI напишет описание"}
        <span style={{ background:"rgba(255,255,255,0.2)", borderRadius:6, padding:"2px 8px", fontSize:11 }}>
          Premium
        </span>
      </button>
      {show && (
        <div style={{ background:th.card, borderRadius:12, padding:16, marginTop:10,
          border:`1px solid #8B5CF620`, boxShadow:"0 4px 20px rgba(139,92,246,0.1)" }}>
          <div style={{ fontSize:13, color:th.sub, marginBottom:12 }}>
            {lang === "uz" ? "AI mahsulot nomini tahlil qilib professional tavsif yozib beradi" : "AI проанализирует название и напишет профессиональное описание"}
          </div>
          <Btn dark={dark} onClick={generate} disabled={loading}
            style={{ background:"linear-gradient(135deg,#8B5CF6,#6D28D9)", border:"none" }}>
            {loading ? (lang==="uz"?"Yozilmoqda...":"Генерирую...") : (lang==="uz"?"✨ Yarat":"✨ Создать")}
          </Btn>
        </div>
      )}
    </div>
  );
}


// ─────────────────────────────────────────────────────
// STEP 1 — TYPE + CATEGORY SELECTION
// ─────────────────────────────────────────────────────
function Step1({ lang, dark, data, u, onLive }) {
  const th = theme(dark);
  const [search, setSearch] = useState("");
  const types = TYPES[lang] || TYPES.uz;
  const cats = data.adType && CAT_TREE[data.adType]
    ? (CAT_TREE[data.adType][lang] || CAT_TREE[data.adType].uz)
    : [];
  const filtered = search
    ? cats.filter(c => c.label.toLowerCase().includes(search.toLowerCase()))
    : cats;

  return (
    <div>
      {/* Type seçimi */}
      {!data.adType ? (
        <>
          <div style={{ fontSize:17, fontWeight:800, color:th.text, marginBottom:6 }}>
            {lang==="uz"?"Nima qo'shmoqchisiz?":"Что добавить?"}
          </div>
          <div style={{ fontSize:13, color:th.sub, marginBottom:18 }}>
            {lang==="uz"?"Kategoriyani tanlang":"Выберите категорию"}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {types.map(t => (
              <button key={t.id} onClick={() => { if (t.id === "live") { onLive?.(); return; } u({ adType:t.id, category:"" }); }}
                style={{
                  background:th.card, border:`1.5px solid ${th.border}`,
                  borderRadius:20, padding:"18px 14px", cursor:"pointer",
                  display:"flex", flexDirection:"column", alignItems:"flex-start", gap:8,
                  textAlign:"left", boxShadow:th.shadow,
                  transition:"transform 0.15s, box-shadow 0.15s",
                }}>
                <div style={{ width:52, height:52, borderRadius:14, background:t.color+"18",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>{t.icon}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:800, color:th.text, marginBottom:3 }}>{t.label}</div>
                  <div style={{ fontSize:12, color:t.color, fontWeight:600 }}>{t.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Orqaga */}
          <button onClick={() => u({ adType:"", category:"" })} style={{
            background:"none", border:"none", color:G, fontWeight:700,
            fontSize:14, cursor:"pointer", marginBottom:14, padding:0,
            display:"flex", alignItems:"center", gap:6,
          }}>← {lang==="uz"?"Orqaga":"Назад"}</button>

          <div style={{ fontSize:16, fontWeight:800, color:th.text, marginBottom:4 }}>
            {types.find(t => t.id === data.adType)?.label}
          </div>
          <div style={{ fontSize:13, color:th.sub, marginBottom:14 }}>
            {lang==="uz"?"Kichik kategoriyani tanlang":"Выберите подкатегорию"}
          </div>

          {/* Search */}
          <div style={{ position:"relative", marginBottom:16 }}>
            <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:16, color:th.sub }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={lang==="uz"?"Qidirish...":"Поиск..."}
              style={{ width:"100%", padding:"11px 14px 11px 40px", borderRadius:12,
                border:`1.5px solid ${th.border2}`, background:th.card,
                fontSize:14, outline:"none", color:th.text, boxSizing:"border-box" }} />
          </div>

          {/* Category grid */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {filtered.map(c => (
              <button key={c.id} onClick={() => u({ category:c.id })}
                style={{
                  background: data.category === c.id ? G+"18" : th.card,
                  border:`2px solid ${data.category === c.id ? G : th.border}`,
                  borderRadius:14, padding:"14px 12px", cursor:"pointer",
                  display:"flex", alignItems:"center", gap:10, textAlign:"left",
                  transition:"all 0.15s",
                }}>
                <div style={{ width:38, height:38, borderRadius:10, background:G+"18",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{c.icon}</div>
                <span style={{ fontSize:13, fontWeight:700,
                  color: data.category === c.id ? G : th.text }}>{c.label}</span>
              </button>
            ))}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign:"center", padding:"30px 0", color:th.sub }}>
              {lang==="uz"?"Hech narsa topilmadi":"Ничего не найдено"}
            </div>
          )}
        </>
      )}
    </div>
  );
}


// ─────────────────────────────────────────────────────
// STEP 2 — DYNAMIC FORM
// ─────────────────────────────────────────────────────
function Step2({ lang, dark, data, u }) {
  const th = theme(dark);
  const isUz = lang === "uz";
  const COLORS_LIST = isUz ? COLORS_LIST_UZ : COLORS_LIST_RU;

  // Photos section (har qanday kategoriya uchun)
  const PhotoSection = () => (
    <>
      <SectionTitle icon="📸" title={isUz ? "Rasmlar (10 tagacha)" : "Фотографии (до 10)"} />
      <PhotoUploader dark={dark} photos={data.photos || []} max={10}
        onChange={photos => u({ photos })} />
      <div style={{ marginTop:10, marginBottom:8 }}>
        <div style={{ fontSize:11, color:"#6B7280", marginBottom:6 }}>
          {isUz ? "Video (ixtiyoriy, max 30 sek)" : "Видео (необязательно, макс 30 сек)"}
        </div>
        <button style={{ padding:"10px 16px", borderRadius:10, border:"1.5px dashed #E8E8E8",
          background:th.card2, color:"#6B7280", fontSize:13, cursor:"pointer", width:"100%" }}>
          🎬 {isUz ? "Video qo'shish" : "Добавить видео"}
        </button>
      </div>
    </>
  );

  // ── TELEFON ──────────────────────────────────────────
  if (data.category === "phone") return (
    <div>
      <PhotoSection />
      <SectionTitle icon="📱" title={isUz ? "Telefon ma'lumotlari" : "Данные телефона"} />
      <RadioGroup label={isUz ? "Holati *" : "Состояние *"} value={data.condition}
        onChange={v => u({ condition:v })} dark={dark}
        options={isUz ? ["Yangi","Ishlatilgan"] : ["Новый","Б/у"]} />
      <Select dark={dark} label={isUz ? "Brend *" : "Марка *"} value={data.brand||""}
        onChange={v => u({ brand:v })} placeholder={isUz?"Tanlang":"Выберите"}
        options={PHONE_BRANDS} />
      <Input dark={dark} label={isUz?"Model *":"Модель *"} required value={data.model||""}
        onChange={e => u({ model:e.target.value })} placeholder="Galaxy S24 Ultra" />
      <FieldRow>
        <Select dark={dark} label={isUz?"Xotira":"Память"} value={data.storage||""}
          onChange={v => u({ storage:v })} placeholder={isUz?"Tanlang":"Выберите"}
          options={PHONE_STORAGE} />
        <Select dark={dark} label="RAM" value={data.ram||""}
          onChange={v => u({ ram:v })} placeholder={isUz?"Tanlang":"Выберите"}
          options={PHONE_RAM} />
      </FieldRow>
      <Select dark={dark} label={isUz?"Rang":"Цвет"} value={data.color||""}
        onChange={v => u({ color:v })} placeholder={isUz?"Tanlang":"Выберите"}
        options={COLORS_LIST} />
      <Input dark={dark} label="IMEI" value={data.imei||""}
        onChange={e => u({ imei:e.target.value })} placeholder="351234567891234" />
      <CheckboxGroup label={isUz?"Komplekt":"Комплект"}
        options={isUz ? ["Zaryad","Quticha","Hujjat","Quloqchin"] : ["Зарядка","Коробка","Документы","Наушники"]}
        value={data.kit||[]} onChange={v => u({ kit:v })} dark={dark} />
      <SectionTitle icon="💰" title={isUz?"Narx":"Цена"} />
      <PriceFields lang={lang} dark={dark} data={data} u={u} />
      <AIDescHelper lang={lang} dark={dark} title={data.model||data.brand} category="phone" data={data}
        onResult={desc => u({ description:desc })} />
      <Input dark={dark} label={isUz?"Tavsif *":"Описание *"} required value={data.description||""}
        onChange={e => u({ description:e.target.value })} multiline rows={4}
        placeholder={isUz?"Telefon haqida qo'shimcha ma'lumot...":"Дополнительная информация о телефоне..."} />
    </div>
  );

  // ── MASHINA ──────────────────────────────────────────
  if (data.category === "car" || data.adType === "transport") return (
    <div>
      <PhotoSection />
      <SectionTitle icon="🚗" title={isUz?"Avtomobil ma'lumotlari":"Данные автомобиля"} />
      <RadioGroup label={isUz?"Holati":"Состояние"} value={data.condition}
        onChange={v => u({ condition:v })} dark={dark}
        options={isUz?["Yangi","Ishlatilgan"]:["Новый","Б/у"]} />
      <Input dark={dark} label={isUz?"Marka *":"Марка *"} required value={data.brand||""}
        onChange={e => u({ brand:e.target.value })} placeholder="Chevrolet" />
      <Input dark={dark} label={isUz?"Model *":"Модель *"} required value={data.model||""}
        onChange={e => u({ model:e.target.value })} placeholder="Malibu" />
      <FieldRow>
        <Input dark={dark} label={isUz?"Yil":"Год"} value={data.year||""}
          onChange={e => u({ year:e.target.value })} type="number" placeholder="2022" />
        <Input dark={dark} label={isUz?"Probeg (km)":"Пробег (км)"} value={data.mileage||""}
          onChange={e => u({ mileage:e.target.value })} type="number" placeholder="45000" />
      </FieldRow>
      <Select dark={dark} label={isUz?"Yoqilg'i":"Топливо"} value={data.fuel||""}
        onChange={v => u({ fuel:v })} placeholder={isUz?"Tanlang":"Выберите"}
        options={isUz?FUEL_UZ:FUEL_RU} />
      <Select dark={dark} label={isUz?"Uzatma qutisi":"Коробка"} value={data.transmission||""}
        onChange={v => u({ transmission:v })} placeholder={isUz?"Tanlang":"Выберите"}
        options={isUz?TRANS_UZ:TRANS_RU} />
      <FieldRow>
        <Select dark={dark} label={isUz?"Rang":"Цвет"} value={data.color||""}
          onChange={v => u({ color:v })} placeholder={isUz?"Tanlang":"Выберите"}
          options={COLORS_LIST} />
        <Input dark={dark} label={isUz?"Motor (l)":"Мотор (л)"} value={data.motor||""}
          onChange={e => u({ motor:e.target.value })} placeholder="1.5" />
      </FieldRow>
      <Input dark={dark} label="VIN" value={data.vin||""}
        onChange={e => u({ vin:e.target.value })} placeholder="WAUZZZ8K9BA123456" />
      <SectionTitle icon="💰" title={isUz?"Narx":"Цена"} />
      <PriceFields lang={lang} dark={dark} data={data} u={u} />
      <AIDescHelper lang={lang} dark={dark} title={`${data.brand} ${data.model}`} category="car" data={data}
        onResult={desc => u({ description:desc })} />
      <Input dark={dark} label={isUz?"Tavsif":"Описание"} value={data.description||""}
        onChange={e => u({ description:e.target.value })} multiline rows={4}
        placeholder={isUz?"Avtomobil haqida...":"Об автомобиле..."} />
    </div>
  );

  // ── KO'CHMAS MULK ─────────────────────────────────────
  if (data.adType === "realestate") return (
    <div>
      <PhotoSection />
      <SectionTitle icon="🏠" title={isUz?"Ko'chmas mulk":"Недвижимость"} />
      <RadioGroup label={isUz?"Bitim turi *":"Тип сделки *"} value={data.dealType||"forSale"}
        onChange={v => u({ dealType:v })} dark={dark}
        options={isUz ? [{value:"forSale",label:"Sotiladi"},{value:"forRent",label:"Ijara"}]
          : [{value:"forSale",label:"Продажа"},{value:"forRent",label:"Аренда"}]} />
      <FieldRow>
        <Input dark={dark} label={isUz?"Xonalar soni":"Комнат"} value={data.roomCount||""}
          onChange={e => u({ roomCount:e.target.value })} type="number" placeholder="3" />
        <Input dark={dark} label={isUz?"Maydon (m²)":"Площадь (м²)"} value={data.area||""}
          onChange={e => u({ area:e.target.value })} type="number" placeholder="82" />
      </FieldRow>
      <FieldRow>
        <Input dark={dark} label={isUz?"Qavat":"Этаж"} value={data.floor||""}
          onChange={e => u({ floor:e.target.value })} type="number" placeholder="5" />
        <Input dark={dark} label={isUz?"Jami qavatlar":"Всего этажей"} value={data.totalFloors||""}
          onChange={e => u({ totalFloors:e.target.value })} type="number" placeholder="16" />
      </FieldRow>
      <Select dark={dark} label={isUz?"Ta'mir holati":"Состояние ремонта"} value={data.repair||""}
        onChange={v => u({ repair:v })} placeholder={isUz?"Tanlang":"Выберите"}
        options={isUz?REPAIR_UZ:REPAIR_RU} />
      <Toggle dark={dark} value={data.furnished||false} onChange={v => u({ furnished:v })}
        label={isUz?"Mebel bilan":"С мебелью"} />
      <SectionTitle icon="💰" title={isUz?"Narx":"Цена"} />
      <PriceFields lang={lang} dark={dark} data={data} u={u} usdMode />
      <AIDescHelper lang={lang} dark={dark} title={data.title} category="apartment" data={data}
        onResult={desc => u({ description:desc })} />
      <Input dark={dark} label={isUz?"Tavsif":"Описание"} value={data.description||""}
        onChange={e => u({ description:e.target.value })} multiline rows={4}
        placeholder={isUz?"Kvartira haqida...":"О квартире..."} />
    </div>
  );

  // ── ISH O'RNI ─────────────────────────────────────────
  if (data.adType === "job") return (
    <div>
      <SectionTitle icon="💼" title={isUz?"Ish o'rni":"Вакансия"} />
      <Input dark={dark} label={isUz?"Kompaniya nomi *":"Название компании *"} required
        value={data.company||""} onChange={e => u({ company:e.target.value })} placeholder="TechSoft LLC" />
      <Input dark={dark} label={isUz?"Lavozim *":"Должность *"} required
        value={data.title||""} onChange={e => u({ title:e.target.value })} placeholder="Frontend Developer" />
      <Input dark={dark} label={isUz?"Maosh (so'm)":"Зарплата (сум)"} value={data.salary||""}
        onChange={e => u({ salary:e.target.value })} type="number" placeholder="5000000" />
      <RadioGroup label={isUz?"Ish turi":"Тип работы"} value={data.jobType||"fullTime"}
        onChange={v => u({ jobType:v })} dark={dark}
        options={isUz
          ? [{value:"fullTime",label:"To'liq"},{value:"partTime",label:"Yarim"},{value:"remote",label:"Masofaviy"},{value:"intern",label:"Amaliyot"}]
          : [{value:"fullTime",label:"Полный"},{value:"partTime",label:"Частичная"},{value:"remote",label:"Удалённо"},{value:"intern",label:"Стажировка"}]} />
      <Input dark={dark} label={isUz?"Tajriba":"Опыт"} value={data.experience||""}
        onChange={e => u({ experience:e.target.value })} placeholder={isUz?"1-3 yil":"1-3 года"} />
      <Input dark={dark} label={isUz?"Talablar":"Требования"} value={data.requirements||""}
        onChange={e => u({ requirements:e.target.value })} multiline rows={3}
        placeholder={isUz?"React, TypeScript...":"React, TypeScript..."} />
      <Input dark={dark} label={isUz?"Tavsif *":"Описание *"} required value={data.description||""}
        onChange={e => u({ description:e.target.value })} multiline rows={4}
        placeholder={isUz?"Ish haqida batafsil...":"Подробно об условиях..."} />
    </div>
  );

  // ── XIZMAT ────────────────────────────────────────────
  if (data.adType === "service") return (
    <div>
      <SectionTitle icon="🔧" title={isUz?"Xizmat ko'rsatish":"Услуги"} />
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:13, fontWeight:600, color:"#555", marginBottom:6 }}>
          {isUz?"Logo (ixtiyoriy)":"Логотип (необязательно)"}
        </div>
        <PhotoUploader dark={dark} photos={data.logo ? [data.logo] : []} max={1}
          onChange={arr => u({ logo:arr[0]||"" })} />
      </div>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:13, fontWeight:600, color:"#555", marginBottom:6 }}>
          {isUz?"Portfolio rasmlari":"Портфолио"}
        </div>
        <PhotoUploader dark={dark} photos={data.photos||[]} max={10}
          onChange={photos => u({ photos })} />
      </div>
      <Input dark={dark} label={isUz?"Xizmat nomi *":"Название услуги *"} required
        value={data.title||""} onChange={e => u({ title:e.target.value })}
        placeholder={isUz?"Santexnik xizmatlari":"Сантехнические услуги"} />
      <PriceFields lang={lang} dark={dark} data={data} u={u} />
      <RadioGroup label={isUz?"Narx turi":"Тип цены"} value={data.priceType2||"fixed"}
        onChange={v => u({ priceType2:v })} dark={dark}
        options={isUz
          ? [{value:"fixed",label:"Belgilangan"},{value:"hourly",label:"Soatlik"},{value:"daily",label:"Kunlik"},{value:"project",label:"Loyiha"}]
          : [{value:"fixed",label:"Фикс"},{value:"hourly",label:"В час"},{value:"daily",label:"В день"},{value:"project",label:"За проект"}]} />
      <Input dark={dark} label={isUz?"Ish tajribasi":"Опыт работы"} value={data.experience||""}
        onChange={e => u({ experience:e.target.value })} placeholder={isUz?"5 yil":"5 лет"} />
      <Input dark={dark} label={isUz?"Xizmat hududi":"Район обслуживания"} value={data.serviceArea||""}
        onChange={e => u({ serviceArea:e.target.value })} placeholder={isUz?"Toshkent, Yunusobod":"Ташкент, Юнусабад"} />
      <Toggle dark={dark} value={data.homeVisit||false} onChange={v => u({ homeVisit:v })}
        label={isUz?"Uyga chiqaman":"Выезжаю на дом"} />
      <Toggle dark={dark} value={data.online||false} onChange={v => u({ online:v })}
        label={isUz?"Online xizmat":"Онлайн-консультация"} />
      <AIDescHelper lang={lang} dark={dark} title={data.title} category="service" data={data}
        onResult={desc => u({ description:desc })} />
      <Input dark={dark} label={isUz?"Tavsif *":"Описание *"} required value={data.description||""}
        onChange={e => u({ description:e.target.value })} multiline rows={4}
        placeholder={isUz?"Xizmat haqida batafsil...":"Подробно об услуге..."} />
    </div>
  );

  // ── DEFAULT / BOSHQA ──────────────────────────────────
  return (
    <div>
      <PhotoSection />
      <SectionTitle icon="📦" title={isUz?"E'lon ma'lumotlari":"Данные объявления"} />
      <RadioGroup label={isUz?"Holati":"Состояние"} value={data.condition}
        onChange={v => u({ condition:v })} dark={dark}
        options={isUz?["Yangi","Ishlatilgan"]:["Новый","Б/у"]} />
      <Input dark={dark} label={isUz?"Sarlavha *":"Заголовок *"} required value={data.title||""}
        onChange={e => u({ title:e.target.value })} placeholder={isUz?"Nimani sotmoqchisiz?":"Что продаёте?"} />
      <SectionTitle icon="💰" title={isUz?"Narx":"Цена"} />
      <PriceFields lang={lang} dark={dark} data={data} u={u} />
      <AIDescHelper lang={lang} dark={dark} title={data.title} category="other" data={data}
        onResult={desc => u({ description:desc })} />
      <Input dark={dark} label={isUz?"Tavsif *":"Описание *"} required value={data.description||""}
        onChange={e => u({ description:e.target.value })} multiline rows={4}
        placeholder={isUz?"Mahsulot haqida...":"О товаре..."} />
    </div>
  );
}

// ─────────────────────────────────────────────────────
// PRICE FIELDS (reusable)
// ─────────────────────────────────────────────────────
function PriceFields({ lang, dark, data, u, usdMode }) {
  const isUz = lang === "uz";
  return (
    <>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:16 }}>
        {[
          { v:"fixed",      l:isUz?"Narx":"Цена",          ic:"💰" },
          { v:"free",       l:isUz?"Bepul":"Бесплатно",    ic:"🎁" },
          { v:"negotiable", l:isUz?"Kelishiladi":"Договор", ic:"🤝" },
        ].map(({ v, l, ic }) => (
          <button key={v} onClick={() => u({ priceType:v })} style={{
            background: data.priceType===v ? G+"18" : "#F8F8F8",
            border:`2px solid ${data.priceType===v ? G : "#E8E8E8"}`,
            borderRadius:12, padding:"12px 6px", cursor:"pointer",
            display:"flex", flexDirection:"column", alignItems:"center", gap:5,
          }}>
            <span style={{ fontSize:20 }}>{ic}</span>
            <span style={{ fontSize:11, fontWeight:700, color:data.priceType===v ? G : "#555" }}>{l}</span>
          </button>
        ))}
      </div>
      {data.priceType === "fixed" && (
        <Input dark={dark}
          label={`${isUz?"Narx":"Цена"} (${usdMode?"USD":"so'm"}) *`} required
          value={data.price||""} onChange={e => u({ price:e.target.value })}
          type="number" placeholder={usdMode?"50000":"1 000 000"} />
      )}
    </>
  );
}


// ─────────────────────────────────────────────────────
// STEP 3 — MANZIL
// ─────────────────────────────────────────────────────
function Step3({ lang, dark, data, u }) {
  const th = theme(dark);
  const isUz = lang === "uz";
  const CITIES = isUz ? CITIES_UZ : CITIES_RU;
  const districts = DISTRICTS_UZ[data.city] || [];

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos => {
      u({ lat:pos.coords.latitude, lng:pos.coords.longitude });
    });
  };

  return (
    <div>
      <div style={{ fontSize:17, fontWeight:800, color:th.text, marginBottom:18 }}>
        📍 {isUz?"Manzil":"Адрес"}
      </div>

      {/* Viloyat */}
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:13, fontWeight:600, color:th.text2, marginBottom:8 }}>
          {isUz?"Viloyat / Shahar *":"Область / Город *"}
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, maxHeight:160, overflowY:"auto" }}>
          {CITIES.map(c => (
            <button key={c} onClick={() => u({ city:c, district:"", mahalla:"" })} style={{
              padding:"8px 14px", borderRadius:20, fontSize:13, fontWeight:600,
              border:`2px solid ${data.city===c ? G : "#E8E8E8"}`,
              background: data.city===c ? G : "#F8F8F8",
              color: data.city===c ? "#fff" : "#555",
              cursor:"pointer", transition:"all 0.15s", whiteSpace:"nowrap",
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Tuman */}
      {data.city && districts.length > 0 && (
        <Select dark={dark} label={isUz?"Tuman *":"Район *"} value={data.district||""}
          onChange={v => u({ district:v })}
          placeholder={isUz?"Tumanni tanlang":"Выберите район"}
          options={districts} />
      )}
      {data.city && districts.length === 0 && (
        <Input dark={dark} label={isUz?"Tuman / Ko'cha":"Район / Улица"}
          value={data.district||""} onChange={e => u({ district:e.target.value })}
          placeholder={isUz?"Masalan: Yunusobod":"Напр: Юнусабад"} />
      )}

      {/* Mahalla */}
      <Input dark={dark} label={isUz?"Mahalla (ixtiyoriy)":"Махалля (необязательно)"}
        value={data.mahalla||""} onChange={e => u({ mahalla:e.target.value })}
        placeholder={isUz?"Mahalla nomi...":"Название махалли..."} />

      {/* Xaritada tanlash */}
      <div style={{ marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <div style={{ fontSize:13, fontWeight:600, color:th.text2 }}>
            {isUz?"Xaritada tanlash":"Отметить на карте"}
          </div>
          <button onClick={getCurrentLocation} style={{
            background:G+"15", border:"none", borderRadius:8,
            padding:"6px 12px", color:G, fontSize:12, fontWeight:700, cursor:"pointer",
            display:"flex", alignItems:"center", gap:5,
          }}>📍 {isUz?"Joylashuvim":"Моё место"}</button>
        </div>
        <YandexMapPicker lang={lang} lat={data.lat} lng={data.lng}
          onChange={({ lat, lng }) => u({ lat, lng })} />
      </div>

      {/* Aloqa */}
      <div style={{ fontSize:15, fontWeight:800, color:th.text, margin:"20px 0 14px", paddingTop:10, borderTop:`1px solid ${th.border}` }}>
        📞 {isUz?"Aloqa ma'lumotlari":"Контакты"}
      </div>
      <Input dark={dark} label={isUz?"Telefon *":"Телефон *"} required
        value={data.phone||""} onChange={e => u({ phone:e.target.value })}
        placeholder="+998 90 123 45 67" type="tel" />
      <Input dark={dark} label="Telegram (ixtiyoriy)" value={data.telegram||""}
        onChange={e => u({ telegram:e.target.value })} placeholder="@username" />
      <Input dark={dark} label="WhatsApp (ixtiyoriy)" value={data.whatsapp||""}
        onChange={e => u({ whatsapp:e.target.value })} placeholder="+998901234567" />
      <Toggle dark={dark} value={data.chatEnabled !== false} onChange={v => u({ chatEnabled:v })}
        label={isUz?"Chat orqali bog'lanish":"Связь через чат"} />
    </div>
  );
}


// ─────────────────────────────────────────────────────
// STEP 4 — YAKUNLASH (Preview + VIP + Chop etish)
// ─────────────────────────────────────────────────────
function Step4({ lang, dark, data, u, onPublish, loading }) {
  const th = theme(dark);
  const isUz = lang === "uz";
  const [agreed, setAgreed] = useState(false);
  const priceStr = data.priceType === "free"
    ? (isUz ? "Bepul" : "Бесплатно")
    : data.priceType === "negotiable"
    ? (isUz ? "Kelishiladi" : "Договорная")
    : Number(data.price||0).toLocaleString("ru-RU") + " " + (isUz?"so'm":"сум");
  const catItem = data.adType && CAT_TREE[data.adType]
    ? (CAT_TREE[data.adType][lang]||CAT_TREE[data.adType].uz).find(c=>c.id===data.category)
    : null;
  const DURATIONS = isUz ? DURATION_UZ : DURATION_RU;

  return (
    <div>
      {/* Preview */}
      <div style={{ fontSize:16, fontWeight:800, color:th.text, marginBottom:12 }}>
        👀 {isUz?"Ko'rib chiqish":"Предпросмотр"}
      </div>
      <div style={{ background:th.card, borderRadius:16, overflow:"hidden",
        border:`1px solid ${th.border}`, marginBottom:20, boxShadow:th.shadow }}>
        <div style={{ width:"100%", height:180, background:th.card2,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:60, overflow:"hidden" }}>
          {(data.photos||[])[0]
            ? <img src={data.photos[0]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            : catItem?.icon || "📦"}
        </div>
        <div style={{ padding:"14px 16px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            {data.promoPlan && data.promoPlan !== "free" && (
              <span style={{ background:PROMO_PLANS.find(p=>p.id===data.promoPlan)?.color+"25",
                color:PROMO_PLANS.find(p=>p.id===data.promoPlan)?.color,
                fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:6 }}>
                {data.promoPlan === "vip" ? "⭐ VIP"
                 : data.promoPlan === "top" ? "🔝 TOP"
                 : "🚀 VIP+TOP"}
              </span>
            )}
          </div>
          <div style={{ fontSize:20, fontWeight:900, color:G, marginBottom:4 }}>{priceStr}</div>
          <div style={{ fontSize:15, fontWeight:600, color:th.text, marginBottom:8 }}>
            {data.title || (isUz?"E'lon sarlavhasi":"Заголовок объявления")}
          </div>
          {data.description && (
            <div style={{ fontSize:13, color:th.sub, marginBottom:8, lineHeight:1.5,
              overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
              {data.description}
            </div>
          )}
          <div style={{ display:"flex", gap:12 }}>
            <span style={{ fontSize:12, color:th.sub }}>📍 {data.city||"—"}{data.district?", "+data.district:""}</span>
            <span style={{ fontSize:12, color:th.sub }}>🕐 {isUz?"Bugun":"Сегодня"}</span>
          </div>
        </div>
      </div>

      {/* Ko'rinish muddati */}
      <div style={{ fontSize:15, fontWeight:800, color:th.text, marginBottom:12 }}>
        ⏱ {isUz?"Ko'rinish muddati":"Срок размещения"}
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {DURATIONS.map(d => (
          <button key={d} onClick={() => u({ duration:d })} style={{
            flex:1, padding:"12px 8px", borderRadius:12, textAlign:"center",
            border:`2px solid ${data.duration===d ? G : th.border}`,
            background: data.duration===d ? G+"18" : th.card2,
            color: data.duration===d ? G : th.text,
            fontWeight:700, fontSize:13, cursor:"pointer",
          }}>{d}</button>
        ))}
      </div>

      {/* Promo plans */}
      <div style={{ fontSize:15, fontWeight:800, color:th.text, marginBottom:12 }}>
        🚀 {isUz?"Reklama paketi":"Пакет рекламы"}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
        {PROMO_PLANS.map(plan => (
          <button key={plan.id} onClick={() => u({ promoPlan:plan.id })} style={{
            background: data.promoPlan===plan.id ? plan.color+"15" : th.card,
            border:`2px solid ${data.promoPlan===plan.id ? plan.color : th.border}`,
            borderRadius:14, padding:"14px 16px", cursor:"pointer",
            display:"flex", alignItems:"center", gap:12, textAlign:"left",
            boxShadow: data.promoPlan===plan.id ? `0 4px 16px ${plan.color}30` : "none",
          }}>
            <span style={{ fontSize:26 }}>{plan.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:800, color:data.promoPlan===plan.id ? plan.color : th.text }}>
                {isUz ? plan.label_uz : plan.label_ru}
              </div>
              <div style={{ fontSize:12, color:th.sub, marginTop:2 }}>
                {plan.id==="free" ? (isUz?"Asosiy e'lon":"Обычное объявление")
                 : plan.id==="vip" ? (isUz?"Maxsus belgi + yuqori ro'yxat":"Особая метка + высший список")
                 : plan.id==="top" ? (isUz?"Eng yuqorida ko'rsatiladi":"Показывается выше всех")
                 : (isUz?"VIP + TOP kombinatsiya":"Комбинация VIP + TOP")}
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:14, fontWeight:800,
                color: plan.price===0 ? G : plan.color }}>
                {plan.price===0 ? (isUz?"Bepul":"Бесплатно") : plan.price.toLocaleString()+" so'm"}
              </div>
              {data.promoPlan===plan.id && (
                <span style={{ fontSize:11, color:"#fff", background:plan.color,
                  padding:"2px 8px", borderRadius:6, fontWeight:700, marginTop:4, display:"block" }}>
                  ✓ {isUz?"Tanlandi":"Выбрано"}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Shartlarga rozilik */}
      <button onClick={() => setAgreed(a=>!a)} style={{
        width:"100%", padding:"14px 16px", borderRadius:12,
        background: agreed ? G+"12" : th.card2,
        border:`1.5px solid ${agreed ? G : th.border}`,
        display:"flex", alignItems:"center", gap:12, cursor:"pointer", marginBottom:20,
      }}>
        <span style={{ fontSize:22 }}>{agreed ? "☑" : "☐"}</span>
        <span style={{ fontSize:13, color:th.text, fontWeight:600, textAlign:"left" }}>
          {isUz ? "Foydalanish shartlariga roziman" : "Согласен с условиями использования"}
        </span>
      </button>

      {/* Joylashtirish tugmasi */}
      <button onClick={() => agreed && onPublish()} disabled={!agreed || loading}
        style={{
          width:"100%", padding:"16px", borderRadius:16,
          background: agreed && !loading ? `linear-gradient(135deg,${G},${GD})` : "#E8E8E8",
          border:"none", cursor: agreed&&!loading ? "pointer" : "not-allowed",
          color: agreed&&!loading ? "#fff" : "#aaa",
          fontSize:16, fontWeight:800,
          boxShadow: agreed&&!loading ? `0 6px 24px ${G}55` : "none",
          transition:"all 0.3s", display:"flex", alignItems:"center", justifyContent:"center", gap:10,
        }}>
        {loading ? (
          <><span style={{ fontSize:20 }}>⏳</span>{isUz?"Joylashtirilmoqda...":"Публикуется..."}</>
        ) : (
          <><span style={{ fontSize:20 }}>🚀</span>{isUz?"E'LONNI JOYLASHTIRISH":"ОПУБЛИКОВАТЬ"}</>
        )}
      </button>
    </div>
  );
}


// ─────────────────────────────────────────────────────
// MAIN AddListing COMPONENT
// ─────────────────────────────────────────────────────
export default function AddListing({ lang, dark, onDone, onCancel, onLive, currentUser }) {
  const th = theme(dark);
  const isUz = lang === "uz";
  const STEPS = isUz ? STEPS_UZ : STEPS_RU;

  const [step, setStep]     = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData]     = useState(() => {
    // Draft tiklash
    try {
      const draft = localStorage.getItem("osontop_draft");
      if (draft) return JSON.parse(draft);
    } catch {}
    return {
      adType:"", category:"", title:"", description:"",
      price:"", priceType:"fixed", condition:"",
      city:"", district:"", mahalla:"", phone:"", telegram:"", whatsapp:"",
      chatEnabled:true, photos:[], lat:null, lng:null,
      brand:"", model:"", storage:"", ram:"", color:"", imei:"", kit:[],
      year:"", mileage:"", fuel:"", transmission:"", motor:"", vin:"",
      dealType:"forSale", roomCount:"", area:"", floor:"", totalFloors:"",
      repair:"", furnished:false,
      company:"", jobType:"fullTime", experience:"", salary:"", requirements:"",
      logo:"", serviceArea:"", homeVisit:false, online:false, priceType2:"fixed",
      promoPlan:"free", duration:"30 kun",
    };
  });

  const u = useCallback((patch) => setData(p => ({ ...p, ...patch })), []);

  // Auto draft saqlab turish
  useEffect(() => {
    const t = setInterval(() => {
      try { localStorage.setItem("osontop_draft", JSON.stringify(data)); } catch {}
    }, 10000);
    return () => clearInterval(t);
  }, [data]);

  // Step validatsiyasi
  const canNext = () => {
    if (step === 0) return !!(data.adType && data.category);
    if (step === 1) {
      if (data.category === "phone") return !!(data.condition && data.brand && data.model && data.price);
      if (data.adType === "transport") return !!(data.brand && data.model);
      if (data.adType === "realestate") return !!(data.dealType);
      if (data.adType === "job") return !!(data.company && data.title && data.description);
      if (data.adType === "service") return !!(data.title && data.description);
      return !!(data.title && data.description);
    }
    if (step === 2) return !!(data.city && data.phone);
    return true;
  };

  const handlePublish = () => {
    setLoading(true);
    setTimeout(() => {
      const listing = {
        id: genId(),
        ...data,
        price: data.priceType==="free" ? 0 : data.priceType==="negotiable" ? -1 : Number(data.price),
        seller: {
          id:   currentUser?.uid  || "demo",
          name: currentUser?.name || (isUz?"Foydalanuvchi":"Пользователь"),
          phone: data.phone || currentUser?.phone || "+998901234567",
          verified:false, rating:0, reviewCount:0,
        },
        views:0, favorites:0, active:true,
        createdAt: new Date().toISOString(),
        lat:  data.lat  || 41.299,
        lng:  data.lng  || 69.240,
        isVip: data.promoPlan==="vip" || data.promoPlan==="viptop",
        isTop: data.promoPlan==="top" || data.promoPlan==="viptop",
      };
      try { localStorage.removeItem("osontop_draft"); } catch {}
      setLoading(false);
      onDone(listing);
    }, 1200);
  };

  const stepComponents = [
    <Step1 key="s1" lang={lang} dark={dark} data={data} u={u} onLive={onLive} />,
    <Step2 key="s2" lang={lang} dark={dark} data={data} u={u} />,
    <Step3 key="s3" lang={lang} dark={dark} data={data} u={u} />,
    <Step4 key="s4" lang={lang} dark={dark} data={data} u={u} onPublish={handlePublish} loading={loading} />,
  ];

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:500, background:th.bg,
      maxWidth:430, margin:"0 auto", display:"flex", flexDirection:"column",
    }}>
      {/* ── HEADER ── */}
      <div style={{
        background:`linear-gradient(135deg,${G},${GD})`,
        padding:"50px 16px 14px", flexShrink:0,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
          <button onClick={() => step === 0 ? onCancel() : setStep(s => s-1)} style={{
            background:"rgba(255,255,255,0.2)", border:"none", borderRadius:10,
            width:36, height:36, color:"#fff", fontSize:18, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>←</button>
          <div style={{ flex:1 }}>
            <div style={{ color:"#fff", fontWeight:800, fontSize:16 }}>
              {isUz?"Yangi e'lon":"Новое объявление"}
            </div>
            <div style={{ color:"rgba(255,255,255,0.65)", fontSize:11, marginTop:1 }}>
              {isUz ? `${step+1} / 4 bosqich` : `Шаг ${step+1} из 4`}
            </div>
          </div>
          {/* Draft indicator */}
          <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:8,
            padding:"4px 10px", fontSize:11, color:"rgba(255,255,255,0.8)", fontWeight:600 }}>
            {isUz?"Draft":"Черновик"}
          </div>
        </div>
        <StepBar step={step} lang={lang} dark={dark} />
      </div>

      {/* ── CONTENT ── */}
      <div style={{ flex:1, overflowY:"auto", padding:"20px 16px 120px" }}>
        {stepComponents[step]}
      </div>

      {/* ── BOTTOM BUTTONS ── (faqat step 3 da yo'q — u yerda o'zi tugma bor) */}
      {step < 3 && (
        <div style={{
          position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
          width:"100%", maxWidth:430,
          padding:"12px 16px 28px", background:th.card,
          borderTop:`1px solid ${th.border}`,
          display:"flex", gap:10, zIndex:60,
          boxShadow:"0 -4px 20px rgba(0,0,0,0.08)",
        }}>
          {step > 0 && (
            <Btn dark={dark} variant="ghost" onClick={() => setStep(s=>s-1)} style={{ flex:1 }}>
              ← {isUz?"Orqaga":"Назад"}
            </Btn>
          )}
          <Btn dark={dark} onClick={() => canNext() && setStep(s=>s+1)}
            disabled={!canNext()}
            style={{ flex: step>0 ? 2 : 1, background:canNext()?G:undefined }}>
            {isUz?"Davom etish →":"Продолжить →"}
          </Btn>
        </div>
      )}
    </div>
  );
}
