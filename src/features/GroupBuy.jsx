import { useState, useEffect, useRef, useCallback } from "react";
import { theme } from "../theme.js";
import { T } from "../translations.js";
import { formatPrice, genId } from "../utils.js";

const G = "#16A34A";
const GD = "#15803D";

// ═══════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════

function useCountdown(endTime) {
  const [left, setLeft] = useState(Math.max(0, new Date(endTime) - Date.now()));
  useEffect(() => {
    const t = setInterval(() => setLeft(Math.max(0, new Date(endTime) - Date.now())), 1000);
    return () => clearInterval(t);
  }, [endTime]);
  const h = Math.floor(left / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  return { h, m, s, expired: left === 0 };
}

// ═══════════════════════════════════════════════════════
// DEMO DATA
// ═══════════════════════════════════════════════════════

const DEMO_GROUPS = [
  {
    id: "gb1",
    title: { uz: "iPhone 15 Pro ulgurji", ru: "iPhone 15 Pro оптом" },
    originalPrice: 14500000, groupPrice: 11500000,
    maxMembers: 10, currentMembers: 7,
    endsAt: new Date(Date.now() + 3600000 * 17 + 60000 * 49 + 1000 * 52).toISOString(),
    emoji: "📱", color: "#3B82F6",
    image: null, badge: "🔥 HOT", badgeColor: "#EF4444",
    urgency: { uz: "Oxirgi 1 soatda 12 kishi qo'shildi", ru: "12 человек за последний час" },
    viewers: 18, rating: 4.9, reviewCount: 120,
    description: {
      uz: "iPhone 15 Pro Max 256GB, Natural Titanium. Original. 1 yil kafolat. To'liq jihozlangan.",
      ru: "iPhone 15 Pro Max 256GB, Natural Titanium. Оригинал. Гарантия 1 год. Полная комплектация.",
    },
    members: [
      { id:"m1", name:"Jasur",   avatar:"J", color:"#3B82F6", paid:true  },
      { id:"m2", name:"Sardor",  avatar:"S", color:"#8B5CF6", paid:true  },
      { id:"m3", name:"Malika",  avatar:"M", color:"#EC4899", paid:false },
      { id:"m4", name:"Bobur",   avatar:"B", color:"#F59E0B", paid:true  },
      { id:"m5", name:"Nodira",  avatar:"N", color:"#10B981", paid:false },
      { id:"m6", name:"Kamol",   avatar:"K", color:"#EF4444", paid:true  },
      { id:"m7", name:"Zulfiya", avatar:"Z", color:"#6366F1", paid:false },
    ],
    initialMessages: [
      { id:"c1", sender:"seller", name:"Sotuvchi", avatar:"🏪", color:"#16A34A",
        text:{ uz:"Assalomu alaykum! Mahsulot 100% original, 1 yil kafolat bilan.", ru:"Ассаламу алайкум! Товар 100% оригинал, гарантия 1 год." }, time:"09:14", isSystem:false },
      { id:"c2", sender:"m1", name:"Jasur", avatar:"J", color:"#3B82F6",
        text:{ uz:"Salom hammaga! Tez yig'ilib ketsak yaxshi bo'lardi.", ru:"Привет всем! Хорошо бы быстрее собраться." }, time:"09:18", isSystem:false },
      { id:"c3", sender:"m3", name:"Malika", avatar:"M", color:"#EC4899",
        text:{ uz:"Qora rangi bormi?", ru:"Есть ли чёрный цвет?" }, time:"09:22", isSystem:false },
      { id:"c4", sender:"seller", name:"Sotuvchi", avatar:"🏪", color:"#16A34A",
        text:{ uz:"Ha, qora va natural titanium bor. Ikkisi ham mavjud.", ru:"Да, есть чёрный и natural titanium. Оба в наличии." }, time:"09:23", isSystem:false },
      { id:"c5", sender:"m5", name:"Nodira", avatar:"N", color:"#10B981",
        text:{ uz:"Namangangacha yetkazib berasizmi?", ru:"Доставляете до Намангана?" }, time:"09:31", isSystem:false },
      { id:"c6", sender:"seller", name:"Sotuvchi", avatar:"🏪", color:"#16A34A",
        text:{ uz:"Ha, butun O'zbekiston bo'ylab 1-3 kun ichida yetkazib beramiz.", ru:"Да, по всему Узбекистану 1-3 дня." }, time:"09:32", isSystem:false },
      { id:"c7", sender:"system", name:"", avatar:"", color:"",
        text:{ uz:"🎉 Aziz guruhga qo'shildi", ru:"🎉 Азиз присоединился к группе" }, time:"09:35", isSystem:true },
    ],
  },
  {
    id: "gb2",
    title: { uz: "Samsung TV 55\" ulgurji", ru: "Samsung TV 55\" оптом" },
    originalPrice: 4200000, groupPrice: 3200000,
    maxMembers: 5, currentMembers: 3,
    endsAt: new Date(Date.now() + 3600000 * 35 + 60000 * 54 + 1000 * 37).toISOString(),
    emoji: "📺", color: "#8B5CF6",
    image: null, badge: "⚡ Trend", badgeColor: "#F59E0B",
    urgency: { uz: "Faqat 2 ta joy qoldi!", ru: "Осталось только 2 места!" },
    viewers: 9, rating: 4.7, reviewCount: 85,
    description: {
      uz: "Samsung 55\" 4K Smart TV. 2023 yil modeli. Wi-Fi, Bluetooth. Kafolat 2 yil.",
      ru: "Samsung 55\" 4K Smart TV. Модель 2023 года. Wi-Fi, Bluetooth. Гарантия 2 года.",
    },
    members: [
      { id:"m1", name:"Alisher", avatar:"A", color:"#8B5CF6", paid:true  },
      { id:"m2", name:"Dilnoza", avatar:"D", color:"#EC4899", paid:false },
      { id:"m3", name:"Firdavs", avatar:"F", color:"#3B82F6", paid:true  },
    ],
    initialMessages: [
      { id:"c1", sender:"seller", name:"Sotuvchi", avatar:"🏪", color:"#16A34A",
        text:{ uz:"Salom! Samsung TV original, 2 yil kafolat.", ru:"Привет! Samsung TV оригинал, гарантия 2 года." }, time:"10:05", isSystem:false },
      { id:"c2", sender:"m1", name:"Alisher", avatar:"A", color:"#8B5CF6",
        text:{ uz:"Tez yig'ilamiz, juda yaxshi narx!", ru:"Быстро соберёмся, очень хорошая цена!" }, time:"10:12", isSystem:false },
    ],
  },
];

// AI javoblar (mock)
const AI_ANSWERS = {
  uz: [
    { q: ["batareyasi","battery","quvvat"], a: "📱 Batareyasi 5000 mAh, 67W Fast Charge. 0 dan 100% ga 40 daqiqada to'ladi." },
    { q: ["kafolat","warranty","garant"], a: "✅ 1 yil rasmiy kafolat beriladi. Har qanday nosozlikda almashtiriladi." },
    { q: ["rang","color","qora","oq"], a: "🎨 Natural Titanium, Black Titanium va White Titanium ranglarida mavjud." },
    { q: ["yetkazish","dostavka","delivery"], a: "🚚 Butun O'zbekiston bo'ylab 1-3 ish kunida yetkazib beramiz. Toshkent: 1 kun." },
    { q: ["original","asl","fake"], a: "✅ 100% original mahsulot. Serial raqami orqali tekshirish mumkin." },
    { q: ["xotira","memory","storage","gb"], a: "💾 128GB, 256GB va 512GB versiyalari mavjud." },
    { q: ["narx","price","qancha"], a: "💰 Guruh narxi: 11 500 000 so'm. Oddiy narxdan 3 000 000 so'm arzon!" },
  ],
  ru: [
    { q: ["батарея","battery","заряд"], a: "📱 Аккумулятор 5000 мАч, быстрая зарядка 67W. От 0 до 100% за 40 минут." },
    { q: ["гарантия","warranty","kafolat"], a: "✅ Официальная гарантия 1 год. При любой неисправности — замена." },
    { q: ["цвет","color","чёрный","белый"], a: "🎨 Доступны: Natural Titanium, Black Titanium и White Titanium." },
    { q: ["доставка","delivery","привезёте"], a: "🚚 По всему Узбекистану 1-3 рабочих дня. Ташкент: 1 день." },
    { q: ["оригинал","original","подделка"], a: "✅ 100% оригинальный товар. Проверка по серийному номеру." },
    { q: ["память","memory","storage","гб"], a: "💾 Есть версии на 128GB, 256GB и 512GB." },
    { q: ["цена","price","стоит"], a: "💰 Групповая цена: 11 500 000 сум. Дешевле обычной на 3 000 000 сум!" },
  ],
};


// ═══════════════════════════════════════════════════════
// UI HELPERS
// ═══════════════════════════════════════════════════════

function TimeUnit({ value, label }) {
  const prev = useRef(value);
  const [flip, setFlip] = useState(false);
  useEffect(() => {
    if (prev.current !== value) {
      setFlip(true); prev.current = value;
      const t = setTimeout(() => setFlip(false), 250);
      return () => clearTimeout(t);
    }
  }, [value]);
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", minWidth:46 }}>
      <div style={{
        background:"rgba(255,255,255,0.15)", borderRadius:10,
        padding:"6px 8px", minWidth:46, textAlign:"center",
        transform: flip ? "scaleY(0.8)" : "scaleY(1)",
        transition:"transform 0.12s ease",
        border:"1px solid rgba(255,255,255,0.2)",
        boxShadow:"0 3px 10px rgba(0,0,0,0.12)",
      }}>
        <div style={{ fontSize:22, fontWeight:900, color:"#fff", fontFamily:"monospace", lineHeight:1 }}>
          {String(value).padStart(2,"0")}
        </div>
      </div>
      <div style={{ fontSize:8, color:"rgba(255,255,255,0.6)", marginTop:3, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5 }}>
        {label}
      </div>
    </div>
  );
}

function TimeSep() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:14, paddingTop:2 }}>
      <div style={{ width:3, height:3, borderRadius:2, background:"rgba(255,255,255,0.5)" }} />
      <div style={{ width:3, height:3, borderRadius:2, background:"rgba(255,255,255,0.5)" }} />
    </div>
  );
}

function Stars({ value, count }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:4 }}>
      <div style={{ display:"flex", gap:1 }}>
        {[1,2,3,4,5].map(n => (
          <span key={n} style={{ fontSize:11, color: n<=Math.round(value) ? "#F59E0B" : "rgba(255,255,255,0.3)" }}>★</span>
        ))}
      </div>
      <span style={{ fontSize:11, fontWeight:700, color:"#F59E0B" }}>{value}</span>
      <span style={{ fontSize:11, color:"rgba(255,255,255,0.6)" }}>({count})</span>
    </div>
  );
}

function Avatar({ member, size=32, showBadge=false }) {
  return (
    <div style={{ position:"relative", flexShrink:0 }}>
      <div style={{
        width:size, height:size, borderRadius:size/2,
        background:`linear-gradient(135deg,${member.color},${member.color}AA)`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:size*0.38, fontWeight:900, color:"#fff",
        border:"2px solid #fff", boxShadow:"0 2px 6px rgba(0,0,0,0.15)",
      }}>
        {member.avatar}
      </div>
      {showBadge && (
        <div style={{
          position:"absolute", bottom:-2, right:-2,
          width:14, height:14, borderRadius:7,
          background: member.paid ? G : "#F59E0B",
          border:"2px solid #fff",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:7, color:"#fff",
        }}>
          {member.paid ? "✓" : "⏳"}
        </div>
      )}
    </div>
  );
}

function PulseBtn({ children, onClick, disabled, color, small }) {
  const [pulse, setPulse] = useState(false);
  const handle = () => {
    if (disabled) return;
    setPulse(true); setTimeout(()=>setPulse(false),350);
    onClick?.();
  };
  return (
    <button onClick={handle} disabled={disabled} style={{
      width:"100%", padding: small ? "12px 16px" : "15px 16px",
      borderRadius:14, border:"none",
      background: disabled ? "#E5E7EB" : color || G,
      color: disabled ? "#9CA3AF" : "#fff",
      fontSize: small ? 13 : 15, fontWeight:800,
      cursor: disabled ? "not-allowed" : "pointer",
      transform: pulse ? "scale(0.96)" : "scale(1)",
      boxShadow: disabled ? "none" : `0 5px 18px ${color||G}50`,
      transition:"all 0.12s ease",
      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
    }}>
      {children}
    </button>
  );
}


// ═══════════════════════════════════════════════════════
// GROUP CARD
// ═══════════════════════════════════════════════════════

function GroupCard({ group, lang, dark, onJoin, isJoined }) {
  const th = theme(dark);
  const tx = T[lang];
  const { h, m, s, expired } = useCountdown(group.endsAt);
  const progress = group.currentMembers / group.maxMembers;
  const remaining = group.maxMembers - group.currentMembers;
  const discount = Math.round((1 - group.groupPrice / group.originalPrice) * 100);
  const isUz = lang === "uz";

  return (
    <div style={{ background:th.card, borderRadius:20, overflow:"hidden", marginBottom:16,
      border:`1px solid ${th.border}`, boxShadow:"0 4px 24px rgba(0,0,0,0.09)" }}>

      {/* Banner */}
      <div style={{ background:`linear-gradient(135deg,${group.color},${group.color}CC)`, position:"relative" }}>
        <div style={{ position:"absolute", top:12, left:12, zIndex:10,
          background:group.badgeColor, color:"#fff", fontSize:11, fontWeight:800,
          padding:"4px 10px", borderRadius:20, boxShadow:`0 2px 8px ${group.badgeColor}55` }}>
          {group.badge}
        </div>
        <div style={{ position:"absolute", top:12, right:12, zIndex:10,
          background:"rgba(0,0,0,0.4)", backdropFilter:"blur(8px)",
          color:"#fff", fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:20 }}>
          👁 {group.viewers} {isUz?"ko'rmoqda":"смотрят"}
        </div>

        {/* Katta rasm / emoji */}
        <div style={{ width:"100%", height:160, display:"flex", alignItems:"center",
          justifyContent:"center", flexDirection:"column", gap:8 }}>
          {group.image
            ? <img src={group.image} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            : <>
                <div style={{ fontSize:72, filter:"drop-shadow(0 4px 14px rgba(0,0,0,0.25))" }}>{group.emoji}</div>
                <div style={{ background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)", borderRadius:20, padding:"4px 12px" }}>
                  <Stars value={group.rating} count={group.reviewCount} />
                </div>
              </>
          }
        </div>

        {/* Nom + countdown */}
        <div style={{ padding:"10px 16px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ color:"#fff", fontWeight:800, fontSize:15 }}>{group.title[lang]}</div>
            <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:6, padding:"2px 8px",
              fontSize:11, fontWeight:800, color:"#fff", display:"inline-block", marginTop:4 }}>
              -{discount}% {isUz?"chegirma":"скидка"}
            </div>
          </div>
          {!expired ? (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:3 }}>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.65)", fontWeight:700, letterSpacing:0.5 }}>
                ⏰ {isUz?"TUGASHIGA:":"ДО КОНЦА:"}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                <TimeUnit value={h} label={isUz?"SOAT":"ЧАС"} />
                <TimeSep /><TimeUnit value={m} label={isUz?"DAQ":"МИН"} />
                <TimeSep /><TimeUnit value={s} label={isUz?"SON":"СЕК"} />
              </div>
            </div>
          ) : (
            <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:10, padding:"8px 12px",
              color:"#fff", fontSize:12, fontWeight:700 }}>⏰ {isUz?"Tugadi":"Завершено"}</div>
          )}
        </div>
      </div>

      {/* Kontent */}
      <div style={{ padding:"14px 16px" }}>
        {/* Narxlar */}
        <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:14,
          background:th.card2, borderRadius:14, padding:"12px 14px" }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, color:th.sub, marginBottom:2 }}>{isUz?"Asl narx":"Цена"}</div>
            <div style={{ fontWeight:700, color:th.sub, textDecoration:"line-through", fontSize:14 }}>
              {formatPrice(group.originalPrice)} {tx.sum}
            </div>
          </div>
          <div style={{ fontSize:16, color:th.sub }}>→</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, color:G, marginBottom:2 }}>🔥 {isUz?"Guruh narxi":"Цена группы"}</div>
            <div style={{ fontWeight:900, color:G, fontSize:18 }}>
              {formatPrice(group.groupPrice)} <span style={{ fontSize:12 }}>{tx.sum}</span>
            </div>
          </div>
          <div style={{ background:G+"18", borderRadius:12, padding:"8px 10px", border:`1px solid ${G}30`, textAlign:"center" }}>
            <div style={{ fontSize:9, color:G, fontWeight:700 }}>{isUz?"Tejash":"Экономия"}</div>
            <div style={{ fontWeight:900, color:G, fontSize:13 }}>
              {formatPrice(group.originalPrice - group.groupPrice)}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6, alignItems:"center" }}>
            <span style={{ fontSize:12, fontWeight:600, color:th.text }}>
              {group.currentMembers} / {group.maxMembers} {isUz?"a'zo":"участников"}
            </span>
            <span style={{ fontSize:12, fontWeight:800, color:remaining<=2?"#EF4444":G }}>
              {isUz?`Yana ${remaining} kishi kerak`:`Нужно ещё ${remaining}`}
            </span>
          </div>
          <div style={{ height:10, background:th.card2, borderRadius:5, overflow:"hidden", border:`1px solid ${th.border}` }}>
            <div style={{ height:"100%", width:`${progress*100}%`,
              background:`linear-gradient(to right,${group.color},${G})`,
              borderRadius:5, transition:"width 0.8s ease", position:"relative" }}>
              <div style={{ position:"absolute", right:0, top:"50%", transform:"translate(50%,-50%)",
                width:16, height:16, borderRadius:8, background:"#fff",
                border:`3px solid ${G}`, boxShadow:"0 2px 6px rgba(0,0,0,0.2)" }} />
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
            {Array.from({length:group.maxMembers}).map((_,i)=>(
              <div key={i} style={{ width:6, height:6, borderRadius:3,
                background:i<group.currentMembers?G:th.card2 }} />
            ))}
          </div>
        </div>

        {/* A'zolar */}
        <div style={{ display:"flex", alignItems:"center", marginBottom:14 }}>
          {group.members.slice(0,5).map((mem,i)=>(
            <div key={i} style={{ marginLeft:i>0?-10:0, zIndex:group.members.length-i }}>
              <Avatar member={mem} size={32} showBadge />
            </div>
          ))}
          {group.members.length>5 && (
            <div style={{ width:32, height:32, borderRadius:16, background:th.card2,
              border:"2px solid #fff", display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:10, fontWeight:800, color:th.sub, marginLeft:-10 }}>
              +{group.members.length-5}
            </div>
          )}
          <div style={{ marginLeft:12, flex:1 }}>
            <div style={{ fontSize:11, color:th.sub }}>{isUz?"qo'shilgan":"присоединились"}</div>
            <div style={{ fontSize:10, color:group.badgeColor, fontWeight:700, marginTop:1 }}>
              🔥 {group.urgency[lang]}
            </div>
          </div>
        </div>

        {/* Yetkazish blok */}
        <div style={{ background:th.card2, borderRadius:14, padding:"12px 14px", marginBottom:14,
          border:`1px solid ${th.border}`, display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {[
            { icon:"🚚", label:isUz?"Yetkazish":"Доставка",   val:isUz?"1-3 kun":"1-3 дня" },
            { icon:"🛡️", label:isUz?"Himoya":"Защита",        val:isUz?"Kafolat":"Гарантия" },
            { icon:"↩️", label:isUz?"Qaytarish":"Возврат",    val:isUz?"7 kun":"7 дней" },
            { icon:"💳", label:isUz?"Muddatli":"Рассрочка",   val:isUz?"0% foiz":"0% ставка" },
          ].map((item,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:16 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize:9, color:th.sub, fontWeight:600 }}>{item.label}</div>
                <div style={{ fontSize:11, color:th.text, fontWeight:700 }}>{item.val}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA tugma */}
        <PulseBtn onClick={()=>onJoin(group)} disabled={expired||remaining===0||isJoined} color={group.color}>
          {isJoined ? `✅ ${isUz?"Guruhga qo'shildingiz":"Вы в группе — открыть чат"}`
            : expired ? `⏰ ${isUz?"Muddat tugadi":"Время истекло"}`
            : remaining===0 ? `🔒 ${isUz?"To'ldi":"Мест нет"}`
            : `🤝 ${isUz?"Guruhga qo'shilish":"Вступить в группу"}`}
        </PulseBtn>
      </div>
    </div>
  );
}


function PaymentModal({ group, lang, dark, onClose, onSuccess }) {
  const th = theme(dark);
  const tx = T[lang];
  const isUz = lang === "uz";
  const [method, setMethod] = useState("payme");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 2000);
  };

  if (loading) return (
    <div style={{ position:"fixed", inset:0, zIndex:700, background:"rgba(0,0,0,0.6)",
      display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:th.card, borderRadius:20, padding:"32px 28px", textAlign:"center", width:280 }}>
        <div style={{ width:52, height:52, borderRadius:26, border:`4px solid ${G}`,
          borderTopColor:"transparent", animation:"spin 0.8s linear infinite", margin:"0 auto 16px" }} />
        <div style={{ fontSize:14, fontWeight:700, color:th.text }}>
          {isUz?"To'lov amalga oshirilmoqda...":"Обработка платежа..."}
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if (done) return (
    <div style={{ position:"fixed", inset:0, zIndex:700, background:"rgba(0,0,0,0.6)",
      display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:th.card, borderRadius:20, padding:"28px 24px", textAlign:"center", width:300 }}>
        <div style={{ fontSize:60, marginBottom:12 }}>🎉</div>
        <div style={{ fontSize:18, fontWeight:800, color:G, marginBottom:6 }}>
          {isUz?"To'lov qabul qilindi!":"Оплата принята!"}
        </div>
        <div style={{ fontSize:12, color:th.sub, marginBottom:20, lineHeight:1.6 }}>
          {isUz?"Buyurtmangiz rasmiylashtirildi. Yetkazib berish 1-3 kun.":"Заказ оформлен. Доставка 1-3 дня."}
        </div>
        <div style={{ background:G+"12", borderRadius:12, padding:"12px 14px", marginBottom:16, border:`1px solid ${G}25` }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ color:th.sub, fontSize:12 }}>{isUz?"To'langan":"Оплачено"}</span>
            <span style={{ fontWeight:700, color:G }}>{formatPrice(group.groupPrice)} {tx.sum}</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <span style={{ color:th.sub, fontSize:12 }}>{isUz?"Tejash":"Экономия"}</span>
            <span style={{ fontWeight:700, color:"#10B981" }}>
              -{formatPrice(group.originalPrice - group.groupPrice)} {tx.sum}
            </span>
          </div>
        </div>
        <PulseBtn onClick={()=>{ onSuccess?.(); }} color={G}>
          {isUz?"Ajoyib! Chatga qaytish":"Отлично! Вернуться в чат"}
        </PulseBtn>
      </div>
    </div>
  );

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:700,
      background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"flex-end",
      justifyContent:"center", maxWidth:430, margin:"0 auto" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:th.card,
        borderRadius:"20px 20px 0 0", width:"100%", padding:"0 0 28px" }}>
        <div style={{ width:36, height:4, background:th.border, borderRadius:2, margin:"12px auto 16px" }} />
        <div style={{ padding:"0 16px" }}>
          <div style={{ fontSize:16, fontWeight:800, color:th.text, marginBottom:4 }}>
            💳 {isUz?"To'lov qilish":"Оплата"}
          </div>
          {/* Mahsulot xulosasi */}
          <div style={{ background:`${group.color}12`, borderRadius:12, padding:"12px 14px", marginBottom:14, border:`1px solid ${group.color}25` }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <span style={{ fontSize:24 }}>{group.emoji}</span>
              <div style={{ fontWeight:700, color:th.text, fontSize:13 }}>{group.title[lang]}</div>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ color:th.sub, fontSize:12 }}>{isUz?"Guruh narxi":"Цена группы"}</span>
              <span style={{ fontWeight:900, color:G, fontSize:15 }}>{formatPrice(group.groupPrice)} {tx.sum}</span>
            </div>
          </div>
          {/* To'lov metodlari */}
          {[
            { id:"payme", label:"Payme",    icon:"💳", color:"#00AAFF" },
            { id:"click", label:"Click",    icon:"🔵", color:"#0066CC" },
            { id:"uzum",  label:"Uzum Pay", icon:"🟣", color:"#7B2FBE" },
          ].map(pm=>(
            <div key={pm.id} onClick={()=>setMethod(pm.id)} style={{
              display:"flex", alignItems:"center", gap:12, padding:"11px 14px",
              background:method===pm.id ? pm.color+"12" : th.card2,
              border:`2px solid ${method===pm.id ? pm.color : th.border}`,
              borderRadius:12, marginBottom:8, cursor:"pointer", transition:"all 0.15s",
            }}>
              <span style={{ fontSize:22 }}>{pm.icon}</span>
              <span style={{ flex:1, fontWeight:600, color:th.text }}>{pm.label}</span>
              <div style={{ width:18, height:18, borderRadius:9,
                border:`2px solid ${method===pm.id?pm.color:th.border}`,
                background:method===pm.id?pm.color:"transparent",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                {method===pm.id && <div style={{ width:7, height:7, borderRadius:4, background:"#fff" }} />}
              </div>
            </div>
          ))}
          <div style={{ background:"#F59E0B12", borderRadius:10, padding:"9px 12px",
            margin:"10px 0 14px", border:"1px solid #F59E0B30", fontSize:11, color:"#92400E" }}>
            ⚠️ {isUz?"Pul faqat guruh to'liq bo'lganda hisobdan chiqariladi":"Средства списываются только когда группа заполнена"}
          </div>
          <PulseBtn onClick={handlePay} color={group.color}>
            💳 {formatPrice(group.groupPrice)} {tx.sum} {isUz?"to'lash":"оплатить"}
          </PulseBtn>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════
// GROUP CHAT ROOM  (yangilangan — 8 yaxshilash)
// ═══════════════════════════════════════════════════════

function GroupChatRoom({ group, lang, dark, currentMember, onBack, onPay }) {
  const th = theme(dark);
  const tx = T[lang];
  const isUz = lang === "uz";
  const { h, m, s, expired } = useCountdown(group.endsAt);

  // State
  const [messages,   setMessages]   = useState([...group.initialMessages]);
  const [members,    setMembers]     = useState([...group.members, { ...currentMember, paid:false }]);
  const [inputText,  setInputText]   = useState("");
  const [typingName, setTypingName]  = useState(null);   // "Kim yozmoqda..."
  const [aiTyping,   setAiTyping]    = useState(false);
  const [showPay,    setShowPay]     = useState(false);
  const [showVideo,  setShowVideo]   = useState(false);  // video panel
  const [collapsed,  setCollapsed]   = useState(true);   // buyurtma tafsilotlari
  const [fullAnim,   setFullAnim]    = useState(false);  // guruh to'ldi animatsiya
  const listRef = useRef(null);

  const currentCount = members.length;
  const maxCount     = group.maxMembers;
  const isFull       = currentCount >= maxCount;
  const progress     = currentCount / maxCount;
  // 5 daqiqadan kam qolsa qizil
  const totalSec     = h * 3600 + m * 60 + s;
  const timerRed     = totalSec < 300;

  // Scroll to bottom
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, aiTyping, typingName]);

  // Guruh to'lganda animatsiya
  useEffect(() => {
    if (isFull && !fullAnim) {
      setFullAnim(true);
      // Chat ga avtomatik xabar
      const now = new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
      setMessages(p => [...p, {
        id: genId(), sender:"system", name:"", avatar:"", color:"",
        text:{ uz:`🎉🎉🎉 Guruh to'ldi! ${maxCount}/${maxCount} — Endi to'lovni amalga oshiring!`,
               ru:`🎉🎉🎉 Группа заполнена! ${maxCount}/${maxCount} — Теперь оплатите!` },
        time:now, isSystem:true, isFull:true,
      }]);
    }
  }, [isFull]);

  // AI javob
  const checkAI = useCallback((text) => {
    const lower = text.toLowerCase();
    const answers = AI_ANSWERS[lang] || AI_ANSWERS.uz;
    const found = answers.find(a => a.q.some(q => lower.includes(q)));
    if (!found) return;
    // AI "yozmoqda" ko'rsatish
    setTypingName(isUz ? "🤖 AI yozmoqda..." : "🤖 AI печатает...");
    setTimeout(() => {
      setTypingName(null);
      setMessages(p => [...p, {
        id:genId(), sender:"ai", name:"🤖 AI Yordamchi",
        avatar:"🤖", color:"#8B5CF6",
        text:{ uz:found.a, ru:found.a },
        time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
        isSystem:false,
      }]);
    }, 1400);
  }, [lang, isUz]);

  const addSystemMsg = (textUz, textRu) => {
    setMessages(p => [...p, {
      id:genId(), sender:"system", name:"", avatar:"", color:"",
      text:{ uz:textUz, ru:textRu },
      time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
      isSystem:true,
    }]);
  };

  const sendMessage = () => {
    const txt = inputText.trim();
    if (!txt) return;
    // "Falonchi yozmoqda..." simulyatsiya (boshqa foydalanuvchi uchun)
    const randomMember = members.filter(m=>m.id!=="me")[Math.floor(Math.random()*members.length)];
    if (randomMember && Math.random() > 0.4) {
      setTimeout(() => {
        setTypingName(`${randomMember.name} ${isUz?"yozmoqda...":"печатает..."}`);
        setTimeout(() => setTypingName(null), 2000 + Math.random()*1500);
      }, 800);
    }
    setMessages(p => [...p, {
      id:genId(), sender:"me", name:currentMember.name,
      avatar:currentMember.avatar, color:currentMember.color,
      text:{ uz:txt, ru:txt },
      time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
      isSystem:false,
    }]);
    checkAI(txt);
    setInputText("");
  };

  // To'lov qilganda chat ga xabar
  const handlePaySuccess = () => {
    setShowPay(false);
    setMembers(p => p.map(m => m.id==="me" ? {...m, paid:true} : m));
    const paidCount = members.filter(m=>m.paid).length + 1;
    addSystemMsg(
      `💰 ${currentMember.name} to'lovni amalga oshirdi. ${paidCount}/${currentCount} to'ladi ✅`,
      `💰 ${currentMember.name} оплатил. ${paidCount}/${currentCount} оплатили ✅`
    );
    onPay?.(group);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:600, background:th.bg,
      maxWidth:430, margin:"0 auto", display:"flex", flexDirection:"column" }}>

      {/* ═══ GURUH TO'LDI ANIMATSIYA OVERLAY ═══ */}
      {fullAnim && (
        <div style={{ position:"absolute", inset:0, zIndex:900, background:"rgba(0,0,0,0.75)",
          display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column",
          animation:"fadeInOut 4s ease forwards", pointerEvents:"none" }}>
          <div style={{ fontSize:64, marginBottom:12, animation:"bounce3 0.6s ease 3" }}>🎉</div>
          <div style={{ fontSize:28, fontWeight:900, color:"#fff", marginBottom:8 }}>
            {isUz?"Guruh to'ldi!":"Группа заполнена!"}
          </div>
          <div style={{ fontSize:20, color:"#F59E0B", fontWeight:800 }}>{maxCount}/{maxCount} 🔥</div>
          <div style={{ fontSize:14, color:"rgba(255,255,255,0.8)", marginTop:8 }}>
            {isUz?"Endi to'lovni amalga oshiring":"Теперь оплатите заказ"}
          </div>
        </div>
      )}

      {/* ═══ TOP PANEL ═══ */}
      <div style={{ background:`linear-gradient(135deg,${group.color},${group.color}CC)`,
        flexShrink:0 }}>

        {/* 1. Mahsulot rasmi + info band */}
        <div style={{ padding:"46px 14px 0", display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={onBack} style={{ background:"rgba(255,255,255,0.2)", border:"none",
            borderRadius:10, width:34, height:34, color:"#fff", fontSize:16, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>←</button>

          {/* Mahsulot rasmi (kichik) */}
          <div style={{ width:52, height:52, borderRadius:14, background:"rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:28,
            border:"2px solid rgba(255,255,255,0.3)", flexShrink:0, overflow:"hidden" }}>
            {group.image
              ? <img src={group.image} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              : group.emoji}
          </div>

          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ color:"#fff", fontWeight:800, fontSize:14, lineHeight:1.2 }}>
              {group.title[lang]}
            </div>
            {/* Rating + original */}
            <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:3 }}>
              <div style={{ display:"flex", gap:1 }}>
                {[1,2,3,4,5].map(n=>(
                  <span key={n} style={{ fontSize:9, color:n<=Math.round(group.rating)?"#F59E0B":"rgba(255,255,255,0.3)" }}>★</span>
                ))}
              </div>
              <span style={{ fontSize:9, color:"rgba(255,255,255,0.8)" }}>
                {group.rating} ({group.reviewCount} {isUz?"sharh":"отзывов"})
              </span>
              <span style={{ background:"rgba(255,255,255,0.2)", borderRadius:4, padding:"1px 5px",
                fontSize:9, color:"#fff", fontWeight:700 }}>✓ {isUz?"Original":"Оригинал"}</span>
            </div>
          </div>

          {/* Video tugma */}
          <button onClick={()=>setShowVideo(v=>!v)} style={{
            background: showVideo ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.2)",
            border:"none", borderRadius:10, padding:"6px 10px", color:"#fff",
            fontSize:11, fontWeight:700, cursor:"pointer", flexShrink:0,
            display:"flex", alignItems:"center", gap:4,
          }}>
            ▶ {isUz?"Video":"Видео"}
          </button>
        </div>

        {/* Video panel */}
        {showVideo && (
          <div style={{ margin:"8px 14px 0", background:"rgba(0,0,0,0.4)", borderRadius:12,
            height:140, display:"flex", alignItems:"center", justifyContent:"center",
            border:"1px solid rgba(255,255,255,0.2)", overflow:"hidden", position:"relative" }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:40, marginBottom:6 }}>▶</div>
              <div style={{ color:"rgba(255,255,255,0.8)", fontSize:12, fontWeight:600 }}>
                {isUz?"Mahsulot videosi · 45 soniya":"Видео товара · 45 секунд"}
              </div>
              <div style={{ color:"rgba(255,255,255,0.5)", fontSize:10, marginTop:3 }}>
                {isUz?"Original mahsulot taqdimoti":"Оригинальная презентация товара"}
              </div>
            </div>
            {/* Muddati badge */}
            <div style={{ position:"absolute", bottom:8, right:8, background:"rgba(0,0,0,0.6)",
              borderRadius:6, padding:"2px 8px", fontSize:10, color:"#fff" }}>45s</div>
          </div>
        )}

        {/* Stats strip */}
        <div style={{ margin:"10px 14px 0", background:"rgba(255,255,255,0.12)", borderRadius:12,
          padding:"10px 12px", display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:6 }}>
          {[
            { icon:"👥", top:`${currentCount}/${maxCount}`, bot:isUz?"A'zo":"Участники" },
            { icon:"💰", top:formatPrice(group.groupPrice).replace(/\s/g,""), bot:"so'm" },
            {
              icon: timerRed ? "🔴" : "⏰",
              top: <span style={{ color: timerRed ? "#FCA5A5" : "#fff", fontFamily:"monospace", fontSize:11, fontWeight:900 }}>
                {`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`}
              </span>,
              bot: isUz ? "Qoldi" : "Осталось",
            },
            { icon:"🔥", top:`${maxCount-currentCount}`, bot:isUz?"Kerak":"Нужно" },
          ].map((item,i)=>(
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ fontSize:14 }}>{item.icon}</div>
              <div style={{ fontSize:11, fontWeight:900, color:"#fff" }}>{item.top}</div>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.65)" }}>{item.bot}</div>
            </div>
          ))}
        </div>

        {/* Progress bar — animatsiya bilan */}
        <div style={{ margin:"8px 14px 12px" }}>
          <div style={{ height:6, background:"rgba(255,255,255,0.2)", borderRadius:3, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${progress*100}%`,
              background: isFull
                ? "linear-gradient(90deg,#F59E0B,#EF4444)"
                : "rgba(255,255,255,0.9)",
              borderRadius:3, transition:"width 1.2s cubic-bezier(0.34,1.56,0.64,1)" }} />
          </div>
          {isFull && (
            <div style={{ textAlign:"center", fontSize:11, color:"#F59E0B", fontWeight:800, marginTop:5,
              animation:"pulse 1s infinite" }}>
              🎉 {isUz?"Guruh to'ldi! To'lovni amalga oshiring.":"Группа заполнена! Оплатите заказ."}
            </div>
          )}
        </div>
      </div>

      {/* ═══ A'ZOLAR STATUSI ═══ */}
      <div style={{ background:th.card, padding:"8px 14px", flexShrink:0,
        borderBottom:`1px solid ${th.border}`, display:"flex", alignItems:"center", gap:6, overflowX:"auto" }}>
        {/* To'lgan a'zolar */}
        {members.map((mem,i)=>(
          <div key={mem.id||i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, flexShrink:0 }}>
            <Avatar member={mem} size={30} showBadge />
            <div style={{ fontSize:7, color:th.sub, maxWidth:34, overflow:"hidden",
              textOverflow:"ellipsis", whiteSpace:"nowrap", textAlign:"center" }}>{mem.name}</div>
          </div>
        ))}
        {/* Bo'sh joylar — "+" bilan */}
        {Array.from({length:Math.max(0, maxCount-members.length)}).map((_,i)=>(
          <div key={"e"+i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, flexShrink:0 }}>
            <div style={{ width:30, height:30, borderRadius:15,
              background: "transparent",
              border:`2px dashed ${th.border}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:18, color:th.sub, fontWeight:300 }}>+</div>
            <div style={{ fontSize:7, color:th.sub }}>{isUz?"Joy":"Место"}</div>
          </div>
        ))}
      </div>

      {/* ═══ MESSAGES ═══ */}
      <div ref={listRef} style={{ flex:1, overflowY:"auto", padding:"10px 14px",
        display:"flex", flexDirection:"column", gap:8 }}>
        {messages.map(msg => {
          // System xabar (qo'shildi, to'lovni amalga oshirdi, guruh to'ldi)
          if (msg.isSystem) return (
            <div key={msg.id} style={{ textAlign:"center", margin:"2px 0" }}>
              <span style={{
                background: msg.isFull ? "linear-gradient(135deg,#F59E0B,#EF4444)" : G+"18",
                color: msg.isFull ? "#fff" : G,
                fontSize: msg.isFull ? 13 : 11, fontWeight:700,
                padding: msg.isFull ? "8px 16px" : "4px 12px",
                borderRadius:20,
                border: msg.isFull ? "none" : `1px solid ${G}25`,
                display:"inline-block",
                boxShadow: msg.isFull ? "0 4px 14px rgba(245,158,11,0.4)" : "none",
                animation: msg.isFull ? "pulse 1.5s infinite" : "none",
              }}>
                {msg.text[lang]}
              </span>
            </div>
          );
          const isMe     = msg.sender === "me";
          const isSeller = msg.sender === "seller";
          const isAI     = msg.sender === "ai";
          return (
            <div key={msg.id} style={{ display:"flex",
              flexDirection:isMe?"row-reverse":"row", alignItems:"flex-end", gap:8 }}>
              {!isMe && (
                <div style={{ width:30, height:30, borderRadius:15, flexShrink:0,
                  background:isAI?"#8B5CF6":isSeller?G:msg.color,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:14, border:`2px solid ${th.card}`, boxShadow:"0 2px 6px rgba(0,0,0,0.1)" }}>
                  {msg.avatar}
                </div>
              )}
              <div style={{ maxWidth:"75%", display:"flex", flexDirection:"column",
                alignItems:isMe?"flex-end":"flex-start" }}>
                {!isMe && (
                  <div style={{ fontSize:10, fontWeight:700,
                    color:isAI?"#8B5CF6":isSeller?G:msg.color, marginBottom:3, paddingLeft:4,
                    display:"flex", alignItems:"center", gap:5 }}>
                    {msg.name}
                    {isSeller && <span style={{ background:G+"20", color:G, fontSize:9,
                      padding:"1px 5px", borderRadius:4 }}>✓ {isUz?"Sotuvchi":"Продавец"}</span>}
                    {isAI && <span style={{ background:"#8B5CF620", color:"#8B5CF6", fontSize:9,
                      padding:"1px 5px", borderRadius:4 }}>AI</span>}
                  </div>
                )}
                <div style={{
                  background:isMe?group.color:isAI?"#8B5CF615":isSeller?G+"15":th.card2,
                  color:isMe?"#fff":th.text,
                  padding:"9px 12px",
                  borderRadius:isMe?"16px 4px 16px 16px":"4px 16px 16px 16px",
                  fontSize:13, lineHeight:1.5,
                  border:isMe?"none":`1px solid ${isAI?"#8B5CF630":isSeller?G+"25":th.border}`,
                  boxShadow:"0 1px 4px rgba(0,0,0,0.06)",
                }}>
                  {msg.text[lang]}
                </div>
                <div style={{ fontSize:9, color:th.sub, marginTop:3 }}>{msg.time}</div>
              </div>
            </div>
          );
        })}

        {/* "Kim yozmoqda..." — Telegram uslubi */}
        {typingName && (
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:30, height:30, borderRadius:15, background:th.card2,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>💬</div>
            <div style={{ background:th.card2, padding:"8px 12px",
              borderRadius:"4px 16px 16px 16px", border:`1px solid ${th.border}` }}>
              <div style={{ fontSize:11, color:th.sub, fontStyle:"italic" }}>{typingName}</div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ INPUT ZONE ═══ */}
      <div style={{ background:th.card, borderTop:`1px solid ${th.border}`,
        padding:"8px 14px 22px", flexShrink:0 }}>

        {/* Guruh to'lganda banner */}
        {isFull && (
          <div style={{ background:`linear-gradient(135deg,${G},${GD})`,
            borderRadius:12, padding:"10px 14px", marginBottom:8,
            display:"flex", alignItems:"center", gap:10,
            animation:"pulse 1.5s infinite" }}>
            <span style={{ fontSize:22 }}>🎉</span>
            <div style={{ flex:1 }}>
              <div style={{ color:"#fff", fontWeight:800, fontSize:13 }}>
                {isUz?"Guruh to'ldi!":"Группа заполнена!"}
              </div>
              <div style={{ color:"rgba(255,255,255,0.8)", fontSize:11 }}>
                {isUz?"Hozir to'lov qiling":"Оплатите сейчас"}
              </div>
            </div>
          </div>
        )}

        {/* Collapse — Buyurtma tafsilotlari */}
        <div style={{ marginBottom:8 }}>
          <button onClick={()=>setCollapsed(c=>!c)} style={{
            width:"100%", background:th.card2, border:`1px solid ${th.border}`,
            borderRadius:10, padding:"9px 14px", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"space-between",
          }}>
            <span style={{ fontSize:13, fontWeight:600, color:th.text }}>
              📦 {isUz?"Buyurtma tafsilotlari":"Детали заказа"}
            </span>
            <span style={{ fontSize:14, color:th.sub, transition:"transform 0.2s",
              transform: collapsed?"rotate(0)":"rotate(180deg)" }}>▾</span>
          </button>
          {!collapsed && (
            <div style={{ background:th.card2, borderRadius:"0 0 10px 10px",
              border:`1px solid ${th.border}`, borderTop:"none",
              padding:"10px 14px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {[
                { icon:"🚚", label:isUz?"Yetkazish":"Доставка",       val:isUz?"1-3 kun":"1-3 дня" },
                { icon:"🛡️", label:isUz?"Xaridor himoyasi":"Защита",  val:isUz?"Kafolat":"Гарантия" },
                { icon:"↩️", label:isUz?"7 kun qaytarish":"Возврат",  val:isUz?"7 kun":"7 дней" },
                { icon:"💳", label:isUz?"Muddatli to'lov":"Рассрочка",val:isUz?"0% foiz":"0% ставка" },
              ].map((item,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <span style={{ fontSize:15 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize:9, color:th.sub, fontWeight:600 }}>{item.label}</div>
                    <div style={{ fontSize:11, color:th.text, fontWeight:700 }}>{item.val}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat input */}
        <div style={{ display:"flex", gap:8, alignItems:"flex-end", marginBottom:8 }}>
          <div style={{ flex:1, background:th.card2, borderRadius:22,
            border:`1.5px solid ${th.border}`, padding:"10px 14px",
            display:"flex", alignItems:"center" }}>
            <input value={inputText} onChange={e=>setInputText(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&sendMessage()}
              placeholder={isUz?"Xabar yozing...":"Написать сообщение..."}
              style={{ flex:1, border:"none", background:"transparent", outline:"none",
                fontSize:14, color:th.text, fontFamily:"inherit" }} />
            <span style={{ fontSize:16, opacity:0.5 }}>🤖</span>
          </div>
          <button onClick={sendMessage} style={{
            width:44, height:44, borderRadius:22,
            background: inputText.trim() ? group.color : th.card2,
            border:"none", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow: inputText.trim() ? `0 4px 14px ${group.color}50` : "none",
            transition:"all 0.2s",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke={inputText.trim()?"#fff":th.sub} strokeWidth="2.5" strokeLinecap="round">
              <path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>
            </svg>
          </button>
        </div>

        {/* To'lov tugmasi */}
        <PulseBtn onClick={()=>setShowPay(true)} color={group.color}>
          💳 {isUz?"To'lov qilish":"Оплатить"} — {formatPrice(group.groupPrice)} {tx.sum}
        </PulseBtn>
      </div>

      {/* To'lov modali */}
      {showPay && (
        <PaymentModal group={group} lang={lang} dark={dark}
          onClose={()=>setShowPay(false)}
          onSuccess={handlePaySuccess} />
      )}

      <style>{`
        @keyframes bounce{0%,80%,100%{transform:scale(0.8)}40%{transform:scale(1.2)}}
        @keyframes bounce3{0%,100%{transform:scale(1)}50%{transform:scale(1.3)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.7}}
        @keyframes fadeInOut{0%{opacity:0}10%{opacity:1}80%{opacity:1}100%{opacity:0}}
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════

export default function GroupBuyPage({ lang, dark, onBack, currentUser }) {
  const th = theme(dark);
  const isUz = lang === "uz";
  const [groups] = useState(DEMO_GROUPS);
  const [chatGroup, setChatGroup] = useState(null);
  const [joinedIds, setJoinedIds] = useState([]);
  const [paidIds, setPaidIds] = useState([]);

  const me = {
    id: currentUser?.uid || "me",
    name: currentUser?.name || (isUz ? "Men" : "Я"),
    avatar: (currentUser?.name?.[0] || "M"),
    color: "#16A34A",
    paid: paidIds.includes(chatGroup?.id),
  };

  // Chat ochilganda
  if (chatGroup) return (
    <GroupChatRoom
      group={chatGroup}
      lang={lang}
      dark={dark}
      currentMember={me}
      onBack={() => setChatGroup(null)}
      onPay={g => setPaidIds(p => [...p, g.id])}
    />
  );

  return (
    <div style={{ background:th.bg, minHeight:"100vh", paddingBottom:80 }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${G},${GD})`, padding:"50px 16px 20px" }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,0.2)",
          border:"none", borderRadius:10, width:36, height:36, color:"#fff",
          fontSize:18, cursor:"pointer", marginBottom:14,
          display:"flex", alignItems:"center", justifyContent:"center" }}>←</button>
        <div style={{ color:"#fff", fontWeight:800, fontSize:22 }}>
          🤝 {isUz ? "Birga olamiz" : "Купим вместе"}
        </div>
        <div style={{ color:"rgba(255,255,255,0.75)", fontSize:13, marginTop:4 }}>
          {isUz ? "Birlashib ulgurji narxda oling" : "Объединитесь и купите по оптовой цене"}
        </div>
        <div style={{ display:"flex", gap:16, marginTop:14 }}>
          {[
            { emoji:"💰", label:isUz?"Arzon narx":"Низкая цена" },
            { emoji:"🤝", label:isUz?"Birga olish":"Совместная покупка" },
            { emoji:"🔒", label:isUz?"Xavfsiz":"Безопасно" },
          ].map((f,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:16 }}>{f.emoji}</span>
              <span style={{ color:"rgba(255,255,255,0.85)", fontSize:11, fontWeight:600 }}>{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Jarayon qadamlari */}
      <div style={{ margin:"16px 16px 0", background:th.card, borderRadius:16,
        padding:"14px 16px", border:`1px solid ${th.border}` }}>
        <div style={{ fontSize:12, fontWeight:700, color:th.text, marginBottom:10 }}>
          {isUz?"Qanday ishlaydi?":"Как это работает?"}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:0 }}>
          {[
            { icon:"🤝", label:isUz?"Qo'shiling":"Вступите" },
            { icon:"💬", label:isUz?"Muloqot":"Общайтесь" },
            { icon:"💳", label:isUz?"To'lang":"Оплатите" },
            { icon:"📦", label:isUz?"Oling":"Получите" },
          ].map((step,i)=>(
            <div key={i} style={{ flex:1, display:"flex", alignItems:"center" }}>
              <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <div style={{ width:32, height:32, borderRadius:16,
                  background:G+"15", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>
                  {step.icon}
                </div>
                <div style={{ fontSize:9, color:th.sub, fontWeight:600, textAlign:"center" }}>{step.label}</div>
              </div>
              {i<3 && <div style={{ width:16, height:2, background:th.border, flexShrink:0 }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Group kartalar */}
      <div style={{ padding:"12px 16px" }}>
        {groups.map(g=>(
          <GroupCard
            key={g.id}
            group={g}
            lang={lang}
            dark={dark}
            isJoined={joinedIds.includes(g.id)}
            onJoin={grp => {
              if (!joinedIds.includes(grp.id)) setJoinedIds(p=>[...p, grp.id]);
              setChatGroup(grp);
            }}
          />
        ))}
      </div>
    </div>
  );
}

// GroupBuyModal — eski nom bilan export (backward compatibility)
export function GroupBuyModal({ group, lang, dark, currentUser, onClose, onSuccess }) {
  return (
    <PaymentModal group={group} lang={lang} dark={dark}
      onClose={onClose} onSuccess={onSuccess} />
  );
}
