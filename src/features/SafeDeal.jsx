import { useState } from "react";
import { theme } from "../theme.js";
import { T } from "../translations.js";
import { formatPrice, genId } from "../utils.js";
import { ModalSheet, Btn, Input } from "../components/UI.jsx";

const G = "#16A34A";

const PAYMENT_METHODS = [
  { id:"payme",  label:"Payme",    icon:"💳", color:"#00AAFF", url:(amt)=>`https://checkout.paycom.uz/` },
  { id:"click",  label:"Click",    icon:"🔵", color:"#0575E6", url:(amt)=>`https://my.click.uz/services/pay` },
  { id:"uzum",   label:"Uzum Pay", icon:"🟣", color:"#7B2FBE", url:(amt)=>`https://uzum.uz/pay` },
];

const ESCROW_STEPS = {
  uz:["Xaridor to'lovni bloklaydi","Sotuvchi tovarni yetkazadi","Xaridor tovarni tasdiqlaydi","Pul sotuvchiga o'tkaziladi"],
  ru:["Покупатель блокирует оплату","Продавец доставляет товар","Покупатель подтверждает получение","Деньги переводятся продавцу"],
};

export function SafeDealModal({ listing, lang, dark, currentUser, onClose, onSuccess }) {
  const th = theme(dark);
  const tx = T[lang];
  const [step, setStep] = useState(0); // 0=info, 1=payment, 2=processing, 3=done
  const [method, setMethod] = useState("payme");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const price = listing.price > 0 ? listing.price : 0;
  const fee = Math.round(price * 0.02); // 2% komissiya
  const total = price + fee;
  const dealId = genId().toUpperCase().slice(0,8);

  const handlePay = () => {
    setLoading(true);
    setStep(2);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
      onSuccess?.({ dealId, method, price, fee, total, listing });
    }, 2500);
  };

  // STEP 0 — Ma'lumot
  if (step === 0) return (
    <ModalSheet dark={dark} onClose={onClose} title={`🔒 ${tx.safeDeal}`}>
      <div style={{ marginBottom:20 }}>
        <div style={{ background:G+"12", borderRadius:14, padding:"16px", border:`1px solid ${G}25`, marginBottom:16 }}>
          <div style={{ fontSize:14, fontWeight:700, color:G, marginBottom:10 }}>
            {lang==="uz" ? "Xavfsiz Bitim qanday ishlaydi?" : "Как работает Безопасная Сделка?"}
          </div>
          {ESCROW_STEPS[lang].map((s, i) => (
            <div key={i} style={{ display:"flex", gap:10, marginBottom:i<3?10:0, alignItems:"center" }}>
              <div style={{ width:26, height:26, borderRadius:13, background:G, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12, fontWeight:800, flexShrink:0 }}>{i+1}</div>
              <span style={{ fontSize:13, color:th.text }}>{s}</span>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:10, marginBottom:10 }}>
          <div style={{ flex:1, background:th.card2, borderRadius:12, padding:"12px", textAlign:"center", border:`1px solid ${th.border}` }}>
            <div style={{ fontSize:11, color:th.sub, marginBottom:4 }}>
              {lang==="uz" ? "Tovar narxi" : "Цена товара"}
            </div>
            <div style={{ fontWeight:800, color:th.text }}>{formatPrice(price)} {tx.sum}</div>
          </div>
          <div style={{ flex:1, background:"#F59E0B15", borderRadius:12, padding:"12px", textAlign:"center", border:"1px solid #F59E0B30" }}>
            <div style={{ fontSize:11, color:"#F59E0B", marginBottom:4 }}>
              {lang==="uz" ? "Komissiya (2%)" : "Комиссия (2%)"}
            </div>
            <div style={{ fontWeight:800, color:"#F59E0B" }}>{formatPrice(fee)} {tx.sum}</div>
          </div>
        </div>
        <div style={{ background:G+"15", borderRadius:12, padding:"12px 16px", border:`1px solid ${G}30`, display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontWeight:700, color:G }}>{lang==="uz"?"Jami":"Итого"}</span>
          <span style={{ fontWeight:900, color:G, fontSize:16 }}>{formatPrice(total)} {tx.sum}</span>
        </div>
      </div>
      <Btn dark={dark} onClick={() => setStep(1)} style={{ background:G }}>
        🔒 {lang==="uz" ? "Xavfsiz bitim boshlash" : "Начать безопасную сделку"}
      </Btn>
      <Btn dark={dark} variant="ghost" onClick={onClose} style={{ marginTop:10 }}>{tx.cancel}</Btn>
    </ModalSheet>
  );

  // STEP 1 — To'lov usuli
  if (step === 1) return (
    <ModalSheet dark={dark} onClose={onClose} title={lang==="uz" ? "💳 To'lov usuli" : "💳 Способ оплаты"}>
      <div style={{ marginBottom:16 }}>
        {PAYMENT_METHODS.map(pm => (
          <div key={pm.id} onClick={() => setMethod(pm.id)} style={{
            display:"flex", alignItems:"center", gap:14, padding:"14px 16px",
            background: method===pm.id ? pm.color+"12" : th.card2,
            border:`2px solid ${method===pm.id ? pm.color : th.border}`,
            borderRadius:14, marginBottom:10, cursor:"pointer", transition:"all 0.2s",
          }}>
            <span style={{ fontSize:28 }}>{pm.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, color:method===pm.id ? pm.color : th.text }}>{pm.label}</div>
              <div style={{ fontSize:11, color:th.sub }}>
                {lang==="uz" ? "Tezkor to'lov" : "Быстрая оплата"}
              </div>
            </div>
            <div style={{ width:20, height:20, borderRadius:10, border:`2px solid ${method===pm.id ? pm.color : th.border}`, background:method===pm.id ? pm.color : "transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
              {method===pm.id && <div style={{ width:8, height:8, borderRadius:4, background:"#fff" }} />}
            </div>
          </div>
        ))}
      </div>
      <Input dark={dark} label={lang==="uz" ? "Yetkazib berish manzili" : "Адрес доставки"}
        value={address} onChange={e => setAddress(e.target.value)}
        placeholder={lang==="uz" ? "Ko'cha, uy raqami..." : "Улица, номер дома..."} />
      <div style={{ background:th.card2, borderRadius:12, padding:"12px 16px", marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
          <span style={{ color:th.sub, fontSize:13 }}>{lang==="uz"?"Tovar":"Товар"}</span>
          <span style={{ color:th.text, fontWeight:600 }}>{formatPrice(price)} {tx.sum}</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
          <span style={{ color:th.sub, fontSize:13 }}>{lang==="uz"?"Komissiya":"Комиссия"}</span>
          <span style={{ color:"#F59E0B", fontWeight:600 }}>{formatPrice(fee)} {tx.sum}</span>
        </div>
        <div style={{ height:1, background:th.border, margin:"8px 0" }} />
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontWeight:700, color:th.text }}>{lang==="uz"?"Jami":"Итого"}</span>
          <span style={{ fontWeight:900, color:G, fontSize:16 }}>{formatPrice(total)} {tx.sum}</span>
        </div>
      </div>
      <div style={{ display:"flex", gap:10 }}>
        <Btn dark={dark} variant="ghost" onClick={() => setStep(0)} style={{ flex:1 }}>←</Btn>
        <Btn dark={dark} onClick={handlePay} style={{ flex:2, background:G }}>
          💳 {formatPrice(total)} {tx.sum} {lang==="uz"?"to'lash":"оплатить"}
        </Btn>
      </div>
    </ModalSheet>
  );

  // STEP 2 — Processing
  if (step === 2) return (
    <ModalSheet dark={dark} onClose={() => {}} title="">
      <div style={{ textAlign:"center", padding:"20px 0 30px" }}>
        <div style={{ width:64, height:64, borderRadius:32, border:`4px solid ${G}`, borderTopColor:"transparent", animation:"spin 0.8s linear infinite", margin:"0 auto 20px" }} />
        <div style={{ fontSize:16, fontWeight:700, color:th.text, marginBottom:6 }}>
          {lang==="uz" ? "To'lov amalga oshirilmoqda..." : "Обработка платежа..."}
        </div>
        <div style={{ fontSize:13, color:th.sub }}>
          {lang==="uz" ? "Iltimos kuting" : "Пожалуйста, подождите"}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </ModalSheet>
  );

  // STEP 3 — Muvaffaqiyat
  return (
    <ModalSheet dark={dark} onClose={onClose} title="">
      <div style={{ textAlign:"center", padding:"10px 0" }}>
        <div style={{ fontSize:64, marginBottom:12 }}>🎉</div>
        <div style={{ fontSize:18, fontWeight:800, color:G, marginBottom:6 }}>
          {lang==="uz" ? "Xavfsiz bitim boshlandi!" : "Безопасная сделка начата!"}
        </div>
        <div style={{ fontSize:13, color:th.sub, lineHeight:1.6, marginBottom:20 }}>
          {lang==="uz"
            ? "To'lov bloklandi. Tovarni olgandan keyin tasdiqlang."
            : "Платёж заблокирован. Подтвердите получение товара."}
        </div>
        <div style={{ background:G+"12", borderRadius:14, padding:"14px 16px", marginBottom:16, border:`1px solid ${G}25` }}>
          <div style={{ fontSize:11, color:th.sub, marginBottom:4 }}>
            {lang==="uz" ? "Bitim ID" : "ID сделки"}
          </div>
          <div style={{ fontWeight:900, fontSize:18, color:G, fontFamily:"monospace", letterSpacing:2 }}>
            #{dealId}
          </div>
        </div>
        <div style={{ background:th.card2, borderRadius:12, padding:"12px 16px", marginBottom:20 }}>
          {[
            [lang==="uz"?"To'langan":"Оплачено", `${formatPrice(total)} ${tx.sum}`],
            [lang==="uz"?"Holat":"Статус", lang==="uz"?"Bloklangan 🔒":"Заблокировано 🔒"],
          ].map(([k,v],i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0" }}>
              <span style={{ color:th.sub, fontSize:13 }}>{k}</span>
              <span style={{ color:th.text, fontWeight:700, fontSize:13 }}>{v}</span>
            </div>
          ))}
        </div>
        <Btn dark={dark} onClick={onClose} style={{ background:G }}>
          {lang==="uz" ? "Tushundim ✓" : "Понятно ✓"}
        </Btn>
      </div>
    </ModalSheet>
  );
}
