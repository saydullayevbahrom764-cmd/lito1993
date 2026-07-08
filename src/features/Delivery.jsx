import { useState } from "react";
import { theme } from "../theme.js";
import { T } from "../translations.js";
import { formatPrice, genId } from "../utils.js";
import { ModalSheet, Btn, Input } from "../components/UI.jsx";

const G = "#16A34A";

const COURIER_SERVICES = [
  { id:"yandex", name:"Yandex Go", icon:"🚖", color:"#FC3F1D", basePrice:15000, perKm:2000, eta:"15-30 daq" },
  { id:"express", name:"OsonTop Express", icon:"🟢", color:G, basePrice:10000, perKm:1500, eta:"30-60 daq" },
  { id:"standard", name:"Standart", icon:"📦", color:"#6B7280", basePrice:5000, perKm:1000, eta:"1-2 kun" },
];

function calcDeliveryPrice(service, distKm) {
  return Math.round(service.basePrice + service.perKm * distKm);
}

export function DeliveryModal({ listing, lang, dark, currentUser, onClose, onOrder }) {
  const th = theme(dark);
  const tx = T[lang];
  const [step, setStep] = useState(0); // 0=address, 1=service, 2=confirm, 3=tracking
  const [address, setAddress] = useState("");
  const [service, setService] = useState("yandex");
  const [note, setNote] = useState("");
  const [trackId] = useState("OT-" + genId().toUpperCase().slice(0,6));
  const [trackStep, setTrackStep] = useState(0);
  const distKm = 3.5; // demo

  const selectedService = COURIER_SERVICES.find(s => s.id === service);
  const deliveryPrice = calcDeliveryPrice(selectedService, distKm);
  const total = (listing.price > 0 ? listing.price : 0) + deliveryPrice;

  const handleConfirm = () => {
    setStep(3);
    // Simulate delivery steps
    let i = 0;
    const int = setInterval(() => {
      i++;
      setTrackStep(i);
      if (i >= 3) clearInterval(int);
    }, 2500);
    onOrder?.({ trackId, service, address, deliveryPrice, total });
  };

  const TRACK_STEPS = {
    uz: ["Buyurtma qabul qilindi","Kuryer yolda","Yetkazib berildi ✓"],
    ru: ["Заказ принят","Курьер в пути","Доставлено ✓"],
  };

  // Step 3 — Tracking
  if (step === 3) return (
    <ModalSheet dark={dark} onClose={onClose}
      title={`🚚 ${lang==="uz"?"Kuzatish":"Отслеживание"}`}>
      <div style={{ marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ fontSize:14, fontWeight:700, color:th.text }}>
            {lang==="uz"?"Buyurtma":"Заказ"} #{trackId}
          </div>
          <div style={{ background:G+"20", borderRadius:8, padding:"4px 10px", fontSize:12, fontWeight:700, color:G }}>
            {TRACK_STEPS[lang][Math.min(trackStep, 2)]}
          </div>
        </div>

        {/* Timeline */}
        {TRACK_STEPS[lang].map((s, i) => {
          const done = i <= trackStep;
          const active = i === trackStep;
          return (
            <div key={i} style={{ display:"flex", gap:12, marginBottom:i<2?0:0, paddingBottom:i<2?16:0, position:"relative" }}>
              {i < 2 && (
                <div style={{ position:"absolute", left:11, top:24, width:2, height:"calc(100% - 8px)", background:done && i<trackStep ? G : th.border2 }} />
              )}
              <div style={{ width:24, height:24, borderRadius:12, background:done?G:th.card2, border:`2px solid ${done?G:th.border2}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, zIndex:1 }}>
                {done ? <span style={{ color:"#fff", fontSize:11, fontWeight:800 }}>✓</span>
                  : <div style={{ width:8, height:8, borderRadius:4, background:th.border2 }} />}
              </div>
              <div style={{ paddingBottom:i<2?16:0 }}>
                <div style={{ fontSize:14, fontWeight:done?700:400, color:done?th.text:th.sub }}>{s}</div>
                {active && <div style={{ fontSize:11, color:G, marginTop:2, display:"flex", alignItems:"center", gap:4 }}>
                  <div style={{ width:6, height:6, borderRadius:3, background:G, animation:"pulse 1s infinite" }} />
                  {lang==="uz"?"Hozir...":"Сейчас..."}
                </div>}
              </div>
            </div>
          );
        })}

        {/* Map placeholder */}
        <div style={{ background:G+"12", borderRadius:14, padding:"16px", marginTop:16, textAlign:"center", border:`1px solid ${G}25` }}>
          <div style={{ fontSize:40, marginBottom:8 }}>🗺️</div>
          <div style={{ fontSize:13, color:th.text, fontWeight:600 }}>
            {lang==="uz" ? `Kuryer ${distKm} km uzoqda` : `Курьер на расстоянии ${distKm} км`}
          </div>
          <div style={{ fontSize:12, color:th.sub, marginTop:4 }}>
            {lang==="uz"?"Taxminiy vaqt:":"Ожидаемое время:"} {selectedService?.eta}
          </div>
        </div>
      </div>
      <Btn dark={dark} onClick={onClose} style={{ background:G }}>
        {lang==="uz"?"Yopish":"Закрыть"}
      </Btn>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </ModalSheet>
  );

  // Step 0 — Address
  if (step === 0) return (
    <ModalSheet dark={dark} onClose={onClose}
      title={`📦 ${lang==="uz"?"Yetkazib berish":"Доставка"}`}>
      <div style={{ background:th.card2, borderRadius:12, padding:"12px 14px", marginBottom:16, display:"flex", gap:10, alignItems:"center", border:`1px solid ${th.border}` }}>
        <span style={{ fontSize:22 }}>📍</span>
        <div>
          <div style={{ fontSize:11, color:th.sub }}>{lang==="uz"?"Yetkazib berish manzili":"Адрес доставки"}</div>
          <div style={{ fontSize:13, fontWeight:700, color:th.text }}>{listing.city || "Toshkent"}</div>
        </div>
      </div>
      <Input dark={dark}
        label={`${lang==="uz"?"Ko'cha, uy raqami":"Улица, номер дома"} *`}
        required value={address}
        onChange={e => setAddress(e.target.value)}
        placeholder={lang==="uz" ? "Masalan: Amir Temur 15, 3-xonadon" : "Напр: Амира Темура 15, кв. 3"} />
      <Input dark={dark}
        label={lang==="uz"?"Izoh (ixtiyoriy)":"Примечание (необязательно)"}
        value={note} onChange={e => setNote(e.target.value)}
        placeholder={lang==="uz"?"Qo'ng'iroq qiling darvoza oldida...":"Позвоните у ворот..."} />
      <div style={{ display:"flex", gap:10 }}>
        <Btn dark={dark} variant="ghost" onClick={onClose} style={{ flex:1 }}>{tx.cancel}</Btn>
        <Btn dark={dark} onClick={() => address.trim() && setStep(1)} disabled={!address.trim()} style={{ flex:2, background:G }}>
          {lang==="uz"?"Davom etish":"Продолжить"} →
        </Btn>
      </div>
    </ModalSheet>
  );

  // Step 1 — Service
  if (step === 1) return (
    <ModalSheet dark={dark} onClose={() => setStep(0)}
      title={lang==="uz"?"🚚 Yetkazib berish xizmati":"🚚 Служба доставки"}>
      <div style={{ marginBottom:14 }}>
        {COURIER_SERVICES.map(svc => (
          <div key={svc.id} onClick={() => setService(svc.id)} style={{
            display:"flex", gap:12, padding:"14px 14px",
            background: service===svc.id ? svc.color+"12" : th.card2,
            border:`2px solid ${service===svc.id ? svc.color : th.border}`,
            borderRadius:14, marginBottom:10, cursor:"pointer",
          }}>
            <div style={{ width:44, height:44, borderRadius:12, background:svc.color+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>
              {svc.icon}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, color:service===svc.id ? svc.color : th.text, marginBottom:2 }}>{svc.name}</div>
              <div style={{ fontSize:11, color:th.sub }}>⏱ {svc.eta}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontWeight:800, color:svc.color, fontSize:15 }}>
                {formatPrice(calcDeliveryPrice(svc, distKm))}
              </div>
              <div style={{ fontSize:10, color:th.sub }}>{tx.sum}</div>
            </div>
          </div>
        ))}
      </div>
      <Btn dark={dark} onClick={() => setStep(2)} style={{ background:selectedService?.color }}>
        {selectedService?.icon} {selectedService?.name} — {formatPrice(deliveryPrice)} {tx.sum}
      </Btn>
    </ModalSheet>
  );

  // Step 2 — Confirm
  return (
    <ModalSheet dark={dark} onClose={() => setStep(1)}
      title={lang==="uz"?"✅ Tasdiqlash":"✅ Подтверждение"}>
      <div style={{ marginBottom:16 }}>
        {[
          { icon:"📦", label:lang==="uz"?"Tovar":"Товар", val:listing.title },
          { icon:"📍", label:lang==="uz"?"Manzil":"Адрес", val:address },
          { icon:"🚚", label:lang==="uz"?"Xizmat":"Служба", val:selectedService?.name },
          { icon:"⏱", label:lang==="uz"?"Vaqt":"Время", val:selectedService?.eta },
        ].map((r,i)=>(
          <div key={i} style={{ display:"flex", gap:10, padding:"10px 0", borderBottom:`1px solid ${th.border}`, alignItems:"flex-start" }}>
            <span style={{ fontSize:18, flexShrink:0 }}>{r.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, color:th.sub }}>{r.label}</div>
              <div style={{ fontSize:13, fontWeight:600, color:th.text }}>{r.val}</div>
            </div>
          </div>
        ))}
        <div style={{ marginTop:14, background:th.card2, borderRadius:12, padding:"12px 14px" }}>
          {[
            [lang==="uz"?"Tovar narxi":"Цена товара", listing.price > 0 ? `${formatPrice(listing.price)} ${tx.sum}` : tx.negotiable],
            [lang==="uz"?"Yetkazib berish":"Доставка", `${formatPrice(deliveryPrice)} ${tx.sum}`],
          ].map(([k,v],i)=>(
            <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0" }}>
              <span style={{ color:th.sub, fontSize:13 }}>{k}</span>
              <span style={{ fontWeight:600, color:th.text, fontSize:13 }}>{v}</span>
            </div>
          ))}
          <div style={{ height:1, background:th.border, margin:"8px 0" }} />
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontWeight:700, color:th.text }}>{lang==="uz"?"Jami":"Итого"}</span>
            <span style={{ fontWeight:900, color:G, fontSize:16 }}>{formatPrice(total)} {tx.sum}</span>
          </div>
        </div>
      </div>
      <Btn dark={dark} onClick={handleConfirm} style={{ background:G }}>
        🚚 {lang==="uz"?"Buyurtma berish":"Оформить доставку"}
      </Btn>
    </ModalSheet>
  );
}

export function DeliveryBadge({ price, lang, dark }) {
  const th = theme(dark);
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:4, background:"#10B98115", borderRadius:8, padding:"3px 8px", border:"1px solid #10B98130" }}>
      <span style={{ fontSize:12 }}>🚚</span>
      <span style={{ fontSize:11, fontWeight:700, color:"#10B981" }}>
        {price === 0
          ? (lang==="uz" ? "Bepul yetkazish" : "Бесплатная доставка")
          : `${formatPrice(price)} ${lang==="uz" ? "so'm" : "сум"}`}
      </span>
    </div>
  );
}

export function DeliveryCalculator({ lang, dark, fromCity, toCity }) {
  const th = theme(dark);
  const [dist] = useState(Math.floor(Math.random() * 10 + 1));
  return (
    <div style={{ background:th.card2, borderRadius:14, padding:"14px 16px", border:`1px solid ${th.border}` }}>
      <div style={{ fontSize:13, fontWeight:700, color:th.text, marginBottom:12 }}>
        🚚 {lang==="uz" ? "Yetkazib berish narxi" : "Стоимость доставки"}
      </div>
      <div style={{ display:"flex", gap:8 }}>
        {COURIER_SERVICES.map(svc => (
          <div key={svc.id} style={{ flex:1, background:svc.color+"12", borderRadius:10, padding:"10px 8px", textAlign:"center", border:`1px solid ${svc.color}25` }}>
            <div style={{ fontSize:18, marginBottom:4 }}>{svc.icon}</div>
            <div style={{ fontSize:10, fontWeight:700, color:svc.color, marginBottom:3 }}>{svc.name.split(" ")[0]}</div>
            <div style={{ fontSize:12, fontWeight:800, color:th.text }}>
              {formatPrice(calcDeliveryPrice(svc, dist))}
            </div>
            <div style={{ fontSize:9, color:th.sub }}>{svc.eta}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
