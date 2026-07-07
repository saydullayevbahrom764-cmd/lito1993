import { useState, useEffect, useRef } from "react";
import { theme } from "../theme.js";
import { T } from "../translations.js";
import { ModalSheet, Btn, Input } from "../components/UI.jsx";

const G = "#16A34A";

// ── VIEWER — Jonli efirni tomosha qilish ──────────────
export function LiveViewer({ stream, lang, dark, onClose }) {
  const th = theme(dark);
  const tx = T[lang];
  const [comments, setComments] = useState(stream.comments || [
    { id:1, user:"Jasur", text: lang==="uz"?"Zo'r mahsulot!":"Отличный товар!", time:"12:01", color:"#3B82F6" },
    { id:2, user:"Nodira", text: lang==="uz"?"Narxi qancha?":"Сколько стоит?", time:"12:02", color:"#8B5CF6" },
    { id:3, user:"Sardor", text:"❤️❤️❤️", time:"12:02", color:"#EF4444" },
  ]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(stream.likes || 128);
  const [viewers] = useState(stream.viewers || Math.floor(Math.random()*200+50));
  const [gifts, setGifts] = useState([]);
  const [showGifts, setShowGifts] = useState(false);
  const chatRef = useRef(null);
  const timerRef = useRef(null);

  const GIFT_LIST = [
    { id:1, emoji:"🌹", name:lang==="uz"?"Atirgul":"Роза", price:10 },
    { id:2, emoji:"💎", name:"Diamond", price:100 },
    { id:3, emoji:"🚀", name:"Rocket", price:50 },
    { id:4, emoji:"🎁", name:lang==="uz"?"Sovg'a":"Подарок", price:20 },
    { id:5, emoji:"🔥", name:"Fire", price:30 },
    { id:6, emoji:"👑", name:"Crown", price:200 },
  ];

  useEffect(() => {
    // Auto comments simulation
    const demoUsers = ["Alisher","Malika","Bobur","Zulfiya","Kamol","Dilnoza"];
    const demoTexts = lang==="uz"
      ? ["Juda yaxshi!","Narxini ayting","Qayerda bor?","Sotib olaman","❤️","🔥🔥","Zo'r!","Tabriklash!"]
      : ["Очень хорошо!","Скажите цену","Где купить?","Беру!","❤️","🔥🔥","Класс!","Поздравляю!"];
    timerRef.current = setInterval(() => {
      const user = demoUsers[Math.floor(Math.random()*demoUsers.length)];
      const text = demoTexts[Math.floor(Math.random()*demoTexts.length)];
      const colors = ["#3B82F6","#8B5CF6","#EF4444","#F59E0B","#10B981","#EC4899"];
      setComments(p => [...p.slice(-20), {
        id: Date.now(), user, text,
        time: new Date().toLocaleTimeString("uz",{hour:"2-digit",minute:"2-digit"}),
        color: colors[Math.floor(Math.random()*colors.length)],
      }]);
    }, 2500);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    chatRef.current?.scrollTo({ top:99999, behavior:"smooth" });
  }, [comments]);

  const sendComment = () => {
    if (!newComment.trim()) return;
    setComments(p => [...p, {
      id:Date.now(), user:lang==="uz"?"Men":"Я",
      text:newComment, color:G,
      time:new Date().toLocaleTimeString("uz",{hour:"2-digit",minute:"2-digit"}),
      isMe:true,
    }]);
    setNewComment("");
  };

  const sendGift = (gift) => {
    setGifts(p => [...p, { ...gift, id:Date.now() }]);
    setTimeout(() => setGifts(p => p.filter(g => g.id !== gift.id)), 3000);
    setShowGifts(false);
  };

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:600, maxWidth:430, margin:"0 auto",
      background:"#000", display:"flex", flexDirection:"column",
    }}>
      {/* Video area */}
      <div style={{ flex:1, position:"relative", background:"linear-gradient(180deg,#0a0a0a,#1a1a2e)", overflow:"hidden" }}>
        {/* Fake video background */}
        <div style={{
          position:"absolute", inset:0,
          background:`radial-gradient(ellipse at center, ${G}22 0%, #000 70%)`,
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:80, marginBottom:12 }}>
              {stream.product?.photos?.[0]
                ? <img src={stream.product.photos[0]} alt="" style={{ width:200, height:200, objectFit:"cover", borderRadius:20, border:`3px solid ${G}` }} />
                : "🛒"}
            </div>
            <div style={{ color:"rgba(255,255,255,0.6)", fontSize:13 }}>
              {lang==="uz"?"Jonli namoyish":"Прямая трансляция"}
            </div>
          </div>
        </div>

        {/* Top bar */}
        <div style={{ position:"absolute", top:0, left:0, right:0, padding:"44px 14px 0", background:"linear-gradient(to bottom,rgba(0,0,0,0.7),transparent)", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          {/* Seller info */}
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:G+"44", border:`2px solid ${G}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
              {stream.sellerName?.[0] || "👤"}
            </div>
            <div>
              <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>{stream.sellerName || "OsonTop"}</div>
              <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                <div style={{ width:6, height:6, borderRadius:3, background:"#EF4444", animation:"pulse 1s infinite" }} />
                <span style={{ color:"#EF4444", fontSize:11, fontWeight:700 }}>LIVE</span>
                <span style={{ color:"rgba(255,255,255,0.6)", fontSize:11, marginLeft:6 }}>👁️ {viewers}</span>
              </div>
            </div>
          </div>
          {/* Controls */}
          <div style={{ display:"flex", gap:8 }}>
            <div style={{ background:"rgba(0,0,0,0.5)", borderRadius:12, padding:"4px 10px", display:"flex", alignItems:"center", gap:4 }}>
              <span style={{ fontSize:11, color:"#fff" }}>❤️ {likes.toLocaleString()}</span>
            </div>
            <button onClick={onClose} style={{ width:34, height:34, borderRadius:10, background:"rgba(0,0,0,0.5)", border:"none", color:"#fff", fontSize:18, cursor:"pointer" }}>✕</button>
          </div>
        </div>

        {/* Floating gifts */}
        {gifts.map(g => (
          <div key={g.id} style={{
            position:"absolute", bottom:"40%", right:20,
            animation:"floatUp 3s ease-out forwards",
            fontSize:36, pointerEvents:"none",
          }}>{g.emoji}</div>
        ))}

        {/* Product card overlay (bottom left) */}
        {stream.product && (
          <div style={{
            position:"absolute", bottom:16, left:14,
            background:"rgba(0,0,0,0.75)", borderRadius:14, padding:"10px 12px",
            display:"flex", gap:10, alignItems:"center",
            border:"1px solid rgba(255,255,255,0.1)", maxWidth:220,
            backdropFilter:"blur(10px)", cursor:"pointer",
          }}>
            <div style={{ width:42, height:42, borderRadius:10, background:G+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
              {stream.product.photos?.[0]
                ? <img src={stream.product.photos[0]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:8 }} />
                : "📦"}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:600, color:"#fff", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {stream.product.title}
              </div>
              <div style={{ fontSize:13, fontWeight:800, color:G }}>
                {stream.product.price > 0
                  ? `${stream.product.price.toLocaleString("ru-RU")} so'm`
                  : lang==="uz"?"Kelishiladi":"Договорная"}
              </div>
            </div>
          </div>
        )}

        {/* Share & like buttons (right) */}
        <div style={{
          position:"absolute", right:14, bottom:"50%",
          display:"flex", flexDirection:"column", gap:14, alignItems:"center",
        }}>
          {[
            { icon:"❤️", count:likes, action:() => setLikes(p=>p+1) },
            { icon:"💬", count:comments.length, action:()=>{} },
            { icon:"🎁", count:"", action:() => setShowGifts(true) },
            { icon:"🔗", count:"", action:()=>navigator.share?.({title:stream.sellerName}) },
          ].map((btn,i)=>(
            <button key={i} onClick={btn.action} style={{
              display:"flex", flexDirection:"column", alignItems:"center", gap:3,
              background:"none", border:"none", cursor:"pointer",
            }}>
              <div style={{ width:42, height:42, borderRadius:21, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, backdropFilter:"blur(6px)" }}>
                {btn.icon}
              </div>
              {btn.count !== "" && <span style={{ color:"#fff", fontSize:10, fontWeight:700 }}>{btn.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div style={{ height:220, background:"rgba(0,0,0,0.92)", display:"flex", flexDirection:"column" }}>
        {/* Comments scroll */}
        <div ref={chatRef} style={{ flex:1, overflowY:"auto", padding:"8px 12px 4px", scrollbarWidth:"none" }}>
          {comments.map(c => (
            <div key={c.id} style={{ display:"flex", gap:6, marginBottom:6, alignItems:"flex-start" }}>
              <div style={{ width:22, height:22, borderRadius:7, background:c.color+"44", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:c.color, flexShrink:0 }}>
                {c.user[0]}
              </div>
              <div>
                <span style={{ fontSize:12, fontWeight:700, color:c.color }}>{c.user} </span>
                <span style={{ fontSize:12, color:"rgba(255,255,255,0.85)" }}>{c.text}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding:"8px 12px 20px", display:"flex", gap:8 }}>
          <div style={{ flex:1, background:"rgba(255,255,255,0.1)", borderRadius:22, padding:"9px 14px", display:"flex", alignItems:"center", border:"1px solid rgba(255,255,255,0.1)" }}>
            <input value={newComment} onChange={e=>setNewComment(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&sendComment()}
              placeholder={lang==="uz"?"Izoh yozing...":"Написать комментарий..."}
              style={{ flex:1, background:"none", border:"none", outline:"none", color:"#fff", fontSize:14, fontFamily:"inherit" }} />
          </div>
          <button onClick={() => setLikes(p=>p+1)} style={{ width:40, height:40, borderRadius:20, background:"rgba(239,68,68,0.3)", border:"1px solid rgba(239,68,68,0.5)", fontSize:18, cursor:"pointer" }}>❤️</button>
          <button onClick={sendComment} disabled={!newComment.trim()} style={{
            width:40, height:40, borderRadius:20, border:"none", cursor:"pointer",
            background:newComment.trim()?G:"rgba(255,255,255,0.1)",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={newComment.trim()?"#fff":"rgba(255,255,255,0.4)"} strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>

      {/* Gift Modal */}
      {showGifts && (
        <ModalSheet dark={true} onClose={() => setShowGifts(false)} title={`🎁 ${tx.liveGift}`}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:16 }}>
            {GIFT_LIST.map(g => (
              <button key={g.id} onClick={() => sendGift(g)} style={{
                background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:14, padding:"14px 8px", cursor:"pointer",
                display:"flex", flexDirection:"column", alignItems:"center", gap:6,
              }}>
                <span style={{ fontSize:28 }}>{g.emoji}</span>
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.7)", fontWeight:600 }}>{g.name}</span>
                <span style={{ fontSize:11, color:G, fontWeight:700 }}>{g.price} 🪙</span>
              </button>
            ))}
          </div>
        </ModalSheet>
      )}

      <style>{`
        @keyframes floatUp{0%{transform:translateY(0);opacity:1}100%{transform:translateY(-200px);opacity:0}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
      `}</style>
    </div>
  );
}

// ── BROADCASTER — Jonli efir boshlash ─────────────────
export function LiveBroadcaster({ lang, dark, currentUser, onClose, myListings }) {
  const th = theme(dark);
  const tx = T[lang];
  const [title, setTitle] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [viewers, setViewers] = useState(0);
  const [duration, setDuration] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isLive) {
      timerRef.current = setInterval(() => {
        setDuration(p => p+1);
        setViewers(p => Math.min(p + Math.floor(Math.random()*5), 999));
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isLive]);

  const formatDur = (s) => {
    const m = Math.floor(s/60);
    const sec = s%60;
    return `${m.toString().padStart(2,"0")}:${sec.toString().padStart(2,"0")}`;
  };

  if (isLive) return (
    <div style={{ position:"fixed", inset:0, zIndex:600, maxWidth:430, margin:"0 auto", background:"#000" }}>
      {/* Mock camera feed */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,#1a1a2e,#0a0a1a)", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:64, marginBottom:16 }}>📷</div>
          <div style={{ color:"rgba(255,255,255,0.5)", fontSize:14 }}>
            {lang==="uz"?"Kamera yoqilgan":"Камера включена"}
          </div>
        </div>
      </div>

      {/* Top overlay */}
      <div style={{ position:"absolute", top:0, left:0, right:0, padding:"44px 16px 16px", background:"linear-gradient(to bottom,rgba(0,0,0,0.7),transparent)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ background:"#EF4444", borderRadius:8, padding:"3px 10px", display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:6, height:6, borderRadius:3, background:"#fff", animation:"pulse 1s infinite" }} />
              <span style={{ color:"#fff", fontWeight:800, fontSize:12 }}>LIVE</span>
            </div>
            <span style={{ color:"#fff", fontWeight:600, fontSize:12 }}>⏱ {formatDur(duration)}</span>
          </div>
          <div style={{ background:"rgba(0,0,0,0.5)", borderRadius:20, padding:"4px 12px" }}>
            <span style={{ color:"#fff", fontSize:12 }}>👁️ {viewers}</span>
          </div>
        </div>
        <div style={{ marginTop:10, color:"rgba(255,255,255,0.8)", fontSize:14, fontWeight:600 }}>
          {title}
        </div>
      </div>

      {/* Bottom controls */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"16px 16px 36px", background:"linear-gradient(to top,rgba(0,0,0,0.8),transparent)" }}>
        {selectedProduct && (
          <div style={{ background:"rgba(0,0,0,0.7)", borderRadius:14, padding:"10px 14px", marginBottom:14, display:"flex", gap:10, border:`1px solid ${G}40` }}>
            <div style={{ fontSize:24 }}>📦</div>
            <div>
              <div style={{ color:"#fff", fontWeight:600, fontSize:13 }}>{selectedProduct.title}</div>
              <div style={{ color:G, fontWeight:800, fontSize:14 }}>
                {selectedProduct.price > 0 ? `${selectedProduct.price.toLocaleString("ru-RU")} so'm` : tx.negotiable}
              </div>
            </div>
          </div>
        )}
        <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
          {[
            { icon:"🔀", label:lang==="uz"?"Mahsulot":"Товар", action:()=>{} },
            { icon:"🎥", label:lang==="uz"?"Kamera":"Камера", action:()=>{} },
            { icon:"🔊", label:lang==="uz"?"Ovoz":"Звук", action:()=>{} },
          ].map((btn,i)=>(
            <button key={i} onClick={btn.action} style={{
              display:"flex", flexDirection:"column", alignItems:"center", gap:4,
              background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)",
              borderRadius:14, padding:"12px 16px", cursor:"pointer",
            }}>
              <span style={{ fontSize:22 }}>{btn.icon}</span>
              <span style={{ color:"rgba(255,255,255,0.7)", fontSize:10 }}>{btn.label}</span>
            </button>
          ))}
        </div>
        <button onClick={() => { setIsLive(false); onClose(); }} style={{
          marginTop:14, width:"100%", padding:"14px",
          background:"#EF4444", border:"none", borderRadius:14,
          color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer",
        }}>
          ⏹ {tx.liveEnd}
        </button>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );

  // Pre-live setup screen
  return (
    <div style={{ position:"fixed", inset:0, zIndex:600, maxWidth:430, margin:"0 auto", background:th.bg, overflowY:"auto", paddingBottom:100 }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${G},#15803D)`, padding:"50px 16px 20px" }}>
        <button onClick={onClose} style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:10, width:36, height:36, color:"#fff", fontSize:18, cursor:"pointer", marginBottom:14 }}>←</button>
        <h2 style={{ color:"#fff", fontSize:22, fontWeight:800, marginBottom:4 }}>🎥 {tx.goLive}</h2>
        <p style={{ color:"rgba(255,255,255,0.7)", fontSize:13 }}>
          {lang==="uz"?"Mahsulotlaringizni jonli efirda ko'rsating":"Показывайте товары в прямом эфире"}
        </p>
      </div>

      <div style={{ padding:"20px 16px" }}>
        {/* Camera preview */}
        <div style={{
          width:"100%", aspectRatio:"16/9", background:"#111",
          borderRadius:16, marginBottom:20, overflow:"hidden",
          display:"flex", alignItems:"center", justifyContent:"center",
          border:`2px dashed ${th.border2}`,
        }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:48, marginBottom:8 }}>📷</div>
            <div style={{ fontSize:13, color:th.sub }}>
              {lang==="uz"?"Kamera ko'rinishi":"Предпросмотр камеры"}
            </div>
          </div>
        </div>

        {/* Title */}
        <Input dark={dark} label={tx.liveTitle} required
          value={title} onChange={e=>setTitle(e.target.value)}
          placeholder={lang==="uz"?"Masalan: iPhone 15 sotuvda!":"Напр: Продаю iPhone 15!"} />

        {/* Product select */}
        <div style={{ marginBottom:20 }}>
          <label style={{ fontSize:13, fontWeight:600, color:th.text2, display:"block", marginBottom:10 }}>
            {lang==="uz"?"Mahsulot tanlang (ixtiyoriy)":"Выберите товар (необязательно)"}
          </label>
          {myListings?.length > 0 ? (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {myListings.slice(0,4).map(l => (
                <div key={l.id} onClick={() => setSelectedProduct(selectedProduct?.id===l.id?null:l)} style={{
                  background: selectedProduct?.id===l.id ? G+"18" : th.card,
                  border:`2px solid ${selectedProduct?.id===l.id ? G : th.border}`,
                  borderRadius:12, padding:"10px 14px", cursor:"pointer",
                  display:"flex", gap:12, alignItems:"center",
                }}>
                  <div style={{ width:44, height:44, borderRadius:10, background:th.card2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, overflow:"hidden", flexShrink:0 }}>
                    {l.photos?.[0] ? <img src={l.photos[0]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : "📦"}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:600, color:th.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.title}</div>
                    <div style={{ fontSize:13, fontWeight:800, color:G }}>
                      {l.price>0?`${l.price.toLocaleString("ru-RU")} so'm`:tx.negotiable}
                    </div>
                  </div>
                  {selectedProduct?.id===l.id && <span style={{ color:G, fontSize:18 }}>✓</span>}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background:th.card2, borderRadius:12, padding:"14px", textAlign:"center", border:`1px solid ${th.border}` }}>
              <span style={{ fontSize:13, color:th.sub }}>
                {lang==="uz"?"E'lonlaringiz yo'q":"У вас нет объявлений"}
              </span>
            </div>
          )}
        </div>

        {/* Tips */}
        <div style={{ background:G+"12", borderRadius:14, padding:"14px 16px", marginBottom:20, border:`1px solid ${G}20` }}>
          <div style={{ fontSize:13, fontWeight:700, color:G, marginBottom:8 }}>
            💡 {lang==="uz"?"Maslahatlar":"Советы"}
          </div>
          {(lang==="uz"
            ? ["Yaxshi yoritish mahsulotni chiroyli ko'rsatadi","Narxni efir boshida aytib bering","Savollarni real vaqtda javob bering"]
            : ["Хорошее освещение улучшает качество","Озвучьте цену в начале эфира","Отвечайте на вопросы в реальном времени"]
          ).map((tip,i)=>(
            <div key={i} style={{ display:"flex", gap:8, marginBottom:4, alignItems:"flex-start" }}>
              <span style={{ color:G, fontSize:13, flexShrink:0 }}>✓</span>
              <span style={{ fontSize:12, color:th.text2, lineHeight:1.5 }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Start button */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, padding:"12px 16px 28px", background:th.card, borderTop:`1px solid ${th.border}` }}>
        <button onClick={() => title.trim() && setIsLive(true)}
          disabled={!title.trim()}
          style={{
            width:"100%", padding:"15px", borderRadius:14,
            background: title.trim() ? "#EF4444" : th.border2,
            color: title.trim() ? "#fff" : th.sub,
            border:"none", fontWeight:800, fontSize:16,
            cursor: title.trim() ? "pointer" : "not-allowed",
            display:"flex", alignItems:"center", justifyContent:"center", gap:10,
            boxShadow: title.trim() ? "0 4px 20px rgba(239,68,68,0.4)" : "none",
          }}>
          <div style={{ width:10, height:10, borderRadius:5, background:title.trim()?"#fff":"transparent", animation:title.trim()?"pulse 1s infinite":"none" }} />
          {tx.liveStart} — {tx.goLive}
        </button>
      </div>
    </div>
  );
}
