import { useState, useEffect } from "react";
import { theme } from "../theme.js";
import { T, CATEGORIES } from "../translations.js";
import { formatPrice, timeAgo, DEMO_LISTINGS } from "../utils.js";
import { Chip } from "../components/UI.jsx";

function ListingCard({ listing, lang, dark, onOpen, onToggleFav, isFav }) {
  const th = theme(dark);
  const tx = T[lang];
  const cat = CATEGORIES.find(c => c.id === listing.category);
  const priceStr = listing.price === 0
    ? tx.free
    : listing.price === -1
      ? tx.negotiable
      : formatPrice(listing.price) + " " + tx.sum;

  return (
    <div onClick={() => onOpen(listing)} style={{
      background:th.card, borderRadius:14, overflow:"hidden",
      boxShadow:th.shadow, border:`1px solid ${th.border}`,
      cursor:"pointer", position:"relative",
    }}>
      {/* Photo */}
      <div style={{
        width:"100%", aspectRatio:"4/3", background:th.card2,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:52, overflow:"hidden", position:"relative",
      }}>
        {listing.photos?.length
          ? <img src={listing.photos[0]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          : <span>{cat?.emoji || "📦"}</span>
        }
        {/* Fav button */}
        <button onClick={e => { e.stopPropagation(); onToggleFav(listing.id); }} style={{
          position:"absolute", top:8, right:8, width:32, height:32,
          borderRadius:10, background:"rgba(0,0,0,0.35)", border:"none",
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer", backdropFilter:"blur(4px)",
        }}>
          <span style={{ fontSize:16, color: isFav ? "#FF6B9D" : "#fff" }}>
            {isFav ? "❤️" : "🤍"}
          </span>
        </button>
        {/* Verified badge */}
        {listing.seller?.verified && (
          <div style={{
            position:"absolute", bottom:8, left:8,
            background:"#1DA1F2", borderRadius:6, padding:"2px 7px",
            fontSize:10, fontWeight:700, color:"#fff",
            display:"flex", alignItems:"center", gap:3,
          }}>✓ {tx.verified}</div>
        )}
      </div>
      {/* Info */}
      <div style={{ padding:"10px 12px 12px" }}>
        <p style={{
          fontSize:14, fontWeight:600, color:th.text, marginBottom:4,
          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
        }}>{listing.title}</p>
        <p style={{ fontSize:16, fontWeight:800, color:"#5B2D8E", marginBottom:6 }}>
          {priceStr}
        </p>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:11, color:th.sub }}>📍 {listing.city}</span>
          <span style={{ fontSize:11, color:th.sub }}>{timeAgo(listing.createdAt, lang)}</span>
        </div>
      </div>
    </div>
  );
}

function BannerSlider({ dark }) {
  const th = theme(dark);
  const banners = [
    { title: "Xavfsiz bitim", sub: "To'lovni kafolatlangan tizim orqali amalga oshiring", emoji: "🔒", color: "#5B2D8E" },
    { title: "MyID tasdiqlov", sub: "Tasdiqlangan sotuvchilar bilan ishlang", emoji: "✅", color: "#27AE60" },
    { title: "Premium e'lon", sub: "E'loningizni yuqoriga ko'taring", emoji: "🚀", color: "#E67E22" },
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(p => (p+1) % banners.length), 4000);
    return () => clearInterval(t);
  }, []);
  const b = banners[active];
  return (
    <div style={{
      margin:"0 16px 16px", borderRadius:16, overflow:"hidden",
      background:`linear-gradient(135deg, ${b.color}EE, ${b.color}AA)`,
      padding:"16px 20px", display:"flex", alignItems:"center",
      justifyContent:"space-between", minHeight:80,
    }}>
      <div>
        <div style={{ color:"#fff", fontWeight:800, fontSize:15, marginBottom:4 }}>{b.title}</div>
        <div style={{ color:"rgba(255,255,255,0.8)", fontSize:12 }}>{b.sub}</div>
        <div style={{ display:"flex", gap:6, marginTop:10 }}>
          {banners.map((_,i) => (
            <div key={i} onClick={() => setActive(i)} style={{
              width: i===active ? 20 : 6, height:6, borderRadius:3,
              background: i===active ? "#fff" : "rgba(255,255,255,0.4)",
              transition:"width 0.3s", cursor:"pointer",
            }} />
          ))}
        </div>
      </div>
      <span style={{ fontSize:44 }}>{b.emoji}</span>
    </div>
  );
}

export default function Home({ lang, dark, onOpenListing, onSearch, favIds, onToggleFav, onCategorySelect }) {
  const th = theme(dark);
  const tx = T[lang];
  const [activeCat, setActiveCat] = useState("all");

  const listings = DEMO_LISTINGS.filter(l =>
    activeCat === "all" ? true : l.category === activeCat
  );

  const handleCat = (id) => {
    setActiveCat(id);
    onCategorySelect?.(id);
  };

  return (
    <div style={{ background:th.bg, minHeight:"100vh", paddingBottom:80 }}>
      {/* Header */}
      <div style={{
        background:"linear-gradient(135deg,#5B2D8E,#3A1A6E)",
        padding:"50px 16px 16px", position:"sticky", top:0, zIndex:50,
      }}>
        {/* Top row */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <div>
            <div style={{ color:"rgba(255,255,255,0.7)", fontSize:12, marginBottom:2 }}>
              📍 Toshkent
            </div>
            <div style={{ color:"#fff", fontSize:20, fontWeight:900, letterSpacing:-0.5 }}>
              🛍️ BirBir
            </div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={() => {}} style={{
              background:"rgba(255,255,255,0.15)", border:"none",
              borderRadius:10, width:36, height:36, color:"#fff",
              fontSize:18, cursor:"pointer", display:"flex",
              alignItems:"center", justifyContent:"center",
            }}>🔔</button>
          </div>
        </div>
        {/* Search bar */}
        <button onClick={onSearch} style={{
          width:"100%", padding:"12px 16px", borderRadius:12,
          background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.2)",
          display:"flex", alignItems:"center", gap:10,
          cursor:"pointer", backdropFilter:"blur(8px)",
        }}>
          <span style={{ fontSize:16 }}>🔍</span>
          <span style={{ color:"rgba(255,255,255,0.6)", fontSize:14 }}>{tx.searchPh}</span>
        </button>
      </div>

      {/* Categories horizontal scroll */}
      <div style={{
        display:"flex", gap:8, overflowX:"auto",
        padding:"12px 16px", scrollbarWidth:"none",
      }}>
        <Chip
          label={`🏷️ ${tx.allCats}`}
          active={activeCat === "all"}
          onClick={() => handleCat("all")}
          dark={dark}
        />
        {CATEGORIES.map(c => (
          <Chip
            key={c.id}
            label={`${c.emoji} ${tx[c.id] || c.id}`}
            active={activeCat === c.id}
            onClick={() => handleCat(c.id)}
            color={c.color}
            dark={dark}
          />
        ))}
      </div>

      {/* Banner */}
      <BannerSlider dark={dark} />

      {/* Category grid (when all selected) */}
      {activeCat === "all" && (
        <div style={{ padding:"0 16px 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <span style={{ fontSize:15, fontWeight:700, color:th.text }}>
              {lang==="uz" ? "Kategoriyalar" : "Категории"}
            </span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:20 }}>
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => handleCat(c.id)} style={{
                background:th.card, borderRadius:14, padding:"14px 8px",
                border:`1px solid ${th.border}`, cursor:"pointer",
                display:"flex", flexDirection:"column", alignItems:"center", gap:5,
              }}>
                <div style={{
                  width:42, height:42, borderRadius:12,
                  background:c.color + "20",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:22,
                }}>{c.emoji}</div>
                <span style={{ fontSize:10, fontWeight:600, color:th.text2, textAlign:"center", lineHeight:1.2 }}>
                  {tx[c.id] || c.id}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Listings grid */}
      <div style={{ padding:"0 16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <span style={{ fontSize:15, fontWeight:700, color:th.text }}>
            {activeCat === "all"
              ? (lang==="uz" ? "Yangi e'lonlar" : "Новые объявления")
              : tx[activeCat] || activeCat
            }
            <span style={{ fontSize:13, color:th.sub, fontWeight:400, marginLeft:6 }}>
              ({listings.length})
            </span>
          </span>
          <button onClick={onSearch} style={{
            background:"none", border:"none", color:"#5B2D8E",
            fontWeight:600, fontSize:13, cursor:"pointer",
          }}>
            {lang==="uz" ? "Filter" : "Фильтр"} ▼
          </button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, paddingBottom:20 }}>
          {listings.map(l => (
            <ListingCard
              key={l.id} listing={l} lang={lang} dark={dark}
              onOpen={onOpenListing}
              isFav={favIds.includes(l.id)}
              onToggleFav={onToggleFav}
            />
          ))}
        </div>
        {listings.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 20px", color:th.sub }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
            <div style={{ fontWeight:700, fontSize:16, color:th.text }}>{tx.noResults}</div>
            <div style={{ fontSize:13, marginTop:6 }}>{tx.noResultsDesc}</div>
          </div>
        )}
      </div>
    </div>
  );
}
