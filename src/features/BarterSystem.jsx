import { useState } from "react";
import { theme } from "../theme.js";
import { T, CATEGORIES } from "../translations.js";
import { formatPrice, DEMO_LISTINGS, genId } from "../utils.js";
import { ModalSheet, Btn } from "../components/UI.jsx";

const G = "#16A34A";

export function BarterModal({ listing, lang, dark, currentUser, myListings, onClose, onSend }) {
  const th = theme(dark);
  const tx = T[lang];
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!selected) return;
    onSend({
      id: genId(),
      fromId: currentUser?.uid || "me",
      fromName: currentUser?.name || "Men",
      targetListingId: listing.id,
      targetTitle: listing.title,
      targetPrice: listing.price,
      offeredListingId: selected.id,
      offeredTitle: selected.title,
      offeredPrice: selected.price,
      note,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    setSent(true);
  };

  if (sent) return (
    <ModalSheet dark={dark} onClose={onClose}
      title={lang==="uz" ? "✅ Almashtirish taklifi yuborildi!" : "✅ Предложение обмена отправлено!"}>
      <div style={{ textAlign:"center", padding:"16px 0 20px" }}>
        <div style={{ fontSize:56, marginBottom:12 }}>🔄</div>
        <p style={{ fontSize:14, color:th.text, lineHeight:1.7 }}>
          {lang==="uz"
            ? `"${listing.title}" uchun "${selected.title}" almashtirish taklifi yuborildi`
            : `Предложение обменять "${selected.title}" на "${listing.title}" отправлено`}
        </p>
        <div style={{ display:"flex", gap:10, marginTop:16 }}>
          <div style={{ flex:1, background:th.card2, borderRadius:12, padding:"12px 8px", textAlign:"center", border:`1px solid ${th.border}` }}>
            <div style={{ fontSize:11, color:th.sub, marginBottom:4 }}>{lang==="uz"?"Siz berasiz":"Вы даёте"}</div>
            <div style={{ fontSize:13, fontWeight:700, color:th.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{selected.title}</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", fontSize:20 }}>🔄</div>
          <div style={{ flex:1, background:G+"12", borderRadius:12, padding:"12px 8px", textAlign:"center", border:`1px solid ${G}25` }}>
            <div style={{ fontSize:11, color:G, marginBottom:4 }}>{lang==="uz"?"Siz olasiz":"Вы получаете"}</div>
            <div style={{ fontSize:13, fontWeight:700, color:th.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{listing.title}</div>
          </div>
        </div>
      </div>
      <Btn dark={dark} onClick={onClose} style={{ background:G }}>{lang==="uz"?"Yopish":"Закрыть"}</Btn>
    </ModalSheet>
  );

  return (
    <ModalSheet dark={dark} onClose={onClose}
      title={`🔄 ${lang==="uz" ? "Almashtirish taklifi" : "Предложить обмен"}`}>
      {/* Target listing */}
      <div style={{ background:G+"12", borderRadius:14, padding:"12px 14px", marginBottom:16, border:`1px solid ${G}25` }}>
        <div style={{ fontSize:11, color:G, fontWeight:700, marginBottom:4 }}>
          {lang==="uz" ? "Siz xohlagan narsa" : "Что вы хотите"}
        </div>
        <div style={{ fontSize:14, fontWeight:700, color:th.text }}>{listing.title}</div>
        {listing.price > 0 && (
          <div style={{ fontSize:13, color:G, fontWeight:600 }}>{formatPrice(listing.price)} {tx.sum}</div>
        )}
      </div>

      <div style={{ fontSize:13, fontWeight:700, color:th.text, marginBottom:10 }}>
        {lang==="uz" ? "Buning evaziga nimani berasiz?" : "Что предложите взамен?"}
      </div>

      {/* My listings to offer */}
      {myListings?.length > 0 ? (
        <div style={{ maxHeight:280, overflowY:"auto", marginBottom:12 }}>
          {myListings.map(l => {
            const cat = CATEGORIES.find(c => c.id === l.category);
            const isSelected = selected?.id === l.id;
            return (
              <div key={l.id} onClick={() => setSelected(isSelected ? null : l)} style={{
                display:"flex", gap:10, padding:"10px 12px", marginBottom:8,
                background: isSelected ? G+"15" : th.card2,
                border:`2px solid ${isSelected ? G : th.border}`,
                borderRadius:12, cursor:"pointer", alignItems:"center",
              }}>
                <div style={{ width:48, height:48, borderRadius:10, background:th.card3, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0, overflow:"hidden" }}>
                  {l.photos?.[0] ? <img src={l.photos[0]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : cat?.emoji || "📦"}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:th.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.title}</div>
                  <div style={{ fontSize:12, color:G, fontWeight:700 }}>
                    {l.price===0 ? tx.free : l.price===-1 ? tx.negotiable : `${formatPrice(l.price)} ${tx.sum}`}
                  </div>
                </div>
                {isSelected && <span style={{ color:G, fontSize:18, flexShrink:0 }}>✓</span>}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ background:th.card2, borderRadius:12, padding:"20px", textAlign:"center", marginBottom:12, border:`1px dashed ${th.border2}` }}>
          <div style={{ fontSize:36, marginBottom:8 }}>📦</div>
          <div style={{ fontSize:13, color:th.sub }}>
            {lang==="uz" ? "Sizda almashtirish uchun e'lonlar yo'q" : "У вас нет объявлений для обмена"}
          </div>
        </div>
      )}

      {/* Note */}
      <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
        placeholder={lang==="uz" ? "Izoh (ixtiyoriy)..." : "Примечание (необязательно)..."}
        style={{ width:"100%", padding:"10px 14px", borderRadius:12, border:`1.5px solid ${th.border2}`, background:th.card, fontSize:13, outline:"none", resize:"none", color:th.text, fontFamily:"inherit", boxSizing:"border-box", marginBottom:14 }} />

      {/* Preview comparison */}
      {selected && (
        <div style={{ display:"flex", gap:8, alignItems:"center", background:th.card2, borderRadius:12, padding:"10px 12px", marginBottom:14 }}>
          <div style={{ flex:1, textAlign:"center" }}>
            <div style={{ fontSize:10, color:th.sub, marginBottom:3 }}>{lang==="uz"?"Siz berasiz":"Вы даёте"}</div>
            <div style={{ fontSize:12, fontWeight:700, color:th.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{selected.title}</div>
            {selected.price > 0 && <div style={{ fontSize:11, color:G }}>{formatPrice(selected.price)} {tx.sum}</div>}
          </div>
          <div style={{ fontSize:20 }}>🔄</div>
          <div style={{ flex:1, textAlign:"center" }}>
            <div style={{ fontSize:10, color:th.sub, marginBottom:3 }}>{lang==="uz"?"Siz olasiz":"Вы получаете"}</div>
            <div style={{ fontSize:12, fontWeight:700, color:th.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{listing.title}</div>
            {listing.price > 0 && <div style={{ fontSize:11, color:G }}>{formatPrice(listing.price)} {tx.sum}</div>}
          </div>
        </div>
      )}

      <div style={{ display:"flex", gap:10 }}>
        <Btn dark={dark} variant="ghost" onClick={onClose} style={{ flex:1 }}>{tx.cancel}</Btn>
        <Btn dark={dark} onClick={handleSend} disabled={!selected} style={{ flex:2, background:G }}>
          🔄 {lang==="uz" ? "Taklif yuborish" : "Отправить предложение"}
        </Btn>
      </div>
    </ModalSheet>
  );
}

export function BarterBadge({ lang, dark }) {
  const th = theme(dark);
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:4, background:"#F59E0B15", borderRadius:8, padding:"3px 8px", border:"1px solid #F59E0B30" }}>
      <span style={{ fontSize:12 }}>🔄</span>
      <span style={{ fontSize:11, fontWeight:700, color:"#F59E0B" }}>
        {lang==="uz" ? "Almashtiraman" : "Обменяю"}
      </span>
    </div>
  );
}
