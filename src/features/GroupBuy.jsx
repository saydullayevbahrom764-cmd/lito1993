import { useState, useEffect } from "react";
import { theme } from "../theme.js";
import { T } from "../translations.js";
import { formatPrice, genId } from "../utils.js";
import { ModalSheet, Btn } from "../components/UI.jsx";

const G = "#16A34A";

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

function TimerBlock({ value, label, color }) {
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ background:color+"20", borderRadius:10, padding:"6px 10px", minWidth:40, fontSize:20, fontWeight:900, color, fontFamily:"monospace" }}>
        {String(value).padStart(2,"0")}
      </div>
      <div style={{ fontSize:9, color:"#999", marginTop:3 }}>{label}</div>
    </div>
  );
}

// Demo group buy campaigns
const DEMO_GROUPS = [
  {
    id:"gb1", title:{ uz:"iPhone 15 Pro ulgurji", ru:"iPhone 15 Pro оптом" },
    originalPrice:14500000, groupPrice:11500000,
    maxMembers:10, currentMembers:7,
    endsAt: new Date(Date.now()+3600000*18).toISOString(),
    emoji:"📱", color:"#3B82F6",
    members:[
      { name:"Jasur", avatar:"😊" },{ name:"Sardor", avatar:"🙂" },
      { name:"Malika", avatar:"😄" },{ name:"Bobur", avatar:"🧑" },
      { name:"Nodira", avatar:"👩" },{ name:"Kamol", avatar:"😎" },
      { name:"Zulfiya", avatar:"🌸" },
    ],
  },
  {
    id:"gb2", title:{ uz:"Samsung TV 55\" ulgurji", ru:"Samsung TV 55\" оптом" },
    originalPrice:4200000, groupPrice:3200000,
    maxMembers:5, currentMembers:3,
    endsAt: new Date(Date.now()+3600000*36).toISOString(),
    emoji:"📺", color:"#8B5CF6",
    members:[
      { name:"Alisher", avatar:"👨" },{ name:"Dilnoza", avatar:"👩" },
      { name:"Firdavs", avatar:"🧔" },
    ],
  },
];

function GroupCard({ group, lang, dark, onJoin }) {
  const th = theme(dark);
  const tx = T[lang];
  const { h, m, s, expired } = useCountdown(group.endsAt);
  const progress = group.currentMembers / group.maxMembers;
  const remaining = group.maxMembers - group.currentMembers;
  const discount = Math.round((1 - group.groupPrice/group.originalPrice)*100);

  return (
    <div style={{ background:th.card, borderRadius:18, overflow:"hidden", marginBottom:14, border:`1px solid ${th.border}`, boxShadow:th.shadow }}>
      {/* Top banner */}
      <div style={{ background:`linear-gradient(135deg,${group.color},${group.color}CC)`, padding:"14px 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{group.emoji}</div>
            <div>
              <div style={{ color:"#fff", fontWeight:800, fontSize:14 }}>{group.title[lang]}</div>
              <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:800, color:"#fff", display:"inline-block", marginTop:3 }}>
                -{discount}% {lang==="uz"?"chegirma":"скидка"}
              </div>
            </div>
          </div>
          {/* Countdown */}
          {!expired && (
            <div style={{ display:"flex", gap:4, alignItems:"center" }}>
              <TimerBlock value={h} label={lang==="uz"?"soat":"ч"} color="#fff" />
              <span style={{ color:"rgba(255,255,255,0.7)", fontWeight:900, fontSize:18, marginBottom:14 }}>:</span>
              <TimerBlock value={m} label={lang==="uz"?"daq":"мин"} color="#fff" />
              <span style={{ color:"rgba(255,255,255,0.7)", fontWeight:900, fontSize:18, marginBottom:14 }}>:</span>
              <TimerBlock value={s} label={lang==="uz"?"son":"сек"} color="#fff" />
            </div>
          )}
        </div>
      </div>

      <div style={{ padding:"14px 16px" }}>
        {/* Narxlar */}
        <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:14 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color:th.sub }}>{lang==="uz"?"Asl narx":"Исходная цена"}</div>
            <div style={{ fontWeight:700, color:th.text, textDecoration:"line-through", fontSize:15 }}>
              {formatPrice(group.originalPrice)} {tx.sum}
            </div>
          </div>
          <div style={{ fontSize:20 }}>→</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color:G }}>{lang==="uz"?"Guruh narxi":"Групповая цена"}</div>
            <div style={{ fontWeight:900, color:G, fontSize:18 }}>
              {formatPrice(group.groupPrice)} {tx.sum}
            </div>
          </div>
          <div style={{ background:G+"15", borderRadius:10, padding:"6px 10px", border:`1px solid ${G}30` }}>
            <div style={{ fontSize:10, color:G, fontWeight:600 }}>{lang==="uz"?"Tejash":"Экономия"}</div>
            <div style={{ fontWeight:900, color:G, fontSize:13 }}>
              {formatPrice(group.originalPrice - group.groupPrice)}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ fontSize:12, color:th.sub }}>
              {lang==="uz" ? `${group.currentMembers} ta a'zo qo'shildi` : `Присоединились ${group.currentMembers} человек`}
            </span>
            <span style={{ fontSize:12, fontWeight:700, color: remaining<=2 ? "#EF4444" : G }}>
              {remaining} {lang==="uz"?"ta joy qoldi":"мест осталось"}
            </span>
          </div>
          <div style={{ height:8, background:th.card2, borderRadius:4, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${progress*100}%`, background:`linear-gradient(to right,${group.color},${G})`, borderRadius:4, transition:"width 0.5s" }} />
          </div>
        </div>

        {/* Members avatars */}
        <div style={{ display:"flex", alignItems:"center", marginBottom:14 }}>
          {group.members.slice(0,6).map((m,i) => (
            <div key={i} style={{ width:28, height:28, borderRadius:9, background:G+"25", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, marginLeft:i>0?-8:0, border:`2px solid ${th.card}`, zIndex:group.members.length-i }}>
              {m.avatar}
            </div>
          ))}
          {group.members.length > 6 && (
            <div style={{ width:28, height:28, borderRadius:9, background:th.card2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:th.sub, marginLeft:-8, border:`2px solid ${th.card}` }}>
              +{group.members.length-6}
            </div>
          )}
          <span style={{ fontSize:11, color:th.sub, marginLeft:10 }}>
            {lang==="uz" ? "a'zolar" : "участников"}
          </span>
        </div>

        {/* CTA */}
        <Btn dark={dark} onClick={() => onJoin(group)}
          disabled={expired || remaining===0}
          style={{ background: expired||remaining===0 ? th.border2 : group.color }}>
          {expired ? (lang==="uz"?"Muddat tugadi":"Время истекло")
            : remaining===0 ? (lang==="uz"?"To'ldi":"Мест нет")
            : `🤝 ${lang==="uz"?"Guruhga qo'shilish":"Присоединиться"} — ${formatPrice(group.groupPrice)} ${tx.sum}`}
        </Btn>
      </div>
    </div>
  );
}

export function GroupBuyModal({ group, lang, dark, currentUser, onClose, onSuccess }) {
  const th = theme(dark);
  const tx = T[lang];
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState("payme");
  const [done, setDone] = useState(false);

  const handlePay = () => {
    setStep(1);
    setTimeout(() => {
      setDone(true);
      onSuccess?.(group);
    }, 2000);
  };

  if (done) return (
    <ModalSheet dark={dark} onClose={onClose} title="">
      <div style={{ textAlign:"center", padding:"20px 0" }}>
        <div style={{ fontSize:64, marginBottom:12 }}>🎉</div>
        <div style={{ fontSize:18, fontWeight:800, color:G, marginBottom:8 }}>
          {lang==="uz" ? "Guruhga qo'shildingiz!" : "Вы присоединились к группе!"}
        </div>
        <div style={{ fontSize:13, color:th.sub, lineHeight:1.6, marginBottom:20 }}>
          {lang==="uz"
            ? `Barcha ${group.maxMembers} ta a'zo qo'shilgandan so'ng buyurtma joylashtiriladi`
            : `Заказ будет размещён после присоединения всех ${group.maxMembers} участников`}
        </div>
        <div style={{ background:G+"12", borderRadius:12, padding:"12px 16px", marginBottom:20, border:`1px solid ${G}25` }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ color:th.sub, fontSize:13 }}>{lang==="uz"?"To'langan":"Оплачено"}</span>
            <span style={{ fontWeight:700, color:G }}>{formatPrice(group.groupPrice)} {tx.sum}</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <span style={{ color:th.sub, fontSize:13 }}>{lang==="uz"?"Tejaldi":"Сэкономлено"}</span>
            <span style={{ fontWeight:700, color:"#10B981" }}>
              -{formatPrice(group.originalPrice-group.groupPrice)} {tx.sum}
            </span>
          </div>
        </div>
        <Btn dark={dark} onClick={onClose} style={{ background:G }}>{lang==="uz"?"Ajoyib!":"Отлично!"}</Btn>
      </div>
    </ModalSheet>
  );

  if (step===1) return (
    <ModalSheet dark={dark} onClose={() => {}} title="">
      <div style={{ textAlign:"center", padding:"30px 0" }}>
        <div style={{ width:56, height:56, borderRadius:28, border:`4px solid ${G}`, borderTopColor:"transparent", animation:"spin 0.8s linear infinite", margin:"0 auto 20px" }} />
        <div style={{ fontSize:15, fontWeight:700, color:th.text }}>{lang==="uz"?"To'lov amalga oshirilmoqda...":"Обработка платежа..."}</div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </ModalSheet>
  );

  return (
    <ModalSheet dark={dark} onClose={onClose}
      title={`🤝 ${lang==="uz"?"Guruhga qo'shilish":"Присоединиться к группе"}`}>
      <div style={{ background:`linear-gradient(135deg,${group.color}20,${group.color}10)`, borderRadius:14, padding:"14px 16px", marginBottom:16, border:`1px solid ${group.color}30` }}>
        <div style={{ fontWeight:700, color:th.text, marginBottom:6 }}>{group.title[lang]}</div>
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <span style={{ color:th.sub, fontSize:13 }}>{lang==="uz"?"To'lov summa":"Сумма к оплате"}</span>
          <span style={{ fontWeight:900, color:G, fontSize:16 }}>{formatPrice(group.groupPrice)} {tx.sum}</span>
        </div>
      </div>
      {[{id:"payme",label:"Payme",icon:"💳"},{id:"click",label:"Click",icon:"🔵"},{id:"uzum",label:"Uzum Pay",icon:"🟣"}].map(pm=>(
        <div key={pm.id} onClick={()=>setMethod(pm.id)} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:method===pm.id?G+"12":th.card2, border:`2px solid ${method===pm.id?G:th.border}`, borderRadius:12, marginBottom:8, cursor:"pointer" }}>
          <span style={{ fontSize:22 }}>{pm.icon}</span>
          <span style={{ flex:1, fontWeight:600, color:th.text }}>{pm.label}</span>
          <div style={{ width:18, height:18, borderRadius:9, border:`2px solid ${method===pm.id?G:th.border}`, background:method===pm.id?G:"transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
            {method===pm.id&&<div style={{ width:7, height:7, borderRadius:4, background:"#fff" }}/>}
          </div>
        </div>
      ))}
      <div style={{ background:"#F59E0B12", borderRadius:12, padding:"10px 14px", margin:"12px 0", border:"1px solid #F59E0B30", fontSize:12, color:"#F59E0B" }}>
        ⚠️ {lang==="uz"?"Pul guruh to'liq bo'lganda hisobdan chiqariladi":"Деньги будут списаны когда группа заполнится"}
      </div>
      <Btn dark={dark} onClick={handlePay} style={{ background:group.color }}>
        💳 {formatPrice(group.groupPrice)} {tx.sum} {lang==="uz"?"to'lash":"оплатить"}
      </Btn>
    </ModalSheet>
  );
}

export default function GroupBuyPage({ lang, dark, onBack, currentUser }) {
  const th = theme(dark);
  const [groups] = useState(DEMO_GROUPS);
  const [activeGroup, setActiveGroup] = useState(null);
  const [joined, setJoined] = useState([]);

  return (
    <div style={{ background:th.bg, minHeight:"100vh", paddingBottom:80 }}>
      <div style={{ background:`linear-gradient(135deg,${G},#15803D)`, padding:"50px 16px 20px" }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:10, width:36, height:36, color:"#fff", fontSize:18, cursor:"pointer", marginBottom:14 }}>←</button>
        <div style={{ color:"#fff", fontWeight:800, fontSize:20 }}>
          🤝 {lang==="uz" ? "Birga olamiz" : "Купим вместе"}
        </div>
        <div style={{ color:"rgba(255,255,255,0.75)", fontSize:13, marginTop:4 }}>
          {lang==="uz" ? "Birlashib ulgurji narxda oling" : "Объединитесь и купите по оптовой цене"}
        </div>
        <div style={{ display:"flex", gap:16, marginTop:14 }}>
          {[
            { emoji:"💰", label:lang==="uz"?"Arzon narx":"Низкая цена" },
            { emoji:"🤝", label:lang==="uz"?"Birga olish":"Совместная покупка" },
            { emoji:"🔒", label:lang==="uz"?"Xavfsiz":"Безопасно" },
          ].map((f,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:16 }}>{f.emoji}</span>
              <span style={{ color:"rgba(255,255,255,0.8)", fontSize:11, fontWeight:600 }}>{f.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:16 }}>
        {groups.map(g => (
          <GroupCard key={g.id} group={g} lang={lang} dark={dark}
            onJoin={grp => joined.includes(grp.id) ? null : setActiveGroup(grp)} />
        ))}
      </div>
      {activeGroup && (
        <GroupBuyModal group={activeGroup} lang={lang} dark={dark} currentUser={currentUser}
          onClose={() => setActiveGroup(null)}
          onSuccess={g => { setJoined(p=>[...p,g.id]); setActiveGroup(null); }} />
      )}
    </div>
  );
}
