import { useState, useRef, useEffect } from "react";
import { theme } from "../theme.js";
import { T } from "../translations.js";

function ChatRoom({ chat, lang, dark, onBack, currentUser }) {
  const th = theme(dark);
  const tx = T[lang];
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState(chat.messages || []);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  const send = () => {
    if (!text.trim()) return;
    const msg = { id: Date.now(), from: currentUser?.uid || "me", text: text.trim(), time: new Date().toISOString() };
    setMsgs(p => [...p, msg]);
    setText("");
    setTimeout(() => {
      setMsgs(p => [...p, {
        id: Date.now()+1, from: "other",
        text: lang==="uz" ? "Xabaringiz qabul qilindi, tez orada javob beramiz 😊" : "Ваше сообщение получено, скоро ответим 😊",
        time: new Date().toISOString(),
      }]);
    }, 900);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:300, background:th.bg, maxWidth:430, margin:"0 auto", display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ background:th.card, borderBottom:`1px solid ${th.border}`, padding:"50px 16px 12px", display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={th.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div style={{ width:40, height:40, borderRadius:12, background:"#5B2D8E20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
          {chat.avatar || "👤"}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:15, color:th.text }}>{chat.name}</div>
          <div style={{ fontSize:12, color:"#27AE60", fontWeight:500 }}>● {tx.online}</div>
        </div>
        <button onClick={() => window.location.href=`tel:${chat.phone}`} style={{ background:"none", border:"none", cursor:"pointer", padding:6 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={th.sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.58 3.4 2 2 0 0 1 3.55 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        </button>
      </div>

      {/* Listing preview */}
      {chat.listing && (
        <div style={{ padding:"8px 16px", background:th.card2, borderBottom:`1px solid ${th.border}`, display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ width:44, height:44, borderRadius:10, background:th.card3, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, overflow:"hidden", flexShrink:0 }}>
            {chat.listing.photos?.[0]
              ? <img src={chat.listing.photos[0]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              : "📦"}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:600, color:th.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{chat.listing.title}</div>
            <div style={{ fontSize:12, color:"#5B2D8E", fontWeight:700 }}>
              {chat.listing.price > 0 ? `${chat.listing.price.toLocaleString("ru-RU")} ${tx.sum}` : tx.negotiable}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"12px 16px" }}>
        {msgs.length === 0 && (
          <div style={{ textAlign:"center", padding:"40px 20px", color:th.sub }}>
            <div style={{ fontSize:40, marginBottom:10 }}>{chat.avatar || "👤"}</div>
            <div style={{ fontWeight:700, fontSize:15, color:th.text, marginBottom:6 }}>{chat.name}</div>
            <div style={{ fontSize:13 }}>{lang==="uz"?"Suhbatni boshlang 👇":"Начните переписку 👇"}</div>
          </div>
        )}
        {msgs.map((m) => {
          const isMe = m.from === (currentUser?.uid || "me");
          const t = new Date(m.time).toLocaleTimeString("uz", { hour:"2-digit", minute:"2-digit" });
          return (
            <div key={m.id} style={{ display:"flex", justifyContent:isMe?"flex-end":"flex-start", marginBottom:8 }}>
              <div style={{
                maxWidth:"75%", padding:"10px 14px",
                borderRadius: isMe?"18px 18px 4px 18px":"18px 18px 18px 4px",
                background: isMe?"#5B2D8E":th.card,
                color: isMe?"#fff":th.text,
                fontSize:14, lineHeight:1.5,
                boxShadow: isMe?"0 2px 8px rgba(91,45,142,0.3)":th.shadow,
              }}>
                {m.text}
                <div style={{ fontSize:10, color:isMe?"rgba(255,255,255,0.6)":th.sub, textAlign:"right", marginTop:4 }}>
                  {t}{isMe?" ✓✓":""}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ padding:"10px 12px 28px", background:th.card, borderTop:`1px solid ${th.border}`, display:"flex", gap:8, alignItems:"flex-end" }}>
        <div style={{ flex:1, background:th.card2, borderRadius:22, padding:"10px 16px", display:"flex", alignItems:"center", border:`1px solid ${th.border}` }}>
          <textarea value={text} onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={tx.typeMessage} rows={1}
            style={{ flex:1, background:"none", border:"none", fontSize:15, outline:"none", resize:"none", color:th.text, maxHeight:90, fontFamily:"inherit", lineHeight:1.5 }}
          />
        </div>
        <button onClick={send} disabled={!text.trim()} style={{
          width:44, height:44, borderRadius:22, border:"none", cursor:text.trim()?"pointer":"default",
          background:text.trim()?"#5B2D8E":th.card2, transition:"background 0.2s",
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={text.trim()?"#fff":th.sub} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function Messages({ lang, dark, currentUser, listings }) {
  const th = theme(dark);
  const tx = T[lang];
  const [activeChat, setActiveChat] = useState(null);
  const [q, setQ] = useState("");

  const demoChats = [
    { id:"c1", name:"Jasur Toshmatov", avatar:"👨", phone:"+998901234567", listing: listings?.[0], messages:[
      { id:1, from:"other", text: lang==="uz"?"Salom, hali sotuvdami?":"Здравствуйте, ещё продаёте?", time: new Date(Date.now()-3600000).toISOString() },
      { id:2, from:"me", text: lang==="uz"?"Ha, sotuvda":"Да, продаётся", time: new Date(Date.now()-3500000).toISOString() },
    ], lastTime: new Date(Date.now()-3500000).toISOString(), unread:0 },
    { id:"c2", name:"Sardor Karimov", avatar:"🧑", phone:"+998901112233", listing: listings?.[1], messages:[
      { id:1, from:"other", text: lang==="uz"?"Narxni kamaytirasizmi?":"Можете снизить цену?", time: new Date(Date.now()-7200000).toISOString() },
    ], lastTime: new Date(Date.now()-7200000).toISOString(), unread:1 },
    { id:"c3", name:"Nodira Xoliqova", avatar:"👩", phone:"+998907654321", listing: listings?.[2], messages:[], lastTime: new Date(Date.now()-86400000).toISOString(), unread:0 },
  ];

  const filtered = demoChats.filter(c => !q || c.name.toLowerCase().includes(q.toLowerCase()));

  if (activeChat) return (
    <ChatRoom chat={activeChat} lang={lang} dark={dark} currentUser={currentUser}
      onBack={() => setActiveChat(null)} />
  );

  return (
    <div style={{ background:th.bg, minHeight:"100vh", paddingBottom:80 }}>
      {/* Header */}
      <div style={{ background:th.card, borderBottom:`1px solid ${th.border}`, padding:"50px 16px 14px", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <span style={{ fontSize:20, fontWeight:800, color:th.text }}>{tx.messages}</span>
          <button style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:th.sub }}>✏️</button>
        </div>
        <div style={{ position:"relative" }}>
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={th.sub} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </span>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder={tx.searchPh}
            style={{ width:"100%", padding:"10px 14px 10px 34px", borderRadius:10, border:"none", background:th.card2, fontSize:14, outline:"none", color:th.text, boxSizing:"border-box" }} />
        </div>
      </div>

      {/* Chat list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"80px 20px", color:th.sub }}>
          <div style={{ fontSize:56, marginBottom:14, opacity:0.3 }}>💬</div>
          <div style={{ fontWeight:700, fontSize:17, color:th.text, marginBottom:8 }}>{tx.noChats}</div>
          <div style={{ fontSize:14 }}>{tx.noChatsDesc}</div>
        </div>
      ) : filtered.map(chat => {
        const lastMsg = chat.messages[chat.messages.length-1];
        const t = (() => {
          const d = new Date(chat.lastTime);
          const now = new Date();
          const diff = Math.floor((now-d)/86400000);
          if (diff===0) return d.toLocaleTimeString("uz",{hour:"2-digit",minute:"2-digit"});
          if (diff===1) return tx.yesterday;
          return d.toLocaleDateString("uz",{day:"numeric",month:"short"});
        })();
        return (
          <div key={chat.id} onClick={() => setActiveChat(chat)} style={{
            display:"flex", alignItems:"center", gap:14, padding:"14px 16px",
            borderBottom:`1px solid ${th.border}`, cursor:"pointer",
            background: chat.unread > 0 ? th.card2 + "80" : "transparent",
          }}>
            <div style={{ position:"relative", flexShrink:0 }}>
              <div style={{ width:52, height:52, borderRadius:16, background:"#5B2D8E20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>
                {chat.avatar}
              </div>
              {chat.unread > 0 && (
                <div style={{ position:"absolute", top:-3, right:-3, width:18, height:18, borderRadius:9, background:"#5B2D8E", display:"flex", alignItems:"center", justifyContent:"center", border:`2px solid ${th.bg}` }}>
                  <span style={{ fontSize:10, fontWeight:800, color:"#fff" }}>{chat.unread}</span>
                </div>
              )}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                <span style={{ fontWeight:700, fontSize:15, color:th.text }}>{chat.name}</span>
                <span style={{ fontSize:12, color:th.sub }}>{t}</span>
              </div>
              <div style={{ fontSize:13, color:th.sub, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {lastMsg ? lastMsg.text : (lang==="uz"?"Xabar yo'q":"Нет сообщений")}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
