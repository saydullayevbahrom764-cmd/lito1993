import { useState } from "react";
import { theme } from "../theme.js";
import { T } from "../translations.js";
import { formatPrice, genId } from "../utils.js";
import { ModalSheet, Btn, Input } from "../components/UI.jsx";

const G = "#16A34A";

// ── Narx Muzokarasi Modal ─────────────────────────────
export function PriceOfferModal({ listing, lang, dark, currentUser, onClose, onSend }) {
  const th = theme(dark);
  const tx = T[lang];
  const [offerPrice, setOfferPrice] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  const originalPrice = listing.price > 0 ? listing.price : 0;
  const pct = offerPrice && originalPrice
    ? Math.round((1 - Number(offerPrice) / originalPrice) * 100)
    : 0;

  const quickOffers = originalPrice
    ? [
        { label: "-5%",  value: Math.round(originalPrice * 0.95) },
        { label: "-10%", value: Math.round(originalPrice * 0.90) },
        { label: "-15%", value: Math.round(originalPrice * 0.85) },
        { label: "-20%", value: Math.round(originalPrice * 0.80) },
      ]
    : [];

  const handleSend = () => {
    if (!offerPrice) return;
    const offer = {
      id: genId(),
      fromId: currentUser?.uid || "me",
      fromName: currentUser?.name || (lang==="uz" ? "Men" : "Я"),
      listingId: listing.id,
      listingTitle: listing.title,
      originalPrice,
      offerPrice: Number(offerPrice),
      note,
      status: "pending", // pending | accepted | rejected | countered
      createdAt: new Date().toISOString(),
    };
    onSend(offer);
    setSent(true);
  };

  if (sent) return (
    <ModalSheet dark={dark} onClose={onClose}
      title={lang==="uz" ? "✅ Taklif yuborildi!" : "✅ Предложение отправлено!"}>
      <div style={{ textAlign:"center", padding:"10px 0 20px" }}>
        <div style={{ fontSize:56, marginBottom:12 }}>🤝</div>
        <div style={{ fontSize:16, fontWeight:700, color:th.text, marginBottom:6 }}>
          {lang==="uz"
            ? `${formatPrice(offerPrice)} so'm taklif yubordingiz`
            : `Вы предложили ${formatPrice(offerPrice)} сум`}
        </div>
        <div style={{ fontSize:13, color:th.sub, lineHeight:1.6 }}>
          {lang==="uz"
            ? "Sotuvchi javob berganda bildirishnoma olasiz"
            : "Вы получите уведомление когда продавец ответит"}
        </div>
        <div style={{ background:th.card2, borderRadius:12, padding:"12px 16px", margin:"16px 0", display:"flex", justifyContent:"space-between" }}>
          <span style={{ color:th.sub, fontSize:13 }}>
            {lang==="uz" ? "Asl narx" : "Исходная цена"}
          </span>
          <span style={{ fontWeight:700, color:th.text, textDecoration:"line-through" }}>
            {formatPrice(originalPrice)} {tx.sum}
          </span>
        </div>
        <div style={{ background:G+"15", borderRadius:12, padding:"12px 16px", display:"flex", justifyContent:"space-between", border:`1px solid ${G}30` }}>
          <span style={{ color:G, fontSize:13, fontWeight:600 }}>
            {lang==="uz" ? "Sizning taklifingiz" : "Ваше предложение"}
          </span>
          <span style={{ fontWeight:800, color:G, fontSize:15 }}>
            {formatPrice(offerPrice)} {tx.sum}
          </span>
        </div>
      </div>
      <Btn dark={dark} onClick={onClose} style={{ background:G }}>
        {lang==="uz" ? "Yopish" : "Закрыть"}
      </Btn>
    </ModalSheet>
  );

  return (
    <ModalSheet dark={dark} onClose={onClose}
      title={`💰 ${lang==="uz" ? "Narx taklif qilish" : "Предложить цену"}`}>
      {/* Joriy narx */}
      <div style={{ background:th.card2, borderRadius:12, padding:"12px 16px", marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ color:th.sub, fontSize:13 }}>
          {lang==="uz" ? "Sotuvchi narxi" : "Цена продавца"}
        </span>
        <span style={{ fontWeight:800, fontSize:16, color:th.text }}>
          {listing.price > 0 ? `${formatPrice(listing.price)} ${tx.sum}` : tx.negotiable}
        </span>
      </div>

      {/* Tez taklif tugmalari */}
      {quickOffers.length > 0 && (
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:12, color:th.sub, fontWeight:600, marginBottom:8 }}>
            {lang==="uz" ? "Tez taklif" : "Быстрое предложение"}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {quickOffers.map((q, i) => (
              <button key={i} onClick={() => setOfferPrice(String(q.value))} style={{
                flex:1, padding:"10px 4px", borderRadius:10,
                border:`1.5px solid ${String(offerPrice)===String(q.value) ? G : th.border2}`,
                background: String(offerPrice)===String(q.value) ? G+"20" : th.card,
                color: String(offerPrice)===String(q.value) ? G : th.text2,
                fontWeight:700, fontSize:12, cursor:"pointer",
              }}>
                <div>{q.label}</div>
                <div style={{ fontSize:10, marginTop:2 }}>{formatPrice(q.value)}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Narx input */}
      <div style={{ marginBottom:8 }}>
        <Input dark={dark}
          label={lang==="uz" ? `Taklifingiz (${tx.sum})` : `Ваше предложение (${tx.sum})`}
          required type="number"
          value={offerPrice}
          onChange={e => setOfferPrice(e.target.value)}
          placeholder={originalPrice ? String(Math.round(originalPrice * 0.9)) : "500 000"} />
      </div>

      {/* Chegirma foizi */}
      {pct > 0 && (
        <div style={{
          background: pct > 30 ? "#EF444415" : G+"15",
          borderRadius:10, padding:"8px 14px", marginBottom:14,
          border:`1px solid ${pct > 30 ? "#EF444430" : G+"30"}`,
          display:"flex", justifyContent:"space-between",
        }}>
          <span style={{ fontSize:13, color: pct > 30 ? "#EF4444" : G }}>
            {pct > 30
              ? (lang==="uz" ? "⚠️ Juda katta chegirma" : "⚠️ Слишком большая скидка")
              : (lang==="uz" ? `✓ ${pct}% chegirma so'rayapsiz` : `✓ Просите скидку ${pct}%`)}
          </span>
          <span style={{ fontWeight:700, fontSize:13, color: pct > 30 ? "#EF4444" : G }}>-{pct}%</span>
        </div>
      )}

      {/* Izoh */}
      <Input dark={dark}
        label={lang==="uz" ? "Izoh (ixtiyoriy)" : "Примечание (необязательно)"}
        value={note} onChange={e => setNote(e.target.value)}
        placeholder={lang==="uz"
          ? "Masalan: Naqd pul, bugun olaman..."
          : "Напр: Наличные, заберу сегодня..."} />

      <div style={{ display:"flex", gap:10 }}>
        <Btn dark={dark} variant="ghost" onClick={onClose} style={{ flex:1 }}>
          {tx.cancel}
        </Btn>
        <Btn dark={dark} onClick={handleSend} disabled={!offerPrice} style={{ flex:2, background:G }}>
          🤝 {lang==="uz" ? "Taklif yuborish" : "Отправить предложение"}
        </Btn>
      </div>
    </ModalSheet>
  );
}

// ── Sotuvchi — Taklifga javob berish ─────────────────
export function OfferResponseModal({ offer, lang, dark, onClose, onRespond }) {
  const th = theme(dark);
  const tx = T[lang];
  const [counterPrice, setCounterPrice] = useState("");
  const [view, setView] = useState("main"); // main | counter

  const discount = offer.originalPrice
    ? Math.round((1 - offer.offerPrice / offer.originalPrice) * 100)
    : 0;

  if (view === "counter") return (
    <ModalSheet dark={dark} onClose={onClose}
      title={lang==="uz" ? "💬 Qarshi taklif" : "💬 Встречное предложение"}>
      <div style={{ background:th.card2, borderRadius:12, padding:"12px 16px", marginBottom:16 }}>
        <div style={{ fontSize:12, color:th.sub, marginBottom:4 }}>
          {lang==="uz" ? "Xaridor taklifi" : "Предложение покупателя"}
        </div>
        <div style={{ fontWeight:800, color:"#EF4444", fontSize:16 }}>
          {formatPrice(offer.offerPrice)} {tx.sum}
        </div>
      </div>
      <Input dark={dark}
        label={lang==="uz" ? `Sizning narxingiz (${tx.sum})` : `Ваша цена (${tx.sum})`}
        required type="number" value={counterPrice}
        onChange={e => setCounterPrice(e.target.value)}
        placeholder={String(offer.originalPrice)} />
      <div style={{ display:"flex", gap:10 }}>
        <Btn dark={dark} variant="ghost" onClick={() => setView("main")} style={{ flex:1 }}>←</Btn>
        <Btn dark={dark} onClick={() => { onRespond("countered", Number(counterPrice)); onClose(); }}
          disabled={!counterPrice} style={{ flex:2, background:"#F59E0B" }}>
          💬 {lang==="uz" ? "Yuborish" : "Отправить"}
        </Btn>
      </div>
    </ModalSheet>
  );

  return (
    <ModalSheet dark={dark} onClose={onClose}
      title={lang==="uz" ? "📩 Yangi taklif" : "📩 Новое предложение"}>
      <div style={{ textAlign:"center", marginBottom:20 }}>
        <div style={{ fontSize:48, marginBottom:8 }}>🤝</div>
        <div style={{ fontSize:14, color:th.text, marginBottom:4 }}>
          <b>{offer.fromName}</b>{lang==="uz" ? " narx taklif qildi" : " предложил цену"}
        </div>
        <div style={{ fontSize:13, color:th.sub }}>{offer.listingTitle}</div>
      </div>

      <div style={{ display:"flex", gap:10, marginBottom:20 }}>
        <div style={{ flex:1, background:th.card2, borderRadius:12, padding:"14px", textAlign:"center" }}>
          <div style={{ fontSize:11, color:th.sub, marginBottom:4 }}>
            {lang==="uz" ? "Asl narx" : "Исходная"}
          </div>
          <div style={{ fontWeight:800, color:th.text, textDecoration:"line-through" }}>
            {formatPrice(offer.originalPrice)} {tx.sum}
          </div>
        </div>
        <div style={{ fontSize:20, display:"flex", alignItems:"center" }}>→</div>
        <div style={{ flex:1, background:G+"15", borderRadius:12, padding:"14px", textAlign:"center", border:`1px solid ${G}30` }}>
          <div style={{ fontSize:11, color:G, marginBottom:4 }}>
            {lang==="uz" ? "Taklif" : "Предложение"}
          </div>
          <div style={{ fontWeight:800, color:G, fontSize:16 }}>
            {formatPrice(offer.offerPrice)} {tx.sum}
          </div>
        </div>
      </div>

      {discount > 0 && (
        <div style={{ textAlign:"center", marginBottom:16, color:"#EF4444", fontSize:13, fontWeight:600 }}>
          {lang==="uz" ? `${discount}% chegirma so'ramoqda` : `Просит скидку ${discount}%`}
        </div>
      )}

      {offer.note && (
        <div style={{ background:th.card2, borderRadius:10, padding:"10px 14px", marginBottom:16, fontSize:13, color:th.text, fontStyle:"italic" }}>
          💬 "{offer.note}"
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <Btn dark={dark} onClick={() => { onRespond("accepted"); onClose(); }} style={{ background:G }}>
          ✅ {lang==="uz" ? "Qabul qilish" : "Принять"}
        </Btn>
        <Btn dark={dark} onClick={() => setView("counter")} style={{ background:"#F59E0B" }}>
          💬 {lang==="uz" ? "Qarshi taklif" : "Встречное предложение"}
        </Btn>
        <Btn dark={dark} onClick={() => { onRespond("rejected"); onClose(); }} variant="ghost">
          ❌ {lang==="uz" ? "Rad etish" : "Отклонить"}
        </Btn>
      </div>
    </ModalSheet>
  );
}

// ── Mening takliflarim sahifasi ───────────────────────
export function MyOffersPage({ lang, dark, offers, listings, onBack, onRespond }) {
  const th = theme(dark);
  const tx = T[lang];

  const statusInfo = {
    pending:   { color:"#F59E0B", label:{ uz:"Kutilmoqda", ru:"Ожидание" }, icon:"⏳" },
    accepted:  { color:G,         label:{ uz:"Qabul qilindi", ru:"Принято" }, icon:"✅" },
    rejected:  { color:"#EF4444", label:{ uz:"Rad etildi", ru:"Отклонено" }, icon:"❌" },
    countered: { color:"#3B82F6", label:{ uz:"Qarshi taklif", ru:"Встречное" }, icon:"💬" },
  };

  return (
    <div style={{ background:th.bg, minHeight:"100vh", paddingBottom:80 }}>
      <div style={{ background:`linear-gradient(135deg,${G},#15803D)`, padding:"50px 16px 16px" }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:10, width:36, height:36, color:"#fff", fontSize:18, cursor:"pointer", marginBottom:10 }}>←</button>
        <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>
          🤝 {lang==="uz" ? "Narx takliflari" : "Мои предложения"}
        </div>
      </div>
      <div style={{ padding:16 }}>
        {offers.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 0", color:th.sub }}>
            <div style={{ fontSize:52, marginBottom:12 }}>🤝</div>
            <div style={{ fontWeight:700, color:th.text }}>
              {lang==="uz" ? "Takliflar yo'q" : "Предложений нет"}
            </div>
            <div style={{ fontSize:13, marginTop:6 }}>
              {lang==="uz" ? "E'lonlarda narx taklif qiling" : "Предлагайте цену в объявлениях"}
            </div>
          </div>
        ) : offers.map(offer => {
          const st = statusInfo[offer.status] || statusInfo.pending;
          return (
            <div key={offer.id} style={{ background:th.card, borderRadius:14, padding:"14px 16px", marginBottom:10, border:`1px solid ${th.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                <div style={{ fontSize:14, fontWeight:600, color:th.text, flex:1, marginRight:8 }}>{offer.listingTitle}</div>
                <span style={{ background:st.color+"20", color:st.color, borderRadius:8, padding:"3px 8px", fontSize:11, fontWeight:700, flexShrink:0 }}>
                  {st.icon} {st.label[lang]}
                </span>
              </div>
              <div style={{ display:"flex", gap:12 }}>
                <div style={{ flex:1, textAlign:"center" }}>
                  <div style={{ fontSize:10, color:th.sub }}>{lang==="uz"?"Asl":"Исходная"}</div>
                  <div style={{ fontWeight:700, color:th.text, textDecoration:"line-through", fontSize:13 }}>
                    {formatPrice(offer.originalPrice)} {tx.sum}
                  </div>
                </div>
                <div style={{ fontSize:16 }}>→</div>
                <div style={{ flex:1, textAlign:"center" }}>
                  <div style={{ fontSize:10, color:th.sub }}>{lang==="uz"?"Taklif":"Предложение"}</div>
                  <div style={{ fontWeight:800, color:G, fontSize:14 }}>
                    {formatPrice(offer.offerPrice)} {tx.sum}
                  </div>
                </div>
                {offer.counterPrice && (
                  <>
                    <div style={{ fontSize:16 }}>→</div>
                    <div style={{ flex:1, textAlign:"center" }}>
                      <div style={{ fontSize:10, color:th.sub }}>{lang==="uz"?"Qarshi":"Встречное"}</div>
                      <div style={{ fontWeight:800, color:"#F59E0B", fontSize:14 }}>
                        {formatPrice(offer.counterPrice)} {tx.sum}
                      </div>
                    </div>
                  </>
                )}
              </div>
              {offer.status === "countered" && offer.counterPrice && (
                <div style={{ display:"flex", gap:8, marginTop:12 }}>
                  <Btn dark={dark} onClick={() => onRespond(offer.id, "accepted")} style={{ flex:1, background:G, padding:"10px" }}>
                    ✅ {lang==="uz"?"Qabul":"Принять"}
                  </Btn>
                  <Btn dark={dark} onClick={() => onRespond(offer.id, "rejected")} variant="ghost" style={{ flex:1, padding:"10px" }}>
                    ❌ {lang==="uz"?"Rad":"Отказ"}
                  </Btn>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
