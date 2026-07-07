import { useState, useRef, useEffect } from "react";
import { theme } from "../theme.js";
import { T, CATEGORIES } from "../translations.js";
import { formatPrice, timeAgo } from "../utils.js";
import { ModalSheet, Btn, Stars, Divider, Badge } from "../components/UI.jsx";

export default function ListingDetail({ listing, lang, dark, onBack, onChat, isFav, onToggleFav, currentUser }) {
  const th = theme(dark);
  const tx = T[lang];
  const [imgIdx, setImgIdx] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showSafeDeal, setShowSafeDeal] = useState(false);
  const mapRef = useRef(null);
  const lmap = useRef(null);

  const cat = CATEGORIES.find(c => c.id === listing.category);
  const isOwn = currentUser?.uid === listing.seller?.id;

  const priceStr = listing.price === 0
    ? tx.free
    : listing.price === -1
      ? tx.negotiable
      : formatPrice(listing.price) + (listing.currency === "USD" ? " $" : " " + tx.sum);

  const photos = listing.photos?.length ? listing.photos : [null];

  // Mini Leaflet map
  useEffect(() => {
    if (!listing.lat || !listing.lng || !window.L || lmap.current || !mapRef.current) return;
    const L = window.L;
    const map = L.map(mapRef.current, {
      center:[listing.lat, listing.lng], zoom:14,
      zoomControl:false, attributionControl:false,
      dragging:false, scrollWheelZoom:false,
    });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      { subdomains:"abcd", maxZoom:19 }).addTo(map);
    const icon = L.divIcon({
      className:"",
      html:`<div style="width:20px;height:20px;border-radius:50%;background:#16A34A;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
      iconSize:[20,20], iconAnchor:[10,10],
    });
    L.marker([listing.lat, listing.lng], { icon }).addTo(map);
    lmap.current = map;
  }, [listing.lat, listing.lng]);

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:200, background:th.bg,
      maxWidth:430, margin:"0 auto", overflowY:"auto", paddingBottom:100,
    }}>
      {/* Photo slider */}
      <div style={{ position:"relative", width:"100%", aspectRatio:"4/3", background:"#111", overflow:"hidden" }}>
        {photos[imgIdx]
          ? <img src={photos[imgIdx]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:80 }}>{cat?.emoji || "📦"}</div>
        }
        {/* Top bar */}
        <div style={{
          position:"absolute", top:0, left:0, right:0,
          padding:"46px 14px 14px",
          background:"linear-gradient(to bottom,rgba(0,0,0,0.5),transparent)",
          display:"flex", justifyContent:"space-between",
        }}>
          <button onClick={onBack} style={{
            width:36, height:36, borderRadius:12, background:"rgba(0,0,0,0.4)",
            border:"none", color:"#fff", fontSize:18, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            backdropFilter:"blur(6px)",
          }}>←</button>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => navigator.share?.({ title:listing.title, url:window.location.href })} style={{
              width:36, height:36, borderRadius:12, background:"rgba(0,0,0,0.4)",
              border:"none", color:"#fff", fontSize:16, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>🔗</button>
            <button onClick={() => onToggleFav(listing.id)} style={{
              width:36, height:36, borderRadius:12, background:"rgba(0,0,0,0.4)",
              border:"none", fontSize:18, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              {isFav ? "❤️" : "🤍"}
            </button>
          </div>
        </div>
        {/* Photo count */}
        {photos.length > 1 && (
          <div style={{
            position:"absolute", bottom:10, right:12,
            background:"rgba(0,0,0,0.55)", borderRadius:8,
            padding:"3px 10px", color:"#fff", fontSize:12, fontWeight:600,
          }}>
            {imgIdx+1}/{photos.length}
          </div>
        )}
        {/* Dots nav */}
        {photos.length > 1 && photos.map((_,i) => (
          <button key={i} onClick={() => setImgIdx(i)} style={{
            position:"absolute", top:0, bottom:0,
            left: i===0 ? 0 : "50%", right: i===photos.length-1 ? 0 : "50%",
            background:"transparent", border:"none", cursor:"pointer",
          }} />
        ))}
      </div>

      {/* Content */}
      <div style={{ padding:"16px 16px 0" }}>
        {/* Price & Title */}
        <div style={{ marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
            <h1 style={{ fontSize:20, fontWeight:900, color:th.text, margin:0, flex:1 }}>
              {priceStr}
            </h1>
            {listing.extra?.dealType && (
              <Badge label={tx[listing.extra.dealType] || listing.extra.dealType}
                color="#16A34A" />
            )}
          </div>
          <h2 style={{ fontSize:16, fontWeight:600, color:th.text2, margin:0 }}>{listing.title}</h2>
        </div>

        {/* Meta */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
          <span style={{
            background:th.card2, borderRadius:8, padding:"4px 10px",
            fontSize:12, color:th.text2, display:"flex", alignItems:"center", gap:4,
          }}>
            {cat?.emoji} {tx[listing.category] || listing.category}
          </span>
          {listing.condition && (
            <span style={{
              background:th.card2, borderRadius:8, padding:"4px 10px",
              fontSize:12, color:th.text2,
            }}>{listing.condition}</span>
          )}
          <span style={{ background:th.card2, borderRadius:8, padding:"4px 10px", fontSize:12, color:th.text2 }}>
            📍 {listing.city}{listing.district ? ", " + listing.district : ""}
          </span>
          <span style={{ background:th.card2, borderRadius:8, padding:"4px 10px", fontSize:12, color:th.sub }}>
            👁️ {listing.views} {tx.views} · {timeAgo(listing.createdAt, lang)}
          </span>
        </div>

        <Divider dark={dark} my={12} />

        {/* Extra params (vehicles/RE/jobs) */}
        {listing.extra && Object.keys(listing.extra).length > 0 && (
          <div style={{ marginBottom:16 }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:th.text, marginBottom:10 }}>
              {lang==="uz" ? "Parametrlar" : "Параметры"}
            </h3>
            <div style={{ background:th.card, borderRadius:12, overflow:"hidden", border:`1px solid ${th.border}` }}>
              {Object.entries(listing.extra).map(([k, v], i, arr) => {
                const labels = { brand:tx.brand, model:tx.model, year:tx.year, mileage:tx.mileage,
                  fuel:tx.fuel, transmission:tx.transmission, color:tx.color,
                  roomCount:tx.roomCount, area:tx.area, floor:tx.floor, totalFloors:tx.totalFloors,
                  furnished:tx.furnished, dealType:tx.propertyType,
                  company:tx.company, jobType:tx.jobType, experience:tx.experience };
                const label = labels[k] || k;
                const val = typeof v === "boolean" ? (v ? (lang==="uz" ? "Ha" : "Да") : (lang==="uz" ? "Yo'q" : "Нет")) : v;
                return (
                  <div key={k} style={{
                    display:"flex", justifyContent:"space-between",
                    padding:"11px 14px",
                    borderBottom: i<arr.length-1 ? `1px solid ${th.border}` : "none",
                  }}>
                    <span style={{ fontSize:13, color:th.sub }}>{label}</span>
                    <span style={{ fontSize:13, fontWeight:600, color:th.text }}>{val}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Description */}
        <div style={{ marginBottom:16 }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:th.text, marginBottom:8 }}>
            {tx.description}
          </h3>
          <p style={{ fontSize:14, color:th.text2, lineHeight:1.7, margin:0 }}>
            {listing.description}
          </p>
        </div>

        <Divider dark={dark} my={12} />

        {/* Seller card */}
        <div style={{
          background:th.card, borderRadius:14, padding:"14px 16px",
          border:`1px solid ${th.border}`, marginBottom:16,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
            <div style={{
              width:48, height:48, borderRadius:14, background:"#16A34A20",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:22,
            }}>
              {listing.seller?.name?.[0] || "👤"}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                <span style={{ fontWeight:700, fontSize:15, color:th.text }}>
                  {listing.seller?.name || (lang==="uz" ? "Noma'lum" : "Неизвестно")}
                </span>
                {listing.seller?.verified && (
                  <span style={{
                    background:"#1DA1F220", color:"#1DA1F2",
                    fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:6,
                  }}>✓ {tx.verified}</span>
                )}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <Stars value={Math.round(listing.seller?.rating || 0)} readOnly size={13} />
                <span style={{ fontSize:12, color:th.sub }}>
                  {listing.seller?.rating?.toFixed(1)} ({listing.seller?.reviewCount || 0} {tx.reviews})
                </span>
              </div>
            </div>
            <button style={{
              background:th.card2, border:`1px solid ${th.border}`,
              borderRadius:10, padding:"6px 12px", fontSize:12,
              fontWeight:600, color:th.text, cursor:"pointer",
            }}>
              {lang==="uz" ? "Profil" : "Профиль"} →
            </button>
          </div>
          {/* Safe Deal badge */}
          <div onClick={() => setShowSafeDeal(true)} style={{
            background:"#16A34A12", borderRadius:10, padding:"10px 12px",
            display:"flex", alignItems:"center", gap:10, cursor:"pointer",
            border:"1px solid #16A34A30",
          }}>
            <span style={{ fontSize:20 }}>🔒</span>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:"#16A34A" }}>{tx.safeDeal}</div>
              <div style={{ fontSize:11, color:th.sub }}>{tx.safeDealDesc}</div>
            </div>
          </div>
        </div>

        {/* Map */}
        {listing.lat && listing.lng && (
          <div style={{ marginBottom:16 }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:th.text, marginBottom:8 }}>
              📍 {tx.location}
            </h3>
            <div style={{
              borderRadius:14, overflow:"hidden", height:160,
              border:`1px solid ${th.border}`, position:"relative",
            }}>
              <div ref={mapRef} style={{ width:"100%", height:"100%" }} />
              <button onClick={() => window.open(`https://www.google.com/maps?q=${listing.lat},${listing.lng}`, "_blank")}
                style={{
                  position:"absolute", bottom:10, right:10,
                  background:"rgba(0,0,0,0.7)", border:"none", borderRadius:8,
                  padding:"6px 12px", color:"#fff", fontSize:11,
                  fontWeight:700, cursor:"pointer", backdropFilter:"blur(4px)",
                }}>
                {lang==="uz" ? "Xaritada ko'rish ↗" : "Открыть карту ↗"}
              </button>
            </div>
          </div>
        )}

        {/* Report */}
        <button onClick={() => setShowReport(true)} style={{
          background:"none", border:"none", color:th.sub,
          fontSize:13, cursor:"pointer", padding:0, marginBottom:16,
          textDecoration:"underline",
        }}>
          ⚠️ {tx.report}
        </button>
      </div>

      {/* Sticky bottom CTA */}
      {!isOwn && (
        <div style={{
          position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
          width:"100%", maxWidth:430, background:th.card,
          borderTop:`1px solid ${th.border}`,
          padding:"12px 16px 28px",
          display:"flex", gap:10, alignItems:"center",
        }}>
          <button onClick={() => { setShowPhone(true); }} style={{
            width:48, height:48, borderRadius:12, background:th.card2,
            border:`1.5px solid ${th.border2}`, fontSize:20,
            cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
          }}>📞</button>
          <Btn dark={dark} onClick={() => onChat(listing)} style={{ flex:1 }}>
            💬 {tx.chat}
          </Btn>
          <Btn dark={dark} variant="outline" onClick={() => setShowSafeDeal(true)} style={{ flex:1, padding:"14px 8px" }}>
            🔒 {tx.safeDeal}
          </Btn>
        </div>
      )}

      {/* Phone modal */}
      {showPhone && (
        <ModalSheet dark={dark} onClose={() => setShowPhone(false)}
          title={lang==="uz" ? "📞 Sotuvchi raqami" : "📞 Телефон продавца"}>
          <div style={{
            background:th.card2, borderRadius:12, padding:"16px 20px",
            textAlign:"center", marginBottom:16,
          }}>
            <div style={{ fontSize:12, color:th.sub, marginBottom:6 }}>
              {listing.seller?.name}
            </div>
            <a href={`tel:${listing.seller?.phone}`} style={{
              fontSize:24, fontWeight:900, color:"#16A34A", textDecoration:"none",
            }}>
              {listing.seller?.phone}
            </a>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <Btn dark={dark} variant="ghost" onClick={() => window.open(`https://t.me/+${listing.seller?.phone?.replace(/\D/g,"")}`, "_blank")} style={{ flex:1 }}>
              ✈️ Telegram
            </Btn>
            <Btn dark={dark} onClick={() => window.location.href = `tel:${listing.seller?.phone}`} style={{ flex:1 }}>
              📞 {tx.call}
            </Btn>
          </div>
        </ModalSheet>
      )}

      {/* Safe Deal modal */}
      {showSafeDeal && (
        <ModalSheet dark={dark} onClose={() => setShowSafeDeal(false)} title="🔒 Safe Deal">
          <div style={{ marginBottom:16 }}>
            {[
              { icon:"💰", text: lang==="uz" ? "Xaridor to'lovni tizimga joylaydi" : "Покупатель вносит оплату в систему" },
              { icon:"📦", text: lang==="uz" ? "Sotuvchi tovarni yetkazib beradi" : "Продавец передаёт товар" },
              { icon:"✅", text: lang==="uz" ? "Xaridor tovarni qabul qiladi" : "Покупатель подтверждает получение" },
              { icon:"🎉", text: lang==="uz" ? "Pul sotuvchiga o'tkaziladi" : "Деньги переводятся продавцу" },
            ].map((s,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0",
                borderBottom: i<3 ? `1px solid ${th.border}` : "none" }}>
                <span style={{ fontSize:24, flexShrink:0 }}>{s.icon}</span>
                <span style={{ fontSize:14, color:th.text }}>{s.text}</span>
              </div>
            ))}
          </div>
          <Btn dark={dark} onClick={() => setShowSafeDeal(false)}>
            {lang==="uz" ? "Tushundim" : "Понятно"}
          </Btn>
        </ModalSheet>
      )}

      {/* Report modal */}
      {showReport && (
        <ModalSheet dark={dark} onClose={() => setShowReport(false)}
          title={`⚠️ ${tx.report}`}>
          {[
            lang==="uz" ? "Spam yoki firibgarlik" : "Спам или мошенничество",
            lang==="uz" ? "Noto'g'ri ma'lumot" : "Неверная информация",
            lang==="uz" ? "Taqiqlangan tovar" : "Запрещённый товар",
            lang==="uz" ? "Boshqa sabab" : "Другая причина",
          ].map((r,i) => (
            <button key={i} onClick={() => setShowReport(false)} style={{
              width:"100%", padding:"14px 16px", background:th.card2,
              border:`1px solid ${th.border}`, borderRadius:12,
              marginBottom:8, fontSize:14, color:th.text,
              cursor:"pointer", textAlign:"left",
            }}>{r}</button>
          ))}
          <Btn dark={dark} variant="ghost" onClick={() => setShowReport(false)} style={{ marginTop:4 }}>
            {tx.cancel}
          </Btn>
        </ModalSheet>
      )}
    </div>
  );
}
