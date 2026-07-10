import { useState } from "react";
import { theme } from "../theme.js";
import { T, CATEGORIES } from "../translations.js";
import { formatPrice, timeAgo, DEMO_LISTINGS } from "../utils.js";
import { ModalSheet, Btn } from "../components/UI.jsx";
import { GroupSellMiniWidget } from "../features/GroupSell.jsx";

const G   = "#16A34A";
const GD  = "#15803D";
const PINK = "#C2185B";
const YELLOW = "#FACC15";

// ── OsonTop Logo (profil header uchun — oq versiya) ───
function ProfileLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
      <line x1="3"  y1="44" x2="20" y2="44" stroke="white" strokeWidth="5.5" strokeLinecap="round"/>
      <line x1="6"  y1="55" x2="19" y2="55" stroke="white" strokeWidth="4"   strokeLinecap="round" opacity="0.75"/>
      <line x1="9"  y1="66" x2="20" y2="66" stroke="white" strokeWidth="3"   strokeLinecap="round" opacity="0.5"/>
      <path d="M34 36 C34 21 72 21 72 36" stroke="white" strokeWidth="7" strokeLinecap="round" fill="none"/>
      <rect x="20" y="34" width="62" height="52" rx="13" fill="rgba(255,255,255,0.22)" stroke="white" strokeWidth="2.5"/>
      <circle cx="43" cy="52" r="9" fill="white"/>
      <path d="M27 86 C27 70 59 70 59 86" fill="white"/>
      <circle cx="62" cy="58" r="7" fill="#FBB614"/>
      <path d="M51 86 C51 74 73 74 73 86" fill="#FBB614"/>
      <g transform="translate(66, 26) rotate(-15)">
        <path d="M0 4.5C0 2 2 0 4.5 0L22 0L22 19L4.5 19C2 19 0 17 0 14.5Z" fill="#FBB614"/>
        <path d="M22 0L30 9.5L22 19Z" fill="#F59E0B"/>
        <circle cx="5.5" cy="9.5" r="2.5" fill="white"/>
        <line x1="9" y1="5.5"  x2="20" y2="5.5"  stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="9" y1="9.5"  x2="20" y2="9.5"  stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="9" y1="13.5" x2="17" y2="13.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      </g>
    </svg>
  );
}


// ── Listing kartochkasi (boshqa user profili uchun) ───
function ListingCard2({ listing, lang, dark, onOpen, onToggleFav, isFav }) {
  const th = theme(dark);
  const tx = T[lang];
  const cat = CATEGORIES.find(c => c.id === listing.category);
  const priceStr =
    listing.price === 0   ? tx.free :
    listing.price === -1  ? tx.negotiable :
    formatPrice(listing.price) + " " + tx.sum;
  return (
    <div onClick={() => onOpen(listing)} style={{
      background:th.card, borderRadius:14, overflow:"hidden",
      border:`1px solid ${th.border}`, cursor:"pointer", position:"relative",
    }}>
      <div style={{
        width:"100%", aspectRatio:"4/3", background:th.card2,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:44, overflow:"hidden", position:"relative",
      }}>
        {listing.photos?.length
          ? <img src={listing.photos[0]} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
          : <span>{cat?.emoji||"📦"}</span>}
        {listing.price===-1 && (
          <div style={{ position:"absolute",top:8,left:8,background:"rgba(0,0,0,0.6)",borderRadius:6,
            padding:"3px 8px",fontSize:10,fontWeight:700,color:"#fff",display:"flex",alignItems:"center",gap:4 }}>
            ⚡ {lang==="uz"?"Narx kelishiladi":"Договорная"}
          </div>
        )}
        <button onClick={e=>{e.stopPropagation();onToggleFav?.(listing.id);}} style={{
          position:"absolute",top:8,right:8,width:32,height:32,
          borderRadius:10,background:"rgba(0,0,0,0.35)",border:"none",
          display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",
        }}>
          <span style={{ fontSize:16, color: isFav?"#FF6B9D":"#fff" }}>{isFav?"❤️":"🤍"}</span>
        </button>
      </div>
      <div style={{ padding:"10px 10px 12px" }}>
        <div style={{ fontSize:15,fontWeight:800,color:G,marginBottom:3 }}>{priceStr}</div>
        <div style={{ fontSize:13,fontWeight:500,color:th.text,marginBottom:4,
          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{listing.title}</div>
        <div style={{ fontSize:11,color:th.sub }}>{listing.city}</div>
        <div style={{ fontSize:11,color:th.sub }}>
          {new Date(listing.createdAt).toLocaleDateString(lang==="uz"?"uz-UZ":"ru-RU",
            {day:"numeric",month:"long"}).replace(" г.","")},&nbsp;
          {new Date(listing.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
        </div>
      </div>
    </div>
  );
}


// ── MyAds (o'z sahifamdagi e'lonlar) ─────────────────
function MyAds({ lang, dark, ads, onOpen, onDelete, onEdit }) {
  const th = theme(dark);
  const tx = T[lang];
  const [tab, setTab] = useState("active");
  const active  = ads.filter(a => a.active !== false);
  const archive = ads.filter(a => a.active === false);
  const list    = tab==="active" ? active : archive;
  return (
    <div>
      <div style={{ display:"flex",gap:4,background:th.card2,borderRadius:12,padding:4,marginBottom:16 }}>
        {[["active",tx.activeAds||"Faol"],["archive",tx.inactiveAds||"Arxiv"]].map(([v,l]) => (
          <button key={v} onClick={()=>setTab(v)} style={{
            flex:1,padding:"10px",borderRadius:9,border:"none",cursor:"pointer",
            background:tab===v?G:"transparent",
            color:tab===v?"#fff":th.sub, fontWeight:700,fontSize:13,
          }}>{l} ({v==="active"?active.length:archive.length})</button>
        ))}
      </div>
      {list.map(ad => {
        const cat = CATEGORIES.find(c=>c.id===ad.category);
        return (
          <div key={ad.id} style={{ background:th.card,borderRadius:14,marginBottom:10,
            border:`1px solid ${th.border}`,overflow:"hidden" }}>
            <div style={{ display:"flex",gap:12,padding:"12px 14px",cursor:"pointer" }}
              onClick={()=>onOpen(ad)}>
              <div style={{ width:68,height:68,borderRadius:12,background:th.card2,
                flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:28,overflow:"hidden" }}>
                {ad.photos?.[0]
                  ? <img src={ad.photos[0]} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  : cat?.emoji||"📦"}
              </div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontSize:14,fontWeight:700,color:th.text,marginBottom:3,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{ad.title}</div>
                <div style={{ fontSize:15,fontWeight:800,color:G,marginBottom:4 }}>
                  {ad.price===0?tx.free:ad.price===-1?tx.negotiable:`${formatPrice(ad.price)} ${tx.sum}`}
                </div>
                <div style={{ fontSize:11,color:th.sub }}>👁️ {ad.views||0} · {timeAgo(ad.createdAt,lang)}</div>
              </div>
            </div>
            <div style={{ display:"flex",borderTop:`1px solid ${th.border}` }}>
              <button
                onClick={()=>onEdit?.(ad)}
                style={{ flex:1,padding:"10px",background:"none",border:"none",color:G,fontSize:12,fontWeight:600,cursor:"pointer",borderRight:`1px solid ${th.border}` }}>
                ✏️ {tx.edit||"Tahrirlash"}
              </button>
              <button style={{ flex:1,padding:"10px",background:"none",border:"none",color:"#F59E0B",fontSize:12,fontWeight:600,cursor:"pointer",borderRight:`1px solid ${th.border}` }}>
                🚀 {tx.boost||"Boost"}
              </button>
              <button onClick={()=>onDelete(ad.id)} style={{ flex:1,padding:"10px",background:"none",border:"none",color:"#EF4444",fontSize:12,fontWeight:600,cursor:"pointer" }}>
                🗑️ {tx.delete||"O'chirish"}
              </button>
            </div>
          </div>
        );
      })}
      {list.length===0 && (
        <div style={{ textAlign:"center",padding:"40px 20px",color:th.sub }}>
          <div style={{ fontSize:48,marginBottom:10 }}>📋</div>
          <div style={{ fontSize:15,color:th.text }}>{lang==="uz"?"E'lonlar yo'q":"Нет объявлений"}</div>
        </div>
      )}
    </div>
  );
}


// ── Boshqa foydalanuvchi profili ─────────────────────
function UserProfile({ lang, dark, user, listings, favIds, onOpen, onToggleFav, onBack }) {
  const th = theme(dark);
  const [tab, setTab]           = useState("active");
  const [subscribed, setSubscribed] = useState(false);
  const active  = listings.filter(l=>l.active!==false);
  const archive = listings.filter(l=>l.active===false);
  const shown   = tab==="active" ? active : archive;
  const regDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(lang==="uz"?"uz-UZ":"ru-RU",
        {day:"numeric",month:"numeric",year:"2-digit"}).replace(" г.","")
    : "3.07.26";
  return (
    <div style={{ background:th.bg,minHeight:"100vh",paddingBottom:80 }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"50px 16px 12px",background:th.card,
        borderBottom:`1px solid ${th.border}`,position:"sticky",top:0,zIndex:50 }}>
        <button onClick={onBack} style={{ background:"none",border:"none",
          fontSize:22,cursor:"pointer",color:th.text,padding:"4px 8px 4px 0" }}>←</button>
        <div style={{ flex:1 }}/>
        <button style={{ background:"none",border:"none",fontSize:22,cursor:"pointer",color:th.text }}>•••</button>
      </div>
      <div style={{ padding:"20px 16px 0",background:th.card }}>
        <div style={{ display:"flex",alignItems:"center",gap:16,marginBottom:16 }}>
          <div style={{ width:66,height:66,borderRadius:33,background:"#e5e7eb",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:30,flexShrink:0,overflow:"hidden",border:`2px solid ${th.border}` }}>
            {user.avatar?<img src={user.avatar} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:"👤"}
          </div>
          <div>
            <div style={{ fontSize:18,fontWeight:800,color:th.text }}>{user.name}</div>
            <div style={{ fontSize:13,color:th.sub,marginTop:3 }}>
              {lang==="uz"?"Ro'yxatdan o'tgan":"Зарегистрирован"} {regDate}
            </div>
          </div>
        </div>
        <div style={{ display:"flex",gap:8,marginBottom:16 }}>
          {[
            {val:listings.length,label:lang==="uz"?"E'lonlar":"Объявления"},
            {val:user.followers||0,label:lang==="uz"?"Obunachilar":"Подписчики"},
            {val:user.rating||0,label:lang==="uz"?"Baholash":"Рейтинг",icon:"⭐",
             extra:<span style={{fontSize:11,color:G,fontWeight:600,marginLeft:4}}>{lang==="uz"?"Baholash >":"Оценить >"}</span>},
          ].map((s,i)=>(
            <div key={i} style={{ flex:1,background:th.card2,borderRadius:12,
              padding:"10px 8px",textAlign:"center",border:`1px solid ${th.border}` }}>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:3 }}>
                {s.icon&&<span style={{fontSize:14}}>{s.icon}</span>}
                <span style={{ fontSize:17,fontWeight:800,color:th.text }}>{s.val}</span>
              </div>
              <div style={{ fontSize:11,color:th.sub,marginTop:2,display:"flex",alignItems:"center",justifyContent:"center",flexWrap:"wrap" }}>
                {s.label}{s.extra}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex",gap:10,marginBottom:16 }}>
          <button onClick={()=>setSubscribed(p=>!p)} style={{
            flex:1,padding:"14px",borderRadius:14,
            background:subscribed?th.card2:PINK,
            border:subscribed?`2px solid ${PINK}`:"none",
            color:subscribed?PINK:"#fff",
            fontWeight:800,fontSize:15,cursor:"pointer",transition:"all 0.2s",
          }}>
            {subscribed?(lang==="uz"?"Obunani bekor qilish":"Отписаться"):(lang==="uz"?"Obuna bo'lish":"Подписаться")}
          </button>
          <button onClick={()=>{if(navigator.share)navigator.share({title:user.name,url:window.location.href});else navigator.clipboard?.writeText(window.location.href);}}
            style={{ width:50,height:50,borderRadius:14,background:th.card2,
              border:`1px solid ${th.border}`,cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>🔗</button>
        </div>
        <div style={{ display:"flex",borderBottom:`2px solid ${th.border}` }}>
          {[["active",lang==="uz"?"Faol":"Активные",active.length],
            ["archive",lang==="uz"?"Arxiv":"Архив",archive.length]].map(([v,l,cnt])=>(
            <button key={v} onClick={()=>setTab(v)} style={{
              flex:1,padding:"12px 0",background:"none",border:"none",cursor:"pointer",
              fontWeight:tab===v?800:500,fontSize:14,color:tab===v?th.text:th.sub,
              borderBottom:tab===v?`2px solid ${th.text}`:"2px solid transparent",
              marginBottom:-2,display:"flex",alignItems:"center",justifyContent:"center",gap:6,
            }}>
              {l}
              {cnt>0&&<span style={{ background:tab===v?th.text:th.sub,color:th.card,
                width:22,height:22,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:12,fontWeight:800 }}>{cnt}</span>}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding:"12px 12px 20px" }}>
        {shown.length>0?(
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
            {shown.map(l=>(
              <ListingCard2 key={l.id} listing={l} lang={lang} dark={dark}
                onOpen={onOpen} isFav={favIds?.includes(l.id)} onToggleFav={onToggleFav}/>
            ))}
          </div>
        ):(
          <div style={{ textAlign:"center",padding:"50px 20px",color:th.sub }}>
            <div style={{ fontSize:44,marginBottom:10 }}>📋</div>
            <div style={{ fontSize:15,color:th.text }}>{lang==="uz"?"E'lonlar yo'q":"Объявлений нет"}</div>
          </div>
        )}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════
// ASOSIY PROFIL KOMPONENTI
// ═══════════════════════════════════════════════════
export default function Profile({
  lang, dark, currentUser, onLogin, onLangChange, onDarkToggle,
  myListings, onOpenListing, onAddListing, favIds, onOpenFav,
  onStartLive, onVerified,
  onDashboard, onOffers, onMahalla, onGroupBuy, onGamification, onGroupSell,
  onDeleteListing, onEditListing, onUpdateProfile,
  xp,
  viewUser, onCloseUserProfile,
}) {
  const th = theme(dark);
  const tx = T[lang];
  const [view, setView]             = useState("main");
  const [showVerify, setShowVerify] = useState(false);
  const [verifyStep, setVerifyStep] = useState(0);
  const isVerified = currentUser?.verified || false;
  const hGrad = `linear-gradient(135deg,${G},${GD})`;
  const isUz  = lang === "uz";

  // Profil tahrirlash
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName,   setEditName]   = useState(currentUser?.name || "");
  const [editCity,   setEditCity]   = useState(currentUser?.city || "");

  // E'lon tahrirlash
  const [editingAd, setEditingAd] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDesc,  setEditDesc]  = useState("");

  // ── Boshqa user profili ──────────────────────────
  if (viewUser) {
    const userListings = DEMO_LISTINGS.filter(l => l.seller?.id === viewUser.id);
    return (
      <UserProfile lang={lang} dark={dark} user={viewUser}
        listings={userListings} favIds={favIds}
        onOpen={onOpenListing} onToggleFav={()=>{}}
        onBack={onCloseUserProfile||(()=>{})} />
    );
  }


  // ── Sub-views ─────────────────────────────────────
  if (view === "myads") return (
    <div style={{ background:th.bg, minHeight:"100vh", paddingBottom:80 }}>
      <div style={{ background:hGrad, padding:"50px 16px 16px" }}>
        <button onClick={()=>setView("main")} style={{ background:"rgba(255,255,255,0.2)",
          border:"none",borderRadius:10,width:36,height:36,color:"#fff",
          fontSize:18,cursor:"pointer",marginBottom:10 }}>←</button>
        <div style={{ color:"#fff",fontWeight:800,fontSize:18 }}>{tx.myAds}</div>
      </div>
      <div style={{ padding:16 }}>
        <Btn dark={dark} onClick={onAddListing} style={{ marginBottom:16,background:G }}>
          + {isUz?"Yangi e'lon":"Добавить объявление"}
        </Btn>
        <MyAds lang={lang} dark={dark} ads={myListings||[]}
          onOpen={onOpenListing}
          onDelete={id=>onDeleteListing?.(id)}
          onEdit={ad=>{
            setEditingAd(ad);
            setEditTitle(ad.title||"");
            setEditPrice(ad.price>0?String(ad.price):"");
            setEditDesc(ad.description||"");
          }} />
        <GroupSellMiniWidget lang={lang} dark={dark} myGroups={[]}
          onOpen={()=>{ setView("main"); onGroupSell?.(); }} />
      </div>

      {/* ── E'LON TAHRIRLASH MODAL ── */}
      {editingAd && (
        <div onClick={()=>setEditingAd(null)}
          style={{ position:"fixed",inset:0,zIndex:600,background:"rgba(0,0,0,0.55)",
            display:"flex",alignItems:"flex-end",justifyContent:"center",maxWidth:430,margin:"0 auto" }}>
          <div onClick={e=>e.stopPropagation()}
            style={{ background:th.card,borderRadius:"20px 20px 0 0",width:"100%",padding:"0 0 32px" }}>
            <div style={{ width:36,height:4,background:th.border,borderRadius:2,margin:"12px auto 16px" }}/>
            <div style={{ padding:"0 16px" }}>
              <div style={{ fontSize:16,fontWeight:800,color:th.text,marginBottom:16 }}>
                ✏️ {isUz?"E'lonni tahrirlash":"Редактировать объявление"}
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:12,fontWeight:600,color:th.sub,display:"block",marginBottom:6 }}>
                  {isUz?"Sarlavha":"Заголовок"} *
                </label>
                <input value={editTitle} onChange={e=>setEditTitle(e.target.value)}
                  style={{ width:"100%",padding:"12px 14px",borderRadius:12,border:`1.5px solid ${th.border2}`,
                    background:th.card,fontSize:15,outline:"none",color:th.text,boxSizing:"border-box",fontFamily:"inherit" }}/>
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:12,fontWeight:600,color:th.sub,display:"block",marginBottom:6 }}>
                  {isUz?"Narx (so'm)":"Цена (сум)"}
                </label>
                <input value={editPrice} onChange={e=>setEditPrice(e.target.value)} type="number"
                  style={{ width:"100%",padding:"12px 14px",borderRadius:12,border:`1.5px solid ${th.border2}`,
                    background:th.card,fontSize:15,outline:"none",color:th.text,boxSizing:"border-box",fontFamily:"inherit" }}/>
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:12,fontWeight:600,color:th.sub,display:"block",marginBottom:6 }}>
                  {isUz?"Tavsif":"Описание"}
                </label>
                <textarea value={editDesc} onChange={e=>setEditDesc(e.target.value)} rows={3}
                  style={{ width:"100%",padding:"12px 14px",borderRadius:12,border:`1.5px solid ${th.border2}`,
                    background:th.card,fontSize:14,outline:"none",color:th.text,
                    boxSizing:"border-box",fontFamily:"inherit",resize:"vertical",minHeight:80 }}/>
              </div>
              <div style={{ display:"flex",gap:10 }}>
                <Btn dark={dark} variant="ghost" onClick={()=>setEditingAd(null)} style={{ flex:1 }}>
                  {isUz?"Bekor qilish":"Отмена"}
                </Btn>
                <Btn dark={dark} onClick={()=>{
                  if(editTitle.trim()&&onEditListing){
                    onEditListing(editingAd.id,{
                      title:editTitle.trim(),
                      price:editPrice?Number(editPrice):editingAd.price,
                      description:editDesc.trim(),
                    });
                  }
                  setEditingAd(null);
                }} style={{ flex:2,background:G }}>
                  ✅ {isUz?"Saqlash":"Сохранить"}
                </Btn>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (view === "favorites") return (
    <div style={{ background:th.bg,minHeight:"100vh",paddingBottom:80 }}>
      <div style={{ background:hGrad,padding:"50px 16px 16px" }}>
        <button onClick={()=>setView("main")} style={{ background:"rgba(255,255,255,0.2)",
          border:"none",borderRadius:10,width:36,height:36,color:"#fff",fontSize:18,cursor:"pointer",marginBottom:10 }}>←</button>
        <div style={{ color:"#fff",fontWeight:800,fontSize:18 }}>❤️ {tx.favorites}</div>
      </div>
      <div style={{ padding:16 }}>
        {DEMO_LISTINGS.filter(l=>favIds?.includes(l.id)).map(l=>{
          const cat=CATEGORIES.find(c=>c.id===l.category);
          return (
            <div key={l.id} onClick={()=>onOpenFav(l)} style={{
              background:th.card,borderRadius:14,marginBottom:10,
              border:`1px solid ${th.border}`,display:"flex",overflow:"hidden",cursor:"pointer" }}>
              <div style={{ width:88,height:88,background:th.card2,display:"flex",alignItems:"center",
                justifyContent:"center",fontSize:30,flexShrink:0,overflow:"hidden" }}>
                {l.photos?.[0]?<img src={l.photos[0]} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:cat?.emoji}
              </div>
              <div style={{ flex:1,padding:"10px 12px" }}>
                <div style={{ fontSize:14,fontWeight:600,color:th.text,marginBottom:4 }}>{l.title}</div>
                <div style={{ fontSize:15,fontWeight:800,color:G }}>
                  {l.price===0?tx.free:l.price===-1?tx.negotiable:`${formatPrice(l.price)} ${tx.sum}`}
                </div>
                <div style={{ fontSize:11,color:th.sub,marginTop:4 }}>📍 {l.city}</div>
              </div>
            </div>
          );
        })}
        {!favIds?.length&&(
          <div style={{ textAlign:"center",padding:"60px 0",color:th.sub }}>
            <div style={{ fontSize:52,marginBottom:12 }}>🤍</div>
            <div style={{ fontWeight:700,color:th.text }}>{isUz?"Saqlangan e'lonlar yo'q":"Нет избранных"}</div>
          </div>
        )}
      </div>
    </div>
  );


  if (view === "settings") return (
    <div style={{ background:th.bg,minHeight:"100vh",paddingBottom:80 }}>
      <div style={{ background:hGrad,padding:"50px 16px 16px" }}>
        <button onClick={()=>setView("main")} style={{ background:"rgba(255,255,255,0.2)",
          border:"none",borderRadius:10,width:36,height:36,color:"#fff",fontSize:18,cursor:"pointer",marginBottom:10 }}>←</button>
        <div style={{ color:"#fff",fontWeight:800,fontSize:18 }}>⚙️ {tx.settings}</div>
      </div>
      <div style={{ padding:16 }}>
        <div style={{ background:th.card,borderRadius:16,overflow:"hidden",border:`1px solid ${th.border}`,marginBottom:16 }}>
          <div style={{ padding:"11px 16px",fontSize:11,fontWeight:700,color:th.sub,borderBottom:`1px solid ${th.border}` }}>
            {isUz?"KO'RINISH":"ВНЕШНИЙ ВИД"}
          </div>
          <div onClick={onDarkToggle} style={{ padding:"15px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer" }}>
            <span style={{ fontSize:14,color:th.text }}>{dark?"☀️":"🌙"} {tx.darkMode}</span>
            <div style={{ width:46,height:26,borderRadius:13,background:dark?G:th.border,position:"relative",transition:"background 0.3s" }}>
              <div style={{ position:"absolute",top:3,left:dark?23:3,width:20,height:20,
                borderRadius:10,background:"#fff",transition:"left 0.3s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }}/>
            </div>
          </div>
        </div>
        <div style={{ background:th.card,borderRadius:16,overflow:"hidden",border:`1px solid ${th.border}`,marginBottom:16 }}>
          <div style={{ padding:"11px 16px",fontSize:11,fontWeight:700,color:th.sub,borderBottom:`1px solid ${th.border}` }}>TIL / ЯЗЫК</div>
          <div style={{ padding:"12px 16px",display:"flex",gap:10 }}>
            {[["uz","🇺🇿 O'zbekcha"],["ru","🇷🇺 Русский"]].map(([l,label])=>(
              <button key={l} onClick={()=>onLangChange(l)} style={{
                flex:1,padding:"11px 8px",borderRadius:12,cursor:"pointer",
                border:`2px solid ${lang===l?G:th.border}`,
                background:lang===l?G+"20":th.card,
                color:lang===l?G:th.text, fontWeight:700,fontSize:13,
              }}>{label}</button>
            ))}
          </div>
        </div>
        <div onClick={()=>onLogin(null)} style={{ background:th.card,borderRadius:16,
          padding:"15px 16px",border:`1px solid ${th.border}`,cursor:"pointer",
          display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ width:36,height:36,borderRadius:10,background:"#EF444420",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>🚪</div>
          <span style={{ fontSize:15,color:"#EF4444",fontWeight:600 }}>{tx.logout}</span>
        </div>
      </div>
    </div>
  );

  if (view === "about") return (
    <div style={{ background:th.bg,minHeight:"100vh",paddingBottom:80 }}>
      <div style={{ background:hGrad,padding:"50px 16px 28px",textAlign:"center" }}>
        <button onClick={()=>setView("main")} style={{ background:"rgba(255,255,255,0.2)",
          border:"none",borderRadius:10,width:36,height:36,color:"#fff",
          fontSize:18,cursor:"pointer",display:"block",marginBottom:16 }}>←</button>
        <ProfileLogo/>
        <div style={{ color:"#fff",fontWeight:900,fontSize:22,marginTop:8 }}>OsonTop</div>
        <div style={{ color:"rgba(255,255,255,0.7)",fontSize:12,marginTop:4 }}>v2.0.0</div>
        <div style={{ color:"rgba(255,255,255,0.6)",fontSize:11,marginTop:2 }}>Birga olamiz, birga sotamiz!</div>
      </div>
      <div style={{ padding:16 }}>
        {[["📦","Version","2.0.0"],["👨‍💻",isUz?"Ishlab chiquvchi":"Разработчик","OsonTop Team"],
          ["📧","Email","support@osontop.uz"],["📱","Telegram","@osontop_uz"]].map(([icon,label,val],i)=>(
          <div key={i} style={{ background:th.card,borderRadius:14,padding:"13px 16px",
            marginBottom:8,display:"flex",justifyContent:"space-between",
            alignItems:"center",border:`1px solid ${th.border}` }}>
            <span style={{ fontSize:14,color:th.text }}>{icon} {label}</span>
            <span style={{ fontSize:13,color:th.sub,fontWeight:600 }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );


  // ── Asosiy profil sahifasi ─────────────────────────
  const lvl = xp>=5000?7:xp>=2000?6:xp>=1000?5:xp>=600?4:xp>=300?3:xp>=100?2:1;

  if (!currentUser) return (
    <div style={{ background:th.bg,minHeight:"100vh" }}>
      <div style={{ background:hGrad,padding:"50px 16px 28px",textAlign:"center" }}>
        <div style={{ fontSize:60,marginBottom:10 }}>👤</div>
        <div style={{ color:"#fff",fontWeight:800,fontSize:20,marginBottom:6 }}>
          {isUz?"Profilim":"Мой профиль"}
        </div>
        <div style={{ color:"rgba(255,255,255,0.7)",fontSize:14 }}>
          {isUz?"Kirish qilib barcha imkoniyatlardan foydalaning":"Войдите, чтобы пользоваться всеми функциями"}
        </div>
      </div>
      <div style={{ padding:20 }}>
        <Btn dark={dark} onClick={onLogin} style={{ background:G,marginBottom:12 }}>
          {isUz?"Kirish / Ro'yxatdan o'tish":"Войти / Зарегистрироваться"}
        </Btn>
      </div>
    </div>
  );

  const myRegDate = currentUser.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString(isUz?"uz-UZ":"ru-RU",
        {day:"numeric",month:"numeric",year:"2-digit"}).replace(" г.","")
    : new Date().toLocaleDateString(isUz?"uz-UZ":"ru-RU",
        {day:"numeric",month:"numeric",year:"2-digit"});

  return (
    <div style={{ background:"#F5F5F5",minHeight:"100vh",paddingBottom:80 }}>

      {/* ═══ HEADER ═══ */}
      <div style={{ background:hGrad,padding:"50px 16px 20px",position:"sticky",top:0,zIndex:50 }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          {/* Logo + Salomlashuv */}
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <ProfileLogo/>
            <div>
              <div style={{ color:"rgba(255,255,255,0.7)",fontSize:11 }}>
                {isUz?"Assalomu alaykum,":"Добро пожаловать,"}
              </div>
              <div style={{ color:"#fff",fontWeight:800,fontSize:15,lineHeight:1.2 }}>
                {currentUser.name||"Foydalanuvchi"}
              </div>
            </div>
          </div>
          {/* Bell + Settings */}
          <div style={{ display:"flex",gap:8 }}>
            <button style={{ background:"rgba(255,255,255,0.15)",border:"none",borderRadius:10,
              width:36,height:36,color:"#fff",fontSize:18,cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",position:"relative" }}>
              🔔
              <div style={{ position:"absolute",top:4,right:4,width:8,height:8,
                borderRadius:4,background:"#EF4444",border:"2px solid rgba(255,255,255,0.8)" }}/>
            </button>
            <button onClick={()=>setView("settings")} style={{ background:"rgba(255,255,255,0.15)",border:"none",
              borderRadius:10,width:36,height:36,color:"#fff",fontSize:18,cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center" }}>⚙️</button>
          </div>
        </div>
      </div>


      {/* ═══ AVATAR + ISM + LVL ═══ */}
      <div style={{ background:"#fff",padding:"20px 16px 16px",borderBottom:"1px solid #E8E8E8" }}>
        <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:14 }}>
          {/* Avatar — bosilsa tahrirlash */}
          <div style={{ position:"relative",flexShrink:0 }}
            onClick={()=>{
              setEditName(currentUser?.name||"");
              setEditCity(currentUser?.city||"");
              setShowEditProfile(true);
            }}>
            <div style={{ width:72,height:72,borderRadius:36,background:`linear-gradient(135deg,${G},${GD})`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:28,fontWeight:900,color:"#fff",
              border:"3px solid #fff",boxShadow:"0 4px 16px rgba(22,163,74,0.3)",
              cursor:"pointer" }}>
              {currentUser.photo
                ? <img src={currentUser.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}}/>
                : currentUser.name?.[0]?.toUpperCase()||"A"}
            </div>
            {/* Tahrirlash belgisi */}
            <div style={{ position:"absolute",bottom:-2,right:-2,
              width:24,height:24,borderRadius:12,
              background:G,border:"2.5px solid #fff",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:11,cursor:"pointer" }}>✏️</div>
            {isVerified&&(
              <div style={{ position:"absolute",top:-2,left:-2,
                width:22,height:22,borderRadius:11,
                background:"#1DA1F2",border:"2px solid #fff",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:11,color:"#fff" }}>✓</div>
            )}
          </div>
          {/* Ism va info */}
          <div style={{ flex:1 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:2 }}>
              <div style={{ fontSize:20,fontWeight:900,color:"#0F172A" }}>{currentUser.name}</div>
              {isVerified&&(
                <span style={{ background:"#1DA1F220",color:"#1DA1F2",fontSize:10,
                  fontWeight:700,padding:"2px 7px",borderRadius:10 }}>✓ {isUz?"Tasdiqlangan":"Подтверждён"}</span>
              )}
            </div>
            <div style={{ fontSize:12,color:G,fontWeight:700,marginBottom:2 }}>
              Lv.{lvl} · {xp} XP
            </div>
            <div style={{ fontSize:11,color:"#999",display:"flex",alignItems:"center",gap:3 }}>
              📍 {currentUser.city||"Namangan"}
            </div>
          </div>
          {/* Tahrirlash tugmasi */}
          <button
            onClick={()=>{
              setEditName(currentUser?.name||"");
              setEditCity(currentUser?.city||"");
              setShowEditProfile(true);
            }}
            style={{ background:G+"15",border:"none",borderRadius:10,
              padding:"8px 14px",color:G,fontSize:12,fontWeight:700,cursor:"pointer" }}>
            ✏️ {isUz?"Tahrirlash":"Изменить"}
          </button>
        </div>

        {/* XP progress bar */}
        <div>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:4 }}>
            <span style={{ fontSize:10,color:"#999",fontWeight:600 }}>
              {isUz?`Daraja ${lvl}`:`Уровень ${lvl}`}
            </span>
            <span style={{ fontSize:10,color:"#999" }}>{xp} XP</span>
          </div>
          <div style={{ height:4,background:"#F3F4F6",borderRadius:2,overflow:"hidden" }}>
            <div style={{ height:"100%",width:`${Math.min(100,(xp%300)/3)}%`,
              background:`linear-gradient(to right,${G},#22C55E)`,borderRadius:2,transition:"width 0.5s" }}/>
          </div>
        </div>
      </div>

      {/* ═══ PROFIL TAHRIRLASH MODAL ═══ */}
      {showEditProfile && (
        <div onClick={()=>setShowEditProfile(false)}
          style={{ position:"fixed",inset:0,zIndex:600,background:"rgba(0,0,0,0.55)",
            display:"flex",alignItems:"flex-end",justifyContent:"center",maxWidth:430,margin:"0 auto" }}>
          <div onClick={e=>e.stopPropagation()}
            style={{ background:th.card,borderRadius:"20px 20px 0 0",width:"100%",padding:"0 0 32px" }}>
            <div style={{ width:36,height:4,background:th.border,borderRadius:2,margin:"12px auto 16px" }}/>
            <div style={{ padding:"0 16px" }}>
              <div style={{ fontSize:16,fontWeight:800,color:th.text,marginBottom:20 }}>
                👤 {isUz?"Profilni tahrirlash":"Редактировать профиль"}
              </div>
              {/* Avatar yuklash */}
              <div style={{ display:"flex",justifyContent:"center",marginBottom:20 }}>
                <div style={{ position:"relative",cursor:"pointer" }}>
                  <div style={{ width:80,height:80,borderRadius:40,
                    background:`linear-gradient(135deg,${G},${GD})`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:32,fontWeight:900,color:"#fff",
                    border:"3px solid "+th.border }}>
                    {currentUser.photo
                      ? <img src={currentUser.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}}/>
                      : editName?.[0]?.toUpperCase()||"A"}
                  </div>
                  <div style={{ position:"absolute",bottom:0,right:0,
                    width:28,height:28,borderRadius:14,background:G,border:"2.5px solid "+th.card,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:13 }}>📷</div>
                </div>
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:12,fontWeight:600,color:th.sub,display:"block",marginBottom:6 }}>
                  {isUz?"Ism Familiya":"Имя Фамилия"} *
                </label>
                <input value={editName} onChange={e=>setEditName(e.target.value)}
                  placeholder={isUz?"Ismingizni kiriting":"Введите имя"}
                  style={{ width:"100%",padding:"12px 14px",borderRadius:12,
                    border:`1.5px solid ${editName?G:th.border2}`,
                    background:th.card,fontSize:15,outline:"none",color:th.text,
                    boxSizing:"border-box",fontFamily:"inherit" }}/>
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:12,fontWeight:600,color:th.sub,display:"block",marginBottom:6 }}>
                  📍 {isUz?"Shahar":"Город"}
                </label>
                <input value={editCity} onChange={e=>setEditCity(e.target.value)}
                  placeholder={isUz?"Masalan: Toshkent":"Например: Ташкент"}
                  style={{ width:"100%",padding:"12px 14px",borderRadius:12,
                    border:`1.5px solid ${th.border2}`,
                    background:th.card,fontSize:15,outline:"none",color:th.text,
                    boxSizing:"border-box",fontFamily:"inherit" }}/>
              </div>
              <div style={{ display:"flex",gap:10 }}>
                <Btn dark={dark} variant="ghost" onClick={()=>setShowEditProfile(false)} style={{ flex:1 }}>
                  {isUz?"Bekor":"Отмена"}
                </Btn>
                <Btn dark={dark} onClick={()=>{
                  if(editName.trim()&&onUpdateProfile){
                    onUpdateProfile({ name:editName.trim(), city:editCity.trim() });
                  }
                  setShowEditProfile(false);
                }} style={{ flex:2,background:G }}>
                  ✅ {isUz?"Saqlash":"Сохранить"}
                </Btn>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* ═══ JONLI EFIR BANNER ═══ */}
      {isVerified ? (
        <div onClick={()=>onStartLive?.()} style={{ margin:"12px 16px 0",
          background:"linear-gradient(135deg,#9333EA,#6D28D9)",
          borderRadius:16,padding:"14px 16px",
          display:"flex",alignItems:"center",gap:12,cursor:"pointer",
          boxShadow:"0 4px 16px rgba(109,40,217,0.3)" }}>
          <div style={{ width:44,height:44,borderRadius:12,
            background:"rgba(255,255,255,0.2)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:22 }}>🎥</div>
          <div style={{ flex:1 }}>
            <div style={{ color:"#fff",fontWeight:800,fontSize:14 }}>
              {isUz?"Jonli efir boshlash":"Начать прямой эфир"}
            </div>
            <div style={{ color:"rgba(255,255,255,0.75)",fontSize:11 }}>
              {isUz?"Mahsulotlaringizni minglab odamlarga ko'rsating":"Показывайте товары миллионам"}
            </div>
          </div>
          <div style={{ background:"#EF4444",borderRadius:8,padding:"5px 10px",
            display:"flex",alignItems:"center",gap:5 }}>
            <div style={{ width:6,height:6,borderRadius:3,background:"#fff",
              animation:"pulse 1s infinite" }}/>
            <span style={{ color:"#fff",fontSize:11,fontWeight:800 }}>LIVE</span>
          </div>
        </div>
      ) : (
        <div onClick={()=>setShowVerify(true)} style={{ margin:"12px 16px 0",
          background:G+"12",borderRadius:16,padding:"13px 16px",
          border:`1px solid ${G}30`,
          display:"flex",alignItems:"center",gap:12,cursor:"pointer" }}>
          <span style={{ fontSize:22 }}>✅</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13,fontWeight:700,color:G }}>{tx.verifyId}</div>
            <div style={{ fontSize:11,color:"#999" }}>{tx.verifyIdDesc}</div>
          </div>
          <span style={{ fontSize:13,color:G }}>→</span>
        </div>
      )}


      {/* ═══ MENING BO'LIMLARIM ═══ */}
      <div style={{ margin:"16px 16px 0" }}>
        <div style={{ fontSize:15,fontWeight:800,color:"#0F172A",marginBottom:10 }}>
          {isUz?"Mening bo'limlarim":"Мои разделы"}
        </div>
        <div style={{ background:"#fff",borderRadius:16,overflow:"hidden",
          border:"1px solid #E8E8E8",boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
          {/* Mening e'lonlarim */}
          <div onClick={()=>setView("myads")} style={{ display:"flex",alignItems:"center",
            gap:14,padding:"14px 16px",cursor:"pointer",
            borderBottom:"1px solid #F3F4F6" }}>
            <div style={{ width:42,height:42,borderRadius:12,background:G+"15",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>📋</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14,fontWeight:700,color:"#0F172A" }}>
                {isUz?"Mening e'lonlarim":"Мои объявления"}
              </div>
              <div style={{ fontSize:11,color:"#999",marginTop:1 }}>
                {myListings?.length||6} {isUz?"ta e'lon":"объявлений"}
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
          {/* GroupSell */}
          <div onClick={()=>onGroupSell?.()} style={{ display:"flex",alignItems:"center",
            gap:14,padding:"14px 16px",cursor:"pointer" }}>
            <div style={{ width:42,height:42,borderRadius:12,background:"#6366F115",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>🤝</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14,fontWeight:700,color:"#0F172A" }}>GroupSell</div>
              <div style={{ fontSize:11,color:"#999",marginTop:1 }}>
                {isUz?"2 ta faol group":"2 активных группы"}
              </div>
            </div>
            {/* SARIQ "Yangi" badge */}
            <div style={{ background:YELLOW,borderRadius:20,padding:"4px 10px",marginRight:6 }}>
              <span style={{ fontSize:10,fontWeight:800,color:"#0F172A" }}>
                {isUz?"Yangi":"Новое"}
              </span>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </div>
      </div>


      {/* ═══ QOLGAN MENYU ELEMENTLARI ═══ */}
      <div style={{ margin:"12px 16px 0",background:"#fff",borderRadius:16,
        overflow:"hidden",border:"1px solid #E8E8E8",
        boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
        {[
          { icon:"❤️", label:tx.favorites,  color:"#EF4444", action:()=>setView("favorites") },
          { icon:"🤝", label:isUz?"Narx takliflarim":"Мои предложения", color:"#10B981", action:()=>onOffers?.() },
          { icon:"📊", label:isUz?"Dashboard":"Дашборд", color:"#8B5CF6", action:()=>onDashboard?.() },
          { icon:"🏘️", label:"Mahalla", color:"#10B981", action:()=>onMahalla?.() },
          { icon:"🤝", label:isUz?"Birga olamiz":"Купим вместе", color:"#3B82F6", action:()=>onGroupBuy?.() },
          { icon:"🏆", label:isUz?`Reyting · ${xp} XP`:`Рейтинг · ${xp} XP`, color:"#F59E0B", action:()=>onGamification?.() },
          { icon:"✅", label:tx.verifyId, color:"#1DA1F2", action:()=>setShowVerify(true) },
          { icon:"⚙️", label:tx.settings, color:"#6B7280", action:()=>setView("settings") },
          { icon:"ℹ️", label:tx.about,    color:"#3B82F6", action:()=>setView("about") },
        ].map((item,i,arr)=>(
          <div key={i} onClick={item.action} style={{ display:"flex",alignItems:"center",
            gap:14,padding:"13px 16px",cursor:"pointer",
            borderBottom:i<arr.length-1?"1px solid #F3F4F6":"none" }}>
            <div style={{ width:38,height:38,borderRadius:11,background:item.color+"15",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>
              {item.icon}
            </div>
            <span style={{ flex:1,fontSize:14,fontWeight:500,color:"#0F172A" }}>{item.label}</span>
            {item.icon==="🎥"&&!isVerified&&(
              <span style={{ fontSize:10,background:"#F59E0B20",color:"#F59E0B",
                padding:"2px 7px",borderRadius:6,fontWeight:700 }}>
                {isUz?"Tasdiqlov kerak":"Верификация"}
              </span>
            )}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#CCC" strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        ))}
      </div>

      {/* ═══ QUYI BO'SH MAYDONI ═══ */}
      <div style={{ height:20 }}/>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>


      {/* ═══ MyID VERIFY MODAL ═══ */}
      {showVerify&&(
        <ModalSheet dark={dark} onClose={()=>{setShowVerify(false);setVerifyStep(0);}}>
          {verifyStep===0&&(
            <div>
              <div style={{ textAlign:"center",marginBottom:18 }}>
                <div style={{ fontSize:50,marginBottom:8 }}>✅</div>
                <div style={{ fontSize:17,fontWeight:800,color:th.text,marginBottom:6 }}>MyID Verification</div>
                <div style={{ fontSize:13,color:th.sub,lineHeight:1.6 }}>
                  {isUz?"Live Stream va Premium funksiyalardan foydalaning":"Получите доступ к Live Stream и Premium"}
                </div>
              </div>
              {[
                {icon:"🪪",text:isUz?"Passport yoki ID kartangizni tayyorlang":"Подготовьте паспорт или ID карту"},
                {icon:"📸",text:isUz?"Selfie suratga oling":"Сделайте селфи"},
                {icon:"✅",text:isUz?"1 daqiqada tekshiriladi":"Проверяется за 1 минуту"},
              ].map((s,i)=>(
                <div key={i} style={{ display:"flex",gap:12,padding:"10px 0",
                  borderBottom:i<2?`1px solid ${th.border}`:"none",alignItems:"center" }}>
                  <span style={{ fontSize:20 }}>{s.icon}</span>
                  <span style={{ fontSize:13,color:th.text }}>{s.text}</span>
                </div>
              ))}
              <div style={{ display:"flex",gap:10,marginTop:18 }}>
                <Btn dark={dark} variant="ghost" onClick={()=>{setShowVerify(false);setVerifyStep(0);}} style={{ flex:1 }}>
                  {isUz?"Keyinroq":"Позже"}
                </Btn>
                <Btn dark={dark} onClick={()=>setVerifyStep(1)} style={{ flex:2,background:G }}>
                  {isUz?"Boshlash":"Начать"}
                </Btn>
              </div>
            </div>
          )}
          {verifyStep===1&&(
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:50,marginBottom:8 }}>📸</div>
              <div style={{ fontSize:17,fontWeight:800,color:th.text,marginBottom:6 }}>
                {isUz?"Selfie oling":"Сделайте селфи"}
              </div>
              <div style={{ width:"80%",aspectRatio:"4/3",background:th.card2,
                borderRadius:14,margin:"0 auto 18px",
                display:"flex",alignItems:"center",justifyContent:"center",
                border:`2px dashed ${th.border}`,cursor:"pointer" }}>
                <div><div style={{ fontSize:38,marginBottom:4 }}>📷</div>
                  <div style={{ fontSize:11,color:th.sub }}>{isUz?"Kamera":"Камера"}</div>
                </div>
              </div>
              <div style={{ display:"flex",gap:10 }}>
                <Btn dark={dark} variant="ghost" onClick={()=>setVerifyStep(0)} style={{ flex:1 }}>←</Btn>
                <Btn dark={dark} onClick={()=>{setVerifyStep(2);onVerified?.();}} style={{ flex:2,background:G }}>
                  {isUz?"MyID ga yuborish":"Отправить в MyID"}
                </Btn>
              </div>
            </div>
          )}
          {verifyStep===2&&(
            <div style={{ textAlign:"center",padding:"10px 0" }}>
              <div style={{ fontSize:62,marginBottom:12 }}>🎉</div>
              <div style={{ fontSize:18,fontWeight:800,color:G,marginBottom:8 }}>
                {isUz?"Tabriklaymiz!":"Поздравляем!"}
              </div>
              <div style={{ fontSize:13,color:th.sub,marginBottom:22,lineHeight:1.6 }}>
                {isUz?"Live Stream va premium funksiyalar ochildi 🎥":"Открыты Live Stream и премиум функции 🎥"}
              </div>
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                <Btn dark={dark} onClick={()=>{setShowVerify(false);setVerifyStep(0);onStartLive?.();}} style={{ background:"#EF4444" }}>
                  🎥 {isUz?"Hoziroq efir boshlash":"Начать эфир сейчас"}
                </Btn>
                <Btn dark={dark} variant="ghost" onClick={()=>{setShowVerify(false);setVerifyStep(0);}}>
                  {isUz?"Keyinroq":"Позже"}
                </Btn>
              </div>
            </div>
          )}
        </ModalSheet>
      )}
    </div>
  );
}
