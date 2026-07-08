import { useState, useRef, useEffect } from "react";
import { theme } from "../theme.js";
import { T, CATEGORIES } from "../translations.js";
import { formatPrice, timeAgo, DEMO_LISTINGS } from "../utils.js";
import { ModalSheet, Btn, Stars, Divider, Badge } from "../components/UI.jsx";

const G = "#16A34A";

export default function ListingDetail({
  listing, lang, dark, onBack, onChat, isFav, onToggleFav, currentUser,
  // 13 feature props
  onOffer, onSafeDeal, onBarter, onQR, onDelivery, onBoost,
  similar, onOpenSimilar, boostInfo,
}) {
  const th = theme(dark);
  const tx = T[lang];
  const [imgIdx, setImgIdx]       = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showOwnerActions, setShowOwnerActions] = useState(false);
  const [showMoreDesc, setShowMoreDesc] = useState(false);
  const mapRef = useRef(null);
  const lmap   = useRef(null);

  const cat   = CATEGORIES.find(c => c.id === listing.category);
  const isOwn = currentUser?.uid === listing.seller?.id;

  const priceStr = listing.price === 0
    ? tx.free
    : listing.price === -1
      ? tx.negotiable
      : formatPrice(listing.price) + (listing.currency === "USD" ? " $" : " " + tx.sum);

  const photos = listing.photos?.length ? listing.photos : [null];

  // Boost badge rangi
  const boostColor = boostInfo?.plan === "premium" ? "#8B5CF6"
    : boostInfo?.plan === "super" ? "#F59E0B"
    : boostInfo?.plan === "basic" ? "#3B82F6"
    : null;

  // Yandex mini map
  useEffect(() => {
    if (!listing.lat || !listing.lng || !mapRef.current) return;
    if (lmap.current) return;
    const initMap = () => {
      if (!window.ymaps || !mapRef.current) return;
      window.ymaps.ready(() => {
        const map = new window.ymaps.Map(mapRef.current, {
          center: [listing.lat, listing.lng], zoom: 14,
          controls: [],
        });
        map.behaviors.disable("drag");
        map.behaviors.disable("scrollZoom");
        const pm = new window.ymaps.Placemark(
          [listing.lat, listing.lng], {},
          { preset: "islands#greenDotIcon" }
        );
        map.geoObjects.add(pm);
        lmap.current = map;
      });
    };
    if (window.ymaps) initMap();
    else {
      const s = document.createElement("script");
      s.src = "https://api-maps.yandex.ru/2.1/?apikey=your-api-key&lang=ru_RU";
      s.onload = initMap;
      document.head.appendChild(s);
    }
    return () => { lmap.current = null; };
  }, [listing.lat, listing.lng]);

  const desc = listing.description || "";
  const shortDesc = desc.length > 200 ? desc.slice(0, 200) + "…" : desc;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200, background: th.bg,
      maxWidth: 430, margin: "0 auto", overflowY: "auto", paddingBottom: 110,
    }}>
      {/* ── Photo Slider ── */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", background: "#111", overflow: "hidden" }}>
        {photos[imgIdx]
          ? <img src={photos[imgIdx]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80 }}>
              {cat?.emoji || "📦"}
            </div>
        }

        {/* Top bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          padding: "46px 14px 14px",
          background: "linear-gradient(to bottom,rgba(0,0,0,0.55),transparent)",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        }}>
          <button onClick={onBack} style={{
            width: 36, height: 36, borderRadius: 12, background: "rgba(0,0,0,0.4)",
            border: "none", color: "#fff", fontSize: 18, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>←</button>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => onQR?.()}
              style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(0,0,0,0.4)", border: "none", color: "#fff", fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              📱
            </button>
            <button onClick={() => navigator.share?.({ title: listing.title, url: window.location.href })}
              style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(0,0,0,0.4)", border: "none", color: "#fff", fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              🔗
            </button>
            <button onClick={() => onToggleFav(listing.id)}
              style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(0,0,0,0.4)", border: "none", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {isFav ? "❤️" : "🤍"}
            </button>
          </div>
        </div>

        {/* Boost badge */}
        {boostColor && (
          <div style={{
            position: "absolute", top: 54, left: 12,
            background: boostColor, borderRadius: 8, padding: "3px 10px",
            fontSize: 11, fontWeight: 800, color: "#fff",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            {boostInfo?.plan === "premium" ? "👑" : boostInfo?.plan === "super" ? "🚀" : "⚡"}
            {boostInfo?.plan?.toUpperCase()}
          </div>
        )}

        {/* Verified */}
        {listing.seller?.verified && (
          <div style={{ position: "absolute", bottom: 10, left: 12, background: "#1DA1F2", borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700, color: "#fff" }}>
            ✓ {tx.verified}
          </div>
        )}

        {/* Photo count */}
        {photos.length > 1 && (
          <div style={{ position: "absolute", bottom: 10, right: 12, background: "rgba(0,0,0,0.55)", borderRadius: 8, padding: "3px 10px", color: "#fff", fontSize: 12, fontWeight: 600 }}>
            {imgIdx + 1}/{photos.length}
          </div>
        )}

        {/* Tap to change photo */}
        {photos.length > 1 && photos.map((_, i) => (
          <button key={i} onClick={() => setImgIdx(i)} style={{
            position: "absolute", top: 0, bottom: 0,
            left: i === 0 ? 0 : "50%", right: i === photos.length - 1 ? 0 : "50%",
            background: "transparent", border: "none", cursor: "pointer",
          }} />
        ))}

        {/* Dot indicators */}
        {photos.length > 1 && (
          <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5 }}>
            {photos.map((_, i) => (
              <div key={i} style={{ width: i === imgIdx ? 16 : 6, height: 6, borderRadius: 3, background: i === imgIdx ? "#fff" : "rgba(255,255,255,0.45)", transition: "width 0.2s" }} />
            ))}
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div style={{ padding: "16px 16px 0" }}>

        {/* Price + Title */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: G, margin: 0, flex: 1 }}>
              {priceStr}
            </h1>
            {listing.extra?.dealType && (
              <Badge label={tx[listing.extra.dealType] || listing.extra.dealType} color={G} />
            )}
          </div>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: th.text, margin: 0 }}>{listing.title}</h2>
        </div>

        {/* Meta chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          <span style={{ background: th.card2, borderRadius: 8, padding: "4px 10px", fontSize: 12, color: th.text2 }}>
            {cat?.emoji} {tx[listing.category] || listing.category}
          </span>
          {listing.condition && (
            <span style={{ background: th.card2, borderRadius: 8, padding: "4px 10px", fontSize: 12, color: th.text2 }}>
              {listing.condition}
            </span>
          )}
          <span style={{ background: th.card2, borderRadius: 8, padding: "4px 10px", fontSize: 12, color: th.text2 }}>
            📍 {listing.city}{listing.district ? ", " + listing.district : ""}
          </span>
          <span style={{ background: th.card2, borderRadius: 8, padding: "4px 10px", fontSize: 12, color: th.sub }}>
            👁️ {listing.views || 0} · {timeAgo(listing.createdAt, lang)}
          </span>
        </div>

        <Divider dark={dark} my={10} />

        {/* ── Feature action buttons row ── */}
        {!isOwn && (
          <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", scrollbarWidth: "none" }}>
            {[
              { icon: "💰", label: lang === "uz" ? "Narx taklif" : "Торг", action: onOffer,    color: G,        show: listing.price > 0 },
              { icon: "🔒", label: lang === "uz" ? "Xavfsiz" : "Сделка", action: onSafeDeal, color: "#3B82F6", show: true },
              { icon: "🔄", label: lang === "uz" ? "Almashtir" : "Обмен", action: onBarter,   color: "#F59E0B", show: true },
              { icon: "🚚", label: lang === "uz" ? "Yetkazish" : "Доставка", action: onDelivery, color: "#10B981", show: true },
            ].filter(b => b.show).map((btn, i) => (
              <button key={i} onClick={btn.action} style={{
                flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                padding: "8px 14px", borderRadius: 12,
                background: btn.color + "15", border: `1.5px solid ${btn.color}35`,
                cursor: "pointer", minWidth: 70,
              }}>
                <span style={{ fontSize: 18 }}>{btn.icon}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: btn.color }}>{btn.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Seller Boost button (own listing) */}
        {isOwn && (
          <div style={{ marginBottom: 14 }}>
            <button onClick={onBoost} style={{
              width: "100%", padding: "12px 16px", borderRadius: 14,
              background: "linear-gradient(135deg,#F59E0B,#D97706)",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 10,
              boxShadow: "0 3px 12px rgba(245,158,11,0.35)",
            }}>
              <span style={{ fontSize: 20 }}>🚀</span>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>
                  {lang === "uz" ? "E'lonni yuqoriga ko'taring" : "Поднять объявление в ТОП"}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
                  {lang === "uz" ? "5,000 so'mdan boshlab" : "От 5,000 сум"}
                </div>
              </div>
              <span style={{ fontSize: 14, color: "#fff", fontWeight: 700 }}>→</span>
            </button>
          </div>
        )}

        <Divider dark={dark} my={10} />

        {/* Extra params */}
        {listing.extra && Object.keys(listing.extra).length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: th.text, marginBottom: 10 }}>
              {lang === "uz" ? "Parametrlar" : "Параметры"}
            </h3>
            <div style={{ background: th.card, borderRadius: 12, overflow: "hidden", border: `1px solid ${th.border}` }}>
              {Object.entries(listing.extra).map(([k, v], i, arr) => {
                const labels = {
                  brand: tx.brand, model: tx.model, year: tx.year, mileage: tx.mileage,
                  fuel: tx.fuel, transmission: tx.transmission, color: tx.color,
                  roomCount: tx.roomCount, area: tx.area, floor: tx.floor,
                  totalFloors: tx.totalFloors, furnished: tx.furnished,
                  dealType: tx.propertyType, company: tx.company,
                  jobType: tx.jobType, experience: tx.experience,
                };
                const label = labels[k] || k;
                const val = typeof v === "boolean"
                  ? (v ? (lang === "uz" ? "Ha" : "Да") : (lang === "uz" ? "Yo'q" : "Нет"))
                  : v;
                return (
                  <div key={k} style={{
                    display: "flex", justifyContent: "space-between", padding: "11px 14px",
                    borderBottom: i < arr.length - 1 ? `1px solid ${th.border}` : "none",
                  }}>
                    <span style={{ fontSize: 13, color: th.sub }}>{label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: th.text }}>{val}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Description */}
        {desc && (
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: th.text, marginBottom: 8 }}>
              {tx.description}
            </h3>
            <p style={{ fontSize: 14, color: th.text2, lineHeight: 1.7, margin: 0 }}>
              {showMoreDesc ? desc : shortDesc}
            </p>
            {desc.length > 200 && (
              <button onClick={() => setShowMoreDesc(p => !p)} style={{
                background: "none", border: "none", color: G,
                fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "4px 0",
              }}>
                {showMoreDesc
                  ? (lang === "uz" ? "Kamroq ko'rsatish ▲" : "Свернуть ▲")
                  : (lang === "uz" ? "Ko'proq ko'rsatish ▼" : "Показать больше ▼")}
              </button>
            )}
          </div>
        )}

        <Divider dark={dark} my={10} />

        {/* Seller card */}
        <div style={{ background: th.card, borderRadius: 14, padding: "14px 16px", border: `1px solid ${th.border}`, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: G + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
              {listing.seller?.name?.[0] || "👤"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: th.text }}>
                  {listing.seller?.name || (lang === "uz" ? "Noma'lum" : "Неизвестно")}
                </span>
                {listing.seller?.verified && (
                  <span style={{ background: "#1DA1F220", color: "#1DA1F2", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 6 }}>
                    ✓ {tx.verified}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Stars value={Math.round(listing.seller?.rating || 0)} readOnly size={13} />
                <span style={{ fontSize: 12, color: th.sub }}>
                  {(listing.seller?.rating || 0).toFixed(1)} ({listing.seller?.reviewCount || 0} {tx.reviews})
                </span>
              </div>
            </div>
          </div>

          {/* Safe Deal promo */}
          <div onClick={onSafeDeal} style={{
            background: G + "12", borderRadius: 10, padding: "10px 12px",
            display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
            border: "1px solid " + G + "30",
          }}>
            <span style={{ fontSize: 20 }}>🔒</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: G }}>{tx.safeDeal}</div>
              <div style={{ fontSize: 11, color: th.sub }}>{tx.safeDealDesc}</div>
            </div>
            <span style={{ marginLeft: "auto", fontSize: 12, color: G, fontWeight: 700 }}>→</span>
          </div>
        </div>

        {/* Map */}
        {listing.lat && listing.lng && (
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: th.text, marginBottom: 8 }}>
              📍 {tx.location}
            </h3>
            <div style={{ borderRadius: 14, overflow: "hidden", height: 160, border: `1px solid ${th.border}`, position: "relative" }}>
              <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
              <button onClick={() => window.open(`https://yandex.uz/maps/?pt=${listing.lng},${listing.lat}&z=15`, "_blank")} style={{
                position: "absolute", bottom: 10, right: 10,
                background: "rgba(0,0,0,0.7)", border: "none", borderRadius: 8,
                padding: "6px 12px", color: "#fff", fontSize: 11, fontWeight: 700,
                cursor: "pointer", backdropFilter: "blur(4px)",
              }}>
                {lang === "uz" ? "Xaritada ↗" : "На карте ↗"}
              </button>
            </div>
          </div>
        )}

        {/* Similar listings */}
        {similar && similar.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: th.text, marginBottom: 10 }}>
              🔍 {lang === "uz" ? "O'xshash e'lonlar" : "Похожие объявления"}
            </h3>
            <div style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none" }}>
              {similar.slice(0, 6).map(item => {
                const sc = CATEGORIES.find(c => c.id === item.category);
                return (
                  <div key={item.id} onClick={() => onOpenSimilar?.(item)} style={{
                    flexShrink: 0, width: 130, background: th.card,
                    borderRadius: 12, overflow: "hidden",
                    border: `1px solid ${th.border}`, cursor: "pointer",
                  }}>
                    <div style={{ height: 80, background: th.card2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, overflow: "hidden" }}>
                      {item.photos?.[0]
                        ? <img src={item.photos[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : sc?.emoji || "📦"}
                    </div>
                    <div style={{ padding: "7px 8px" }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: th.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: G, marginTop: 2 }}>
                        {item.price === 0 ? tx.free
                          : item.price === -1 ? tx.negotiable
                          : formatPrice(item.price) + " " + tx.sum}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Report */}
        <button onClick={() => setShowReport(true)} style={{
          background: "none", border: "none", color: th.sub,
          fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 20,
          textDecoration: "underline",
        }}>
          ⚠️ {tx.report}
        </button>
      </div>

      {/* ── Sticky Bottom CTA ── */}
      {!isOwn && (
        <div style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 430, background: th.card,
          borderTop: `1px solid ${th.border}`, padding: "12px 16px 28px",
          display: "flex", gap: 10, alignItems: "center",
        }}>
          <button onClick={() => setShowPhone(true)} style={{
            width: 48, height: 48, borderRadius: 12, background: th.card2,
            border: `1.5px solid ${th.border}`, fontSize: 20, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>📞</button>
          <Btn dark={dark} onClick={() => onChat?.(listing)} style={{ flex: 1 }}>
            💬 {tx.chat}
          </Btn>
          <Btn dark={dark} onClick={() => onSafeDeal?.()} variant="outline"
            style={{ flex: 1, padding: "14px 8px", color: G, border: `1.5px solid ${G}` }}>
            🔒 {lang === "uz" ? "Xavfsiz" : "Сделка"}
          </Btn>
        </div>
      )}

      {/* Own listing actions */}
      {isOwn && (
        <div style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 430, background: th.card,
          borderTop: `1px solid ${th.border}`, padding: "12px 16px 28px",
          display: "flex", gap: 10,
        }}>
          <Btn dark={dark} onClick={onBoost} style={{ flex: 2, background: "#F59E0B" }}>
            🚀 {lang === "uz" ? "Boost qilish" : "Поднять в ТОП"}
          </Btn>
          <Btn dark={dark} variant="ghost" onClick={onBack} style={{ flex: 1 }}>
            ← {lang === "uz" ? "Orqaga" : "Назад"}
          </Btn>
        </div>
      )}

      {/* Phone modal */}
      {showPhone && (
        <ModalSheet dark={dark} onClose={() => setShowPhone(false)}
          title={lang === "uz" ? "📞 Sotuvchi raqami" : "📞 Телефон продавца"}>
          <div style={{ background: th.card2, borderRadius: 12, padding: "16px 20px", textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: th.sub, marginBottom: 6 }}>{listing.seller?.name}</div>
            <a href={`tel:${listing.seller?.phone}`} style={{ fontSize: 24, fontWeight: 900, color: G, textDecoration: "none" }}>
              {listing.seller?.phone || "+998 90 000 00 00"}
            </a>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn dark={dark} variant="ghost" onClick={() => window.open(`https://t.me/+${listing.seller?.phone?.replace(/\D/g, "")}`, "_blank")} style={{ flex: 1 }}>
              ✈️ Telegram
            </Btn>
            <Btn dark={dark} onClick={() => window.location.href = `tel:${listing.seller?.phone}`} style={{ flex: 1 }}>
              📞 {tx.call}
            </Btn>
          </div>
        </ModalSheet>
      )}

      {/* Report modal */}
      {showReport && (
        <ModalSheet dark={dark} onClose={() => setShowReport(false)}
          title={`⚠️ ${tx.report}`}>
          {[
            lang === "uz" ? "Spam yoki firibgarlik" : "Спам или мошенничество",
            lang === "uz" ? "Noto'g'ri ma'lumot" : "Неверная информация",
            lang === "uz" ? "Taqiqlangan tovar" : "Запрещённый товар",
            lang === "uz" ? "Boshqa sabab" : "Другая причина",
          ].map((r, i) => (
            <button key={i} onClick={() => setShowReport(false)} style={{
              width: "100%", padding: "14px 16px", background: th.card2,
              border: `1px solid ${th.border}`, borderRadius: 12, marginBottom: 8,
              fontSize: 14, color: th.text, cursor: "pointer", textAlign: "left",
            }}>{r}</button>
          ))}
          <Btn dark={dark} variant="ghost" onClick={() => setShowReport(false)} style={{ marginTop: 4 }}>
            {tx.cancel}
          </Btn>
        </ModalSheet>
      )}
    </div>
  );
}
