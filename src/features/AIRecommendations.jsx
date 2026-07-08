import { useState, useEffect } from "react";
import { theme } from "../theme.js";
import { T, CATEGORIES } from "../translations.js";
import { formatPrice, timeAgo, DEMO_LISTINGS } from "../utils.js";

const G = "#16A34A";

// ── AI Tavsiya Engine (local ML simulation) ──────────
export function useAIRecommendations(viewHistory = [], searchHistory = [], favIds = []) {
  const [recommendations, setRecommendations] = useState([]);
  const [forYou, setForYou] = useState([]);
  const [trending, setTrending] = useState([]);
  const [similar, setSimilar] = useState({});

  useEffect(() => {
    // Kategoriya chastotasini hisoblash
    const catCount = {};
    viewHistory.forEach(id => {
      const l = DEMO_LISTINGS.find(x => x.id === id);
      if (l) catCount[l.category] = (catCount[l.category] || 0) + 3;
    });
    favIds.forEach(id => {
      const l = DEMO_LISTINGS.find(x => x.id === id);
      if (l) catCount[l.category] = (catCount[l.category] || 0) + 5;
    });
    searchHistory.forEach(q => {
      CATEGORIES.forEach(c => {
        if (q.toLowerCase().includes(c.id)) catCount[c.id] = (catCount[c.id] || 0) + 2;
      });
    });

    // Tavsiya skori hisoblash
    const scored = DEMO_LISTINGS.map(l => ({
      ...l,
      score: (catCount[l.category] || 0) + Math.random() * 2,
      reason: catCount[l.category] > 0
        ? (viewHistory.some(id => DEMO_LISTINGS.find(x=>x.id===id)?.category === l.category)
          ? "Ko'rganlaringizga o'xshash" : "Sevimlilaringizga o'xshash")
        : "Ommabop e'lon",
    })).sort((a, b) => b.score - a.score);

    setRecommendations(scored.slice(0, 10));
    setForYou(scored.slice(0, 6));
    setTrending(
      [...DEMO_LISTINGS].sort((a,b) => (b.views||0)-(a.views||0)).slice(0, 6)
    );

    // Har bir e'lon uchun o'xshash e'lonlar
    const sim = {};
    DEMO_LISTINGS.forEach(l => {
      sim[l.id] = DEMO_LISTINGS
        .filter(x => x.id !== l.id && x.category === l.category)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
    });
    setSimilar(sim);
  }, [viewHistory.length, favIds.length, searchHistory.length]);

  return { recommendations, forYou, trending, similar };
}

// ── "Siz uchun" sektsiyasi ────────────────────────────
export function ForYouSection({ lang, dark, items, onOpen, onToggleFav, favIds }) {
  const th = theme(dark);
  const tx = T[lang];
  if (!items.length) return null;

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0 16px", marginBottom:12 }}>
        <div>
          <div style={{ fontSize:16, fontWeight:800, color:th.text }}>
            🤖 {lang==="uz" ? "Siz uchun" : "Для вас"}
          </div>
          <div style={{ fontSize:11, color:th.sub }}>
            {lang==="uz" ? "AI tavsiyalar asosida" : "На основе AI рекомендаций"}
          </div>
        </div>
        <span style={{ fontSize:11, background:G+"20", color:G, padding:"3px 8px", borderRadius:10, fontWeight:700 }}>AI</span>
      </div>
      <div style={{ display:"flex", gap:10, overflowX:"auto", padding:"0 16px", scrollbarWidth:"none" }}>
        {items.map(item => {
          const cat = CATEGORIES.find(c => c.id === item.category);
          return (
            <div key={item.id} onClick={() => onOpen(item)} style={{
              flexShrink:0, width:150, background:th.card,
              borderRadius:14, overflow:"hidden",
              border:`1px solid ${th.border}`, cursor:"pointer",
            }}>
              <div style={{ height:100, background:th.card2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:34, position:"relative" }}>
                {item.photos?.[0]
                  ? <img src={item.photos[0]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  : cat?.emoji}
                <div style={{ position:"absolute", top:6, left:6, background:"rgba(0,0,0,0.55)", borderRadius:6, padding:"2px 7px", fontSize:9, fontWeight:700, color:"#fff" }}>
                  {item.reason}
                </div>
              </div>
              <div style={{ padding:"8px 10px" }}>
                <div style={{ fontSize:12, fontWeight:600, color:th.text, marginBottom:3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.title}</div>
                <div style={{ fontSize:13, fontWeight:800, color:G }}>
                  {item.price===0 ? tx.free : item.price===-1 ? tx.negotiable : `${formatPrice(item.price)} ${tx.sum}`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── O'xshash e'lonlar ─────────────────────────────────
export function SimilarListings({ lang, dark, listingId, similar, onOpen }) {
  const th = theme(dark);
  const tx = T[lang];
  const items = similar[listingId] || [];
  if (!items.length) return null;

  return (
    <div style={{ marginTop:16 }}>
      <div style={{ fontSize:14, fontWeight:700, color:th.text, marginBottom:10 }}>
        🔍 {lang==="uz" ? "O'xshash e'lonlar" : "Похожие объявления"}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {items.map(item => {
          const cat = CATEGORIES.find(c => c.id === item.category);
          return (
            <div key={item.id} onClick={() => onOpen(item)} style={{
              display:"flex", gap:10, padding:"10px 12px",
              background:th.card, borderRadius:12,
              border:`1px solid ${th.border}`, cursor:"pointer",
            }}>
              <div style={{ width:52, height:52, borderRadius:10, background:th.card2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0, overflow:"hidden" }}>
                {item.photos?.[0] ? <img src={item.photos[0]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : cat?.emoji}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:th.text, marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.title}</div>
                <div style={{ fontSize:13, fontWeight:800, color:G }}>{item.price===0 ? tx.free : item.price===-1 ? tx.negotiable : `${formatPrice(item.price)} ${tx.sum}`}</div>
                <div style={{ fontSize:11, color:th.sub }}>📍 {item.city}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Trending sektsiyasi ───────────────────────────────
export function TrendingSection({ lang, dark, items, onOpen }) {
  const th = theme(dark);
  if (!items.length) return null;
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ padding:"0 16px", marginBottom:10, display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ fontSize:16, fontWeight:800, color:th.text }}>🔥 {lang==="uz" ? "Trendda" : "В тренде"}</div>
      </div>
      <div style={{ display:"flex", gap:10, overflowX:"auto", padding:"0 16px", scrollbarWidth:"none" }}>
        {items.map((item, i) => {
          const cat = CATEGORIES.find(c => c.id === item.category);
          return (
            <div key={item.id} onClick={() => onOpen(item)} style={{ flexShrink:0, width:130, cursor:"pointer" }}>
              <div style={{ height:90, background:th.card2, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, marginBottom:6, overflow:"hidden", position:"relative" }}>
                {item.photos?.[0] ? <img src={item.photos[0]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:12 }} /> : cat?.emoji}
                <div style={{ position:"absolute", top:6, left:6, background:"#FF6B35", borderRadius:6, padding:"1px 6px", fontSize:9, fontWeight:800, color:"#fff" }}>#{i+1}</div>
              </div>
              <div style={{ fontSize:11, fontWeight:600, color:th.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.title}</div>
              <div style={{ fontSize:11, color:th.sub }}>👁️ {item.views || 0}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
