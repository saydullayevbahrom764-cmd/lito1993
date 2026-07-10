import { useState, useEffect } from "react";
import { theme } from "./theme.js";
import { T } from "./translations.js";
import { loadLS, saveLS } from "./utils.js";

// Pages
import Auth          from "./pages/Auth.jsx";
import Home          from "./pages/Home.jsx";
import Search        from "./pages/Search.jsx";
import AddListing    from "./pages/AddListing.jsx";
import Messages      from "./pages/Messages.jsx";
import Profile       from "./pages/Profile.jsx";
import MapView       from "./pages/MapView.jsx";
import ListingDetail from "./pages/ListingDetail.jsx";
import { LiveBroadcaster } from "./pages/LiveStream.jsx";

// Features — ALL 13
import { useAIRecommendations, ForYouSection, TrendingSection } from "./features/AIRecommendations.jsx";
import { PriceOfferModal, MyOffersPage }  from "./features/PriceNegotiation.jsx";
import { SafeDealModal }                  from "./features/SafeDeal.jsx";
import { BoostModal }                     from "./features/BoostPremium.jsx";
// import { AIImageAnalyzer }             from "./features/AIImageAnalysis.jsx";
import { SellerDashboard }                from "./features/SellerDashboard.jsx";
import { NearbySection }                  from "./features/NearbyGPS.jsx";
import { BarterModal }                    from "./features/BarterSystem.jsx";
import { QRModal }                        from "./features/QRCode.jsx";
import MahallaFeed                        from "./features/MahallaFeed.jsx";
import GroupBuyPage                       from "./features/GroupBuy.jsx";
import GroupSellPage, { GroupSellMiniWidget } from "./features/GroupSell.jsx";
import { DeliveryModal }                  from "./features/Delivery.jsx";
import GamificationPage, { XPToast, calcLevel } from "./features/Gamification.jsx";

const G  = "#16A34A";
const GD = "#15803D";

// ── Bottom Nav ────────────────────────────────────────
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
    <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:th.card, borderTop:`1px solid ${th.border}`, display:"flex", alignItems:"flex-end", padding:"8px 0 20px", zIndex:100, boxShadow:"0 -4px 20px rgba(0,0,0,0.08)" }}>
      {tabs.map(tab => {
        const isA = active === tab.id;
        if (tab.id === "add") return (
          <div key="add" style={{ flex:1, display:"flex", justifyContent:"center", alignItems:"flex-end" }}>
            <button onClick={() => onChange("add")} style={{ width:54, height:54, borderRadius:27, background:`linear-gradient(135deg,${G},${GD})`, border:"none", cursor:"pointer", marginBottom:4, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 4px 18px ${G}70` }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
        );
        return (
          <button key={tab.id} onClick={() => onChange(tab.id)} style={{ flex:1, background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"4px 0", position:"relative" }}>
            <span style={{ fontSize:22, lineHeight:1 }}>{tab.icon}</span>
            <span style={{ fontSize:10, fontWeight:isA?700:500, color:isA?G:th.sub }}>{tab.label}</span>
            {isA && <div style={{ position:"absolute", bottom:-2, left:"50%", transform:"translateX(-50%)", width:20, height:3, borderRadius:2, background:G }} />}
            {tab.id==="messages" && unread>0 && (
              <div style={{ position:"absolute", top:0, right:"20%", width:16, height:16, borderRadius:8, background:"#EF4444", display:"flex", alignItems:"center", justifyContent:"center", border:`2px solid ${th.card}` }}>
                <span style={{ fontSize:9, fontWeight:800, color:"#fff" }}>{unread}</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Confetti ──────────────────────────────────────────
function Confetti({ show }) {
  if (!show) return null;
  const colors = [G,"#FFB400","#3B82F6","#EF4444","#8B5CF6","#F59E0B"];
  return (
    <div style={{ position:"fixed", inset:0, zIndex:9999, pointerEvents:"none", overflow:"hidden" }}>
      {Array.from({length:30}).map((_,i)=>(
        <div key={i} style={{ position:"absolute", top:-10, left:`${Math.random()*100}%`, width:Math.random()*8+4, height:Math.random()*8+4, borderRadius:Math.random()>0.5?"50%":"2px", background:colors[i%colors.length], animation:`fall ${1+Math.random()*0.8}s ${Math.random()*0.6}s ease-in forwards` }} />
      ))}
      <style>{`@keyframes fall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}`}</style>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────
function Toast({ msg, type }) {
  if (!msg) return null;
  const bg = type==="success"?G : type==="error"?"#EF4444":"#3B82F6";
  return (
    <div style={{ position:"fixed", top:60, left:"50%", transform:"translateX(-50%)", background:bg, color:"#fff", padding:"12px 20px", borderRadius:12, fontSize:14, fontWeight:600, zIndex:9998, maxWidth:340, textAlign:"center", boxShadow:"0 4px 20px rgba(0,0,0,0.25)", animation:"slideDown 0.3s ease" }}>
      {msg}
      <style>{`@keyframes slideDown{from{transform:translateX(-50%) translateY(-10px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}`}</style>
    </div>
  );
}

// ── AddSheet ──────────────────────────────────────────
function AddSheet({ dark, lang, onClose, onProduct, onLive, isVerified, onGroupSell }) {
  const th = theme(dark);
  const opts = [
    { icon:"📦", label:lang==="uz"?"Mahsulot sotish":"Продать товар",   sub:lang==="uz"?"Yangi yoki ishlatilgan":"Новый или б/у",     color:"#3B82F6", fn:onProduct },
    { icon:"🔧", label:lang==="uz"?"Xizmat ko'rsatish":"Услугу",        sub:lang==="uz"?"Ta'mirlash, tozalash":"Ремонт, уборка",       color:"#8B5CF6", fn:onProduct },
    { icon:"🚗", label:lang==="uz"?"Transport":"Транспорт",              sub:lang==="uz"?"Avtomobil, moto":"Авто, мото",                color:"#F59E0B", fn:onProduct },
    { icon:"🏠", label:lang==="uz"?"Ko'chmas mulk":"Недвижимость",      sub:lang==="uz"?"Sotish yoki ijara":"Продажа / аренда",        color:"#10B981", fn:onProduct },
    { icon:"💼", label:lang==="uz"?"Ish o'rni":"Вакансия",              sub:lang==="uz"?"Xodim izlayman":"Ищу сотрудника",             color:G,         fn:onProduct },
    { icon:"🎥", label:lang==="uz"?"Jonli efir":"Прямой эфир",          sub:lang==="uz"?(isVerified?"Boshlash":"MyID kerak"):(isVerified?"Начать":"Нужна верификация"), color:"#EF4444", fn:onLive },
    { icon:"🤝", label:"GroupSell", sub:lang==="uz"?"Birga olib, birga tejang":"Купим вместе — сэкономим", color:"#6366F1", fn:onGroupSell, isNew:true },
  ];
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:400, background:"rgba(0,0,0,0.55)", display:"flex", alignItems:"flex-end", maxWidth:430, margin:"0 auto" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:th.card, borderRadius:"20px 20px 0 0", width:"100%", paddingBottom:28 }}>
        <div style={{ width:36, height:4, background:th.border, borderRadius:2, margin:"12px auto 0" }} />
        <div style={{ padding:"13px 20px 10px", fontSize:16, fontWeight:800, color:th.text }}>
          {lang==="uz"?"Nima qo'shmoqchisiz?":"Что добавить?"}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, padding:"0 16px" }}>
          {opts.map((o,i)=>(
            <button key={i} onClick={()=>{o.fn();onClose();}} style={{ background:th.card2, border:`1.5px solid ${th.border}`, borderRadius:16, padding:"15px 12px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"flex-start", gap:7, textAlign:"left", position:"relative" }}>
              {o.isNew && <div style={{ position:"absolute", top:-6, right:-6, background:"#EF4444", color:"#fff", fontSize:8, fontWeight:900, padding:"2px 6px", borderRadius:10 }}>NEW</div>}
              <div style={{ width:42, height:42, borderRadius:12, background:o.color+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{o.icon}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:th.text, marginBottom:2 }}>{o.label}</div>
                <div style={{ fontSize:11, color:th.sub }}>{o.sub}</div>
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

  const [dark, setDark]             = useState(saved?.dark ?? false);
  const [lang, setLang]             = useState(saved?.lang ?? "uz");
  const [auth, setAuth]             = useState(saved?.auth ?? null);
  const [isGuest, setIsGuest]       = useState(saved?.isGuest ?? false);
  const [tab, setTab]               = useState("home");
  const [selectedListing, setSL]    = useState(null);
  const [showAddSheet, setAddSheet] = useState(false);
  const [showAddForm, setAddForm]   = useState(false);
  const [showLive, setShowLive]     = useState(false);

  const [myListings, setMyListings] = useState(saved?.myListings   ?? []);
  const [favIds,     setFavIds]     = useState(saved?.favIds       ?? []);
  const [isVerified, setVerified]   = useState(saved?.isVerified   ?? false);
  const [xp,         setXp]         = useState(saved?.xp           ?? 0);
  const [offers,     setOffers]     = useState(saved?.offers       ?? []);
  const [barterOffs, setBarter]     = useState(saved?.barterOffs   ?? []);
  const [boosts,     setBoosts]     = useState(saved?.boosts       ?? {});
  const [viewHist,   setViewHist]   = useState(saved?.viewHist     ?? []);
  const [srchHist,   setSrchHist]   = useState(saved?.srchHist     ?? []);
  const [searchCat,  setSearchCat]  = useState("all");
  const [featurePg,  setFeaturePg]  = useState(null);
  const [viewUser,   setViewUser]   = useState(null);
  const [myGroupSells, setMyGroupSells] = useState([]);

  // Feature modal states
  const [fOffer,    setFOffer]    = useState(null);
  const [fSafeDeal, setFSafeDeal] = useState(null);
  const [fBoost,    setFBoost]    = useState(null);
  const [fBarter,   setFBarter]   = useState(null);
  const [fQR,       setFQR]       = useState(null);
  const [fDelivery, setFDelivery] = useState(null);

  const [toast,     setToast]     = useState(null);
  const [confetti,  setConfetti]  = useState(false);
  const [xpToast,   setXpToast]  = useState(null);

  const th = theme(dark);

  // AI recs
  const { forYou, trending, similar } = useAIRecommendations(viewHist, srchHist, favIds);

  // Persist
  useEffect(() => {
    saveLS({ dark, lang, auth, isGuest, myListings, favIds, isVerified, xp, offers, barterOffs, boosts, viewHist, srchHist });
  }, [dark, lang, auth, isGuest, myListings, favIds, isVerified, xp, offers, barterOffs, boosts]);

  // Helpers
  const addXP = (n, reason) => {
    if (n <= 0) return;
    setXp(p => p + n);
    if (reason) { setXpToast({ xp: n, reason }); setTimeout(() => setXpToast(null), 2500); }
  };
  const showToast = (msg, type = "success", ms = 2800) => {
    setToast({ msg, type }); setTimeout(() => setToast(null), ms);
  };
  const toggleFav = id => setFavIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const openListing = listing => {
    setSL(listing);
    setViewHist(p => [listing.id, ...p.filter(x => x !== listing.id)].slice(0, 20));
    if (!viewHist.includes(listing.id)) addXP(1, "");
  };

  const handleAuthDone = ud => {
    setAuth({ ...ud, uid: "u_" + Date.now() });
    setIsGuest(false);
    addXP(50, lang === "uz" ? "Ro'yxatdan o'tish" : "Регистрация");
    showToast(lang === "uz" ? "Xush kelibsiz! 👋" : "Добро пожаловать! 👋");
  };

  const handleAddDone = listing => {
    setMyListings(p => [listing, ...p]);
    setAddForm(false); setAddSheet(false);
    setTab("profile");
    setConfetti(true); setTimeout(() => setConfetti(false), 2500);
    addXP(50, lang === "uz" ? "Yangi e'lon" : "Новое объявление");
    showToast(T[lang].adPublished);
  };

  const handleStartLive = () => {
    if (!isVerified) {
      showToast(lang === "uz" ? "Avval MyID tasdiqlovidan o'ting" : "Сначала пройдите верификацию", "info");
      setTab("profile"); return;
    }
    setShowLive(true); setAddSheet(false);
  };

  const handleVerified = () => {
    setVerified(true);
    addXP(100, lang === "uz" ? "MyID tasdiqlov" : "Верификация MyID");
    showToast(lang === "uz" ? "✅ MyID muvaffaqiyatli!" : "✅ MyID верификация прошла!");
  };

  const handleTabChange = t => {
    if (t === "add") {
      if (!auth && !isGuest) { showToast(lang === "uz" ? "Kirish kerak" : "Нужно войти", "info"); return; }
      setAddForm(true); return;
    }
    setTab(t);
  };

  // ── AUTH ──────────────────────────────────────────────
  if (!auth && !isGuest) return (
    <div style={{ maxWidth:430, margin:"0 auto" }}>
      <Auth lang={lang} dark={dark} onDone={handleAuthDone} onGuest={() => { setIsGuest(true); setAuth(null); }} onLangChange={setLang} />
    </div>
  );

  // ── Feature pages (full screen) ────────────────────────
  if (featurePg === "dashboard") return (
    <div style={{ maxWidth:430, margin:"0 auto" }}>
      <SellerDashboard lang={lang} dark={dark} myListings={myListings} offers={offers} onBack={() => setFeaturePg(null)} />
    </div>
  );
  if (featurePg === "offers") return (
    <div style={{ maxWidth:430, margin:"0 auto" }}>
      <MyOffersPage lang={lang} dark={dark} offers={offers} listings={myListings}
        onBack={() => setFeaturePg(null)}
        onRespond={(id, status) => setOffers(p => p.map(o => o.id===id ? {...o,status} : o))} />
    </div>
  );
  if (featurePg === "mahalla") return (
    <div style={{ maxWidth:430, margin:"0 auto" }}>
      <MahallaFeed lang={lang} dark={dark} currentUser={auth} onBack={() => setFeaturePg(null)} />
    </div>
  );
  if (featurePg === "groupbuy") return (
    <div style={{ maxWidth:430, margin:"0 auto" }}>
      <GroupBuyPage lang={lang} dark={dark} currentUser={auth} onBack={() => setFeaturePg(null)} />
    </div>
  );
  if (featurePg === "groupsell") return (
    <div style={{ maxWidth:430, margin:"0 auto" }}>
      <GroupSellPage lang={lang} dark={dark} currentUser={auth} myListings={myListings}
        onBack={() => setFeaturePg(null)} />
    </div>
  );
  if (featurePg === "gamification") return (
    <div style={{ maxWidth:430, margin:"0 auto" }}>
      <GamificationPage lang={lang} dark={dark} onBack={() => setFeaturePg(null)}
        stats={{ listings:myListings.length, verified:isVerified, avgReplyMin:4,
          deals:offers.filter(o=>o.status==="accepted").length,
          totalViews:myListings.reduce((s,l)=>s+(l.views||0),0),
          monthDeals:3, fiveStars:2, streams:0,
          negotiations:offers.length, barters:barterOffs.length }}
        xp={xp} />
    </div>
  );

  // ── Main shell ─────────────────────────────────────────
  return (
    <div style={{ fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif", background:th.bg, minHeight:"100vh", maxWidth:430, margin:"0 auto", position:"relative" }}>
      <Confetti show={confetti} />
      {toast    && <Toast msg={toast.msg} type={toast.type} />}
      {xpToast  && <XPToast xp={xpToast.xp} reason={xpToast.reason} onHide={() => setXpToast(null)} />}

      {/* AddListing form */}
      {showAddForm && (
        <AddListing lang={lang} dark={dark} currentUser={auth}
          onDone={handleAddDone}
          onCancel={() => { setAddForm(false); setAddSheet(false); }}
          onLive={() => { setAddForm(false); setAddSheet(false); handleStartLive(); }} />
      )}

      {/* Live Broadcast */}
      {showLive && (
        <LiveBroadcaster lang={lang} dark={dark} currentUser={auth} myListings={myListings}
          onClose={() => { setShowLive(false); addXP(150, "Live Stream"); }} />
      )}

      {/* Listing Detail — with ALL 13 feature props */}
      {selectedListing && !showAddForm && (
        <ListingDetail
          listing={selectedListing} lang={lang} dark={dark} currentUser={auth}
          isFav={favIds.includes(selectedListing.id)} onToggleFav={toggleFav}
          onBack={() => setSL(null)}
          onChat={() => { setSL(null); setTab("messages"); }}
          onOffer={()    => setFOffer(selectedListing)}
          onSafeDeal={() => setFSafeDeal(selectedListing)}
          onBarter={()   => setFBarter(selectedListing)}
          onQR={()       => setFQR(selectedListing)}
          onDelivery={() => setFDelivery(selectedListing)}
          onBoost={()    => setFBoost(selectedListing)}
          similar={similar[selectedListing?.id] || []}
          onOpenSimilar={openListing}
          boostInfo={boosts[selectedListing?.id]}
          onViewSeller={seller => {
            setSL(null);
            setViewUser(seller);
            setTab("profile");
          }}
        />
      )}

      {/* Feature Modals */}
      {fOffer && (
        <PriceOfferModal listing={fOffer} lang={lang} dark={dark} currentUser={auth}
          onClose={() => setFOffer(null)}
          onSend={offer => {
            setOffers(p => [offer, ...p]);
            addXP(10, lang==="uz"?"Narx taklifi":"Предложение цены");
            showToast(lang==="uz"?"🤝 Taklif yuborildi!":"🤝 Предложение отправлено!");
          }} />
      )}
      {fSafeDeal && (
        <SafeDealModal listing={fSafeDeal} lang={lang} dark={dark} currentUser={auth}
          onClose={() => setFSafeDeal(null)}
          onSuccess={() => { addXP(25,"Safe Deal"); showToast(lang==="uz"?"🔒 Xavfsiz bitim boshlandi!":"🔒 Сделка начата!"); }} />
      )}
      {fBoost && (
        <BoostModal listing={fBoost} lang={lang} dark={dark}
          onClose={() => setFBoost(null)}
          onBoost={b => {
            setBoosts(p => ({ ...p, [b.listingId]: b }));
            addXP(30, "Boost");
            showToast(lang==="uz"?"🚀 Boost faollashtirildi!":"🚀 Буст активирован!");
            setConfetti(true); setTimeout(() => setConfetti(false), 2000);
          }} />
      )}
      {fBarter && (
        <BarterModal listing={fBarter} lang={lang} dark={dark} currentUser={auth} myListings={myListings}
          onClose={() => setFBarter(null)}
          onSend={offer => {
            setBarter(p => [offer, ...p]);
            addXP(15, lang==="uz"?"Barter taklifi":"Предложение обмена");
            showToast(lang==="uz"?"🔄 Barter taklifi yuborildi!":"🔄 Предложение обмена отправлено!");
          }} />
      )}
      {fQR && (
        <QRModal listing={fQR} lang={lang} dark={dark} onClose={() => setFQR(null)} />
      )}
      {fDelivery && (
        <DeliveryModal listing={fDelivery} lang={lang} dark={dark} currentUser={auth}
          onClose={() => setFDelivery(null)}
          onOrder={() => {
            addXP(20, lang==="uz"?"Yetkazib berish":"Доставка");
            showToast(lang==="uz"?"🚚 Buyurtma qabul qilindi!":"🚚 Заказ принят!");
          }} />
      )}

      {/* TABS */}
      {tab === "home" && (
        <HomeFull lang={lang} dark={dark} currentUser={auth}
          onOpenListing={openListing}
          onSearch={() => setTab("search")}
          favIds={favIds} onToggleFav={toggleFav}
          onCategorySelect={c => { setSearchCat(c); setTab("search"); }}
          onAddListing={() => setAddForm(true)}
          forYou={forYou} trending={trending}
          myListings={myListings}
          onFeature={setFeaturePg}
          xp={xp}
        />
      )}
      {tab === "search" && (
        <Search lang={lang} dark={dark} onOpenListing={openListing}
          favIds={favIds} onToggleFav={toggleFav} initCat={searchCat} />
      )}
      {tab === "map" && (
        <MapView lang={lang} dark={dark} listings={myListings} onOpenListing={openListing} />
      )}
      {tab === "messages" && (
        <Messages lang={lang} dark={dark} currentUser={auth} listings={myListings} />
      )}
      {tab === "profile" && (
        <Profile
          lang={lang} dark={dark}
          currentUser={auth ? { ...auth, verified: isVerified } : null}
          myListings={myListings} favIds={favIds}
          onOpenListing={openListing} onOpenFav={openListing}
          onAddListing={() => setAddSheet(true)}
          onLogin={u => { if (!u) { setAuth(null); setIsGuest(false); } else handleAuthDone(u); }}
          onLangChange={setLang} onDarkToggle={() => setDark(p => !p)}
          onStartLive={handleStartLive}
          onVerified={handleVerified}
          onDashboard={()    => setFeaturePg("dashboard")}
          onOffers={()       => setFeaturePg("offers")}
          onMahalla={()      => setFeaturePg("mahalla")}
          onGroupBuy={()     => setFeaturePg("groupbuy")}
          onGamification={() => setFeaturePg("gamification")}
          onGroupSell={()    => setFeaturePg("groupsell")}
          xp={xp}
          viewUser={viewUser}
          onCloseUserProfile={() => setViewUser(null)}
        />
      )}

      {!showAddForm && !showLive && (
        <BottomNav active={tab} onChange={handleTabChange} dark={dark} lang={lang} unread={2} />
      )}
    </div>
  );
}

// ── Home + AI sektsiyalar + NearbySection + quicklinks ──
function HomeFull({ lang, dark, currentUser, onOpenListing, onSearch, favIds, onToggleFav,
  onCategorySelect, onAddListing, forYou, trending, myListings, onFeature, xp }) {
  const th = theme(dark);
  const lvl = calcLevel(xp);

  return (
    <div style={{ background:th.bg, minHeight:"100vh", paddingBottom:80 }}>
      {/* Asosiy Home */}
      <Home lang={lang} dark={dark} currentUser={currentUser}
        onOpenListing={onOpenListing} onSearch={onSearch}
        favIds={favIds} onToggleFav={onToggleFav}
        onCategorySelect={onCategorySelect} onAddListing={onAddListing} />

      {/* 1. AI — Siz uchun */}
      <ForYouSection lang={lang} dark={dark} items={forYou}
        onOpen={onOpenListing} onToggleFav={onToggleFav} favIds={favIds} />

      {/* 2. AI — Trendda */}
      <TrendingSection lang={lang} dark={dark} items={trending} onOpen={onOpenListing} />

      {/* 3. GPS Yaqin atrofda */}
      <NearbySection lang={lang} dark={dark} listings={myListings}
        onOpen={onOpenListing} onToggleFav={onToggleFav} favIds={favIds} />

      {/* 4. Feature quicklinks */}
      <div style={{ padding:"8px 16px 20px" }}>
        <div style={{ fontSize:14, fontWeight:700, color:th.text, marginBottom:12 }}>
          ✨ {lang==="uz"?"Maxsus funksiyalar":"Специальные функции"}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {[
            { icon:"🏘️", label:lang==="uz"?"Mahalla":"Махалля",       sub:lang==="uz"?"Lokal jamiyat":"Местное сообщество",    color:"#10B981", page:"mahalla" },
            { icon:"🤝", label:lang==="uz"?"Birga olamiz":"Купим вместе", sub:lang==="uz"?"Ulgurji narxda":"По оптовой цене",  color:"#3B82F6", page:"groupbuy" },
            { icon:"📊", label:lang==="uz"?"Dashboard":"Дашборд",      sub:lang==="uz"?"Statistikam":"Моя статистика",          color:"#8B5CF6", page:"dashboard" },
            { icon:"🏆", label:lang==="uz"?"Reyting":"Рейтинг",        sub:`Level ${lvl.level} · ${xp} XP`,                    color:"#F59E0B", page:"gamification" },
            { icon:"🤝", label:"GroupSell", sub:lang==="uz"?"Birga tejaymiz":"Экономим вместе", color:"#6366F1", page:"groupsell", isNew:true },
          ].map((f,i) => (
            <button key={i} onClick={() => onFeature(f.page)} style={{
              background:th.card, border:`1px solid ${f.isNew?"#6366F1":th.border}`, borderRadius:14,
              padding:"13px 12px", cursor:"pointer",
              display:"flex", alignItems:"center", gap:10, textAlign:"left",
              position:"relative",
            }}>
              {f.isNew && <div style={{ position:"absolute", top:-6, right:-6, background:"#EF4444",
                color:"#fff", fontSize:8, fontWeight:900, padding:"2px 6px", borderRadius:10 }}>NEW</div>}
              <div style={{ width:40, height:40, borderRadius:12, background:f.color+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                {f.icon}
              </div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:th.text }}>{f.label}</div>
                <div style={{ fontSize:11, color:th.sub, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
