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
        if (tab.id === "add") return (
          <div key="add" style={{ flex:1, display:"flex", justifyContent:"center", alignItems:"flex-end" }}>
            <button onClick={() => onChange("add")} style={{
              width:52, height:52, borderRadius:26,
              background:"linear-gradient(135deg,#5B2D8E,#3A1A6E)",
              border:"none", cursor:"pointer", marginBottom:6,
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:"0 4px 18px rgba(91,45,142,0.5)",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
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
            <span style={{ fontSize:10, fontWeight:isActive?700:500, color:isActive?"#5B2D8E":th.sub }}>
              {tab.label}
            </span>
            {isActive && (
              <div style={{ position:"absolute", bottom:-2, left:"50%", transform:"translateX(-50%)", width:20, height:3, borderRadius:2, background:"#5B2D8E" }} />
            )}
            {tab.id==="messages" && unread > 0 && (
              <div style={{ position:"absolute", top:0, right:"20%", width:16, height:16, borderRadius:8, background:"#E74C3C", display:"flex", alignItems:"center", justifyContent:"center", border:`2px solid ${th.card}` }}>
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
  const colors = ["#5B2D8E","#FFB400","#27AE60","#E74C3C","#2980B9","#E67E22"];
  return (
    <div style={{ position:"fixed", inset:0, zIndex:9999, pointerEvents:"none", overflow:"hidden" }}>
      {Array.from({length:24}).map((_,i) => (
        <div key={i} style={{
          position:"absolute", top:-10, left:`${Math.random()*100}%`,
          width:8, height:8, borderRadius:"50%",
          background:colors[i%colors.length],
          animation:`confettiFall ${1+Math.random()}s ${Math.random()*0.5}s ease-in forwards`,
        }} />
      ))}
      <style>{`@keyframes confettiFall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}`}</style>
    </div>
  );
}

// ── TOAST ─────────────────────────────────────────────
function Toast({ msg, type }) {
  if (!msg) return null;
  const bg = type==="success"?"#27AE60":type==="error"?"#E74C3C":"#2980B9";
  return (
    <div style={{
      position:"fixed", top:55, left:"50%", transform:"translateX(-50%)",
      background:bg, color:"#fff", padding:"12px 20px", borderRadius:12,
      fontSize:14, fontWeight:600, zIndex:9998, maxWidth:340, textAlign:"center",
      boxShadow:"0 4px 20px rgba(0,0,0,0.25)",
      animation:"slideDown 0.3s ease",
    }}>
      {msg}
      <style>{`@keyframes slideDown{from{transform:translateX(-50%) translateY(-10px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}`}</style>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────
export default function App() {
  const saved = loadLS();

  const [dark, setDark] = useState(saved?.dark ?? false);
  const [lang, setLang] = useState(saved?.lang ?? "uz");
  const [auth, setAuth] = useState(saved?.auth ?? null); // null=splash
  const [isGuest, setIsGuest] = useState(saved?.isGuest ?? false);
  const [tab, setTab] = useState("home");
  const [selectedListing, setSelectedListing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [myListings, setMyListings] = useState(saved?.myListings ?? []);
  const [favIds, setFavIds] = useState(saved?.favIds ?? []);
  const [toast, setToast] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [searchCat, setSearchCat] = useState("all");

  const th = theme(dark);

  // Persist state
  useEffect(() => {
    saveLS({ dark, lang, auth, isGuest, myListings, favIds });
  }, [dark, lang, auth, isGuest, myListings, favIds]);

  const showToast = (msg, type="success", duration=2500) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), duration);
  };

  const toggleFav = (id) => {
    setFavIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleAuthDone = (userData) => {
    setAuth(userData);
    setIsGuest(false);
    showToast(lang==="uz" ? "Xush kelibsiz! 👋" : "Добро пожаловать! 👋", "success");
  };

  const handleGuest = () => {
    setIsGuest(true);
    setAuth(null);
  };

  const handleTabChange = (t) => {
    if (t === "add") {
      if (!auth && !isGuest) {
        showToast(lang==="uz" ? "E'lon berish uchun kirish kerak" : "Войдите для подачи объявления", "info");
        return;
      }
      setShowAdd(true);
    } else {
      setTab(t);
    }
  };

  const handleAddDone = (listing) => {
    setMyListings(prev => [listing, ...prev]);
    setShowAdd(false);
    setTab("profile");
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2500);
    showToast(T[lang].adPublished, "success");
  };

  const handleOpenListing = (listing) => {
    setSelectedListing(listing);
  };

  const handleChat = (listing) => {
    setSelectedListing(null);
    setTab("messages");
  };

  const handleCategorySelect = (catId) => {
    setSearchCat(catId);
    setTab("search");
  };

  // ── Show Auth screen ──────────────────────────────────
  if (!auth && !isGuest) {
    return (
      <div style={{ maxWidth:430, margin:"0 auto", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" }}>
        <Auth lang={lang} dark={dark} onDone={handleAuthDone} onGuest={handleGuest} />
      </div>
    );
  }

  return (
    <div style={{
      fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
      background:th.bg, minHeight:"100vh", maxWidth:430,
      margin:"0 auto", position:"relative",
    }}>
      <Confetti show={confetti} />
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Add listing overlay */}
      {showAdd && (
        <AddListing lang={lang} dark={dark}
          currentUser={auth}
          onDone={handleAddDone}
          onCancel={() => setShowAdd(false)}
        />
      )}

      {/* Listing detail overlay */}
      {selectedListing && (
        <ListingDetail
          listing={selectedListing} lang={lang} dark={dark}
          currentUser={auth}
          isFav={favIds.includes(selectedListing.id)}
          onToggleFav={toggleFav}
          onBack={() => setSelectedListing(null)}
          onChat={handleChat}
        />
      )}

      {/* Main tabs */}
      {tab === "home" && (
        <Home
          lang={lang} dark={dark}
          onOpenListing={handleOpenListing}
          onSearch={() => setTab("search")}
          favIds={favIds}
          onToggleFav={toggleFav}
          onCategorySelect={handleCategorySelect}
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
          listings={[...myListings]}
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
          currentUser={auth}
          myListings={myListings}
          favIds={favIds}
          onOpenListing={handleOpenListing}
          onOpenFav={handleOpenListing}
          onAddListing={() => setShowAdd(true)}
          onLogin={(u) => {
            if (!u) { setAuth(null); setIsGuest(false); }
            else handleAuthDone(u);
          }}
          onLangChange={setLang}
          onDarkToggle={() => setDark(p => !p)}
        />
      )}

      {/* Bottom nav */}
      <BottomNav
        active={tab}
        onChange={handleTabChange}
        dark={dark}
        lang={lang}
        unread={2}
      />
    </div>
  );
}
