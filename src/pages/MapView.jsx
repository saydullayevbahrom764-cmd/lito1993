import { useState, useEffect, useRef } from "react";
import { theme } from "../theme.js";
import { T, CATEGORIES } from "../translations.js";
import { formatPrice, DEMO_LISTINGS } from "../utils.js";

export default function MapView({ lang, dark, listings, onOpenListing }) {
  const th = theme(dark);
  const tx = T[lang];
  const mapRef = useRef(null);
  const lmap = useRef(null);
  const markersRef = useRef([]);
  const [selected, setSelected] = useState(null);
  const [catFilter, setCatFilter] = useState("all");

  const allListings = listings?.length ? listings : DEMO_LISTINGS;
  const filtered = catFilter === "all" ? allListings : allListings.filter(l => l.category === catFilter);

  useEffect(() => {
    if (!window.L || lmap.current || !mapRef.current) return;
    const L = window.L;
    const map = L.map(mapRef.current, {
      center: [41.299, 69.240], zoom: 12,
      zoomControl: false, attributionControl: false,
    });
    L.tileLayer(
      dark
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      { subdomains: "abcd", maxZoom: 19 }
    ).addTo(map);

    // User location dot
    const userIcon = L.divIcon({
      className: "",
      html: `<div style="width:14px;height:14px;border-radius:7px;background:#5B2D8E;border:3px solid #fff;box-shadow:0 0 0 6px rgba(91,45,142,0.2)"></div>`,
      iconSize: [14, 14], iconAnchor: [7, 7],
    });
    L.marker([41.299, 69.240], { icon: userIcon }).addTo(map);
    map.on("click", () => setSelected(null));
    lmap.current = map;
  }, []);

  // Re-render markers on filter change
  useEffect(() => {
    if (!window.L || !lmap.current) return;
    const L = window.L;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    filtered.forEach(listing => {
      if (!listing.lat || !listing.lng) return;
      const cat = CATEGORIES.find(c => c.id === listing.category);
      const priceLabel = listing.price === 0 ? "FREE"
        : listing.price === -1 ? "~"
        : Math.round(listing.price / 1000000) > 0
          ? Math.round(listing.price / 1000000) + "M"
          : Math.round(listing.price / 1000) + "K";
      const icon = L.divIcon({
        className: "",
        html: `<div style="
          background:${cat?.color || "#5B2D8E"};
          color:#fff;border-radius:20px;
          padding:5px 10px;font-size:11px;font-weight:800;
          border:2px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,0.35);
          white-space:nowrap;cursor:pointer;
          display:flex;align-items:center;gap:4px;
        ">
          <span>${cat?.emoji || "📦"}</span>
          <span>${priceLabel}</span>
        </div>`,
        iconSize: [null, null], iconAnchor: [0, 0],
      });
      const marker = L.marker([listing.lat, listing.lng], { icon }).addTo(lmap.current);
      marker.on("click", e => {
        e.originalEvent.stopPropagation();
        setSelected(listing);
        lmap.current.setView([listing.lat, listing.lng], 15, { animate: true });
      });
      markersRef.current.push(marker);
    });
  }, [catFilter, listings]);

  const selCat = selected ? CATEGORIES.find(c => c.id === selected.category) : null;

  return (
    <div style={{ position: "relative", height: "calc(100vh - 62px)", background: "#111" }}>
      {/* Map */}
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      {/* Top: category filter */}
      <div style={{
        position: "absolute", top: 54, left: 0, right: 0, zIndex: 10,
        padding: "8px 12px 0", display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none",
      }}>
        {[{ id: "all", emoji: "🏷️", label: { uz: "Hammasi", ru: "Все" } }, ...CATEGORIES].map(cat => {
          const active = catFilter === cat.id;
          const label = cat.id === "all" ? cat.label[lang] : (tx[cat.id] || cat.id);
          return (
            <button key={cat.id} onClick={() => setCatFilter(cat.id)} style={{
              flexShrink: 0, display: "flex", alignItems: "center", gap: 5,
              padding: "7px 14px", borderRadius: 22, cursor: "pointer",
              background: active ? "#5B2D8E" : "rgba(20,20,20,0.88)",
              border: active ? "none" : "1px solid rgba(255,255,255,0.15)",
              color: active ? "#fff" : "rgba(255,255,255,0.85)",
              fontWeight: 600, fontSize: 13,
              backdropFilter: "blur(8px)",
              boxShadow: active ? "0 2px 12px rgba(91,45,142,0.5)" : "0 2px 8px rgba(0,0,0,0.4)",
            }}>
              <span style={{ fontSize: 15 }}>{cat.emoji}</span>
              {label}
            </button>
          );
        })}
      </div>

      {/* GPS button */}
      <button onClick={() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(pos => {
            lmap.current?.setView([pos.coords.latitude, pos.coords.longitude], 15);
          });
        }
      }} style={{
        position: "absolute", right: 12, bottom: selected ? 230 : 80, zIndex: 10,
        width: 44, height: 44, borderRadius: 12,
        background: "rgba(20,20,20,0.9)", border: "1px solid rgba(255,255,255,0.15)",
        color: "#fff", fontSize: 20, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(8px)", boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
        transition: "bottom 0.3s",
      }}>📍</button>

      {/* Zoom buttons */}
      <div style={{
        position: "absolute", right: 12, bottom: selected ? 290 : 140, zIndex: 10,
        display: "flex", flexDirection: "column", gap: 6, transition: "bottom 0.3s",
      }}>
        {["+", "−"].map((z, i) => (
          <button key={i} onClick={() => {
            const cur = lmap.current?.getZoom() || 12;
            lmap.current?.setZoom(z === "+" ? cur + 1 : cur - 1);
          }} style={{
            width: 44, height: 44, borderRadius: 12, fontSize: 20, fontWeight: 700,
            background: "rgba(20,20,20,0.9)", border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(8px)", boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
          }}>{z}</button>
        ))}
      </div>

      {/* Bottom sheet */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20,
        background: dark ? "rgba(18,18,18,0.97)" : "rgba(255,255,255,0.97)",
        borderRadius: "20px 20px 0 0",
        backdropFilter: "blur(16px)",
        border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
        transform: selected ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        paddingBottom: 20,
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 6px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)" }} />
        </div>

        {selected && (
          <div style={{ padding: "0 16px 10px" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 14, cursor: "pointer" }}
              onClick={() => onOpenListing(selected)}>
              <div style={{
                width: 64, height: 64, borderRadius: 16, flexShrink: 0,
                background: selCat ? selCat.color + "22" : "#5B2D8E22",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 30, overflow: "hidden",
              }}>
                {selected.photos?.[0]
                  ? <img src={selected.photos[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : selCat?.emoji || "📦"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: dark ? "#fff" : "#1A1A1A", marginBottom: 3 }}>
                  {selected.title}
                </div>
                <div style={{ fontWeight: 900, fontSize: 17, color: "#5B2D8E", marginBottom: 4 }}>
                  {selected.price === 0 ? tx.free
                    : selected.price === -1 ? tx.negotiable
                    : `${formatPrice(selected.price)} ${tx.sum}`}
                </div>
                <div style={{ fontSize: 12, color: dark ? "rgba(255,255,255,0.5)" : "#888" }}>
                  📍 {selected.city}{selected.district ? ", " + selected.district : ""}
                  {" · "}
                  {selCat?.emoji} {tx[selected.category] || selected.category}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => onOpenListing(selected)} style={{
                flex: 2, padding: "13px", borderRadius: 13,
                background: "#5B2D8E", border: "none",
                color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
              }}>
                {lang === "uz" ? "Batafsil →" : "Подробнее →"}
              </button>
              {selected.seller?.phone && (
                <button onClick={() => window.location.href = `tel:${selected.seller.phone}`} style={{
                  flex: 1, padding: "13px", borderRadius: 13,
                  background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                  border: `1px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
                  color: dark ? "#fff" : "#333", fontWeight: 700, fontSize: 13, cursor: "pointer",
                }}>
                  📞
                </button>
              )}
              <button onClick={() => setSelected(null)} style={{
                width: 46, borderRadius: 13,
                background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                color: dark ? "rgba(255,255,255,0.5)" : "#888", fontSize: 18, cursor: "pointer",
              }}>✕</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
