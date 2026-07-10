import { useState, useEffect, useRef } from "react";
import { theme } from "../theme.js";
import { T } from "../translations.js";
import { formatPrice, genId } from "../utils.js";
import { ModalSheet, Btn } from "../components/UI.jsx";

const G = "#16A34A";

// ─── Countdown hook ───────────────────────────────────
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

// ─── Animatsion raqam blok ────────────────────────────
function TimeUnit({ value, label, color, bgColor }) {
  const prev = useRef(value);
  const [flip, setFlip] = useState(false);
  useEffect(() => {
    if (prev.current !== value) {
      setFlip(true);
      prev.current = value;
      const t = setTimeout(() => setFlip(false), 300);
      return () => clearTimeout(t);
    }
  }, [value]);
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", minWidth:52 }}>
      <div style={{
        background: bgColor || "rgba(255,255,255,0.15)",
        borderRadius: 12,
        padding: "8px 10px",
        minWidth: 52,
        textAlign: "center",
        transform: flip ? "scaleY(0.85)" : "scaleY(1)",
        transition: "transform 0.15s ease",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        border: "1px solid rgba(255,255,255,0.2)",
      }}>
        <div style={{
          fontSize: 26, fontWeight: 900, color: color || "#fff",
          fontFamily: "monospace", lineHeight: 1,
          letterSpacing: -1,
        }}>
          {String(value).padStart(2, "0")}
        </div>
      </div>
      <div style={{ fontSize: 9, color: color ? color+"99" : "rgba(255,255,255,0.6)", marginTop: 4, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </div>
    </div>
  );
}

// ─── Separator ───────────────────────────────────────
function TimeSep({ color }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:16, paddingTop:4 }}>
      <div style={{ width:4, height:4, borderRadius:2, background: color || "rgba(255,255,255,0.5)" }} />
      <div style={{ width:4, height:4, borderRadius:2, background: color || "rgba(255,255,255,0.5)" }} />
    </div>
  );
}


// ─── Demo ma'lumotlar ────────────────────────────────
const DEMO_GROUPS = [
  {
    id: "gb1",
    title: { uz: "iPhone 15 Pro ulgurji", ru: "iPhone 15 Pro оптом" },
    originalPrice: 14500000, groupPrice: 11500000,
    maxMembers: 10, currentMembers: 7,
    endsAt: new Date(Date.now() + 3600000 * 17 + 60000 * 54 + 1000 * 37).toISOString(),
    emoji: "📱", color: "#3B82F6",
    image: null,
    badge: "🔥 HOT",
    badgeColor: "#EF4444",
    urgency: { uz: "Oxirgi 1 soatda 12 kishi qo'shildi", ru: "12 человек присоединились за последний час" },
    viewers: 18,
    rating: 4.9, reviewCount: 120,
    members: [
      { name: "Jasur",   avatar: "J",  color: "#3B82F6" },
      { name: "Sardor",  avatar: "S",  color: "#8B5CF6" },
      { name: "Malika",  avatar: "M",  color: "#EC4899" },
      { name: "Bobur",   avatar: "B",  color: "#F59E0B" },
      { name: "Nodira",  avatar: "N",  color: "#10B981" },
      { name: "Kamol",   avatar: "K",  color: "#EF4444" },
      { name: "Zulfiya", avatar: "Z",  color: "#6366F1" },
    ],
  },
  {
    id: "gb2",
    title: { uz: "Samsung TV 55\" ulgurji", ru: "Samsung TV 55\" оптом" },
    originalPrice: 4200000, groupPrice: 3200000,
    maxMembers: 5, currentMembers: 3,
    endsAt: new Date(Date.now() + 3600000 * 35 + 60000 * 54 + 1000 * 37).toISOString(),
    emoji: "📺", color: "#8B5CF6",
    image: null,
    badge: "⚡ Trend",
    badgeColor: "#F59E0B",
    urgency: { uz: "Faqat 2 ta joy qoldi!", ru: "Осталось только 2 места!" },
    viewers: 9,
    rating: 4.7, reviewCount: 85,
    members: [
      { name: "Alisher", avatar: "A", color: "#8B5CF6" },
      { name: "Dilnoza", avatar: "D", color: "#EC4899" },
      { name: "Firdavs", avatar: "F", color: "#3B82F6" },
    ],
  },
];


// ─── Stars komponenti ─────────────────────────────────
function Stars({ value, count, dark }) {
  const th = theme(dark);
  return (
    <div style={{ display:"flex", alignItems:"center", gap:4 }}>
      <div style={{ display:"flex", gap:1 }}>
        {[1,2,3,4,5].map(n => (
          <span key={n} style={{ fontSize:11, color: n<=Math.round(value) ? "#F59E0B" : "#E5E7EB" }}>★</span>
        ))}
      </div>
      <span style={{ fontSize:11, fontWeight:700, color:"#F59E0B" }}>{value}</span>
      <span style={{ fontSize:11, color: th?.sub || "#999" }}>({count})</span>
    </div>
  );
}

// ─── Puls animation button ────────────────────────────
function PulseBtn({ children, onClick, disabled, color, style }) {
  const [pulse, setPulse] = useState(false);
  const handleClick = () => {
    if (disabled) return;
    setPulse(true);
    setTimeout(() => setPulse(false), 400);
    onClick?.();
  };
  return (
    <button onClick={handleClick} disabled={disabled} style={{
      width: "100%", padding: "16px",
      borderRadius: 16, border: "none",
      background: disabled ? "#E5E7EB" : color || G,
      color: disabled ? "#9CA3AF" : "#fff",
      fontSize: 15, fontWeight: 800,
      cursor: disabled ? "not-allowed" : "pointer",
      transform: pulse ? "scale(0.97)" : "scale(1)",
      boxShadow: disabled ? "none" : `0 6px 20px ${color || G}55`,
      transition: "all 0.15s ease",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      ...style,
    }}>
      {children}
    </button>
  );
}


// ─── Asosiy GroupCard ─────────────────────────────────
function GroupCard({ group, lang, dark, onJoin, isJoined }) {
  const th = theme(dark);
  const tx = T[lang];
  const { h, m, s, expired } = useCountdown(group.endsAt);
  const progress = group.currentMembers / group.maxMembers;
  const remaining = group.maxMembers - group.currentMembers;
  const discount = Math.round((1 - group.groupPrice / group.originalPrice) * 100);
  const isUz = lang === "uz";

  return (
    <div style={{
      background: th.card, borderRadius: 20, overflow: "hidden",
      marginBottom: 16, border: `1px solid ${th.border}`,
      boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
    }}>

      {/* ── TOP BANNER: rasm + badge + countdown ── */}
      <div style={{
        background: `linear-gradient(135deg, ${group.color}, ${group.color}CC)`,
        padding: "0", position: "relative", overflow: "hidden",
      }}>
        {/* Badge: HOT / Trend */}
        <div style={{
          position: "absolute", top: 12, left: 12, zIndex: 10,
          background: group.badgeColor,
          color: "#fff", fontSize: 11, fontWeight: 800,
          padding: "4px 10px", borderRadius: 20,
          boxShadow: `0 2px 8px ${group.badgeColor}55`,
        }}>
          {group.badge}
        </div>

        {/* Viewers social proof */}
        <div style={{
          position: "absolute", top: 12, right: 12, zIndex: 10,
          background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)",
          color: "#fff", fontSize: 10, fontWeight: 700,
          padding: "4px 10px", borderRadius: 20,
          display: "flex", alignItems: "center", gap: 4,
        }}>
          👁 {group.viewers} {isUz ? "kishi ko'rmoqda" : "смотрят сейчас"}
        </div>

        {/* Mahsulot rasmi — katta */}
        <div style={{
          width: "100%", height: 160,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `linear-gradient(180deg, transparent, rgba(0,0,0,0.15))`,
          position: "relative",
        }}>
          {group.image
            ? <img src={group.image} alt={group.title[lang]} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            : (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
                <div style={{ fontSize: 72, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}>
                  {group.emoji}
                </div>
                {/* Rating */}
                <div style={{ background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)", borderRadius:20, padding:"4px 12px" }}>
                  <Stars value={group.rating} count={group.reviewCount} />
                </div>
              </div>
            )
          }
        </div>

        {/* Mahsulot nomi + chegirma */}
        <div style={{ padding: "10px 16px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ color:"#fff", fontWeight:800, fontSize:15 }}>{group.title[lang]}</div>
            <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:800, color:"#fff", display:"inline-block", marginTop:4 }}>
              -{discount}% {isUz ? "chegirma" : "скидка"}
            </div>
          </div>

          {/* ⏰ Animatsion countdown */}
          {!expired ? (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.7)", fontWeight:700, textTransform:"uppercase", letterSpacing:1, display:"flex", alignItems:"center", gap:4 }}>
                ⏰ {isUz ? "Tugashiga:" : "До конца:"}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <TimeUnit value={h} label={isUz?"SOAT":"ЧАС"} />
                <TimeSep />
                <TimeUnit value={m} label={isUz?"DAQ":"МИН"} />
                <TimeSep />
                <TimeUnit value={s} label={isUz?"SON":"СЕК"} />
              </div>
            </div>
          ) : (
            <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:10, padding:"8px 12px", color:"#fff", fontSize:12, fontWeight:700 }}>
              ⏰ {isUz?"Tugadi":"Завершено"}
            </div>
          )}
        </div>
      </div>

      {/* ── KONTENT ── */}
      <div style={{ padding: "14px 16px" }}>

        {/* Narxlar: Asl → Guruh narxi + Tejash */}
        <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:14, background:th.card2, borderRadius:14, padding:"12px 14px" }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, color:th.sub, marginBottom:2 }}>{isUz?"Asl narx":"Исходная цена"}</div>
            <div style={{ fontWeight:700, color:th.sub, textDecoration:"line-through", fontSize:14 }}>
              {formatPrice(group.originalPrice)} {tx.sum}
            </div>
          </div>
          <div style={{ fontSize:18, color:th.sub }}>→</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, color:G, marginBottom:2 }}>
              🔥 {isUz?"Guruh narxi":"Цена группы"}
            </div>
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

        {/* Progress bar — visual */}
        <div style={{ marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6, alignItems:"center" }}>
            <span style={{ fontSize:12, fontWeight:600, color:th.text }}>
              {group.currentMembers} / {group.maxMembers} {isUz?"ta a'zo":"участников"}
            </span>
            <span style={{ fontSize:12, fontWeight:800, color: remaining<=2 ? "#EF4444" : G }}>
              {isUz?`Yana ${remaining} kishi kerak`:`Нужно ещё ${remaining}`}
            </span>
          </div>
          {/* Progress bar */}
          <div style={{ height:10, background:th.card2, borderRadius:5, overflow:"hidden", border:`1px solid ${th.border}` }}>
            <div style={{
              height:"100%",
              width:`${progress*100}%`,
              background:`linear-gradient(to right, ${group.color}, ${G})`,
              borderRadius:5,
              transition:"width 0.8s ease",
              position:"relative",
            }}>
              <div style={{ position:"absolute", right:0, top:"50%", transform:"translate(50%,-50%)", width:16, height:16, borderRadius:8, background:"#fff", border:`3px solid ${G}`, boxShadow:"0 2px 6px rgba(0,0,0,0.2)" }} />
            </div>
          </div>
          {/* Filled indicator */}
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
            {Array.from({length:group.maxMembers}).map((_,i)=>(
              <div key={i} style={{ width:6, height:6, borderRadius:3, background: i<group.currentMembers ? G : th.card2 }} />
            ))}
          </div>
        </div>

        {/* A'zolar avatarlari — haqiqiy */}
        <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:14 }}>
          {group.members.slice(0,5).map((mem,i)=>(
            <div key={i} style={{
              width:32, height:32, borderRadius:16,
              background:`linear-gradient(135deg, ${mem.color}, ${mem.color}AA)`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:13, fontWeight:800, color:"#fff",
              marginLeft:i>0?-10:0,
              border:`2px solid ${th.card}`,
              zIndex:group.members.length-i,
              boxShadow:"0 2px 6px rgba(0,0,0,0.15)",
            }}>
              {mem.avatar}
            </div>
          ))}
          {group.members.length > 5 && (
            <div style={{
              width:32, height:32, borderRadius:16,
              background:th.card2, border:`2px solid ${th.card}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:10, fontWeight:800, color:th.sub,
              marginLeft:-10,
            }}>
              +{group.members.length-5}
            </div>
          )}
          <div style={{ marginLeft:12, flex:1 }}>
            <div style={{ fontSize:11, color:th.sub }}>{isUz?"qo'shilgan":"присоединились"}</div>
            {/* Urgency social proof */}
            <div style={{ fontSize:10, color:group.badgeColor, fontWeight:700, marginTop:1 }}>
              🔥 {group.urgency[lang]}
            </div>
          </div>
        </div>

        {/* Yetkazish / Himoya / Qaytarish / Muddatli to'lov blok */}
        <div style={{
          background:th.card2, borderRadius:14, padding:"12px 14px",
          marginBottom:14, border:`1px solid ${th.border}`,
          display:"grid", gridTemplateColumns:"1fr 1fr", gap:8,
        }}>
          {[
            { icon:"🚚", label:isUz?"Yetkazish":"Доставка",        val:isUz?"1-3 kun":"1-3 дня" },
            { icon:"🛡️", label:isUz?"Xaridor himoyasi":"Защита",    val:isUz?"Kafolatlangan":"Гарантия" },
            { icon:"↩️", label:isUz?"Qaytarish":"Возврат",          val:isUz?"7 kun":"7 дней" },
            { icon:"💳", label:isUz?"Muddatli to'lov":"Рассрочка",  val:isUz?"0% foiz":"0% ставка" },
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

        {/* CTA — Puls animatsion button */}
        <PulseBtn
          onClick={() => onJoin(group)}
          disabled={expired || remaining===0 || isJoined}
          color={group.color}
        >
          {isJoined
            ? `✅ ${isUz?"Qo'shildingiz":"Вы участвуете"}`
            : expired
            ? `⏰ ${isUz?"Muddat tugadi":"Время истекло"}`
            : remaining===0
            ? `🔒 ${isUz?"To'ldi":"Мест нет"}`
            : <>🤝 {isUz?"Guruhga qo'shilish":"Присоединиться"} — {formatPrice(group.groupPrice)} {tx.sum}</>
          }
        </PulseBtn>
      </div>
    </div>
  );
}


// ─── To'lov modali ────────────────────────────────────
export function GroupBuyModal({ group, lang, dark, currentUser, onClose, onSuccess }) {
  const th = theme(dark);
  const tx = T[lang];
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState("payme");
  const [done, setDone] = useState(false);
  const isUz = lang === "uz";

  const handlePay = () => {
    setStep(1);
    setTimeout(() => { setDone(true); onSuccess?.(group); }, 2000);
  };

  if (done) return (
    <ModalSheet dark={dark} onClose={onClose}>
      <div style={{ textAlign:"center", padding:"20px 0" }}>
        <div style={{ fontSize:64, marginBottom:12 }}>🎉</div>
        <div style={{ fontSize:18, fontWeight:800, color:G, marginBottom:8 }}>
          {isUz?"Guruhga qo'shildingiz!":"Вы присоединились к группе!"}
        </div>
        <div style={{ fontSize:13, color:th.sub, lineHeight:1.6, marginBottom:20 }}>
          {isUz
            ? `Barcha ${group.maxMembers} ta a'zo qo'shilgandan so'ng buyurtma joylashtiriladi`
            : `Заказ будет размещён после присоединения всех ${group.maxMembers} участников`}
        </div>
        <div style={{ background:G+"12", borderRadius:12, padding:"12px 16px", marginBottom:20, border:`1px solid ${G}25` }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ color:th.sub, fontSize:13 }}>{isUz?"To'langan":"Оплачено"}</span>
            <span style={{ fontWeight:700, color:G }}>{formatPrice(group.groupPrice)} {tx.sum}</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <span style={{ color:th.sub, fontSize:13 }}>{isUz?"Tejaldi":"Сэкономлено"}</span>
            <span style={{ fontWeight:700, color:"#10B981" }}>
              -{formatPrice(group.originalPrice - group.groupPrice)} {tx.sum}
            </span>
          </div>
        </div>
        <Btn dark={dark} onClick={onClose} style={{ background:G }}>{isUz?"Ajoyib!":"Отлично!"}</Btn>
      </div>
    </ModalSheet>
  );

  if (step===1) return (
    <ModalSheet dark={dark} onClose={() => {}}>
      <div style={{ textAlign:"center", padding:"30px 0" }}>
        <div style={{ width:56, height:56, borderRadius:28, border:`4px solid ${G}`, borderTopColor:"transparent", animation:"spin 0.8s linear infinite", margin:"0 auto 20px" }} />
        <div style={{ fontSize:15, fontWeight:700, color:th.text }}>{isUz?"To'lov amalga oshirilmoqda...":"Обработка платежа..."}</div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </ModalSheet>
  );

  return (
    <ModalSheet dark={dark} onClose={onClose}
      title={`🤝 ${isUz?"Guruhga qo'shilish":"Присоединиться"}`}>
      <div style={{ background:`linear-gradient(135deg,${group.color}20,${group.color}10)`, borderRadius:14, padding:"14px 16px", marginBottom:16, border:`1px solid ${group.color}30` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
          <span style={{ fontSize:28 }}>{group.emoji}</span>
          <div style={{ fontWeight:700, color:th.text, fontSize:14 }}>{group.title[lang]}</div>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <span style={{ color:th.sub, fontSize:13 }}>{isUz?"To'lov summasi":"Сумма к оплате"}</span>
          <span style={{ fontWeight:900, color:G, fontSize:16 }}>{formatPrice(group.groupPrice)} {tx.sum}</span>
        </div>
      </div>
      {[
        {id:"payme",label:"Payme",icon:"💳"},
        {id:"click",label:"Click",icon:"🔵"},
        {id:"uzum",label:"Uzum Pay",icon:"🟣"},
      ].map(pm=>(
        <div key={pm.id} onClick={()=>setMethod(pm.id)} style={{
          display:"flex", alignItems:"center", gap:12,
          padding:"12px 14px",
          background:method===pm.id ? G+"12" : th.card2,
          border:`2px solid ${method===pm.id ? G : th.border}`,
          borderRadius:12, marginBottom:8, cursor:"pointer",
        }}>
          <span style={{ fontSize:22 }}>{pm.icon}</span>
          <span style={{ flex:1, fontWeight:600, color:th.text }}>{pm.label}</span>
          <div style={{ width:18, height:18, borderRadius:9, border:`2px solid ${method===pm.id?G:th.border}`, background:method===pm.id?G:"transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
            {method===pm.id && <div style={{ width:7, height:7, borderRadius:4, background:"#fff" }} />}
          </div>
        </div>
      ))}
      <div style={{ background:"#F59E0B12", borderRadius:12, padding:"10px 14px", margin:"12px 0", border:"1px solid #F59E0B30", fontSize:12, color:"#F59E0B" }}>
        ⚠️ {isUz?"Pul guruh to'liq bo'lganda hisobdan chiqariladi":"Деньги будут списаны когда группа заполнится"}
      </div>
      <PulseBtn onClick={handlePay} color={group.color}>
        💳 {formatPrice(group.groupPrice)} {tx.sum} {isUz?"to'lash":"оплатить"}
      </PulseBtn>
    </ModalSheet>
  );
}

// ─── Asosiy sahifa ────────────────────────────────────
export default function GroupBuyPage({ lang, dark, onBack, currentUser }) {
  const th = theme(dark);
  const isUz = lang === "uz";
  const [groups] = useState(DEMO_GROUPS);
  const [activeGroup, setActiveGroup] = useState(null);
  const [joined, setJoined] = useState([]);

  return (
    <div style={{ background:th.bg, minHeight:"100vh", paddingBottom:80 }}>
      <div style={{ background:`linear-gradient(135deg,${G},#15803D)`, padding:"50px 16px 20px" }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:10, width:36, height:36, color:"#fff", fontSize:18, cursor:"pointer", marginBottom:14 }}>←</button>
        <div style={{ color:"#fff", fontWeight:800, fontSize:22 }}>
          🤝 {isUz?"Birga olamiz":"Купим вместе"}
        </div>
        <div style={{ color:"rgba(255,255,255,0.75)", fontSize:13, marginTop:4 }}>
          {isUz?"Birlashib ulgurji narxda oling":"Объединитесь и купите по оптовой цене"}
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

      <div style={{ padding:16 }}>
        {groups.map(g=>(
          <GroupCard key={g.id} group={g} lang={lang} dark={dark}
            isJoined={joined.includes(g.id)}
            onJoin={grp=>joined.includes(grp.id)?null:setActiveGroup(grp)} />
        ))}
      </div>

      {activeGroup && (
        <GroupBuyModal group={activeGroup} lang={lang} dark={dark} currentUser={currentUser}
          onClose={()=>setActiveGroup(null)}
          onSuccess={g=>{ setJoined(p=>[...p,g.id]); setActiveGroup(null); }} />
      )}
    </div>
  );
}
