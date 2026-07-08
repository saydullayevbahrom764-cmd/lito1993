import { useState, useEffect } from "react";
import { theme } from "../theme.js";
import { T, CATEGORIES } from "../translations.js";
import { formatPrice, timeAgo, DEMO_LISTINGS, CONDITIONS, CITIES_UZ } from "../utils.js";
import { ModalSheet, Btn, Chip, Input } from "../components/UI.jsx";

function SearchCard({ listing, lang, dark, onOpen, isFav, onToggleFav }) {
  const th = theme(dark);
  const tx = T[lang];
  const cat = CATEGORIES.find(c => c.id === listing.category);
  const priceStr = listing.price === 0 ? tx.free
    : listing.price === -1 ? tx.negotiable
    : formatPrice(listing.price) + " " + tx.sum;
  return (
    <div onClick={() => onOpen(listing)} style={{
      background:th.card, borderRadius:14, marginBottom:10,
      border:`1px solid ${th.border}`, cursor:"pointer",
      display:"flex", overflow:"hidden",
    }}>
      <div style={{
        width:110, height:110, flexShrink:0, background:th.card2,
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:38,
      }}>
        {listing.photos?.length
          ? <img src={listing.photos[0]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          : <span>{cat?.emoji || "📦"}</span>
        }
      </div>
      <div style={{ flex:1, padding:"10px 12px", minWidth:0 }}>
        <p style={{ fontSize:14, fontWeight:600, color:th.text, marginBottom:4,
          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
          {listing.title}
        </p>
        <p style={{ fontSize:15, fontWeight:800, color:"#16A34A", marginBottom:6 }}>{priceStr}</p>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
          <span style={{ fontSize:11, color:th.sub }}>📍 {listing.city}</span>
          {listing.seller?.verified && (
            <span style={{ fontSize:10, background:"#1DA1F220", color:"#1DA1F2", padding:"1px 6px", borderRadius:6, fontWeight:700 }}>✓</span>
          )}
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:11, color:th.sub }}>{timeAgo(listing.createdAt, lang)}</span>
          <button onClick={e => { e.stopPropagation(); onToggleFav(listing.id); }} style={{
            background:"none", border:"none", fontSize:16, cursor:"pointer",
            color: isFav ? "#FF6B9D" : th.sub,
          }}>
            {isFav ? "❤️" : "🤍"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Search({ lang, dark, onOpenListing, favIds, onToggleFav, initCat }) {
  const th = theme(dark);
  const tx = T[lang];
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(initCat || "all");
  const [sort, setSort] = useState("new");
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState({ minPrice:"", maxPrice:"", condition:"", city:"" });
  const [searchHist, setSearchHist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("osontop_srch") || "[]"); } catch { return []; }
  });

  const handleSearch = (val) => {
    setQ(val);
    if (val.trim().length >= 2) {
      const updated = [val.trim(), ...searchHist.filter(h => h !== val.trim())].slice(0, 8);
      setSearchHist(updated);
      try { localStorage.setItem("osontop_srch", JSON.stringify(updated)); } catch {}
    }
  };

  const results = DEMO_LISTINGS.filter(l => {
    if (cat !== "all" && l.category !== cat) return false;
    if (q && !l.title.toLowerCase().includes(q.toLowerCase()) &&
        !l.description?.toLowerCase().includes(q.toLowerCase())) return false;
    if (filter.minPrice && l.price < Number(filter.minPrice)) return false;
    if (filter.maxPrice && l.price > Number(filter.maxPrice)) return false;
    if (filter.city && l.city !== filter.city) return false;
    return true;
  }).sort((a, b) => {
    if (sort === "priceAsc") return a.price - b.price;
    if (sort === "priceDesc") return b.price - a.price;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div style={{ background:th.bg, minHeight:"100vh", paddingBottom:80 }}>
      {/* Header */}
      <div style={{
        background:"linear-gradient(135deg,#16A34A,#15803D)",
        padding:"50px 16px 14px", position:"sticky", top:0, zIndex:50,
      }}>
        <div style={{ display:"flex", gap:10, marginBottom:10 }}>
          <div style={{
            flex:1, display:"flex", alignItems:"center", gap:8,
            background:"rgba(255,255,255,0.15)", borderRadius:12,
            padding:"10px 14px", border:"1px solid rgba(255,255,255,0.2)",
          }}>
            <span style={{ fontSize:16 }}>🔍</span>
            <input
              autoFocus value={q} onChange={e => handleSearch(e.target.value)}
              placeholder={tx.searchPh}
              style={{ flex:1, background:"none", border:"none", outline:"none",
                color:"#fff", fontSize:15, fontFamily:"inherit" }}
            />
            {q && <span onClick={() => setQ("")} style={{ color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:16 }}>✕</span>}
          </div>
          <button onClick={() => setShowFilter(true)} style={{
            background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.2)",
            borderRadius:12, width:44, color:"#fff", fontSize:18, cursor:"pointer",
          }}>⚙️</button>
        </div>
        {/* Sort chips */}
        <div style={{ display:"flex", gap:6, overflowX:"auto", scrollbarWidth:"none" }}>
          {[["new", tx.sortNew], ["priceAsc", tx.sortPriceAsc], ["priceDesc", tx.sortPriceDesc]].map(([v, l]) => (
            <button key={v} onClick={() => setSort(v)} style={{
              flexShrink:0, padding:"5px 12px", borderRadius:20, fontSize:12,
              fontWeight:600, border:"none", cursor:"pointer",
              background: sort===v ? "#fff" : "rgba(255,255,255,0.15)",
              color: sort===v ? "#16A34A" : "rgba(255,255,255,0.8)",
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Category pills */}
      <div style={{ display:"flex", gap:8, overflowX:"auto", padding:"12px 16px 8px", scrollbarWidth:"none" }}>
        <Chip label={`🏷️ ${tx.allCats}`} active={cat==="all"} onClick={() => setCat("all")} dark={dark} />
        {CATEGORIES.map(c => (
          <Chip key={c.id} label={`${c.emoji} ${tx[c.id]||c.id}`}
            active={cat===c.id} onClick={() => setCat(c.id)} color={c.color} dark={dark} />
        ))}
      </div>

      {/* Search history — shown when input is empty */}
      {!q && searchHist.length > 0 && (
        <div style={{ padding:"0 16px 4px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <span style={{ fontSize:12, fontWeight:700, color:th.sub }}>
              🕐 {lang==="uz"?"So'nggi qidiruvlar":"Недавние поиски"}
            </span>
            <button onClick={() => { setSearchHist([]); localStorage.removeItem("osontop_srch"); }}
              style={{ background:"none", border:"none", color:th.sub, fontSize:11, cursor:"pointer" }}>
              {lang==="uz"?"Tozalash":"Очистить"}
            </button>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
            {searchHist.map((h,i) => (
              <button key={i} onClick={() => handleSearch(h)} style={{
                background:th.card2, border:`1px solid ${th.border}`,
                borderRadius:20, padding:"5px 12px", fontSize:12,
                color:th.text2, cursor:"pointer",
              }}>
                🔍 {h}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div style={{ padding:"0 16px" }}>
        <div style={{ fontSize:13, color:th.sub, marginBottom:12, fontWeight:600 }}>
          {results.length} {lang==="uz" ? "ta natija" : "результатов"}
        </div>
        {results.map(l => (
          <SearchCard key={l.id} listing={l} lang={lang} dark={dark}
            onOpen={onOpenListing} isFav={favIds.includes(l.id)} onToggleFav={onToggleFav} />
        ))}
        {results.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 20px", color:th.sub }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
            <div style={{ fontWeight:700, color:th.text }}>{tx.noResults}</div>
            <div style={{ fontSize:13, marginTop:6 }}>{tx.noResultsDesc}</div>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilter && (
        <ModalSheet dark={dark} onClose={() => setShowFilter(false)} title={`⚙️ ${tx.filter}`}>
          <Input dark={dark} label={tx.minPrice} value={filter.minPrice}
            onChange={e => setFilter(p=>({...p,minPrice:e.target.value}))}
            type="number" placeholder="0" />
          <Input dark={dark} label={tx.maxPrice} value={filter.maxPrice}
            onChange={e => setFilter(p=>({...p,maxPrice:e.target.value}))}
            type="number" placeholder="100 000 000" />
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:13, fontWeight:600, color:th.text2, display:"block", marginBottom:8 }}>
              {tx.condition}
            </label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {CONDITIONS[lang].map(c => (
                <Chip key={c} label={c} active={filter.condition===c}
                  onClick={() => setFilter(p=>({...p, condition:p.condition===c?"":c}))}
                  dark={dark} />
              ))}
            </div>
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:13, fontWeight:600, color:th.text2, display:"block", marginBottom:8 }}>
              {tx.location}
            </label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {CITIES_UZ.slice(0,6).map(c => (
                <Chip key={c} label={c} active={filter.city===c}
                  onClick={() => setFilter(p=>({...p, city:p.city===c?"":c}))}
                  dark={dark} />
              ))}
            </div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <Btn dark={dark} variant="ghost" onClick={() => { setFilter({minPrice:"",maxPrice:"",condition:"",city:""}); setShowFilter(false); }}>
              {tx.reset}
            </Btn>
            <Btn dark={dark} onClick={() => setShowFilter(false)}>{tx.apply}</Btn>
          </div>
        </ModalSheet>
      )}
    </div>
  );
}
