import { useState, useEffect, useRef, useCallback } from "react";
import { theme } from "../theme.js";
import { T } from "../translations.js";
import { formatPrice, genId, DEMO_LISTINGS, CITIES_UZ, CITIES_RU } from "../utils.js";
import { Input, Select, Toggle, PhotoUploader, Btn } from "../components/UI.jsx";

const G  = "#16A34A";
const GD = "#15803D";
const ACCENT = "#6366F1"; // GroupSell o'z rangi — indigo

// ─── Countdown hook ──────────────────────────────────
function useCountdown(endTime) {
  const [left, setLeft] = useState(Math.max(0, new Date(endTime) - Date.now()));
  useEffect(() => {
    const t = setInterval(() => setLeft(Math.max(0, new Date(endTime) - Date.now())), 1000);
    return () => clearInterval(t);
  }, [endTime]);
  const h = Math.floor(left / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  const total = h * 3600 + m * 60 + s;
  return { h, m, s, expired: left === 0, totalSec: total, isUrgent: total < 300 };
}

// ─── Puls tugma ──────────────────────────────────────
function PBtn({ children, onClick, disabled, color, small, style: sx }) {
  const [p, setP] = useState(false);
  const go = () => {
    if (disabled) return;
    setP(true); setTimeout(() => setP(false), 320);
    onClick?.();
  };
  return (
    <button onClick={go} disabled={disabled} style={{
      width:"100%", padding: small ? "11px 14px" : "15px",
      borderRadius:14, border:"none",
      background: disabled ? "#E5E7EB" : `linear-gradient(135deg,${color||ACCENT},${color||ACCENT}CC)`,
      color: disabled ? "#9CA3AF" : "#fff",
      fontSize: small ? 13 : 15, fontWeight:800, cursor: disabled ? "not-allowed" : "pointer",
      transform: p ? "scale(0.96)" : "scale(1)",
      boxShadow: disabled ? "none" : `0 5px 18px ${color||ACCENT}45`,
      transition:"all 0.12s ease",
      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
      ...sx,
    }}>
      {children}
    </button>
  );
}

// ─── Avatar ──────────────────────────────────────────
function Av({ member, size = 32, showBadge = false, borderColor = "#fff" }) {
  const roles = { leader:"👑", seller:"🏪", member:"" };
  return (
    <div style={{ position:"relative", flexShrink:0 }}>
      <div style={{
        width:size, height:size, borderRadius:size/2,
        background:`linear-gradient(135deg,${member.color},${member.color}BB)`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:size*0.4, fontWeight:900, color:"#fff",
        border:`2px solid ${borderColor}`, boxShadow:"0 2px 6px rgba(0,0,0,0.12)",
      }}>{member.avatar}</div>
      {showBadge && member.role === "leader" && (
        <div style={{ position:"absolute", top:-4, right:-4, fontSize:10 }}>👑</div>
      )}
      {showBadge && member.payStatus === "paid" && (
        <div style={{
          position:"absolute", bottom:-2, right:-2, width:13, height:13, borderRadius:7,
          background:G, border:`2px solid ${borderColor}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:7, color:"#fff", fontWeight:900,
        }}>✓</div>
      )}
      {showBadge && member.payStatus === "pending" && (
        <div style={{
          position:"absolute", bottom:-2, right:-2, width:13, height:13, borderRadius:7,
          background:"#F59E0B", border:`2px solid ${borderColor}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:7, color:"#fff",
        }}>⏳</div>
      )}
    </div>
  );
}

// ─── Countdown blok ──────────────────────────────────
function TUnit({ value, label, urgent }) {
  const prev = useRef(value);
  const [flip, setFlip] = useState(false);
  useEffect(() => {
    if (prev.current !== value) {
      setFlip(true); prev.current = value;
      const t = setTimeout(() => setFlip(false), 220);
      return () => clearTimeout(t);
    }
  }, [value]);
  const col = urgent ? "#EF4444" : "#fff";
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", minWidth:42 }}>
      <div style={{
        background: urgent ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.15)",
        borderRadius:10, padding:"5px 8px", minWidth:42, textAlign:"center",
        border:`1px solid ${urgent ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.2)"}`,
        transform: flip ? "scaleY(0.8)" : "scaleY(1)", transition:"transform 0.12s ease",
      }}>
        <div style={{ fontSize:20, fontWeight:900, color:col, fontFamily:"monospace", lineHeight:1 }}>
          {String(value).padStart(2,"0")}
        </div>
      </div>
      <div style={{ fontSize:8, color: urgent ? "#FCA5A5" : "rgba(255,255,255,0.6)",
        marginTop:3, fontWeight:700, textTransform:"uppercase" }}>{label}</div>
    </div>
  );
}
function TSep({ urgent }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:12, paddingTop:2 }}>
      <div style={{ width:3, height:3, borderRadius:2, background: urgent ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.4)" }} />
      <div style={{ width:3, height:3, borderRadius:2, background: urgent ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.4)" }} />
    </div>
  );
}


// ════════════════════════════════════════════════════════
// DEMO DATA
// ════════════════════════════════════════════════════════
const DEMO_GSELLS = [
  {
    id:"gs1", emoji:"📱", color:"#6366F1",
    title:{ uz:"iPhone 15 Pro — Guruh sotish", ru:"iPhone 15 Pro — Групповая продажа" },
    normalPrice:14500000, groupPrice:11500000,
    requiredMembers:10, currentMembers:7,
    deadline: new Date(Date.now() + 3600000*18 + 60000*24).toISOString(),
    visibility:"all", status:"active",
    description:{ uz:"256GB, Natural Titanium. Original. 1 yil kafolat.", ru:"256GB, Natural Titanium. Оригинал. Гарантия 1 год." },
    leader:{ id:"l1", name:"Jasur", avatar:"J", color:"#6366F1", role:"leader", payStatus:"paid" },
    members:[
      { id:"m1", name:"Jasur",   avatar:"J", color:"#6366F1", role:"leader", payStatus:"paid"    },
      { id:"m2", name:"Sardor",  avatar:"S", color:"#8B5CF6", role:"member", payStatus:"paid"    },
      { id:"m3", name:"Malika",  avatar:"M", color:"#EC4899", role:"member", payStatus:"pending" },
      { id:"m4", name:"Bobur",   avatar:"B", color:"#F59E0B", role:"member", payStatus:"paid"    },
      { id:"m5", name:"Nodira",  avatar:"N", color:"#10B981", role:"member", payStatus:"pending" },
      { id:"m6", name:"Kamol",   avatar:"K", color:"#EF4444", role:"member", payStatus:"paid"    },
      { id:"m7", name:"Zulfiya", avatar:"Z", color:"#3B82F6", role:"member", payStatus:"pending" },
    ],
    initialMessages:[
      { id:"cm1", sender:"system", text:{ uz:"🎉 Jasur GroupSell yaratdi!", ru:"🎉 Jasur создал GroupSell!" }, time:"09:10", isSystem:true },
      { id:"cm2", sender:"seller", name:"Jasur", avatar:"J", color:"#6366F1",
        text:{ uz:"Salom! Bu iPhone original, 1 yil kafolat bilan. Tez to'playmiz!", ru:"Привет! iPhone оригинальный, гарантия 1 год. Быстро соберёмся!" }, time:"09:12", isSystem:false },
      { id:"cm3", sender:"m2", name:"Sardor", avatar:"S", color:"#8B5CF6",
        text:{ uz:"Yaxshi narx! Men tayyorman.", ru:"Хорошая цена! Я готов." }, time:"09:20", isSystem:false },
      { id:"cm4", sender:"m3", name:"Malika", avatar:"M", color:"#EC4899",
        text:{ uz:"Qora rangi bormi?", ru:"Есть чёрный цвет?" }, time:"09:25", isSystem:false },
      { id:"cm5", sender:"seller", name:"Jasur", avatar:"J", color:"#6366F1",
        text:{ uz:"Ha, Black va Natural Titanium bor.", ru:"Да, есть Black и Natural Titanium." }, time:"09:26", isSystem:false },
      { id:"cm6", sender:"system", text:{ uz:"💰 Sardor to'lovni amalga oshirdi. ✅", ru:"💰 Сардор оплатил. ✅" }, time:"09:30", isSystem:true },
    ],
    coins: 100,
  },
  {
    id:"gs2", emoji:"📺", color:"#EC4899",
    title:{ uz:"Samsung TV 55\" — Guruh sotish", ru:"Samsung TV 55\" — Групповая продажа" },
    normalPrice:4200000, groupPrice:3200000,
    requiredMembers:5, currentMembers:3,
    deadline: new Date(Date.now() + 3600000*36).toISOString(),
    visibility:"region", status:"active",
    description:{ uz:"4K Smart TV, 2023 model, Wi-Fi, 2 yil kafolat.", ru:"4K Smart TV, модель 2023, Wi-Fi, гарантия 2 года." },
    leader:{ id:"l2", name:"Alisher", avatar:"A", color:"#EC4899", role:"leader", payStatus:"paid" },
    members:[
      { id:"n1", name:"Alisher", avatar:"A", color:"#EC4899", role:"leader", payStatus:"paid"    },
      { id:"n2", name:"Dilnoza", avatar:"D", color:"#8B5CF6", role:"member", payStatus:"pending" },
      { id:"n3", name:"Firdavs", avatar:"F", color:"#3B82F6", role:"member", payStatus:"paid"    },
    ],
    initialMessages:[
      { id:"d1", sender:"system", text:{ uz:"🎉 Alisher GroupSell yaratdi!", ru:"🎉 Алишер создал GroupSell!" }, time:"10:00", isSystem:true },
      { id:"d2", sender:"seller", name:"Alisher", avatar:"A", color:"#EC4899",
        text:{ uz:"Salom! Samsung TV original, 2 yil kafolat. 5 kishi bo'lsak olamiz!", ru:"Привет! Samsung TV оригинал, гарантия 2 года. Нужно 5 человек!" }, time:"10:05", isSystem:false },
    ],
    coins: 50,
  },
];

const AI_QA = {
  uz:[
    { q:["kafolat","warranty"],  a:"✅ 1-2 yil rasmiy kafolat. Har qanday nosozlikda almashtiriladi." },
    { q:["yetkazish","dostavka"],a:"🚚 Butun O'zbekiston bo'ylab 1-3 kun. Toshkent: 1 kun." },
    { q:["original","asl"],      a:"✅ 100% original. Serial raqam orqali tekshiriladi." },
    { q:["rang","color"],        a:"🎨 Bir necha rang mavjud. Sotuvchidan so'rang." },
    { q:["narx","price","qancha"],a:"💰 Guruh narxi oddiydan ancha arzon. To'g'ridan-to'g'ri sotuvchi bilan!" },
    { q:["batareya","battery"],  a:"🔋 Batareya salomatligi 100%. 67W Fast Charge qo'llab-quvvatlanadi." },
  ],
  ru:[
    { q:["гарантия","warranty"], a:"✅ Официальная гарантия 1-2 года. При неисправности — замена." },
    { q:["доставка","delivery"], a:"🚚 По всему Узбекистану 1-3 дня. Ташкент: 1 день." },
    { q:["оригинал","original"], a:"✅ 100% оригинал. Проверка по серийному номеру." },
    { q:["цвет","color"],        a:"🎨 Доступны несколько цветов. Уточните у продавца." },
    { q:["цена","price","стоит"],a:"💰 Групповая цена значительно ниже обычной. Напрямую от продавца!" },
    { q:["батарея","battery"],   a:"🔋 Аккумулятор 100%. Поддерживает быструю зарядку 67W." },
  ],
};


// ════════════════════════════════════════════════════════
// DEMO DATA
// ════════════════════════════════════════════════════════
function GSCard({ gs, lang, dark, onOpen, isJoined }) {
  const th = theme(dark);
  const tx = T[lang];
  const { h, m, s, expired, isUrgent } = useCountdown(gs.deadline);
  const isUz = lang === "uz";
  const progress = gs.currentMembers / gs.requiredMembers;
  const remaining = gs.requiredMembers - gs.currentMembers;
  const discount = Math.round((1 - gs.groupPrice / gs.normalPrice) * 100);

  return (
    <div style={{ background:th.card, borderRadius:20, overflow:"hidden", marginBottom:14,
      border:`1px solid ${th.border}`, boxShadow:"0 4px 20px rgba(0,0,0,0.08)" }}>

      {/* Banner */}
      <div style={{ background:`linear-gradient(135deg,${gs.color},${gs.color}BB)`, position:"relative" }}>
        {/* NEW badge */}
        <div style={{ position:"absolute", top:10, left:10, zIndex:5,
          background:"#EF4444", color:"#fff", fontSize:10, fontWeight:900,
          padding:"3px 8px", borderRadius:20, letterSpacing:0.5 }}>NEW 🔥</div>
        {/* Viewers */}
        <div style={{ position:"absolute", top:10, right:10, zIndex:5,
          background:"rgba(0,0,0,0.35)", backdropFilter:"blur(6px)",
          color:"#fff", fontSize:9, fontWeight:700, padding:"3px 8px", borderRadius:20 }}>
          👁 {Math.floor(Math.random()*20)+8} {isUz?"ko'rmoqda":"смотрят"}
        </div>

        {/* Rasm / emoji */}
        <div style={{ height:140, display:"flex", alignItems:"center",
          justifyContent:"center", flexDirection:"column", gap:6 }}>
          <div style={{ fontSize:64, filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.2))" }}>{gs.emoji}</div>
          <div style={{ background:"rgba(255,255,255,0.15)", backdropFilter:"blur(6px)",
            borderRadius:16, padding:"3px 10px", display:"flex", alignItems:"center", gap:4 }}>
            {[1,2,3,4,5].map(n=>(
              <span key={n} style={{ fontSize:9, color:"#F59E0B" }}>★</span>
            ))}
            <span style={{ fontSize:9, color:"rgba(255,255,255,0.8)", marginLeft:2 }}>5.0</span>
          </div>
        </div>

        {/* Nom + countdown */}
        <div style={{ padding:"8px 14px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ color:"#fff", fontWeight:800, fontSize:14, lineHeight:1.2 }}>{gs.title[lang]}</div>
            <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:6, padding:"1px 7px",
              fontSize:10, fontWeight:800, color:"#fff", display:"inline-block", marginTop:3 }}>
              -{discount}% {isUz?"chegirma":"скидка"}
            </div>
          </div>
          {!expired ? (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:2 }}>
              <div style={{ fontSize:8, color: isUrgent?"#FCA5A5":"rgba(255,255,255,0.65)", fontWeight:700 }}>
                ⏰ {isUz?"TUGASHIGA:":"ДО КОНЦА:"}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:2 }}>
                <TUnit value={h} label={isUz?"SOAT":"ЧАС"} urgent={isUrgent}/>
                <TSep urgent={isUrgent}/>
                <TUnit value={m} label={isUz?"DAQ":"МИН"} urgent={isUrgent}/>
                <TSep urgent={isUrgent}/>
                <TUnit value={s} label={isUz?"SON":"СЕК"} urgent={isUrgent}/>
              </div>
            </div>
          ) : (
            <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:8, padding:"6px 10px",
              color:"#fff", fontSize:11, fontWeight:700 }}>⏰ {isUz?"Tugadi":"Завершено"}</div>
          )}
        </div>
      </div>

      {/* Kontent */}
      <div style={{ padding:"12px 14px" }}>
        {/* Narxlar */}
        <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:12,
          background:th.card2, borderRadius:12, padding:"10px 12px" }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:9, color:th.sub, marginBottom:1 }}>{isUz?"Oddiy narx":"Обычная цена"}</div>
            <div style={{ fontWeight:700, color:th.sub, textDecoration:"line-through", fontSize:13 }}>
              {formatPrice(gs.normalPrice)} {tx.sum}
            </div>
          </div>
          <span style={{ fontSize:14, color:th.sub }}>→</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:9, color:ACCENT, marginBottom:1 }}>🤝 {isUz?"Guruh narxi":"Цена группы"}</div>
            <div style={{ fontWeight:900, color:ACCENT, fontSize:17 }}>
              {formatPrice(gs.groupPrice)} <span style={{ fontSize:11 }}>{tx.sum}</span>
            </div>
          </div>
          <div style={{ background:G+"15", borderRadius:10, padding:"6px 8px", border:`1px solid ${G}25`, textAlign:"center" }}>
            <div style={{ fontSize:8, color:G, fontWeight:700 }}>{isUz?"Tejash":"Экономия"}</div>
            <div style={{ fontWeight:900, color:G, fontSize:12 }}>
              {formatPrice(gs.normalPrice - gs.groupPrice)}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
            <span style={{ fontSize:11, fontWeight:700, color:th.text }}>
              {gs.currentMembers} / {gs.requiredMembers} {isUz?"a'zo":"участников"}
            </span>
            <span style={{ fontSize:11, fontWeight:800, color:remaining<=2?"#EF4444":G }}>
              {isUz?`Yana ${remaining} kishi`:`Ещё ${remaining}`}
            </span>
          </div>
          <div style={{ height:8, background:th.card2, borderRadius:4, overflow:"hidden", border:`1px solid ${th.border}` }}>
            <div style={{ height:"100%", width:`${progress*100}%`,
              background:`linear-gradient(to right,${gs.color},${ACCENT})`,
              borderRadius:4, transition:"width 1s cubic-bezier(0.34,1.56,0.64,1)", position:"relative" }}>
              <div style={{ position:"absolute", right:0, top:"50%", transform:"translate(50%,-50%)",
                width:14, height:14, borderRadius:7, background:"#fff",
                border:`2.5px solid ${ACCENT}`, boxShadow:"0 2px 5px rgba(0,0,0,0.15)" }} />
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:3 }}>
            {Array.from({length:gs.requiredMembers}).map((_,i)=>(
              <div key={i} style={{ width:5, height:5, borderRadius:3,
                background:i<gs.currentMembers?ACCENT:th.card2 }} />
            ))}
          </div>
        </div>

        {/* A'zolar */}
        <div style={{ display:"flex", alignItems:"center", marginBottom:12 }}>
          {gs.members.slice(0,5).map((mem,i)=>(
            <div key={i} style={{ marginLeft:i>0?-8:0, zIndex:10-i }}>
              <Av member={mem} size={28} showBadge />
            </div>
          ))}
          {gs.members.length>5 && (
            <div style={{ width:28, height:28, borderRadius:14, background:th.card2,
              border:"2px solid #fff", display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:9, fontWeight:800, color:th.sub, marginLeft:-8 }}>+{gs.members.length-5}</div>
          )}
          {/* Bo'sh joylar + */}
          {Array.from({length:Math.min(3,gs.requiredMembers-gs.members.length)}).map((_,i)=>(
            <div key={"p"+i} style={{ width:28, height:28, borderRadius:14, background:"transparent",
              border:`2px dashed ${th.border}`, display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:14, color:th.sub, marginLeft:-8 }}>+</div>
          ))}
          <div style={{ marginLeft:10, flex:1 }}>
            <div style={{ fontSize:9, color:th.sub }}>{isUz?"qo'shilgan":"участвуют"}</div>
            <div style={{ fontSize:9, color:ACCENT, fontWeight:700, marginTop:1 }}>
              🏆 {isUz?"Lider":"Лидер"}: {gs.members.find(m=>m.role==="leader")?.name}
            </div>
          </div>
          {/* Coin reward */}
          {gs.coins && (
            <div style={{ background:"#F59E0B15", borderRadius:10, padding:"4px 8px", border:"1px solid #F59E0B30" }}>
              <div style={{ fontSize:9, color:"#F59E0B", fontWeight:800 }}>🪙 {gs.coins} Coin</div>
            </div>
          )}
        </div>

        {/* CTA */}
        <PBtn onClick={()=>onOpen(gs)} disabled={expired || gs.currentMembers>=gs.requiredMembers} color={gs.color}>
          {isJoined
            ? `💬 ${isUz?"Chatni ochish":"Открыть чат"}`
            : expired ? `⏰ ${isUz?"Tugadi":"Завершено"}`
            : gs.currentMembers>=gs.requiredMembers ? `🔒 ${isUz?"To'ldi":"Заполнено"}`
            : `🤝 ${isUz?"Guruhga qo'shilish":"Присоединиться"}`}
        </PBtn>
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════
// 5-BOSQICHLI WIZARD — GROUP YARATISH
// ════════════════════════════════════════════════════════
function CreateWizard({ lang, dark, currentUser, myListings, onDone, onBack }) {
  const th = theme(dark);
  const isUz = lang === "uz";
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    product:null, title:"", emoji:"📦", color:ACCENT,
    requiredMembers:5, deadline:"24",
    normalPrice:"", groupPrice:"", photos:[],
    description:"", visibility:"all",
  });
  const u = (p) => setForm(prev => ({ ...prev, ...p }));
  const STEPS = isUz
    ? ["Mahsulot","Sozlamalar","Narx","Kirish","Ko'rib chiqish"]
    : ["Товар","Настройки","Цена","Доступ","Предпросмотр"];
  const can = [
    !!form.product || (form.title.trim().length>=3),
    form.requiredMembers >= 2 && form.deadline,
    !!form.normalPrice && !!form.groupPrice,
    !!form.visibility,
    true,
  ];

  const handleCreate = () => {
    const gs = {
      id: genId(),
      emoji: form.emoji, color: form.color,
      title:{ uz: form.title || form.product?.title || "Yangi group", ru: form.title || form.product?.title || "Новая группа" },
      normalPrice: Number(form.normalPrice),
      groupPrice:  Number(form.groupPrice),
      requiredMembers: form.requiredMembers,
      currentMembers: 1,
      deadline: new Date(Date.now() + Number(form.deadline)*3600000).toISOString(),
      visibility: form.visibility, status:"active",
      description:{ uz:form.description, ru:form.description },
      coins: form.requiredMembers >= 20 ? 250 : form.requiredMembers >= 10 ? 100 : 50,
      members:[{
        id:"me", name:currentUser?.name||"Men", avatar:(currentUser?.name?.[0]||"M"),
        color:ACCENT, role:"leader", payStatus:"paid"
      }],
      initialMessages:[{
        id:genId(), sender:"system",
        text:{ uz:`🎉 ${currentUser?.name||"Siz"} GroupSell yaratdi!`, ru:`🎉 ${currentUser?.name||"Вы"} создали GroupSell!` },
        time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), isSystem:true,
      }],
    };
    onDone(gs);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:550, background:th.bg, maxWidth:430, margin:"0 auto", display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${ACCENT},#4F46E5)`, padding:"46px 14px 14px", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
          <button onClick={()=>step===0?onBack():setStep(s=>s-1)} style={{
            background:"rgba(255,255,255,0.2)", border:"none", borderRadius:10,
            width:34, height:34, color:"#fff", fontSize:16, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center" }}>←</button>
          <div style={{ flex:1 }}>
            <div style={{ color:"#fff", fontWeight:800, fontSize:16 }}>
              {isUz?"GroupSell yaratish":"Создать GroupSell"}
            </div>
            <div style={{ color:"rgba(255,255,255,0.7)", fontSize:11 }}>{step+1}/5 · {STEPS[step]}</div>
          </div>
        </div>
        {/* Step bar */}
        <div style={{ display:"flex", gap:4 }}>
          {STEPS.map((_,i) => (
            <div key={i} style={{ flex:1, height:3, borderRadius:2,
              background: i <= step ? "#fff" : "rgba(255,255,255,0.25)",
              transition:"background 0.3s" }} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:"auto", padding:"20px 16px 100px" }}>

        {/* STEP 0 — Mahsulot */}
        {step===0 && (
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:th.text, marginBottom:4 }}>
              📦 {isUz?"Mahsulot tanlash":"Выберите товар"}
            </div>
            <div style={{ fontSize:12, color:th.sub, marginBottom:16 }}>
              {isUz?"Mavjud e'londan yoki yangi qo'shing":"Из ваших объявлений или добавьте новый"}
            </div>

            {/* Mavjud e'lonlar */}
            {myListings?.length > 0 && (
              <>
                <div style={{ fontSize:12, fontWeight:700, color:th.sub, marginBottom:8 }}>
                  {isUz?"Mening e'lonlarim":"Мои объявления"}
                </div>
                {myListings.slice(0,4).map(l => (
                  <div key={l.id} onClick={()=>u({product:l, title:l.title, normalPrice:String(l.price>0?l.price:""), emoji:"📦"})}
                    style={{ display:"flex", gap:12, padding:"10px 12px", borderRadius:14, marginBottom:8,
                      background:form.product?.id===l.id?ACCENT+"15":th.card2,
                      border:`2px solid ${form.product?.id===l.id?ACCENT:th.border}`,
                      cursor:"pointer", transition:"all 0.15s" }}>
                    <div style={{ width:50, height:50, borderRadius:10, background:th.card,
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>
                      {l.photos?.[0] ? <img src={l.photos[0]} alt="" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:10}}/> : "📦"}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:th.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.title}</div>
                      <div style={{ fontSize:12, color:ACCENT, fontWeight:700 }}>{formatPrice(l.price)} {T[lang].sum}</div>
                    </div>
                    {form.product?.id===l.id && <span style={{ color:ACCENT, fontSize:18 }}>✓</span>}
                  </div>
                ))}
                <div style={{ display:"flex", alignItems:"center", gap:10, margin:"16px 0" }}>
                  <div style={{ flex:1, height:1, background:th.border }} />
                  <span style={{ fontSize:12, color:th.sub }}>{isUz?"yoki":"или"}</span>
                  <div style={{ flex:1, height:1, background:th.border }} />
                </div>
              </>
            )}

            {/* Yangi mahsulot qo'shish */}
            <div style={{ fontSize:12, fontWeight:700, color:th.sub, marginBottom:8 }}>
              {isUz?"Yangi mahsulot":"Новый товар"}
            </div>
            <Input dark={dark} label={isUz?"Mahsulot nomi *":"Название товара *"} required
              value={form.title} onChange={e=>u({title:e.target.value})} placeholder={isUz?"iPhone 15 Pro...":"iPhone 15 Pro..."} />
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:13, fontWeight:600, color:th.text2, marginBottom:8 }}>{isUz?"Emoji tanlang":"Выберите emoji"}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {["📱","💻","📺","🚗","🏠","👗","⚽","🧸","🍎","📦"].map(e=>(
                  <button key={e} onClick={()=>u({emoji:e})} style={{
                    width:40, height:40, borderRadius:10, fontSize:20, border:"none", cursor:"pointer",
                    background:form.emoji===e?ACCENT+"20":th.card2,
                    border:`2px solid ${form.emoji===e?ACCENT:th.border}`,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>{e}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:13, fontWeight:600, color:th.text2, marginBottom:8 }}>{isUz?"Rangini tanlang":"Выберите цвет"}</div>
              <div style={{ display:"flex", gap:8 }}>
                {[ACCENT,"#EC4899","#3B82F6","#10B981","#F59E0B","#EF4444"].map(c=>(
                  <button key={c} onClick={()=>u({color:c})} style={{
                    width:36, height:36, borderRadius:18, border:`3px solid ${form.color===c?"#fff":"transparent"}`,
                    background:c, cursor:"pointer", outline:`2px solid ${form.color===c?c:"transparent"}` }} />
                ))}
              </div>
            </div>
            <div style={{ fontSize:12, fontWeight:700, color:th.sub, marginBottom:6 }}>{isUz?"Rasmlar (ixtiyoriy)":"Фотографии (необязательно)"}</div>
            <PhotoUploader dark={dark} photos={form.photos} max={6} onChange={photos=>u({photos})} />
          </div>
        )}

        {/* STEP 1 — Sozlamalar */}
        {step===1 && (
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:th.text, marginBottom:16 }}>
              ⚙️ {isUz?"Group sozlamalari":"Настройки группы"}
            </div>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:13, fontWeight:700, color:th.text, marginBottom:10 }}>
                👥 {isUz?"Minimal odam soni":"Минимальное количество"}
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {[2,5,10,20,50].map(n=>(
                  <button key={n} onClick={()=>u({requiredMembers:n})} style={{
                    flex:1, minWidth:52, padding:"12px 8px", borderRadius:12, textAlign:"center",
                    border:`2px solid ${form.requiredMembers===n?ACCENT:th.border}`,
                    background:form.requiredMembers===n?ACCENT+"18":th.card2,
                    color:form.requiredMembers===n?ACCENT:th.text,
                    fontWeight:800, fontSize:15, cursor:"pointer" }}>{n}</button>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:th.text, marginBottom:10 }}>
                ⏰ {isUz?"Deadline":"Дедлайн"}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {[{v:"12",l:isUz?"12 soat":"12 часов"},{v:"24",l:isUz?"24 soat":"24 часа"},
                  {v:"48",l:isUz?"48 soat":"48 часов"},{v:"72",l:isUz?"72 soat":"72 часа"}].map(d=>(
                  <button key={d.v} onClick={()=>u({deadline:d.v})} style={{
                    padding:"12px", borderRadius:12,
                    border:`2px solid ${form.deadline===d.v?ACCENT:th.border}`,
                    background:form.deadline===d.v?ACCENT+"18":th.card2,
                    color:form.deadline===d.v?ACCENT:th.text,
                    fontWeight:700, fontSize:13, cursor:"pointer" }}>{d.l}</button>
                ))}
              </div>
            </div>
            <div style={{ marginTop:16 }}>
              <Input dark={dark} label={isUz?"Tavsif (ixtiyoriy)":"Описание (необязательно)"}
                value={form.description} onChange={e=>u({description:e.target.value})}
                multiline rows={3} placeholder={isUz?"Mahsulot haqida qisqacha...":"Кратко о товаре..."} />
            </div>
          </div>
        )}

        {/* STEP 2 — Narx */}
        {step===2 && (
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:th.text, marginBottom:16 }}>
              💰 {isUz?"Narxlarni kiriting":"Введите цены"}
            </div>
            <Input dark={dark} label={isUz?"Oddiy narx (so'm) *":"Обычная цена (сум) *"} required
              value={form.normalPrice} onChange={e=>u({normalPrice:e.target.value})}
              type="number" placeholder="14500000" />
            <Input dark={dark} label={isUz?"Guruh narxi (so'm) *":"Цена группы (сум) *"} required
              value={form.groupPrice} onChange={e=>u({groupPrice:e.target.value})}
              type="number" placeholder="11500000" />
            {form.normalPrice && form.groupPrice && Number(form.normalPrice) > Number(form.groupPrice) && (
              <div style={{ background:G+"12", borderRadius:12, padding:"12px 14px", border:`1px solid ${G}25`,
                display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:4 }}>
                {[
                  { label:isUz?"Chegirma":"Скидка", val:`${Math.round((1-Number(form.groupPrice)/Number(form.normalPrice))*100)}%`, color:ACCENT },
                  { label:isUz?"Tejash":"Экономия", val:`${formatPrice(Number(form.normalPrice)-Number(form.groupPrice))}`, color:G },
                  { label:isUz?"Har kishi":"На персону", val:formatPrice(Number(form.groupPrice)), color:"#F59E0B" },
                ].map((s,i)=>(
                  <div key={i} style={{ textAlign:"center", background:th.card, borderRadius:10, padding:"8px 6px" }}>
                    <div style={{ fontSize:14, fontWeight:900, color:s.color }}>{s.val}</div>
                    <div style={{ fontSize:9, color:th.sub, marginTop:2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 3 — Ko'rinish */}
        {step===3 && (
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:th.text, marginBottom:16 }}>
              🌍 {isUz?"Kim qo'shila oladi?":"Кто может присоединиться?"}
            </div>
            {[
              { v:"all",     icon:"🌍", label:isUz?"Hamma":"Все",              sub:isUz?"Ilovadagi barcha foydalanuvchilar":"Все пользователи приложения" },
              { v:"region",  icon:"📍", label:isUz?"Faqat viloyatim":"Мой регион", sub:isUz?"Faqat mening shahrimda":"Только в моём городе" },
              { v:"mahalla", icon:"🏘️", label:isUz?"Mahallam":"Моя махалля",    sub:isUz?"Yaqin atrofdagilar":"Ближайшие соседи" },
              { v:"link",    icon:"🔗", label:isUz?"Link orqali":"По ссылке",  sub:isUz?"Faqat link yuborilganlarga":"Только по приглашению" },
              { v:"private", icon:"🔒", label:isUz?"Private":"Приватный",      sub:isUz?"Faqat siz taklif qilganlarga":"Только для приглашённых вами" },
            ].map(opt=>(
              <div key={opt.v} onClick={()=>u({visibility:opt.v})} style={{
                display:"flex", alignItems:"center", gap:14, padding:"14px 14px",
                background:form.visibility===opt.v?ACCENT+"12":th.card2,
                border:`2px solid ${form.visibility===opt.v?ACCENT:th.border}`,
                borderRadius:14, marginBottom:8, cursor:"pointer", transition:"all 0.15s" }}>
                <span style={{ fontSize:24 }}>{opt.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:form.visibility===opt.v?ACCENT:th.text }}>{opt.label}</div>
                  <div style={{ fontSize:11, color:th.sub }}>{opt.sub}</div>
                </div>
                <div style={{ width:18, height:18, borderRadius:9,
                  border:`2px solid ${form.visibility===opt.v?ACCENT:th.border}`,
                  background:form.visibility===opt.v?ACCENT:"transparent",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {form.visibility===opt.v && <div style={{ width:7, height:7, borderRadius:4, background:"#fff" }}/>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STEP 4 — Preview */}
        {step===4 && (
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:th.text, marginBottom:16 }}>
              👀 {isUz?"Ko'rib chiqish":"Предпросмотр"}
            </div>
            <div style={{ background:th.card, borderRadius:16, overflow:"hidden", border:`1px solid ${th.border}`, marginBottom:16, boxShadow:"0 4px 16px rgba(0,0,0,0.08)" }}>
              <div style={{ background:`linear-gradient(135deg,${form.color},${form.color}BB)`,
                height:120, display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:60, filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.2))" }}>
                {form.emoji}
              </div>
              <div style={{ padding:"14px 16px" }}>
                <div style={{ fontSize:16, fontWeight:800, color:th.text, marginBottom:6 }}>
                  {form.title || (isUz?"Mahsulot nomi":"Название товара")}
                </div>
                <div style={{ display:"flex", gap:12, marginBottom:10 }}>
                  <div>
                    <div style={{ fontSize:9, color:th.sub }}>{isUz?"Oddiy narx":"Обычная цена"}</div>
                    <div style={{ fontWeight:700, color:th.sub, textDecoration:"line-through", fontSize:13 }}>
                      {formatPrice(Number(form.normalPrice)||0)} {T[lang].sum}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize:9, color:ACCENT }}>{isUz?"Guruh narxi":"Цена группы"}</div>
                    <div style={{ fontWeight:900, color:ACCENT, fontSize:16 }}>
                      {formatPrice(Number(form.groupPrice)||0)} {T[lang].sum}
                    </div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  <span style={{ background:ACCENT+"15", color:ACCENT, fontSize:11, fontWeight:700,
                    padding:"3px 8px", borderRadius:8 }}>👥 {form.requiredMembers} {isUz?"kishi":"человек"}</span>
                  <span style={{ background:"#F59E0B15", color:"#F59E0B", fontSize:11, fontWeight:700,
                    padding:"3px 8px", borderRadius:8 }}>⏰ {form.deadline}{isUz?"h":"ч"}</span>
                  <span style={{ background:G+"15", color:G, fontSize:11, fontWeight:700,
                    padding:"3px 8px", borderRadius:8 }}>
                    -{Math.round((1-Number(form.groupPrice)/Number(form.normalPrice||1))*100)||0}%
                  </span>
                </div>
                {form.description && (
                  <div style={{ fontSize:12, color:th.sub, marginTop:10, lineHeight:1.5 }}>{form.description}</div>
                )}
              </div>
            </div>

            {/* Share */}
            <div style={{ background:th.card2, borderRadius:14, padding:"12px 14px", marginBottom:14, border:`1px solid ${th.border}` }}>
              <div style={{ fontSize:12, fontWeight:700, color:th.text, marginBottom:10 }}>
                📤 {isUz?"Ulashish":"Поделиться"}
              </div>
              <div style={{ display:"flex", gap:8 }}>
                {[
                  { icon:"✈️", label:"Telegram", color:"#2CA5E0" },
                  { icon:"💬", label:"WhatsApp", color:"#25D366" },
                  { icon:"📋", label:isUz?"Link":"Ссылка", color:"#6366F1" },
                  { icon:"◼", label:"QR",        color:"#1A1A1A" },
                ].map((s,i)=>(
                  <button key={i} onClick={()=>{}} style={{
                    flex:1, padding:"10px 4px", borderRadius:12,
                    background:s.color+"15", border:`1px solid ${s.color}25`,
                    color:s.color, cursor:"pointer", textAlign:"center" }}>
                    <div style={{ fontSize:18 }}>{s.icon}</div>
                    <div style={{ fontSize:9, fontWeight:700, marginTop:2 }}>{s.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:430, background:th.card, borderTop:`1px solid ${th.border}`,
        padding:"12px 16px 28px", display:"flex", gap:10, zIndex:60 }}>
        {step > 0 && (
          <button onClick={()=>setStep(s=>s-1)} style={{
            flex:1, padding:"14px", borderRadius:14, border:`1.5px solid ${th.border}`,
            background:th.card2, color:th.text, fontWeight:700, fontSize:14, cursor:"pointer" }}>
            ← {isUz?"Orqaga":"Назад"}
          </button>
        )}
        {step < 4 ? (
          <PBtn onClick={()=>can[step]&&setStep(s=>s+1)} disabled={!can[step]} color={ACCENT}
            sx={{ flex: step>0?2:1 }}>
            {isUz?"Davom etish →":"Продолжить →"}
          </PBtn>
        ) : (
          <PBtn onClick={handleCreate} color={ACCENT} sx={{ flex:2 }}>
            🚀 {isUz?"GroupSell yaratish!":"Создать GroupSell!"}
          </PBtn>
        )}
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════
// GROUP CHAT ROOM
// ════════════════════════════════════════════════════════
function GSChatRoom({ gs, lang, dark, currentMember, onBack, onPayDone }) {
  const th = theme(dark);
  const tx = T[lang];
  const isUz = lang === "uz";
  const { h, m, s, expired, isUrgent } = useCountdown(gs.deadline);
  const [members, setMembers] = useState([...gs.members,
    { ...currentMember, payStatus:"pending" }]);
  const [messages, setMessages] = useState([...gs.initialMessages]);
  const [input, setInput] = useState("");
  const [typingName, setTypingName] = useState(null);
  const [showPay, setShowPay] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const listRef = useRef(null);
  const curCount = members.length;
  const maxCount = gs.requiredMembers;
  const isFull   = curCount >= maxCount;
  const progress = curCount / maxCount;

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, typingName]);

  // AI javob
  const checkAI = useCallback((text) => {
    const lower = text.toLowerCase();
    const answers = AI_QA[lang] || AI_QA.uz;
    const found = answers.find(a => a.q.some(q => lower.includes(q)));
    if (!found) return;
    setTypingName(isUz ? "🤖 AI yozmoqda..." : "🤖 AI печатает...");
    setTimeout(() => {
      setTypingName(null);
      setMessages(p => [...p, {
        id:genId(), sender:"ai", name:"🤖 AI",
        avatar:"🤖", color:"#8B5CF6",
        text:{ uz:found.a, ru:found.a },
        time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
        isSystem:false,
      }]);
    }, 1300);
  }, [lang, isUz]);

  const addSysMsg = (uz, ru) => setMessages(p => [...p, {
    id:genId(), sender:"system",
    text:{ uz, ru }, isSystem:true,
    time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
  }]);

  const send = () => {
    const txt = input.trim(); if (!txt) return;
    // Typing simulation
    const rnd = members.filter(m=>m.id!=="me")[Math.floor(Math.random()*members.length)];
    if (rnd && Math.random()>0.45) {
      setTimeout(()=>{
        setTypingName(`${rnd.name} ${isUz?"yozmoqda...":"печатает..."}`);
        setTimeout(()=>setTypingName(null), 2200);
      }, 900);
    }
    setMessages(p=>[...p,{
      id:genId(), sender:"me", name:currentMember.name,
      avatar:currentMember.avatar, color:currentMember.color,
      text:{uz:txt,ru:txt}, isSystem:false,
      time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
    }]);
    checkAI(txt);
    setInput("");
  };

  const handlePaySuccess = () => {
    setShowPay(false);
    setMembers(p=>p.map(mm=>mm.id==="me"?{...mm,payStatus:"paid"}:mm));
    const paid = members.filter(m=>m.payStatus==="paid").length + 1;
    addSysMsg(
      `💰 ${currentMember.name} to'lovni amalga oshirdi. ${paid}/${curCount} to'ladi ✅`,
      `💰 ${currentMember.name} оплатил. ${paid}/${curCount} оплатили ✅`
    );
    if (isFull) {
      setTimeout(()=>setShowReward(true), 800);
    }
    onPayDone?.(gs);
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:620,background:th.bg,maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column"}}>

      {/* ─ Reward overlay ─ */}
      {showReward && (
        <div style={{position:"absolute",inset:0,zIndex:800,background:"rgba(0,0,0,0.8)",
          display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
          <div style={{fontSize:60,marginBottom:10,animation:"bounce3 0.6s ease 3"}}>🎉</div>
          <div style={{fontSize:26,fontWeight:900,color:"#fff",marginBottom:6}}>
            {isUz?"Tabriklaymiz!":"Поздравляем!"}
          </div>
          <div style={{background:"#F59E0B",borderRadius:16,padding:"10px 20px",marginBottom:16}}>
            <div style={{fontSize:20,fontWeight:900,color:"#fff",textAlign:"center"}}>
              🪙 {gs.coins||100} Coin {isUz?"qozondi!":"заработано!"}
            </div>
          </div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.8)",marginBottom:20,textAlign:"center",padding:"0 30px"}}>
            {isUz?"Group muvaffaqiyatli to'ldi! Coinlar chegirmaga ishlatiladi.":"Группа заполнена! Коины используются для скидок."}
          </div>
          <button onClick={()=>setShowReward(false)} style={{
            background:ACCENT,border:"none",borderRadius:14,padding:"14px 28px",
            color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer"}}>
            {isUz?"Ajoyib! 🚀":"Отлично! 🚀"}
          </button>
        </div>
      )}

      {/* ─ TOP HEADER ─ */}
      <div style={{background:`linear-gradient(135deg,${gs.color},${gs.color}BB)`,flexShrink:0}}>
        <div style={{padding:"46px 14px 0",display:"flex",alignItems:"center",gap:10}}>
          <button onClick={onBack} style={{background:"rgba(255,255,255,0.2)",border:"none",
            borderRadius:10,width:34,height:34,color:"#fff",fontSize:16,cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>←</button>
          <div style={{width:46,height:46,borderRadius:12,background:"rgba(255,255,255,0.2)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>
            {gs.emoji}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{color:"#fff",fontWeight:800,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
              {gs.title[lang]}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}>
              {[1,2,3,4,5].map(n=><span key={n} style={{fontSize:9,color:"#F59E0B"}}>★</span>)}
              <span style={{fontSize:9,color:"rgba(255,255,255,0.7)"}}>✓ {isUz?"Original":"Оригинал"}</span>
            </div>
          </div>
          <button onClick={()=>setShowVideo(v=>!v)} style={{
            background:showVideo?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.15)",
            border:"none",borderRadius:8,padding:"5px 9px",color:"#fff",
            fontSize:10,fontWeight:700,cursor:"pointer",flexShrink:0}}>▶ {isUz?"Video":"Видео"}</button>
        </div>

        {showVideo && (
          <div style={{margin:"8px 14px 0",background:"rgba(0,0,0,0.35)",borderRadius:12,
            height:120,display:"flex",alignItems:"center",justifyContent:"center",
            border:"1px solid rgba(255,255,255,0.2)",position:"relative"}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:36,marginBottom:4}}>▶</div>
              <div style={{color:"rgba(255,255,255,0.8)",fontSize:11,fontWeight:600}}>
                {isUz?"Mahsulot videosi · 45 soniya":"Видео товара · 45 секунд"}
              </div>
            </div>
            <div style={{position:"absolute",bottom:6,right:8,background:"rgba(0,0,0,0.5)",
              borderRadius:6,padding:"2px 6px",fontSize:9,color:"#fff"}}>45s</div>
          </div>
        )}

        {/* Stats */}
        <div style={{margin:"8px 14px 0",background:"rgba(255,255,255,0.12)",borderRadius:12,
          padding:"8px 12px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:4}}>
          {[
            {icon:"👥", top:`${curCount}/${maxCount}`,   bot:isUz?"A'zo":"Участники"},
            {icon:"💰", top:formatPrice(gs.groupPrice).replace(/\s/g,""), bot:"so'm"},
            {icon:isUrgent?"🔴":"⏰",
              top:<span style={{color:isUrgent?"#FCA5A5":"#fff",fontFamily:"monospace",fontSize:10,fontWeight:900}}>
                {`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`}</span>,
              bot:isUz?"Qoldi":"Осталось"},
            {icon:"🔥", top:`${maxCount-curCount}`, bot:isUz?"Kerak":"Нужно"},
          ].map((item,i)=>(
            <div key={i} style={{textAlign:"center"}}>
              <div style={{fontSize:13}}>{item.icon}</div>
              <div style={{fontSize:10,fontWeight:900,color:"#fff"}}>{item.top}</div>
              <div style={{fontSize:8,color:"rgba(255,255,255,0.65)"}}>{item.bot}</div>
            </div>
          ))}
        </div>
        {/* Progress */}
        <div style={{margin:"6px 14px 10px"}}>
          <div style={{height:5,background:"rgba(255,255,255,0.2)",borderRadius:3,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${progress*100}%`,
              background:isFull?"linear-gradient(90deg,#F59E0B,#EF4444)":"rgba(255,255,255,0.9)",
              borderRadius:3,transition:"width 1.1s cubic-bezier(0.34,1.56,0.64,1)"}}/>
          </div>
          {isFull && (
            <div style={{textAlign:"center",fontSize:10,color:"#F59E0B",fontWeight:800,marginTop:4,animation:"pulse 1s infinite"}}>
              🎉 {isUz?"Guruh to'ldi! To'lovni amalga oshiring.":"Группа заполнена! Оплатите заказ."}
            </div>
          )}
        </div>
      </div>

      {/* ─ A'ZOLAR ─ */}
      <div style={{background:th.card,padding:"8px 12px",flexShrink:0,
        borderBottom:`1px solid ${th.border}`,display:"flex",alignItems:"center",gap:5,overflowX:"auto"}}>
        {members.map((mem,i)=>(
          <div key={mem.id||i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,flexShrink:0}}>
            <Av member={mem} size={28} showBadge />
            <div style={{fontSize:7,color:th.sub,maxWidth:32,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"center"}}>{mem.name}</div>
          </div>
        ))}
        {Array.from({length:Math.max(0,maxCount-members.length)}).map((_,i)=>(
          <div key={"e"+i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,flexShrink:0}}>
            <div style={{width:28,height:28,borderRadius:14,background:"transparent",
              border:`2px dashed ${th.border}`,display:"flex",alignItems:"center",
              justifyContent:"center",fontSize:16,color:th.sub}}>+</div>
            <div style={{fontSize:7,color:th.sub}}>{isUz?"Joy":"Место"}</div>
          </div>
        ))}
      </div>

      {/* ─ MESSAGES ─ */}
      <div ref={listRef} style={{flex:1,overflowY:"auto",padding:"10px 14px",display:"flex",flexDirection:"column",gap:7}}>
        {messages.map(msg=>{
          if (msg.isSystem) return (
            <div key={msg.id} style={{textAlign:"center"}}>
              <span style={{
                background: msg.isFull?"linear-gradient(135deg,#F59E0B,#EF4444)":ACCENT+"18",
                color: msg.isFull?"#fff":ACCENT,
                fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:20,
                border: msg.isFull?"none":`1px solid ${ACCENT}25`,display:"inline-block"}}>
                {msg.text[lang]}
              </span>
            </div>
          );
          const isMe     = msg.sender==="me";
          const isLeader = msg.sender==="leader";
          const isAI     = msg.sender==="ai";
          return (
            <div key={msg.id} style={{display:"flex",flexDirection:isMe?"row-reverse":"row",alignItems:"flex-end",gap:7}}>
              {!isMe && (
                <div style={{width:28,height:28,borderRadius:14,flexShrink:0,
                  background:isAI?"#8B5CF6":isLeader?ACCENT:msg.color,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:13,border:`2px solid ${th.card}`}}>
                  {msg.avatar}
                </div>
              )}
              <div style={{maxWidth:"75%",display:"flex",flexDirection:"column",alignItems:isMe?"flex-end":"flex-start"}}>
                {!isMe && (
                  <div style={{fontSize:9,fontWeight:700,
                    color:isAI?"#8B5CF6":isLeader?ACCENT:msg.color,marginBottom:2,paddingLeft:3,
                    display:"flex",alignItems:"center",gap:4}}>
                    {msg.name}
                    {isLeader && <span style={{background:ACCENT+"20",color:ACCENT,fontSize:8,padding:"1px 4px",borderRadius:4}}>👑 {isUz?"Lider":"Лидер"}</span>}
                    {isAI && <span style={{background:"#8B5CF620",color:"#8B5CF6",fontSize:8,padding:"1px 4px",borderRadius:4}}>AI</span>}
                  </div>
                )}
                <div style={{
                  background:isMe?gs.color:isAI?"#8B5CF615":isLeader?ACCENT+"15":th.card2,
                  color:isMe?"#fff":th.text,
                  padding:"8px 11px",
                  borderRadius:isMe?"14px 3px 14px 14px":"3px 14px 14px 14px",
                  fontSize:13,lineHeight:1.5,
                  border:isMe?"none":`1px solid ${isAI?"#8B5CF630":isLeader?ACCENT+"25":th.border}`,
                }}>
                  {msg.text[lang]}
                </div>
                <div style={{fontSize:8,color:th.sub,marginTop:2}}>{msg.time}</div>
              </div>
            </div>
          );
        })}
        {typingName && (
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <div style={{width:28,height:28,borderRadius:14,background:th.card2,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>💬</div>
            <div style={{background:th.card2,padding:"7px 11px",borderRadius:"3px 14px 14px 14px",border:`1px solid ${th.border}`}}>
              <div style={{fontSize:11,color:th.sub,fontStyle:"italic"}}>{typingName}</div>
            </div>
          </div>
        )}
      </div>

      {/* ─ INPUT ─ */}
      <div style={{background:th.card,borderTop:`1px solid ${th.border}`,padding:"8px 12px 22px",flexShrink:0}}>
        {isFull && (
          <div style={{background:`linear-gradient(135deg,${G},${GD})`,borderRadius:12,
            padding:"9px 12px",marginBottom:8,display:"flex",alignItems:"center",gap:8,animation:"pulse 1.5s infinite"}}>
            <span style={{fontSize:18}}>🎉</span>
            <div style={{flex:1}}>
              <div style={{color:"#fff",fontWeight:800,fontSize:12}}>{isUz?"Guruh to'ldi!":"Группа заполнена!"}</div>
              <div style={{color:"rgba(255,255,255,0.8)",fontSize:10}}>{isUz?"Hozir to'lov qiling":"Оплатите сейчас"}</div>
            </div>
          </div>
        )}

        {/* Collapse — tafsilotlar */}
        <div style={{marginBottom:7}}>
          <button onClick={()=>setCollapsed(c=>!c)} style={{
            width:"100%",background:th.card2,border:`1px solid ${th.border}`,
            borderRadius:10,padding:"8px 12px",cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontSize:12,fontWeight:600,color:th.text}}>
              📦 {isUz?"Buyurtma tafsilotlari":"Детали заказа"}
            </span>
            <span style={{fontSize:12,color:th.sub,transform:collapsed?"rotate(0)":"rotate(180deg)",transition:"transform 0.2s"}}>▾</span>
          </button>
          {!collapsed && (
            <div style={{background:th.card2,borderRadius:"0 0 10px 10px",border:`1px solid ${th.border}`,
              borderTop:"none",padding:"9px 12px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
              {[
                {icon:"🚚",label:isUz?"Yetkazish":"Доставка",val:isUz?"1-3 kun":"1-3 дня"},
                {icon:"🛡️",label:isUz?"Himoya":"Защита",val:isUz?"Kafolat":"Гарантия"},
                {icon:"↩️",label:isUz?"Qaytarish":"Возврат",val:isUz?"7 kun":"7 дней"},
                {icon:"💳",label:isUz?"Muddatli":"Рассрочка",val:isUz?"0% foiz":"0%"},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:14}}>{item.icon}</span>
                  <div>
                    <div style={{fontSize:8,color:th.sub,fontWeight:600}}>{item.label}</div>
                    <div style={{fontSize:10,color:th.text,fontWeight:700}}>{item.val}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{display:"flex",gap:7,alignItems:"flex-end",marginBottom:7}}>
          <div style={{flex:1,background:th.card2,borderRadius:20,border:`1.5px solid ${th.border}`,padding:"9px 12px",display:"flex",alignItems:"center"}}>
            <input value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&send()}
              placeholder={isUz?"Xabar yozing...":"Написать сообщение..."}
              style={{flex:1,border:"none",background:"transparent",outline:"none",fontSize:13,color:th.text,fontFamily:"inherit"}}/>
            <span style={{fontSize:15,opacity:0.4,cursor:"pointer"}}>🤖</span>
          </div>
          <button onClick={send} style={{
            width:40,height:40,borderRadius:20,
            background:input.trim()?gs.color:th.card2,border:"none",cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:input.trim()?`0 4px 12px ${gs.color}45`:"none",transition:"all 0.2s"}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke={input.trim()?"#fff":th.sub} strokeWidth="2.5" strokeLinecap="round">
              <path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>
            </svg>
          </button>
        </div>

        {/* To'lov */}
        <PBtn onClick={()=>setShowPay(true)} color={gs.color}>
          💳 {isUz?"To'lov qilish":"Оплатить"} — {formatPrice(gs.groupPrice)} {T[lang].sum}
        </PBtn>
      </div>

      {showPay && (
        <GSPayModal gs={gs} lang={lang} dark={dark}
          onClose={()=>setShowPay(false)} onSuccess={handlePaySuccess}/>
      )}

      <style>{`
        @keyframes bounce3{0%,100%{transform:scale(1)}50%{transform:scale(1.3)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.7}}
      `}</style>
    </div>
  );
}


// ════════════════════════════════════════════════════════
// TO'LOV MODALI
// ════════════════════════════════════════════════════════
function GSPayModal({ gs, lang, dark, onClose, onSuccess }) {
  const th = theme(dark);
  const tx = T[lang];
  const isUz = lang === "uz";
  const [method, setMethod] = useState("payme");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (loading) return (
    <div style={{ position:"fixed",inset:0,zIndex:700,background:"rgba(0,0,0,0.65)",
      display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ background:th.card,borderRadius:20,padding:"30px 24px",textAlign:"center",width:280 }}>
        <div style={{ width:50,height:50,borderRadius:25,border:`4px solid ${ACCENT}`,
          borderTopColor:"transparent",animation:"spin 0.8s linear infinite",margin:"0 auto 14px" }}/>
        <div style={{ fontSize:13,fontWeight:700,color:th.text }}>
          {isUz?"To'lov amalga oshirilmoqda...":"Обработка платежа..."}
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if (done) return (
    <div style={{ position:"fixed",inset:0,zIndex:700,background:"rgba(0,0,0,0.65)",
      display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ background:th.card,borderRadius:20,padding:"26px 22px",textAlign:"center",width:300 }}>
        <div style={{ fontSize:56,marginBottom:10 }}>🎉</div>
        <div style={{ fontSize:17,fontWeight:800,color:G,marginBottom:5 }}>
          {isUz?"To'lov qabul qilindi!":"Оплата принята!"}
        </div>
        <div style={{ background:G+"12",borderRadius:12,padding:"10px 12px",marginBottom:14,border:`1px solid ${G}25` }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
            <span style={{ color:th.sub,fontSize:11 }}>{isUz?"To'langan":"Оплачено"}</span>
            <span style={{ fontWeight:700,color:G }}>{formatPrice(gs.groupPrice)} {tx.sum}</span>
          </div>
          <div style={{ display:"flex",justifyContent:"space-between" }}>
            <span style={{ color:th.sub,fontSize:11 }}>{isUz?"Tejash":"Экономия"}</span>
            <span style={{ fontWeight:700,color:"#10B981" }}>-{formatPrice(gs.normalPrice-gs.groupPrice)} {tx.sum}</span>
          </div>
        </div>
        <PBtn onClick={onSuccess} color={G}>{isUz?"Chatga qaytish 💬":"Вернуться в чат 💬"}</PBtn>
      </div>
    </div>
  );

  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,zIndex:700,background:"rgba(0,0,0,0.6)",
      display:"flex",alignItems:"flex-end",justifyContent:"center",maxWidth:430,margin:"0 auto" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:th.card,borderRadius:"20px 20px 0 0",width:"100%",padding:"0 0 26px" }}>
        <div style={{ width:34,height:4,background:th.border,borderRadius:2,margin:"12px auto 14px" }}/>
        <div style={{ padding:"0 16px" }}>
          <div style={{ fontSize:15,fontWeight:800,color:th.text,marginBottom:12 }}>💳 {isUz?"To'lov qilish":"Оплата"}</div>
          <div style={{ background:`${gs.color}12`,borderRadius:12,padding:"11px 13px",marginBottom:12,border:`1px solid ${gs.color}25` }}>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:6 }}>
              <span style={{ fontSize:22 }}>{gs.emoji}</span>
              <div style={{ fontWeight:700,color:th.text,fontSize:12 }}>{gs.title[lang]}</div>
            </div>
            <div style={{ display:"flex",justifyContent:"space-between" }}>
              <span style={{ color:th.sub,fontSize:11 }}>{isUz?"Guruh narxi":"Цена группы"}</span>
              <span style={{ fontWeight:900,color:ACCENT,fontSize:14 }}>{formatPrice(gs.groupPrice)} {tx.sum}</span>
            </div>
          </div>
          {[
            { id:"payme", label:"Payme",    icon:"💳", color:"#00AAFF" },
            { id:"click", label:"Click",    icon:"🔵", color:"#0066CC" },
            { id:"uzum",  label:"Uzum Pay", icon:"🟣", color:"#7B2FBE" },
            { id:"visa",  label:"Visa",     icon:"💙", color:"#1A1F71" },
            { id:"mc",    label:"Mastercard",icon:"🔴",color:"#EB001B" },
          ].map(pm=>(
            <div key={pm.id} onClick={()=>setMethod(pm.id)} style={{
              display:"flex",alignItems:"center",gap:10,padding:"10px 12px",
              background:method===pm.id?pm.color+"12":th.card2,
              border:`2px solid ${method===pm.id?pm.color:th.border}`,
              borderRadius:11,marginBottom:7,cursor:"pointer",transition:"all 0.15s" }}>
              <span style={{ fontSize:20 }}>{pm.icon}</span>
              <span style={{ flex:1,fontWeight:600,color:th.text,fontSize:13 }}>{pm.label}</span>
              <div style={{ width:16,height:16,borderRadius:8,
                border:`2px solid ${method===pm.id?pm.color:th.border}`,
                background:method===pm.id?pm.color:"transparent",
                display:"flex",alignItems:"center",justifyContent:"center" }}>
                {method===pm.id&&<div style={{ width:6,height:6,borderRadius:3,background:"#fff" }}/>}
              </div>
            </div>
          ))}
          <div style={{ background:"#F59E0B10",borderRadius:9,padding:"8px 11px",margin:"8px 0 12px",
            border:"1px solid #F59E0B25",fontSize:10,color:"#92400E" }}>
            ⚠️ {isUz?"Pul guruh to'liq bo'lganda hisobdan chiqariladi":"Средства списываются когда группа заполнена"}
          </div>
          <PBtn onClick={()=>{setLoading(true);setTimeout(()=>{setLoading(false);setDone(true);},2000);}} color={gs.color}>
            💳 {formatPrice(gs.groupPrice)} {tx.sum} {isUz?"to'lash":"оплатить"}
          </PBtn>
        </div>
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════════════
// MAIN PAGE — GroupSell Home
// ════════════════════════════════════════════════════════
export default function GroupSellPage({ lang, dark, onBack, currentUser, myListings }) {
  const th = theme(dark);
  const isUz = lang === "uz";
  const [groups, setGroups] = useState(DEMO_GSELLS);
  const [view, setView] = useState("home");   // home | create | chat
  const [activeGs, setActiveGs] = useState(null);
  const [joinedIds, setJoinedIds] = useState([]);
  const [mainTab, setMainTab] = useState("active"); // active | mine | history

  const me = {
    id:"me", name:currentUser?.name||(isUz?"Men":"Я"),
    avatar:currentUser?.name?.[0]||"M", color:ACCENT, role:"member", payStatus:"pending",
  };

  if (view==="create") return (
    <CreateWizard lang={lang} dark={dark} currentUser={currentUser}
      myListings={myListings||[]}
      onBack={()=>setView("home")}
      onDone={gs=>{ setGroups(p=>[gs,...p]); setJoinedIds(p=>[...p,gs.id]); setActiveGs(gs); setView("chat"); }}/>
  );

  if (view==="chat" && activeGs) return (
    <GSChatRoom gs={activeGs} lang={lang} dark={dark} currentMember={me}
      onBack={()=>setView("home")}
      onPayDone={()=>{}}/>
  );

  return (
    <div style={{ background:th.bg, minHeight:"100vh", paddingBottom:80 }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${ACCENT},#4F46E5)`, padding:"50px 16px 20px" }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,0.2)", border:"none",
          borderRadius:10, width:36, height:36, color:"#fff", fontSize:18, cursor:"pointer",
          marginBottom:14, display:"flex", alignItems:"center", justifyContent:"center" }}>←</button>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
          <div style={{ fontSize:28 }}>🤝</div>
          <div>
            <div style={{ color:"#fff", fontWeight:900, fontSize:22 }}>GroupSell</div>
            <div style={{ color:"rgba(255,255,255,0.75)", fontSize:12 }}>
              {isUz?"Birga olamiz. Birga tejaymiz.":"Покупаем вместе. Экономим вместе."}
            </div>
          </div>
          <div style={{ marginLeft:"auto", background:"#EF4444", borderRadius:16,
            padding:"4px 10px", fontSize:11, fontWeight:900, color:"#fff" }}>NEW 🔥</div>
        </div>
        {/* Stats strip */}
        <div style={{ display:"flex", gap:12, marginBottom:14 }}>
          {[
            { emoji:"💰", label:isUz?"Arzon narx":"Дёшево"   },
            { emoji:"🤝", label:isUz?"Birga":"Вместе"        },
            { emoji:"🛡️", label:isUz?"Xavfsiz":"Безопасно"   },
            { emoji:"🪙", label:isUz?"Coin reward":"Коины"   },
          ].map((f,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:4 }}>
              <span style={{ fontSize:14 }}>{f.emoji}</span>
              <span style={{ color:"rgba(255,255,255,0.85)", fontSize:10, fontWeight:600 }}>{f.label}</span>
            </div>
          ))}
        </div>
        {/* CTA buttons */}
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={()=>setView("create")} style={{
            flex:1, padding:"13px", borderRadius:14, border:"none", cursor:"pointer",
            background:"#fff", color:ACCENT, fontWeight:800, fontSize:14,
            boxShadow:"0 4px 14px rgba(0,0,0,0.2)" }}>
            ✨ {isUz?"Group yaratish":"Создать Group"}
          </button>
          <button onClick={()=>{}} style={{
            flex:1, padding:"13px", borderRadius:14, cursor:"pointer",
            background:"rgba(255,255,255,0.18)", border:"1.5px solid rgba(255,255,255,0.3)",
            color:"#fff", fontWeight:700, fontSize:13 }}>
            🔍 {isUz?"Qo'shilish":"Присоединиться"}
          </button>
        </div>
      </div>

      {/* Qanday ishlaydi */}
      <div style={{ margin:"14px 16px 0", background:th.card, borderRadius:16, padding:"14px 16px", border:`1px solid ${th.border}` }}>
        <div style={{ fontSize:12, fontWeight:700, color:th.text, marginBottom:10 }}>
          {isUz?"Qanday ishlaydi?":"Как это работает?"}
        </div>
        <div style={{ display:"flex", alignItems:"center" }}>
          {[
            { icon:"✨", label:isUz?"Yarat":"Создай"     },
            { icon:"👥", label:isUz?"To'pla":"Набери"    },
            { icon:"💬", label:isUz?"Muloqot":"Общайся"  },
            { icon:"💳", label:isUz?"To'la":"Оплати"     },
            { icon:"📦", label:isUz?"Ol":"Получи"        },
          ].map((step,i)=>(
            <div key={i} style={{ flex:1, display:"flex", alignItems:"center" }}>
              <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <div style={{ width:30, height:30, borderRadius:15,
                  background:ACCENT+"15", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>
                  {step.icon}
                </div>
                <div style={{ fontSize:8, color:th.sub, fontWeight:600, textAlign:"center" }}>{step.label}</div>
              </div>
              {i<4 && <div style={{ width:12, height:1.5, background:th.border, flexShrink:0 }}/>}
            </div>
          ))}
        </div>
      </div>

      {/* Reward info */}
      <div style={{ margin:"10px 16px 0", background:`${ACCENT}12`, borderRadius:14, padding:"12px 14px", border:`1px solid ${ACCENT}25` }}>
        <div style={{ fontSize:12, fontWeight:800, color:ACCENT, marginBottom:6 }}>
          🪙 {isUz?"Lider uchun Coin mukofot":"Монеты для лидера"}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {[{n:10,c:100},{n:20,c:250},{n:50,c:1000}].map(r=>(
            <div key={r.n} style={{ flex:1, background:th.card, borderRadius:10, padding:"8px", textAlign:"center", border:`1px solid ${th.border}` }}>
              <div style={{ fontSize:11, fontWeight:900, color:ACCENT }}>{r.n}{isUz?" kishi":" чел."}</div>
              <div style={{ fontSize:13, fontWeight:900, color:"#F59E0B" }}>🪙 {r.c}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Guruhlar Tabs — Faol / Mening / Tarix */}
      <div style={{ display:"flex", borderBottom:`1px solid ${th.border}`, margin:"10px 16px 0", background:th.card, borderRadius:"12px 12px 0 0", overflow:"hidden" }}>
        {[
          { id:"active", label:isUz?"Faol group'lar":"Активные",  icon:"🔥" },
          { id:"mine",   label:isUz?"Mening group'larim":"Мои",   icon:"👤" },
          { id:"history",label:isUz?"Tarix":"История",             icon:"📋" },
        ].map(t=>(
          <button key={t.id} onClick={()=>setMainTab(t.id)} style={{
            flex:1, padding:"11px 4px", border:"none", cursor:"pointer",
            background: mainTab===t.id ? ACCENT+"12" : "transparent",
            borderBottom: mainTab===t.id ? `2px solid ${ACCENT}` : "2px solid transparent",
            color: mainTab===t.id ? ACCENT : th.sub,
            fontSize:11, fontWeight: mainTab===t.id ? 700 : 500,
            display:"flex", flexDirection:"column", alignItems:"center", gap:2,
            transition:"all 0.15s",
          }}>
            <span style={{ fontSize:16 }}>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Guruhlar ro'yxati */}
      <div style={{ padding:"14px 16px" }}>
        {mainTab === "active" && (
          <>
            <div style={{ fontSize:15, fontWeight:800, color:th.text, marginBottom:12 }}>
              🔥 {isUz?"Faol GroupSell'lar":"Активные GroupSell"}
            </div>
            {groups.map(gs=>(
              <GSCard key={gs.id} gs={gs} lang={lang} dark={dark}
                isJoined={joinedIds.includes(gs.id)}
                onOpen={g=>{ setActiveGs(g); if(!joinedIds.includes(g.id)) setJoinedIds(p=>[...p,g.id]); setView("chat"); }}/>
            ))}
          </>
        )}

        {mainTab === "mine" && (
          <>
            <div style={{ fontSize:15, fontWeight:800, color:th.text, marginBottom:12 }}>
              👤 {isUz?"Mening group'larim":"Мои группы"}
            </div>
            {joinedIds.length > 0 ? groups.filter(g=>joinedIds.includes(g.id)).map(gs=>(
              <GSCard key={gs.id} gs={gs} lang={lang} dark={dark}
                isJoined={true}
                onOpen={g=>{ setActiveGs(g); setView("chat"); }}/>
            )) : (
              <div style={{ textAlign:"center", padding:"50px 20px", color:th.sub }}>
                <div style={{ fontSize:44, marginBottom:10 }}>👥</div>
                <div style={{ fontSize:14, color:th.text, fontWeight:600, marginBottom:6 }}>
                  {isUz?"Hali hech bir group'ga qo'shilmadingiz":"Вы ещё не вступили ни в одну группу"}
                </div>
                <div style={{ fontSize:12, color:th.sub }}>
                  {isUz?"Faol group'lar bo'limiga o'ting":"Перейдите во вкладку активных групп"}
                </div>
              </div>
            )}
          </>
        )}

        {mainTab === "history" && (
          <>
            <div style={{ fontSize:15, fontWeight:800, color:th.text, marginBottom:12 }}>
              📋 {isUz?"Tarix":"История"}
            </div>
            {/* Demo tarix */}
            {[
              { id:"h1", emoji:"📱", title:{ uz:"Samsung Galaxy S24", ru:"Samsung Galaxy S24" },
                groupPrice:8500000, normalPrice:10200000, requiredMembers:8, finalMembers:8,
                completedAt:"2026-06-15", savings:1700000, status:"completed" },
              { id:"h2", emoji:"💻", title:{ uz:"MacBook Air M2", ru:"MacBook Air M2" },
                groupPrice:22000000, normalPrice:26000000, requiredMembers:5, finalMembers:3,
                completedAt:"2026-05-28", savings:0, status:"cancelled" },
            ].map((h,i)=>(
              <div key={h.id} style={{ background:th.card, borderRadius:14, padding:"14px",
                marginBottom:10, border:`1px solid ${th.border}`,
                display:"flex", alignItems:"center", gap:12, opacity:h.status==="cancelled"?0.6:1 }}>
                <div style={{ width:46, height:46, borderRadius:12, background:h.status==="completed"?G+"15":"#EF444415",
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>
                  {h.emoji}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:th.text,
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {h.title[lang]}
                  </div>
                  <div style={{ fontSize:12, fontWeight:700,
                    color:h.status==="completed"?G:"#EF4444", marginTop:2 }}>
                    {h.status==="completed"
                      ? `✅ ${isUz?"Muvaffaqiyatli":"Успешно"} · ${isUz?"Tejash":"Экономия"}: ${formatPrice(h.savings)} ${T[lang].sum}`
                      : `❌ ${isUz?"Bekor qilindi":"Отменена"}`}
                  </div>
                  <div style={{ fontSize:10, color:th.sub, marginTop:1 }}>
                    {h.finalMembers}/{h.requiredMembers} {isUz?"a'zo":"участника"} · {h.completedAt}
                  </div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:th.text }}>
                    {formatPrice(h.groupPrice)} {T[lang].sum}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ── Profile uchun mini-widget ──────────────────────────
export function GroupSellMiniWidget({ lang, dark, myGroups, onOpen }) {
  const th = theme(dark);
  const isUz = lang === "uz";
  const groups = myGroups || DEMO_GSELLS.slice(0,2);

  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:32, height:32, borderRadius:10, background:ACCENT+"18",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🤝</div>
          <div>
            <div style={{ fontSize:14, fontWeight:800, color:th.text }}>GroupSell</div>
            <div style={{ fontSize:10, color:th.sub }}>{isUz?"Mening guruhlarim":"Мои группы"}</div>
          </div>
        </div>
        <button onClick={onOpen} style={{ background:ACCENT+"15", border:"none",
          borderRadius:20, padding:"5px 12px", color:ACCENT, fontSize:11, fontWeight:700, cursor:"pointer" }}>
          {isUz?"Barchasi →":"Все →"}
        </button>
      </div>

      {groups.length === 0 ? (
        <div style={{ background:th.card2, borderRadius:14, padding:"20px", textAlign:"center",
          border:`1px dashed ${ACCENT}40` }}>
          <div style={{ fontSize:32, marginBottom:6 }}>🤝</div>
          <div style={{ fontSize:13, color:th.text, fontWeight:600, marginBottom:4 }}>
            {isUz?"Hali GroupSell yo'q":"GroupSell пока нет"}
          </div>
          <div style={{ fontSize:11, color:th.sub, marginBottom:12 }}>
            {isUz?"Yarating va tejang!":"Создайте и экономьте!"}
          </div>
          <button onClick={onOpen} style={{ background:ACCENT, border:"none",
            borderRadius:10, padding:"9px 20px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>
            ✨ {isUz?"GroupSell yaratish":"Создать GroupSell"}
          </button>
        </div>
      ) : (
        groups.map(gs=>(
          <div key={gs.id} onClick={()=>onOpen(gs)} style={{
            background:th.card, borderRadius:14, marginBottom:8, border:`1px solid ${th.border}`,
            display:"flex", gap:12, padding:"12px", cursor:"pointer",
            boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ width:52, height:52, borderRadius:12, background:gs.color+"18",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>
              {gs.emoji}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:700, color:th.text, overflow:"hidden",
                textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{gs.title[lang]}</div>
              <div style={{ fontSize:12, fontWeight:800, color:ACCENT }}>
                {formatPrice(gs.groupPrice)} {T[lang].sum}
              </div>
              <div style={{ display:"flex", gap:8, marginTop:3 }}>
                <span style={{ fontSize:10, color:th.sub }}>
                  👥 {gs.currentMembers}/{gs.requiredMembers}
                </span>
                <span style={{ fontSize:10, color:gs.currentMembers>=gs.requiredMembers?"#EF4444":G, fontWeight:600 }}>
                  {gs.currentMembers>=gs.requiredMembers
                    ? (isUz?"To'ldi":"Заполнено")
                    : `${isUz?"Yana":"Ещё"} ${gs.requiredMembers-gs.currentMembers}`}
                </span>
              </div>
            </div>
            {/* Progress mini */}
            <div style={{ width:36, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4 }}>
              <div style={{ fontSize:10, fontWeight:900, color:ACCENT }}>
                {Math.round(gs.currentMembers/gs.requiredMembers*100)}%
              </div>
              <div style={{ width:36, height:4, background:th.card2, borderRadius:2, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${gs.currentMembers/gs.requiredMembers*100}%`,
                  background:gs.color, borderRadius:2 }}/>
              </div>
              {gs.coins && <div style={{ fontSize:9, color:"#F59E0B" }}>🪙{gs.coins}</div>}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
