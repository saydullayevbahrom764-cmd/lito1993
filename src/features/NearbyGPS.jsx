import { useState, useEffect, useRef } from "react";
import { theme } from "../theme.js";
import { T, CATEGORIES } from "../translations.js";
import { formatPrice, DEMO_LISTINGS } from "../utils.js";

const G = "#16A34A";

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

function formatDist(m, lang) {
  if (m < 1000) return `${m} m`;
  return `${(m/1000).toFixed(1)} km`;
}

const RADIUS_OPTIONS = [500, 1000, 2000, 5000, 10000];

export function useNearbyListings(listings = []) {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [radius, setRadius] = useState(5000);

  const getLocation = () => {
    if (!navigator.geolocation) { setError("GPS mavjud emas"); return; }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      () => {
        setUserLocation({ lat: 41.299, lng: 69.240 }); // Toshkent default
        setLoading(false);
      },
      { timeout: 8000 }
    );
  };

  useEffect(() => { getLocation(); }, []);

  const nearby = userLocation
    ? [...(listings.length ? listings : DEMO_LISTINGS)]
        .filter(l => l.lat && l.lng)
        .map(l => ({
          ...l,
          distance: getDistance(userLocation.lat, userLocation.lng, l.lat, l.lng),
        }))
        .filter(l => l.distance <= radius)
        .sort((a, b) => a.distance - b.distance)
    : [];

  return { userLocation, nearby, loading, error, radius, setRadius, getLocation };
}

export function NearbySection({ lang, dark, listings, onOpen, onToggleFav, favIds }) {
  const th = theme(dark);
  const tx = T[lang];
  const { userLocation, nearby, loading, radius, setRadius, getLocation } = useNearbyListings(listings);

  const radiusLabels = { 500:"500m", 1000:"1km", 2000:"2km", 5000:"5km", 10000:"10km" };

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Header */}
      <div style={{ padding:"0 16px", marginBottom:10 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:th.text }}>
              📍 {lang==="uz" ? "Yaqin atrofda" : "Рядом с вами"}
            </div>
            {userLocation && (
              <div style={{ fontSize:11, color:th.sub }}>
                {lang==="uz"
                  ? `${nearby.length} ta e'lon topildi`
                  : `Найдено ${nearby.length} объявлений`}
              </div>
            )}
          </div>
          <button onClick={getLocation} style={{
            background: G+"15", border:`1px solid ${G}30`,
            borderRadius:10, padding:"6px 12px", fontSize:12,
            fontWeight:700, color:G, cursor:"pointer",
          }}>
            {loading ? "⏳" : "📍 GPS"}
          </button>
        </div>

        {/* Radius chips */}
        <div style={{ display:"flex", gap:6, overflowX:"auto", scrollbarWidth:"none" }}>
          {RADIUS_OPTIONS.map(r => (
            <button key={r} onClick={() => setRadius(r)} style={{
              flexShrink:0, padding:"5px 12px", borderRadius:16,
              border:`1.5px solid ${radius===r ? G : th.border2}`,
              background: radius===r ? G+"15" : th.card2,
              color: radius===r ? G : th.sub,
              fontSize:12, fontWeight:700, cursor:"pointer",
            }}>{radiusLabels[r]}</button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ padding:"20px 16px", textAlign:"center", color:th.sub }}>
          <div style={{ fontSize:24, marginBottom:6 }}>📍</div>
          <div style={{ fontSize:13 }}>
            {lang==="uz" ? "Joylashuvingiz aniqlanmoqda..." : "Определяем местоположение..."}
          </div>
        </div>
      )}

      {!loading && nearby.length === 0 && userLocation && (
        <div style={{ padding:"0 16px" }}>
          {/* Yandex Map — e'lon yo'q holatida ham xarita ko'rsatamiz */}
          <NearbyYandexMap
            lang={lang} dark={dark}
            userLocation={userLocation}
            listings={[]}
            radius={radius}
            onOpen={() => {}}
          />
          <div style={{ textAlign:"center", padding:"14px 0 4px", color:th.sub }}>
            <div style={{ fontSize:13 }}>
              {lang==="uz"
                ? `${radiusLabels[radius]} radiusda e'lonlar yo'q`
                : `Нет объявлений в радиусе ${radiusLabels[radius]}`}
            </div>
            <button
              onClick={() => setRadius(radius < 10000 ? RADIUS_OPTIONS[RADIUS_OPTIONS.indexOf(radius)+1] : radius)}
              style={{ marginTop:8, background:G, color:"#fff", border:"none", borderRadius:10, padding:"8px 16px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
              {lang==="uz" ? "Radiusni oshirish" : "Увеличить радиус"}
            </button>
          </div>
        </div>
      )}

      {/* Nearby listings horizontal scroll */}
      {nearby.length > 0 && (
        <div>
          {/* Yandex Map */}
          <div style={{ padding:"0 16px", marginBottom:10 }}>
            <NearbyYandexMap
              lang={lang} dark={dark}
              userLocation={userLocation}
              listings={nearby}
              radius={radius}
              onOpen={onOpen}
            />
          </div>
          {/* Horizontal cards */}
          <div style={{ display:"flex", gap:10, overflowX:"auto", padding:"4px 16px", scrollbarWidth:"none" }}>
          {nearby.slice(0, 8).map(listing => {
            const cat = CATEGORIES.find(c => c.id === listing.category);
            return (
              <div key={listing.id} onClick={() => onOpen(listing)} style={{
                flexShrink:0, width:160, background:th.card,
                borderRadius:14, overflow:"hidden",
                border:`1px solid ${th.border}`, cursor:"pointer",
              }}>
                <div style={{ height:100, background:th.card2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:34, position:"relative", overflow:"hidden" }}>
                  {listing.photos?.[0]
                    ? <img src={listing.photos[0]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    : <span>{cat?.emoji}</span>}
                  {/* Masofa badge */}
                  <div style={{
                    position:"absolute", bottom:6, left:6,
                    background:"rgba(0,0,0,0.65)", borderRadius:8,
                    padding:"2px 7px", fontSize:10, fontWeight:700, color:"#fff",
                    display:"flex", alignItems:"center", gap:3,
                  }}>
                    📍 {formatDist(listing.distance, lang)}
                  </div>
                  <button onClick={e => { e.stopPropagation(); onToggleFav(listing.id); }} style={{
                    position:"absolute", top:6, right:6, width:26, height:26,
                    borderRadius:8, background:"rgba(0,0,0,0.45)", border:"none",
                    fontSize:13, cursor:"pointer",
                  }}>
                    {favIds.includes(listing.id) ? "❤️" : "🤍"}
                  </button>
                </div>
                <div style={{ padding:"8px 10px" }}>
                  <div style={{ fontSize:12, fontWeight:600, color:th.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:3 }}>
                    {listing.title}
                  </div>
                  <div style={{ fontSize:13, fontWeight:800, color:G }}>
                    {listing.price===0 ? tx.free : listing.price===-1 ? tx.negotiable : `${formatPrice(listing.price)} ${tx.sum}`}
                  </div>
                  <div style={{ fontSize:10, color:th.sub, marginTop:2 }}>
                    {cat?.emoji} {tx[listing.category] || listing.category}
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── GPS Map overlay (Yandex) ──────────────────────────
function NearbyYandexMap({ lang, dark, userLocation, listings, radius, onOpen }) {
  const th = theme(dark);
  const mapRef = useRef(null);
  const mapInstRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    const init = () => {
      if (!window.ymaps || mapInstRef.current) return;
      window.ymaps.ready(() => {
        const center = [userLocation.lat, userLocation.lng];
        const map = new window.ymaps.Map(mapRef.current, {
          center, zoom: 13,
          controls: ["geolocationControl", "zoomControl"],
        });

        // Foydalanuvchi joylashuvi
        map.geoObjects.add(new window.ymaps.Placemark(center, {
          balloonContent: lang === "uz" ? "📍 Siz bu yerdasiz" : "📍 Вы здесь",
        }, {
          preset: "islands#greenCircleDotIconWithCaption",
          iconColor: G,
          iconCaptionMaxWidth: "100",
        }));

        // Radius doira
        map.geoObjects.add(new window.ymaps.Circle([center, radius], {
          hintContent: `${radius < 1000 ? radius + "m" : radius/1000 + "km"} radius`,
        }, {
          fillColor: G + "18",
          strokeColor: G,
          strokeWidth: 2,
          strokeStyle: "dot",
        }));

        // E'lonlar
        listings.forEach(l => {
          if (!l.lat || !l.lng) return;
          const cat = CATEGORIES.find(c => c.id === l.category);
          const pm = new window.ymaps.Placemark([l.lat, l.lng], {
            balloonContentHeader: l.title,
            balloonContentBody: `${formatPrice(l.price)} so'm`,
          }, { preset: "islands#greenDotIcon" });
          pm.events.add("click", () => onOpen(l));
          map.geoObjects.add(pm);
        });

        mapInstRef.current = map;
      });
    };

    if (window.ymaps) {
      init();
    } else {
      const s = document.createElement("script");
      s.src = "https://api-maps.yandex.ru/2.1/?apikey=your-api-key&lang=ru_RU";
      s.onload = init;
      document.head.appendChild(s);
    }
    return () => { mapInstRef.current = null; };
  }, [userLocation, radius, listings.length]);

  return (
    <div ref={mapRef} style={{
      width: "100%", height: 220, borderRadius: 16, overflow: "hidden",
      border: `1px solid ${th.border}`,
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    }} />
  );
}

export function NearbyMapView({ lang, dark, listings, onOpen }) {
  const th = theme(dark);
  const { userLocation, nearby, radius, setRadius } = useNearbyListings(listings);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!window.ymaps || mapInstanceRef.current || !mapRef.current) return;
    window.ymaps.ready(() => {
      const center = userLocation
        ? [userLocation.lat, userLocation.lng]
        : [41.299, 69.240];
      const map = new window.ymaps.Map(mapRef.current, { center, zoom:13, controls:[] });
      // User dot
      map.geoObjects.add(new window.ymaps.Placemark(center, {}, {
        preset:"islands#greenCircleDotIcon", iconColor:G,
      }));
      // Radius circle
      const circle = new window.ymaps.Circle([center, radius], {}, {
        fillColor:G+"20", strokeColor:G, strokeWidth:2, strokeStyle:"dashed",
      });
      map.geoObjects.add(circle);
      nearby.forEach(l => {
        if (!l.lat || !l.lng) return;
        const cat = CATEGORIES.find(c => c.id === l.category);
        const pm = new window.ymaps.Placemark([l.lat, l.lng],
          { balloonContentBody:`<b>${l.title}</b><br/>${formatPrice(l.price)} so'm` },
          { preset:"islands#greenDotIcon" }
        );
        pm.events.add("click", () => onOpen(l));
        map.geoObjects.add(pm);
      });
      mapInstanceRef.current = map;
    });
  }, [userLocation, nearby.length, radius]);

  return (
    <div>
      <div ref={mapRef} style={{ width:"100%", height:240, borderRadius:16, overflow:"hidden", border:`1px solid ${th.border}` }} />
      <div style={{ display:"flex", gap:6, marginTop:8, overflowX:"auto", scrollbarWidth:"none" }}>
        {RADIUS_OPTIONS.map(r => (
          <button key={r} onClick={() => setRadius(r)} style={{
            flexShrink:0, padding:"5px 12px", borderRadius:16,
            border:`1.5px solid ${radius===r ? G : th.border2}`,
            background: radius===r ? G : th.card2,
            color: radius===r ? "#fff" : th.sub,
            fontSize:12, fontWeight:700, cursor:"pointer",
          }}>
            {r < 1000 ? `${r}m` : `${r/1000}km`}
          </button>
        ))}
      </div>
    </div>
  );
}
