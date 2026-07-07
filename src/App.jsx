import { useState, useEffect } from "react";
import { theme } from "./theme.js";
import { T } from "./translations.js";
import { loadLS, saveLS } from "./utils.js";
import Auth from "./pages/Auth.jsx";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import AddListing from "./pages/AddListing.jsx";
import Messages from "./pages/Messages.jsx";
import Profile from "./pages/Profile.jsx";
import MapView from "./pages/MapView.jsx";
import ListingDetail from "./pages/ListingDetail.jsx";
import { LiveBroadcaster, LiveViewer } from "./pages/LiveStream.jsx";

const G = "#16A34A";
const GD = "#15803D";

// ── BOTTOM NAV ────────────────────────────────────────
function BottomNav({ active, onChange, dark, lang, unread }) {
  const th = theme(dark);
  const tx = T[lang];
  const tabs = [
    { id:"home",     icon:"🏠", label:tx.home },
    { id:"search",   icon:"🔍", label:tx.search },
    { id:"add",      icon:null, label:tx.addAd },
    { id:"messages", icon:"💬", label:tx.messages },
    { id:"profile",  icon:"👤", label:tx.profile },
  ];
  return (
    <div style={{
      position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
      width:"100%", maxWidth:430, background:th.card,
      borderTop:`1px solid ${th.border}`,
      display:"flex", alignItems:"flex-end",
      padding:"8px 0 20px", zIndex:100,
      boxShadow:"0 -4px 20px rgba(0,0,0,0.08)",
    }}>
      {tabs.map(tab => {
        const isActive = active === tab.id;
        // ── Markaziy + tugmasi ──
        if (tab.id === "add") return (
          <div key="add" style={{ flex:1, display:"flex", justifyContent:"center", alignItems:"flex-end" }}>
            <button
              onClick={() => onChange("add")}
              style={{
                width:54, height:54, borderRadius:27,
                background:`linear-gradient(135deg,${G},${GD})`,
                border:"none", cursor:"pointer", marginBottom:4,
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:`0 4px 18px ${G}70`,
                transition:"transform 0.15s",
              }}
              onMouseDown={e => e.currentTarget.style.transform="scale(0.93)"}
              onMouseUp={e => e.currentTarget.style.transform="scale(1)"}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </div>
        );
        return (
          <button key={tab.id} onClick={() => onChange(tab.id)} style={{
            flex:1, background:"none", border:"none", cursor:"pointer",
            display:"flex", flexDirection:"column", alignItems:"center",
            gap:3, padding:"4px 0", position:"relative",
          }}>
            <span style={{ fontSize:22, lineHeight:1 }}>{tab.icon}</span>
            <span style={{
              fontSize:10, fontWeight:isActive ? 700 : 500,
              color: isActive ? G : th.sub,
            }}>{tab.label}</span>
            {isActive && (
              <div style={{
                position:"absolute", bottom:-2, left:"50%",
                transform:"translateX(-50%)",
                width:20, height:3, borderRadius:2, background:G,
              }} />
            )}
            {tab.id==="messages" && unread > 0 && (
              <div style={{
                position:"absolute", top:0, right:"20%",
                width:16, height:16, borderRadius:8, background:"#EF4444",
                display:"flex", alignItems:"center", justifyContent:"center",
                border:`2px solid ${th.card}`,
              }}>
                <span style={{ fontSize:9, fontWeight:800, color:"#fff" }}>{unread}</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── CONFETTI ──────────────────────────────────────────
function Confetti({ show }) {
  if (!show) return null;
  const colors = [G,"#FFB400","#3B82F6","#EF4444","#8B5CF6","#F59E0B"];
  return (
    <div style={{ position:"fixed", inset:0, zIndex:9999, pointerEvents:"none", overflow:"hidden" }}>
      {Array.from({length:28}).map((_,i) => (
        <div key={i} style={{
          position:"absolute", top:-10, left:`${Math.random()*100}%`,
          width: Math.random()*8+4, height: Math.random()*8+4,
          borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          background:colors[i%colors.length],
          animation:`confettiFall ${1+Math.random()*0.8}s ${Math.random()*0.6}s ease-in forwards`,
        }} />
      ))}
      <style>{`@keyframes confettiFall{
        0%{transform:translateY(0) rotate(0deg);opacity:1}
        100%{transform:translateY(100vh) rotate(720deg);opacity:0}
      }`}</style>
    </div>
  );
}

// ── TOAST ─────────────────────────────────────────────
function Toast({ msg, type }) {
  if (!msg) return null;
  const bg = type==="success" ? G : type==="error" ? "#EF4444" : "#3B82F6";
  return (
    <div style={{
      position:"fixed", top:60, left:"50%", transform:"translateX(-50%)",
      background:bg, color:"#fff", padding:"12px 20px", borderRadius:12,
      fontSize:14, fontWeight:600, zIndex:9998, maxWidth:340,
      textAlign:"center", boxShadow:"0 4px 20px rgba(0,0,0,0.25)",
      animation:"slideDown 0.3s ease",
    }}>
      {msg}
      <style>{`@keyframes slideDown{
        from{transform:translateX(-50%) translateY(-10px);opacity:0}
        to{transform:translateX(-50%) translateY(0);opacity:1}
      }`}</style>
    </div>
  );
}

// ── ADD SHEET — mahsulot/xizmat tanlash ───────────────
function AddSheet({ dark, lang, onClose, onSelectProduct, onSelectService }) {
  const th = theme(dark);
  const options = [
    { icon:"📦", label: lang==="uz"?"Mahsulot sotish":"Продать товар",
      sub: lang==="uz"?"Yangi yoki ishlatilgan narsa":"Новый или б/у товар",
      color:"#3B82F6", action: onSelectProduct },
    { icon:"🔧", label: lang==="uz"?"Xizmat ko'rsatish":"Предложить услугу",
      sub: lang==="uz"?"Ta'mirlash, tozalash va h.k.":"Ремонт, уборка и др.",
      color:"#8B5CF6", action: onSelectProduct },
    { icon:"🚗", label: lang==="uz"?"Transport":"Транспорт",
      sub: lang==="uz"?"Avtomobil, moto, elektr":"Авто, мото, электро",
      color:"#F59E0B", action: onSelectProduct },
    { icon:"🏠", label: lang==="uz"?"Ko'chmas mulk":"Недвижимость",
      sub: lang==="uz"?"Sotish yoki ijara":"Продажа или аренда",
      color:"#10B981", action: onSelectProduct },
    { icon:"💼", label: lang==="uz"?"Ish o'rni":"Вакансия",
      sub: lang==="uz"?"Xodim izlayman":"Ищу сотрудника",
      color:G, action: onSelectProduct },
    { icon:"🎥", label: lang==="uz"?"Jonli efir":"Прямой эфир",
      sub: lang==="uz"?"Live stream orqali sot":"Продавай через стрим",
      color:"#EF4444", action: onSelectService },
  ];

  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, zIndex:400,
      background:"rgba(0,0,0,0.55)",
      display:"flex", alignItems:"flex-end",
      maxWidth:430, margin:"0 auto",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:th.card, borderRadius:"20px 20px 0 0",
        width:"100%", padding:"0 0 32px",
      }}>
        <div style={{ width:36, height:4, background:th.border2, borderRadius:2, margin:"12px auto 0" }} />
        <div style={{ padding:"16px 20px 12px" }}>
          <div style={{ fontSize:17, fontWeight:800, color:th.text, marginBottom:4 }}>
            {lang==="uz" ? "Nima qo'shmoqchisiz?" : "Что хотите добавить?"}
          </div>
          <div style={{ fontSize:13, color:th.sub }}>
            {lang==="uz" ? "Kategoriyani tanlang" : "Выберите категорию"}
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, padding:"0 16px" }}>
          {options.map((opt, i) => (
            <button key={i} onClick={() => { opt.action(); onClose(); }} style={{
              background:th.card2, border:`1.5px solid ${th.border}`,
              borderRadius:16, padding:"16px 12px", cursor:"pointer",
              display:"flex", flexDirection:"column", alignItems:"flex-start", gap:8,
              textAlign:"left", transition:"border-color 0.15s",
            }}>
              <div style={{
                width:42, height:42, borderRadius:12,
                background:opt.color+"20",
                display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:22,
              }}>{opt.icon}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:th.text, marginBottom:2 }}>{opt.label}</div>
                <div style={{ fontSize:11, color:th.sub, lineHeight:1.4 }}>{opt.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────
export default function App() {
  const saved = loadLS();

  const [dark, setDark] = useState(saved?.dark ?? false);
  const [lang, setLang] = useState(saved?.lang ?? "uz");
  const [auth, setAuth] = useState(saved?.auth ?? null);
  const [isGuest, setIsGuest] = useState(saved?.isGuest ?? false);
  const [tab, setTab] = useState("home");
  const [selectedListing, setSelectedListing] = useState(null);
  // Fix #2: showAdd endi AddSheet + AddListing ikki bosqichli
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showAddListing, setShowAddListing] = useState(false);
  // Live stream states
  const [showLiveBroadcast, setShowLiveBroadcast] = useState(false);
  const [showLiveViewer, setShowLiveViewer] = useState(null);
  const [myListings, setMyListings] = useState(saved?.myListings ?? []);
  const [favIds, setFavIds] = useState(saved?.favIds ?? []);
  const [toast, setToast] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [searchCat, setSearchCat] = useState("all");
  const [isVerified, setIsVerified] = useState(saved?.isVerified ?? false);
  const [unreadCount] = useState(2);

  const th = theme(dark);

  // Persist
  useEffect(() => {
    saveLS({ dark, lang, auth, isGuest, myListings, favIds, isVerified });
  }, [dark, lang, auth, isGuest, myListings, favIds, isVerified]);

  const showToast = (msg, type="success", ms=2800) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), ms);
  };

  const toggleFav = (id) => {
    setFavIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleAuthDone = (userData) => {
    setAuth({ ...userData, uid: "user_" + Date.now() });
    setIsGuest(false);
    showToast(lang==="uz" ? "Xush kelibsiz! 👋" : "Добро пожаловать! 👋", "success");
  };

  const handleGuest = () => { setIsGuest(true); setAuth(null); };

  // Fix #2: + tugma bosilganda AddSheet ochiladi
  const handleTabChange = (t) => {
    if (t === "add") {
      if (!auth && !isGuest) {
        showToast(
          lang==="uz" ? "E'lon berish uchun kirish kerak" : "Войдите для подачи объявления",
          "info"
        );
        return;
      }
      setShowAddSheet(true);
      return;
    }
    setTab(t);
  };

  const handleAddDone = (listing) => {
    setMyListings(prev => [listing, ...prev]);
    setShowAddListing(false);
    setShowAddSheet(false);
    setTab("profile");
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2500);
    showToast(T[lang].adPublished, "success");
  };

  const handleOpenListing = (listing) => setSelectedListing(listing);

  const handleChat = () => {
    setSelectedListing(null);
    setTab("messages");
  };

  const handleCategorySelect = (catId) => {
    setSearchCat(catId);
    setTab("search");
  };

  const handleStartLive = () => {
    if (!isVerified) {
      showToast(
        lang==="uz"
          ? "Jonli efir uchun avval MyID tasdiqlovidan o'ting"
          : "Для эфира сначала пройдите верификацию MyID",
        "info"
      );
      return;
    }
    setShowLiveBroadcast(true);
  };

  // ── AUTH SCREEN ───────────────────────────────────────
  if (!auth && !isGuest) {
    return (
      <div style={{ maxWidth:430, margin:"0 auto", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" }}>
        <Auth
          lang={lang} dark={dark}
          onDone={handleAuthDone}
          onGuest={handleGuest}
          onLangChange={setLang}
        />
      </div>
    );
  }

  return (
    <div style={{
      fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
      background:th.bg, minHeight:"100vh",
      maxWidth:430, margin:"0 auto", position:"relative",
    }}>
      <Confetti show={confetti} />
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* ── AddSheet — kategoriya tanlash ── */}
      {showAddSheet && !showAddListing && (
        <AddSheet
          dark={dark} lang={lang}
          onClose={() => setShowAddSheet(false)}
          onSelectProduct={() => setShowAddListing(true)}
          onSelectService={() => {
            if (!isVerified) {
              setShowAddSheet(false);
              setTab("profile");
              showToast(
                lang==="uz" ? "Avval MyID tasdiqlovidan o'ting" : "Сначала пройдите верификацию",
                "info"
              );
            } else {
              setShowAddSheet(false);
              setShowLiveBroadcast(true);
            }
          }}
        />
      )}

      {/* ── AddListing — to'liq form (fullscreen overlay) ── */}
      {showAddListing && (
        <AddListing
          lang={lang} dark={dark}
          currentUser={auth}
          onDone={handleAddDone}
          onCancel={() => { setShowAddListing(false); setShowAddSheet(false); }}
        />
      )}

      {/* ── Live Broadcast ── */}
      {showLiveBroadcast && (
        <LiveBroadcaster
          lang={lang} dark={dark}
          currentUser={auth}
          myListings={myListings}
          onClose={() => setShowLiveBroadcast(false)}
        />
      )}

      {/* ── Live Viewer ── */}
      {showLiveViewer && (
        <LiveViewer
          stream={showLiveViewer}
          lang={lang} dark={dark}
          onClose={() => setShowLiveViewer(null)}
        />
      )}

      {/* ── Listing detail overlay ── */}
      {selectedListing && !showAddListing && (
        <ListingDetail
          listing={selectedListing} lang={lang} dark={dark}
          currentUser={auth}
          isFav={favIds.includes(selectedListing.id)}
          onToggleFav={toggleFav}
          onBack={() => setSelectedListing(null)}
          onChat={handleChat}
        />
      )}

      {/* ── TABS ── */}
      {tab === "home" && (
        <Home
          lang={lang} dark={dark}
          currentUser={auth}
          onOpenListing={handleOpenListing}
          onSearch={() => setTab("search")}
          favIds={favIds}
          onToggleFav={toggleFav}
          onCategorySelect={handleCategorySelect}
          onAddListing={() => setShowAddSheet(true)}
        />
      )}

      {tab === "search" && (
        <Search
          lang={lang} dark={dark}
          onOpenListing={handleOpenListing}
          favIds={favIds}
          onToggleFav={toggleFav}
          initCat={searchCat}
        />
      )}

      {tab === "map" && (
        <MapView
          lang={lang} dark={dark}
          listings={myListings}
          onOpenListing={handleOpenListing}
        />
      )}

      {tab === "messages" && (
        <Messages
          lang={lang} dark={dark}
          currentUser={auth}
          listings={myListings}
        />
      )}

      {tab === "profile" && (
        <Profile
          lang={lang} dark={dark}
          currentUser={auth ? { ...auth, verified: isVerified } : null}
          myListings={myListings}
          favIds={favIds}
          onOpenListing={handleOpenListing}
          onOpenFav={handleOpenListing}
          onAddListing={() => { setShowAddSheet(true); setTab("home"); setTimeout(()=>setTab("profile"),0); }}
          onLogin={(u) => {
            if (!u) { setAuth(null); setIsGuest(false); }
            else handleAuthDone(u);
          }}
          onLangChange={setLang}
          onDarkToggle={() => setDark(p => !p)}
          onStartLive={handleStartLive}
          onVerified={() => {
            setIsVerified(true);
            showToast(
              lang==="uz"
                ? "✅ MyID tasdiqlov muvaffaqiyatli!"
                : "✅ MyID верификация прошла успешно!",
              "success"
            );
          }}
        />
      )}

      {/* ── BOTTOM NAV ── */}
      {!showAddListing && !showLiveBroadcast && (
        <BottomNav
          active={tab}
          onChange={handleTabChange}
          dark={dark}
          lang={lang}
          unread={unreadCount}
        />
      )}
    </div>
  );
}
