import { useState } from "react";
import { theme } from "../theme.js";
import { T } from "../translations.js";
import { formatPrice, genId } from "../utils.js";
import { ModalSheet, Btn } from "../components/UI.jsx";

const G = "#16A34A";

export const BOOST_PLANS = [
  {
    id:"basic", icon:"⚡", color:"#3B82F6",
    name:{ uz:"Oddiy Boost", ru:"Обычный Буст" },
    desc:{ uz:"24 soat yuqorida", ru:"24 часа вверху" },
    price:5000, duration:1,
    features:{ uz:["24 soat TOP da","2x ko'proq ko'rish","Sarlavha ajratiladi"], ru:["24 часа в ТОП","2x больше просмотров","Выделенный заголовок"] },
  },
  {
    id:"super", icon:"🚀", color:"#F59E0B", popular:true,
    name:{ uz:"Super Boost", ru:"Супер Буст" },
    desc:{ uz:"7 kun, sariq rang", ru:"7 дней, жёлтый цвет" },
    price:15000, duration:7,
    features:{ uz:["7 kun TOP da","5x ko'proq ko'rish","Sariq rang ajratish","Bildirishnoma yuboriladi"], ru:["7 дней в ТОП","5x больше просмотров","Жёлтое выделение","Отправка уведомлений"] },
  },
  {
    id:"premium", icon:"👑", color:"#8B5CF6",
    name:{ uz:"Premium E'lon", ru:"Премиум" },
    desc:{ uz:"30 kun, bosh sahifada", ru:"30 дней на главной" },
    price:30000, duration:30,
    features:{ uz:["30 kun bosh sahifada","10x ko'proq ko'rish","VIP nishon","Tavsiya sektsiyasida","Sotuvchi tasdiqlangan belgisi"], ru:["30 дней на главной","10x больше просмотров","VIP значок","В секции рекомендаций","Значок проверенного продавца"] },
  },
];

export function BoostModal({ listing, lang, dark, onClose, onBoost }) {
  const th = theme(dark);
  const tx = T[lang];
  const [selected, setSelected] = useState("super");
  const [step, setStep] = useState(0); // 0=plans, 1=payment, 2=success
  const [method, setMethod] = useState("payme");

  const plan = BOOST_PLANS.find(p => p.id === selected);

  if (step === 2) return (
    <ModalSheet dark={dark} onClose={onClose} title="">
      <div style={{ textAlign:"center", padding:"20px 0" }}>
        <div style={{ fontSize:64, marginBottom:12 }}>{plan.icon}</div>
        <div style={{ fontSize:18, fontWeight:800, color:plan.color, marginBottom:6 }}>
          {lang==="uz" ? "Boost faollashtirildi!" : "Буст активирован!"}
        </div>
        <div style={{ fontSize:13, color:th.sub, marginBottom:20 }}>
          {lang==="uz"
            ? `E'loningiz ${plan.duration} kun davomida TOP da ko'rsatiladi`
            : `Ваше объявление будет показываться в ТОП ${plan.duration} дней`}
        </div>
        <div style={{ background:plan.color+"12", borderRadius:14, padding:"14px", border:`1px solid ${plan.color}25`, marginBottom:20 }}>
          <div style={{ fontSize:14, fontWeight:700, color:plan.color, marginBottom:8 }}>
            {plan.name[lang]}
          </div>
          {plan.features[lang].map((f,i) => (
            <div key={i} style={{ display:"flex", gap:8, marginBottom:5, alignItems:"center" }}>
              <span style={{ color:plan.color }}>✓</span>
              <span style={{ fontSize:13, color:th.text }}>{f}</span>
            </div>
          ))}
        </div>
        <Btn dark={dark} onClick={() => { onBoost({ listingId:listing.id, plan:selected, expiresAt: new Date(Date.now()+plan.duration*86400000).toISOString() }); onClose(); }} style={{ background:plan.color }}>
          {lang==="uz" ? "Zo'r, rahmat! 🎉" : "Отлично, спасибо! 🎉"}
        </Btn>
      </div>
    </ModalSheet>
  );

  if (step === 1) return (
    <ModalSheet dark={dark} onClose={() => setStep(0)} title={lang==="uz" ? "💳 To'lov" : "💳 Оплата"}>
      <div style={{ background:plan.color+"12", borderRadius:14, padding:"14px 16px", marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"center", border:`1px solid ${plan.color}25` }}>
        <div>
          <div style={{ fontWeight:700, color:plan.color }}>{plan.name[lang]}</div>
          <div style={{ fontSize:12, color:th.sub }}>{plan.desc[lang]}</div>
        </div>
        <div style={{ fontWeight:900, color:plan.color, fontSize:18 }}>
          {formatPrice(plan.price)} {tx.sum}
        </div>
      </div>
      {[{ id:"payme",label:"Payme",icon:"💳" },{ id:"click",label:"Click",icon:"🔵" },{ id:"uzum",label:"Uzum Pay",icon:"🟣" },{ id:"cash",label:lang==="uz"?"Naqd":"Нал",icon:"💵" }].map(pm => (
        <div key={pm.id} onClick={() => setMethod(pm.id)} style={{
          display:"flex", alignItems:"center", gap:12, padding:"13px 14px",
          background:method===pm.id ? plan.color+"12" : th.card2,
          border:`2px solid ${method===pm.id ? plan.color : th.border}`,
          borderRadius:12, marginBottom:8, cursor:"pointer",
        }}>
          <span style={{ fontSize:22 }}>{pm.icon}</span>
          <span style={{ flex:1, fontWeight:600, color:th.text }}>{pm.label}</span>
          <div style={{ width:18, height:18, borderRadius:9, border:`2px solid ${method===pm.id ? plan.color : th.border}`, background:method===pm.id ? plan.color : "transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
            {method===pm.id && <div style={{ width:7, height:7, borderRadius:4, background:"#fff" }} />}
          </div>
        </div>
      ))}
      <div style={{ marginTop:16 }}>
        <Btn dark={dark} onClick={() => setStep(2)} style={{ background:plan.color }}>
          💳 {formatPrice(plan.price)} {tx.sum} {lang==="uz"?"to'lash":"оплатить"}
        </Btn>
      </div>
    </ModalSheet>
  );

  return (
    <ModalSheet dark={dark} onClose={onClose} title={`🚀 ${lang==="uz" ? "E'lonni oshiring" : "Поднять объявление"}`}>
      <div style={{ marginBottom:16 }}>
        {BOOST_PLANS.map(p => (
          <div key={p.id} onClick={() => setSelected(p.id)} style={{
            background: selected===p.id ? p.color+"12" : th.card2,
            border:`2px solid ${selected===p.id ? p.color : th.border}`,
            borderRadius:14, padding:"14px 16px", marginBottom:10, cursor:"pointer", position:"relative",
          }}>
            {p.popular && (
              <div style={{ position:"absolute", top:-8, right:12, background:p.color, color:"#fff", fontSize:10, fontWeight:700, padding:"2px 10px", borderRadius:10 }}>
                {lang==="uz" ? "Mashhur" : "Популярное"}
              </div>
            )}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:22 }}>{p.icon}</span>
                <div>
                  <div style={{ fontWeight:700, color:selected===p.id ? p.color : th.text }}>{p.name[lang]}</div>
                  <div style={{ fontSize:11, color:th.sub }}>{p.desc[lang]}</div>
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontWeight:900, color:p.color, fontSize:16 }}>{formatPrice(p.price)}</div>
                <div style={{ fontSize:10, color:th.sub }}>{tx.sum}</div>
              </div>
            </div>
            {selected===p.id && (
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                {p.features[lang].map((f,i) => (
                  <div key={i} style={{ display:"flex", gap:6, alignItems:"center" }}>
                    <span style={{ color:p.color, fontSize:12 }}>✓</span>
                    <span style={{ fontSize:12, color:th.text2 }}>{f}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <Btn dark={dark} onClick={() => setStep(1)} style={{ background:plan.color }}>
        {plan.icon} {plan.name[lang]} — {formatPrice(plan.price)} {tx.sum}
      </Btn>
    </ModalSheet>
  );
}

export function BoostBadge({ boost, lang }) {
  if (!boost) return null;
  const plan = BOOST_PLANS.find(p => p.id === boost.plan);
  if (!plan) return null;
  const isActive = new Date(boost.expiresAt) > new Date();
  if (!isActive) return null;
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:4, background:plan.color+"20", borderRadius:8, padding:"2px 8px", border:`1px solid ${plan.color}40` }}>
      <span style={{ fontSize:11 }}>{plan.icon}</span>
      <span style={{ fontSize:10, fontWeight:700, color:plan.color }}>{plan.name[lang]}</span>
    </div>
  );
}

export function BoostStatsBanner({ stats, lang, dark }) {
  const th = theme(dark);
  if (!stats) return null;
  return (
    <div style={{ background:th.card2, borderRadius:12, padding:"12px 16px", margin:"8px 16px", border:`1px solid ${th.border}` }}>
      <div style={{ fontSize:12, fontWeight:700, color:th.sub, marginBottom:8 }}>
        📊 {lang==="uz" ? "Boost statistikasi" : "Статистика буста"}
      </div>
      <div style={{ display:"flex", gap:0 }}>
        {[
          { icon:"👁️", val:stats.views || 0, label:lang==="uz"?"Ko'rish":"Просмотры" },
          { icon:"📞", val:stats.calls || 0, label:lang==="uz"?"Qo'ng'iroq":"Звонки" },
          { icon:"❤️", val:stats.favs || 0, label:lang==="uz"?"Sevimli":"Избранное" },
          { icon:"💬", val:stats.chats || 0, label:"Chat" },
        ].map((s,i,arr) => (
          <div key={i} style={{ flex:1, textAlign:"center", borderRight:i<arr.length-1?`1px solid ${th.border}`:"none" }}>
            <div style={{ fontSize:15 }}>{s.icon}</div>
            <div style={{ fontWeight:800, color:th.text, fontSize:16 }}>{s.val}</div>
            <div style={{ fontSize:9, color:th.sub }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
