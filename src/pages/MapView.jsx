import { useState, useEffect, useRef } from "react";
import { theme } from "../theme.js";
import { T, CATEGORIES } from "../translations.js";
import { formatPrice, DEMO_LISTINGS } from "../utils.js";

const G = "#16A34A";

// Yandex Maps API yuklash
function loadYandexMaps() {
  return new Promise((resolve) => {
    if (window.ymaps) { window.ymaps.ready(resolve); return; }
    const script = document.createElement("script");
    script.src = "https://api-maps.yandex.ru/2.1/?apikey=your-api-key&lang=ru_RU";
    script.onload = () => window.ymaps.ready(resolve);
    script.onerror = () => resolve(); // fallback
    document.head.appendChild(script);
  });
}

export default function MapView({ lang, dark, listings, onOpenListing }) {
  const th = theme(dark);
  const tx = T[lang];
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const clustererRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [catFilter, setCatFilter] = useState("all");
  const [mapReady, setMapReady] = useState(false);

  const allListings = [...(listings || []), ...DEMO_LISTINGS].filter(l => l.lat && l.lng);
  const filtered = catFilter === "all" ? allListings : allListings.filter(l => l.category === catFilter);
  const selCat = selected ? CATEGORIES.find(c => c.id === selected.category) : null;

  // Xaritani boshlash
  useEffect(() => {
    loadYandexMaps().then(() => {
      if (!window.ymaps || mapRef.current || !containerRef.current) { setMapReady(true); return; }

      const map = new window.ymaps.Map(containerRef.current, {
        center: [41.299, 69.240],
        zoom: 12,
        controls: ["geolocationControl"],
        theme: dark ? "dark" : "light",
      });

      // Foydalanuvchi nuqtasi
      const userPlacemark = new window.ymaps.Placemark(
        [41.299, 69.240],
        {},
        {
          preset: "islands#greenCircleDotIcon",
          iconColor: G,
        }
      );
      map.geoObjects.add(userPlacemark);

      // Xarita klik → tanlashni bekor qilish
      map.events.add("click", () => setSelected(null));

      mapRef.current = map;
      setMapReady(true);
    });

    return () => {
      if (mapRef.current) { mapRef.current.destroy(); mapRef.current = null; }
    };
  }, []);

  // Markerlarni yangilash
  useEffect(() => {
    if (!mapReady || !mapRef.current || !window.ymaps) return;

    // Oldingi markerni o'chirish
    if (clustererRef.current) {
      mapRef.current.geoObjects.remove(clustererRef.current);
      clustererRef.current = null;
    }

    const clusterer = new window.ymaps.Clusterer({
      preset: "islands#greenClusterIcons",
      groupByCoordinates: false,
      clusterDisableClickZoom: false,
      clusterHideIconOnBalloonOpen: false,
    });

    const placemarks = filtered.map(listing => {
      const cat = CATEGORIES.find(c => c.id === listing.category);
      const priceLabel = listing.price === 0 ? "FREE"
        : listing.price === -1 ? "~"
        : Math.round(listing.price / 1000000) > 0
          ? Math.round(listing.price / 1000000) + "M"
          : Math.round(listing.price / 1000) + "K";

      const placemark = new window.ymaps.Placemark(
        [listing.lat, listing.lng],
        {
          balloonContentHeader: listing.title,
          balloonContentBody: `
            <div style="padding:8px 0;min-width:200px">
              <div style="font-size:16px;font-weight:800;color:${G};margin-bottom:4px">
                ${listing.price===0?"Bepul":listing.price===-1?"Kelishiladi":`${listing.price?.toLocaleString("ru-RU")} so'm`}
              </div>
              <div style="font-size:12px;color:#666">📍 ${listing.city||""}</div>
            </div>`,
          clusterCaption: listing.title,
        },
        {
          iconLayout: "default#imageWithContent",
          iconImageHref: "",
          iconImageSize: [0, 0],
          iconContentLayout: window.ymaps.templateLayoutFactory.createClass(
            `<div style="
              background:${cat?.color || G};
              color:#fff;
              border-radius:20px;
              padding:5px 10px;
              font-size:11px;
              font-weight:800;
              border:2px solid #fff;
              box-shadow:0 2px 10px rgba(0,0,0,0.35);
              white-space:nowrap;
              cursor:pointer;
              display:flex;
              align-items:center;
              gap:4px;
              transform:translateX(-50%);
            ">
              <span>${cat?.emoji || "📦"}</span>
              <span>${priceLabel}</span>
            </div>`
          ),
        }
      );

      placemark.events.add("click", (e) => {
        e.preventDefault();
        setSelected(listing);
        mapRef.current.setCenter([listing.lat, listing.lng], 15, { checkZoomRange: true });
      });

      return placemark;
    });

    clusterer.add(placemarks);
    mapRef.current.geoObjects.add(clusterer);
    clustererRef.current = clusterer;
  }, [mapReady, catFilter, filtered.length]);

  return (
    <div style={{ position:"relative", height:"calc(100vh - 62px)", background:"#e8f4e8" }}>

      {/* Yandex Map container */}
      <div ref={containerRef} style={{ width:"100%", height:"100%" }} />

      {/* Fallback (agar Yandex Maps yuklanmasa) */}
      {!mapReady && (
        <div style={{
          position:"absolute", inset:0,
          background: dark ? "#1C1C1C" : "#e8f4e8",
          display:"flex", alignItems:"center", justifyContent:"center",
          flexDirection:"column", gap:12,
        }}>
          <div style={{ fontSize:48 }}>🗺️</div>
          <div style={{ fontSize:14, color:th.sub }}>
            {lang==="uz"?"Xarita yuklanmoqda...":"Загрузка карты..."}
          </div>
          <div style={{ width:40, height:40, borderRadius:20, border:`3px solid ${G}`, borderTopColor:"transparent", animation:"spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}

      {/* Category chips overlay */}
      <div style={{
        position:"absolute", top:50, left:0, right:0, zIndex:20,
        padding:"8px 12px 0", display:"flex", gap:6,
        overflowX:"auto", scrollbarWidth:"none",
      }}>
        {[{ id:"all", emoji:"🏷️", label:{ uz:"Hammasi", ru:"Все" } }, ...CATEGORIES].map(cat => {
          const active = catFilter === cat.id;
          const label = cat.id==="all" ? cat.label[lang] : (tx[cat.id]||cat.id);
          return (
            <button key={cat.id} onClick={() => { setCatFilter(cat.id); setSelected(null); }} style={{
              flexShrink:0, display:"flex", alignItems:"center", gap:5,
              padding:"7px 14px", borderRadius:22, cursor:"pointer",
              background: active ? G : dark ? "rgba(20,20,20,0.9)" : "rgba(255,255,255,0.95)",
              border: active ? "none" : dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(0,0,0,0.1)",
              color: active ? "#fff" : dark ? "rgba(255,255,255,0.85)" : "#333",
              fontWeight:600, fontSize:13,
              backdropFilter:"blur(8px)",
              boxShadow: active ? `0 2px 12px ${G}50` : "0 2px 8px rgba(0,0,0,0.15)",
              transition:"all 0.2s",
            }}>
              <span style={{ fontSize:15 }}>{cat.emoji}</span>
              {label}
            </button>
          );
        })}
      </div>

      {/* GPS button */}
      <button onClick={() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(pos => {
            mapRef.current?.setCenter([pos.coords.latitude, pos.coords.longitude], 15);
          });
        }
      }} style={{
        position:"absolute", right:12,
        bottom: selected ? 240 : 90,
        zIndex:20, width:44, height:44, borderRadius:12,
        background: dark ? "rgba(20,20,20,0.92)" : "rgba(255,255,255,0.95)",
        border: dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(0,0,0,0.1)",
        fontSize:20, cursor:"pointer",
        display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow:"0 2px 12px rgba(0,0,0,0.2)",
        transition:"bottom 0.3s",
      }}>📍</button>

      {/* E'lonlar soni badge */}
      <div style={{
        position:"absolute", top:50, right:12, zIndex:20,
        background: dark ? "rgba(20,20,20,0.9)" : "rgba(255,255,255,0.95)",
        borderRadius:10, padding:"5px 10px",
        fontSize:11, fontWeight:700, color:G,
        border:`1px solid ${G}30`,
        backdropFilter:"blur(8px)",
      }}>
        📌 {filtered.length} {lang==="uz"?"ta":"шт."}
      </div>

      {/* Bottom sheet */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, zIndex:30,
        background: dark ? "rgba(20,20,20,0.97)" : "rgba(255,255,255,0.97)",
        borderRadius:"20px 20px 0 0",
        backdropFilter:"blur(20px)",
        border:`1px solid ${dark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.06)"}`,
        transform: selected ? "translateY(0)" : "translateY(100%)",
        transition:"transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        paddingBottom:24,
      }}>
        {/* Handle */}
        <div style={{ display:"flex", justifyContent:"center", padding:"10px 0 6px" }}>
          <div style={{ width:36, height:4, borderRadius:2, background:dark?"rgba(255,255,255,0.2)":"rgba(0,0,0,0.15)" }} />
        </div>

        {selected && (
          <div style={{ padding:"0 16px 10px" }}>
            <div onClick={() => onOpenListing(selected)}
              style={{ display:"flex", gap:14, alignItems:"center", marginBottom:14, cursor:"pointer" }}>
              {/* Rasm */}
              <div style={{
                width:68, height:68, borderRadius:16, flexShrink:0,
                background: selCat ? selCat.color+"22" : G+"22",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:30, overflow:"hidden",
              }}>
                {selected.photos?.[0]
                  ? <img src={selected.photos[0]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  : selCat?.emoji || "📦"}
              </div>
              {/* Ma'lumot */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:800, fontSize:16, color:dark?"#fff":"#1A1A1A", marginBottom:3,
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {selected.title}
                </div>
                <div style={{ fontWeight:900, fontSize:17, color:G, marginBottom:5 }}>
                  {selected.price===0 ? tx.free
                    : selected.price===-1 ? tx.negotiable
                    : `${formatPrice(selected.price)} ${tx.sum}`}
                </div>
                <div style={{ fontSize:12, color:dark?"rgba(255,255,255,0.5)":"#888" }}>
                  📍 {selected.city}{selected.district?", "+selected.district:""}
                  {" · "}
                  {selCat?.emoji} {tx[selected.category]||selected.category}
                </div>
              </div>
            </div>

            {/* CTA tugmalar */}
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => onOpenListing(selected)} style={{
                flex:2, padding:"13px", borderRadius:13,
                background:G, border:"none",
                color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer",
                boxShadow:`0 4px 16px ${G}50`,
              }}>
                {lang==="uz"?"Batafsil →":"Подробнее →"}
              </button>
              {selected.seller?.phone && (
                <button onClick={() => window.location.href=`tel:${selected.seller.phone}`} style={{
                  flex:1, padding:"13px", borderRadius:13,
                  background:dark?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.06)",
                  border:`1px solid ${dark?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.1)"}`,
                  color:dark?"#fff":"#333", fontWeight:700, fontSize:14, cursor:"pointer",
                }}>📞</button>
              )}
              <button onClick={() => setSelected(null)} style={{
                width:46, borderRadius:13,
                background:dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.05)",
                border:`1px solid ${dark?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.08)"}`,
                color:dark?"rgba(255,255,255,0.5)":"#aaa",
                fontSize:18, cursor:"pointer",
              }}>✕</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
