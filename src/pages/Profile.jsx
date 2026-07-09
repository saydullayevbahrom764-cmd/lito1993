import { useState } from "react";
import { theme } from "../theme.js";
import { T, CATEGORIES } from "../translations.js";
import { formatPrice, timeAgo, DEMO_LISTINGS } from "../utils.js";
import { ModalSheet, Btn } from "../components/UI.jsx";

const G  = "#16A34A";
const GD = "#15803D";
const PINK = "#C2185B";

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
      background: th.card, borderRadius: 14, overflow: "hidden",
      border: `1px solid ${th.border}`, cursor: "pointer", position: "relative",
    }}>
      {/* Rasm */}
      <div style={{
        width: "100%", aspectRatio: "4/3", background: th.card2,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 44, overflow: "hidden", position: "relative",
      }}>
        {listing.photos?.length
          ? <img src={listing.photos[0]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          : <span>{cat?.emoji || "📦"}</span>}

        {/* Narx kelishiladi badge */}
        {listing.price === -1 && (
          <div style={{
            position:"absolute", top:8, left:8,
            background:"rgba(0,0,0,0.6)", borderRadius:6,
            padding:"3px 8px", fontSize:10, fontWeight:700, color:"#fff",
            display:"flex", alignItems:"center", gap:4,
          }}>⚡ {lang==="uz"?"Narx kelishiladi":"Договорная"}</div>
        )}

        {/* Boost badge */}
        {listing.boosted && (
          <div style={{
            position:"absolute", top:8, left:8,
            background:"#F59E0B", borderRadius:6,
            padding:"3px 8px", fontSize:10, fontWeight:700, color:"#fff",
          }}>🚀 {lang==="uz"?"Tez":"Топ"}</div>
        )}

        {/* Yurak */}
        <button onClick={e => { e.stopPropagation(); onToggleFav?.(listing.id); }} style={{
          position:"absolute", top:8, right:8, width:32, height:32,
          borderRadius:10, background:"rgba(0,0,0,0.35)", border:"none",
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer",
        }}>
          <span style={{ fontSize:16, color: isFav ? "#FF6B9D" : "#fff" }}>
            {isFav ? "❤️" : "🤍"}
          </span>
        </button>
      </div>

      {/* Ma'lumot */}
      <div style={{ padding:"10px 10px 12px" }}>
        <div style={{ fontSize:15, fontWeight:800, color:G, marginBottom:3 }}>{priceStr}</div>
        <div style={{ fontSize:13, fontWeight:500, color:th.text, marginBottom:6,
          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
          {listing.title}
        </div>
        <div style={{ fontSize:11, color:th.sub }}>{listing.city}</div>
        <div style={{ fontSize:11, color:th.sub }}>
          {new Date(listing.createdAt).toLocaleDateString(lang==="uz"?"uz-UZ":"ru-RU",
            { day:"numeric", month:"long" }).replace(" г.","")},&nbsp;
          {new Date(listing.createdAt).toLocaleTimeString([],{ hour:"2-digit", minute:"2-digit" })}
        </div>
      </div>
    </div>
  );
}


// ── MyAds (o'z sahifamdagi e'lonlar) ─────────────────
function MyAds({ lang, dark, ads, onOpen, onDelete, onBoost }) {
  const th = theme(dark);
  const tx = T[lang];
  const [tab, setTab] = useState("active");
  const active  = ads.filter(a => a.active !== false);
  const archive = ads.filter(a => a.active === false);
  const list    = tab === "active" ? active : archive;

  return (
    <div>
      <div style={{ display:"flex", gap:4, background:th.card2, borderRadius:12, padding:4, marginBottom:16 }}>
        {[["active", tx.activeAds||"Faol"], ["archive", tx.inactiveAds||"Arxiv"]].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)} style={{
            flex:1, padding:"10px", borderRadius:9, border:"none", cursor:"pointer",
            background: tab===v ? G : "transparent",
            color: tab===v ? "#fff" : th.sub, fontWeight:700, fontSize:13,
          }}>{l} ({v==="active" ? active.length : archive.length})</button>
        ))}
      </div>
      {list.map(ad => {
        const cat = CATEGORIES.find(c => c.id === ad.category);
        return (
          <div key={ad.id} style={{ background:th.card, borderRadius:14, marginBottom:10,
            border:`1px solid ${th.border}`, overflow:"hidden" }}>
            <div style={{ display:"flex", gap:12, padding:"12px 14px", cursor:"pointer" }}
              onClick={() => onOpen(ad)}>
              <div style={{ width:68, height:68, borderRadius:12, background:th.card2,
                flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:28, overflow:"hidden" }}>
                {ad.photos?.[0]
                  ? <img src={ad.photos[0]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  : cat?.emoji || "📦"}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:700, color:th.text, marginBottom:3,
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {ad.title}
                </div>
                <div style={{ fontSize:15, fontWeight:800, color:G, marginBottom:4 }}>
                  {ad.price===0 ? tx.free : ad.price===-1 ? tx.negotiable : `${formatPrice(ad.price)} ${tx.sum}`}
                </div>
                <div style={{ fontSize:11, color:th.sub }}>
                  👁️ {ad.views||0} · {timeAgo(ad.createdAt, lang)}
                </div>
              </div>
            </div>
            <div style={{ display:"flex", borderTop:`1px solid ${th.border}` }}>
              <button style={{ flex:1, padding:"10px", background:"none", border:"none",
                color:th.sub, fontSize:12, fontWeight:600, cursor:"pointer",
                borderRight:`1px solid ${th.border}` }}>
                ✏️ {tx.edit||"Tahrirlash"}
              </button>
              <button onClick={() => onBoost?.(ad)} style={{ flex:1, padding:"10px",
                background:"none", border:"none", color:"#F59E0B", fontSize:12,
                fontWeight:600, cursor:"pointer", borderRight:`1px solid ${th.border}` }}>
                🚀 {tx.boost||"Boost"}
              </button>
              <button onClick={() => onDelete(ad.id)} style={{ flex:1, padding:"10px",
                background:"none", border:"none", color:"#EF4444", fontSize:12,
                fontWeight:600, cursor:"pointer" }}>
                🗑️ {tx.delete||"O'chirish"}
              </button>
            </div>
          </div>
        );
      })}
      {list.length === 0 && (
        <div style={{ textAlign:"center", padding:"40px 20px", color:th.sub }}>
          <div style={{ fontSize:48, marginBottom:10 }}>📋</div>
          <div style={{ fontSize:15, color:th.text }}>
            {lang==="uz"?"E'lonlar yo'q":"Нет объявлений"}
          </div>
        </div>
      )}
    </div>
  );
}


// ── Boshqa foydalanuvchi profili (rasm 2 ko'rinishi) ──
function UserProfile({ lang, dark, user, listings, favIds, onOpen, onToggleFav, onBack, onShare }) {
  const th = theme(dark);
  const tx = T[lang];
  const [tab, setTab]           = useState("active");
  const [subscribed, setSubscribed] = useState(false);

  const active  = listings.filter(l => l.active !== false);
  const archive = listings.filter(l => l.active === false);
  const shown   = tab === "active" ? active : archive;

  const regDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(lang==="uz"?"uz-UZ":"ru-RU",
        { day:"numeric", month:"numeric", year:"2-digit" }).replace(" г.","")
    : "3.07.26";

  return (
    <div style={{ background:th.bg, minHeight:"100vh", paddingBottom:80 }}>
      {/* Top bar */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"50px 16px 12px", background:th.card,
        borderBottom:`1px solid ${th.border}`, position:"sticky", top:0, zIndex:50 }}>
        <button onClick={onBack} style={{ background:"none", border:"none",
          fontSize:22, cursor:"pointer", color:th.text, padding:"4px 8px 4px 0" }}>←</button>
        <div style={{ flex:1 }} />
        <button style={{ background:"none", border:"none", fontSize:22,
          cursor:"pointer", color:th.text }}>•••</button>
      </div>

      {/* Avatar + ism + sana */}
      <div style={{ padding:"20px 16px 0", background:th.card }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
          <div style={{ width:66, height:66, borderRadius:33, background:"#e5e7eb",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:30, flexShrink:0, overflow:"hidden", border:`2px solid ${th.border}` }}>
            {user.avatar
              ? <img src={user.avatar} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              : "👤"}
          </div>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:th.text }}>{user.name}</div>
            <div style={{ fontSize:13, color:th.sub, marginTop:3 }}>
              {lang==="uz"?"Ro'yxatdan o'tgan":"Зарегистрирован"} {regDate}
            </div>
          </div>
        </div>

        {/* Statistika: E'lonlar | Obunachilar | Reyting */}
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          {[
            { val: listings.length, label: lang==="uz"?"E'lonlar":"Объявления" },
            { val: user.followers||0, label: lang==="uz"?"Obunachilar":"Подписчики" },
            { val: user.rating||0, label: lang==="uz"?"Baholash":"Рейтинг",
              extra: <span style={{ fontSize:11, color:G, fontWeight:600, marginLeft:4 }}>
                {lang==="uz"?"Baholash >":"Оценить >"}</span>,
              icon: "⭐" },
          ].map((s,i) => (
            <div key={i} style={{ flex:1, background:th.card2, borderRadius:12,
              padding:"10px 8px", textAlign:"center", border:`1px solid ${th.border}` }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:3 }}>
                {s.icon && <span style={{ fontSize:14 }}>{s.icon}</span>}
                <span style={{ fontSize:17, fontWeight:800, color:th.text }}>{s.val}</span>
              </div>
              <div style={{ fontSize:11, color:th.sub, marginTop:2, display:"flex",
                alignItems:"center", justifyContent:"center", flexWrap:"wrap" }}>
                {s.label}{s.extra}
              </div>
            </div>
          ))}
        </div>

        {/* Obuna bo'lish + Ulashish */}
        <div style={{ display:"flex", gap:10, marginBottom:16 }}>
          <button onClick={() => setSubscribed(p => !p)} style={{
            flex:1, padding:"14px", borderRadius:14,
            background: subscribed ? th.card2 : PINK,
            border: subscribed ? `2px solid ${PINK}` : "none",
            color: subscribed ? PINK : "#fff",
            fontWeight:800, fontSize:15, cursor:"pointer",
            transition:"all 0.2s",
          }}>
            {subscribed
              ? (lang==="uz"?"Obunani bekor qilish":"Отписаться")
              : (lang==="uz"?"Obuna bo'lish":"Подписаться")}
          </button>
          <button onClick={() => {
            if (navigator.share) {
              navigator.share({ title: user.name, url: window.location.href });
            } else {
              navigator.clipboard?.writeText(window.location.href);
            }
          }} style={{
            width:50, height:50, borderRadius:14, background:th.card2,
            border:`1px solid ${th.border}`, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0,
          }}>🔗</button>
        </div>

        {/* Faol / Arxiv tabs */}
        <div style={{ display:"flex", borderBottom:`2px solid ${th.border}` }}>
          {[
            ["active",  lang==="uz"?"Faol":"Активные",  active.length],
            ["archive", lang==="uz"?"Arxiv":"Архив",    archive.length],
          ].map(([v,l,cnt]) => (
            <button key={v} onClick={() => setTab(v)} style={{
              flex:1, padding:"12px 0", background:"none", border:"none",
              cursor:"pointer", fontWeight: tab===v ? 800 : 500,
              fontSize:14, color: tab===v ? th.text : th.sub,
              borderBottom: tab===v ? `2px solid ${th.text}` : "2px solid transparent",
              marginBottom: -2, display:"flex", alignItems:"center", justifyContent:"center", gap:6,
            }}>
              {l}
              {cnt > 0 && (
                <span style={{ background: tab===v ? th.text : th.sub,
                  color: tab===v ? th.card : th.card,
                  width:22, height:22, borderRadius:11,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:12, fontWeight:800 }}>{cnt}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* E'lonlar grid */}
      <div style={{ padding:"12px 12px 20px" }}>
        {shown.length > 0 ? (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {shown.map(l => (
              <ListingCard2 key={l.id} listing={l} lang={lang} dark={dark}
                onOpen={onOpen}
                isFav={favIds?.includes(l.id)}
                onToggleFav={onToggleFav}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign:"center", padding:"50px 20px", color:th.sub }}>
            <div style={{ fontSize:44, marginBottom:10 }}>📋</div>
            <div style={{ fontSize:15, color:th.text }}>
              {lang==="uz"?"E'lonlar yo'q":"Объявлений нет"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// ── O'z profilim (settings, myads, favorites ...) ────
export default function Profile({
  lang, dark, currentUser, onLogin, onLangChange, onDarkToggle,
  myListings, onOpenListing, onAddListing, favIds, onOpenFav,
  onStartLive, onVerified,
  onDashboard, onOffers, onMahalla, onGroupBuy, onGamification,
  xp,
  // boshqa user profili uchun (ListingDetail'dan "Sotuvchiga o'tish")
  viewUser, onCloseUserProfile,
}) {
  const th = theme(dark);
  const tx = T[lang];
  const [view, setView]             = useState("main");
  const [showVerify, setShowVerify] = useState(false);
  const [verifyStep, setVerifyStep] = useState(0);
  const isVerified = currentUser?.verified || false;
  const hGrad = `linear-gradient(135deg,${G},${GD})`;

  // ── Boshqa userni profili ko'rsatish ──────────────────
  if (viewUser) {
    const userListings = DEMO_LISTINGS.filter(l => l.seller?.id === viewUser.id);
    return (
      <UserProfile
        lang={lang} dark={dark}
        user={viewUser}
        listings={userListings}
        favIds={favIds}
        onOpen={onOpenListing}
        onToggleFav={id => {}}
        onBack={onCloseUserProfile || (() => {})}
      />
    );
  }

  // ── Sub-views ─────────────────────────────────────────
  if (view === "myads") return (
    <div style={{ background:th.bg, minHeight:"100vh", paddingBottom:80 }}>
      <div style={{ background:hGrad, padding:"50px 16px 16px" }}>
        <button onClick={() => setView("main")} style={{ background:"rgba(255,255,255,0.2)",
          border:"none", borderRadius:10, width:36, height:36, color:"#fff",
          fontSize:18, cursor:"pointer", marginBottom:10 }}>←</button>
        <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>{tx.myAds}</div>
      </div>
      <div style={{ padding:16 }}>
        <Btn dark={dark} onClick={onAddListing} style={{ marginBottom:16, background:G }}>
          + {lang==="uz"?"Yangi e'lon":"Добавить объявление"}
        </Btn>
        <MyAds lang={lang} dark={dark} ads={myListings||[]}
          onOpen={onOpenListing} onDelete={() => {}} />
      </div>
    </div>
  );

  if (view === "favorites") return (
    <div style={{ background:th.bg, minHeight:"100vh", paddingBottom:80 }}>
      <div style={{ background:hGrad, padding:"50px 16px 16px" }}>
        <button onClick={() => setView("main")} style={{ background:"rgba(255,255,255,0.2)",
          border:"none", borderRadius:10, width:36, height:36, color:"#fff",
          fontSize:18, cursor:"pointer", marginBottom:10 }}>←</button>
        <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>❤️ {tx.favorites}</div>
      </div>
      <div style={{ padding:16 }}>
        {DEMO_LISTINGS.filter(l => favIds?.includes(l.id)).map(l => {
          const cat = CATEGORIES.find(c => c.id === l.category);
          return (
            <div key={l.id} onClick={() => onOpenFav(l)} style={{
              background:th.card, borderRadius:14, marginBottom:10,
              border:`1px solid ${th.border}`, display:"flex",
              overflow:"hidden", cursor:"pointer" }}>
              <div style={{ width:88, height:88, background:th.card2,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:30, flexShrink:0, overflow:"hidden" }}>
                {l.photos?.[0]
                  ? <img src={l.photos[0]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  : cat?.emoji}
              </div>
              <div style={{ flex:1, padding:"10px 12px" }}>
                <div style={{ fontSize:14, fontWeight:600, color:th.text, marginBottom:4 }}>{l.title}</div>
                <div style={{ fontSize:15, fontWeight:800, color:G }}>
                  {l.price===0 ? tx.free : l.price===-1 ? tx.negotiable : `${formatPrice(l.price)} ${tx.sum}`}
                </div>
                <div style={{ fontSize:11, color:th.sub, marginTop:4 }}>📍 {l.city}</div>
              </div>
            </div>
          );
        })}
        {!favIds?.length && (
          <div style={{ textAlign:"center", padding:"60px 0", color:th.sub }}>
            <div style={{ fontSize:52, marginBottom:12 }}>🤍</div>
            <div style={{ fontWeight:700, color:th.text }}>
              {lang==="uz"?"Saqlangan e'lonlar yo'q":"Нет избранных"}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (view === "settings") return (
    <div style={{ background:th.bg, minHeight:"100vh", paddingBottom:80 }}>
      <div style={{ background:hGrad, padding:"50px 16px 16px" }}>
        <button onClick={() => setView("main")} style={{ background:"rgba(255,255,255,0.2)",
          border:"none", borderRadius:10, width:36, height:36, color:"#fff",
          fontSize:18, cursor:"pointer", marginBottom:10 }}>←</button>
        <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>⚙️ {tx.settings}</div>
      </div>
      <div style={{ padding:16 }}>
        <div style={{ background:th.card, borderRadius:16, overflow:"hidden",
          border:`1px solid ${th.border}`, marginBottom:16 }}>
          <div style={{ padding:"11px 16px", fontSize:11, fontWeight:700,
            color:th.sub, borderBottom:`1px solid ${th.border}` }}>
            {lang==="uz"?"KO'RINISH":"ВНЕШНИЙ ВИД"}
          </div>
          <div onClick={onDarkToggle} style={{ padding:"15px 16px",
            display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}>
            <span style={{ fontSize:14, color:th.text }}>{dark?"☀️":"🌙"} {tx.darkMode}</span>
            <div style={{ width:46, height:26, borderRadius:13,
              background:dark?G:th.border, position:"relative", transition:"background 0.3s" }}>
              <div style={{ position:"absolute", top:3, left:dark?23:3, width:20, height:20,
                borderRadius:10, background:"#fff", transition:"left 0.3s",
                boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }} />
            </div>
          </div>
        </div>
        <div style={{ background:th.card, borderRadius:16, overflow:"hidden",
          border:`1px solid ${th.border}`, marginBottom:16 }}>
          <div style={{ padding:"11px 16px", fontSize:11, fontWeight:700,
            color:th.sub, borderBottom:`1px solid ${th.border}` }}>TIL / ЯЗЫК</div>
          <div style={{ padding:"12px 16px", display:"flex", gap:10 }}>
            {[["uz","🇺🇿 O'zbekcha"],["ru","🇷🇺 Русский"]].map(([l,label]) => (
              <button key={l} onClick={() => onLangChange(l)} style={{
                flex:1, padding:"11px 8px", borderRadius:12, cursor:"pointer",
                border:`2px solid ${lang===l?G:th.border}`,
                background:lang===l?G+"20":th.card,
                color:lang===l?G:th.text, fontWeight:700, fontSize:13,
              }}>{label}</button>
            ))}
          </div>
        </div>
        <div onClick={() => onLogin(null)} style={{ background:th.card, borderRadius:16,
          padding:"15px 16px", border:`1px solid ${th.border}`, cursor:"pointer",
          display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"#EF444420",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🚪</div>
          <span style={{ fontSize:15, color:"#EF4444", fontWeight:600 }}>{tx.logout}</span>
        </div>
      </div>
    </div>
  );

  if (view === "about") return (
    <div style={{ background:th.bg, minHeight:"100vh", paddingBottom:80 }}>
      <div style={{ background:hGrad, padding:"50px 16px 28px", textAlign:"center" }}>
        <button onClick={() => setView("main")} style={{ background:"rgba(255,255,255,0.2)",
          border:"none", borderRadius:10, width:36, height:36, color:"#fff",
          fontSize:18, cursor:"pointer", display:"block", marginBottom:16 }}>←</button>
        <div style={{ width:68, height:68, borderRadius:20, background:"rgba(255,255,255,0.2)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:34, margin:"0 auto 10px" }}>🛒</div>
        <div style={{ color:"#fff", fontWeight:900, fontSize:22 }}>OsonTop</div>
        <div style={{ color:"rgba(255,255,255,0.7)", fontSize:12, marginTop:4 }}>v2.0.0</div>
      </div>
      <div style={{ padding:16 }}>
        {[
          ["📦","Version","2.0.0"],
          ["👨‍💻",lang==="uz"?"Ishlab chiquvchi":"Разработчик","OsonTop Team"],
          ["📧","Email","support@osontop.uz"],
          ["📱","Telegram","@osontop_uz"],
        ].map(([icon,label,val],i) => (
          <div key={i} style={{ background:th.card, borderRadius:14, padding:"13px 16px",
            marginBottom:8, display:"flex", justifyContent:"space-between",
            alignItems:"center", border:`1px solid ${th.border}` }}>
            <span style={{ fontSize:14, color:th.text }}>{icon} {label}</span>
            <span style={{ fontSize:13, color:th.sub, fontWeight:600 }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );


  // ── O'z profilim asosiy ko'rinishi ───────────────────
  const lvl = xp>=5000?7:xp>=2000?6:xp>=1000?5:xp>=600?4:xp>=300?3:xp>=100?2:1;

  // Agar kirish qilinmagan bo'lsa
  if (!currentUser) return (
    <div style={{ background:th.bg, minHeight:"100vh" }}>
      <div style={{ background:hGrad, padding:"50px 16px 28px", textAlign:"center" }}>
        <div style={{ fontSize:60, marginBottom:10 }}>👤</div>
        <div style={{ color:"#fff", fontWeight:800, fontSize:20, marginBottom:6 }}>
          {lang==="uz"?"Profilim":"Мой профиль"}
        </div>
        <div style={{ color:"rgba(255,255,255,0.7)", fontSize:14 }}>
          {lang==="uz"?"Kirish qilib barcha imkoniyatlardan foydalaning"
            :"Войдите, чтобы пользоваться всеми функциями"}
        </div>
      </div>
      <div style={{ padding:20 }}>
        <Btn dark={dark} onClick={onLogin} style={{ background:G, marginBottom:12 }}>
          {lang==="uz"?"Kirish / Ro'yxatdan o'tish":"Войти / Зарегистрироваться"}
        </Btn>
      </div>
    </div>
  );

  // Menyu elementlari
  const menuItems = [
    { icon:"📋", label:tx.myAds,      color:G,         action:()=>setView("myads") },
    { icon:"❤️", label:tx.favorites,  color:"#EF4444", action:()=>setView("favorites") },
    { icon:"🤝", label:lang==="uz"?"Narx takliflarim":"Мои предложения", color:"#10B981", action:()=>onOffers?.() },
    { icon:"📊", label:lang==="uz"?"Dashboard":"Дашборд", color:"#8B5CF6", action:()=>onDashboard?.() },
    { icon:"🏘️", label:"Mahalla",     color:"#10B981", action:()=>onMahalla?.() },
    { icon:"🤝", label:lang==="uz"?"Birga olamiz":"Купим вместе", color:"#3B82F6", action:()=>onGroupBuy?.() },
    { icon:"🏆", label:lang==="uz"?`Reyting · ${xp} XP`:`Рейтинг · ${xp} XP`, color:"#F59E0B", action:()=>onGamification?.() },
    { icon:"✅", label:tx.verifyId,   color:"#1DA1F2", action:()=>setShowVerify(true) },
    { icon:"🎥", label:tx.liveStream||"Jonli efir", color:"#EF4444",
      action:()=>{ if(isVerified) onStartLive?.(); else setShowVerify(true); } },
    { icon:"⚙️", label:tx.settings,   color:"#6B7280", action:()=>setView("settings") },
    { icon:"ℹ️", label:tx.about,      color:"#3B82F6", action:()=>setView("about") },
  ];

  // O'z profilimni rasm 2 ko'rinishida ko'rsatish
  const myRegDate = currentUser.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString(lang==="uz"?"uz-UZ":"ru-RU",
        { day:"numeric", month:"numeric", year:"2-digit" }).replace(" г.","")
    : new Date().toLocaleDateString(lang==="uz"?"uz-UZ":"ru-RU",
        { day:"numeric", month:"numeric", year:"2-digit" });

  return (
    <div style={{ background:th.bg, minHeight:"100vh", paddingBottom:80 }}>
      {/* Top bar */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"50px 16px 12px", background:th.card,
        borderBottom:`1px solid ${th.border}`, position:"sticky", top:0, zIndex:50 }}>
        <div style={{ fontSize:17, fontWeight:800, color:th.text }}>
          {lang==="uz"?"Profilim":"Мой профиль"}
        </div>
        <button onClick={() => setView("settings")} style={{ background:"none", border:"none",
          fontSize:22, cursor:"pointer", color:th.text }}>⚙️</button>
      </div>

      {/* Avatar + ism + sana */}
      <div style={{ padding:"20px 16px 0", background:th.card }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
          <div style={{ width:66, height:66, borderRadius:33, background:"#e5e7eb",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:30, flexShrink:0, border:`2px solid ${th.border}` }}>
            {currentUser.name?.[0] || "👤"}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ fontSize:18, fontWeight:800, color:th.text }}>{currentUser.name}</div>
              {isVerified && (
                <span style={{ background:"#1DA1F2", borderRadius:6, padding:"2px 7px",
                  fontSize:10, fontWeight:700, color:"#fff" }}>✓ {tx.verified}</span>
              )}
            </div>
            <div style={{ fontSize:13, color:th.sub, marginTop:3 }}>
              {lang==="uz"?"Ro'yxatdan o'tgan":"Зарегистрирован"} {myRegDate}
            </div>
            {xp > 0 && (
              <div style={{ fontSize:11, color:G, fontWeight:700, marginTop:3 }}>
                Lv.{lvl} · {xp} XP
              </div>
            )}
          </div>
        </div>

        {/* Statistika */}
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          {[
            { val: myListings?.length||0, label: lang==="uz"?"E'lonlar":"Объявления" },
            { val: currentUser.followers||0, label: lang==="uz"?"Obunachilar":"Подписчики" },
            { val: (currentUser.rating||0).toFixed(1), label: lang==="uz"?"Baholash":"Рейтинг", icon:"⭐" },
          ].map((s,i) => (
            <div key={i} style={{ flex:1, background:th.card2, borderRadius:12,
              padding:"10px 8px", textAlign:"center", border:`1px solid ${th.border}` }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:3 }}>
                {s.icon && <span style={{ fontSize:14 }}>{s.icon}</span>}
                <span style={{ fontSize:17, fontWeight:800, color:th.text }}>{s.val}</span>
              </div>
              <div style={{ fontSize:11, color:th.sub, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* XP progress */}
        {xp >= 0 && (
          <div style={{ marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontSize:11, color:th.sub, fontWeight:600 }}>
                {lang==="uz"?`Daraja ${lvl}`:`Уровень ${lvl}`}
              </span>
              <span style={{ fontSize:11, color:th.sub }}>{xp} XP</span>
            </div>
            <div style={{ height:5, background:th.border, borderRadius:3, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${Math.min(100,(xp%300)/3)}%`,
                background:G, borderRadius:3, transition:"width 0.5s" }} />
            </div>
          </div>
        )}

        {/* Jonli efir CTA */}
        {isVerified && (
          <div onClick={() => onStartLive?.()} style={{
            background:"linear-gradient(135deg,#EF4444,#DC2626)",
            borderRadius:12, padding:"12px 16px", marginBottom:16,
            display:"flex", alignItems:"center", gap:12,
            cursor:"pointer", boxShadow:"0 4px 14px rgba(239,68,68,0.3)" }}>
            <span style={{ fontSize:22 }}>🎥</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:800, color:"#fff" }}>
                {lang==="uz"?"Jonli efir boshlash":"Начать прямой эфир"}
              </div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.75)" }}>
                {lang==="uz"?"Mahsulotlaringizni ko'rsating":"Показывайте товары в эфире"}
              </div>
            </div>
            <span style={{ background:"rgba(255,255,255,0.2)", borderRadius:8,
              padding:"3px 10px", color:"#fff", fontSize:11, fontWeight:700 }}>LIVE →</span>
          </div>
        )}

        {/* MyID verify banner */}
        {!isVerified && (
          <div onClick={() => setShowVerify(true)} style={{
            background:G+"12", borderRadius:12, padding:"12px 16px",
            border:`1px solid ${G}30`, marginBottom:16,
            display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
            <span style={{ fontSize:22 }}>✅</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:G }}>{tx.verifyId}</div>
              <div style={{ fontSize:12, color:th.sub }}>{tx.verifyIdDesc}</div>
            </div>
            <span style={{ fontSize:13, color:G }}>→</span>
          </div>
        )}

        {/* Menyu */}
        <div style={{ background:th.card, borderRadius:16, overflow:"hidden",
          border:`1px solid ${th.border}`, marginBottom:16 }}>
          {menuItems.map((item,i,arr) => (
            <div key={i} onClick={item.action} style={{
              display:"flex", alignItems:"center", gap:14, padding:"14px 16px",
              borderBottom:i<arr.length-1?`1px solid ${th.border}`:"none", cursor:"pointer" }}>
              <div style={{ width:36, height:36, borderRadius:10,
                background:item.color+"20",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:18, flexShrink:0 }}>{item.icon}</div>
              <span style={{ flex:1, fontSize:14, color:th.text }}>{item.label}</span>
              {item.icon==="🎥" && !isVerified && (
                <span style={{ fontSize:10, background:"#F59E0B20", color:"#F59E0B",
                  padding:"2px 7px", borderRadius:6, fontWeight:700 }}>
                  {lang==="uz"?"Tasdiqlov kerak":"Нужна верификация"}
                </span>
              )}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke={th.sub} strokeWidth="2" strokeLinecap="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* MyID Verify Modal */}
      {showVerify && (
        <ModalSheet dark={dark} onClose={() => { setShowVerify(false); setVerifyStep(0); }}>
          {verifyStep===0 && (
            <div>
              <div style={{ textAlign:"center", marginBottom:18 }}>
                <div style={{ fontSize:50, marginBottom:8 }}>✅</div>
                <div style={{ fontSize:17, fontWeight:800, color:th.text, marginBottom:6 }}>
                  MyID Verification
                </div>
                <div style={{ fontSize:13, color:th.sub, lineHeight:1.6 }}>
                  {lang==="uz"?"Live Stream va Premium funksiyalardan foydalaning"
                    :"Получите доступ к Live Stream и Premium функциям"}
                </div>
              </div>
              {[
                { icon:"🪪", text:lang==="uz"?"Passport yoki ID kartangizni tayyorlang":"Подготовьте паспорт или ID карту" },
                { icon:"📸", text:lang==="uz"?"Selfie suratga oling":"Сделайте селфи" },
                { icon:"✅", text:lang==="uz"?"1 daqiqada tekshiriladi":"Проверяется за 1 минуту" },
                { icon:"🎥", text:lang==="uz"?"Live Stream ochiladi":"Откроется Live Stream" },
              ].map((s,i) => (
                <div key={i} style={{ display:"flex", gap:12, padding:"10px 0",
                  borderBottom:i<3?`1px solid ${th.border}`:"none", alignItems:"center" }}>
                  <span style={{ fontSize:20 }}>{s.icon}</span>
                  <span style={{ fontSize:13, color:th.text }}>{s.text}</span>
                </div>
              ))}
              <div style={{ display:"flex", gap:10, marginTop:18 }}>
                <Btn dark={dark} variant="ghost" onClick={() => { setShowVerify(false); setVerifyStep(0); }} style={{ flex:1 }}>
                  {lang==="uz"?"Keyinroq":"Позже"}
                </Btn>
                <Btn dark={dark} onClick={() => setVerifyStep(1)} style={{ flex:2, background:G }}>
                  {lang==="uz"?"Boshlash":"Начать"}
                </Btn>
              </div>
            </div>
          )}
          {verifyStep===1 && (
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:50, marginBottom:8 }}>📸</div>
              <div style={{ fontSize:17, fontWeight:800, color:th.text, marginBottom:6 }}>
                {lang==="uz"?"Selfie oling":"Сделайте селфи"}
              </div>
              <div style={{ width:"80%", aspectRatio:"4/3", background:th.card2,
                borderRadius:14, margin:"0 auto 18px",
                display:"flex", alignItems:"center", justifyContent:"center",
                border:`2px dashed ${th.border}`, cursor:"pointer" }}>
                <div>
                  <div style={{ fontSize:38, marginBottom:4 }}>📷</div>
                  <div style={{ fontSize:11, color:th.sub }}>{lang==="uz"?"Kamera":"Камера"}</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <Btn dark={dark} variant="ghost" onClick={() => setVerifyStep(0)} style={{ flex:1 }}>←</Btn>
                <Btn dark={dark} onClick={() => { setVerifyStep(2); onVerified?.(); }}
                  style={{ flex:2, background:G }}>
                  {lang==="uz"?"MyID ga yuborish":"Отправить в MyID"}
                </Btn>
              </div>
            </div>
          )}
          {verifyStep===2 && (
            <div style={{ textAlign:"center", padding:"10px 0" }}>
              <div style={{ fontSize:62, marginBottom:12 }}>🎉</div>
              <div style={{ fontSize:18, fontWeight:800, color:G, marginBottom:8 }}>
                {lang==="uz"?"Tabriklaymiz!":"Поздравляем!"}
              </div>
              <div style={{ fontSize:13, color:th.sub, marginBottom:22, lineHeight:1.6 }}>
                {lang==="uz"?"Live Stream va premium funksiyalar ochildi 🎥"
                  :"Открыты Live Stream и премиум функции 🎥"}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <Btn dark={dark}
                  onClick={() => { setShowVerify(false); setVerifyStep(0); onStartLive?.(); }}
                  style={{ background:"#EF4444" }}>
                  🎥 {lang==="uz"?"Hoziroq efir boshlash":"Начать эфир сейчас"}
                </Btn>
                <Btn dark={dark} variant="ghost"
                  onClick={() => { setShowVerify(false); setVerifyStep(0); }}>
                  {lang==="uz"?"Keyinroq":"Позже"}
                </Btn>
              </div>
            </div>
          )}
        </ModalSheet>
      )}
    </div>
  );
}
